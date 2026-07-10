  /* 1. LOADING SCREEN */
  window.addEventListener('load', function(){
    const loader = document.getElementById('loading-screen');
    setTimeout(function(){ loader.classList.add('hide'); }, 500);
  });

  /* 2. NAVBAR SCROLL + BACK TO TOP */
  const navbar = document.getElementById('mainNavbar');
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', function(){
    if(window.scrollY > 40){ navbar.classList.add('scrolled'); } else { navbar.classList.remove('scrolled'); }
    if(window.scrollY > 400){ backToTop.classList.add('visible'); } else { backToTop.classList.remove('visible'); }
  });
  backToTop.addEventListener('click', function(){ window.scrollTo({ top: 0, behavior: 'smooth' }); });

  /* 3. SMOOTH SCROLL */
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor){
    anchor.addEventListener('click', function(e){
      const targetId = this.getAttribute('href');
      if(targetId.length > 1){
        const targetEl = document.querySelector(targetId);
        if(targetEl){
          e.preventDefault();
          const top = targetEl.getBoundingClientRect().top + window.pageYOffset - 80;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      }
    });
  });

  /* 4. SCROLL REVEAL */
  const revealObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('show');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(function(el){ revealObserver.observe(el); });

  /* 5. RIPPLE BUTTON */
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

  /* 6. HIGHLIGHT CARD SAAT DIPILIH */
  const namaPaket = {
    harian: 'Paket Harian',
    mingguan: 'Paket Mingguan',
    bulanan: 'Paket Bulanan'
  };

  function resetSelection(){
    document.querySelectorAll('.pricing-card-v2').forEach(function(card){
      card.classList.remove('selected');
      const btn = card.querySelector('.btn-pilih-paket');
      btn.classList.remove('is-selected');
      btn.innerHTML = 'Pilih Paket';
    });
  }

  function selectPaket(card){
    resetSelection();
    card.classList.add('selected');
    const btn = card.querySelector('.btn-pilih-paket');
    btn.classList.add('is-selected');
    btn.innerHTML = '<i class="bi bi-check-circle-fill me-1"></i> Paket Dipilih';

    const key = card.getAttribute('data-paket');
    showToast(namaPaket[key] + ' berhasil dipilih. Lanjut ke halaman Cara Order untuk menyelesaikan pemesanan.');
  }

  document.querySelectorAll('.pricing-card-v2').forEach(function(card){
    const btn = card.querySelector('.btn-pilih-paket');
    btn.addEventListener('click', function(e){
      e.stopPropagation();
      selectPaket(card);
    });
    card.addEventListener('click', function(){
      selectPaket(card);
    });
  });

  /* 7. TOAST NOTIFIKASI */
  let toastTimeout;
  function showToast(message){
    const toast = document.getElementById('toastDK');
    document.getElementById('toastMessage').textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(function(){ toast.classList.remove('show'); }, 3000);
  }
