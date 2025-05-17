/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "voicekick",
    description: "Kick users from voice channels",
    dmOnly: false,
    guildOnly: true,
    cooldown: 3,
    group: "Moderation",
    clientPermissions: ["MoveMembers"],
    permissions: ["MoveMembers"],
    options: [
      {
        type: 3, // STRING
        name: 'target',
        description: 'The user to kick from voice channel or "all" to kick everyone',
        required: true
      }
    ]
  },
  async execute(client, interaction) {
    const { guild, member } = interaction;
    const target = interaction.options.getString("target");
    
    // Handle "all" case to kick everyone from the voice channel
    if (target.toLowerCase() === "all") {
      const voiceChannel = member.voice.channel;
      
      if (!voiceChannel) {
        return interaction.reply({ 
          content: client.language.getString("NO_VOICE_CHANNEL", interaction.guildId), 
          ephemeral: true 
        });
      }
      
      if (voiceChannel.members.size <= 1) {
        return interaction.reply({ 
          content: client.language.getString("NO_MEMBERS_IN_VOICE", interaction.guildId), 
          ephemeral: true 
        });
      }
      
      // Kick all members from the voice channel
      const kickPromises = [];
      
      for (const [id, user] of voiceChannel.members) {
        // Skip the command user if they're in the voice channel
        if (id !== member.id) {
          kickPromises.push(user.voice.setChannel(null));
        }
      }
      
      try {
        await Promise.all(kickPromises);
        return interaction.reply(client.language.getString("VOICE_KICK_ALL_SUCCESS", interaction.guildId));
      } catch (error) {
        return interaction.reply({ 
          content: client.language.getString("VOICE_KICK_ERROR", interaction.guildId), 
          ephemeral: true 
        });
      }
    }
    
    // Handle specific user kick
    if (!target.match(/\d{17,19}/)) {
      return interaction.reply({ 
        content: client.language.getString("NO_ID", interaction.guildId, { action: "VOICE_KICK" }), 
        ephemeral: true 
      });
    }
    
    const targetMember = await guild.members
      .fetch(target.match(/\d{17,19}/)[0])
      .catch(() => null);
    
    if (!targetMember) {
      return interaction.reply({ 
        content: client.language.getString("USER_NOT_FOUND", interaction.guildId), 
        ephemeral: true 
      });
    } else if (targetMember.id === interaction.user.id) {
      return interaction.reply({ 
        content: client.language.getString("CANNOT_MODERATE_SELF", interaction.guildId, { action: "VOICE_KICK" }), 
        ephemeral: true 
      });
    } else if (targetMember.id === client.user.id) {
      return interaction.reply({ 
        content: client.language.getString("CANNOT_MODERATE_BOT", interaction.guildId, { action: "VOICE_KICK" }), 
        ephemeral: true 
      });
    } else if (targetMember.id === guild.ownerId) {
      return interaction.reply({ 
        content: client.language.getString("CANNOT_MODERATE_OWNER", interaction.guildId, { action: "VOICE_KICK" }), 
        ephemeral: true 
      });
    } else if (client.owners.includes(targetMember.id)) {
      return interaction.reply({ 
        content: client.language.getString("CANNOT_MODERATE_DEV", interaction.guildId, { action: "VOICE_KICK" }), 
        ephemeral: true 
      });
    } else if (interaction.member.roles.highest.position <= targetMember.roles.highest.position) {
      return interaction.reply({ 
        content: client.language.getString("CANNOT_MODERATE_HIGHER", interaction.guildId, { action: "VOICE_KICK" }), 
        ephemeral: true 
      });
    }
    
    // Check if user is in a voice channel
    if (!targetMember.voice.channel) {
      return interaction.reply({ 
        content: client.language.getString("USER_NOT_IN_VOICE", interaction.guildId), 
        ephemeral: true 
      });
    }
    
    try {
      await targetMember.voice.setChannel(null);
      return interaction.reply(
        client.language.getString("VOICE_KICK_SUCCESS", interaction.guildId, { 
          target: targetMember.user.username 
        })
      );
    } catch (error) {
      return interaction.reply({ 
        content: client.language.getString("VOICE_KICK_ERROR", interaction.guildId), 
        ephemeral: true 
      });
    }
  },
}; 