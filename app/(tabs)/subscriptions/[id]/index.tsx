import { useLocalSearchParams } from "expo-router";
import { styled } from "nativewind";
import React from "react";
import { Text } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView);

const SubscriptionDetails = () => {
  const { id } = useLocalSearchParams();
  return (
    <SafeAreaView className="flex-1 p-5 bg-background">
      <Text className="text-xl font-bold text-success">
        Subscription Details: {id}
      </Text>
    </SafeAreaView>
  );
};

export default SubscriptionDetails;
