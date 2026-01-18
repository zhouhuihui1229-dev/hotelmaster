export type Hotel = {
  id: string;
  name: string;
  city: string;
  pricePerNight: number;
  rating: number;
  thumbnail: string;
};

export const HOTELS: Hotel[] = [
  {
    id: "h1",
    name: "Seoul Central Hotel",
    city: "서울",
    pricePerNight: 89000,
    rating: 4.6,
    thumbnail:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
  },
  {
    id: "h2",
    name: "Busan Ocean View",
    city: "부산",
    pricePerNight: 109000,
    rating: 4.4,
    thumbnail:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
  },
  {
    id: "h3",
    name: "Jeju Stay Resort",
    city: "제주",
    pricePerNight: 139000,
    rating: 4.8,
    thumbnail:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
  },
];
