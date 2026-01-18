import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "LAST_BOOKING_V1";

export type Booking = {
  id: string;
  hotelId: string;
  guestName: string;
  phone: string;
  createdAt: number;
};

export async function saveLastBooking(b: Booking) {
  await AsyncStorage.setItem(KEY, JSON.stringify(b));
}

export async function getLastBooking(): Promise<Booking | null> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Booking;
  } catch {
    return null;
  }
}

export async function clearLastBooking() {
  await AsyncStorage.removeItem(KEY);
}
