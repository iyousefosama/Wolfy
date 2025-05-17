const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ChannelType } = require('discord.js');

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
        content: client.language.getString("TEXT_CHANNEL_ONLY", interaction.guildId),
        ephemeral: true 
      });
    }
    
    // Create confirmation buttons
    const confirmButton = new ButtonBuilder()
      .setLabel('Yes')
      .setCustomId('confirm_purge_channel')
      .setStyle('Success')
      .setEmoji('836169051310260265');
    
    const cancelButton = new ButtonBuilder()
      .setLabel('No')
      .setCustomId('cancel_purge_channel')
      .setStyle('Danger')
      .setEmoji('812104211361693696');
    
    const row = new ActionRowBuilder()
      .addComponents(confirmButton, cancelButton);
    
    const confirmEmbed = new EmbedBuilder()
      .setColor('Red')
      .setDescription(client.language.getString("PURGE_CHANNEL_CONFIRM", interaction.guildId, { channel: channel.toString() }))
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
      
      if (buttonInteraction.customId === 'confirm_purge_channel') {
        const nukeEmbed = new EmbedBuilder()
          .setColor('Red')
          .setDescription(client.language.getString("PURGE_CHANNEL_COUNTDOWN", interaction.guildId));
        
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
              .setColor('Green')
              .setDescription(client.language.getString("PURGE_CHANNEL_SUCCESS", interaction.guildId, { 
                user: interaction.user.toString() 
              }));
            
            await newChannel.send({ embeds: [successEmbed] });
            
            // Delete the old channel
            await channel.delete();
          } catch (error) {
            console.error(error);
            
            // If there was an error, update the interaction
            const errorEmbed = new EmbedBuilder()
              .setColor('Red')
              .setDescription(client.language.getString("PURGE_CHANNEL_ERROR", interaction.guildId));
            
            await buttonInteraction.editReply({ 
              embeds: [errorEmbed], 
              components: [] 
            }).catch(() => null);
          }
        }, 3000);
        
      } else if (buttonInteraction.customId === 'cancel_purge_channel') {
        const cancelEmbed = new EmbedBuilder()
          .setColor('Green')
          .setDescription(client.language.getString("COMMAND_CANCELLED", interaction.guildId, { command: "purge-channel" }));
        
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
          .setDescription(client.language.getString("COMMAND_TIMEOUT", interaction.guildId));
        
        await interaction.editReply({ 
          embeds: [timeoutEmbed], 
          components: [disabledRow] 
        }).catch(() => null);
      }
    });
  },
};