const { EmbedBuilder } = require('discord.js');
const { colors } = require('../../util/constants/constants');
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
      return interaction.reply({ content: "❌ Please type the id or mention the user to unmute.", flags: ['Ephemeral'] });
    };

    const member = await guild.members
      .fetch(user.id.match(/\d{17,19}/)[0])
      .catch(() => null);

    if (!member) {
      return interaction.reply({ content: "❌ User could not be found! Please ensure the supplied ID is valid.", flags: ['Ephemeral'] });
    } else if (member.id === interaction.user.id) {
      return interaction.reply({ content: "❌ You cannot unmute yourself!", flags: ['Ephemeral'] });
    } else if (member.id === client.user.id) {
      return interaction.reply({ content: "❌ You cannot unmute me!", flags: ['Ephemeral'] });
    } else if (interaction.member.roles.highest.position <= member.roles.highest.position) {
      return interaction.reply({ content: "❌ You can't unmute that user because he/she has a higher role than yours!", flags: ['Ephemeral'] });
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
      return interaction.reply({ content: "`❌ [DATABASE_ERR]:` The database responded with an error!", flags: ['Ephemeral'] });
    }

    let mutedRole = guild.roles.cache.find(roles => roles.name.toLowerCase() === "muted");
    
    if (!mutedRole) {
      return interaction.reply({ content: "❌ There is no muted role in this guild!", flags: ['Ephemeral'] });
    }
    
    if (!member.roles.cache.find(r => r.name.toLowerCase() === 'muted') && data?.Muted !== true) {
      return interaction.reply({ content: "❌ User is already unmuted!", flags: ['Ephemeral'] });
    }

    try {
      await member.roles.remove(mutedRole, `Wolfy UNMUTE: ${interaction.user.tag}`);
      data.Muted = false;
      await data.save();
      
      const unmute = new EmbedBuilder()
        .setColor(colors.ADMIN)
        .setAuthor({ name: member.user.username, iconURL: member.user.displayAvatarURL({ dynamic: true, size: 2048 }) })
        .setDescription(`✅ Successfully **unmuted** ${member.user.toString}!`)
        .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 }) })
        .setTimestamp();
      
      return interaction.reply({ embeds: [unmute] });
    } catch (error) {
      return interaction.reply({ 
        content: "❌ I couldn't unmute that user!", 
        flags: ['Ephemeral'] 
      });
    }
  },
}; 
