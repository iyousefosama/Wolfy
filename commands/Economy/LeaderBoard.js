const discord = require("discord.js");
const schema = require("../../schema/Economy-Schema");
const text = require("../../util/string");

/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
  name: "leaderboard",
  aliases: ["lb"],
  dmOnly: false,
  guildOnly: false,
  args: false,
  usage: "",
  group: "Economy",
  description: "Get a list for the 10 richest users that using wolfy",
  cooldown: 2,
  guarded: false,
  requiresDatabase: true,
  permissions: [],
  examples: [],
  /**
   * @param {import("discord.js").Client} client
   * @param {import("discord.js").Message} message
   * @param {String[]} args
   */
  async execute(client, message, args) {
    message.channel.sendTyping();

    const members = [];
    const cachedUserIds = new Set(client.users.cache.keys());
    const batchSize = 25;
    let skip = 0;

    try {
      while (members.length < 10) {
        const data = await schema
          .find({ credits: { $gt: 0 } })
          .sort({ credits: -1 })
          .skip(skip)
          .limit(batchSize)
          .lean();

        if (!data.length) {
          break;
        }

        members.push(...data.filter((obj) => cachedUserIds.has(obj.userID)));
        skip += data.length;

        if (data.length < batchSize) {
          break;
        }
      }
    } catch (err) {
      console.log(err);
      return message.channel.send(
        `\`âŒ [DATABASE_ERR]:\` The database responded with error: ${err.name}`
      );
    }

    let pos = 0;

    const embed = new discord.EmbedBuilder()
      .setAuthor({
        name: client.user.username + "'s leaderboard",
        iconURL: client.user.displayAvatarURL({
          dynamic: true,
          extension: "png",
          size: 512,
        }),
      })
      .setColor("738ADB")
      .setTitle("<a:ShinyMoney:877975108038324224> Credits LeaderBoard!")
      .setTimestamp();

    for (const obj of members) {
      pos++;
      if (obj.userID == message.author.id) {
        embed.setFooter({
          text: `Your position is ${pos}!`,
          iconURL: message.author.displayAvatarURL({
            dynamic: true,
            size: 1024,
          }),
        });
      }
    }

    const topMembers = members.slice(0, 10);
    let desc = "";

    for (let i = 0; i < topMembers.length; i++) {
      const user = client.users.cache.get(topMembers[i].userID);
      if (!user) {
        continue;
      }

      const bal = topMembers[i].credits;
      let Num;
      if (i == 0) {
        Num = "<:medal:898358296694628414>";
      } else if (i == 1) {
        Num = "ðŸ¥ˆ";
      } else if (i == 2) {
        Num = "ðŸ¥‰";
      } else {
        Num = `*${i + 1}.*`;
      }
      desc += `${Num} ${user.tag} - \`${text.commatize(bal)}\` \n`;
    }

    embed.setDescription(desc || "No ranked users found.");
    return await message.channel.send({ embeds: [embed] }).catch((err) => {
      return message.channel.send({
        content: `\`âŒ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later! ${err.message}`,
      });
    });
  },
};
