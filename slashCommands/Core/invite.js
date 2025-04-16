const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const file = new AttachmentBuilder("./assets/Images/background.gif")

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
      .setAuthor({
        name: client.user.username,
        iconURL: client.user.displayAvatarURL(),
      })
      .setTitle(client.language.getString("INVITE_TITLE", interaction.guildId, { username: client.user.username }))
      .setDescription(
        client.language.getString("INVITE_DESCRIPTION", interaction.guildId, { username: interaction.user.username })
      )
      .setThumbnail(client.user.displayAvatarURL())
      .setImage("attachment://background.gif")
      .setURL(client.config.websites["website"])
      .setTimestamp()
      .setFooter({
        text: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      });


    // Define button data in an array
    const buttonData = [
      { 
        label: client.language.getString("INVITE_BUTTON_SUPPORT", interaction.guildId), 
        Url: client.config.websites["support"], 
        style: 'Link', 
        emoji: '853495153280155668' 
      },
      { 
        label: client.language.getString("INVITE_BUTTON_ADD", interaction.guildId), 
        Url: client.config.websites["invite"], 
        style: 'Link', 
        emoji: '841711382739157043' 
      },
      { 
        label: client.language.getString("INVITE_BUTTON_TOPGG", interaction.guildId), 
        Url: client.config.websites["top.gg"], 
        style: 'Link', 
        emoji: '853496052899381258' 
      },
      { 
        label: client.language.getString("INVITE_BUTTON_DASHBOARD", interaction.guildId), 
        Url: client.config.websites["website"], 
        style: 'Link', 
        emoji: '853495912775942154' 
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
