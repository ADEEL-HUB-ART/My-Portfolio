import re

with open('portfolio/project-detail.html', 'r') as f:
    content = f.read()

script_start = content.find('<script>')
if script_start != -1:
    new_script = """<script>
        function resolveAssetUrl(assetUrl) {
            if (!assetUrl) return assetUrl;
            if (/^https?:\\/\\//i.test(assetUrl)) return assetUrl;
            assetUrl = assetUrl.replace(/^\\//, '');
            if (assetUrl.startsWith('media/')) {
                return `assets/${assetUrl}`;
            }
            return `assets/media/${assetUrl}`;
        }

        // Preloader
        window.addEventListener('load', () => {
            setTimeout(() => document.getElementById('preloader').classList.add('hidden'), 600);
        });
        
        // Custom Cursor
        const cursorDot = document.getElementById('cursorDot');
        const cursorRing = document.getElementById('cursorRing');
        let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX; mouseY = e.clientY;
            cursorDot.style.left = mouseX + 'px'; cursorDot.style.top = mouseY + 'px';
            cursorDot.style.transform = 'translate(-50%, -50%)';
        });
        function animateRing() {
            ringX += (mouseX - ringX) * 0.15; ringY += (mouseY - ringY) * 0.15;
            cursorRing.style.left = ringX + 'px'; cursorRing.style.top = ringY + 'px';
            cursorRing.style.transform = 'translate(-50%, -50%)';
            requestAnimationFrame(animateRing);
        }
        animateRing();
        document.querySelectorAll('a, button').forEach(el => {
            el.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
            el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
        });
        
        // Theme Toggle
        const themeToggle = document.getElementById('themeToggle');
        const html = document.documentElement;
        const savedTheme = localStorage.getItem('theme') || 'dark';
        html.setAttribute('data-theme', savedTheme);
        themeToggle.innerHTML = savedTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        themeToggle.addEventListener('click', () => {
            const newTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', newTheme);
            themeToggle.innerHTML = newTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            localStorage.setItem('theme', newTheme);
        });
        
        // Hamburger
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.getElementById('navLinks');
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        // Scroll to top
        const scrollTopBtn = document.getElementById('scrollTop');
        window.addEventListener('scroll', () => {
            scrollTopBtn.classList.toggle('visible', window.pageYOffset > 300);
            document.getElementById('navbar').classList.toggle('scrolled', window.pageYOffset > 50);
        });
        scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
        
        // Load project
        const urlParams = new URLSearchParams(window.location.search);
        const projectSlug = urlParams.get('slug');
        
        async function loadProjectDetail() {
            try {
                const response = await fetch('assets/data/projects.json');
                const projects = await response.json();
                const project = projects.find(p => p.slug === projectSlug);
                
                if (!project) throw new Error("Project not found");
                
                document.getElementById('breadcrumbTitle').textContent = project.title;
                displayProject(project);
            } catch (error) {
                document.getElementById('projectContent').innerHTML = `
                    <div style="text-align: center; padding: 4rem 0;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: var(--accent); margin-bottom: 1rem;"></i>
                        <h3>Error Loading Project</h3>
                        <p style="color: var(--text-secondary); margin: 1rem 0 2rem;">The project could not be loaded. Please try again.</p>
                        <a href="index.html#projects" class="btn btn-primary"><i class="fas fa-arrow-left"></i> Back to Projects</a>
                    </div>
                `;
            }
        }
        
        function displayProject(project) {
            const imageUrl = resolveAssetUrl(project.thumbnail);

            let videoHTML = '';
            if (project.video) {
                const videoUrl = resolveAssetUrl(project.video);
                videoHTML = `
                    <div class="project-video">
                        <video controls>
                            <source src="${videoUrl}" type="video/mp4">
                        </video>
                    </div>
                `;
            }
            
            let galleryHTML = '';
            if (project.images && project.images.length > 0) {
                galleryHTML = `
                    <div class="project-gallery">
                        ${project.images.map(img => {
                            const imgUrl = resolveAssetUrl(img.image);
                            return `<div class="gallery-item"><img src="${imgUrl}" alt="${img.caption || project.title}"></div>`;
                        }).join('')}
                    </div>
                `;
            }
            
            document.getElementById('projectContent').innerHTML = `
                <div class="project-header">
                    <h1>${project.title}</h1>
                    <p class="section-subtitle">${project.short_description}</p>
                    <div class="project-links">
                        ${project.github_link ? `<a href="${project.github_link}" target="_blank" class="btn btn-primary"><i class="fab fa-github"></i> View Code</a>` : ''}
                        ${project.live_link ? `<a href="${project.live_link}" target="_blank" class="btn btn-secondary"><i class="fas fa-external-link-alt"></i> Live Demo</a>` : ''}
                    </div>
                </div>
                <img src="${imageUrl}" alt="${project.title}" class="project-hero-img">
                ${videoHTML}
                <div class="project-content">
                    <div class="project-description">
                        <h2>About This Project</h2>
                        <p>${project.full_description.replace(/\\n/g, '<br>')}</p>
                        ${project.requirements ? `<h2 style="margin-top: 2rem;">Requirements & Features</h2><p>${project.requirements.replace(/\\n/g, '<br>')}</p>` : ''}
                    </div>
                    <div class="project-sidebar">
                        <div class="sidebar-card">
                            <h3><i class="fas fa-code"></i> Technologies</h3>
                            <div class="tech-list">${(project.technologies_list || []).map(tech => `<span>${tech}</span>`).join('')}</div>
                        </div>
                        <div class="sidebar-card">
                            <h3><i class="fas fa-info-circle"></i> Project Info</h3>
                            <p style="margin-bottom: 0.5rem;"><strong>Category:</strong> ${project.category}</p>
                            <p><strong>Date:</strong> ${new Date(project.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
                ${galleryHTML}
            `;
        }
        
        loadProjectDetail();
    </script>"""
    
    content = content[:script_start] + new_script + "\n</body>\n</html>"

with open('portfolio/project-detail.html', 'w') as f:
    f.write(content)
