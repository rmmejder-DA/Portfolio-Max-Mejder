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

function replaySectionReveal(section) {
    const revealNodes = qa('.scroll-reveal', section);
    if (!revealNodes.length) return;

    revealNodes.forEach((node) => node.classList.remove('is-visible'));
    // Force layout so removing/adding class restarts transition reliably.
    section.offsetHeight;

    revealNodes.forEach((node, index) => {
        window.setTimeout(() => node.classList.add('is-visible'), index * 45);
    });
}

function waitForScrollEnd(targetTop, done) {
    const maxWait = 1200;
    const tolerance = 6;
    const start = performance.now();

    const tick = () => {
        const reached = Math.abs(window.scrollY - targetTop) <= tolerance;
        const timedOut = performance.now() - start >= maxWait;
        if (reached || timedOut) {
            done();
            return;
        }
        requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
}

function smoothScrollAndAnimateSection(section) {
    if (!section) return;

    const targetTop = Math.round(window.scrollY + section.getBoundingClientRect().top);
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    waitForScrollEnd(targetTop, () => replaySectionReveal(section));
}

function bindSectionNavigation() {
    const sectionLinks = qa('a[href="#about_me"], a[href="#skills"], a[href="#portfolio"], a[href="#contact_me"]');
    sectionLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            const targetId = link.getAttribute('href');
            if (!targetId) return;

            const section = q(targetId);
            if (!section) return;

            event.preventDefault();
            smoothScrollAndAnimateSection(section);
        });
    });
}

function initializeScrollReveal() {
    const revealSelectors = [
        '.about-me .section-title',
        '.about-me-text',
        '.about-me .located',
        '.about-me .open-minded',
        '.about-me .puzzle',
        '.about-me-decorative-container',
        '.skills-icons .skill-card',
        '.skills-content',
        '.portfolio-header',
        '.portfolio-subtitle',
        '.portfolio-card-join',
        '.portfolio-card-bestellapp',
        '.portfolio-card-fotogramm',
        '.portfolio-card-kochwelt',
        '.portfolio-card-pokedex',
        '.portfolio-card-el_pollo_loco',
        '.reviewOfperson-container',
        '.review-slider-controls',
        '.review-comment-open',
        '.contact-header',
        '.if_problem',
        '.contact_form',
        '.scroll-top-button'
    ];

    const nodes = Array.from(new Set(revealSelectors.flatMap((selector) => qa(selector))));
    if (!nodes.length) return;

    nodes.forEach((node, index) => {
        node.classList.add('scroll-reveal');
        node.classList.remove('scroll-reveal-left', 'scroll-reveal-right');
        node.classList.add(index % 2 === 0 ? 'scroll-reveal-left' : 'scroll-reveal-right');
    });

    if (!('IntersectionObserver' in window)) {
        nodes.forEach((node) => node.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -8% 0px'
    });

    nodes.forEach((node) => observer.observe(node));
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
