// js/firebase-service.js - SERVICE FIRESTORE MODULAR v10 - SDN 134 KALUMPANG
// Path: /sd134kalumpang/js/firebase-service.js
// Sudah terhubung ke project: sdn134kalumpang

import { db } from "./config/firebase-config.js";
import { collection, doc, addDoc, setDoc, getDocs, getDoc, updateDoc, deleteDoc, onSnapshot, query, orderBy, writeBatch } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const FirebaseService = {
  isEnabled: () => typeof db !== 'undefined' && db !== null,
  
  getSchoolDocRef: function(){
    const npsn = (window.ServiceMenu ? ServiceMenu.getSchoolInfo().npsn : '40312947') || '40312947';
    return doc(db, 'schools', npsn);
  },

  getPesertaDidikCollection: function(){
    const npsn = (window.ServiceMenu ? ServiceMenu.getSchoolInfo().npsn : '40312947') || '40312947';
    return collection(db, 'schools', npsn, 'peserta_didik');
  },

  // ====== PESERTA DIDIK - FIRESTORE ======
  async getPesertaDidik(){
    if(!this.isEnabled()){
      const md = window.ServiceMenu ? ServiceMenu.getMasterData() : { peserta_didik: [] };
      return md.peserta_didik || [];
    }
    try {
      const q = query(this.getPesertaDidikCollection(), orderBy('kelas'), orderBy('nama'));
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map(d => ({ firestore_id: d.id, id: d.id, ...d.data() }));
      // Sync ke localStorage
      if(window.ServiceMenu){
        const md = ServiceMenu.getMasterData();
        if(list.length) {
          md.peserta_didik = list;
          ServiceMenu.saveMasterData(md);
        }
      }
      console.log(`✅ Load ${list.length} siswa dari Firestore`);
      return list;
    } catch(e){
      console.error("Gagal get peserta didik:", e);
      // Fallback ke localStorage
      if(window.ServiceMenu){
        return ServiceMenu.getMasterData().peserta_didik || [];
      }
      return [];
    }
  },

  async addPesertaDidik(data){
    const withOwner = window.ServiceMenu ? ServiceMenu.addOwner(data) : { ...data, created_at: new Date().toISOString() };
    
    // Simpan local dulu (offline first)
    if(window.ServiceMenu){
      let md = ServiceMenu.getMasterData();
      md.peserta_didik.push({ ...withOwner, id: withOwner.id || Date.now() });
      ServiceMenu.saveMasterData(md);
    }
    
    if(!this.isEnabled()) return withOwner;
    
    try {
      const docRef = await addDoc(this.getPesertaDidikCollection(), withOwner);
      console.log("✅ Peserta didik tersimpan di Firestore:", docRef.id);
      return { ...withOwner, firestore_id: docRef.id, id: docRef.id };
    } catch(e){
      console.error("❌ Gagal simpan ke Firestore:", e);
      return withOwner;
    }
  },

  async addBatchPesertaDidik(listData){
    if(!listData.length) return [];
    const withOwners = listData.map(d => window.ServiceMenu ? ServiceMenu.addOwner({ id: Date.now()+Math.random(), ...d }) : d);
    
    // Local
    if(window.ServiceMenu){
      let md = ServiceMenu.getMasterData();
      md.peserta_didik = md.peserta_didik.concat(withOwners);
      ServiceMenu.saveMasterData(md);
    }

    if(!this.isEnabled()) return withOwners;

    try {
      const batch = writeBatch(db);
      withOwners.forEach(data => {
        const docRef = doc(this.getPesertaDidikCollection());
        batch.set(docRef, data);
      });
      await batch.commit();
      console.log(`✅ Batch ${withOwners.length} siswa tersimpan di Firestore`);
      return withOwners;
    } catch(e){
      console.error("❌ Batch import gagal:", e);
      return withOwners;
    }
  },

  async updatePesertaDidik(firestoreId, data){
    if(!this.isEnabled()) return;
    try {
      const docRef = doc(this.getPesertaDidikCollection(), firestoreId);
      await updateDoc(docRef, { ...data, updated_at: new Date().toISOString() });
      console.log("✅ Update Firestore:", firestoreId);
    } catch(e){ console.error(e); }
  },

  async deletePesertaDidik(firestoreId, localId){
    // Hapus local
    if(window.ServiceMenu){
      let md = ServiceMenu.getMasterData();
      md.peserta_didik = md.peserta_didik.filter(s=>s.id!=localId && s.firestore_id!=firestoreId && s.id!=firestoreId);
      ServiceMenu.saveMasterData(md);
    }

    if(!this.isEnabled()) return;
    try {
      const docRef = doc(this.getPesertaDidikCollection(), firestoreId);
      await deleteDoc(docRef);
      console.log("✅ Hapus dari Firestore:", firestoreId);
    } catch(e){ console.error(e); }
  },

  // ====== KOP ADMINISTRASI ======
  async saveKop(kopData){
    if(window.ServiceMenu){
      let md = ServiceMenu.getMasterData();
      md.kop = kopData;
      ServiceMenu.saveMasterData(md);
    }
    if(!this.isEnabled()) return;
    try {
      const npsn = (window.ServiceMenu ? ServiceMenu.getSchoolInfo().npsn : '40312947') || '40312947';
      await setDoc(doc(db, 'schools', npsn, 'kop', 'current'), kopData);
      await setDoc(doc(db, 'schools', npsn), { kop: kopData, updated_at: new Date().toISOString() }, { merge: true });
      console.log("✅ Kop tersimpan di Firestore");
    } catch(e){ console.error(e); }
  },

  // ====== REALTIME LISTENER ======
  listenPesertaDidik(callback){
    if(!this.isEnabled()) return () => {};
    const q = query(this.getPesertaDidikCollection(), orderBy('kelas'));
    return onSnapshot(q, snapshot => {
      const list = snapshot.docs.map(doc => ({ firestore_id: doc.id, id: doc.id, ...doc.data() }));
      if(window.ServiceMenu){
        const md = ServiceMenu.getMasterData();
        md.peserta_didik = list;
        ServiceMenu.saveMasterData(md);
      }
      if(callback) callback(list);
      console.log(`🔄 Realtime update: ${list.length} siswa`);
    }, err => console.error("Realtime error:", err));
  }
};

window.FirebaseService = FirebaseService;
export default FirebaseService;
