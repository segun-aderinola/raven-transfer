# Raven Transfer

A fintech money transfer application built with Node.js, Express, TypeScript, and Knex, integrated with Raven Atlas API for bank transfers and virtual account generation.

## Features

- User authentication (register/login)
- Virtual bank account generation
- Money transfers to other banks
- Webhook handling for deposit notifications
- Transaction history tracking

## Tech Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MySQL with Knex.js ORM
- **Authentication**: JWT
- **External API**: Raven Atlas
- **Architecture**: Object-Oriented Programming (OOP) with TypeScript


## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Setup environment variables: `cp .env.example .env`
4. Configure your environment variables in `.env`
5. Build the application: `npm run build`
6. Run database migrations: `npm run db:migrate`
7. Start the application: `npm run start:dev`


## API Endpoints

API URL: https://documenter.getpostman.com/view/20769634/2sB34hG1EF

### Authentication
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/profile` - Get user profile (authenticated)

### Bank Accounts
- `GET /api/v1/bank-accounts` - Get user's bank accounts (authenticated)

### Transactions
- `POST /api/v1/transactions/transfer` - Initiate money transfer (authenticated)
- `GET /api/v1/transactions/history` - Get transaction history (authenticated)
- `GET /api/v1/transactions/deposits` - Get deposit history (authenticated)
- `GET /api/v1/transactions/transfers` - Get transfer history (authenticated)
- `GET /api/v1/transactions/:reference` - Get transaction by reference (authenticated)

### Webhooks
- `POST /api/v1/webhook` - Handle Raven Atlas webhooks

### Utility
- `GET /api/health` - Health check endpoint


## Environment Variables

```
NODE_ENV=development
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=raven_pay
DB_USER=root
DB_PASSWORD=
JWT_SECRET=ravenpay
RAVEN_API_KEY=your_raven_api_key
RAVEN_BASE_URL=https://integrations.getravenbank.com
```

