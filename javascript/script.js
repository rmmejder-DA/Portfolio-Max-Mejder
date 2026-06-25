function initApp() {
    applyLanguage('en');
    bindScrollButtons();
    bindMobileMenu();
    initializeReviews();
    bindContactFormValidation();
}

document.addEventListener('DOMContentLoaded', initApp);
window.setActiveLanguage = setActiveLanguage;
