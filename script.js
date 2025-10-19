const ADMIN_PASSWORD = "hasnacantiksekali"; // ubah sesuai keinginan
const STORAGE_KEY = "tur_tur_posts_v1";
const SARAN_KEY = "tur_tur_saran_v1";

// ==== Elemen Dasar ====
const profileClick = document.getElementById("profileClick");
const loginPanel = document.getElementById("loginPanel");
const adminPwdInput = document.getElementById("adminPwdInput");
const loginSubmitBtn = document.getElementById("loginSubmitBtn");
const loginCancelBtn = document.getElementById("loginCancelBtn");
const loginError = document.getElementById("loginError");

const postsList = document.getElementById("postsList");
const newPostPanel = document.getElementById("newPostPanel");
const postTitleInput = document.getElementById("postTitle");
const postContentInput = document.getElementById("postContent");
const savePostBtn = document.getElementById("savePostBtn");
const cancelPostBtn = document.getElementById("cancelPostBtn");
const logoutBtn = document.getElementById("logoutBtn");

const saranInput = document.getElementById("saranInput");
const kirimSaranBtn = document.getElementById("kirimSaranBtn");
const daftarSaran = document.getElementById("daftarSaran");

// ==== Variabel Data ====
let isAdmin = localStorage.getItem("tur_is_admin") === "true";
let posts = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
let sarans = JSON.parse(localStorage.getItem(SARAN_KEY) || "[]");

// ==== Utilitas ====
function escapeHtml(str) {
  return str.replace(/[&<>"']/g, c => (
    {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]
  ));
}

// ==== RENDER BLOG ====
function renderPosts() {
  postsList.innerHTML = "";
  const sorted = posts.sort((a, b) => b.createdAt - a.createdAt);
  if (sorted.length === 0) {
    postsList.innerHTML = "<p>Belum ada postingan.</p>";
    return;
  }

  sorted.forEach(post => {
    const div = document.createElement("div");
    div.className = "post";
    div.innerHTML = `
      <h3>${escapeHtml(post.title)}</h3>
      <p>${escapeHtml(post.content).replace(/\n/g, "<br>")}</p>
      <small>${new Date(post.createdAt).toLocaleString()}</small>
      ${
        isAdmin
          ? `<div class="admin-controls">
              <button class="btn delete-btn" data-id="${post.id}" onclick="handleDeletePost(this)">🗑 Hapus</button>
            </div>`
          : ""
      }
    `;
    postsList.appendChild(div);
  });
}

// ==== RENDER KRITIK & SARAN ====
function renderSaran() {
  daftarSaran.innerHTML = "";
  if (sarans.length === 0) {
    daftarSaran.innerHTML = "<p>Belum ada kritik atau saran.</p>";
    return;
  }

  sarans
    .sort((a, b) => b.createdAt - a.createdAt)
    .forEach(s => {
      const div = document.createElement("div");
      div.className = "saran-item";
      div.innerHTML = `
        <p>${escapeHtml(s.content).replace(/\n/g, "<br>")}</p>
        <small>${new Date(s.createdAt).toLocaleString()}</small>
        ${
          isAdmin
            ? `<div class="admin-controls">
                <button class="btn delete-btn" data-id="${s.id}" onclick="handleDeleteSaran(this)">🗑 Hapus</button>
              </div>`
            : ""
        }
      `;
      daftarSaran.appendChild(div);
    });
}

// ==== LOGIN ====
function toggleLoginPanel(show) {
  loginPanel.classList.toggle("show", show ?? !loginPanel.classList.contains("show"));
  loginError.style.display = "none";
  adminPwdInput.value = "";
}

function doLogin() {
  if (adminPwdInput.value.trim() === ADMIN_PASSWORD) {
    isAdmin = true;
    localStorage.setItem("tur_is_admin", "true");
    toggleLoginPanel(false);
    updateUI();
  } else {
    loginError.style.display = "block";
  }
}

function doLogout() {
  if (confirm("Yakin ingin logout admin?")) {
    isAdmin = false;
    localStorage.removeItem("tur_is_admin");
    updateUI();
  }
}

// ==== BLOG FUNCTION ====
function addPost() {
  if (!isAdmin) return alert("Hanya admin yang dapat menambah postingan.");
  const title = postTitleInput.value.trim();
  const content = postContentInput.value.trim();
  if (!title || !content) return alert("Judul dan isi wajib diisi!");
  const post = { id: Date.now().toString(), title, content, author: "admin", createdAt: Date.now() };
  posts.push(post);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  postTitleInput.value = postContentInput.value = "";
  renderPosts();
}

function handleDeletePost(btn) {
  const id = btn.dataset.id;
  if (confirm("Hapus postingan ini?")) {
    posts = posts.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    renderPosts();
  }
}

// ==== KRITIK & SARAN FUNCTION ====
function kirimSaran() {
  const isi = saranInput.value.trim();
  if (!isi) return alert("Isi kritik/saran tidak boleh kosong!");
  const saran = { id: Date.now().toString(), content: isi, createdAt: Date.now() };
  sarans.push(saran);
  localStorage.setItem(SARAN_KEY, JSON.stringify(sarans));
  saranInput.value = "";
  renderSaran(); // langsung muncul tanpa reload
}

function handleDeleteSaran(btn) {
  const id = btn.dataset.id;
  if (confirm("Hapus saran ini?")) {
    sarans = sarans.filter(s => s.id !== id);
    localStorage.setItem(SARAN_KEY, JSON.stringify(sarans));
    renderSaran();
  }
}

// ==== UPDATE UI ====
function updateUI() {
  newPostPanel.style.display = isAdmin ? "block" : "none";
  logoutBtn.style.display = isAdmin ? "inline-block" : "none";
  renderPosts();
  renderSaran();
}

// ==== EVENT LISTENER ====
profileClick.onclick = () => toggleLoginPanel();
loginSubmitBtn.onclick = doLogin;
loginCancelBtn.onclick = () => toggleLoginPanel(false);
savePostBtn.onclick = addPost;
cancelPostBtn.onclick = () => (newPostPanel.style.display = "none");
logoutBtn.onclick = doLogout;
kirimSaranBtn.onclick = kirimSaran;

// ==== GLOBAL UNTUK TOMBOL DINAMIS ====
window.handleDeletePost = handleDeletePost;
window.handleDeleteSaran = handleDeleteSaran;

// ==== INIT ====
updateUI();