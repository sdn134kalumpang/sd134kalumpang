// modules/e-dokumen/features/dll.js - Placeholder Fitur Tambahan - Taat v3

window.init_dll = function(container){
  container.innerHTML = ''
  + '<div style="margin-bottom:16px;"><button onclick="window.location.href=\'/sd134kalumpang/dashboard.html\'" style="background:#f1f5f9;color:#0d3b66;border:none;padding:8px 16px;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;">← Kembali ke Dashboard</button></div>'
  + '<div style="background:white;border-radius:12px;border:1px solid #e8eef6;padding:40px;text-align:center;">'
  + '<div style="font-size:48px;margin-bottom:16px;"></div>'
  + '<h2 style="font-size:18px;font-weight:700;color:#0d3b66;margin-bottom:8px;">Fitur DLL (Lainnya)</h2>'
  + '<p style="color:#64748b;font-size:13px;margin-bottom:20px;">Fitur ini masih dalam pengembangan. Silakan gunakan fitur Arsip, Upload, atau Laporan untuk kebutuhan dokumentasi Anda.</p>'
  + '<div style="display:flex;gap:10px;justify-content:center;">'
  + '<a href="./index.html?fitur=arsip" style="background:#0d3b66;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;font-size:12px;font-weight:600;">Ke Katalog Arsip</a>'
  + '<a href="./index.html?fitur=upload" style="background:#ffcc00;color:#0d3b66;padding:10px 20px;border-radius:8px;text-decoration:none;font-size:12px;font-weight:600;">Upload File</a>'
  + '</div>'
  + '</div>';
};
