# 👨‍💻 Max Mejder's Portfolio Website

> A modern, bilingual portfolio website showcasing frontend development projects and skills

---

## 🎯 Project Overview

This is a professional portfolio website for **Max Mejder**, a passionate frontend developer. The site showcases projects, skills, and experience while providing an interactive and user-friendly experience across all devices.

---

## ✨ Key Features

- 🌍 **Bilingual Support** - Full support for German (DE) and English (EN) languages
- 📱 **Responsive Design** - Mobile-first approach with adaptive layouts for all screen sizes
- 💌 **Interactive Contact Form** - Direct messaging capability for visitors
- 🎨 **Project Showcase** - Displays portfolio projects with descriptions
- ⭐ **Reviews Section** - Dynamic reviews/testimonials system via API
- ⚖️ **Legal Pages** - Privacy policy and legal notices included
- ✨ **Modern UI** - Clean, professional design with smooth animations

---

## 📁 Project Structure

```
Portfolio-Max-Mejder/
├── 📄 index.html                 # Main portfolio website
├── 📄 impressum.html             # Legal notice (Impressum)
├── 📄 datenschutz.html           # Privacy policy (Datenschutzerklärung)
├── 📄 legal-notice.html          # Alternative legal notice
├── 📄 admin-reviews.html         # Admin reviews page
├── 
├── 🔧 send_mail.php              # Backend: Contact form handler
├── 🔧 reviews_api.php            # Backend: Reviews API
│
├── 🎨 css/                       # Stylesheets
│   ├── style.css                 # Main styles
│   ├── style-part-*.css          # Modular style components
│   ├── media.css                 # Responsive media queries
│   └── legal.css                 # Legal pages styling
│
├── 📜 javascript/                # Frontend scripts
│   ├── script.js                 # Main application logic
│   ├── app-texts.js              # Multilingual content/translations
│   ├── ui-core.js                # Core UI functionality
│   ├── contact-form.js           # Contact form handling
│   ├── reviews.js                # Reviews/testimonials display
│   ├── i18n.js                   # Internationalization logic
│   ├── legal.js                  # Legal pages functionality
│   └── admin-reviews.js          # Admin reviews management
│
├── 🔤 fonts/                     # Custom fonts directory
├── 🎭 icon/                      # Favicon and icon files
│   ├── github-icon.png           # GitHub link icon
│   ├── linkedin-icon.png         # LinkedIn link icon
│   └── favicon-mm.ico            # Website favicon
│
├── 🖼️ img/                       # Images and graphics
│   ├── scrum.png                 # Scrum methodology icon
│   ├── angular-icon.png          # Angular framework icon
│   ├── typescript-icon.png       # TypeScript language icon
│   └── ...                       # Other project/skill images
│
├── 📦 package.json               # Project dependencies
└── 📚 README.md                  # This file
```

---

## 🛠️ Technical Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with media queries
- **Vanilla JavaScript** - No framework dependencies
- **Google Fonts** - Beautiful typography

### Backend
- **PHP** - Contact form & API endpoints

### Features
- 🌐 Internationalization (i18n) system
- ⚡ Dynamic content loading and DOM manipulation
- 🖱️ Drag-and-drop functionality (reviews)
- ✔️ Form validation
- 🔌 RESTful API integration

---

## 🚀 Getting Started

### Prerequisites
- Web browser (modern version)
- PHP server (for backend functionality)
- Node.js (optional, for development tools)

### Usage
1. **Clone or download** the repository
2. **Open** `index.html` in your browser
3. **Navigate** through sections: About, Skills, Portfolio, Contact
4. **Toggle language** using DE/EN buttons (top-right)
5. **Send messages** via the contact form
6. **View reviews** and visitor feedback

### Local Development
```bash
# Navigate to project directory
cd "Portfolio Max Mejder"

# Install dependencies (if needed)
npm install

# For PHP backend, use a local server:
# PHP built-in server (7.0+)
php -S localhost:8000
```

---

## 📦 Dependencies

### Frontend
- **Google Fonts** - Loaded via CDN (no installation needed)

### Backend
- **PHPMailer** - For email sending functionality
- **PHP 7.0+** - Required for backend scripts

### Development
- See `package.json` for dev dependencies

---

## 🔗 Links & Resources

| Link | Purpose |
|------|---------|
| 🌐 [Live Website](https://max-mejder.de) | View the portfolio online |
| 📧 [Contact Form](./index.html#contact) | Send a message |
| 💻 [GitHub Profile](https://github.com/rmmejder-DA) | View source code |
| 📋 [Privacy Policy](./datenschutz.html) | GDPR & Data Protection |
| ⚖️ [Legal Notice](./impressum.html) | Impressum & Legal Info |

---

## 📝 Backend Endpoints

### Contact Form
- **File:** `send_mail.php`
- **Method:** POST
- **Parameters:** `name`, `email`, `phone`, `subject`, `message`
- **Response:** JSON with status

### Reviews API
- **File:** `reviews_api.php`
- **Method:** GET/POST
- **Features:** Fetch and manage reviews/testimonials

---

## ♿ Accessibility & SEO

- ✅ Semantic HTML5
- ✅ ARIA labels for screen readers
- ✅ Keyboard navigation support
- ✅ Meta tags for SEO
- ✅ Mobile-friendly design (responsive)

---

## 🌐 Browser Compatibility

Tested and compatible with:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)
- ✅ Responsive support: 320px → 4K

---

## 📄 License

This portfolio website is the proprietary work of Max Mejder.

For legal information, see:
- 🔒 [Datenschutzerklärung (Privacy Policy)](./datenschutz.html)
- ⚖️ [Impressum (Legal Notice)](./impressum.html)

---

## 👋 Get in Touch

💌 **Contact:** Use the contact form on the website  
🔗 **GitHub:** [rmmejder-DA](https://github.com/rmmejder-DA)  
💼 **LinkedIn:** [Max Mejder](https://linkedin.com/in/max-mejder)  

---

<div align="center">

**Made with ❤️ by Max Mejder**

⭐ If you like this portfolio, consider giving it a star!

</div>
