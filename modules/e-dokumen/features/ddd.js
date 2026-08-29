// modules/e-dokumen/features/upload.js - Form Upload - Base64 atau Drive - Taat v3

window.init_upload = function(container){
  var user = ServiceMenu.getCurrentUser();
  var kategoriList = ['Arsip','Surat Masuk','Surat Keluar','SK','Undangan','Laporan','DLL'];

  var catOptions = '';
  for(var i=0;i<kategoriList.length;i++){ catOptions += '<option value="'+kategoriList[i]+'">'+kategoriList[i]+'</option>'; }

  container.innerHTML = ''
  + '<div style="margin-bottom:16px;"><button onclick="window.location.href=\'/sd134kalumpang/dashboard.html\'" style="background:#f1f5f9;color:#0d3b66;border:none;padding:8px 16px;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;">← Kembali ke Dashboard</button></div>'
  + '<div class="welcome-banner" style="background:linear-gradient(135deg,#0f172a,#1e3a8a);padding:16px;border-radius:12px;color:white;">'
  + '<h1 style="font-size:16px;font-weight:800;"> Upload Arsip Dokumen</h1><p style="font-size:11px;color:rgba(255,255,255,0.7);">Pilih metode upload: Base64 (max 700KB) atau Google Drive Link</p></div>'
  + '<div style="background:white;border-radius:12px;border:1px solid #e8eef6;padding:20px;margin-top:16px;">'
  + '<h3 id="formTitle" style="font-weight:700;margin-bottom:16px;">Form Upload Arsip</h3>'
  + '<div style="display:grid;gap:12px;">'
  + '<div><label style="font-size:11px;font-weight:700;display:block;margin-bottom:4px;">Judul *</label><input id="f_judul" placeholder="SK Pembagian Tugas" style="width:100%;border:1px solid #e2e8f0;border-radius:8px;padding:10px;font-size:12px;"></div>'
  + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;"><div><label style="font-size:11px;font-weight:700;display:block;margin-bottom:4px;">Kategori</label><select id="f_kategori" style="width:100%;border:1px solid #e2e8f0;border-radius:8px;padding:10px;font-size:12px;">'+catOptions+'</select></div><div><label style="font-size:11px;font-weight:700;display:block;margin-bottom:4px;">Nomor</label><input id="f_nomor" placeholder="400/001/2025" style="width:100%;border:1px solid #e2e8f0;border-radius:8px;padding:10px;font-size:12px;"></div></div>'
  + '<div><label style="font-size:11px;font-weight:700;display:block;margin-bottom:4px;">Tanggal</label><input id="f_tanggal" type="date" style="width:100%;border:1px solid #e2e8f0;border-radius:8px;padding:10px;font-size:12px;"></div>'
  + '<div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:12px;"><label style="font-size:11px;font-weight:700;display:block;margin-bottom:6px;">Upload File Base64 (max 700KB)</label><input id="f_file" type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" style="width:100%;font-size:11px;"><div id="fileInfo" style="font-size:10px;color:#92400e;margin-top:6px;">Pilih PDF/JPG/PNG di bawah 700KB untuk upload ke Firestore</div><div id="filePreview" style="margin-top:8px;display:none;"><a id="previewLink" href="#" target="_blank" style="font-size:11px;color:#0d3b66;text-decoration:underline;">Preview Base64</a> <button id="btnHapusFile" type="button" style="font-size:10px;color:#dc2626;margin-left:8px;border:none;background:none;cursor:pointer;">Hapus</button></div></div>'
  + '<div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:12px;"><label style="font-size:11px;font-weight:700;display:block;margin-bottom:6px;">Link Google Drive (untuk file besar)</label><input id="f_file_url" placeholder="https://drive.google.com/file/d/..." style="width:100%;border:1px solid #e2e8f0;border-radius:8px;padding:10px;font-size:12px;"><div style="font-size:10px;color:#0369a1;margin-top:4px;">Gunakan opsi ini untuk file lebih dari 700KB</div></div>'
  + '<div><label style="font-size:11px;font-weight:700;display:block;margin-bottom:4px;">Keterangan</label><textarea id="f_keterangan" placeholder="Catatan tambahan..." style="width:100%;border:1px solid #e2e8f0;border-radius:8px;padding:10px;font-size:12px;min-height:60px;"></textarea></div>'
  + '<div style="display:flex;gap:10px;margin-top:8px;"><button id="btnSimpanArsip" style="flex:1;background:#0d3b66;color:white;padding:12px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;border:none;">💾 Simpan ke Firestore</button><button id="btnBatalArsip" style="background:#f1f5f9;padding:12px 20px;border-radius:8px;font-size:12px;cursor:pointer;border:none;">Batal</button></div>'
  + '<div style="font-size:10px;color:#64748b;margin-top:8px;">Owner: '+user.email+' • Path: schools/40312947/e_dokumen_arsip</div>'
  + '</div></div>';

  var pendingBase64 = { data: null, name: null, type: null, size: 0 };

  var fileInput = document.getElementById('f_file');
  if(fileInput){
    fileInput.addEventListener('change', function(e){
      var file = e.target.files[0];
      if(!file) return;
      var info = document.getElementById('fileInfo');
      var preview = document.getElementById('filePreview');
      var link = document.getElementById('previewLink');
      if(file.size > 700*1024){
        if(info) info.innerHTML = '⚠️ File '+(file.size/1024).toFixed(0)+'KB >700KB. Gunakan link Google Drive atau pilih file lebih kecil.';
        pendingBase64 = { data: null, name: null, type: null, size: file.size };
        if(preview) preview.style.display='none';
        return;
      }
      var reader = new FileReader();
      reader.onload = function(ev){
        pendingBase64 = { data: ev.target.result, name: file.name, type: file.type, size: file.size };
        if(info) info.textContent = '✅ Siap upload: '+file.name+' ('+(file.size/1024).toFixed(0)+'KB)';
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

  document.getElementById('btnBatalArsip').onclick = function(){
    document.getElementById('f_judul').value='';
    document.getElementById('f_nomor').value='';
    document.getElementById('f_file_url').value='';
    document.getElementById('f_keterangan').value='';
    document.getElementById('f_tanggal').value='';
    document.getElementById('f_file').value='';
    pendingBase64 = { data: null, name: null, type: null, size: 0 };
    document.getElementById('fileInfo').textContent='Pilih PDF/JPG/PNG di bawah 700KB untuk upload ke Firestore';
    document.getElementById('filePreview').style.display='none';
  };

  document.getElementById('btnSimpanArsip').onclick = async function(){
    var judul = document.getElementById('f_judul').value.trim();
    if(!judul){ alert('Judul wajib diisi'); return; }
    
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
    
    if(!obj.file_base64 && !obj.file_url){
      alert('Pilih file atau masukkan link Google Drive');
      return;
    }
    
    try {
      if(window.FirebaseService && FirebaseService.isEnabled()){
        await FirebaseService.add('e_dokumen_arsip', obj);
        document.getElementById('btnBatalArsip').click();
        alert('✅ Arsip berhasil disimpan ke Firestore!');
        window.location.href = './index.html?fitur=arsip';
      } else {
        alert('Firebase tidak tersedia. Data hanya disimpan lokal.');
      }
    } catch(e) {
      console.error('Gagal menyimpan:', e);
      alert('❌ Gagal menyimpan: ' + e.message);
    }
  };

  // Cek apakah mode edit dari URL parameter
  var params = new URLSearchParams(window.location.search);
  var editId = params.get('edit');
  if(editId){
    document.getElementById('formTitle').textContent = 'Edit Arsip';
    document.getElementById('btnSimpanArsip').textContent = ' Update Arsip';
    // Load data untuk edit (akan diimplementasikan jika diperlukan)
  }
};
