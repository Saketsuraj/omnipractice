const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// In-memory storage for users and messages
const users = [];
const messages = [];

app.use(bodyParser.json());

// Signup/Login
// use the same route for login and signup both
app.post('/signup', (req, res) => {
  const { username, password } = req.body;

  // Check if the user already exists
  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists' });
  }

  // Create a new user
  const newUser = { username, password, followers: [], messages: [] };
  users.push(newUser);

  res.json({ message: 'Signup successful' });
});

// PostMessage
app.post('/postMessage', (req, res) => {
  const { username, message } = req.body;

  const user = users.find(user => user.username === username);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Add the message to the user's messages
  user.messages.push({ text: message, timestamp: new Date() });

  // Send the message to all followers
  user.followers.forEach(follower => {
    const followerUser = users.find(u => u.username === follower);
    if (followerUser) {
      followerUser.messages.push({ text: message, timestamp: new Date() });
    }
  });

  res.json({ message: 'Message posted successfully' });
});

// FollowUser
app.post('/followUser', (req, res) => {
  const { username, followUsername } = req.body;

  const user = users.find(user => user.username === username);
  const followUser = users.find(user => user.username === followUsername);

  if (!user || !followUser) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Check if the user is already following
  if (user.followers.includes(followUsername)) {
    return res.status(400).json({ error: 'Already following this user' });
  }

  // Add the user to the follower's list
  user.followers.push(followUsername);

  res.json({ message: 'User followed successfully' });
});

// GetMyFeed
app.get('/getMyFeed/:username', (req, res) => {
  const { username } = req.params;

  const user = users.find(user => user.username === username);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Combine user's messages and followed users' messages and sort them by timestamp
  const feed = user.messages.concat(
    user.followers.reduce((acc, follower) => {
      const followerUser = users.find(u => u.username === follower);
      if (followerUser) {
        acc = acc.concat(followerUser.messages);
      }
      return acc;
    }, [])
  );

  // Sort the feed by timestamp
  const sortedFeed = feed.sort((a, b) => b.timestamp - a.timestamp);

  res.json(sortedFeed);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
