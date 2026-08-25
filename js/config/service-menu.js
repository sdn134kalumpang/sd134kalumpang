// js/config/service-menu.js - V3 BLUEPRINT INFO AWAL - SDN 134 Kalumpang
// Path resmi: js/config/service-menu.js - OTAK SISTEM UTAMA
// Rujukan: Info_awal.docx - 5 Fitur Utama + Auto-fill + Master Data + Kop

const PATH_CONFIG = {
  base: '/sd134kalumpang/',
  pages: {
    dashboard: 'dashboard.html',
    pengaturan: 'pengaturan.html',
    login: 'index.html',
    e_dokumen: 'modules/e-dokumen/index.html',
    admin_guru: 'modules/administrasi-guru/index.html',
    data_statistik: 'modules/data-statistik/index.html',
    e_portal: 'modules/e-portal/index.html',
    master_data: 'modules/master-data/index.html'
  },
  assets: {
    css: 'css/',
    js: 'js/',
    config: 'js/config/'
  }
};

// --- 5 FITUR UTAMA SESUAI Info_awal.docx ---
const ALL_FEATURES = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'e_dokumen', label: 'E-Dokumen', icon: '📁', sub: ['Arsip','Upload File','E-Sign','DLL'] },
  { id: 'admin_guru', label: 'Administrasi Guru', icon: '👩‍🏫', sub: ['Kisi-kisi Soal','Pembuat Soal','Bank Soal','RPM','Bank RPM','LCKH','LKPD','Analisis KKTP','Refleksi','Jurnal','Penilaian','Absensi','Generate CP-TP-ATP','Prosem','Prota','Rumus 8-3-3-4','Kalender Pendidikan','Jadwal Pembelajaran'] },
  { id: 'data_statistik', label: 'Data Statistik', icon: '📈', sub: ['Statistik GTK','Monitoring','Bantuan AI'] },
  { id: 'e_portal', label: 'E-Portal', icon: '🌐', sub: ['SIMPKB','SINDARA','SIMACCA','Data Perpustakaan'] },
  { id: 'master_data', label: 'Master Data', icon: '🗃️', sub: ['Data Peserta Didik','Sarana','Data TP','Data CP','Data ATP','Data Mapel','Kop Administrasi','Coming Soon'] },
  { id: 'pengaturan', label: 'Pengaturan', icon: '⚙️', sub: ['Control Center','Akun Saya','Pengumuman Berjalan'] },
];

const ServiceMenu = {
  // === AUTH & PROFIL ===
  getCurrentUser: () => {
    const base = {
      nama: localStorage.getItem('nama') || 'Muh Arfah Wahlil P.',
      nip: localStorage.getItem('nip') || '198012012010011001',
      email: localStorage.getItem('userEmail') || 'muharfah@sdn134.sch.id',
      role: localStorage.getItem('role') || 'super_admin',
      jabatan: localStorage.getItem('jabatan') || 'Super Admin • Operator',
      permissions: JSON.parse(localStorage.getItem('userPermissions') || '[]'),
      // Untuk auto-fill kepsek
      kepsek_nama: localStorage.getItem('kepsek_nama') || 'Satia, S.Pd',
      kepsek_nip: localStorage.getItem('kepsek_nip') || '197505102005011002'
    };
    return base;
  },
  getAutoFillProfile: function(){
    // ATURAN EMAS: semua sub fitur yang butuh nama guru, nip, kepsek auto fill
    const u = this.getCurrentUser();
    return {
      nama_guru: u.nama,
      nip_guru: u.nip,
      email_guru: u.email,
      jabatan_guru: u.jabatan,
      nama_kepsek: u.kepsek_nama,
      nip_kepsek: u.kepsek_nip,
      nama_sekolah: this.getSchoolInfo().nama,
      npsn: this.getSchoolInfo().npsn,
      alamat_sekolah: this.getSchoolInfo().alamat
    };
  },
  isAdmin: () => ['super_admin','admin'].includes(localStorage.getItem('role') || 'super_admin'),
  checkAccess: () => {
    if(localStorage.getItem('isLoggedIn') !== 'true'){
      window.location.href = PATH_CONFIG.pages.login;
      return false;
    }
    return true;
  },
  hasAccess: function(featureId){
    const perms = this.getCurrentUser().permissions;
    if(this.isAdmin()) return true; // admin full
    if(perms.length===0) return true; // default allow jika belum set
    return perms.includes(featureId);
  },

  // === PENGUMUMAN BERJALAN (Tampil di halaman depan sebelum login) ===
  getAnnouncements: () => JSON.parse(localStorage.getItem('pengumuman_berjalan') || JSON.stringify([
    { id: 1, teks: "📢 Selamat datang di Portal SDN 134 Kalumpang - Akreditasi B | ", aktif: true },
    { id: 2, teks: "📚 PPDB 2025/2026 Telah Dibuka! | ", aktif: true },
    { id: 3, teks: "🏫 48 Siswa & 9 Guru - Bulukumba | ", aktif: false }
  ])),
  saveAnnouncements: (list) => localStorage.setItem('pengumuman_berjalan', JSON.stringify(list)),
  addAnnouncement: function(teks){ const list=this.getAnnouncements(); list.push({id:Date.now(), teks: teks + " | ", aktif:true}); this.saveAnnouncements(list); return list; },
  deleteAnnouncement: function(id){ let list=this.getAnnouncements().filter(a=>a.id!=id); this.saveAnnouncements(list); return list; },
  toggleAnnouncement: function(id){ let list=this.getAnnouncements(); list=list.map(a=> a.id==id ? {...a, aktif:!a.aktif} : a); this.saveAnnouncements(list); return list; },

  // === USER MANAGEMENT V2 (email sebagai username) ===
  _getUsers: () => {
    const def = [
      { id:1, inisial:'MA', nama:'Muh Arfah Wahlil P.', email:'muharfah@sdn134.sch.id', nip:'198012012010011001', role:'super_admin', jabatan:'Super Admin • Operator', status:'online', permissions:['dashboard','e_dokumen','admin_guru','data_statistik','e_portal','master_data','pengaturan'] },
      { id:2, inisial:'SA', nama:'Satia, S.Pd', email:'kepsek@sdn134.sch.id', nip:'197505102005011002', role:'kepsek', jabatan:'Kepsek', status:'Hadir', permissions:['dashboard','admin_guru','e_dokumen','pengaturan'] },
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

  // === MASTER DATA (Sumber data untuk semua sub fitur) - SESUAI Info_awal.docx ===
  getMasterData: () => JSON.parse(localStorage.getItem('master_data') || JSON.stringify({
    peserta_didik: [
      { id:1, nama:'Ahmad Fauzi', nis:'001', kelas:'1', jk:'L' },
      { id:2, nama:'Siti Aminah', nis:'002', kelas:'2', jk:'P' }
    ],
    sarana: [{ id:1, nama:'Laptop', jumlah:10, kondisi:'Baik' }],
    tp: [{ id:1, kode:'TP-1', deskripsi:'Memahami bilangan cacah', mapel:'Matematika', fase:'A' }],
    cp: [{ id:1, kode:'CP-MTK-A', deskripsi:'Capaian Pembelajaran Matematika Fase A', mapel:'Matematika' }],
    atp: [{ id:1, kode:'ATP-1', alur:'Bilangan Cacah 1-10', tp_ids:[1] }],
    mapel: [{ id:1, nama:'Tematik', kode:'TMK' }, { id:2, nama:'Matematika', kode:'MTK' }, { id:3, nama:'TIK', kode:'TIK' }],
    kop: { logo:'SDN 134 KALUMPANG', alamat:'Tritiro, Bontotiro - Bulukumba', npsn:'40312947', akreditasi:'B', email:'sdn134kalumpang@gmail.com', telp:'-', kop_html:'<div style="text-align:center"><b>PEMERINTAH KABUPATEN BULUKUMBA<br>DINAS PENDIDIKAN<br>SDN 134 KALUMPANG</b><br>NPSN 40312947 - Akreditasi B - Alamat: Tritiro, Bontotiro</div>' }
  })),
  saveMasterData: (data) => localStorage.setItem('master_data', JSON.stringify(data)),
  // Load data bebas dari master
  loadFromMaster: function(key){
    const md = this.getMasterData();
    return md[key] || [];
  },

  // === OWNER ONLY FILTER - Hasil kerja hanya bisa dilihat user itu sendiri ===
  filterOwnerOnly: function(list){
    const currentEmail = this.getCurrentUser().email;
    if(this.isAdmin()) return list; // admin bisa lihat semua
    return list.filter(item => !item.owner_email || item.owner_email === currentEmail);
  },
  addOwner: function(obj){
    obj.owner_email = this.getCurrentUser().email;
    obj.owner_nama = this.getCurrentUser().nama;
    obj.created_at = new Date().toISOString();
    return obj;
  },

  // === INFO SEKOLAH ===
  getSchoolInfo: () => JSON.parse(localStorage.getItem('school_info') || JSON.stringify({ npsn:'40312947', nama:'SDN 134 Kalumpang', alamat:'Tritiro, Bontotiro - Bulukumba', akreditasi:'B', totalSiswa:48, totalGuru:9, kab:'Kab. Bulukumba, Sulsel 92572', tahunAjaran:'2025/2026' })),
  saveSchoolInfo: (info) => localStorage.setItem('school_info', JSON.stringify(info)),
  logout: () => { localStorage.removeItem('isLoggedIn'); localStorage.removeItem('role'); window.location.href=PATH_CONFIG.pages.login; }
};
window.ServiceMenu=ServiceMenu;
window.PATH_CONFIG=PATH_CONFIG;
window.ALL_FEATURES=ALL_FEATURES;
