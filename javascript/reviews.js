const REVIEW_STORAGE_KEY = 'portfolioReviews';
const PENDING_REVIEW_STORAGE_KEY = 'portfolioPendingReviews';
const DEFAULT_REVIEW_PHOTO = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgc3Ryb2tlPSIjNzBFNjFDIiBzdHJva2Utd2lkdGg9IjIuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0LCAwKSI+PHBhdGggZD0iTTE4LjUgNi41QzIwLjk4NTMgNi41IDIzIDguNTE0NzIgMjMgMTFWMTNIMzFDMzIuNjU2OSAxMyA0NCAxNC4zNDMxIDQ0IDE2VjI0SDE2VjE1QzE2IDguNTE0NzIgMTguMDE0NyA2LjUgMTguNSA2LjVaIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS13aWR0aD0iMi41IiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9nPjwvc3ZnPg==';
const REVIEWS_API_URL = 'reviews_api.php';

let reviews = [];
let currentReviewIndex = 0;

function hasReviews() {
    return reviews.length > 0;
}

function getSafeReviewList(value) {
    const list = Array.isArray(value) ? value : [];
    return list.filter((review) => {
        return review
            && typeof review.name === 'string'
            && typeof review.text === 'string'
            && typeof review.photo === 'string';
    });
}

function shouldUseReviewApi() {
    const host = window.location.hostname;
    const port = window.location.port;
    const isLocalHost = host === '127.0.0.1' || host === 'localhost';
    const isStaticDevPort = port === '5500' || port === '5501' || port === '5502';
    if (window.location.protocol === 'file:') return false;
    if (isLocalHost && isStaticDevPort) return false;
    return true;
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

async function fetchServerReviews() {
    if (!shouldUseReviewApi()) return null;
    try {
        const response = await fetch(REVIEWS_API_URL + '?action=approved', { headers: { 'Accept': 'application/json' } });
        if (!response.ok) return null;
        const data = await response.json().catch(() => ({}));
        return getSafeReviewList(data.reviews);
    } catch (error) {
        return null;
    }
}

async function loadReviews() {
    try {
        // Try API first
        const serverReviews = await fetchServerReviews();
        if (serverReviews) {
            reviews = serverReviews;
        } else {
            // Fallback to localStorage
            const stored = localStorage.getItem(REVIEW_STORAGE_KEY);
            reviews = stored ? JSON.parse(stored) : [];
        }
        normalizeReviews();
    } catch (error) {
        // Fallback to localStorage
        const stored = localStorage.getItem(REVIEW_STORAGE_KEY);
        reviews = stored ? JSON.parse(stored) : [];
    }
}

function saveReviews() {
    try { localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(reviews)); } catch (error) { /* ignore */ }
}

async function pushReviewToServer(review) {
    if (!shouldUseReviewApi()) {
        // Fallback: save to pending reviews in localStorage
        const pending = JSON.parse(localStorage.getItem(PENDING_REVIEW_STORAGE_KEY) || '[]');
        review.timestamp = new Date().toLocaleString();
        pending.push(review);
        localStorage.setItem(PENDING_REVIEW_STORAGE_KEY, JSON.stringify(pending));
        console.log('Review saved to localStorage (pending moderation)');
        return;
    }
    try {
        await fetch(REVIEWS_API_URL + '?action=submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(review)
        });
    } catch (error) {
        // Fallback to localStorage if server fails
        const pending = JSON.parse(localStorage.getItem(PENDING_REVIEW_STORAGE_KEY) || '[]');
        review.timestamp = new Date().toLocaleString();
        pending.push(review);
        localStorage.setItem(PENDING_REVIEW_STORAGE_KEY, JSON.stringify(pending));
        console.log('Review saved to localStorage (server failed)');
    }
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
        errorMessage: q('#reviewCommentError'),
        submitButton: q('.review-comment-submit'),
        dialog: q('#reviewCommentDialog'),
    };
}

function isReviewInputValid(name, text) {
    return name.length >= 2 && text.length >= 8;
}

function getReviewValidationMessage(name, text) {
    if (!name.length && !text.length) return 'Enter your name and a comment with at least 8 characters.';
    if (name.length < 2) return 'Your name must contain at least 2 characters.';
    if (text.length < 8) return 'Your comment must contain at least 8 characters.';
    return '';
}

function setReviewFieldState(field, isInvalid) {
    if (!field) return;
    field.classList.toggle('is-invalid', isInvalid);
}

function syncReviewFormState(data) {
    if (!data.nameInput || !data.messageInput || !data.submitButton) return true;
    const name = data.nameInput.value.trim();
    const text = data.messageInput.value.trim();
    const validationMessage = getReviewValidationMessage(name, text);
    const showInvalidName = name.length > 0 && name.length < 2;
    const showInvalidText = text.length > 0 && text.length < 8;
    setReviewFieldState(data.nameInput, showInvalidName);
    setReviewFieldState(data.messageInput, showInvalidText);
    if (data.errorMessage) data.errorMessage.textContent = validationMessage;
    const valid = isReviewInputValid(name, text);
    data.submitButton.disabled = !valid;
    return valid;
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
    if (!syncReviewFormState(data) || !isReviewInputValid(name, text)) return;
    const photo = await getPhotoData(data.photoInput);
    const newReview = { name, text: `"${text}"`, photo };
    // Send to server for moderation, don't save locally
    await pushReviewToServer(newReview);
    data.form.reset();
    syncReviewFormState(data);
    if (data.dialog) data.dialog.close();
    showReviewNotification();
}

function bindReviewForm() {
    const data = getReviewFormData();
    if (!data.form || !data.nameInput || !data.messageInput || !data.photoInput || !data.submitButton) return;
    const sync = () => syncReviewFormState(data);
    data.form.addEventListener('input', sync);
    data.form.addEventListener('change', sync);
    data.form.addEventListener('submit', (event) => onReviewSubmit(event, data));
    sync();
}

function bindReviewCommentDialog() {
    const dialog = q('#reviewCommentDialog');
    const open = q('#openReviewCommentDialog');
    const close = q('#closeReviewCommentDialog');
    if (!dialog || !open) return;
    open.addEventListener('click', () => dialog.showModal && dialog.showModal());
    if (close) close.addEventListener('click', () => dialog.close());
}

function clearAllReviews() {
    reviews = [];
    localStorage.removeItem(REVIEW_STORAGE_KEY);
    currentReviewIndex = 0;
    rebuildReviewDots();
    renderEmptyReviewState(getSelectedLanguage());
    console.log('All reviews and photos deleted from localStorage');
}

function ensureReviewStatusDialog() {
    let dialog = q('#reviewStatusDialog');
    if (dialog) return dialog;
    dialog = document.createElement('div');
    dialog.id = 'reviewStatusDialog';
    dialog.className = 'review-status-dialog';
    dialog.innerHTML = '<p class="review-status-message" aria-live="polite"></p>';
    document.body.appendChild(dialog);
    return dialog;
}

function showReviewNotification() {
    const language = getSelectedLanguage();
    const copy = getCopy(language);
    if (!copy) return;
    const dialog = ensureReviewStatusDialog();
    const message = q('#reviewStatusDialog .review-status-message');
    message.textContent = copy.reviewSubmittedNotification;
    dialog.classList.remove('show');
    void dialog.offsetWidth;
    dialog.classList.add('show');
    setTimeout(() => dialog.classList.remove('show'), 3000);
}

async function initializeReviews() {
    bindReviewNavigation();
    bindReviewForm();
    bindReviewCommentDialog();
    await loadReviews();
    rebuildReviewDots();
    if (reviews.length) showReview(0);
    if (!reviews.length) renderEmptyReviewState(getSelectedLanguage());
}
