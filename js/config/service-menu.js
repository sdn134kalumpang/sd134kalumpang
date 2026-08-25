// js/config/service-menu.js - OTAK SISTEM - UPDATE SESUAI ATURAN DAN POLA
// File ori: V2 User + Hak Akses + Pengumuman Berjalan
// Adopsi: service-menu_1.js (konfigurasiFitur dengan link SPA ?fitur= & multi-page)
// Rujukan: aturan_dan_pola.docx - 5 Fitur + 18 Sub + Auto-fill + Master Data + Owner Only + Kop

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
    laporan: 'modules/laporan/index.html',
    arsip_upload: 'modules/arsip/arsip-upload.html',
    arsip_katalog: 'modules/arsip/arsip-katalog.html',
    simpan_file: 'modules/arsip/simpan-file.html',
    admin_pembelajaran: 'modules/admin-pembelajaran/adm-pembelajaran.html',
    statistik: 'modules/statistik/index.html',
    global_monitoring: 'modules/global-monitoring/global-monitoring.html',
    bantuan_ai: 'modules/bantuan-ai/bantuan-ai.html'
  }
};

const konfigurasiFitur = {
  'layanan-portal': [
    { nama: 'SIAGA Pendis (Login)', icon: 'https://siagapendis.kemenag.go.id/favicon.ico', link: 'modules/siaga-pendis.html', isExternal: true },
    { nama: 'SIMPKB (Portal Guru)', icon: 'https://portal.simpkb.id/favicon.ico', link: 'modules/simpkb.html', isExternal: true },
    { nama: 'Data Perpustakaan', icon: '📚', link: 'https://data.perpusnas.go.id/login', isExternal: true },
    { nama: 'SIMACCA', icon: '💼', link: 'https://script.google.com/macros/s/AKfycbzEGn4yvaS19zKiUaU_ymgPsiXeHkxYr4Rxr5HTyAYdwPIrDYQujrnV0t2sEB-wT_3fcw/exec', isExternal: true },
    { nama: 'SINDARA', icon: '🌐', link: 'modules/sindara.html', isExternal: false }
  ],
  'dokumen-arsip': [
    { nama: 'Arsip', icon: '📁', link: 'modules/arsip/arsip-katalog.html' },
    { nama: 'Upload File', icon: '📤', link: 'modules/arsip/arsip-upload.html' },
    { nama: 'Laporan', icon: '📋', link: 'modules/arsip/laporan.html' },
    { nama: 'DLL', icon: '📦', link: 'modules/arsip/simpan-file.html' },
    { nama: 'Katalog Arsip', icon: '📚', link: 'modules/arsip/arsip-katalog.html' },
    { nama: 'Simpan File', icon: '💾', link: 'modules/arsip/simpan-file.html' }
  ],
  'data-statistik': [
    { nama: 'Statistik GTK', icon: '👩‍🏫', link: 'modules/statistik/index.html?fitur=gtk' },
    { nama: 'Monitoring', icon: '📈', link: 'modules/statistik/index.html?fitur=monitoring' },
    { nama: 'Bantuan AI', icon: '🤖', link: 'modules/bantuan-ai/bantuan-ai.html' },
    { nama: 'Demografi Sekolah', icon: '🏫', link: 'modules/statistik/index.html?fitur=demografi' },
    { nama: 'Statistik Peserta Didik', icon: '🎓', link: 'modules/statistik/index.html?fitur=peserta-didik' },
    { nama: 'Analisis Kehadiran', icon: '📊', link: 'modules/statistik/index.html?fitur=analisis-kehadiran' },
    { nama: 'Prestasi & Akademik', icon: '🏆', link: 'modules/statistik/index.html?fitur=prestasi' },
    { nama: 'Rapor Pendidikan', icon: '📑', link: 'modules/statistik/index.html?fitur=rapor-pendidikan' }
  ],
  'admin-pembelajaran': [
    { nama: 'Kisi-kisi Soal', icon: '📝', link: 'modules/admin-pembelajaran/adm-pembelajaran.html?fitur=kisi-kisi' },
    { nama: 'Pembuat Soal', icon: '🛠️', link: 'modules/admin-pembelajaran/adm-pembelajaran.html?fitur=pembuat-soal' },
    { nama: 'Bank Soal', icon: '🏦', link: 'modules/admin-pembelajaran/adm-pembelajaran.html?fitur=bank-soal' },
    { nama: 'RPM', icon: '📄', link: 'modules/admin-pembelajaran/adm-pembelajaran.html?fitur=rpm-spesifik' },
    { nama: 'Bank RPM', icon: '📚', link: 'modules/admin-pembelajaran/adm-pembelajaran.html?fitur=bank-rpm' },
    { nama: 'LCKH', icon: '📘', link: 'modules/admin-pembelajaran/adm-pembelajaran.html?fitur=lckh' },
    { nama: 'LKPD', icon: '📗', link: 'modules/admin-pembelajaran/adm-pembelajaran.html?fitur=lkpd' },
    { nama: 'Analisis KKTP', icon: '📊', link: 'modules/admin-pembelajaran/adm-pembelajaran.html?fitur=kktp' },
    { nama: 'Refleksi', icon: '🪞', link: 'modules/admin-pembelajaran/adm-pembelajaran.html?fitur=refleksi' },
    { nama: 'Jurnal', icon: '📓', link: 'modules/admin-pembelajaran/adm-pembelajaran.html?fitur=jurnal' },
    { nama: 'Penilaian', icon: '⭐', link: 'modules/admin-pembelajaran/adm-pembelajaran.html?fitur=penilaian' },
    { nama: 'Absensi', icon: '🕒', link: 'modules/admin-pembelajaran/adm-pembelajaran.html?fitur=presensi' },
    { nama: 'Generate CP-TP-ATP', icon: '⚙️', link: 'modules/admin-pembelajaran/adm-pembelajaran.html?fitur=cp-tp-atp' },
    { nama: 'Prosem', icon: '🗓️', link: 'modules/admin-pembelajaran/adm-pembelajaran.html?fitur=promes' },
    { nama: 'Prota', icon: '📅', link: 'modules/admin-pembelajaran/adm-pembelajaran.html?fitur=prota' },
    { nama: 'Rumus 8-3-3-4', icon: '🧮', link: 'modules/admin-pembelajaran/adm-pembelajaran.html?fitur=rumus-8-3-3-4' },
    { nama: 'Kalender Pendidikan', icon: '📆', link: 'modules/admin-pembelajaran/adm-pembelajaran.html?fitur=kalender' },
    { nama: 'Jadwal Pembelajaran', icon: '⏰', link: 'modules/admin-pembelajaran/adm-pembelajaran.html?fitur=jadwal' },
    { nama: 'CP, TP, & ATP', icon: '🎯', link: 'modules/admin-pembelajaran/adm-pembelajaran.html?fitur=cp-tp-atp' }
  ],
  'global-monitoring': [
    { nama: 'Data Peserta Didik', icon: '🎓', link: 'modules/global-monitoring/global-monitoring.html?fitur=data-peserta-didik' },
    { nama: 'Sarana', icon: '🏫', link: 'modules/global-monitoring/global-monitoring.html?fitur=aset-sarana' },
    { nama: 'Data TP', icon: '🎯', link: 'modules/global-monitoring/global-monitoring.html?fitur=data-tp' },
    { nama: 'Data CP', icon: '📘', link: 'modules/global-monitoring/global-monitoring.html?fitur=data-cp' },
    { nama: 'Data ATP', icon: '📗', link: 'modules/global-monitoring/global-monitoring.html?fitur=data-atp' },
    { nama: 'Data Mapel', icon: '📚', link: 'modules/global-monitoring/global-monitoring.html?fitur=data-mapel' },
    { nama: 'Kop Administrasi', icon: '📄', link: 'modules/global-monitoring/global-monitoring.html?fitur=kop' },
    { nama: 'Supervisi Akademik', icon: '👁️', link: 'modules/global-monitoring/global-monitoring.html?fitur=supervisi-akademik' },
    { nama: 'Aset Sarana', icon: '🏫', link: 'modules/global-monitoring/global-monitoring.html?fitur=aset-sarana' },
    { nama: 'Coming Soon', icon: '🚧', link: '#' }
  ]
};

const controlCenterFitur = {
  'control-center': [
    { nama: 'Manajemen Pengguna', icon: '👥', link: 'modules/control-center/manajemen-pengguna.html' },
    { nama: 'Data & Statistik', icon: '📊', link: 'modules/control-center/data-statistik.html' },
    { nama: 'Keamanan & Log', icon: '🔒', link: 'modules/control-center/keamanan-log.html' },
    { nama: 'Pengaturan Situs', icon: '⚙️', link: 'modules/control-center/pengaturan-situs.html' },
    { nama: 'Monitoring', icon: '📈', link: 'modules/control-center/monitoring.html' }
  ]
};

const ALL_FEATURES = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊', sub: [] },
  { id: 'e_dokumen', label: 'E-Dokumen', icon: '📁', sub: ['Arsip','Upload File','Laporan','DLL'], links: konfigurasiFitur['dokumen-arsip'] },
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
    ],
    links: konfigurasiFitur['admin-pembelajaran']
  },
  { id: 'data_statistik', label: 'Data Statistik', icon: '📈', sub: ['Statistik GTK','Monitoring','Bantuan AI'], links: konfigurasiFitur['data-statistik'] },
  { id: 'e_portal', label: 'E-Portal', icon: '🌐', sub: ['SIMPKB','SINDARA','SIMACCA','Data Perpustakaan'], links: konfigurasiFitur['layanan-portal'] },
  { id: 'master_data', label: 'Master Data', icon: '🗃️', sub: ['Data Peserta Didik','Sarana','Data TP','Data CP','Data ATP','Data Mapel','Kop Administrasi','Coming Soon'], links: konfigurasiFitur['global-monitoring'] },
  { id: 'pengaturan', label: 'Pengaturan', icon: '⚙️', sub: ['Control Center','Akun Saya','Pengumuman Berjalan'], links: controlCenterFitur['control-center'] },
  { id: 'laporan', label: 'Laporan', icon: '📋', sub: ['Laporan Harian','Laporan Bulanan','Export PDF'] }
];

const ServiceMenu = {
  getCurrentUser: () => ({
    nama: localStorage.getItem('nama') || localStorage.getItem('userEmail') || 'Muh Arfah Wahlil P.',
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
  checkAccess: () => {
    if(localStorage.getItem('isLoggedIn') !== 'true'){
      window.location.href = PATH_CONFIG.pages.login;
      return false;
    }
    return true;
  },
  hasAccess: function(featureId){ const perms = this.getCurrentUser().permissions; if(this.isAdmin()) return true; if(perms.length===0) return true; return perms.includes(featureId); },
  getLinkForSub: function(featureId, subNama){
    const feat = ALL_FEATURES.find(f=>f.id===featureId);
    if(!feat || !feat.links) return PATH_CONFIG.pages[featureId] || '#';
    const key = subNama.toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
    const found = feat.links.find(l=> l.nama.toLowerCase().includes(key) || key.includes(l.nama.toLowerCase().split(' ')[0]) );
    if(found) return found.link;
    const slug = subNama.toLowerCase().replace(/[^a-z0-9]+/g,'-');
    return (PATH_CONFIG.pages[featureId] || '#') + '?sub=' + slug;
  },
  renderSidebar: function(containerId='dynamicSidebar'){
    const container = document.getElementById(containerId);
    if(!container) return;
    container.innerHTML = '';
    let html = `<a class="nav-link active" data-page="dashboard" href="dashboard.html"><span class="nav-icon">📊</span><span class="nav-label">Dashboard</span></a>`;
    const iconMap = {
      'Kisi-kisi Soal':'📝','Pembuat Soal':'🛠️','Bank Soal':'🏦','RPM':'📄','Bank RPM':'🏦','LCKH':'📘','LKPD':'📗','Analisis KKTP':'📊','Refleksi':'🪞','Jurnal':'📓','Penilaian':'⭐','Absensi':'🕒','Generate CP-TP-ATP':'⚙️','Prosem':'🗓️','Prota':'📅','Rumus 8-3-3-4':'🧮','Kalender Pendidikan':'📆','Jadwal Pembelajaran':'🕘','Arsip':'📁','Upload File':'📤','Laporan':'📋','DLL':'📦'
    };
    ALL_FEATURES.filter(f=> f.id!=='dashboard' && f.id!=='pengaturan' && f.id!=='laporan').forEach(feat=>{
      if(!this.hasAccess(feat.id)) return;
      if(feat.sub && feat.sub.length){
        const isLong = feat.sub.length > 6;
        const subHtml = `<div class="sub-menu ${isLong?'sub-menu-long':''}" style="display:none;${isLong?'max-height:260px;overflow-y:auto;':''}">${feat.sub.map(s=>{
          const link = this.getLinkForSub(feat.id, s);
          const ic = iconMap[s] || '📄';
          const slug = s.toLowerCase().replace(/[^a-z0-9]+/g,'_');
          return `<a data-sub="${slug}" href="${link}"><span>${ic}</span> ${s}</a>`;
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
        const subHtml = `<div class="sub-menu" style="display:none;">${feat.sub.map(s=>{
          const link = this.getLinkForSub(feat.id, s);
          return `<a href="${link}">📄 ${s}</a>`;
        }).join('')}</div>`;
        html += `<div class="nav-group" data-feature="${feat.id}"><button class="nav-link has-sub"><span class="nav-icon">${feat.icon}</span><span class="nav-label">${feat.label}</span><span class="nav-count">${feat.sub.length}</span><span class="nav-arrow">›</span></button>${subHtml}</div>`;
      } else {
        html += `<a class="nav-link" href="${PATH_CONFIG.pages[feat.id] || feat.id+'.html'}" data-feature="${feat.id}"><span class="nav-icon">${feat.icon}</span><span class="nav-label">${feat.label}</span></a>`;
      }
    });
    html += `<a class="nav-link logout" id="logoutBtn"><span class="nav-icon">🚪</span><span class="nav-label">Keluar</span></a>`;
    container.innerHTML = html;
  },
  getAnnouncements: () => JSON.parse(localStorage.getItem('pengumuman_berjalan') || JSON.stringify([
    { id: 1, teks: "📢 Selamat datang di Portal SDN 134 Kalumpang - Akreditasi B | ", aktif: true },
    { id: 2, teks: "📚 PPDB Tahun Ajaran 2025/2026 Telah Dibuka! Daftar segera | ", aktif: true },
    { id: 3, teks: "🏫 48 Siswa Aktif & 9 Guru - Kab. Bulukumba, Sulsel | ", aktif: false }
  ])),
  saveAnnouncements: (list) => localStorage.setItem('pengumuman_berjalan', JSON.stringify(list)),
  addAnnouncement: function(teks){ const list=this.getAnnouncements(); list.push({id:Date.now(), teks: teks + " | ", aktif:true}); this.saveAnnouncements(list); return list; },
  deleteAnnouncement: function(id){ let list=this.getAnnouncements().filter(a=>a.id!=id); this.saveAnnouncements(list); return list; },
  toggleAnnouncement: function(id){ let list=this.getAnnouncements(); list=list.map(a=> a.id==id ? {...a, aktif:!a.aktif} : a); this.saveAnnouncements(list); return list; },
  _getUsers: () => {
    const def = [
      { id:1, inisial:'MA', nama:'Muh Arfah Wahlil P.', email:'muharfah@sdn134.sch.id', nip:'198012012010011001', role:'super_admin', jabatan:'Super Admin • Operator', status:'online', permissions:['dashboard','e_dokumen','admin_guru','data_statistik','e_portal','master_data','pengaturan','laporan'] },
      { id:2, inisial:'SA', nama:'Satia, S.Pd', email:'kepsek@sdn134.sch.id', nip:'197505102005011002', role:'kepsek', jabatan:'Kepsek', mapel:'Tematik', status:'Hadir', permissions:['dashboard','e_dokumen','admin_guru','pengaturan'] },
      { id:3, inisial:'AR', nama:'Muh Arfah', email:'operator@sdn134.sch.id', nip:'198012012010011002', role:'guru', jabatan:'Operator', mapel:'TIK', status:'Hadir', permissions:['dashboard','e_dokumen'] },
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
  getMasterData: () => JSON.parse(localStorage.getItem('master_data') || JSON.stringify({ peserta_didik: [{ id:1, nama:'Ahmad Fauzi', nis:'001', kelas:'1', jk:'L' }], sarana: [], tp: [], cp: [], atp: [], mapel: [{id:1,nama:'Tematik'},{id:2,nama:'Matematika'}], kop: { kop_html:'<div style="text-align:center"><b>SDN 134 KALUMPANG</b><br>NPSN 40312947</div>' } })),
  saveMasterData: (data) => localStorage.setItem('master_data', JSON.stringify(data)),
  loadFromMaster: function(key){ return (this.getMasterData()[key] || []); },
  filterOwnerOnly: function(list){ const currentEmail = this.getCurrentUser().email; if(this.isAdmin()) return list; return list.filter(item => !item.owner_email || item.owner_email === currentEmail); },
  addOwner: function(obj){ obj.owner_email = this.getCurrentUser().email; obj.owner_nama = this.getCurrentUser().nama; obj.created_at = new Date().toISOString(); return obj; },
  getSchoolInfo: () => JSON.parse(localStorage.getItem('school_info') || JSON.stringify({ npsn:'40312947', nama:'SDN 134 Kalumpang', alamat:'Trilino, Bontotiro - Bulukumba', akreditasi:'B', totalSiswa:48, totalGuru:9, kab:'Kab. Bulukumba, Sulsel 92572', tahunAjaran:'2025/2026' })),
  saveSchoolInfo: (info) => localStorage.setItem('school_info', JSON.stringify(info)),
  logout: () => { localStorage.removeItem('isLoggedIn'); localStorage.removeItem('role'); window.location.href=PATH_CONFIG.pages.login; }
};

if (typeof window !== 'undefined') {
  window.ServiceMenu=ServiceMenu;
  window.PATH_CONFIG=PATH_CONFIG;
  window.ALL_FEATURES=ALL_FEATURES;
  window.konfigurasiFitur=konfigurasiFitur;
  window.controlCenterFitur=controlCenterFitur;
}

try {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { konfigurasiFitur, controlCenterFitur, PATH_CONFIG, ALL_FEATURES, ServiceMenu };
  }
} catch(e){}
