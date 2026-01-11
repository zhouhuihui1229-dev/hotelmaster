// -------------------- 데이터 --------------------
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

// -------------------- 상태 --------------------
let selectedHotel = null;

// -------------------- DOM --------------------
const listEl = document.getElementById("hotel-list");
const detailEl = document.getElementById("detail");
const searchEl = document.getElementById("search");

// -------------------- 공통 렌더 --------------------
function showListView() {
  detailEl.style.display = "none";
  listEl.style.display = "block";
}

function showDetailView() {
  listEl.style.display = "none";
  detailEl.style.display = "block";
  window.scrollTo(0, 0);
}

// -------------------- 리스트 --------------------
function renderList(data) {
  showListView();
  listEl.innerHTML = "";

  data.forEach(hotel => {
    const div = document.createElement("div");
    div.className = "hotel";

    div.innerHTML = `
      <h2>${hotel.name}</h2>
      <p class="meta">📍 ${hotel.city} · ⭐ ${hotel.rating}</p>
      <p class="price">₩ ${hotel.price.toLocaleString()} / 1박</p>
    `;

    div.addEventListener("click", () => renderDetail(hotel));
    listEl.appendChild(div);
  });
}

// -------------------- 상세 --------------------
function renderDetail(hotel) {
  selectedHotel = hotel;
  showDetailView();

  detailEl.innerHTML = `
    <div class="detail-card">
      <img src="https://picsum.photos/900/420?random=${hotel.id}" alt="hotel"/>
      <h2>${hotel.name}</h2>
      <div class="detail-rating">⭐ ${hotel.rating} / 5</div>
      <p class="small">도시: ${hotel.city}</p>
      <p>${hotel.desc}</p>
      <p class="price">₩ ${hotel.price.toLocaleString()} / 1박</p>

      <button class="btn btn-primary" id="goReserve">예약하기</button>
      <button class="btn btn-ghost" id="goBack">← 목록으로</button>
    </div>
  `;

  document.getElementById("goReserve").addEventListener("click", renderReserve);
  document.getElementById("goBack").addEventListener("click", () => renderList(hotels));
}

// -------------------- 예약 --------------------
function renderReserve() {
  if (!selectedHotel) return renderList(hotels);

  showDetailView();

  detailEl.innerHTML = `
    <div class="detail-card">
      <h2>예약 날짜 선택</h2>
      <p class="small">${selectedHotel.name} · ₩ ${selectedHotel.price.toLocaleString()} / 1박</p>

      <div class="date-box">
        <label>체크인</label>
        <input type="date" id="checkin" />
      </div>

      <div class="date-box">
        <label>체크아웃</label>
        <input type="date" id="checkout" />
      </div>

      <div class="summary" id="summary">
        날짜를 선택하면 숙박일 수와 총 금액이 계산됩니다.
      </div>

      <button class="btn btn-primary" id="payBtn">결제(완료)하기</button>
      <button class="btn btn-ghost" id="cancelBtn">← 취소</button>
    </div>
  `;

  const checkin = document.getElementById("checkin");
  const checkout = document.getElementById("checkout");
  const payBtn = document.getElementById("payBtn");
  const cancelBtn = document.getElementById("cancelBtn");

  checkin.addEventListener("change", updatePrice);
  checkout.addEventListener("change", updatePrice);

  payBtn.addEventListener("click", completePayment);
  cancelBtn.addEventListener("click", () => renderDetail(selectedHotel));
}

function calcNights(inDate, outDate) {
  const start = new Date(inDate);
  const end = new Date(outDate);
  const diff = (end - start) / (1000 * 60 * 60 * 24);
  return diff;
}

function updatePrice() {
  const inDate = document.getElementById("checkin").value;
  const outDate = document.getElementById("checkout").value;
  const summary = document.getElementById("summary");

  if (!inDate || !outDate) {
    summary.textContent = "날짜를 선택하면 숙박일 수와 총 금액이 계산됩니다.";
    return;
  }

  const nights = calcNights(inDate, outDate);

  if (nights <= 0) {
    summary.textContent = "체크아웃 날짜는 체크인 이후여야 합니다.";
    return;
  }

  const total = nights * selectedHotel.price;

  summary.innerHTML = `
    🛏 숙박일 수: <b>${nights}박</b><br/>
    💰 총 금액: <b>₩ ${total.toLocaleString()}</b>
  `;
}

function completePayment() {
  const inDate = document.getElementById("checkin").value;
  const outDate = document.getElementById("checkout").value;

  if (!inDate || !outDate) {
    alert("체크인/체크아웃 날짜를 선택해주세요.");
    return;
  }

  const nights = calcNights(inDate, outDate);
  if (nights <= 0) {
    alert("체크아웃 날짜는 체크인 이후여야 합니다.");
    return;
  }

  const total = nights * selectedHotel.price;

  // (선택) 예약내역 저장: localStorage
  const booking = {
    hotelId: selectedHotel.id,
    hotelName: selectedHotel.name,
    city: selectedHotel.city,
    checkin: inDate,
    checkout: outDate,
    nights,
    total,
    createdAt: new Date().toISOString()
  };

  const prev = JSON.parse(localStorage.getItem("bookings") || "[]");
  prev.unshift(booking);
  localStorage.setItem("bookings", JSON.stringify(prev));

  // 결제 완료 화면
  showDetailView();
  detailEl.innerHTML = `
    <div class="detail-card">
      <h2>결제 완료 ✅</h2>
      <p class="small">${booking.hotelName} · ${booking.city}</p>
      <div class="summary">
        체크인: <b>${booking.checkin}</b><br/>
        체크아웃: <b>${booking.checkout}</b><br/>
        숙박일 수: <b>${booking.nights}박</b><br/>
        결제 금액: <b>₩ ${booking.total.toLocaleString()}</b>
      </div>

      <button class="btn btn-primary" id="goHome">메인으로</button>
      <button class="btn btn-ghost" id="goDetail">호텔 상세로</button>
    </div>
  `;

  document.getElementById("goHome").addEventListener("click", () => renderList(hotels));
  document.getElementById("goDetail").addEventListener("click", () => renderDetail(selectedHotel));
}

// -------------------- 검색 --------------------
searchEl.addEventListener("input", () => {
  const v = searchEl.value.trim();
  const filtered = hotels.filter(h => h.city.includes(v) || h.name.includes(v));
  renderList(filtered);
});

// -------------------- 시작 --------------------
renderList(hotels);
