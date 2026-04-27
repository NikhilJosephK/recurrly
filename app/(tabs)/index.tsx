import { Link } from "expo-router";
import { Text } from "react-native";
import "../../global.css";

import { styled } from "nativewind";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  return (
    <SafeAreaView className="flex-1 p-5 bg-background">
      <Text className="text-7xl font-sans-extrabold text-success">
        Welcome to Recurrly!
      </Text>

      <Link
        href="/(auth)/sign-up"
        className="mt-4 border border-red-500 p-4 text-xl font-sans-extrabold text-success"
      >
        Go to signup
      </Link>
      <Link
        href="/(tabs)/subscriptions/"
        className="mt-4 border border-red-500 p-4 text-xl font-sans-bold text-success"
      >
        Go to subscriptions
      </Link>
      <Link
        href={{
          pathname: "/(tabs)/subscriptions/[id]",
          params: { id: "claude" },
        }}
        className="mt-4 border border-red-500 p-4 text-xl font-sans-bold text-success"
      >
        Go to claudes subscription
      </Link>
    </SafeAreaView>
  );
}

// to avoid the content getting hidden behind the screen edges, we can use the SafeAreaView component from react-native-safe-area-context as RNSafeAreaView and styled it with nativewind to apply the tailwind classes to it
