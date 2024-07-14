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
      console.log(err);
      interaction.reply(
        `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`
      );
    }
    let credits = data.Bank.balance.credits;
    let moneyadd = Math.floor(credits * 1.05) + 150;

    if (
      !data ||
      data.Bank.balance.credits === null ||
      data.Bank.info.Enabled == false
    ) {
      return interaction.reply(
        `\\❌ **${interaction.user.tag}**, You don't have a *bank* yet! To create one, type \`${client.prefix}register\`.`
      );
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
          `🏦 **${
            interaction.user.username
          }**, you have <a:ShinyMoney:877975108038324224> **${text.commatize(
            credits
          )}** credits in your bank account!\n\n⚠️ Check your bank after \`${moment
            .duration(data.timer.banktime.timeout - now, "milliseconds")
            /*.format(
              "H [hours,] m [minutes, and] s [seconds]"
            )*/
            .humanize()}\` to get your reward! **(5% + 150)**`
        )
        .setTimestamp();
      interaction.reply({ embeds: [embed] });
    } else if (data.Bank.balance.credits + moneyadd > 100000) {
      data.timer.banktime.timeout = Date.now() + duration;
      data.Bank.balance.credits = Math.floor(100000);
      return data
        .save()
        .then(() => {
          interaction.reply(
            `\\❌ **${interaction.user.tag}**, Your bank is overflowed please withdraw some money from your bank.`
          );
        })
        .catch((err) =>
          interaction.reply(
            `\`❌ [DATABASE_ERR]:\` The database responded with error: \`${err.name}\``
          )
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
              `🏦 **${
                interaction.user.username
              }**, Your new balance is <a:ShinyMoney:877975108038324224> **${text.commatize(
                moneyadd
              )}** credits in your bank account!\n\n⚠️ Check your bank again after \`${moment
                .duration(data.timer.banktime.timeout - now, "milliseconds")
                .format(
                  "H [hours,] m [minutes, and] s [seconds]"
                )}\` to get your next reward! **(5% + 150)**`
            )
            .setTimestamp();
          interaction.reply({ embeds: [checkembed] });
        })
        .catch((err) =>
          interaction.reply(
            `\`❌ [DATABASE_ERR]:\` The database responded with error: \`${err.name}\``
          )
        );
    }
  },
};
