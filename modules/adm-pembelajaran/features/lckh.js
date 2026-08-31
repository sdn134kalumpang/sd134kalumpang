// modules/adm-pembelajaran/features/lckh.js
// LCKH (Lembar Catatan Kerja Harian) - Base64 Firestore
// Owner Only + School Isolation (id_sekolah)

window.initLCKH = async function(container) {
  const currentUser = ServiceMenu.getCurrentUser();
  const isAdmin = ServiceMenu.isAdmin();
  
  // Auto-fill id_sekolah dari data sekolah saat ini
  const idSekolah = localStorage.getItem('idSekolah') || '40312947'; // Default NPSN
  
  container.innerHTML = `
    <div style="margin-bottom:16px;">
      <button onclick="window.location.href='dashboard.html'" style="background:#f1f5f9;color:#0d3b66;border:none;padding:8px 16px;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;">
        ← Kembali ke Dashboard
      </button>
    </div>
    
    <div class="welcome-banner" style="background:linear-gradient(135deg,#0f172a,#1e3a8a);padding:16px;border-radius:12px;color:white;">
      <h1 style="font-size:16px;font-weight:800;">📝 LCKH - Lembar Catatan Kerja Harian</h1>
      <p style="font-size:11px;color:rgba(255,255,255,0.7);">
        Catat kegiatan harian guru • Base64 max 700KB • School ID: ${idSekolah}
      </p>
    </div>

    <!-- Form Upload LCKH -->
    <div style="background:white;border-radius:12px;border:1px solid #e8eef6;padding:20px;margin-top:16px;">
      <h3 style="font-weight:700;margin-bottom:16px;">Upload LCKH Harian</h3>
      <form id="formLCKH" enctype="multipart/form-data">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">
          <div>
            <label style="font-size:11px;font-weight:700;display:block;margin-bottom:4px;">Tanggal *</label>
            <input type="date" id="lckhTanggal" required 
              style="width:100%;border:1px solid #e2e8f0;border-radius:8px;padding:10px;font-size:12px;">
          </div>
          <div>
            <label style="font-size:11px;font-weight:700;display:block;margin-bottom:4px;">Kelas *</label>
            <select id="lckhKelas" required 
              style="width:100%;border:1px solid #e2e8f0;border-radius:8px;padding:10px;font-size:12px;">
              <option value="">-- Pilih Kelas --</option>
              <option value="1">Kelas 1</option>
              <option value="2">Kelas 2</option>
              <option value="3">Kelas 3</option>
              <option value="4">Kelas 4</option>
              <option value="5">Kelas 5</option>
              <option value="6">Kelas 6</option>
            </select>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">
          <div>
            <label style="font-size:11px;font-weight:700;display:block;margin-bottom:4px;">Mata Pelajaran *</label>
            <input type="text" id="lckhMapel" placeholder="Contoh: Matematika" required
              style="width:100%;border:1px solid #e2e8f0;border-radius:8px;padding:10px;font-size:12px;">
          </div>
          <div>
            <label style="font-size:11px;font-weight:700;display:block;margin-bottom:4px;">Materi/Kegiatan</label>
            <input type="text" id="lckhMateri" placeholder="Contoh: Pecahan"
              style="width:100%;border:1px solid #e2e8f0;border-radius:8px;padding:10px;font-size:12px;">
          </div>
        </div>

        <div style="margin-bottom:12px;">
          <label style="font-size:11px;font-weight:700;display:block;margin-bottom:4px;">Catatan/Keterangan</label>
          <textarea id="lckhCatatan" rows="3" placeholder="Catatan kegiatan..."
            style="width:100%;border:1px solid #e2e8f0;border-radius:8px;padding:10px;font-size:12px;"></textarea>
        </div>

        <!-- Upload File Administrasi (Base64) -->
        <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:12px;margin-bottom:12px;">
          <label style="font-size:11px;font-weight:700;display:block;margin-bottom:6px;">
            📄 File Administrasi (Base64 max 700KB)
          </label>
          <input type="file" id="lckhFileAdmin" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            style="width:100%;font-size:11px;">
          <div style="font-size:10px;color:#92400e;margin-top:6px;">
            Upload RPP, Modul, atau dokumen administrasi lainnya
          </div>
          <div id="adminFileInfo" style="font-size:10px;color:#059669;margin-top:4px;display:none;"></div>
        </div>

        <!-- Upload Foto Dokumentasi (Base64) -->
        <div style="background:#ecfdf5;border:1px solid #a7f3d0;border-radius:8px;padding:12px;margin-bottom:12px;">
          <label style="font-size:11px;font-weight:700;display:block;margin-bottom:6px;">
             Foto Dokumentasi Suasana Pembelajaran (Opsional)
          </label>
          <input type="file" id="lckhFotoDoc" accept="image/*" capture="environment"
            style="width:100%;font-size:11px;">
          <div style="font-size:10px;color:#047857;margin-top:6px;">
            Foto kegiatan mengajar di kelas (gunakan kamera HP/laptop)
          </div>
          <div id="fotoDocInfo" style="font-size:10px;color:#059669;margin-top:4px;display:none;"></div>
        </div>

        <div style="display:flex;gap:10px;">
          <button type="submit" 
            style="flex:1;background:#0d3b66;color:white;padding:12px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;border:none;">
            💾 Simpan LCKH
          </button>
          <button type="reset" 
            style="background:#f1f5f9;padding:12px 20px;border-radius:8px;font-size:12px;cursor:pointer;border:none;">
            Batal
          </button>
        </div>
      </form>
    </div>

    <!-- Daftar LCKH -->
    <div style="background:white;border-radius:12px;border:1px solid #e8eef6;padding:20px;margin-top:16px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
        <h3 style="font-weight:700;">Daftar LCKH</h3>
        <div style="display:flex;gap:8px;">
          <input type="text" id="searchLCKH" placeholder="Cari..." 
            style="border:1px solid #e2e8f0;border-radius:8px;padding:6px 12px;font-size:12px;">
          <select id="filterKelasLCKH" 
            style="border:1px solid #e2e8f0;border-radius:8px;padding:6px 12px;font-size:12px;">
            <option value="">Semua Kelas</option>
            <option value="1">Kelas 1</option>
            <option value="2">Kelas 2</option>
            <option value="3">Kelas 3</option>
            <option value="4">Kelas 4</option>
            <option value="5">Kelas 5</option>
            <option value="6">Kelas 6</option>
          </select>
        </div>
      </div>
      <div id="lckhList" style="overflow-x:auto;">
        <p style="text-align:center;color:#64748b;padding:40px;">Memuat data LCKH...</p>
      </div>
    </div>
  `;

  // Handle file admin preview
  document.getElementById('lckhFileAdmin').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      const sizeKB = (file.size / 1024).toFixed(0);
      const info = document.getElementById('adminFileInfo');
      info.textContent = `✅ ${file.name} (${sizeKB}KB)`;
      info.style.display = 'block';
      
      if (file.size > 700 * 1024) {
        info.textContent = `⚠️ File terlalu besar (${sizeKB}KB). Maksimal 700KB`;
        info.style.color = '#dc2626';
      }
    }
  });

  // Handle foto dokumentasi preview
  document.getElementById('lckhFotoDoc').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      const sizeKB = (file.size / 1024).toFixed(0);
      const info = document.getElementById('fotoDocInfo');
      info.textContent = `✅ ${file.name} (${sizeKB}KB)`;
      info.style.display = 'block';
    }
  });

  // Handle form submit
  document.getElementById('formLCKH').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const tanggal = document.getElementById('lckhTanggal').value;
    const kelas = document.getElementById('lckhKelas').value;
    const mapel = document.getElementById('lckhMapel').value;
    const materi = document.getElementById('lckhMateri').value;
    const catatan = document.getElementById('lckhCatatan').value;
    
    // Process file admin
    const fileAdmin = document.getElementById('lckhFileAdmin').files[0];
    let base64Admin = null;
    let fileNameAdmin = null;
    let fileSizeAdmin = 0;
    
    if (fileAdmin) {
      if (fileAdmin.size > 700 * 1024) {
        alert('⚠️ File administrasi terlalu besar. Maksimal 700KB');
        return;
      }
      const result = await readFileAsBase64(fileAdmin);
      base64Admin = result.base64;
      fileNameAdmin = fileAdmin.name;
      fileSizeAdmin = fileAdmin.size;
    }
    
    // Process foto dokumentasi
    const fotoDoc = document.getElementById('lckhFotoDoc').files[0];
    let base64Foto = null;
    let fileNameFoto = null;
    let fileSizeFoto = 0;
    
    if (fotoDoc) {
      if (fotoDoc.size > 700 * 1024) {
        alert('⚠️ Foto dokumentasi terlalu besar. Maksimal 700KB');
        return;
      }
      const result = await readFileAsBase64(fotoDoc);
      base64Foto = result.base64;
      fileNameFoto = fotoDoc.name;
      fileSizeFoto = fotoDoc.size;
    }
    
    // Save to Firestore dengan id_sekolah
    const lckhData = {
      id_sekolah: idSekolah,  // SCHOOL ISOLATION
      tanggal: tanggal,
      kelas: kelas,
      mapel: mapel,
      materi: materi,
      catatan: catatan,
      file_admin_base64: base64Admin,
      file_admin_name: fileNameAdmin,
      file_admin_size: fileSizeAdmin,
      foto_doc_base64: base64Foto,
      foto_doc_name: fileNameFoto,
      foto_doc_size: fileSizeFoto,
      owner_email: currentUser.email,
      owner_nama: currentUser.nama,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    try {
      if (window.FirebaseService && FirebaseService.isEnabled()) {
        await FirebaseService.add('lckh', lckhData);
        alert('✅ LCKH berhasil disimpan!');
        this.reset();
        document.getElementById('adminFileInfo').style.display = 'none';
        document.getElementById('fotoDocInfo').style.display = 'none';
        loadLCKHList();
      } else {
        alert('❌ Firebase tidak tersedia');
      }
    } catch (error) {
      console.error('Error saving LCKH:', error);
      alert('❌ Gagal menyimpan LCKH: ' + error.message);
    }
  });

  // Load LCKH list
  async function loadLCKHList() {
    const listContainer = document.getElementById('lckhList');
    listContainer.innerHTML = '<p style="text-align:center;color:#64748b;padding:40px;">Memuat data...</p>';
    
    try {
      if (window.FirebaseService && FirebaseService.isEnabled()) {
        // Load dengan filter id_sekolah
        let allLCKH = await FirebaseService.getAll('lckh');
        
        // Filter by id_sekolah dan owner
        let filteredLCKH = allLCKH.filter(lckh => {
          const matchSchool = lckh.id_sekolah === idSekolah;
          const matchOwner = isAdmin || lckh.owner_email === currentUser.email;
          return matchSchool && matchOwner;
        });
        
        // Apply search & filter
        const searchTerm = (document.getElementById('searchLCKH').value || '').toLowerCase();
        const filterKelas = document.getElementById('filterKelasLCKH').value;
        
        if (searchTerm) {
          filteredLCKH = filteredLCKH.filter(lckh => 
            (lckh.mapel || '').toLowerCase().includes(searchTerm) ||
            (lckh.materi || '').toLowerCase().includes(searchTerm) ||
            (lckh.catatan || '').toLowerCase().includes(searchTerm)
          );
        }
        
        if (filterKelas) {
          filteredLCKH = filteredLCKH.filter(lckh => lckh.kelas === filterKelas);
        }
        
        // Sort by date desc
        filteredLCKH.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        if (filteredLCKH.length === 0) {
          listContainer.innerHTML = '<p style="text-align:center;color:#64748b;padding:40px;">Belum ada data LCKH</p>';
          return;
        }
        
        // Render list
        let html = '<table style="width:100%;font-size:12px;text-align:left;">';
        html += '<thead style="background:#f8fafc;"><tr>';
        html += '<th style="padding:10px;">Tanggal</th>';
        html += '<th>Kelas</th>';
        html += '<th>Mapel</th>';
        html += '<th>Materi</th>';
        html += '<th>File</th>';
        html += '<th>Aksi</th>';
        html += '</tr></thead><tbody>';
        
        filteredLCKH.forEach(lckh => {
          const hasAdmin = lckh.file_admin_base64 ? '✅' : '-';
          const hasFoto = lckh.foto_doc_base64 ? '📸' : '-';
          
          html += '<tr style="border-bottom:1px solid #f1f5f9;">';
          html += `<td style="padding:10px;">${lckh.tanggal || '-'}</td>`;
          html += `<td>Kelas ${lckh.kelas || '-'}</td>`;
          html += `<td>${lckh.mapel || '-'}</td>`;
          html += `<td>${lckh.materi || '-'}</td>`;
          html += `<td>${hasAdmin} ${hasFoto}</td>`;
          html += `<td>`;
          html += `<button onclick="viewLCKH('${lckh.firestore_id || lckh.id}')" style="color:#2563eb;margin-right:8px;background:none;border:none;cursor:pointer;font-size:11px;">Lihat</button>`;
          html += `<button onclick="deleteLCKH('${lckh.firestore_id || lckh.id}')" style="color:#dc2626;background:none;border:none;cursor:pointer;font-size:11px;">Hapus</button>`;
          html += `</td>`;
          html += '</tr>';
        });
        
        html += '</tbody></table>';
        listContainer.innerHTML = html;
      }
    } catch (error) {
      console.error('Error loading LCKH:', error);
      listContainer.innerHTML = '<p style="text-align:center;color:#dc2626;padding:40px;">Gagal memuat data</p>';
    }
  }

  // Helper: Read file as Base64
  function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve({ base64: reader.result });
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Global functions
  window.viewLCKH = function(id) {
    const lckh = lckhList.find(l => (l.firestore_id || l.id) === id);
    if (!lckh) return;
    
    let message = `📝 LCKH - ${lckh.tanggal}\n`;
    message += `Kelas: ${lckh.kelas}\n`;
    message += `Mapel: ${lckh.mapel}\n`;
    message += `Materi: ${lckh.materi}\n`;
    message += `Catatan: ${lckh.catatan || '-'}\n\n`;
    
    if (lckh.file_admin_base64) {
      message += `📄 File Admin: ${lckh.file_admin_name} (${(lckh.file_admin_size/1024).toFixed(0)}KB)\n`;
    }
    if (lckh.foto_doc_base64) {
      message += `📸 Foto: ${lckh.foto_doc_name} (${(lckh.foto_doc_size/1024).toFixed(0)}KB)`;
    }
    
    alert(message);
  };

  window.deleteLCKH = async function(id) {
    if (!confirm('Yakin ingin menghapus LCKH ini?')) return;
    
    try {
      if (window.FirebaseService && FirebaseService.isEnabled()) {
        await FirebaseService.delete('lckh', id);
        alert('✅ LCKH berhasil dihapus');
        loadLCKHList();
      }
    } catch (error) {
      alert('❌ Gagal menghapus: ' + error.message);
    }
  };

  // Search & filter events
  document.getElementById('searchLCKH').addEventListener('input', loadLCKHList);
  document.getElementById('filterKelasLCKH').addEventListener('change', loadLCKHList);

  // Initial load
  loadLCKHList();
};
