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
     4. DATA PROFIL (DUMMY)
  ========================================================== */
  let profileData = {
    nama: 'Rani Anjani',
    email: 'rani.anjani@email.com',
    hp: '0812-3456-7890',
    alamat: 'Kost Melati Asri, Jl. Sekeloa Dalam No. 12, Bandung',
    avatar: 'assets/images/user-avatar.png'
  };

  const displayName = document.getElementById('displayName');
  const displayEmail = document.getElementById('displayEmail');
  const displayHp = document.getElementById('displayHp');
  const displayAlamat = document.getElementById('displayAlamat');
  const displayAvatar = document.getElementById('displayAvatar');

  /* ==========================================================
     5. MODAL EDIT PROFIL - ISI DATA SAAT DIBUKA
  ========================================================== */
  const modalEditProfile = document.getElementById('modalEditProfile');
  const editNama = document.getElementById('editNama');
  const editEmail = document.getElementById('editEmail');
  const editHp = document.getElementById('editHp');
  const editAlamat = document.getElementById('editAlamat');
  const editAvatarPreview = document.getElementById('editAvatarPreview');
  const editAvatarInput = document.getElementById('editAvatarInput');

  let newAvatarDataUrl = null;

  modalEditProfile.addEventListener('show.bs.modal', function(){
    editNama.value = profileData.nama;
    editEmail.value = profileData.email;
    editHp.value = profileData.hp;
    editAlamat.value = profileData.alamat;
    editAvatarPreview.src = profileData.avatar;
    newAvatarDataUrl = null;
    clearEditErrors();
  });

  /* ==========================================================
     6. PREVIEW FOTO
  ========================================================== */
  editAvatarInput.addEventListener('change', function(){
    const file = this.files[0];
    if(!file) return;

    if(!file.type.startsWith('image/')){
      showToast('File harus berupa gambar');
      return;
    }

    const reader = new FileReader();
    reader.onload = function(e){
      editAvatarPreview.src = e.target.result;
      newAvatarDataUrl = e.target.result;
    };
    reader.readAsDataURL(file);
  });

  /* ==========================================================
     7. VALIDASI FORM EDIT PROFIL
  ========================================================== */
  function toggleFieldError(inputEl, errorEl, isValid){
    inputEl.classList.toggle('is-invalid', !isValid);
    errorEl.classList.toggle('show', !isValid);
  }

  function clearEditErrors(){
    [editNama, editEmail, editHp, editAlamat].forEach(function(el){ el.classList.remove('is-invalid'); });
    document.querySelectorAll('#editProfileForm .error-message').forEach(function(el){ el.classList.remove('show'); });
  }

  function validateEditForm(){
    const validNama = editNama.value.trim().length >= 3;
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editEmail.value.trim());
    const validHp = /^[0-9\-]{10,16}$/.test(editHp.value.trim());
    const validAlamat = editAlamat.value.trim().length >= 10;

    toggleFieldError(editNama, document.getElementById('editNamaError'), validNama);
    toggleFieldError(editEmail, document.getElementById('editEmailError'), validEmail);
    toggleFieldError(editHp, document.getElementById('editHpError'), validHp);
    toggleFieldError(editAlamat, document.getElementById('editAlamatError'), validAlamat);

    return validNama && validEmail && validHp && validAlamat;
  }

  /* ==========================================================
     8. SIMPAN PERUBAHAN PROFIL
  ========================================================== */
  const editProfileForm = document.getElementById('editProfileForm');
  const saveProfileBtn = document.getElementById('saveProfileBtn');
  const saveProfileBtnText = document.getElementById('saveProfileBtnText');
  const saveProfileSpinner = document.getElementById('saveProfileSpinner');

  editProfileForm.addEventListener('submit', function(e){
    e.preventDefault();

    if(!validateEditForm()){
      return;
    }

    saveProfileBtn.disabled = true;
    saveProfileSpinner.classList.add('show');
    saveProfileBtnText.textContent = 'Menyimpan...';

    setTimeout(function(){
      // Update data profil
      profileData.nama = editNama.value.trim();
      profileData.email = editEmail.value.trim();
      profileData.hp = editHp.value.trim();
      profileData.alamat = editAlamat.value.trim();
      if(newAvatarDataUrl){ profileData.avatar = newAvatarDataUrl; }

      // Update tampilan
      displayName.textContent = profileData.nama;
      displayEmail.textContent = profileData.email;
      displayHp.textContent = profileData.hp;
      displayAlamat.textContent = profileData.alamat;
      displayAvatar.src = profileData.avatar;

      saveProfileSpinner.classList.remove('show');
      saveProfileBtnText.innerHTML = '<i class="bi bi-check2-circle me-1"></i> Simpan Perubahan';
      saveProfileBtn.disabled = false;

      const modalInstance = bootstrap.Modal.getInstance(modalEditProfile);
      modalInstance.hide();

      showToast('Profil berhasil diperbarui');
    }, 1600);
  });

  /* ==========================================================
     9. MENU KEAMANAN (DUMMY)
  ========================================================== */
  document.getElementById('menuKeamanan').addEventListener('click', function(){
    showToast('Fitur keamanan akan segera tersedia');
  });

  /* ==========================================================
     10. LOGOUT
  ========================================================== */
  const confirmLogoutBtn = document.getElementById('confirmLogoutBtn');
  const logoutBtnText = document.getElementById('logoutBtnText');
  const logoutSpinner = document.getElementById('logoutSpinner');
  const modalLogout = document.getElementById('modalLogout');

  confirmLogoutBtn.addEventListener('click', function(){
    confirmLogoutBtn.disabled = true;
    logoutSpinner.classList.add('show');
    logoutBtnText.textContent = 'Memproses...';

    setTimeout(function(){
      logoutSpinner.classList.remove('show');
      logoutBtnText.textContent = 'Ya, Keluar';
      confirmLogoutBtn.disabled = false;

      const modalInstance = bootstrap.Modal.getInstance(modalLogout);
      modalInstance.hide();

      showToast('Berhasil logout. Mengalihkan ke halaman login...');

      setTimeout(function(){
        window.location.href = 'login.html';
      }, 1200);
    }, 1400);
  });

  /* ==========================================================
     11. TOAST NOTIFIKASI
  ========================================================== */
  let toastTimeout;
  function showToast(message){
    const toast = document.getElementById('toastDK');
    document.getElementById('toastMessage').textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(function(){ toast.classList.remove('show'); }, 2800);
  }
