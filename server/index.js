const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/crud1', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollno: { type: String, required: true },
  email: { type: String, required: true },
  age: { type: Number, required: true },
  passout: { type: Number, required: true },
  skills: { type: [String], default: [] },
  studyYear: { type: Number, required: true },
  dept: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Create a new user
app.post('/users', async (req, res) => {
  const { name, rollno, email, age, passout, skills, studyYear, dept } = req.body;
  const user = new User({ name, rollno, email, age, passout, skills, studyYear, dept });
  try {
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create user' });
  }
});

// Get all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Update a user
app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, rollno, email, age, passout, skills, studyYear, dept } = req.body;
  try {
    const user = await User.findByIdAndUpdate(id, { name, rollno, email, age, passout, skills, studyYear, dept }, { new: true });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update user' });
  }
});

// Delete a user
app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
