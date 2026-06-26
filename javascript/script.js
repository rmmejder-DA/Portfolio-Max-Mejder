function initApp() {
    const savedLanguage = localStorage.getItem('portfolioLanguage') || 'en';
    applyLanguage(savedLanguage);
    markLanguageButtons(savedLanguage);
    bindSectionNavigation();
    bindScrollButtons();
    bindMobileMenu();
    initializeScrollReveal();
    initializeReviews();
    bindContactFormValidation();
}

document.addEventListener('DOMContentLoaded', initApp);
window.setActiveLanguage = setActiveLanguage;
