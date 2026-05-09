import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ExpertList from './pages/ExpertList';
import ExpertDetails from './pages/ExpertDetails';
import MyBookings from './pages/MyBookings';

function App() {
  return (
    <Router>
      <div className="container">
        <nav>
          <h2>ExpertBook</h2>
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/my-bookings">My Bookings</Link>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<ExpertList />} />
          <Route path="/expert/:id" element={<ExpertDetails />} />
          <Route path="/my-bookings" element={<MyBookings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
