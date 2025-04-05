# SkyGeni Backend

A TypeScript Express.js backend boilerplate for the SkyGeni application.

## Project Structure

```
skygeni-backend/
├── .env                # Environment variables
├── .eslintrc.json      # ESLint configuration
├── tsconfig.json       # TypeScript configuration
├── package.json        # Project dependencies and scripts
├── src/
│   ├── index.ts        # Entry point
│   ├── types/          # Type definitions
│   │   └── index.ts    # Application types
│   ├── routes/         # API routes
│   │   ├── index.ts    # Route aggregator
│   │   └── dashboard.routes.ts  # Dashboard routes
│   └── controllers/    # Route controllers
│       └── dashboard.controller.ts  # Dashboard controller
│   ├── utils/          # Utility functions
│   │   ├── readFiles.ts          # File reading utility
│   │   ├── processCustomerData.ts # Customer data processing
│   │   ├── processIndustryData.ts # Industry data processing
│   │   ├── processAcvRangeData.ts # ACV range data processing
│   │   └── processTeamData.ts     # Team data processing
```

## Available Routes

### Dashboard Routes
- `GET /api/dashboard` - Retrieve dashboard data

### Health Check
- `GET /health` - Check the health of the server


## Scripts

- `npm run build` - Compile TypeScript code to JavaScript
- `npm start` - Start the compiled server
- `npm run dev` - Start the development server with hot-reload
- `npm run lint` - Run ESLint to check for code quality issues

## Technologies Used

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Typed JavaScript
- **ESLint** - Linting tool for code quality
