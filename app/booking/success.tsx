import { router, Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { Pressable, SafeAreaView, Text, View } from "react-native";

export default function BookingSuccessScreen() {
  const params = useLocalSearchParams<{ name?: string; price?: string }>();

  const name = (params.name ?? "호텔").toString();
  const price = Number(params.price ?? "0");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Stack.Screen options={{ title: "예약 완료" }} />

      <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
        <Text style={{ fontSize: 26, fontWeight: "900" }}>✅ 예약 완료!</Text>

        <View style={{ marginTop: 14, padding: 14, backgroundColor: "#f5f7fa", borderRadius: 14 }}>
          <Text style={{ fontSize: 16, fontWeight: "900" }}>예약한 호텔</Text>
          <Text style={{ marginTop: 8, opacity: 0.85, fontSize: 16 }}>{name}</Text>

          <Text style={{ marginTop: 14, fontSize: 16, fontWeight: "900" }}>결제 금액(1박)</Text>
          <Text style={{ marginTop: 8, fontSize: 18, fontWeight: "900", color: "#e74c3c" }}>
            ₩ {price.toLocaleString()}
          </Text>
        </View>

        <Pressable
          onPress={() => router.replace("/")}
          style={{
            marginTop: 18,
            backgroundColor: "#0b74e5",
            paddingVertical: 14,
            borderRadius: 14,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontSize: 16, fontWeight: "900" }}>홈으로 가기</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
