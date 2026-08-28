// js/pengaturan/features/akun-saya.js - MANDIRI - Akun Saya

window.AkunSayaFeature = {
  load(){
    const u=ServiceMenu.getCurrentUser();
    const nama=document.getElementById('akunNama');
    const email=document.getElementById('akunEmail');
    const role=document.getElementById('akunRole');
    if(nama) nama.value=u.nama;
    if(email) email.value=u.email;
    if(role) role.value=u.role;
  }
};
