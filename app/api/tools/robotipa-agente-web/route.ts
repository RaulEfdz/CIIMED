import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createChains, formatVercelMessages } from "./logic";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = body.messages ?? [];
    const previousMessages = messages.slice(0, -1);
    const currentMessageContent = messages[messages.length - 1]?.content || "";

    console.log("Received messages", messages);
    console.log("Previous messages", previousMessages);
    console.log("Current message", currentMessageContent);

    const model = new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0.2 });
    const client = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PRIVATE_KEY!
    );
    const vectorstore = new SupabaseVectorStore(new OpenAIEmbeddings(), {
      client,
      tableName: "documents",
      queryName: "match_documents",
    });

    const { conversationalRetrievalQAChain, documentPromise } = createChains(model, vectorstore);

    const stream = await conversationalRetrievalQAChain.stream({
      question: currentMessageContent,
      chat_history: formatVercelMessages(previousMessages),
    });

    const readableStream = new ReadableStream({
      start(controller) {
        (async () => {
          for await (const chunk of stream) {
            if (typeof chunk === "string" || chunk instanceof Buffer || chunk instanceof Uint8Array) {
              controller.enqueue(chunk);
            } else if (chunk?.content) {
              controller.enqueue(chunk.content);
            }
          }
          controller.close();
        })().catch((err) => controller.error(err));
      },
    });

    const documents = await documentPromise;
    const serializedSources = Buffer.from(
      JSON.stringify(
        documents.map((doc) => ({
          pageContent: doc.pageContent.slice(0, 50) + "...",
          metadata: doc.metadata,
        }))
      )
    ).toString("base64");

    return new Response(readableStream, {
      headers: {
        "x-message-index": (previousMessages.length + 1).toString(),
        "x-sources": serializedSources,
      },
    });
  } catch (e: unknown) {
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
