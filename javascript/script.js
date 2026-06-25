function initApp() {
    applyLanguage('en');
    bindSectionNavigation();
    bindScrollButtons();
    bindMobileMenu();
    initializeScrollReveal();
    initializeReviews();
    bindContactFormValidation();
}

document.addEventListener('DOMContentLoaded', initApp);
window.setActiveLanguage = setActiveLanguage;
