const STORAGE_KEY = 'portfolioLegalLanguage';

const DE_IMPRESSUM = {
    headings: ['Verantwortlich für den Inhalt', 'Kontakt', 'Haftung für Inhalte', 'Haftung für Links', 'Urheberrecht'],
    paragraphs: [
        'Max Mejder\nAlmendorfer Straße 15\n36100 Petersberg\nDeutschland',
        'E-Mail: rmmejder@gmail.com',
        'Die Inhalte dieser Website wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte kann jedoch keine Gewähr übernommen werden.',
        'Diese Website enthält Links zu externen Websites Dritter, auf deren Inhalte kein Einfluss besteht. Deshalb kann für diese fremden Inhalte keine Gewähr übernommen werden. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber verantwortlich.',
        'Die durch den Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechts bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.',
    ],
};

const EN_IMPRESSUM = {
    headings: ['Responsible for Content', 'Contact', 'Liability for Content', 'Liability for Links', 'Copyright'],
    paragraphs: [
        'Max Mejder\nAlmendorfer Straße 15\n36100 Petersberg\nGermany',
        'Email: rmmejder@gmail.com',
        'The content of this website has been created with great care. However, no guarantee can be given for the accuracy, completeness, or timeliness of the content.',
        'This website contains links to external third-party websites over whose content we have no control. Therefore, no liability can be accepted for this external content. The respective provider or operator is always responsible for the content of linked pages.',
        'The content and works created by the site operator on these pages are subject to German copyright law. Any duplication, editing, distribution, or use outside the limits of copyright law requires the written consent of the respective author or creator.',
    ],
};

const DE_PRIVACY = {
    headings: ['1. Verantwortlicher', '2. Hosting und Server-Logfiles', '3. Kontaktaufnahme', '4. Speicherdauer', '5. Externe Links', '6. Rechte betroffener Personen', '7. Stand'],
    paragraphs: [
        'Max Mejder\nAlmendorfer Straße 15\n36100 Petersberg\nDeutschland\nE-Mail: rmmejder@gmail.com',
        'Beim Aufruf dieser Website können durch den Hosting-Anbieter automatisch Informationen in Server-Logfiles erhoben werden (z. B. IP-Adresse, Datum und Uhrzeit, aufgerufene Seite, Browser-Informationen). Die Verarbeitung erfolgt zur technischen Bereitstellung und Sicherheit der Website.',
        'Wenn du per E-Mail oder über das Kontaktformular Kontakt aufnimmst, werden die von dir übermittelten Daten (z. B. Name, E-Mail-Adresse, Nachricht) ausschließlich zur Bearbeitung deiner Anfrage verarbeitet.',
        'Rechtsgrundlage ist Artikel 6 Absatz 1 Buchstabe b DSGVO (vorvertragliche Kommunikation) bzw. Artikel 6 Absatz 1 Buchstabe f DSGVO (berechtigtes Interesse an der Bearbeitung von Anfragen).',
        'Personenbezogene Daten werden nur so lange gespeichert, wie es für die Bearbeitung der Anfrage erforderlich ist oder gesetzliche Aufbewahrungspflichten bestehen.',
        'Diese Website enthält Links zu externen Plattformen (z. B. LinkedIn, GitHub). Beim Anklicken dieser Links gelten die Datenschutzbestimmungen der jeweiligen Anbieter.',
        'Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit sowie Widerspruch gegen die Verarbeitung deiner Daten im Rahmen der geltenden gesetzlichen Bestimmungen.',
        'Außerdem besteht ein Beschwerderecht bei einer Datenschutzaufsichtsbehörde.',
        'Stand dieser Datenschutzerklärung: Juni 2026.',
    ],
};

const EN_PRIVACY = {
    headings: ['1. Controller', '2. Hosting and Server Log Files', '3. Contact Requests', '4. Storage Duration', '5. External Links', '6. Rights of Data Subjects', '7. Status'],
    paragraphs: [
        'Max Mejder\nAlmendorfer Straße 15\n36100 Petersberg\nGermany\nEmail: rmmejder@gmail.com',
        'When this website is accessed, information may be automatically collected by the hosting provider in server log files (e.g., IP address, date and time, accessed page, browser information). Processing is carried out to provide and secure the website technically.',
        'If you contact us by email or through the contact form, the data you provide (e.g., name, email address, message) will be processed solely to handle your request.',
        'The legal basis is Article 6(1)(b) GDPR (pre-contractual communication) and/or Article 6(1)(f) GDPR (legitimate interest in handling requests).',
        'Personal data is stored only as long as necessary to process the request or as required by statutory retention obligations.',
        'This website contains links to external platforms (e.g., LinkedIn, GitHub). When you click these links, the privacy policies of the respective providers apply.',
        'You have the right to access, rectification, erasure, restriction of processing, data portability, and objection to the processing of your data within the scope of applicable legal provisions.',
        'You also have the right to lodge a complaint with a data protection supervisory authority.',
        'Status of this privacy policy: June 2026.',
    ],
};

const I18N = {
    de: {
        'legal-notice': { title: 'Rechtliches | Max Mejder', heading: 'Rechtliche Hinweise', tabLabel: 'Rechtliche Inhalte', tabImpressum: 'Impressum', tabDatenschutz: 'Datenschutz', backLink: 'Zurück zur Startseite', impressum: DE_IMPRESSUM, privacy: DE_PRIVACY },
        datenschutz: { title: 'Datenschutz | Max Mejder', heading: 'Datenschutzerklärung', intro: 'Informationen zum Umgang mit personenbezogenen Daten auf dieser Website.', backLink: 'Zurück zur Startseite', section: DE_PRIVACY },
        impressum: { title: 'Impressum | Max Mejder', heading: 'Impressum', intro: 'Angaben gemäß Paragraph 5 TMG', backLink: 'Zurück zur Startseite', section: DE_IMPRESSUM },
    },
    en: {
        'legal-notice': { title: 'Legal Notice | Max Mejder', heading: 'Legal Notice', tabLabel: 'Legal content', tabImpressum: 'Imprint', tabDatenschutz: 'Privacy Policy', backLink: 'Back to homepage', impressum: EN_IMPRESSUM, privacy: EN_PRIVACY },
        datenschutz: { title: 'Privacy Policy | Max Mejder', heading: 'Privacy Policy', intro: 'Information on how personal data is processed on this website.', backLink: 'Back to homepage', section: EN_PRIVACY },
        impressum: { title: 'Imprint | Max Mejder', heading: 'Imprint', intro: 'Information according to Section 5 TMG', backLink: 'Back to homepage', section: EN_IMPRESSUM },
    },
};

function q(selector, root = document) { return root.querySelector(selector); }

function qa(selector, root = document) { return Array.from(root.querySelectorAll(selector)); }

function setText(node, value) {
    if (node) node.textContent = value;
}

function setListText(selector, values, root = document) {
    qa(selector, root).forEach((node, index) => setText(node, values[index]));
}

function setBackLinkText(value) {
    setText(q('.legal-back-link a'), value);
}

function getPageKey() {
    const path = window.location.pathname.toLowerCase();
    if (path.endsWith('legal-notice.html')) return 'legal-notice';
    if (path.endsWith('datenschutz.html')) return 'datenschutz';
    return path.endsWith('impressum.html') ? 'impressum' : null;
}

function formatMailParagraph(text, link) {
    const lines = text.split('\n');
    const label = (lines.pop() || '').split(':')[0];
    const prefix = lines.length ? `${lines.join('<br>')}<br>` : '';
    return `${prefix}${label}: `;
}

function setParagraph(node, text) {
    const mailLink = q('a[href^="mailto:"]', node);
    if (!mailLink) node.innerHTML = text.split('\n').join('<br>');
    if (!mailLink) return;
    node.innerHTML = formatMailParagraph(text, mailLink);
    node.appendChild(mailLink);
}

function setSectionContent(scope, sectionData) {
    setListText(`${scope} .legal-section h2`, sectionData.headings);
    qa(`${scope} .legal-section p`).forEach((node, index) => {
        const value = sectionData.paragraphs[index];
        if (value) setParagraph(node, value);
    });
}

function setMeta(copy, lang) {
    document.title = copy.title;
    document.documentElement.lang = lang;
    setText(q('.legal-header h1'), copy.heading);
    setText(q('.legal-header p'), copy.intro || '');
    setBackLinkText(copy.backLink);
}

function setLegalNoticeTabs(copy) {
    const tabList = q('.legal-tabs');
    if (tabList) tabList.setAttribute('aria-label', copy.tabLabel);
    setText(q('.legal-tab[data-target="impressum"]'), copy.tabImpressum);
    setText(q('.legal-tab[data-target="datenschutz"]'), copy.tabDatenschutz);
}

function applyLegalNotice(copy) {
    setMeta(copy, copy === I18N.de['legal-notice'] ? 'de' : 'en');
    setLegalNoticeTabs(copy);
    setSectionContent('#impressum', copy.impressum);
    setSectionContent('#datenschutz', copy.privacy);
}

function applySingleLegalPage(copy, lang) {
    setMeta(copy, lang);
    setSectionContent('', copy.section);
}

function markActiveLanguage(lang) {
    qa('.legal-translate button[data-lang]').forEach((button) => {
        button.classList.toggle('is-active', button.dataset.lang === lang);
    });
}

function getSavedLanguage() {
    const language = localStorage.getItem(STORAGE_KEY);
    return language === 'en' || language === 'de' ? language : 'de';
}

function applyLanguage(lang) {
    const pageKey = getPageKey();
    if (!pageKey || !I18N[lang] || !I18N[lang][pageKey]) return;
    const copy = I18N[lang][pageKey];
    if (pageKey === 'legal-notice') applyLegalNotice(copy);
    if (pageKey !== 'legal-notice') applySingleLegalPage(copy, lang);
}

function onLanguageClick(button) {
    const lang = button.dataset.lang === 'en' ? 'en' : 'de';
    localStorage.setItem(STORAGE_KEY, lang);
    markActiveLanguage(lang);
    applyLanguage(lang);
}

function initLegalTranslations() {
    const buttons = qa('.legal-translate button[data-lang]');
    if (!buttons.length) return;
    const language = getSavedLanguage();
    markActiveLanguage(language);
    applyLanguage(language);
    buttons.forEach((button) => button.addEventListener('click', () => onLanguageClick(button)));
}

document.addEventListener('DOMContentLoaded', initLegalTranslations);
