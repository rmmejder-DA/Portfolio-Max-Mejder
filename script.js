// <? php

// // CORS headers (for Angular / frontend apps)
// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Methods: POST, OPTIONS");
// header("Access-Control-Allow-Headers: Content-Type");
// header("Content-Type: application/json; charset=utf-8");

// // ------------------------------------------------------------
// // WICHTIG:
// // Deine eigene Adresse in Zeile 15 setzen!
// // ------------------------------------------------------------

// // >>> DEINE EMAIL HIER EINTRAGEN <<<
// $siteEmail = "DEINE_EMAIL_HIER";

// switch ($_SERVER['REQUEST_METHOD']) {

//     case 'OPTIONS':
//         // Preflight request
//         http_response_code(200);
//         exit;

//     case 'POST':
//         // Read raw JSON payload
//         $json = file_get_contents('php://input');
//         $params = json_decode($json);

//         // Saubere JSON-Fehlerprüfung
//         if (json_last_error() !== JSON_ERROR_NONE) {
//             http_response_code(400);
//             echo json_encode(['success' => false, 'error' => 'Invalid JSON']);
//             exit;
//         }

//         $email = $params -> email ?? '';
//         $name = $params -> name ?? '';
//         $userMessage = $params -> message ?? '';

//         // Basic validation
//         if (!filter_var($email, FILTER_VALIDATE_EMAIL) || empty($name) || empty($userMessage)) {
//             http_response_code(400);
//             echo json_encode(['success' => false, 'error' => 'Invalid input data']);
//             exit;
//         }

//         // Sanitize content
//         $safeName = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
//         $safeEmail = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
//         $safeMessage = nl2br(htmlspecialchars($userMessage, ENT_QUOTES, 'UTF-8'));

//         // Empfängeradresse (nutzt die oben definierte Mail)
//         $recipient = $siteEmail;
//         $subject = 'Website Contact Form';

//         $mailBody = "<strong>Name:</strong> {$safeName}<br>
//             < strong > Email:</strong > { $safeEmail } < br > <br>
//                 <strong>Message:</strong><br>
//                     {$safeMessage}
//                     ";

//                     // Mail headers
//                     $headers = [];
//                     $headers[] = 'MIME-Version: 1.0';
//                     $headers[] = 'Content-type: text/html; charset=utf-8';
//                     $headers[] = 'From: Website Kontakt <' . $siteEmail . '>';
//                     $headers[] = 'Reply-To: ' . $email;
//                     $headers[] = 'Return-Path: ' . $siteEmail;

//                     // Send mail
//                     $success = mail(
//                     $recipient,
//                     $subject,
//                     $mailBody,
//                     implode("\r\n", $headers),
//                     '-f ' . $siteEmail
//                     );

//                     if ($success) {
//                         echo json_encode(['success' => true]);
//         } else {
//                         http_response_code(500);
//             echo json_encode(['success' => false, 'error' => 'Mail delivery failed']);
//         }

//                     break;

//                     default:
//                     http_response_code(405);
//         echo json_encode(['success' => false, 'error' => 'Method not allowed']);
//                     exit;
// }

function setText(selector, value) {
    const element = document.querySelector(selector);
    if (element) {
        element.textContent = value;
    }
}

function setTextAt(selector, index, value) {
    const elements = document.querySelectorAll(selector);
    if (elements[index]) {
        elements[index].textContent = value;
    }
}

function setHtml(selector, value) {
    const element = document.querySelector(selector);
    if (element) {
        element.innerHTML = value;
    }
}

function setPlaceholder(selector, value) {
    const element = document.querySelector(selector);
    if (element) {
        element.placeholder = value;
    }
}

function setNavigationLabels(desktopLabels, mobileLabels) {
    const desktopLinks = document.querySelectorAll('.nav a');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    desktopLabels.forEach((label, index) => {
        if (desktopLinks[index]) {
            desktopLinks[index].textContent = label;
        }
    });

    mobileLabels.forEach((label, index) => {
        if (mobileLinks[index]) {
            mobileLinks[index].textContent = label;
        }
    });
}

function applyLanguage(language) {
    if (language === 'de') {
        setNavigationLabels(
            ['Ueber mich', 'My skills', 'Portfolio'],
            ['Ueber mich', 'My skills', 'Portfolio', 'Kontakt']
        );

        setText('.vertical-headline', 'Ich bin');
        setText('.job-title', 'FRONTEND ENTWICKLER');

        setHtml('.scrollDown-vertical', 'Nach unten scrollen<p class="arrow">&#x279C;</p>');

        setText('.section-title', 'Ueber mich');
        setText('.about-me-text', 'Ich bin leidenschaftlicher Frontend-Entwickler und entwickle moderne, benutzerfreundliche Webanwendungen. Meine Motivation ist es, Technik in klare und intuitive Erlebnisse zu verwandeln und mich dabei staendig weiterzuentwickeln.');
        setText('.location-text', 'Ich arbeite in Deutschland und bin offen fuer Remote-Arbeit sowie neue Standorte, wenn das Projekt und das Team passen.');
        setText('.open-minded-text', 'Ich bin neugierig auf neue Technologien, lerne schnell und verbessere meine Faehigkeiten kontinuierlich.');
        setText('.puzzle-text', 'Ich loese Probleme strukturiert und kreativ. Komplexe Aufgaben zerlege ich in klare Schritte und finde effiziente, nachhaltige Loesungen.');

        setText('.skills-title', 'Meine Skills');
        setText('.skills-description', 'Ich habe in meinen Projekten verschiedene Frontend-Technologien eingesetzt und praxisnah kombiniert.');
        setHtml('.skills-question', 'Suchst du <span>eine weitere Skill</span>?');
        setText('.skills-subtext', 'Ich lerne gerne neue Technologien und Frameworks, um mich stetig weiterzuentwickeln.');

        // Portfolio headings (section/project titles) remain unchanged by request.
        setText('.portfolio-subtitle', 'Hier findest du eine Auswahl meiner Projekte und einen Einblick in meine praktischen Faehigkeiten.');
        setTextAt('.portfolio-description', 0, 'Task-Manager nach dem Kanban-Prinzip. Aufgaben koennen per Drag and Drop organisiert und verschiedenen Personen sowie Kategorien zugeordnet werden.');
        setTextAt('.portfolio-description', 1, 'Eine Bestell-App, mit der Nutzer Menues durchsuchen, Produkte in den Warenkorb legen und Bestellungen absenden koennen.');
        setTextAt('.portfolio-description', 2, 'Eine Foto-Sharing-App zum Hochladen, Teilen und Entdecken von Bildern mit moderner Benutzeroberflaeche.');
        setTextAt('.portfolio-description', 3, 'Eine Rezept-App mit klarer Struktur und benutzerfreundlicher Navigation fuer schnelles Finden von Inhalten.');
        setTextAt('.portfolio-description', 4, 'Ein Pokedex-Projekt mit Fokus auf API-Integration, Datenaufbereitung und uebersichtliche Darstellung.');
        setTextAt('.portfolio-description', 5, 'Ein 2D-Jump-and-Run-Spiel mit objektorientierter Struktur, Animationen und interaktiver Spielmechanik.');

        setText('.contact_me', 'Kontakt');
        setText('.got_a_problem', 'Hast du ein Problem zu loesen?');
        setText('.contact_text', 'Ich bin offen fuer neue Projekte und spannende Herausforderungen. Schreib mir gerne, dann schauen wir gemeinsam auf eine passende Loesung.');
        setPlaceholder('.contact_input[type="text"]', 'Dein Name');
        setPlaceholder('.contact_input[type="email"]', 'Deine E-Mail');
        setPlaceholder('.contact_textarea', 'Deine Nachricht');
        setHtml('.contact_checkbox_label', 'Ich habe die <a href="legal-notice.html#datenschutz" class="privacy-link">Datenschutzerklaerung</a> gelesen und stimme der Verarbeitung meiner Daten zu.');
    } else {
        setNavigationLabels(
            ['About me', 'My skills', 'Portfolio'],
            ['About me', 'My skills', 'Portfolio', 'Contact']
        );

        setText('.vertical-headline', 'I am');
        setText('.job-title', 'FRONTEND DEVELOPER');

        setHtml('.scrollDown-vertical', 'Scroll down<p class="arrow">&#x279C;</p>');

        setText('.section-title', 'About me');
        setText('.about-me-text', 'Write some information about yourself that is IT related. Why are you passionate about coding? What is your source of inspiration for improving your programming skills?');
        setText('.location-text', 'Where are you located? Are you open to different ways of working, such as working remotely or even relocating?');
        setText('.open-minded-text', 'Show that you are open-minded. Are you enthusiastic about learning new technologies and continually improving your skills?');
        setText('.puzzle-text', 'A brief description of your problem-solving approach. Do you learn from each challenge as you search for the most efficient or elegant solution? You can include some keywords like: analytical thinking, creativity, persistence and collaboration.');

        setText('.skills-title', 'My skills');
        setText('.skills-description', 'Show that you have used a variety of front-end technologies in your projects.');
        setHtml('.skills-question', 'Looking for <span>another skill</span>?');
        setText('.skills-subtext', 'Reveal enthusiasm for learning new technologies and frameworks.');

        // Portfolio headings (section/project titles) remain unchanged by request.
        setText('.portfolio-subtitle', 'Explore a selection of my work here - Interact with projects to see my skills in action.');
        setTextAt('.portfolio-description', 0, 'Task manager inspired by the Kanban System. Let you and your team organize tasks using drag and drop functionality, assign tasks to different users and categories.');
        setTextAt('.portfolio-description', 1, 'A food ordering app that allows users to browse a menu, add items to their cart, and place orders. The app features a user-friendly interface, real-time order tracking, and secure payment processing.');
        setTextAt('.portfolio-description', 2, 'A photo sharing app that allows users to upload, share, and discover photos. The app features a user-friendly interface, real-time photo updates, and secure authentication.');
        setTextAt('.portfolio-description', 3, 'A recipe app that allows users to browse a menu, add items to their cart, and place orders. The app features a user-friendly interface, real-time order tracking, and secure payment processing.');
        setTextAt('.portfolio-description', 4, 'A pokedex app that allows users to browse a menu, add items to their cart, and place orders. The app features a user-friendly interface, real-time order tracking, and secure payment processing.');
        setTextAt('.portfolio-description', 5, 'A food ordering app that allows users to browse a menu, add items to their cart, and place orders. The app features a user-friendly interface, real-time order tracking, and secure payment processing.');

        setText('.contact_me', 'Contact');
        setText('.got_a_problem', 'Got a problem to solve?');
        setText('.contact_text', 'I am always open to new challenges and opportunities. If you have a project in mind or just want to say hi, feel free to reach out. Let\'s connect and see how we can work together!');
        setPlaceholder('.contact_input[type="text"]', 'Your name');
        setPlaceholder('.contact_input[type="email"]', 'Your email');
        setPlaceholder('.contact_textarea', 'Your message');
        setHtml('.contact_checkbox_label', 'I\'ve read the <a href="legal-notice.html#datenschutz" class="privacy-link">privacy policy</a> and agree to the processing of my data as outlined.');
    }
}

function setActiveLanguage(clickedButton) {
    const languageButtons = document.querySelectorAll('.translate-buttons button');
    languageButtons.forEach((button) => button.classList.remove('is-active'));
    const selectedLanguage = clickedButton.textContent.trim().toLowerCase() === 'de' ? 'de' : 'en';
    languageButtons.forEach((button) => {
        const buttonLanguage = button.textContent.trim().toLowerCase();
        if (buttonLanguage === selectedLanguage) {
            button.classList.add('is-active');
        }
    });
    applyLanguage(selectedLanguage);
}

function scrollToContact() {
    const contactSection = document.getElementById('contact_me');
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.getElementById('gotoContact').addEventListener('click', scrollToContact);
document.getElementById('gotoContactMobile').addEventListener('click', scrollToContact);
document.getElementById('getInTouchtoContact').addEventListener('click', scrollToContact);

const scrollToTopButton = document.getElementById('scrollToTopButton');
if (scrollToTopButton) {
    scrollToTopButton.addEventListener('click', scrollToTop);
}

const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuClose = document.querySelector('.mobile-menu-close');

if (mobileNavToggle && mobileMenu) {
    const closeMobileMenu = () => {
        mobileMenu.classList.remove('is-open');
        mobileNavToggle.classList.remove('is-open');
        mobileNavToggle.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
    };

    mobileNavToggle.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.toggle('is-open');
        mobileNavToggle.classList.toggle('is-open', isOpen);
        mobileNavToggle.setAttribute('aria-expanded', String(isOpen));
        mobileMenu.setAttribute('aria-hidden', String(!isOpen));
    });

    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', closeMobileMenu);
    }

    mobileMenu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });
}

const REVIEW_STORAGE_KEY = 'portfolioReviews';
const DEFAULT_REVIEW_PHOTO = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgc3Ryb2tlPSIjNzBFNjFDIiBzdHJva2Utd2lkdGg9IjIuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0LCAwKSI+PHBhdGggZD0iTTE4LjUgNi41QzIwLjk4NTMgNi41IDIzIDguNTE0NzIgMjMgMTFWMTNIMzFDMzIuNjU2OSAxMyA0NCAxNC4zNDMxIDQ0IDE2VjI0SDE2VjE1QzE2IDguNTE0NzIgMTguMDE0NyA2LjUgMTguNSA2LjVaIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS13aWR0aD0iMi41IiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9nPjwvc3ZnPg==';
const defaultReviews = [];

let reviews = [];
let currentReviewIndex = 0;

function loadReviews() {
    try {
        localStorage.removeItem(REVIEW_STORAGE_KEY);
        reviews = [...defaultReviews];
    } catch (error) {
        reviews = [...defaultReviews];
    }
}

function saveReviews() {
    localStorage.removeItem(REVIEW_STORAGE_KEY);
}

function convertImageFileToDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const image = new Image();
            image.onload = () => {
                const maxSize = 360;
                const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
                const width = Math.round(image.width * scale);
                const height = Math.round(image.height * scale);

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    resolve(null);
                    return;
                }

                ctx.drawImage(image, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', 0.82));
            };
            image.onerror = () => reject(new Error('Image load failed'));
            image.src = reader.result;
        };
        reader.onerror = () => reject(new Error('File read failed'));
        reader.readAsDataURL(file);
    });
}

function rebuildReviewDots() {
    const controls = document.querySelector('.review-slider-controls');
    if (!controls) {
        return;
    }

    const oldDots = controls.querySelectorAll('.review-dot');
    oldDots.forEach((dot) => dot.remove());

    const nextArrow = controls.querySelector('.review-arrow[aria-label="Next review"]');
    reviews.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'review-dot';
        dot.setAttribute('aria-label', `Go to review ${index + 1}`);
        dot.addEventListener('click', () => showReview(index));
        controls.insertBefore(dot, nextArrow);
    });
}

function renderActiveDot() {
    const dots = document.querySelectorAll('.review-dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('is-active', index === currentReviewIndex);
    });
}

function showReview(index) {
    if (!reviews.length) {
        return;
    }

    currentReviewIndex = (index + reviews.length) % reviews.length;
    const active = reviews[currentReviewIndex];

    const reviewText = document.getElementById('commentar-text');
    const reviewName = document.querySelector('.reviewOfperson_name');
    const reviewPerson = document.getElementById('reviewPerson');

    if (reviewText) {
        reviewText.textContent = active.text;
    }
    if (reviewName) {
        reviewName.textContent = active.name;
    }
    if (reviewPerson) {
        reviewPerson.src = active.photo || DEFAULT_REVIEW_PHOTO;
        reviewPerson.alt = `${active.name} photo`;
    }

    renderActiveDot();
}

function renderEmptyReviewState() {
    const reviewText = document.getElementById('commentar-text');
    const reviewName = document.querySelector('.reviewOfperson_name');
    const reviewPerson = document.getElementById('reviewPerson');

    if (reviewText) {
        reviewText.textContent = 'Noch keine Kommentare. Hinterlasse ueber den Button dein Feedback.';
    }
    if (reviewName) {
        reviewName.textContent = 'Dein Kommentar erscheint hier';
    }
    if (reviewPerson) {
        reviewPerson.src = DEFAULT_REVIEW_PHOTO;
        reviewPerson.alt = 'Platzhalter fuer Kommentare';
    }
}

function bindReviewNavigation() {
    const prevArrow = document.querySelector('.review-arrow[aria-label="Previous review"]');
    const nextArrow = document.querySelector('.review-arrow[aria-label="Next review"]');

    if (prevArrow) {
        prevArrow.addEventListener('click', () => showReview(currentReviewIndex - 1));
    }
    if (nextArrow) {
        nextArrow.addEventListener('click', () => showReview(currentReviewIndex + 1));
    }
}

function bindReviewForm() {
    const form = document.getElementById('reviewForm');
    const nameInput = document.getElementById('reviewName');
    const messageInput = document.getElementById('reviewMessage');
    const photoInput = document.getElementById('reviewPhoto');
    const dialog = document.getElementById('reviewCommentDialog');

    if (!form || !nameInput || !messageInput || !photoInput) {
        return;
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const name = nameInput.value.trim();
        const text = messageInput.value.trim();

        if (name.length < 2 || text.length < 8) {
            return;
        }

        let photoData = DEFAULT_REVIEW_PHOTO;
        const file = photoInput.files && photoInput.files[0] ? photoInput.files[0] : null;

        if (file) {
            if (!file.type.startsWith('image/')) {
                return;
            }

            try {
                const converted = await convertImageFileToDataUrl(file);
                if (converted) {
                    photoData = converted;
                }
            } catch (error) {
                photoData = DEFAULT_REVIEW_PHOTO;
            }
        }

        reviews.push({
            name,
            text: `"${text}"`,
            photo: photoData,
        });

        if (reviews.length > 40) {
            reviews = reviews.slice(reviews.length - 40);
        }

        saveReviews();
        rebuildReviewDots();
        showReview(reviews.length - 1);
        form.reset();

        if (dialog) {
            dialog.close();
        }
    });
}

function bindReviewCommentDialog() {
    const dialog = document.getElementById('reviewCommentDialog');
    const openButton = document.getElementById('openReviewCommentDialog');
    const closeButton = document.getElementById('closeReviewCommentDialog');

    if (!dialog || !openButton) {
        return;
    }

    openButton.addEventListener('click', () => {
        if (typeof dialog.showModal === 'function') {
            dialog.showModal();
        }
    });

    if (closeButton) {
        closeButton.addEventListener('click', () => {
            dialog.close();
        });
    }
}

function initializeReviews() {
    loadReviews();
    rebuildReviewDots();
    bindReviewNavigation();
    bindReviewForm();
    bindReviewCommentDialog();
    if (reviews.length) {
        showReview(0);
    } else {
        renderEmptyReviewState();
    }
}

function bindContactFormValidation() {
    const contactForm = document.querySelector('.contact_form');
    const submitButton = document.querySelector('.contact_submit');

    if (!contactForm || !submitButton) {
        return;
    }

    const syncContactFormState = () => {
        const isValid = contactForm.checkValidity();
        contactForm.classList.toggle('is-valid', isValid);
        submitButton.disabled = !isValid;
    };

    contactForm.addEventListener('input', syncContactFormState);
    contactForm.addEventListener('change', syncContactFormState);
    syncContactFormState();
}

document.addEventListener('DOMContentLoaded', () => {
    applyLanguage('en');
    initializeReviews();
    bindContactFormValidation();
});