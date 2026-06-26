let contactStatusHideTimer = null;

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

function getContactMessages() {
    return getSelectedLanguage() === 'de'
        ? {
            sending: 'Nachricht wird gesendet...',
            success: 'Nachricht erfolgreich gesendet.',
            error: 'Senden fehlgeschlagen. Bitte spaeter erneut versuchen.'
        }
        : {
            sending: 'Sending message...',
            success: 'Message sent successfully.',
            error: 'Sending failed. Please try again later.'
        };
}

function ensureContactStatusNode(form) {
    let node = q('#contactStatusMessage');
    if (node) return node;
    node = document.createElement('p');
    node.id = 'contactStatusMessage';
    node.className = 'contact-status-message';
    node.setAttribute('aria-live', 'polite');
    form.appendChild(node);
    return node;
}

function setContactStatus(form, text, type) {
    const node = ensureContactStatusNode(form);
    if (contactStatusHideTimer) {
        clearTimeout(contactStatusHideTimer);
        contactStatusHideTimer = null;}
    node.textContent = text;
    node.classList.remove('is-success', 'is-error', 'is-info');
    if (type) node.classList.add(type);
    if (type === 'is-success') {
        contactStatusHideTimer = window.setTimeout(() => {
            node.textContent = '';
            node.classList.remove('is-success', 'is-error', 'is-info');
            contactStatusHideTimer = null;
        }, 1000);}
}

function shouldUseDirectFormSubmitFallback() {
    const host = window.location.hostname;
    const port = window.location.port;
    const isLocalHost = host === '127.0.0.1' || host === 'localhost';
    const isLikelyStaticDevServer = port === '5500' || port === '5501' || port === '5502';
    return window.location.protocol === 'file:' || (isLocalHost && isLikelyStaticDevServer);
}

async function submitViaFormSubmit(payload) {
    const formSubmitPayload = {
        ...payload,
        _subject: 'Website Contact Form',
        _template: 'table',
        _captcha: 'false'};
    const fallbackResponse = await fetch('https://formsubmit.co/ajax/rmmejder@gmail.com', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'},
        body: JSON.stringify(formSubmitPayload)});
    const fallbackData = await fallbackResponse.json().catch(() => ({}));
    if (!fallbackResponse.ok || !(fallbackData.success === 'true' || fallbackData.success === true)) throw new Error('Fallback contact submit failed');
}

function getContactFormElements(form) {
    return {
        submit: q('.contact_submit'),
        email: form.querySelector('input[type="email"]'),
        error: q('.email-error-message'),
        name: form.querySelector('input[name="name"]'),
        message: form.querySelector('textarea[name="message"]')
    };
}

function resetContactFormAfterSuccess(form, email, error, messages) {
    form.reset();
    setEmailValidationState(email, error, false);
    setContactStatus(form, messages.success, 'is-success');
}

function buildContactPayload(name, email, message) {
    return {
        name: name.value.trim(),
        email: email.value.trim(),
        message: message.value.trim()
    };
}

async function submitToPhp(payload) {
    const response = await fetch('send_mail.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
    });
    if (response.status === 405) return { ok: false, needsFallback: true };
    const data = await response.json().catch(() => ({}));
    return { ok: response.ok && !!data.success, needsFallback: false };
}

async function submitContactPayload(payload) {
    if (shouldUseDirectFormSubmitFallback()) {
        await submitViaFormSubmit(payload);
        return true;
    }
    const phpResult = await submitToPhp(payload);
    if (phpResult.ok) return true;
    await submitViaFormSubmit(payload);
    return true;
}

async function runContactSubmit(form, elements, messages) {
    const { submit, email, error, name, message } = elements;
    try {
        const payload = buildContactPayload(name, email, message);
        const success = await submitContactPayload(payload);
        if (!success) throw new Error('Contact submit failed');
        resetContactFormAfterSuccess(form, email, error, messages);
    } catch (submitError) {
        setContactStatus(form, messages.error, 'is-error');
    } finally {
        syncContactFormState(form, submit, email, error);
    }
}

async function sendContactForm(form) {
    const elements = getContactFormElements(form);
    const { submit, email, error, name, message } = elements;
    if (!submit || !email || !name || !message) return;
    syncContactFormState(form, submit, email, error);
    if (submit.disabled) return;
    const messages = getContactMessages();
    setContactStatus(form, messages.sending, 'is-info');
    submit.disabled = true;
    await runContactSubmit(form, elements, messages);
}

function bindContactFormValidation() {
    const form = q('.contact_form');
    const submit = q('.contact_submit');
    const email = form ? form.querySelector('input[type="email"]') : null;
    const textarea = form ? form.querySelector('.contact_textarea') : null;
    const charCount = q('#charCount');
    const error = q('.email-error-message');
    if (!form || !submit || !email) return;
    const sync = () => syncContactFormState(form, submit, email, error);
    form.addEventListener('input', sync);
    form.addEventListener('change', sync);
    if (textarea && charCount) {
        textarea.addEventListener('input', () => {
            charCount.textContent = textarea.value.length;
        });
    }
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        await sendContactForm(form);
    });
    sync();
}
