// js/pengaturan/features/user-management.js - FIRESTORE ONLY - TANPA LOCALSTORAGE - Taat v3 + Poin 10
// Penyimpanan hanya ke Firestore schools/40312947/users_db agar terpadu di semua device
// Tidak pakai ServiceMenu._getUsers/_saveUsers/addUser (localStorage users_db_v2) lagi
// Password default hedisuriadi + Hak akses sub fitur langsung (43 sub fitur)

window.UserManagementFeature = {
  _cache: [], // cache users dari Firestore
  _listener: null,

  renderPermissionCheckboxes(containerId, selected=[]){
    const container = document.getElementById(containerId);
    if(!container) return;
    container.innerHTML='';
    const features = ServiceMenu.getFeatures ? ServiceMenu.getFeatures() : (window.ALL_FEATURES || []);
    const iconMap = {
      'Kisi-kisi Soal':'📝','Pembuat Soal':'🛠️','Bank Soal':'🏦','RPM':'📄','Bank RPM':'🏦','LCKH':'📘','LKPD':'📗','Analisis KKTP':'📊','Refleksi':'🪞','Jurnal':'📓','Penilaian':'⭐','Absensi':'🕒','Generate CP-TP-ATP':'⚙️','Prosem':'🗓️','Prota':'📅','Rumus 8-3-3-4':'🧮','Kalender Pendidikan':'📆','Jadwal Pembelajaran':'🕘',
      'Arsip':'📁','Upload File':'📤','Laporan':'📋','DLL':'📦',
      'Kop Administrasi':'📄','Data Peserta Didik':'🎓','Sarana':'🏫','Data TP':'🎯','Data CP':'📘','Data ATP':'📗','Data Mapel':'📚','Coming Soon':'🚧',
      'Statistik GTK':'👩‍🏫','Monitoring':'📈','Bantuan AI':'🤖','Demografi Sekolah':'🏫','Statistik Peserta Didik':'🎓'
    };
    let html = '';
    features.forEach(feat=>{
      if(!feat.sub || !feat.sub.length) {
        const checked = selected.includes(feat.id) ? 'checked' : '';
        html += `<label class="flex items-center gap-2 p-2 rounded-lg hover:bg-[#f7f9fc] cursor-pointer"><input type="checkbox" value="${feat.id}" ${checked} class="perm-check w-4 h-4 rounded"><span class="text-[12px]">${feat.icon||'📄'} ${feat.label} (semua)</span></label>`;
        return;
      }
      html += `<div class="col-span-2 md:col-span-3 mt-2 mb-1"><div class="text-[11px] font-bold text-[#0d3b66] bg-[#f1f5f9] px-2 py-1 rounded">${feat.icon||'📂'} ${feat.label} - ${feat.sub.length} sub fitur</div></div>`;
      feat.sub.forEach(sub=>{
        const slug = feat.id + ':' + sub.toLowerCase().replace(/[^a-z0-9]+/g,'_');
        const checked = selected.includes(slug) || selected.includes(sub) || selected.includes(feat.id) ? 'checked' : '';
        const ic = iconMap[sub] || '📄';
        html += `<label class="flex items-center gap-2 p-2 rounded-lg hover:bg-[#f7f9fc] cursor-pointer"><input type="checkbox" value="${slug}" data-parent="${feat.id}" data-sub="${sub}" ${checked} class="perm-check w-4 h-4 rounded"><span class="text-[11px]">${ic} ${sub}</span></label>`;
      });
    });
    html = `<div class="col-span-2 md:col-span-3 flex justify-between items-center mb-2"><span class="text-[10px] text-black/50">${features.reduce((a,f)=>a+(f.sub?f.sub.length:1),0)} total sub fitur - Firestore only</span><div class="flex gap-2"><button type="button" onclick="document.querySelectorAll('#${containerId} .perm-check').forEach(c=>c.checked=true)" class="text-[10px] bg-[#0d3b66] text-white px-2 py-1 rounded">Pilih Semua</button><button type="button" onclick="document.querySelectorAll('#${containerId} .perm-check').forEach(c=>c.checked=false)" class="text-[10px] bg-[#f1f5f9] px-2 py-1 rounded">Kosongkan</button></div></div>` + html;
    container.innerHTML = html;
  },

  // Render dari cache Firestore only
  _renderTable(){
    const tbody = document.getElementById('userTableBody');
    if(!tbody) return;
    tbody.innerHTML='';
    const users = this._cache;
    if(!users || users.length===0){
      tbody.innerHTML = '<tr><td colspan="4" class="py-6 text-center text-[12px] text-black/50">🔥 Firestore: schools/40312947/users_db<br>Belum ada data user atau Firestore belum konek<br><span class="text-[10px]">Cek Rules: allow read, write: if true;</span></td></tr>';
      return;
    }
    users.forEach(u=>{
      const permCount = u.permissions ? u.permissions.length : 0;
      const permPreview = u.permissions ? u.permissions.slice(0,3).map(p=> p.includes(':') ? p.split(':')[1] : p).join(', ') + (permCount>3 ? ' +'+(permCount-3) : '') : '-';
      const fid = u.firestore_id || u.id;
      tbody.innerHTML+=`<tr class="border-b border-[#f1f5f9] hover:bg-[#f8fafc]">
        <td class="py-3"><div class="flex items-center gap-2"><div class="w-8 h-8 rounded-full bg-[#0d3b66] text-white flex items-center justify-center text-[11px] font-bold">${u.inisial||(u.nama||'U').charAt(0)}</div><div><div class="font-semibold text-[13px]">${u.nama||''}</div><div class="text-[11px] text-black/50">${u.email||''}</div><div class="text-[10px] text-black/40">${u.jabatan||''} • Pass: *** • Firestore: ${fid.slice(0,6)}...</div></div></div></td>
        <td class="py-3 text-[12px]"><span class="capitalize">${u.role||''}</span><br><span class="text-[10px] bg-[#f1f5f9] px-1.5 py-0.5 rounded">${permCount} sub fitur</span><div class="text-[9px] text-black/40 mt-1 truncate max-w-[150px]">${permPreview}</div></td>
        <td class="py-3"><span class="px-2 py-1 rounded-full text-[11px] font-bold bg-green-100 text-green-700">${u.status||'Hadir'}</span><div class="text-[8px] text-black/30 mt-1">Firestore</div></td>
        <td class="py-3"><div class="flex gap-2"><button onclick="UserManagementFeature.bukaEditUser('${fid}')" class="text-[11px] text-blue-600 hover:underline font-semibold">Edit</button><button onclick="UserManagementFeature.hapus('${fid}')" class="text-[11px] text-red-500 hover:underline font-semibold">Hapus</button></div></td>
      </tr>`;
    });
  },

  async load(){
    const tbody = document.getElementById('userTableBody');
    if(tbody) tbody.innerHTML = '<tr><td colspan="4" class="py-4 text-center text-[11px]">🔄 Memuat dari Firestore schools/40312947/users_db...</td></tr>';
    
    if(!window.FirebaseService || !FirebaseService.isEnabled()){
      if(tbody) tbody.innerHTML = '<tr><td colspan="4" class="py-4 text-center text-[11px] text-red-500">❌ Firestore belum siap - cek js/firebase-config.js & js/firebase-service.js<br>Path harus: js/firebase-config.js (sesuai gambar repo kamu)</td></tr>';
      return;
    }

    try{
      // Firestore only - tanpa localStorage
      const list = await FirebaseService.getAll('users_db');
      this._cache = list || [];
      this._renderTable();
      console.log(`✅ Load ${this._cache.length} users dari Firestore only`);

      // Setup realtime listener sekali saja agar terpadu di device lain
      if(!this._listener){
        this._listener = FirebaseService.listen('users_db', (liveList)=>{
          this._cache = liveList || [];
          this._renderTable();
          console.log('🔥 Realtime users_db update:', this._cache.length);
        });
      }
    }catch(e){
      console.error('Firestore getAll users_db error:', e);
      if(tbody) tbody.innerHTML = `<tr><td colspan="4" class="py-4 text-center text-[11px] text-red-500">❌ Error Firestore: ${e.message}<br>Cek Rules Firebase</td></tr>`;
    }
  },

  async hapus(fid){
    if(!fid) return alert('ID tidak valid');
    if(!confirm('Hapus user ini permanen dari Firestore schools/40312947/users_db?\nData akan hilang di semua device.')) return;
    if(!window.FirebaseService || !FirebaseService.isEnabled()) return alert('Firestore belum siap');
    try{
      await FirebaseService.delete('users_db', fid, fid);
      // Cache akan update via realtime listener, tapi update manual juga
      this._cache = this._cache.filter(u=> (u.firestore_id||u.id) !== fid && u.id !== fid);
      this._renderTable();
      alert('✅ User berhasil dihapus dari Firestore');
    }catch(err){
      console.error('Gagal hapus:', err);
      alert('❌ Gagal hapus: '+err.message);
    }
  },

  bukaEditUser(fid){
    if(!fid) return alert('ID tidak valid');
    const user = this._cache.find(u=> (u.firestore_id||u.id) === fid || u.id === fid || u.email === fid);
    if(!user){ return alert('User tidak ditemukan di Firestore. Silakan refresh halaman.\nID: '+fid+'\nCache: '+this._cache.length+' users'); }
    this._fillEditForm(user);
  },

  _fillEditForm(user){
    document.getElementById('newNama').value = user.nama || '';
    document.getElementById('newEmail').value = user.email || '';
    document.getElementById('newRole').value = user.role || 'guru';
    document.getElementById('newJabatan').value = user.jabatan || '';
    this.renderPermissionCheckboxes('permCheckboxes', user.permissions || []);
    const form = document.getElementById('formTambahUser');
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.textContent = '💾 Simpan Perubahan (Firestore)';
    submitBtn.className = 'w-full h-[44px] rounded-xl bg-[#0d3b66] text-white font-bold text-[12px]';
    form.dataset.editId = user.firestore_id || user.id;
    // Tombol batal
    if(!document.getElementById('btnBatalEdit')){
      const cancel = document.createElement('button');
      cancel.id = 'btnBatalEdit';
      cancel.type = 'button';
      cancel.textContent = 'Batal Edit';
      cancel.className = 'w-full h-[36px] rounded-xl bg-[#f1f5f9] text-[12px] mt-2';
      cancel.onclick = ()=> this.batalEdit();
      form.appendChild(cancel);
    }
    form.scrollIntoView({ behavior: 'smooth', block: 'center' });
  },

  batalEdit(){
    const form = document.getElementById('formTambahUser');
    form.reset();
    form.removeAttribute('data-edit-id');
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.textContent = '+ Buat User dengan Hak Akses (Firestore)';
    submitBtn.className = 'w-full h-[44px] rounded-xl bg-[#ffcc00] font-bold text-[12px] text-[#0d3b66]';
    const batal = document.getElementById('btnBatalEdit');
    if(batal) batal.remove();
    this.renderPermissionCheckboxes('permCheckboxes');
  },

  async initForm(){
    this.renderPermissionCheckboxes('permCheckboxes');
    const form = document.getElementById('formTambahUser');
    if(!form) return;
    if(form.dataset.bound) return; // prevent double bind
    form.dataset.bound = '1';
    
    form.onsubmit= async (e)=>{
      e.preventDefault();
      const nama=document.getElementById('newNama').value.trim();
      const email=document.getElementById('newEmail').value.trim();
      const role=document.getElementById('newRole').value;
      const jabatan=document.getElementById('newJabatan').value.trim();
      const checks=document.querySelectorAll('#permCheckboxes .perm-check:checked');
      const permissions=Array.from(checks).map(c=>c.value);
      
      if(permissions.length===0){ alert('Pilih minimal 1 hak akses SUB FITUR!'); return; }
      if(!email.includes('@')){ alert('Email tidak valid!'); return; }
      if(!window.FirebaseService || !FirebaseService.isEnabled()){ alert('Firestore belum siap - cek js/firebase-config.js'); return; }

      const editId = form.dataset.editId;
      const defaultPassword = 'hedisuriadi';

      try{
        if(editId){
          // MODE EDIT - Firestore only
          const existing = this._cache.find(u=> (u.firestore_id||u.id) === editId);
          const updateData = { nama, email, role, jabatan, permissions, updated_at: new Date().toISOString(), updated_by: localStorage.getItem('userEmail')||'admin' };
          await FirebaseService.update('users_db', editId, updateData);
          alert('✅ Data user '+nama+' berhasil diupdate di Firestore!\nTerpadu di semua device.');
          this.batalEdit();
        } else {
          // MODE CREATE - Firestore only, tanpa localStorage
          const newUser = { 
            nama, email, role, jabatan, permissions, 
            password: defaultPassword, password_plain: defaultPassword,
            inisial: nama.substring(0,2).toUpperCase(),
            status: 'Hadir', created_at: new Date().toISOString(),
            created_by: localStorage.getItem('userEmail')||'admin',
            updated_at: new Date().toISOString()
          };
          // Hanya ke Firestore - TIDAK pakai ServiceMenu.addUser (localStorage)
          const saved = await FirebaseService.add('users_db', newUser);
          console.log('✅ User baru Firestore only:', saved);
          e.target.reset();
          this.renderPermissionCheckboxes('permCheckboxes');
          alert('✅ User '+nama+' berhasil dibuat Firestore only!\n\nEmail: '+email+'\nPassword default: '+defaultPassword+'\nHak akses: '+permissions.length+' sub fitur\n\n🔥 Tersimpan di: schools/40312947/users_db\nTerpadu di semua device - tanpa localStorage');
        }
        // Realtime listener akan auto refresh table
      }catch(err){
        console.error('Error Firestore:', err);
        alert('❌ Gagal menyimpan ke Firestore: '+err.message+'\nCek Rules: allow read, write: if true;');
      }
    };
  }
};

if(typeof window !== 'undefined'){
  window.UserManagementFeature = window.UserManagementFeature;
}
