const { SlashCommandBuilder } = require("@discordjs/builders");
const discord = require("discord.js");
const text = require("../../util/string");
const schema = require("../../schema/Economy-Schema");
const { colors } = require("../../util/constants/constants");

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "credits",
    description: "To check your or someone's credits balance in wallet",
    dmOnly: false,
    guildOnly: false,
    cooldown: 0,
    group: "Economy",
    requiresDatabase: true,
    clientPermissions: [],
    permissions: [],
    options: [
      {
        type: 6, // USER
        name: 'user',
        description: 'User to show the credits for!'
      }
    ]
  },
  async execute(client, interaction) {
    const target = interaction.options.getUser("user");

    if (interaction.guild) {
      const id =
        (target?.id.match(/\d{17,19}/) || [])[0] || interaction.user.id;

      member = await interaction.guild.members
        .fetch(id)
        .catch(() => interaction.member);

      user = member.user;
    } else {
      user = interaction.user;
    }

    let data;
    try {
      data = await schema.findOne({
        userID: user.id,
      });
      if (!data) {
        data = await schema.create({
          userID: user.id,
        });
      }
    } catch (err) {
      interaction.reply({
        content: `💢 [DATABASE_ERR]: The database responded with error: ${err.name}`
      });
      return client.logDetailedError({
        error: err,
        eventType: "DATABASE_ERR",
        interaction: interaction
      })
    }
    let credits = data.credits;
    let bank = data.Bank.balance.credits;
    const dailyUsed =
      data.timer.daily.timeout !== 0 &&
      data.timer.daily.timeout - Date.now() > 0;
    const bal = new discord.EmbedBuilder()
      .setAuthor({
        name: client.user.username,
        iconURL: client.user.displayAvatarURL(),
      })
      .setColor(colors.ECONOMY)
      .setTitle(`${user.username}'s wallet`)
      .setDescription(
        `💰 Credits balance is \`${text.commatize(credits)}\`!\n${data.Bank.balance.credits !== null ? `🏦 Bank balance is \`${text.commatize(bank)}\`!` : `❌ **${user.tag}**, Don't have a *bank* yet! To create one, type \`${client.prefix}register\`.`}\n\n━━━━━━━━━━━━━━\n${dailyUsed ? `✅ Daily reward is **claimed**!` : `⚠️ Daily reward is **available**!`}`
      )
      .setFooter({
        text: `Requested by ${interaction.user.username}`,
        iconURL: interaction.user.displayAvatarURL({
          dynamic: true,
          size: 2048,
        }),
      })
      .setTimestamp();
    return await interaction.reply({ embeds: [bal] });
  },
};
