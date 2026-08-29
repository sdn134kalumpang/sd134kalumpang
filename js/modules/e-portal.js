// js/modules/e-portal.js - E-Portal Link Wrapper - Taat v3

window.EPortalFeature = {
  
  links: [
    { id: 'simpkb', label: 'SIMPKB', url: 'https://portal.simpkb.id', icon: '', desc: 'Sistem Informasi Manajemen Pendidikan Berbasis Kompetensi' },
    { id: 'sindara', label: 'SINDARA', url: 'https://sindara.gurudikdas.kemendikdasmen.go.id/pendaftaran/komunitas/login', icon: '', desc: 'Sistem Informasi Data dan Pelaporan GTK' },
    { id: 'simacca', label: 'SIMACCA', url: '#', icon: '📚', desc: 'Sistem Informasi Manajemen Aset dan Sarana (Coming Soon)', status: 'soon' },
    { id: 'perpustakaan', label: 'Data Perpustakaan', url: 'https://data.perpusnas.go.id/login', icon: '📖', desc: 'Data Perpustakaan Nasional' },
    { id: 'siaga', label: 'Siaga', url: 'https://siagapendis.kemenag.go.id/login', icon: '🕌', desc: 'Sistem Informasi Agama dan Pendidikan Islam' },
    { id: 'infogtk', label: 'Info GTK', url: 'https://info.gtk.kemendikdasmen.go.id/', icon: '‍🏫', desc: 'Informasi Guru dan Tenaga Kependidikan' },
    { id: 'ekinerja', label: 'E-Kinerja', url: '#', icon: '💼', desc: 'E-Kinerja Guru dan Tenaga Kependidikan (Coming Soon)', status: 'soon' },
    { id: 'myasn', label: 'myASN', url: 'https://myasn.bkn.go.id/', icon: '👤', desc: 'Portal ASN Indonesia' }
  ],

  load(){
    const container = document.getElementById('ePortalContainer');
    if(!container) return;
    
    let html = '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">';
    this.links.forEach(link => {
      const isSoon = link.status === 'soon';
      const onclickAttr = isSoon ? '' : `onclick="EPortalFeature.bukaLink('${link.id}')"`;
      const cursorClass = isSoon ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:shadow-md';
      const badgeSoon = isSoon ? '<span class="text-[9px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">Coming Soon</span>' : '';
      
      html += `
        <div class="bg-white rounded-xl border border-[#e8eef6] p-4 transition ${cursorClass}" ${onclickAttr}>
          <div class="flex items-start gap-3">
            <div class="w-12 h-12 rounded-lg bg-[#f1f5f9] flex items-center justify-center text-2xl shrink-0">${link.icon}</div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <h4 class="font-bold text-[14px] text-[#0d3b66]">${link.label}</h4>
                ${badgeSoon}
              </div>
              <p class="text-[11px] text-black/60 mt-1 truncate">${link.desc}</p>
              ${!isSoon ? `<div class="text-[10px] text-blue-600 mt-2 truncate">${link.url}</div>` : ''}
            </div>
            ${!isSoon ? `<svg class="w-5 h-5 text-[#0d3b66] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>` : ''}
          </div>
        </div>
      `;
    });
    html += '</div>';
    
    container.innerHTML = html;
  },

  bukaLink(id){
    const link = this.links.find(l => l.id === id);
    if(!link || link.status === 'soon') return;
    
    // Cek akses user (hanya Guru, Kepsek, Operator, Admin)
    const user = ServiceMenu.getCurrentUser();
    const allowedRoles = ['guru', 'kepsek', 'operator', 'admin'];
    if(!allowedRoles.includes(user.role?.toLowerCase())){
      return alert('Akses ditolak! Fitur ini hanya untuk Guru, Kepala Sekolah, Operator, dan Admin.');
    }
    
    window.open(link.url, '_blank', 'noopener,noreferrer');
  }
};

if(typeof window !== 'undefined'){
  window.EPortalFeature = window.EPortalFeature;
}
