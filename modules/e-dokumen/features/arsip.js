// modules/e-dokumen/features/arsip.js - FIXED - Safe Async/Await, Back to Dashboard, Owner Enforcement - Taat v3

window.init_arsip = function(container){
  var user = ServiceMenu.getCurrentUser();
  var isAdmin = ServiceMenu.isAdmin();
  var kategoriList = ['Arsip','Surat Masuk','Surat Keluar','SK','Undangan','Laporan','DLL'];

  var catOptions = '';
  for(var i=0;i<kategoriList.length;i++){ catOptions += '<option value="'+kategoriList[i]+'">'+kategoriList[i]+'</option>'; }

  container.innerHTML = ''
  + '<div class="welcome-banner" style="background:linear-gradient(135deg,#0f172a,#1e3a8a);padding:16px;border-radius:12px;color:white;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">'
  + '<div><h1 style="font-size:16px;font-weight:800;">📁 Arsip Dokumen - Base64 Firestore</h1><p style="font-size:11px;color:rgba(255,255,255,0.7);">Repo: sd134kalumpang/modules/e-dokumen/ • Owner: '+user.email+' • Base64 max 700KB</p></div>'
  + '<div style="display:flex;gap:8px;flex-wrap:wrap;">'
  + '<button onclick="window.location.href=\'/sd134kalumpang/dashboard.html\'" style="background:rgba(255,255,255,0.2);color:white;border:1px solid rgba(255,255,255,0.3);padding:8px 16px;border-radius:20px;font-size:12px;font-weight:700;cursor:pointer;">← Kembali ke Dashboard</button>'
  + '<button id="btnExportArsip" style="background:white;color:#0d3b66;padding:8px 16px;border-radius:20px;font-size:12px;font-weight:700;cursor:pointer;">📊 Export XLS</button>'
  + '<button id="btnTambahArsip" style="background:#ffcc00;color:#0d3b66;padding:8px 16px;border-radius:20px;font-size:12px;font-weight:700;cursor:pointer;">+ Tambah</button>'
  + '</div>'
  + '</div>'
  + '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:16px 0;">'
  + '<div style="padding:16px;background:white;border-radius:12px;border:1px solid #e8eef6;"><div style="font-size:11px;color:#64748b;">TOTAL ARSIP</div><h3 id="totalArsip" style="font-size:22px;font-weight:800;">0</h3><div id="ownerInfo" style="font-size:11px;color:#0d3b66;">Memuat...</div></div>'
  + '<div style="padding:16px;background:white;border-radius:12px;border:1px solid #e8eef6;"><div style="font-size:11px;color:#64748b;">BASE64</div><h3 id="totalBase64" style="font-size:22px;font-weight:800;">0</h3><div style="font-size:11px;">File di Firestore</div></div>'
  + '<div style="padding:16px;background:white;border-radius:12px;border:1px solid #e8eef6;"><div style="font-size:11px;color:#64748b;">LINK DRIVE</div><h3 id="totalDrive" style="font-size:22px;font-weight:800;">0</h3><div style="font-size:11px;">File besar</div></div>'
  + '<div style="padding:16px;background:white;border-radius:12px;border:1px solid #e8eef6;"><div style="font-size:11px;color:#64748b;">MASUK</div><h3 id="totalMasuk" style="font-size:22px;font-weight:800;">0</h3><div style="font-size:11px;">Kategori</div></div>'
  + '</div>'
  + '<div style="background:white;border-radius:12px;border:1px solid #e8eef6;padding:16px;margin-bottom:16px;display:flex;gap:8px;flex-wrap:wrap;justify-content:space-between;align-items:center;">'
  + '<div style="display:flex;gap:8px;flex-wrap:wrap;"><input id="searchArsip" placeholder="Cari judul, nomor..." style="border:1px solid #e2e8f0;border-radius:8px;padding:8px 12px;font-size:12px;min-width:260px;"><select id="filterKategori" style="border:1px solid #e2e8f0;border-radius:8px;padding:8px;font-size:12px;"><option value="">Semua Kategori</option>'+catOptions+'</select></div>'
  + '<div id="statusArsip" style="font-size:11px;color:#64748b;">Memuat...</div>'
  + '</div>'
  + '<div style="display:grid;grid-template-columns:1fr 380px;gap:16px;">'
  + '<div style="background:white;border-radius:12px;border:1px solid #e8eef6;padding:16px;"><div style="display:flex;justify-content:space-between;margin-bottom:12px;"><h3 style="font-weight:700;">Daftar Arsip</h3><span id="countInfo" style="font-size:11px;color:#64748b;">0 data</span></div><div style="overflow-x:auto;"><table style="width:100%;font-size:12px;text-align:left;"><thead style="font-size:11px;color:#94a3b8;"><tr><th style="padding:8px;">Judul / Nomor</th><th>Kategori</th><th>File</th><th>Tanggal</th><th>Aksi</th></tr></thead><tbody id="arsipTableBody"></tbody></table></div></div>'
  + '<div style="background:white;border-radius:12px;border:1px solid #e8eef6;padding:16px;"><h3 id="formTitle" style="font-weight:700;margin-bottom:12px;">+ Tambah Arsip Base64</h3><div style="display:grid;gap:10px;">'
  + '<div><label style="font-size:11px;font-weight:700;">Judul *</label><input id="f_judul" placeholder="SK Pembagian Tugas" style="width:100%;border:1px solid #e2e8f0;border-radius:8px;padding:8px;font-size:12px;"></div>'
  + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;"><div><label style="font-size:11px;font-weight:700;">Kategori</label><select id="f_kategori" style="width:100%;border:1px solid #e2e8f0;border-radius:8px;padding:8px;font-size:12px;">'+catOptions+'</select></div><div><label style="font-size:11px;font-weight:700;">Nomor</label><input id="f_nomor" placeholder="400/001/2025" style="width:100%;border:1px solid #e2e8f0;border-radius:8px;padding:8px;font-size:12px;"></div></div>'
  + '<div><label style="font-size:11px;font-weight:700;">Tanggal</label><input id="f_tanggal" type="date" style="width:100%;border:1px solid #e2e8f0;border-radius:8px;padding:8px;font-size:12px;"></div>'
  + '<div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:10px;"><label style="font-size:11px;font-weight:700;">Upload File Base64 max 700KB</label><input id="f_file" type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" style="width:100%;margin-top:6px;font-size:11px;"><div id="fileInfo" style="font-size:10px;color:#92400e;margin-top:6px;">Pilih PDF/JPG/PNG di bawah 700KB agar tersimpan di Firestore dan bisa dilihat di situs.</div><div id="filePreview" style="margin-top:8px;display:none;"><a id="previewLink" href="#" target="_blank" style="font-size:11px;color:#0d3b66;text-decoration:underline;">Preview Base64</a> <button id="btnHapusFile" type="button" style="font-size:10px;color:#dc2626;margin-left:8px;">Hapus</button></div></div>'
  + '<div><label style="font-size:11px;font-weight:700;">Link Drive (untuk file besar)</label><input id="f_file_url" placeholder="https://drive.google.com/..." style="width:100%;border:1px solid #e2e8f0;border-radius:8px;padding:8px;font-size:12px;"></div>'
  + '<div><label style="font-size:11px;font-weight:700;">Keterangan</label><textarea id="f_keterangan" placeholder="Catatan..." style="width:100%;border:1px solid #e2e8f0;border-radius:8px;padding:8px;font-size:12px;min-height:60px;"></textarea></div>'
  + '<div style="display:flex;gap:8px;"><button id="btnSimpanArsip" style="flex:1;background:#0d3b66;color:white;padding:10px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">Simpan Firestore</button><button id="btnBatalArsip" style="background:#f1f5f9;padding:10px 16px;border-radius:8px;font-size:12px;cursor:pointer;">Batal</button></div>'
  + '<div style="font-size:10px;color:#64748b;">Path: sd134kalumpang/modules/e-dokumen/features/arsip.js • Koleksi: schools/40312947/e_dokumen_arsip</div>'
  + '</div></div></div>';

  var arsipList = [];
  var filtered = [];
  var pendingBase64 = { data: null, name: null, type: null, size: 0 };

  function renderTable(list){
    var tbody = document.getElementById('arsipTableBody');
    if(!tbody) return;
    if(!list.length){ tbody.innerHTML = '<tr><td colspan="5" style="padding:20px;text-align:center;color:#94a3b8;">Belum ada arsip</td></tr>'; return; }
    var html = '';
    for(var i=0;i<list.length;i++){
      var a = list[i];
      var fid = a.firestore_id || a.id;
      var tgl = a.tanggal_surat || '';
      var fileBtn = '';
      if(a.file_base64){ fileBtn = '<a href="'+a.file_base64+'" target="_blank" style="color:#059669;font-size:11px;font-weight:700;">Base64 '+(Math.round((a.file_size||0)/1024))+'KB</a><div style="font-size:9px;">'+(a.file_name||'')+'</div>'; }
      else if(a.file_url){ fileBtn = '<a href="'+a.file_url+'" target="_blank" style="color:#0d3b66;text-decoration:underline;font-size:11px;">Drive</a>'; }
      else { fileBtn = '<span style="color:#94a3b8;font-size:11px;">-</span>'; }
      html += '<tr style="border-bottom:1px solid #f1f5f9;"><td style="padding:10px;"><div style="font-weight:600;">'+(a.judul||'')+'</div><div style="font-size:11px;color:#64748b;">'+(a.nomor_surat||'')+'</div></td><td><span style="background:#f1f5f9;padding:3px 8px;border-radius:12px;font-size:10px;">'+(a.kategori||'')+'</span></td><td>'+fileBtn+'</td><td style="font-size:11px;">'+tgl+'</td><td><button onclick="window.editArsip(\''+fid+'\')" style="color:#2563eb;font-size:11px;cursor:pointer;">Edit</button> <button onclick="window.hapusArsip(\''+fid+'\')" style="color:#dc2626;font-size:11px;cursor:pointer;">Hapus</button></td></tr>';
    }
    tbody.innerHTML = html;
  }

  function updateKPI(){
    document.getElementById('totalArsip').textContent = filtered.length;
    var b64 = 0, drv = 0, masuk = 0;
    for(var i=0;i<filtered.length;i++){ if(filtered[i].file_base64) b64++; if(filtered[i].file_url && !filtered[i].file_base64) drv++; if((filtered[i].kategori||'').toLowerCase().indexOf('masuk')>=0) masuk++; }
    document.getElementById('totalBase64').textContent = b64;
    document.getElementById('totalDrive').textContent = drv;
    document.getElementById('totalMasuk').textContent = masuk;
    document.getElementById('countInfo').textContent = filtered.length + ' data';
    document.getElementById('ownerInfo').textContent = isAdmin ? 'Admin semua ('+arsipList.length+')' : 'Owner '+user.email+' ('+filtered.length+')';
  }

  function applyFilter(){
    var q = (document.getElementById('searchArsip').value||'').toLowerCase();
    var kat = document.getElementById('filterKategori').value;
    filtered = [];
    for(var i=0;i<arsipList.length;i++){
      var a = arsipList[i];
      var matchQ = !q || (a.judul||'').toLowerCase().indexOf(q)>=0 || (a.nomor_surat||'').toLowerCase().indexOf(q)>=0;
      var matchKat = !kat || a.kategori===kat;
      if(matchQ && matchKat) filtered.push(a);
    }
    filtered.sort(function(a,b){ return new Date(b.tanggal_surat||b.created_at||0) - new Date(a.tanggal_surat||a.created_at||0); });
    renderTable(filtered);
    updateKPI();
  }

  async function loadData(){
    var st = document.getElementById('statusArsip');
    if(st) st.textContent = 'Memuat Firestore...';
    if(window.FirebaseService && FirebaseService.isEnabled()){
      try {
        var list = [];
        // PERBAIKAN 1: Fallback aman jika getAll tidak ada, coba gunakan get
        if (typeof FirebaseService.getAll === 'function') {
          list = await FirebaseService.getAll('e_dokumen_arsip');
        } else if (typeof FirebaseService.get === 'function') {
          list = await FirebaseService.get('e_dokumen_arsip');
        } else {
          throw new Error('Metode getAll atau get tidak ditemukan di FirebaseService');
        }
        
        if (!Array.isArray(list)) list = [];
        arsipList = isAdmin ? list : list.filter(function(a){ return !a.owner_email || a.owner_email===user.email; });
        filtered = arsipList;
        if(st) st.textContent = 'Loaded '+arsipList.length+' arsip';
        applyFilter();
      } catch(e) { 
        if(st) st.textContent = 'Error: '+e.message; 
        console.error('LoadData Error:', e);
      }
    } else {
      var md = ServiceMenu.getMasterData();
      arsipList = md.e_dokumen_arsip || [];
      if(!isAdmin) arsipList = ServiceMenu.filterOwnerOnly(arsipList);
      filtered = arsipList;
      if(st) st.textContent = 'Offline '+arsipList.length;
      applyFilter();
    }
  }

  var fileInput = document.getElementById('f_file');
  if(fileInput){
    fileInput.addEventListener('change', function(e){
      var file = e.target.files[0];
      if(!file) return;
      var info = document.getElementById('fileInfo');
      var preview = document.getElementById('filePreview');
      var link = document.getElementById('previewLink');
      if(file.size > 700*1024){
        if(info) info.innerHTML = 'File '+(file.size/1024).toFixed(0)+'KB >700KB. Pakai Drive link.';
        pendingBase64 = { data: null, name: null, type: null, size: file.size };
        if(preview) preview.style.display='none';
        return;
      }
      var reader = new FileReader();
      reader.onload = function(ev){
        pendingBase64 = { data: ev.target.result, name: file.name, type: file.type, size: file.size };
        if(info) info.textContent = 'Siap Base64: '+file.name+' ('+(file.size/1024).toFixed(0)+'KB)';
        if(link) link.href = ev.target.result;
        if(preview) preview.style.display='block';
      };
      reader.readAsDataURL(file);
    });
  }

  var btnHapusFile = document.getElementById('btnHapusFile');
  if(btnHapusFile){
    btnHapusFile.onclick = function(){
      pendingBase64 = { data: null, name: null, type: null, size: 0 };
      document.getElementById('f_file').value='';
      document.getElementById('fileInfo').textContent='File dihapus.';
      document.getElementById('filePreview').style.display='none';
    };
  }

  document.getElementById('searchArsip').addEventListener('input', applyFilter);
  document.getElementById('filterKategori').addEventListener('change', applyFilter);

  document.getElementById('btnBatalArsip').onclick = function(){
    document.getElementById('f_judul').value='';
    document.getElementById('f_nomor').value='';
    document.getElementById('f_file_url').value='';
    document.getElementById('f_keterangan').value='';
    document.getElementById('f_tanggal').value='';
    document.getElementById('f_judul').dataset.editId='';
    document.getElementById('f_file').value='';
    pendingBase64 = { data: null, name: null, type: null, size: 0 };
    document.getElementById('fileInfo').textContent='Belum ada file.';
    document.getElementById('filePreview').style.display='none';
    document.getElementById('formTitle').textContent='+ Tambah Arsip Base64';
  };

  // PERBAIKAN 2: Gunakan async/await untuk mencegah error ".then is not a function"
  document.getElementById('btnSimpanArsip').onclick = async function(){
    var judul = document.getElementById('f_judul').value.trim();
    if(!judul){ alert('Judul wajib'); return; }
    
    // PERBAIKAN 3: Tambahkan owner_email agar aturan "hanya bisa dilihat user sendiri" berjalan di Firestore
    var obj = {
      judul: judul,
      kategori: document.getElementById('f_kategori').value,
      nomor_surat: document.getElementById('f_nomor').value.trim(),
      tanggal_surat: document.getElementById('f_tanggal').value || new Date().toISOString().slice(0,10),
      file_url: document.getElementById('f_file_url').value.trim(),
      keterangan: document.getElementById('f_keterangan').value.trim(),
      file_name: pendingBase64.name || null,
      file_type: pendingBase64.type || null,
      file_size: pendingBase64.size || 0,
      file_base64: pendingBase64.data || null,
      owner_email: user.email,
      owner_nama: user.nama
    };
    
    var editId = document.getElementById('f_judul').dataset.editId;
    
    try {
      if(window.FirebaseService && FirebaseService.isEnabled()){
        if(editId){
          if (typeof FirebaseService.update === 'function') {
            await FirebaseService.update('e_dokumen_arsip', editId, obj);
          } else {
            console.warn('FirebaseService.update tidak ditemukan.');
          }
        } else {
          if (typeof FirebaseService.add === 'function') {
            await FirebaseService.add('e_dokumen_arsip', obj);
          } else {
            console.warn('FirebaseService.add tidak ditemukan.');
          }
        }
      }
      document.getElementById('btnBatalArsip').click(); 
      loadData();
    } catch(e) {
      console.error('Gagal menyimpan:', e);
      alert('Gagal menyimpan ke Firestore: ' + e.message);
    }
  };

  document.getElementById('btnExportArsip').onclick = function(){
    var html = '<html><head><meta charset="UTF-8"></head><body><table border="1" style="font-size:11px;border-collapse:collapse;"><tr><th>Judul</th><th>Kategori</th><th>Nomor</th><th>Tanggal</th><th>File</th><th>Size</th><th>Drive</th></tr>';
    for(var i=0;i<filtered.length;i++){ var a=filtered[i]; html+='<tr><td>'+(a.judul||'')+'</td><td>'+(a.kategori||'')+'</td><td>'+(a.nomor_surat||'')+'</td><td>'+(a.tanggal_surat||'')+'</td><td>'+(a.file_name||'')+'</td><td>'+(a.file_size||0)+'</td><td>'+(a.file_url||'')+'</td></tr>'; }
    html+='</table></body></html>';
    var blob = new Blob([html], {type:'application/vnd.ms-excel'});
    var url = URL.createObjectURL(blob);
    var el = document.createElement('a'); el.href=url; el.download='Arsip_SDN134_'+new Date().toISOString().slice(0,10)+'.xls'; el.click(); URL.revokeObjectURL(url);
  };

  document.getElementById('btnTambahArsip').onclick = function(){ document.getElementById('f_judul').focus(); };

  window.editArsip = function(fid){
    var a = null;
    for(var i=0;i<arsipList.length;i++){ if(String(arsipList[i].firestore_id||arsipList[i].id)===String(fid)){ a=arsipList[i]; break; } }
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
      document.getElementById('fileInfo').textContent = 'File: '+a.file_name+' ('+Math.round((a.file_size||0)/1024)+'KB)';
      document.getElementById('previewLink').href = a.file_base64;
      document.getElementById('filePreview').style.display='block';
    }
    document.getElementById('formTitle').textContent='Edit Arsip';
  };

  // PERBAIKAN 4: Async/await untuk hapus agar tidak error jika .then tidak didukung
  window.hapusArsip = async function(fid){
    if(!confirm('Hapus permanen Firestore?')) return;
    if(window.FirebaseService && FirebaseService.isEnabled()){
      try {
        await FirebaseService.delete('e_dokumen_arsip', fid);
        loadData();
      } catch(e) {
        console.error('Gagal hapus:', e);
        alert('Gagal menghapus: ' + e.message);
      }
    }
  };

  if(window.FirebaseService && FirebaseService.isEnabled()){
    FirebaseService.listen('e_dokumen_arsip', function(list){
      if (!Array.isArray(list)) list = [];
      arsipList = isAdmin ? list : list.filter(function(a){ return !a.owner_email || a.owner_email===user.email; });
      applyFilter();
    });
  }

  loadData();
};
