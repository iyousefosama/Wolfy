const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ChannelType } = require('discord.js');
const dayjs = require("dayjs");
const Page = require('../../util/Paginate');
const { regions, verificationlvl } = require("../../util/constants/constants");

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "server-stats",
    description: "Shows stats about the current server",
    dmOnly: false,
    guildOnly: true,
    cooldown: 10,
    group: "Information",
    clientPermissions: ["EmbedLinks", "UseExternalEmojis", "AttachFiles"],
    permissions: [],
  },
  async execute(client, interaction) {
    const roles = interaction.guild.roles.cache
      .sort((a, b) => b.position - a.position)
      .map(role => role.toString())
      .slice(0, -1);

    const members = await interaction.guild.members.fetch();
    const channels = interaction.guild.channels.cache;
    const emojis = interaction.guild.emojis.cache;

    const { guild } = interaction;
    const { name, region, memberCount } = guild;
    const icon = guild.iconURL({ dynamic: true });
    const owner = await guild.fetchOwner();
    
    const formatRegion = regions[region] || 'Auto';
    const formatVerificationLevel = verificationlvl[guild.verificationLevel] || "None";
    const formatBoostTier = guild.premiumTier || 'None';
    const formatBoostLevel = guild.premiumSubscriptionCount || '0';
    const createdTime = dayjs(guild.createdTimestamp).format('LT');
    const createdDate = dayjs(guild.createdTimestamp).format('LL');
    const createdRelative = dayjs(guild.createdTimestamp).fromNow();

    const pages = new Page(
      new EmbedBuilder()
        .setURL(icon)
        .setThumbnail(icon)
        .setTimestamp()
        .setDescription([
          `**${name} General stats**
`,
          `🇳 **Name:** ${name}`,
          `🆔 **ID:** ${guild.id}`,
          `👑 **Owner:** %owner%`,
          `🌐 **Region:** ${formatRegion}`,
          `📊 **Boost Tier:** ${formatBoostTier}`,
          `🛡️ **Verification Level:** ${formatVerificationLevel}`,
          `🚀 **Boost Level:** ${formatBoostLevel}`,
          `📆 **Created At:** ${createdTime} ${createdDate} ${createdRelative}`
        ].join('\n')),
      new EmbedBuilder()
        .setURL(icon)
        .setThumbnail(icon)
        .setTimestamp()
        .setDescription([
          `**%name% stats**
`,
          `🏷️ **Role Count:** ${roles.length}`,
          `😀 **Emoji Count:** ${emojis.size}`,
          `😀 **Normal Emoji Count:** ${emojis.filter(emoji => !emoji.animated).size}`,
          `🏷️ **Animated Emoji Count:** ${emojis.filter(emoji => emoji.animated).size}`,
          `👥 **Member Count:** ${memberCount}`,
          `👥 **Humans:** ${members.filter(member => !member.user.bot).size}`,
          `🤖 **Bots:** ${members.filter(member => member.user.bot).size}`,
          `⌨️ **Text Channels:** ${channels.filter(channel => channel.type === ChannelType.GuildText).size}`,
          `**Voice Channels:** ${channels.filter(channel => channel.type === ChannelType.GuildVoice).size}`
        ].join('\n'))
    );

    const createRow = () => {
      const button = new ButtonBuilder()
        .setLabel("Prev")
        .setCustomId("prevPage")
        .setStyle('Primary')
        .setEmoji("◀️");

      const buttonmid = new ButtonBuilder()
        .setLabel(`${pages.currentIndex + 1}/${pages.size}`)
        .setCustomId("currentPage")
        .setStyle('Secondary')
        .setDisabled(true);

      const button2 = new ButtonBuilder()
        .setLabel("Next")
        .setCustomId("nextPage")
        .setStyle('Primary')
        .setEmoji("▶️");

      return new ActionRowBuilder().addComponents(button, buttonmid, button2);
    };

    const msg = await interaction.reply({
      embeds: [pages.currentPage],
      components: [createRow()]
    });

    const filter = i => i.user.id === interaction.user.id;
    const collector = msg.createComponentCollector({ filter, time: 180000 });

    collector.on('collect', async interactionCreate => {
      await interactionCreate.deferUpdate();
      if (interactionCreate.customId === 'prevPage') {
        msg.edit({
          embeds: [pages.previous()],
          components: [createRow()]
        });
      } else if (interactionCreate.customId === 'nextPage') {
        msg.edit({
          embeds: [pages.next()],
          components: [createRow()]
        });
      }
    });

    collector.on('end', async () => {
      const disabledRow = createRow().components.forEach(button => button.setDisabled(true));
      msg.edit({ embeds: [pages.currentPage], components: [disabledRow] }).catch(() => null);
    });
  }
};
