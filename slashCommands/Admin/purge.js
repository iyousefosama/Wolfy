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
        content: client.language.getString("INVALID_ID", interaction.guild.id),
        ephemeral: true 
      });
    }
    
    try {
      const member = await guild.members.fetch(user.id);
      
      // Check if trying to purge owner's messages
      if (member.id === guild.ownerId) {
        return interaction.reply({ 
          content: client.language.getString("CANNOT_MODERATE_OWNER", interaction.guild.id, { action: "PURGE" }),
          ephemeral: true 
        });
      }
      
      // Validate amount
      if (amount < 2 || amount > 100) {
        return interaction.reply({ 
          content: client.language.getString("INVALID_AMOUNT", interaction.guild.id, { min: 2, max: 100 }), 
          ephemeral: true 
        });
      }
      
      // Defer reply since message fetching might take time
      await interaction.deferReply({ ephemeral: true });
      
      // Fetch messages
      const messages = await channel.messages.fetch({ limit: 100 });
      
      // Filter messages by the specified user and not pinned
      const userMessages = messages.filter(m => m.author.id === user.id && !m.pinned);
      
      // Limit to the specified amount
      const messagesToDelete = userMessages.first(amount);
      
      if (messagesToDelete.length === 0) {
        return interaction.editReply(
          client.language.getString("NO_MESSAGES_TO_DELETE", interaction.guild.id, { user: user.tag })
        );
      }
      
      // Bulk delete messages
      await channel.bulkDelete(messagesToDelete, true);
      
      return interaction.editReply(
        client.language.getString("PURGE_SUCCESS", interaction.guild.id, { 
          amount: messagesToDelete.length, 
          user: user.tag 
        })
      );
    } catch (error) {
      console.error(error);
      return interaction.editReply(
        client.language.getString("PURGE_ERROR", interaction.guild.id, { user: user.tag })
      );
    }
  },
}; 