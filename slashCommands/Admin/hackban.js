const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "hackban",
    description: "Ban a user that is not in the server by ID",
    dmOnly: false,
    guildOnly: true,
    cooldown: 3,
    group: "Moderation",
    clientPermissions: ["BanMembers"],
    permissions: ["BanMembers"],
    options: [
      {
        type: 3, // STRING
        name: 'userid',
        description: 'The ID of the user to ban',
        required: true
      },
      {
        type: 3, // STRING
        name: 'reason',
        description: 'The reason for the ban',
        required: false
      }
    ]
  },
  async execute(client, interaction) {
    const { guild } = interaction;
    const userId = interaction.options.getString("userid");
    const reason = interaction.options.getString("reason") || 'Unspecified';
    
    if (!userId.match(/\d{17,19}/)) {
      return interaction.reply({ 
        content: client.language.getString("INVALID_ID", interaction.guildId),
        ephemeral: true 
      });
    }
    
    try {
      // Try to fetch the user
      const user = await client.users.fetch(userId.match(/\d{17,19}/)[0]);
      
      // Check if user is in the server
      const member = await guild.members.fetch(user.id).catch(() => null);
      
      if (member) {
        return interaction.reply({ 
          content: client.language.getString("USER_IN_SERVER", interaction.guildId, { command: "ban" }),
          ephemeral: true 
        });
      }
      
      // Check if user is the owner
      if (user.id === guild.ownerId) {
        return interaction.reply({ 
          content: client.language.getString("CANNOT_MODERATE_OWNER", interaction.guildId, { action: "BAN" }),
          ephemeral: true 
        });
      }
      
      // Check if user is the command executor
      if (user.id === interaction.user.id) {
        return interaction.reply({ 
          content: client.language.getString("CANNOT_MODERATE_SELF", interaction.guildId, { action: "BAN" }),
          ephemeral: true 
        });
      }
      
      // Check if user is the bot
      if (user.id === client.user.id) {
        return interaction.reply({ 
          content: client.language.getString("CANNOT_MODERATE_BOT", interaction.guildId, { action: "BAN" }),
          ephemeral: true 
        });
      }
      
      // Check if user is a developer
      if (client.owners.includes(user.id)) {
        return interaction.reply({ 
          content: client.language.getString("CANNOT_MODERATE_DEV", interaction.guildId, { action: "BAN" }),
          ephemeral: true 
        });
      }
      
      // Create confirmation buttons
      const confirmButton = new ButtonBuilder()
        .setLabel(client.language.getString("BUTTON_CONFIRM", interaction.guildId))
        .setCustomId('confirm_hackban')
        .setStyle('Success')
        .setEmoji('812104211386728498');
      
      const cancelButton = new ButtonBuilder()
        .setLabel(client.language.getString("BUTTON_CANCEL", interaction.guildId))
        .setCustomId('cancel_hackban')
        .setStyle('Danger')
        .setEmoji('812104211361693696');
      
      const row = new ActionRowBuilder()
        .addComponents(confirmButton, cancelButton);
      
      const confirmEmbed = new EmbedBuilder()
        .setColor('Red')
        .setDescription(client.language.getString("CONFIRMATION_MESSAGE", interaction.guildId, { target: user.tag, action: "HACKBAN" }))
        .setFooter({ 
          text: interaction.user.tag, 
          iconURL: interaction.user.displayAvatarURL({ dynamic: true })
        });
      
      const response = await interaction.reply({ 
        embeds: [confirmEmbed], 
        components: [row],
        fetchReply: true
      });
      
      // Create collector for button interactions
      const collector = response.createMessageComponentCollector({ 
        time: 30000 // 30 seconds
      });
      
      collector.on('collect', async (buttonInteraction) => {
        // Ensure the user who clicked is the command user
        if (buttonInteraction.user.id !== interaction.user.id) {
          return buttonInteraction.reply({ 
            content: client.language.getString("NOT_COMMAND_USER", interaction.guildId),
            ephemeral: true 
          });
        }
        
        if (buttonInteraction.customId === 'confirm_hackban') {
          try {
            await guild.members.ban(user.id, { 
              reason: `Wolfy Hackban Command: ${interaction.user.tag}: ${reason}` 
            });
            
            const banEmbed = new EmbedBuilder()
              .setColor('Green')
              .setDescription(client.language.getString("MODERATED_SUCCESSFULLY", interaction.guildId, { action_done: "HACKBAN", target: user.username }));
            
            // Update the original message
            await buttonInteraction.update({ 
              embeds: [banEmbed], 
              components: [] 
            });
          } catch (error) {
            await buttonInteraction.update({ 
              content: `Failed to ban **${user.tag}**!`,
              embeds: [],
              components: [] 
            });
          }
        } else if (buttonInteraction.customId === 'cancel_hackban') {
          const cancelEmbed = new EmbedBuilder()
            .setColor('Red')
            .setDescription(client.language.getString("CANCELLED_ACTION", interaction.guildId, { action: "HACKBAN" }));
          
          await buttonInteraction.update({ 
            embeds: [cancelEmbed], 
            components: [] 
          });
        }
      });
      
      collector.on('end', async (collected) => {
        if (collected.size === 0) {
          // If no buttons were clicked, disable them
          confirmButton.setDisabled(true);
          cancelButton.setDisabled(true);
          const disabledRow = new ActionRowBuilder().addComponents(confirmButton, cancelButton);
          
          const timeoutEmbed = new EmbedBuilder()
            .setColor('Red')
            .setDescription(client.language.getString("INTERACTION_TIMEOUT", interaction.guildId, { action: "HACKBAN" }));
          
          await interaction.editReply({ 
            embeds: [timeoutEmbed], 
            components: [disabledRow] 
          });
        }
      });
      
    } catch (error) {
      // If user could not be found
      return interaction.reply({ 
        content: client.language.getString("USER_NOT_FOUND", interaction.guildId),
        ephemeral: true 
      });
    }
  },
}; 