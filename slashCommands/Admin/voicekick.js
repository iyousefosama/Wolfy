const { EmbedBuilder } = require('discord.js');
const { colors } = require('../../util/constants/constants');

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
          content: "❌ You need to be in a voice channel to kick everyone!",
          ephemeral: true 
        });
      }
      
      if (voiceChannel.members.size <= 1) {
        return interaction.reply({ 
          content: "❌ There are no other members in this voice channel!",
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
        const embed = new EmbedBuilder()
          .setColor(colors.ADMIN)
          .setTitle("✅ Voice Kick Successful")
          .setDescription("Successfully kicked everyone from the voice channel!")
          .setTimestamp();
        return interaction.reply({ embeds: [embed] });
      } catch (error) {
        return interaction.reply({ 
          content: "❌ There was an error while kicking users from the voice channel!",
          ephemeral: true 
        });
      }
    }
    
    // Handle specific user kick
    if (!target.match(/\d{17,19}/)) {
      return interaction.reply({ 
        content: "❌ Please provide a valid user ID or mention!",
        ephemeral: true 
      });
    }
    
    const targetMember = await guild.members
      .fetch(target.match(/\d{17,19}/)[0])
      .catch(() => null);
    
    if (!targetMember) {
      return interaction.reply({ 
        content: "❌ User not found!",
        ephemeral: true 
      });
    } else if (targetMember.id === interaction.user.id) {
      return interaction.reply({ 
        content: "❌ You can't kick yourself!",
        ephemeral: true 
      });
    } else if (targetMember.id === client.user.id) {
      return interaction.reply({ 
        content: "❌ You can't kick me!",
        ephemeral: true 
      });
    } else if (targetMember.id === guild.ownerId) {
      return interaction.reply({ 
        content: "❌ You can't kick the server owner!",
        ephemeral: true 
      });
    } else if (client.owners.includes(targetMember.id)) {
      return interaction.reply({ 
        content: "❌ You can't kick my developer!",
        ephemeral: true 
      });
    } else if (interaction.member.roles.highest.position <= targetMember.roles.highest.position) {
      return interaction.reply({ 
        content: "❌ You can't kick that user because they have a higher role!",
        ephemeral: true 
      });
    }
    
    // Check if user is in a voice channel
    if (!targetMember.voice.channel) {
      return interaction.reply({ 
        content: "❌ That user is not in a voice channel!",
        ephemeral: true 
      });
    }
    
    try {
      await targetMember.voice.setChannel(null);
      const embed = new EmbedBuilder()
        .setColor(colors.ADMIN)
        .setTitle("✅ Voice Kick Successful")
        .setDescription(`Successfully kicked **${targetMember.user.username}** from the voice channel!`)
        .setTimestamp();
      return interaction.reply({ embeds: [embed] });
    } catch (error) {
      return interaction.reply({ 
        content: "❌ There was an error while kicking that user!",
        ephemeral: true 
      });
    }
  }
};
