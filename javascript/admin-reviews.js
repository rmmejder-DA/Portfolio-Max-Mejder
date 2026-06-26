const PENDING_KEY = 'portfolioPendingReviews';
const APPROVED_KEY = 'portfolioReviews';
const AUTH_KEY = 'adminAuthenticated';
const ADMIN_PASSWORD = 'Mikel10Milana22';
const AVATAR = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgc3Ryb2tlPSIjNzBFNjFDIiBzdHJva2Utd2lkdGg9IjIuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0LCAwKSI+PHBhdGggZD0iTTE4LjUgNi41QzIwLjk4NTMgNi41IDIzIDguNTE0NzIgMjMgMTFWMTNIMzFDMzIuNjU2OSAxMyA0NCAxNC4zNDMxIDQ0IDE2VjI0SDE2VjE1QzE2IDguNTE0NzIgMTguMDE0NyA2LjUgMTguNSA2LjVaIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS13aWR0aD0iMi41IiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9nPjwvc3ZnPg==';

let pending = [];
let selected = new Set();

const q = s => document.querySelector(s);
const qa = s => document.querySelectorAll(s);

function login(e) {
    e.preventDefault();
    const pwd = q('#adminPassword').value;
    if (!pwd) { alert('Passwort eingeben'); return; }
    if (pwd === ADMIN_PASSWORD) {
        sessionStorage.setItem(AUTH_KEY, 'true');
        q('#loginOverlay').classList.remove('active');
        q('#adminPanel').style.display = 'block';
        load();
    } else alert('❌ Falsches Passwort');
    q('#adminPassword').value = '';
}

function logout() {
    sessionStorage.removeItem(AUTH_KEY);
    q('#loginOverlay').classList.add('active');
    q('#adminPanel').style.display = 'none';
}

function load() {
    // Try to load from API first (for server deployment)
    fetch('reviews_api.php?action=pending')
        .then(r => r.json())
        .then(data => {
            if (data.success && data.reviews) {
                pending = data.reviews;
            } else {
                // Fallback to localStorage
                const stored = localStorage.getItem(PENDING_KEY) || '[]';
                pending = JSON.parse(stored);
            }
            render();
        })
        .catch(() => {
            // Fallback to localStorage if API fails
            const stored = localStorage.getItem(PENDING_KEY) || '[]';
            pending = JSON.parse(stored);
            render();
        });
}

function render() {
    const list = q('#reviewsList');
    if (!pending.length) {
        list.innerHTML = '<div class="empty-state"><div class="empty-state-icon">✓</div><div class="empty-state-title">Alles freigegeben!</div></div>';
        return;
    }
    list.innerHTML = '';
    for (let i = 0; i < pending.length; i++) {
        const r = pending[i];
        const div = document.createElement('div');
        div.className = 'review-item';
        div.innerHTML = `<input type="checkbox" class="review-checkbox" data-index="${i}"><div class="review-content"><div class="review-header"><img class="review-photo" src="${r.photo || AVATAR}"><div class="review-meta"><div class="review-name">${r.name}</div><div class="review-time">${r.timestamp || 'Gerade eben'}</div></div></div><div class="review-text">${r.text}</div></div>`;
        list.appendChild(div);
    }
    bindChecks();
}

function bindChecks() {
    qa('.review-checkbox').forEach(c => {
        c.addEventListener('change', e => {
            const i = parseInt(e.target.dataset.index);
            if (e.target.checked) selected.add(i);
            else selected.delete(i);
            updateBtns();
        });
    });
    q('#selectAll').addEventListener('change', e => {
        selected.clear();
        if (e.target.checked) pending.forEach((_, i) => selected.add(i));
        qa('.review-checkbox').forEach((c, i) => c.checked = e.target.checked);
        updateBtns();
    });
}

function updateBtns() {
    const has = selected.size > 0;
    q('#approveBtn').disabled = !has;
    q('#deleteBtn').disabled = !has;
    q('#selectedCount').textContent = has ? `${selected.size} ausgewählt` : '';
}

function approve() {
    if (!selected.size) return;
    const idx = Array.from(selected).sort((a, b) => b - a);
    const indices = Array.from(idx);
    
    // Try API first
    fetch('reviews_api.php?action=approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ indices })
    })
        .then(r => r.json())
        .then(data => {
            if (data.success) {
                selected.clear();
                load();
            } else {
                console.error('API error:', data.error);
                // Fallback to localStorage
                approveLocalStorage();
            }
        })
        .catch(() => {
            // Fallback to localStorage if API fails
            approveLocalStorage();
        });
}

function approveLocalStorage() {
    const idx = Array.from(selected).sort((a, b) => b - a);
    const approved = JSON.parse(localStorage.getItem(APPROVED_KEY) || '[]');
    idx.forEach(i => {
        if (pending[i]) {
            const r = {...pending[i]};
            delete r.timestamp;
            approved.push(r);
        }
    });
    idx.forEach(i => pending.splice(i, 1));
    localStorage.setItem(APPROVED_KEY, JSON.stringify(approved.slice(-40)));
    localStorage.setItem(PENDING_KEY, JSON.stringify(pending));
    selected.clear();
    load();
}

function deleteReviews() {
    if (!selected.size || !confirm('Kommentare wirklich löschen?')) return;
    const idx = Array.from(selected).sort((a, b) => b - a);
    const indices = Array.from(idx);
    
    // Try API first
    fetch('reviews_api.php?action=delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ indices })
    })
        .then(r => r.json())
        .then(data => {
            if (data.success) {
                selected.clear();
                load();
            } else {
                console.error('API error:', data.error);
                // Fallback to localStorage
                deleteLocalStorage();
            }
        })
        .catch(() => {
            // Fallback to localStorage if API fails
            deleteLocalStorage();
        });
}

function deleteLocalStorage() {
    const idx = Array.from(selected).sort((a, b) => b - a);
    idx.forEach(i => pending.splice(i, 1));
    localStorage.setItem(PENDING_KEY, JSON.stringify(pending));
    selected.clear();
    load();
}

function init() {
    const isAuth = sessionStorage.getItem(AUTH_KEY) === 'true';
    q('#loginOverlay').classList.toggle('active', !isAuth);
    q('#adminPanel').style.display = isAuth ? 'block' : 'none';
    q('#loginForm').addEventListener('submit', login);
    q('#logoutBtn').addEventListener('click', logout);
    q('#approveBtn').addEventListener('click', approve);
    q('#deleteBtn').addEventListener('click', deleteReviews);
    q('#refreshBtn').addEventListener('click', load);
    if (isAuth) load();
}

document.addEventListener('DOMContentLoaded', init);