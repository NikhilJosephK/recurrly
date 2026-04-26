import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

export default function signup() {
  return (
    <View>
      <Text className="text-xl font-bold text-success">sign-up</Text>
      <Link
        href="/"
        className="text-xl font-bold text-success border border-red-500 "
      >
        Go back
      </Link>
    </View>
  );
}
