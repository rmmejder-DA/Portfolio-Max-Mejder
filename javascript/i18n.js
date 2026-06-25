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

function applyLanguage(language) {
    const copy = getCopy(language);
    if (!copy) return;
    applyNavigation(copy);
    applyIntro(copy);
    applySkills(copy);
    applyPortfolio(copy);
    applyContact(copy);
    if (!hasReviews()) renderEmptyReviewState(language);
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
