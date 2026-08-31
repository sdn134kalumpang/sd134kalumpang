// modules/bel-sekolah/features/bel-sekolah.js
// Aplikasi Bel Sekolah Standalone + Panel Kontrol Visual
// Tanpa Firebase - menggunakan localStorage untuk konfigurasi

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

  // === KONFIGURASI DEFAULT ===
  const DEFAULT_BEL_CONFIG = {
    mulai: { time: '07:00', text: 'Selamat pagi, ayo masuk kelas dan belajar yang rajin!' },
    istirahat: { time: '09:00', text: 'Waktunya istirahat, silakan pergi ke kantin.' },
    lanjut: { time: '09:30', text: 'Waktunya masuk kelas kembali, ayo lanjut belajar!' },
    pulang: { time: '13:00', text: 'Waktunya pulang, hati-hati di jalan. Sampai jumpa besok!' }
  };

  // === INISIALISASI ===
  function initBelSekolah() {
    console.log('🔔 Bel Sekolah Module initialized');
    
    if (speechSynth) {
      const loadVoices = () => {
        const voices = speechSynth.getVoices();
        indonesianVoice = voices.find(v => v.lang === 'id-ID') ||
                         voices.find(v => v.lang.includes('id')) ||
                         voices.find(v => v.name.toLowerCase().includes('indonesia'));
      };
      loadVoices();
      if (speechSynth.onvoiceschanged !== undefined) {
        speechSynth.onvoiceschanged = loadVoices;
      }
    }

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
      console.log('✅ Audio unlocked');
      showToast('✅ Audio berhasil diaktifkan!');
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
      }
      
      utterance.pitch = 1.0;
      
      utterance.onerror = (e) => {
        console.error('❌ TTS error:', e);
        playBeep();
      };
      
      speechSynth.speak(utterance);
    } catch (e) {
      console.error('TTS exception:', e);
      playBeep();
    }
  }

  // === TOAST NOTIFICATION ===
  function showToast(msg) {
    const toast = document.createElement('div');
    toast.textContent = msg;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 12px 20px;
      border-radius: 10px;
      z-index: 100000;
      font-weight: 600;
      font-size: 13px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s';
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

  // === PANEL KONTROL BEL (MODAL) ===
  function showPanel() {
    // Hapus panel lama jika ada
    const oldPanel = document.getElementById('belPanelOverlay');
    if (oldPanel) oldPanel.remove();

    const belConfig = JSON.parse(localStorage.getItem('bel_config') || JSON.stringify(DEFAULT_BEL_CONFIG));

    const overlay = document.createElement('div');
    overlay.id = 'belPanelOverlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      overflow-y: auto;
    `;

    overlay.innerHTML = `
      <style>
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .bel-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.1); }
        .bel-btn:active { transform: translateY(0); }
      </style>
      
      <!-- Tombol Kembali ke Dashboard -->
      <button id="btnBackDashboard" style="
        position: fixed;
        top: 20px;
        left: 20px;
        background: white;
        color: #1e3a8a;
        border: none;
        padding: 10px 18px;
        border-radius: 8px;
        font-weight: 700;
        font-size: 13px;
        cursor: pointer;
        z-index: 100001;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      ">← Kembali ke Dashboard</button>

      <!-- Panel Utama -->
      <div style="
        background: #fce7f3;
        border-radius: 20px;
        padding: 30px;
        max-width: 800px;
        width: 100%;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        animation: fadeIn 0.4s ease;
      ">
        <!-- Header Panel -->
        <div style="
          background: linear-gradient(135deg, #ec4899 0%, #f472b6 100%);
          color: white;
          padding: 25px;
          border-radius: 14px;
          text-align: center;
          margin-bottom: 25px;
        ">
          <div style="font-size: 28px; margin-bottom: 8px;">️</div>
          <h2 style="margin: 0 0 8px 0; font-size: 24px; font-weight: 800;">Panel Kontrol Bel Sekolah</h2>
          <p style="margin: 0; font-size: 13px; opacity: 0.95;">Klik tombol untuk membunyikan bel. Suara beep + voice akan keluar dari speaker.</p>
        </div>

        <!-- Grid 4 Bel -->
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 20px;">
          <button class="bel-btn" data-bel="mulai" style="
            background: white;
            border: none;
            border-left: 5px solid #3b82f6;
            border-radius: 12px;
            padding: 25px 20px;
            cursor: pointer;
            transition: all 0.2s;
            text-align: center;
          ">
            <div style="font-size: 15px; font-weight: 700; color: #1e3a8a; margin-bottom: 6px;">Bel Masuk Kelas</div>
            <div style="font-size: 12px; color: #64748b;">Siap</div>
          </button>

          <button class="bel-btn" data-bel="istirahat" style="
            background: white;
            border: none;
            border-left: 5px solid #f59e0b;
            border-radius: 12px;
            padding: 25px 20px;
            cursor: pointer;
            transition: all 0.2s;
            text-align: center;
          ">
            <div style="font-size: 28px; margin-bottom: 6px;">☕</div>
            <div style="font-size: 15px; font-weight: 700; color: #1e3a8a; margin-bottom: 6px;">Bel Istirahat</div>
            <div style="font-size: 12px; color: #64748b;">Siap</div>
          </button>

          <button class="bel-btn" data-bel="lanjut" style="
            background: white;
            border: none;
            border-left: 5px solid #10b981;
            border-radius: 12px;
            padding: 25px 20px;
            cursor: pointer;
            transition: all 0.2s;
            text-align: center;
          ">
            <div style="font-size: 15px; font-weight: 700; color: #1e3a8a; margin-bottom: 6px;">Bel Lanjut Belajar</div>
            <div style="font-size: 12px; color: #64748b;">Siap</div>
          </button>

          <button class="bel-btn" data-bel="pulang" style="
            background: white;
            border: none;
            border-left: 5px solid #ef4444;
            border-radius: 12px;
            padding: 25px 20px;
            cursor: pointer;
            transition: all 0.2s;
            text-align: center;
          ">
            <div style="font-size: 15px; font-weight: 700; color: #1e3a8a; margin-bottom: 6px;">Bel Pulang Sekolah</div>
            <div style="font-size: 12px; color: #64748b;">Siap</div>
          </button>
        </div>

        <!-- Tombol Kontrol -->
        <div style="background: white; border-radius: 14px; padding: 20px;">
          <button id="btnStopBel" style="
            width: 100%;
            background: #6b7280;
            color: white;
            border: none;
            padding: 14px;
            border-radius: 10px;
            font-size: 14px;
            font-weight: 700;
            cursor: pointer;
            margin-bottom: 12px;
            transition: background 0.2s;
          ">⏹️ Stop / Matikan Suara</button>

          <button id="btnUnlockAudio" style="
            width: 100%;
            background: #f59e0b;
            color: white;
            border: none;
            padding: 14px;
            border-radius: 10px;
            font-size: 14px;
            font-weight: 700;
            cursor: pointer;
            transition: background 0.2s;
          ">🔓 Izinkan Suara (Klik Dulu!)</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Event: Kembali ke Dashboard
    document.getElementById('btnBackDashboard').onclick = function() {
      overlay.remove();
    };

    // Event: 4 Tombol Bel
    const belBtns = overlay.querySelectorAll('.bel-btn');
    belBtns.forEach(btn => {
      btn.onclick = function() {
        const belType = this.getAttribute('data-bel');
        if (!audioUnlocked) {
          unlockAudio();
          setTimeout(() => triggerBel(belType), 300);
        } else {
          triggerBel(belType);
        }
      };
    });

    // Event: Stop
    document.getElementById('btnStopBel').onclick = function() {
      if (speechSynth) speechSynth.cancel();
      showToast('⏹️ Suara dihentikan');
    };

    // Event: Izinkan Suara
    document.getElementById('btnUnlockAudio').onclick = function() {
      unlockAudio();
    };
  }

  // === TRIGGER BEL MANUAL ===
  function triggerBel(belType) {
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
      lanjut: '📚 Bel Lanjut Belajar',
      pulang: '🏠 Bel Pulang Sekolah'
    };
    
    const text = texts[belType];
    const title = titles[belType];
    
    if (!text) {
      alert('️ Teks bel kosong!');
      return;
    }
    
    playBeep();
    speakText(text);
    showBelNotification(title, text);
    console.log(`🧪 Trigger ${title}`);
  }

  // === NOTIFIKASI VISUAL ===
  function showBelNotification(title, message) {
    const notif = document.createElement('div');
    notif.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, #ec4899 0%, #f472b6 100%);
      color: white;
      padding: 40px 60px;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(236, 72, 153, 0.4);
      z-index: 100002;
      text-align: center;
      animation: fadeIn 0.5s ease;
      max-width: 90%;
    `;
    
    notif.innerHTML = `
      <div style="font-size: 48px; margin-bottom: 15px;">🔔</div>
      <div style="font-size: 24px; font-weight: 700; margin-bottom: 10px;">${title}</div>
      <div style="font-size: 14px; opacity: 0.9;">${message}</div>
      <div style="margin-top: 15px; font-size: 12px;">Tap untuk tutup</div>
    `;
    
    notif.onclick = () => notif.remove();
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 8000);
  }

  // === EXPORT KE WINDOW ===
  window.BelSekolah = {
    init: initBelSekolah,
    unlockAudio: unlockAudio,
    playBeep: playBeep,
    speakText: speakText,
    showNotification: showBelNotification,
    showPanel: showPanel,
    trigger: triggerBel,
    isActive: () => isBelActive
  };

  // Auto-init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBelSekolah);
  } else {
    initBelSekolah();
  }

})();
