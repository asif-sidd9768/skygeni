# SkyGeni Backend

A TypeScript Express.js backend boilerplate for the SkyGeni application.

## Project Structure

```
skygeni-backend/
├── .env                # Environment variables
├── .eslintrc.json     # ESLint configuration
├── tsconfig.json      # TypeScript configuration
├── package.json       # Project dependencies and scripts
├── src/
│   ├── index.ts       # Entry point
│   ├── types/         # Type definitions
│   │   └── index.ts   # Application types
│   ├── routes/        # API routes
│   │   ├── index.ts   # Route aggregator
│   │   └── dashboard.routes.ts  # Dashboard routes
│   └── controllers/   # Route controllers
│       └── dashboard.controller.ts  # Dashboard controller
```

## Available Routes

- `GET /api` - Welcome message
- `GET /api/dashboard` - Get dashboard data
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /health` - Health check endpoint

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`

## Scripts

- `npm run build` - Build the TypeScript code
- `npm start` - Start the compiled server
- `npm run dev` - Start the development server with hot-reload
- `npm run lint` - Run ESLint
- `npm test` - Run tests
