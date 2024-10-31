import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './ContentForm.css';

const ContentForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');
  const [uploadDate, setUploadDate] = useState(new Date());
  const [status, setStatus] = useState('Draft');
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false); // State for success message

  // Validation function
  const validate = () => {
    const newErrors = {};
    if (!title) newErrors.title = 'Title is required';
    if (!description) newErrors.description = 'Description is required';
    if (!genre) newErrors.genre = 'Genre is required';
    if (!uploadDate) newErrors.uploadDate = 'Upload Date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const contentData = {
      title,
      description,
      genre,
      uploadDate,
      status,
    };

    // Make API call to save content data
    axios
      .post('http://localhost:5000/api/content', contentData) // Replace with your API URL
      .then((response) => {
        console.log('Content saved successfully:', response.data);
        setShowSuccess(true); // Show success message

        // Reset form fields after successful submission
        setTitle('');
        setDescription('');
        setGenre('');
        setUploadDate(new Date());
        setStatus('Draft');

        // Hide the success message after 3 seconds
        setTimeout(() => setShowSuccess(false), 3000);
      })
      .catch((error) => {
        console.error('Error saving content:', error);
      });
  };

  return (
    <form className="content-form" onSubmit={handleSubmit}>
      <div>
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {errors.title && <span className="error">{errors.title}</span>}
      </div>
      <div>
        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        {errors.description && <span className="error">{errors.description}</span>}
      </div>
      <div>
        <label>Genre:</label>
        <select value={genre} onChange={(e) => setGenre(e.target.value)}>
          <option value="">Select Genre</option>
          <option value="Drama">Drama</option>
          <option value="Comedy">Comedy</option>
          <option value="Thriller">Thriller</option>
          <option value="Romance">Romance</option>
          <option value="Documentary">Documentary</option>
          <option value="Sci-Fi">Sci-Fi</option>
        </select>
        {errors.genre && <span className="error">{errors.genre}</span>}
      </div>
      <div>
        <label>Upload Date:</label>
        <DatePicker
          selected={uploadDate}
          onChange={(date) => setUploadDate(date)}
          dateFormat="yyyy-MM-dd"
        />
        {errors.uploadDate && <span className="error">{errors.uploadDate}</span>}
      </div>
      <div>
        <label>Status:</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Draft">Draft</option>
          <option value="Publish">Publish</option>
        </select>
      </div>
      <button type="submit">Save</button>

      {/* Success Message */}
      {showSuccess && (
        <div className="success-message">
          Content saved successfully!
        </div>
      )}
    </form>
  );
};

export default ContentForm;
