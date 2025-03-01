# Auction System

A full-stack auction system built with React, Express, and MongoDB.

## Features

- **User Authentication**
  - Sign up with username, email, and password
  - Sign in with email and password
  - JWT-based authentication

- **Auction Management**
  - Create new auctions with item details, starting bid, and closing time
  - Place bids on active auctions
  - View auction details and bid history
  - Automatic auction closing based on closing time

- **User Dashboard**
  - View your created auctions
  - Track your bids on other auctions
  - See won/lost auction status

## Tech Stack

- **Frontend**
  - React with TypeScript
  - Tailwind CSS for styling
  - Axios for API requests
  - React Router for navigation
  - Context API for state management

- **Backend**
  - Node.js with Express
  - MongoDB with Mongoose
  - JWT for authentication
  - bcrypt.js for password encryption

## Getting Started

1. Make sure MongoDB is installed and running on your system
2. Update the MongoDB connection string in `.env` if needed
3. Install dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm run dev
   ```
5. In a separate terminal, start the backend server:
   ```
   npm run server
   ```

## API Endpoints

- **Authentication**
  - `POST /api/auth/signup` - Register a new user
  - `POST /api/auth/signin` - Authenticate a user
  - `GET /api/auth/me` - Get current user (protected)

- **Auctions**
  - `GET /api/auctions` - Get all active auctions
  - `GET /api/auctions/:id` - Get a single auction
  - `POST /api/auctions` - Create a new auction (protected)
  - `PUT /api/auctions/bid/:id` - Place a bid on an auction (protected)
  - `GET /api/auctions/user/auctions` - Get user's auctions (protected)
  - `GET /api/auctions/user/bids` - Get user's bids (protected)

## Project Structure

- `/server` - Backend code
  - `/models` - Mongoose models
  - `/routes` - API routes
  - `/middleware` - Custom middleware
  - `/utils` - Utility functions
- `/src` - Frontend code
  - `/components` - Reusable React components
  - `/context` - React context providers
  - `/pages` - Page components
  - `/utils` - Utility functions
  - `/types` - TypeScript type definitions