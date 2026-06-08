// 🔥 IMPORTS
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, 
         onAuthStateChanged, sendEmailVerification, sendPasswordResetEmail } 
from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

import { getFirestore, doc, setDoc, updateDoc, getDoc } 
from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

// 🔥 CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyAG8y2Zo8z1Gd5S0SRujr2jyQDYZF2RCj8",
  authDomain: "educaaccionedu.firebaseapp.com",
  projectId: "educaaccionedu",
  storageBucket: "educaaccionedu.firebasestorage.app",
  messagingSenderId: "660080325935",
  appId: "1:660080325935:web:1487f838c86a2ac4835dda"
};

// INIT
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 🔁 CAMBIAR FORMULARIOS
window.toggleForms = function(){
  document.getElementById("registerForm").classList.toggle("hidden");
  document.getElementById("loginForm").classList.toggle("hidden");
}

// 🔐 VALIDAR PASSWORD
function validarPassword(password){
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]{8,}$/;
  return regex.test(password);
}

// 👁 MOSTRAR/OCULTAR PASSWORD
window.togglePassword = function(id){
  const input = document.getElementById(id);
  input.type = input.type === "password" ? "text" : "password";
}

// ✅ REGISTRO
window.registerUser = async () => {
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if(password !== confirmPassword){
    alert("❌ Las contraseñas no coinciden");
    return;
  }

  if(!validarPassword(password)){
    alert("❌ Contraseña insegura.\nDebe tener mayúscula, minúscula, número y símbolo.");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 📌 Crear documento inicial en Firestore
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      progreso: "Inicio",
      createdAt: new Date()
    });

    // 📩 Enviar verificación de correo
    await sendEmailVerification(user);
    alert("📩 Se envió un correo de verificación. Revisa tu bandeja (incluye spam).");

    toggleForms();

  } catch (error) {
    alert("❌ " + error.message);
  }
};

// ✅ LOGIN
window.signIn = async () => {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if(!user.emailVerified){
      alert("⚠️ Verifica tu correo antes de continuar o usa el botón de reenviar verificación.");
      return;
    }

    // 📌 Recuperar progreso del usuario
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);
    if(snap.exists()){
      const datos = snap.data();
      alert("🚀 Login exitoso. Tu progreso: " + datos.progreso);
    }

    window.location.href = "inicio1i.html";

  } catch (error) {
    alert("❌ " + error.message);
  }
};

// 🔑 GUARDAR PROGRESO
window.guardarProgreso = async (user, progreso) => {
  const userRef = doc(db, "users", user.uid);
  await updateDoc(userRef, {
    progreso: progreso,
    ultimaSesion: new Date()
  });
  alert("✅ Progreso guardado: " + progreso);
};

// 🔑 RESTABLECER CONTRASEÑA
window.resetPassword = async () => {
  const email = document.getElementById("loginEmail").value;
  if(!email){
    alert("⚠️ Ingresa tu correo para recuperar la contraseña.");
    return;
  }
  try {
    await sendPasswordResetEmail(auth, email);
    alert("📩 Se envió un correo para restablecer tu contraseña. Revisa tu bandeja.");
  } catch (error) {
    alert("❌ " + error.message);
  }
};

// 📩 REENVIAR VERIFICACIÓN DE CORREO
window.reenviarVerificacion = async () => {
  const user = auth.currentUser;
  if(user){
    try {
      await sendEmailVerification(user);
      alert("📩 Se envió nuevamente el correo de verificación. Revisa tu bandeja (incluye spam).");
    } catch (error) {
      alert("❌ Error al reenviar verificación: " + error.message);
    }
  } else {
    alert("⚠️ Debes iniciar sesión primero para reenviar la verificación.");
  }
};

// ⚡ DETECTAR USUARIO YA LOGUEADO
onAuthStateChanged(auth, async (user) => {
  if(user && user.emailVerified){
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);
    if(snap.exists()){
      console.log("Progreso recuperado:", snap.data().progreso);
    }
    window.location.href = "inicio1i.html";
  }
});

// ⚡ VALIDACIÓN EN TIEMPO REAL
const passInput = document.getElementById("registerPassword");
const helpText = document.getElementById("passwordHelp");

passInput.addEventListener("input", () => {
  if(validarPassword(passInput.value)){
    helpText.style.color = "#22c55e";
    helpText.textContent = "✅ Contraseña segura";
  } else {
    helpText.style.color = "red";
    helpText.textContent = "❌ Debe tener mayúscula, minúscula, número y símbolo";
  }
});