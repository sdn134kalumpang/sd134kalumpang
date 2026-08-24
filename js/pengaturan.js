
// js/pengaturan.js - Logika UI Pengaturan
// DEPENDENCY: js/config/service-menu.js

document.addEventListener('DOMContentLoaded', () => {
  if(typeof ServiceMenu === 'undefined'){
    console.error('ServiceMenu tidak ditemukan! Pastikan js/config/service-menu.js di-load sebelum file ini');
    return;
  }
  ServiceMenu.checkAccess();
  const user = ServiceMenu.getCurrentUser();
  const nameEl = document.getElementById('sidebarUserName');
  if(nameEl) nameEl.textContent = user.nama;
  const isAdmin = ServiceMenu.isAdmin();

  const tabControl = document.getElementById('tabControlCenter');
  const tabAkun = document.getElementById('tabAkunSaya');
  const panelControl = document.getElementById('panelControlCenter');
  const panelAkun = document.getElementById('panelAkunSaya');

  if(!isAdmin){
    tabControl.style.display = 'none';
    panelControl.style.display = 'none';
    tabAkun.click();
    document.getElementById('adminWarning').style.display = 'none';
  }

  function switchTab(target){
    if(target === 'control'){
      if(!isAdmin) return alert('Akses ditolak! Hanya Admin yang bisa masuk Control Center');
      tabControl.className = 'px-5 py-2.5 rounded-full text-[12px] font-bold tracking-wide border tab-active';
      tabAkun.className = 'px-5 py-2.5 rounded-full text-[12px] font-bold tracking-wide border tab-inactive';
      panelControl.classList.remove('hidden');
      panelAkun.classList.add('hidden');
      loadUsers(); loadSchoolInfo();
    } else {
      tabAkun.className = 'px-5 py-2.5 rounded-full text-[12px] font-bold tracking-wide border tab-active';
      tabControl.className = 'px-5 py-2.5 rounded-full text-[12px] font-bold tracking-wide border tab-inactive';
      panelAkun.classList.remove('hidden');
      panelControl.classList.add('hidden');
      loadAkunSaya();
    }
  }

  tabControl.onclick = () => switchTab('control');
  tabAkun.onclick = () => switchTab('akun');
  if(isAdmin) switchTab('control'); else switchTab('akun');

  function loadUsers(){
    const users = ServiceMenu.getUsers();
    const tbody = document.getElementById('userTableBody');
    tbody.innerHTML = '';
    users.forEach(u => {
      tbody.innerHTML += `<tr class="border-b border-[#f1f5f9]"><td class="py-3 flex items-center gap-2"><div class="w-8 h-8 rounded-full bg-[#0d3b66] text-white flex items-center justify-center text-[11px] font-bold">${u.inisial}</div><div><div class="font-semibold text-[13px]">${u.nama}</div><div class="text-[11px] text-black/50">${u.jabatan}</div></div></td><td class="py-3 text-[12px]">${u.role}</td><td class="py-3"><span class="px-2 py-1 rounded-full text-[11px] font-bold ${u.status==='Hadir'?'badge-hadir':u.status==='Izin'?'badge-izin':'badge-online'}">${u.status}</span></td><td class="py-3"><button onclick="hapusUser(${u.id})" class="text-[11px] text-red-500 hover:underline">Hapus</button></td></tr>`;
    });
  }
  window.hapusUser = (id) => { if(confirm('Hapus user ini?')){ ServiceMenu.deleteUser(id); loadUsers(); } };
  document.getElementById('formTambahUser').onsubmit = (e) => {
    e.preventDefault();
    const nama = document.getElementById('newNama').value;
    const role = document.getElementById('newRole').value;
    const jabatan = document.getElementById('newJabatan').value;
    ServiceMenu.addUser({ inisial: nama.substring(0,2).toUpperCase(), nama, role, jabatan, status: 'Hadir' });
    e.target.reset(); loadUsers();
  };
  function loadSchoolInfo(){
    const info = ServiceMenu.getSchoolInfo();
    document.getElementById('infoNPSN').value = info.npsn;
    document.getElementById('infoNama').value = info.nama;
    document.getElementById('infoAlamat').value = info.alamat;
  }
  document.getElementById('formInfoSekolah').onsubmit = (e) => {
    e.preventDefault();
    const info = ServiceMenu.getSchoolInfo();
    info.npsn = document.getElementById('infoNPSN').value;
    info.nama = document.getElementById('infoNama').value;
    info.alamat = document.getElementById('infoAlamat').value;
    ServiceMenu.saveSchoolInfo(info);
    alert('Info sekolah disimpan!');
  };
  function loadAkunSaya(){
    const u = ServiceMenu.getCurrentUser();
    document.getElementById('akunNama').value = u.nama;
    document.getElementById('akunEmail').value = u.email;
    document.getElementById('akunRole').value = u.role;
  }
  document.getElementById('btnLogout').onclick = () => ServiceMenu.logout();
});
