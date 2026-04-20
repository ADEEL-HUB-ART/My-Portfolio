#!/usr/bin/env bash
gunicorn portfolio_backend.wsgi:application
