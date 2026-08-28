// js/pengaturan/main.js - ROUTER MANDIRI - FIX HAK AKSES SUB FITUR LANGSUNG - Update dari main_11.js ori - Taat v3

document.addEventListener('DOMContentLoaded', () => {
  if(typeof ServiceMenu==='undefined'){ console.error('ServiceMenu not found'); return; }
  ServiceMenu.checkAccess();
  const user=ServiceMenu.getCurrentUser();
  const elName=document.getElementById('sidebarUserName');
  if(elName) elName.textContent=user.nama;
  
  const isAdmin=ServiceMenu.isAdmin();
  const hasPengaturan = ServiceMenu.hasAccess('pengaturan');
  const hasControlCenter = ServiceMenu.hasSubAccess ? ServiceMenu.hasSubAccess('pengaturan','Control Center') : hasPengaturan;
  
  const tabControl=document.getElementById('tabControlCenter');
  const tabAkun=document.getElementById('tabAkunSaya');
  const panelControl=document.getElementById('panelControlCenter');
  const panelAkun=document.getElementById('panelAkunSaya');
  const adminWarning=document.getElementById('adminWarning');
  
  // FIX: Hanya admin asli atau yang punya hak pengaturan/control-center yang bisa lihat Control Center
  if(!isAdmin && !hasPengaturan && !hasControlCenter){
    if(tabControl) tabControl.style.display='none';
    if(panelControl) panelControl.style.display='none';
    if(adminWarning) {
      adminWarning.textContent = '⛔ Akses terbatas - Anda tidak memiliki hak akses Control Center. Anda hanya memiliki '+user.permissions.length+' sub fitur: '+(user.permissions.slice(0,3).join(', '))+'... Hubungi Super Admin.';
      adminWarning.className = 'mb-4 p-3 rounded-xl bg-[#fee2e2] border border-[#fecaca] text-[12px] text-[#dc2626]';
      adminWarning.style.display='block';
    }
    setTimeout(()=>{ if(tabAkun) tabAkun.click(); }, 500);
  } else {
    if(adminWarning && isAdmin){
      adminWarning.textContent = '⚠️ Mode Super Admin - Kamu bisa mengatur semua: Pengumuman Berjalan, User + Hak Akses, Info Sekolah';
      adminWarning.className = 'mb-4 p-3 rounded-xl bg-[#fff9c4] border border-[#ffec99] text-[12px]';
    } else if(adminWarning){
      adminWarning.textContent = 'ℹ️ Mode Terbatas - Hak akses sesuai sub fitur yang diberikan Admin ('+user.permissions.length+' sub fitur)';
      adminWarning.className = 'mb-4 p-3 rounded-xl bg-[#dbeafe] border border-[#bfdbfe] text-[12px]';
      adminWarning.style.display='block';
    }
  }

  function switchTab(target){
    if(target==='control'){
      if(!isAdmin && !ServiceMenu.hasAccess('pengaturan')){
        alert('⛔ Akses ditolak! Anda tidak memiliki hak akses Control Center (pengaturan).\nHak Anda: '+(user.permissions.join(', '))+'\nHubungi Super Admin.');
        return;
      }
      if(tabControl) tabControl.className='px-5 py-2.5 rounded-full text-[12px] font-bold border tab-active';
      if(tabAkun) tabAkun.className='px-5 py-2.5 rounded-full text-[12px] font-bold border tab-inactive';
      if(panelControl) panelControl.classList.remove('hidden');
      if(panelAkun) panelAkun.classList.add('hidden');
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
  if(isAdmin || hasPengaturan) switchTab('control'); else switchTab('akun');

  const btnLogout=document.getElementById('btnLogout');
  if(btnLogout) btnLogout.onclick=()=>ServiceMenu.logout();

  // Firebase realtime untuk pengumuman & users (Firestore only)
  if(window.FirebaseService && FirebaseService.isEnabled()){
    FirebaseService.listen('pengumuman', (list)=>{
      if(list.length){
        const md=ServiceMenu.getMasterData();
        md.pengumuman=list;
        ServiceMenu.saveMasterData(md);
        if(window.PengumumanFeature) PengumumanFeature.load();
      }
    });
    // FIX: listen users_db yang benar (bukan schools/40312947/users_db) - getCollection sudah include schools/40312947
    FirebaseService.listen('users_db', (list)=>{
      if(list && list.length){
        localStorage.setItem('users_db_v2', JSON.stringify(list));
        // Update permissions user yang login agar terpadu di semua device
        const me = list.find(u=> (u.email||'').toLowerCase() === user.email.toLowerCase());
        if(me && me.permissions){
          localStorage.setItem('userPermissions', JSON.stringify(me.permissions));
          localStorage.setItem('user_permissions', JSON.stringify(me.permissions));
          localStorage.setItem('role', me.role);
          localStorage.setItem('userRole', me.role);
        }
        if(window.UserManagementFeature) UserManagementFeature.load();
      }
    });
  }
});

window.hapusPeng = (id)=>{ if(window.PengumumanFeature) PengumumanFeature.hapus(id); };
window.togglePeng = (id)=>{ if(window.PengumumanFeature) PengumumanFeature.toggle(id); };
window.hapusUser = (id)=>{ if(window.UserManagementFeature) UserManagementFeature.hapus(id); };
window.editUser = (id)=>{ if(window.UserManagementFeature) UserManagementFeature.bukaEditUser(id); };
