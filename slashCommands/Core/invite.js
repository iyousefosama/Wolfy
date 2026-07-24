const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const file = new AttachmentBuilder("./assets/Images/background.gif")
const { colors } = require("../../util/constants/constants")

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "invite",
    description: "Replies with bot links/invite!",
    dmOnly: false,
    guildOnly: false,
    cooldown: 0,
    integration_types: [0, 1],
    contexts: [0, 1, 2],
    group: "Bot",
    clientPermissions: [
        "EmbedLinks",
        "ReadMessageHistory"
    ],
    permissions: [],
    options: []
},
  async execute(client, interaction) {
    const embed = new EmbedBuilder()
      .setColor(colors.BOT)
      .setAuthor({
        name: client.user.username,
        iconURL: client.user.displayAvatarURL(),
      })
      .setTitle(`${client.user.username} Links`)
      .setDescription(
        `🍪 **Hey, ${interaction.user.username}**, here are some special links for you!\n\nYou can support our bot by voting for it on top.gg.`
      )
      .setThumbnail(client.user.displayAvatarURL())
      .setImage("attachment://background.gif")
      .setURL(client.config.websites["website"])
      .setTimestamp()
      .setFooter({
        text: `Requested by ${interaction.user.username}`,
        iconURL: interaction.user.displayAvatarURL(),
      });


    // Define button data in an array
    const buttonData = [
      { 
        label: "Support", 
        Url: client.config.websites["support"], 
        style: 'Link', 
        emoji: '🆘' 
      },
      { 
        label: "Add wolfy", 
        Url: client.config.websites["invite"], 
        style: 'Link', 
        emoji: '➕' 
      },
      { 
        label: "Top.gg", 
        Url: client.config.websites["top.gg"], 
        style: 'Link', 
        emoji: '⭐' 
      },
      { 
        label: "DASHBOARD", 
        Url: client.config.websites["website"], 
        style: 'Link', 
        emoji: '🌐' 
      },
    ];

    // Create an array to store all button builders
    const buttons = buttonData.map(data => (
        new ButtonBuilder()
            .setLabel(data.label)
            .setURL(data.Url)
            .setStyle(data.style)
            .setEmoji(data.emoji)
    ));


    const row = new ActionRowBuilder().addComponents(buttons);

    interaction.reply({ embeds: [embed], components: [row], files: [file] });
  },
};
