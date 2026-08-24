
// js/config/service-menu.js - OTAK SISTEM SDN 134 KALUMPANG
// PATH RESMI: js/config/service-menu.js
// Semua modul harus import dari sini agar tidak bentrok

const PATH_CONFIG = {
  base: '/sd134kalumpang/',
  pages: {
    dashboard: 'dashboard.html',
    pengaturan: 'pengaturan.html',
    login: 'index.html'
  },
  assets: {
    css: 'css/',
    js: 'js/',
    config: 'js/config/'
  }
};

const ServiceMenu = {
  // === AUTH & ROLE ===
  getCurrentUser: () => {
    return {
      nama: localStorage.getItem('nama') || localStorage.getItem('userEmail') || 'Muh Arfah Wahlii P.',
      role: localStorage.getItem('role') || 'super_admin',
      email: localStorage.getItem('userEmail') || 'admin@sdn134.sch.id'
    }
  },
  isAdmin: () => {
    const role = localStorage.getItem('role') || 'super_admin';
    return ['super_admin','admin'].includes(role);
  },
  checkAccess: () => {
    if(localStorage.getItem('isLoggedIn') !== 'true'){
      window.location.href = PATH_CONFIG.pages.login;
      return false;
    }
    return true;
  },

  // === USER MANAGEMENT (Control Center - Admin Only) ===
  _getUsers: () => {
    const defaultUsers = [
      { id: 1, inisial: 'MA', nama: 'Muh Arfah Wahlii P.', role: 'super_admin', jabatan: 'Super Admin • Operator', status: 'online' },
      { id: 2, inisial: 'SA', nama: 'Satia, S.Pd', role: 'kepsek', jabatan: 'Kepsek', mapel: 'Tematik', status: 'Hadir' },
      { id: 3, inisial: 'AR', nama: 'Muh Arfah', role: 'guru', jabatan: 'Operator', mapel: 'TIK', status: 'Hadir' },
      { id: 4, inisial: 'G1', nama: 'Siti Aminah', role: 'guru', jabatan: 'Kelas 1', mapel: 'Kelas 1', status: 'Izin' },
    ];
    return JSON.parse(localStorage.getItem('users_db') || JSON.stringify(defaultUsers));
  },
  _saveUsers: (users) => localStorage.setItem('users_db', JSON.stringify(users)),
  getUsers: function(){ return this._getUsers(); },
  addUser: function(user){
    const users = this._getUsers();
    user.id = Date.now();
    users.push(user);
    this._saveUsers(users);
    return users;
  },
  deleteUser: function(id){
    let users = this._getUsers().filter(u => u.id != id);
    this._saveUsers(users);
    return users;
  },

  // === INFO SEKOLAH ===
  getSchoolInfo: () => JSON.parse(localStorage.getItem('school_info') || JSON.stringify({
    npsn: '40312947', nama: 'SDN 134 Kalumpang', alamat: 'Trilino, Bontotiro - Bulukumba',
    akreditasi: 'B', totalSiswa: 48, totalGuru: 9, kab: 'Kab. Bulukumba, Sulsel 92572', tahunAjaran: '2025/2026'
  })),
  saveSchoolInfo: (info) => localStorage.setItem('school_info', JSON.stringify(info)),

  logout: () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('role');
    window.location.href = PATH_CONFIG.pages.login;
  }
};

window.ServiceMenu = ServiceMenu;
window.PATH_CONFIG = PATH_CONFIG;
