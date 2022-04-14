const express = require('express');
const router = express.Router();
const User = require('../models/Users');
const twitch = require('../controllers/twitch');

// get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

// get specific user by username
router.get('/:username', async (req, res) => {
  const username = req.params.username;

  try {
    const user = await User.find({
      username: username,
    });
    if (user.length == 0) {
      res.status(404).json({ message: 'user does not exist' });
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

// create a user
router.post('/', async (req, res) => {
  const timestamp = Date.now();
  const username = req.body.username;

  const test = await User.find({
    username: username,
  });

  if (test.length == 0) {
    const user = new User({
      username: username,
      banned: await twitch.isUserBanned(username),
      trackedAt: timestamp,
    });
    try {
      const trackedUser = await user.save();
      res.status(201).json(trackedUser);
    } catch (error) {
      res.status(400).json({ message: error });
    }
  } else {
    res.status(409).json({ message: 'user is already being tracked' });
  }
});

// delete a user by username
router.delete('/:username', async (req, res) => {
  const username = req.params.username;

  try {
    const untrackedUser = await User.deleteOne({
      username: username,
    });
    res.status(204).json({});
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

module.exports = router;
