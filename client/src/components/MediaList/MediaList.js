import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import './MediaList.css';

const MediaList = () => {
  const [mediaItems, setMediaItems] = useState([]);
  const [filterType, setFilterType] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  // Check admin access using token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.username === 'admin') {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error('Invalid token:', error);
      }
    }
  }, []);

  // Function to handle deletion of a media item
  const handleDelete = (id) => {
    if (!isAdmin) return;

    axios.delete(`http://localhost:5000/api/content/${id}`)
      .then(response => {
        console.log(response.data.message);
        setMediaItems(mediaItems.filter(item => item.id !== id));
      })
      .catch(error => console.error('Error deleting content:', error));
  };

  // Fetch media items from the backend
  useEffect(() => {
    axios.get('http://localhost:5000/api/media')
      .then(response => setMediaItems(response.data))
      .catch(error => console.error('Error fetching media items:', error));
  }, []);

  // Filter media items based on selected filter type and value
  const filteredItems = mediaItems.filter(item => {
    if (!filterValue) return true;
    if (filterType === 'status') return item.status.toLowerCase() === filterValue.toLowerCase();
    if (filterType === 'genre') return item.genre.toLowerCase() === filterValue.toLowerCase();
    return true;
  });

  // Generate filter options
  const filterOptions = filterType === 'status'
    ? ['Published', 'Draft']
    : filterType === 'genre'
    ? ['Drama', 'Comedy', 'Thriller', 'Romance', 'Documentary', 'Sci-Fi']
    : [];

  return (
    <div className="media-list-container">
      <h2>Media Content List</h2>

      {/* Filter section */}
      <div className="filter-container-wrapper">
        <div className="filter-container">
          <label htmlFor="filter-type">Filter by: </label>
          <select
            id="filter-type"
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setFilterValue('');
            }}
            className="filter-select"
          >
            <option value="">None</option>
            <option value="status">Status</option>
            <option value="genre">Genre</option>
          </select>
        </div>

        {filterType && (
          <div className="filter-container">
            <label htmlFor="filter-value">Select {filterType}: </label>
            <select
              id="filter-value"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              className="filter-select"
            >
              <option value="">All</option>
              {filterOptions.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Media content list */}
      <div className="media-grid">
        {filteredItems.length === 0 ? (
          <p>No media items found.</p>
        ) : (
          filteredItems.map(item => (
            <MediaCard
              key={item.id}
              item={item}
              isAdmin={isAdmin}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};

// Component to display individual media item
const MediaCard = ({ item, isAdmin, onDelete }) => {
  const [isReadMore, setIsReadMore] = useState(false);

  // Toggle read more/less
  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };

  // Default values to handle undefined properties
  const title = item.title || 'Untitled';
  const description = item.description || 'No description available';
  const genre = item.genre || 'Unknown Genre';
  const status = item.status || 'Unknown Status';
  const thumbnail = item.thumbnail || 'placeholder-image-url.jpg';

  // Truncate the description
  const truncatedDescription = description.length > 100
    ? `${description.substring(0, 100)}...`
    : description;

    return (
      <div
      className="media-card"
      style={{
        backgroundImage: `url(${thumbnail})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>      
        <div className="content-overlay">
          <strong>{title}</strong> - {genre} ({status})
          <p>
            {isReadMore ? description : truncatedDescription}
            {description.length > 100 && (
              <span onClick={toggleReadMore} className="read-more">
                {isReadMore ? ' Show less' : ' Read more'}
              </span>
            )}
          </p>
          {isAdmin && (
            <button onClick={() => onDelete(item.id)} className="delete-button">
              Delete
            </button>
          )}
        </div>
      </div>
    );
  };

export default MediaList;
