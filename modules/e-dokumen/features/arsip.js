// modules/e-dokumen/features/arsip.js - FINAL: Smart View & Selective Export - Taat v3

window.init_arsip = function(container){
  var user = ServiceMenu.getCurrentUser();
  var isAdmin = ServiceMenu.isAdmin();
  var kategoriList = ['Arsip','Surat Masuk','Surat Keluar','SK','Undangan','Laporan','DLL'];

  var catOptions = '';
  for(var i=0;i<kategoriList.length;i++){ catOptions += '<option value="'+kategoriList[i]+'">'+kategoriList[i]+'</option>'; }

  container.innerHTML = ''
  + '<div style="margin-bottom:16px;"><button onclick="window.location.href=\'/sd134kalumpang/dashboard.html\'" style="background:#f1f5f9;color:#0d3b66;border:none;padding:8px 16px;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;">← Kembali ke Dashboard Utama</button></div>'
  + '<div class="welcome-banner" style="background:linear-gradient(135deg,#0f172a,#1e3a8a);padding:16px;border-radius:12px;color:white;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">'
  + '<div><h1 style="font-size:16px;font-weight:800;">📁 Katalog Arsip Dokumen</h1><p style="font-size:11px;color:rgba(255,255,255,0.7);">Repo: sd134kalumpang/modules/e-dokumen/ • Owner: '+user.email+'</p></div>'
  + '<div style="display:flex;gap:8px;">'
  + '<button id="btnExportArsip" style="background:white;color:#0d3b66;padding:8px 16px;border-radius:20px;font-size:12px;font-weight:700;cursor:pointer;">📊 Export Terpilih</button>'
  + '<a href="./index.html?fitur=upload" style="background:#ffcc00;color:#0d3b66;padding:8px 16px;border-radius:20px;font-size:12px;font-weight:700;text-decoration:none;">+ Tambah Arsip</a>'
  + '</div></div>'
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
  + '<div style="background:white;border-radius:12px;border:1px solid #e8eef6;padding:16px;">'
  + '<div style="display:flex;justify-content:space-between;margin-bottom:12px;"><h3 style="font-weight:700;">Daftar Arsip</h3><span id="countInfo" style="font-size:11px;color:#64748b;">0 data</span></div>'
  + '<div style="overflow-x:auto;"><table style="width:100%;font-size:12px;text-align:left;border-collapse:collapse;">'
  + '<thead style="font-size:11px;color:#94a3b8;background:#f8fafc;"><tr>'
  + '<th style="padding:10px;width:40px;"><input type="checkbox" id="checkAllExport" title="Pilih semua untuk export"></th>'
  + '<th style="padding:10px;">Judul / Nomor</th><th>Kategori</th><th>File</th><th>Tanggal</th><th style="width:160px;">Aksi</th>'
  + '</tr></thead><tbody id="arsipTableBody"></tbody></table></div></div>';

  var arsipList = [];
  var filtered = [];

  function renderTable(list){
    var tbody = document.getElementById('arsipTableBody');
    if(!tbody) return;
    if(!list.length){ tbody.innerHTML = '<tr><td colspan="6" style="padding:20px;text-align:center;color:#94a3b8;">Belum ada arsip</td></tr>'; return; }
    var html = '';
    for(var i=0;i<list.length;i++){
      var a = list[i];
      var fid = a.firestore_id || a.id;
      var tgl = a.tanggal_surat || '';
      var fileBtn = '';
      if(a.file_base64){ 
        fileBtn = '<button onclick="window.viewArsip(\''+fid+'\')" style="background:#dcfce7;color:#166534;border:none;padding:4px 8px;border-radius:6px;font-size:10px;font-weight:700;cursor:pointer;">👁️ Lihat Base64</button><div style="font-size:9px;color:#64748b;margin-top:2px;">'+(a.file_name||'')+'</div>'; 
      } else if(a.file_url){ 
        fileBtn = '<button onclick="window.viewArsip(\''+fid+'\')" style="background:#dbeafe;color:#1e40af;border:none;padding:4px 8px;border-radius:6px;font-size:10px;font-weight:700;cursor:pointer;">🔗 Buka Drive</button>'; 
      } else { 
        fileBtn = '<span style="color:#94a3b8;font-size:11px;">-</span>'; 
      }
      html += '<tr style="border-bottom:1px solid #f1f5f9;">'
      + '<td style="padding:10px;"><input type="checkbox" class="row-export-check" value="'+fid+'"></td>'
      + '<td style="padding:10px;"><div style="font-weight:600;">'+(a.judul||'')+'</div><div style="font-size:11px;color:#64748b;">'+(a.nomor_surat||'')+'</div></td>'
      + '<td><span style="background:#f1f5f9;padding:3px 8px;border-radius:12px;font-size:10px;">'+(a.kategori||'')+'</span></td>'
      + '<td>'+fileBtn+'</td>'
      + '<td style="font-size:11px;">'+tgl+'</td>'
      + '<td style="padding:10px;">'
      + '<button onclick="window.editArsip(\''+fid+'\')" style="color:#2563eb;font-size:11px;cursor:pointer;margin-right:8px;background:none;border:none;font-weight:600;">Edit</button>'
      + '<button onclick="window.hapusArsip(\''+fid+'\')" style="color:#dc2626;font-size:11px;cursor:pointer;background:none;border:none;font-weight:600;">Hapus</button>'
      + '</td></tr>';
    }
    tbody.innerHTML = html;
  }

  document.getElementById('checkAllExport').onchange = function(e){
    var checks = document.querySelectorAll('.row-export-check');
    for(var i=0;i<checks.length;i++) checks[i].checked = e.target.checked;
  };

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
        var list = await FirebaseService.getAll('e_dokumen_arsip');
        if (!Array.isArray(list)) list = [];
        arsipList = isAdmin ? list : list.filter(function(a){ return !a.owner_email || a.owner_email===user.email; });
        filtered = arsipList;
        if(st) st.textContent = 'Loaded '+arsipList.length+' arsip';
        applyFilter();
      } catch(e) { if(st) st.textContent = 'Error: '+e.message; console.error('LoadData Error:', e); }
    } else {
      var md = ServiceMenu.getMasterData();
      arsipList = md.e_dokumen_arsip || [];
      if(!isAdmin) arsipList = ServiceMenu.filterOwnerOnly(arsipList);
      filtered = arsipList;
      if(st) st.textContent = 'Offline '+arsipList.length;
      applyFilter();
    }
  }

  document.getElementById('searchArsip').addEventListener('input', applyFilter);
  document.getElementById('filterKategori').addEventListener('change', applyFilter);

  // SMART VIEWER: Deteksi tipe file dan render sesuai kemampuan browser
  window.viewArsip = function(fid){
    var a = arsipList.find(function(x){ return (x.firestore_id||x.id) == fid; });
    if(!a) return alert('Data tidak ditemukan');
    
    if(a.file_base64){
      try {
        var arr = a.file_base64.split(',');
        var mime = (arr[0].match(/:(.*?);/) || [])[1] || 'application/octet-stream';
        var bstr = atob(arr[1]);
        var n = bstr.length;
        var u8arr = new Uint8Array(n);
        while(n--){ u8arr[n] = bstr.charCodeAt(n); }
        var blob = new Blob([u8arr], {type: mime});
        var url = URL.createObjectURL(blob);
        
        var isImage = mime.startsWith('image/');
        var isPdf = mime === 'application/pdf';
        
        var win = window.open('', '_blank');
        if(!win) return alert('Pop-up diblokir browser. Izinkan pop-up untuk situs ini.');
        
        win.document.title = a.judul || 'Lihat Arsip';
        win.document.body.style.margin = '0';
        win.document.body.style.fontFamily = 'sans-serif';
        
        if(isImage){
          win.document.write('<img src="'+url+'" style="max-width:100%; height:auto; display:block; margin:0 auto;">');
        } else if(isPdf){
          win.document.write('<iframe src="'+url+'" style="width:100vw; height:100vh; border:none;"></iframe>');
        } else {
          win.document.write('<div style="padding:40px; text-align:center;">');
          win.document.write('<h3>Preview tidak tersedia untuk format ini ('+mime+')</h3>');
          win.document.write('<p>Silakan download untuk membuka di aplikasi Microsoft Word/Excel.</p>');
          win.document.write('<a href="'+url+'" download="'+(a.file_name||'file')+'" style="background:#0d3b66; color:white; padding:10px 20px; text-decoration:none; border-radius:8px; font-weight:bold;">Download File</a>');
          win.document.write('</div>');
        }
        win.document.close();
      } catch(e) {
        console.error('Gagal membuka file:', e);
        alert('Gagal menampilkan file.');
      }
    } else if(a.file_url){
      window.open(a.file_url, '_blank');
    } else {
      alert('Tidak ada file yang terlampir.');
    }
  };

  // EXPORT TERPILIH: Hanya export baris yang dicentang
  document.getElementById('btnExportArsip').onclick = function(){
    var checks = document.querySelectorAll('.row-export-check:checked');
    if(checks.length === 0){ alert('️ Centang minimal 1 file pada tabel untuk di-export!'); return; }
    
    var selectedData = [];
    for(var i=0;i<checks.length;i++){
      var fid = checks[i].value;
      var item = filtered.find(function(x){ return (x.firestore_id||x.id) == fid; });
      if(item) selectedData.push(item);
    }

    var html = '<html><head><meta charset="UTF-8"></head><body><h2>Export Arsip Terpilih - SDN 134 Kalumpang</h2><table border="1" style="font-size:11px;border-collapse:collapse;width:100%;">';
    html += '<tr style="background:#0d3b66;color:white;"><th>Judul</th><th>Kategori</th><th>Nomor</th><th>Tanggal</th><th>Nama File</th><th>Link / File Asli</th></tr>';
    
    for(var i=0;i<selectedData.length;i++){ 
      var a = selectedData[i]; 
      var linkCell = '';
      if(a.file_url){
        linkCell = '=HYPERLINK("'+a.file_url+'","Buka Drive")';
      } else if(a.file_base64){
        linkCell = '[File Base64 '+Math.round((a.file_size||0)/1024)+'KB] - Lihat langsung di Web App';
      } else {
        linkCell = '-';
      }
      html += '<tr><td>'+(a.judul||'')+'</td><td>'+(a.kategori||'')+'</td><td>'+(a.nomor_surat||'')+'</td><td>'+(a.tanggal_surat||'')+'</td><td>'+(a.file_name||'')+'</td><td>'+linkCell+'</td></tr>'; 
    }
    html += '</table><p style="font-size:10px;color:red;">*Catatan: Untuk file Base64, silakan buka aplikasi web ini untuk melihat/mendownload file aslinya secara langsung.</p></body></html>';
    
    var blob = new Blob([html], {type:'application/vnd.ms-excel'});
    var url = URL.createObjectURL(blob);
    var el = document.createElement('a'); el.href=url; el.download='Export_Terpilih_SDN134_'+new Date().toISOString().slice(0,10)+'.xls'; el.click(); URL.revokeObjectURL(url);
  };

  window.editArsip = function(fid){
    window.location.href = './index.html?fitur=upload&edit='+fid;
  };

  window.hapusArsip = async function(fid){
    if(!confirm('Hapus permanen dari Firestore?')) return;
    if(window.FirebaseService && FirebaseService.isEnabled()){
      try {
        await FirebaseService.delete('e_dokumen_arsip', fid);
        loadData();
      } catch(e) { console.error('Gagal hapus:', e); alert('Gagal menghapus: ' + e.message); }
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
