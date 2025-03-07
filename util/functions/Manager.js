const schema = require("../../schema/CommandsManager-Schema");
const Ecoschema = require("../../schema/Economy-Schema");
const text = require("../string");

/**
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Message} message
 * @param {import("../types/baseCommand")} cmd
 */
const manager = async (client, message, cmd) => {
  if (!client.database?.connected) return;
  if (!message || message.author.bot || message.author.id === client.user.id) return;

  const now = Math.floor(Date.now() / 1000);
  const deleteDuration = 1.814e9 / 1000; // 4 Weeks in seconds
  const dateToDel = now + deleteDuration;
  const usedCommandsWarnsResetDuration = 57600; // 16 hours in seconds
  const globalWarnsResetDuration = 86400; // 24 hours in seconds

  const cmdObj = {
    authorTag: message.author.tag,
    timestamp: now,
    content: message.content,
  };

  try {
    let cmdData = await schema.findOneAndUpdate(
      { userID: message.author.id },
      {
        $set: { userID: message.author.id },
        $push: { [`UsedCommandsInv.${cmd.name}`]: cmdObj },
        $setOnInsert: {
          timerStart: 0,
          timerEnd: 0,
          timeoutReset: null,
          UsedCommandsWarn: 0,
          UsedCommandsWarnsReset: null,
          GlobalWarns: 0,
          GlobalWarnsReset: null,
          "Status.SilentBlacklist.reason": null,
        },
      },
      { upsert: true, new: true }
    );

    // Check if the timer has expired or not set
    if (cmdData.timerStart === 0 || now >= cmdData.timerEnd) {
      cmdData.timerStart = now;
      cmdData.timerEnd = dateToDel;

      await cmdData.save();
      setTimeout(async () => {
        await schema.deleteOne({ userID: message.author.id });
      }, deleteDuration * 1000);
    }

    if (cmdData.UsedCommandsWarnsReset < now) {
      // Reset used commands warnings if reset time has passed
      cmdData.UsedCommandsWarn = 0;
    }

    if (cmdData.GlobalWarnsReset < now) {
      // Reset global warnings if reset time has passed
      cmdData.GlobalWarns = 0;
    }

    if (cmdData.GlobalWarns >= 3) {
      // If global warnings have reached the limit, blacklist the user
      cmdData.Status.SilentBlacklist.current = true;
      cmdData.Status.SilentBlacklist.reason = "Wolfy: SelfBot, spamming commands!";
    } else if (cmdData.UsedCommandsWarn >= 25) {
      // If used commands warnings have reached the limit, increment global warnings
      cmdData.GlobalWarns += 1;
      cmdData.UsedCommandsWarn = 0;
      cmdData.GlobalWarnsReset = now + globalWarnsResetDuration;
    } else if (cmdData.timeoutReset > now) {
      // If the user is within the timeout period, increment used commands warnings
      cmdData.UsedCommandsWarn += 1;
      cmdData.UsedCommandsWarnsReset = now + usedCommandsWarnsResetDuration;
    }


    await cmdData.save();

    if (
      cmdData.UsedCommandsInv[cmd.name]?.some(
        (obj) => obj.authorTag === message.author.tag
      )
    ) {
      // Command has already been executed by the user, no need to send reward again
      return;
    }

    const cmdCount = cmdData.UsedCommandsInv[cmd.name]
      ? cmdData.UsedCommandsInv[cmd.name].length + 1
      : 1;
    const firstLvl = Math.floor(Math.random() * 20) + 50;

    if (cmdCount >= firstLvl) {
      let data;
      try {
        data = await Ecoschema.findOne({ userID: message.author.id });
        if (!data) {
          data = await Ecoschema.create({ userID: message.author.id });
        }
      } catch (err) {
        console.error(err);
      }

      const user = client.users.cache.get(message.author.id);
      user?.send({
        content: `:wave: ​Hello **${message.author.tag}**, We have discovered that you used the \`${cmd.name}\` command for **${firstLvl}** times!\n\n• We want to know your rating and if you have any suggestion for us that will be very helpful for us! \❤️ \n• Send your feedback with \`w${client.prefix}feedback\`​ command! 🤝 \n **Thanks** for using \🤖 Wolfy!`,
      })
        .then(async () => {
          data.credits += Math.floor(firstLvl * 5);
          await data.save();
          user?.send(
            `<a:Money:836169035191418951> **${message.author.tag}**, You successfully collected \`${text.commatize(Math.floor(firstLvl * 5))}\` as a reward for this!`
          );
        })
        .catch(() => {});
    }
  } catch (err) {
    console.error(err);
  }
};

module.exports = manager;