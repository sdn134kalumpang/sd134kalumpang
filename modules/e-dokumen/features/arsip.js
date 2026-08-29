/ modules/e-dokumen/features/arsip.js - ARSIP + BASE64 FIRESTORE + OWNER ONLY - Taat v3
// Path repo: sd134kalumpang/modules/e-dokumen/features/arsip.js
// Firestore: schools/40312947/e_dokumen_arsip/{fid}
// Field: judul, kategori, nomor_surat, tanggal_surat, file_url, file_name, file_type, file_size, file_base64 (data URI), keterangan, owner_email, owner_nama, created_at
// Base64: limit Firestore 1MB -> file asli max ~700KB, selebihnya pakai file_url Drive
// Hak akses: e_dokumen:arsip

window.init_arsip = function(container){
  const user = ServiceMenu.getCurrentUser();
  const isAdmin = ServiceMenu.isAdmin();
  const kategoriList = ['Arsip','Surat Masuk','Surat Keluar','SK','Undangan','Laporan','DLL'];

  container.innerHTML = `
  <div class="welcome-banner" style="background:linear-gradient(135deg,#0f172a,#1e3a8a);">
   <div><h1 style="color:white;">📁 Arsip Dokumen - Base64 Firestore</h1><p style="color:rgba(255,255,255,0.7);">Repo: sd134kalumpang/modules/e-dokumen/ • Owner: ${user.email} • ${isAdmin?'Admin lihat semua':'Owner Only'} • Base64 max 700KB</p></div>
   <div class="welcome-actions" style="display:flex;gap:8px;flex-wrap:wrap;">
    <button class="btn" id="btnExportArsip" style="background:white;color:#0d3b66;padding:8px 16px;border-radius:20px;font-size:12px;font-weight:700;">📊 Export XLS</button>
    <button class="btn" id="btnTambahArsip" style="background:#ffcc00;color:#0d3b66;padding:8px 16px;border-radius:20px;font-size:12px;font-weight:700;">+ Tambah Arsip</button>
   </div>
  </div>

  <div class="kpi-grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px;">
   <div class="kpi-card" style="padding:16px;background:white;border-radius:12px;border:1px solid #e8eef6;"><div style="font-size:11px;color:#64748b;">TOTAL ARSIP</div><h3 id="totalArsip" style="font-size:22px;font-weight:800;margin:4px 0;">0</h3><div style="font-size:11px;color:#0d3b66;" id="ownerInfo">Memuat...</div></div>
   <div class="kpi-card" style="padding:16px;background:white;border-radius:12px;border:1px solid #e8eef6;"><div style="font-size:11px;color:#64748b;">BASE64 TERSIMPAN</div><h3 id="totalBase64" style="font-size:22px;font-weight:800;margin:4px 0;">0</h3><div style="font-size:11px;color:#0d3b66;">File <700KB di Firestore</div></div>
   <div class="kpi-card" style="padding:16px;background:white;border-radius:12px;border:1px solid #e8eef6;"><div style="font-size:11px;color:#64748b;">LINK DRIVE</div><h3 id="totalDrive" style="font-size:22px;font-weight:800;margin:4px 0;">0</h3><div style="font-size:11px;color:#0d3b66;">File besar via Drive</div></div>
   <div class="kpi-card" style="padding:16px;background:white;border-radius:12px;border:1px solid #e8eef6;"><div style="font-size:11px;color:#64748b;">SURAT MASUK</div><h3 id="totalMasuk" style="font-size:22px;font-weight:800;margin:4px 0;">0</h3><div style="font-size:11px;color:#0d3b66;">Kategori filter</div></div>
  </div>

  <div class="card" style="background:white;border-radius:12px;border:1px solid #e8eef6;padding:16px;margin-bottom:16px;">
   <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:space-between;align-items:center;">
    <div style="display:flex;gap:8px;flex-wrap:wrap;">
     <input id="searchArsip" placeholder="🔍 Cari judul, nomor..." style="border:1px solid #e2e8f0;border-radius:8px;padding:8px 12px;font-size:12px;min-width:260px;">
     <select id="filterKategori" style="border:1px solid #e2e8f0;border-radius:8px;padding:8px;font-size:12px;"><option value="">Semua Kategori</option>${kategoriList.map(k=>`<option value="${k}">${k}</option>`).join('')}</select>
    </div>
    <div style="font-size:11px;color:#64748b;" id="statusArsip">🔄 Memuat...</div>
   </div>
  </div>

  <div class="two-col" style="display:grid;grid-template-columns:1fr 380px;gap:16px;">
   <div class="card" style="background:white;border-radius:12px;border:1px solid #e8eef6;padding:16px;">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;"><h3 style="font-weight:700;">Daftar Arsip</h3><span style="font-size:11px;color:#64748b;" id="countInfo">0 data</span></div>
    <div style="overflow-x:auto;"><table class="w-full text-left" style="font-size:12px;"><thead style="font-size:11px;color:#94a3b8;"><tr><th style="padding:8px;">Judul / Nomor</th><th>Kategori</th><th>File</th><th>Tanggal</th><th>Aksi</th></tr></thead><tbody id="arsipTableBody"></tbody></table></div>
   </div>
   <div class="card" style="background:white;border-radius:12px;border:1px solid #e8eef6;padding:16px;">
    <h3 id="formTitle" style="font-weight:700;margin-bottom:12px;">+ Tambah Arsip + Base64</h3>
    <div style="display:grid;gap:10px;">
     <div><label style="font-size:11px;font-weight:700;">Judul Dokumen *</label><input id="f_judul" placeholder="SK Pembagian Tugas 2025/2026" style="width:100%;border:1px solid #e2e8f0;border-radius:8px;padding:8px;font-size:12px;"></div>
     <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;"><div><label style="font-size:11px;font-weight:700;">Kategori</label><select id="f_kategori" style="width:100%;border:1px solid #e2e8f0;border-radius:8px;padding:8px;font-size:12px;">${kategoriList.map(k=>`<option value="${k}">${k}</option>`).join('')}</select></div><div><label style="font-size:11px;font-weight:700;">Nomor Surat</label><input id="f_nomor" placeholder="400/001/2025" style="width:100%;border:1px solid #e2e8f0;border-radius:8px;padding:8px;font-size:12px;"></div></div>
     <div><label style="font-size:11px;font-weight:700;">Tanggal Surat</label><input id="f_tanggal" type="date" style="width:100%;border:1px solid #e2e8f0;border-radius:8px;padding:8px;font-size:12px;"></div>
     <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:10px;">
      <label style="font-size:11px;font-weight:700;">📎 Upload File (disimpan Base64 di Firestore, max 700KB)</label>
      <input id="f_file" type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" style="width:100%;margin-top:6px;font-size:11px;">
      <div id="fileInfo" style="font-size:10px;color:#92400e;margin-top:6px;">Belum ada file. Pilih PDF/JPG/PNG <700KB agar tersimpan langsung di Firestore dan bisa dilihat di situs.</div>
      <div id="filePreview" style="margin-top:8px;display:none;"><a id="previewLink" href="#" target="_blank" style="font-size:11px;color:#0d3b66;text-decoration:underline;">👁️ Preview Base64</a> <button id="btnHapusFile" type="button" style="font-size:10px;color:#dc2626;margin-left:8px;">Hapus file</button></div>
     </div>
     <div><label style="font-size:11px;font-weight:700;">Link Drive (opsional, untuk file >700KB)</label><input id="f_file_url" placeholder="https://drive.google.com/..." style="width:100%;border:1px solid #e2e8f0;border-radius:8px;padding:8px;font-size:12px;"></div>
     <div><label style="font-size:11px;font-weight:700;">Keterangan</label><textarea id="f_keterangan" placeholder="Catatan..." style="width:100%;border:1px solid #e2e8f0;border-radius:8px;padding:8px;font-size:12px;min-height:60px;"></textarea></div>
     <div style="display:flex;gap:8px;"><button id="btnSimpanArsip" style="flex:1;background:#0d3b66;color:white;padding:10px;border-radius:8px;font-size:12px;font-weight:700;">💾 Simpan ke Firestore (base64)</button><button id="btnBatalArsip" style="background:#f1f5f9;padding:10px 16px;border-radius:8px;font-size:12px;">Batal</button></div>
     <div style="font-size:10px;color:#64748b;">Path GitHub: sd134kalumpang/modules/e-dokumen/features/arsip.js • Koleksi: schools/40312947/e_dokumen_arsip • Owner: ${user.email}</div>
    </div>
   </div>
  </div>
  `;

  let arsipList = [];
  let filtered = [];
  let pendingBase64 = { data: null, name: null, type: null, size: 0 };

  function renderTable(list){
    const tbody = document.getElementById('arsipTableBody');
    if(!tbody) return;
    if(!list.length){ tbody.innerHTML = `<tr><td colspan="5" style="padding:20px;text-align:center;color:#94a3b8;">Belum ada arsip</td></tr>`; return; }
    tbody.innerHTML = list.map(a=>{
      const fid = a.firestore_id || a.id;
      const tgl = a.tanggal_surat ? new Date(a.tanggal_surat).toLocaleDateString('id-ID') : '-';
      let fileBtn = '';
      if(a.file_base64){ fileBtn = `<a href="${a.file_base64}" target="_blank" style="color:#059669;font-size:11px;font-weight:700;">📦 Base64 (${(a.file_size/1024).toFixed(0)}KB)</a>`; }
      else if(a.file_url){ fileBtn = `<a href="${a.file_url}" target="_blank" style="color:#0d3b66;text-decoration:underline;font-size:11px;">🔗 Drive</a>`; }
      else { fileBtn = `<span style="color:#94a3b8;font-size:11px;">-</span>`; }
      return `<tr style="border-bottom:1px solid #f1f5f9;"><td style="padding:10px;"><div style="font-weight:600;font-size:12px;">${a.judul||''}</div><div style="font-size:11px;color:#64748b;">${a.nomor_surat||''} • ${a.owner_nama||''}</div></td><td><span style="background:#f1f5f9;padding:3px 8px;border-radius:12px;font-size:10px;">${a.kategori||''}</span></td><td>${fileBtn}<div style="font-size:9px;color:#94a3b8;">${a.file_name||''}</div></td><td style="font-size:11px;">${tgl}</td><td><div style="display:flex;gap:6px;"><button onclick="window.editArsip('${fid}')" style="color:#2563eb;font-size:11px;">Edit</button><button onclick="window.hapusArsip('${fid}')" style="color:#dc2626;font-size:11px;">Hapus</button></div></td></tr>`;
    }).join('');
  }

  function updateKPI(){
    document.getElementById('totalArsip').textContent = filtered.length;
    document.getElementById('totalBase64').textContent = filtered.filter(x=> x.file_base64).length;
    document.getElementById('totalDrive').textContent = filtered.filter(x=> x.file_url && !x.file_base64).length;
    document.getElementById('totalMasuk').textContent = filtered.filter(x=> (x.kategori||'').toLowerCase().includes('masuk')).length;
    document.getElementById('countInfo').textContent = filtered.length + ' data';
    document.getElementById('ownerInfo').textContent = isAdmin ? `Admin - semua (${arsipList.length})` : `Owner: ${user.email} - ${filtered.length}`;
  }

  function applyFilter(){
    const q = (document.getElementById('searchArsip').value||'').toLowerCase();
    const kat = document.getElementById('filterKategori').value;
    filtered = arsipList.filter(a=>{
      const matchQ = !q || (a.judul||'').toLowerCase().includes(q) || (a.nomor_surat||'').toLowerCase().includes(q);
      const matchKat = !kat || a.kategori===kat;
      return matchQ && matchKat;
    }).sort((a,b)=> new Date(b.tanggal_surat||b.created_at||0) - new Date(a.tanggal_surat||a.created_at||0));
    renderTable(filtered);
    updateKPI();
  }

  async function loadData(){
    const st = document.getElementById('statusArsip');
    if(st) st.textContent = '🔄 Memuat Firestore...';
    try{
      if(window.FirebaseService && FirebaseService.isEnabled()){
        const list = await FirebaseService.getAll('e_dokumen_arsip');
        arsipList = isAdmin ? list : list.filter(a=> !a.owner_email || a.owner_email===user.email);
        if(st) st.textContent = `✅ ${arsipList.length} arsip`;
      } else {
        const md = ServiceMenu.getMasterData();
        arsipList = md.e_dokumen_arsip || [];
        if(!isAdmin) arsipList = ServiceMenu.filterOwnerOnly(arsipList);
        if(st) st.textContent = `⚠️ Offline ${arsipList.length}`;
      }
    }catch(e){ if(st) st.textContent = `❌ ${e.message}`; arsipList=[]; }
    filtered = arsipList;
    applyFilter();
  }

  // File input -> base64
  const fileInput = document.getElementById('f_file');
  if(fileInput){
    fileInput.addEventListener('change', function(e){
      const file = e.target.files[0];
      if(!file) return;
      const info = document.getElementById('fileInfo');
      const preview = document.getElementById('filePreview');
      const link = document.getElementById('previewLink');
      if(file.size > 700*1024){
        if(info) info.innerHTML = `⚠️ File ${(file.size/1024).toFixed(0)}KB >700KB. Tidak bisa simpan base64 di Firestore (limit 1MB).<br>Silakan upload ke Google Drive dan paste link Drive di field bawah. Base64 dibatalkan.`;
        pendingBase64 = { data: null, name: null, type: null, size: file.size };
        if(preview) preview.style.display='none';
        return;
      }
      const reader = new FileReader();
      reader.onload = function(ev){
        pendingBase64 = { data: ev.target.result, name: file.name, type: file.type, size: file.size };
        if(info) info.textContent = `✅ Siap simpan Base64: ${file.name} (${(file.size/1024).toFixed(0)}KB, ${file.type})`;
        if(link) link.href = ev.target.result;
        if(preview) preview.style.display='block';
      };
      reader.readAsDataURL(file);
    });
  }

  const btnHapusFile = document.getElementById('btnHapusFile');
  if(btnHapusFile){
    btnHapusFile.onclick = ()=>{
      pendingBase64 = { data: null, name: null, type: null, size: 0 };
      document.getElementById('f_file').value='';
      document.getElementById('fileInfo').textContent='File dihapus. Pilih file baru <700KB atau pakai link Drive.';
      document.getElementById('filePreview').style.display='none';
    };
  }

  document.getElementById('searchArsip').addEventListener('input', applyFilter);
  document.getElementById('filterKategori').addEventListener('change', applyFilter);

  document.getElementById('btnBatalArsip').onclick = ()=>{
    ['f_judul','f_nomor','f_file_url','f_keterangan'].forEach(id=> document.getElementById(id).value='');
    document.getElementById('f_tanggal').value='';
    document.getElementById('f_judul').dataset.editId='';
    document.getElementById('f_file').value='';
    pendingBase64 = { data: null, name: null, type: null, size: 0 };
    document.getElementById('fileInfo').textContent='Belum ada file. Pilih PDF/JPG/PNG <700KB.';
    document.getElementById('filePreview').style.display='none';
    document.getElementById('formTitle').textContent='+ Tambah Arsip + Base64';
  };

  document.getElementById('btnSimpanArsip').onclick = async function(){
    const judul = document.getElementById('f_judul').value.trim();
    if(!judul){ alert('Judul wajib!'); return; }
    const obj = {
      judul,
      kategori: document.getElementById('f_kategori').value,
      nomor_surat: document.getElementById('f_nomor').value.trim(),
      tanggal_surat: document.getElementById('f_tanggal').value || new Date().toISOString().slice(0,10),
      file_url: document.getElementById('f_file_url').value.trim(),
      keterangan: document.getElementById('f_keterangan').value.trim(),
      file_name: pendingBase64.name || null,
      file_type: pendingBase64.type || null,
      file_size: pendingBase64.size || 0,
      file_base64: pendingBase64.data || null
    };
    const editId = document.getElementById('f_judul').dataset.editId;
    try{
      if(editId){
        if(window.FirebaseService && FirebaseService.isEnabled()){
          await FirebaseService.update('e_dokumen_arsip', editId, obj);
        }
      } else {
        if(window.FirebaseService && FirebaseService.isEnabled()){
          await FirebaseService.add('e_dokumen_arsip', obj);
        } else {
          let md = ServiceMenu.getMasterData();
          if(!md.e_dokumen_arsip) md.e_dokumen_arsip=[];
          md.e_dokumen_arsip.push(ServiceMenu.addOwner({id:Date.now(), ...obj}));
          ServiceMenu.saveMasterData(md);
        }
      }
      document.getElementById('btnBatalArsip').click();
      await loadData();
    }catch(e){
      alert('Gagal simpan: '+e.message+'\nJika file_base64 terlalu besar (>1MB), Firestore menolak. Pakai link Drive.');
    }
  };

  document.getElementById('btnExportArsip').onclick = ()=>{
    let html = `<html><head><meta charset="UTF-8"></head><body><table border="1" style="font-size:11px;border-collapse:collapse;"><tr><th>Judul</th><th>Kategori</th><th>Nomor</th><th>Tanggal</th><th>File Name</th><th>Size</th><th>Drive</th><th>Owner</th></tr>`;
    filtered.forEach(a=>{ html+=`<tr><td>${a.judul||''}</td><td>${a.kategori||''}</td><td>${a.nomor_surat||''}</td><td>${a.tanggal_surat||''}</td><td>${a.file_name||''}</td><td>${a.file_size||0}</td><td>${a.file_url||''}</td><td>${a.owner_email||''}</td></tr>`; });
    html+=`</table></body></html>`;
    const blob = new Blob([html], {type:'application/vnd.ms-excel'});
    const url = URL.createObjectURL(blob);
    const el = document.createElement('a'); el.href=url; el.download=`Arsip_Base64_SDN134_${new Date().toISOString().slice(0,10)}.xls`; el.click(); URL.revokeObjectURL(url);
  };

  document.getElementById('btnTambahArsip').onclick = ()=> document.getElementById('f_judul').focus();

  window.editArsip = function(fid){
    const a = arsipList.find(x=> String(x.firestore_id||x.id)===String(fid));
    if(!a) return;
    document.getElementById('f_judul').value = a.judul||'';
    document.getElementById('f_kategori').value = a.kategori||'Arsip';
    document.getElementById('f_nomor').value = a.nomor_surat||'';
    document.getElementById('f_tanggal').value = a.tanggal_surat||'';
    document.getElementById('f_file_url').value = a.file_url||'';
    document.getElementById('f_keterangan').value = a.keterangan||'';
    document.getElementById('f_judul').dataset.editId = fid;
    if(a.file_base64){
      pendingBase64 = { data: a.file_base64, name: a.file_name, type: a.file_type, size: a.file_size };
      document.getElementById('fileInfo').textContent = `✅ File tersimpan: ${a.file_name} (${(a.file_size/1024).toFixed(0)}KB)`;
      document.getElementById('previewLink').href = a.file_base64;
      document.getElementById('filePreview').style.display='block';
    }
    document.getElementById('formTitle').textContent='✏️ Edit Arsip';
  };

  window.hapusArsip = async function(fid){
    if(!confirm('Hapus permanen dari Firestore schools/40312947/e_dokumen_arsip?')) return;
    try{
      if(window.FirebaseService && FirebaseService.isEnabled()){
        await FirebaseService.delete('e_dokumen_arsip', fid, fid);
      }
      await loadData();
    }catch(e){ alert('Gagal hapus: '+e.message); }
  };

  if(window.FirebaseService && FirebaseService.isEnabled()){
    FirebaseService.listen('e_dokumen_arsip', (list)=>{
      arsipList = isAdmin ? list : list.filter(a=> !a.owner_email || a.owner_email===user.email);
      applyFilter();
    });
  }

  loadData();
};
