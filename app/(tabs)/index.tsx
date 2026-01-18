import { useMemo, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  StatusBar,
  Platform,
} from "react-native";
import Slider from "@react-native-community/slider";
import { useRouter } from "expo-router";
import { HOTELS } from "../data/hotels";
import { HotelCard } from "../components/HotelCard";

type SortKey = "RECOMMENDED" | "PRICE_ASC" | "PRICE_DESC" | "RATING_DESC";
type CityKey = "전체" | "서울" | "부산" | "제주";

const MIN_LIMIT = 50000;
const MAX_LIMIT = 300000;
const STEP = 5000;

// ✅ 옵션 필터(데이터가 없어도 동작하게: 텍스트 기반 “가짜 규칙”)
type AmenityKey = "FREE_CANCEL" | "BREAKFAST" | "PARKING";

export default function HomeScreen() {
  const router = useRouter();
  const topInset = Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) : 0;

  const [query, setQuery] = useState("");
  const [city, setCity] = useState<CityKey>("전체");
  const [sort, setSort] = useState<SortKey>("RECOMMENDED");

  // 가격 범위
  const [minPrice, setMinPrice] = useState(50000);
  const [maxPrice, setMaxPrice] = useState(200000);
  const setMin = (v: number) => setMinPrice(Math.min(v, maxPrice));
  const setMax = (v: number) => setMaxPrice(Math.max(v, minPrice));

  // ✅ 옵션 선택 상태
  const [amenities, setAmenities] = useState<Record<AmenityKey, boolean>>({
    FREE_CANCEL: false,
    BREAKFAST: false,
    PARKING: false,
  });

  const toggleAmenity = (k: AmenityKey) => {
    setAmenities((prev) => ({ ...prev, [k]: !prev[k] }));
  };

  // ✅ 데이터에 옵션 필드가 없을 때도 “동작”하도록 임시 규칙
  // - 무료취소: 별점 4.6 이상
  // - 조식: 가격 12만원 이상
  // - 주차: 호텔명이 "파크/park" 포함
  const passAmenityFilter = (h: any) => {
    if (amenities.FREE_CANCEL && h.rating < 4.6) return false;
    if (amenities.BREAKFAST && h.pricePerNight < 120000) return false;

    const nameLower = String(h.name ?? "").toLowerCase();
    if (amenities.PARKING && !(nameLower.includes("park") || nameLower.includes("파크"))) return false;

    return true;
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = HOTELS.slice();

    if (city !== "전체") list = list.filter((h) => h.city === city);

    if (q) {
      list = list.filter((h) => {
        const name = h.name.toLowerCase();
        const c = h.city.toLowerCase();
        return name.includes(q) || c.includes(q);
      });
    }

    // 가격 범위
    list = list.filter((h) => h.pricePerNight >= minPrice && h.pricePerNight <= maxPrice);

    // ✅ 옵션 필터
    list = list.filter(passAmenityFilter);

    // 정렬
    if (sort === "PRICE_ASC") list.sort((a, b) => a.pricePerNight - b.pricePerNight);
    else if (sort === "PRICE_DESC") list.sort((a, b) => b.pricePerNight - a.pricePerNight);
    else if (sort === "RATING_DESC") list.sort((a, b) => b.rating - a.rating);
    else {
      list.sort((a, b) => {
        if (b.rating !== a.rating) return b.rating - a.rating;
        return a.pricePerNight - b.pricePerNight;
      });
    }

    return list;
  }, [query, city, minPrice, maxPrice, sort, amenities]);

  const clearFilters = () => {
    setQuery("");
    setCity("전체");
    setSort("RECOMMENDED");
    setMinPrice(50000);
    setMaxPrice(200000);
    setAmenities({ FREE_CANCEL: false, BREAKFAST: false, PARKING: false });
  };

  return (
    <View style={[styles.safe, { paddingTop: topInset + 10 }]}>
      <View style={styles.header}>
        <Text style={styles.title}>호텔 찾기</Text>
        <Text style={styles.sub}>검색 · 도시 · 가격 범위 · 옵션 · 정렬</Text>
      </View>

      <View style={styles.searchWrap}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="도시 또는 호텔명 검색"
          placeholderTextColor="#888"
          style={styles.searchInput}
        />
      </View>

      <View style={styles.segmentWrap}>
        <SegmentButton text="전체" active={city === "전체"} onPress={() => setCity("전체")} />
        <SegmentButton text="서울" active={city === "서울"} onPress={() => setCity("서울")} />
        <SegmentButton text="부산" active={city === "부산"} onPress={() => setCity("부산")} />
        <SegmentButton text="제주" active={city === "제주"} onPress={() => setCity("제주")} />
      </View>

      {/* ✅ 옵션 필터 칩 */}
      <View style={styles.amenitiesRow}>
        <Chip text="무료취소" active={amenities.FREE_CANCEL} onPress={() => toggleAmenity("FREE_CANCEL")} />
        <Chip text="조식포함" active={amenities.BREAKFAST} onPress={() => toggleAmenity("BREAKFAST")} />
        <Chip text="주차가능" active={amenities.PARKING} onPress={() => toggleAmenity("PARKING")} />
      </View>

      {/* 가격 범위 */}
      <View style={styles.sliderBox}>
        <View style={styles.sliderHeader}>
          <Text style={styles.label}>가격 범위</Text>
          <Text style={styles.priceText}>
            {minPrice.toLocaleString()}원 ~ {maxPrice.toLocaleString()}원
          </Text>
        </View>

        <Text style={styles.smallLabel}>최소 가격</Text>
        <Slider
          value={minPrice}
          onValueChange={setMin}
          minimumValue={MIN_LIMIT}
          maximumValue={MAX_LIMIT}
          step={STEP}
          minimumTrackTintColor="#111"
          maximumTrackTintColor="#ddd"
          thumbTintColor="#111"
        />

        <Text style={styles.smallLabel}>최대 가격</Text>
        <Slider
          value={maxPrice}
          onValueChange={setMax}
          minimumValue={MIN_LIMIT}
          maximumValue={MAX_LIMIT}
          step={STEP}
          minimumTrackTintColor="#111"
          maximumTrackTintColor="#ddd"
          thumbTintColor="#111"
        />

        <Text style={styles.help}>옵션(무료취소/조식/주차)을 켜면 결과가 더 줄어들어</Text>
      </View>

      <View style={styles.sortRow}>
        <Text style={styles.label}>정렬</Text>

        <View style={styles.sortBtns}>
          <SortButton text="추천" active={sort === "RECOMMENDED"} onPress={() => setSort("RECOMMENDED")} />
          <SortButton text="가격↑" active={sort === "PRICE_ASC"} onPress={() => setSort("PRICE_ASC")} />
          <SortButton text="가격↓" active={sort === "PRICE_DESC"} onPress={() => setSort("PRICE_DESC")} />
          <SortButton text="별점" active={sort === "RATING_DESC"} onPress={() => setSort("RATING_DESC")} />
        </View>

        <Pressable style={styles.clearBtn} onPress={clearFilters}>
          <Text style={styles.clearBtnText}>초기화</Text>
        </Pressable>

        <Text style={styles.count}>검색 결과: {filtered.length}개</Text>
      </View>

      <FlatList
        contentContainerStyle={styles.list}
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <HotelCard hotel={item} onPress={() => router.push(`/hotel/${item.id}`)} />
        )}
        ListEmptyComponent={
          <View style={{ padding: 16 }}>
            <Text style={{ color: "#666" }}>조건에 맞는 호텔이 없어.</Text>
          </View>
        }
      />
    </View>
  );
}

function SegmentButton({ text, active, onPress }: { text: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.segBtn, active && styles.segBtnActive]}>
      <Text style={[styles.segText, active && styles.segTextActive]} numberOfLines={1}>
        {text}
      </Text>
    </Pressable>
  );
}

function Chip({ text, active, onPress }: { text: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{text}</Text>
    </Pressable>
  );
}

function SortButton({ text, active, onPress }: { text: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.sortBtn, active && styles.sortBtnActive]}>
      <Text style={[styles.sortBtnText, active && styles.sortBtnTextActive]}>{text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f6f6f6" },

  header: { paddingHorizontal: 16, paddingBottom: 10, gap: 6 },
  title: { fontSize: 22, fontWeight: "900" },
  sub: { color: "#666" },

  searchWrap: { paddingHorizontal: 16, paddingBottom: 10 },
  searchInput: {
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },

  segmentWrap: { flexDirection: "row", gap: 8, paddingHorizontal: 16, paddingBottom: 10 },
  segBtn: {
    flex: 1,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  segBtnActive: { backgroundColor: "black", borderColor: "black" },
  segText: { fontWeight: "900", color: "#111", fontSize: 13 },
  segTextActive: { color: "white" },

  amenitiesRow: { flexDirection: "row", gap: 8, paddingHorizontal: 16, paddingBottom: 10 },
  chip: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#eee",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
  },
  chipActive: { backgroundColor: "black", borderColor: "black" },
  chipText: { fontWeight: "900", color: "#111" },
  chipTextActive: { color: "white" },

  sliderBox: {
    marginHorizontal: 16,
    backgroundColor: "white",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 10,
  },
  sliderHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  label: { fontWeight: "800", color: "#333" },
  priceText: { fontWeight: "900" },
  smallLabel: { marginTop: 8, marginBottom: 2, color: "#444", fontWeight: "700" },
  help: { color: "#777", marginTop: 6, fontSize: 12 },

  sortRow: { paddingHorizontal: 16, gap: 8, paddingBottom: 10 },
  sortBtns: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  sortBtn: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#eee",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  sortBtnActive: { backgroundColor: "black", borderColor: "black" },
  sortBtnText: { fontWeight: "900", color: "#111" },
  sortBtnTextActive: { color: "white" },

  clearBtn: {
    alignSelf: "flex-start",
    backgroundColor: "#eee",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 4,
  },
  clearBtnText: { fontWeight: "900" },

  count: { color: "#666", fontWeight: "700" },
  list: { padding: 16 },
});
