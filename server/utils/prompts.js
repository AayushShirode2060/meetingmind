/**
 * Builds the summarization prompt for Gemini
 * @param {string} transcript - The raw meeting transcript
 * @returns {string} The complete prompt
 */
const getSummarizationPrompt = (transcript) => {
  return `You are an expert meeting analyst. Analyze the following meeting transcript and extract structured information.
TRANSCRIPT:
${transcript}
Return a JSON object with exactly these keys:
{
  "summary": "A concise executive summary of the meeting in 3-5 sentences. Cover the main topics discussed, overall outcome, and any notable context.",
  "keyDecisions": ["Decision 1", "Decision 2"],
  "actionItems": [
    { "task": "Description of the task", "owner": "Person name or Unassigned", "deadline": "Date or Not specified" }
  ],
  "deadlines": [
    { "item": "What is due", "date": "When it is due" }
  ],
  "risks": ["Risk or open question 1", "Risk or open question 2"],
  "followUpEmail": "A professional follow-up email summarizing the meeting. Include: greeting, summary paragraph, decisions list, action items with owners, deadlines, and a closing. Use proper email formatting with line breaks."
}
Rules:
- Extract ONLY information explicitly stated or clearly implied in the transcript.
- If a category has no relevant data, return an empty array [].
- For action items, identify the owner from speaker context. Use "Unassigned" only if truly unclear.
- For deadlines, capture both explicit dates ("by March 15") and relative timeframes ("by end of week", "next Monday").
- Risks should include: tasks without clear owners, pending approvals, unresolved disagreements, blocked items, and any open questions raised but not answered.
- The follow-up email should be professional, well-structured, and ready to send.
- Return ONLY valid JSON. No markdown fences, no explanation, no text before or after the JSON.`;
};
/**
 * Builds the chat prompt for asking questions about a meeting
 * @param {string} transcript - The raw meeting transcript
 * @param {string} summary - The AI-generated summary
 * @param {Array} chatHistory - Previous chat messages [{role, content}]
 * @param {string} question - The user's question
 * @returns {string} The complete prompt
 */
const getChatPrompt = (transcript, summary, chatHistory, question) => {
  // Format chat history for context
  const historyText = chatHistory.length > 0
    ? chatHistory
        .slice(-10) // Keep last 10 messages for context window management
        .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
        .join('\n')
    : 'No previous conversation.';
  return `You are an AI assistant that answers questions about a specific meeting. You must ONLY use information from the meeting transcript and summary provided below. Do not make up or infer information that isn't present.
MEETING TRANSCRIPT:
${transcript}
MEETING SUMMARY:
${summary}
PREVIOUS CONVERSATION:
${historyText}
USER QUESTION:
${question}
Rules:
- Answer concisely and accurately based solely on the meeting content.
- If the information is not in the transcript, respond: "This was not discussed in the meeting."
- If asked about a specific person, search for their name or speaker label in the transcript.
- Reference specific parts of the discussion when relevant.
- Keep answers focused and practical.`;
};
module.exports = {
  getSummarizationPrompt,
  getChatPrompt
};