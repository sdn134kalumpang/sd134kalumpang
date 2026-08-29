// js/main.js - Dynamic rendering from JSON
document.addEventListener('DOMContentLoaded', async () => {
  // Set current date
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const currentDate = new Date().toLocaleDateString('id-ID', dateOptions);
  const dateEl = document.getElementById('currentDate');
  if (dateEl) dateEl.textContent = currentDate;

  try {
    // Statistik
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

    // Layanan
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

    // Berita
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
    console.error('Failed to load JSON data', e);
  }
});
