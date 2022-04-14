require('dotenv/config');

// Authenticate with Twitch API
const { ClientCredentialsAuthProvider } = require('@twurple/auth');
const { ApiClient } = require('@twurple/api');
const clientId = process.env.TWITCH_CLIENT_ID;
const clientSecret = process.env.TWITCH_CLIENT_SECRET;

const authProvider = new ClientCredentialsAuthProvider(clientId, clientSecret);
const twitchApiClient = new ApiClient({ authProvider });

module.exports = {
  isUserBanned: async function (username) {
    const user = await twitchApiClient.users.getUserByName(username);
    if (user) {
      return false;
    } else {
      return true;
    }
  },

  getBannedUsers: async function (usernamesToCheck) {
    let existingHexlixUsers = [];

    // check 100 usernames per API request (Twitch limit)
    const batchSize = 100;
    for (var i = 0; i < usernamesToCheck.length; i += batchSize) {
      batch = await twitchApiClient.users.getUsersByNames(
        usernamesToCheck.slice(i, i + batchSize)
      );
      existingHexlixUsers = existingHexlixUsers.concat(batch);
    }

    const checkedUsernames = usernamesToCheck.map((username) => {
      return username.toLowerCase();
    });

    let existingUsernames = [];

    existingHexlixUsers.forEach((user) => {
      existingUsernames.push(user.name);
    });

    bannedUsernames = checkedUsernames.filter(
      (user) => !existingUsernames.includes(user)
    );

    return bannedUsernames;
  },
};
