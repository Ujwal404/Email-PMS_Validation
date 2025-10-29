## Backend Generation
1. Create an Express server with TypeScript that includes email validation endpoint with rate limiting using redis and MySQL connection using mysql2
2. Create MySQL database schema with users table including email and pmsId fields with proper constraints
3. Generate comprehensive tests for the validation endpoint including edge cases and MySQL integration

## Frontend Generation (Angular)
1. Create an Angular service for email validation with RxJS debounceTime operator set to 500ms and switchMap for cancellation
2. Build an Angular component for two-step signup form with reactive forms, email validation and PMS ID requirement
3. Generate Jasmine/Karma tests for the email validation service and components
4. Add Playwright E2E tests for the complete signup flow

## MySQL Specific
1. Create MySQL migration scripts for users table with email uniqueness constraint and PMS ID not null
2. Generate stored procedures for email validation checks with case-insensitive comparison
3. Create indexes for optimizing email lookup performance

## DevOps Generation
1. Create a multi-stage Dockerfile for the Node.js backend with security scanning
2. Generate GitHub Actions workflow with testing, security scanning, and deployment
3. Create docker-compose.yml with MySQL 8.0, Redis, Angular app, and Node backend
