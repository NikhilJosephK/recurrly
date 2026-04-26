import { Link } from "expo-router";
import { Text } from "react-native";
import "../../global.css";

import { styled } from "nativewind";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  return (
    <SafeAreaView className="flex-1 p-5 bg-background">
      <Text className="text-xl font-bold text-success">
        Welcome to Nativewind!
      </Text>

      <Link
        href="/(auth)/sign-up"
        className="text-xl font-bold text-success border border-red-500 mt-4 p-4"
      >
        Go to signup
      </Link>
      <Link
        href="/(tabs)/subscriptions/"
        className="text-xl font-bold text-success border border-red-500 mt-4 p-4"
      >
        Go to subscriptions
      </Link>
      <Link
        href={{
          pathname: "/(tabs)/subscriptions/[id]",
          params: { id: "claude" },
        }}
        className="text-xl font-bold text-success border border-red-500 mt-4 p-4"
      >
        Go to claudes subscription
      </Link>
    </SafeAreaView>
  );
}

// to avoid the content getting hidden behind the screen edges, we can use the SafeAreaView component from react-native-safe-area-context as RNSafeAreaView and styled it with nativewind to apply the tailwind classes to it
