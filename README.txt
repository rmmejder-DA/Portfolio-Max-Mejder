================================================================================
                     MAX MEJDER'S PORTFOLIO WEBSITE
================================================================================

PROJECT OVERVIEW
================================================================================
This is a professional portfolio website for Max Mejder, a passionate frontend 
developer. The site showcases his projects, skills, and experience while 
providing an interactive and user-friendly experience across all devices.

KEY FEATURES
================================================================================
- Bilingual Support: Full support for German (DE) and English (EN) languages
- Responsive Design: Mobile-first approach with adaptive layouts for all screen sizes
- Interactive Contact Form: Allows visitors to send messages directly
- Project Showcase: Displays portfolio projects with descriptions
- Reviews Section: Dynamic reviews/testimonials system via API
- Legal Pages: Includes privacy policy (Datenschutzerklärung) and legal notice
- Modern UI: Clean, professional design with smooth animations

PROJECT STRUCTURE
================================================================================
/
├── index.html                 - Main portfolio website
├── impressum.html            - Legal notice (Impressum)
├── datenschutz.html          - Privacy policy (Datenschutzerklärung)
├── legal-notice.html         - Alternative legal notice
├── contact-form.php          - Backend handler for contact form
├── reviews_api.php           - Backend API for reviews/testimonials
│
├── css/                       - Stylesheets
│   ├── style.css             - Main styles
│   ├── style-part-*.css      - Modular style components
│   ├── media.css             - Responsive media queries
│   └── media-part-*.css      - Modular responsive components
│   └── legal.css             - Styles for legal pages
│
├── javascript/               - Frontend scripts
│   ├── app-texts.js          - Multilingual content/translations
│   ├── ui-core.js            - Core UI functionality
│   ├── contact-form.js       - Contact form handling
│   ├── reviews.js            - Reviews/testimonials display
│   ├── i18n.js               - Internationalization logic
│   ├── script.js             - Main application logic
│   └── legal.js              - Legal pages functionality
│
├── json/
│   └── package.json          - Project dependencies
│
├── fonts/                     - Custom fonts directory
├── icon/                      - Favicon and icon files
└── img/                       - Images and graphics

TECHNICAL STACK
================================================================================
Frontend:
  - HTML5
  - CSS3 (with media queries for responsive design)
  - Vanilla JavaScript (no frameworks)
  - Google Fonts integration

Backend:
  - PHP (for contact form and API endpoints)

Features:
  - Internationalization (i18n) system
  - Dynamic content loading and DOM manipulation
  - Drag-and-drop functionality (reviews)
  - Form validation
  - RESTful API integration

HOW TO USE
================================================================================
1. Open index.html in a web browser
2. Navigate through sections: About me, Skills, Portfolio, Contact
3. Use language toggle buttons (DE/EN) to switch languages
4. Fill out the contact form to send messages
5. View reviews and feedback from visitors
6. Access legal pages via footer links

DEPENDENCIES
================================================================================
- Node.js (development tool, see package.json)
- PHPMailer (for email sending via PHP)
- Google Fonts (loaded via CDN)

CONTACT & LEGAL
================================================================================
- Contact form backend: send_mail.php
- Reviews API: reviews_api.php
- Privacy Policy: datenschutz.html / legal-notice.html
- Legal Notice: impressum.html

BROWSER COMPATIBILITY
================================================================================
Works on all modern browsers:
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Responsive design supports devices from 320px to 4K

NOTE
================================================================================
This portfolio is a demonstration of Max Mejder's frontend development skills
and serves as his professional web presence. It includes real portfolio 
projects (Task Manager, Order App, Photo App, Recipe App, Pokedex, Jump Game)
to showcase practical experience and technical abilities.

================================================================================
Last Updated: 2026
================================================================================