/* ========================================
   PREMIUM PORTFOLIO — JavaScript
   ======================================== */

// API Configuration
const configuredApiBase = window.PORTFOLIO_API_BASE_URL
    || document.querySelector('meta[name="api-base-url"]')?.content
    || '';
const defaultApiCandidates = [
    window.location.origin && window.location.protocol !== 'file:' ? `${window.location.origin.replace(/\/$/, '')}/api` : null,
    configuredApiBase || null,
    'http://localhost:8002/api',
    'http://127.0.0.1:8002/api',
    'http://localhost:8000/api',
    'http://127.0.0.1:8000/api',
].filter(Boolean);
let API_BASE_URL = configuredApiBase || '';
const GITHUB_USERNAME = 'ADEEL-HUB-ART';
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 7000) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
        return await fetch(url, { ...options, signal: controller.signal });
    } finally {
        clearTimeout(timeout);
    }
}

async function fetchWithRetry(url, options = {}, retries = 2, timeoutMs = 7000) {
    let lastError = null;
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const response = await fetchWithTimeout(url, options, timeoutMs);
            if (response.ok) return response;
            lastError = new Error(`Request failed with status ${response.status}`);
        } catch (error) {
            lastError = error;
        }
    }
    throw lastError || new Error('Request failed');
}

async function resolveApiBaseUrl() {
    for (const candidate of [...new Set(defaultApiCandidates)]) {
        const normalized = candidate.replace(/\/$/, '');
        try {
            const response = await fetchWithTimeout(`${normalized}/projects/?page=1`, { headers: { Accept: 'application/json' } }, 1800);
            const contentType = response.headers.get('content-type') || '';
            if (response.ok && contentType.includes('application/json')) {
                API_BASE_URL = normalized;
                return API_BASE_URL;
            }
        } catch (error) {
            // Try next candidate
        }
    }

    API_BASE_URL = (configuredApiBase || defaultApiCandidates[0] || 'http://localhost:8002/api').replace(/\/$/, '');
    return API_BASE_URL;
}

function resolveAssetUrl(assetUrl) {
    if (!assetUrl) return assetUrl;
    if (/^https?:\/\//i.test(assetUrl)) return assetUrl;

    const base = API_BASE_URL || configuredApiBase || defaultApiCandidates[0] || 'http://localhost:8002/api';
    const normalizedBase = base.replace(/\/$/, '');
    const assetBase = normalizedBase.endsWith('/api') ? normalizedBase.replace(/\/api$/, '') : normalizedBase;
    return new URL(assetUrl, `${assetBase}/`).href;
}

// ========================================
// 1. PRELOADER
// ========================================
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.classList.add('hidden');
    }, 800);
});

// ========================================
// 2. CUSTOM CURSOR
// ========================================
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
});

function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
    cursorRing.style.transform = 'translate(-50%, -50%)';
    cursorDot.style.transform = 'translate(-50%, -50%)';
    requestAnimationFrame(animateRing);
}
animateRing();

// Cursor hover effects
document.querySelectorAll('a, button, .project-card, .service-card, .filter-btn').forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
});

// ========================================
// 3. THEME TOGGLE
// ========================================
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
themeToggle.innerHTML = savedTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    themeToggle.innerHTML = newTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    localStorage.setItem('theme', newTheme);
});

// ========================================
// 4. HAMBURGER MENU
// ========================================
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close menu on link click
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// ========================================
// 5. SMOOTH SCROLL & ACTIVE NAV
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav-links a');

function updateActiveNav() {
    const scrollPos = window.scrollY + 200;
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        if (scrollPos >= top && scrollPos < top + height) {
            navLinksAll.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + id) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// ========================================
// 6. NAVBAR SCROLL BEHAVIOR
// ========================================
const navbar = document.getElementById('navbar');
let lastScroll = 0;

function handleNavbarScroll() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    if (currentScroll > lastScroll && currentScroll > 300) {
        navbar.classList.add('hidden-nav');
    } else {
        navbar.classList.remove('hidden-nav');
    }
    
    lastScroll = currentScroll;
}

// ========================================
// 7. SCROLL TO TOP
// ========================================
const scrollTopBtn = document.getElementById('scrollTop');
const scrollProgress = document.getElementById('scrollProgress');
const scrollRingFill = document.getElementById('scrollRingFill');
const RING_CIRCUMFERENCE = 126;

function handleScrollTop() {
    if (window.pageYOffset > 500) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
}

function handleScrollProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) : 0;
    if (scrollProgress) scrollProgress.style.width = `${progress * 100}%`;
    if (scrollRingFill) scrollRingFill.style.strokeDashoffset = `${RING_CIRCUMFERENCE * (1 - progress)}`;
}

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Combined scroll handler
window.addEventListener('scroll', () => {
    handleNavbarScroll();
    handleScrollTop();
    handleScrollProgress();
    updateActiveNav();
    updateParallax();
});

// ========================================
// 8. TYPING EFFECT
// ========================================
const typingTexts = [
    'Scalable REST APIs',
    'Django Applications',
    'Microservices Architecture',
    'FastAPI Solutions',
    'Database Systems',
    'Docker Containers'
];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingElement = document.getElementById('typingText');

function typeEffect() {
    const currentText = typingTexts[textIndex];
    
    if (isDeleting) {
        typingElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
    }
    
    let typeSpeed = isDeleting ? 40 : 80;
    
    if (!isDeleting && charIndex === currentText.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % typingTexts.length;
        typeSpeed = 500;
    }
    
    setTimeout(typeEffect, typeSpeed);
}
typeEffect();

// ========================================
// 9. PARTICLE CANVAS
// ========================================
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let canvasMouseX = 0, canvasMouseY = 0;

function resizeCanvas() {
    const hero = document.querySelector('.hero');
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Mouse interaction
        const dx = canvasMouseX - this.x;
        const dy = canvasMouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 120) {
            this.x -= dx * 0.01;
            this.y -= dy * 0.01;
        }
        
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(var(--primary-rgb), ${this.opacity})`;
        
        const isDark = html.getAttribute('data-theme') === 'dark';
        ctx.fillStyle = isDark 
            ? `rgba(99, 102, 241, ${this.opacity})` 
            : `rgba(99, 102, 241, ${this.opacity * 0.5})`;
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    const count = Math.min(80, Math.floor(canvas.width * canvas.height / 12000));
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}
initParticles();

function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 120) {
                const isDark = html.getAttribute('data-theme') === 'dark';
                const opacity = (1 - distance / 120) * (isDark ? 0.15 : 0.08);
                ctx.beginPath();
                ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    requestAnimationFrame(animateParticles);
}
animateParticles();

document.querySelector('.hero').addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    canvasMouseX = e.clientX - rect.left;
    canvasMouseY = e.clientY - rect.top;
});

// ========================================
// 10. SCROLL REVEAL ANIMATION
// ========================================
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ========================================
// 11. ANIMATED COUNTERS
// ========================================
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.counter');
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;
                
                function updateCounter() {
                    current += step;
                    if (current < target) {
                        counter.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                }
                updateCounter();
            });
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.about-stats-row').forEach(el => counterObserver.observe(el));

// ========================================
// 12. SKILL BARS ANIMATION
// ========================================
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const bars = entry.target.querySelectorAll('.skill-progress');
            bars.forEach((bar, index) => {
                setTimeout(() => {
                    bar.style.width = bar.getAttribute('data-progress') + '%';
                }, index * 100);
            });
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

const skillsSection = document.getElementById('skills');
if (skillsSection) skillObserver.observe(skillsSection);

// ========================================
// 12A. TEXT REVEAL ANIMATION
// ========================================
function initializeTextReveal() {
    if (prefersReducedMotion) {
        document.querySelectorAll('.text-reveal').forEach(el => el.classList.add('visible'));
        return;
    }

    document.querySelectorAll('.text-reveal').forEach(el => {
        if (el.dataset.revealReady === 'true') return;
        const text = el.textContent.trim();
        if (!text) return;
        const words = text.split(/\s+/);
        el.textContent = '';
        words.forEach((word, index) => {
            const wordSpan = document.createElement('span');
            wordSpan.textContent = word;
            wordSpan.style.transitionDelay = `${index * 70}ms`;
            el.appendChild(wordSpan);
            if (index < words.length - 1) {
                el.appendChild(document.createTextNode(' '));
            }
        });
        el.dataset.revealReady = 'true';
    });
}

// ========================================
// 13. TESTIMONIALS SLIDER
// ========================================
const track = document.getElementById('testimonialsTrack');
const dots = document.querySelectorAll('.testimonial-dot');
let currentSlide = 0;
const totalSlides = dots.length;

function goToSlide(index) {
    currentSlide = index;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach(dot => dot.classList.remove('active'));
    dots[currentSlide].classList.add('active');
}

dots.forEach(dot => {
    dot.addEventListener('click', () => {
        goToSlide(parseInt(dot.getAttribute('data-index')));
    });
});

// Auto-slide
setInterval(() => {
    goToSlide((currentSlide + 1) % totalSlides);
}, 5000);

// ========================================
// 14. PROJECT FILTERING
// ========================================
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');
        
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Try API first, fallback to client-side filtering
        loadProjects(filter);
    });
});

// ========================================
// 15. CONTACT FORM
// ========================================
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message')
    };
    
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch(`${API_BASE_URL}/contact/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showNotification('success', result.message || 'Message sent successfully! I\'ll get back to you soon.');
            contactForm.reset();
        } else {
            showNotification('error', 'Failed to send message. Please try again.');
        }
    } catch (error) {
        showNotification('error', 'Network error. Please try again later.');
    }
    
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
});

function showNotification(type, message) {
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();
    
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.style.cssText = `
        position: fixed;
        top: 100px; right: 2rem;
        padding: 1rem 1.5rem;
        border-radius: 14px;
        font-weight: 500;
        font-size: 0.95rem;
        z-index: 9999;
        animation: fadeInRight 0.4s ease;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        backdrop-filter: blur(20px);
        border: 1px solid ${type === 'success' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'};
        background: ${type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)'};
        color: ${type === 'success' ? '#10b981' : '#ef4444'};
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    `;
    toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${message}`;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'fadeInRight 0.4s ease reverse';
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

// ========================================
// 16. LOAD PROJECTS FROM API
// ========================================
async function loadProjects(category = 'all') {
    try {
        const url = category === 'all' 
            ? `${API_BASE_URL}/projects/`
            : `${API_BASE_URL}/projects/?category=${category}`;
        
        const response = await fetchWithRetry(url);
        const projects = await response.json();
        
        // Clear grid
        const projectsGrid = document.querySelector('.projects-grid');
        projectsGrid.innerHTML = '';
        
        if (!projects || projects.length === 0) {
            // Show "no projects" message
            projectsGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--text-secondary);">
                    <i class="fas fa-inbox" style="font-size: 2rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <p>No projects found in this category yet.</p>
                </div>
            `;
            return;
        }

        projects.forEach(project => {
            const projectCard = createProjectCard(project);
            projectsGrid.appendChild(projectCard);
        });
        
        // Re-observe for reveal animation
        projectsGrid.querySelectorAll('.project-card').forEach(card => {
            revealObserver.observe(card);
        });
        
        // Re-apply cursor hover effects to new cards
        projectsGrid.querySelectorAll('.project-card, a, button').forEach(el => {
            el.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
            el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
        });
        initializeTiltCards();
    } catch (error) {
        console.error('Failed to load projects:', error);
        // Show error message
        const projectsGrid = document.querySelector('.projects-grid');
        projectsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--accent);">
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                <p>Failed to load projects. Please try again.</p>
            </div>
        `;
    }
}

function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card reveal tilt-card';
    card.setAttribute('data-category', project.category);
    
    const imageUrl = resolveAssetUrl(project.thumbnail);

    card.innerHTML = `
        <div class="project-image">
            <span class="project-status completed">✓ Completed</span>
            <img src="${imageUrl}" alt="${project.title}" loading="lazy" decoding="async">
            <div class="project-overlay">
                <a href="project-detail.html?slug=${project.slug}" class="project-link">
                    <i class="fas fa-external-link-alt"></i>
                </a>
                ${project.github_link ? `<a href="${project.github_link}" target="_blank" class="project-link"><i class="fab fa-github"></i></a>` : ''}
            </div>
        </div>
        <div class="project-info">
            <h3>${project.title}</h3>
            <p>${project.short_description}</p>
            <div class="project-tags">
                ${project.technologies_list.map(tech => `<span>${tech}</span>`).join('')}
            </div>
        </div>
    `;
    
    return card;
}

// Filter buttons now handled in section 14 above (unified handler)

// ========================================
// 17. LOAD PROFILE FROM API
// ========================================
function applyImageWithPreload(imageEl, nextSrc) {
    if (!imageEl || !nextSrc) return;
    const loader = new Image();
    loader.onload = () => {
        imageEl.classList.add('image-loading');
        imageEl.src = nextSrc;
        requestAnimationFrame(() => imageEl.classList.remove('image-loading'));
    };
    loader.src = nextSrc;
}
async function loadProfile() {
    try {
        const response = await fetchWithRetry(`${API_BASE_URL}/profile/`);
        if (response.ok) {
            const profile = await response.json();
            
            const profileImg = document.getElementById('profileImg');
            const aboutImg = document.getElementById('aboutImg');
            if (profile.profile_image) {
                applyImageWithPreload(profileImg, resolveAssetUrl(profile.profile_image));
                applyImageWithPreload(aboutImg, resolveAssetUrl(profile.profile_image));
            }
            
            const nameElement = document.querySelector('.hero-name');
            if (nameElement && profile.name) {
                nameElement.innerHTML = `I'm <span class="gradient-text">${profile.name}</span>`;
            }
        }
    } catch (error) {
        // Using default profile data — graceful degradation
    }
}

// ========================================
// 18. DOWNLOAD CV
// ========================================
const downloadCvBtn = document.getElementById('downloadCvBtn');
if (downloadCvBtn) {
    downloadCvBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_BASE_URL}/cv/`);
            const data = await response.json();
            
            if (data.file) {
                const cvUrl = resolveAssetUrl(data.file);
                window.open(cvUrl, '_blank');
            }
        } catch (error) {
            showNotification('error', 'CV not available at the moment. Please contact me directly.');
        }
    });
}

// ========================================
// 19. INITIALIZE
// ========================================
function initializeTiltCards() {
    const cards = document.querySelectorAll('.tilt-card');
    if (prefersReducedMotion || !window.matchMedia('(pointer: fine)').matches) {
        cards.forEach(card => card.style.transform = '');
        return;
    }

    cards.forEach(card => {
        if (card.dataset.tiltReady === 'true') return;
        let rafId = null;
        const maxTilt = 10;

        const onMove = (event) => {
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                const rect = card.getBoundingClientRect();
                const px = (event.clientX - rect.left) / rect.width;
                const py = (event.clientY - rect.top) / rect.height;
                const rotateY = (px - 0.5) * (maxTilt * 2);
                const rotateX = (0.5 - py) * (maxTilt * 2);
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
            });
        };

        const reset = () => {
            if (rafId) cancelAnimationFrame(rafId);
            card.style.transform = '';
        };

        card.addEventListener('mousemove', onMove);
        card.addEventListener('mouseleave', reset);
        card.addEventListener('blur', reset, true);
        card.dataset.tiltReady = 'true';
    });
}

function initializeMagneticButtons() {
    const magneticElements = document.querySelectorAll('.magnetic-btn');
    if (prefersReducedMotion || !window.matchMedia('(pointer: fine)').matches) {
        magneticElements.forEach(el => el.style.transform = '');
        return;
    }

    magneticElements.forEach(el => {
        if (el.dataset.magneticReady === 'true') return;

        const onMove = (event) => {
            const rect = el.getBoundingClientRect();
            const x = event.clientX - rect.left - rect.width / 2;
            const y = event.clientY - rect.top - rect.height / 2;
            const moveX = clamp(x * 0.18, -10, 10);
            const moveY = clamp(y * 0.18, -8, 8);
            el.style.transform = `translate(${moveX}px, ${moveY}px)`;
        };

        const reset = () => {
            el.style.transform = '';
        };

        el.addEventListener('mousemove', onMove);
        el.addEventListener('mouseleave', reset);
        el.addEventListener('pointercancel', reset);
        el.dataset.magneticReady = 'true';
    });
}

const parallaxTargets = Array.from(document.querySelectorAll('.parallax-img'));
function updateParallax() {
    if (prefersReducedMotion || window.innerWidth < 769) {
        parallaxTargets.forEach(el => { el.style.transform = ''; });
        return;
    }
    const vh = window.innerHeight || 1;
    parallaxTargets.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        const centerOffset = (rect.top + rect.height / 2 - vh / 2) / vh;
        const movement = clamp(centerOffset * (index === 0 ? -16 : -12), -16, 16);
        el.style.transform = `translateY(${movement}px)`;
    });
}

function initializeTechOrbit() {
    const container = document.getElementById('techOrbitContainer');
    if (!container || container.dataset.orbitReady === 'true') return;

    const techItems = [
        { icon: 'fab fa-python', label: 'Python', ring: 1 },
        { icon: 'fas fa-code', label: 'Django', ring: 1 },
        { icon: 'fas fa-bolt', label: 'FastAPI', ring: 2 },
        { icon: 'fab fa-docker', label: 'Docker', ring: 2 },
        { icon: 'fas fa-database', label: 'PostgreSQL', ring: 2 },
        { icon: 'fas fa-leaf', label: 'MongoDB', ring: 3 },
        { icon: 'fas fa-memory', label: 'Redis', ring: 3 },
        { icon: 'fab fa-git-alt', label: 'Git', ring: 3 }
    ];

    const rings = { 1: 100, 2: 150, 3: 200 };
    const iconNodes = techItems.map(item => {
        const el = document.createElement('div');
        el.className = 'tech-icon';
        el.innerHTML = `<i class="${item.icon}"></i><span class="tech-tooltip">${item.label}</span>`;
        container.appendChild(el);
        return { ...item, el };
    });

    let rafId = null;
    const speed = prefersReducedMotion ? 0 : 0.00035;
    const animateOrbit = (time) => {
        iconNodes.forEach((node, index) => {
            const base = (Math.PI * 2 * index) / iconNodes.length;
            const angle = base + time * speed * (node.ring % 2 === 0 ? -1 : 1);
            const radius = rings[node.ring];
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            node.el.style.left = `calc(50% + ${x}px - 24px)`;
            node.el.style.top = `calc(50% + ${y}px - 24px)`;
        });
        rafId = requestAnimationFrame(animateOrbit);
    };

    const handleVisibility = () => {
        if (document.hidden) {
            if (rafId) cancelAnimationFrame(rafId);
            rafId = null;
        } else if (!rafId) {
            rafId = requestAnimationFrame(animateOrbit);
        }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    rafId = requestAnimationFrame(animateOrbit);
    container.dataset.orbitReady = 'true';
}

function setGitHubStats(repos, stars, followers, contributions) {
    const reposEl = document.getElementById('ghRepos');
    const starsEl = document.getElementById('ghStars');
    const followersEl = document.getElementById('ghFollowers');
    const contribsEl = document.getElementById('ghContribs');
    if (reposEl) reposEl.textContent = repos;
    if (starsEl) starsEl.textContent = stars;
    if (followersEl) followersEl.textContent = followers;
    if (contribsEl) contribsEl.textContent = contributions;
}

async function loadGitHubStats() {
    setGitHubStats('…', '…', '…', '…');
    try {
        const backendResponse = await fetchWithRetry(`${API_BASE_URL}/github-stats/`, {}, 1, 5000);
        const stats = await backendResponse.json();
        setGitHubStats(
            stats.public_repos ?? '—',
            stats.total_stars ?? '—',
            stats.followers ?? '—',
            stats.contributions ?? '—'
        );
        return;
    } catch (error) {
        // Fallback to GitHub public API below
    }

    try {
        const userResponse = await fetchWithRetry(`https://api.github.com/users/${GITHUB_USERNAME}`, {}, 1, 7000);
        const reposResponse = await fetchWithRetry(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`, {}, 1, 7000);
        const user = await userResponse.json();
        const repos = await reposResponse.json();
        const totalStars = Array.isArray(repos)
            ? repos.reduce((sum, repo) => sum + (Number(repo.stargazers_count) || 0), 0)
            : 0;
        setGitHubStats(user.public_repos ?? '—', totalStars, user.followers ?? '—', 'N/A');
    } catch (error) {
        setGitHubStats('—', '—', '—', '—');
    }
}

(async () => {
    await resolveApiBaseUrl();
    loadProjects();
    loadProfile();
    initializeTextReveal();
    initializeTiltCards();
    initializeMagneticButtons();
    initializeTechOrbit();
    loadGitHubStats();
    handleScrollProgress();
    updateParallax();
})();
