  /* ==========================================================
     1. LOADING SCREEN
  ========================================================== */
  window.addEventListener('load', function(){
    const loader = document.getElementById('loading-screen');
    setTimeout(function(){ loader.classList.add('hide'); }, 500);
  });

  /* ==========================================================
     2. NAVBAR SCROLL + BACK TO TOP
  ========================================================== */
  const navbar = document.getElementById('mainNavbar');
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', function(){
    if(window.scrollY > 40){ navbar.classList.add('scrolled'); } else { navbar.classList.remove('scrolled'); }
    if(window.scrollY > 400){ backToTop.classList.add('visible'); } else { backToTop.classList.remove('visible'); }
  });
  backToTop.addEventListener('click', function(){ window.scrollTo({ top: 0, behavior: 'smooth' }); });

  /* ==========================================================
     3. RIPPLE BUTTON
  ========================================================== */
  document.addEventListener('click', function(e){
    const btn = e.target.closest('.btn-ripple');
    if(!btn) return;
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    ripple.className = 'ripple-span';
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
    btn.appendChild(ripple);
    setTimeout(function(){ ripple.remove(); }, 600);
  });

  /* ==========================================================
     4. DATA POOL MENU (7 PILIHAN PER WAKTU MAKAN)
     Susunan menu ini yang akan "dirotasi" penempatan harinya
  ========================================================== */
  const pagiPool = [
    'Nasi Uduk Ayam Suwir', 'Bubur Ayam Kampung', 'Roti Bakar Cokelat Keju',
    'Nasi Kuning Komplit', 'Lontong Sayur Padang', 'Bubur Kacang Hijau', 'Nasi Uduk Telur Dadar'
  ];
  const siangPool = [
    'Ayam Geprek Sambal Bawang', 'Rendang Daging Sapi', 'Sayur Asem Iga',
    'Ikan Nila Bakar Kecap', 'Tempe Orek Kentang', 'Ayam Bakar Madu', 'Gulai Ayam Kampung'
  ];
  const malamPool = [
    'Soto Ayam Lamongan', 'Nasi Goreng Kampung', 'Sop Iga Sapi',
    'Nasi Ayam Rica-Rica', 'Pepes Ikan Kembung', 'Capcay Kuah Ayam', 'Mie Goreng Jawa'
  ];

  const dayNames = ['Senin', 'Selasa', 'Rabu', 'Kamis', "Jumat", 'Sabtu', 'Minggu'];

  /* ==========================================================
     5. STATE
  ========================================================== */
  let currentPaketType = 'mingguan'; // 'mingguan' | 'bulanan'
  let weekOffset = 0;                // untuk navigasi mingguan (bisa maju/mundur)
  let selectedMonthWeek = 0;         // untuk tab bulanan (0-3)

  /* ==========================================================
     6. BACA PARAMETER URL (?paket=mingguan / bulanan)
  ========================================================== */
  const urlParams = new URLSearchParams(window.location.search);
  const paketParam = urlParams.get('paket');
  if(paketParam === 'bulanan'){ currentPaketType = 'bulanan'; }

  /* ==========================================================
     7. UTIL: HITUNG NOMOR MINGGU (UNTUK ROTASI)
  ========================================================== */
  function getWeekNumber(date){
    const firstJan = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date - firstJan) / (24 * 60 * 60 * 1000));
    return Math.floor((days + firstJan.getDay()) / 7);
  }

  function getMondayOfWeek(offsetWeeks){
    const today = new Date();
    const day = today.getDay(); // 0 = Minggu
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diffToMonday + (offsetWeeks * 7));
    monday.setHours(0,0,0,0);
    return monday;
  }

  function formatTanggalPendek(date){
    const bulan = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
    return date.getDate() + ' ' + bulan[date.getMonth()];
  }
  function formatTanggalLengkap(date){
    const bulan = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
    return date.getDate() + ' ' + bulan[date.getMonth()] + ' ' + date.getFullYear();
  }

  /* ==========================================================
     8. RENDER JADWAL BERDASARKAN ROTASI
     Rotasi: pool menu digeser sebanyak (nomor minggu) posisi,
     jadi tiap minggu susunan hari-ke-menu berbeda.
  ========================================================== */
  const jadwalGrid = document.getElementById('jadwalGrid');

  function rotateArray(arr, shift){
    const n = arr.length;
    const s = ((shift % n) + n) % n;
    return arr.slice(s).concat(arr.slice(0, s));
  }

  function renderJadwal(rotationIndex, mondayDate){
    const pagiRotated = rotateArray(pagiPool, rotationIndex);
    const siangRotated = rotateArray(siangPool, rotationIndex * 2);
    const malamRotated = rotateArray(malamPool, rotationIndex * 3);

    const todayStr = new Date().toDateString();

    jadwalGrid.innerHTML = '';

    for(let i = 0; i < 7; i++){
      const cellDate = new Date(mondayDate);
      cellDate.setDate(mondayDate.getDate() + i);
      const isToday = cellDate.toDateString() === todayStr;

      const card = document.createElement('div');
      card.className = 'day-card' + (isToday ? ' is-today' : '');
      card.innerHTML = `
        <div class="day-card-header">
          <div class="day-name">${dayNames[i]}</div>
          <div class="day-date">${formatTanggalPendek(cellDate)}</div>
          ${isToday ? '<div class="day-today-badge">Hari Ini</div>' : ''}
        </div>
        <div class="meal-slot">
          <div class="meal-slot-label"><i class="bi bi-sunrise"></i> Pagi</div>
          <div class="meal-slot-menu">${pagiRotated[i]}</div>
        </div>
        <div class="meal-slot">
          <div class="meal-slot-label"><i class="bi bi-sun"></i> Siang</div>
          <div class="meal-slot-menu">${siangRotated[i]}</div>
        </div>
        <div class="meal-slot">
          <div class="meal-slot-label"><i class="bi bi-moon-stars"></i> Malam</div>
          <div class="meal-slot-menu">${malamRotated[i]}</div>
        </div>
      `;
      jadwalGrid.appendChild(card);
    }

    // Animasi muncul bertahap
    const cards = jadwalGrid.querySelectorAll('.day-card');
    cards.forEach(function(card, index){
      setTimeout(function(){ card.classList.add('show'); }, index * 80);
    });
  }

  /* ==========================================================
     9. MODE MINGGUAN: NAVIGASI MINGGU
  ========================================================== */
  const weekRangeTitle = document.getElementById('weekRangeTitle');
  const weekRangeSub = document.getElementById('weekRangeSub');
  const prevWeekBtn = document.getElementById('prevWeekBtn');
  const nextWeekBtn = document.getElementById('nextWeekBtn');

  function renderMingguan(){
    const monday = getMondayOfWeek(weekOffset);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    weekRangeTitle.textContent = weekOffset === 0 ? 'Minggu Ini' : (weekOffset > 0 ? 'Minggu Depan (+' + weekOffset + ')' : 'Minggu Lalu (' + weekOffset + ')');
    weekRangeSub.textContent = formatTanggalPendek(monday) + ' - ' + formatTanggalLengkap(sunday);

    prevWeekBtn.disabled = weekOffset <= -2;
    nextWeekBtn.disabled = weekOffset >= 3;

    const rotationIndex = getWeekNumber(monday);
    renderJadwal(rotationIndex, monday);
  }

  prevWeekBtn.addEventListener('click', function(){
    if(weekOffset > -2){ weekOffset--; renderMingguan(); }
  });
  nextWeekBtn.addEventListener('click', function(){
    if(weekOffset < 3){ weekOffset++; renderMingguan(); }
  });

  /* ==========================================================
     10. MODE BULANAN: TAB MINGGU 1-4
  ========================================================== */
  function renderBulanan(){
    const firstMonday = getMondayOfWeek(0);
    const targetMonday = new Date(firstMonday);
    targetMonday.setDate(firstMonday.getDate() + (selectedMonthWeek * 7));

    const rotationIndex = getWeekNumber(firstMonday) + selectedMonthWeek;
    renderJadwal(rotationIndex, targetMonday);
  }

  document.querySelectorAll('.month-tab-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      document.querySelectorAll('.month-tab-btn').forEach(function(b){ b.classList.remove('active'); });
      this.classList.add('active');
      selectedMonthWeek = parseInt(this.getAttribute('data-week'), 10);
      renderBulanan();
    });
  });

  /* ==========================================================
     11. TOGGLE JENIS PAKET (MINGGUAN / BULANAN)
  ========================================================== */
  const paketTypeLabel = document.getElementById('paketTypeLabel');
  const paketTypeBadge = document.getElementById('paketTypeBadge');
  const weekNavigator = document.getElementById('weekNavigator');
  const monthTabsWrap = document.getElementById('monthTabsWrap');

  function updatePaketTypeView(){
    document.querySelectorAll('.paket-switch-btn').forEach(function(btn){
      btn.classList.toggle('active', btn.getAttribute('data-paket') === currentPaketType);
    });

    if(currentPaketType === 'mingguan'){
      paketTypeLabel.textContent = 'Paket Mingguan';
      paketTypeBadge.querySelector('i').className = 'bi bi-calendar-week';
      weekNavigator.style.display = 'flex';
      monthTabsWrap.style.display = 'none';
      renderMingguan();
    } else {
      paketTypeLabel.textContent = 'Paket Bulanan';
      paketTypeBadge.querySelector('i').className = 'bi bi-calendar-month';
      weekNavigator.style.display = 'none';
      monthTabsWrap.style.display = 'flex';
      selectedMonthWeek = 0;
      document.querySelectorAll('.month-tab-btn').forEach(function(b, idx){ b.classList.toggle('active', idx === 0); });
      renderBulanan();
    }
  }

  document.querySelectorAll('.paket-switch-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      currentPaketType = this.getAttribute('data-paket');
      weekOffset = 0;
      updatePaketTypeView();
    });
  });

  /* ==========================================================
     12. TOAST NOTIFIKASI
  ========================================================== */
  let toastTimeout;
  function showToast(message){
    const toast = document.getElementById('toastDK');
    document.getElementById('toastMessage').textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(function(){ toast.classList.remove('show'); }, 2800);
  }

  /* ==========================================================
     13. INISIALISASI
  ========================================================== */
  updatePaketTypeView();
