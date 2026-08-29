// modules/e-portal/e-portal.js - E-Portal Link Wrapper - Taat v3

window.EPortalModule = {
  links: [
    { id: 'simpkb', name: 'SIMPKB', url: 'https://portal.simpkb.id', icon: '🆔' },
    { id: 'sindara', name: 'SINDARA', url: 'https://sindara.gurudikdas.kemendikdasmen.go.id/pendaftaran/komunitas/login', icon: '📊' },
    { id: 'simacca', name: 'SIMACCA', url: '#', icon: '🏫', status: 'soon' },
    { id: 'perpus', name: 'Data Perpustakaan', url: 'https://data.perpusnas.go.id/login', icon: '📚' },
    { id: 'siaga', name: 'Siaga', url: 'https://siagapendis.kemenag.go.id/login', icon: '🕌' },
    { id: 'infogtk', name: 'Info GTK', url: 'https://info.gtk.kemendikdasmen.go.id/', icon: '👨🏫' },
    { id: 'ekinerja', name: 'E-Kinerja', url: '#', icon: '💼', status: 'soon' },
    { id: 'myasn', name: 'myASN', url: 'https://myasn.bkn.go.id/', icon: '👤' }
  ],

  open(id) {
    // Cek akses (Hanya Guru, Kepsek, Operator, Admin) - Aturan No. 9 (Sinkron ServiceMenu)
    if (typeof ServiceMenu !== 'undefined') {
      const user = ServiceMenu.getCurrentUser();
      const allowed = ['guru', 'kepsek', 'operator', 'admin'];
      if (user && !allowed.includes(user.role?.toLowerCase())) {
        return alert('Akses E-Portal ditolak untuk role: ' + user.role);
      }
    }

    const link = this.links.find(l => l.id === id);
    if (!link) return;
    
    if (link.status === 'soon') {
      alert('Fitur ' + link.name + ' sedang dalam pengembangan (Coming Soon).');
      return;
    }
    
    // Buka di tab baru - Aturan No. 12 (Tepat sasaran sesuai permintaan)
    window.open(link.url, '_blank', 'noopener,noreferrer');
  }
};
