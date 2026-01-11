const hotels = [
  {
    id: 1,
    name: "서울 센트럴 호텔",
    city: "서울",
    price: 120000,
    rating: 4.5,
    desc: "서울 중심에 위치한 편안한 호텔"
  },
  {
    id: 2,
    name: "부산 오션뷰 호텔",
    city: "부산",
    price: 98000,
    rating: 4.2,
    desc: "바다 전망이 아름다운 호텔"
  },
  {
    id: 3,
    name: "제주 힐링 리조트",
    city: "제주",
    price: 150000,
    rating: 4.8,
    desc: "자연 속에서 쉬는 힐링 리조트"
  }
];

const list = document.getElementById("hotel-list");
const detail = document.getElementById("detail");
const search = document.getElementById("search");

function renderList(data) {
  list.innerHTML = "";
  detail.style.display = "none";

  data.forEach(hotel => {
    const div = document.createElement("div");
    div.className = "hotel";

    div.innerHTML = `
      <h2>${hotel.name}</h2>
      <p>📍 ${hotel.city}</p>
      <p class="price">₩ ${hotel.price.toLocaleString()}</p>
    `;

    div.onclick = () => showDetail(hotel);
    list.appendChild(div);
  });
}

function showDetail(hotel) {
  detail.style.display = "block";
  detail.innerHTML = `
    <h2>${hotel.name}</h2>
    <p>도시: ${hotel.city}</p>
    <p>평점: ⭐ ${hotel.rating}</p>
    <p>${hotel.desc}</p>
    <p class="price">₩ ${hotel.price.toLocaleString()}</p>
    <button onclick="back()">목록으로</button>
  `;
  list.innerHTML = "";
}

function back() {
  renderList(hotels);
}

search.addEventListener("input", () => {
  const value = search.value.trim();
  const filtered = hotels.filter(h =>
    h.city.includes(value)
  );
  renderList(filtered);
});

renderList(hotels);
