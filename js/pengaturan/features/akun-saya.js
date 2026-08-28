// js/pengaturan/features/akun-saya.js - MANDIRI - Akun Saya + Profil Role + Firestore - Taat v3
// Sinkron: schools/40312947/users_db/{fid} -> profil: {guru:{}, siswa:{}, ortu:{}}
// Role: guru -> asal_sekolah, nip_guru, nama_kepsek, nip_kepsek, no_hp + Edit + Simpan
// Role: siswa -> nama_ibu, nama_bapak, no_hp
// Role: ortu -> nama_anak, no_hp

window.AkunSayaFeature = {
  _currentDoc: null,
  _isEdit: false,

  async load(){
    const u = ServiceMenu.getCurrentUser();
    const namaEl = document.getElementById('akunNama');
    const emailEl = document.getElementById('akunEmail');
    const roleEl = document.getElementById('akunRole');
    if(namaEl) namaEl.value = u.nama || '';
    if(emailEl) emailEl.value = u.email || '';
    if(roleEl) roleEl.value = u.role || 'guru';

    const container = document.getElementById('akunSayaFormDinamis');
    if(!container){
      // fallback if pengaturan.html belum update
      return;
    }

    // Ambil data lengkap dari Firestore cache users_db
    let fullUser = null;
    if(window.UserManagementFeature && UserManagementFeature._cache){
      fullUser = UserManagementFeature._cache.find(x=> (x.email||'').toLowerCase() === (u.email||'').toLowerCase());
    }
    if(!fullUser){
      try{
        const list = JSON.parse(localStorage.getItem('users_db_v2')||'[]');
        fullUser = list.find(x=> (x.email||'').toLowerCase() === (u.email||'').toLowerCase());
      }catch(e){}
    }
    if(!fullUser && window.FirebaseService && FirebaseService.isEnabled()){
      try{
        const list = await FirebaseService.getAll('users_db');
        fullUser = list.find(x=> (x.email||'').toLowerCase() === (u.email||'').toLowerCase());
      }catch(e){}
    }

    this._currentDoc = fullUser || { email: u.email, nama: u.nama, role: u.role, profil: {} };
    const profil = this._currentDoc.profil || {};
    const role = (this._currentDoc.role || u.role || 'guru').toLowerCase();

    let html = '';
    const disabled = this._isEdit ? '' : 'disabled';
    const btnEditText = this._isEdit ? 'Batal Edit' : '✏️ Edit Profil';

    html += `<div class="flex justify-between items-center mb-3"><span class="text-[11px] bg-[#f1f5f9] px-2 py-1 rounded">Firestore: ${this._currentDoc.firestore_id ? this._currentDoc.firestore_id.slice(0,6)+'...' : 'local'} • Role: ${role}</span><button id="btnEditAkun" class="text-[11px] bg-[#0d3b66] text-white px-3 py-1.5 rounded-full font-bold">${btnEditText}</button></div>`;

    if(role === 'guru' || role === 'kepsek' || role === 'admin' || role === 'super_admin'){
      const g = profil.guru || profil || {};
      html += `
        <div class="grid grid-cols-1 gap-3">
          <div><label class="text-[11px] font-semibold">Asal Sekolah</label><input id="akun_asal_sekolah" class="input-field" placeholder="SDN 134 Kalumpang" value="${g.asal_sekolah||'SDN 134 Kalumpang'}" ${disabled}></div>
          <div><label class="text-[11px] font-semibold">NIP Guru</label><input id="akun_nip_guru" class="input-field" placeholder="198012012010011001" value="${g.nip_guru||this._currentDoc.nip||''}" ${disabled}></div>
          <div class="grid grid-cols-2 gap-3"><div><label class="text-[11px] font-semibold">Nama Kepsek</label><input id="akun_nama_kepsek" class="input-field" placeholder="Satia, S.Pd" value="${g.nama_kepsek||''}" ${disabled}></div><div><label class="text-[11px] font-semibold">NIP Kepsek</label><input id="akun_nip_kepsek" class="input-field" placeholder="197505102005011002" value="${g.nip_kepsek||''}" ${disabled}></div></div>
          <div><label class="text-[11px] font-semibold">No HP</label><input id="akun_no_hp" class="input-field" placeholder="081234567890" value="${g.no_hp||profil.no_hp||''}" ${disabled}></div>
        </div>`;
    } else if(role === 'siswa' || role === 'peserta_didik'){
      const s = profil.siswa || profil || {};
      html += `
        <div class="grid grid-cols-1 gap-3">
          <div><label class="text-[11px] font-semibold">Nama Ibu</label><input id="akun_nama_ibu" class="input-field" placeholder="Nama Ibu Kandung" value="${s.nama_ibu||''}" ${disabled}></div>
          <div><label class="text-[11px] font-semibold">Nama Bapak</label><input id="akun_nama_bapak" class="input-field" placeholder="Nama Bapak Kandung" value="${s.nama_bapak||''}" ${disabled}></div>
          <div><label class="text-[11px] font-semibold">No HP Wali</label><input id="akun_no_hp_wali" class="input-field" placeholder="081234567890" value="${s.no_hp||profil.no_hp||''}" ${disabled}></div>
        </div>`;
    } else if(role === 'ortu' || role === 'orang_tua'){
      const o = profil.ortu || profil || {};
      html += `
        <div class="grid grid-cols-1 gap-3">
          <div><label class="text-[11px] font-semibold">Nama Anak</label><input id="akun_nama_anak" class="input-field" placeholder="Nama anak di SDN 134" value="${o.nama_anak||''}" ${disabled}></div>
          <div><label class="text-[11px] font-semibold">Kelas Anak</label><input id="akun_kelas_anak" class="input-field" placeholder="Kelas 1" value="${o.kelas_anak||''}" ${disabled}></div>
          <div><label class="text-[11px] font-semibold">No HP Orang Tua</label><input id="akun_no_hp_ortu" class="input-field" placeholder="081234567890" value="${o.no_hp||profil.no_hp||''}" ${disabled}></div>
        </div>`;
    } else {
      html += `<div class="text-[11px] text-black/50">Role ${role} belum ada form khusus.</div>`;
    }

    html += `<div class="mt-4 flex gap-2"><button id="btnSimpanAkun" class="h-[42px] px-5 rounded-xl bg-[#ffcc00] font-bold text-[12px] ${this._isEdit?'':'opacity-50 pointer-events-none'}">💾 Simpan ke Firestore</button><span id="akunSaveStatus" class="text-[11px] self-center"></span></div>`;

    container.innerHTML = html;

    // Bind
    const btnEdit = document.getElementById('btnEditAkun');
    if(btnEdit) btnEdit.onclick = () => { this._isEdit = !this._isEdit; this.load(); };
    const btnSimpan = document.getElementById('btnSimpanAkun');
    if(btnSimpan) btnSimpan.onclick = () => this.simpan();
  },

  async simpan(){
    if(!this._currentDoc) return alert('Data user tidak ditemukan');
    const status = document.getElementById('akunSaveStatus');
    if(status) status.textContent = '⏳ Menyimpan...';

    const role = (this._currentDoc.role||'').toLowerCase();
    let profil = this._currentDoc.profil || {};
    if(!profil.guru) profil.guru = {};
    if(!profil.siswa) profil.siswa = {};
    if(!profil.ortu) profil.ortu = {};

    if(['guru','kepsek','admin','super_admin'].includes(role)){
      profil.guru.asal_sekolah = document.getElementById('akun_asal_sekolah')?.value.trim()||'SDN 134 Kalumpang';
      profil.guru.nip_guru = document.getElementById('akun_nip_guru')?.value.trim()||'';
      profil.guru.nama_kepsek = document.getElementById('akun_nama_kepsek')?.value.trim()||'';
      profil.guru.nip_kepsek = document.getElementById('akun_nip_kepsek')?.value.trim()||'';
      profil.guru.no_hp = document.getElementById('akun_no_hp')?.value.trim()||'';
      profil.no_hp = profil.guru.no_hp;
    } else if(['siswa','peserta_didik'].includes(role)){
      profil.siswa.nama_ibu = document.getElementById('akun_nama_ibu')?.value.trim()||'';
      profil.siswa.nama_bapak = document.getElementById('akun_nama_bapak')?.value.trim()||'';
      profil.siswa.no_hp = document.getElementById('akun_no_hp_wali')?.value.trim()||'';
      profil.no_hp = profil.siswa.no_hp;
    } else if(['ortu','orang_tua'].includes(role)){
      profil.ortu.nama_anak = document.getElementById('akun_nama_anak')?.value.trim()||'';
      profil.ortu.kelas_anak = document.getElementById('akun_kelas_anak')?.value.trim()||'';
      profil.ortu.no_hp = document.getElementById('akun_no_hp_ortu')?.value.trim()||'';
      profil.no_hp = profil.ortu.no_hp;
    }

    const fid = this._currentDoc.firestore_id || this._currentDoc.id;
    if(!fid){
      if(status) status.textContent = '❌ Firestore ID tidak ada';
      return;
    }

    try{
      if(!window.FirebaseService || !FirebaseService.isEnabled()){
        if(status) status.textContent = '❌ Firestore belum siap';
        return;
      }
      await FirebaseService.update('users_db', fid, { profil, nip: profil.guru?.nip_guru||'', asal_sekolah: profil.guru?.asal_sekolah||'', nama_kepsek: profil.guru?.nama_kepsek||'', nip_kepsek: profil.guru?.nip_kepsek||'', no_hp: profil.no_hp||'', updated_at: new Date().toISOString(), updated_by: localStorage.getItem('userEmail')||'self' });

      // Update local cache users_db_v2
      try{
        const list = JSON.parse(localStorage.getItem('users_db_v2')||'[]');
        const idx = list.findIndex(x=> (x.firestore_id||x.id)===fid || x.email===this._currentDoc.email);
        if(idx>=0){ list[idx].profil = profil; localStorage.setItem('users_db_v2', JSON.stringify(list)); }
      }catch(e){}

      if(status){ status.textContent = '✅ Tersimpan di Firestore: schools/40312947/users_db/'+fid.slice(0,6); status.style.color = '#16a34a'; }
      this._isEdit = false;
      setTimeout(()=> this.load(), 800);
    }catch(err){
      console.error(err);
      if(status){ status.textContent = '❌ Gagal: '+err.message; status.style.color = '#dc2626'; }
    }
  }
};
