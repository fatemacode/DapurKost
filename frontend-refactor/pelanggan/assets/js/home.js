  /* ==========================================================
     1. LOADING SCREEN
  ========================================================== */
  window.addEventListener('load', function(){
    const loader = document.getElementById('loading-screen');
    setTimeout(function(){
      loader.classList.add('hide');
    }, 500);
  });

  /* ==========================================================
     2. NAVBAR SCROLL EFFECT
  ========================================================== */
  const navbar = document.getElementById('mainNavbar');
  window.addEventListener('scroll', function(){
    if(window.scrollY > 40){
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back to top visibility
    const backToTop = document.getElementById('backToTop');
    if(window.scrollY > 400){
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });

  /* ==========================================================
     3. SMOOTH SCROLL UNTUK ANCHOR LINK
  ========================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor){
    anchor.addEventListener('click', function(e){
      const targetId = this.getAttribute('href');
      if(targetId.length > 1){
        const targetEl = document.querySelector(targetId);
        if(targetEl){
          e.preventDefault();
          const offset = 80;
          const top = targetEl.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top: top, behavior: 'smooth' });

          // Tutup navbar mobile jika terbuka
          const navCollapse = document.getElementById('navbarNav');
          if(navCollapse.classList.contains('show')){
            new bootstrap.Collapse(navCollapse).hide();
          }
        }
      }
    });
  });

  /* ==========================================================
     4. BACK TO TOP CLICK
  ========================================================== */
  document.getElementById('backToTop').addEventListener('click', function(){
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ==========================================================
     5. SCROLL REVEAL - INTERSECTION OBSERVER
  ========================================================== */
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('show');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach(function(el){
    revealObserver.observe(el);
  });

  /* ==========================================================
     6. COUNTER ANIMATION - INTERSECTION OBSERVER
  ========================================================== */
  const counters = document.querySelectorAll('.counter');
  const counterObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(function(counter){
    counterObserver.observe(counter);
  });

  function animateCounter(el){
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1600;
    const startTime = performance.now();

    function update(currentTime){
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const currentValue = Math.floor(easedProgress * target);
      el.textContent = currentValue.toLocaleString('id-ID');

      if(progress < 1){
        requestAnimationFrame(update);
      } else {
        el.textContent = target.toLocaleString('id-ID');
      }
    }
    requestAnimationFrame(update);
  }

  /* ==========================================================
     7. BUTTON RIPPLE EFFECT
  ========================================================== */
  document.querySelectorAll('.btn-ripple').forEach(function(btn){
    btn.addEventListener('click', function(e){
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.className = 'ripple-span';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';

      btn.appendChild(ripple);

      setTimeout(function(){
        ripple.remove();
      }, 600);
    });
  });

  /* ==========================================================
     8. ACCORDION ICON STATE (opsional, bootstrap sudah handle)
  ========================================================== */
  document.querySelectorAll('.accordion-button-dk').forEach(function(btn){
    btn.addEventListener('click', function(){
      // Bootstrap collapse sudah menangani buka/tutup,
      // baris ini disiapkan jika ingin menambah efek tambahan di masa depan.
    });
  });
