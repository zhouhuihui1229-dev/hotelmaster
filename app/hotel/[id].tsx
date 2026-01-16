import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useFavorites } from "../_layout";

const HOTELS = [
  { id: "1", name: "서울 센트럴 호텔", city: "서울", price: 120000, rating: 4.5, photo: "https://picsum.photos/seed/h1/1200/800", desc: "서울 중심에 위치한 깔끔한 호텔입니다." },
  { id: "2", name: "부산 오션뷰 호텔", city: "부산", price: 98000, rating: 4.2, photo: "https://picsum.photos/seed/h2/1200/800", desc: "바다 전망이 멋진 호텔입니다." },
  { id: "3", name: "제주 힐링 리조트", city: "제주", price: 150000, rating: 4.8, photo: "https://picsum.photos/seed/h3/1200/800", desc: "조용하고 힐링되는 리조트입니다." },
] as const;

const dayMs = 24 * 60 * 60 * 1000;

function startOfDay(d: Date) {
  const t = new Date(d);
  t.setHours(0, 0, 0, 0);
  return t;
}
function addDays(d: Date, n: number) {
  const t = new Date(d);
  t.setDate(t.getDate() + n);
  return startOfDay(t);
}
function ymd(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

export default function HotelDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isFav, toggle } = useFavorites();
  const hotel = useMemo(() => HOTELS.find((h) => h.id === id), [id]);

  const [checkIn, setCheckIn] = useState(() => startOfDay(new Date()));
  const [checkOut, setCheckOut] = useState(() => addDays(new Date(), 1));

  // ✅ 오버레이(터치 막힘 원인 되는 Modal 안 씀)
  const [panel, setPanel] = useState<null | "in" | "out">(null);
  const [cursor, setCursor] = useState(() => startOfDay(new Date()));

  if (!hotel) {
    return (
      <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>호텔을 찾을 수 없어요</Text>
        <Pressable
          onPress={() => router.back()}
          style={{ marginTop: 12, padding: 12, backgroundColor: "#0b74e5", borderRadius: 12 }}
        >
          <Text style={{ color: "white", fontWeight: "900" }}>뒤로</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const nights = Math.max(0, Math.floor((checkOut.getTime() - checkIn.getTime()) / dayMs));
  const total = nights * hotel.price;
  const invalid = checkOut.getTime() <= checkIn.getTime();

  const openPanel = (mode: "in" | "out") => {
    setCursor(mode === "in" ? checkIn : checkOut);
    setPanel(mode);
  };

  const applyDate = () => {
    if (!panel) return;

    if (panel === "in") {
      setCheckIn(cursor);
      if (checkOut.getTime() <= cursor.getTime()) {
        setCheckOut(addDays(cursor, 1));
      }
    } else {
      if (cursor.getTime() <= checkIn.getTime()) {
        setCheckOut(addDays(checkIn, 1));
      } else {
        setCheckOut(cursor);
      }
    }
    setPanel(null);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* 상단바 */}
      <View style={{ padding: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Pressable
          onPress={() => router.back()}
          style={{ backgroundColor: "#0b74e5", paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12 }}
        >
          <Text style={{ color: "white", fontWeight: "900" }}>← 뒤로</Text>
        </Pressable>

        <Text style={{ fontWeight: "900" }} numberOfLines={1}>
          {hotel.name}
        </Text>

        <Pressable
          onPress={() => toggle(hotel.id)}
          style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: "#eee", alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ fontSize: 20 }}>{isFav(hotel.id) ? "❤️" : "🤍"}</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Image source={{ uri: hotel.photo }} style={{ width: "100%", height: 260 }} />

        <View style={{ padding: 16 }}>
          <Text style={{ fontSize: 24, fontWeight: "900" }}>{hotel.name}</Text>
          <Text style={{ marginTop: 6, opacity: 0.7 }}>📍 {hotel.city} · ⭐ {hotel.rating}</Text>
          <Text style={{ marginTop: 10, color: "#e74c3c", fontWeight: "900" }}>
            ₩ {hotel.price.toLocaleString()} / 1박
          </Text>

          <View style={{ marginTop: 16, backgroundColor: "#f5f7fa", padding: 14, borderRadius: 14 }}>
            <Text style={{ fontWeight: "900" }}>설명</Text>
            <Text style={{ marginTop: 8, opacity: 0.8 }}>{hotel.desc}</Text>
          </View>

          {/* 날짜 선택 */}
          <View style={{ marginTop: 16, padding: 14, borderRadius: 14, borderWidth: 1, borderColor: "#eee" }}>
            <Text style={{ fontWeight: "900", fontSize: 16 }}>날짜 선택</Text>

            <Text style={{ marginTop: 12, opacity: 0.7 }}>체크인</Text>
            <Pressable
              onPress={() => openPanel("in")}
              style={{ marginTop: 6, borderWidth: 1, borderColor: "#ddd", borderRadius: 14, padding: 12, backgroundColor: "#fff" }}
            >
              <Text style={{ fontSize: 16 }}>{ymd(checkIn)}</Text>
            </Pressable>

            <Text style={{ marginTop: 14, opacity: 0.7 }}>체크아웃</Text>
            <Pressable
              onPress={() => openPanel("out")}
              style={{ marginTop: 6, borderWidth: 1, borderColor: "#ddd", borderRadius: 14, padding: 12, backgroundColor: "#fff" }}
            >
              <Text style={{ fontSize: 16 }}>{ymd(checkOut)}</Text>
            </Pressable>

            {invalid && (
              <Text style={{ marginTop: 10, color: "#e74c3c", fontWeight: "900" }}>
                체크아웃은 체크인보다 뒤 날짜여야 해.
              </Text>
            )}

            <View style={{ marginTop: 12, padding: 12, backgroundColor: "#f5f7fa", borderRadius: 12 }}>
              <Text style={{ fontWeight: "900" }}>숙박</Text>
              <Text style={{ marginTop: 6, opacity: 0.85 }}>{nights}박</Text>

              <Text style={{ marginTop: 12, fontWeight: "900" }}>총 금액</Text>
              <Text style={{ marginTop: 6, fontSize: 18, fontWeight: "900", color: "#e74c3c" }}>
                ₩ {total.toLocaleString()}
              </Text>
            </View>
          </View>

          <Pressable
            disabled={invalid || nights <= 0}
            onPress={() =>
              router.push({
                pathname: "/booking/success",
                params: {
                  name: hotel.name,
                  price: String(total),
                  nights: String(nights),
                  checkIn: ymd(checkIn),
                  checkOut: ymd(checkOut),
                },
              })
            }
            style={{
              marginTop: 16,
              backgroundColor: invalid || nights <= 0 ? "#ccc" : "#e74c3c",
              paddingVertical: 14,
              borderRadius: 14,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontWeight: "900", fontSize: 16 }}>예약하기</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* ✅ 오버레이: panel이 null이면 아예 렌더링 안 됨 (터치 막힘 없음) */}
      {panel !== null && (
        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.60)",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            zIndex: 9999,
          }}
        >
          {/* 바깥 누르면 닫기 */}
          <Pressable
            onPress={() => setPanel(null)}
            style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}
          />

          {/* 내용 */}
          <View style={{ width: "100%", maxWidth: 420, backgroundColor: "white", borderRadius: 18, padding: 14 }}>
            <Text style={{ fontSize: 16, fontWeight: "900" }}>
              {panel === "in" ? "체크인 날짜 선택" : "체크아웃 날짜 선택"}
            </Text>

            <View style={{ marginTop: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Pressable onPress={() => setCursor(addDays(cursor, -1))} style={{ padding: 12, borderRadius: 12, backgroundColor: "#f2f5fa" }}>
                <Text style={{ fontWeight: "900" }}>◀</Text>
              </Pressable>

              <Text style={{ fontSize: 18, fontWeight: "900" }}>{ymd(cursor)}</Text>

              <Pressable onPress={() => setCursor(addDays(cursor, 1))} style={{ padding: 12, borderRadius: 12, backgroundColor: "#f2f5fa" }}>
                <Text style={{ fontWeight: "900" }}>▶</Text>
              </Pressable>
            </View>

            <View style={{ marginTop: 14, flexDirection: "row", gap: 10 }}>
              <Pressable onPress={() => setPanel(null)} style={{ flex: 1, padding: 12, borderRadius: 14, backgroundColor: "#eee", alignItems: "center" }}>
                <Text style={{ fontWeight: "900" }}>취소</Text>
              </Pressable>
              <Pressable onPress={applyDate} style={{ flex: 1, padding: 12, borderRadius: 14, backgroundColor: "#0b74e5", alignItems: "center" }}>
                <Text style={{ color: "white", fontWeight: "900" }}>선택</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}





