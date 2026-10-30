import { useEffect, useRef, useState } from "react";
import { ActionIcon, Group, Paper, ScrollArea, Stack, Text, TextInput } from "@mantine/core";
import { IconArrowUp, IconMessageChatbot } from "@tabler/icons-react";
import { sendChatMessage } from "../services/chatApi";

export default function ChatWidget() {
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I’m Tomo’s assistant. What can I help you find?",
    },
  ]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

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

    try {
      const response = await sendChatMessage(content, conversationId);
      setConversationId(response.conversationId);
      setMessages((current) => [...current, { role: "assistant", content: response.answer }]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: "error",
          content: "I couldn’t reach the assistant. Please try again in a moment.",
        },
      ]);
      console.error("Chat request failed:", error);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  }

  return (
    <aside
      className="sticky top-0 flex h-screen w-[clamp(300px,29vw,390px)] shrink-0 border-l border-[#eee5da] bg-white max-[480px]:w-[280px]"
      aria-label="Tomo assistant sidebar"
    >
      <Paper className="flex h-full min-h-0 w-full flex-1 flex-col rounded-none border-0" component="section" aria-label="Chat with Tomo assistant">
        <Group className="shrink-0 border-b border-[#eee5da]" wrap="nowrap" p="md" gap="sm">
          <ActionIcon size="lg" variant="light" color="teal" radius="md" aria-hidden="true">
            <IconMessageChatbot size={21} />
          </ActionIcon>
          <Stack gap={2}>
            <Text fw={700} size="sm">Tomo assistant</Text>
            <Text size="xs" c="dimmed">Ask about your workspace</Text>
          </Stack>
        </Group>

        <ScrollArea className="min-h-0 flex-1 bg-[#fffaf4] p-4" type="auto" offsetScrollbars>
          <Stack gap="sm" aria-live="polite" aria-busy={sending}>
            {messages.map((message, index) => (
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
            ))}
            {sending && <Text size="sm" c="dimmed" role="status">Thinking…</Text>}
            <div ref={messagesEndRef} />
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
  );
}
