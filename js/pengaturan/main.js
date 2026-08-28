// js/pengaturan/main.js - ROUTER MANDIRI - FIX HAK AKSES CONTROL CENTER PRESISI - Taat v3
// Fix: Control Center hanya boleh jika punya pengaturan:control_center, bukan hanya pengaturan:akun_saya

document.addEventListener('DOMContentLoaded', () => {
  if(typeof ServiceMenu==='undefined'){ console.error('ServiceMenu not found'); return; }
  ServiceMenu.checkAccess();
  const user=ServiceMenu.getCurrentUser();
  const elName=document.getElementById('sidebarUserName');
  if(elName) elName.textContent=user.nama;
  
  const isAdmin=ServiceMenu.isAdmin();
  const hasControlCenter = ServiceMenu.hasSubAccess ? ServiceMenu.hasSubAccess('pengaturan','Control Center') : ServiceMenu.hasAccess('pengaturan');
  const hasAkunSaya = ServiceMenu.hasSubAccess ? ServiceMenu.hasSubAccess('pengaturan','Akun Saya') : true;
  
  const tabControl=document.getElementById('tabControlCenter');
  const tabAkun=document.getElementById('tabAkunSaya');
  const panelControl=document.getElementById('panelControlCenter');
  const panelAkun=document.getElementById('panelAkunSaya');
  const adminWarning=document.getElementById('adminWarning');
  
  // FIX PRESISI: Control Center hanya untuk admin whitelist atau yang punya pengaturan:control_center
  // Jika user hanya punya pengaturan:akun_saya dan pengaturan:pengumuman_berjalan tapi TIDAK punya pengaturan:control_center -> blokir
  if(!isAdmin && !hasControlCenter){
    if(tabControl) tabControl.style.display='none';
    if(panelControl) panelControl.style.display='none';
    if(adminWarning) {
      const perms = user.permissions || [];
      const hasAkun = perms.includes('pengaturan:akun_saya');
      const hasPengumuman = perms.includes('pengaturan:pengumuman_berjalan');
      adminWarning.textContent = '⛔ Akses Control Center ditolak - Anda tidak memiliki hak pengaturan:control_center. Hak Anda: '+perms.length+' sub fitur ('+(hasAkun?'akun_saya, ':'')+(hasPengumuman?'pengumuman_berjalan, ':'')+'...). Hubungi Super Admin untuk diberi hak control_center.';
      adminWarning.className = 'mb-4 p-3 rounded-xl bg-[#fee2e2] border border-[#fecaca] text-[12px] text-[#dc2626]';
      adminWarning.style.display='block';
    }
    setTimeout(()=>{ if(tabAkun) tabAkun.click(); }, 300);
  } else {
    if(adminWarning && isAdmin){
      adminWarning.textContent = '⚠️ Mode Super Admin - Kamu bisa mengatur semua: Pengumuman Berjalan, User + Hak Akses, Info Sekolah';
      adminWarning.className = 'mb-4 p-3 rounded-xl bg-[#fff9c4] border border-[#ffec99] text-[12px]';
      adminWarning.style.display='block';
    } else if(adminWarning && hasControlCenter){
      adminWarning.textContent = '✅ Mode Control Center - Anda memiliki hak pengaturan:control_center ('+user.permissions.length+' sub fitur)';
      adminWarning.className = 'mb-4 p-3 rounded-xl bg-[#dbeafe] border border-[#bfdbfe] text-[12px] text-[#0d3b66]';
      adminWarning.style.display='block';
    } else if(adminWarning){
      adminWarning.style.display='none';
    }
  }

  function switchTab(target){
    if(target==='control'){
      // Cek hak control_center spesifik, bukan hanya pengaturan umum
      if(!isAdmin && !ServiceMenu.hasSubAccess('pengaturan','Control Center')){
        alert('⛔ Akses ditolak! Anda tidak memiliki hak akses pengaturan:control_center.\n\nHak Anda saat ini ('+user.permissions.length+'): \n'+user.permissions.slice(0,10).join(', ')+'...\n\nDi Firestore Anda hanya punya: pengaturan:akun_saya dan pengaturan:pengumuman_berjalan (index 38,39) tapi TIDAK ada pengaturan:control_center.\n\nHubungi Super Admin untuk menambahkan hak control_center.');
        if(tabAkun) tabAkun.click();
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
  
  // Default tab
  if(isAdmin || hasControlCenter) switchTab('control'); else switchTab('akun');

  const btnLogout=document.getElementById('btnLogout');
  if(btnLogout) btnLogout.onclick=()=>ServiceMenu.logout();

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
      if(list && list.length){
        localStorage.setItem('users_db_v2', JSON.stringify(list));
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
