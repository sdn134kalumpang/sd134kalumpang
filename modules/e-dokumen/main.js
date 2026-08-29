// modules/e-dokumen/main.js - FIXED - Single Source Router - taat v3
// Repo path: sd134kalumpang/modules/e-dokumen/main.js - sesuai image_2274b6.png
// Load features/arsip.js -> init_arsip

document.addEventListener('DOMContentLoaded', () => {
  if(typeof ServiceMenu !== 'undefined') ServiceMenu.checkAccess();
  const user = ServiceMenu && ServiceMenu.getCurrentUser ? ServiceMenu.getCurrentUser() : {nama:'Admin'};
  const el = document.getElementById('sidebarUserName');
  if(el) el.textContent = user.nama || 'Admin';
  if(typeof ServiceMenu !== 'undefined') ServiceMenu.renderSidebar('dynamicSidebar');
  const params = new URLSearchParams(window.location.search);
  const fitur = (params.get('fitur')||'arsip').toLowerCase();
  const map = { 'arsip':'arsip', 'upload':'upload', 'laporan':'laporan', 'dll':'dll' };
  const key = map[fitur]||'arsip';
  const bc = document.getElementById('breadcrumbFitur');
  if(bc) bc.textContent = key.toUpperCase();
  loadFeature(key);
});

function loadFeature(key){
  const container = document.getElementById('mainContent');
  const initName = 'init_' + key.replace(/-/g,'_');
  // Path FIX: ./features/arsip.js (relative dari index.html di modules/e-dokumen/)
  const script = document.createElement('script');
  script.src = './features/' + key + '.js?v=' + Date.now();
  script.onload = ()=>{
    const fn = window[initName];
    if(fn) fn(container);
    else container.innerHTML = '<div class="card" style="padding:20px;background:white;">Init '+initName+' tidak ditemukan di features/'+key+'.js<br>Pastikan file '+key+'.js ada di sd134kalumpang/modules/e-dokumen/features/ dan berisi window.'+initName+' = function(container){...}</div>';
  };
  script.onerror = ()=>{
    container.innerHTML = '<div class="card" style="padding:20px;background:white;"><h3>File features/'+key+'.js 404</h3><p>Path GitHub harus: <code>sd134kalumpang/modules/e-dokumen/features/arsip.js</code><br>Saat ini di repo kamu (image_2274b6.png) cuma ada tes.js - hapus tes.js dan upload arsip.js ke folder features/</p><a href="./index.html?fitur=arsip" style="background:#0d3b66;color:white;padding:8px 12px;border-radius:8px;">Reload</a></div>';
  };
  document.body.appendChild(script);
}
