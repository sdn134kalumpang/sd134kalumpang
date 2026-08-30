// modules/master-data/features/data-mapel.js - DATA MAPEL + WARNA + ICON + FIRESTORE SYNC
// Path: /sd134kalumpang/modules/master-data/features/data-mapel.js
// Rujukan: jadwal.js fallback dataMapel + image_018617.png error fix + dashboard image_f9b60e.png Master Data 8 fitur

window.init_data_mapel = window.init_data_mapel || function(container){
  const md = ServiceMenu.getMasterData();
  const school = ServiceMenu.getSchoolInfo();
  const auto = ServiceMenu.getAutoFillProfile ? ServiceMenu.getAutoFillProfile() : { nama_guru: 'Guru', nip_guru: '-' };

  const DEFAULT_MAPEL = [
    { id: 'paibd', nama: 'Pendidikan Agama Islam dan Budi Pekerti', singkatan: 'PAIBD', icon: '🕌', warna: '#84cc16', kelas: '1-6', jam_minggu: 3 },
    { id: 'pendidikan-pancasila', nama: 'Pendidikan Pancasila', singkatan: 'Pancasila', icon: '🇮🇩', warna: '#f97316', kelas: '1-6', jam_minggu: 3 },
    { id: 'bahasa-indonesia', nama: 'Bahasa Indonesia', singkatan: 'Bhs.Indonesia', icon: '📖', warna: '#10b981', kelas: '1-6', jam_minggu: 6 },
    { id: 'matematika', nama: 'Matematika', singkatan: 'Matematika', icon: '🔢', warna: '#3b82f6', kelas: '1-6', jam_minggu: 6 },
    { id: 'ipas', nama: 'IPAS', singkatan: 'IPAS', icon: '🔬', warna: '#f59e0b', kelas: '1-6', jam_minggu: 5 },
    { id: 'pjok', nama: 'PJOK', singkatan: 'PJOK', icon: '⚽', warna: '#ef4444', kelas: '1-6', jam_minggu: 3 },
    { id: 'seni-budaya', nama: 'Seni dan Budaya', singkatan: 'Seni Budaya', icon: '🎨', warna: '#ec4899', kelas: '1-6', jam_minggu: 3 },
    { id: 'bahasa-inggris', nama: 'Bahasa Inggris', singkatan: 'Bhs.Inggris', icon: '🇬🇧', warna: '#06b6d4', kelas: '1-6', jam_minggu: 2 },
    { id: 'bahasa-ibu', nama: 'Bahasa Ibu (Bugis/Makassar)', singkatan: 'Bhs.Ibu', icon: '🗣️', warna: '#8b5cf6', kelas: '1-6', jam_minggu: 2 },
    { id: 'coding-kka', nama: 'Coding dan Kecerdasan Artifisial', singkatan: 'Coding/KKA', icon: '💻', warna: '#0f172a', kelas: '4-6', jam_minggu: 2 },
    { id: 'bta', nama: 'Baca Tulis Al-Qur\'an', singkatan: 'BTA', icon: '📿', warna: '#10b981', kelas: '1-6', jam_minggu: 2 }
  ];

  let mapelList = (md.mapel && md.mapel.length) ? md.mapel : DEFAULT_MAPEL;
  if(!md.mapel || !md.mapel.length){
    md.mapel = mapelList;
    ServiceMenu.saveMasterData(md);
  }

  // Warna mapel default dari jadwal.js
  const warnaMapelDefault = {
    'Matematika': '#3b82f6',
    'Bahasa Indonesia': '#10b981',
    'IPA': '#f59e0b',
    'IPS': '#8b5cf6',
    'PJOK': '#ef4444',
    'Seni Budaya': '#ec4899',
    'Bahasa Inggris': '#06b6d4',
    'Agama': '#84cc16',
    'PKn': '#f97316',
    'PAIBD': '#84cc16',
    'IPAS': '#f59e0b',
    '': '#94a3b8'
  };

  function renderTable(list){
    const filtered = ServiceMenu.isAdmin() ? list : ServiceMenu.filterOwnerOnly(list);
    const tbody = document.getElementById('mapelTableBody');
    if(!tbody) return;
    document.getElementById('totalMapel').textContent = list.length;
    document.getElementById('totalJam').textContent = list.reduce((a,b)=>a+(parseInt(b.jam_minggu)||0),0) + ' JP';
    document.getElementById('totalKelas').textContent = '1-6';
    
    tbody.innerHTML = filtered.map((m, idx)=>`
      <tr style="border-bottom:1px solid #f1f5f9;">
        <td style="padding:10px 12px;font-size:12px;">${idx+1}</td>
        <td style="padding:10px 12px;"><div style="display:flex;align-items:center;gap:8px;"><div style="width:32px;height:32px;border-radius:8px;background:${m.warna || warnaMapelDefault[m.singkatan] || '#f1f5f9'};display:flex;align-items:center;justify-content:center;">${m.icon||'📚'}</div><div><div style="font-weight:700;font-size:12px;">${m.nama}</div><div style="font-size:10px;color:#64748b;">${m.singkatan} • ID: ${m.id}</div></div></div></td>
        <td style="padding:10px 12px;font-size:12px;"><span style="background:${m.warna||'#f1f5f9'};color:${m.warna && m.warna!=='#f1f5f9' ? 'white' : '#0f172a'};padding:4px 8px;border-radius:12px;font-size:10px;font-weight:700;">${m.singkatan}</span></td>
        <td style="padding:10px 12px;font-size:12px;text-align:center;">${m.kelas||'1-6'}</td>
        <td style="padding:10px 12px;font-size:12px;text-align:center;font-weight:700;">${m.jam_minggu||'-'} JP</td>
        <td style="padding:10px 12px;font-size:10px;color:#64748b;">${m.owner_nama||'-'}<br>${m.owner_email?m.owner_email.split('@')[0]:''}</td>
        <td style="padding:10px 12px;"><div style="display:flex;gap:6px;"><button onclick="editMapel('${m.id}')" style="background:#f1f5f9;padding:6px 10px;border-radius:8px;font-size:11px;">✏️</button><button onclick="hapusMapel('${m.id}')" style="background:#fff1f1;color:#dc2626;padding:6px 10px;border-radius:8px;font-size:11px;">🗑️</button></div></td>
      </tr>
    `).join('');
    
    if(!filtered.length){
      tbody.innerHTML = `<tr><td colspan="7" style="padding:20px;text-align:center;color:#94a3b8;font-size:12px;">Belum ada data mapel. Klik + Tambah Mapel atau pakai default 11 mapel SDN 134 Kalumpang.</td></tr>`;
    }
  }

  container.innerHTML = `
  <div class="welcome-banner" style="background:linear-gradient(135deg,#0f172a,#1e3a8a);border-radius:16px;padding:20px;color:white;margin-bottom:16px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
   <div><h1 style="color:white;font-size:18px;font-weight:800;">📚 Data Mata Pelajaran - ${school.nama}</h1><p style="color:rgba(255,255,255,0.7);font-size:11px;margin-top:4px;">Master Data • 11 Mapel Kurikulum Merdeka • Untuk Dropdown Jadwal Pembelajaran + Bel • NPSN ${school.npsn}</p><p style="color:rgba(255,255,255,0.5);font-size:10px;margin-top:4px;">Auto-fill: ${auto.nama_guru||'Guru'} • Kepsek: ${auto.nama_kepsek||'-'} • Sumber: assets/data-mapel.json + jadwal.js fallback</p></div>
   <div style="display:flex;gap:8px;flex-wrap:wrap;">
     <button id="btnExportMapel" style="background:white;color:#0d3b66;padding:8px 16px;border-radius:20px;font-size:12px;font-weight:700;">📊 Export Excel</button>
     <button id="btnTambahMapel" style="background:#ffcc00;color:#0d3b66;padding:8px 16px;border-radius:20px;font-size:12px;font-weight:700;">+ Tambah Mapel</button>
   </div>
  </div>

  <div class="kpi-grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:16px;">
   <div class="kpi-card" style="padding:16px;background:white;border-radius:12px;border:1px solid #e8eef6;"><div style="font-size:11px;color:#64748b;">TOTAL MAPEL</div><h3 style="font-size:22px;font-weight:800;margin:4px 0;" id="totalMapel">0</h3><div style="font-size:11px;color:#0d3b66;">Kurikulum Merdeka</div></div>
   <div class="kpi-card" style="padding:16px;background:white;border-radius:12px;border:1px solid #e8eef6;"><div style="font-size:11px;color:#64748b;">TOTAL JP / MINGGU</div><h3 style="font-size:22px;font-weight:800;margin:4px 0;" id="totalJam">0 JP</h3><div style="font-size:11px;color:#0d3b66;">Kelas 1-6</div></div>
   <div class="kpi-card" style="padding:16px;background:white;border-radius:12px;border:1px solid #e8eef6;"><div style="font-size:11px;color:#64748b;">KELAS</div><h3 style="font-size:22px;font-weight:800;margin:4px 0;" id="totalKelas">1-6</h3><div style="font-size:11px;color:#0d3b66;">Owner: ${ServiceMenu.isAdmin() ? 'Admin lihat semua' : 'Hanya milik sendiri'}</div></div>
  </div>

  <div class="two-col" style="display:grid;grid-template-columns:1fr 360px;gap:16px;">
   <div class="card" style="background:white;border-radius:12px;border:1px solid #e8eef6;padding:16px;">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
     <h3 style="font-weight:700;font-size:13px;">📚 Daftar Mata Pelajaran</h3>
     <input id="searchMapel" placeholder="Cari mapel..." style="border:1px solid #e2e8f0;border-radius:20px;padding:6px 12px;font-size:11px;width:180px;">
    </div>
    <div style="overflow-x:auto;max-height:520px;">
     <table style="width:100%;border-collapse:collapse;"><thead style="background:#f8fafc;text-align:left;font-size:11px;color:#64748b;"><tr><th style="padding:8px 12px;">No</th><th style="padding:8px 12px;">Nama Mapel</th><th style="padding:8px 12px;">Singkatan</th><th style="padding:8px 12px;text-align:center;">Kelas</th><th style="padding:8px 12px;text-align:center;">JP</th><th style="padding:8px 12px;">Owner</th><th style="padding:8px 12px;">Aksi</th></tr></thead><tbody id="mapelTableBody"></tbody></table>
    </div>
   </div>
   <div class="card" style="background:white;border-radius:12px;border:1px solid #e8eef6;padding:16px;">
    <h3 style="font-weight:700;font-size:13px;margin-bottom:12px;">➕ Form Mapel</h3>
    <div style="display:flex;flex-direction:column;gap:10px;">
     <div><label style="font-size:11px;font-weight:700;">ID Mapel (huruf kecil, tanpa spasi)</label><input id="f_id" placeholder="contoh: matematika" style="width:100%;border:1px solid #e2e8f0;border-radius:8px;padding:8px;font-size:12px;margin-top:4px;"></div>
     <div><label style="font-size:11px;font-weight:700;">Nama Lengkap Mapel</label><input id="f_nama" placeholder="Matematika" style="width:100%;border:1px solid #e2e8f0;border-radius:8px;padding:8px;font-size:12px;margin-top:4px;"></div>
     <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
      <div><label style="font-size:11px;font-weight:700;">Singkatan</label><input id="f_singkatan" placeholder="Matematika" style="width:100%;border:1px solid #e2e8f0;border-radius:8px;padding:8px;font-size:12px;margin-top:4px;"></div>
      <div><label style="font-size:11px;font-weight:700;">Icon (emoji)</label><input id="f_icon" placeholder="🔢" style="width:100%;border:1px solid #e2e8f0;border-radius:8px;padding:8px;font-size:12px;margin-top:4px;"></div>
     </div>
     <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
      <div><label style="font-size:11px;font-weight:700;">Warna (hex)</label><input id="f_warna" type="color" value="#3b82f6" style="width:100%;height:36px;border:1px solid #e2e8f0;border-radius:8px;margin-top:4px;"></div>
      <div><label style="font-size:11px;font-weight:700;">Kelas</label><select id="f_kelas" style="width:100%;border:1px solid #e2e8f0;border-radius:8px;padding:8px;font-size:12px;margin-top:4px;"><option value="1-6">1-6 (Semua)</option><option value="1-3">1-3 (Fase A-B)</option><option value="4-6">4-6 (Fase C)</option></select></div>
     </div>
     <div><label style="font-size:11px;font-weight:700;">Jam Pelajaran / Minggu (JP)</label><input id="f_jp" type="number" placeholder="3" style="width:100%;border:1px solid #e2e8f0;border-radius:8px;padding:8px;font-size:12px;margin-top:4px;"></div>
     <button id="btnSimpanMapel" style="background:#0f2f1e;color:white;padding:10px;border-radius:10px;font-size:12px;font-weight:700;margin-top:8px;">💾 Simpan (addOwner otomatis)</button>
     <button id="btnResetForm" style="background:#f1f5f9;padding:8px;border-radius:8px;font-size:11px;">Reset Form</button>
    </div>
    <div style="margin-top:16px;padding:12px;background:#f7f9fc;border-radius:8px;">
     <div style="font-size:11px;font-weight:700;">ℹ️ Info:</div>
     <div style="font-size:10px;color:#64748b;margin-top:4px;line-height:1.5;">
      • Data ini dipakai di <b>modules/admin-pembelajaran/features/jadwal.js</b> untuk dropdown mapel<br>
      • Warna dipakai di kalender jadwal<br>
      • Icon emoji tampil di jadwal + bel<br>
      • Disimpan di <code>localStorage master_data.mapel</code> + Firestore <code>schools/40312947/mapel</code> jika enabled<br>
      • Default 11 mapel sesuai Kurikulum Merdeka SDN 134 Kalumpang
     </div>
    </div>
   </div>
  </div>
  `;

  // Initial render
  renderTable(mapelList);

  // Search
  document.getElementById('searchMapel').addEventListener('input', (e)=>{
    const q = e.target.value.toLowerCase();
    const filtered = mapelList.filter(m=> (m.nama+m.singkatan+m.id).toLowerCase().includes(q));
    renderTable(filtered);
  });

  // Reset
  document.getElementById('btnResetForm').onclick = ()=>{
    ['f_id','f_nama','f_singkatan','f_icon','f_jp'].forEach(id=>document.getElementById(id).value='');
    document.getElementById('f_kelas').value='1-6';
    document.getElementById('f_warna').value='#3b82f6';
    delete document.getElementById('f_nama').dataset.editId;
    document.getElementById('btnSimpanMapel').textContent='💾 Simpan (addOwner otomatis)';
  };

  // Simpan
  document.getElementById('btnSimpanMapel').onclick = async function(){
    const id = document.getElementById('f_id').value.trim().toLowerCase().replace(/[^a-z0-9-]/g,'-');
    const nama = document.getElementById('f_nama').value.trim();
    if(!id || !nama){ alert('ID dan Nama wajib!'); return; }
    const obj = {
      id: id,
      nama: nama,
      singkatan: document.getElementById('f_singkatan').value.trim() || nama,
      icon: document.getElementById('f_icon').value.trim() || '📚',
      warna: document.getElementById('f_warna').value,
      kelas: document.getElementById('f_kelas').value,
      jam_minggu: parseInt(document.getElementById('f_jp').value) || 2
    };

    let md = ServiceMenu.getMasterData();
    if(!md.mapel) md.mapel = [];
    const editId = document.getElementById('f_nama').dataset.editId;
    if(editId){
      const idx = md.mapel.findIndex(m=> String(m.id)===String(editId));
      if(idx>=0) md.mapel[idx] = { ...md.mapel[idx], ...obj };
      delete document.getElementById('f_nama').dataset.editId;
      document.getElementById('btnSimpanMapel').textContent='💾 Simpan (addOwner otomatis)';
    }else{
      // cek duplikat id
      if(md.mapel.some(m=> m.id===id)){ alert('ID sudah ada! Pakai ID lain atau edit yang ada.'); return; }
      md.mapel.push(ServiceMenu.addOwner({ ...obj }));
    }

    ServiceMenu.saveMasterData(md);
    mapelList = md.mapel;

    // Firestore sync
    if(window.FirebaseService && FirebaseService.isEnabled()){
      try{
        if(editId){
          await FirebaseService.update('mapel', editId, obj);
        }else{
          await FirebaseService.add('mapel', obj);
        }
      }catch(e){ console.warn('Firestore mapel sync failed', e); }
    }

    renderTable(mapelList);
    ['f_id','f_nama','f_singkatan','f_icon','f_jp'].forEach(id=>document.getElementById(id).value='');
    document.getElementById('f_kelas').value='1-6';
    document.getElementById('f_warna').value='#3b82f6';
  };

  document.getElementById('btnTambahMapel').onclick = ()=>{ document.getElementById('f_nama').focus(); };

  document.getElementById('btnExportMapel').onclick = function(){
    const headers = ['ID','Nama Lengkap','Singkatan','Icon','Warna','Kelas','JP/Minggu','Owner'];
    let csv = headers.join(',')+'\n';
    mapelList.forEach(m=>{
      csv += [m.id, `"${m.nama}"`, m.singkatan, m.icon, m.warna, m.kelas, m.jam_minggu, m.owner_email||''].join(',')+'\n';
    });
    const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href=url; a.download=`Data_Mapel_SDN134_${new Date().toISOString().slice(0,10)}.csv`; a.click(); URL.revokeObjectURL(url);
  };

  // Load dari Firestore jika enabled
  if(window.FirebaseService && FirebaseService.isEnabled()){
    FirebaseService.getAll('mapel').then(list=>{
      if(list && list.length){
        mapelList = list;
        renderTable(mapelList);
        // sync ke local
        let md = ServiceMenu.getMasterData();
        md.mapel = list;
        ServiceMenu.saveMasterData(md);
      }
    }).catch(()=>{});
  }
};

window.hapusMapel = function(id){
  if(!confirm('Hapus mapel '+id+'? Data jadwal yang pakai mapel ini akan perlu update.')) return;
  let md = ServiceMenu.getMasterData();
  md.mapel = (md.mapel||[]).filter(m=> String(m.id)!==String(id));
  ServiceMenu.saveMasterData(md);
  if(window.FirebaseService && FirebaseService.isEnabled()){
    FirebaseService.delete('mapel', id, id).catch(()=>{});
  }
  const container = document.getElementById('mainContent');
  if(container && window.init_data_mapel) window.init_data_mapel(container);
};

window.editMapel = function(id){
  const md = ServiceMenu.getMasterData();
  const m = (md.mapel||[]).find(x=> String(x.id)===String(id));
  if(!m) return;
  document.getElementById('f_id').value = m.id;
  document.getElementById('f_nama').value = m.nama;
  document.getElementById('f_singkatan').value = m.singkatan;
  document.getElementById('f_icon').value = m.icon;
  document.getElementById('f_warna').value = m.warna || '#3b82f6';
  document.getElementById('f_kelas').value = m.kelas || '1-6';
  document.getElementById('f_jp').value = m.jam_minggu || 2;
  document.getElementById('f_nama').dataset.editId = id;
  document.getElementById('btnSimpanMapel').textContent = '💾 Update Mapel';
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Alias untuk router yang pakai dash
window['init_data-mapel'] = window.init_data_mapel;
window.init_data_mapel = window.init_data_mapel;
