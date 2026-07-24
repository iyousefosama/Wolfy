const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ChannelType } = require('discord.js');
const { colors } = require('../../util/constants/constants');

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "purge-channel",
    description: "Recreate the current channel without messages",
    dmOnly: false,
    guildOnly: true,
    cooldown: 20,
    group: "Moderation",
    clientPermissions: ["ManageMessages", "ManageChannels"],
    permissions: ["ManageMessages", "ManageChannels"]
  },
  async execute(client, interaction) {
    const { channel, guild } = interaction;
    
    // Check if channel is a text channel
    if (channel.type !== ChannelType.GuildText) {
      return interaction.reply({ 
        content: "❌ This command can only be used in text channels!", 
        ephemeral: true 
      });
    }
    
    // Create confirmation buttons
    const confirmButton = new ButtonBuilder()
      .setLabel('Yes')
      .setCustomId('confirm_purge_channel')
      .setStyle('Success')
      .setEmoji('✅');
    
    const cancelButton = new ButtonBuilder()
      .setLabel('No')
      .setCustomId('cancel_purge_channel')
      .setStyle('Danger')
      .setEmoji('❌');
    
    const row = new ActionRowBuilder()
      .addComponents(confirmButton, cancelButton);
    
    const confirmEmbed = new EmbedBuilder()
      .setColor(colors.ADMIN)
      .setDescription(`⚠️ Are you sure you want to purge **${channel}**? This will delete and recreate the channel!`)
      .setFooter({ 
        text: interaction.user.tag, 
        iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 })
      })
      .setTimestamp();
    
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
          content: "❌ You are not the one who executed this command!", 
          ephemeral: true 
        });
      }
      
      if (buttonInteraction.customId === 'confirm_purge_channel') {
        const nukeEmbed = new EmbedBuilder()
          .setColor(colors.ADMIN)
          .setDescription("⏱️ Purging channel in 3 seconds...");
        
        await buttonInteraction.update({ 
          embeds: [nukeEmbed], 
          components: [] 
        });
        
        // Wait 3 seconds before purging
        setTimeout(async () => {
          try {
            // Get channel properties for recreating
            const { name, parent, topic, nsfw, rateLimitPerUser, permissionOverwrites } = channel;
            
            // Create a new channel with the same properties
            const newChannel = await guild.channels.create({
              name,
              type: ChannelType.GuildText,
              parent: parent ? parent.id : null,
              topic,
              nsfw,
              rateLimitPerUser,
              permissionOverwrites: permissionOverwrites.cache
            });
            
            // Send a success message in the new channel
            const successEmbed = new EmbedBuilder()
              .setColor(colors.ADMIN)
              .setDescription(`✅ Channel purged by ${interaction.user.toString()}`)
              .setTimestamp();
            
            await newChannel.send({ embeds: [successEmbed] });
            
            // Delete the old channel
            await channel.delete();
          } catch (error) {
            console.error(error);
            
            // If there was an error, update the interaction
            const errorEmbed = new EmbedBuilder()
              .setColor(colors.ERROR)
              .setDescription("❌ There was an error while trying to purge the channel!");
            
            await buttonInteraction.editReply({ 
              embeds: [errorEmbed], 
              components: [] 
            }).catch(() => null);
          }
        }, 3000);
        
      } else if (buttonInteraction.customId === 'cancel_purge_channel') {
        const cancelEmbed = new EmbedBuilder()
          .setColor(colors.ADMIN)
          .setDescription("✅ Channel purge cancelled!")
          .setFooter({ 
            text: interaction.user.tag, 
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
          .setDescription("⏱️ Channel purge timed out!")
          .setFooter({ 
            text: interaction.user.tag, 
            iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 })
          })
          .setTimestamp();
        
        await interaction.editReply({ 
          embeds: [timeoutEmbed], 
          components: [disabledRow] 
        }).catch(() => null);
      }
    });
  },
};
