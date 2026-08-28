// js/pengaturan/features/user-management.js - MANDIRI - User Management + Hak Akses Sub Fitur + Firestore Direct + Default Password - Taat v3
// Update sesuai 3 poin Arfah: 1. Simpan langsung Firestore 2. Ceklis sub fitur langsung (bukan fitur utama) 3. Password default hedisuriadi

window.UserManagementFeature = {
  // Render checkbox berdasarkan SUB FITUR langsung (18 Administrasi Guru + 4 E-Dokumen + 5 Data Statistik + 8 Master Data + dll)
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
  
  load(){
    const users = ServiceMenu.getUsers();
    const tbody = document.getElementById('userTableBody');
    if(!tbody) return;
    tbody.innerHTML='';
    users.forEach(u=>{
      const permCount = u.permissions ? u.permissions.length : 0;
      const permPreview = u.permissions ? u.permissions.slice(0,3).map(p=> p.includes(':') ? p.split(':')[1] : p).join(', ') + (permCount>3 ? ' +'+(permCount-3) : '') : '-';
      tbody.innerHTML+=`<tr class="border-b border-[#f1f5f9]"><td class="py-3"><div class="flex items-center gap-2"><div class="w-8 h-8 rounded-full bg-[#0d3b66] text-white flex items-center justify-center text-[11px] font-bold">${u.inisial||u.nama.charAt(0)}</div><div><div class="font-semibold text-[13px]">${u.nama}</div><div class="text-[11px] text-black/50">${u.email}</div><div class="text-[10px] text-black/40">${u.jabatan||''} • Pass: ${u.password?'***': 'hedisuriadi'}</div></div></div></td><td class="py-3 text-[12px]">${u.role}<br><span class="text-[10px] bg-[#f1f5f9] px-1 rounded" title="${(u.permissions||[]).join(', ')}">${permCount} sub fitur</span><div class="text-[9px] text-black/40 mt-1">${permPreview}</div></td><td class="py-3"><span class="px-2 py-1 rounded-full text-[11px] font-bold ${u.status==='Hadir'?'badge-hadir':u.status==='Izin'?'badge-izin':'badge-online'}">${u.status||'Online'}</span></td><td class="py-3"><button onclick="UserManagementFeature.hapus('${u.id}')" class="text-[11px] text-red-500 hover:underline">Hapus</button></td></tr>`;
    });
  },
  
  hapus(id){
    if(confirm('Hapus user ini? Data akan dihapus dari localStorage & Firestore schools/40312947/users_db')){
      ServiceMenu.deleteUser(id);
      this.load();
      if(window.FirebaseService && FirebaseService.isEnabled()){
        FirebaseService.delete('users_db', id, id);
        FirebaseService.delete('users', id, id);
      }
    }
  },
  
  initForm(){
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
      
      if(permissions.length===0){ alert('Pilih minimal 1 hak akses SUB FITUR! (contoh: Kisi-kisi Soal, Arsip, Data Peserta Didik)'); return; }
      if(!email.includes('@')){ alert('Email tidak valid! Email sebagai username login'); return; }
      
      const defaultPassword = 'hedisuriadi';
      const newUser = { 
        nama, 
        email, 
        role, 
        jabatan, 
        permissions, 
        password: defaultPassword,
        password_plain: defaultPassword,
        created_at: new Date().toISOString(),
        created_by: ServiceMenu.getCurrentUser ? ServiceMenu.getCurrentUser().email : 'admin'
      };
      
      ServiceMenu.addUser(newUser);
      
      if(window.FirebaseService && FirebaseService.isEnabled()){
        try{
          const saved = await FirebaseService.add('users_db', newUser);
          await FirebaseService.add('users', newUser);
          console.log('✅ User tersimpan Firestore:', saved);
        }catch(err){
          console.error('Gagal simpan Firestore users_db:', err);
          alert('User tersimpan local, tapi gagal Firestore: '+err.message+'\nCek Rules Firestore.');
        }
      }
      
      e.target.reset();
      this.renderPermissionCheckboxes('permCheckboxes');
      this.load();
      alert('✅ User '+nama+' berhasil dibuat!\n\nEmail (username): '+email+'\nPassword default: '+defaultPassword+'\n\nHak akses: '+permissions.length+' sub fitur\n'+permissions.slice(0,5).map(p=> p.includes(':') ? p.split(':')[1] : p).join(', ')+(permissions.length>5?' ...':'')+'\n\n⚠️ Langsung tersimpan ke Firestore schools/40312947/users_db');
    };
  }
};

if(typeof window !== 'undefined'){
  window.UserManagementFeature = window.UserManagementFeature;
}
