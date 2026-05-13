# Portfolio Deployment & Setup Guide

## ✅ Current Status

Your portfolio is **fully functional** with the following verified components:

### Backend (Django)
- ✅ 3 projects loading from database
- ✅ Profile image and data served correctly
- ✅ CV file upload and retrieval working
- ✅ Contact form submission to database
- ✅ All API endpoints returning JSON (200)
- ✅ Media files (thumbnails, images) accessible

### Frontend (HTML/CSS/JS)
- ✅ Dynamic API base URL detection
- ✅ Auto-loads projects from backend
- ✅ Auto-loads profile data and image
- ✅ Hero layout: left-aligned text + right-aligned image
- ✅ Responsive design working
- ✅ All interactive features (dark mode, smooth scroll, animations)

### Tests
- ✅ Backend regression tests pass (4/4)
- ✅ Django system checks pass
- ✅ All 3 API endpoints verified with real data

---

## 🚀 Local Development (Right Now)

### Start the Backend
```bash
cd portfolio_backend
python3 manage.py runserver 0.0.0.0:8002
```

### Open the Frontend
```bash
cd portfolio
# Open index.html in a browser (or use a simple HTTP server)
python3 -m http.server 8000
# Then visit http://localhost:8000/portfolio/index.html
```

The frontend will **auto-detect** the backend at `http://localhost:8002/api`.

---

## 📦 What's Working

### 1. Backend API Endpoints
All tested and returning real data:
- `GET /api/projects/` → Returns 3 projects with thumbnails
- `GET /api/profile/` → Returns your name, title, and profile image
- `GET /api/cv/` → Returns your resume PDF
- `POST /api/contact/` → Saves contact messages to database
- `GET /api/projects/{slug}/` → Returns individual project details with gallery

### 2. Frontend Features
- Projects load from backend (not hardcoded)
- Profile image from uploaded file (not default SVG)
- CV download works
- Contact form submits to backend
- All layouts responsive
- Dark/light mode toggle
- Animations and smooth scrolling

### 3. Media Files
Your uploaded files are accessible:
- Profile image: `/media/profile/WhatsApp_Image_2026-02-15_at_4.37.16_PM_XuEKYID.jpeg`
- Project thumbnails: `/media/projects/thumbnails/[portfolio|netflix|socialhub]_thumbnail.png`
- Videos: `/media/projects/videos/*.webm`
- CV: `/media/cv/White_Simple_Student_CV_Resume.pdf`

---

## 🌍 Deployment to Production

### Option 1: Vercel + Heroku (Recommended)

#### Frontend (Vercel)
1. Push `portfolio/` folder to a GitHub repo
2. Connect to Vercel
3. Set build settings:
   - Framework: Static HTML/CSS/JS
   - No build command needed
4. In `portfolio/index.html`, add before the main script:
   ```html
   <meta name="api-base-url" content="https://your-backend-url.com/api">
   ```

#### Backend (Heroku)
1. Push `portfolio_backend/` to GitHub
2. Create a Heroku app:
   ```bash
   heroku create your-portfolio-api
   heroku git:remote -a your-portfolio-api
   ```
3. Set environment variables:
   ```bash
   heroku config:set SECRET_KEY="your-secure-random-key"
   heroku config:set DEBUG=False
   heroku config:set ALLOWED_HOSTS="your-portfolio-api.herokuapp.com"
   heroku config:set EMAIL_HOST_USER="your-email@gmail.com"
   heroku config:set EMAIL_HOST_PASSWORD="your-app-password"
   heroku config:set CORS_ALLOWED_ORIGINS="https://your-frontend-domain.com"
   ```
4. Deploy:
   ```bash
   git push heroku main
   ```

### Option 2: Railway (All-in-One)
1. Connect your GitHub repo to Railway
2. Add a service for backend (Django)
3. Add a service for frontend (Static)
4. Set environment variables same as above

### Option 3: Self-Hosted VPS
1. Install Python 3.12+, PostgreSQL
2. Clone repo and install dependencies:
   ```bash
   pip install -r portfolio_backend/requirements.txt
   ```
3. Run migrations:
   ```bash
   python manage.py migrate
   ```
4. Collect static files:
   ```bash
   python manage.py collectstatic --noinput
   ```
5. Run with gunicorn:
   ```bash
   gunicorn portfolio_backend.wsgi:application --bind 0.0.0.0:8000
   ```
6. Use Nginx as reverse proxy (optional but recommended)

---

## 🔐 Security Checklist

Before going live:
- [ ] Set `DEBUG=False` in environment
- [ ] Generate a new `SECRET_KEY` (don't use the default)
- [ ] Add your domain(s) to `ALLOWED_HOSTS`
- [ ] Set `CORS_ALLOWED_ORIGINS` to your frontend domain only
- [ ] Use HTTPS (Vercel/Heroku do this automatically)
- [ ] Store email credentials in environment variables (never in code)
- [ ] Consider adding rate limiting to contact form
- [ ] Use a CDN for media files (optional but recommended)

---

## 📋 Remaining Optional Enhancements

### GitHub Stats Endpoint (Currently Missing)
The frontend expects `/api/github-stats/` but it's not implemented. The frontend gracefully falls back to GitHub public API, so it's **not critical**. If you want to add it:

```python
# In projects/views.py
@api_view(['GET'])
def github_stats(request):
    return Response({
        'public_repos': 15,
        'total_stars': 120,
        'followers': 50,
        'contributions': 500,
    })

# In projects/urls.py
urlpatterns += [
    path('github-stats/', github_stats, name='github-stats'),
]
```

### Database Upgrade (Optional)
Currently using SQLite. For production, consider PostgreSQL:
```bash
pip install psycopg2-binary
# Update settings.py DATABASES to use PostgreSQL
```

### Performance Improvements (Optional)
- Image optimization (compress thumbnails)
- Lazy loading for project images
- CDN for media files
- Caching headers for static files

---

## 🐛 Troubleshooting

### "API not found" on frontend
**Solution**: Ensure backend is running on the correct port and CORS is configured.

### Media files (images/CV) not loading
**Solution**: Ensure `MEDIA_URL` and `MEDIA_ROOT` are set correctly in settings.py and backend is serving media.

### Contact form not sending emails
**Solution**: Set email environment variables. If not set, the form still saves to database but skips email.

### Profile image not updating
**Solution**: Clear browser cache and hard-refresh (Ctrl+Shift+R on Windows, Cmd+Shift+R on Mac).

---

## 📞 Support

If you have questions about specific parts:
1. **Frontend data not loading**: Check if backend API is returning JSON
2. **Layout issues**: Check CSS in `portfolio/style.css` (hero-split section)
3. **Deployment errors**: Check environment variables and Django logs

You're ready to share this on social media! 🎉

