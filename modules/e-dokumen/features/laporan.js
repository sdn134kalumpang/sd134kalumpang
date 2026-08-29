// modules/e-dokumen/features/laporan.js - Laporan & Export - Taat v3

window.init_laporan = function(container){
  var user = ServiceMenu.getCurrentUser();
  var isAdmin = ServiceMenu.isAdmin();
  var kategoriList = ['Arsip','Surat Masuk','Surat Keluar','SK','Undangan','Laporan','DLL'];

  var catOptions = '<option value="">Semua Kategori</option>';
  for(var i=0;i<kategoriList.length;i++){ catOptions += '<option value="'+kategoriList[i]+'">'+kategoriList[i]+'</option>'; }

  container.innerHTML = ''
  + '<div style="margin-bottom:16px;"><button onclick="window.location.href=\'/sd134kalumpang/dashboard.html\'" style="background:#f1f5f9;color:#0d3b66;border:none;padding:8px 16px;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;">← Kembali ke Dashboard</button></div>'
  + '<div class="welcome-banner" style="background:linear-gradient(135deg,#0f172a,#1e3a8a);padding:16px;border-radius:12px;color:white;">'
  + '<h1 style="font-size:16px;font-weight:800;">📋 Laporan Arsip Dokumen</h1><p style="font-size:11px;color:rgba(255,255,255,0.7);">Rekap dan export arsip berdasarkan periode dan kategori</p></div>'
  + '<div style="background:white;border-radius:12px;border:1px solid #e8eef6;padding:20px;margin-top:16px;">'
  + '<h3 style="font-weight:700;margin-bottom:16px;">Filter Laporan</h3>'
  + '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:16px;">'
  + '<div><label style="font-size:11px;font-weight:700;display:block;margin-bottom:4px;">Tanggal Mulai</label><input id="laporanDari" type="date" style="width:100%;border:1px solid #e2e8f0;border-radius:8px;padding:10px;font-size:12px;"></div>'
  + '<div><label style="font-size:11px;font-weight:700;display:block;margin-bottom:4px;">Tanggal Sampai</label><input id="laporanSampai" type="date" style="width:100%;border:1px solid #e2e8f0;border-radius:8px;padding:10px;font-size:12px;"></div>'
  + '</div>'
  + '<div style="margin-bottom:16px;"><label style="font-size:11px;font-weight:700;display:block;margin-bottom:4px;">Kategori</label><select id="laporanKategori" style="width:100%;border:1px solid #e2e8f0;border-radius:8px;padding:10px;font-size:12px;">'+catOptions+'</select></div>'
  + '<div style="display:flex;gap:10px;">'
  + '<button id="btnGenerateLaporan" style="flex:1;background:#0d3b66;color:white;padding:12px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;border:none;"> Generate Laporan</button>'
  + '<button id="btnExportXLS" style="flex:1;background:#ffcc00;color:#0d3b66;padding:12px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;border:none;"> Export XLS</button>'
  + '</div>'
  + '</div>'
  + '<div id="hasilLaporan" style="background:white;border-radius:12px;border:1px solid #e8eef6;padding:20px;margin-top:16px;display:none;">'
  + '<h3 style="font-weight:700;margin-bottom:12px;">Hasil Laporan</h3>'
  + '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:16px;">'
  + '<div style="padding:12px;background:#f1f5f9;border-radius:8px;text-align:center;"><div style="font-size:11px;color:#64748b;">Total Dokumen</div><h4 id="lapTotal" style="font-size:20px;font-weight:800;">0</h4></div>'
  + '<div style="padding:12px;background:#f1f5f9;border-radius:8px;text-align:center;"><div style="font-size:11px;color:#64748b;">Base64</div><h4 id="lapBase64" style="font-size:20px;font-weight:800;">0</h4></div>'
  + '<div style="padding:12px;background:#f1f5f9;border-radius:8px;text-align:center;"><div style="font-size:11px;color:#64748b;">Google Drive</div><h4 id="lapDrive" style="font-size:20px;font-weight:800;">0</h4></div>'
  + '</div>'
  + '<div style="overflow-x:auto;"><table style="width:100%;font-size:12px;text-align:left;"><thead style="font-size:11px;color:#94a3b8;"><tr><th style="padding:8px;">Judul</th><th>Kategori</th><th>Nomor</th><th>Tanggal</th><th>File</th></tr></thead><tbody id="laporanTableBody"></tbody></table></div>'
  + '</div>';

  var arsipList = [];
  var laporanData = [];

  async function loadData(){
    if(window.FirebaseService && FirebaseService.isEnabled()){
      try {
        var list = await FirebaseService.getAll('e_dokumen_arsip');
        if (!Array.isArray(list)) list = [];
        arsipList = isAdmin ? list : list.filter(function(a){ return !a.owner_email || a.owner_email===user.email; });
      } catch(e) { console.error('LoadData Error:', e); }
    } else {
      var md = ServiceMenu.getMasterData();
      arsipList = md.e_dokumen_arsip || [];
      if(!isAdmin) arsipList = ServiceMenu.filterOwnerOnly(arsipList);
    }
  }

  document.getElementById('btnGenerateLaporan').onclick = function(){
    var dari = document.getElementById('laporanDari').value;
    var sampai = document.getElementById('laporanSampai').value;
    var kat = document.getElementById('laporanKategori').value;
    
    laporanData = arsipList.filter(function(a){
      var tgl = a.tanggal_surat || '';
      var matchDate = (!dari || tgl >= dari) && (!sampai || tgl <= sampai);
      var matchKat = !kat || a.kategori === kat;
      return matchDate && matchKat;
    });
    
    laporanData.sort(function(a,b){ return new Date(b.tanggal_surat||0) - new Date(a.tanggal_surat||0); });
    
    var b64 = 0, drv = 0;
    for(var i=0;i<laporanData.length;i++){ if(laporanData[i].file_base64) b64++; else if(laporanData[i].file_url) drv++; }
    
    document.getElementById('lapTotal').textContent = laporanData.length;
    document.getElementById('lapBase64').textContent = b64;
    document.getElementById('lapDrive').textContent = drv;
    
    var html = '';
    for(var i=0;i<laporanData.length;i++){
      var a = laporanData[i];
      var fileBtn = a.file_base64 ? '<span style="color:#059669;">Base64</span>' : (a.file_url ? '<span style="color:#0d3b66;">Drive</span>' : '-');
      html += '<tr style="border-bottom:1px solid #f1f5f9;"><td style="padding:10px;">'+(a.judul||'')+'</td><td>'+(a.kategori||'')+'</td><td>'+(a.nomor_surat||'')+'</td><td>'+(a.tanggal_surat||'')+'</td><td>'+fileBtn+'</td></tr>';
    }
    document.getElementById('laporanTableBody').innerHTML = html;
    document.getElementById('hasilLaporan').style.display = 'block';
  };

  document.getElementById('btnExportXLS').onclick = function(){
    if(laporanData.length === 0){ alert('Generate laporan terlebih dahulu'); return; }
    var html = '<html><head><meta charset="UTF-8"></head><body><h2>Laporan Arsip SDN 134 Kalumpang</h2><p>Periode: '+document.getElementById('laporanDari').value+' s/d '+document.getElementById('laporanSampai').value+'</p><table border="1" style="font-size:11px;border-collapse:collapse;width:100%;"><tr><th>No</th><th>Judul</th><th>Kategori</th><th>Nomor</th><th>Tanggal</th><th>File</th><th>Size</th><th>Keterangan</th></tr>';
    for(var i=0;i<laporanData.length;i++){ 
      var a=laporanData[i]; 
      html+='<tr><td>'+(i+1)+'</td><td>'+(a.judul||'')+'</td><td>'+(a.kategori||'')+'</td><td>'+(a.nomor_surat||'')+'</td><td>'+(a.tanggal_surat||'')+'</td><td>'+(a.file_name||'')+'</td><td>'+(a.file_size||0)+'</td><td>'+(a.keterangan||'')+'</td></tr>'; 
    }
    html+='</table></body></html>';
    var blob = new Blob([html], {type:'application/vnd.ms-excel'});
    var url = URL.createObjectURL(blob);
    var el = document.createElement('a'); 
    el.href=url; 
    el.download='Laporan_Arsip_SDN134_'+new Date().toISOString().slice(0,10)+'.xls'; 
    el.click(); 
    URL.revokeObjectURL(url);
  };

  loadData();
};
