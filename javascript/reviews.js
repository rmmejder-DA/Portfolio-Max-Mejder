const REVIEW_STORAGE_KEY = 'portfolioReviews';
const PENDING_REVIEW_STORAGE_KEY = 'portfolioPendingReviews';
const DEFAULT_REVIEW_PHOTO = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgc3Ryb2tlPSIjNzBFNjFDIiBzdHJva2Utd2lkdGg9IjIuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0LCAwKSI+PHBhdGggZD0iTTE4LjUgNi41QzIwLjk4NTMgNi41IDIzIDguNTE0NzIgMjMgMTFWMTNIMzFDMzIuNjU2OSAxMyA0NCAxNC4zNDMxIDQ0IDE2VjI0SDE2VjE1QzE2IDguNTE0NzIgMTguMDE0NyA2LjUgMTguNSA2LjVaIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS13aWR0aD0iMi41IiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9nPjwvc3ZnPg==';
const REVIEWS_API_URL = 'reviews_api.php';

let reviews = [];
let currentReviewIndex = 0;

function getDefaultReviews(language = 'en') {
    const copy = getCopy(language);
    if (copy && copy.reviews && Array.isArray(copy.reviews)) {
        return copy.reviews.map(review => ({
            name: review.name,
            text: review.text,
            photo: review.photo || DEFAULT_REVIEW_PHOTO
        }));
    }
    return [];
}

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
        const serverReviews = await fetchServerReviews();
        if (serverReviews) {
            reviews = serverReviews;
        } else {
            const language = getSelectedLanguage();
            reviews = getDefaultReviews(language);
        }
        normalizeReviews();
    } catch (error) {
        const stored = localStorage.getItem(REVIEW_STORAGE_KEY);
        if (stored) {
            reviews = JSON.parse(stored);
        } else {
            const language = getSelectedLanguage();
            reviews = getDefaultReviews(language);
        }
    }
}

function saveReviews() {
    try { localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(reviews)); } catch (error) { /* ignore */ }
}

function savePendingReview(review) {
    const pending = JSON.parse(localStorage.getItem(PENDING_REVIEW_STORAGE_KEY) || '[]');
    review.timestamp = new Date().toLocaleString();
    pending.push(review);
    localStorage.setItem(PENDING_REVIEW_STORAGE_KEY, JSON.stringify(pending));
}

async function pushReviewToServer(review) {
    if (!shouldUseReviewApi()) return savePendingReview(review);
    try {
        await fetch(REVIEWS_API_URL + '?action=submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(review)
        });
    } catch (error) {
        savePendingReview(review);
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

function normalizeReviews() {
    if (reviews.length > 40) reviews = reviews.slice(reviews.length - 40);
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
    await loadReviews();
    saveReviews();
    rebuildReviewDots();
    if (reviews.length) showReview(0);
    if (!reviews.length) renderEmptyReviewState(getSelectedLanguage());
}

function reloadReviewsForLanguage(language) {
    const defaultReviews = getDefaultReviews(language);
    const stored = localStorage.getItem(REVIEW_STORAGE_KEY);
    const storedReviews = stored ? JSON.parse(stored) : [];
    
    if (storedReviews.length > 0) {
        reviews = storedReviews;
    } else {
        reviews = defaultReviews;
    }
    
    currentReviewIndex = 0;
    rebuildReviewDots();
    if (reviews.length) showReview(0);
    if (!reviews.length) renderEmptyReviewState(language);
}