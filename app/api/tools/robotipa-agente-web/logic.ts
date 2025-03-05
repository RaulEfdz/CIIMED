import { Document } from "@langchain/core/documents";
import { Message as VercelChatMessage } from "ai";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser, BytesOutputParser } from "@langchain/core/output_parsers";
import { condenseQuestionPrompt, answerPrompt } from "./prompts";
import { ChatOpenAI } from "@langchain/openai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";

/** Función para combinar el contenido de múltiples documentos */
export const combineDocumentsFn = (docs: Document[]) => {
  return docs.map((doc) => doc.pageContent).join("\n\n");
};

/** Función para formatear el historial de mensajes al estilo Vercel */
export const formatVercelMessages = (chatHistory: VercelChatMessage[]) => {
  return chatHistory
    .map((message) => {
      if (message.role === "user") return `Human: ${message.content}`;
      if (message.role === "assistant") return `Assistant: ${message.content}`;
      return `${message.role}: ${message.content}`;
    })
    .join("\n");
};

/** 
 * Crea y configura las "chains" utilizadas para el procesamiento de la conversación.
 * Devuelve la cadena principal y una promesa que se resuelve con los documentos recuperados.
 */
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

//   const retriever = vectorstore.asRetriever({
//     callbacks: [
//       {
//         handleRetrieverEnd(documents) {
//           resolveWithDocuments(documents);
//         },
//       },
//     ],
//   });

const retriever = vectorstore.asRetriever({
    k: 3, // Trae al menos 3 documentos relevantes
    filter: { category: "general_info" }, // Si usas categorías en los documentos, puedes filtrar
    callbacks: [
      {
        handleRetrieverEnd(documents) {
          if (documents.length === 0) {
            console.warn("No se encontraron documentos relevantes.");
          }
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

  return {
    conversationalRetrievalQAChain,
    documentPromise,
  };
}
