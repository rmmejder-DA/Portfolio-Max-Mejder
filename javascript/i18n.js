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
    setHtml('.contact_cta', copy.contactCta);
    setPlaceholder('.contact_input[type="text"]', copy.placeholderName);
    setPlaceholder('.contact_input[type="email"]', copy.placeholderEmail);
    setPlaceholder('.contact_textarea', copy.placeholderMessage);
    if (copy.namePatternTitle) {
        const nameInput = q('.contact_input[name="name"]');
        if (nameInput) nameInput.setAttribute('title', copy.namePatternTitle);
    }
    const nameError = q('.name-error-message');
    if (nameError) {
        if (copy.nameErrorEmpty) nameError.dataset.empty = copy.nameErrorEmpty;
        if (copy.nameErrorInvalid) nameError.dataset.invalid = copy.nameErrorInvalid;
        setText('.name-error-message', copy.nameErrorInvalid || copy.nameErrorEmpty || '');
    }
    const emailError = q('.email-error-message');
    if (emailError) {
        if (copy.emailErrorEmpty) emailError.dataset.empty = copy.emailErrorEmpty;
        if (copy.emailErrorInvalid) emailError.dataset.invalid = copy.emailErrorInvalid;
        setText('.email-error-message', copy.emailErrorInvalid || copy.emailErrorEmpty || '');
    }
    const messageError = q('.message-error-message');
    if (messageError) {
        if (copy.messageErrorEmpty) messageError.dataset.empty = copy.messageErrorEmpty;
        if (copy.messageErrorInvalid) messageError.dataset.invalid = copy.messageErrorInvalid;
        setText('.message-error-message', copy.messageErrorInvalid || copy.messageErrorEmpty || '');
    }
    setHtml('.contact_checkbox_label', copy.contactPolicyHtml);
    if (copy.contactSubmitButtonText) {
        const submitBtn = q('.contact_submit');
        if (submitBtn) submitBtn.value = copy.contactSubmitButtonText;
    }
}

function applyCustomButtons(copy) {
    if (copy.getInTouchButtonText) setText('.skills-contact-btn', copy.getInTouchButtonText);
    if (copy.letsTalkButtonText) {
        setText('#gotoContact', copy.letsTalkButtonText);
        setText('#gotoContactMobile', copy.letsTalkButtonText);
    }
    if (copy.legalNoticeLinkText) {
        qa('.legal-links a').forEach((link) => {
            const href = (link.getAttribute('href') || '').toLowerCase();
            if (href.includes('legal-notice.html')) {
                link.textContent = copy.legalNoticeLinkText;
            }
        });
    }
}

function applyLanguage(language) {
    const copy = getCopy(language);
    if (!copy) return;
    applyNavigation(copy);
    applyIntro(copy);
    applySkills(copy);
    applyPortfolio(copy);
    applyContact(copy);
    applyCustomButtons(copy);
    if (!hasReviews()) renderEmptyReviewState(language);
    if (typeof reloadReviewsForLanguage === 'function') {
        reloadReviewsForLanguage(language);
    }
}

function markLanguageButtons(language) {
    qa('.translate-buttons button').forEach((button) => {
        const lang = button.textContent.trim().toLowerCase() === 'de' ? 'de' : 'en';
        button.classList.toggle('is-active', lang === language);
    });
}

function setActiveLanguage(clickedButton) {
    const lang = clickedButton.textContent.trim().toLowerCase() === 'de' ? 'de' : 'en';
    localStorage.setItem('portfolioLanguage', lang);
    markLanguageButtons(lang);
    applyLanguage(lang);
}
