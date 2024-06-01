const discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
  .setName("invite")
  .setDescription("Replies with bot links/invite!"),
  clientPermissions: [
    discord.PermissionsBitField.Flags.EmbedLinks,
    discord.PermissionsBitField.Flags.ReadMessageHistory,
  ],
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
      .setImage(
        "https://cdn.discordapp.com/attachments/830926767728492565/874773027177512960/c7d26cb2902f21277d32ad03e7a21139.gif"
      )
      .setURL(client.config.websites["website"])
      .setTimestamp()
      .setFooter({
        text: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      });

    const supportButton = new ButtonBuilder()
      .setStyle("Link")
      .setLabel("Support Server")
      .setEmoji("853495153280155668")
      .setURL(client.config.websites["support"]);

    const inviteButton = new ButtonBuilder()
      .setStyle("Link")
      .setLabel("Add Bot")
      .setEmoji("841711382739157043")
      .setURL(client.config.websites["invite"]);

    const voteButton = new ButtonBuilder()
      .setStyle("Link")
      .setLabel("Vote Here")
      .setEmoji("853496052899381258")
      .setURL(client.config.websites["top.gg"]);

    const websiteButton = new ButtonBuilder()
      .setStyle("Link")
      .setLabel("Bot Website")
      .setEmoji("853495912775942154")
      .setURL(client.config.websites["website"]);

    const row = new ActionRowBuilder().addComponents(
      supportButton,
      inviteButton,
      voteButton,
      websiteButton
    );

    interaction.reply({ embeds: [embed], components: [row] });
  },
};
