# Use PHP 7.4-fpm-alpine as the base image
FROM php:8.2-fpm-alpine
# Set working directory
WORKDIR /var/www/html
# Install system dependencies
RUN apk update && apk add --no-cache \
    git \
    zip \
    unzip \
    postgresql-dev \
    libzip-dev \
    nodejs \
    npm
# Install PHP extensions
RUN docker-php-ext-install pdo pdo_pgsql zip
# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
# Copy application files
COPY . .
# Install PHP dependencies
RUN composer install --optimize-autoloader --no-dev
# Check if the "production" script exists in package.json, if not, run npm install only
RUN npm run production || npm install
# Expose port 8000
EXPOSE 8000
# Start the Laravel application
CMD php artisan serve --host=0.0.0.0 --port=8000

