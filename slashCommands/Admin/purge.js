const { EmbedBuilder } = require('discord.js');
const { colors } = require('../../util/constants/constants');

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "purge",
    description: "Delete a specific number of messages from a user",
    dmOnly: false,
    guildOnly: true,
    cooldown: 5,
    group: "Moderation",
    clientPermissions: ["ManageMessages"],
    permissions: ["ManageMessages"],
    options: [
      {
        type: 6, // USER
        name: 'user',
        description: 'The user whose messages to delete',
        required: true
      },
      {
        type: 4, // INTEGER
        name: 'amount',
        description: 'Number of messages to delete (2-100)',
        required: true,
        min_value: 2,
        max_value: 100
      }
    ]
  },
  async execute(client, interaction) {
    const { guild, channel } = interaction;
    const user = interaction.options.getUser("user");
    const amount = interaction.options.getInteger("amount");
    
    if (!user.id.match(/\d{17,19}/)) {
      return interaction.reply({ 
        content: "❌ Please provide a valid Discord ID!", 
        flags: ['Ephemeral'] 
      });
    }
    
    try {
      const member = await guild.members.fetch(user.id);
      
      // Check if trying to purge owner's messages
      if (member.id === guild.ownerId) {
        return interaction.reply({ 
          content: "❌ You cannot purge the server owner's messages!", 
          flags: ['Ephemeral'] 
        });
      }
      
      // Validate amount
      if (amount < 2 || amount > 100) {
        return interaction.reply({ 
          content: "❌ Please provide a number of messages between 2 and 100!", 
          flags: ['Ephemeral'] 
        });
      }
      
      // Defer reply since message fetching might take time
      await interaction.deferReply({ flags: ['Ephemeral'] });
      
      // Fetch messages
      const messages = await channel.messages.fetch({ limit: 100 });
      
      // Filter messages by the specified user and not pinned
      const userMessages = messages.filter(m => m.author.id === user.id && !m.pinned);
      
      // Limit to the specified amount
      const messagesToDelete = userMessages.first(amount);
      
      if (messagesToDelete.length === 0) {
        return interaction.editReply(`❌ No messages to delete from **${user.tag}**!`);
      }
      
      // Bulk delete messages
      await channel.bulkDelete(messagesToDelete, true);
      
      const embed = new EmbedBuilder()
        .setColor(colors.ADMIN)
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 }) })
        .setDescription(`✅ Successfully purged **${messagesToDelete.length}** messages from **${user.tag}**!`)
        .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 }) })
        .setTimestamp();
      
      return interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      return interaction.editReply(`❌ I couldn't purge messages from **${user.tag}**!`);
    }
  },
};
