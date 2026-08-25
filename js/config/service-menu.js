
// js/config/service-menu.js - OTAK SISTEM V2 - SDN 134 Kalumpang
// Fitur: User + Hak Akses + Pengumuman Berjalan

const PATH_CONFIG = {
  base: '/sd134kalumpang/',
  pages: {
    dashboard: 'dashboard.html',
    pengaturan: 'pengaturan.html',
    login: 'index.html'
  }
};

const ALL_FEATURES = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'e_dokumen', label: 'E-Dokumen', icon: '📁', pages:'edokumen.html'},
  { id: 'admin_guru', label: 'Administrasi Guru', icon: '👩‍🏫' },
  { id: 'data_statistik', label: 'Data Statistik', icon: '📈' },
  { id: 'e_portal', label: 'E-Portal', icon: '🌐' },
  { id: 'master_data', label: 'Master Data', icon: '🗃️' },
  { id: 'pengaturan', label: 'Pengaturan', icon: '⚙️' },
  { id: 'cooming soon', label: 'Cooming Soon', icon: '⚙️' },
];

const ServiceMenu = {
  getCurrentUser: () => ({
    nama: localStorage.getItem('nama') || localStorage.getItem('userEmail') || 'Muh Arfah Wahlii P.',
    role: localStorage.getItem('role') || 'super_admin',
    email: localStorage.getItem('userEmail') || 'admin@sdn134.sch.id',
    permissions: JSON.parse(localStorage.getItem('userPermissions') || '[]')
  }),
  isAdmin: () => ['super_admin','admin'].includes(localStorage.getItem('role') || 'super_admin'),
  checkAccess: () => {
    if(localStorage.getItem('isLoggedIn') !== 'true'){
      window.location.href = PATH_CONFIG.pages.login;
      return false;
    }
    return true;
  },
  // === PENGUMUMAN BERJALAN (Untuk Halaman Depan) ===
  getAnnouncements: () => JSON.parse(localStorage.getItem('pengumuman_berjalan') || JSON.stringify([
    { id: 1, teks: "📢 Selamat datang di Portal SDN 134 Kalumpang - Akreditasi B | ", aktif: true },
    { id: 2, teks: "📚 PPDB Tahun Ajaran 2025/2026 Telah Dibuka! Daftar segera | ", aktif: true },
    { id: 3, teks: "🏫 48 Siswa Aktif & 9 Guru - Kab. Bulukumba, Sulsel | ", aktif: false }
  ])),
  saveAnnouncements: (list) => localStorage.setItem('pengumuman_berjalan', JSON.stringify(list)),
  addAnnouncement: function(teks){ const list=this.getAnnouncements(); list.push({id:Date.now(), teks: teks + " | ", aktif:true}); this.saveAnnouncements(list); return list; },
  deleteAnnouncement: function(id){ let list=this.getAnnouncements().filter(a=>a.id!=id); this.saveAnnouncements(list); return list; },
  toggleAnnouncement: function(id){ let list=this.getAnnouncements(); list=list.map(a=> a.id==id ? {...a, aktif:!a.aktif} : a); this.saveAnnouncements(list); return list; },

  // === USER MANAGEMENT V2 (dengan email & hak akses) ===
  _getUsers: () => {
    const def = [
      { id:1, inisial:'MA', nama:'Muh Arfah Wahlii P.', email:'muharfah@sdn134.sch.id', role:'super_admin', jabatan:'Super Admin • Operator', status:'online', permissions:['dashboard','e_dokumen','admin_guru','data_statistik','e_portal','master_data','pengaturan'] },
      { id:2, inisial:'SA', nama:'Satia, S.Pd', email:'kepsek@sdn134.sch.id', role:'kepsek', jabatan:'Kepsek', mapel:'Tematik', status:'Hadir', permissions:['dashboard','e_dokumen','admin_guru','pengaturan'] },
      { id:3, inisial:'AR', nama:'Muh Arfah', email:'operator@sdn134.sch.id', role:'guru', jabatan:'Operator', mapel:'TIK', status:'Hadir', permissions:['dashboard','e_dokumen'] },
    ];
    return JSON.parse(localStorage.getItem('users_db_v2') || JSON.stringify(def));
  },
  _saveUsers: (u) => localStorage.setItem('users_db_v2', JSON.stringify(u)),
  getUsers: function(){ return this._getUsers(); },
  getFeatures: () => ALL_FEATURES,
  addUser: function(user){
    const users=this._getUsers();
    user.id=Date.now();
    user.inisial=user.nama.substring(0,2).toUpperCase();
    user.status='Hadir';
    if(!user.permissions) user.permissions=['dashboard'];
    users.push(user);
    this._saveUsers(users);
    return users;
  },
  deleteUser: function(id){ let u=this._getUsers().filter(x=>x.id!=id); this._saveUsers(u); return u; },

  // === INFO SEKOLAH ===
  getSchoolInfo: () => JSON.parse(localStorage.getItem('school_info') || JSON.stringify({ npsn:'40312947', nama:'SDN 134 Kalumpang', alamat:'Trilino, Bontotiro - Bulukumba', akreditasi:'B', totalSiswa:48, totalGuru:9, kab:'Kab. Bulukumba, Sulsel 92572', tahunAjaran:'2025/2026' })),
  saveSchoolInfo: (info) => localStorage.setItem('school_info', JSON.stringify(info)),
  logout: () => { localStorage.removeItem('isLoggedIn'); localStorage.removeItem('role'); window.location.href=PATH_CONFIG.pages.login; }
};
window.ServiceMenu=ServiceMenu;
window.PATH_CONFIG=PATH_CONFIG;
window.ALL_FEATURES=ALL_FEATURES;
