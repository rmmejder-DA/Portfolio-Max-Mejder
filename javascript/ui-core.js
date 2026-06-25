function q(selector) { return document.querySelector(selector); }
function qa(selector, root = document) { return Array.from(root.querySelectorAll(selector)); }
function setText(selector, value) { const n = q(selector); if (n) n.textContent = value; }
function setHtml(selector, value) { const n = q(selector); if (n) n.innerHTML = value; }
function setPlaceholder(selector, value) { const n = q(selector); if (n) n.placeholder = value; }

function setTextAt(selector, index, value) {
    const n = qa(selector)[index];
    if (n) n.textContent = value;
}

function scrollToContact() {
    const section = q('.reviewOfperson-container');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function bindScrollButtons() {
    ['#gotoContact', '#gotoContactMobile', '#getInTouchtoContact'].forEach((id) => {
        const button = q(id);
        if (button) button.addEventListener('click', scrollToContact);
    });
    const topButton = q('#scrollToTopButton');
    if (topButton) topButton.addEventListener('click', scrollToTop);
}

function closeMobileMenu(toggle, menu) {
    menu.classList.remove('is-open');
    toggle.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
}

function toggleMobileMenu(toggle, menu) {
    const open = menu.classList.toggle('is-open');
    toggle.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-hidden', String(!open));
}

function bindMobileMenu() {
    const toggle = q('.mobile-nav-toggle');
    const menu = q('#mobileMenu');
    if (!toggle || !menu) return;
    toggle.addEventListener('click', () => toggleMobileMenu(toggle, menu));
    qa('#mobileMenu a').forEach((l) => l.addEventListener('click', () => closeMobileMenu(toggle, menu)));
}
