import axios from "axios";
import { getApiCredentials } from "./auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_RAG_CHAT_API_URL || "/api/rag/messages",
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});
api.interceptors.request.use((config) => {
  config.auth = getApiCredentials() || undefined;
  return config;
});

export async function sendChatMessage(message, conversationId = null) {
  const trimmedMessage = message.trim();
  if (!trimmedMessage) throw new Error("Enter a message before sending it.");

  const response = await api.post("", {
    conversationId,
    message: trimmedMessage,
  });
  const data = response.data;

  if (typeof data?.answer !== "string" || !data.answer.trim()) {
    throw new Error("The assistant service returned an invalid response. Check that the configured endpoint is the Tomo RAG messages endpoint.");
  }

  return {
    conversationId: data.conversationId ?? conversationId,
    answer: data.answer.trim(),
  };
}
