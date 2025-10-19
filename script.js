const ADMIN_PASSWORD = "hasna.cantik.sekali";
const STORAGE_KEY = "tur_tur_posts_v1";

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

let isAdmin = localStorage.getItem("tur_is_admin") === "true";
let posts = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, c => (
    {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]
  ));
}

function renderPosts() {
  postsList.innerHTML = "";
  const adminPosts = posts.filter(p => p.author === "admin").sort((a,b)=> b.createdAt - a.createdAt);
  if (adminPosts.length === 0) {
    postsList.innerHTML = "<p>Belum ada postingan.</p>";
    return;
  }
  adminPosts.forEach(post => {
    const div = document.createElement("div");
    div.className = "post";
    div.innerHTML = `
      <h3>${escapeHtml(post.title)}</h3>
      <p>${escapeHtml(post.content).replace(/\n/g,"<br>")}</p>
      <small>${new Date(post.createdAt).toLocaleString()}</small>
      ${isAdmin ? `<div><button class="btn ghost" data-id="${post.id}" onclick="handleDelete(this)">Hapus</button></div>` : ""}
    `;
    postsList.appendChild(div);
  });
}

function toggleLoginPanel(show) {
  loginPanel.classList.toggle("show", show ?? !loginPanel.classList.contains("show"));
  loginError.style.display = "none";
  adminPwdInput.value = "";
}

function doLogin() {
  if (adminPwdInput.value === ADMIN_PASSWORD) {
    isAdmin = true;
    localStorage.setItem("tur_is_admin", "true");
    toggleLoginPanel(false);
    updateUI();
  } else loginError.style.display = "block";
}

function doLogout() {
  isAdmin = false;
  localStorage.removeItem("tur_is_admin");
  updateUI();
}

function addPost() {
  if (!isAdmin) return alert("Hanya admin yang dapat menambah postingan.");
  const title = postTitleInput.value.trim();
  const content = postContentInput.value.trim();
  if (!title || !content) return alert("Judul dan isi wajib diisi!");
  const post = { id: Date.now().toString(), title, content, author:"admin", createdAt: Date.now() };
  posts.push(post);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  postTitleInput.value = postContentInput.value = "";
  renderPosts();
}

function handleDelete(btn) {
  const id = btn.dataset.id;
  if (confirm("Yakin ingin hapus postingan ini?")) {
    posts = posts.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    renderPosts();
  }
}

function updateUI() {
  newPostPanel.style.display = isAdmin ? "block" : "none";
  logoutBtn.style.display = isAdmin ? "inline-block" : "none";
  renderPosts();
}

profileClick.onclick = () => toggleLoginPanel();
loginSubmitBtn.onclick = doLogin;
loginCancelBtn.onclick = () => toggleLoginPanel(false);
savePostBtn.onclick = addPost;
cancelPostBtn.onclick = () => newPostPanel.style.display = "none";
logoutBtn.onclick = () => confirm("Logout admin?") && doLogout();

window.handleDelete = handleDelete;
updateUI();