# Project Overview

This project is a backend application built with NestJS, providing a comprehensive set of features for user authentication, coupon management, brand management, location management, and more.

## Features

- **User Authentication**: Register, login, logout, password reset, email verification, and profile management.
- **Coupon Management**: Create, update, delete, and retrieve coupons.
- **Brand Management**: Create, update, delete, and retrieve brands.
- **Location Management**: Create, update, delete, and retrieve locations.
- **Category Management**: Create, update, delete, and retrieve categories.
- **Notification Management**: Create, update, delete, and retrieve notifications.
- **Ad Management**: Create, update, delete, and retrieve ads.

## Technology Stack

- **Framework**: [NestJS](https://nestjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [TypeORM](https://typeorm.io/) with support for various databases (e.g., PostgreSQL, MySQL)
- **Authentication**: [Passport](http://www.passportjs.org/) with JWT strategy
- **Validation**: [class-validator](https://github.com/typestack/class-validator)
- **Environment Configuration**: [dotenv](https://github.com/motdotla/dotenv)
- **Testing**: [Jest](https://jestjs.io/)

## Project Structure
```
src/
├── ads/
│ ├── dto/
│ │ ├── create-ad.dto.ts
│ │ └── update-ad.dto.ts
│ ├── entities/
│ │ └── ad.entity.ts
│ ├── ads.controller.ts
│ └── ads.service.ts
├── authentication/
│ ├── dto/
│ │ ├── changeEmail.dto.ts
│ │ ├── changePassword.dto.ts
│ │ ├── deleteAccount.dto.ts
│ │ ├── forgotPassword.dto.ts
│ │ ├── login.dto.ts
│ │ ├── logout.dto.ts
│ │ ├── profile.dto.ts
│ │ ├── register.dto.ts
│ │ ├── resendVerificationEmail.dto.ts
│ │ ├── resetPassword.dto.ts
│ │ └── verifyEmail.dto.ts
│ ├── strategy/
│ │ ├── jwt.strategy.ts
│ │ └── local.strategy.ts
│ ├── authentication.controller.ts
│ ├── authentication.module.ts
│ └── authentication.service.ts
├── brands/
│ ├── dto/
│ │ ├── create-brand.dto.ts
│ │ └── update-brand.dto.ts
│ ├── entities/
│ │ └── brand.entity.ts
│ ├── brands.controller.ts
│ └── brands.service.ts
├── categories/
│ ├── dto/
│ │ ├── create-category.dto.ts
│ │ └── update-category.dto.ts
│ ├── entities/
│ │ └── category.entity.ts
│ ├── categories.controller.ts
│ └── categories.service.ts
├── common/
│ ├── decorators/
│ │ └── roles.decorator.ts
│ ├── enums/
│ │ ├── UserGender.ts
│ │ ├── UserProvider.ts
│ │ ├── UserRole.ts
│ │ └── UserStatus.ts
│ ├── guards/
│ │ ├── jwt-auth.guard.ts
│ │ ├── local-auth.guard.ts
│ │ └── roles.guard.ts
│ └── interceptors/
│ ├── auth.interceptor.ts
│ └── locale.interceptor.ts
├── coupons/
│ ├── dto/
│ │ ├── create-coupon.dto.ts
│ │ └── update-coupon.dto.ts
│ ├── entities/
│ │ └── coupon.entity.ts
│ ├── coupons.controller.ts
│ └── coupons.service.ts
├── database/
│ ├── migrations/
│ │ └── 20240909120612-create-users-table.ts
│ ├── seeder.ts
│ └── database.module.ts
├── locations/
│ ├── dto/
│ │ ├── create-location.dto.ts
│ │ └── update-location.dto.ts
│ ├── entities/
│ │ └── location.entity.ts
│ ├── locations.controller.ts
│ └── locations.service.ts
├── notifications/
│ ├── dto/
│ │ ├── create-notification.dto.ts
│ │ └── update-notification.dto.ts
│ ├── entities/
│ │ └── notification.entity.ts
│ ├── notifications.controller.ts
│ └── notifications.service.ts
├── users/
│ ├── dto/
│ │ ├── create-user.dto.ts
│ │ └── update-user.dto.ts
│ ├── entities/
│ │ └── user.entity.ts
│ ├── users.controller.ts
│ └── users.service.ts
├── app.module.ts
├── main.ts
└── constants.ts
```

## Endpoints

### Authentication
- **POST /auth/login**: User login
- **POST /auth/register**: User registration
- **POST /auth/logout**: User logout
- **GET /auth/profile**: Get user profile
- **POST /auth/forgot-password**: Forgot password
- **POST /auth/reset-password**: Reset password
- **POST /auth/change-password**: Change password
- **POST /auth/verify-email**: Verify email
- **POST /auth/resend-verification-email**: Resend verification email
- **POST /auth/change-email**: Change email
- **POST /auth/delete-account**: Delete account

### Users
- **POST /users**: Create a new user
- **GET /users**: Retrieve all users
- **GET /users/:id**: Retrieve a user by ID
- **PATCH /users/:id**: Update a user by ID
- **DELETE /users/:id**: Delete a user by ID

### Coupons
- **POST /coupons**: Create a new coupon
- **GET /coupons**: Retrieve all coupons
- **GET /coupons/:id**: Retrieve a coupon by ID
- **PATCH /coupons/:id**: Update a coupon by ID
- **DELETE /coupons/:id**: Delete a coupon by ID

### Brands
- **POST /brands**: Create a new brand
- **GET /brands**: Retrieve all brands
- **GET /brands/:id**: Retrieve a brand by ID
- **PATCH /brands/:id**: Update a brand by ID
- **DELETE /brands/:id**: Delete a brand by ID

### Locations
- **POST /locations**: Create a new location
- **GET /locations**: Retrieve all locations
- **GET /locations/:id**: Retrieve a location by ID
- **PATCH /locations/:id**: Update a location by ID
- **DELETE /locations/:id**: Delete a location by ID

### Categories
- **POST /categories**: Create a new category
- **GET /categories**: Retrieve all categories
- **GET /categories/:id**: Retrieve a category by ID
- **PATCH /categories/:id**: Update a category by ID
- **DELETE /categories/:id**: Delete a category by ID

### Notifications
- **POST /notifications**: Create a new notification
- **GET /notifications**: Retrieve all notifications
- **GET /notifications/:id**: Retrieve a notification by ID
- **PATCH /notifications/:id**: Update a notification by ID
- **DELETE /notifications/:id**: Delete a notification by ID

### Ads
- **POST /ads**: Create a new ad
- **GET /ads**: Retrieve all ads
- **GET /ads/:id**: Retrieve an ad by ID
- **PATCH /ads/:id**: Update an ad by ID
- **DELETE /ads/:id**: Delete an ad by ID

## Entities

### User
- **id**: UUID
- **fullName**: string
- **email**: string
- **password**: string
- **changePasswordTime**: Date
- **phoneNumber**: string
- **role**: UserRole
- **confirmAccount**: boolean
- **status**: UserStatus
- **image**: string
- **birthday**: Date
- **joined**: Date
- **gender**: UserGender
- **provider**: UserProvider
- **verificationCode**: string
- **verificationCodeExpiresAt**: Date
- **createdAt**: Date
- **updatedAt**: Date
- **deletedAt**: Date
- **lastLogin**: Date
- **lastLogout**: Date

### Coupon
- **id**: UUID
- **code**: string
- **amount**: number
- **description**: { en: string; ar: string }
- **status**: { en: string; ar: string }
- **expire**: Date
- **qrCode**: string
- **link**: string
- **usedCount**: number
- **likeCount**: number
- **dislikeCount**: number
- **createdAt**: Date
- **updatedAt**: Date

### Brand
- **id**: UUID
- **name**: string
- **description**: string
- **image**: string
- **createdAt**: Date
- **updatedAt**: Date

### Location
- **id**: UUID
- **name**: string
- **locationCode**: string
- **image**: string
- **createdAt**: Date
- **updatedAt**: Date

### Category
- **id**: UUID
- **name**: { en: string; ar: string }
- **slug**: { en: string; ar: string }
- **description**: { en: string; ar: string }
- **image**: string
- **icon**: string
- **color**: string
- **createdAt**: Date
- **updatedAt**: Date

### Notification
- **id**: UUID
- **header**: { en: string; ar: string }
- **body**: { en: string; ar: string }
- **isWatched**: boolean
- **createdAt**: Date
- **updatedAt**: Date

### Ad
- **id**: UUID
- **name**: string
- **link**: string
- **image**: string
- **createdAt**: Date
- **updatedAt**: Date


## Running the Application

### Development

To run the application in development mode:

1. **Install dependencies**:
    ```bash
    npm install
    ```

2. **Set up environment variables**:
    Create a `.env` file in the root directory and add the necessary environment variables. For example:
    ```env
    DATABASE_HOST=localhost
    DATABASE_PORT=5432
    DATABASE_USER=your_db_user
    DATABASE_PASSWORD=your_db_password
    DATABASE_NAME=your_db_name
    JWT_SECRET=your_jwt_secret
    ```

3. **Run the application**:
    ```bash
    npm run start:dev
    ```

### Production

To run the application in production mode:

1. **Install dependencies**:
    ```bash
    npm install
    ```

2. **Set up environment variables**:
    Create a `.env` file in the root directory and add the necessary environment variables.

3. **Build the application**:
    ```bash
    npm run build
    ```

4. **Run the application**:
    ```bash
    npm run start:prod
    ```

### Testing

To run tests:

1. **Install dependencies**:
    ```bash
    npm install
    ```

2. **Run the tests**:
    ```bash
    npm run test
    ```

3. **Run tests in watch mode**:
    ```bash
    npm run test:watch
    ```

4. **Run end-to-end tests**:
    ```bash
    npm run test:e2e
    ```

5. **Run tests with coverage**:
    ```bash
    npm run test:cov
    ```
