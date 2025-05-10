# E-commerce Full Stack Application

A full-stack e-commerce system built with Laravel and React.js.

## Features

- RESTful API backend with Laravel
- React.js frontend with Material UI
- Product listing with search and filtering
- Shopping cart functionality
- Order management
- User authentication with Laravel Sanctum

## Tech Stack

- Backend: Laravel 10.x
- Frontend: React.js with Material UI
- Database: MySQL
- Authentication: Laravel Sanctum
- Build Tool: Vite

## Prerequisites

- PHP 8.1 or higher
- Composer
- Node.js 16.x or higher
- MySQL 8.0 or higher
- npm or yarn

## Setup Instructions

1. Clone the repository
```bash
git clone <repository-url>
cd <project-directory>
```

2. Install PHP dependencies
```bash
composer install
```

3. Install JavaScript dependencies
```bash
npm install
```

4. Copy environment file
```bash
cp .env.example .env
```

5. Generate application key
```bash
php artisan key:generate
```

6. Configure your database in .env file
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ecommerce
DB_USERNAME=root
DB_PASSWORD=
```

7. Run migrations
```bash
php artisan migrate
```

8. Start the development server
```bash
# Terminal 1 - Laravel server
php artisan serve

# Terminal 2 - Vite development server
npm run dev
```

## API Documentation

### Authentication Endpoints

- POST /api/login - User login
- POST /api/logout - User logout
- GET /api/user - Get authenticated user details

### Product Endpoints

- GET /api/products - List all products (with pagination and filtering)
  - Query Parameters:
    - search: Search by product name
    - min_price: Minimum price filter
    - max_price: Maximum price filter
    - category: Category filter
    - page: Page number for pagination

### Order Endpoints

- POST /api/orders - Create new order
- GET /api/orders/{id} - Get order details

## Frontend Routes

- /login - Login page
- /products - Product listing with cart
- /orders/{id} - Order details page

## Security

- All order endpoints are protected with Laravel Sanctum
- Input validation on both frontend and backend
- CSRF protection enabled
- XSS protection through proper escaping

## Development

- Frontend code is located in `resources/js`
- Backend code follows standard Laravel structure
- API routes are defined in `routes/api.php`
- React components are organized in `resources/js/components`

## License

This project is for educational purposes only. 