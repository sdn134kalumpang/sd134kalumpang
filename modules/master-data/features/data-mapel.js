// modules/master-data/features/data-mapel.js - DATA MAPEL MASTER - SIMPLIFIED
// Path: /sd134kalumpang/modules/master-data/features/data-mapel.js
// Tujuan: Hanya jadi sumber master data untuk sub fitur lain (jadwal.js, bel, dll) - tidak perlu fallback di sub fitur lain
// Isi: Cukup 11 mapel sesuai permintaan: PAIBD, Pancasila, Bhs.Indonesia, Matematika, IPAS, PJOK, Seni Budaya, Bhs.Inggris, Bhs.Ibu, Coding/KKA, BTA

window.init_data_mapel = function(container){
  const MAPEL_11 = [
    { id: 'paibd', nama: 'PAIBD', icon: '🕌' },
    { id: 'pancasila', nama: 'Pancasila', icon: '🇮🇩' },
    { id: 'bindo', nama: 'Bhs.Indonesia', icon: '📖' },
    { id: 'matematika', nama: 'Matematika', icon: '🔢' },
    { id: 'ipas', nama: 'IPAS', icon: '🔬' },
    { id: 'pjok', nama: 'PJOK', icon: '⚽' },
    { id: 'seni', nama: 'Seni Budaya', icon: '🎨' },
    { id: 'binggris', nama: 'Bhs.Inggris', icon: '🇬🇧' },
    { id: 'bibu', nama: 'Bhs.Ibu', icon: '🗣' },
    { id: 'coding', nama: 'Coding/KKA', icon: '💻' },
    { id: 'bta', nama: 'BTA', icon: '📿' }
  ];

  let md = ServiceMenu.getMasterData();
  if(!md.mapel || !md.mapel.length){
    md.mapel = MAPEL_11;
    ServiceMenu.saveMasterData(md);
  }
  if(md.mapel.length < 11){
    const existingIds = md.mapel.map(m=>m.id);
    const toAdd = MAPEL_11.filter(m=> !existingIds.includes(m.id));
    if(toAdd.length){
      md.mapel = [...md.mapel, ...toAdd];
      ServiceMenu.saveMasterData(md);
    }
  }

  const list = ServiceMenu.getMasterData().mapel || MAPEL_11;

  container.innerHTML = `
    <div style="background:linear-gradient(135deg,#0f172a,#1e3a8a);border-radius:16px;padding:20px;color:white;margin-bottom:16px;">
      <h1 style="font-size:16px;font-weight:800;">📚 Data Mapel - Master Data (11 Mapel)</h1>
      <p style="font-size:11px;color:rgba(255,255,255,0.7);margin-top:4px;">Sumber tunggal untuk sub fitur jadwal, bel, dll. Sub fitur cukup load dari ServiceMenu.getMasterData().mapel - tidak perlu fallback.</p>
      <p style="font-size:10px;color:rgba(255,255,255,0.5);margin-top:4px;">Path: modules/master-data/features/data-mapel.js • localStorage master_data.mapel</p>
    </div>
    <div style="background:white;border-radius:12px;border:1px solid #e8eef6;padding:16px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
        <h3 style="font-weight:700;font-size:13px;">11 Mapel - Kurikulum Merdeka</h3>
        <span style="font-size:10px;background:#e8f5e9;color:#1b5e20;padding:4px 8px;border-radius:12px;">${list.length} mapel • Master</span>
      </div>
      <div id="mapelList" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:8px;">
        ${list.map(m=>`<div style="padding:10px;border:1px solid #f1f5f9;border-radius:10px;display:flex;align-items:center;gap:8px;"><span style="font-size:18px;">${m.icon||'📚'}</span><span style="font-size:12px;font-weight:600;">${m.nama}</span><span style="font-size:10px;color:#94a3b8;margin-left:auto;">${m.id}</span></div>`).join('')}
      </div>
      <div style="margin-top:16px;padding:12px;background:#f7f9fc;border-radius:8px;font-size:10px;color:#64748b;">
        <b>Untuk sub fitur lain:</b><br>
        <code>const mapel = ServiceMenu.getMasterData().mapel;</code><br>
        atau<br>
        <code>const mapel = ServiceMenu.loadFromMaster('mapel');</code><br>
        → Tidak perlu fallback lagi, cukup load dari master data 11 mapel ini.<br><br>
        <b>11 Mapel:</b> PAIBD 🕌, Pancasila 🇮🇩, Bhs.Indonesia 📖, Matematika 🔢, IPAS 🔬, PJOK ⚽, Seni Budaya 🎨, Bhs.Inggris 🇬🇧, Bhs.Ibu 🗣, Coding/KKA 💻, BTA 📿
      </div>
      <div style="margin-top:12px;display:flex;gap:8px;">
        <button id="btnResetMapel" style="background:#fff1f1;color:#dc2626;padding:8px 16px;border-radius:20px;font-size:11px;font-weight:700;">↩️ Reset ke 11 Default</button>
        <button id="btnExportMapel" style="background:#f1f5f9;padding:8px 16px;border-radius:20px;font-size:11px;">📥 Export JSON</button>
      </div>
    </div>
  `;

  document.getElementById('btnResetMapel').onclick = ()=>{
    if(!confirm('Reset mapel ke 11 default?')) return;
    let md = ServiceMenu.getMasterData();
    md.mapel = MAPEL_11;
    ServiceMenu.saveMasterData(md);
    location.reload();
  };

  document.getElementById('btnExportMapel').onclick = ()=>{
    const data = ServiceMenu.getMasterData().mapel || MAPEL_11;
    const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href=url; a.download='data-mapel-11.json'; a.click(); URL.revokeObjectURL(url);
  };

  if(window.FirebaseService && window.FirebaseService.isEnabled && FirebaseService.isEnabled()){
    FirebaseService.getAll('mapel').then(list=>{
      if(list && list.length){
        let md = ServiceMenu.getMasterData();
        md.mapel = list;
        ServiceMenu.saveMasterData(md);
        const el = document.getElementById('mapelList');
        if(el) el.innerHTML = list.map(m=>`<div style="padding:10px;border:1px solid #f1f5f9;border-radius:10px;display:flex;align-items:center;gap:8px;"><span style="font-size:18px;">${m.icon||'📚'}</span><span style="font-size:12px;font-weight:600;">${m.nama||m.singkatan}</span><span style="font-size:10px;color:#94a3b8;margin-left:auto;">${m.id}</span></div>`).join('');
      }
    }).catch(()=>{});
  }
};

window['init_data-mapel'] = window.init_data_mapel;
