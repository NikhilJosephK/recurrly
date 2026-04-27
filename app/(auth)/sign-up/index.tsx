import { Link } from "expo-router";
import { styled } from "nativewind";
import { Text } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView);

export default function signup() {
  return (
    <SafeAreaView className="flex-1 p-5 bg-background">
      <Text className="text-xl font-bold text-success">sign-up</Text>
      <Link
        href="/"
        className="border border-red-500 text-xl font-sans-bold text-success"
      >
        Go back
      </Link>
    </SafeAreaView>
  );
}
