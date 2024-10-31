const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS to allow requests from the frontend
app.use(cors());

// Temp sample in-memory media data
let mediaItems = [
  { id: 1, title: 'Show 1', description: 'An intense and emotional journey following the lives of individuals entangled in a web of secrets, betrayal, and redemption.', genre: 'Drama', status: 'Published', uploadDate: '2024-01-01' },
  { id: 2, title: 'Show 2', description: 'A hilarious sitcom that brings together an eccentric group of friends who navigate life absurdities with wit, sarcasm.', genre: 'Comedy', status: 'Draft', uploadDate: '2024-02-01' },
  { id: 3, title: 'Show 3', description: 'A heart-pounding thriller that keeps you on the edge of your seat Prepare for endless laughter as they tackle everyday challenges in the most unexpected ways ', genre: 'Thriller', status: 'Published' },
  { id: 4, title: 'Show 4', description: 'A captivating love story that defies the odds Prepare for endless laughter as they tackle everyday challenges in the most unexpected ways', genre: 'Romance', status: 'Published' },
  { id: 5, title: 'Show 5', description: 'A thought-provoking documentary that sheds light on the most pressing issues Prepare for endless laughter as they tackle everyday challenges in the most unexpected ways', genre: 'Documentary', status: 'Draft' },
  { id: 6, title: 'Show 6', description: 'Step into the future with this exhilarating sci-fi adventure Prepare for endless laughter as they tackle everyday challenges in the most unexpected ways', genre: 'Sci-Fi', status: 'Published' }
];

// GET route to fetch all media items
app.get('/api/media', (req, res) => {
  res.json(mediaItems);
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
 