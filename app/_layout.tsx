import { Stack } from "expo-router";

/**
 * Native cold start uses the first root screen when there is no deep link.
 * (auth) sorts before (tabs), so without this the app opened on /sign-up.
 */
export const unstable_settings = {
  initialRouteName: "(tabs)",
};

export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
