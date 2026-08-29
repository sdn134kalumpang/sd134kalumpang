// modules/e-portal/e-portal.js - E-Portal Link Wrapper - Taat v3

window.EPortalModule = {
  links: [
    { id: 'simpkb', name: 'SIMPKB', url: 'https://portal.simpkb.id', icon: '🆔', isExternal: true },
    { id: 'sindara', name: 'SINDARA', url: 'https://sindara.gurudikdas.kemendikdasmen.go.id/pendaftaran/komunitas/login', icon: '📊', isExternal: true },
    { id: 'simacca', name: 'SIMACCA', url: 'https://script.google.com/macros/s/AKfycbzEGn4yvaS19zKiUaU_ymgPsiXeHkxYr4Rxr5HTyAYdwPIrDYQujrnV0t2sEB-wT_3fcw/exec', icon: '🏫', isExternal: true },
    { id: 'perpus', name: 'Data Perpustakaan', url: 'https://data.perpusnas.go.id/login', icon: '📚', isExternal: true },
    { id: 'siaga', name: 'Siaga', url: 'https://siagapendis.kemenag.go.id/login', icon: '🕌', isExternal: true },
    { id: 'infogtk', name: 'Info GTK', url: 'https://info.gtk.kemendikdasmen.go.id/', icon: '👨‍🏫', isExternal: true },
    { id: 'ekinerja', name: 'E-Kinerja', url: '#', icon: '💼', isExternal: true, status: 'soon' },
    { id: 'myasn', name: 'myASN', url: 'https://myasn.bkn.go.id/', icon: '👤', isExternal: true }
  ],

  open(id) {
    // Cek akses (Hanya Guru, Kepsek, Operator, Admin)
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
    
    // Buka di tab baru untuk link eksternal
    if (link.isExternal) {
      window.open(link.url, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = link.url;
    }
  }
};

if (typeof window !== 'undefined') {
  window.EPortalModule = window.EPortalModule;
}
