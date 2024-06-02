const { Client } = require("discord.js");
const schema = require("../schema/CommandsManager-Schema");

/**
 * @param {Client} client
 */

module.exports = async (client) => {
  await new Promise((r) => setTimeout(r, 5000));

  const ClientUsers = await schema.find({});
  for (const userData of ClientUsers) {
    if (userData.timerStart === 0) {
      return;
    } else {
      // Do nothing..
    }

    if (userData.timerStart >= userData.timerEnd) {
      // timerDuration has expired, deletes the data
      userData.timerStart = 0;
      userData.timerEnd = 0;
      await userData.deleteOne({ userID: message.author.id });
    } else {
      // timerDuration has not expired, set the remaining time
      setTimeout(async () => {
        userData.timerStart = 0;
        userData.timerEnd = 0;
        await userData.deleteOne({ userID: message.author.id });
      }, Math.floor(userData.timerEnd - userData.timerStart));
    }
  }
};
