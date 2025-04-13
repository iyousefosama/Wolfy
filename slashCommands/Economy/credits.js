const { SlashCommandBuilder } = require("@discordjs/builders");
const discord = require("discord.js");
const text = require("../../util/string");
const schema = require("../../schema/Economy-Schema");

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
        content: client.language.getString("ERR_DB", interaction.guild?.id, { error: err.name })
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
        name: client.language.getString("ECONOMY_WALLET_TITLE", interaction.guild?.id, { username: user.username }),
        iconURL: user.displayAvatarURL({ dynamic: true, size: 2048 }),
      })
      .setColor("Grey")
      .setDescription(
        client.language.getString("ECONOMY_WALLET_DESCRIPTION", interaction.guild?.id, {
          credits: text.commatize(credits),
          bank_balance: data.Bank.balance.credits !== null
            ? client.language.getString("ECONOMY_BANK_BALANCE", interaction.guild?.id, { 
                balance: text.commatize(bank) 
              })
            : client.language.getString("ECONOMY_NO_BANK", interaction.guild?.id, { 
                username: user.tag, 
                prefix: client.prefix 
              }),
          daily_status: dailyUsed
            ? client.language.getString("ECONOMY_DAILY_CLAIMED", interaction.guild?.id)
            : client.language.getString("ECONOMY_DAILY_AVAILABLE", interaction.guild?.id)
        })
      )
      .setFooter({
        text: interaction.user.tag,
        iconURL: interaction.user.displayAvatarURL({
          dynamic: true,
          size: 2048,
        }),
      })
      .setTimestamp();
    return await interaction.reply({ embeds: [bal] });
  },
};
