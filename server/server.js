const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const multer = require('multer');
const path = require('path');

app.use(cors());
app.use(express.json());

const SECRET_KEY = 'your-secret-key';

// Temporary memory storage for users
let users = [];

let mediaItems = [
  { id: 1, title: 'Show 1', description: 'An intense and emotional journey following the lives of individuals entangled in a web of secrets, betrayal, and redemption.', genre: 'Drama', status: 'Published', uploadDate: '2024-01-01' },
  { id: 2, title: 'Show 2', description: 'A hilarious sitcom that brings together an eccentric group of friends who navigate life absurdities with wit, sarcasm.', genre: 'Comedy', status: 'Draft', uploadDate: '2024-02-01' },
  { id: 3, title: 'Show 3', description: 'A heart-pounding thriller that keeps you on the edge of your seat. Prepare for endless laughter as they tackle everyday challenges in the most unexpected ways.', genre: 'Thriller', status: 'Published', uploadDate: '2024-03-01' },
  { id: 4, title: 'Show 4', description: 'A captivating love story that defies the odds. Prepare for endless laughter as they tackle everyday challenges in the most unexpected ways.', genre: 'Romance', status: 'Published', uploadDate: '2024-04-01' },
  { id: 5, title: 'Show 5', description: 'A thought-provoking documentary that sheds light on the most pressing issues. Prepare for endless laughter as they tackle everyday challenges in the most unexpected ways.', genre: 'Documentary', status: 'Draft', uploadDate: '2024-05-01' },
  { id: 6, title: 'Show 6', description: 'Step into the future with this exhilarating sci-fi adventure. Prepare for endless laughter as they tackle everyday challenges in the most unexpected ways.', genre: 'Sci-Fi', status: 'Published', uploadDate: '2024-06-01' }
];

// Signup route
app.post('/api/signup', async (req, res) => {
  const { username, password } = req.body;
  const existingUser = users.find(user => user.username === username);

  if (existingUser) {
    return res.status(409).json({ message: 'Username already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });
  res.status(201).json({ message: 'User registered successfully' });
});

// Login route
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(user => user.username === username);

  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ message: 'Login successful', token });
});

// GET route to fetch all media items
app.get('/api/media', (req, res) => {
  res.json(mediaItems);
});

// POST route to add new content
app.post('/api/content', (req, res) => {
  const newContent = req.body;
  newContent.id = mediaItems.length + 1;
  mediaItems.push(newContent);
  res.status(201).json({ message: 'Content added successfully!', newContent });
});

// DELETE route to delete a content item by ID
app.delete('/api/content/:id', (req, res) => {
  const contentId = parseInt(req.params.id, 10);
  const index = mediaItems.findIndex(item => item.id === contentId);

  if (index !== -1) {
    mediaItems.splice(index, 1);
    res.json({ message: 'Content deleted successfully!' });
  } else {
    res.status(404).json({ message: 'Content not found' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
