const discord = require("discord.js");
const {
  SlashCommandBuilder,
  EmbedBuilder,
  version: discord_version,
} = require("@discordjs/builders");
const { version, author } = require("../../package.json");
const { release, cpus } = require("os");
const dayjs = require("dayjs"); // requiring dayjs
const { heapUsed, heapTotal } = process.memoryUsage();
const text = require("../../util/string");
const { colors } = require("../../util/constants/constants");

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "stats",
    description: "Shows bot stats and information",
    dmOnly: false,
    guildOnly: false,
    cooldown: 0,
    integration_types: [0, 1],
    contexts: [0, 1, 2],
    group: "Bot",
    clientPermissions: [
        "EmbedLinks",
        "UseExternalEmojis"
    ],
    permissions: [],
    options: []
},
  async execute(client, interaction) {
    const SlashCommands = client.slashCommands?.size;
    const members = text.commatize(
      client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)
    );

    const embed = new EmbedBuilder()
          .setColor(colors.BOT)
          .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL({
              dynamic: true,
              extension: "png",
              size: 512,
            }),
          })
          .setTitle(`${client.user.username} Bot's stats`)
          .setURL(client.config.websites["website"])
          .setThumbnail(client.user.displayAvatarURL())
          .setDescription(
            `**General**
🤖 **Username:** ${client.user.username}
🏷️ **Tag:** ${client.user.tag}
🆔 **ID:** ${client.user.id}
📆 **Created At:** ${dayjs(client.user.createdAt).format("DD-MM-YYYY [at] HH:mm")}
👨‍💻 **Developer:** ${author}
💡 [**Bot Website**](${client.config.websites["website"]})
**Version:** \`${version}\`
━━━━━━━━━━━━━━━━━━━
**System**
🧠 **Memory Total** (heapTotal): **[ ${(heapTotal / 1024 / 1024).toFixed(0)} MB ]**
🧠 **Memory Used** (heapUsed): **[ ${(heapUsed / 1024 / 1024).toFixed(0)} MB ]**
🖥️ **OS:** ${process.platform} ${release}
🔧 **discordJS:** v${discord_version}
💻 **Node:** ${process.version}
✨ **CPU:** ${cpus()[0].model}
        `
          )
          .addFields(
            {
              name: "⭐ Commands Stats",
              value: [
                `🏷️ Text Commands: \`${client.commands.size}\``,
                `⚡ Slash Commands: \`${SlashCommands}\``,
              ].join("\n"),
              inline: true,
            },
            {
              name: "🌐 Guilds",
              value: `\`\`\`${client.guilds.cache.size}\`\`\``,
            },
            {
              name: "⌨️ Channels",
              value: `\`\`\`${client.channels.cache.size}\`\`\``,
            },
            {
              name: "👥 Members",
              value: `\`\`\`${members}\`\`\``,
            }
          )
          .setFooter({
            text: `Requested by ${interaction.user.username}`,
            iconURL: interaction.user.displayAvatarURL({ dynamic: true })
          })
          .setTimestamp();

    interaction.reply({
      content: `> **Viewing ${client.user.username}'s stats for • [  ${interaction.user.username}  ]**`,
      embeds: [embed],
    });
  },
};
