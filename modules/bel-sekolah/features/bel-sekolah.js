// js/features/bel-sekolah.js - STANDALONE BEL SEKOLAH OTOMATIS TTS - SDN 134 KALUMPANG
// Diadopsi dari bel_1.html 126 baris - FIX bug parseInt + taat v3 + Firestore ready
// Berdiri mandiri, tidak sentuh service-menu.js / firebase-service.js

const jadwalBelDefault = [
  { waktu: "07:00:00", teks: "Pemberitahuan, jam pelajaran pertama dimulai. Kepada seluruh siswa dimohon masuk ke kelas masing-masing.", label: "Masuk" },
  { waktu: "09:30:00", teks: "Waktunya istirahat pertama. Selamat menikmati istirahat.", label: "Istirahat 1" },
  { waktu: "10:00:00", teks: "Waktu istirahat selesai. Jam pelajaran berikutnya dimulai.", label: "Masuk KBM" },
  { waktu: "12:00:00", teks: "Waktunya istirahat kedua dan sholat dzuhur bagi yang muslim.", label: "Istirahat 2" },
  { waktu: "14:00:00", teks: "Jam pelajaran selesai. Sampai jumpa besok pagi dan hati-hati di jalan.", label: "Pulang" }
];

window.BelSekolah = {
  jadwal: JSON.parse(localStorage.getItem('bel_jadwal') || JSON.stringify(jadwalBelDefault)),
  aktif: false,
  interval: null,

  init(containerId){
    const container = document.getElementById(containerId);
    if(!container) return;
    container.innerHTML = `
      <div class="bg-white rounded-[20px] border border-slate-200 card-shadow p-6 md:p-8 max-w-[560px] mx-auto">
        <div class="flex items-center justify-between">
          <div><div class="font-jakarta font-extrabold text-[18px]">🔔 Bel Sekolah Otomatis</div><div class="text-[11px] text-slate-500 mt-1">TTS Bahasa Indonesia • Firestore ready • Standalone</div></div>
          <div id="belStatusDot" class="w-3 h-3 rounded-full bg-red-400"></div>
        </div>
        <div class="mt-6 text-center">
          <div class="text-[11px] font-bold tracking-widest text-slate-400">WAKTU SISTEM</div>
          <div id="jamBel" class="font-mono font-extrabold text-[42px] tracking-[-0.02em] mt-1">00:00:00</div>
          <div id="infoStatusBel" class="mt-3 text-[11px] px-3 py-2 rounded-full bg-[#fff1f1] text-[#9a1a1a] inline-block">Klik Aktifkan untuk memulai!</div>
        </div>
        <div class="mt-6 flex gap-2">
          <button id="btnAktifkanBel" class="flex-1 h-11 rounded-xl bg-[#0f2f1e] text-white font-bold text-[12px]">🔔 Aktifkan Sistem Bel</button>
          <button id="btnTesBel" class="h-11 px-4 rounded-xl bg-[#ffcc00] text-[#0f2f1e] font-bold text-[12px]">Tes Suara</button>
        </div>
        <div class="mt-6">
          <div class="font-bold text-[12px] mb-2">Jadwal Hari Ini</div>
          <div id="jadwalList" class="space-y-2"></div>
        </div>
        <div class="mt-4 text-[10px] text-slate-400">Path: js/features/bel-sekolah.js • Standalone • Tidak ubah service-menu.js • localStorage bel_jadwal</div>
      </div>
    `;
    this.renderJadwal();
    document.getElementById('btnAktifkanBel')?.addEventListener('click', ()=> this.aktifkan());
    document.getElementById('btnTesBel')?.addEventListener('click', ()=> this.bunyikan("Sistem bel otomatis berhasil diaktifkan."));
    this.start();
  },

  renderJadwal(){
    const el=document.getElementById('jadwalList');
    if(!el) return;
    el.innerHTML=this.jadwal.map(j=>`
      <div class="flex items-center justify-between p-3 rounded-xl bg-[#f8fafc] border border-slate-200">
        <div><div class="font-mono font-bold text-[12px]">${j.waktu}</div><div class="text-[11px] text-slate-500">${j.label}</div></div>
        <div class="text-[10px] text-slate-600 max-w-[200px] truncate">${j.teks}</div>
      </div>
    `).join('');
  },

  start(){
    if(this.interval) clearInterval(this.interval);
    this.interval=setInterval(()=> this.updateWaktu(), 1000);
  },

  updateWaktu(){
    const now=new Date();
    const waktu=`${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
    const jamEl=document.getElementById('jamBel');
    if(jamEl) jamEl.textContent=waktu;
    if(!this.aktif) return;
    this.jadwal.forEach(j=>{
      if(waktu===j.waktu){
        this.bunyikan(j.teks);
        // Optional: simpan log ke Firestore jika enabled
        if(window.FirebaseService && FirebaseService.isEnabled()){
          FirebaseService.add('bel_log', {waktu, teks:j.teks, label:j.label, created_at:new Date().toISOString()}).catch(()=>{});
        }
      }
    });
  },

  aktifkan(){
    this.aktif=true;
    const info=document.getElementById('infoStatusBel');
    const dot=document.getElementById('belStatusDot');
    if(info){ info.textContent="🟢 Sistem Bel Aktif dan Memonitor Waktu..."; info.className="mt-3 text-[11px] px-3 py-2 rounded-full bg-[#e8f5e9] text-[#1b5e20] inline-block"; }
    if(dot){ dot.className="w-3 h-3 rounded-full bg-green-500 animate-pulse"; }
    this.bunyikan("Sistem bel otomatis berhasil diaktifkan.");
  },

  bunyikan(teks){
    try{
      const suara=new SpeechSynthesisUtterance(teks);
      suara.lang='id-ID';
      suara.rate=0.9;
      suara.pitch=1;
      window.speechSynthesis.speak(suara);
    }catch(e){ console.warn("TTS error", e); }
  }
};

// Auto init jika ada container belSekolahContainer
document.addEventListener('DOMContentLoaded', ()=>{
  if(document.getElementById('belSekolahContainer')){
    window.BelSekolah.init('belSekolahContainer');
  }
});
