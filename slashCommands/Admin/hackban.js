const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const { colors } = require('../../util/constants/constants');

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
        content: "❌ | Please provide a valid Discord ID!",
        flags: ['Ephemeral'] 
      });
    }
    
    try {
      // Try to fetch the user
      const user = await client.users.fetch(userId.match(/\d{17,19}/)[0]);
      
      // Check if user is in the server
      const member = await guild.members.fetch(user.id).catch(() => null);
      
      if (member) {
        return interaction.reply({ 
          content: "❌ | This user is in the server! Please use the regular `ban` command instead!",
          flags: ['Ephemeral'] 
        });
      }
      
      // Check if user is the owner
      if (user.id === guild.ownerId) {
        return interaction.reply({ 
          content: "❌ | You cannot hackban the server owner!",
          flags: ['Ephemeral'] 
        });
      }
      
      // Check if user is the command executor
      if (user.id === interaction.user.id) {
        return interaction.reply({ 
          content: "❌ | You cannot hackban yourself!",
          flags: ['Ephemeral'] 
        });
      }
      
      // Check if user is the bot
      if (user.id === client.user.id) {
        return interaction.reply({ 
          content: "❌ | You cannot hackban me!",
          flags: ['Ephemeral'] 
        });
      }
      
      // Check if user is a developer
      if (client.owners.includes(user.id)) {
        return interaction.reply({ 
          content: "❌ | You cannot hackban my developer!",
          flags: ['Ephemeral'] 
        });
      }
      
      // Create confirmation buttons
      const confirmButton = new ButtonBuilder()
        .setLabel("Confirm")
        .setCustomId('confirm_hackban')
        .setStyle('Success')
        .setEmoji('✅');
      
      const cancelButton = new ButtonBuilder()
        .setLabel("Cancel")
        .setCustomId('cancel_hackban')
        .setStyle('Danger')
        .setEmoji('❌');
      
      const row = new ActionRowBuilder()
        .addComponents(confirmButton, cancelButton);
      
      const confirmEmbed = new EmbedBuilder()
        .setColor(colors.ADMIN)
        .setAuthor({ name: user.username, iconURL: user.displayAvatarURL({ dynamic: true, size: 2048 }) })
        .setDescription([
          `Are you sure you want to hackban **${user.tag}**?`,
          !reason ? '' : `- Reason: ${reason}`
        ].join('\n'))
        .setFooter({ 
          text: interaction.user.username, 
          iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 })
        })
        .setTimestamp();
      
      const response = await interaction.reply({ 
        embeds: [confirmEmbed], 
        components: [row],
        withResponse: true
      });
      
      // Create collector for button interactions
      const collector = response.createComponentCollector({ 
        time: 30000 // 30 seconds
      });
      
      collector.on('collect', async (buttonInteraction) => {
        // Ensure the user who clicked is the command user
        if (buttonInteraction.user.id !== interaction.user.id) {
          return buttonInteraction.reply({ 
            content: "❌ | You are not the one who executed this command!",
            flags: ['Ephemeral'] 
          });
        }
        
        if (buttonInteraction.customId === 'confirm_hackban') {
          try {
            await guild.members.ban(user.id, { 
              reason: `Wolfy Hackban Command: ${interaction.user.tag}: ${reason}` 
            });
            
            const banEmbed = new EmbedBuilder()
              .setColor(colors.ADMIN)
              .setAuthor({ name: user.username, iconURL: user.displayAvatarURL({ dynamic: true, size: 2048 }) })
              .setDescription([
                `Successfully hackbanned **${user.username}**!`,
                !reason ? '' : `- Reason: ${reason}`
              ].join('\n'))
              .setFooter({ 
                text: interaction.user.username, 
                iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 })
              })
              .setTimestamp();
            
            // Update the original message
            await buttonInteraction.update({ 
              embeds: [banEmbed], 
              components: [] 
            });
          } catch (error) {
            await buttonInteraction.update({ 
              content: `❌ | Failed to hackban **${user.tag}**!`,
              embeds: [],
              components: [] 
            });
          }
        } else if (buttonInteraction.customId === 'cancel_hackban') {
          const cancelEmbed = new EmbedBuilder()
            .setColor(colors.ADMIN)
            .setAuthor({ name: user.username, iconURL: user.displayAvatarURL({ dynamic: true, size: 2048 }) })
            .setDescription("Hackban cancelled!")
            .setFooter({ 
              text: interaction.user.username, 
              iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 })
            })
            .setTimestamp();
          
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
            .setColor(colors.ADMIN)
            .setAuthor({ name: user.username, iconURL: user.displayAvatarURL({ dynamic: true, size: 2048 }) })
            .setDescription("Hackban cancelled due to inactivity!")
            .setFooter({ 
              text: interaction.user.username, 
              iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 })
            })
            .setTimestamp();
          
          await interaction.editReply({ 
            embeds: [timeoutEmbed], 
            components: [disabledRow] 
          });
        }
      });
      
    } catch (error) {
      // If user could not be found
      return interaction.reply({ 
        content: "❌ | User not found!",
        flags: ['Ephemeral'] 
      });
    }
  },
}; 
