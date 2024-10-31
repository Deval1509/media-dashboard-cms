import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../components-css/MediaList.css';

const MediaList = () => {
  // State to hold media items and filter values
  const [mediaItems, setMediaItems] = useState([]);
  const [filterType, setFilterType] = useState('');
  const [filterValue, setFilterValue] = useState('');

  // Fetch media items from the backend when the component mounts
  useEffect(() => {
    axios.get('http://localhost:5000/api/media')
      .then(response => setMediaItems(response.data))
      .catch(error => console.error('Error fetching media items:', error));
  }, []);

  // Filter media items based on selected filter type and value
  const filteredItems = mediaItems.filter(item => {
    if (!filterValue) return true; // If no filter is selected, return all items
    if (filterType === 'status') return item.status.toLowerCase() === filterValue.toLowerCase();
    if (filterType === 'genre') return item.genre.toLowerCase() === filterValue.toLowerCase();
    return true;
  });

  // Options for the second dropdown based on selected filter type
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
        {/* First dropdown: Filter by status or genre */}
        <div className="filter-container">
          <label htmlFor="filter-type">Filter by: </label>
          <select
            id="filter-type"
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setFilterValue(''); // Reset filter value when changing filter type
            }}
            className="filter-select"
          >
            <option value="">None</option>
            <option value="status">Status</option>
            <option value="genre">Genre</option>
          </select>
        </div>

        {/* Second dropdown: Select specific filter value based on filter type */}
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
            <MediaCard key={item.id} item={item} />
          ))
        )}
      </div>
    </div>
  );
};

// Component to display individual media item
const MediaCard = ({ item }) => {
  const [isReadMore, setIsReadMore] = useState(false);

  const toggleReadMore = () => {
    setIsReadMore(!isReadMore); // Toggle read more/less state
  };

  // Show truncated description if it's too long
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
    </div>
  );
};

export default MediaList;
