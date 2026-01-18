import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="hotel/[id]" />
      <Stack.Screen name="booking" />
      <Stack.Screen name="complete" />
    </Stack>
  );
}
