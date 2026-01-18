import { SafeAreaView, View, Text, Image, StyleSheet, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { HOTELS } from "../data/hotels";

export default function HotelDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const hotel = HOTELS.find((h) => h.id === id);

  if (!hotel) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={{ padding: 16 }}>호텔을 찾을 수 없어.</Text>
        <Pressable onPress={() => router.back()} style={{ padding: 16 }}>
          <Text>← 뒤로</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <Image source={{ uri: hotel.thumbnail }} style={styles.img} />

      <View style={styles.body}>
        <Text style={styles.name}>{hotel.name}</Text>
        <Text style={styles.meta}>
          {hotel.city} · ⭐ {hotel.rating}
        </Text>
        <Text style={styles.price}>
          1박 {hotel.pricePerNight.toLocaleString()}원
        </Text>

        <Pressable
          style={styles.btn}
          onPress={() => router.push(`/booking?hotelId=${hotel.id}`)}
        >
          <Text style={styles.btnText}>예약하기</Text>
        </Pressable>

        <Pressable onPress={() => router.back()} style={{ paddingVertical: 10 }}>
          <Text>← 뒤로</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "white" },
  img: { width: "100%", height: 240 },
  body: { padding: 16, gap: 10 },
  name: { fontSize: 20, fontWeight: "900" },
  meta: { color: "#666" },
  price: { fontSize: 16, fontWeight: "900" },
  btn: {
    marginTop: 12,
    backgroundColor: "black",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  btnText: { color: "white", fontWeight: "900", fontSize: 16 },
});
