// js/config/firebase-service.js - 1 FILE MULTI FUNGSI - SINGLE SOURCE
// Lokasi resmi: /sd134kalumpang/js/config/firebase-service.js
// Fungsi: Handle semua Master Data (peserta_didik, kop, sarana, tp, cp, atp, mapel) dalam 1 file
// Project: sdn134kalumpang - NPSN 40312947
// Tidak ada file firebase lain di repo

import { db } from "./firebase-config.js";
import { collection, doc, addDoc, setDoc, getDocs, getDoc, updateDoc, deleteDoc, onSnapshot, writeBatch } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const NPSN = '40312947';

const FirebaseService = {
  isEnabled: () => typeof db !== 'undefined' && db !== null,

  // ===== GENERIC - 1 FUNGSI UNTUK SEMUA KOLEKSI =====
  getCollection: (namaKoleksi) => {
    return collection(db, 'schools', NPSN, namaKoleksi);
  },

  async getAll(namaKoleksi){
    if(!this.isEnabled()){
      const md = ServiceMenu.getMasterData();
      return md[namaKoleksi] || [];
    }
    try{
      const snap = await getDocs(this.getCollection(namaKoleksi));
      const list = snap.docs.map(d=>({ firestore_id:d.id, id:d.id, ...d.data() }));
      // Auto sync ke localStorage biar offline tetap jalan
      if(list.length && window.ServiceMenu){
        const md = ServiceMenu.getMasterData();
        md[namaKoleksi] = list;
        ServiceMenu.saveMasterData(md);
      }
      console.log(`✅ Load ${list.length} dari Firestore: ${namaKoleksi}`);
      return list;
    }catch(e){
      console.error(`Firestore getAll ${namaKoleksi} error:`, e);
      const md = ServiceMenu.getMasterData();
      return md[namaKoleksi] || [];
    }
  },

  async getById(namaKoleksi, firestoreId){
    try{
      const snap = await getDoc(doc(this.getCollection(namaKoleksi), firestoreId));
      return snap.exists() ? { firestore_id:snap.id, id:snap.id, ...snap.data() } : null;
    }catch(e){ console.error(e); return null; }
  },

  async add(namaKoleksi, data){
    const withOwner = ServiceMenu.addOwner({...data, updated_at:new Date().toISOString()});
    // Simpan local dulu (offline first)
    let md = ServiceMenu.getMasterData();
    if(!md[namaKoleksi]) md[namaKoleksi] = [];
    md[namaKoleksi].push({...withOwner, id:Date.now()});
    ServiceMenu.saveMasterData(md);

    if(!this.isEnabled()) return withOwner;
    try{
      const ref = await addDoc(this.getCollection(namaKoleksi), withOwner);
      console.log(`✅ Simpan ${namaKoleksi} ke Firestore:`, ref.id);
      return {...withOwner, firestore_id:ref.id};
    }catch(e){
      console.error(`❌ Gagal simpan ${namaKoleksi}:`, e);
      alert(`Gagal ke Firestore (${namaKoleksi}): ${e.message}\nCek Firestore Rules harus allow read,write if true`);
      return withOwner;
    }
  },

  async addBatch(namaKoleksi, listData){
    const withOwners = listData.map(d=>ServiceMenu.addOwner({id:Date.now()+Math.random(), ...d, updated_at:new Date().toISOString()}));
    let md = ServiceMenu.getMasterData();
    if(!md[namaKoleksi]) md[namaKoleksi]=[];
    md[namaKoleksi] = md[namaKoleksi].concat(withOwners);
    ServiceMenu.saveMasterData(md);

    if(!this.isEnabled()) return withOwners;
    try{
      const batch = writeBatch(db);
      withOwners.forEach(d=>{
        const ref = doc(this.getCollection(namaKoleksi));
        batch.set(ref, d);
      });
      await batch.commit();
      console.log(`✅ Batch ${withOwners.length} ke Firestore: ${namaKoleksi}`);
      return withOwners;
    }catch(e){ console.error(`Batch ${namaKoleksi} error:`, e); return withOwners; }
  },

  async update(namaKoleksi, firestoreId, data){
    if(!this.isEnabled()) return;
    try{
      await updateDoc(doc(this.getCollection(namaKoleksi), firestoreId), {...data, updated_at:new Date().toISOString()});
      console.log(`✅ Update ${namaKoleksi}:`, firestoreId);
    }catch(e){ console.error(e); }
  },

  async delete(namaKoleksi, firestoreId, localId){
    let md = ServiceMenu.getMasterData();
    if(md[namaKoleksi]){
      md[namaKoleksi] = md[namaKoleksi].filter(s=>s.id!=localId && s.firestore_id!=firestoreId && s.id!=firestoreId);
      ServiceMenu.saveMasterData(md);
    }
    if(!this.isEnabled()) return;
    try{ await deleteDoc(doc(this.getCollection(namaKoleksi), firestoreId)); console.log(`✅ Hapus ${namaKoleksi}:`, firestoreId); }catch(e){ console.error(e); }
  },

  listen(namaKoleksi, callback){
    if(!this.isEnabled()) return ()=>{};
    return onSnapshot(this.getCollection(namaKoleksi), snap=>{
      const list = snap.docs.map(d=>({firestore_id:d.id, id:d.id, ...d.data()}));
      // Sort untuk peserta_didik
      if(namaKoleksi==='peserta_didik'){
        list.sort((a,b)=> (a.kelas||'').localeCompare(b.kelas||'') || (a.nama||'').localeCompare(b.nama||''));
      }
      const md = ServiceMenu.getMasterData();
      md[namaKoleksi]=list;
      ServiceMenu.saveMasterData(md);
      if(callback) callback(list);
      console.log(`🔄 Realtime ${namaKoleksi}: ${list.length}`);
    });
  },

  // ===== WRAPPER KHUSUS - TAPI TETAP PAKAI GENERIC DI DALAM (1 file multi fungsi) =====
  // Peserta Didik
  getPesertaDidik(){ return this.getAll('peserta_didik'); },
  addPesertaDidik(data){ return this.add('peserta_didik', data); },
  addBatchPesertaDidik(list){ return this.addBatch('peserta_didik', list); },
  updatePesertaDidik(fid, data){ return this.update('peserta_didik', fid, data); },
  deletePesertaDidik(fid, localId){ return this.delete('peserta_didik', fid, localId); },
  listenPesertaDidik(cb){ return this.listen('peserta_didik', cb); },

  // Kop Administrasi (simpan di schools/40312947/kop/current - 1 doc saja)
  async getKop(){
    if(!this.isEnabled()){
      return ServiceMenu.getMasterData().kop || null;
    }
    try{
      const snap = await getDoc(doc(db, 'schools', NPSN, 'kop', 'current'));
      if(snap.exists()){
        const data = snap.data();
        const md = ServiceMenu.getMasterData();
        md.kop = data;
        ServiceMenu.saveMasterData(md);
        return data;
      }
      return ServiceMenu.getMasterData().kop;
    }catch(e){ console.error(e); return ServiceMenu.getMasterData().kop; }
  },
  async saveKop(kopData){
    let md = ServiceMenu.getMasterData();
    md.kop = kopData;
    ServiceMenu.saveMasterData(md);
    if(!this.isEnabled()) return;
    try{
      await setDoc(doc(db, 'schools', NPSN, 'kop', 'current'), {...kopData, updated_at:new Date().toISOString()});
      await setDoc(doc(db, 'schools', NPSN), { kop:kopData, updated_at:new Date().toISOString() }, {merge:true});
      console.log('✅ Kop simpan Firestore');
    }catch(e){ console.error(e); }
  },
  listenKop(cb){
    if(!this.isEnabled()) return ()=>{};
    return onSnapshot(doc(db, 'schools', NPSN, 'kop', 'current'), snap=>{
      if(snap.exists()){
        const data = snap.data();
        const md = ServiceMenu.getMasterData();
        md.kop = data;
        ServiceMenu.saveMasterData(md);
        if(cb) cb(data);
      }
    });
  },

  // Sarana, TP, CP, ATP, Mapel - pakai generic langsung
  getSarana(){ return this.getAll('sarana'); },
  addSarana(data){ return this.add('sarana', data); },
  getTP(){ return this.getAll('tp'); },
  addTP(data){ return this.add('tp', data); },
  getCP(){ return this.getAll('cp'); },
  getATP(){ return this.getAll('atp'); },
  getMapel(){ return this.getAll('mapel'); }
};

window.FirebaseService = FirebaseService;
export default FirebaseService;
