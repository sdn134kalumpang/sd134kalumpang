// modules/global-monitoring/features/kop.js - KOP ADMINISTRASI
// Aturan: Auto-fill profil, Load Master Data, Owner = sekolah, Kop untuk semua output
window.init_kop = function(container){
  const md = ServiceMenu.getMasterData();
  const school = ServiceMenu.getSchoolInfo();
  const auto = ServiceMenu.getAutoFillProfile();
  const kop = md.kop || {};
  const current = {
    logo: kop.logo || 'https://ui-avatars.com/api/?name=SDN+134&background=FFD700&color=0d3b66&bold=true',
    nama: kop.nama_sekolah || school.nama || 'SDN 134 KALUMPANG',
    npsn: kop.npsn || school.npsn || '40312947',
    alamat: kop.alamat || school.alamat || 'Trilino, Bontotiro - Bulukumba',
    kab: kop.kab || school.kab || 'Kab. Bulukumba, Sulsel 92572',
    akreditasi: kop.akreditasi || school.akreditasi || 'B',
    tahunAjaran: kop.tahunAjaran || school.tahunAjaran || '2025/2026',
    kepsek_nama: kop.kepsek_nama || auto.nama_kepsek,
    kepsek_nip: kop.kepsek_nip || auto.nip_kepsek,
    kop_html: kop.kop_html || '',
    kop_style: kop.kop_style || 'formal'
  };

  container.innerHTML = `
  <div class="welcome-banner" style="background:linear-gradient(135deg,#0f172a,#1e3a8a);">
    <div><h1 style="color:white;">📄 Kop Administrasi - Master Data</h1><p style="color:rgba(255,255,255,0.7);">Opsi C - Fondasi untuk semua output 18 sub fitur Administrasi Guru • Auto-fill: ${auto.nama_guru} • NIP: ${auto.nip_guru}</p></div>
    <div class="welcome-actions"><button class="btn btn-light" onclick="window.print()">🖨️ Preview Cetak</button><button class="btn btn-accent" id="btnSaveKop">💾 Simpan Kop</button></div>
  </div>

  <div class="two-col">
    <div class="card">
      <div class="card-head"><h3>⚙️ Pengaturan Kop Surat</h3><span style="background:#ffcc00;color:#0d3b66;font-size:10px;font-weight:800;padding:4px 8px;border-radius:10px;">AUTO-FILL AKTIF</span></div>
      <div style="display:grid;gap:14px;">
        <div><label class="text-[11px] font-bold">Logo Sekolah (URL)</label><input id="kopLogo" class="input-field w-full border rounded-xl px-3 py-2.5 text-[13px]" value="${current.logo}" placeholder="https://..."></div>
        <div class="grid grid-cols-2 gap-3">
          <div><label class="text-[11px] font-bold">Nama Sekolah</label><input id="kopNama" class="input-field w-full border rounded-xl px-3 py-2.5 text-[13px]" value="${current.nama}"></div>
          <div><label class="text-[11px] font-bold">NPSN</label><input id="kopNpsn" class="input-field w-full border rounded-xl px-3 py-2.5 text-[13px]" value="${current.npsn}"></div>
        </div>
        <div><label class="text-[11px] font-bold">Alamat</label><input id="kopAlamat" class="input-field w-full border rounded-xl px-3 py-2.5 text-[13px]" value="${current.alamat}"></div>
        <div class="grid grid-cols-2 gap-3">
          <div><label class="text-[11px] font-bold">Kabupaten</label><input id="kopKab" class="input-field w-full border rounded-xl px-3 py-2.5 text-[13px]" value="${current.kab}"></div>
          <div><label class="text-[11px] font-bold">Akreditasi</label><select id="kopAkreditasi" class="input-field w-full border rounded-xl px-3 py-2.5 text-[13px]"><option value="A" ${current.akreditasi==='A'?'selected':''}>A</option><option value="B" ${current.akreditasi==='B'?'selected':''}>B</option><option value="C" ${current.akreditasi==='C'?'selected':''}>C</option></select></div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div><label class="text-[11px] font-bold">Nama Kepsek (Auto-fill)</label><input id="kopKepsekNama" class="input-field w-full border rounded-xl px-3 py-2.5 text-[13px]" value="${current.kepsek_nama}"></div>
          <div><label class="text-[11px] font-bold">NIP Kepsek (Auto-fill)</label><input id="kopKepsekNip" class="input-field w-full border rounded-xl px-3 py-2.5 text-[13px]" value="${current.kepsek_nip}"></div>
        </div>
        <div><label class="text-[11px] font-bold">Tahun Ajaran</label><input id="kopTahun" class="input-field w-full border rounded-xl px-3 py-2.5 text-[13px]" value="${current.tahunAjaran}"></div>
        <div><label class="text-[11px] font-bold">Gaya Kop</label><select id="kopStyle" class="input-field w-full border rounded-xl px-3 py-2.5 text-[13px]"><option value="formal" ${current.kop_style==='formal'?'selected':''}>Formal - Garis 2</option><option value="simple" ${current.kop_style==='simple'?'selected':''}>Simple - 1 Garis</option><option value="modern" ${current.kop_style==='modern'?'selected':''}>Modern - Tanpa Garis Tebal</option></select></div>
        <div class="p-3 bg-[#f7f9fc] rounded-xl border text-[11px]"><b>ℹ️ Aturan Emas:</b><br>• Nama guru & NIP auto-fill dari profil login: ${auto.nama_guru} (${auto.nip_guru})<br>• Kop ini akan dipakai di semua output 18 sub fitur Administrasi Guru<br>• Disimpan di Master Data - bisa di-load bebas<br>• Owner: Sekolah (semua guru pakai kop yang sama)</div>
      </div>
    </div>

    <div class="card">
      <div class="card-head"><h3>👁️ Live Preview Kop - Output Wajib</h3><span style="background:#0d3b66;color:white;font-size:10px;padding:4px 8px;border-radius:10px;">PRINT READY</span></div>
      <div id="previewKop" style="background:white;border:1px solid #e8eef6;border-radius:12px;padding:20px;min-height:400px;"></div>
      <div style="margin-top:12px;display:flex;gap:8px;">
        <button class="btn btn-light" style="flex:1;" onclick="document.getElementById('previewKop').innerHTML = window.generateKopHTML(true)">🔄 Refresh Preview</button>
        <button class="btn btn-accent" style="flex:1;" id="btnSaveKop2">💾 Simpan ke Master Data</button>
      </div>
      <div style="margin-top:12px;background:#fff9c4;border:1px solid #ffec99;padding:10px;border-radius:8px;font-size:11px;">✅ Kop ini akan otomatis muncul di: Kisi-kisi, Soal, RPM, LKPD, Jurnal, Penilaian, dll</div>
    </div>
  </div>

  <div class="card" style="margin-top:16px;">
    <div class="card-head"><h3>📋 Template Kop untuk 18 Sub Fitur</h3></div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;font-size:11px;">
      <div style="padding:8px;background:#f7f9fc;border-radius:8px;">📝 Kisi-kisi Soal → pakai Kop</div>
      <div style="padding:8px;background:#f7f9fc;border-radius:8px;">🛠️ Pembuat Soal → pakai Kop</div>
      <div style="padding:8px;background:#f7f9fc;border-radius:8px;">🏦 Bank Soal → pakai Kop</div>
      <div style="padding:8px;background:#f7f9fc;border-radius:8px;">📄 RPM → pakai Kop</div>
      <div style="padding:8px;background:#f7f9fc;border-radius:8px;">📘 LCKH → pakai Kop</div>
      <div style="padding:8px;background:#f7f9fc;border-radius:8px;">📗 LKPD → pakai Kop</div>
      <div style="padding:8px;background:#f7f9fc;border-radius:8px;">📊 Analisis KKTP → pakai Kop</div>
      <div style="padding:8px;background:#f7f9fc;border-radius:8px;">🪞 Refleksi → pakai Kop</div>
      <div style="padding:8px;background:#f7f9fc;border-radius:8px;">📓 Jurnal → pakai Kop</div>
    </div>
  </div>
  `;

  window.generateKopHTML = function(forPreview=false){
    const logo = document.getElementById('kopLogo')?.value || current.logo;
    const nama = document.getElementById('kopNama')?.value || current.nama;
    const npsn = document.getElementById('kopNpsn')?.value || current.npsn;
    const alamat = document.getElementById('kopAlamat')?.value || current.alamat;
    const kab = document.getElementById('kopKab')?.value || current.kab;
    const akred = document.getElementById('kopAkreditasi')?.value || current.akreditasi;
    const kepsekNama = document.getElementById('kopKepsekNama')?.value || current.kepsek_nama;
    const kepsekNip = document.getElementById('kopKepsekNip')?.value || current.kepsek_nip;
    const tahun = document.getElementById('kopTahun')?.value || current.tahunAjaran;
    const style = document.getElementById('kopStyle')?.value || 'formal';
    
    if(style==='formal'){
      return `<div style="text-align:center;border-bottom:3px double #0d3b66;padding-bottom:12px;margin-bottom:16px;">
        <div style="display:flex;align-items:center;justify-content:center;gap:16px;">
          <img src="${logo}" style="width:64px;height:64px;object-fit:contain;" onerror="this.src='https://ui-avatars.com/api/?name=SDN+134&background=FFD700&color=0d3b66'">
          <div>
            <div style="font-family:Poppins;font-weight:700;font-size:16px;color:#0d3b66;">${nama.toUpperCase()}</div>
            <div style="font-size:11px;color:#475569;">NPSN ${npsn} • Akreditasi ${akred} • ${alamat}</div>
            <div style="font-size:11px;color:#475569;">${kab} • Tahun Ajaran ${tahun}</div>
          </div>
        </div>
      </div>
      <div style="font-size:12px;line-height:1.6;">
        <div style="text-align:center;font-weight:700;margin-bottom:12px;">CONTOH DOKUMEN ADMINISTRASI GURU<br><span style="font-weight:400;font-size:11px;">(Kop ini otomatis terpasang di semua output)</span></div>
        <div style="display:flex;justify-content:space-between;margin-top:20px;">
          <div><b>Guru:</b> ${ServiceMenu.getAutoFillProfile().nama_guru}<br><b>NIP:</b> ${ServiceMenu.getAutoFillProfile().nip_guru}</div>
          <div style="text-align:right;">Bulukumba, ${new Date().toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'})}<br><b>Kepala Sekolah,</b><br><br><br><b>${kepsekNama}</b><br>NIP. ${kepsekNip}</div>
        </div>
      </div>`;
    } else if(style==='simple'){
      return `<div style="border-bottom:2px solid #0d3b66;padding-bottom:10px;margin-bottom:14px;display:flex;gap:12px;align-items:center;">
        <img src="${logo}" style="width:48px;height:48px;">
        <div><b>${nama}</b><br><span style="font-size:11px;">${alamat} - NPSN ${npsn}</span></div>
      </div><div style="font-size:12px;">Dokumen dengan Kop Simple - ${kepsekNama}</div>`;
    } else {
      return `<div style="background:#f7f9fc;padding:12px;border-radius:8px;border-left:4px solid #ffcc00;margin-bottom:14px;">
        <b>${nama}</b> - ${kab}<br><span style="font-size:11px;">${alamat} | NPSN ${npsn} | Akreditasi ${akred}</span>
      </div><div style="font-size:12px;">Modern Kop - ${kepsekNama} - NIP ${kepsekNip}</div>`;
    }
  };

  document.getElementById('previewKop').innerHTML = window.generateKopHTML();
  ['kopLogo','kopNama','kopNpsn','kopAlamat','kopKab','kopAkreditasi','kopKepsekNama','kopKepsekNip','kopTahun','kopStyle'].forEach(id=>{
    const el=document.getElementById(id);
    if(el) el.addEventListener('input',()=>{ document.getElementById('previewKop').innerHTML = window.generateKopHTML(); });
  });

  function saveKop(){
    const md = ServiceMenu.getMasterData();
    md.kop = {
      logo: document.getElementById('kopLogo').value,
      nama_sekolah: document.getElementById('kopNama').value,
      npsn: document.getElementById('kopNpsn').value,
      alamat: document.getElementById('kopAlamat').value,
      kab: document.getElementById('kopKab').value,
      akreditasi: document.getElementById('kopAkreditasi').value,
      kepsek_nama: document.getElementById('kopKepsekNama').value,
      kepsek_nip: document.getElementById('kopKepsekNip').value,
      tahunAjaran: document.getElementById('kopTahun').value,
      kop_style: document.getElementById('kopStyle').value,
      kop_html: window.generateKopHTML(),
      updated_by: ServiceMenu.getCurrentUser().email,
      updated_at: new Date().toISOString()
    };
    ServiceMenu.saveMasterData(md);
    const school = ServiceMenu.getSchoolInfo();
    school.nama = md.kop.nama_sekolah;
    school.npsn = md.kop.npsn;
    school.alamat = md.kop.alamat;
    school.kab = md.kop.kab;
    school.akreditasi = md.kop.akreditasi;
    school.tahunAjaran = md.kop.tahunAjaran;
    ServiceMenu.saveSchoolInfo(school);
    localStorage.setItem('kepsek_nama', md.kop.kepsek_nama);
    localStorage.setItem('kepsek_nip', md.kop.kepsek_nip);
    alert('✅ Kop Administrasi berhasil disimpan ke Master Data!\nSemua output 18 sub fitur akan otomatis pakai kop ini.');
  }

  document.getElementById('btnSaveKop').onclick = saveKop;
  document.getElementById('btnSaveKop2').onclick = saveKop;
};
