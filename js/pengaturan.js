// js/pengaturan.js V2 - Control Center dengan Pengumuman & Hak Akses
document.addEventListener('DOMContentLoaded', () => {
  if(typeof ServiceMenu==='undefined'){ console.error('ServiceMenu not found'); return; }
  ServiceMenu.checkAccess();
  const user=ServiceMenu.getCurrentUser();
  const elName=document.getElementById('sidebarUserName'); if(elName) elName.textContent=user.nama;
  const isAdmin=ServiceMenu.isAdmin();
  const tabControl=document.getElementById('tabControlCenter');
  const tabAkun=document.getElementById('tabAkunSaya');
  const panelControl=document.getElementById('panelControlCenter');
  const panelAkun=document.getElementById('panelAkunSaya');
  if(!isAdmin){ tabControl.style.display='none'; panelControl.style.display='none'; document.getElementById('adminWarning').style.display='none'; }

  function switchTab(target){
    if(target==='control'){
      if(!isAdmin) return alert('Akses ditolak! Hanya Admin');
      tabControl.className='px-5 py-2.5 rounded-full text-[12px] font-bold border tab-active';
      tabAkun.className='px-5 py-2.5 rounded-full text-[12px] font-bold border tab-inactive';
      panelControl.classList.remove('hidden'); panelAkun.classList.add('hidden');
      loadPengumuman(); loadUsers(); loadSchoolInfo();
    } else {
      tabAkun.className='px-5 py-2.5 rounded-full text-[12px] font-bold border tab-active';
      tabControl.className='px-5 py-2.5 rounded-full text-[12px] font-bold border tab-inactive';
      panelAkun.classList.remove('hidden'); panelControl.classList.add('hidden');
      loadAkunSaya();
    }
  }
  tabControl.onclick=()=>switchTab('control');
  tabAkun.onclick=()=>switchTab('akun');
  if(isAdmin) switchTab('control'); else switchTab('akun');

  // === PENGUMUMAN BERJALAN ===
  function loadPengumuman(){
    const list=ServiceMenu.getAnnouncements();
    const container=document.getElementById('pengumumanList');
    container.innerHTML='';
    list.forEach(p=>{
      container.innerHTML+=`<div class="flex items-center justify-between p-3 rounded-xl border ${p.aktif?'bg-[#e8f5e9] border-green-200':'bg-[#f7f9fc] border-[#e8eef6]'} mb-2"><div class="flex items-center gap-2"><input type="checkbox" ${p.aktif?'checked':''} onchange="togglePeng(${p.id})" class="w-4 h-4"><span class="text-[13px]">${p.teks}</span></div><button onclick="hapusPeng(${p.id})" class="text-[11px] text-red-500 font-bold px-2">HAPUS</button></div>`;
    });
    const preview=list.filter(p=>p.aktif).map(p=>p.teks).join(' ');
    document.getElementById('previewMarquee').textContent = preview || 'Tidak ada pengumuman aktif';
  }
  window.hapusPeng=(id)=>{ if(confirm('Hapus pengumuman ini?')){ ServiceMenu.deleteAnnouncement(id); loadPengumuman(); } };
  window.togglePeng=(id)=>{ ServiceMenu.toggleAnnouncement(id); loadPengumuman(); };
  document.getElementById('formPengumuman').onsubmit=(e)=>{
    e.preventDefault();
    const teks=document.getElementById('newPengumuman').value;
    if(!teks) return;
    ServiceMenu.addAnnouncement(teks);
    e.target.reset(); loadPengumuman();
  };

  // === USER MANAGEMENT V2 ===
  function renderPermissionCheckboxes(containerId, selected=[]){
    const container=document.getElementById(containerId);
    container.innerHTML='';
    ServiceMenu.getFeatures().forEach(f=>{
      const checked=selected.includes(f.id)?'checked':'';
      container.innerHTML+=`<label class="flex items-center gap-2 p-2 rounded-lg hover:bg-[#f7f9fc] cursor-pointer border border-transparent hover:border-[#e8eef6]"><input type="checkbox" value="${f.id}" ${checked} class="perm-check w-4 h-4 rounded"><span class="text-[12px]">${f.icon} ${f.label}</span></label>`;
    });
  }
  renderPermissionCheckboxes('permCheckboxes');

  function loadUsers(){
    const users=ServiceMenu.getUsers();
    const tbody=document.getElementById('userTableBody');
    tbody.innerHTML='';
    users.forEach(u=>{
      const permCount = u.permissions ? u.permissions.length : 0;
      tbody.innerHTML+=`<tr class="border-b border-[#f1f5f9]"><td class="py-3"><div class="flex items-center gap-2"><div class="w-8 h-8 rounded-full bg-[#0d3b66] text-white flex items-center justify-center text-[11px] font-bold">${u.inisial}</div><div><div class="font-semibold text-[13px]">${u.nama}</div><div class="text-[11px] text-black/50">${u.email}</div><div class="text-[10px] text-black/40">${u.jabatan}</div></div></div></td><td class="py-3 text-[12px]">${u.role}<br><span class="text-[10px] bg-[#f1f5f9] px-1 rounded">${permCount} fitur</span></td><td class="py-3"><span class="px-2 py-1 rounded-full text-[11px] font-bold ${u.status==='Hadir'?'badge-hadir':u.status==='Izin'?'badge-izin':'badge-online'}">${u.status}</span></td><td class="py-3"><button onclick="hapusUser(${u.id})" class="text-[11px] text-red-500 hover:underline">Hapus</button></td></tr>`;
    });
  }
  window.hapusUser=(id)=>{ if(confirm('Hapus user ini?')){ ServiceMenu.deleteUser(id); loadUsers(); } };
  document.getElementById('formTambahUser').onsubmit=(e)=>{
    e.preventDefault();
    const nama=document.getElementById('newNama').value;
    const email=document.getElementById('newEmail').value;
    const role=document.getElementById('newRole').value;
    const jabatan=document.getElementById('newJabatan').value;
    const checks=document.querySelectorAll('#permCheckboxes .perm-check:checked');
    const permissions=Array.from(checks).map(c=>c.value);
    if(permissions.length===0){ alert('Pilih minimal 1 hak akses fitur!'); return; }
    if(!email.includes('@')){ alert('Email tidak valid!'); return; }
    ServiceMenu.addUser({ nama, email, role, jabatan, permissions });
    e.target.reset(); renderPermissionCheckboxes('permCheckboxes'); loadUsers();
    alert('User '+nama+' berhasil dibuat!\nLogin pakai Email: '+email);
  };

  function loadSchoolInfo(){
    const info=ServiceMenu.getSchoolInfo();
    document.getElementById('infoNPSN').value=info.npsn;
    document.getElementById('infoNama').value=info.nama;
    document.getElementById('infoAlamat').value=info.alamat;
  }
  document.getElementById('formInfoSekolah').onsubmit=(e)=>{
    e.preventDefault();
    const info=ServiceMenu.getSchoolInfo();
    info.npsn=document.getElementById('infoNPSN').value;
    info.nama=document.getElementById('infoNama').value;
    info.alamat=document.getElementById('infoAlamat').value;
    ServiceMenu.saveSchoolInfo(info); alert('Info sekolah disimpan!');
  };
  function loadAkunSaya(){
    const u=ServiceMenu.getCurrentUser();
    document.getElementById('akunNama').value=u.nama;
    document.getElementById('akunEmail').value=u.email;
    document.getElementById('akunRole').value=u.role;
  }
  document.getElementById('btnLogout').onclick=()=>ServiceMenu.logout();
});
