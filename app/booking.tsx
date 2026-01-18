import { useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { HOTELS } from "./data/hotels";
import { saveLastBooking } from "./storage/bookingStorage";

export default function BookingScreen() {
  const router = useRouter();
  const { hotelId } = useLocalSearchParams<{ hotelId: string }>();

  const hotel = useMemo(() => HOTELS.find((h) => h.id === hotelId), [hotelId]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const onSubmit = async () => {
    if (!hotel) {
      Alert.alert("오류", "호텔 정보를 찾을 수 없어.");
      return;
    }
    if (!name.trim() || !phone.trim()) {
      Alert.alert("입력 필요", "이름과 전화번호를 입력해줘.");
      return;
    }

    const bookingId = `b_${Date.now()}`;

    await saveLastBooking({
      id: bookingId,
      hotelId: hotel.id,
      guestName: name.trim(),
      phone: phone.trim(),
      createdAt: Date.now(),
    });

    router.replace(
      `/complete?hotelId=${hotel.id}&name=${encodeURIComponent(
        name.trim()
      )}&bookingId=${bookingId}`
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.box}>
        <Text style={styles.title}>비회원 예약</Text>
        <Text style={styles.sub}>{hotel ? hotel.name : "호텔"}</Text>

        <Text style={styles.label}>이름</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="홍길동"
          style={styles.input}
        />

        <Text style={styles.label}>전화번호</Text>
        <TextInput
          value={phone}
          onChangeText={setPhone}
          placeholder="010-1234-5678"
          keyboardType="phone-pad"
          style={styles.input}
        />

        <Pressable style={styles.btn} onPress={onSubmit}>
          <Text style={styles.btnText}>예약 완료</Text>
        </Pressable>

        <Pressable onPress={() => router.back()} style={{ paddingVertical: 10 }}>
          <Text>← 뒤로</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f6f6f6" },
  box: { padding: 16, gap: 10 },
  title: { fontSize: 22, fontWeight: "900" },
  sub: { color: "#666", marginBottom: 12 },
  label: { fontWeight: "800" },
  input: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  btn: {
    marginTop: 12,
    backgroundColor: "black",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  btnText: { color: "white", fontWeight: "900", fontSize: 16 },
});

