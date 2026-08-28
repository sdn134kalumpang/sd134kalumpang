// js/config/firebase-service.js - 1 FILE MULTI FUNGSI - FIXED CONNECTING & WRITE
// Lokasi resmi: /sd134kalumpang/js/config/firebase-service.js

import { db } from "./firebase-config.js";
import { collection, doc, addDoc, setDoc, getDocs, getDoc, updateDoc, deleteDoc, onSnapshot, writeBatch } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const NPSN = '40312947';

// Fallback if import db is undefined but window.db exists
function getDb(){
  return (typeof db !== 'undefined' && db) ? db : (window.db || null);
}

const FirebaseService = {
  isEnabled: () => {
    const d = getDb();
    return !!d;
  },
  getCollection: (namaKoleksi) => {
    const d = getDb();
    if(!d) throw new Error("Firestore DB belum siap - cek firebase-config.js 404");
    return collection(d, 'schools', NPSN, namaKoleksi);
  },

  async getAll(namaKoleksi){
    const d = getDb();
    if(!d){
      console.warn("Firestore offline - pakai localStorage", namaKoleksi);
      const md = window.ServiceMenu ? ServiceMenu.getMasterData() : { peserta_didik: [] };
      return md[namaKoleksi] || [];
    }
    try{
      const snap = await getDocs(this.getCollection(namaKoleksi));
      const list = snap.docs.map(doc=>({ firestore_id:doc.id, id:doc.id, ...doc.data() }));
      if(namaKoleksi==='peserta_didik'){
        list.sort((a,b)=> (a.kelas||'').localeCompare(b.kelas||'') || (a.nama||'').localeCompare(b.nama||''));
      }
      if(window.ServiceMenu){
        const md = ServiceMenu.getMasterData();
        if(list.length>0){
          md[namaKoleksi]=list;
          ServiceMenu.saveMasterData(md);
        }
      }
      console.log(`✅ Load ${list.length} dari Firestore: schools/${NPSN}/${namaKoleksi}`);
      return list;
    }catch(e){
      console.error(`❌ Firestore getAll ${namaKoleksi} error:`, e.code, e.message);
      if(e.message.includes('Missing or insufficient permissions')){
        console.error("RULES ERROR: Ganti Firestore Rules ke allow read, write: if true;");
      }
      const md = window.ServiceMenu ? ServiceMenu.getMasterData() : {};
      return md[namaKoleksi] || [];
    }
  },

  async add(namaKoleksi, data){
    // Buat owner info
    let ownerData = data;
    if(window.ServiceMenu && ServiceMenu.addOwner){
      ownerData = ServiceMenu.addOwner({...data, updated_at:new Date().toISOString()});
    } else {
      ownerData = {...data, owner_email: localStorage.getItem('userEmail')||'hedisuriadi35@gmail.com', owner_nama: localStorage.getItem('nama')||'Admin', created_at:new Date().toISOString(), updated_at:new Date().toISOString()};
    }

    // Simpan local dulu
    if(window.ServiceMenu){
      let md = ServiceMenu.getMasterData();
      if(!md[namaKoleksi]) md[namaKoleksi]=[];
      md[namaKoleksi].push({...ownerData, id:Date.now()});
      ServiceMenu.saveMasterData(md);
    }

    const d = getDb();
    if(!d){
      console.warn("Firestore offline - hanya localStorage");
      return ownerData;
    }

    try{
      const ref = await addDoc(this.getCollection(namaKoleksi), ownerData);
      console.log(`✅ Berhasil simpan ke Firestore: schools/${NPSN}/${namaKoleksi}/${ref.id}`, ownerData);
      // Update status UI
      const statusEl = document.getElementById('firestoreStatus') || document.getElementById('firestoreInfo');
      if(statusEl){
        statusEl.textContent = `✅ Tersimpan Firestore: ${ownerData.nama||ownerData.nis||ref.id}`;
        statusEl.style.background = '#dcfce7';
      }
      return {...ownerData, firestore_id:ref.id, id:ref.id};
    }catch(e){
      console.error(`❌ Gagal simpan ${namaKoleksi} ke Firestore:`, e.code, e.message, e);
      alert(`Gagal simpan ke Firestore (${namaKoleksi}):\n${e.code}\n${e.message}\n\nSolusi:\n1. Buka Firebase Console > Firestore > Rules\n2. Ganti jadi: allow read, write: if true;\n3. Publish`);
      return ownerData;
    }
  },

  async addBatch(namaKoleksi, listData){
    const withOwners = listData.map(d=>{
      if(window.ServiceMenu && ServiceMenu.addOwner) return ServiceMenu.addOwner({id:Date.now()+Math.random(), ...d, updated_at:new Date().toISOString()});
      return {...d, id:Date.now()+Math.random(), owner_email:localStorage.getItem('userEmail')||'admin', created_at:new Date().toISOString()};
    });

    if(window.ServiceMenu){
      let md = ServiceMenu.getMasterData();
      if(!md[namaKoleksi]) md[namaKoleksi]=[];
      md[namaKoleksi]=md[namaKoleksi].concat(withOwners);
      ServiceMenu.saveMasterData(md);
    }

    const d = getDb();
    if(!d) return withOwners;

    try{
      const batch = writeBatch(d);
      withOwners.forEach(data=>{
        const ref = doc(this.getCollection(namaKoleksi));
        batch.set(ref, data);
      });
      await batch.commit();
      console.log(`✅ Batch ${withOwners.length} ke Firestore: ${namaKoleksi}`);
      return withOwners;
    }catch(e){
      console.error(`Batch ${namaKoleksi} error:`, e);
      return withOwners;
    }
  },

  async update(namaKoleksi, fid, data){
    const d = getDb();
    if(!d) return;
    try{
      await updateDoc(doc(this.getCollection(namaKoleksi), fid), {...data, updated_at:new Date().toISOString()});
      console.log(`✅ Update Firestore ${namaKoleksi}/${fid}`);
    }catch(e){ console.error(e); }
  },

  async delete(namaKoleksi, fid, localId){
    if(window.ServiceMenu){
      let md = ServiceMenu.getMasterData();
      if(md[namaKoleksi]){
        md[namaKoleksi]=md[namaKoleksi].filter(s=>s.id!=localId && s.firestore_id!=fid && s.id!=fid);
        ServiceMenu.saveMasterData(md);
      }
    }
    const d = getDb();
    if(!d) return;
    try{
      await deleteDoc(doc(this.getCollection(namaKoleksi), fid));
      console.log(`✅ Hapus Firestore ${namaKoleksi}/${fid}`);
    }catch(e){ console.error(e); }
  },

  listen(namaKoleksi, cb){
    const d = getDb();
    if(!d) return ()=>{};
    return onSnapshot(this.getCollection(namaKoleksi), snap=>{
      const list = snap.docs.map(doc=>({ firestore_id:doc.id, id:doc.id, ...doc.data() }));
      if(namaKoleksi==='peserta_didik'){
        list.sort((a,b)=> (a.kelas||'').localeCompare(b.kelas||'') || (a.nama||'').localeCompare(b.nama||''));
      }
      if(window.ServiceMenu){
        const md = ServiceMenu.getMasterData();
        md[namaKoleksi]=list;
        ServiceMenu.saveMasterData(md);
      }
      if(cb) cb(list);
    }, err=>{
      console.error(`Realtime ${namaKoleksi} error:`, err);
    });
  },


  // Helper query dengan indexes - anti error requires an index
  async getByRole(role){
    const { query, where, orderBy, getDocs } = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js");
    const d = this.getDb(); if(!d) return [];
    const q = query(this.getCollection('users_db'), where('role','==',role), orderBy('nama'));
    const snap = await getDocs(q);
    return snap.docs.map(doc=>({ firestore_id:doc.id, id:doc.id, ...doc.data() }));
  },
  async getPesertaDidikByOwner(email){
    const { query, where, orderBy, getDocs } = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js");
    const d = this.getDb(); if(!d) return [];
    const q = query(this.getCollection('peserta_didik'), where('owner_email','==',email), orderBy('kelas'), orderBy('nama'));
    const snap = await getDocs(q);
    return snap.docs.map(doc=>({ firestore_id:doc.id, id:doc.id, ...doc.data() }));
  },
  async getBankSoalByMapelKelas(mapel, kelas){
    const { query, where, orderBy, getDocs } = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js");
    const d = this.getDb(); if(!d) return [];
    const q = query(this.getCollection('bank_soal'), where('mapel','==',mapel), where('kelas','==',kelas), orderBy('created_at'));
    const snap = await getDocs(q);
    return snap.docs.map(doc=>({ firestore_id:doc.id, id:doc.id, ...doc.data() }));
  },

  // Wrapper multi fungsi
  getPesertaDidik(){ return this.getAll('peserta_didik'); },
  addPesertaDidik(data){ return this.add('peserta_didik', data); },
  addBatchPesertaDidik(list){ return this.addBatch('peserta_didik', list); },
  updatePesertaDidik(fid, data){ return this.update('peserta_didik', fid, data); },
  deletePesertaDidik(fid, lid){ return this.delete('peserta_didik', fid, lid); },
  listenPesertaDidik(cb){ return this.listen('peserta_didik', cb); },

  async getKop(){
    const d = getDb();
    if(!d) return ServiceMenu.getMasterData().kop;
    try{
      const snap = await getDoc(doc(d, 'schools', NPSN, 'kop', 'current'));
      if(snap.exists()){
        const data = snap.data();
        const md = ServiceMenu.getMasterData();
        md.kop=data;
        ServiceMenu.saveMasterData(md);
        return data;
      }
      return ServiceMenu.getMasterData().kop;
    }catch(e){ return ServiceMenu.getMasterData().kop; }
  },
  async saveKop(kopData){
    const md = ServiceMenu.getMasterData();
    md.kop=kopData;
    ServiceMenu.saveMasterData(md);
    const d = getDb();
    if(!d) return;
    try{
      await setDoc(doc(d, 'schools', NPSN, 'kop', 'current'), {...kopData, updated_at:new Date().toISOString()});
      console.log('✅ Kop simpan Firestore');
    }catch(e){ console.error(e); }
  }
};

window.FirebaseService = FirebaseService;
export default FirebaseService;

// Signal ready
window.dispatchEvent(new CustomEvent('firebase-service-ready', { detail: { service: FirebaseService } }));
console.log("✅ FirebaseService ready - 1 file multi fungsi");
