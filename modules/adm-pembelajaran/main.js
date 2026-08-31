// modules/adm-pembelajaran/main.js - Single Source Router - Taat v3
// Load features/lckh.js -> initLCKH

document.addEventListener('DOMContentLoaded', () => {
  if (typeof ServiceMenu !== 'undefined') ServiceMenu.checkAccess();
  const user = ServiceMenu && ServiceMenu.getCurrentUser ? ServiceMenu.getCurrentUser() : { nama: 'Admin' };
  const el = document.getElementById('sidebarUserName');
  if (el) el.textContent = user.nama || 'Admin';
  if (typeof ServiceMenu !== 'undefined') ServiceMenu.renderSidebar('dynamicSidebar');

  const params = new URLSearchParams(window.location.search);
  const fitur = (params.get('fitur') || 'lckh').toLowerCase();

  // Mapping fitur - bisa ditambah nanti (rpm, bank-soal, dll)
  const map = {
    'lckh': 'lckh',
    'rpm': 'rpm',
    'bank-soal': 'bank-soal',
    'kisi-kisi': 'kisi-kisi'
  };
  const key = map[fitur] || 'lckh';

  const bc = document.getElementById('breadcrumbFitur');
  if (bc) bc.textContent = key.toUpperCase().replace(/-/g, ' ');

  loadFeature(key);
});

function loadFeature(key) {
  const container = document.getElementById('mainContent');
  // initLCKH, initRPM, dll (camelCase dari nama file)
  const initName = 'init' + key.split('-').map((w, i) => i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1)).join('');

  const script = document.createElement('script');
  script.src = './features/' + key + '.js?v=' + Date.now();

  script.onload = () => {
    const fn = window[initName];
    if (fn) {
      fn(container);
    } else {
      container.innerHTML = '<div style="padding:20px;background:white;border-radius:12px;">'
        + '<h3 style="color:#dc2626;">⚠️ Fungsi ' + initName + ' tidak ditemukan</h3>'
        + '<p style="font-size:12px;color:#64748b;">Pastikan file features/' + key + '.js berisi <code>window.' + initName + ' = function(container){...}</code></p>'
        + '<a href="./index.html?fitur=lckh" style="background:#0d3b66;color:white;padding:8px 12px;border-radius:8px;display:inline-block;margin-top:12px;text-decoration:none;">← Kembali ke LCKH</a>'
        + '</div>';
    }
  };

  script.onerror = () => {
    container.innerHTML = '<div style="padding:20px;background:white;border-radius:12px;">'
      + '<h3 style="color:#dc2626;">❌ File features/' + key + '.js 404</h3>'
      + '<p style="font-size:12px;color:#64748b;">Path harus: <code>sd134kalumpang/modules/adm-pembelajaran/features/' + key + '.js</code></p>'
      + '<a href="./index.html?fitur=lckh" style="background:#0d3b66;color:white;padding:8px 12px;border-radius:8px;display:inline-block;margin-top:12px;text-decoration:none;">← Kembali ke LCKH</a>'
      + '</div>';
  };

  document.body.appendChild(script);
}
