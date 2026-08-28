// js/pengaturan/features/info-sekolah.js - MANDIRI - Info Sekolah - Taat v3

window.InfoSekolahFeature = {
  load(){
    const info=ServiceMenu.getSchoolInfo();
    const npsn=document.getElementById('infoNPSN');
    const nama=document.getElementById('infoNama');
    const alamat=document.getElementById('infoAlamat');
    if(npsn) npsn.value=info.npsn;
    if(nama) nama.value=info.nama;
    if(alamat) alamat.value=info.alamat;
  },
  initForm(){
    const form=document.getElementById('formInfoSekolah');
    if(!form) return;
    form.onsubmit=(e)=>{
      e.preventDefault();
      const info=ServiceMenu.getSchoolInfo();
      info.npsn=document.getElementById('infoNPSN').value;
      info.nama=document.getElementById('infoNama').value;
      info.alamat=document.getElementById('infoAlamat').value;
      ServiceMenu.saveSchoolInfo(info);
      if(window.FirebaseService && FirebaseService.isEnabled()){
        FirebaseService.saveKop({ nama_sekolah:info.nama, npsn:info.npsn, alamat:info.alamat });
      }
      alert('Info sekolah disimpan!');
    };
  }
};
