// Main JavaScript - GSP Website

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollReveal();
    initCounters();
    initLanguagePersistence();
    initLanguageToggle();
});

// Navigation Toggle
function initNavigation() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navbar = document.querySelector('.navbar');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');

            // Animate hamburger
            const bars = mobileToggle.querySelectorAll('.bar');
            if (navLinks.classList.contains('active')) {
                bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });
    }

    // Scroll effect for navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Scroll Reveal Animation
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    reveals.forEach(reveal => {
        revealObserver.observe(reveal);
    });
}

// Number Counter Animation
function initCounters() {
    const counters = document.querySelectorAll('.counter-value');

    if (counters.length === 0) return;

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element, target) {
    let current = 0;
    const duration = 2000; // 2 seconds
    const step = target / (duration / 16); // 60fps

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

// ============================================
// MODERN 2025 INTERACTIVE EFFECTS
// ============================================

// Initialize all modern effects
document.addEventListener('DOMContentLoaded', () => {
    initCustomCursor();
    initParallax();
    initTiltEffect();
    initMagneticButtons();
    initScrollProgress();
    initStaggerReveal();
    initProfessionalReveal();
});

// Custom Cursor
function initCustomCursor() {
    // Check if touch device
    if ('ontouchstart' in window) return;

    // Create cursor elements
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    document.body.appendChild(cursorDot);

    let cursorX = 0, cursorY = 0;
    let dotX = 0, dotY = 0;

    document.addEventListener('mousemove', (e) => {
        cursorX = e.clientX;
        cursorY = e.clientY;
    });

    // Smooth cursor animation
    function animateCursor() {
        dotX += (cursorX - dotX) * 0.2;
        dotY += (cursorY - dotY) * 0.2;

        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        cursorDot.style.left = dotX + 'px';
        cursorDot.style.top = dotY + 'px';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effects
    const hoverElements = document.querySelectorAll('a, button, .btn, .vision-card, .gallery-item, .nav-link');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });

    // Click effect
    document.addEventListener('mousedown', () => cursor.classList.add('click'));
    document.addEventListener('mouseup', () => cursor.classList.remove('click'));
}

// Parallax Scrolling
function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');

    if (parallaxElements.length === 0) {
        // Apply subtle parallax to hero image
        const heroImage = document.querySelector('.hero-image');
        if (heroImage) {
            window.addEventListener('scroll', () => {
                const scrolled = window.scrollY;
                const rate = scrolled * 0.3;
                heroImage.style.transform = `translateY(${rate}px)`;
            });
        }
    }

    window.addEventListener('scroll', () => {
        parallaxElements.forEach(el => {
            const speed = el.dataset.parallax || 0.5;
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const scrolled = window.scrollY;
                el.style.transform = `translateY(${scrolled * speed}px)`;
            }
        });
    });
}

// 3D Tilt Effect
function initTiltEffect() {
    const tiltCards = document.querySelectorAll('.vision-card, .glass-card, .video-card');

    tiltCards.forEach(card => {
        card.classList.add('tilt-card');

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.setProperty('--tilt-x', `${rotateX}deg`);
            card.style.setProperty('--tilt-y', `${rotateY}deg`);
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
}

// Magnetic Buttons
function initMagneticButtons() {
    const magneticBtns = document.querySelectorAll('.btn-primary, .nav-cta');

    magneticBtns.forEach(btn => {
        btn.classList.add('magnetic-btn');

        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.setProperty('--magnet-x', `${x * 0.3}px`);
            btn.style.setProperty('--magnet-y', `${y * 0.3}px`);
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.setProperty('--magnet-x', '0px');
            btn.style.setProperty('--magnet-y', '0px');
        });
    });
}

// Scroll Progress Bar
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = `${progress}%`;
    });
}

// Stagger Reveal Animation
function initStaggerReveal() {
    const containers = document.querySelectorAll('.vision-grid, .stats-grid, .ideology-grid');

    containers.forEach(container => {
        container.classList.add('stagger-container');
        const items = container.children;
        Array.from(items).forEach(item => item.classList.add('stagger-item'));
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.stagger-container').forEach(container => {
        observer.observe(container);
    });
}

// Professional Reveal Effect for Hero
function initProfessionalReveal() {
    const heroTitle = document.querySelector('.hero-content h1');
    const heroText = document.querySelector('.hero-content p');
    const heroButtons = document.querySelector('.hero-buttons');

    if (heroTitle) {
        heroTitle.style.opacity = '0';
        heroTitle.style.transform = 'translateY(30px)';
        heroTitle.style.transition = 'opacity 1s ease-out, transform 1s ease-out';

        setTimeout(() => {
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
        }, 300);
    }

    if (heroText) {
        heroText.style.opacity = '0';
        heroText.style.transform = 'translateY(30px)';
        heroText.style.transition = 'opacity 1s ease-out 0.3s, transform 1s ease-out 0.3s';

        setTimeout(() => {
            heroText.style.opacity = '1';
            heroText.style.transform = 'translateY(0)';
        }, 300);
    }

    if (heroButtons) {
        heroButtons.style.opacity = '0';
        heroButtons.style.transform = 'translateY(20px)';
        heroButtons.style.transition = 'opacity 0.8s ease-out 0.6s, transform 0.8s ease-out 0.6s';

        setTimeout(() => {
            heroButtons.style.opacity = '1';
            heroButtons.style.transform = 'translateY(0)';
        }, 300);
    }
}

// Enhanced Reveal with Scale
const enhancedReveal = () => {
    const reveals = document.querySelectorAll('.reveal:not(.active)');

    reveals.forEach((reveal, index) => {
        const windowHeight = window.innerHeight;
        const elementTop = reveal.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < windowHeight - elementVisible) {
            setTimeout(() => {
                reveal.classList.add('active');
            }, index * 100);
        }
    });
};

window.addEventListener('scroll', enhancedReveal);

// Language Toggle Logic
function initLanguagePersistence() {
    const preferredLang = localStorage.getItem('gsp_lang') || 'hi';
    updateUIForLanguage(preferredLang);
}

function initLanguageToggle() {
    // We use a delegator or multiple listeners for any toggle buttons
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('#lang-toggle');
        if (btn) {
            const currentLang = localStorage.getItem('gsp_lang') || 'hi';
            const newLang = currentLang === 'en' ? 'hi' : 'en';

            localStorage.setItem('gsp_lang', newLang);
            updateUIForLanguage(newLang);
        }
    });
}

function updateUIForLanguage(lang) {
    const enElements = document.querySelectorAll('.lang-en');
    const hiElements = document.querySelectorAll('.lang-hi');
    const toggleBtns = document.querySelectorAll('#lang-toggle');

    if (lang === 'hi') {
        enElements.forEach(el => el.style.display = 'none');
        hiElements.forEach(el => {
            if (el.tagName === 'SPAN' || el.classList.contains('inline-hi')) {
                el.style.display = 'inline';
            } else {
                el.style.display = 'block';
            }
        });
        toggleBtns.forEach(btn => btn.textContent = 'Read in English');
        document.documentElement.lang = 'hi';
    } else {
        enElements.forEach(el => {
            if (el.tagName === 'SPAN' || el.classList.contains('inline-en')) {
                el.style.display = 'inline';
            } else {
                el.style.display = 'block';
            }
        });
        hiElements.forEach(el => el.style.display = 'none');
        toggleBtns.forEach(btn => btn.textContent = 'हिंदी में पढ़ें');
        document.documentElement.lang = 'en';
    }
}
