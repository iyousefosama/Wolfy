const { EmbedBuilder } = require('discord.js');
const schema = require('../../schema/Mute-Schema');

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "unmute",
    description: "Unmute someone from texting!",
    dmOnly: false,
    guildOnly: true,
    cooldown: 3,
    group: "Moderation",
    clientPermissions: ["ManageRoles"],
    permissions: ["ManageRoles"],
    options: [
      {
        type: 6, // USER
        name: 'target',
        description: 'The user to unmute',
        required: true
      }
    ]
  },
  async execute(client, interaction) {
    const { guild, options } = interaction;
    const user = options.getUser("target");

    if (!user.id.match(/\d{17,19}/)) {
      return interaction.reply({ content: client.language.getString("NO_ID", interaction.guild.id, { action: "UNMUTE" }), ephemeral: true });
    };

    const member = await guild.members
      .fetch(user.id.match(/\d{17,19}/)[0])
      .catch(() => null);

    if (!member) {
      return interaction.reply({ content: client.language.getString("USER_NOT_FOUND", interaction.guild.id), ephemeral: true });
    } else if (member.id === interaction.user.id) {
      return interaction.reply({ content: client.language.getString("CANNOT_MODERATE_SELF", interaction.guild.id, { action: "UNMUTE" }), ephemeral: true });
    } else if (member.id === client.user.id) {
      return interaction.reply({ content: client.language.getString("CANNOT_MODERATE_BOT", interaction.guild.id, { action: "UNMUTE" }), ephemeral: true });
    } else if (interaction.member.roles.highest.position <= member.roles.highest.position) {
      return interaction.reply({ content: client.language.getString("CANNOT_MODERATE_HIGHER", interaction.guild.id, { action: "UNMUTE" }), ephemeral: true });
    }

    let data;
    try {
      data = await schema.findOne({
        guildId: interaction.guild.id,
        userId: member.id
      });
      
      if (!data) {
        data = await schema.create({
          guildId: interaction.guild.id,
          userId: member.id
        });
      }
    } catch (err) {
      console.log(err);
      return interaction.reply({ content: `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`, ephemeral: true });
    }

    let mutedRole = guild.roles.cache.find(roles => roles.name.toLowerCase() === "muted");
    
    if (!mutedRole) {
      return interaction.reply({ content: client.language.getString("NO_MUTED_ROLE", interaction.guild.id), ephemeral: true });
    }
    
    if (member.roles.cache.find(r => r.name.toLowerCase() !== 'muted' && data?.Muted !== true)) {
      return interaction.reply({ content: client.language.getString("ALREADY_UNMUTED", interaction.guild.id), ephemeral: true });
    }

    try {
      await member.roles.remove(mutedRole, `Wolfy UNMUTE: ${interaction.user.tag}`);
      data.Muted = false;
      await data.save();
      
      const unmute = new EmbedBuilder()
        .setAuthor({ name: member.user.username, iconURL: member.user.displayAvatarURL({ dynamic: true, size: 2048 }) })
        .setDescription(client.language.getString("MUTE_UNMUTE_SUCCESS", interaction.guild.id, { 
          action_done: "unmuted", 
          user: member.user.toString()
        }))
        .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 }) })
        .setTimestamp();
      
      return interaction.reply({ embeds: [unmute] });
    } catch (error) {
      return interaction.reply({ 
        content: client.language.getString("CANNOT_MODERATE", interaction.guild.id, { action: "UNMUTE" }), 
        ephemeral: true 
      });
    }
  },
}; 