const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const { colors } = require('../../util/constants/constants');

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
        type: ApplicationCommandOptionType.User,
        name: 'user',
        description: 'The user to send the DM to',
        required: true
      },
      {
        type: ApplicationCommandOptionType.String,
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
        content: "❌ You can't send an empty message!", 
        flags: ['Ephemeral'] 
      });
    }
    
    const dmembed = new EmbedBuilder()
      .setAuthor({ 
        name: interaction.user.username, 
        iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 })
      })
      .setColor(colors.ADMIN)
      .setDescription(`📩 **${interaction.user.username}**: ${message}`)
      .setTimestamp()
      .setFooter({ 
        text: interaction.guild?.name, 
        iconURL: interaction.guild?.iconURL({ dynamic: true, size: 2048 }) 
      });
    
    try {
      await user.send({ embeds: [dmembed] });
      
      const successEmbed = new EmbedBuilder()
        .setColor(colors.SUCCESS)
        .setDescription(`✅ Successfully sent a DM to **${user.username}**!`)
        .setTimestamp();
      
      return interaction.reply({ embeds: [successEmbed], flags: ['Ephemeral'] });
    } catch {
      const errorEmbed = new EmbedBuilder()
        .setColor(colors.ERROR)
        .setDescription(`❌ I couldn't send a DM to **${user.username}**! They might have DMs turned off.`)
        .setTimestamp();
      
      return interaction.reply({ embeds: [errorEmbed], flags: ['Ephemeral'] });
    }
  },
};
