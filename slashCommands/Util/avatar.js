const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ChannelType } = require('discord.js');
const https = require('https');

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "avatar",
    description: "Replies with avatar!",
    dmOnly: false,
    guildOnly: false,
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
        description: 'Get the server avatar'
      }
    ]
  },

  async execute(client, interaction) {
    const subcommand = interaction.options.getSubcommand();
    const year = new Date().getFullYear();

    if (subcommand === 'server' && interaction.guild) {
      if (interaction.channel.type !== ChannelType.GuildText) {
        return interaction.reply({ 
          content: client.language.getString("AVATAR_SERVER_DM_ERROR", interaction.guildId, { user: interaction.user }), 
          ephemeral: true 
        });
      }

      const serverIconURL = interaction.guild.iconURL({ dynamic: true, size: 1024 });

      const embed = new EmbedBuilder()
        .setColor("#ed7947")
        .setAuthor({ name: interaction.guild.name, iconURL: serverIconURL })
        .setDescription(`[**${client.language.getString("AVATAR_SERVER_TITLE", interaction.guildId, { guildName: interaction.guild.name })}**](${serverIconURL})`)
        .setURL(serverIconURL)
        .setImage(serverIconURL)
        .setFooter({ 
          text: client.language.getString("AVATAR_SERVER_FOOTER", interaction.guildId, { user: interaction.user.tag, year }), 
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }) 
        })
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    }

    // For user avatar (either /avatar user or fallback)
    let user = interaction.options.getUser('target') || interaction.user;
    let color = user.id === interaction.user.id ? '738ADB' : '#ed7947';
    let avatarURL = user.displayAvatarURL({ dynamic: true, size: 1024, extension: 'gif' });

    https
      .request(avatarURL, { method: 'HEAD' }, (response) => {
        if (response.statusCode !== 200 || !response.headers['content-type']?.startsWith('image/')) {
          avatarURL = user.displayAvatarURL({ dynamic: true, size: 1024, extension: 'png' });
        }

        if (!avatarURL) {
          return interaction.reply({ 
            content: client.language.getString("AVATAR_NOT_FOUND", interaction.guildId, { user: interaction.user })
          });
        }

        const embed = new EmbedBuilder()
          .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
          .setColor(color)
          .setDescription(`[**${client.language.getString("AVATAR_USER_TITLE", interaction.guildId, { username: user.tag })}**](${avatarURL})`)
          .setURL(avatarURL)
          .setImage(avatarURL)
          .setFooter({ 
            text: client.language.getString("AVATAR_FOOTER", interaction.guildId, { username: user.username, year }), 
            iconURL: interaction.guild?.iconURL({ dynamic: true }) 
          })
          .setTimestamp();

        interaction.reply({ embeds: [embed] });
      })
      .on('error', (error) => {
        console.error(error);
        interaction.reply({ 
          content: client.language.getString("AVATAR_ERROR", interaction.guildId, { user: interaction.user })
        });
      })
      .end();
  }
};
