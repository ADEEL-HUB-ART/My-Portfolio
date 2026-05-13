import re

with open('portfolio/script.js', 'r') as f:
    content = f.read()

# 1. API Config & resolveAssetUrl
content = re.sub(
    r'// API Configuration.*?function resolveAssetUrl\(assetUrl\) \{.*?\n\}',
    '''// API Configuration
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function resolveAssetUrl(assetUrl) {
    if (!assetUrl) return assetUrl;
    if (/^https?:\\/\\//i.test(assetUrl)) return assetUrl;
    assetUrl = assetUrl.replace(/^\\//, '');
    if (assetUrl.startsWith('media/')) {
        return `assets/${assetUrl}`;
    }
    return `assets/media/${assetUrl}`;
}''',
    content,
    flags=re.DOTALL
)

# 2. Contact form
content = re.sub(
    r'contactForm\.addEventListener\(\'submit\', async \(e\) => \{.*?submitBtn\.disabled = false;\n\}\);',
    '''contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    formData.append("access_key", "YOUR_WEB3FORMS_ACCESS_KEY_HERE");
    
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showNotification('success', 'Message sent successfully! I\\'ll get back to you soon.');
            contactForm.reset();
        } else {
            showNotification('error', result.message || 'Failed to send message. Please try again.');
        }
    } catch (error) {
        showNotification('error', 'Network error. Please try again later.');
    }
    
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
});''',
    content,
    flags=re.DOTALL
)

# 3. loadProjects
content = re.sub(
    r'async function loadProjects\(category = \'all\'\) \{.*?const url =.*?;.*?const response = await fetchWithRetry\(url\);.*?const projects = await response\.json\(\);',
    '''async function loadProjects(category = 'all') {
    try {
        const response = await fetch('assets/data/projects.json');
        let projects = await response.json();
        if (category !== 'all') {
            projects = projects.filter(p => p.category === category);
        }''',
    content,
    flags=re.DOTALL
)

# 4. loadProfile
content = re.sub(
    r'async function loadProfile\(\) \{.*?const response = await fetchWithRetry\(`\$\{API_BASE_URL\}/profile/`\);',
    '''async function loadProfile() {
    try {
        const response = await fetch('assets/data/profile.json');''',
    content,
    flags=re.DOTALL
)

# 5. Download CV
content = re.sub(
    r'const downloadCvBtn = document\.getElementById\(\'downloadCvBtn\'\);.*?if \(downloadCvBtn\) \{.*?downloadCvBtn\.addEventListener.*?try \{.*?const response = await fetch\(`\$\{API_BASE_URL\}/cv/`\);.*?const data = await response\.json\(\);.*?if \(data\.file\) \{.*?const cvUrl = resolveAssetUrl\(data\.file\);.*?window\.open\(cvUrl, \'_blank\'\);.*?\} catch \(error\) \{.*?showNotification.*?\}',
    '''const downloadCvBtn = document.getElementById('downloadCvBtn');
if (downloadCvBtn) {
    downloadCvBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.open('assets/media/cv/White_Simple_Student_CV_Resume.pdf', '_blank');''',
    content,
    flags=re.DOTALL
)

# Optional: remove fetchWithRetry and fetchWithTimeout if they are not used elsewhere.
# Actually, they might be used by github-stats if that is still there. Wait, `fetchWithRetry` is used.
with open('portfolio/script.js', 'w') as f:
    f.write(content)
