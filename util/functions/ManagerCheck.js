const schema = require("../../schema/CommandsManager-Schema");

/**
 * @param {import('../../struct/Client')} client
 */
module.exports = async (client) => {
  if (client.database?.connected) return;

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
  } catch (error) {
    client.logDetailedError({ error, eventType: "Manager check" });
  }
};
