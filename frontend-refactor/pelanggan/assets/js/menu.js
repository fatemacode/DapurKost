/* ==============================================================
   0. DATA MENU (bukan paket, item per-satuan)
============================================================== */
const menuItems = [
  { id: 1,  name: "Nasi Uduk Komplit",        category: "sarapan",      desc: "Nasi uduk gurih dengan ayam suwir, telur, dan sambal kacang.", price: 12000, img: "https://placehold.co/500x375/E5D0AC/6D2323?font=poppins&text=Nasi+Uduk+Komplit" },
  { id: 2,  name: "Bubur Ayam Spesial",       category: "sarapan",      desc: "Bubur lembut dengan suwiran ayam, cakwe, dan kerupuk.",         price: 10000, img: "https://placehold.co/500x375/E5D0AC/6D2323?font=poppins&text=Bubur+Ayam+Spesial" },
  { id: 3,  name: "Roti Bakar Coklat Keju",   category: "sarapan",      desc: "Roti bakar renyah isi coklat leleh dan keju parut melimpah.",   price: 8000,  img: "https://placehold.co/500x375/E5D0AC/6D2323?font=poppins&text=Roti+Bakar" },
  { id: 4,  name: "Nasi Goreng Spesial",      category: "makan-siang",  desc: "Nasi goreng bumbu rumahan dengan telur, ayam, dan acar segar.", price: 15000, img: "https://placehold.co/500x375/A31D1D/FEF9E1?font=poppins&text=Nasi+Goreng+Spesial" },
  { id: 5,  name: "Ayam Geprek Sambal Bawang",category: "makan-siang",  desc: "Ayam crispy digeprek dengan sambal bawang pedas nampol.",       price: 16000, img: "https://placehold.co/500x375/A31D1D/FEF9E1?font=poppins&text=Ayam+Geprek" },
  { id: 6,  name: "Nasi Padang Rendang",      category: "makan-siang",  desc: "Nasi hangat dengan rendang empuk dan sayur nangka.",            price: 18000, img: "https://placehold.co/500x375/A31D1D/FEF9E1?font=poppins&text=Nasi+Padang+Rendang" },
  { id: 7,  name: "Mie Goreng Jawa",          category: "makan-siang",  desc: "Mie goreng khas Jawa dengan telur, kol, dan bakso iris.",       price: 14000, img: "https://placehold.co/500x375/A31D1D/FEF9E1?font=poppins&text=Mie+Goreng+Jawa" },
  { id: 8,  name: "Soto Ayam Kampung",        category: "makan-malam",  desc: "Kuah bening segar dengan ayam kampung dan koya gurih.",         price: 15000, img: "https://placehold.co/500x375/6D2323/FEF9E1?font=poppins&text=Soto+Ayam+Kampung" },
  { id: 9,  name: "Nasi Bakar Ayam Suwir",    category: "makan-malam",  desc: "Nasi dibakar daun pisang, isi ayam suwir bumbu meresap.",       price: 17000, img: "https://placehold.co/500x375/6D2323/FEF9E1?font=poppins&text=Nasi+Bakar" },
  { id: 10, name: "Sate Ayam Madura",         category: "makan-malam",  desc: "Sate ayam empuk dengan bumbu kacang khas Madura.",              price: 16000, img: "https://placehold.co/500x375/6D2323/FEF9E1?font=poppins&text=Sate+Ayam+Madura" },
  { id: 11, name: "Es Teh Manis",             category: "minuman",      desc: "Teh manis dingin segar, pelepas dahaga sehari-hari.",           price: 4000,  img: "https://placehold.co/500x375/E5D0AC/A31D1D?font=poppins&text=Es+Teh+Manis" },
  { id: 12, name: "Es Jeruk Peras",           category: "minuman",      desc: "Perasan jeruk segar asli tanpa pemanis buatan.",                price: 6000,  img: "https://placehold.co/500x375/E5D0AC/A31D1D?font=poppins&text=Es+Jeruk+Peras" },
  { id: 13, name: "Kopi Susu Gula Aren",      category: "minuman",      desc: "Kopi susu creamy dengan manis alami gula aren.",                price: 8000,  img: "https://placehold.co/500x375/E5D0AC/A31D1D?font=poppins&text=Kopi+Susu+Gula+Aren" },
  { id: 14, name: "Risoles Mayo",             category: "snack",        desc: "Risoles isi sayur, sosis, dan mayo lumer di dalamnya.",         price: 5000,  img: "https://placehold.co/500x375/FEF9E1/6D2323?font=poppins&text=Risoles+Mayo" },
  { id: 15, name: "Pisang Goreng Crispy",     category: "snack",        desc: "Pisang goreng renyah di luar, lembut manis di dalam.",          price: 6000,  img: "https://placehold.co/500x375/FEF9E1/6D2323?font=poppins&text=Pisang+Goreng" },
  { id: 16, name: "Tahu Isi Sayur",           category: "snack",        desc: "Tahu goreng renyah berisi tumisan sayur gurih.",                price: 5000,  img: "https://placehold.co/500x375/FEF9E1/6D2323?font=poppins&text=Tahu+Isi+Sayur" }
];

const categoryLabel = {
  "sarapan": "Sarapan",
  "makan-siang": "Makan Siang",
  "makan-malam": "Makan Malam",
  "minuman": "Minuman",
  "snack": "Snack"
};

/* ==============================================================
   1. STATE
============================================================== */
let cart = JSON.parse(localStorage.getItem("dapurkost_cart") || "[]");
let currentCategory = "semua";
let currentSearch = "";
const SERVICE_FEE = 2000;

function formatRupiah(num){
  return "Rp " + num.toLocaleString("id-ID");
}

function saveCart(){
  localStorage.setItem("dapurkost_cart", JSON.stringify(cart));
}

/* ==============================================================
   2. RENDER MENU GRID
============================================================== */
const menuGrid = document.getElementById("menuGrid");
const emptyState = document.getElementById("emptyState");

function renderMenu(){
  const filtered = menuItems.filter(item => {
    const matchCategory = currentCategory === "semua" || item.category === currentCategory;
    const matchSearch = item.name.toLowerCase().includes(currentSearch.toLowerCase());
    return matchCategory && matchSearch;
  });

  menuGrid.innerHTML = "";

  if(filtered.length === 0){
    emptyState.classList.add("show");
  } else {
    emptyState.classList.remove("show");
  }

  filtered.forEach((item, idx) => {
    const col = document.createElement("div");
    col.className = "col-lg-3 col-md-4 col-sm-6";
    col.innerHTML = `
      <div class="menu-card" style="animation-delay:${idx * 0.05}s">
        <div class="menu-card-img-wrap">
          <img src="${item.img}" alt="${item.name}" loading="lazy">
          <span class="menu-card-badge">${categoryLabel[item.category]}</span>
        </div>
        <div class="menu-card-body">
          <div class="menu-card-title">${item.name}</div>
          <div class="menu-card-desc">${item.desc}</div>
          <div class="menu-card-footer">
            <div class="menu-card-price">${formatRupiah(item.price)}<small>per porsi</small></div>
            <button class="btn-add" data-id="${item.id}" aria-label="Tambah ${item.name}">
              <i class="bi bi-plus-lg"></i>
            </button>
          </div>
        </div>
      </div>
    `;
    menuGrid.appendChild(col);
  });

  // bind tombol tambah
  document.querySelectorAll(".btn-add").forEach(btn => {
    btn.addEventListener("click", function(e){
      const id = parseInt(this.getAttribute("data-id"), 10);
      addToCart(id, this, e);
    });
  });
}

/* ==============================================================
   3. FILTER PILLS
============================================================== */
document.querySelectorAll(".filter-pill").forEach(pill => {
  pill.addEventListener("click", function(){
    document.querySelectorAll(".filter-pill").forEach(p => p.classList.remove("active"));
    this.classList.add("active");
    currentCategory = this.getAttribute("data-category");
    renderMenu();
  });
});

/* ==============================================================
   4. SEARCH
============================================================== */
document.getElementById("searchInput").addEventListener("input", function(){
  currentSearch = this.value;
  renderMenu();
});

/* ==============================================================
   5. CART LOGIC
============================================================== */
const floatingCartBtn = document.getElementById("floatingCartBtn");
const cartBadge = document.getElementById("cartBadge");

function addToCart(id, btnEl, event){
  const item = menuItems.find(m => m.id === id);
  if(!item) return;

  const existing = cart.find(c => c.id === id);
  if(existing){
    existing.qty += 1;
  } else {
    cart.push({ id: item.id, name: item.name, price: item.price, img: item.img, qty: 1 });
  }
  saveCart();
  updateCartUI();
  animateAddToCart(btnEl);
  showToast(item.name);

  // pop animation tombol tambah
  btnEl.classList.remove("added");
  void btnEl.offsetWidth; // reflow trigger
  btnEl.classList.add("added");
}

function changeQty(id, delta){
  const item = cart.find(c => c.id === id);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0){
    cart = cart.filter(c => c.id !== id);
  }
  saveCart();
  updateCartUI();
}

function removeFromCart(id){
  cart = cart.filter(c => c.id !== id);
  saveCart();
  updateCartUI();
}

function getCartCount(){
  return cart.reduce((sum, c) => sum + c.qty, 0);
}

function getSubtotal(){
  return cart.reduce((sum, c) => sum + (c.price * c.qty), 0);
}

function updateCartUI(){
  const count = getCartCount();
  cartBadge.textContent = count;

  if(count > 0){
    floatingCartBtn.classList.remove("hidden-cart");
  } else {
    floatingCartBtn.classList.add("hidden-cart");
  }

  renderSideCart();
}

function renderSideCart(){
  const wrap = document.getElementById("cartItemsWrap");
  const emptyEl = document.getElementById("cartEmptyState");
  const summaryEl = document.getElementById("cartSummary");

  if(cart.length === 0){
    wrap.innerHTML = "";
    emptyEl.style.display = "block";
    summaryEl.style.display = "none";
    return;
  }

  emptyEl.style.display = "none";
  summaryEl.style.display = "block";

  wrap.innerHTML = cart.map(c => `
    <div class="cart-item">
      <img src="${c.img}" alt="${c.name}">
      <div class="cart-item-info">
        <div class="cart-item-name">${c.name}</div>
        <div class="cart-item-price">${formatRupiah(c.price)}</div>
        <div class="cart-item-controls">
          <button class="qty-btn" onclick="changeQty(${c.id}, -1)"><i class="bi bi-dash"></i></button>
          <span class="qty-value">${c.qty}</span>
          <button class="qty-btn" onclick="changeQty(${c.id}, 1)"><i class="bi bi-plus"></i></button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${c.id})" aria-label="Hapus ${c.name}">
        <i class="bi bi-trash3"></i>
      </button>
    </div>
  `).join("");

  const subtotal = getSubtotal();
  const total = subtotal + SERVICE_FEE;
  document.getElementById("cartSubtotal").textContent = formatRupiah(subtotal);
  document.getElementById("cartService").textContent = formatRupiah(SERVICE_FEE);
  document.getElementById("cartTotal").textContent = formatRupiah(total);
}

/* ==============================================================
   6. ANIMASI TAMBAH KE KERANJANG (fly to cart)
============================================================== */
function animateAddToCart(btnEl){
  const btnRect = btnEl.getBoundingClientRect();
  const cartRect = floatingCartBtn.getBoundingClientRect();

  const flyEl = document.createElement("div");
  flyEl.className = "fly-item";
  const size = 18;
  flyEl.style.width = size + "px";
  flyEl.style.height = size + "px";
  flyEl.style.left = (btnRect.left + btnRect.width / 2 - size / 2) + "px";
  flyEl.style.top = (btnRect.top + btnRect.height / 2 - size / 2) + "px";
  flyEl.style.transition = "all 0.7s cubic-bezier(0.55, 0, 0.85, 0.35)";
  document.body.appendChild(flyEl);

  requestAnimationFrame(() => {
    flyEl.style.left = (cartRect.left + cartRect.width / 2 - size / 2) + "px";
    flyEl.style.top = (cartRect.top + cartRect.height / 2 - size / 2) + "px";
    flyEl.style.transform = "scale(0.3)";
    flyEl.style.opacity = "0.4";
  });

  setTimeout(() => {
    flyEl.remove();
    floatingCartBtn.classList.remove("bump");
    void floatingCartBtn.offsetWidth;
    floatingCartBtn.classList.add("bump");
  }, 700);
}

/* ==============================================================
   7. TOAST NOTIFIKASI
============================================================== */
let toastTimeout;
function showToast(itemName){
  const toastEl = document.getElementById("toastDk");
  document.getElementById("toastSub").textContent = itemName;
  toastEl.classList.add("show-toast");

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toastEl.classList.remove("show-toast");
  }, 2600);
}

/* ==============================================================
   8. LOGIN CHECK -> LANJUT ORDER
============================================================== */
document.getElementById("lanjutOrderBtn").addEventListener("click", function(){
  const isLoggedIn = localStorage.getItem("dapurkost_logged_in") === "true";

  if(!isLoggedIn){
    // simpan tujuan redirect setelah login berhasil
    localStorage.setItem("dapurkost_redirect_after_login", "checkout.html");
    window.location.href = "login.html";
    return;
  }

  window.location.href = "checkout.html";
});

document.getElementById("openCartFromNav").addEventListener("click", function(e){
  e.preventDefault();
  const offcanvas = new bootstrap.Offcanvas(document.getElementById("sideCart"));
  offcanvas.show();
});

/* ==============================================================
   9. NAVBAR SCROLL EFFECT
============================================================== */
const navbar = document.getElementById("mainNavbar");
window.addEventListener("scroll", function(){
  if(window.scrollY > 40){
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

/* ==============================================================
   10. RIPPLE EFFECT
============================================================== */
document.querySelectorAll(".btn-ripple").forEach(function(btn){
  btn.addEventListener("click", function(e){
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement("span");
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.className = "ripple-span";
    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = x + "px";
    ripple.style.top = y + "px";

    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

/* ==============================================================
   11. LOADING SCREEN
============================================================== */
window.addEventListener("load", function(){
  const loader = document.getElementById("loading-screen");
  setTimeout(() => loader.classList.add("hide"), 400);
});

/* ==============================================================
   12. INIT
============================================================== */
renderMenu();
updateCartUI();
