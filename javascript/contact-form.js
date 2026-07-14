// Source - https://stackoverflow.com/a/46181
// Posted by John Rutherford, modified by community. License - CC BY-SA 4.0
// Retrieved 2026-07-11

let contactStatusHideTimer = null;

const validateEmail = (email) => {
    return email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) !== null;
};
const validateName = (name) => {
    return name.trim().length > 0 && /^[a-zA-Z\s]*$/.test(name);
};

const validateMessage = (message) => {
    return message.trim().length >= 5;
};
function isValidEmailDomain(email) {
    return !email || validateEmail(email);
}

function setNameValidationState(nameInput, errorMessage, isInvalid) {
    nameInput.classList.toggle('name-invalid', isInvalid);
    if (errorMessage) errorMessage.classList.toggle('show', isInvalid);
}

function setMessageValidationState(messageInput, errorMessage, isInvalid) {
    messageInput.classList.toggle('message-invalid', isInvalid);
    if (errorMessage) errorMessage.classList.toggle('show', isInvalid);
}

function setEmailValidationState(emailInput, errorMessage, isInvalid) {
    emailInput.classList.toggle('email-invalid', isInvalid);
    if (errorMessage) errorMessage.classList.toggle('show', isInvalid);
}

function syncContactFormState(contactForm, submitButton, emailInput, errorMessage, nameInput, nameErrorMessage, messageInput, messageErrorMessage) {
    const emailValue = emailInput.value;
    const nameValue = nameInput.value;
    const messageValue = messageInput.value;
    
    const hasValidEmail = !emailValue || validateEmail(emailValue);
    const hasValidName = !nameValue || validateName(nameValue);
    const hasValidMessage = !messageValue || validateMessage(messageValue);
    
    setEmailValidationState(emailInput, errorMessage, emailValue.length > 0 && !hasValidEmail);
    setNameValidationState(nameInput, nameErrorMessage, nameValue.length > 0 && !hasValidName);
    setMessageValidationState(messageInput, messageErrorMessage, messageValue.length > 0 && messageValue.length < 5);
    
    const valid = contactForm.checkValidity() && hasValidEmail && hasValidName && hasValidMessage;
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
    let dialog = q('#contactStatusDialog');
    if (dialog) return q('#contactStatusMessage');
    dialog = document.createElement('div');
    dialog.id = 'contactStatusDialog';
    dialog.className = 'contact-status-dialog';
    dialog.innerHTML = '<p id="contactStatusMessage" class="contact-status-message" aria-live="polite"></p>';
    document.body.appendChild(dialog);
    return q('#contactStatusMessage');
}

function clearContactStatusTimer() {
    if (contactStatusHideTimer) {
        clearTimeout(contactStatusHideTimer);
        contactStatusHideTimer = null;
    }
}

function setContactStatus(form, text, type) {
    const node = ensureContactStatusNode(form);
    const dialog = q('#contactStatusDialog');
    clearContactStatusTimer();
    node.textContent = text;
    node.classList.remove('is-success', 'is-error', 'is-info');
    dialog.classList.remove('show');
    void dialog.offsetWidth;
    if (type) node.classList.add(type);
    dialog.classList.add('show');
    contactStatusHideTimer = window.setTimeout(() => {
        dialog.classList.remove('show');
        contactStatusHideTimer = null;
    }, 3000);
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
        nameError: q('.name-error-message'),
        message: form.querySelector('textarea[name="message"]'),
        messageError: q('.message-error-message')
    };
}

function resetContactFormAfterSuccess(form, email, error, name, nameError, message, messageError, messages) {
    form.reset();
    setEmailValidationState(email, error, false);
    setNameValidationState(name, nameError, false);
    setMessageValidationState(message, messageError, false);
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
    const { submit, email, error, name, nameError, message, messageError } = elements;
    try {
        if (!validateName(name.value)) throw new Error('Invalid name');
        if (!validateMessage(message.value)) throw new Error('Message too short');
        
        const payload = buildContactPayload(name, email, message);
        const success = await submitContactPayload(payload);
        if (!success) throw new Error('Contact submit failed');
        resetContactFormAfterSuccess(form, email, error, name, nameError, message, messageError, messages);
    } catch (submitError) {
        setContactStatus(form, messages.error, 'is-error');
    } finally {
        syncContactFormState(form, submit, email, error, name, nameError, message, messageError);
    }
}

async function sendContactForm(form) {
    const elements = getContactFormElements(form);
    const { submit, email, error, name, nameError, message, messageError } = elements;
    if (!submit || !email || !name || !nameError || !message || !messageError) return;
    syncContactFormState(form, submit, email, error, name, nameError, message, messageError);
    if (submit.disabled) return;
    const messages = getContactMessages();
    setContactStatus(form, messages.sending, 'is-info');
    await runContactSubmit(form, elements, messages);
}

function bindContactFormEvents(form, email, error, name, nameError, textarea, messageError, charCount, submit) {
    const sync = () => {
        const nameInput = form.querySelector('input[name="name"]');
        const messageInput = form.querySelector('textarea[name="message"]');
        syncContactFormState(form, submit, email, error, nameInput, nameError, messageInput, messageError);
    };
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

function initContactForm() {
    const form = q('.contact_form');
    const submit = q('.contact_submit');
    const email = form ? form.querySelector('input[type="email"]') : null;
    const name = form ? form.querySelector('input[name="name"]') : null;
    const nameError = q('.name-error-message');
    const textarea = form ? form.querySelector('.contact_textarea') : null;
    const messageError = q('.message-error-message');
    const charCount = q('#charCount');
    const error = q('.email-error-message');
    if (!form || !submit || !email || !name || !nameError || !textarea || !messageError) return;
    bindContactFormEvents(form, email, error, name, nameError, textarea, messageError, charCount, submit);
}

function bindContactFormValidation() {
    const form = q('.contact_form');
    if (!form) return;
    form.addEventListener('input', () => {
        const submit = q('.contact_submit');
        const email = form.querySelector('input[type="email"]');
        const error = q('.email-error-message');
        syncContactFormState(form, submit, email, error);
    });
}
