import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const SubscriptionDetails = () => {
  const { id } = useLocalSearchParams();
  return (
    <View>
      <Text className="text-xl font-bold text-success">
        Subscription Details: {id}
      </Text>
    </View>
  );
};

export default SubscriptionDetails;
