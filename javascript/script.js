function initApp() {
    const savedLanguage = localStorage.getItem('portfolioLanguage') || 'en';
    applyLanguage(savedLanguage);
    markLanguageButtons(savedLanguage);
    bindSectionNavigation();
    bindScrollButtons();
    bindMobileMenu();
    initializeScrollReveal();
    initializeReviews();
    initContactForm();
}

document.addEventListener('DOMContentLoaded', initApp);
window.setActiveLanguage = setActiveLanguage;
