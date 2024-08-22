const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ChannelType } = require('discord.js');
const moment = require('moment');
const Page = require('../../util/Paginate');

const verificationLevels = {
  1: '<a:Error:836169051310260265> None',
  2: 'Low',
  3: 'Medium',
  4: 'High',
  5: 'Very High'
};

const regions = {
  brazil: '🇧🇷 Brazil',
  europe: '🏰 Europe',
  hongkong: '🇭🇰 Hong Kong',
  india: '🇮🇳 India',
  japan: '🇯🇵 Japan',
  russia: '🇷🇺 Russia',
  singapore: '🇸🇬 Singapore',
  southafrica: '🇿🇦 South Africa',
  sydeny: '🇦🇺 Sydney',
  'us-central': '🇺🇸 US Central',
  'us-east': '🇺🇸 US East',
  'us-west': '🇺🇸 US West',
  'us-south': '🇺🇸 US South'
};

/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
  name: "server",
  aliases: ["serverinfo", "server-stats", "si"],
  dmOnly: false,
  guildOnly: true,
  args: false,
  usage: '',
  group: 'Informations',
  description: 'Shows stats about the current server',
  cooldown: 10,
  guarded: false,
  permissions: [],
  clientPermissions: ["EmbedLinks", "UseExternalEmojis", "AttachFiles"],
  examples: [''],

  async execute(client, message, args) {
    const roles = message.guild.roles.cache
      .sort((a, b) => b.position - a.position)
      .map(role => role.toString())
      .slice(0, -1);

    const members = await message.guild.members.fetch();
    const channels = message.guild.channels.cache;
    const emojis = message.guild.emojis.cache;

    const { guild } = message;
    const { name, region, memberCount } = guild;
    const icon = guild.iconURL({ dynamic: true });
    const owner = await guild.fetchOwner();

    const pages = new Page(
      new EmbedBuilder()
        .setURL(icon)
        .setThumbnail(icon)
        .setTimestamp()
        .setDescription([`**${name} General stats**\n`,
        `🇳 **Name:** ${name}`,
        `<:pp198:853494893439352842> **ID:** ${guild.id}`,
        `<:Owner:841321887882805289> **Owner:** ${owner}`,
        `🌐 **Region:** ${regions[region] || 'Auto'}`,
        `<a:pp891:853493740579717131> **Boost Tier:** ${guild.premiumTier || 'None'}`,
        `<a:pp989:853496185443319809> **Verification Level:** ${verificationLevels[guild.verificationLevel] || "None"}`,
        `<a:server_boosting:809994218759782411> **Boost Level:** ${guild.premiumSubscriptionCount || '0'}`,
        `📆 **Created At:** ${moment(guild.createdTimestamp).format('LT')} ${moment(guild.createdTimestamp).format('LL')} ${moment(guild.createdTimestamp).fromNow()}\u200b`].join('\n')),
      new EmbedBuilder()
        .setURL(icon)
        .setThumbnail(icon)
        .setTimestamp()
        .setDescription([`**${name} stats**\n`,
        `<:pp444:853496229677629490> **Role Count:** ${roles.length}`,
        `<:pp697:853494953560375337> **Emoji Count:** ${emojis.size}`,
        `<:pp941:782762042171719731> **Normal Emoji Count:** ${emojis.filter(emoji => !emoji.animated).size}`,
        `<a:pp224:853495450111967253> **Animated Emoji Count:** ${emojis.filter(emoji => emoji.animated).size}`,
        `<a:pp754:768867196302524426> **Member Count:** ${memberCount}`,
        `<:pp833:853495153280155668> **Humans:** ${members.filter(member => !member.user.bot).size}`,
        `🤖 **Bots:** ${members.filter(member => member.user.bot).size}`,
        `⌨️ **Text Channels:** ${channels.filter(channel => channel.type === ChannelType.GuildText).size}`,
        `**Voice Channels:** ${channels.filter(channel => channel.type === ChannelType.GuildVoice).size}\u200b`].join('\n'))
    );

    const createRow = () => {
      const button = new ButtonBuilder()
        .setLabel('Prev')
        .setCustomId("prevPage")
        .setStyle('Primary')
        .setEmoji("890490643548352572");

      const buttonmid = new ButtonBuilder()
        .setLabel(`${pages.currentIndex + 1}/${pages.size}`)
        .setCustomId("currentPage")
        .setStyle('Secondary')
        .setDisabled(true);

      const button2 = new ButtonBuilder()
        .setLabel('Next')
        .setCustomId("nextPage")
        .setStyle('Primary')
        .setEmoji("890490558492061736");

      return new ActionRowBuilder().addComponents(button, buttonmid, button2);
    };

    const msg = await message.channel.send({
      embeds: [pages.currentPage],
      components: [createRow()]
    });

    const filter = i => i.user.id === message.author.id;
    const collector = msg.createMessageComponentCollector({ filter, time: 180000 });

    collector.on('collect', async interaction => {
      await interaction.deferUpdate();
      if (interaction.customId === 'prevPage') {
        msg.edit({
          embeds: [pages.previous()],
          components: [createRow()]
        });
      } else if (interaction.customId === 'nextPage') {
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
