import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';

// Connect to socket.io backend
const socket = io('http://localhost:5000');

const ExpertDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expert, setExpert] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', notes: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchExpertDetails();

    // Listen for real-time updates when a slot is booked
    socket.on('slot_booked', (data) => {
      // If the booked slot belongs to the currently viewed expert, refresh details
      if (data.expertId === id) {
        fetchExpertDetails();
        // Reset selection if the user was trying to book the same slot
        if (selectedDate === data.date && selectedTime === data.time) {
          setError('The slot you selected was just booked by someone else!');
          setSelectedTime('');
        }
      }
    });

    return () => {
      socket.off('slot_booked');
    };
  }, [id, selectedDate, selectedTime]);

  const fetchExpertDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/experts/${id}`);
      setExpert(res.data);
    } catch (error) {
      console.error('Error fetching expert details:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedDate || !selectedTime) {
      return setError('Please select a date and time');
    }

    try {
      await axios.post('http://localhost:5000/bookings', {
        expertId: id,
        date: selectedDate,
        time: selectedTime,
        ...formData
      });
      setSuccess('Booking confirmed successfully!');
      setTimeout(() => navigate('/my-bookings'), 2000);
    } catch (err) {
      // This will handle the double booking prevention error from backend
      setError(err.response?.data?.message || 'Error creating booking');
    }
  };

  if (!expert) return <div>Loading...</div>;

  const currentSlots = expert.availableSlots.find(s => s.date === selectedDate)?.times || [];

  return (
    <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px' }}>
        <div className="card">
          <h2>{expert.name}</h2>
          <p className="badge badge-Confirmed">{expert.category}</p>
          <br /><br />
          <p><strong>Experience:</strong> {expert.experience} years</p>
          <p><strong>Rating:</strong> ⭐ {expert.rating}</p>
          <p style={{ marginTop: '10px' }}>{expert.description}</p>
        </div>

        <div className="card" style={{ marginTop: '20px' }}>
          <h3>Select a Slot</h3>
          <div className="slots-container">
            {expert.availableSlots.map(slot => (
              <button 
                key={slot.date}
                className={`slot-btn ${selectedDate === slot.date ? 'selected' : ''}`}
                onClick={() => { setSelectedDate(slot.date); setSelectedTime(''); }}
              >
                {slot.date}
              </button>
            ))}
          </div>

          {selectedDate && (
            <div>
              <h4>Times for {selectedDate}:</h4>
              <div className="slots-container" style={{ marginTop: '10px' }}>
                {currentSlots.length > 0 ? currentSlots.map(time => (
                  <button
                    key={time}
                    className={`slot-btn ${selectedTime === time ? 'selected' : ''}`}
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </button>
                )) : <p>No times available</p>}
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ flex: 1, minWidth: '300px' }}>
        <div className="card">
          <h3>Booking Form</h3>
          {error && <div className="error">{error}</div>}
          {success && <div style={{ color: 'green', marginBottom: '15px' }}>{success}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name *</label>
              <input type="text" name="name" required onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input type="email" name="email" required onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label>Phone *</label>
              <input type="text" name="phone" required onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label>Notes</label>
              <textarea name="notes" rows="3" onChange={handleInputChange}></textarea>
            </div>
            
            <p style={{ marginBottom: '15px' }}>
              <strong>Selected Slot:</strong> {selectedDate || 'None'} at {selectedTime || 'None'}
            </p>
            
            <button type="submit" className="btn" style={{ width: '100%' }}>Book Appointment</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ExpertDetails;
