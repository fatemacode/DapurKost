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
  let orderItems = [
    { id:1, nama:"Ayam Geprek Sambal Bawang", harga:15000, qty:2, img:"assets/images/menu/ayam-geprek.png" },
    { id:2, nama:"Nasi Uduk Ayam Suwir", harga:12000, qty:1, img:"assets/images/menu/nasi-uduk-ayam.png" },
    { id:3, nama:"Es Teh Manis", harga:5000, qty:2, img:"assets/images/menu/es-teh.png" }
  ];

  const orderItemsList = document.getElementById('orderItemsList');

  function formatRupiah(angka){
    return 'Rp' + angka.toLocaleString('id-ID');
  }

  function renderOrderItems(){
    orderItemsList.innerHTML = '';
    orderItems.forEach(function(item){
      const div = document.createElement('div');
      div.className = 'order-item';
      div.innerHTML = `
        <img src="${item.img}" alt="${item.nama}" class="order-item-img">
        <div class="order-item-info">
          <div class="order-item-name">${item.nama}</div>
          <div class="order-item-price">${formatRupiah(item.harga)} / porsi</div>
        </div>
        <div class="qty-stepper">
          <button type="button" class="qty-btn btn-qty-minus" data-id="${item.id}" ${item.qty <= 1 ? 'disabled' : ''}><i class="bi bi-dash"></i></button>
          <span class="qty-value">${item.qty}</span>
          <button type="button" class="qty-btn btn-qty-plus" data-id="${item.id}"><i class="bi bi-plus"></i></button>
        </div>
        <div class="order-item-subtotal">${formatRupiah(item.harga * item.qty)}</div>
        <button type="button" class="remove-item-btn" data-id="${item.id}"><i class="bi bi-trash3"></i></button>
      `;
      orderItemsList.appendChild(div);
    });

    if(orderItems.length === 0){
      orderItemsList.innerHTML = '<p style="text-align:center; color:#8a5a5a; padding:20px 0;">Belum ada menu dipilih. <a href="menu.html" style="color:var(--merah); font-weight:600;">Pilih menu sekarang</a>.</p>';
    }

    calculateTotal();
  }

  orderItemsList.addEventListener('click', function(e){
    const plusBtn = e.target.closest('.btn-qty-plus');
    const minusBtn = e.target.closest('.btn-qty-minus');
    const removeBtn = e.target.closest('.remove-item-btn');

    if(plusBtn){
      const id = parseInt(plusBtn.getAttribute('data-id'), 10);
      const item = orderItems.find(function(i){ return i.id === id; });
      if(item){ item.qty++; renderOrderItems(); }
    }

    if(minusBtn){
      const id = parseInt(minusBtn.getAttribute('data-id'), 10);
      const item = orderItems.find(function(i){ return i.id === id; });
      if(item && item.qty > 1){ item.qty--; renderOrderItems(); }
    }

    if(removeBtn){
      const id = parseInt(removeBtn.getAttribute('data-id'), 10);
      orderItems = orderItems.filter(function(i){ return i.id !== id; });
      renderOrderItems();
      showToast('Menu dihapus dari pesanan');
    }
  });

  /* ==========================================================
     5. KALKULASI TOTAL OTOMATIS
  ========================================================== */
  const subtotalValue = document.getElementById('subtotalValue');
  const ongkirValue = document.getElementById('ongkirValue');
  const discountRow = document.getElementById('discountRow');
  const discountValue = document.getElementById('discountValue');
  const totalValue = document.getElementById('totalValue');

  const FREE_ONGKIR_THRESHOLD = 100000;
  const ONGKIR_NORMAL = 8000;

  const voucherList = {
    'HEMAT10': { type: 'percent', value: 10, label: 'Diskon 10%' },
    'DAPUR20K': { type: 'flat', value: 20000, label: 'Potongan Rp20.000' },
    'MAHASISWA5': { type: 'percent', value: 5, label: 'Diskon 5%' }
  };

  let appliedVoucher = null;

  function calculateTotal(){
    const subtotal = orderItems.reduce(function(sum, item){
      return sum + (item.harga * item.qty);
    }, 0);

    const ongkir = (subtotal === 0 || subtotal >= FREE_ONGKIR_THRESHOLD) ? 0 : ONGKIR_NORMAL;

    let discount = 0;
    if(appliedVoucher){
      const voucher = voucherList[appliedVoucher];
      if(voucher){
        discount = voucher.type === 'percent' ? Math.round(subtotal * voucher.value / 100) : voucher.value;
        if(discount > subtotal) discount = subtotal;
      }
    }

    const total = Math.max(subtotal + ongkir - discount, 0);

    subtotalValue.textContent = formatRupiah(subtotal);
    ongkirValue.textContent = ongkir === 0 ? 'Gratis' : formatRupiah(ongkir);

    if(discount > 0){
      discountRow.style.display = 'flex';
      discountValue.textContent = '-' + formatRupiah(discount);
    } else {
      discountRow.style.display = 'none';
    }

    totalValue.textContent = formatRupiah(total);
  }

  /* ==========================================================
     6. VOUCHER
  ========================================================== */
  const voucherInput = document.getElementById('voucherInput');
  const applyVoucherBtn = document.getElementById('applyVoucherBtn');
  const voucherMessage = document.getElementById('voucherMessage');
  const voucherMessageText = document.getElementById('voucherMessageText');

  applyVoucherBtn.addEventListener('click', function(){
    const code = voucherInput.value.trim().toUpperCase();

    if(code.length === 0){
      showVoucherMessage('Masukkan kode voucher terlebih dahulu.', 'error');
      return;
    }

    if(voucherList[code]){
      appliedVoucher = code;
      showVoucherMessage('Voucher berhasil digunakan: ' + voucherList[code].label, 'success');
      calculateTotal();
    } else {
      appliedVoucher = null;
      showVoucherMessage('Kode voucher tidak ditemukan atau sudah kedaluwarsa.', 'error');
      calculateTotal();
    }
  });

  function showVoucherMessage(text, type){
    voucherMessageText.textContent = text;
    voucherMessage.className = 'voucher-message show ' + type;
  }

  /* ==========================================================
     7. VALIDASI FORM
  ========================================================== */
  const alamatInput = document.getElementById('alamatInput');
  const alamatError = document.getElementById('alamatError');
  const tanggalInput = document.getElementById('tanggalInput');
  const tanggalError = document.getElementById('tanggalError');

  // Set tanggal minimum = hari ini
  const today = new Date().toISOString().split('T')[0];
  tanggalInput.setAttribute('min', today);

  function validateAlamat(){
    const valid = alamatInput.value.trim().length >= 10;
    alamatInput.classList.toggle('is-invalid', !valid);
    alamatError.classList.toggle('show', !valid);
    return valid;
  }

  function validateTanggal(){
    const valid = tanggalInput.value !== '';
    tanggalInput.classList.toggle('is-invalid', !valid);
    tanggalError.classList.toggle('show', !valid);
    return valid;
  }

  alamatInput.addEventListener('input', validateAlamat);
  tanggalInput.addEventListener('change', validateTanggal);

  document.getElementById('savedAddressChip').addEventListener('click', function(){
    alamatInput.value = 'Kost Melati Asri, Jl. Sekeloa Dalam No. 12, Bandung (dekat minimarket, pagar hijau)';
    validateAlamat();
    showToast('Alamat tersimpan berhasil digunakan');
  });

  /* ==========================================================
     8. SUBMIT CHECKOUT
  ========================================================== */
  const checkoutBtn = document.getElementById('checkoutBtn');
  const checkoutBtnText = document.getElementById('checkoutBtnText');
  const checkoutSpinner = document.getElementById('checkoutSpinner');

  checkoutBtn.addEventListener('click', function(){
    const validAlamat = validateAlamat();
    const validTanggal = validateTanggal();

    if(orderItems.length === 0){
      showToast('Belum ada menu di pesananmu.');
      return;
    }

    if(!validAlamat || !validTanggal){
      showToast('Lengkapi alamat dan tanggal pengiriman terlebih dahulu.');
      return;
    }

    checkoutBtn.disabled = true;
    checkoutSpinner.classList.add('show');
    checkoutBtnText.innerHTML = 'Memproses...';

    setTimeout(function(){
      checkoutSpinner.classList.remove('show');
      checkoutBtnText.innerHTML = '<i class="bi bi-lock-fill me-1"></i> Lanjut Pembayaran';
      checkoutBtn.disabled = false;
      showToast('Menuju halaman pembayaran...');
    }, 1800);
  });

  /* ==========================================================
     9. TOAST NOTIFIKASI
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
     10. INISIALISASI
  ========================================================== */
  renderOrderItems();
