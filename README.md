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

## System Architecture Flow
graph TB
    subgraph "Client Layer"
        A[Mobile/Web Client]
        B[Postman/API Testing]
    end
    
    subgraph "API Gateway Layer"
        C[Express.js Server]
        D[Rate Limiting]
        E[Authentication Middleware]
        F[Validation Middleware]
    end
    
    subgraph "Business Logic Layer"
        G[Auth Controller]
        H[Transaction Controller]
        I[Bank Account Controller]
        J[Webhook Controller]
        
        K[Auth Service]
        L[Transaction Service]
        M[Bank Account Service]
        N[Webhook Service]
        O[Raven Service]
    end
    
    subgraph "Data Layer"
        P[User Model]
        Q[Transaction Model]
        R[Bank Account Model]
        S[Webhook Model]
        T[MySQL Database]
    end
    
    subgraph "External Services"
        U[Raven Atlas API]
        V[Webhook.site]
        W[External Banks]
    end
    
    A --> C
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    F --> H
    F --> I
    F --> J
    
    G --> K
    H --> L
    I --> M
    J --> N
    
    K --> P
    L --> Q
    L --> P
    M --> R
    N --> S
    
    L --> O
    M --> O
    O --> U
    U --> W
    U --> V
    V --> J
    
    P --> T
    Q --> T
    R --> T
    S --> T


## Money Transfer Flow Diagram
sequenceDiagram
    participant Client
    participant API
    participant TransactionService
    participant RavenService
    participant Database
    participant RavenAPI
    participant ExternalBank
    participant Webhook
    
    Note over Client, Webhook: Money Transfer Process
    
    Client->>API: POST /api/transactions/transfer
    API->>API: Authenticate & Validate
    API->>TransactionService: initiateTransfer(userId, transferData)
    
    TransactionService->>Database: Check user balance
    Database-->>TransactionService: Balance: ₦1000
    
    TransactionService->>RavenService: verifyAccount(recipientAccount)
    RavenService->>RavenAPI: GET /accounts/verify
    RavenAPI-->>RavenService: Account valid
    RavenService-->>TransactionService: Verification success
    
    TransactionService->>Database: Create transaction (status: pending)
    Database-->>TransactionService: Transaction created
    
    TransactionService->>RavenService: initiateTransfer(transferData)
    RavenService->>RavenAPI: POST /transfers
    RavenAPI-->>RavenService: Transfer initiated
    RavenService-->>TransactionService: Raven transaction ID
    
    TransactionService->>Database: Update transaction (status: processing)
    TransactionService->>Database: Deduct from user balance
    TransactionService-->>API: Transaction response
    API-->>Client: Transfer initiated successfully
    
    Note over RavenAPI, ExternalBank: Raven processes transfer
    RavenAPI->>ExternalBank: Transfer ₦500
    ExternalBank-->>RavenAPI: Transfer completed
    
    RavenAPI->>Webhook: POST /webhook (transfer.successful)
    Webhook->>API: Webhook notification
    API->>TransactionService: processWebhook()
    TransactionService->>Database: Update transaction (status: completed)

## User Registration & Virtual Account Creation Flow
sequenceDiagram
    participant Client
    participant API
    participant AuthService
    participant BankAccountService
    participant RavenService
    participant Database
    participant RavenAPI
    
    Client->>API: POST /api/auth/register
    API->>API: Validate registration data
    API->>AuthService: register(userData)
    
    AuthService->>Database: Check if user exists
    Database-->>AuthService: User not found
    
    AuthService->>Database: Create new user
    Database-->>AuthService: User created (ID: 123)
    
    AuthService->>BankAccountService: createVirtualAccount(user)
    BankAccountService->>RavenService: createVirtualAccount(userInfo)
    RavenService->>RavenAPI: POST /accounts
    RavenAPI-->>RavenService: Virtual account created
    RavenService-->>BankAccountService: Account details
    
    BankAccountService->>Database: Save bank account details
    Database-->>BankAccountService: Bank account saved
    BankAccountService-->>AuthService: Virtual account created
    
    AuthService->>AuthService: Generate JWT token
    AuthService-->>API: {user, token}
    API-->>Client: Registration successful + token

## Deposit Flow (Webhook Processing)
sequenceDiagram
    participant ExternalBank
    participant RavenAPI
    participant Webhook
    participant API
    participant WebhookService
    participant TransactionService
    participant Database
    
    Note over ExternalBank, Database: Customer deposits money
    
    ExternalBank->>RavenAPI: Customer deposits ₦1000
    RavenAPI->>RavenAPI: Process deposit
    RavenAPI->>Webhook: POST /webhook (deposit.successful)
    
    Webhook->>API: POST /api/webhook
    API->>WebhookService: processWebhook(payload)
    
    WebhookService->>Database: Store webhook event
    WebhookService->>TransactionService: processWebhookDeposit(data)
    
    TransactionService->>Database: Find user by account number
    TransactionService->>Database: Create deposit transaction
    TransactionService->>Database: Update user balance (+₦1000)
    
    TransactionService-->>WebhookService: Deposit processed
    WebhookService->>Database: Mark webhook as processed
    WebhookService-->>API: Processing complete
    API-->>Webhook: 200 OK