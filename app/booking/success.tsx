import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Pressable, SafeAreaView, Text, View } from "react-native";

export default function Success() {
  const { name, price, nights } = useLocalSearchParams<{ name?: string; price?: string; nights?: string }>();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
        <Text style={{ fontSize: 26, fontWeight: "900" }}>예약 완료</Text>
        <View style={{ marginTop: 14, padding: 14, backgroundColor: "#f5f7fa", borderRadius: 14 }}>
          <Text>호텔: {name}</Text>
          <Text>숙박: {nights}박</Text>
          <Text style={{ color: "#e74c3c", fontWeight: "900", marginTop: 6 }}>₩ {Number(price || 0).toLocaleString()}</Text>
        </View>

        <Pressable onPress={() => router.replace("/")} style={{ marginTop: 18, backgroundColor: "#0b74e5", padding: 14, borderRadius: 14, alignItems: "center" }}>
          <Text style={{ color: "white", fontWeight: "900" }}>홈으로</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}


