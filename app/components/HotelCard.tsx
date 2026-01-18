import { Pressable, View, Text, Image, StyleSheet } from "react-native";
import type { Hotel } from "../data/hotels";

export function HotelCard({
  hotel,
  onPress,
}: {
  hotel: Hotel;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <Image source={{ uri: hotel.thumbnail }} style={styles.img} />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {hotel.name}
        </Text>
        <Text style={styles.meta}>
          {hotel.city} · ⭐ {hotel.rating}
        </Text>
        <Text style={styles.price}>
          1박 {hotel.pricePerNight.toLocaleString()}원
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  img: { width: "100%", height: 160 },
  info: { padding: 12, gap: 6 },
  name: { fontSize: 16, fontWeight: "700" },
  meta: { fontSize: 13, color: "#555" },
  price: { fontSize: 14, fontWeight: "800" },
});
