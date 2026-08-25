// modules/master-data/main.js - ROUTER sesuai repo: modules/master-data/
document.addEventListener('DOMContentLoaded', () => {
  if(typeof ServiceMenu==='undefined'){ console.error('ServiceMenu not found'); return; }
  ServiceMenu.checkAccess();
  const user = ServiceMenu.getCurrentUser();
  const auto = ServiceMenu.getAutoFillProfile();
  const elName = document.getElementById('sidebarUserName');
  const elRole = document.getElementById('sidebarUserRole');
  if(elName) elName.textContent = user.nama;
  if(elRole) elRole.textContent = user.jabatan;
  const badge = document.getElementById('dateBadge');
  if(badge) badge.textContent = new Date().toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'numeric'});
  ServiceMenu.renderSidebar('dynamicSidebar');
  setTimeout(()=>{
    document.querySelectorAll('.has-sub').forEach(btn=>{
      btn.onclick = (e)=>{ e.preventDefault(); const grp=btn.closest('.nav-group'); grp.classList.toggle('open'); const sub=grp.querySelector('.sub-menu'); if(sub) sub.style.display=grp.classList.contains('open')?'block':'none'; };
    });
    const lb=document.getElementById('logoutBtn'); if(lb) lb.onclick=()=>ServiceMenu.logout();
  },300);

  const params = new URLSearchParams(window.location.search);
  const fitur = (params.get('fitur')||'kop').toLowerCase();
  const map = {
    'kop':'kop',
    'kop-administrasi':'kop',
    'data-peserta-didik':'data-peserta-didik',
    'sarana':'sarana',
    'data-tp':'data-tp',
    'data-cp':'data-cp',
    'data-atp':'data-atp',
    'data-mapel':'data-mapel'
  };
  const key = map[fitur]||'kop';
  document.getElementById('breadcrumbFitur').textContent = fitur.toUpperCase();
  loadFeature(key);
});

function loadFeature(key){
  const container = document.getElementById('mainContent');
  const script = document.createElement('script');
  script.src = `./features/${key}.js`;
  script.onload = ()=>{ if(window['init_'+key]) window['init_'+key](container); };
  script.onerror = ()=>{ container.innerHTML = `<div class="card" style="padding:20px;"><h3>Fitur ${key} belum tersedia</h3><p>File features/${key}.js belum dibuat. Path: modules/master-data/features/${key}.js</p><a href="?fitur=kop" class="btn btn-accent">Kembali ke Kop</a></div>`; };
  document.body.appendChild(script);
}
