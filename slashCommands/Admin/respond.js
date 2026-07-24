const { EmbedBuilder } = require('discord.js');
const { colors } = require('../../util/constants/constants');
const schema = require('../../schema/GuildSchema');

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "respond",
    description: "Respond to a user suggestion",
    dmOnly: false,
    guildOnly: true,
    cooldown: 3,
    group: "Moderation",
    clientPermissions: [],
    permissions: ["Administrator"],
    options: [
      {
        type: 3, // STRING
        name: 'messageid',
        description: 'The ID of the suggestion message',
        required: true
      },
      {
        type: 3, // STRING
        name: 'action',
        description: 'Whether to accept or deny the suggestion',
        required: true,
        choices: [
          {
            name: 'Accept',
            value: 'accept'
          },
          {
            name: 'Deny',
            value: 'deny'
          }
        ]
      },
      {
        type: 3, // STRING
        name: 'reason',
        description: 'The reason for accepting or denying the suggestion',
        required: true
      }
    ]
  },
  async execute(client, interaction) {
    const { guild } = interaction;
    const messageId = interaction.options.getString("messageid");
    const action = interaction.options.getString("action");
    const reason = interaction.options.getString("reason");
    
    // Check if reason is too long
    if (reason.length > 1024) {
      return interaction.reply({ 
        content: "❌ The reason can't be longer than 1024 characters!",
        flags: ['Ephemeral'] 
      });
    }
    
    // Fetch guild data to get suggestion channel
    let data;
    try {
      data = await schema.findOne({
        GuildID: interaction.guildId
      });
      
      if (!data) {
        return interaction.reply({ 
          content: "❌ Please set a suggestion channel first!",
          flags: ['Ephemeral'] 
        });
      }
    } catch (err) {
      console.log(err);
      return interaction.reply({ 
        content: `❌ [DATABASE_ERR]: The database responded with an error! ${err.name}`,
        flags: ['Ephemeral'] 
      });
    }
    
    const channelID = data.Mod.Suggestion.channel;
    
    if (!channelID) {
      return interaction.reply({ 
        content: "❌ Please set a suggestion channel first!",
        flags: ['Ephemeral'] 
      });
    }
    
    const channel = guild.channels.cache.get(channelID);
    
    if (!channel) {
      return interaction.reply({ 
        content: "❌ The suggestion channel was not found!",
        flags: ['Ephemeral'] 
      });
    }
    
    try {
      // Fetch the suggestion message
      const suggestion = await channel.messages.fetch(messageId).catch(() => undefined);
      
      if (!suggestion || 
          suggestion.author.id !== client.user.id || 
          !suggestion.embeds.length || 
          !(suggestion.embeds[0].title || '').endsWith('Suggestion')) {
        
        return interaction.reply({ 
          content: "❌ That message is not a valid suggestion!",
          flags: ['Ephemeral'] 
        });
      }
      
      // Check if suggestion already has a response
      if (suggestion.embeds[0].fields.length > 1) {
        return interaction.reply({ 
          content: "❌ That suggestion already has a response!",
          flags: ['Ephemeral'] 
        });
      }
      
      // Check if the bot can edit the message
      if (!suggestion.editable) {
        return interaction.reply({ 
          content: "❌ I can't edit that message!",
          flags: ['Ephemeral'] 
        });
      }
      
      // Create the updated embed
      const originalEmbed = suggestion.embeds[0];
      
      // Update the first field value
      originalEmbed.fields[0].value = action === 'accept'
        ? `Accepted by **${interaction.user.tag}**`
        : `Denied by **${interaction.user.tag}**`;
      
      // Create a new embed with all the properties of the original one
      const updatedEmbed = new EmbedBuilder()
        .setTitle(originalEmbed.title)
        .setDescription(originalEmbed.description)
        .setColor(colors.ADMIN)
        .setTimestamp(new Date(originalEmbed.timestamp))
        .setFooter(originalEmbed.footer);
      
      // Add fields from original embed
      originalEmbed.fields.forEach(field => {
        updatedEmbed.addFields({ name: field.name, value: field.value });
      });
      
      // Add reason field
      updatedEmbed.addFields({ name: 'Reason', value: reason });
      
      // Edit the suggestion message
      await suggestion.edit({ embeds: [updatedEmbed] });
      
      return interaction.reply({ 
        content: `✅ Successfully ${action}ed the suggestion!`,
        flags: ['Ephemeral'] 
      });
      
    } catch (error) {
      console.error(error);
      return interaction.reply({ 
        content: "❌ There was an error while responding to the suggestion!",
        flags: ['Ephemeral'] 
      });
    }
  }
};
