import { Group, Text } from "@mantine/core";

export default function ThinkingIndicator() {
  return (
    <Group gap={3} align="center" className="tomo-thinking">
      <Text size="sm" c="dimmed">
        Thinking
      </Text>

      <span className="tomo-thinking-dots">
        <span>.</span>
        <span>.</span>
        <span>.</span>
      </span>
    </Group>
  );
}