const { EmbedBuilder } = require('discord.js');

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "dm",
    description: "Send a direct message to a user through the bot",
    dmOnly: false,
    guildOnly: true,
    cooldown: 10,
    group: "Moderation",
    clientPermissions: [],
    permissions: ["Administrator"],
    options: [
      {
        type: 6, // USER
        name: 'user',
        description: 'The user to send the DM to',
        required: true
      },
      {
        type: 3, // STRING
        name: 'message',
        description: 'The message to send to the user',
        required: true
      }
    ]
  },
  async execute(client, interaction) {
    const user = interaction.options.getUser("user");
    const message = interaction.options.getString("message");
    
    if (!message.trim()) {
      return interaction.reply({ 
        content: client.language.getString("EMPTY_MESSAGE", interaction.guild.id), 
        ephemeral: true 
      });
    }
    
    const dmEmbed = new EmbedBuilder()
      .setAuthor({ 
        name: interaction.user.username, 
        iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 })
      })
      .setColor('Aqua')
      .setDescription(`<a:Notification:811283631380234250> **${interaction.user.username}**: ${message}`)
      .setTimestamp()
      .setFooter({ 
        text: interaction.guild.name, 
        iconURL: interaction.guild.iconURL({ dynamic: true }) 
      });
    
    try {
      await user.send({ embeds: [dmEmbed] });
      
      const successEmbed = new EmbedBuilder()
        .setColor('Green')
        .setDescription(client.language.getString("MOD_DM_SUCCESS", interaction.guild.id, { user: user.username }));
      
      return interaction.reply({ embeds: [successEmbed] });
    } catch (error) {
      const errorEmbed = new EmbedBuilder()
        .setColor('Red')
        .setDescription(client.language.getString("MOD_DM_ERROR", interaction.guild.id, { user: user.username }));
      
      return interaction.reply({ embeds: [errorEmbed] });
    }
  },
}; 