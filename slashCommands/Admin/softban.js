const { EmbedBuilder } = require('discord.js');
const { colors } = require('../../util/constants/constants');

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "softban",
    description: "Ban a user and delete their messages from the past 7 days, then immediately unban them",
    dmOnly: false,
    guildOnly: true,
    cooldown: 3,
    group: "Moderation",
    clientPermissions: ["BanMembers"],
    permissions: ["BanMembers"],
    options: [
      {
        type: 6, // USER
        name: 'user',
        description: 'The user to softban',
        required: true
      },
      {
        type: 3, // STRING
        name: 'reason',
        description: 'The reason for the softban',
        required: false
      }
    ]
  },
  async execute(client, interaction) {
    const { guild } = interaction;
    const user = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason") || 'No reason specified';
    
    if (!user.id.match(/\d{17,19}/)) {
      return interaction.reply({ 
        content: "❌ | Please provide a valid Discord ID!",
        ephemeral: true 
      });
    }
    
    try {
      // Try to fetch the member
      const member = await guild.members.fetch(user.id);
      
      // Check for various conditions
      if (member.id === interaction.user.id) {
        return interaction.reply({ 
          content: "❌ | You cannot softban yourself!",
          ephemeral: true 
        });
      } else if (member.id === client.user.id) {
        return interaction.reply({ 
          content: "❌ | You cannot softban me!",
          ephemeral: true 
        });
      } else if (member.id === guild.ownerId) {
        return interaction.reply({ 
          content: "❌ | You cannot softban the server owner!",
          ephemeral: true 
        });
      } else if (client.owners.includes(member.id)) {
        return interaction.reply({ 
          content: "❌ | You cannot softban my developer!",
          ephemeral: true 
        });
      } else if (interaction.member.roles.highest.position <= member.roles.highest.position) {
        return interaction.reply({ 
          content: "❌ | You can't softban that user because he/she has a higher role than yours!",
          ephemeral: true 
        });
      } else if (!member.bannable) {
        return interaction.reply({ 
          content: "❌ | I couldn't softban that user!",
          ephemeral: true 
        });
      }
      
      // Perform the softban (ban & unban)
      await interaction.deferReply(); // Defer reply as this may take a moment
      
      // Ban the user with 7 days of message deletion
      await guild.members.ban(member, { 
        reason: `Wolfy SOFTBAN: ${interaction.user.tag}: ${reason}`,
        deleteMessageSeconds: 604800 // 7 days in seconds
      });
      
      // Unban the user
      await guild.members.unban(user.id, `Wolfy SOFTBAN: ${interaction.user.tag}`);
      
      // Create and send the embed response
      const timestamp = Math.floor(Date.now() / 1000);
      const softbanEmbed = new EmbedBuilder()
        .setColor(colors.ADMIN)
        .setTimestamp()
        .setAuthor({ 
          name: user.tag, 
          iconURL: user.displayAvatarURL({ dynamic: true, size: 2048 }) 
        })
        .setDescription([
          `Successfully softbanned the user from ${interaction.guild.name}!`,
          `- Moderator: ${interaction.user.username}`,
          !reason ? '' : `- Reason: ${reason}`
        ].join('\n'))
        .setFooter({ 
          text: interaction.user.username, 
          iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 })
        });
      
      return interaction.editReply({ embeds: [softbanEmbed] });
      
    } catch (error) {
      console.error(error);
      
      // If deferred, edit reply
      if (interaction.deferred) {
        return interaction.editReply({ 
          content: `❌ | I couldn't softban **${user.tag}**!`,
          ephemeral: true 
        });
      } else {
        // If not deferred yet
        return interaction.reply({ 
          content: `❌ | I couldn't softban **${user.tag}**!`,
          ephemeral: true 
        });
      }
    }
  },
}; 
