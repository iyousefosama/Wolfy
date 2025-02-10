const discord = require('discord.js')
const { ActionRowBuilder, ButtonBuilder, AttachmentBuilder } = require('discord.js');
const file = new AttachmentBuilder("./assets/Images/background.gif")

/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
    name: "links",
    aliases: ["link", "inviteme", "invitebot", "vote", "support", "invite"],
    dmOnly: false, //or false
    guildOnly: false, //or false
    args: false, //or false
    usage: '',
    group: 'bot',
    description: 'Shows all bot special link vote/invite ..',
    cooldown: 2, //seconds(s)
    guarded: false, //or false
    permissions: [],
    clientPermissions: ["EmbedLinks", "UseExternalEmojis", "AttachFiles"],
    examples: [''],
  async execute(client, message, args) {
        message.channel.sendTyping()

        const embed = new discord.EmbedBuilder()
        .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
        .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL() })
        .setTimestamp()
        .setThumbnail(client.user.displayAvatarURL())
        .setImage("attachment://background.gif")
        .setTitle(`${client.user.username} Links`)
        .setDescription(`<a:Cookie:853495749370839050> **Hey, ${message.author.username}** that's all my special links!\n\n\`\`\`You can support our bot with voting it on top.gg\`\`\``)
        .setURL(client.config.websites["website"])


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


        const row = new ActionRowBuilder()
        .addComponents(buttons);
        message.channel.send({ embeds: [embed], components: [row], files: [file] })
    }
}