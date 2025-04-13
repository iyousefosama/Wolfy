const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ChannelType } = require('discord.js');
const moment = require('moment');
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
    const createdTime = moment(guild.createdTimestamp).format('LT');
    const createdDate = moment(guild.createdTimestamp).format('LL');
    const createdRelative = moment(guild.createdTimestamp).fromNow();

    const pages = new Page(
      new EmbedBuilder()
        .setURL(icon)
        .setThumbnail(icon)
        .setTimestamp()
        .setDescription([
          client.language.getString("SERVER_STATS_GENERAL", guild.id, { name }),
          client.language.getString("SERVER_STATS_NAME", guild.id, { name }),
          client.language.getString("SERVER_STATS_ID", guild.id, { id: guild.id }),
          client.language.getString("SERVER_STATS_OWNER", guild.id, { owner }),
          client.language.getString("SERVER_STATS_REGION", guild.id, { region: formatRegion }),
          client.language.getString("SERVER_STATS_BOOST_TIER", guild.id, { tier: formatBoostTier }),
          client.language.getString("SERVER_STATS_VERIFICATION", guild.id, { level: formatVerificationLevel }),
          client.language.getString("SERVER_STATS_BOOST_LEVEL", guild.id, { level: formatBoostLevel }),
          client.language.getString("SERVER_STATS_CREATED_AT", guild.id, { 
            time: createdTime, 
            date: createdDate, 
            relative: createdRelative 
          })
        ].join('\n')),
      new EmbedBuilder()
        .setURL(icon)
        .setThumbnail(icon)
        .setTimestamp()
        .setDescription([
          client.language.getString("SERVER_STATS_DETAILS", guild.id, { name }),
          client.language.getString("SERVER_STATS_ROLE_COUNT", guild.id, { count: roles.length }),
          client.language.getString("SERVER_STATS_EMOJI_COUNT", guild.id, { count: emojis.size }),
          client.language.getString("SERVER_STATS_NORMAL_EMOJI", guild.id, { count: emojis.filter(emoji => !emoji.animated).size }),
          client.language.getString("SERVER_STATS_ANIMATED_EMOJI", guild.id, { count: emojis.filter(emoji => emoji.animated).size }),
          client.language.getString("SERVER_STATS_MEMBER_COUNT", guild.id, { count: memberCount }),
          client.language.getString("SERVER_STATS_HUMANS", guild.id, { count: members.filter(member => !member.user.bot).size }),
          client.language.getString("SERVER_STATS_BOTS", guild.id, { count: members.filter(member => member.user.bot).size }),
          client.language.getString("SERVER_STATS_TEXT_CHANNELS", guild.id, { count: channels.filter(channel => channel.type === ChannelType.GuildText).size }),
          client.language.getString("SERVER_STATS_VOICE_CHANNELS", guild.id, { count: channels.filter(channel => channel.type === ChannelType.GuildVoice).size })
        ].join('\n'))
    );

    const createRow = () => {
      const button = new ButtonBuilder()
        .setLabel(client.language.getString("SERVER_STATS_BUTTON_PREV", guild.id))
        .setCustomId("prevPage")
        .setStyle('Primary')
        .setEmoji("890490643548352572");

      const buttonmid = new ButtonBuilder()
        .setLabel(`${pages.currentIndex + 1}/${pages.size}`)
        .setCustomId("currentPage")
        .setStyle('Secondary')
        .setDisabled(true);

      const button2 = new ButtonBuilder()
        .setLabel(client.language.getString("SERVER_STATS_BUTTON_NEXT", guild.id))
        .setCustomId("nextPage")
        .setStyle('Primary')
        .setEmoji("890490558492061736");

      return new ActionRowBuilder().addComponents(button, buttonmid, button2);
    };

    const msg = await interaction.reply({
      embeds: [pages.currentPage],
      components: [createRow()],
      fetchReply: true
    });

    const filter = i => i.user.id === interaction.user.id;
    const collector = msg.createMessageComponentCollector({ filter, time: 180000 });

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
