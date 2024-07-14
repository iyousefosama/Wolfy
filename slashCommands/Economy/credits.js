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
      console.log(err);
      interaction.reply(
        `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`
      );
    }
    let credits = data.credits;
    let bank = data.Bank.balance.credits;
    const dailyUsed =
      data.timer.daily.timeout !== 0 &&
      data.timer.daily.timeout - Date.now() > 0;
    const bal = new discord.EmbedBuilder()
      .setAuthor({
        name: `${user.username}'s wallet`,
        iconURL: user.displayAvatarURL({ dynamic: true, size: 2048 }),
      })
      .setColor("Grey")
      .setDescription(
        `<a:ShinyMoney:877975108038324224> Credits balance is \`${text.commatize(
          credits
        )}\`!\n${
          data.Bank.balance.credits !== null
            ? `🏦 Bank balance is \`${text.commatize(bank)}\`!`
            : `\\❌ **${user.tag}**, Don't have a *bank* yet! To create one, type \`${prefix}register\`.`
        }\n\n━━━━━━━━━━━━━━\n${
          dailyUsed
            ? "<:Success:888264105851490355> Daily reward is **claimed**!"
            : `\\⚠️ Daily reward is **avaliable**!`
        }`
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
