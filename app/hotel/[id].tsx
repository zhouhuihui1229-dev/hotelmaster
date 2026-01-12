import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import { Image, Pressable, SafeAreaView, Text, View } from "react-native";
import { useFavorites } from "../_layout";

const HOTELS = [
  { id: "1", name: "서울 센트럴 호텔", city: "서울", price: 120000, rating: 4.5, photoUri: "https://picsum.photos/seed/hotel1/1200/800", desc: "서울 중심에 위치한 깔끔한 호텔입니다." },
  { id: "2", name: "부산 오션뷰 호텔", city: "부산", price: 98000, rating: 4.2, photoUri: "https://picsum.photos/seed/hotel2/1200/800", desc: "바다 전망이 멋진 호텔입니다." },
  { id: "3", name: "제주 힐링 리조트", city: "제주", price: 150000, rating: 4.8, photoUri: "https://picsum.photos/seed/hotel3/1200/800", desc: "조용하고 힐링되는 리조트입니다." },
] as const;

function SafeHeroImage({ uri }: { uri: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <View
        style={{
          width: "100%",
          height: 260,
          backgroundColor: "#ddd",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "900", opacity: 0.7 }}>이미지 없음</Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      style={{ width: "100%", height: 260, backgroundColor: "#ddd" }}
      resizeMode="cover"
      onError={() => setFailed(true)}
    />
  );
}

export default function HotelDetailScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const { isFavorite, toggleFavorite } = useFavorites();

  const hotel = useMemo(() => {
    const id = (params.id ?? "").toString();
    return HOTELS.find((h) => h.id === id) ?? null;
  }, [params.id]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Stack.Screen options={{ title: hotel ? hotel.name : "호텔 상세" }} />

      {!hotel ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: "900" }}>호텔을 찾을 수 없어요</Text>
          <Pressable
            onPress={() => router.back()}
            style={{
              marginTop: 16,
              backgroundColor: "#0b74e5",
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderRadius: 12,
            }}
          >
            <Text style={{ color: "white", fontWeight: "900" }}>뒤로가기</Text>
          </Pressable>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <View style={{ position: "relative" }}>
            <SafeHeroImage uri={hotel.photoUri} />

            <Pressable
              onPress={() => toggleFavorite(hotel.id)}
              style={{
                position: "absolute",
                top: 14,
                right: 14,
                backgroundColor: "rgba(255,255,255,0.9)",
                width: 44,
                height: 44,
                borderRadius: 22,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 22 }}>{isFavorite(hotel.id) ? "❤️" : "🤍"}</Text>
            </Pressable>
          </View>

          <View style={{ padding: 16 }}>
            <Text style={{ fontSize: 24, fontWeight: "900" }}>{hotel.name}</Text>
            <Text style={{ marginTop: 8, opacity: 0.75, fontSize: 16 }}>
              📍 {hotel.city} · ⭐ {hotel.rating}
            </Text>

            <Text style={{ marginTop: 12, fontSize: 18, fontWeight: "900", color: "#e74c3c" }}>
              ₩ {hotel.price.toLocaleString()} / 1박
            </Text>

            <View style={{ marginTop: 16, padding: 14, backgroundColor: "#f5f7fa", borderRadius: 14 }}>
              <Text style={{ fontSize: 16, fontWeight: "900" }}>설명</Text>
              <Text style={{ marginTop: 8, opacity: 0.8, lineHeight: 22 }}>{hotel.desc}</Text>
            </View>

            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/booking/success",
                  params: { name: hotel.name, price: String(hotel.price) },
                })
              }
              style={{
                marginTop: 18,
                backgroundColor: "#e74c3c",
                paddingVertical: 14,
                borderRadius: 14,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white", fontSize: 16, fontWeight: "900" }}>예약하기</Text>
            </Pressable>

            <Pressable
              onPress={() => router.back()}
              style={{
                marginTop: 12,
                backgroundColor: "#0b74e5",
                paddingVertical: 14,
                borderRadius: 14,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white", fontSize: 16, fontWeight: "900" }}>목록으로 돌아가기</Text>
            </Pressable>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
