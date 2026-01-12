import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { FlatList, Image, Pressable, SafeAreaView, Text, TextInput, View } from "react-native";
import { useFavorites } from "../_layout";

const HOTELS = [
  { id: "1", name: "서울 센트럴 호텔", city: "서울", price: 120000, rating: 4.5, photoUri: "https://picsum.photos/seed/hotel1/1200/800" },
  { id: "2", name: "부산 오션뷰 호텔", city: "부산", price: 98000, rating: 4.2, photoUri: "https://picsum.photos/seed/hotel2/1200/800" },
  { id: "3", name: "제주 힐링 리조트", city: "제주", price: 150000, rating: 4.8, photoUri: "https://picsum.photos/seed/hotel3/1200/800" },
] as const;

function SafeCardImage({ uri }: { uri: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <View style={{ width: "100%", height: 160, backgroundColor: "#ddd", alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontSize: 18, fontWeight: "900", opacity: 0.7 }}>이미지 없음</Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      style={{ width: "100%", height: 160, backgroundColor: "#ddd" }}
      resizeMode="cover"
      onError={() => setFailed(true)}
    />
  );
}

export default function HomeScreen() {
  const [query, setQuery] = useState("");
  const { isFavorite, toggleFavorite } = useFavorites();

  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return HOTELS;
    return HOTELS.filter((h) => h.city.includes(q) || h.name.includes(q));
  }, [query]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f7fa" }}>
      <View style={{ padding: 16, backgroundColor: "#0b74e5" }}>
        <Text style={{ color: "white", fontSize: 22, fontWeight: "900" }}>hotelmaster</Text>
        <Text style={{ color: "white", marginTop: 6, opacity: 0.9 }}>호텔 예약 플랫폼</Text>

        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="도시/호텔명 검색 (서울, 부산, 제주)"
          placeholderTextColor="#666"
          style={{ marginTop: 12, backgroundColor: "white", borderRadius: 14, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16 }}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push({ pathname: "/hotel/[id]", params: { id: item.id } })}
            style={{ backgroundColor: "white", borderRadius: 18, overflow: "hidden", shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10, elevation: 4 }}
          >
            <View style={{ position: "relative" }}>
              <SafeCardImage uri={item.photoUri} />
              <Pressable
                onPress={() => toggleFavorite(item.id)}
                style={{ position: "absolute", top: 10, right: 10, backgroundColor: "rgba(255,255,255,0.9)", width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" }}
              >
                <Text style={{ fontSize: 20 }}>{isFavorite(item.id) ? "❤️" : "🤍"}</Text>
              </Pressable>
            </View>

            <View style={{ padding: 14 }}>
              <Text style={{ fontSize: 18, fontWeight: "900" }}>{item.name}</Text>
              <Text style={{ marginTop: 6, opacity: 0.7 }}>📍 {item.city} · ⭐ {item.rating}</Text>
              <Text style={{ marginTop: 10, fontSize: 16, fontWeight: "900", color: "#e74c3c" }}>
                ₩ {item.price.toLocaleString()} / 1박
              </Text>
            </View>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

