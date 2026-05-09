const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const expertRoutes = require('./routes/expertRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();
const server = http.createServer(app);

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: "*", // allow all origins for simplicity
    methods: ["GET", "POST"]
  }
});

// Make io accessible in controllers
app.set('socketio', io);

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/experts', expertRoutes);
app.use('/bookings', bookingRoutes);

// ==========================================
// Database Connection
// ==========================================
const { MongoMemoryServer } = require('mongodb-memory-server');
const Expert = require('./models/Expert');

const seedExperts = async () => {
  await Expert.deleteMany();
  const experts = [
    {
      name: 'Dr. Sarah Jenkins',
      category: 'Health',
      experience: 10,
      rating: 4.8,
      description: 'Experienced general physician with a focus on holistic health.',
      availableSlots: [
        { date: '2026-05-10', times: ['10:00 AM', '11:00 AM', '02:00 PM'] },
        { date: '2026-05-11', times: ['09:00 AM', '01:00 PM', '03:00 PM'] }
      ]
    },
    {
      name: 'Michael Chen',
      category: 'Technology',
      experience: 8,
      rating: 4.9,
      description: 'Senior software engineer specializing in system architecture and cloud computing.',
      availableSlots: [
        { date: '2026-05-10', times: ['09:00 AM', '04:00 PM'] },
        { date: '2026-05-12', times: ['11:00 AM', '02:00 PM'] }
      ]
    },
    {
      name: 'Emma Watson',
      category: 'Finance',
      experience: 15,
      rating: 4.7,
      description: 'Certified financial planner helping you manage your wealth and investments.',
      availableSlots: [
        { date: '2026-05-11', times: ['10:00 AM', '12:00 PM'] },
        { date: '2026-05-13', times: ['02:00 PM', '04:00 PM'] }
      ]
    },
    {
      name: 'James Rodriguez',
      category: 'Legal',
      experience: 12,
      rating: 4.6,
      description: 'Corporate lawyer with extensive experience in contract law.',
      availableSlots: [
        { date: '2026-05-10', times: ['01:00 PM', '03:00 PM'] },
        { date: '2026-05-14', times: ['09:00 AM', '11:00 AM'] }
      ]
    }
  ];
  await Expert.insertMany(experts);
  console.log('🎉 Database seeded successfully with sample data!');
};

const startServer = async () => {
  try {
    const mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoMemoryServer successfully!');
    
    await seedExperts();

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
  }
};

startServer();
