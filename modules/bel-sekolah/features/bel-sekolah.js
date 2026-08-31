// modules/bel-sekolah/features/bel-sekolah.js
// Aplikasi Bel Sekolah Standalone - Integrasi dengan Landing Page
// Fungsi: Bel otomatis, TTS, notifikasi visual, countdown

(function() {
  'use strict';

  // === STATE ===
  let audioContext = null;
  let belInterval = null;
  let keepAliveInterval = null;
  let lastBelMinute = '';
  let speechSynth = window.speechSynthesis;
  let audioUnlocked = false;
  let indonesianVoice = null;
  let isBelActive = false;

  // === KONFIGURASI WAKTU BEL (Default) ===
  const DEFAULT_BEL_CONFIG = {
    mulai: { time: '07:00', text: 'Selamat pagi, ayo masuk kelas dan belajar yang rajin ya!' },
    istirahat: { time: '09:00', text: 'Waktunya istirahat, silakan pergi ke kantin.' },
    lanjut: { time: '09:30', text: 'Waktunya masuk kelas kembali, ayo lanjut belajar!' },
    pulang: { time: '13:00', text: 'Waktunya pulang, hati-hati di jalan. Sampai jumpa besok!' }
  };

  // === INISIALISASI ===
  function initBelSekolah() {
    console.log('🔔 Bel Sekolah Module initialized');
    
    // Load voice untuk TTS
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

    // Auto-unlock audio saat user interaction pertama
    const unlockHandler = () => {
      unlockAudio();
      document.removeEventListener('click', unlockHandler);
      document.removeEventListener('touchstart', unlockHandler);
      document.removeEventListener('keydown', unlockHandler);
    };
    document.addEventListener('click', unlockHandler);
    document.addEventListener('touchstart', unlockHandler);
    document.addEventListener('keydown', unlockHandler);

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }

  // === AUDIO UNLOCK ===
  function unlockAudio() {
    if (audioUnlocked) return;
    try {
      if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      
      // Play silent tone to unlock
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      gainNode.gain.value = 0.001;
      oscillator.frequency.value = 1;
      oscillator.start();
      setTimeout(() => oscillator.stop(), 100);

      // Unlock speech synth
      if (speechSynth) {
        const silentUtterance = new SpeechSynthesisUtterance(' ');
        silentUtterance.volume = 0.01;
        speechSynth.speak(silentUtterance);
      }

      audioUnlocked = true;
      console.log('✅ Audio unlocked');
      
      // Update UI jika ada elemen status
      const statusEl = document.getElementById('belStatus');
      if (statusEl) {
        statusEl.textContent = '✅ Audio: Ter-unlock';
        statusEl.style.color = '#10b981';
      }
    } catch (e) {
      console.error('Gagal unlock audio:', e);
    }
  }

  // === PLAY BEEP ===
  function playBeep() {
    try {
      if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.value = 880;
      oscillator.type = 'sine';
      gainNode.gain.value = 0.5;
      oscillator.start();
      setTimeout(() => oscillator.stop(), 1000);
    } catch (e) {
      console.error('Error beep:', e);
    }
  }

  // === TEXT TO SPEECH ===
  function speakText(text) {
    console.log('🗣️ speakText:', text);
    if (!speechSynth) {
      console.error('❌ TTS tidak tersedia');
      playBeep();
      playBeep();
      playBeep();
      return;
    }

    try {
      if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
      }
      
      speechSynth.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID';
      utterance.rate = 0.9;
      utterance.volume = 1;
      
      if (indonesianVoice) {
        utterance.voice = indonesianVoice;
        console.log('🎤 Pakai voice:', indonesianVoice.name);
      }
      
      utterance.pitch = 1.0;
      
      utterance.onstart = () => console.log('✅ TTS started');
      utterance.onend = () => console.log('✅ TTS ended');
      utterance.onerror = (e) => {
        console.error('❌ TTS error:', e);
        playBeep();
        setTimeout(() => playBeep(), 500);
        setTimeout(() => playBeep(), 1000);
      };
      
      speechSynth.speak(utterance);
    } catch (e) {
      console.error('TTS exception:', e);
      playBeep();
      playBeep();
    }
  }

  // === NOTIFIKASI VISUAL ===
  function showBelNotification(title, message) {
    const notif = document.createElement('div');
    notif.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    
    notif.innerHTML = `
      <div style="
        background: linear-gradient(135deg, #0f7a4a 0%, #0a4d2e 100%);
        color: white;
        padding: 40px 60px;
        border-radius: 20px;
        box-shadow: 0 20px 60px rgba(15, 122, 74, 0.4);
        text-align: center;
        animation: bellPulse 0.5s ease;
        max-width: 90%;
      ">
        <div style="font-size: 48px; margin-bottom: 15px;">🔔</div>
        <div style="font-size: 24px; font-weight: 700; margin-bottom: 10px;">${title}</div>
        <div style="font-size: 14px; opacity: 0.9;">${message}</div>
        <div style="margin-top: 15px; font-size: 12px;">Tap untuk tutup</div>
      </div>
    `;
    
    notif.onclick = () => notif.remove();
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 8000);
  }

  // === CHECK WAKTU BEL ===
  function checkBelTime() {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    updateDisplay();
    
    // Cek hanya di detik 00-04 untuk mencegah trigger berulang
    if (!['00','01','02','03','04'].includes(String(now.getSeconds()).padStart(2, '0'))) {
      return;
    }
    
    if (lastBelMinute === currentTime) return;
    
    // Load konfigurasi dari localStorage atau gunakan default
    const belConfig = JSON.parse(localStorage.getItem('bel_config') || JSON.stringify(DEFAULT_BEL_CONFIG));
    
    const belConfigs = [
      { time: belConfig.mulai.time, text: belConfig.mulai.text, title: '🔔 Bel Masuk Kelas' },
      { time: belConfig.istirahat.time, text: belConfig.istirahat.text, title: '☕ Bel Istirahat' },
      { time: belConfig.lanjut.time, text: belConfig.lanjut.text, title: ' Bel Lanjut' },
      { time: belConfig.pulang.time, text: belConfig.pulang.text, title: '🏠 Bel Pulang' }
    ];
    
    const activeBel = belConfigs.find(bel => bel.time === currentTime);
    
    if (activeBel && activeBel.text && activeBel.text.trim()) {
      lastBelMinute = currentTime;
      console.log(`🔔 BEL AKTIF: ${activeBel.title}`);
      
      playBeep();
      showBelNotification(activeBel.title, activeBel.text);
      
      // Browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(activeBel.title, { body: activeBel.text });
      }
      
      // Vibrate (mobile)
      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200]);
      }
      
      speakText(activeBel.text);
    }
  }

  // === UPDATE DISPLAY (Countdown) ===
  function updateDisplay() {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    
    const timeEl = document.getElementById('belCurrentTime');
    if (timeEl) {
      timeEl.textContent = `Waktu sekarang: ${currentTime}`;
    }
    
    const belConfig = JSON.parse(localStorage.getItem('bel_config') || JSON.stringify(DEFAULT_BEL_CONFIG));
    
    const belTimes = [
      { time: belConfig.mulai.time, name: 'Mulai' },
      { time: belConfig.istirahat.time, name: 'Istirahat' },
      { time: belConfig.lanjut.time, name: 'Lanjut' },
      { time: belConfig.pulang.time, name: 'Pulang' }
    ];
    
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    let nextBel = null;
    
    for (const bel of belTimes) {
      const [h, m] = bel.time.split(':').map(Number);
      if ((h * 60 + m) > currentMinutes) {
        nextBel = { ...bel, minutes: (h * 60 + m) };
        break;
      }
    }
    
    const countdownEl = document.getElementById('countdownDisplay');
    if (countdownEl) {
      if (nextBel) {
        const diff = nextBel.minutes - currentMinutes;
        countdownEl.textContent = `${String(Math.floor(diff / 60)).padStart(2, '0')}:${String(diff % 60).padStart(2, '0')}:${String(60 - now.getSeconds()).padStart(2, '0')}`;
      } else {
        countdownEl.textContent = '00:00:00';
      }
    }
    
    const nextEl = document.getElementById('belNextTime');
    if (nextEl) {
      nextEl.textContent = `Bel berikutnya: ${nextBel ? nextBel.name + ' (' + nextBel.time + ')' : '-'}`;
    }
  }

  // === START BEL OTOMATIS ===
  function startBelOtomatis() {
    console.log('🚀 startBelOtomatis');
    
    if (!audioUnlocked) {
      alert('⚠️ Klik tombol bel terlebih dahulu untuk mengaktifkan suara!');
      return;
    }
    
    if (belInterval) clearInterval(belInterval);
    lastBelMinute = '';
    updateDisplay();
    belInterval = setInterval(checkBelTime, 500);
    
    // Keep alive interval untuk mencegah audio context suspended
    startKeepAlive();
    
    speakText("Bel otomatis telah diaktifkan");
    isBelActive = true;
    
    const statusEl = document.getElementById('belStatus');
    if (statusEl) {
      statusEl.textContent = '✅ Aktif - Memantau waktu bel';
      statusEl.style.color = '#10b981';
    }
    
    console.log('🔔 Bel otomatis aktif');
  }

  // === STOP BEL OTOMATIS ===
  function stopBelOtomatis() {
    if (belInterval) {
      clearInterval(belInterval);
      belInterval = null;
    }
    if (keepAliveInterval) {
      clearInterval(keepAliveInterval);
      keepAliveInterval = null;
    }
    isBelActive = false;
    
    const statusEl = document.getElementById('belStatus');
    if (statusEl) {
      statusEl.textContent = '⏸️ Non-aktif';
      statusEl.style.color = '#be185d';
    }
    
    console.log('⏸️ Bel otomatis berhenti');
  }

  // === KEEP ALIVE ===
  function startKeepAlive() {
    if (keepAliveInterval) clearInterval(keepAliveInterval);
    keepAliveInterval = setInterval(() => {
      if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
      }
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

  // === TEST BEL MANUAL ===
  function testBelManual(belType) {
    if (!audioUnlocked) unlockAudio();
    
    const belConfig = JSON.parse(localStorage.getItem('bel_config') || JSON.stringify(DEFAULT_BEL_CONFIG));
    
    const texts = {
      mulai: belConfig.mulai.text,
      istirahat: belConfig.istirahat.text,
      lanjut: belConfig.lanjut.text,
      pulang: belConfig.pulang.text
    };
    
    const titles = {
      mulai: '🔔 Bel Masuk Kelas',
      istirahat: '☕ Bel Istirahat',
      lanjut: '📚 Bel Lanjut',
      pulang: '🏠 Bel Pulang'
    };
    
    const text = texts[belType];
    const title = titles[belType];
    
    if (!text) {
      alert('⚠️ Teks bel kosong!');
      return;
    }
    
    playBeep();
    speakText(text);
    showBelNotification(title, text);
    console.log(`🧪 Test ${title}`);
  }

  // === TOGGLE BEL (untuk tombol di header) ===
  function toggleBel() {
    if (!audioUnlocked) {
      unlockAudio();
      setTimeout(() => {
        startBelOtomatis();
      }, 500);
    } else {
      if (isBelActive) {
        stopBelOtomatis();
      } else {
        startBelOtomatis();
      }
    }
  }

  // === EXPORT KE WINDOW ===
  window.BelSekolah = {
    init: initBelSekolah,
    unlockAudio: unlockAudio,
    playBeep: playBeep,
    speakText: speakText,
    showNotification: showBelNotification,
    start: startBelOtomatis,
    stop: stopBelOtomatis,
    toggle: toggleBel,
    test: testBelManual,
    isActive: () => isBelActive
  };

  // Auto-init saat DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBelSekolah);
  } else {
    initBelSekolah();
  }

})();
