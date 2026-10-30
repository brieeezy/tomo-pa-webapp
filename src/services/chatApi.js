import axios from "axios";
import { getApiCredentials } from "./auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_RAG_CHAT_API_URL || "/api/rag/messages",
  headers: { "Content-Type": "application/json" },
});
api.interceptors.request.use((config) => {
  config.auth = getApiCredentials() || undefined;
  return config;
});

const knowledgeBaseIds = (
  import.meta.env.VITE_RAG_KNOWLEDGE_BASE_IDS || "1"
)
  .split(",")
  .map((id) => Number(id.trim()))
  .filter((id) => Number.isInteger(id) && id > 0);

export async function sendChatMessage(message, conversationId = null) {
  const response = await api.post("", {
    conversationId,
    message,
    knowledgeBaseIds,
  });
  const data = response.data;

  if (typeof data?.answer !== "string" || !data.answer.trim()) {
    throw new Error("The chat service returned an empty response.");
  }

  return data;
}
