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
      .setAuthor({
        name: client.user.username,
        iconURL: client.user.displayAvatarURL({
          dynamic: true,
          extension: "png",
          size: 512,
        }),
      })
      .setTitle(client.language.getString("STATS_TITLE", interaction.guild.id, { username: client.user.username }))
      .setURL(client.config.websites["website"])
      .setThumbnail(client.user.displayAvatarURL())
      .setDescription(
        `${client.language.getString("STATS_GENERAL", interaction.guild.id)}
        ${client.language.getString("STATS_USERNAME", interaction.guild.id, { username: client.user.username })}
        ${client.language.getString("STATS_TAG", interaction.guild.id, { tag: client.user.tag })}
        ${client.language.getString("STATS_ID", interaction.guild.id, { id: client.user.id })}
        ${client.language.getString("STATS_CREATED_AT", interaction.guild.id, { date: moment(client.user.createdAt).format("DD-MM-YYYY [at] HH:mm") })}
        ${client.language.getString("STATS_DEVELOPER", interaction.guild.id, { author })}
        ${client.language.getString("STATS_WEBSITE", interaction.guild.id, { website: client.config.websites["website"] })}
        ${client.language.getString("STATS_VERSION", interaction.guild.id, { version })}
        ━━━━━━━━━━━━━━━━━━
        ${client.language.getString("STATS_SYSTEM", interaction.guild.id)}
        ${client.language.getString("STATS_MEMORY_TOTAL", interaction.guild.id, { memory: (heapTotal / 1024 / 1024).toFixed(0) })}
        ${client.language.getString("STATS_MEMORY_USED", interaction.guild.id, { memory: (heapUsed / 1024 / 1024).toFixed(0) })}
        ${client.language.getString("STATS_OS", interaction.guild.id, { os: process.platform, release })}
        ${client.language.getString("STATS_DISCORD_JS", interaction.guild.id, { version: discord_version })}
        ${client.language.getString("STATS_NODE", interaction.guild.id, { version: process.version })}
        ${client.language.getString("STATS_CPU", interaction.guild.id, { cpu: cpus()[0].model })}
        `
      )
      .addFields(
        {
          name: client.language.getString("STATS_COMMANDS", interaction.guild.id),
          value: [
            client.language.getString("STATS_TEXT_COMMANDS", interaction.guild.id, { count: client.commands.size }),
            client.language.getString("STATS_SLASH_COMMANDS", interaction.guild.id, { count: SlashCommands }),
          ].join("\n"),
          inline: true,
        },
        {
          name: client.language.getString("STATS_GUILDS", interaction.guild.id),
          value: `\`\`\`${client.guilds.cache.size}\`\`\``,
        },
        {
          name: client.language.getString("STATS_CHANNELS", interaction.guild.id),
          value: `\`\`\`${client.channels.cache.size}\`\`\``,
        },
        {
          name: client.language.getString("STATS_MEMBERS", interaction.guild.id),
          value: `\`\`\`${members}\`\`\``,
        }
      );

    interaction.reply({
      content: client.language.getString("STATS_VIEWING", interaction.guild.id, { 
        username: client.user.username, 
        user: interaction.user.username 
      }),
      embeds: [embed],
    });
  },
};
