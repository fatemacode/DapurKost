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
     3. SHOW / HIDE PASSWORD
  ========================================================== */
  const togglePassword = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('passwordInput');
  togglePassword.addEventListener('click', function(){
    const isHidden = passwordInput.type === 'password';
    passwordInput.type = isHidden ? 'text' : 'password';
    this.innerHTML = isHidden ? '<i class="bi bi-eye-slash"></i>' : '<i class="bi bi-eye"></i>';
  });

  /* ==========================================================
     4. VALIDASI FORM
  ========================================================== */
  const emailInput = document.getElementById('emailInput');
  const emailError = document.getElementById('emailError');
  const passwordError = document.getElementById('passwordError');
  const loginForm = document.getElementById('loginForm');
  const loginBtn = document.getElementById('loginBtn');
  const loginBtnText = document.getElementById('loginBtnText');
  const loginSpinner = document.getElementById('loginSpinner');

  function isValidEmail(value){
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(value);
  }

  function validateEmail(){
    const value = emailInput.value.trim();
    if(!isValidEmail(value)){
      emailInput.classList.add('is-invalid');
      emailError.classList.add('show');
      return false;
    }
    emailInput.classList.remove('is-invalid');
    emailError.classList.remove('show');
    return true;
  }

  function validatePassword(){
    const value = passwordInput.value;
    if(value.length < 6){
      passwordInput.classList.add('is-invalid');
      passwordError.classList.add('show');
      return false;
    }
    passwordInput.classList.remove('is-invalid');
    passwordError.classList.remove('show');
    return true;
  }

  emailInput.addEventListener('input', validateEmail);
  passwordInput.addEventListener('input', validatePassword);

  /* ==========================================================
     5. SUBMIT + LOADING LOGIN (DUMMY)
  ========================================================== */
  loginForm.addEventListener('submit', function(e){
    e.preventDefault();

    const emailValid = validateEmail();
    const passwordValid = validatePassword();

    if(!emailValid || !passwordValid){
      loginForm.classList.add('shake-anim');
      setTimeout(function(){ loginForm.classList.remove('shake-anim'); }, 400);
      return;
    }

    // Set loading state
    loginBtn.disabled = true;
    loginSpinner.classList.add('show');
    loginBtnText.textContent = 'Memproses...';

    // Simulasi proses login (dummy, tanpa backend)
    setTimeout(function(){
      loginSpinner.classList.remove('show');
      loginBtnText.textContent = 'Login';
      loginBtn.disabled = false;
      showToast('Login berhasil! Mengalihkan ke beranda...');

      setTimeout(function(){
        window.location.href = 'home.html';
      }, 1200);
    }, 1800);
  });

  /* ==========================================================
     6. GOOGLE LOGIN (DUMMY)
  ========================================================== */
  document.getElementById('googleLoginBtn').addEventListener('click', function(){
    showToast('Fitur login Google akan segera tersedia');
  });

  /* ==========================================================
     7. TOAST NOTIFIKASI
  ========================================================== */
  let toastTimeout;
  function showToast(message){
    const toast = document.getElementById('toastDK');
    document.getElementById('toastMessage').textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(function(){ toast.classList.remove('show'); }, 2800);
  }
