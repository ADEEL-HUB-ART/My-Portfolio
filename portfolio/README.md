# Professional Portfolio Website

A modern, responsive portfolio website with dark mode, smooth animations, and interactive features.

## Features

- **Responsive Design** - Works perfectly on all devices
- **Dark/Light Mode** - Toggle between themes with persistent storage
- **Smooth Animations** - Fade-in effects and smooth transitions
- **Project Filtering** - Filter projects by category (Web, Mobile, Design)
- **Animated Skill Bars** - Progress bars animate on scroll
- **Contact Form** - Functional contact form with validation
- **Modern UI** - Clean, professional design with gradient accents
- **Smooth Scrolling** - Navigation with smooth scroll behavior

## Technologies Used

- HTML5
- CSS3 (Custom Properties, Grid, Flexbox, Animations)
- Vanilla JavaScript (ES6+)
- Font Awesome Icons

## Customization

### 1. Update Personal Information

Edit `index.html`:
- Replace "Your Name" with your actual name
- Update the subtitle with your title/role
- Change contact information (email, phone, location)
- Update social media links

### 2. Add Your Projects

In the projects section, replace placeholder images and information:
```html
<div class="project-card" data-category="web">
    <div class="project-image">
        <img src="your-image.jpg" alt="Project Name">
        ...
    </div>
    <div class="project-info">
        <h3>Your Project Name</h3>
        <p>Your project description</p>
        <div class="project-tags">
            <span>Tech1</span>
            <span>Tech2</span>
        </div>
    </div>
</div>
```

### 3. Update Skills

Modify skill percentages in `index.html`:
```html
<div class="skill-progress" data-progress="90"></div>
```

### 4. Customize Colors

Edit CSS variables in `style.css`:
```css
:root {
    --primary: #6366f1;    /* Main color */
    --secondary: #8b5cf6;  /* Secondary color */
    --accent: #ec4899;     /* Accent color */
}
```

### 5. Add Your CV

Replace the Download CV link with your actual CV file:
```html
<a href="path/to/your-cv.pdf" class="btn btn-outline" download>Download CV</a>
```

## Usage

1. Open `index.html` in your browser
2. Or deploy to any hosting service:
   - GitHub Pages
   - Netlify
   - Vercel
   - AWS S3

## File Structure

```
portfolio/
├── index.html      # Main HTML file
├── style.css       # Styles and animations
├── script.js       # Interactive functionality
└── README.md       # Documentation
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Free to use for personal and commercial projects.

## Credits

- Icons: Font Awesome
- Placeholder Images: via.placeholder.com
