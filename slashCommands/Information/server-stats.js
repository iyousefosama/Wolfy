const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ChannelType, ButtonStyle } = require('discord.js');
const dayjs = require("dayjs");
const relativeTime = require('dayjs/plugin/relativeTime');
const localizedFormat = require('dayjs/plugin/localizedFormat');
dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
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
        .setURL(icon || 'https://discord.com')
        .setThumbnail(icon)
        .setTimestamp()
        .setDescription([
          `**${name} General stats**\n`,
          `🇳 **Name:** ${name}`,
          `🆔 **ID:** ${guild.id}`,
          `👑 **Owner:** ${owner.user.tag}`,
          `🌐 **Region:** ${formatRegion}`,
          `📊 **Boost Tier:** ${formatBoostTier}`,
          `🛡️ **Verification Level:** ${formatVerificationLevel}`,
          `🚀 **Boost Level:** ${formatBoostLevel}`,
          `📆 **Created At:** ${createdTime} ${createdDate} (${createdRelative})`
        ].join('\n')),
      new EmbedBuilder()
        .setURL(icon || 'https://discord.com')
        .setThumbnail(icon)
        .setTimestamp()
        .setDescription([
          `**${name} stats**\n`, // Fixed %name% placeholder
          `🏷️ **Role Count:** ${roles.length}`,
          `😀 **Emoji Count:** ${emojis.size}`,
          `😀 **Normal Emoji Count:** ${emojis.filter(emoji => !emoji.animated).size}`,
          `🏷️ **Animated Emoji Count:** ${emojis.filter(emoji => emoji.animated).size}`,
          `👥 **Member Count:** ${memberCount}`,
          `👥 **Humans:** ${members.filter(member => !member.user.bot).size}`,
          `🤖 **Bots:** ${members.filter(member => member.user.bot).size}`,
          `⌨️ **Text Channels:** ${channels.filter(channel => channel.type === ChannelType.GuildText).size}`,
          `🎤 **Voice Channels:** ${channels.filter(channel => channel.type === ChannelType.GuildVoice).size}`
        ].join('\n'))
    );

    const createRow = () => {
      const button = new ButtonBuilder()
        .setLabel("Prev")
        .setCustomId("prevPage")
        .setStyle(ButtonStyle.Primary) // Fixed style enum
        .setEmoji("◀️");

      const buttonmid = new ButtonBuilder()
        .setLabel(`${pages.currentIndex + 1}/${pages.size}`)
        .setCustomId("currentPage")
        .setStyle(ButtonStyle.Secondary) // Fixed style enum
        .setDisabled(true);

      const button2 = new ButtonBuilder()
        .setLabel("Next")
        .setCustomId("nextPage")
        .setStyle(ButtonStyle.Primary) // Fixed style enum
        .setEmoji("▶️");

      return new ActionRowBuilder().addComponents(button, buttonmid, button2);
    };

    const msg = await interaction.reply({
      embeds: [pages.currentPage],
      components: [createRow()],
      fetchReply: true // Fixed fetchReply requirement
    });

    const filter = i => i.user.id === interaction.user.id;
    // Fixed method name for Discord.js v14
    const collector = msg.createMessageComponentCollector({ filter, time: 180000 });

    collector.on('collect', async interactionCreate => {
      await interactionCreate.deferUpdate();
      if (interactionCreate.customId === 'prevPage') {
        // Using interaction.editReply to handle the edit safely
        interaction.editReply({
          embeds: [pages.previous()],
          components: [createRow()]
        });
      } else if (interactionCreate.customId === 'nextPage') {
        interaction.editReply({
          embeds: [pages.next()],
          components: [createRow()]
        });
      }
    });

    collector.on('end', async () => {
      // Fixed the undefined bug caused by .forEach
      const disabledRow = createRow();
      disabledRow.components.forEach(button => button.setDisabled(true));
      
      interaction.editReply({ 
        components: [disabledRow] 
      }).catch(() => null);
    });
  }
};