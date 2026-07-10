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
    updateTimelineProgress();
  });
  window.addEventListener('resize', updateTimelineProgress);
  backToTop.addEventListener('click', function(){ window.scrollTo({ top: 0, behavior: 'smooth' }); });

  /* ==========================================================
     3. SMOOTH SCROLL
  ========================================================== */
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

  /* ==========================================================
     4. RIPPLE BUTTON
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
     5. SCROLL REVEAL TIMELINE ITEMS (KIRI/KANAN)
  ========================================================== */
  const timelineItems = document.querySelectorAll('.timeline-item');
  timelineItems.forEach(function(item){
    const content = item.querySelector('.timeline-content');
    content.classList.add('reveal', item.classList.contains('left') ? 'reveal-left' : 'reveal-right');
  });

  const revealObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('show');

        const parentItem = entry.target.closest('.timeline-item');
        if(parentItem){ parentItem.classList.add('active'); }

        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.35 });

  document.querySelectorAll('.timeline-content.reveal').forEach(function(el){
    revealObserver.observe(el);
  });

  /* ==========================================================
     6. PROGRESS LINE TIMELINE (BERDASARKAN SCROLL)
  ========================================================== */
  const timelineWrap = document.getElementById('timelineWrap');
  const timelineFill = document.getElementById('timelineFill');

  function updateTimelineProgress(){
    const rect = timelineWrap.getBoundingClientRect();
    const viewportCenter = window.innerHeight * 0.55;

    let progress = (viewportCenter - rect.top) / rect.height;
    progress = Math.max(0, Math.min(1, progress));

    timelineFill.style.height = (progress * 100) + '%';
  }

  updateTimelineProgress();

  /* ==========================================================
     7. GENERAL SCROLL REVEAL (HERO & CTA)
  ========================================================== */
  const generalReveal = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('show');
        generalReveal.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal:not(.timeline-content)').forEach(function(el){
    generalReveal.observe(el);
  });
