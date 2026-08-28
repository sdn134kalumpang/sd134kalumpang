// js/pengaturan/features/user-management.js - MANDIRI - User Management + Hak Akses - Taat v3

window.UserManagementFeature = {
  renderPermissionCheckboxes(containerId, selected=[]){
    const container = document.getElementById(containerId);
    if(!container) return;
    container.innerHTML='';
    const features = ServiceMenu.getFeatures ? ServiceMenu.getFeatures() : (window.ALL_FEATURES || []);
    features.forEach(f=>{
      const checked=selected.includes(f.id)?'checked':'';
      container.innerHTML+=`<label class="flex items-center gap-2 p-2 rounded-lg hover:bg-[#f7f9fc] cursor-pointer border border-transparent hover:border-[#e8eef6]"><input type="checkbox" value="${f.id}" ${checked} class="perm-check w-4 h-4 rounded"><span class="text-[12px]">${f.icon} ${f.label}</span></label>`;
    });
  },
  load(){
    const users = ServiceMenu.getUsers();
    const tbody = document.getElementById('userTableBody');
    if(!tbody) return;
    tbody.innerHTML='';
    users.forEach(u=>{
      const permCount = u.permissions ? u.permissions.length : 0;
      tbody.innerHTML+=`<tr class="border-b border-[#f1f5f9]"><td class="py-3"><div class="flex items-center gap-2"><div class="w-8 h-8 rounded-full bg-[#0d3b66] text-white flex items-center justify-center text-[11px] font-bold">${u.inisial||u.nama.charAt(0)}</div><div><div class="font-semibold text-[13px]">${u.nama}</div><div class="text-[11px] text-black/50">${u.email}</div><div class="text-[10px] text-black/40">${u.jabatan||''}</div></div></div></td><td class="py-3 text-[12px]">${u.role}<br><span class="text-[10px] bg-[#f1f5f9] px-1 rounded">${permCount} fitur</span></td><td class="py-3"><span class="px-2 py-1 rounded-full text-[11px] font-bold ${u.status==='Hadir'?'badge-hadir':u.status==='Izin'?'badge-izin':'badge-online'}">${u.status||'Online'}</span></td><td class="py-3"><button onclick="UserManagementFeature.hapus(${u.id})" class="text-[11px] text-red-500 hover:underline">Hapus</button></td></tr>`;
    });
  },
  hapus(id){
    if(confirm('Hapus user ini?')){
      ServiceMenu.deleteUser(id);
      this.load();
      if(window.FirebaseService && FirebaseService.isEnabled()){
        FirebaseService.delete('users_db', id, id);
      }
    }
  },
  initForm(){
    this.renderPermissionCheckboxes('permCheckboxes');
    const form = document.getElementById('formTambahUser');
    if(!form) return;
    form.onsubmit=(e)=>{
      e.preventDefault();
      const nama=document.getElementById('newNama').value;
      const email=document.getElementById('newEmail').value;
      const role=document.getElementById('newRole').value;
      const jabatan=document.getElementById('newJabatan').value;
      const checks=document.querySelectorAll('#permCheckboxes .perm-check:checked');
      const permissions=Array.from(checks).map(c=>c.value);
      if(permissions.length===0){ alert('Pilih minimal 1 hak akses fitur!'); return; }
      if(!email.includes('@')){ alert('Email tidak valid!'); return; }
      ServiceMenu.addUser({ nama, email, role, jabatan, permissions });
      if(window.FirebaseService && FirebaseService.isEnabled()){
        FirebaseService.add('users_db', { nama, email, role, jabatan, permissions });
      }
      e.target.reset();
      this.renderPermissionCheckboxes('permCheckboxes');
      this.load();
      alert('User '+nama+' berhasil dibuat!\nLogin pakai Email: '+email);
    };
  }
};
