const discord = require("discord.js");
const {
  SlashCommandBuilder,
  EmbedBuilder,
  version: discord_version,
} = require("@discordjs/builders");
const { version, author } = require("../../package.json");
const { release, cpus } = require("os");
const moment = require(`moment`); // requiring moment
const { heapUsed, heapTotal } = process.memoryUsage();
const text = require("../../util/string");

module.exports = {
  clientpermissions: [
    discord.PermissionsBitField.Flags.EmbedLinks,
    discord.PermissionsBitField.Flags.UseExternalEmojis,
  ],
  data: new SlashCommandBuilder()
    .setName("stats")
    .setDescription("Shows bot stats and informations"),
  async execute(client, interaction) {
    const SlashCommands = client.slashCommands?.size;
    const members = text.commatize(
      client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)
    );

    const embed = new EmbedBuilder()
      .setAuthor({
        name: client.user.username,
        iconURL: client.user.displayAvatarURL({
          dynamic: true,
          extension: "png",
          size: 512,
        }),
      })
      .setTitle(`${client.user.username} Bot's stats`) // make the title for the cmd
      .setURL(client.config.websites["website"])
      .setThumbnail(client.user.displayAvatarURL()) // it will put the bot avatar (pfp) in the embed
      .setImage(
        `https://cdn.discordapp.com/attachments/830926767728492565/874773027177512960/c7d26cb2902f21277d32ad03e7a21139.gif`
      )
      .setDescription(
        `**General**
        <:Bot:841711382739157043> **Username:** ${client.user.username}
        <a:pp224:853495450111967253> **Tag:** ${client.user.tag}
        <:pp198:853494893439352842> **ID:** ${client.user.id}
        📆 **Created At:** ${moment(client.user.createdAt).format(
          "DD-MM-YYYY [at] HH:mm"
        )}
        <:Developer:841321892060201021> **Developer:** ${author}
        <a:LightUp:776670894126006302> [**Bot Website**](${
          client.config.websites["website"]
        })
        **Version:** \`${version}\`
        ━━━━━━━━━━━━━━━━━━
        <a:Settings:841321893750505533> **System**
        🧠 **Memory Total** (heapTotal)**:** [\` ${(
          heapTotal /
          1024 /
          1024
        ).toFixed(0)} MB \`]
        🧠 **Memory Used** (heapUsed)**:** [\` ${(
          heapUsed /
          1024 /
          1024
        ).toFixed(0)} MB \`]
        🖥️ **OS:** ${process.platform} ${release}
        <:discordjs:805086222749007874>**discordJS:** v${discord_version}
        <:nodejs:805092302011236422> **Node:** ${process.version}
        <a:Right:877975111846731847> **CPU:** ${cpus()[0].model}
        `
      )
      .addFields(
        {
          name: "<:star:888264104026992670> Commands Stats",
          value: [
            `<:tag:888265211327438908> Text Commands: \`${client.commands.size}\``,
            `<:slash:888265211138674708> Slash Commands: \`${SlashCommands}\``,
          ].join("\n"),
          inline: true,
        },
        {
          name: "<a:pp594:768866151827767386> **Guilds:**",
          value: `\`\`\`${client.guilds.cache.size}\`\`\``,
        },
        {
          name: "⌨️ **Channels:**",
          value: `\`\`\`${client.channels.cache.size}\`\`\``,
        },
        {
          name: "<:pp833:853495153280155668> **Members:**",
          value: `\`\`\`${members}\`\`\``,
        }
      );

    interaction.editReply({
      content: `> **Viewing ${client.user.username}'s stats for • [**  ${interaction.user.username} **]**`,
      embeds: [embed],
    });
  },
};
