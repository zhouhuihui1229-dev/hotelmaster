// 호텔 데이터 (나중에 서버로 바뀜)
const hotels = [
  {
    name: "서울 센트럴 호텔",
    city: "서울",
    price: 120000,
    rating: 4.5
  },
  {
    name: "부산 오션뷰 호텔",
    city: "부산",
    price: 98000,
    rating: 4.2
  },
  {
    name: "제주 힐링 리조트",
    city: "제주",
    price: 150000,
    rating: 4.8
  }
];

// 호텔 리스트 가져오기
const hotelList = document.getElementById("hotel-list");

// 호텔을 화면에 뿌려주는 함수
hotels.forEach(hotel => {
  const div = document.createElement("div");
  div.className = "hotel";

  div.innerHTML = `
    <h2>${hotel.name}</h2>
    <p>📍 ${hotel.city}</p>
    <p>⭐ ${hotel.rating}</p>
    <p class="price">₩ ${hotel.price.toLocaleString()}</p>
  `;

  hotelList.appendChild(div);
});
