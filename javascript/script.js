const REVIEW_STORAGE_KEY = 'portfolioReviews';
const DEFAULT_REVIEW_PHOTO = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgc3Ryb2tlPSIjNzBFNjFDIiBzdHJva2Utd2lkdGg9IjIuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0LCAwKSI+PHBhdGggZD0iTTE4LjUgNi41QzIwLjk4NTMgNi41IDIzIDguNTE0NzIgMjMgMTFWMTNIMzFDMzIuNjU2OSAxMyA0NCAxNC4zNDMxIDQ0IDE2VjI0SDE2VjE1QzE2IDguNTE0NzIgMTguMDE0NyA2LjUgMTguNSA2LjVaIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS13aWR0aD0iMi41IiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9nPjwvc3ZnPg==';

let reviews = [];
let currentReviewIndex = 0;

function q(selector) { return document.querySelector(selector); }
function qa(selector, root = document) { return Array.from(root.querySelectorAll(selector)); }
function setText(selector, value) { const n = q(selector); if (n) n.textContent = value; }
function setHtml(selector, value) { const n = q(selector); if (n) n.innerHTML = value; }
function setPlaceholder(selector, value) { const n = q(selector); if (n) n.placeholder = value; }

function setTextAt(selector, index, value) {
    const n = qa(selector)[index];
    if (n) n.textContent = value;
}

function getSelectedLanguage() {
    const active = q('.translate-buttons button.is-active');
    if (!active) return 'en';
    return active.textContent.trim().toLowerCase() === 'de' ? 'de' : 'en';
}

function getCopy(lang) {
    const all = window.APP_COPY || {};
    return all[lang] || all.en || null;
}

function applyNavigation(copy) {
    copy.navigationDesktop.forEach((label, i) => setTextAt('.nav a', i, label));
    copy.navigationMobile.forEach((label, i) => setTextAt('.mobile-nav-links a', i, label));
}

function applyIntro(copy) {
    setText('.vertical-headline', copy.verticalHeadline);
    setText('.job-title', copy.jobTitle);
    setHtml('.scrollDown-vertical', copy.scrollHtml);
    setText('.section-title', copy.sectionTitle);
    setText('.about-me-text', copy.aboutText);
    setText('.location-text', copy.locationText);
    setText('.open-minded-text', copy.openMindedText);
    setText('.puzzle-text', copy.puzzleText);
}

function applySkills(copy) {
    setText('.skills-title', copy.skillsTitle);
    setText('.skills-description', copy.skillsDescription);
    setHtml('.skills-question', copy.skillsQuestionHtml);
    setText('.skills-subtext', copy.skillsSubtext);
}

function applyPortfolio(copy) {
    setText('.portfolio-subtitle', copy.portfolioSubtitle);
    copy.portfolioDescriptions.forEach((text, i) => setTextAt('.portfolio-description', i, text));
}

function applyContact(copy) {
    setText('.contact_me', copy.contactTitle);
    setText('.got_a_problem', copy.contactProblem);
    setText('.contact_text', copy.contactText);
    setPlaceholder('.contact_input[type="text"]', copy.placeholderName);
    setPlaceholder('.contact_input[type="email"]', copy.placeholderEmail);
    setPlaceholder('.contact_textarea', copy.placeholderMessage);
    setHtml('.contact_checkbox_label', copy.contactPolicyHtml);
}

function renderEmptyReviewState(language = getSelectedLanguage()) {
    const copy = getCopy(language);
    if (!copy) return;
    setText('#commentar-text', copy.emptyReviewText);
    setText('.reviewOfperson_name', copy.emptyReviewName);
    const person = q('#reviewPerson');
    if (!person) return;
    person.src = DEFAULT_REVIEW_PHOTO;
    person.alt = copy.emptyReviewAlt;
}

function applyLanguage(language) {
    const copy = getCopy(language);
    if (!copy) return;
    applyNavigation(copy);
    applyIntro(copy);
    applySkills(copy);
    applyPortfolio(copy);
    applyContact(copy);
    if (!reviews.length) renderEmptyReviewState(language);
}

function markLanguageButtons(language) {
    qa('.translate-buttons button').forEach((button) => {
        const lang = button.textContent.trim().toLowerCase() === 'de' ? 'de' : 'en';
        button.classList.toggle('is-active', lang === language);
    });
}

function setActiveLanguage(clickedButton) {
    const lang = clickedButton.textContent.trim().toLowerCase() === 'de' ? 'de' : 'en';
    markLanguageButtons(lang);
    applyLanguage(lang);
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

function loadReviews() {
    try { localStorage.removeItem(REVIEW_STORAGE_KEY); } catch (error) { /* ignore */ }
    reviews = [];
}

function saveReviews() {
    try { localStorage.removeItem(REVIEW_STORAGE_KEY); } catch (error) { /* ignore */ }
}

function readAsDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('File read failed'));
        reader.readAsDataURL(file);
    });
}

function loadImageFromSrc(src) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error('Image load failed'));
        image.src = src;
    });
}

function drawResizedImage(image) {
    const max = 360;
    const scale = Math.min(1, max / Math.max(image.width, image.height));
    const w = Math.round(image.width * scale);
    const h = Math.round(image.height * scale);
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    return { canvas, w, h };
}

function convertImageFileToDataUrl(file) {
    return readAsDataUrl(file)
        .then((src) => loadImageFromSrc(src))
        .then((image) => {
            const { canvas, w, h } = drawResizedImage(image);
            const ctx = canvas.getContext('2d');
            if (!ctx) return null;
            ctx.drawImage(image, 0, 0, w, h);
            return canvas.toDataURL('image/jpeg', 0.82);
        });
}

function rebuildReviewDots() {
    const controls = q('.review-slider-controls');
    if (!controls) return;
    qa('.review-dot', controls).forEach((d) => d.remove());
    const nextArrow = q('.review-arrow[aria-label="Next review"]');
    reviews.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'review-dot';
        dot.setAttribute('aria-label', `Go to review ${i + 1}`);
        dot.addEventListener('click', () => showReview(i));
        controls.insertBefore(dot, nextArrow);
    });
}

function renderActiveDot() {
    qa('.review-dot').forEach((dot, i) => {
        dot.classList.toggle('is-active', i === currentReviewIndex);
    });
}

function showReview(index) {
    if (!reviews.length) return;
    currentReviewIndex = (index + reviews.length) % reviews.length;
    const active = reviews[currentReviewIndex];
    setText('#commentar-text', active.text);
    setText('.reviewOfperson_name', active.name);
    const person = q('#reviewPerson');
    if (!person) return renderActiveDot();
    person.src = active.photo || DEFAULT_REVIEW_PHOTO;
    person.alt = `${active.name} photo`;
    renderActiveDot();
}

function bindReviewNavigation() {
    const prev = q('.review-arrow[aria-label="Previous review"]');
    const next = q('.review-arrow[aria-label="Next review"]');
    if (prev) prev.addEventListener('click', () => showReview(currentReviewIndex - 1));
    if (next) next.addEventListener('click', () => showReview(currentReviewIndex + 1));
}

function getReviewFormData() {
    return {
        form: q('#reviewForm'),
        nameInput: q('#reviewName'),
        messageInput: q('#reviewMessage'),
        photoInput: q('#reviewPhoto'),
        dialog: q('#reviewCommentDialog'),
    };
}

function isReviewInputValid(name, text) {
    return name.length >= 2 && text.length >= 8;
}

function getPhotoFile(photoInput) {
    if (!photoInput || !photoInput.files || !photoInput.files[0]) return null;
    return photoInput.files[0];
}

function normalizeReviews() {
    if (reviews.length > 40) reviews = reviews.slice(reviews.length - 40);
}

async function getPhotoData(photoInput) {
    const file = getPhotoFile(photoInput);
    if (!file) return DEFAULT_REVIEW_PHOTO;
    if (!file.type.startsWith('image/')) return DEFAULT_REVIEW_PHOTO;
    try { return await convertImageFileToDataUrl(file) || DEFAULT_REVIEW_PHOTO; }
    catch (error) { return DEFAULT_REVIEW_PHOTO; }
}

async function onReviewSubmit(event, data) {
    event.preventDefault();
    const name = data.nameInput.value.trim();
    const text = data.messageInput.value.trim();
    if (!isReviewInputValid(name, text)) return;
    const photo = await getPhotoData(data.photoInput);
    reviews.push({ name, text: `"${text}"`, photo });
    normalizeReviews();
    saveReviews();
    rebuildReviewDots();
    showReview(reviews.length - 1);
    data.form.reset();
    if (data.dialog) data.dialog.close();
}

function bindReviewForm() {
    const data = getReviewFormData();
    if (!data.form || !data.nameInput || !data.messageInput || !data.photoInput) return;
    data.form.addEventListener('submit', (event) => onReviewSubmit(event, data));
}

function bindReviewCommentDialog() {
    const dialog = q('#reviewCommentDialog');
    const open = q('#openReviewCommentDialog');
    const close = q('#closeReviewCommentDialog');
    if (!dialog || !open) return;
    open.addEventListener('click', () => dialog.showModal && dialog.showModal());
    if (close) close.addEventListener('click', () => dialog.close());
}

function initializeReviews() {
    loadReviews();
    rebuildReviewDots();
    bindReviewNavigation();
    bindReviewForm();
    bindReviewCommentDialog();
    if (reviews.length) showReview(0);
    if (!reviews.length) renderEmptyReviewState(getSelectedLanguage());
}

function isValidEmailDomain(email) {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return false;
    const domain = email.split('@')[1] || '';
    const parts = domain.split('.');
    const tld = parts[parts.length - 1] || '';
    return parts.length >= 2 && tld.length >= 2 && /^[a-z]+$/i.test(tld);
}

function setEmailValidationState(emailInput, errorMessage, isInvalid) {
    emailInput.classList.toggle('email-invalid', isInvalid);
    if (errorMessage) errorMessage.classList.toggle('show', isInvalid);
}

function syncContactFormState(contactForm, submitButton, emailInput, errorMessage) {
    const emailValue = emailInput.value;
    const hasValidDomain = !emailValue || isValidEmailDomain(emailValue);
    setEmailValidationState(emailInput, errorMessage, emailValue.length > 0 && !hasValidDomain);
    const valid = contactForm.checkValidity() && hasValidDomain;
    contactForm.classList.toggle('is-valid', valid);
    submitButton.disabled = !valid;
}

function bindContactFormValidation() {
    const form = q('.contact_form');
    const submit = q('.contact_submit');
    const email = form ? form.querySelector('input[type="email"]') : null;
    const error = q('.email-error-message');
    if (!form || !submit || !email) return;
    const sync = () => syncContactFormState(form, submit, email, error);
    form.addEventListener('input', sync);
    form.addEventListener('change', sync);
    sync();
}

function initApp() {
    applyLanguage('en');
    bindScrollButtons();
    bindMobileMenu();
    initializeReviews();
    bindContactFormValidation();
}

document.addEventListener('DOMContentLoaded', initApp);
window.setActiveLanguage = setActiveLanguage;
