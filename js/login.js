import { auth, db } from './firebase-config.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const form = document.getElementById('loginForm');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const btn = document.getElementById('loginBtn');
  const err = document.getElementById('loginError');

  btn.textContent = 'Memeriksa...';
  btn.disabled = true;

  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    // Cek role admin di Firestore
    const userDoc = await getDoc(doc(db, "users", cred.user.uid));
    if(userDoc.exists()){
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userRole', userDoc.data().role);
      localStorage.setItem('userName', userDoc.data().name);
      window.location.href = './admin.html';
    } else {
      // Jika belum ada data di users, tetap masuk tapi sebagai operator
      localStorage.setItem('isLoggedIn', 'true');
      window.location.href = './admin.html';
    }
  } catch (error) {
    err.style.display = 'block';
    err.textContent = 'Login gagal: ' + error.message;
    btn.textContent = 'Sign In';
    btn.disabled = false;
  }
});
