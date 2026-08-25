// js/config/service-menu.js - V3.2 FINAL - OTAK SISTEM UTAMA
// Path resmi: js/config/service-menu.js
// Rujukan: Info_awal.docx - 5 Fitur Utama + 18 Sub Fitur Administrasi Guru + Auto Dynamic

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
    master_data: 'modules/master-data/index.html',
    laporan: 'modules/laporan/index.html'
  },
  assets: { css: 'css/', js: 'js/', config: 'js/config/' }
};

// --- BLUEPRINT SESUAI Info_awal.docx - 18 SUB FITUR ADMINISTRASI GURU ---
const ALL_FEATURES = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊', sub: [] },
  { id: 'e_dokumen', label: 'E-Dokumen', icon: '📁', sub: ['Arsip','Upload File','E-Sign','DLL'] },
  { 
    id: 'admin_guru', 
    label: 'Administrasi Guru', 
    icon: '👩‍🏫', 
    sub: [
      'Kisi-kisi Soal',
      'Pembuat Soal',
      'Bank Soal',
      'RPM',
      'Bank RPM',
      'LCKH',
      'LKPD',
      'Analisis KKTP',
      'Refleksi',
      'Jurnal',
      'Penilaian',
      'Absensi',
      'Generate CP-TP-ATP',
      'Prosem',
      'Prota',
      'Rumus 8-3-3-4',
      'Kalender Pendidikan',
      'Jadwal Pembelajaran'
    ] 
  },
  { id: 'data_statistik', label: 'Data Statistik', icon: '📈', sub: ['Statistik GTK','Monitoring','Bantuan AI'] },
  { id: 'e_portal', label: 'E-Portal', icon: '🌐', sub: ['SIMPKB','SINDARA','SIMACCA','Data Perpustakaan'] },
  { id: 'master_data', label: 'Master Data', icon: '🗃️', sub: ['Data Peserta Didik','Sarana','Data TP','Data CP','Data ATP','Data Mapel','Kop Administrasi','Coming Soon'] },
  { id: 'pengaturan', label: 'Pengaturan', icon: '⚙️', sub: ['Control Center','Akun Saya','Pengumuman Berjalan'], isBottom: true },
  { id: 'laporan', label: 'Laporan', icon: '📋', sub: ['Laporan Harian','Laporan Bulanan','Export PDF'] },
];

const ServiceMenu = {
  getCurrentUser: () => ({
    nama: localStorage.getItem('nama') || 'Muh Arfah Wahlil P.',
    nip: localStorage.getItem('nip') || '198012012010011001',
    email: localStorage.getItem('userEmail') || 'muharfah@sdn134.sch.id',
    role: localStorage.getItem('role') || 'super_admin',
    jabatan: localStorage.getItem('jabatan') || 'Super Admin • Operator',
    permissions: JSON.parse(localStorage.getItem('userPermissions') || '[]'),
    kepsek_nama: localStorage.getItem('kepsek_nama') || 'Satia, S.Pd',
    kepsek_nip: localStorage.getItem('kepsek_nip') || '197505102005011002'
  }),
  getAutoFillProfile: function(){
    const u = this.getCurrentUser();
    return { nama_guru: u.nama, nip_guru: u.nip, email_guru: u.email, jabatan_guru: u.jabatan, nama_kepsek: u.kepsek_nama, nip_kepsek: u.kepsek_nip, nama_sekolah: this.getSchoolInfo().nama, npsn: this.getSchoolInfo().npsn, alamat_sekolah: this.getSchoolInfo().alamat };
  },
  isAdmin: () => ['super_admin','admin'].includes(localStorage.getItem('role') || 'super_admin'),
  checkAccess: () => { if(localStorage.getItem('isLoggedIn') !== 'true'){ window.location.href = PATH_CONFIG.pages.login; return false; } return true; },
  hasAccess: function(featureId){ const perms = this.getCurrentUser().permissions; if(this.isAdmin()) return true; if(perms.length===0) return true; return perms.includes(featureId); },

  // === RENDER SIDEBAR OTOMATIS - V3.2 FIX 18 FITUR DENGAN SCROLL ===
  renderSidebar: function(containerId='dynamicSidebar'){
    const container = document.getElementById(containerId);
    if(!container) return;
    container.innerHTML = '';
    let html = `<a class="nav-link active" data-page="dashboard" href="dashboard.html"><span class="nav-icon">📊</span><span class="nav-label">Dashboard</span></a>`;
    
    const iconMap = {
      'Kisi-kisi Soal':'📝','Pembuat Soal':'🛠️','Bank Soal':'🏦','RPM':'📄','Bank RPM':'🏦','LCKH':'📘','LKPD':'📗','Analisis KKTP':'📊','Refleksi':'🪞','Jurnal':'📓','Penilaian':'⭐','Absensi':'🕒','Generate CP-TP-ATP':'⚙️','Prosem':'🗓️','Prota':'📅','Rumus 8-3-3-4':'🧮','Kalender Pendidikan':'📆','Jadwal Pembelajaran':'🕘'
    };

    ALL_FEATURES.filter(f=> f.id!=='dashboard' && f.id!=='pengaturan' && f.id!=='laporan').forEach(feat=>{
      if(!this.hasAccess(feat.id)) return;
      if(feat.sub && feat.sub.length){
        const isLong = feat.sub.length > 6;
        const subHtml = `<div class="sub-menu ${isLong?'sub-menu-long':''}" style="display:none;${isLong?'max-height:260px;overflow-y:auto;':''}">${feat.sub.map(s=>{
          const slug = s.toLowerCase().replace(/[^a-z0-9]+/g,'_');
          const ic = iconMap[s] || '📄';
          return `<a data-sub="${slug}" href="${PATH_CONFIG.pages[feat.id]}?sub=${slug}"><span>${ic}</span> ${s}</a>`;
        }).join('')}</div>`;
        html += `<div class="nav-group" data-feature="${feat.id}"><button class="nav-link has-sub"><span class="nav-icon">${feat.icon}</span><span class="nav-label">${feat.label}</span><span class="nav-count">${feat.sub.length}</span><span class="nav-arrow">›</span></button>${subHtml}</div>`;
      } else {
        html += `<a class="nav-link" href="${PATH_CONFIG.pages[feat.id] || feat.id+'.html'}" data-feature="${feat.id}"><span class="nav-icon">${feat.icon}</span><span class="nav-label">${feat.label}</span></a>`;
      }
    });

    html += `<div class="nav-divider"></div>`;

    ALL_FEATURES.filter(f=> f.id==='pengaturan' || f.id==='laporan').forEach(feat=>{
      if(!this.hasAccess(feat.id)) return;
      if(feat.sub && feat.sub.length){
        const subHtml = `<div class="sub-menu" style="display:none;">${feat.sub.map(s=>`<a>📄 ${s}</a>`).join('')}</div>`;
        html += `<div class="nav-group" data-feature="${feat.id}"><button class="nav-link has-sub"><span class="nav-icon">${feat.icon}</span><span class="nav-label">${feat.label}</span><span class="nav-count">${feat.sub.length}</span><span class="nav-arrow">›</span></button>${subHtml}</div>`;
      } else {
        html += `<a class="nav-link" href="${PATH_CONFIG.pages[feat.id] || feat.id+'.html'}" data-feature="${feat.id}"><span class="nav-icon">${feat.icon}</span><span class="nav-label">${feat.label}</span></a>`;
      }
    });

    html += `<a class="nav-link logout" id="logoutBtn"><span class="nav-icon">🚪</span><span class="nav-label">Keluar</span></a>`;
    container.innerHTML = html;
  },

  getAnnouncements: () => JSON.parse(localStorage.getItem('pengumuman_berjalan') || JSON.stringify([{ id: 1, teks: "📢 Selamat datang di Portal SDN 134 Kalumpang - Akreditasi B | ", aktif: true }, { id: 2, teks: "📚 PPDB 2025/2026 Dibuka! | ", aktif: true }])) ,
  saveAnnouncements: (list) => localStorage.setItem('pengumuman_berjalan', JSON.stringify(list)),
  addAnnouncement: function(teks){ const list=this.getAnnouncements(); list.push({id:Date.now(), teks: teks + " | ", aktif:true}); this.saveAnnouncements(list); return list; },
  deleteAnnouncement: function(id){ let list=this.getAnnouncements().filter(a=>a.id!=id); this.saveAnnouncements(list); return list; },
  toggleAnnouncement: function(id){ let list=this.getAnnouncements(); list=list.map(a=> a.id==id ? {...a, aktif:!a.aktif} : a); this.saveAnnouncements(list); return list; },

  _getUsers: () => {
    const def = [
      { id:1, inisial:'MA', nama:'Muh Arfah Wahlil P.', email:'muharfah@sdn134.sch.id', nip:'198012012010011001', role:'super_admin', jabatan:'Super Admin • Operator', status:'online', permissions:['dashboard','e_dokumen','admin_guru','data_statistik','e_portal','master_data','pengaturan','laporan'] },
      { id:2, inisial:'SA', nama:'Satia, S.Pd', email:'kepsek@sdn134.sch.id', nip:'197505102005011002', role:'kepsek', jabatan:'Kepsek', status:'Hadir', permissions:['dashboard','admin_guru','e_dokumen','pengaturan','laporan'] },
    ];
    return JSON.parse(localStorage.getItem('users_db_v2') || JSON.stringify(def));
  },
  _saveUsers: (u) => localStorage.setItem('users_db_v2', JSON.stringify(u)),
  getUsers: function(){ return this._getUsers(); },
  getFeatures: () => ALL_FEATURES,
  addUser: function(user){ const users=this._getUsers(); user.id=Date.now(); user.inisial=user.nama.substring(0,2).toUpperCase(); user.status='Hadir'; if(!user.permissions) user.permissions=['dashboard']; users.push(user); this._saveUsers(users); return users; },
  deleteUser: function(id){ let u=this._getUsers().filter(x=>x.id!=id); this._saveUsers(u); return u; },

  getMasterData: () => JSON.parse(localStorage.getItem('master_data') || JSON.stringify({ peserta_didik: [{ id:1, nama:'Ahmad Fauzi', nis:'001', kelas:'1', jk:'L' }], sarana: [], tp: [], cp: [], atp: [], mapel: [{id:1,nama:'Tematik'},{id:2,nama:'Matematika'}], kop: { kop_html:'<div style="text-align:center"><b>SDN 134 KALUMPANG</b><br>NPSN 40312947</div>' } })),
  saveMasterData: (data) => localStorage.setItem('master_data', JSON.stringify(data)),
  loadFromMaster: function(key){ return (this.getMasterData()[key] || []); },
  filterOwnerOnly: function(list){ const currentEmail = this.getCurrentUser().email; if(this.isAdmin()) return list; return list.filter(item => !item.owner_email || item.owner_email === currentEmail); },
  addOwner: function(obj){ obj.owner_email = this.getCurrentUser().email; obj.owner_nama = this.getCurrentUser().nama; obj.created_at = new Date().toISOString(); return obj; },
  getSchoolInfo: () => JSON.parse(localStorage.getItem('school_info') || JSON.stringify({ npsn:'40312947', nama:'SDN 134 Kalumpang', alamat:'Tritiro, Bontotiro - Bulukumba', akreditasi:'B', totalSiswa:48, totalGuru:9, kab:'Kab. Bulukumba, Sulsel 92572', tahunAjaran:'2025/2026' })),
  saveSchoolInfo: (info) => localStorage.setItem('school_info', JSON.stringify(info)),
  logout: () => { localStorage.removeItem('isLoggedIn'); localStorage.removeItem('role'); window.location.href=PATH_CONFIG.pages.login; }
};
window.ServiceMenu=ServiceMenu;
window.PATH_CONFIG=PATH_CONFIG;
window.ALL_FEATURES=ALL_FEATURES;
