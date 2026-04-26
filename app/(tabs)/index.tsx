import { Link } from "expo-router";
import { Text, View } from "react-native";
import "../../global.css";

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
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
    </View>
  );
}
