import { useClerk } from "@clerk/expo";
import { theme } from "@/constants/theme";
import "../../../global.css";
import { styled } from "nativewind";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);
const StyledPressable = styled(Pressable);

const Settings = () => {
  const { signOut } = useClerk();

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="mb-2 text-2xl font-sans-bold text-primary">
        Settings
      </Text>
      <Text className="mb-8 text-base font-sans-medium text-muted-foreground">
        Manage your Recurly profile and session.
      </Text>

      <StyledPressable
        className="items-center rounded-2xl py-4"
        style={{
          backgroundColor: theme.colors.accent,
          opacity: 1,
        }}
        onPress={() => void signOut()}
      >
        <Text className="text-base font-sans-bold text-primary">Sign out</Text>
      </StyledPressable>

      <View className="mt-4 rounded-2xl border border-border bg-card p-4">
        <Text className="text-sm font-sans-medium text-muted-foreground">
          Signing out ends your secure session on this device. You’ll need your
          email and password to sign back in.
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default Settings;
