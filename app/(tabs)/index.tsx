import { FlatList, Text, View } from "react-native";
import "../../global.css";

import ListHeading from "@/components/ListHeading";
import SubsciptionCard from "@/components/SubsciptionCard";
import UpcomingSubscriptionCard from "@/components/UpcomingSubscriptionCard";
import {
  HOME_BALANCE,
  HOME_SUBSCRIPTIONS,
  HOME_USER,
  UPCOMING_SUBSCRIPTIONS,
} from "@/constants/data";
import { icons } from "@/constants/icons";
import { images } from "@/constants/image";
import { formatCurrency } from "@/lib/utils";
import { Image } from "expo-image";
import { styled } from "nativewind";
import { useState } from "react";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<
    string | null
  >(null);
  return (
    <SafeAreaView className="flex-1 p-5 bg-background">
      {/* <SubsciptionCard {...HOME_SUBSCRIPTIONS[0]} /> */}
      <FlatList
        ListHeaderComponent={() => {
          return (
            <>
              <View className="home-header">
                <View className="home-user">
                  <Image
                    source={images.avatar}
                    style={{ width: 40, height: 40 }}
                    className="home-avatar"
                  />
                  <Text className="home-user-name">{HOME_USER.name}</Text>
                </View>
                <Image
                  source={icons.add}
                  className="home-add-icon"
                  style={{ width: 24, height: 24 }}
                />
              </View>
              <View className="home-balance-card">
                <Text className="home-balance-label">Balance</Text>
                <Text className="home-balance-amount">
                  {formatCurrency(HOME_BALANCE.amount)}
                </Text>
                <Text className="home-balance-date">
                  {HOME_BALANCE.nextRenewalDate
                    ? new Date(HOME_BALANCE.nextRenewalDate).toLocaleDateString(
                        "en-US",
                        {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        }
                      )
                    : "Not provided"}
                </Text>
              </View>
              <View>
                <ListHeading title="Upcoming" />
                {/* <UpcomingSubscriptionCard data={UPCOMING_SUBSCRIPTIONS[0]} /> */}
                {/* {UPCOMING_SUBSCRIPTIONS.map((subscription) => (
          <UpcomingSubscriptionCard
            key={subscription.id}
            data={subscription}
          />
        ))} */}
                <FlatList
                  data={UPCOMING_SUBSCRIPTIONS}
                  renderItem={({ item }) => (
                    <UpcomingSubscriptionCard data={{ ...item }} />
                  )}
                  keyExtractor={(item) => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  ListEmptyComponent={
                    <Text className="home-empty-state">
                      No upcoming subscriptions
                    </Text>
                  }
                />
              </View>
              <ListHeading title="All subscriptions" />
            </>
          );
        }}
        className="flex-1"
        data={HOME_SUBSCRIPTIONS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SubsciptionCard
            {...item}
            expanded={expandedSubscriptionId === item.id}
            onPress={() =>
              setExpandedSubscriptionId((current) =>
                current === item.id ? null : item.id
              )
            }
          />
        )}
        extraData={expandedSubscriptionId}
        ItemSeparatorComponent={() => <View className="h-4" />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text className="home-empty-state">No subscriptions</Text>
        }
        contentContainerClassName="pb-20"
      />
    </SafeAreaView>
  );
}

// to avoid the content getting hidden behind the screen edges, we can use the SafeAreaView component from react-native-safe-area-context as RNSafeAreaView and styled it with nativewind to apply the tailwind classes to it
