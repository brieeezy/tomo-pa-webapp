import axios from "axios";
import { getApiCredentials } from "./auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_TOMO_API_ORIGIN + "/rag/messages",
  headers: { "Content-Type": "application/json" },
  timeout: 10000000,
});
api.interceptors.request.use((config) => {
  config.auth = getApiCredentials() || undefined;
  return config;
});

const conversationsApi = axios.create({
  baseURL: import.meta.env.VITE_TOMO_API_ORIGIN + "/conversations",
  headers: { "Content-Type": "application/json" },
  timeout: 10000000,
});
conversationsApi.interceptors.request.use((config) => {
  config.auth = getApiCredentials() || undefined;
  return config;
});

export async function sendChatMessage(message, conversationId = null) {
  const trimmedMessage = message.trim();
  if (!trimmedMessage) throw new Error("Enter a message before sending it.");

  const response = await api.post("", {
    conversationId,
    message: trimmedMessage,
    timeout: 10000000, 
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

export async function getConversations() {
  const response = await conversationsApi.get("");
  if (!Array.isArray(response.data)) {
    throw new Error("The conversation service returned an invalid conversation list.");
  }
  return response.data;
}

function normalizeConversationMessage(message) {
  const content = message.content ?? message.message ?? message.text;
  const rawRole =
    message.role ?? message.sender ?? message.messageType ?? message.type;
  const normalizedRole =
    typeof rawRole === "string" ? rawRole.toLowerCase() : "";
  const role =
    message.isUser === true ||
    ["user", "human"].includes(normalizedRole)
      ? "user"
      : message.isUser === false ||
          ["assistant", "ai", "bot"].includes(normalizedRole)
        ? "assistant"
        : null;

  if (typeof content !== "string" || !role) {
    throw new Error("The conversation service returned a message with an invalid format.");
  }

  return { role, content };
}

export async function getConversationMessages(conversationId) {
  const response = await conversationsApi.get(
    `/${encodeURIComponent(conversationId)}/messages`,
  );
  if (!Array.isArray(response.data)) {
    throw new Error("The conversation service returned an invalid message history.");
  }
  return response.data.map(normalizeConversationMessage).reverse();
}
