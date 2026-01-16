diff --git a/index.html b/index.html
index 10647efbf3b710d6093b1c250d8084eda65c991f..252ef78c5d64c2a0e730dcef32606aca3867f682 100644
--- a/index.html
+++ b/index.html
@@ -33,56 +33,84 @@ const HOTELS = [
   {
     id: 2,
     name: "시그니엘 서울",
     location: "서울, 송파구",
     price: 650000,
     rating: 4.9,
     image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1000",
     tags: ["전망좋은", "초럭셔리"],
     desc: "국내 최고층 롯데월드타워에 위치하여, 구름 위에서 잠드는 듯한 초현실적인 경험과 파노라마 시티뷰를 제공합니다."
   },
   {
     id: 3,
     name: "L7 강남 by LOTTE",
     location: "서울, 강남구",
     price: 180000,
     rating: 4.5,
     image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=1000",
     tags: ["비즈니스", "모던"],
     desc: "테헤란로의 중심에서 즐기는 트렌디하고 감각적인 휴식. 비즈니스와 레저를 동시에 만족시키는 라이프스타일 호텔입니다."
   }
 ];
 
 export default function App() {
   const [view, setView] = useState('home');
   const [selectedHotel, setSelectedHotel] = useState(null);
+  const [calendarMonthOffset, setCalendarMonthOffset] = useState(0);
+  const [selectedDate, setSelectedDate] = useState(new Date());
 
   // 화면 전환 시 최상단으로 스크롤 이동
   useEffect(() => {
     window.scrollTo(0, 0);
   }, [view]);
 
+  const getMonthMeta = (offset = 0) => {
+    const baseDate = new Date();
+    const startOfMonth = new Date(baseDate.getFullYear(), baseDate.getMonth() + offset, 1);
+    const year = startOfMonth.getFullYear();
+    const month = startOfMonth.getMonth();
+    const daysInMonth = new Date(year, month + 1, 0).getDate();
+    return {
+      year,
+      month,
+      daysInMonth,
+      firstWeekday: startOfMonth.getDay()
+    };
+  };
+
+  const isSameDay = (left, right) =>
+    left.getFullYear() === right.getFullYear() &&
+    left.getMonth() === right.getMonth() &&
+    left.getDate() === right.getDate();
+
+  const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
+  const weekdayNames = ['일', '월', '화', '수', '목', '금', '토'];
+
+  const formatMonthLabel = (year, monthIndex) => `${year}년 ${monthNames[monthIndex]}`;
+  const formatSelectedDate = (date) =>
+    `${monthNames[date.getMonth()]} ${date.getDate()}일 (${weekdayNames[date.getDay()]})`;
+
   // --- 1. 홈 화면 (platenokorea 메인) ---
   const HomeView = () => (
     <div className="flex flex-col pb-32 bg-gray-50 min-h-screen w-full">
       {/* 상단 투명 헤더 */}
       <div className="absolute top-0 left-0 right-0 z-30 flex justify-between items-center px-6 pt-12">
         <h1 className="text-xl font-black italic tracking-tighter text-white drop-shadow-lg" translate="no">hotelmaster</h1>
         <div className="flex gap-2">
           <div className="p-2 bg-black/20 backdrop-blur-md rounded-full text-white border border-white/20 active:scale-90">
             <Bell size={20} />
           </div>
           <div className="p-2 bg-black/20 backdrop-blur-md rounded-full text-white border border-white/20 active:scale-90">
             <User size={20} />
           </div>
         </div>
       </div>
 
       {/* 히어로 영역 */}
       <div className="h-[26rem] relative overflow-hidden rounded-b-[3.5rem] shadow-lg">
         <img 
           src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1200" 
           className="absolute inset-0 w-full h-full object-cover"
           alt="Luxury Hotel"
         />
         <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-black/10 to-black/40"></div>
         <div className="absolute bottom-24 left-8 right-8 text-white">
@@ -241,55 +269,156 @@ export default function App() {
              <p className="font-black text-gray-900 text-sm tracking-tight">보유</p>
           </div>
           <div className="bg-gray-50 p-4 rounded-3xl text-center border border-gray-100">
              <p className="text-[10px] text-gray-400 font-bold mb-1">와이파이</p>
              <p className="font-black text-gray-900 text-sm tracking-tight">무료</p>
           </div>
         </div>
       </div>
 
       {/* 하단 예약 바 */}
       <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 p-6 flex items-center justify-between z-50 max-w-md mx-auto rounded-t-3xl shadow-2xl">
         <div>
           <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">합계 요금 (1박)</p>
           <p className="text-2xl font-black text-blue-600">₩{selectedHotel.price.toLocaleString()}</p>
         </div>
         <button 
           onClick={() => alert("예약 페이지로 이동합니다.")}
           className="bg-blue-600 text-white px-10 py-4.5 rounded-[2rem] font-black shadow-xl shadow-blue-100 active:scale-95 transition-transform"
         >
           예약하기
         </button>
       </div>
     </div>
   );
 
+  // --- 4. 캘린더 화면 ---
+  const CalendarView = () => {
+    const { year, month, daysInMonth, firstWeekday } = getMonthMeta(calendarMonthOffset);
+    const today = new Date();
+    const monthLabel = formatMonthLabel(year, month);
+    const weekDays = weekdayNames;
+
+    const cells = [
+      ...Array.from({ length: firstWeekday }, () => null),
+      ...Array.from({ length: daysInMonth }, (_, idx) => idx + 1)
+    ];
+
+    return (
+      <div className="bg-gray-50 min-h-screen pb-32 w-full">
+        <div className="bg-white/90 backdrop-blur-md px-6 py-5 flex items-center justify-between sticky top-0 z-30 border-b border-gray-100">
+          <h2 className="font-black text-lg text-gray-900 tracking-tight">내 예약 캘린더</h2>
+          <div className="flex gap-2">
+            <button
+              onClick={() => setCalendarMonthOffset((prev) => prev - 1)}
+              className="p-2 bg-gray-50 rounded-full active:scale-90 transition-transform"
+            >
+              <ChevronLeft size={18} />
+            </button>
+            <button
+              onClick={() => setCalendarMonthOffset((prev) => prev + 1)}
+              className="p-2 bg-gray-50 rounded-full active:scale-90 transition-transform rotate-180"
+            >
+              <ChevronLeft size={18} />
+            </button>
+          </div>
+        </div>
+
+        <div className="px-6 pt-6">
+          <div className="flex items-center justify-between bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
+            <div>
+              <p className="text-[11px] uppercase text-gray-400 font-bold mb-1">선택한 날짜</p>
+              <p className="text-xl font-black text-gray-900">{formatSelectedDate(selectedDate)}</p>
+            </div>
+            <div className="w-12 h-12 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center">
+              <Calendar size={22} />
+            </div>
+          </div>
+
+          <div className="mt-6 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
+            <div className="flex items-center justify-between mb-4">
+              <h3 className="font-black text-lg text-gray-900">{monthLabel}</h3>
+              <button
+                onClick={() => {
+                  setCalendarMonthOffset(0);
+                  setSelectedDate(new Date());
+                }}
+                className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full"
+              >
+                오늘
+              </button>
+            </div>
+            <div className="grid grid-cols-7 text-center text-[11px] text-gray-400 font-bold mb-3">
+              {weekDays.map((day) => (
+                <span key={day}>{day}</span>
+              ))}
+            </div>
+            <div className="grid grid-cols-7 gap-2 text-center">
+              {cells.map((day, idx) => {
+                if (!day) {
+                  return <div key={`empty-${idx}`} className="h-10" />;
+                }
+                const cellDate = new Date(year, month, day);
+                const isToday = isSameDay(cellDate, today);
+                const isSelected = isSameDay(cellDate, selectedDate);
+                return (
+                  <button
+                    key={day}
+                    onClick={() => setSelectedDate(cellDate)}
+                    className={`h-10 rounded-2xl text-sm font-bold transition-all ${
+                      isSelected
+                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
+                        : 'bg-gray-50 text-gray-700 hover:bg-blue-50'
+                    } ${isToday && !isSelected ? 'border border-blue-200 text-blue-600' : ''}`}
+                  >
+                    {day}
+                  </button>
+                );
+              })}
+            </div>
+          </div>
+
+          <div className="mt-6 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
+            <h3 className="font-black text-lg text-gray-900 mb-4">선택일 예약</h3>
+            <div className="bg-gray-50 rounded-2xl p-4 text-sm text-gray-500 leading-relaxed">
+              예약 내역이 없습니다. 새로운 여행을 계획해 보세요!
+            </div>
+          </div>
+        </div>
+      </div>
+    );
+  };
+
   return (
     <div className="w-full max-w-md mx-auto bg-gray-50 min-h-screen relative shadow-2xl overflow-hidden font-sans border-x border-gray-100">
       {view === 'home' && <HomeView />}
       {view === 'list' && <ListView />}
       {view === 'detail' && selectedHotel && <DetailView />}
+      {view === 'calendar' && <CalendarView />}
 
       {/* 공통 하단 탭바 */}
       {view !== 'detail' && (
         <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-xl border-t border-gray-100 px-8 py-4 flex justify-between items-center z-40 rounded-t-3xl shadow-sm">
           <button onClick={() => setView('home')} className={`flex flex-col items-center gap-1 transition-colors ${view === 'home' ? 'text-blue-600' : 'text-gray-300'}`}>
             <Home size={22} strokeWidth={view === 'home' ? 3 : 2} />
             <span className="text-[10px] font-black">홈</span>
           </button>
           <button onClick={() => setView('list')} className={`flex flex-col items-center gap-1 transition-colors ${view === 'list' ? 'text-blue-600' : 'text-gray-300'}`}>
             <Search size={22} strokeWidth={view === 'list' ? 3 : 2} />
             <span className="text-[10px] font-black">검색</span>
           </button>
-          <button className="flex flex-col items-center gap-1 text-gray-300">
-            <Calendar size={22} />
+          <button
+            onClick={() => setView('calendar')}
+            className={`flex flex-col items-center gap-1 transition-colors ${view === 'calendar' ? 'text-blue-600' : 'text-gray-300'}`}
+          >
+            <Calendar size={22} strokeWidth={view === 'calendar' ? 3 : 2} />
             <span className="text-[10px] font-black">내예약</span>
           </button>
           <button className="flex flex-col items-center gap-1 text-gray-300">
             <Menu size={22} />
             <span className="text-[10px] font-black">전체</span>
           </button>
         </div>
       )}
     </div>
   );
 }




