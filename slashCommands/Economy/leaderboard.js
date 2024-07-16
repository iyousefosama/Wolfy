const discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const schema = require("../../schema/Economy-Schema");
const text = require("../../util/string");

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "leaderboard",
    description: "Get a list of the 10 richest users in Wolfy",
    dmOnly: false,
    guildOnly: false,
    cooldown: 0,
    group: "Economy",
    requiresDatabase: true,
    clientPermissions: [],
    permissions: [],
    options: []
  },
  async execute(client, interaction) {
    await interaction.deferReply().catch(() => { });

    try {
      const data = await schema.find({});
      let members = data.filter((obj) =>
        client.users.cache.has(obj.userID)
      ); // Filter valid user IDs
      members = await FilterArr(members);

      const embed = new discord.EmbedBuilder()
        .setAuthor({
          name: `${client.user.username}'s Leaderboard`,
          iconURL: client.user.displayAvatarURL({
            dynamic: true,
            format: "png",
            size: 512,
          }),
        })
        .setColor("738ADB")
        .setTitle("<a:ShinyMoney:877975108038324224> Credits Leaderboard!")
        .setTimestamp();

      for (let i = 0; i < members.length; i++) {
        const user = client.users.cache.get(members[i].userID);
        if (!user) continue;
        const bal = members[i].credits;
        const positionEmoji =
          i === 0
            ? "<:medal:898358296694628414>"
            : i === 1
              ? "🥈"
              : i === 2
                ? "🥉"
                : `*${i + 1}.*`;

        embed.addFields({
          name: `${positionEmoji} ${user.tag}`,
          value: `\`${text.commatize(bal)}\``,
          inline: false
        });
      }

      // Set footer for the user's position
      const userPosition = members.findIndex(
        (obj) => obj.userID === interaction.user.id
      );
      if (userPosition !== -1) {
        embed.setFooter({
          text: `Your position is ${userPosition + 1}!`,
          iconURL: interaction.user.displayAvatarURL({
            dynamic: true,
            size: 1024,
          }),
        });
      }

      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      await interaction.editReply({
        content: `\`❌ [DATABASE_ERR]:\` Unable to retrieve data from the database. Please try again later!`,
      });
    }
  },
};

async function FilterArr(arr) {
  return arr
    .filter((value) => value.credits > 0)
    .sort((a, b) => b.credits - a.credits);
}
