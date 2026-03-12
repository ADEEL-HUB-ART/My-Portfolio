// API Configuration
const API_BASE_URL = 'http://localhost:8003/api';

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Profile Image Upload
const imageUpload = document.getElementById('imageUpload');
const profileImg = document.getElementById('profileImg');

imageUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            profileImg.src = event.target.result;
            localStorage.setItem('profileImage', event.target.result);
        };
        reader.readAsDataURL(file);
    }
});

// Load saved profile image
const savedImage = localStorage.getItem('profileImage');
if (savedImage) {
    profileImg.src = savedImage;
}

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    themeToggle.innerHTML = newTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    localStorage.setItem('theme', newTheme);
});

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);
themeToggle.innerHTML = savedTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Project Filtering
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');
        
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        projectCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    });
});

// Animate skill bars on scroll
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBars = entry.target.querySelectorAll('.skill-progress');
            progressBars.forEach(bar => {
                const progress = bar.getAttribute('data-progress');
                bar.style.width = progress + '%';
            });
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

const skillsSection = document.querySelector('.skills');
if (skillsSection) {
    observer.observe(skillsSection);
}

// Animate skills on page load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const progressBars = document.querySelectorAll('.skill-progress');
        progressBars.forEach(bar => {
            const progress = bar.getAttribute('data-progress');
            if (progress) {
                bar.style.width = progress + '%';
            }
        });
    }, 100);
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 2px 10px var(--shadow)';
    } else {
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// Contact Form
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
    
    try {
        const response = await fetch(`${API_BASE_URL}/contact/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'success-message';
            messageDiv.textContent = result.message || 'Thank you for your message! I will get back to you soon.';
            messageDiv.style.cssText = 'background: #4CAF50; color: white; padding: 15px; border-radius: 8px; margin-top: 15px; text-align: center; animation: slideIn 0.3s ease-in;';
            contactForm.appendChild(messageDiv);
            contactForm.reset();
            setTimeout(() => messageDiv.remove(), 5000);
        } else {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = 'Error sending message. Please try again.';
            errorDiv.style.cssText = 'background: #f44336; color: white; padding: 15px; border-radius: 8px; margin-top: 15px; text-align: center;';
            contactForm.appendChild(errorDiv);
            setTimeout(() => errorDiv.remove(), 5000);
        }
    } catch (error) {
        console.error('Error:', error);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = 'Error sending message. Please try again.';
        errorDiv.style.cssText = 'background: #f44336; color: white; padding: 15px; border-radius: 8px; margin-top: 15px; text-align: center;';
        contactForm.appendChild(errorDiv);
        setTimeout(() => errorDiv.remove(), 5000);
    }
});

// Fetch and Display Projects
async function loadProjects(category = 'all') {
    try {
        const url = category === 'all' 
            ? `${API_BASE_URL}/projects/`
            : `${API_BASE_URL}/projects/?category=${category}`;
        
        const response = await fetch(url);
        const projects = await response.json();
        
        const projectsGrid = document.querySelector('.projects-grid');
        projectsGrid.innerHTML = '';
        
        projects.forEach(project => {
            const projectCard = createProjectCard(project);
            projectsGrid.appendChild(projectCard);
        });
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.setAttribute('data-category', project.category);
    
    const imageUrl = project.thumbnail.startsWith('http') 
        ? project.thumbnail 
        : `http://localhost:8003${project.thumbnail}`;
    
    card.innerHTML = `
        <div class="project-image">
            <img src="${imageUrl}" alt="${project.title}">
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

// Update filter buttons to load projects
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');
        
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        loadProjects(filter);
    });
});

// Load projects on page load
loadProjects();

// Download CV Function
async function downloadCV() {
    try {
        const response = await fetch(`${API_BASE_URL}/cv/`);
        const data = await response.json();
        
        if (data.file) {
            const cvUrl = data.file.startsWith('http') 
                ? data.file 
                : `http://localhost:8003${data.file}`;
            window.open(cvUrl, '_blank');
        }
    } catch (error) {
        alert('CV not available at the moment. Please contact me directly.');
    }
}

// Add click handler to CV button
document.querySelector('.btn-outline').addEventListener('click', (e) => {
    e.preventDefault();
    downloadCV();
});

// Add animation on scroll for cards
const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.project-card, .stat-card, .skill-category').forEach(card => {
    cardObserver.observe(card);
});
