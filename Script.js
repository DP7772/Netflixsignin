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
  const terms = terms.checked;

  if (!name || !email || !password || !confirm) return alert("Fill all fields");
  if (password !== confirm) return alert("Password mismatch");
  if (!terms) return alert("Agree to terms");

  const res = await fetch('/.netlify/functions/signup', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({name,email,password})
  });

  const data = await res.json();
  alert(data.status === 'success' ? "Account created" : "Already exists");
  flip();
}

async function login() {
  const email = loginEmail.value.trim();
  const password = loginPassword.value;

  const res = await fetch('/.netlify/functions/login', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({email,password})
  });

  const data = await res.json();
  if(data.status === 'success'){
    alert("Login successful");
    window.location.href = "https://internetfloxmedia.netlify.app";
  } else {
    alert("Invalid credentials");
  }
}


