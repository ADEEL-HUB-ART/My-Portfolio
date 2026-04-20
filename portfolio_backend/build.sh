SECRET_KEY=replace-with-a-long-random-secret
DEBUG=False
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.onrender.comEMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your_email@gmail.com
EMAIL_HOST_PASSWORD=your_app_password
DEFAULT_FROM_EMAIL=your_email@gmail.com
CONTACT_RECIPIENTS=your_email@gmail.com#!/usr/bin/env bash
pip install -r requirements.txt
python manage.py collectstatic --noinput
python manage.py migrate

