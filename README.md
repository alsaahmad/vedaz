# Vedaz - Expert Booking System

A lightweight, full-stack real-time expert booking system using React, Node.js, Express, MongoDB, and Socket.io.

## Features
- **Expert Listing & Filtering**: Browse through experts from various fields.
- **Slot Selection**: View and select available dates and time slots for an expert.
- **Booking Form**: Fill out details to confirm a booking.
- **Real-Time Availability**: Real-time updates via Socket.io to prevent double bookings.
- **My Bookings**: View a list of your confirmed bookings.

## Project Structure
The project is divided into two main parts:
- `frontend`: The React application (Vite).
- `backend`: The Node.js/Express application, using an in-memory MongoDB database for demonstration purposes.

## Getting Started

### Prerequisites
- Node.js installed on your machine.

### Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend server:
   ```bash
   npm start
   ```
   *(Note: The server uses an in-memory MongoDB server by default and will automatically seed sample expert data upon startup.)*

### Frontend Setup
1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to the URL provided by Vite (usually `http://localhost:5173/`).

## Environment Variables
The `backend/.env` file should look like this:
```env
PORT=5000
# MONGO_URI is optional, the app falls back to an in-memory DB if not working
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/expert_booking?retryWrites=true&w=majority
```

## Technologies Used
- **Frontend**: React, React Router, Vite, Socket.io-client, Vanilla CSS
- **Backend**: Node.js, Express, Mongoose, Socket.io, MongoDB Memory Server
