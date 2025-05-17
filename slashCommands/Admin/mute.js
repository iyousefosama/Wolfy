const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ChannelType } = require('discord.js');
const schema = require('../../schema/Mute-Schema');

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "mute",
    description: "Mute someone from texting!",
    dmOnly: false,
    guildOnly: true,
    cooldown: 3,
    group: "Moderation",
    clientPermissions: ["ManageRoles", "ManageChannels"],
    permissions: ["ManageRoles"],
    options: [
      {
        type: 6, // USER
        name: 'target',
        description: 'The user to mute',
        required: true
      },
      {
        type: 3, // STRING
        name: 'reason',
        description: 'The reason for the mute',
        required: false
      }
    ]
  },
  async execute(client, interaction) {
    const { guild, options } = interaction;
    const user = options.getUser("target");
    const reason = options.getString("reason") || 'Unspecified';

    if (!user.id.match(/\d{17,19}/)) {
      return interaction.reply({ content: client.language.getString("NO_ID", interaction.guildId, { action: "MUTE" }), ephemeral: true });
    };

    const member = await guild.members
      .fetch(user.id.match(/\d{17,19}/)[0])
      .catch(() => null);

    if (!member) {
      return interaction.reply({ content: client.language.getString("USER_NOT_FOUND", interaction.guildId), ephemeral: true });
    } else if (member.id === interaction.user.id) {
      return interaction.reply({ content: client.language.getString("CANNOT_MODERATE_SELF", interaction.guildId, { action: "MUTE" }), ephemeral: true });
    } else if (member.id === client.user.id) {
      return interaction.reply({ content: client.language.getString("CANNOT_MODERATE_BOT", interaction.guildId, { action: "MUTE" }), ephemeral: true });
    } else if (member.id === guild.ownerId) {
      return interaction.reply({ content: client.language.getString("CANNOT_MODERATE_OWNER", interaction.guildId, { action: "MUTE" }), ephemeral: true });
    } else if (client.owners.includes(member.id)) {
      return interaction.reply({ content: client.language.getString("CANNOT_MODERATE_DEV", interaction.guildId, { action: "MUTE" }), ephemeral: true });
    } else if (interaction.member.roles.highest.position <= member.roles.highest.position) {
      return interaction.reply({ content: client.language.getString("CANNOT_MODERATE_HIGHER", interaction.guildId, { action: "MUTE" }), ephemeral: true });
    }

    let data;
    try {
      data = await schema.findOne({
        guildId: interaction.guildId,
        userId: member.id
      });
      
      if (!data) {
        data = await schema.create({
          guildId: interaction.guildId,
          userId: member.id
        });
      }
    } catch (err) {
      console.log(err);
      return interaction.reply({ content: `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`, ephemeral: true });
    }

    // Check if member is already muted
    if (member.roles.cache.find(r => r.name.toLowerCase() === 'muted') && data?.Muted == true) {
      return interaction.reply({ content: client.language.getString("ALREADY_MUTED", interaction.guildId), ephemeral: true });
    }

    let mutedRole = guild.roles.cache.find(roles => roles.name.toLowerCase() === "muted");
    
    // If there's no muted role, create one
    if (!mutedRole) {
      const button = new ButtonBuilder()
        .setLabel(`Yes`)
        .setCustomId("create_mute_role")
        .setStyle('Success')
        .setEmoji("758141943833690202");
      
      const button2 = new ButtonBuilder()
        .setLabel(`No`)
        .setCustomId("cancel_mute_cmd")
        .setStyle('Danger')
        .setEmoji("888264104081522698");
      
      const row = new ActionRowBuilder()
        .addComponents(button, button2);
      
      const Embed = new EmbedBuilder()
        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 }) })
        .setTimestamp()
        .setDescription(client.language.getString("NO_MUTE_ROLE", interaction.guildId))
        .setColor('Red');
      
      const response = await interaction.reply({ embeds: [Embed], components: [row], fetchReply: true });
      
      const collector = response.createMessageComponentCollector({ time: 15000 });
      
      collector.on('collect', async (buttonInteraction) => {
        // Check if the user who clicked the button is the one who initiated the command
        if (buttonInteraction.user.id !== interaction.user.id) {
          return buttonInteraction.reply({ content: client.language.getString("NOT_COMMAND_USER", interaction.guildId), ephemeral: true });
        }
        
        if (buttonInteraction.customId === 'create_mute_role') {
          if (guild.roles.cache.size >= 250) {
            return buttonInteraction.reply({ 
              content: client.language.getString("TOO_MANY_ROLES", interaction.guildId), 
              ephemeral: true 
            });
          }
          
          if (!interaction.channel.permissionsFor(guild.members.me).has('ManageChannels')) {
            return buttonInteraction.reply({ 
              content: client.language.getString("MISSING_PERMISSIONS", interaction.guildId, { permission: "ManageChannels" }), 
              ephemeral: true 
            });
          }
          
          try {
            // Create muted role
            mutedRole = await guild.roles.create({
              name: 'Muted',
              color: '#646060',
              permissions: []
            });
            
            // Update channel permissions for the muted role
            guild.channels.cache.forEach(async channel => {
              if (channel.type === ChannelType.GuildText) {
                await channel.permissionOverwrites.edit(mutedRole, {
                  'SendMessages': false,
                  'AddReactions': false,
                  'Connect': false,
                  'Speak': false
                });
              }
            });
            
            await buttonInteraction.reply({ 
              content: client.language.getString("ROLE_CREATED", interaction.guildId, { role: mutedRole.name }), 
              ephemeral: true 
            });
            
            // Mute the member
            await member.roles.add(mutedRole, `Wolfy MUTE: ${interaction.user.tag}: ${reason}`);
            data.Muted = true;
            await data.save();
            
            const muteEmbed = new EmbedBuilder()
              .setAuthor({ name: member.user.username, iconURL: member.user.displayAvatarURL({ dynamic: true, size: 2048 }) })
              .setDescription(client.language.getString("MUTE_UNMUTE_SUCCESS", interaction.guildId, { 
                action_done: "muted", 
                user: member.user.toString(),
                reason: reason
              }))
              .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 }) })
              .setTimestamp();
            
            await interaction.editReply({ embeds: [muteEmbed], components: [] });
          } catch (error) {
            console.error(error);
            return buttonInteraction.reply({ 
              content: client.language.getString("CANNOT_MODERATE", interaction.guildId, { action: "MUTE" }), 
              ephemeral: true 
            });
          }
        } else if (buttonInteraction.customId === 'cancel_mute_cmd') {
          await buttonInteraction.reply({ 
            content: client.language.getString("COMMAND_CANCELLED", interaction.guildId, { command: "mute" }), 
            ephemeral: true 
          });
          
          // Disable buttons
          button.setDisabled(true);
          button2.setDisabled(true);
          const newRow = new ActionRowBuilder().addComponents(button, button2);
          await interaction.editReply({ embeds: [Embed], components: [newRow] });
        }
      });
      
      collector.on('end', async (collected) => {
        if (collected.size === 0) {
          // Disable buttons when collector expires
          button.setDisabled(true);
          button2.setDisabled(true);
          const newRow = new ActionRowBuilder().addComponents(button, button2);
          await interaction.editReply({ embeds: [Embed], components: [newRow] });
        }
      });
    } else {
      // If muted role exists, just add it to the member
      try {
        await member.roles.add(mutedRole, `Wolfy MUTE: ${interaction.user.tag}: ${reason}`);
        data.Muted = true;
        await data.save();
        
        const muteEmbed = new EmbedBuilder()
          .setAuthor({ name: member.user.username, iconURL: member.user.displayAvatarURL({ dynamic: true, size: 2048 }) })
          .setDescription(client.language.getString("MUTE_UNMUTE_SUCCESS", interaction.guildId, { 
            action_done: "muted", 
            user: member.user.toString(),
            reason: reason
          }))
          .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 }) })
          .setTimestamp();
        
        return interaction.reply({ embeds: [muteEmbed] });
      } catch (error) {
        console.error(error);
        return interaction.reply({ 
          content: client.language.getString("CANNOT_MODERATE", interaction.guildId, { action: "MUTE" }), 
          ephemeral: true 
        });
      }
    }
  },
}; 