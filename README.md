# Raven Transfer (TypeScript)

A fintech money transfer application built with Node.js, Express, TypeScript, and Knex, integrated with Raven Atlas API for bank transfers and virtual account generation.

## Features

- **TypeScript**: Full TypeScript implementation with strict type checking
- User authentication (register/login)
- Virtual bank account generation
- Money transfers to other banks
- Webhook handling for deposit notifications
- Transaction history tracking
- Comprehensive API with proper error handling
- Rate limiting and security middleware
- Complete type safety and interfaces

## Tech Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MySQL with Knex.js ORM
- **Authentication**: JWT
- **External API**: Raven Atlas
- **Testing**: Jest, Supertest
- **Architecture**: Object-Oriented Programming (OOP) with TypeScript


## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Setup environment variables: `cp .env.example .env`
4. Configure your environment variables in `.env`
5. Build the application: `npm run build`
6. Run database migrations: `npm run migrate`
7. Start the application: `npm run dev`

## Scripts

- `npm run build` - Build TypeScript to JavaScript
- `npm run dev` - Start development server with hot reload
- `npm start` - Start production server
- `npm run migrate` - Run database migrations
- `npm run migrate:rollback` - Rollback database migrations

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (authenticated)

### Bank Accounts
- `GET /api/bank-accounts` - Get user's bank accounts (authenticated)

### Transactions
- `POST /api/transactions/transfer` - Initiate money transfer (authenticated)
- `GET /api/transactions/history` - Get transaction history (authenticated)
- `GET /api/transactions/deposits` - Get deposit history (authenticated)
- `GET /api/transactions/transfers` - Get transfer history (authenticated)
- `GET /api/transactions/:reference` - Get transaction by reference (authenticated)

### Webhooks
- `POST /api/webhook` - Handle Raven Atlas webhooks

### Utility
- `GET /api/health` - Health check endpoint


## Environment Variables

```
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=raven_pay
DB_USER=root
DB_PASSWORD=
JWT_SECRET=ravenpay
RAVEN_API_KEY=your_raven_api_key
RAVEN_SECRET_KEY=your_raven_secret_key
RAVEN_BASE_URL=https://integrations.getravenbank.com
WEBHOOK_URL=https://webhook-url.com/webhook
```

## Development

1. Register on https://atlas.getravenbank.com and get your API credentials
2. Set up webhook.site for testing webhook endpoints
3. Configure your `.env` file with the obtained credentials
4. Run `npm run build` to compile TypeScript
5. Run database migrations with `npm run migrate`
6. Start the development server with `npm run dev`
