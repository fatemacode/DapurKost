  /* ==========================================================
     1. LOADING SCREEN
  ========================================================== */
  window.addEventListener('load', function(){
    const loader = document.getElementById('loading-screen');
    setTimeout(function(){ loader.classList.add('hide'); }, 500);
  });

  /* ==========================================================
     2. RIPPLE BUTTON
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
     3. ELEMEN FORM
  ========================================================== */
  const namaInput = document.getElementById('namaInput');
  const emailInput = document.getElementById('emailInput');
  const hpInput = document.getElementById('hpInput');
  const passwordInput = document.getElementById('passwordInput');
  const confirmPasswordInput = document.getElementById('confirmPasswordInput');
  const alamatInput = document.getElementById('alamatInput');
  const termsCheckbox = document.getElementById('termsCheckbox');

  const namaError = document.getElementById('namaError');
  const emailError = document.getElementById('emailError');
  const hpError = document.getElementById('hpError');
  const passwordError = document.getElementById('passwordError');
  const confirmPasswordError = document.getElementById('confirmPasswordError');
  const alamatError = document.getElementById('alamatError');
  const termsError = document.getElementById('termsError');

  const registerForm = document.getElementById('registerForm');
  const registerBtn = document.getElementById('registerBtn');
  const registerBtnText = document.getElementById('registerBtnText');
  const registerSpinner = document.getElementById('registerSpinner');

  /* ==========================================================
     4. SHOW / HIDE PASSWORD
  ========================================================== */
  function setupTogglePassword(toggleId, inputEl){
    document.getElementById(toggleId).addEventListener('click', function(){
      const isHidden = inputEl.type === 'password';
      inputEl.type = isHidden ? 'text' : 'password';
      this.innerHTML = isHidden ? '<i class="bi bi-eye-slash"></i>' : '<i class="bi bi-eye"></i>';
    });
  }
  setupTogglePassword('togglePassword1', passwordInput);
  setupTogglePassword('togglePassword2', confirmPasswordInput);

  /* ==========================================================
     5. VALIDASI PER FIELD
  ========================================================== */
  function toggleFieldState(inputEl, errorEl, isValid){
    if(isValid){
      inputEl.classList.remove('is-invalid');
      inputEl.classList.add('is-valid');
      errorEl.classList.remove('show');
    } else {
      inputEl.classList.add('is-invalid');
      inputEl.classList.remove('is-valid');
      errorEl.classList.add('show');
    }
  }

  function validateNama(){
    const valid = namaInput.value.trim().length >= 3;
    toggleFieldState(namaInput, namaError, valid);
    return valid;
  }

  function validateEmail(){
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const valid = pattern.test(emailInput.value.trim());
    toggleFieldState(emailInput, emailError, valid);
    return valid;
  }

  function validateHp(){
    const pattern = /^[0-9]{10,15}$/;
    const valid = pattern.test(hpInput.value.trim());
    toggleFieldState(hpInput, hpError, valid);
    return valid;
  }

  function validatePassword(){
    const valid = passwordInput.value.length >= 8;
    toggleFieldState(passwordInput, passwordError, valid);
    return valid;
  }

  function validateConfirmPassword(){
    const valid = confirmPasswordInput.value.length > 0 && confirmPasswordInput.value === passwordInput.value;
    toggleFieldState(confirmPasswordInput, confirmPasswordError, valid);
    return valid;
  }

  function validateAlamat(){
    const valid = alamatInput.value.trim().length >= 10;
    toggleFieldState(alamatInput, alamatError, valid);
    return valid;
  }

  function validateTerms(){
    const valid = termsCheckbox.checked;
    if(valid){ termsError.classList.remove('show'); }
    else{ termsError.classList.add('show'); }
    return valid;
  }

  namaInput.addEventListener('input', validateNama);
  emailInput.addEventListener('input', validateEmail);
  hpInput.addEventListener('input', validateHp);
  passwordInput.addEventListener('input', function(){
    validatePassword();
    updatePasswordStrength();
    if(confirmPasswordInput.value.length > 0) validateConfirmPassword();
  });
  confirmPasswordInput.addEventListener('input', validateConfirmPassword);
  alamatInput.addEventListener('input', validateAlamat);
  termsCheckbox.addEventListener('change', validateTerms);

  /* ==========================================================
     6. PASSWORD STRENGTH METER
  ========================================================== */
  const strengthWrap = document.getElementById('strengthWrap');
  const segment1 = document.getElementById('segment1');
  const segment2 = document.getElementById('segment2');
  const segment3 = document.getElementById('segment3');
  const strengthLabel = document.getElementById('strengthLabel');

  function getPasswordScore(value){
    let score = 0;
    if(value.length >= 8) score++;
    if(/[A-Z]/.test(value) && /[a-z]/.test(value)) score++;
    if(/[0-9]/.test(value)) score++;
    if(/[^A-Za-z0-9]/.test(value)) score++;
    return score;
  }

  function updatePasswordStrength(){
    const value = passwordInput.value;

    if(value.length === 0){
      strengthWrap.style.display = 'none';
      return;
    }
    strengthWrap.style.display = 'block';

    const score = getPasswordScore(value);

    [segment1, segment2, segment3].forEach(function(seg){
      seg.className = 'strength-segment';
    });
    strengthLabel.className = 'strength-label';

    if(score <= 1){
      segment1.classList.add('active-weak');
      strengthLabel.textContent = 'Lemah';
      strengthLabel.classList.add('weak');
    } else if(score <= 3){
      segment1.classList.add('active-medium');
      segment2.classList.add('active-medium');
      strengthLabel.textContent = 'Sedang';
      strengthLabel.classList.add('medium');
    } else {
      segment1.classList.add('active-strong');
      segment2.classList.add('active-strong');
      segment3.classList.add('active-strong');
      strengthLabel.textContent = 'Kuat';
      strengthLabel.classList.add('strong');
    }
  }

  /* ==========================================================
     7. SUBMIT + LOADING REGISTER (DUMMY)
  ========================================================== */
  registerForm.addEventListener('submit', function(e){
    e.preventDefault();

    const validNama = validateNama();
    const validEmail = validateEmail();
    const validHp = validateHp();
    const validPassword = validatePassword();
    const validConfirm = validateConfirmPassword();
    const validAlamat = validateAlamat();
    const validTerms = validateTerms();

    const allValid = validNama && validEmail && validHp && validPassword && validConfirm && validAlamat && validTerms;

    if(!allValid){
      showToast('Periksa kembali data yang kamu masukkan.');
      return;
    }

    registerBtn.disabled = true;
    registerSpinner.classList.add('show');
    registerBtnText.textContent = 'Memproses...';

    setTimeout(function(){
      registerSpinner.classList.remove('show');
      registerBtnText.textContent = 'Daftar Sekarang';
      registerBtn.disabled = false;
      showToast('Registrasi berhasil! Mengalihkan ke halaman login...');

      setTimeout(function(){
        window.location.href = 'login.html';
      }, 1200);
    }, 1800);
  });

  /* ==========================================================
     8. TOAST NOTIFIKASI
  ========================================================== */
  let toastTimeout;
  function showToast(message){
    const toast = document.getElementById('toastDK');
    document.getElementById('toastMessage').textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(function(){ toast.classList.remove('show'); }, 2800);
  }
