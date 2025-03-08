
// app/api/tools/robotipa-agente-web/logic.ts
import { Document } from "@langchain/core/documents";
import { Message as VercelChatMessage } from "ai";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { condenseQuestionPrompt, answerPrompt } from "./prompts";
import { ChatOpenAI } from "@langchain/openai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";

/** Combina el contenido de múltiples documentos */
export const combineDocumentsFn = (docs: Document[]): string =>
  docs.map((doc) => doc.pageContent).join("\n\n");

/** Formatea el historial de mensajes al estilo esperado */
export const formatVercelMessages = (chatHistory: VercelChatMessage[]): string =>
  chatHistory
    .map(({ role, content }) => `${role === "user" ? "Human" : "Assistant"}: ${content}`)
    .join("\n");

/** Crea y configura las "chains" utilizadas para el procesamiento de la conversación */
export function createChains(model: ChatOpenAI, vectorstore: SupabaseVectorStore) {
  const standaloneQuestionChain = RunnableSequence.from([
    condenseQuestionPrompt,
    model,
    new StringOutputParser(),
  ]);

  let resolveWithDocuments: (value: Document[]) => void;
  const documentPromise = new Promise<Document[]>((resolve) => {
    resolveWithDocuments = resolve;
  });

  // Configuración del retriever con `vectorstore`
  const retriever = vectorstore.asRetriever({
    k: 3,
    filter: { category: "general_info" },
    callbacks: [
      {
        handleRetrieverEnd: (documents: Document[]) => {
          resolveWithDocuments(documents);
        },
      },
    ],
  });

  const retrievalChain = retriever.pipe(combineDocumentsFn);

  // Cadena que maneja la generación de respuestas
  const answerChain = RunnableSequence.from([
    {
      context: RunnableSequence.from([(input) => input.question, retrievalChain]),
      chat_history: (input) => input.chat_history,
      question: (input) => input.question,
    },
    answerPrompt,
    model,
  ]);

  // Cadena de conversación que maneja historial y respuesta
  const conversationalRetrievalQAChain = RunnableSequence.from([
    {
      question: standaloneQuestionChain,
      chat_history: (input) => input.chat_history,
    },
    answerChain,
  ]);

  return { conversationalRetrievalQAChain, documentPromise };
}
