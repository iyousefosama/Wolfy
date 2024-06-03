const { Client } = require("discord.js");
const schema = require("../schema/CommandsManager-Schema");

/**
 * @param {Client} client
 */
module.exports = async (client) => {
  await new Promise((r) => setTimeout(r, 5000));

  try {
    const ClientUsers = await schema.find({});
    const now = Math.floor(Date.now() / 1000);

    for (const userData of ClientUsers) {
      if (userData.timerStart === 0) {
        continue;
      }

      if (now >= userData.timerEnd) {
        // timerDuration has expired, deletes the data
        await schema.deleteOne({ userID: userData.userID });
      } else {
        // timerDuration has not expired, set the remaining time
        const remainingTime = userData.timerEnd - now;
        setTimeout(async () => {
          await schema.deleteOne({ userID: userData.userID });
        }, remainingTime * 1000);
      }
    }
  } catch (err) {
    console.error("Error handling user data on ready event:", err);
  }
};
