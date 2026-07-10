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
     4. DATA PESANAN (DUMMY)
  ========================================================== */
  const ordersData = [
    {
      kode: 'DK-20260708-01',
      tanggal: '8 Juli 2026, 11:20',
      status: 'diproses',
      total: 67000,
      items: [
        { nama: 'Ayam Geprek Sambal Bawang', img: 'assets/images/menu/ayam-geprek.png' },
        { nama: 'Es Teh Manis', img: 'assets/images/menu/es-teh.png' }
      ]
    },
    {
      kode: 'DK-20260707-04',
      tanggal: '7 Juli 2026, 18:05',
      status: 'dikirim',
      total: 43000,
      items: [
        { nama: 'Soto Ayam Lamongan', img: 'assets/images/menu/soto-ayam.png' },
        { nama: 'Es Jeruk Peras', img: 'assets/images/menu/es-jeruk.png' }
      ]
    },
    {
      kode: 'DK-20260707-01',
      tanggal: '7 Juli 2026, 07:40',
      status: 'menunggu',
      total: 25000,
      items: [
        { nama: 'Nasi Uduk Ayam Suwir', img: 'assets/images/menu/nasi-uduk-ayam.png' }
      ]
    },
    {
      kode: 'DK-20260705-02',
      tanggal: '5 Juli 2026, 12:10',
      status: 'selesai',
      total: 58000,
      items: [
        { nama: 'Rendang Daging Sapi', img: 'assets/images/menu/rendang.png' },
        { nama: 'Es Cendol Durian', img: 'assets/images/menu/es-cendol.png' }
      ]
    },
    {
      kode: 'DK-20260703-06',
      tanggal: '3 Juli 2026, 19:30',
      status: 'selesai',
      total: 34000,
      items: [
        { nama: 'Nasi Goreng Kampung', img: 'assets/images/menu/nasi-goreng.png' },
        { nama: 'Kopi Susu Gula Aren', img: 'assets/images/menu/kopi-susu.png' }
      ]
    },
    {
      kode: 'DK-20260701-03',
      tanggal: '1 Juli 2026, 08:15',
      status: 'selesai',
      total: 21000,
      items: [
        { nama: 'Bubur Ayam Kampung', img: 'assets/images/menu/bubur-ayam.png' }
      ]
    }
  ];

  const statusLabel = {
    menunggu: 'Menunggu',
    diproses: 'Diproses',
    dikirim: 'Dikirim',
    selesai: 'Selesai'
  };

  const statusIcon = {
    menunggu: 'bi-hourglass-split',
    diproses: 'bi-gear-fill',
    dikirim: 'bi-truck',
    selesai: 'bi-check-circle-fill'
  };

  const timelineSteps = ['menunggu', 'diproses', 'dikirim', 'selesai'];

  /* ==========================================================
     5. STATE
  ========================================================== */
  let currentTab = 'aktif';
  let currentStatusFilter = 'semua';
  let currentSearch = '';

  const orderList = document.getElementById('orderList');
  const emptyState = document.getElementById('emptyState');

  function formatRupiah(angka){
    return 'Rp' + angka.toLocaleString('id-ID');
  }

  function isActiveOrder(order){
    return order.status === 'menunggu' || order.status === 'diproses' || order.status === 'dikirim';
  }

  function updateTabCounts(){
    const aktifCount = ordersData.filter(isActiveOrder).length;
    const riwayatCount = ordersData.filter(function(o){ return o.status === 'selesai'; }).length;
    document.getElementById('countAktif').textContent = aktifCount;
    document.getElementById('countRiwayat').textContent = riwayatCount;
  }

  function getFilteredOrders(){
    return ordersData.filter(function(order){
      const matchTab = currentTab === 'aktif' ? isActiveOrder(order) : order.status === 'selesai';
      const matchStatus = currentStatusFilter === 'semua' || order.status === currentStatusFilter;
      const searchLower = currentSearch.toLowerCase();
      const matchSearch = order.kode.toLowerCase().includes(searchLower) ||
                           order.items.some(function(item){ return item.nama.toLowerCase().includes(searchLower); });
      return matchTab && matchStatus && matchSearch;
    });
  }

  function buildTimeline(order){
    if(order.status === 'menunggu' && currentTab === 'riwayat'){
      // safety, shouldn't reach here
    }
    const currentIndex = timelineSteps.indexOf(order.status);
    let html = '<div class="order-timeline">';
    timelineSteps.forEach(function(step, index){
      let stateClass = '';
      if(index < currentIndex) stateClass = 'completed';
      else if(index === currentIndex) stateClass = order.status === 'selesai' ? 'completed' : 'current';

      const iconHtml = (stateClass === 'completed') ? '<i class="bi bi-check-lg"></i>' : `<i class="bi ${statusIcon[step]}"></i>`;

      html += `
        <div class="timeline-step ${stateClass}">
          <div class="timeline-dot">${iconHtml}</div>
          <div class="timeline-label">${statusLabel[step]}</div>
        </div>
      `;
    });
    html += '</div>';
    return html;
  }

  function renderOrders(){
    const filtered = getFilteredOrders();
    orderList.innerHTML = '';

    if(filtered.length === 0){
      emptyState.classList.add('show');
    } else {
      emptyState.classList.remove('show');
    }

    filtered.forEach(function(order){
      const card = document.createElement('div');
      card.className = 'order-card reveal';

      const itemsHtml = order.items.map(function(item){
        return `<div class="order-item-chip"><img src="${item.img}" alt="${item.nama}"> ${item.nama}</div>`;
      }).join('');

      const pesanLagiBtn = order.status === 'selesai'
        ? `<button type="button" class="btn-order-again btn-ripple btn-pesan-lagi" data-kode="${order.kode}"><i class="bi bi-arrow-repeat"></i> Pesan Lagi</button>`
        : '';

      card.innerHTML = `
        <div class="order-card-top">
          <div>
            <div class="order-code">${order.kode}</div>
            <div class="order-date"><i class="bi bi-calendar3"></i> ${order.tanggal}</div>
          </div>
          <div class="status-badge status-${order.status}">
            <i class="bi ${statusIcon[order.status]}"></i> ${statusLabel[order.status]}
          </div>
        </div>

        <div class="order-items-mini">${itemsHtml}</div>

        <div class="order-total-row">
          <span class="order-total-label">Total Pesanan</span>
          <span class="order-total-value">${formatRupiah(order.total)}</span>
        </div>

        ${buildTimeline(order)}

        <div class="order-actions">
          <button type="button" class="btn-order-detail btn-ripple">Lihat Detail</button>
          ${pesanLagiBtn}
        </div>
      `;

      orderList.appendChild(card);
    });

    // Reveal animation untuk card baru
    document.querySelectorAll('#orderList .reveal').forEach(function(el){
      requestAnimationFrame(function(){ el.classList.add('show'); });
    });

    updateTabCounts();
  }

  /* ==========================================================
     6. TAB SWITCH
  ========================================================== */
  document.querySelectorAll('.riwayat-tab-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      document.querySelectorAll('.riwayat-tab-btn').forEach(function(b){ b.classList.remove('active'); });
      this.classList.add('active');
      currentTab = this.getAttribute('data-tab');
      renderOrders();
    });
  });

  /* ==========================================================
     7. FILTER STATUS
  ========================================================== */
  document.getElementById('filterStatusWrap').addEventListener('click', function(e){
    const btn = e.target.closest('.filter-status-btn');
    if(!btn) return;
    document.querySelectorAll('.filter-status-btn').forEach(function(b){ b.classList.remove('active'); });
    btn.classList.add('active');
    currentStatusFilter = btn.getAttribute('data-status');
    renderOrders();
  });

  /* ==========================================================
     8. SEARCH REALTIME
  ========================================================== */
  document.getElementById('searchInput').addEventListener('input', function(){
    currentSearch = this.value;
    renderOrders();
  });

  /* ==========================================================
     9. AKSI TOMBOL (DELEGATED)
  ========================================================== */
  orderList.addEventListener('click', function(e){
    const detailBtn = e.target.closest('.btn-order-detail');
    const pesanLagiBtn = e.target.closest('.btn-pesan-lagi');

    if(detailBtn){
      showToast('Membuka detail pesanan...');
    }

    if(pesanLagiBtn){
      const kode = pesanLagiBtn.getAttribute('data-kode');
      showToast('Menu dari pesanan ' + kode + ' ditambahkan ke keranjang');
    }
  });

  /* ==========================================================
     10. TOAST NOTIFIKASI
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
     11. INISIALISASI
  ========================================================== */
  renderOrders();
