import { Center, Loader, Stack, Text } from "@mantine/core";

export default function LoadingScreen({ message = "Loading..." }) {
  return (
    <Center mih="50vh">
      <Stack align="center" gap="sm">
        <Loader color="indigo" />
        <Text c="dimmed" size="sm">
          {message}
        </Text>
      </Stack>
    </Center>
  );
}
