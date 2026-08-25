// modules/master-data/features/data-peserta-didik.js - DATA PESERTA DIDIK + IMPORT TEMPLATE
// Rujukan: aturan_dan_pola.docx - Master Data, Auto-fill, Load bebas, Owner, Kop + Import
// Path repo: modules/master-data/index.html?fitur=data-peserta-didik
// Update: Tambah fitur Import File + Download Template

window.init_data_peserta_didik = window.init_data_peserta_didik || function(container){
  const md = ServiceMenu.getMasterData();
  const school = ServiceMenu.getSchoolInfo();
  const auto = ServiceMenu.getAutoFillProfile();
  const kopHTML = md.kop?.kop_html || `<div style="text-align:center"><b>${school.nama}</b><br>NPSN ${school.npsn}</div>`;

  const defaultSiswa = [
    { id:1, nis:'0001', nisn:'0012345678', nama:'Ahmad Fauzi', kelas:'1', jk:'L', ttl:'Bulukumba, 12 Jan 2018', alamat:'Tritiro', ayah:'Abdullah', ibu:'Siti', status:'Aktif', owner_email:'muharfah@sdn134.sch.id' },
    { id:2, nis:'0002', nisn:'0012345679', nama:'Siti Aminah', kelas:'1', jk:'P', ttl:'Bulukumba, 5 Feb 2018', alamat:'Tritiro', ayah:'Hasan', ibu:'Fatimah', status:'Aktif', owner_email:'muharfah@sdn134.sch.id' },
    { id:3, nis:'0003', nisn:'0012345680', nama:'Muhammad Rizki', kelas:'2', jk:'L', ttl:'Bulukumba, 20 Mar 2017', alamat:'Kalumpang', ayah:'Jamal', ibu:'Rina', status:'Aktif', owner_email:'operator@sdn134.sch.id' }
  ];

  let siswaList = md.peserta_didik && md.peserta_didik.length ? md.peserta_didik : defaultSiswa;
  if(!md.peserta_didik || !md.peserta_didik.length){
    md.peserta_didik = siswaList;
    ServiceMenu.saveMasterData(md);
  }

  container.innerHTML = `
  <div class="welcome-banner" style="background:linear-gradient(135deg,#0f172a,#1e3a8a);">
    <div><h1 style="color:white;">🎓 Data Peserta Didik - 48 Siswa</h1><p style="color:rgba(255,255,255,0.7);">Master Data • Auto-fill: ${auto.nama_guru} • Kepsek: ${auto.nama_kepsek} • Kop: ${md.kop?.nama_sekolah || school.nama}</p></div>
    <div class="welcome-actions" style="display:flex;gap:8px;flex-wrap:wrap;">
      <button class="btn btn-light" id="btnDownloadTemplate" style="background:white;color:#0d3b66;padding:8px 16px;border-radius:20px;font-size:12px;font-weight:700;">📥 Template Import</button>
      <button class="btn btn-light" id="btnImport" style="background:#ffcc00;color:#0d3b66;padding:8px 16px;border-radius:20px;font-size:12px;font-weight:700;">📤 Import File</button>
      <button class="btn btn-light" id="btnExportSiswa" style="background:white;color:#0d3b66;padding:8px 16px;border-radius:20px;font-size:12px;font-weight:700;">📊 Export</button>
      <button class="btn btn-accent" id="btnTambahSiswa" style="background:#ffcc00;color:#0d3b66;padding:8px 16px;border-radius:20px;font-size:12px;font-weight:700;">+ Tambah Siswa</button>
    </div>
  </div>

  <div id="importPanel" style="display:none;background:white;border:2px dashed #0d3b66;border-radius:12px;padding:16px;margin-bottom:16px;">
    <h4 style="font-weight:700;font-size:13px;margin-bottom:8px;">📤 Import Data Peserta Didik - Upload File</h4>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
      <div>
        <label style="font-size:11px;font-weight:700;">Pilih File (CSV / Excel .xlsx)</label>
        <input type="file" id="fileImport" accept=".csv,.xlsx,.xls" style="width:100%;border:1px solid #e2e8f0;border-radius:8px;padding:8px;font-size:12px;margin-top:4px;">
        <div style="font-size:10px;color:#64748b;margin-top:6px;">Format: NIS,NISN,Nama,Kelas,JK,TTL,Alamat,Ayah,Ibu • Max 48 siswa sesuai SDN 134</div>
        <div style="display:flex;gap:8px;margin-top:10px;">
          <button id="btnProsesImport" style="background:#0d3b66;color:white;padding:8px 16px;border-radius:8px;font-size:12px;font-weight:700;">⚙️ Proses & Preview</button>
          <button id="btnBatalImport" style="background:#f1f5f9;padding:8px 16px;border-radius:8px;font-size:12px;">Batal</button>
        </div>
      </div>
      <div style="background:#f7f9fc;border-radius:8px;padding:12px;">
        <div style="font-size:11px;font-weight:700;margin-bottom:6px;">📋 Template Resmi SDN 134 Kalumpang</div>
        <div style="font-size:10px;color:#475569;line-height:1.5;">
          • Header wajib: <code>NIS,NISN,Nama,Kelas,JK,TTL,Alamat,Ayah,Ibu</code><br>
          • JK: L atau P<br>
          • Kelas: 1-6<br>
          • Contoh baris: <code>0004,0012345681,Budi Santoso,1,L,Bulukumba 1 Jan 2018,Tritiro,Ahmad,Siti</code><br>
          • Template sudah include Kop Sekolah & Auto-fill Guru<br>
        </div>
        <button id="btnDownloadTemplate2" style="margin-top:8px;background:#ffcc00;padding:6px 12px;border-radius:8px;font-size:11px;font-weight:700;width:100%;">📥 Download Template CSV</button>
        <button id="btnDownloadTemplateXLSX" style="margin-top:6px;background:white;border:1px solid #e2e8f0;padding:6px 12px;border-radius:8px;font-size:11px;font-weight:700;width:100%;">📥 Download Template Excel (XLSX)</button>
      </div>
    </div>
    <div id="previewImport" style="margin-top:12px;max-height:200px;overflow-y:auto;border:1px solid #e2e8f0;border-radius:8px;padding:8px;display:none;"></div>
  </div>

  <div class="kpi-grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px;">
    <div class="kpi-card" style="padding:16px;background:white;border-radius:12px;border:1px solid #e8eef6;"><div style="font-size:11px;color:#64748b;">TOTAL SISWA</div><h3 style="font-size:22px;font-weight:800;margin:4px 0;" id="totalSiswa">0</h3><div style="font-size:11px;color:#0d3b66;">NPSN ${school.npsn}</div></div>
    <div class="kpi-card" style="padding:16px;background:white;border-radius:12px;border:1px solid #e8eef6;"><div style="font-size:11px;color:#64748b;">KELAS 1-6</div><h3 style="font-size:22px;font-weight:800;margin:4px 0;" id="totalKelas12">0</h3><div style="font-size:11px;color:#0d3b66;">Rombel Aktif</div></div>
    <div class="kpi-card" style="padding:16px;background:white;border-radius:12px;border:1px solid #e8eef6;"><div style="font-size:11px;color:#64748b;">LAKI-LAKI</div><h3 style="font-size:22px;font-weight:800;margin:4px 0;" id="totalL">0</h3><div style="font-size:11px;color:#0d3b66;">${school.nama}</div></div>
    <div class="kpi-card" style="padding:16px;background:white;border-radius:12px;border:1px solid #e8eef6;"><div style="font-size:11px;color:#64748b;">PEREMPUAN</div><h3 style="font-size:22px;font-weight:800;margin:4px 0;" id="totalP">0</h3><div style="font-size:11px;color:#0d3b66;">Owner: ${ServiceMenu.isAdmin() ? 'Admin lihat semua' : 'Hanya milik sendiri'}</div></div>
  </div>

  <div class="two-col" style="display:grid;grid-template-columns:1fr 360px;gap:16px;">
    <div class="card" style="background:white;border-radius:12px;border:1px solid #e8eef6;padding:16px;">
      <div class="card-head" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
        <h3>📋 Daftar Peserta Didik - Master Data</h3>
        <div style="display:flex;gap:8px;">
          <select id="filterKelas" class="border rounded-lg px-2 py-1 text-[12px]"><option value="">Semua Kelas</option><option value="1">Kelas 1</option><option value="2">Kelas 2</option><option value="3">Kelas 3</option><option value="4">Kelas 4</option><option value="5">Kelas 5</option><option value="6">Kelas 6</option></select>
          <select id="filterJK" class="border rounded-lg px-2 py-1 text-[12px]"><option value="">Semua JK</option><option value="L">L</option><option value="P">P</option></select>
          <input id="searchSiswa" placeholder="Cari nama/NIS..." class="border rounded-lg px-3 py-1 text-[12px] w-[160px]">
        </div>
      </div>
      <div style="overflow-x:auto;max-height:500px;overflow-y:auto;">
        <table class="w-full text-left" style="font-size:12px;">
          <thead style="position:sticky;top:0;background:#f7f9fc;font-size:11px;color:#64748b;text-transform:uppercase;"><tr><th style="padding:8px;">NIS/NISN</th><th style="padding:8px;">Nama</th><th style="padding:8px;">Kelas</th><th style="padding:8px;">JK</th><th style="padding:8px;">Status</th><th style="padding:8px;">Owner</th><th style="padding:8px;">Aksi</th></tr></thead>
          <tbody id="tbodySiswa"></tbody>
        </table>
      </div>
      <div style="margin-top:12px;padding:10px;background:#fff9c4;border:1px solid #ffec99;border-radius:8px;font-size:11px;">ℹ️ <b>Aturan Emas:</b> Data bisa di-load bebas di 18 sub fitur via <code>ServiceMenu.loadFromMaster('peserta_didik')</code> • Import otomatis addOwner</div>
    </div>

    <div style="display:flex;flex-direction:column;gap:12px;">
      <div class="card" style="background:white;border-radius:12px;border:1px solid #e8eef6;padding:16px;">
        <h4 style="font-weight:700;font-size:13px;margin-bottom:10px;">➕ Form Tambah Siswa - Auto-fill</h4>
        <div style="display:grid;gap:8px;">
          <input id="f_nis" placeholder="NIS (otomatis jika kosong)" class="border rounded-lg px-3 py-2 text-[12px]">
          <input id="f_nisn" placeholder="NISN" class="border rounded-lg px-3 py-2 text-[12px]">
          <input id="f_nama" placeholder="Nama Lengkap" class="border rounded-lg px-3 py-2 text-[12px]" required>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
            <select id="f_kelas" class="border rounded-lg px-3 py-2 text-[12px]"><option value="1">Kelas 1</option><option value="2">Kelas 2</option><option value="3">Kelas 3</option><option value="4">Kelas 4</option><option value="5">Kelas 5</option><option value="6">Kelas 6</option></select>
            <select id="f_jk" class="border rounded-lg px-3 py-2 text-[12px]"><option value="L">Laki-laki</option><option value="P">Perempuan</option></select>
          </div>
          <input id="f_ttl" placeholder="TTL (Bulukumba, 12 Jan 2018)" class="border rounded-lg px-3 py-2 text-[12px]">
          <input id="f_alamat" placeholder="Alamat" class="border rounded-lg px-3 py-2 text-[12px]">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
            <input id="f_ayah" placeholder="Nama Ayah" class="border rounded-lg px-3 py-2 text-[12px]">
            <input id="f_ibu" placeholder="Nama Ibu" class="border rounded-lg px-3 py-2 text-[12px]">
          </div>
          <div style="background:#f7f9fc;padding:8px;border-radius:8px;font-size:10px;"><b>Auto-fill:</b><br>Guru: ${auto.nama_guru}<br>NIP: ${auto.nip_guru}<br>Kepsek: ${auto.nama_kepsek}</div>
          <button id="btnSimpanSiswa" class="bg-[#0d3b66] text-white rounded-xl py-2.5 text-[12px] font-bold">💾 Simpan (addOwner otomatis)</button>
        </div>
      </div>

      <div class="card" style="background:white;border-radius:12px;border:1px solid #e8eef6;padding:16px;">
        <h4 style="font-weight:700;font-size:12px;margin-bottom:8px;">🖨️ Preview Kop untuk Absensi / Nilai</h4>
        <div id="previewKopSiswa" style="background:white;border:1px dashed #cbd5e1;border-radius:8px;padding:12px;font-size:11px;min-height:120px;">${kopHTML}</div>
        <button class="w-full mt-2 bg-[#ffcc00] rounded-lg py-2 text-[11px] font-bold" onclick="window.print()">🖨️ Cetak dengan Kop</button>
        <div style="margin-top:8px;font-size:10px;color:#64748b;">Kop diambil dari Master Data → Kop Administrasi</div>
      </div>
    </div>
  </div>
  `;

  function renderTable(list){
    const tbody = document.getElementById('tbodySiswa');
    if(!tbody) return;
    tbody.innerHTML = '';
    list.forEach(s=>{
      const isOwner = s.owner_email === ServiceMenu.getCurrentUser().email;
      const badgeOwner = isOwner ? `<span style="background:#e0f2fe;color:#0369a1;font-size:9px;padding:2px 6px;border-radius:8px;">Milik Saya</span>` : `<span style="font-size:9px;color:#64748b;">${s.owner_email ? s.owner_email.split('@')[0] : '-'}</span>`;
      tbody.innerHTML += `<tr style="border-bottom:1px solid #f1f5f9;">
        <td style="padding:8px;"><div style="font-weight:600;">${s.nis}</div><div style="font-size:10px;color:#64748b;">${s.nisn||'-'}</div></td>
        <td style="padding:8px;"><div style="font-weight:600;">${s.nama}</div><div style="font-size:10px;color:#64748b;">${s.ttl||''}</div></td>
        <td style="padding:8px;"><span style="background:#f1f5f9;padding:2px 8px;border-radius:12px;font-size:11px;">Kelas ${s.kelas}</span></td>
        <td style="padding:8px;">${s.jk}</td>
        <td style="padding:8px;"><span style="background:#dcfce7;color:#166534;padding:2px 8px;border-radius:12px;font-size:10px;font-weight:700;">${s.status}</span></td>
        <td style="padding:8px;">${badgeOwner}</td>
        <td style="padding:8px;"><div style="display:flex;gap:4px;"><button onclick="editSiswa(${s.id})" style="font-size:10px;background:#f1f5f9;padding:4px 8px;border-radius:6px;">✏️</button><button onclick="hapusSiswa(${s.id})" style="font-size:10px;background:#fef2f2;color:#dc2626;padding:4px 8px;border-radius:6px;">🗑️</button></div></td>
      </tr>`;
    });
    document.getElementById('totalSiswa').textContent = list.length;
    document.getElementById('totalKelas12').textContent = [...new Set(list.map(x=>x.kelas))].length + ' Rombel';
    document.getElementById('totalL').textContent = list.filter(x=>x.jk==='L').length;
    document.getElementById('totalP').textContent = list.filter(x=>x.jk==='P').length;
  }

  renderTable(ServiceMenu.isAdmin() ? siswaList : ServiceMenu.filterOwnerOnly(siswaList));

  function filterAndRender(){
    let filtered = siswaList;
    const k = document.getElementById('filterKelas').value;
    const jk = document.getElementById('filterJK').value;
    const q = document.getElementById('searchSiswa').value.toLowerCase();
    if(k) filtered = filtered.filter(s=>s.kelas===k);
    if(jk) filtered = filtered.filter(s=>s.jk===jk);
    if(q) filtered = filtered.filter(s=> s.nama.toLowerCase().includes(q) || s.nis.includes(q) || (s.nisn && s.nisn.includes(q)));
    if(!ServiceMenu.isAdmin()) filtered = ServiceMenu.filterOwnerOnly(filtered);
    renderTable(filtered);
  }

  document.getElementById('filterKelas').onchange = filterAndRender;
  document.getElementById('filterJK').onchange = filterAndRender;
  document.getElementById('searchSiswa').oninput = filterAndRender;

  // ===== IMPORT & TEMPLATE LOGIC =====
  function downloadTemplateCSV(){
    const headers = ['NIS','NISN','Nama','Kelas','JK','TTL','Alamat','Ayah','Ibu'];
    const example = [
      ['0004','0012345681','Budi Santoso','1','L','Bulukumba, 1 Jan 2018','Tritiro','Ahmad','Siti'],
      ['0005','0012345682','Ani Wijaya','1','P','Bulukumba, 2 Feb 2018','Kalumpang','Budi','Rina'],
      ['0006','0012345683','Rizki Pratama','2','L','Bulukumba, 3 Mar 2017','Bontotiro','Jamal','Fatimah']
    ];
    const kop = `# ${school.nama} - NPSN ${school.npsn} - ${school.alamat} - Tahun Ajaran ${school.tahunAjaran}`;
    const meta = `# Template Import Peserta Didik - SDN 134 Kalumpang - Dibuat oleh: ${auto.nama_guru} - NIP: ${auto.nip_guru} - ${new Date().toLocaleDateString('id-ID')}`;
    const rows = [headers].concat(example);
    const csv = [kop, meta, ''].concat(rows.map(r=>r.map(v=>`"${v}"`).join(','))).join('\n');
    const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href=url; a.download=`Template_Import_Peserta_Didik_SDN134_${school.tahunAjaran.replace('/','-')}.csv`; a.click();
  }

  function downloadTemplateXLSX(){
    // Buat XLSX sederhana via CSV yang bisa dibuka Excel, plus sheet instruksi
    const headers = ['NIS','NISN','Nama','Kelas','JK','TTL','Alamat','Ayah','Ibu','Status'];
    const example = [
      ['0004','0012345681','Budi Santoso','1','L','Bulukumba, 1 Jan 2018','Tritiro','Ahmad','Siti','Aktif'],
      ['0005','0012345682','Ani Wijaya','1','P','Bulukumba, 2 Feb 2018','Kalumpang','Budi','Rina','Aktif'],
      ['0006','0012345683','Rizki Pratama','2','L','Bulukumba, 3 Mar 2017','Bontotiro','Jamal','Fatimah','Aktif']
    ];
    const instruksi = [
      ['INSTRUKSI TEMPLATE IMPORT PESERTA DIDIK - SDN 134 KALUMPANG'],
      ['NPSN', school.npsn],
      ['Sekolah', school.nama],
      ['Alamat', school.alamat],
      ['Tahun Ajaran', school.tahunAjaran],
      ['Dibuat oleh', auto.nama_guru],
      ['NIP', auto.nip_guru],
      [''],
      ['Kolom Wajib: NIS,Nama,Kelas,JK'],
      ['JK: L atau P'],
      ['Kelas: 1-6'],
      ['Jangan hapus header baris pertama']
    ];
    // Gabung instruksi + data sebagai 2 sheet dalam 1 file via HTML table yang bisa dibuka Excel
    let html = `<html><head><meta charset="UTF-8"></head><body>`;
    html += `<table border="1"><tr><th colspan="10" style="background:#0d3b66;color:white;">TEMPLATE IMPORT PESERTA DIDIK - ${school.nama}</th></tr>`;
    instruksi.forEach(r=>{ html+=`<tr><td>${r[0]||''}</td><td>${r[1]||''}</td></tr>`; });
    html+=`</table><br>`;
    html+=`<table border="1"><tr>${headers.map(h=>`<th style="background:#ffcc00;">${h}</th>`).join('')}</tr>`;
    example.forEach(r=>{ html+=`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`; });
    html+=`</table></body></html>`;
    const blob = new Blob([html], {type:'application/vnd.ms-excel'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href=url; a.download=`Template_Import_SDN134_${school.tahunAjaran.replace('/','-')}.xls`; a.click();
  }

  document.getElementById('btnDownloadTemplate').onclick = downloadTemplateCSV;
  document.getElementById('btnDownloadTemplate2').onclick = downloadTemplateCSV;
  document.getElementById('btnDownloadTemplateXLSX').onclick = downloadTemplateXLSX;

  document.getElementById('btnImport').onclick = ()=>{
    document.getElementById('importPanel').style.display='block';
    document.getElementById('importPanel').scrollIntoView({behavior:'smooth'});
  };
  document.getElementById('btnBatalImport').onclick = ()=>{
    document.getElementById('importPanel').style.display='none';
    document.getElementById('fileImport').value='';
    document.getElementById('previewImport').style.display='none';
  };

  let parsedImportData = [];

  document.getElementById('btnProsesImport').onclick = ()=>{
    const fileInput = document.getElementById('fileImport');
    const file = fileInput.files[0];
    if(!file){ alert('Pilih file CSV/Excel terlebih dahulu!'); return; }
    
    const reader = new FileReader();
    reader.onload = function(e){
      const text = e.target.result;
      try{
        // Parse CSV sederhana
        let lines = text.split(/\r?\n/).filter(l=>l.trim() && !l.trim().startsWith('#'));
        if(lines.length<2){ alert('File kosong atau format salah! Pastikan ada header NIS,NISN,Nama,Kelas,JK...'); return; }
        
        // Deteksi delimiter
        const headerLine = lines[0].replace(/"/g,'');
        const delimiter = headerLine.includes(';') ? ';' : ',';
        const headers = headerLine.split(delimiter).map(h=>h.trim().toLowerCase());
        
        const idx = {
          nis: headers.indexOf('nis'),
          nisn: headers.indexOf('nisn'),
          nama: headers.indexOf('nama'),
          kelas: headers.indexOf('kelas'),
          jk: headers.indexOf('jk'),
          ttl: headers.indexOf('ttl'),
          alamat: headers.indexOf('alamat'),
          ayah: headers.indexOf('ayah'),
          ibu: headers.indexOf('ibu')
        };
        
        if(idx.nama===-1){ alert('Header Nama tidak ditemukan! Gunakan template resmi. Header wajib: NIS,NISN,Nama,Kelas,JK,TTL,Alamat,Ayah,Ibu'); return; }
        
        parsedImportData = [];
        for(let i=1;i<lines.length;i++){
          const line = lines[i];
          if(!line.trim()) continue;
          // Simple CSV split handling quotes
          const parts = line.split(delimiter).map(p=>p.replace(/^"|"$/g,'').trim());
          if(parts.length < 3) continue;
          const nama = parts[idx.nama] || '';
          if(!nama) continue;
          const obj = {
            nis: idx.nis>=0 ? parts[idx.nis] : (Date.now()+i).toString().slice(-4),
            nisn: idx.nisn>=0 ? parts[idx.nisn] : '',
            nama: nama,
            kelas: idx.kelas>=0 ? parts[idx.kelas] : '1',
            jk: idx.jk>=0 ? parts[idx.jk].toUpperCase().replace('LAKI','L').replace('PEREMPUAN','P').charAt(0) : 'L',
            ttl: idx.ttl>=0 ? parts[idx.ttl] : '',
            alamat: idx.alamat>=0 ? parts[idx.alamat] : '',
            ayah: idx.ayah>=0 ? parts[idx.ayah] : '',
            ibu: idx.ibu>=0 ? parts[idx.ibu] : '',
            status: 'Aktif'
          };
          // Validasi JK
          if(!['L','P'].includes(obj.jk)) obj.jk = 'L';
          // Validasi Kelas
          if(!['1','2','3','4','5','6'].includes(obj.kelas)) obj.kelas='1';
          parsedImportData.push(obj);
        }

        if(parsedImportData.length===0){ alert('Tidak ada data valid ditemukan!'); return; }

        // Preview
        const preview = document.getElementById('previewImport');
        preview.style.display='block';
        preview.innerHTML = `
          <div style="font-size:11px;font-weight:700;margin-bottom:6px;">✅ Preview ${parsedImportData.length} data akan diimport (Auto-fill Owner: ${auto.nama_guru})</div>
          <table style="width:100%;font-size:11px;border-collapse:collapse;"><thead><tr style="background:#f7f9fc;"><th style="padding:4px;border:1px solid #e2e8f0;">NIS</th><th style="padding:4px;border:1px solid #e2e8f0;">Nama</th><th style="padding:4px;border:1px solid #e2e8f0;">Kelas</th><th style="padding:4px;border:1px solid #e2e8f0;">JK</th></tr></thead>
          <tbody>${parsedImportData.slice(0,10).map(s=>`<tr><td style="padding:4px;border:1px solid #e2e8f0;">${s.nis}</td><td style="padding:4px;border:1px solid #e2e8f0;">${s.nama}</td><td style="padding:4px;border:1px solid #e2e8f0;">${s.kelas}</td><td style="padding:4px;border:1px solid #e2e8f0;">${s.jk}</td></tr>`).join('')}</tbody></table>
          ${parsedImportData.length>10 ? `<div style="font-size:10px;color:#64748b;margin-top:4px;">... dan ${parsedImportData.length-10} data lainnya</div>` : ''}
          <button id="btnSimpanImport" style="margin-top:10px;background:#16a34a;color:white;padding:8px 16px;border-radius:8px;font-size:12px;font-weight:700;width:100%;">💾 Simpan ${parsedImportData.length} Data ke Master Data</button>
        `;
        document.getElementById('btnSimpanImport').onclick = ()=>{
          let md = ServiceMenu.getMasterData();
          const withOwner = parsedImportData.map(d=> ServiceMenu.addOwner({ id: Date.now()+Math.random(), ...d }));
          md.peserta_didik = md.peserta_didik.concat(withOwner);
          // Batasi max 48 sesuai SDN 134, tapi tetap simpan semua jika admin mau
          if(md.peserta_didik.length > 100){
            if(!confirm(`Total data akan menjadi ${md.peserta_didik.length} siswa (melebihi 48). Lanjutkan?`)) return;
          }
          ServiceMenu.saveMasterData(md);
          siswaList = md.peserta_didik;
          renderTable(ServiceMenu.isAdmin() ? siswaList : ServiceMenu.filterOwnerOnly(siswaList));
          preview.innerHTML = `<div style="padding:10px;background:#dcfce7;border-radius:8px;font-size:12px;">✅ Berhasil import ${withOwner.length} siswa! Data sudah masuk Master Data dan bisa di-load di LCKH, LKPD, Absensi, Penilaian.</div>`;
          setTimeout(()=>{ document.getElementById('importPanel').style.display='none'; }, 2000);
        };

      } catch(err){
        alert('Gagal parse file: '+err.message);
        console.error(err);
      }
    };
    
    // Untuk xlsx, kita baca sebagai text juga (user bisa save as CSV dari Excel)
    if(file.name.endsWith('.xlsx') || file.name.endsWith('.xls')){
      alert('Untuk Excel .xlsx/.xls, silahkan Save As → CSV (Comma delimited) di Excel terlebih dahulu, lalu upload file CSV nya. Atau gunakan Template XLS yang kami sediakan (format HTML table yang bisa dibuka Excel).');
    }
    reader.readAsText(file);
  };

  window.hapusSiswa = function(id){
    if(!confirm('Hapus siswa ini?')) return;
    let md = ServiceMenu.getMasterData();
    md.peserta_didik = md.peserta_didik.filter(s=>s.id!==id);
    ServiceMenu.saveMasterData(md);
    siswaList = md.peserta_didik;
    renderTable(ServiceMenu.isAdmin() ? siswaList : ServiceMenu.filterOwnerOnly(siswaList));
  };

  window.editSiswa = function(id){
    const s = siswaList.find(x=>x.id===id);
    if(!s) return;
    document.getElementById('f_nis').value = s.nis;
    document.getElementById('f_nisn').value = s.nisn||'';
    document.getElementById('f_nama').value = s.nama;
    document.getElementById('f_kelas').value = s.kelas;
    document.getElementById('f_jk').value = s.jk;
    document.getElementById('f_ttl').value = s.ttl||'';
    document.getElementById('f_alamat').value = s.alamat||'';
    document.getElementById('f_ayah').value = s.ayah||'';
    document.getElementById('f_ibu').value = s.ibu||'';
    document.getElementById('f_nama').dataset.editId = id;
    document.getElementById('btnSimpanSiswa').textContent = '💾 Update Siswa';
  };

  document.getElementById('btnSimpanSiswa').onclick = function(){
    const nama = document.getElementById('f_nama').value.trim();
    if(!nama){ alert('Nama wajib!'); return; }
    const obj = {
      nis: document.getElementById('f_nis').value.trim() || Date.now().toString().slice(-4),
      nisn: document.getElementById('f_nisn').value.trim(),
      nama: nama,
      kelas: document.getElementById('f_kelas').value,
      jk: document.getElementById('f_jk').value,
      ttl: document.getElementById('f_ttl').value.trim(),
      alamat: document.getElementById('f_alamat').value.trim(),
      ayah: document.getElementById('f_ayah').value.trim(),
      ibu: document.getElementById('f_ibu').value.trim(),
      status: 'Aktif'
    };
    let md = ServiceMenu.getMasterData();
    const editId = document.getElementById('f_nama').dataset.editId;
    if(editId){
      const idx = md.peserta_didik.findIndex(s=>s.id==editId);
      if(idx>=0) md.peserta_didik[idx] = { ...md.peserta_didik[idx], ...obj };
      delete document.getElementById('f_nama').dataset.editId;
      document.getElementById('btnSimpanSiswa').textContent = '💾 Simpan (addOwner otomatis)';
    } else {
      md.peserta_didik.push(ServiceMenu.addOwner({ id: Date.now(), ...obj }));
    }
    ServiceMenu.saveMasterData(md);
    siswaList = md.peserta_didik;
    renderTable(ServiceMenu.isAdmin() ? siswaList : ServiceMenu.filterOwnerOnly(siswaList));
    ['f_nis','f_nisn','f_nama','f_ttl','f_alamat','f_ayah','f_ibu'].forEach(id=>document.getElementById(id).value='');
  };

  document.getElementById('btnExportSiswa').onclick = function(){
    // EXPORT RAPI - Excel HTML Table (bukan CSV) - Kolom terpisah otomatis, tanpa Owner
    const headers = ['NIS','NISN','Nama Lengkap','Kelas','JK','Tempat Tgl Lahir','Alamat','Nama Ayah','Nama Ibu','Status'];
    const kopText = `${school.nama} - NPSN ${school.npsn} - ${school.alamat} - Kab. Bulukumba - Tahun Ajaran ${school.tahunAjaran}`;
    const dibuatOleh = `Dibuat oleh: ${auto.nama_guru} - NIP: ${auto.nip_guru} - Tanggal: ${new Date().toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'})}`;
    
    let html = `<html><head><meta charset="UTF-8"></head><body>`;
    html += `<table border="0" style="width:100%;font-family:Arial;"><tr><td colspan="10" style="text-align:center;font-weight:bold;font-size:14px;">${school.nama.toUpperCase()}</td></tr>`;
    html += `<tr><td colspan="10" style="text-align:center;font-size:11px;">${school.alamat} - NPSN ${school.npsn} - Akreditasi ${school.akreditasi}</td></tr>`;
    html += `<tr><td colspan="10" style="text-align:center;font-size:11px;">${kopText}</td></tr>`;
    html += `<tr><td colspan="10" style="text-align:center;font-size:11px;">${dibuatOleh}</td></tr>`;
    html += `<tr><td colspan="10"></td></tr></table>`;
    
    html += `<table border="1" style="border-collapse:collapse;width:100%;font-family:Arial;font-size:11px;">`;
    html += `<tr style="background:#0d3b66;color:white;font-weight:bold;">${headers.map(h=>`<th style="padding:8px;background:#0d3b66;color:white;border:1px solid #000;">${h}</th>`).join('')}</tr>`;
    
    siswaList.forEach(s=>{
      html += `<tr>
        <td style="padding:6px;border:1px solid #000;">${s.nis||''}</td>
        <td style="padding:6px;border:1px solid #000;">${s.nisn||''}</td>
        <td style="padding:6px;border:1px solid #000;">${s.nama||''}</td>
        <td style="padding:6px;border:1px solid #000;text-align:center;">${s.kelas||''}</td>
        <td style="padding:6px;border:1px solid #000;text-align:center;">${s.jk||''}</td>
        <td style="padding:6px;border:1px solid #000;">${s.ttl||''}</td>
        <td style="padding:6px;border:1px solid #000;">${s.alamat||''}</td>
        <td style="padding:6px;border:1px solid #000;">${s.ayah||''}</td>
        <td style="padding:6px;border:1px solid #000;">${s.ibu||''}</td>
        <td style="padding:6px;border:1px solid #000;text-align:center;">${s.status||'Aktif'}</td>
      </tr>`;
    });
    
    html += `</table>`;
    html += `<br><table border="0" style="font-size:11px;"><tr><td>Total Siswa:</td><td><b>${siswaList.length} Siswa</b></td></tr><tr><td>Laki-laki:</td><td>${siswaList.filter(x=>x.jk==='L').length}</td></tr><tr><td>Perempuan:</td><td>${siswaList.filter(x=>x.jk==='P').length}</td></tr></table>`;
    html += `</body></html>`;
    
    const blob = new Blob([html], {type:'application/vnd.ms-excel;charset=utf-8;'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); 
    a.href=url; 
    a.download=`Data_Peserta_Didik_SDN134_${school.tahunAjaran.replace('/','-')}_${new Date().toISOString().slice(0,10)}.xls`; 
    a.click();
    URL.revokeObjectURL(url);
  };

  document.getElementById('btnTambahSiswa').onclick = ()=>{ document.getElementById('f_nama').focus(); };
};

window['init_data-peserta-didik'] = window.init_data_peserta_didik;
window.init_peserta_didik = window.init_data_peserta_didik;
window['init_peserta-didik'] = window.init_data_peserta_didik;
window.init_data_peserta_didik_js = window.init_data_peserta_didik;
