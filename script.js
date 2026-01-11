let selectedHotel = null;
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
  selectedHotel = hotel;   // ⭐ 추가
  window.scrollTo(0, 0);

  detail.style.display = "block";
  detail.innerHTML = `
    <div class="detail-card">
      <img src="https://picsum.photos/600/300?random=${hotel.id}" />

      <h2>${hotel.name}</h2>

      <div class="detail-rating">
        ⭐ ${hotel.rating} / 5
      </div>
function showDetail(hotel) {

      <p>${hotel.desc}</p>

      <p class="price">₩ ${hotel.price.toLocaleString()}</p>

      <button class="reserve-btn" onclick="reserve()">
        예약하기
      </button>

      <br><br>

      <button class="back-btn" onclick="back()">← 목록으로</button>

    </div>
  `;

  list.innerHTML = "";
}




function back() {
  detail.style.display = "none";

  document.querySelector("header").style.display = "block";
  list.style.display = "block";

  renderList(hotels);
}

function reserve() {
  // 클릭을 막는 요소들 전부 숨김
  document.querySelector("header").style.display = "none";
  list.style.display = "none";

  detail.style.display = "block";

 detail.innerHTML = `
  <div class="detail-card">
    <h2>날짜 선택</h2>

    <div class="date-box">
      <label>체크인</label>
      <input type="date" id="checkin">
    </div>

    <div class="date-box">
      <label>체크아웃</label>
      <input type="date" id="checkout">
    </div>

    <p id="result"></p>

    <button class="reserve-btn" onclick="completeReserve()">
      예약 완료
    </button>

    <br><br>

    <button class="back-btn" onclick="back()">← 취소</button>
  </div>
`;

}




function completeReserve() {
  const inDate = document.getElementById("checkin").value;
  const outDate = document.getElementById("checkout").value;

  if (!inDate || !outDate) {
    alert("날짜를 선택해주세요");
    return;
  }

  if (outDate <= inDate) {
    alert("체크아웃 날짜는 체크인 이후여야 합니다");
    return;
  }

  alert(
    `예약 완료!\n체크인: ${inDate}\n체크아웃: ${outDate}`
  );
}
const checkinInput = () => document.getElementById("checkin");
const checkoutInput = () => document.getElementById("checkout");
const resultBox = () => document.getElementById("result");

document.addEventListener("change", (e) => {
  if (e.target.id === "checkin" || e.target.id === "checkout") {
    calculate();
  }
});

function calculate() {
  const checkin = new Date(checkinInput().value);
  const checkout = new Date(checkoutInput().value);

  if (!checkinInput().value || !checkoutInput().value) return;

  const diffTime = checkout - checkin;
  const nights = diffTime / (1000 * 60 * 60 * 24);

  if (nights <= 0) {
    resultBox().innerHTML = "❗ 체크아웃 날짜를 다시 선택하세요";
    return;
  }

  const total = nights * selectedHotel.price;

  resultBox().innerHTML = `
    🛏 숙박일 수: <b>${nights}박</b><br>
    💰 총 금액: <b>₩ ${total.toLocaleString()}</b>
  `;
}
function completeReserve() {
  alert("예약이 완료되었습니다!");
}

detail.style.display = "none";
renderList(hotels);
