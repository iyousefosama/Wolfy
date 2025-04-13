const discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const schema = require("../../schema/Economy-Schema");
const moment = require("moment");
const text = require("../../util/string");

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "bank",
    description: "Check your credits balance in bank",
    dmOnly: false,
    guildOnly: false,
    cooldown: 0,
    requiresDatabase: true,
    group: "Economy",
    clientPermissions: [],
    permissions: [],
    options: []
  },
  async execute(client, interaction) {
    let data;
    try {
      data = await schema.findOne({
        userID: interaction.user.id,
      });
      if (!data) {
        data = await schema.create({
          userID: interaction.user.id,
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
    let credits = data.Bank.balance.credits;
    let moneyadd = Math.floor(credits * 1.05) + 150;

    if (
      !data ||
      data.Bank.balance.credits === null ||
      data.Bank.info.Enabled == false
    ) {
      return interaction.reply({
        content: client.language.getString("ECONOMY_NO_BANK_ACCOUNT", interaction.guild?.id, { 
          username: interaction.user.tag, 
          prefix: client.prefix 
        })
      });
    }

    const now = Date.now();
    const duration = Math.floor(86400000);
    if (data.timer.banktime.timeout > now) {
      const embed = new discord.EmbedBuilder()
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL({
            dynamic: true,
            size: 2048,
          }),
        })
        .setColor("Grey")
        .setDescription(
          client.language.getString("ECONOMY_BANK_STATUS", interaction.guild?.id, {
            username: interaction.user.username,
            credits: text.commatize(credits),
            time: moment.duration(data.timer.banktime.timeout - now, "milliseconds").humanize()
          })
        )
        .setTimestamp();
      interaction.reply({ embeds: [embed] });
    } else if (data.Bank.balance.credits + moneyadd > 100000) {
      data.timer.banktime.timeout = Date.now() + duration;
      data.Bank.balance.credits = Math.floor(100000);
      return data
        .save()
        .then(() => {
          interaction.reply({
            content: client.language.getString("ECONOMY_BANK_OVERFLOW", interaction.guild?.id, { 
              username: interaction.user.tag 
            })
          });
        })
        .catch((err) =>
          interaction.reply({
            content: client.language.getString("ERR_DB", interaction.guild?.id, { error: err.name })
          })
        );
    } else {
      data.timer.banktime.timeout = Date.now() + duration;
      data.Bank.balance.credits = Math.floor(moneyadd);
      await data
        .save()
        .then(() => {
          const checkembed = new discord.EmbedBuilder()
            .setAuthor({
              name: interaction.user.username,
              iconURL: interaction.user.displayAvatarURL({
                dynamic: true,
                size: 2048,
              }),
            })
            .setColor("DarkGreen")
            .setDescription(
              client.language.getString("ECONOMY_BANK_NEW_BALANCE", interaction.guild?.id, {
                username: interaction.user.username,
                credits: text.commatize(moneyadd),
                time: moment.duration(data.timer.banktime.timeout - now, "milliseconds")
                  .format("H [hours,] m [minutes, and] s [seconds]")
              })
            )
            .setTimestamp();
          interaction.reply({ embeds: [checkembed] });
        })
        .catch((err) =>
          interaction.reply({
            content: client.language.getString("ERR_DB", interaction.guild?.id, { error: err.name })
          })
        );
    }
  },
};
