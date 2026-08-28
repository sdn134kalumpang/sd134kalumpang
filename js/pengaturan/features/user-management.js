// js/pengaturan/features/user-management.js - MANDIRI - User Management + Hak Akses Sub Fitur + Firestore Direct - Taat v3

window.UserManagementFeature = {
  
  _usersCache: [],
  
  renderPermissionCheckboxes(containerId, selected=[]){
    const container = document.getElementById(containerId);
    if(!container) return;
    container.innerHTML='';
    
    const features = ServiceMenu.getFeatures ? ServiceMenu.getFeatures() : (window.ALL_FEATURES || []);
    const iconMap = {
      'Kisi-kisi Soal':'','Pembuat Soal':'🛠️','Bank Soal':'🏦','RPM':'','Bank RPM':'🏦','LCKH':'📘','LKPD':'📗','Analisis KKTP':'📊','Refleksi':'🪞','Jurnal':'📓','Penilaian':'⭐','Absensi':'🕒','Generate CP-TP-ATP':'️','Prosem':'🗓️','Prota':'📅','Rumus 8-3-3-4':'🧮','Kalender Pendidikan':'','Jadwal Pembelajaran':'🕘',
      'Arsip':'📁','Upload File':'📤','Laporan':'📋','DLL':'📦',
      'Kop Administrasi':'📄','Data Peserta Didik':'','Sarana':'🏫','Data TP':'','Data CP':'📘','Data ATP':'📗','Data Mapel':'📚','Coming Soon':'🚧',
      'Statistik GTK':'👩‍','Monitoring':'','Bantuan AI':'🤖','Demografi Sekolah':'🏫','Statistik Peserta Didik':'🎓'
    };
    
    let html = '';
    features.forEach(feat=>{
      if(!feat.sub || !feat.sub.length) {
        const checked = selected.includes(feat.id) ? 'checked' : '';
        html += `<label class="flex items-center gap-2 p-2 rounded-lg hover:bg-[#f7f9fc] cursor-pointer border border-transparent hover:border-[#e8eef6]"><input type="checkbox" value="${feat.id}" ${checked} class="perm-check w-4 h-4 rounded"><span class="text-[12px]">${feat.icon||'📄'} ${feat.label} (semua)</span></label>`;
        return;
      }
      html += `<div class="col-span-2 md:col-span-3 mt-2 mb-1"><div class="text-[11px] font-bold text-[#0d3b66] bg-[#f1f5f9] px-2 py-1 rounded">${feat.icon||'📂'} ${feat.label} - ${feat.sub.length} sub fitur</div></div>`;
      feat.sub.forEach(sub=>{
        const slug = feat.id + ':' + sub.toLowerCase().replace(/[^a-z0-9]+/g,'_');
        const checked = selected.includes(slug) || selected.includes(sub) || selected.includes(feat.id) ? 'checked' : '';
        const ic = iconMap[sub] || '📄';
        html += `<label class="flex items-center gap-2 p-2 rounded-lg hover:bg-[#f7f9fc] cursor-pointer border border-transparent hover:border-[#e8eef6]"><input type="checkbox" value="${slug}" data-parent="${feat.id}" data-sub="${sub}" ${checked} class="perm-check w-4 h-4 rounded"><span class="text-[11px]">${ic} ${sub}</span></label>`;
      });
    });
    
    html = `<div class="col-span-2 md:col-span-3 flex justify-between items-center mb-2"><span class="text-[10px] text-black/50">${features.reduce((a,f)=>a+(f.sub?f.sub.length:1),0)} total sub fitur - ceklis langsung sub fitur</span><div class="flex gap-2"><button type="button" onclick="document.querySelectorAll('#${containerId} .perm-check').forEach(c=>c.checked=true)" class="text-[10px] bg-[#0d3b66] text-white px-2 py-1 rounded">Pilih Semua</button><button type="button" onclick="document.querySelectorAll('#${containerId} .perm-check').forEach(c=>c.checked=false)" class="text-[10px] bg-[#f1f5f9] px-2 py-1 rounded">Kosongkan</button></div></div>` + html;
    
    container.innerHTML = html;
  },
  
  async load(){
    const tbody = document.getElementById('userTableBody');
    if(!tbody) return;
    
    if(!window.FirebaseService || !FirebaseService.isEnabled()){
      tbody.innerHTML = '<tr><td colspan="4" class="py-4 text-center text-[12px] text-red-500">Firebase tidak aktif</td></tr>';
      return;
    }
    
    try{
      tbody.innerHTML = '<tr><td colspan="4" class="py-4 text-center text-[12px] text-black/50">Memuat data...</td></tr>';
      
      const users = await FirebaseService.get('schools/40312947/users_db');
      this._usersCache = users || [];
      
      if(!users || users.length === 0){
        tbody.innerHTML = '<tr><td colspan="4" class="py-4 text-center text-[12px] text-black/50">Belum ada data user</td></tr>';
        return;
      }
      
      tbody.innerHTML='';
      users.forEach((u)=>{
        if(!u.id){
          u.id = FirebaseService.generateId();
        }
        
        const permCount = u.permissions ? u.permissions.length : 0;
        const permPreview = u.permissions ? u.permissions.slice(0,3).map(p=> p.includes(':') ? p.split(':')[1] : p).join(', ') + (permCount>3 ? ' +'+(permCount-3) : '') : '-';
        
        tbody.innerHTML+=`<tr class="border-b border-[#f1f5f9] hover:bg-[#f8fafc] transition">
          <td class="py-3"><div class="flex items-center gap-2"><div class="w-8 h-8 rounded-full bg-[#0d3b66] text-white flex items-center justify-center text-[11px] font-bold shrink-0">${u.inisial||u.nama.charAt(0)}</div><div><div class="font-semibold text-[13px]">${u.nama}</div><div class="text-[11px] text-black/50">${u.email}</div><div class="text-[10px] text-black/40">${u.jabatan||''} • Pass: ${u.password?'***': 'hedisuriadi'}</div></div></div></td>
          <td class="py-3 text-[12px]"><span class="capitalize">${u.role}</span><br><span class="text-[10px] bg-[#f1f5f9] px-1.5 py-0.5 rounded" title="${(u.permissions||[]).join(', ')}">${permCount} sub fitur</span><div class="text-[9px] text-black/40 mt-1 truncate max-w-[150px]">${permPreview}</div></td>
          <td class="py-3"><span class="px-2 py-1 rounded-full text-[11px] font-bold ${u.status==='Hadir'?'bg-green-100 text-green-700':u.status==='Izin'?'bg-yellow-100 text-yellow-700':'bg-blue-100 text-blue-700'}">${u.status||'Online'}</span></td>
          <td class="py-3"><div class="flex gap-2"><button onclick="UserManagementFeature.bukaEditUser('${u.id}')" class="text-[11px] text-blue-600 hover:text-blue-800 hover:underline font-semibold">Edit</button><button onclick="UserManagementFeature.hapus('${u.id}')" class="text-[11px] text-red-500 hover:text-red-700 hover:underline font-semibold">Hapus</button></div></td>
        </tr>`;
      });
    }catch(err){
      console.error('Gagal load users dari Firestore:', err);
      tbody.innerHTML = '<tr><td colspan="4" class="py-4 text-center text-[12px] text-red-500">Gagal memuat data: '+err.message+'</td></tr>';
    }
  },
  
  async hapus(id){
    if(confirm('Hapus user ini? Data akan dihapus permanen dari Firestore')){
      try{
        await FirebaseService.delete('schools/40312947/users_db', id);
        await this.load();
        alert('✅ User berhasil dihapus dari Firestore');
      }catch(err){
        console.error('Gagal hapus dari Firestore:', err);
        alert('❌ Gagal hapus user: '+err.message);
      }
    }
  },

  bukaEditUser(id){
    if(!id){
      console.error('ID user kosong!');
      return alert('Error: ID user tidak valid');
    }
    
    const user = this._usersCache.find(u => u.id === id);
    
    if(!user){
      console.error('User tidak ditemukan dengan ID:', id, 'Cache:', this._usersCache);
      return alert('User tidak ditemukan. Silakan refresh halaman.');
    }
    
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
    submitBtn.textContent = '💾 Simpan Perubahan User';
    submitBtn.className = 'w-full h-[44px] rounded-xl bg-[#0d3b66] text-white font-bold text-[12px]';
    form.dataset.editId = user.id;
    
    form.scrollIntoView({ behavior: 'smooth', block: 'center' });
  },

  batalEdit(){
    const form = document.getElementById('formTambahUser');
    form.reset();
    form.removeAttribute('data-edit-id');
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.textContent = '+ Buat User dengan Hak Akses';
    submitBtn.className = 'w-full h-[44px] rounded-xl bg-[#ffcc00] font-bold text-[12px] text-[#0d3b66]';
    this.renderPermissionCheckboxes('permCheckboxes');
  },
  
  async initForm(){
    this.renderPermissionCheckboxes('permCheckboxes');
    const form = document.getElementById('formTambahUser');
    if(!form) return;
    
    form.onsubmit= async (e)=>{
      e.preventDefault();
      const nama=document.getElementById('newNama').value.trim();
      const email=document.getElementById('newEmail').value.trim();
      const role=document.getElementById('newRole').value;
      const jabatan=document.getElementById('newJabatan').value.trim();
      const checks=document.querySelectorAll('#permCheckboxes .perm-check:checked');
      const permissions=Array.from(checks).map(c=>c.value);
      
      if(permissions.length===0){ alert('Pilih minimal 1 hak akses SUB FITUR!'); return; }
      if(!email.includes('@')){ alert('Email tidak valid! Email sebagai username login'); return; }
      
      const editId = form.dataset.editId;
      const defaultPassword = 'hedisuriadi';

      try{
        if(editId){
          const userDoc = this._usersCache.find(u => u.id === editId);
          if(!userDoc) throw new Error('User tidak ditemukan');
          
          const updatedUser = { 
            ...userDoc, 
            nama, 
            email, 
            role, 
            jabatan, 
            permissions, 
            updated_at: new Date().toISOString(),
            updated_by: ServiceMenu.getCurrentUser ? ServiceMenu.getCurrentUser().email : 'admin'
          };
          
          await FirebaseService.set('schools/40312947/users_db', editId, updatedUser);
          this.batalEdit();
          await this.load();
          alert('✅ Data user '+nama+' berhasil diupdate di Firestore!');
          
        } else {
          const newUserId = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).substr(2);
          const newUser = { 
            id: newUserId, 
            nama, 
            email, 
            role, 
            jabatan, 
            permissions, 
            password: defaultPassword, 
            password_plain: defaultPassword,
            status: 'Online',
            created_at: new Date().toISOString(),
            created_by: ServiceMenu.getCurrentUser ? ServiceMenu.getCurrentUser().email : 'admin'
          };
          
          await FirebaseService.set('schools/40312947/users_db', newUserId, newUser);
          
          e.target.reset();
          this.renderPermissionCheckboxes('permCheckboxes');
          await this.load();
          alert('✅ User '+nama+' berhasil dibuat di Firestore!\n\nEmail: '+email+'\nPassword default: '+defaultPassword+'\nHak akses: '+permissions.length+' sub fitur');
        }
      }catch(err){
        console.error('Error:', err);
        alert('❌ Gagal menyimpan: '+err.message);
      }
    };
  }
};

if(typeof window !== 'undefined'){
  window.UserManagementFeature = window.UserManagementFeature;
}
