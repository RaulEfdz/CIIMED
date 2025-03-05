import { PromptTemplate } from "@langchain/core/prompts";
import { CONDENSE_QUESTION_TEMPLATE } from "./template/condense";
import { ANSWER_TEMPLATE } from "./template/answer";


export const condenseQuestionPrompt = PromptTemplate.fromTemplate(CONDENSE_QUESTION_TEMPLATE );

export const answerPrompt = PromptTemplate.fromTemplate(ANSWER_TEMPLATE);