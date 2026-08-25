// js/config/service-menu.js - OTAK SISTEM - UPDATE SESUAI REPO ASLI
// Path disesuaikan dengan repo: css/, js/, modules/{adm-pembelajaran, data-statistik, e-dokumen, master-data}
// Rujukan: aturan_dan_pola.docx + service-menu_1.js adopsi + Screenshot repo

const PATH_CONFIG = {
  base: '/sd134kalumpang/',
  pages: {
    dashboard: '/sd134kalumpang/dashboard.html',
    pengaturan: '/sd134kalumpang/pengaturan.html',
    login: '/sd134kalumpang/index.html',
    e_dokumen: '/sd134kalumpang/modules/e-dokumen/index.html',
    admin_guru: '/sd134kalumpang/modules/adm-pembelajaran/adm-pembelajaran.html',
    data_statistik: '/sd134kalumpang/modules/data-statistik/index.html',
    e_portal: '/sd134kalumpang/modules/e-portal/index.html',
    master_data: '/sd134kalumpang/modules/master-data/index.html',
    laporan: '/sd134kalumpang/modules/laporan/index.html',
    arsip_upload: '/sd134kalumpang/modules/e-dokumen/arsip-upload.html',
    arsip_katalog: '/sd134kalumpang/modules/e-dokumen/arsip-katalog.html',
    adm_pembelajaran_main: '/sd134kalumpang/modules/adm-pembelajaran/adm-pembelajaran.html',
    master_data_main: '/sd134kalumpang/modules/master-data/index.html',
    kop_administrasi: '/sd134kalumpang//sd134kalumpang/modules/master-data/index.html?fitur=kop'
  }
};

const konfigurasiFitur = {
  'layanan-portal': [
    { nama: 'SIAGA Pendis', icon: '🕌', link: '/sd134kalumpang/modules/siaga-pendis.html', isExternal: true },
    { nama: 'SIMPKB', icon: '👩‍🏫', link: '/sd134kalumpang/modules/simpkb.html', isExternal: true },
    { nama: 'Data Perpustakaan', icon: '📚', link: 'https://data.perpusnas.go.id/login', isExternal: true },
    { nama: 'SIMACCA', icon: '💼', link: 'https://script.google.com/macros/s/AKfycbzEGn4yvaS19zKiUaU_ymgPsiXeHkxYr4Rxr5HTyAYdwPIrDYQujrnV0t2sEB-wT_3fcw/exec', isExternal: true }
  ],
  'dokumen-arsip': [
    { nama: 'Arsip', icon: '📁', link: '/sd134kalumpang/modules/e-dokumen/index.html?fitur=arsip' },
    { nama: 'Upload File', icon: '📤', link: '/sd134kalumpang/modules/e-dokumen/index.html?fitur=upload' },
    { nama: 'Laporan', icon: '📋', link: '/sd134kalumpang/modules/e-dokumen/index.html?fitur=laporan' },
    { nama: 'DLL', icon: '📦', link: '/sd134kalumpang/modules/e-dokumen/index.html?fitur=dll' }
  ],
  'data-statistik': [
    { nama: 'Statistik GTK', icon: '👩‍🏫', link: '/sd134kalumpang/modules/data-statistik/index.html?fitur=gtk' },
    { nama: 'Monitoring', icon: '📈', link: '/sd134kalumpang/modules/data-statistik/index.html?fitur=monitoring' },
    { nama: 'Bantuan AI', icon: '🤖', link: '/sd134kalumpang/modules/data-statistik/index.html?fitur=bantuan-ai' },
    { nama: 'Demografi Sekolah', icon: '🏫', link: '/sd134kalumpang/modules/data-statistik/index.html?fitur=demografi' },
    { nama: 'Statistik Peserta Didik', icon: '🎓', link: '/sd134kalumpang/modules/data-statistik/index.html?fitur=peserta-didik' }
  ],
  'admin-pembelajaran': [
    { nama: 'Kisi-kisi Soal', icon: '📝', link: '/sd134kalumpang/modules/adm-pembelajaran/adm-pembelajaran.html?fitur=kisi-kisi' },
    { nama: 'Pembuat Soal', icon: '🛠️', link: '/sd134kalumpang/modules/adm-pembelajaran/adm-pembelajaran.html?fitur=pembuat-soal' },
    { nama: 'Bank Soal', icon: '🏦', link: '/sd134kalumpang/modules/adm-pembelajaran/adm-pembelajaran.html?fitur=bank-soal' },
    { nama: 'RPM', icon: '📄', link: '/sd134kalumpang/modules/adm-pembelajaran/adm-pembelajaran.html?fitur=rpm-spesifik' },
    { nama: 'Bank RPM', icon: '📚', link: '/sd134kalumpang/modules/adm-pembelajaran/adm-pembelajaran.html?fitur=bank-rpm' },
    { nama: 'LCKH', icon: '📘', link: '/sd134kalumpang/modules/adm-pembelajaran/adm-pembelajaran.html?fitur=lckh' },
    { nama: 'LKPD', icon: '📗', link: '/sd134kalumpang/modules/adm-pembelajaran/adm-pembelajaran.html?fitur=lkpd' },
    { nama: 'Analisis KKTP', icon: '📊', link: '/sd134kalumpang/modules/adm-pembelajaran/adm-pembelajaran.html?fitur=kktp' },
    { nama: 'Refleksi', icon: '🪞', link: '/sd134kalumpang/modules/adm-pembelajaran/adm-pembelajaran.html?fitur=refleksi' },
    { nama: 'Jurnal', icon: '📓', link: '/sd134kalumpang/modules/adm-pembelajaran/adm-pembelajaran.html?fitur=jurnal' },
    { nama: 'Penilaian', icon: '⭐', link: '/sd134kalumpang/modules/adm-pembelajaran/adm-pembelajaran.html?fitur=penilaian' },
    { nama: 'Absensi', icon: '🕒', link: '/sd134kalumpang/modules/adm-pembelajaran/adm-pembelajaran.html?fitur=presensi' },
    { nama: 'Generate CP-TP-ATP', icon: '⚙️', link: '/sd134kalumpang/modules/adm-pembelajaran/adm-pembelajaran.html?fitur=cp-tp-atp' },
    { nama: 'Prosem', icon: '🗓️', link: '/sd134kalumpang/modules/adm-pembelajaran/adm-pembelajaran.html?fitur=promes' },
    { nama: 'Prota', icon: '📅', link: '/sd134kalumpang/modules/adm-pembelajaran/adm-pembelajaran.html?fitur=prota' },
    { nama: 'Rumus 8-3-3-4', icon: '🧮', link: '/sd134kalumpang/modules/adm-pembelajaran/adm-pembelajaran.html?fitur=rumus-8-3-3-4' },
    { nama: 'Kalender Pendidikan', icon: '📆', link: '/sd134kalumpang/modules/adm-pembelajaran/adm-pembelajaran.html?fitur=kalender' },
    { nama: 'Jadwal Pembelajaran', icon: '⏰', link: '/sd134kalumpang/modules/adm-pembelajaran/adm-pembelajaran.html?fitur=jadwal' }
  ],
  'master-data': [
    { nama: 'Kop Administrasi', icon: '📄', link: '/sd134kalumpang/modules/master-data/index.html?fitur=kop' },
    { nama: 'Data Peserta Didik', icon: '🎓', link: '/sd134kalumpang/modules/master-data/index.html?fitur=data-peserta-didik' },
    { nama: 'Sarana', icon: '🏫', link: '/sd134kalumpang/modules/master-data/index.html?fitur=sarana' },
    { nama: 'Data TP', icon: '🎯', link: '/sd134kalumpang/modules/master-data/index.html?fitur=data-tp' },
    { nama: 'Data CP', icon: '📘', link: '/sd134kalumpang/modules/master-data/index.html?fitur=data-cp' },
    { nama: 'Data ATP', icon: '📗', link: '/sd134kalumpang/modules/master-data/index.html?fitur=data-atp' },
    { nama: 'Data Mapel', icon: '📚', link: '/sd134kalumpang/modules/master-data/index.html?fitur=data-mapel' },
    { nama: 'Coming Soon', icon: '🚧', link: '/sd134kalumpang/modules/master-data/index.html?fitur=coming-soon' }
  ]
};

const controlCenterFitur = {
  'control-center': [
    { nama: 'Manajemen Pengguna', icon: '👥', link: '/sd134kalumpang/modules/control-center/manajemen-pengguna.html' },
    { nama: 'Pengumuman Berjalan', icon: '📢', link: '/sd134kalumpang/pengaturan.html' },
    { nama: 'Info Sekolah', icon: '🏫', link: '/sd134kalumpang/pengaturan.html' }
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
      'Kisi-kisi Soal','Pembuat Soal','Bank Soal','RPM','Bank RPM','LCKH','LKPD','Analisis KKTP','Refleksi','Jurnal','Penilaian','Absensi','Generate CP-TP-ATP','Prosem','Prota','Rumus 8-3-3-4','Kalender Pendidikan','Jadwal Pembelajaran'
    ],
    links: konfigurasiFitur['admin-pembelajaran']
  },
  { id: 'data_statistik', label: 'Data Statistik', icon: '📈', sub: ['Statistik GTK','Monitoring','Bantuan AI'], links: konfigurasiFitur['data-statistik'] },
  { id: 'e_portal', label: 'E-Portal', icon: '🌐', sub: ['SIMPKB','SINDARA','SIMACCA','Data Perpustakaan'], links: konfigurasiFitur['layanan-portal'] },
  { id: 'master_data', label: 'Master Data', icon: '🗃️', sub: ['Kop Administrasi','Data Peserta Didik','Sarana','Data TP','Data CP','Data ATP','Data Mapel','Coming Soon'], links: konfigurasiFitur['master-data'] },
  { id: 'pengaturan', label: 'Pengaturan', icon: '⚙️', sub: ['Control Center','Akun Saya','Pengumuman Berjalan'], links: controlCenterFitur['control-center'] },
  { id: 'laporan', label: 'Laporan', icon: '📋', sub: ['Laporan Harian','Laporan Bulanan','Export PDF'] }
];

const ServiceMenu = {
  getCurrentUser: () => ({
    nama: localStorage.getItem('nama') || localStorage.getItem('userEmail') || 'Muh Arfah Wahlii P.',
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
  checkAccess: () => { if(localStorage.getItem('isLoggedIn') !== 'true'){ window.location.href = '/sd134kalumpang/index.html'; return false; } return true; },
  hasAccess: function(featureId){ const perms = this.getCurrentUser().permissions; if(this.isAdmin()) return true; if(perms.length===0) return true; return perms.includes(featureId); },
  getLinkForSub: function(featureId, subNama){
    const feat = ALL_FEATURES.find(f=>f.id===featureId);
    if(!feat || !feat.links) return PATH_CONFIG.pages[featureId] || '/sd134kalumpang/dashboard.html';
    const key = subNama.toLowerCase();
    const found = feat.links.find(l=> l.nama.toLowerCase().includes(key) || key.includes(l.nama.toLowerCase()) );
    if(found) return found.link;
    const slug = subNama.toLowerCase().replace(/[^a-z0-9]+/g,'-');
    return (PATH_CONFIG.pages[featureId] || '#') + '?sub=' + slug;
  },
  renderSidebar: function(containerId='dynamicSidebar'){
    const container = document.getElementById(containerId);
    if(!container) return;
    container.innerHTML = '';
    let html = `<a class="nav-link active" data-page="dashboard" href="${PATH_CONFIG.pages.dashboard}"><span class="nav-icon">📊</span><span class="nav-label">Dashboard</span></a>`;
    const iconMap = {
      'Kisi-kisi Soal':'📝','Pembuat Soal':'🛠️','Bank Soal':'🏦','RPM':'📄','Bank RPM':'🏦','LCKH':'📘','LKPD':'📗','Analisis KKTP':'📊','Refleksi':'🪞','Jurnal':'📓','Penilaian':'⭐','Absensi':'🕒','Generate CP-TP-ATP':'⚙️','Prosem':'🗓️','Prota':'📅','Rumus 8-3-3-4':'🧮','Kalender Pendidikan':'📆','Jadwal Pembelajaran':'🕘','Arsip':'📁','Upload File':'📤','Laporan':'📋','DLL':'📦','Kop Administrasi':'📄','Data Peserta Didik':'🎓','Sarana':'🏫'
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
  getAnnouncements: () => JSON.parse(localStorage.getItem('pengumuman_berjalan') || JSON.stringify([{ id: 1, teks: "📢 Selamat datang di Portal SDN 134 Kalumpang - Akreditasi B | ", aktif: true }])),
  saveAnnouncements: (list) => localStorage.setItem('pengumuman_berjalan', JSON.stringify(list)),
  addAnnouncement: function(teks){ const list=this.getAnnouncements(); list.push({id:Date.now(), teks: teks + " | ", aktif:true}); this.saveAnnouncements(list); return list; },
  deleteAnnouncement: function(id){ let list=this.getAnnouncements().filter(a=>a.id!=id); this.saveAnnouncements(list); return list; },
  toggleAnnouncement: function(id){ let list=this.getAnnouncements(); list=list.map(a=> a.id==id ? {...a, aktif:!a.aktif} : a); this.saveAnnouncements(list); return list; },
  _getUsers: () => {
    const def = [
      { id:1, inisial:'MA', nama:'Muh Arfah Wahlii P.', email:'muharfah@sdn134.sch.id', nip:'198012012010011001', role:'super_admin', jabatan:'Super Admin • Operator', status:'online', permissions:['dashboard','e_dokumen','admin_guru','data_statistik','e_portal','master_data','pengaturan','laporan'] },
      { id:2, inisial:'SA', nama:'Satia, S.Pd', email:'kepsek@sdn134.sch.id', nip:'197505102005011002', role:'kepsek', jabatan:'Kepsek', status:'Hadir', permissions:['dashboard','admin_guru','e_dokumen','pengaturan'] },
    ];
    return JSON.parse(localStorage.getItem('users_db_v2') || JSON.stringify(def));
  },
  _saveUsers: (u) => localStorage.setItem('users_db_v2', JSON.stringify(u)),
  getUsers: function(){ return this._getUsers(); },
  getFeatures: () => ALL_FEATURES,
  addUser: function(user){ const users=this._getUsers(); user.id=Date.now(); user.inisial=user.nama.substring(0,2).toUpperCase(); user.status='Hadir'; if(!user.permissions) user.permissions=['dashboard']; users.push(user); this._saveUsers(users); return users; },
  deleteUser: function(id){ let u=this._getUsers().filter(x=>x.id!=id); this._saveUsers(u); return u; },
  getMasterData: () => JSON.parse(localStorage.getItem('master_data') || JSON.stringify({ peserta_didik: [{ id:1, nama:'Ahmad Fauzi', nis:'001', kelas:'1', jk:'L' }], sarana: [], tp: [], cp: [], atp: [], mapel: [{id:1,nama:'Tematik'}], kop: { kop_html:'<div style="text-align:center"><b>SDN 134 KALUMPANG</b><br>NPSN 40312947</div>' } })),
  saveMasterData: (data) => localStorage.setItem('master_data', JSON.stringify(data)),
  loadFromMaster: function(key){ return (this.getMasterData()[key] || []); },
  filterOwnerOnly: function(list){ const currentEmail = this.getCurrentUser().email; if(this.isAdmin()) return list; return list.filter(item => !item.owner_email || item.owner_email === currentEmail); },
  addOwner: function(obj){ obj.owner_email = this.getCurrentUser().email; obj.owner_nama = this.getCurrentUser().nama; obj.created_at = new Date().toISOString(); return obj; },
  getSchoolInfo: () => JSON.parse(localStorage.getItem('school_info') || JSON.stringify({ npsn:'40312947', nama:'SDN 134 Kalumpang', alamat:'Trilino, Bontotiro - Bulukumba', akreditasi:'B', totalSiswa:48, totalGuru:9, kab:'Kab. Bulukumba, Sulsel 92572', tahunAjaran:'2025/2026' })),
  saveSchoolInfo: (info) => localStorage.setItem('school_info', JSON.stringify(info)),
  logout: () => { localStorage.removeItem('isLoggedIn'); localStorage.removeItem('role'); localStorage.removeItem('userEmail'); localStorage.removeItem('nama'); window.location.href=PATH_CONFIG.pages.login; }
};

if (typeof window !== 'undefined') {
  window.ServiceMenu=ServiceMenu;
  window.PATH_CONFIG=PATH_CONFIG;
  window.ALL_FEATURES=ALL_FEATURES;
  window.konfigurasiFitur=konfigurasiFitur;
  window.controlCenterFitur=controlCenterFitur;
}
