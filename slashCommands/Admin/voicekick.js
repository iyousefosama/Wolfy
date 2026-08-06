const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const { colors } = require('../../util/constants/constants');
const { checkModerationTarget } = require('../../util/moderation/targetChecks');

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
        type: ApplicationCommandOptionType.User,
        name: 'target',
        description: 'The user to kick from their voice channel',
        required: false
      },
      {
        type: ApplicationCommandOptionType.String,
        name: 'scope',
        description: 'Kick everyone from your current voice channel',
        required: false,
        choices: [
          {
            name: 'Everyone in my voice channel',
            value: 'all'
          }
        ]
      }
    ]
  },
  async execute(client, interaction) {
    const { member } = interaction;
    const targetUser = interaction.options.getUser("target");
    const scope = interaction.options.getString("scope");

    // Handle "all" case to kick everyone from the command user's voice channel
    if (scope === "all") {
      const voiceChannel = member.voice.channel;

      if (!voiceChannel) {
        return interaction.reply({ 
          content: "❌ You need to be in a voice channel to kick everyone!",
          flags: ['Ephemeral'] 
        });
      }
      
      if (voiceChannel.members.size <= 1) {
        return interaction.reply({ 
          content: "❌ There are no other members in this voice channel!",
          flags: ['Ephemeral'] 
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
      } catch {
        return interaction.reply({ 
          content: "❌ There was an error while kicking users from the voice channel!",
          flags: ['Ephemeral'] 
        });
      }
    }

    if (!targetUser) {
      return interaction.reply({ 
        content: "❌ Please provide a user to kick, or use `scope: all` to kick everyone!",
        flags: ['Ephemeral'] 
      });
    }

    const check = await checkModerationTarget(client, interaction, 'voicekick');
    if (!check.ok) {
      return interaction.reply({ 
        content: check.content,
        flags: ['Ephemeral'] 
      });
    }
    const { member: targetMember } = check;
    
    // Check if user is in a voice channel
    if (!targetMember.voice.channel) {
      return interaction.reply({ 
        content: "❌ That user is not in a voice channel!",
        flags: ['Ephemeral'] 
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
    } catch {
      return interaction.reply({ 
        content: "❌ There was an error while kicking that user!",
        flags: ['Ephemeral'] 
      });
    }
  }
};