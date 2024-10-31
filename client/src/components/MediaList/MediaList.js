import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MediaList.css';

const MediaList = () => {
  const [mediaItems, setMediaItems] = useState([]);
  
  // State to manage filter type and filter value for filtering media items
  const [filterType, setFilterType] = useState('');
  const [filterValue, setFilterValue] = useState('');

  // Check if the logged-in user is an admin using local storage
  const isAdmin = localStorage.getItem('username') === 'admin';

  // Function to handle deletion of a media item(admin controlled)
  const handleDelete = (id) => {
    if (!isAdmin) return; 

    // Send DELETE request to the backend to remove the item
    axios.delete(`http://localhost:5000/api/content/${id}`)
      .then(response => {
        console.log(response.data.message);
        // Update the media items state to remove  deleted item
        setMediaItems(mediaItems.filter(item => item.id !== id));
      })
      .catch(error => console.error('Error deleting content:', error));
  };

  // Fetch media items from the backend when the component mounts
  useEffect(() => {
    axios.get('http://localhost:5000/api/media')
      .then(response => setMediaItems(response.data))
      .catch(error => console.error('Error fetching media items:', error)); 
  }, []);

  // Function to filter media items based on the selected filter type and value
  const filteredItems = mediaItems.filter(item => {
    if (!filterValue) return true; 
    if (filterType === 'status') return item.status.toLowerCase() === filterValue.toLowerCase();
    if (filterType === 'genre') return item.genre.toLowerCase() === filterValue.toLowerCase();
    return true;
  });

  // Generate filter options based on the selected filter type
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
        {/* Dropdown to select filter type */}
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

        {/* Dropdown to select filter value based on filter type */}
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
          // Render each media item as a MediaCard component
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

  // Function to toggle the read more/less state
  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };

  // Truncate the description if it exceeds 100 characters
  const truncatedDescription = item.description.length > 100
    ? `${item.description.substring(0, 100)}...`
    : item.description;

  return (
    <div className="media-card">
      <strong>{item.title}</strong> - {item.genre} ({item.status})
      <p>
        {isReadMore ? item.description : truncatedDescription}
        {item.description.length > 100 && (
          <span onClick={toggleReadMore} className="read-more">
            {isReadMore ? ' Show less' : ' Read more'}
          </span>
        )}
      </p>
      {isAdmin && (
        <button
          onClick={() => onDelete(item.id)}
          className="delete-button"
        >
          Delete
        </button>
      )}
    </div>
  );
};

export default MediaList;
