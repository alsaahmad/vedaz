const Expert = require('../models/Expert');

exports.getExperts = async (req, res) => {
  try {
    const { search, category, page = 1, limit = 5 } = req.query;
    let query = {};

    // Search by name (case-insensitive)
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Pagination logic
    const skip = (page - 1) * limit;
    
    const experts = await Expert.find(query)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Expert.countDocuments(query);

    res.json({
      experts,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalExperts: total
    });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

exports.getExpertById = async (req, res) => {
  try {
    const Booking = require('../models/Booking'); // Import booking model
    const expert = await Expert.findById(req.params.id).lean();
    if (!expert) return res.status(404).json({ message: 'Expert not found' });

    // Fetch all confirmed bookings for this expert
    const bookings = await Booking.find({ 
      expertId: req.params.id, 
      status: 'Confirmed' 
    });

    // Remove booked times from available slots
    expert.availableSlots = expert.availableSlots.map(slotDay => {
      const availableTimes = slotDay.times.filter(time => {
        const isBooked = bookings.some(b => b.date === slotDay.date && b.time === time);
        return !isBooked;
      });
      return { ...slotDay, times: availableTimes };
    }).filter(slotDay => slotDay.times.length > 0);

    res.json(expert);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};
