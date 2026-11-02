import { useEffect, useRef, useState } from "react";
import {
  ActionIcon,
  Group,
  Paper,
  ScrollArea,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import {
  IconHistory,
  IconMessagePlus,
  IconPaw,
} from "@tabler/icons-react";
import {
  getConversationMessages,
  getConversations,
  sendChatMessage,
} from "../services/chatApi";
import { getApiCredentials } from "../services/auth";
import tomoLogo from "../assets/tomo-logo.svg";
import AIMessage from "../components/AIMessage";
import ThinkingIndicator from "../components/ThinkingIndicator";

const welcomeMessage = {
  role: "assistant",
  content: "Hi! I’m Tomo’s assistant. What can I help you find?",
};

function getHistoryStorageKey() {
  const username = getApiCredentials()?.username || "guest";
  return `tomo-chat-history:${encodeURIComponent(username)}`;
}

function getConversationId(conversation) {
  return conversation.id ?? conversation.conversationId;
}

function getConversationLabel(conversation) {
  const title = conversation.title || conversation.name || conversation.subject;
  return title || `Conversation ${getConversationId(conversation)}`;
}

function getConversationErrorMessage(error, fallback) {
  const status = error.response?.status;
  const responseData = error.response?.data;
  const detail =
    typeof responseData?.message === "string"
      ? responseData.message
      : typeof responseData?.error === "string"
        ? responseData.error
        : null;

  if (status === 401 || status === 403) {
    return `The conversation service rejected authentication (${status}). Sign out and sign in again.`;
  }
  if (detail) return detail;
  if (status) return `${fallback} (HTTP ${status}).`;
  if (error.message?.includes("invalid")) {
    return `${fallback} ${error.message}`;
  }
  return fallback;
}

function loadHistory(storageKey) {
  try {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return { conversationId: null, messages: [welcomeMessage] };

    const history = JSON.parse(saved);
    const validMessages =
      Array.isArray(history.messages) &&
      history.messages.every(
        (message) =>
          ["assistant", "user", "error"].includes(message.role) &&
          typeof message.content === "string",
      );
    if (
      !validMessages ||
      (history.conversationId !== null &&
        !["string", "number"].includes(typeof history.conversationId))
    ) {
      throw new Error("Saved chat history has an invalid format.");
    }

    return {
      conversationId: history.conversationId,
      messages: history.messages.length ? history.messages : [welcomeMessage],
    };
  } catch (error) {
    console.error("Could not load chat history:", error);
    return { conversationId: null, messages: [welcomeMessage] };
  }
}

export default function ChatWidget() {
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [open, setOpen] = useState(true);
  const [storageKey] = useState(getHistoryStorageKey);
  const [history, setHistory] = useState(() => loadHistory(storageKey));
  const { conversationId, messages } = history;
  const [historyError, setHistoryError] = useState("");
  const [conversations, setConversations] = useState([]);
  const [conversationsLoading, setConversationsLoading] = useState(false);
  const [conversationsError, setConversationsError] = useState("");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [loadingConversationId, setLoadingConversationId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [retryMessage, setRetryMessage] = useState(null);
  const [sidebarWidth, setSidebarWidth] = useState(380);
  const isResizing = useRef(false);

  const MIN_WIDTH = 300;
  const MAX_WIDTH = 650;

  function startResizing(event) {
    event.preventDefault();
    isResizing.current = true;
  }

  useEffect(() => {
    function handleMouseMove(event) {
      if (!isResizing.current) return;

      const newWidth = window.innerWidth - event.clientX;

      setSidebarWidth(
        Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, newWidth)),
      );
    }

    function handleMouseUp() {
      isResizing.current = false;
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);



  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    let active = true;
    setConversationsLoading(true);
    getConversations()
      .then((items) => {
        if (active) {
          setConversations(items);
          setConversationsError("");
        }
      })
      .catch((error) => {
        console.error("Could not load conversations:", error);
        if (active) {
          setConversationsError(
            getConversationErrorMessage(
              error,
              "Conversation history could not be loaded.",
            ),
          );
        }
      })
      .finally(() => {
        if (active) setConversationsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        storageKey,
        JSON.stringify({ conversationId, messages }),
      );
    } catch (error) {
      console.error("Could not save chat history:", error);
      setHistoryError("Chat history could not be saved in this browser.");
    }
  }, [conversationId, messages, storageKey]);

  function clearHistory() {
    if (sending) return;
    setHistory({ conversationId: null, messages: [welcomeMessage] });
    setInput("");
    setRetryMessage(null);
    setHistoryError("");
    setHistoryOpen(false);
  }

  async function showConversationHistory() {
    setHistoryOpen(true);
    setConversationsLoading(true);
    setConversationsError("");
    try {
      setConversations(await getConversations());
    } catch (error) {
      console.error("Could not refresh conversations:", error);
      setConversationsError(
        getConversationErrorMessage(
          error,
          "Conversation history could not be loaded.",
        ),
      );
    } finally {
      setConversationsLoading(false);
    }
  }

  async function selectConversation(conversation) {
    const id = getConversationId(conversation);
    if (id == null || sending || loadingConversationId !== null) return;

    setLoadingConversationId(id);
    setHistoryError("");
    try {
      const loadedMessages = await getConversationMessages(id);
      setHistory({
        conversationId: id,
        messages: loadedMessages.length ? loadedMessages : [welcomeMessage],
      });
      setInput("");
      setHistoryOpen(false);
      setConversationsError("");
      setRetryMessage(null);
    } catch (error) {
      console.error("Could not load conversation messages:", error);
      setConversationsError(
        getConversationErrorMessage(
          error,
          "Could not load this conversation. Please try again.",
        ),
      );
    } finally {
      setLoadingConversationId(null);
    }
  }

  async function sendMessage(event) {
    event.preventDefault();
    const content = input.trim();
    if (!content || sending) return;

    setHistoryOpen(false);
    setHistory((current) => ({
      ...current,
      messages: [...current.messages, { role: "user", content }],
    }));
    setInput("");
    setSending(true);
    setRetryMessage(null);

    try {
      const response = await sendChatMessage(content, conversationId);
      setHistory((current) => ({
        conversationId: response.conversationId,
        messages: [
          ...current.messages,
          { role: "assistant", content: response.answer },
        ],
      }));
      try {
        setConversations(await getConversations());
        setConversationsError("");
      } catch (error) {
        console.error("Could not refresh conversations:", error);
        setConversationsError(
          getConversationErrorMessage(
            error,
            "Conversation history could not be refreshed.",
          ),
        );
      }
    } catch (error) {
      setRetryMessage(content);
      const responseData = error.response?.data;
      const detail =
        typeof responseData?.message === "string"
          ? responseData.message
          : typeof responseData?.error === "string"
            ? responseData.error
            : null;
      const status = error.response?.status;
      const failureMessage =
        status === 401 || status === 403
          ? "The assistant rejected your sign-in. Sign out and sign in again, then retry."
          : status
            ? `The assistant request failed (${status}). Check the chat service and try again.`
            : error.code === "ECONNABORTED"
              ? "The assistant took too long to respond. Please retry."
              : error.message?.includes("knowledge-base IDs") ||
                  error.message?.includes("configured endpoint")
                ? error.message
                : "I couldn’t reach the assistant. Check your connection and try again.";
      setHistory((current) => ({
        ...current,
        messages: [
          ...current.messages,
          { role: "error", content: detail || failureMessage },
        ],
      }));
      console.error("Chat request failed:", error);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  }

  async function retryLastMessage() {
    if (!retryMessage || sending) return;
    setHistory((current) => ({
      ...current,
      messages: current.messages.filter((message) => message.role !== "error"),
    }));
    setInput(retryMessage);
    requestAnimationFrame(() => inputRef.current?.form?.requestSubmit());
  }

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="tomo-chathead-launcher"
          aria-label="Open Tomo assistant"
        >
          <img src={tomoLogo} alt="" />
          <span className="tomo-chathead-status" />
        </button>
      )}
      {open && (
        <aside
          className="sticky top-0 flex h-screen shrink-0 border-l border-[#eee5da] bg-white"
          aria-label="Tomo.AI assistant sidebar"
          style={{
            width: `${sidebarWidth}px`,
            minWidth: `${MIN_WIDTH}px`,
            maxWidth: `${MAX_WIDTH}px`,
            flex: `0 0 ${sidebarWidth}px`,
          }}
        >
          <div
            className="tomo-resize-handle"
            onMouseDown={startResizing}
            title="Drag to resize sidebar"
          />
          <Paper
            className="flex h-full min-h-0 w-full flex-1 flex-col rounded-none border-0"
            component="section"
            aria-label="Chat with Tomo.AI assistant"
          >
            <Group
              className="shrink-0 border-b border-[#eee5da]"
              wrap="nowrap"
              p="md"
              gap="sm"
            >
              <img src={tomoLogo} alt="Tomo" className="tomo-chathead-avatar" />
              <Stack gap={2} className="min-w-0 flex-1">
                <Text fw={700} size="sm">
                  Tomo.AI assistant
                </Text>
                <Text size="xs" c="dimmed">
                  Ask about your workspace
                </Text>
              </Stack>
              <Group gap={2} wrap="nowrap" className="shrink-0">
                <ActionIcon
                  type="button"
                  variant="subtle"
                  color={historyOpen ? "orange" : "gray"}
                  onClick={showConversationHistory}
                  disabled={sending || loadingConversationId !== null}
                  aria-label="Show conversation history"
                  title="Conversation history"
                >
                  <IconHistory size={17} />
                </ActionIcon>
                <ActionIcon
                  type="button"
                  variant="subtle"
                  color="gray"
                  onClick={clearHistory}
                  disabled={sending || loadingConversationId !== null}
                  aria-label="Start a new conversation"
                  title="Start a new conversation"
                >
                  <IconMessagePlus size={17} />
                </ActionIcon>
                <button
                  type="button"
                  className="tomo-chat-minimize"
                  onClick={() => setOpen(false)}
                  aria-label="Minimize assistant"
                >
                  —
                </button>
              </Group>
            </Group>

            <ScrollArea
              className="min-h-0 flex-1 bg-[#fffaf4] p-4"
              type="auto"
              offsetScrollbars
            >
              {historyOpen ? (
                <Stack gap="sm" aria-busy={conversationsLoading}>
                  <Text size="sm" fw={700} c="dimmed">
                    Conversation history
                  </Text>
                  {conversationsLoading && (
                    <Text size="sm" c="dimmed" role="status">
                      Loading conversations…
                    </Text>
                  )}
                  {conversationsError && (
                    <Text size="sm" c="red" role="alert">
                      {conversationsError}
                    </Text>
                  )}
                  {!conversationsLoading && !conversationsError && conversations.length === 0 && (
                    <Text size="sm" c="dimmed">
                      No past conversations yet.
                    </Text>
                  )}
                  {conversations.map((conversation) => {
                    const id = getConversationId(conversation);
                    return (
                      <button
                        key={id}
                        type="button"
                        disabled={loadingConversationId !== null}
                        onClick={() => selectConversation(conversation)}
                        className="w-full rounded-lg border border-[#eee5da] bg-white p-3 text-left transition hover:border-orange-300 hover:bg-orange-50 disabled:opacity-60"
                      >
                        <Text size="sm" fw={600} lineClamp={2}>
                          {getConversationLabel(conversation)}
                        </Text>
                        {conversation.createdAt && (
                          <Text mt={4} size="xs" c="dimmed">
                            {new Date(conversation.createdAt).toLocaleString()}
                          </Text>
                        )}
                        {loadingConversationId === id && (
                          <Text mt={4} size="xs" c="dimmed" role="status">
                            Loading…
                          </Text>
                        )}
                      </button>
                    );
                  })}
                </Stack>
              ) : (
              <Stack gap="sm" aria-live="polite" aria-busy={sending}>
                {messages.map((message, index) => (
                  <div
                    className={`tomo-message-row ${message.role === "user" ? "tomo-message-user" : "tomo-message-assistant"}`}
                    key={`${index}-${message.role}`}
                  >
                    {message.role !== "user" && (
                      <img
                        src={tomoLogo}
                        alt="Tomo"
                        className="tomo-chathead-message"
                      />
                    )}
                    <Paper
                      className={`max-w-[86%] ${message.role === "user" ? "self-end" : "self-start"}`}
                      key={`${index}-${message.role}`}
                      p="sm"
                      radius="md"
                      withBorder={message.role !== "user"}
                      bg={
                        message.role === "user"
                          ? "#392f5a"
                          : message.role === "error"
                            ? "red.0"
                            : "white"
                      }
                    >
                      {message.role === "assistant" ? (
                        <AIMessage content={message.content} />
                      ) : (
                        <Text
                          size="sm"
                          c={message.role === "user" ? "white" : "red.8"}
                          className="whitespace-pre-wrap break-words"
                        >
                          {message.content}
                        </Text>
                      )}
                    </Paper>
                  </div>
                ))}
                {sending && (
                  <div className="tomo-message-row tomo-message-assistant">
                    <img
                      src={tomoLogo}
                      alt="Tomo"
                      className="tomo-chathead-message"
                    />

                    <Paper
                      className="max-w-[86%] self-start"
                      p="sm"
                      radius="md"
                      withBorder
                      bg="white"
                    >
                      <div role="status" aria-label="Tomo is thinking">
                        <ThinkingIndicator />
                      </div>
                    </Paper>
                  </div>
                )}
                {historyError && (
                  <Text size="xs" c="red" role="status">
                    {historyError}
                  </Text>
                )}
                <div ref={messagesEndRef} />
                {retryMessage && (
                  <button
                    type="button"
                    className="tomo-chat-retry"
                    onClick={retryLastMessage}
                  >
                    Retry message
                  </button>
                )}
              </Stack>
              )}
            </ScrollArea>

            {!historyOpen && (
              <form
                className="flex shrink-0 items-center gap-2 border-t border-[#eee5da] p-3"
                onSubmit={sendMessage}
              >
                <TextInput
                  ref={inputRef}
                  id="chat-message-input"
                  aria-label="Message the assistant"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Ask a question…"
                  autoComplete="off"
                  disabled={sending}
                  radius="md"
                  size="md"
                  className="min-w-0 flex-1"
                />
                <ActionIcon
                  type="submit"
                  size={42}
                  radius="md"
                  color="orange"
                  variant="filled"
                  className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                  aria-label="Send message"
                  disabled={sending || !input.trim()}
                >
                  <IconPaw size={19} />
                </ActionIcon>
              </form>
            )}
          </Paper>
        </aside>
      )}
    </>
  );
}
