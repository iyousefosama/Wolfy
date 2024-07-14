const discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ChannelType } = require('discord.js')
const https = require('https');

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "avatar",
    description: "Replies with avatar!",
    dmOnly: false,
    guildOnly: true,
    cooldown: 0,
    group: "Utility",
    clientPermissions: [
      "EmbedLinks",
      "AttachFiles"
    ],
    permissions: [],
    options: [
      {
        type: 1,
        name: 'user',
        description: 'Get a user avatar',
        options: [
          {
            type: 6,
            name: 'target',
            description: 'The user'
          }
        ]
      },
      {
        type: 1,
        name: 'server',
        description: 'get the server avatar'
      }
    ]
  },
  async execute(client, interaction) {
    let user = interaction.options.getUser('target');

    let color;

    if (user) {
      color = '#ed7947';
    } else {
      color = '738ADB';
      user = interaction.user;
    };

    let avatar = user.displayAvatarURL({ extension: 'gif', dynamic: true, size: 1024 });

    if (interaction.options.getSubcommand() === 'server' && interaction.guild) {
      if (interaction.channel.type != ChannelType.GuildText) {
        return interaction.reply({ content: `\\❌ | ${interaction.user}, This option can only be used in text channels!`, ephemeral: true })
      }
      let avatarserver = new EmbedBuilder()
        .setColor("#ed7947")
        .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL() })
        .setDescription(`[**${interaction.guild.name}** avatar link](${interaction.guild.iconURL({ extension: 'png', dynamic: true, size: 1024 })})`)
        .setURL(interaction.guild.iconURL())
        .setImage(interaction.guild.iconURL({ dynamic: true, extension: 'png', size: 1024 }))
        .setURL(interaction.guild.iconURL({ extension: 'png', dynamic: true, size: 1024 }))
        .setImage(interaction.guild.iconURL({ extension: 'png', dynamic: true, size: 1024 }))
        .setFooter({ text: interaction.user.tag + ` | \©️${new Date().getFullYear()} Wolfy`, iconURL: interaction.user.avatarURL({ dynamic: true }) })
        .setTimestamp()
      interaction.reply({ embeds: [avatarserver] })
    } else if (interaction.options.getSubcommand() === 'user') {
      https
        .request(avatar, { method: 'HEAD' }, (response) => {
          if (response.statusCode !== 200) {
            avatar = user.displayAvatarURL({ dynamic: true, size: 1024, extension: 'png' || 'jpg' });
          } else if (response.headers['content-type'].startsWith('image/')) {
            // Do nothing here...
          } else {
            avatar = user.displayAvatarURL({ dynamic: true, size: 1024, extension: 'jpg' || 'png' });
          }

          if (!avatar) return interaction.reply({ content: `\\❌ | ${interaction.user}, I can't find an avatar for this user!` })

          const embed = new EmbedBuilder()
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setColor(color)
            .setDescription(`[**${user.tag}** avatar link](${avatar})`)
            .setURL(avatar)
            .setImage(avatar)
            .setFooter({ text: user.username + `\'s avatar | \©️${new Date().getFullYear()} Wolfy`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
            .setTimestamp()
          interaction.reply({ embeds: [embed] })
        })
        .on('error', (error) => {
          console.error(error);
          return interaction.reply({ content: `\\❌ | ${interaction.user}, Something went wrong, please try again later!` })
        })
        .end()
    } else {
      https
        .request(avatar, { method: 'HEAD' }, (response) => {
          if (response.statusCode !== 200) {
            avatar = user.displayAvatarURL({ dynamic: true, size: 1024, extension: 'png' || 'jpg' });
          } else if (response.headers['content-type'].startsWith('image/')) {
            // Do nothing here...
          } else {
            avatar = user.displayAvatarURL({ dynamic: true, size: 1024, extension: 'jpg' || 'png' });
          }

          if (!avatar) return interaction.reply({ content: `\\❌ | ${interaction.user}, I can't find an avatar for this user!` })

          const embed = new EmbedBuilder()
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setColor(color)
            .setDescription(`[**${user.tag}** avatar link](${avatar})`)
            .setURL(avatar)
            .setImage(avatar)
            .setFooter({ text: user.username + `\'s avatar | \©️${new Date().getFullYear()} Wolfy`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
            .setTimestamp()
          interaction.reply({ embeds: [embed] })
        })
        .on('error', (error) => {
          console.error(error);
          return interaction.reply({ content: `\\❌ | ${interaction.user}, Something went wrong, please try again later!` })
        })
        .end()
    }
  }
};