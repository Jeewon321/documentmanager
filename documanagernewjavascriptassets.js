console.log('SCRIPT START')
console.log(document.getElementById('sidebar'))
console.log(document.getElementById('workspace'))
// =========================
// 1. STATE & FUNCTIONS
// =========================

let projects = [
  { id: 1, name: "project1", content: "Content for project1" },
  { id: 2, name: "project2", content: "Content for project2" }
];

function renderSidebar() {
    const sidebar = document.getElementById('sidebar');
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

function attachModuleToggle() {
    document.querySelectorAll('.module').forEach(mod => {
        mod.addEventListener('click', (e) => {
            if (e.target.classList.contains('subbranch')) return;
            mod.classList.toggle('active');
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderSidebar();
    attachModuleToggle();
});

// =========================
// 2. WORKSPACE EVENTS
// =========================


// =========================
// 3. FUNCTIONS
// =========================

function updateHistoryDisplay() {
  if (!historyList) return;
  historyList.innerHTML = notificationHistory
  .map(item => `<li>${item}</li>`)
  .join('');
}

console.log("function updateHistory")

function addToHistory(event) {
  const timestamp = new Date().toLocaleTimeString();
  notificationHistory.push(`${timestamp}: ${event}`);
  
  localStorage.setItem('notificationHistory', JSON.stringify(notificationHistory));
  
  updateHistoryDisplay();
}

function renderWorkspace(html) {
  workspace.innerHTML = html;
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
// 4. INIT
// =========================

updateHistoryDisplay();


// =========================
// 5. NAV BUTTONS
// =========================


// 5.1 Normale Navigation (alle Buttons außer Login)
navButtons.forEach(btn => {
    // Login-Button überspringen (den letzten in der Navbar)
    if (btn === navButtons[navButtons.length - 1]) return;

    btn.addEventListener('click', () => {
        const key = btn.textContent
            .toLowerCase()
            .replace('&', '')
            .replace(' ', '');

        const content = {
            home: '<h3>Home</h3><p>Welcome</p>',
            about: '<h3>About</h3><p>About page</p>',
            faqsupport: '<h3>FAQ</h3><p>Help</p>',
            contact: '<h3>Contact</h3><p>Email</p>'
        };

        renderWorkspace(content[key] || '<p>Not found</p>');
    });
});

//login prozess 

const loginBtn = document.querySelector('.nav-buttons button:last-child');
const loginModal = document.getElementById('login');  // <-- Richtiger Modal!
const submitLoginBtn = document.getElementById('submitlogin');

if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        loginModal.style.display = 'block';  // Login-Modal öffnen
    });
} else {
    console.error("Login button not found");
}

// Login-Logik (wenn der Benutzer auf "login" im Modal klickt)
if (submitLoginBtn) {
    submitLoginBtn.addEventListener('click', () => {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username === "admin" && password === "admin") {
            isLoggedIn = true;
            addToHistory('Login successful');
            loginModal.style.display = 'none';  // Modal schließen
            renderWorkspace('<h3>Welcome, ' + username + '</h3>');
        } else {
            addToHistory('Login failed');
            alert("false credentials");
        }
    });
} else {
    console.error("Submit login button not found");
}
  
  
  
  // =========================
// 6. WORKSPACE EVENTS (DELEGATION)
// =========================

// =========================
// 6. WORKSPACE EVENTS (DELEGATION)
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
                } else {
                    renderWorkspace('<p>Error: Project not found</p>');
                }
            } else {
                const contentMap = {
                    document1: '<h3>Document 1</h3><p>Content for Document 1</p>',
                    personnel1: '<h3>Personnel 1</h3><p>Content for Personnel 1</p>',
                    personnel2: '<h3>Personnel 2</h3><p>Content for Personnel 2</p>',
                };
                renderWorkspace(contentMap[key] || '<p>Error: Not found</p>');
            }
            return;
        }
        if (e.target.matches('button')) {
            console.log('workspace button clicked');
        }
    });
}
  
  // =========================
  // 7. MODULE TOGGLE
  // =========================
  
  const sidebar = document.getElementById('sidebar');

sidebar.addEventListener('click', (e) => {
    const mod = e.target.closest('.module');

    if (!mod) return;

    // Verhindert Toggle bei Klick auf subbranch
    if (e.target.classList.contains('subbranch')) return;

    mod.classList.toggle('active');
});
  
  
  // =========================
  // 8. SEARCH
  // =========================
  
  
  
  // =========================
  // 9. NOTIFICATION SYSTEM
  // =========================
  
  if (modal && statusText && closeBtn) {
    
    document.getElementById('notificationBtn')
    .addEventListener('click', () => {
      
      modal.style.display = 'block';
      addToHistory('Modal opened');
      
      if (!('Notification' in window)) {
        statusText.textContent = 'Not supported';
        return;
      }
      
      if (Notification.permission === 'granted') {
        addToHistory('Notification sent');
        showNotification();
      }
      
      else if (Notification.permission === 'denied') {
        statusText.textContent = 'Blocked';
      }
      
      else {
        Notification.requestPermission().then(p => {
          if (p === 'granted') {
            addToHistory('Permission granted');
            showNotification();
          }
        });
      }
    });
    
    closeBtn.onclick = () => {
      modal.style.display = 'none';
      addToHistory('Modal closed');
    };
    
    window.onclick = (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    }
    }

    
