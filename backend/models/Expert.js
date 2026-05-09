const mongoose = require('mongoose');

const expertSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  experience: { type: Number, required: true }, // years of experience
  rating: { type: Number, required: true }, // rating out of 5
  description: { type: String },
  availableSlots: [
    {
      date: { type: String, required: true }, // Format: YYYY-MM-DD
      times: [{ type: String }] // Format: HH:MM AM/PM
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Expert', expertSchema);
