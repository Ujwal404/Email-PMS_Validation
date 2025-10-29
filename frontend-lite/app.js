// Use the same host you're visiting, on port 3000 (backend)
const API_BASE = `https://emailpmsvalidation.vercel.app`;

function debounce(fn, ms) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn.apply(null, args), ms); };
}

const checkEmailInput = document.getElementById('checkEmail');
const checkStatus = document.getElementById('checkStatus');

async function validateEmail(email) {
  if (!email || !email.trim()) { checkStatus.innerHTML = ''; return; }
  try {
    const url = `${API_BASE}/v1/validation/email?email=${encodeURIComponent(email)}`;
    const res = await fetch(url, { method: 'GET' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.valid === true) {
      checkStatus.innerHTML = '<p class="ok">Valid and available</p>';
    } else if (data.reason === 'taken') {
      checkStatus.innerHTML = '<p class="warn">Already taken</p>';
    } else {
      checkStatus.innerHTML = '<p class="err">Invalid</p>';
    }
  } catch (e) {
    checkStatus.innerHTML = '<p class="err">Failed to check</p>';
  }
}

checkEmailInput.addEventListener('input', debounce((e) => {
  validateEmail(e.target.value);
}, 500));

const createEmail = document.getElementById('createEmail');
const createPms = document.getElementById('createPms');
const createBtn = document.getElementById('createBtn');
const createStatus = document.getElementById('createStatus');

createBtn.addEventListener('click', async () => {
  const email = (createEmail.value || '').trim();
  const pms = (createPms.value || '').trim().toUpperCase();
  createStatus.textContent = '';
  if (!email || !pms) { createStatus.innerHTML = '<p class="err">Email and PMS ID are required</p>'; return; }
  try {
    const res = await fetch(`${API_BASE}/v1/users`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, pms_id: pms })
    });
    if (res.status === 201) {
      const data = await res.json();
      createStatus.innerHTML = `<p class="ok">Created #${data.id} (${data.email})</p>`;
      createEmail.value = ''; createPms.value = '';
    } else if (res.status === 409) {
      createStatus.innerHTML = '<p class="err">Email already exists</p>';
    } else if (res.status === 400) {
      createStatus.innerHTML = '<p class="err">Invalid email or PMS ID</p>';
    } else {
      createStatus.innerHTML = '<p class="err">Failed to create user</p>';
    }
  } catch (e) {
    createStatus.innerHTML = '<p class="err">Network error</p>';
  }
});


