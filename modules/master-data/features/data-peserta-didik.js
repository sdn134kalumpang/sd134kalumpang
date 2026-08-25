// modules/master-data/features/data-peserta-didik.js - DATA PESERTA DIDIK
// Rujukan: aturan_dan_pola.docx - Master Data, Auto-fill, Load bebas, Owner, Kop
// Path repo: modules/master-data/index.html?fitur=data-peserta-didik
// File JS: modules/master-data/features/data-peserta-didik.js dan modules/master-data/data-peserta-didik.js

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

  // Load from Master Data, if empty use default
  let siswaList = md.peserta_didik && md.peserta_didik.length ? md.peserta_didik : defaultSiswa;
  // Simpan default jika belum ada
  if(!md.peserta_didik || !md.peserta_didik.length){
    md.peserta_didik = siswaList;
    ServiceMenu.saveMasterData(md);
  }

  const filterOwner = ServiceMenu.isAdmin() ? siswaList : ServiceMenu.filterOwnerOnly(siswaList);

  container.innerHTML = `
  <div class="welcome-banner" style="background:linear-gradient(135deg,#0f172a,#1e3a8a);">
    <div><h1 style="color:white;">🎓 Data Peserta Didik - 48 Siswa</h1><p style="color:rgba(255,255,255,0.7);">Master Data • Auto-fill: ${auto.nama_guru} • Kepsek: ${auto.nama_kepsek} • Kop: ${md.kop?.nama_sekolah || school.nama}</p></div>
    <div class="welcome-actions">
      <button class="btn btn-light" id="btnExportSiswa">📥 Export Excel</button>
      <button class="btn btn-accent" id="btnTambahSiswa">+ Tambah Siswa</button>
    </div>
  </div>

  <div class="kpi-grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px;">
    <div class="kpi-card" style="padding:16px;background:white;border-radius:12px;border:1px solid #e8eef6;"><div style="font-size:11px;color:#64748b;">TOTAL SISWA</div><h3 style="font-size:22px;font-weight:800;margin:4px 0;" id="totalSiswa">0</h3><div style="font-size:11px;color:#0d3b66;">NPSN ${school.npsn}</div></div>
    <div class="kpi-card" style="padding:16px;background:white;border-radius:12px;border:1px solid #e8eef6;"><div style="font-size:11px;color:#64748b;">KELAS 1-3</div><h3 style="font-size:22px;font-weight:800;margin:4px 0;" id="totalKelas12">0</h3><div style="font-size:11px;color:#0d3b66;">Rombel Aktif</div></div>
    <div class="kpi-card" style="padding:16px;background:white;border-radius:12px;border:1px solid #e8eef6;"><div style="font-size:11px;color:#64748b;">LAKI-LAKI</div><h3 style="font-size:22px;font-weight:800;margin:4px 0;" id="totalL">0</h3><div style="font-size:11px;color:#0d3b66;">${school.nama}</div></div>
    <div class="kpi-card" style="padding:16px;background:white;border-radius:12px;border:1px solid #e8eef6;"><div style="font-size:11px;color:#64748b;">PEREMPUAN</div><h3 style="font-size:22px;font-weight:800;margin:4px 0;" id="totalP">0</h3><div style="font-size:11px;color:#0d3b66;">Owner: ${ServiceMenu.isAdmin() ? 'Admin lihat semua' : 'Hanya milik sendiri'}</div></div>
  </div>

  <div class="two-col" style="display:grid;grid-template-columns:1fr 360px;gap:16px;">
    <div class="card" style="background:white;border-radius:12px;border:1px solid #e8eef6;padding:16px;">
      <div class="card-head" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
        <h3>📋 Daftar Peserta Didik - Load Master Data</h3>
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
      <div style="margin-top:12px;padding:10px;background:#fff9c4;border:1px solid #ffec99;border-radius:8px;font-size:11px;">ℹ️ <b>Aturan Emas:</b> Data bisa di-load bebas di 18 sub fitur administrasi guru via <code>ServiceMenu.loadFromMaster('peserta_didik')</code> • Owner Only aktif untuk non-admin</div>
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
          <div style="background:#f7f9fc;padding:8px;border-radius:8px;font-size:10px;"><b>Auto-fill:</b><br>Guru: ${auto.nama_guru}<br>NIP: ${auto.nip_guru}<br>Kepsek: ${auto.nama_kepsek}<br>Sekolah: ${auto.nama_sekolah}</div>
          <button id="btnSimpanSiswa" class="bg-[#0d3b66] text-white rounded-xl py-2.5 text-[12px] font-bold">💾 Simpan (addOwner otomatis)</button>
        </div>
      </div>

      <div class="card" style="background:white;border-radius:12px;border:1px solid #e8eef6;padding:16px;">
        <h4 style="font-weight:700;font-size:12px;margin-bottom:8px;">🖨️ Preview Kop untuk Absensi / Nilai</h4>
        <div id="previewKopSiswa" style="background:white;border:1px dashed #cbd5e1;border-radius:8px;padding:12px;font-size:11px;min-height:120px;">${kopHTML}</div>
        <button class="w-full mt-2 bg-[#ffcc00] rounded-lg py-2 text-[11px] font-bold" onclick="window.print()">🖨️ Cetak dengan Kop</button>
        <div style="margin-top:8px;font-size:10px;color:#64748b;">Kop diambil dari Master Data → Kop Administrasi yang sudah kamu buat sebelumnya.</div>
      </div>
    </div>
  </div>

  <div class="card" style="margin-top:16px;background:white;border-radius:12px;border:1px solid #e8eef6;padding:16px;">
    <h4 style="font-weight:700;font-size:13px;margin-bottom:8px;">🔗 Koneksi ke 18 Sub Fitur Administrasi Guru</h4>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;font-size:11px;">
      <div style="padding:8px;background:#f0fdf4;border-radius:8px;border:1px solid #bbf7d0;">📘 LCKH → load peserta_didik untuk presensi</div>
      <div style="padding:8px;background:#f0fdf4;border-radius:8px;border:1px solid #bbf7d0;">📗 LKPD → load peserta_didik untuk kelompok</div>
      <div style="padding:8px;background:#f0fdf4;border-radius:8px;border:1px solid #bbf7d0;">⭐ Penilaian → load peserta_didik untuk nilai</div>
      <div style="padding:8px;background:#f0fdf4;border-radius:8px;border:1px solid #bbf7d0;">🕒 Absensi → load peserta_didik untuk hadir</div>
      <div style="padding:8px;background:#f0fdf4;border-radius:8px;border:1px solid #bbf7d0;">📊 KKTP → load peserta_didik untuk analisis</div>
      <div style="padding:8px;background:#f0fdf4;border-radius:8px;border:1px solid #bbf7d0;">📓 Jurnal → load peserta_didik untuk materi</div>
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
        <td style="padding:8px;"><span style="background:${s.status==='Aktif'?'#dcfce7':'#fef9c3'};color:${s.status==='Aktif'?'#166534':'#854d0e'};padding:2px 8px;border-radius:12px;font-size:10px;font-weight:700;">${s.status}</span></td>
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

  window.hapusSiswa = function(id){
    if(!confirm('Hapus siswa ini? Data akan hilang dari Master Data dan tidak bisa di-load di 18 sub fitur!')) return;
    let md = ServiceMenu.getMasterData();
    md.peserta_didik = md.peserta_didik.filter(s=>s.id!==id);
    ServiceMenu.saveMasterData(md);
    siswaList = md.peserta_didik;
    filterAndRender();
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
    window.scrollTo({top:0, behavior:'smooth'});
  };

  document.getElementById('btnSimpanSiswa').onclick = function(){
    const nama = document.getElementById('f_nama').value.trim();
    if(!nama){ alert('Nama wajib diisi!'); return; }
    const nisInput = document.getElementById('f_nis').value.trim() || (Date.now().toString().slice(-4));
    const obj = {
      nis: nisInput,
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
      if(idx>=0){
        md.peserta_didik[idx] = { ...md.peserta_didik[idx], ...obj };
        delete document.getElementById('f_nama').dataset.editId;
        document.getElementById('btnSimpanSiswa').textContent = '💾 Simpan (addOwner otomatis)';
      }
    } else {
      const withOwner = ServiceMenu.addOwner({ id: Date.now(), ...obj });
      md.peserta_didik.push(withOwner);
    }
    ServiceMenu.saveMasterData(md);
    siswaList = md.peserta_didik;
    filterAndRender();
    document.getElementById('f_nis').value=''; document.getElementById('f_nisn').value=''; document.getElementById('f_nama').value=''; document.getElementById('f_ttl').value=''; document.getElementById('f_alamat').value=''; document.getElementById('f_ayah').value=''; document.getElementById('f_ibu').value='';
    alert('✅ Data peserta didik disimpan ke Master Data! Bisa langsung di-load di LCKH, LKPD, Absensi, Penilaian via ServiceMenu.loadFromMaster()');
  };

  document.getElementById('btnExportSiswa').onclick = function(){
    const rows = [['NIS','NISN','Nama','Kelas','JK','TTL','Alamat','Ayah','Ibu','Status','Owner']].concat(siswaList.map(s=>[s.nis,s.nisn,s.nama,s.kelas,s.jk,s.ttl,s.alamat,s.ayah,s.ibu,s.status,s.owner_email||'']));
    const csv = rows.map(r=>r.map(v=>`"${(v||'').toString().replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([kopHTML.replace(/<[^>]*>/g,'')+'\n'+csv], {type:'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href=url; a.download='data-peserta-didik-sdn134-'+new Date().toISOString().slice(0,10)+'.csv'; a.click();
  };

  document.getElementById('btnTambahSiswa').onclick = ()=>{ document.getElementById('f_nama').focus(); };
};

// Alias for main.js loader compatibility
window.init_data_peserta_didik_js = window.init_data_peserta_didik;
