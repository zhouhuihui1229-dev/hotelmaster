import { SafeAreaView, View, Text, Pressable, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { HOTELS } from "./data/hotels";

export default function CompleteScreen() {
  const router = useRouter();
  const { hotelId, name } = useLocalSearchParams<{ hotelId: string; name: string }>();

  const hotel = HOTELS.find((h) => h.id === hotelId);
  const userName = name ? decodeURIComponent(name) : "";

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.box}>
        <Text style={styles.title}>예약 완료 🎉</Text>
        <Text style={styles.text}>{userName}님</Text>
        <Text style={styles.text}>
          {hotel ? hotel.name : "호텔"} 예약 요청이 접수됐어.
        </Text>

        <Pressable style={styles.btn} onPress={() => router.replace("/")}>
          <Text style={styles.btnText}>홈으로</Text>
        </Pressable>

        <Pressable style={styles.btn2} onPress={() => router.replace("/(tabs)/bookings")}>
          <Text style={styles.btn2Text}>예약 탭으로</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "white" },
  box: { padding: 16, gap: 12 },
  title: { fontSize: 24, fontWeight: "900" },
  text: { fontSize: 16 },
  btn: {
    marginTop: 12,
    backgroundColor: "black",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  btnText: { color: "white", fontWeight: "900", fontSize: 16 },
  btn2: {
    marginTop: 10,
    backgroundColor: "#eee",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  btn2Text: { color: "#111", fontWeight: "900", fontSize: 16 },
});
