// js/main.js - Dynamic rendering + Simplified Login Logic
document.addEventListener('DOMContentLoaded', async () => {
  // 1. Set Current Date
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const currentDate = new Date().toLocaleDateString('id-ID', dateOptions);
  const dateEl = document.getElementById('currentDate');
  if (dateEl) dateEl.textContent = currentDate;

  // 2. Load JSON Data
  try {
    const statRes = await fetch('data/statistik.json');
    const stats = await statRes.json();
    const statGrid = document.getElementById('statistik-grid');
    if (statGrid) {
      statGrid.innerHTML = stats.map(s => `
        <div class="stat-card">
          <div class="stat-num">${s.angka}</div>
          <div class="stat-label">${s.label}</div>
        </div>
      `).join('');
    }

    const layananRes = await fetch('data/layanan.json');
    const layanan = await layananRes.json();
    const layananGrid = document.getElementById('layanan-grid');
    if (layananGrid) {
      layananGrid.innerHTML = layanan.map(l => `
        <div class="card">
          <div class="icon">${l.icon}</div>
          <div class="card-title">${l.title}</div>
          <div class="card-desc">${l.desc}</div>
        </div>
      `).join('');
    }

    const beritaRes = await fetch('data/berita.json');
    const berita = await beritaRes.json();
    const beritaGrid = document.getElementById('berita-grid');
    if (beritaGrid) {
      beritaGrid.innerHTML = berita.map(b => `
        <div class="berita-card">
          <div class="berita-date">${b.date}</div>
          <div class="berita-title">${b.title}</div>
          <div class="berita-desc">${b.desc}</div>
          <a class="berita-link" href="#">Baca selengkapnya →</a>
        </div>
      `).join('');
    }
  } catch (e) {
    console.error('Gagal memuat data JSON:', e);
  }

  // 3. === LOGIKA LOGIN MODAL (Disederhanakan) ===
  let captcha = "";
  
  window.generateCaptcha = function() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let c = "";
    for(let i=0; i<4; i++) c += chars[Math.floor(Math.random() * chars.length)];
    captcha = c;
    document.getElementById("captchaCode").textContent = c;
  };
  
  window.openLoginModal = function() {
    document.getElementById('loginModal').style.display = 'flex';
    window.generateCaptcha();
    document.getElementById('errorMsg').style.display = 'none';
    document.getElementById('loginForm').reset();
  };
  
  window.closeLoginModal = function() {
    document.getElementById('loginModal').style.display = 'none';
  };

  // Tutup modal jika klik di luar area konten
  window.onclick = function(event) {
    const modal = document.getElementById('loginModal');
    if (event.target == modal) {
      window.closeLoginModal();
    }
  };

  // Handle Submit Login
  document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim().toLowerCase();
    const inputCaptcha = document.getElementById('captchaInput').value.trim().toUpperCase();
    const err = document.getElementById('errorMsg');
    
    err.style.display = 'none';

    // Validasi Captcha
    if (inputCaptcha !== captcha) {
      err.textContent = 'Kode captcha tidak sesuai. Silakan coba lagi.';
      err.style.display = 'block';
      window.generateCaptcha();
      return;
    }

    // Cek apakah sudah login
    if (localStorage.getItem('isLoggedIn') === 'true') {
      window.location.href = '../dashboard.html';
      return;
    }

    // Validasi Email terhadap data di localStorage (users_db_v2)
    try {
      const users = JSON.parse(localStorage.getItem('users_db_v2') || '[]');
      const user = users.find(u => (u.email || '').toLowerCase() === email);
      
      if (!user) {
        err.textContent = 'Email tidak terdaftar di sistem. Hubungi admin.';
        err.style.display = 'block';
        window.generateCaptcha();
        return;
      }

      // Jika email ditemukan, set session (Password disesuaikan/diabaikan sesuai permintaan)
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('nama', user.nama);
      localStorage.setItem('role', user.role);
      localStorage.setItem('userPermissions', JSON.stringify(user.permissions || []));
      localStorage.setItem('loginTime', new Date().toISOString());

      // Redirect ke dashboard
      window.location.href = '../dashboard.html';
      
    } catch (error) {
      console.error('Login error:', error);
      err.textContent = 'Terjadi kesalahan sistem. Silakan coba lagi.';
      err.style.display = 'block';
    }
  });
});
