console.log('SCRIPT START');

// =========================
// 1. DOM ELEMENTS
// =========================
const sidebar = document.getElementById('sidebar');
const workspace = document.getElementById('workspace');
const loginModal = document.getElementById('login');
const submitLoginBtn = document.getElementById('submitlogin');
const notificationModal = document.getElementById('notificationModal');
const notificationBtn = document.getElementById('notificationBtn');
const statusText = document.getElementById('statusText');
const historyList = document.getElementById('historyList');
const closeBtn = document.querySelector('#notificationModal .close');

// =========================
// 2. STATE
// =========================
let projects = [
  { id: 1, name: "project1", content: "Content for project1" },
  { id: 2, name: "project2", content: "Content for project2" }
];

let notificationHistory = JSON.parse(localStorage.getItem('notificationHistory')) || [];
let isLoggedIn = false;

// =========================
// 3. HELPER FUNCTIONS
// =========================
function renderWorkspace(html) {
  if (workspace) workspace.innerHTML = html;
}

function updateHistoryDisplay() {
  if (!historyList) return;
  historyList.innerHTML = notificationHistory
    .map(item => `<li>${item}</li>`)
    .join('');
}

function addToHistory(event) {
  const timestamp = new Date().toLocaleTimeString();
  notificationHistory.push(`${timestamp}: ${event}`);
  localStorage.setItem('notificationHistory', JSON.stringify(notificationHistory));
  updateHistoryDisplay();
}

function showNotification() {
  const notification = new Notification('Hello from Documentmanager!', {
    body: 'This is a test notification.',
    icon: 'https://via.placeholder.com/64'
  });
  
  notification.onclick = () => {
    window.focus();
    notification.close();
    addToHistory('Notification clicked');
  };
}

// =========================
// 4. SIDEBAR RENDER
// =========================
function renderSidebar() {
  if (!sidebar) return;
  let html = '<h3>Modules</h3>';
  projects.forEach(project => {
    html += `<div class="module" data-key="project" data-id="${project.id}">
                ${project.name}
                <div class="subbranch" data-key="project_${project.id}">${project.name} Content</div>
              </div>`;
  });
  html += `<div class="module" data-key="document">
            Document
            <div class="subbranch" data-key="document1">Document 1</div>
          </div>
          <div class="module" data-key="personnel">
            Personnel
            <div class="subbranch" data-key="personnel1">Personnel 1</div>
            <div class="subbranch" data-key="personnel2">Personnel 2</div>
          </div>`;
  sidebar.innerHTML = html;
}

// =========================
// 5. SIDEBAR TOGGLE
// =========================
if (sidebar) {
  sidebar.addEventListener('click', (e) => {
    const mod = e.target.closest('.module');
    if (!mod) return;
    if (e.target.classList.contains('subbranch')) return;
    mod.classList.toggle('active');
  });
}

// =========================
// 6. SUBBRANCH CLICKS
// =========================
if (workspace) {
  workspace.addEventListener('click', (e) => {
    const sub = e.target.closest('.subbranch');
    if (sub) {
      const key = sub.dataset.key;
      if (key && key.startsWith('project_')) {
        const projectId = parseInt(key.split('_')[1]);
        const project = projects.find(p => p.id === projectId);
        if (project) {
          renderWorkspace(`<h3>${project.name}</h3><p>${project.content}</p>`);
        }
      } else {
        const contentMap = {
          document1: '<h3>Document 1</h3><p>Content for Document 1</p>',
          personnel1: '<h3>Personnel 1</h3><p>Content for Personnel 1</p>',
          personnel2: '<h3>Personnel 2</h3><p>Content for Personnel 2</p>',
        };
        renderWorkspace(contentMap[key] || '<p>Not found</p>');
      }
    }
  });
}

// =========================
// 7. NAV BUTTONS
// =========================
const navButtons = document.querySelectorAll('.nav-buttons button');
navButtons.forEach(btn => {
  if (btn.textContent.toLowerCase() === 'login') return;
  
  btn.addEventListener('click', () => {
    const key = btn.textContent.toLowerCase().replace('&', '').replace(' ', '');
    const content = {
      home: '<h3>Home</h3><p>Welcome to Documentmanager</p>',
      about: '<h3>About</h3><p>About this Documentmanager</p>',
      faqsupport: '<h3>FAQ & Support</h3><p>Help section</p>',
      contact: '<h3>Contact</h3><p>Email: support@documanager.com</p>'
    };
    renderWorkspace(content[key] || '<p>Page not found</p>');
  });
});

// =========================
// 8. LOGIN MODAL
// =========================
const loginNavBtn = document.querySelector('.nav-buttons button:last-child');
if (loginNavBtn) {
  loginNavBtn.addEventListener('click', () => {
    if (loginModal) loginModal.style.display = 'flex';
  });
}

if (submitLoginBtn) {
  submitLoginBtn.addEventListener('click', async () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    const data = await response.json();
    
    if (data.success) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('loggedIn', 'true');
      if (loginModal) loginModal.style.display = 'none';
      renderWorkspace('<h3>Welcome, ' + username + '!</h3>');
      addToHistory('Login successful');
    } else {
      alert('Falscher Benutzername oder Passwort');
    }
  });
}

if (loginModal) {
  window.onclick = (e) => {
    if (e.target === loginModal) {
      loginModal.style.display = 'none';
    }
    if (e.target === notificationModal) {
      if (notificationModal) notificationModal.style.display = 'none';
      addToHistory('Modal closed');
    }
  };
}

// =========================
// 9. NOTIFICATION SYSTEM
// =========================
if (notificationBtn && notificationModal && statusText && closeBtn) {
  notificationBtn.addEventListener('click', () => {
    notificationModal.style.display = 'block';
    addToHistory('Modal opened');
    
    if (!('Notification' in window)) {
      statusText.textContent = 'Not supported';
      return;
    }
    
    if (Notification.permission === 'granted') {
      statusText.textContent = 'Permission granted';
      addToHistory('Notification sent');
      showNotification();
    } else if (Notification.permission === 'denied') {
      statusText.textContent = 'Blocked';
    } else {
      Notification.requestPermission().then(p => {
        if (p === 'granted') {
          statusText.textContent = 'Permission granted';
          addToHistory('Permission granted');
          showNotification();
        } else {
          statusText.textContent = 'Permission denied';
        }
      });
    }
  });
  
  closeBtn.onclick = () => {
    if (notificationModal) notificationModal.style.display = 'none';
    addToHistory('Modal closed');
  };
}

// =========================
// 10. INIT
// =========================
renderSidebar();
updateHistoryDisplay();