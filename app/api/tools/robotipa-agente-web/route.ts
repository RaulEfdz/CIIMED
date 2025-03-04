
import { NextRequest, NextResponse } from "next/server";
import { Message as VercelChatMessage } from "ai"; // StreamData eliminado de la importación
import { createClient } from "@supabase/supabase-js";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { Document } from "@langchain/core/documents";
import { RunnableSequence } from "@langchain/core/runnables";
import { BytesOutputParser, StringOutputParser } from "@langchain/core/output_parsers";

export const runtime = "edge";

const combineDocumentsFn = (docs: Document[]) => {
  return docs.map((doc) => doc.pageContent).join("\n\n");
};

const formatVercelMessages = (chatHistory: VercelChatMessage[]) => {
  return chatHistory
    .map((message) => {
      if (message.role === "user") return `Human: ${message.content}`;
      if (message.role === "assistant") return `Assistant: ${message.content}`;
      return `${message.role}: ${message.content}`;
    })
    .join("\n");
};

const CONDENSE_QUESTION_TEMPLATE = `Given the following conversation and a follow-up question, rephrase the follow-up question to be a standalone question, in its original language.

<chat_history>
  {chat_history}
</chat_history>

Follow Up Input: {question}
Standalone question:`;
const condenseQuestionPrompt = PromptTemplate.fromTemplate(CONDENSE_QUESTION_TEMPLATE);

const ANSWER_TEMPLATE = `You are a knowledgeable and professional assistant with expertise in scientific topics and excellent communication skills. Answer the question based only on the following context and chat history:

<context>
  {context}
</context>

<chat_history>
  {chat_history}
</chat_history>

Question: {question}

Provide a well-structured response. If the answer is not in the given context, state that you do not have enough information.`;
const answerPrompt = PromptTemplate.fromTemplate(ANSWER_TEMPLATE);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = body.messages ?? [];
    const previousMessages = messages.slice(0, -1);
    const currentMessageContent = messages[messages.length - 1].content;

    const model = new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0.2 });

    const client = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PRIVATE_KEY!,
    );
    const vectorstore = new SupabaseVectorStore(new OpenAIEmbeddings(), {
      client,
      tableName: "documents",
      queryName: "match_documents",
    });

    const standaloneQuestionChain = RunnableSequence.from([
      condenseQuestionPrompt,
      model,
      new StringOutputParser(),
    ]);

    let resolveWithDocuments: (value: Document[]) => void;
    const documentPromise = new Promise<Document[]>((resolve) => {
      resolveWithDocuments = resolve;
    });

    const retriever = vectorstore.asRetriever({
      callbacks: [
        {
          handleRetrieverEnd(documents) {
            resolveWithDocuments(documents);
          },
        },
      ],
    });

    const retrievalChain = retriever.pipe(combineDocumentsFn);

    const answerChain = RunnableSequence.from([
      {
        context: RunnableSequence.from([
          (input) => input.question,
          retrievalChain,
        ]),
        chat_history: (input) => input.chat_history,
        question: (input) => input.question,
      },
      answerPrompt,
      model,
    ]);

    const conversationalRetrievalQAChain = RunnableSequence.from([
      {
        question: standaloneQuestionChain,
        chat_history: (input) => input.chat_history,
      },
      answerChain,
      new BytesOutputParser(),
    ]);

    const stream = await conversationalRetrievalQAChain.stream({
      question: currentMessageContent,
      chat_history: formatVercelMessages(previousMessages),
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


    return new Response(stream, { // Usando directamente Response y el stream original
      headers: {
        "x-message-index": (previousMessages.length + 1).toString(),
        "x-sources": serializedSources, // Metadatos en cabeceras
      },
    });

  } catch (e: unknown) {
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}