// https://www.youtube.com/watch?v=vjf774RKrLc

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/Users');
const twitch = require('./controllers/twitch');
require('dotenv/config');

// Middlewares
// Parse request body on every request
app.use(bodyParser.json());

// Import Routes
const usersRoute = require('./routes/users');

app.use('/users', usersRoute);

// Routes
app.get('/', (req, res) => {
  res.send('home');
});

// Connect to Database
const dbConnection = process.env.DB_CONNECTION;
mongoose.connect(dbConnection, () => {
  console.log('Connected to DB');
});

// Start Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

async function updateBans() {
  const timestamp = Date.now();
  const allUsers = await User.find();
  let dbUsernames = [];
  let newBans = [];
  let newUnbans = [];

  allUsers.forEach(async (user) => {
    dbUsernames.push(user.username);
  });

  bannedUsers = await twitch.getBannedUsers(dbUsernames);

  allUsers.forEach(async (user) => {
    const username = user.username;
    const filter = { username: username };
    const isCurrentlyBanned = user.banned;
    let willGetBanned = false;

    if (bannedUsers.includes(username)) {
      willGetBanned = true;
    }

    // user gets banned, true -> false
    if (isCurrentlyBanned == false && willGetBanned == true) {
      const update = {
        banned: true,
        lastBanned: timestamp,
        lastUpdated: timestamp,
      };
      console.log(`User ${username} was banned.`);
      newBans.push(username);
      await User.findOneAndUpdate(filter, update);
    }

    // user gets unbanned, false -> true
    if (isCurrentlyBanned == true && willGetBanned == false) {
      const update = {
        banned: false,
        lastUnbanned: timestamp,
        lastUpdated: timestamp,
      };
      console.log(`User ${username} was unbanned.`);
      newUnbans.push(username);
      await User.findOneAndUpdate(filter, update);
    }
  });

  console.log('Stats:');
  console.log(
    `  Currently tracking ${allUsers.length} users (${bannedUsers.length} banned).`
  );
  console.log(
    `  The following ${newBans.length} users were banned: ${newBans}`
  );
  console.log(
    `  The following ${newUnbans.length} users were unbanned: ${newUnbans}`
  );
}

// Update bans
const updateInterval = process.env.UPDATE_INTERVAL * 1000;
setInterval(function () {
  console.log('Updating bans...');
  updateBans();
}, updateInterval);
