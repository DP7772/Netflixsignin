let flipped = false;
let currentLang = 'en';

function flip() {
  flipped = !flipped;
  document.getElementById("flipCard").style.transform =
    flipped ? "rotateY(180deg)" : "rotateY(0deg)";
}

async function signup() {
  const name = signupName.value.trim();
  const email = signupEmail.value.trim();
  const password = signupPassword.value;
  const confirm = signupConfirm.value;
  const terms = document.getElementById("terms").checked;

  if (!name || !email || !password || !confirm) {
    alert(messages[currentLang].fillAllFields);
    return;
  }

  if (password.length < 4) {
    alert(messages[currentLang].passwordShort);
    return;
  }

  if (password !== confirm) {
    alert(messages[currentLang].passwordMismatch);
    return;
  }

  if (!terms) {
    alert(messages[currentLang].agreeTerms);
    return;
  }

  const res = await fetch('/.netlify/functions/signup', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({name,email,password})
  });

  const data = await res.json();

  if (data.status === 'success') {
    alert(messages[currentLang].signupSuccess);
    flip();
  } else {
    alert(data.message || "Error");
  }
}

async function login() {
  const email = loginEmail.value.trim();
  const password = loginPassword.value;

  if (!email || !password) {
    alert(messages[currentLang].fillAllFields);
    return;
  }

  const res = await fetch('/.netlify/functions/login', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({email,password})
  });

  const data = await res.json();

  if (data.status === 'success') {
    alert(messages[currentLang].loginSuccess);
    window.location.href="https://internetfloxmedia.netlify.app";
  } else {
    alert(messages[currentLang].invalidCredentials);
  }
}

/* 🔤 Messages object – SAME as your original */
const messages = { /* ❗ SAME OBJECT AS YOU ALREADY HAVE ❗ */ };

function changeLanguage(lang) {
  currentLang = lang;
  const l = messages[lang];
  signupTitle.innerText = l.signupTitle;
  loginTitle.innerText = l.loginTitle;
  signupButton.innerText = l.signupButton;
  goLogin.innerText = l.goLogin;
  backSignup.innerText = l.backSignup;
  termsText.innerText = l.terms;
  newsletterText.innerText = l.newsletter;
}
