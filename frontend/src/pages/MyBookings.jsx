import React, { useState } from 'react';
import axios from 'axios';

const MyBookings = () => {
  const [email, setEmail] = useState('');
  const [bookings, setBookings] = useState([]);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  const searchBookings = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      const res = await axios.get(`http://localhost:5000/bookings`, {
        params: { email }
      });
      setBookings(res.data);
      setSearched(true);
      setError('');
    } catch (err) {
      setError('Error fetching bookings');
    }
  };

  const cancelBooking = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/bookings/${id}/status`, {
        status: 'Cancelled'
      });
      // Update UI
      setBookings(bookings.map(b => b._id === id ? { ...b, status: 'Cancelled' } : b));
    } catch (err) {
      alert('Failed to cancel booking');
    }
  };

  return (
    <div className="card">
      <h2>My Bookings</h2>
      <form onSubmit={searchBookings} className="filters" style={{ marginTop: '20px' }}>
        <input 
          type="email" 
          placeholder="Enter your email to find bookings..." 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="btn">Search</button>
      </form>

      {error && <p className="error">{error}</p>}

      {searched && (
        <div style={{ marginTop: '30px' }}>
          {bookings.length === 0 ? (
            <p>No bookings found for {email}.</p>
          ) : (
            <div className="expert-grid">
              {bookings.map(booking => (
                <div key={booking._id} className="card" style={{ borderLeft: `4px solid ${booking.status === 'Confirmed' ? '#10b981' : '#ef4444'}` }}>
                  <h3>{booking.expertName}</h3>
                  <p><strong>Date:</strong> {booking.date}</p>
                  <p><strong>Time:</strong> {booking.time}</p>
                  <p>
                    <strong>Status:</strong>{' '}
                    <span className={`badge badge-${booking.status}`}>{booking.status}</span>
                  </p>
                  {booking.status === 'Confirmed' && (
                    <button 
                      className="btn btn-secondary" 
                      style={{ marginTop: '10px' }}
                      onClick={() => cancelBooking(booking._id)}
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
