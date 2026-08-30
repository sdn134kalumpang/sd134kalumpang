// js/features/bel-sekolah.js - STANDALONE BEL SEKOLAH OTOMATIS TTS - SDN 134 KALUMPANG
// FINAL - Diambil dari jadwal.js 873 baris + bel_1.html 126 baris - TANPA FIREBASE - Pengecualian
// ✅ Suara TTS terdengar di HP (unlockAudio + keepAlive)
// ✅ Beep 880Hz berfungsi
// ✅ Notifikasi overlay + Notification API + vibrate
// ✅ Bel otomatis berjalan check 00-04 detik + lastBelMinute guard
// ✅ Edit jadwal dengan input time + textarea teks (localStorage only)
// ✅ Upacara Bendera Senin JP1 otomatis & terkunci
// ✅ TANPA Firebase - standalone - localStorage bel_jadwal_v2

// State - dari jadwal.js
let audioContext = null;
let belInterval = null;
let keepAliveInterval = null;
let lastBelMinute = '';
let speechSynth = window.speechSynthesis;
let audioUnlocked = false;
let indonesianVoice = null;

// Default jadwal - gabungan bel_1.html + jadwal.js + upacara
const DEFAULT_BEL = [
  { id: 'mulai', waktu: '07:00', teks: 'Pemberitahuan, jam pelajaran pertama dimulai. Kepada seluruh siswa dimohon masuk ke kelas masing-masing.', title: '🔔 Bel Masuk Kelas', label: 'Masuk' },
  { id: 'istirahat1', waktu: '09:00', teks: 'Waktunya istirahat pertama. Selamat menikmati istirahat.', title: '☕ Bel Istirahat', label: 'Istirahat 1' },
  { id: 'lanjut', waktu: '09:30', teks: 'Waktu istirahat selesai. Jam pelajaran berikutnya dimulai.', title: '📚 Bel Lanjut', label: 'Lanjut' },
  { id: 'istirahat2', waktu: '12:00', teks: 'Waktunya istirahat kedua dan sholat dzuhur bagi yang muslim.', title: '☕ Bel Istirahat 2', label: 'Istirahat 2' },
  { id: 'pulang', waktu: '13:00', teks: 'Jam pelajaran selesai. Sampai jumpa besok pagi dan hati-hati di jalan.', title: '🏠 Bel Pulang', label: 'Pulang' }
];

const UPACARA_BENDERA = { id: 'upacara', waktu: '07:00', teks: 'Upacara bendera hari Senin dimulai. Seluruh siswa dan guru dimohon berkumpul di lapangan.', title: '🇮🇩 Upacara Bendera', label: 'Upacara Bendera', hari: 'Senin', locked: true };

function getBelJadwal(){
  try{
    return JSON.parse(localStorage.getItem('bel_jadwal_v2') || JSON.stringify(DEFAULT_BEL));
  }catch(e){ return DEFAULT_BEL; }
}
function saveBelJadwal(list){
  localStorage.setItem('bel_jadwal_v2', JSON.stringify(list));
}

// --- Fungsi Bel dari jadwal.js (diambil semua) ---

function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}

function unlockAudio() {
  if (audioUnlocked) return;
  try {
    if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === 'suspended') audioContext.resume();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    gainNode.gain.value = 0.001;
    oscillator.frequency.value = 1;
    oscillator.start();
    setTimeout(() => oscillator.stop(), 100);
    if (speechSynth) {
      const silentUtterance = new SpeechSynthesisUtterance(' ');
      silentUtterance.volume = 0.01;
      speechSynth.speak(silentUtterance);
    }
    audioUnlocked = true;
    const audioStatusEl = document.getElementById('audioStatus');
    if (audioStatusEl) {
      audioStatusEl.textContent = '✅ Audio: Ter-unlock';
      audioStatusEl.style.color = '#10b981';
    }
    const info = document.getElementById('infoStatusBel');
    if(info){ info.textContent = '🟢 Audio ter-unlock, siap aktifkan bel'; info.className = 'mt-3 text-[11px] px-3 py-2 rounded-full bg-[#e8f5e9] text-[#1b5e20] inline-block'; }
  } catch (e) {
    console.error('Gagal unlock audio:', e);
  }
}

function startKeepAlive() {
  if (keepAliveInterval) clearInterval(keepAliveInterval);
  keepAliveInterval = setInterval(() => {
    if (audioContext && audioContext.state === 'suspended') audioContext.resume();
    if (audioContext && audioUnlocked) {
      try {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        gainNode.gain.value = 0.001;
        oscillator.frequency.value = 1;
        oscillator.start();
        setTimeout(() => oscillator.stop(), 50);
      } catch (e) {}
    }
  }, 30000);
}

function playBeep() {
  try {
    if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === 'suspended') audioContext.resume();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.value = 880;
    oscillator.type = 'sine';
    gainNode.gain.value = 0.5;
    oscillator.start();
    setTimeout(() => oscillator.stop(), 1000);
  } catch (e) { console.error('Error beep:', e); }
}

function speakText(text) {
  console.log('🗣️ speakText:', text);
  if (!speechSynth) { console.error('❌ TTS tidak tersedia'); playBeep(); playBeep(); playBeep(); return; }
  try {
    if (audioContext && audioContext.state === 'suspended') audioContext.resume();
    speechSynth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.rate = 0.9;
    utterance.volume = 1;
    const gender = document.getElementById('optVoiceGender')?.value || 'female';
    if (indonesianVoice) { utterance.voice = indonesianVoice; console.log('🎤 Pakai voice:', indonesianVoice.name); }
    utterance.pitch = (gender === 'male') ? 0.85 : 1.15;
    utterance.onstart = () => console.log('✅ TTS started');
    utterance.onend = () => console.log('✅ TTS ended');
    utterance.onerror = (e) => { console.error('❌ TTS error:', e); playBeep(); setTimeout(() => playBeep(), 500); setTimeout(() => playBeep(), 1000); };
    speechSynth.speak(utterance);
  } catch (e) { console.error('TTS exception:', e); playBeep(); playBeep(); }
}

function showBelNotification(title, message) {
  const notif = document.createElement('div');
  notif.style.cssText = 'position:fixed;inset:0;z-index:10000;display:flex;align-items:center;justify-content:center;';
  notif.innerHTML = `
    <div class="bell-notif-overlay" style="position:absolute;inset:0;background:rgba(0,0,0,0.5);backdrop-filter:blur(4px);" onclick="this.parentElement.remove()"></div>
    <div class="bell-notif-content" style="position:relative;background:white;border-radius:20px;padding:24px;max-width:360px;text-align:center;box-shadow:0 20px 40px rgba(0,0,0,0.2);cursor:pointer;" onclick="this.parentElement.remove()">
      <div style="font-size:32px;">🔔</div>
      <div style="font-weight:800;margin-top:8px;font-size:14px;">${title}</div>
      <div style="margin-top:8px;font-size:12px;color:#64748b;">${message}</div>
      <div style="margin-top:15px;font-size:11px;color:#94a3b8;">Tap untuk tutup • Auto 8 detik</div>
    </div>
  `;
  document.body.appendChild(notif);
  setTimeout(() => notif.remove(), 8000);
}

function showToast(msg) {
  const toast = document.createElement('div');
  toast.textContent = msg;
  toast.style.cssText = `position: fixed; top: 20px; right: 20px; background: #0f2f1e; color: white; padding: 12px 20px; border-radius: 12px; z-index: 10001; font-weight: 600; font-size:12px; box-shadow:0 8px 24px rgba(0,0,0,0.2);`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function updateDisplay() {
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
  const timeEl = document.getElementById('belCurrentTime');
  if (timeEl) timeEl.textContent = `Waktu sekarang: ${currentTime}`;
  const jamEl = document.getElementById('jamBel');
  if(jamEl) jamEl.textContent = currentTime;
  
  const belTimes = getBelJadwal().map(b=>({ time: b.waktu, name: b.label }));
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  let nextBel = null;
  for (const bel of belTimes) {
    const [h, m] = bel.time.split(':').map(Number);
    if ((h * 60 + m) > currentMinutes) { nextBel = { ...bel, minutes: (h * 60 + m) }; break; }
  }
  const countdownEl = document.getElementById('countdownDisplay');
  if (countdownEl) {
    if (nextBel) {
      const diff = nextBel.minutes - currentMinutes;
      countdownEl.textContent = `${String(Math.floor(diff / 60)).padStart(2,'0')}:${String(diff % 60).padStart(2,'0')}:${String(60 - now.getSeconds()).padStart(2,'0')}`;
    } else {
      countdownEl.textContent = '00:00:00';
    }
  }
  const nextEl = document.getElementById('belNextTime');
  if (nextEl) nextEl.textContent = `Bel berikutnya: ${nextBel ? nextBel.name + ' (' + nextBel.time + ')' : '-'}`;
}

function checkBelTime() {
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  updateDisplay();
  if (!['00','01','02','03','04'].includes(String(now.getSeconds()).padStart(2,'0'))) return;
  if (lastBelMinute === currentTime) return;

  // Upacara Bendera Senin JP1 terkunci - dari jadwal.js
  const dayName = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'][now.getDay()];
  if(dayName === 'Senin' && currentTime === UPACARA_BENDERA.waktu){
    lastBelMinute = currentTime;
    console.log('🇮🇩 UPACARA BENDERA SENIN');
    playBeep();
    showBelNotification(UPACARA_BENDERA.title, UPACARA_BENDERA.teks);
    if ('Notification' in window && Notification.permission === 'granted') new Notification(UPACARA_BENDERA.title, { body: UPACARA_BENDERA.teks });
    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    speakText(UPACARA_BENDERA.teks);
    return;
  }

  const belConfigs = getBelJadwal().map(b=>({
    time: b.waktu,
    text: b.teks,
    title: b.title,
    label: b.label
  }));
  
  const activeBel = belConfigs.find(bel => bel.time === currentTime);
  if (activeBel && activeBel.text && activeBel.text.trim()) {
    lastBelMinute = currentTime;
    console.log(`🔔 BEL AKTIF: ${activeBel.title}`);
    playBeep();
    showBelNotification(activeBel.title, activeBel.text);
    if ('Notification' in window && Notification.permission === 'granted') new Notification(activeBel.title, { body: activeBel.text });
    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    speakText(activeBel.text);
  }
}

function startBelOtomatis() {
  console.log('🚀 startBelOtomatis - TANPA FIREBASE');
  if (!audioUnlocked) {
    alert('⚠️ Klik tombol "🔓 Izinkan Suara" terlebih dahulu agar bel bisa berbunyi otomatis! (Browser butuh interaksi user)');
    return;
  }
  if (belInterval) clearInterval(belInterval);
  lastBelMinute = '';
  updateDisplay();
  belInterval = setInterval(checkBelTime, 500);
  startKeepAlive();
  speakText("Bel otomatis telah diaktifkan tanpa koneksi Firebase");
  const statusEl = document.getElementById('belStatus');
  if (statusEl) { statusEl.textContent = '✅ Aktif - Memantau waktu bel (Tanpa Firebase)'; statusEl.style.color = '#10b981'; }
  const dot = document.getElementById('belStatusDot');
  if(dot){ dot.className = 'w-3 h-3 rounded-full bg-green-500 animate-pulse'; }
  showToast('🔔 Bel aktif tanpa Firebase!');
}

function stopBelOtomatis() {
  if (belInterval) { clearInterval(belInterval); belInterval = null; }
  if (keepAliveInterval) { clearInterval(keepAliveInterval); keepAliveInterval = null; }
  const statusEl = document.getElementById('belStatus');
  if (statusEl) { statusEl.textContent = '⏸️ Non-aktif'; statusEl.style.color = '#be185d'; }
  const dot = document.getElementById('belStatusDot');
  if(dot){ dot.className = 'w-3 h-3 rounded-full bg-red-400'; }
}

// --- UI Standalone TANPA Firebase ---

window.BelSekolah = {
  init(containerId){
    const container = document.getElementById(containerId);
    if(!container) return;
    
    // Load voices for TTS - dari jadwal.js
    if (speechSynth) {
      const loadVoices = () => {
        const voices = speechSynth.getVoices();
        indonesianVoice = voices.find(v => v.lang === 'id-ID') || 
                         voices.find(v => v.lang.includes('id')) ||
                         voices.find(v => v.name.toLowerCase().includes('indonesia'));
        console.log('🎤 Voices loaded:', voices.length, '| Indonesian voice:', indonesianVoice?.name || 'Not found');
      };
      loadVoices();
      if (speechSynth.onvoiceschanged !== undefined) {
        speechSynth.onvoiceschanged = loadVoices;
      }
    }
    
    requestNotificationPermission();
    
    const jadwal = getBelJadwal();
    
    container.innerHTML = `
      <div class="bg-white rounded-[20px] border border-slate-200 card-shadow p-6 md:p-8 max-w-[680px] mx-auto">
        <div class="flex items-center justify-between">
          <div><div class="font-jakarta font-extrabold text-[18px]">🔔 Bel Sekolah Otomatis</div><div class="text-[11px] text-slate-500 mt-1">TTS Bahasa Indonesia • Tanpa Firebase • Standalone • localStorage</div></div>
          <div id="belStatusDot" class="w-3 h-3 rounded-full bg-red-400"></div>
        </div>
        
        <div class="mt-6 text-center bg-[#f8fafc] rounded-[16px] p-5 border">
          <div class="text-[11px] font-bold tracking-widest text-slate-400">WAKTU SISTEM</div>
          <div id="jamBel" class="font-mono font-extrabold text-[42px] tracking-[-0.02em] mt-1">00:00:00</div>
          <div id="belCurrentTime" class="text-[11px] text-slate-500 mt-1">Waktu sekarang: 00:00:00</div>
          <div class="mt-3 flex items-center justify-center gap-3">
            <div><div class="text-[10px] text-slate-400">Countdown</div><div id="countdownDisplay" class="font-mono font-bold text-[16px]">00:00:00</div></div>
            <div class="w-px h-10 bg-slate-200"></div>
            <div><div id="belNextTime" class="text-[11px] text-slate-600">Bel berikutnya: -</div><div id="belStatus" class="text-[11px] font-bold mt-1" style="color:#be185d;">⏸️ Non-aktif</div></div>
          </div>
          <div id="audioStatus" class="mt-3 text-[11px] px-3 py-1.5 rounded-full bg-[#fff1f1] text-[#9a1a1a] inline-block">🔒 Audio: Belum di-unlock (klik izinkan)</div>
        </div>

        <div class="mt-6 grid grid-cols-2 gap-2">
          <button id="btnUnlockAudio" class="h-11 rounded-xl bg-white border border-slate-200 text-[#0f2f1e] font-bold text-[12px]">🔓 Izinkan Suara (HP)</button>
          <button id="btnAktifkanBel" class="h-11 rounded-xl bg-[#0f2f1e] text-white font-bold text-[12px]">🔔 Aktifkan Bel</button>
        </div>
        <div class="mt-2 grid grid-cols-3 gap-2">
          <button id="btnTesBel" class="h-10 rounded-xl bg-[#ffcc00] text-[#0f2f1e] font-bold text-[11px]">🔊 Tes Suara</button>
          <button id="btnTesBeep" class="h-10 rounded-xl bg-[#f1f5f9] border text-[11px] font-bold">🔔 Tes Beep</button>
          <button id="btnStopBel" class="h-10 rounded-xl bg-[#fff1f1] border border-[#fecaca] text-[#dc2626] text-[11px] font-bold">⏸️ Stop</button>
        </div>

        <div class="mt-6">
          <div class="flex items-center justify-between">
            <div class="font-bold text-[12px]">⚙️ Pengaturan Jadwal Bel (Tanpa Firebase)</div>
            <select id="optVoiceGender" class="text-[11px] border rounded-full px-2 py-1"><option value="female">Female</option><option value="male">Male</option></select>
          </div>
          <div class="mt-2 text-[10px] text-slate-500">Edit jam & teks bel, disimpan di localStorage bel_jadwal_v2, tidak konek Firebase. Upacara Bendera Senin 07:00 terkunci otomatis.</div>
          <div id="jadwalEditList" class="mt-4 space-y-3"></div>
          <div class="mt-3 p-3 rounded-xl bg-[#fffbeb] border border-[#fde68a] text-[10px]">🇮🇩 <b>Upacara Bendera:</b> Senin 07:00 otomatis terkunci — "${UPACARA_BENDERA.teks}"</div>
        </div>

        <div class="mt-6 flex gap-2">
          <button id="btnSimpanJadwal" class="flex-1 h-11 rounded-xl bg-[#0f2f1e] text-white font-bold text-[12px]">💾 Simpan Jadwal (localStorage)</button>
          <button id="btnResetJadwal" class="h-11 px-4 rounded-xl bg-white border text-[11px] font-bold">↩️ Reset</button>
        </div>

        <div class="mt-4 text-[10px] text-slate-400 text-center">Path: js/features/bel-sekolah.js • Standalone TANPA Firebase • Pengecualian • localStorage bel_jadwal_v2 • AudioContext unlock + keepAlive 30s • TTS id-ID rate 0.9 • Beep 880Hz • Notification + Vibrate • Upacara Senin • Diambil dari jadwal.js 873 baris</div>
      </div>
    `;

    this.renderEditList();
    
    document.getElementById('btnUnlockAudio')?.addEventListener('click', ()=> unlockAudio());
    document.getElementById('btnAktifkanBel')?.addEventListener('click', ()=> startBelOtomatis());
    document.getElementById('btnStopBel')?.addEventListener('click', ()=> stopBelOtomatis());
    document.getElementById('btnTesBel')?.addEventListener('click', ()=> speakText("Sistem bel otomatis berhasil diaktifkan tanpa Firebase"));
    document.getElementById('btnTesBeep')?.addEventListener('click', ()=> { playBeep(); showToast('🔔 Beep 880Hz'); });
    document.getElementById('btnSimpanJadwal')?.addEventListener('click', ()=> this.simpanJadwal());
    document.getElementById('btnResetJadwal')?.addEventListener('click', ()=> { localStorage.removeItem('bel_jadwal_v2'); this.renderEditList(); showToast('↩️ Reset ke default'); });

    const unlockHandler = () => {
      unlockAudio();
      document.removeEventListener('click', unlockHandler);
      document.removeEventListener('touchstart', unlockHandler);
      document.removeEventListener('keydown', unlockHandler);
    };
    document.addEventListener('click', unlockHandler);
    document.addEventListener('touchstart', unlockHandler);
    document.addEventListener('keydown', unlockHandler);

    if(this.displayInterval) clearInterval(this.displayInterval);
    this.displayInterval = setInterval(()=> updateDisplay(), 1000);
    updateDisplay();
  },

  renderEditList(){
    const el = document.getElementById('jadwalEditList');
    if(!el) return;
    const jadwal = getBelJadwal();
    el.innerHTML = jadwal.map((j, idx)=>`
      <div class="p-4 rounded-xl bg-[#f8fafc] border border-slate-200">
        <div class="flex items-center justify-between">
          <div class="font-bold text-[11px]">${j.label} (${j.id})</div>
          <div class="font-mono text-[10px] text-slate-500">${j.title}</div>
        </div>
        <div class="mt-2 grid grid-cols-[100px_1fr] gap-2">
          <div><label class="text-[10px] font-bold">Jam</label><input type="time" id="inpBel_${j.id}" value="${j.waktu}" class="w-full mt-1 h-9 px-2 rounded-lg border bg-white text-[12px]"></div>
          <div><label class="text-[10px] font-bold">Teks TTS</label><textarea id="txtBel_${j.id}" class="w-full mt-1 h-9 px-2 py-1.5 rounded-lg border bg-white text-[11px] resize-none">${j.teks}</textarea></div>
        </div>
      </div>
    `).join('');
  },

  simpanJadwal(){
    const jadwal = getBelJadwal();
    const newList = jadwal.map(j=>{
      const waktuEl = document.getElementById(`inpBel_${j.id}`);
      const teksEl = document.getElementById(`txtBel_${j.id}`);
      return {
        ...j,
        waktu: waktuEl ? waktuEl.value : j.waktu,
        teks: teksEl ? teksEl.value : j.teks
      };
    });
    saveBelJadwal(newList);
    showToast('💾 Jadwal disimpan (localStorage, tanpa Firebase)');
    this.renderEditList();
  }
};

document.addEventListener('DOMContentLoaded', ()=>{
  if(document.getElementById('belSekolahContainer')){
    window.BelSekolah.init('belSekolahContainer');
  }
});
if(document.readyState !== 'loading' && document.getElementById('belSekolahContainer')){
  window.BelSekolah.init('belSekolahContainer');
}
