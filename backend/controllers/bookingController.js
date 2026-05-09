const Booking = require('../models/Booking');
const Expert = require('../models/Expert');

exports.createBooking = async (req, res) => {
  try {
    const { expertId, name, email, phone, date, time, notes } = req.body;

    // 1. Validate required fields
    if (!expertId || !name || !email || !phone || !date || !time) {
      return res.status(400).json({ message: 'All fields except notes are required' });
    }

    // 2. DOUBLE BOOKING PREVENTION (VERY IMPORTANT)
    // Check if a booking already exists for the same expert, date, and time
    const existingBooking = await Booking.findOne({ 
      expertId, 
      date, 
      time,
      status: 'Confirmed'
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'Slot already booked' });
    }

    const expert = await Expert.findById(expertId);
    if (!expert) {
      return res.status(404).json({ message: 'Expert not found' });
    }

    // 3. Save the new booking
    const newBooking = new Booking({
      expertId,
      expertName: expert.name,
      name,
      email,
      phone,
      date,
      time,
      notes
    });

    await newBooking.save();

    // 4. REAL-TIME UPDATE via Socket.io
    // Emit an event to notify all connected clients that a slot has been booked
    const io = req.app.get('socketio');
    if (io) {
      io.emit('slot_booked', { expertId, date, time });
    }

    res.status(201).json({ message: 'Booking successful', booking: newBooking });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: 'Email is required to fetch bookings' });
    }

    const bookings = await Booking.find({ email }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true }
    );

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    res.json({ message: 'Booking status updated', booking });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};
