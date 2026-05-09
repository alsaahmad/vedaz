const mongoose = require('mongoose');
require('dotenv').config();
const Expert = require('./models/Expert');

const seedExperts = async () => {
  try {
    // Connect to MongoDB Atlas (or local) using the URI from .env
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected. Clearing old data...');

    await Expert.deleteMany(); // Clear existing experts

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
    process.exit();
  } catch (err) {
    console.error('❌ Error seeding database:');
    console.error(err.message);
    console.error('👉 Ensure your MongoDB Atlas IP is whitelisted and connection string is correct.');
    process.exit(1);
  }
};

seedExperts();
