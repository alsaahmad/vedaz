import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ExpertList = () => {
  const [experts, setExperts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = ['All', 'Health', 'Technology', 'Finance', 'Legal'];

  useEffect(() => {
    fetchExperts();
  }, [search, category, page]);

  const fetchExperts = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/experts`, {
        params: { search, category, page, limit: 6 }
      });
      setExperts(res.data.experts);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error('Error fetching experts:', error);
    }
  };

  return (
    <div>
      <div className="filters">
        <input 
          type="text" 
          placeholder="Search by name..." 
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
        <select 
          value={category} 
          onChange={(e) => { setCategory(e.target.value); setPage(1); }}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="expert-grid">
        {experts.map(expert => (
          <div key={expert._id} className="card">
            <h3>{expert.name}</h3>
            <p><strong>Category:</strong> {expert.category}</p>
            <p><strong>Experience:</strong> {expert.experience} years</p>
            <p><strong>Rating:</strong> ⭐ {expert.rating}</p>
            <br />
            <Link to={`/expert/${expert._id}`} className="btn">View Details</Link>
          </div>
        ))}
        {experts.length === 0 && <p>No experts found.</p>}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            className="btn btn-secondary" 
            disabled={page === 1} 
            onClick={() => setPage(p => p - 1)}
          >
            Previous
          </button>
          <span>Page {page} of {totalPages}</span>
          <button 
            className="btn btn-secondary" 
            disabled={page === totalPages} 
            onClick={() => setPage(p => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ExpertList;
