// js/pengaturan/features/pengumuman.js - MANDIRI - Pengumuman Berjalan - Taat v3
// Tidak kurangi logic dari pengaturan.js 110 baris

window.PengumumanFeature = {
  load(){
    const list = ServiceMenu.getAnnouncements();
    const container = document.getElementById('pengumumanList');
    if(!container) return;
    container.innerHTML='';
    list.forEach(p=>{
      container.innerHTML+=`<div class="flex items-center justify-between p-3 rounded-xl border ${p.aktif?'bg-[#e8f5e9] border-green-200':'bg-[#f7f9fc] border-[#e8eef6]'} mb-2"><div class="flex items-center gap-2"><input type="checkbox" ${p.aktif?'checked':''} onchange="PengumumanFeature.toggle(${p.id})" class="w-4 h-4"><span class="text-[13px]">${p.teks}</span></div><button onclick="PengumumanFeature.hapus(${p.id})" class="text-[11px] text-red-500 font-bold px-2">HAPUS</button></div>`;
    });
    const preview = list.filter(p=>p.aktif).map(p=>p.teks).join(' ');
    const marquee = document.getElementById('previewMarquee');
    if(marquee) marquee.textContent = preview || 'Tidak ada pengumuman aktif';
  },
  hapus(id){
    if(confirm('Hapus pengumuman ini?')){
      ServiceMenu.deleteAnnouncement(id);
      this.load();
      if(window.FirebaseService && FirebaseService.isEnabled()){
        FirebaseService.delete('pengumuman', id, id);
      }
    }
  },
  toggle(id){
    ServiceMenu.toggleAnnouncement(id);
    this.load();
  },
  initForm(){
    const form = document.getElementById('formPengumuman');
    if(!form) return;
    form.onsubmit = (e)=>{
      e.preventDefault();
      const teks = document.getElementById('newPengumuman').value;
      if(!teks) return;
      ServiceMenu.addAnnouncement(teks);
      if(window.FirebaseService && FirebaseService.isEnabled()){
        FirebaseService.add('pengumuman', { teks, aktif:true, created_at:new Date().toISOString() });
      }
      e.target.reset();
      this.load();
    };
  }
};
