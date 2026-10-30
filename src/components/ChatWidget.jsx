import { useEffect, useRef, useState } from "react";
import { ActionIcon, Group, Paper, ScrollArea, Stack, Text, TextInput } from "@mantine/core";
import { IconArrowUp } from "@tabler/icons-react";
import { sendChatMessage } from "../services/chatApi";
import tomoLogo from "../assets/tomo-logo.svg";

export default function ChatWidget() {
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [open, setOpen] = useState(true);
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I’m Tomo’s assistant. What can I help you find?",
    },
  ]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [retryMessage, setRetryMessage] = useState(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(event) {
    event.preventDefault();
    const content = input.trim();
    if (!content || sending) return;

    const nextMessages = [...messages, { role: "user", content }];
    setMessages(nextMessages);
    setInput("");
    setSending(true);
    setRetryMessage(null);

    try {
      const response = await sendChatMessage(content, conversationId);
      setConversationId(response.conversationId);
      setMessages((current) => [...current, { role: "assistant", content: response.answer }]);
    } catch (error) {
      setRetryMessage(content);
      const detail = error.response?.data?.message || error.response?.data?.error;
      setMessages((current) => [
        ...current,
        {
          role: "error",
          content: detail || (error.response?.status
            ? `The assistant request failed (${error.response.status}). Check the chat service and try again.`
            : "I couldn’t reach the assistant. Check your connection and try again."),
        },
      ]);
      console.error("Chat request failed:", error);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  }

  async function retryLastMessage() {
    if (!retryMessage || sending) return;
    setMessages((current) => current.filter((message) => message.role !== "error"));
    setInput(retryMessage);
    requestAnimationFrame(() => inputRef.current?.form?.requestSubmit());
  }

  return (
    <>
    {!open && <button type="button" onClick={() => setOpen(true)} className="tomo-chathead-launcher" aria-label="Open Tomo assistant">
      <img src={tomoLogo} alt="" /><span className="tomo-chathead-status" />
    </button>}
    {open && <aside
      className="sticky top-0 flex h-screen w-[clamp(300px,29vw,390px)] shrink-0 border-l border-[#eee5da] bg-white max-[480px]:w-[280px]"
      aria-label="Tomo assistant sidebar"
    >
      <Paper className="flex h-full min-h-0 w-full flex-1 flex-col rounded-none border-0" component="section" aria-label="Chat with Tomo assistant">
        <Group className="shrink-0 border-b border-[#eee5da]" wrap="nowrap" p="md" gap="sm">
          <img src={tomoLogo} alt="Tomo" className="tomo-chathead-avatar" />
          <Stack gap={2}>
            <Text fw={700} size="sm">Tomo assistant</Text>
            <Text size="xs" c="dimmed">Ask about your workspace</Text>
          </Stack>
          <button type="button" className="tomo-chat-minimize" onClick={() => setOpen(false)} aria-label="Minimize assistant">—</button>
        </Group>

        <ScrollArea className="min-h-0 flex-1 bg-[#fffaf4] p-4" type="auto" offsetScrollbars>
          <Stack gap="sm" aria-live="polite" aria-busy={sending}>
            {messages.map((message, index) => (
              <div className={`tomo-message-row ${message.role === "user" ? "tomo-message-user" : "tomo-message-assistant"}`} key={`${index}-${message.role}`}>
              {message.role !== "user" && <img src={tomoLogo} alt="Tomo" className="tomo-chathead-message" />}
              <Paper
                className={`max-w-[86%] ${message.role === "user" ? "self-end" : "self-start"}`}
                key={`${index}-${message.role}`}
                p="sm"
                radius="md"
                withBorder={message.role !== "user"}
                bg={message.role === "user" ? "#392f5a" : message.role === "error" ? "red.0" : "white"}
              >
                <Text
                  size="sm"
                  c={message.role === "user" ? "white" : message.role === "error" ? "red.8" : undefined}
                  className="whitespace-pre-wrap break-words"
                >
                  {message.content}
                </Text>
              </Paper>
              </div>
            ))}
            {sending && <Text size="sm" c="dimmed" role="status">Thinking…</Text>}
            <div ref={messagesEndRef} />
            {retryMessage && <button type="button" className="tomo-chat-retry" onClick={retryLastMessage}>Retry message</button>}
          </Stack>
        </ScrollArea>

        <form className="flex shrink-0 items-center gap-2 border-t border-[#eee5da] p-3" onSubmit={sendMessage}>
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
            <IconArrowUp size={19} />
          </ActionIcon>
        </form>
      </Paper>
    </aside>
    }
    </>
  );
}
