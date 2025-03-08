// app/api/tools/robotipa-agente-web/template/condense.ts
export const CONDENSE_QUESTION_TEMPLATE = `
Given the following conversation and a follow-up question, rephrase the follow-up question to be a standalone question, in its original language.

<chat_history>
  {chat_history}
</chat_history>

Follow Up Input: {question}
Standalone question:`
