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
    integration_types: [0, 1],
    contexts: [0, 1, 2],
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
        return interaction.reply({ 
          content: client.language.getString("AVATAR_SERVER_DM_ERROR", interaction.guildId, { user: interaction.user }), 
          ephemeral: true 
        })
      }
      
      const guildName = interaction.guild.name;
      const year = new Date().getFullYear();
      
      let avatarserver = new EmbedBuilder()
        .setColor("#ed7947")
        .setAuthor({ name: guildName, iconURL: interaction.guild.iconURL() })
        .setDescription(`[**${client.language.getString("AVATAR_SERVER_TITLE", interaction.guildId, { guildName })}**](${interaction.guild.iconURL({ extension: 'png', dynamic: true, size: 1024 })})`)
        .setURL(interaction.guild.iconURL())
        .setImage(interaction.guild.iconURL({ dynamic: true, extension: 'png', size: 1024 }))
        .setFooter({ 
          text: client.language.getString("AVATAR_SERVER_FOOTER", interaction.guildId, { user: interaction.user.tag, year }), 
          iconURL: interaction.user.avatarURL({ dynamic: true }) 
        })
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

          if (!avatar) return interaction.reply({ 
            content: client.language.getString("AVATAR_NOT_FOUND", interaction.guildId, { user: interaction.user })
          })

          const year = new Date().getFullYear();
          
          const embed = new EmbedBuilder()
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setColor(color)
            .setDescription(`[**${client.language.getString("AVATAR_USER_TITLE", interaction.guildId, { username: user.tag })}**](${avatar})`)
            .setURL(avatar)
            .setImage(avatar)
            .setFooter({ 
              text: client.language.getString("AVATAR_FOOTER", interaction.guildId, { username: user.username, year }), 
              iconURL: interaction.guild.iconURL({ dynamic: true }) 
            })
            .setTimestamp()
          interaction.reply({ embeds: [embed] })
        })
        .on('error', (error) => {
          console.error(error);
          return interaction.reply({ 
            content: client.language.getString("AVATAR_ERROR", interaction.guildId, { user: interaction.user })
          })
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

          if (!avatar) return interaction.reply({ 
            content: client.language.getString("AVATAR_NOT_FOUND", interaction.guildId, { user: interaction.user })
          })

          const year = new Date().getFullYear();
          
          const embed = new EmbedBuilder()
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setColor(color)
            .setDescription(`[**${client.language.getString("AVATAR_USER_TITLE", interaction.guildId, { username: user.tag })}**](${avatar})`)
            .setURL(avatar)
            .setImage(avatar)
            .setFooter({ 
              text: client.language.getString("AVATAR_FOOTER", interaction.guildId, { username: user.username, year }), 
              iconURL: interaction.guild.iconURL({ dynamic: true }) 
            })
            .setTimestamp()
          interaction.reply({ embeds: [embed] })
        })
        .on('error', (error) => {
          console.error(error);
          return interaction.reply({ 
            content: client.language.getString("AVATAR_ERROR", interaction.guildId, { user: interaction.user })
          })
        })
        .end()
    }
  }
};