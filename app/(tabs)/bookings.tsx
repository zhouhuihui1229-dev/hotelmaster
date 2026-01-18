import { useCallback, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View, Pressable } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getLastBooking, clearLastBooking, type Booking } from "../storage/bookingStorage";
import { HOTELS } from "../data/hotels";

export default function BookingsScreen() {
  const [booking, setBooking] = useState<Booking | null>(null);

  const load = async () => {
    const b = await getLastBooking();
    setBooking(b);
  };

  // ✅ 탭을 누를 때마다 자동으로 다시 불러오기
  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  const hotel = booking ? HOTELS.find((h) => h.id === booking.hotelId) : null;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.box}>
        <Text style={styles.title}>예약</Text>

        {!booking ? (
          <Text style={styles.text}>저장된 예약이 아직 없어.</Text>
        ) : (
          <View style={styles.card}>
            <Text style={styles.hName}>{hotel ? hotel.name : "호텔"}</Text>
            <Text style={styles.text}>예약자: {booking.guestName}</Text>
            <Text style={styles.text}>전화: {booking.phone}</Text>
            <Text style={styles.text}>
              저장시간: {new Date(booking.createdAt).toLocaleString()}
            </Text>

            <Pressable
              style={styles.btn2}
              onPress={async () => {
                await clearLastBooking();
                await load();
              }}
            >
              <Text style={styles.btn2Text}>예약 삭제(테스트용)</Text>
            </Pressable>
          </View>
        )}

        <Pressable style={styles.btn} onPress={load}>
          <Text style={styles.btnText}>새로고침</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f6f6f6" },
  box: { padding: 16, gap: 12 },
  title: { fontSize: 22, fontWeight: "900" },
  text: { color: "#333", lineHeight: 22 },
  card: {
    backgroundColor: "white",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#eee",
    gap: 6,
  },
  hName: { fontSize: 16, fontWeight: "900" },
  btn: {
    marginTop: 8,
    backgroundColor: "black",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  btnText: { color: "white", fontWeight: "900" },
  btn2: {
    marginTop: 10,
    backgroundColor: "#eee",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  btn2Text: { color: "#111", fontWeight: "900" },
});
