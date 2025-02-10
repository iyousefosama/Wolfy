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
      .setTitle(`${client.user.username} Links`)
      .setDescription(
        `<a:Cookie:853495749370839050> **Hey, ${interaction.user.username}**, here are some special links for you!\n\nYou can support our bot by voting for it on top.gg.`
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
      { label: 'Support', Url: client.config.websites["support"], style: 'Link', emoji: '853495153280155668' },
      { label: 'Add wolfy', Url: client.config.websites["invite"], style: 'Link', emoji: '841711382739157043' },
      { label: 'Top.gg', Url: client.config.websites["top.gg"], style: 'Link', emoji: '853496052899381258' },
      { label: 'DASHBOARD', Url: client.config.websites["website"], style: 'Link', emoji: '853495912775942154' },
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
