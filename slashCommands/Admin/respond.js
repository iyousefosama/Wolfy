const { EmbedBuilder } = require('discord.js');
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
        content: client.language.getString("REASON_TOO_LONG", interaction.guildId, { max: 1024 }),
        ephemeral: true 
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
          content: client.language.getString("NO_SUGGESTION_CHANNEL", interaction.guildId, { command: "setSuggch" }),
          ephemeral: true 
        });
      }
    } catch (err) {
      console.log(err);
      return interaction.reply({ 
        content: `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`,
        ephemeral: true 
      });
    }
    
    const channelID = data.Mod.Suggestion.channel;
    
    if (!channelID) {
      return interaction.reply({ 
        content: client.language.getString("NO_SUGGESTION_CHANNEL", interaction.guildId, { command: "setSuggch" }),
        ephemeral: true 
      });
    }
    
    const channel = guild.channels.cache.get(channelID);
    
    if (!channel) {
      return interaction.reply({ 
        content: client.language.getString("SUGGESTION_CHANNEL_NOT_FOUND", interaction.guildId, { command: "setSuggch" }),
        ephemeral: true 
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
          content: client.language.getString("SUGGESTION_NOT_FOUND", interaction.guildId),
          ephemeral: true 
        });
      }
      
      // Check if suggestion already has a response
      if (suggestion.embeds[0].fields.length > 1) {
        return interaction.reply({ 
          content: client.language.getString("SUGGESTION_ALREADY_RESPONDED", interaction.guildId),
          ephemeral: true 
        });
      }
      
      // Check if the bot can edit the message
      if (!suggestion.editable) {
        return interaction.reply({ 
          content: client.language.getString("SUGGESTION_NOT_EDITABLE", interaction.guildId),
          ephemeral: true 
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
        .setColor(action === 'accept' ? 'DarkGreen' : 'Red')
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
        content: client.language.getString("SUGGESTION_RESPONDED", interaction.guildId, { action: action }),
        ephemeral: true 
      });
      
    } catch (error) {
      console.error(error);
      return interaction.reply({ 
        content: client.language.getString("SUGGESTION_RESPONSE_ERROR", interaction.guildId),
        ephemeral: true 
      });
    }
  },
}; 