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
     4. DATA METODE PEMBAYARAN
  ========================================================== */
  const paymentMethods = {
    bca: { label: 'BCA', accountLabel: 'Nomor Virtual Account BCA', number: '3910 8812 3456 7890', isQris: false },
    bri: { label: 'BRI', accountLabel: 'Nomor Virtual Account BRI', number: '2621 0198 7654 3210', isQris: false },
    dana: { label: 'DANA', accountLabel: 'Nomor DANA', number: '0812-3456-7890', isQris: false },
    gopay: { label: 'GoPay', accountLabel: 'Nomor GoPay', number: '0812-3456-7890', isQris: false },
    qris: { label: 'QRIS', accountLabel: '', number: '', isQris: true }
  };

  let selectedMethod = null;

  const methodGrid = document.getElementById('methodGrid');
  const paymentDetailSection = document.getElementById('paymentDetailSection');
  const accountDetailBox = document.getElementById('accountDetailBox');
  const qrisDetailBox = document.getElementById('qrisDetailBox');
  const accountLabel = document.getElementById('accountLabel');
  const accountNumber = document.getElementById('accountNumber');
  const summaryMethod = document.getElementById('summaryMethod');

  methodGrid.addEventListener('click', function(e){
    const card = e.target.closest('.method-card');
    if(!card) return;

    document.querySelectorAll('.method-card').forEach(function(c){ c.classList.remove('active'); });
    card.classList.add('active');

    const methodKey = card.getAttribute('data-method');
    selectedMethod = methodKey;
    const data = paymentMethods[methodKey];

    summaryMethod.textContent = data.label;

    if(data.isQris){
      accountDetailBox.style.display = 'none';
      qrisDetailBox.style.display = 'block';
    } else {
      accountDetailBox.style.display = 'block';
      qrisDetailBox.style.display = 'none';
      accountLabel.textContent = data.accountLabel;
      accountNumber.textContent = data.number;
    }

    paymentDetailSection.classList.add('show');

    setTimeout(function(){
      paymentDetailSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 150);
  });

  /* ==========================================================
     5. COPY NOMOR REKENING
  ========================================================== */
  const copyBtn = document.getElementById('copyBtn');
  const copyBtnText = document.getElementById('copyBtnText');

  copyBtn.addEventListener('click', function(){
    const number = accountNumber.textContent;
    navigator.clipboard.writeText(number.replace(/\s/g, '')).then(function(){
      copyBtn.classList.add('copied');
      copyBtnText.textContent = 'Tersalin!';
      showToast('Nomor berhasil disalin ke clipboard');

      setTimeout(function(){
        copyBtn.classList.remove('copied');
        copyBtnText.textContent = 'Salin';
      }, 2000);
    }).catch(function(){
      showToast('Gagal menyalin nomor, silakan salin manual');
    });
  });

  /* ==========================================================
     6. UPLOAD BUKTI + PREVIEW + PROGRESS
  ========================================================== */
  const uploadBox = document.getElementById('uploadBox');
  const fileInput = document.getElementById('fileInput');
  const uploadPreviewWrap = document.getElementById('uploadPreviewWrap');
  const previewImg = document.getElementById('previewImg');
  const previewName = document.getElementById('previewName');
  const previewSize = document.getElementById('previewSize');
  const progressFill = document.getElementById('progressFill');
  const progressText = document.getElementById('progressText');
  const uploadSuccessBadge = document.getElementById('uploadSuccessBadge');
  const removeUploadBtn = document.getElementById('removeUploadBtn');

  let uploadCompleted = false;

  uploadBox.addEventListener('click', function(){ fileInput.click(); });

  uploadBox.addEventListener('dragover', function(e){
    e.preventDefault();
    uploadBox.classList.add('dragover');
  });
  uploadBox.addEventListener('dragleave', function(){
    uploadBox.classList.remove('dragover');
  });
  uploadBox.addEventListener('drop', function(e){
    e.preventDefault();
    uploadBox.classList.remove('dragover');
    if(e.dataTransfer.files.length > 0){
      handleFile(e.dataTransfer.files[0]);
    }
  });

  fileInput.addEventListener('change', function(){
    if(this.files.length > 0){
      handleFile(this.files[0]);
    }
  });

  function formatFileSize(bytes){
    if(bytes < 1024) return bytes + ' B';
    if(bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024*1024)).toFixed(1) + ' MB';
  }

  function handleFile(file){
    if(!file.type.startsWith('image/')){
      showToast('File harus berupa gambar (JPG/PNG)');
      return;
    }
    if(file.size > 5 * 1024 * 1024){
      showToast('Ukuran file maksimal 5MB');
      return;
    }

    uploadCompleted = false;
    uploadSuccessBadge.classList.remove('show');

    const reader = new FileReader();
    reader.onload = function(e){
      previewImg.src = e.target.result;
      previewName.textContent = file.name;
      previewSize.textContent = formatFileSize(file.size);
      uploadPreviewWrap.classList.add('show');
      simulateUploadProgress();
    };
    reader.readAsDataURL(file);
  }

  function simulateUploadProgress(){
    let progress = 0;
    progressFill.style.width = '0%';
    progressText.textContent = '0%';

    const interval = setInterval(function(){
      progress += Math.random() * 18 + 8;
      if(progress >= 100){
        progress = 100;
        clearInterval(interval);
        uploadCompleted = true;
        uploadSuccessBadge.classList.add('show');
        showToast('Bukti pembayaran berhasil diunggah');
      }
      progressFill.style.width = progress + '%';
      progressText.textContent = Math.floor(progress) + '%';
    }, 180);
  }

  removeUploadBtn.addEventListener('click', function(){
    uploadPreviewWrap.classList.remove('show');
    fileInput.value = '';
    uploadCompleted = false;
    progressFill.style.width = '0%';
    progressText.textContent = '0%';
    uploadSuccessBadge.classList.remove('show');
  });

  /* ==========================================================
     7. COUNTDOWN TIMER
  ========================================================== */
  let remainingSeconds = 23 * 3600 + 59 * 60 + 59;
  const countdownTimer = document.getElementById('countdownTimer');

  function updateCountdown(){
    if(remainingSeconds <= 0){
      countdownTimer.textContent = '00:00:00';
      return;
    }
    remainingSeconds--;
    const h = String(Math.floor(remainingSeconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((remainingSeconds % 3600) / 60)).padStart(2, '0');
    const s = String(remainingSeconds % 60).padStart(2, '0');
    countdownTimer.textContent = `${h}:${m}:${s}`;
  }
  setInterval(updateCountdown, 1000);

  /* ==========================================================
     8. KONFIRMASI PEMBAYARAN
  ========================================================== */
  const confirmBtn = document.getElementById('confirmBtn');
  const confirmBtnText = document.getElementById('confirmBtnText');
  const confirmSpinner = document.getElementById('confirmSpinner');

  confirmBtn.addEventListener('click', function(){
    if(!selectedMethod){
      showToast('Pilih metode pembayaran terlebih dahulu');
      return;
    }
    if(!uploadCompleted){
      showToast('Unggah bukti pembayaran terlebih dahulu');
      return;
    }

    confirmBtn.disabled = true;
    confirmSpinner.classList.add('show');
    confirmBtnText.textContent = 'Memverifikasi...';

    setTimeout(function(){
      confirmSpinner.classList.remove('show');
      confirmBtnText.innerHTML = '<i class="bi bi-check2-circle me-1"></i> Konfirmasi Pembayaran';
      confirmBtn.disabled = false;
      showToast('Pembayaran berhasil dikonfirmasi! Pesananmu sedang diproses.');
    }, 2000);
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
