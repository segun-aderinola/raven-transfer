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

## Project Structure

```
src/
├── config/           # Database and app configuration
├── controllers/      # Request handlers
├── services/         # Business logic
├── models/          # Database models
├── routes/          # API routes
├── middleware/      # Custom middleware
├── validators/      # Request validation
├── dto/            # Data Transfer Objects
├── types/          # TypeScript type definitions
├── interfaces/     # TypeScript interfaces
├── database/       # Migrations and seeds
└── tests/          # Test files
```

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
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run type-check` - Type check without emitting files

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

## TypeScript Features

- **Strict Type Checking**: Full TypeScript strict mode enabled
- **Interfaces**: Comprehensive interfaces for all data structures
- **Type Safety**: Complete type coverage throughout the application
- **Path Mapping**: Clean import paths using TypeScript path mapping
- **Generics**: Type-safe database operations using generics
- **Enums and Union Types**: For transaction statuses, user statuses, etc.

## Testing

Run tests: `npm test`
Run tests in watch mode: `npm run test:watch`

## Environment Variables

```
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=money_transfer_app
DB_USER=your_db_user
DB_PASSWORD=your_db_password
JWT_SECRET=your_jwt_secret_key_here
RAVEN_API_KEY=your_raven_api_key
RAVEN_SECRET_KEY=your_raven_secret_key
RAVEN_BASE_URL=https://integrations.getravenbank.com
WEBHOOK_URL=https://your-webhook-url.com/webhook
```

## Development

1. Register on https://atlas.getravenbank.com and get your API credentials
2. Set up webhook.site for testing webhook endpoints
3. Configure your `.env` file with the obtained credentials
4. Run `npm run build` to compile TypeScript
5. Run database migrations with `npm run migrate`
6. Start the development server with `npm run dev`

## Type Safety

This application leverages TypeScript's type system to provide:
- Compile-time error checking
- IntelliSense support in IDEs
- Interface-driven development
- Type-safe database operations
- Strict null checks
- No implicit any types

## License

MIT License
EOF

# 20. Create startup script
cat > start.sh << 'EOF'
#!/bin/bash

echo "🚀 Starting Money Transfer App (TypeScript) Setup..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check TypeScript installation
if ! command -v npx tsc &> /dev/null; then
    echo "❌ TypeScript is not installed. Installing TypeScript..."
    npm install -g typescript
fi

# Check if MySQL is running (optional check)
echo "🔍 Checking MySQL connection..."
if command -v mysql &> /dev/null; then
    echo "✅ MySQL is available"
else
    echo "⚠️  MySQL command not found. Make sure MySQL is installed and running."
fi

# Create logs directory
mkdir -p logs

# Copy environment file if it doesn't exist
if [ ! -f .env ]; then
    cp .env.example .env
    echo "📝 Created .env file from .env.example"
    echo "⚠️  Please update the .env file with your actual configuration"
fi

# Build TypeScript
echo "🔨 Building TypeScript..."
npm run build

echo "
✅ Setup completed!

Next steps:
1. Update your .env file with actual database and API credentials
2. Create your MySQL database: CREATE DATABASE money_transfer_app;
3. Run migrations: npm run migrate
4. Start development server: npm run dev

Environment file location: .env
Build output: dist/
Database migrations: npm run migrate
Start server: npm run dev
Run tests: npm test
Type checking: npm run type-check

📚 Check README.md for detailed setup instructions
"
EOF

chmod +x start.sh

echo "
🎉 MONEY TRANSFER APP (TYPESCRIPT) SETUP COMPLETE!

📁 All TypeScript files and directories have been created successfully.

🚀 TO START THE APPLICATION:

1. First, run the setup script:
   ./start.sh

2. Update your .env file with actual credentials:
   - Database connection details
   - Raven Atlas API keys
   - JWT secret key
   - Webhook URL

3. Create MySQL database:
   mysql -u root -p
   CREATE DATABASE money_transfer_app;

4. Build TypeScript:
   npm run build

5. Run database migrations:
   npm run migrate

6. Start the development server:
   npm run dev

🔧 TYPESCRIPT COMMANDS:

   npm install          # Install dependencies
   npm run build        # Build TypeScript to JavaScript
   npm run dev          # Start development server with hot reload
   npm run migrate      # Run database migrations
   npm test            # Run tests
   npm start           # Start production server
   npm run type-check  # Type check without building

📖 TypeScript Features:
   ✅ Strict type checking enabled
   ✅ Complete interfaces for all data structures
   ✅ Path mapping for clean imports (@/config, @/services, etc.)
   ✅ Type-safe database operations
   ✅ Full OOP implementation with proper typing
   ✅ Jest testing with TypeScript support

🌐 Once running, your API will be available at:
   http://localhost:3000

💡 TypeScript Benefits:
   - Compile-time error checking
   - Better IDE support with IntelliSense
   - Self-documenting code with interfaces
   - Reduced runtime errors
   - Enhanced developer experience

Happy coding with TypeScript! 🚀
"