const discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { colors } = require("../../util/constants/constants");
const schema = require("../../schema/Economy-Schema");
const dayjs = require("dayjs");
const duration = require("dayjs/plugin/duration");

dayjs.extend(duration);
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
        content: "`❌ [DATABASE_ERR]:` The database responded with an error!"
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
        content: `❌ **${interaction.user.tag}**, you don't have a bank account yet! To create one, type \`${client.prefix}register\`.`
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
        .setColor(colors.ECONOMY)
        .setDescription(
          `🏦 **${interaction.user.username}**, you have 💰 **${text.commatize(credits)}** credits in your bank account!\n\n⚠️ Check your bank after ${dayjs.duration(data.timer.banktime.timeout - now, "milliseconds").humanize()} to get your reward! **(5% + 150)**`
        )
        .setTimestamp()
        .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });
      interaction.reply({ embeds: [embed] });
    } else if (data.Bank.balance.credits + moneyadd > 100000) {
      data.timer.banktime.timeout = Date.now() + duration;
      data.Bank.balance.credits = Math.floor(100000);
      return data
        .save()
        .then(() => {
          interaction.reply({
            content: `❌ **${interaction.user.tag}**, your bank is overflowing! Please withdraw some money from your bank.`
          });
        })
        .catch((err) =>
          interaction.reply({
            content: "`❌ [DATABASE_ERR]:` The database responded with an error!"
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
            .setColor(colors.ECONOMY)
            .setDescription(
              `🏦 **${interaction.user.username}**, your new balance is 💰 **${text.commatize(moneyadd)}** credits in your bank account!\n\n⚠️ Check your bank again after ${dayjs.duration(data.timer.banktime.timeout - now, "milliseconds").format("H [hours,] m [minutes, and] s [seconds]")} to get your next reward! **(5% + 150)**`
            )
            .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();
          interaction.reply({ embeds: [checkembed] });
        })
        .catch((err) =>
          interaction.reply({
            content: "`❌ [DATABASE_ERR]:` The database responded with an error!"
          })
        );
    }
  },
};
