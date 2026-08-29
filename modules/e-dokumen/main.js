// modules/e-dokumen/main.js - SINGLE SOURCE ROUTER - Arsip + Upload + Laporan + DLL
// Lokasi resmi: /sd134kalumpang/modules/e-dokumen/main.js

document.addEventListener('DOMContentLoaded', () => {
  ServiceMenu.checkAccess();
  const user = ServiceMenu.getCurrentUser();
  const elName = document.getElementById('sidebarUserName');
  if(elName) elName.textContent = user.nama;
  ServiceMenu.renderSidebar('dynamicSidebar');
  const params = new URLSearchParams(window.location.search);
  const fitur = (params.get('fitur')||'arsip').toLowerCase();
  const map = { 'arsip':'arsip', 'upload':'upload', 'laporan':'laporan', 'dll':'dll', 'upload_file':'upload', 'upload-file':'upload' };
  const key = map[fitur]||'arsip';
  const bc = document.getElementById('breadcrumbFitur');
  if(bc) bc.textContent = key.toUpperCase();
  loadFeature(key);
});

function loadFeature(key){
  const container = document.getElementById('mainContent');
  const initName = 'init_' + key.replace(/-/g,'_');
  const script = document.createElement('script');
  script.src = `/sd134kalumpang/modules/e-dokumen/features/${key}.js`;
  script.onload = ()=>{
    const fn = window[initName];
    if(fn) fn(container);
    else container.innerHTML = `<div class="card" style="padding:20px;background:white;">Init ${initName} tidak ditemukan di features/${key}.js<br>Buat file: modules/e-dokumen/features/${key}.js</div>`;
  };
  script.onerror = ()=>{
    container.innerHTML = `<div class="card" style="padding:20px;background:white;"><h3>File ${key}.js belum ada</h3><p>Path: modules/e-dokumen/features/${key}.js</p><p>Saat ini baru Arsip yang sudah jadi.</p><a href="?fitur=arsip" class="btn" style="background:#0d3b66;color:white;padding:8px 16px;border-radius:8px;">Kembali ke Arsip</a></div>`;
  };
  document.body.appendChild(script);
}
