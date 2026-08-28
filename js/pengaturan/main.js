// js/pengaturan/main.js - ROUTER MANDIRI - Control Center Pecah - Taat v3
// Tidak kurangi logic, hanya pecah tepat sasaran

document.addEventListener('DOMContentLoaded', () => {
  if(typeof ServiceMenu==='undefined'){ console.error('ServiceMenu not found'); return; }
  ServiceMenu.checkAccess();
  const user=ServiceMenu.getCurrentUser();
  const elName=document.getElementById('sidebarUserName');
  if(elName) elName.textContent=user.nama;
  const isAdmin=ServiceMenu.isAdmin();
  const tabControl=document.getElementById('tabControlCenter');
  const tabAkun=document.getElementById('tabAkunSaya');
  const panelControl=document.getElementById('panelControlCenter');
  const panelAkun=document.getElementById('panelAkunSaya');
  const adminWarning=document.getElementById('adminWarning');
  
  if(!isAdmin){
    if(tabControl) tabControl.style.display='none';
    if(panelControl) panelControl.style.display='none';
    if(adminWarning) adminWarning.style.display='none';
  }

  function switchTab(target){
    if(target==='control'){
      if(!isAdmin) return alert('Akses ditolak! Hanya Admin');
      if(tabControl) tabControl.className='px-5 py-2.5 rounded-full text-[12px] font-bold border tab-active';
      if(tabAkun) tabAkun.className='px-5 py-2.5 rounded-full text-[12px] font-bold border tab-inactive';
      if(panelControl) panelControl.classList.remove('hidden');
      if(panelAkun) panelAkun.classList.add('hidden');
      
      // Load semua fitur mandiri
      if(window.PengumumanFeature){ PengumumanFeature.load(); PengumumanFeature.initForm(); }
      if(window.UserManagementFeature){ UserManagementFeature.load(); UserManagementFeature.initForm(); }
      if(window.InfoSekolahFeature){ InfoSekolahFeature.load(); InfoSekolahFeature.initForm(); }
    } else {
      if(tabAkun) tabAkun.className='px-5 py-2.5 rounded-full text-[12px] font-bold border tab-active';
      if(tabControl) tabControl.className='px-5 py-2.5 rounded-full text-[12px] font-bold border tab-inactive';
      if(panelAkun) panelAkun.classList.remove('hidden');
      if(panelControl) panelControl.classList.add('hidden');
      if(window.AkunSayaFeature) AkunSayaFeature.load();
    }
  }

  if(tabControl) tabControl.onclick=()=>switchTab('control');
  if(tabAkun) tabAkun.onclick=()=>switchTab('akun');
  if(isAdmin) switchTab('control'); else switchTab('akun');

  const btnLogout=document.getElementById('btnLogout');
  if(btnLogout) btnLogout.onclick=()=>ServiceMenu.logout();

  // Firebase realtime untuk pengumuman & users (sinkron)
  if(window.FirebaseService && FirebaseService.isEnabled()){
    FirebaseService.listen('pengumuman', (list)=>{
      if(list.length){
        const md=ServiceMenu.getMasterData();
        md.pengumuman=list;
        ServiceMenu.saveMasterData(md);
        if(window.PengumumanFeature) PengumumanFeature.load();
      }
    });
    FirebaseService.listen('users_db', (list)=>{
      if(list.length){
        localStorage.setItem('users_db_v2', JSON.stringify(list));
        if(window.UserManagementFeature) UserManagementFeature.load();
      }
    });
  }
});

// Legacy global untuk onclick di HTML (tetap support)
window.hapusPeng = (id)=>{ if(window.PengumumanFeature) PengumumanFeature.hapus(id); };
window.togglePeng = (id)=>{ if(window.PengumumanFeature) PengumumanFeature.toggle(id); };
window.hapusUser = (id)=>{ if(window.UserManagementFeature) UserManagementFeature.hapus(id); };
