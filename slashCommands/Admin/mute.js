const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ChannelType } = require('discord.js');
const { colors } = require('../../util/constants/constants');
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
      return interaction.reply({ content: "❌ Please type the id or mention the user to **mute**.", flags: ['Ephemeral'] });
    };

    const member = await guild.members
      .fetch(user.id.match(/\d{17,19}/)[0])
      .catch(() => null);

    if (!member) {
      return interaction.reply({ content: "❌ User could not be found! Please ensure the supplied ID is valid.", flags: ['Ephemeral'] });
    } else if (member.id === interaction.user.id) {
      return interaction.reply({ content: "❌ You cannot **mute** yourself!", flags: ['Ephemeral'] });
    } else if (member.id === client.user.id) {
      return interaction.reply({ content: "❌ You cannot **mute** me!", flags: ['Ephemeral'] });
    } else if (member.id === guild.ownerId) {
      return interaction.reply({ content: "❌ You cannot **mute** a server owner!", flags: ['Ephemeral'] });
    } else if (client.owners.includes(member.id)) {
      return interaction.reply({ content: "❌ You cannot **mute** my developer through me!", flags: ['Ephemeral'] });
    } else if (interaction.member.roles.highest.position <= member.roles.highest.position) {
      return interaction.reply({ content: "❌ You can't **mute** that user because he/she has a higher role than yours!", flags: ['Ephemeral'] });
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

    // Check if member is already muted
    if (member.roles.cache.find(r => r.name.toLowerCase() === 'muted') && data?.Muted == true) {
      return interaction.reply({ content: "❌ User is already **muted**!", flags: ['Ephemeral'] });
    }

    let mutedRole = guild.roles.cache.find(roles => roles.name.toLowerCase() === "muted");
    
    // If there's no muted role, create one
    if (!mutedRole) {
      const button = new ButtonBuilder()
        .setLabel(`Yes`)
        .setCustomId("create_mute_role")
        .setStyle('Success')
        .setEmoji("✅");
      
      const button2 = new ButtonBuilder()
        .setLabel(`No`)
        .setCustomId("cancel_mute_cmd")
        .setStyle('Danger')
        .setEmoji("❌");
      
      const row = new ActionRowBuilder()
        .addComponents(button, button2);
      
      const Embed = new EmbedBuilder()
        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 }) })
        .setTimestamp()
        .setDescription("ℹ️ There is no `muted` role in this guild. Would you like to generate one?")
        .setColor(colors.ADMIN);
      
      const response = await interaction.reply({ embeds: [Embed], components: [row], withResponse: true });
      
      const collector = response.createComponentCollector({ time: 15000 });
      
      collector.on('collect', async (buttonInteraction) => {
        // Check if the user who clicked the button is the one who initiated the command
        if (buttonInteraction.user.id !== interaction.user.id) {
          return buttonInteraction.reply({ content: "❌ You are not the one who initiated this command!", flags: ['Ephemeral'] });
        }
        
        if (buttonInteraction.customId === 'create_mute_role') {
          if (guild.roles.cache.size >= 250) {
            return buttonInteraction.reply({ 
              content: "❌ Failed to create `muted` role! Your server has too many roles! **[250]**", 
              flags: ['Ephemeral'] 
            });
          }
          
          if (!interaction.channel.permissionsFor(guild.members.me).has('ManageChannels')) {
            return buttonInteraction.reply({ 
              content: "❌ I don't have permission to manage channels!", 
              flags: ['Ephemeral'] 
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
              content: "✅ Muted role created successfully!", 
              flags: ['Ephemeral'] 
            });
            
            // Mute the member
            await member.roles.add(mutedRole, `Wolfy MUTE: ${interaction.user.tag}: ${reason}`);
            data.Muted = true;
            await data.save();
            
            const muteEmbed = new EmbedBuilder()
              .setColor(colors.ADMIN)
              .setAuthor({ name: member.user.username, iconURL: member.user.displayAvatarURL({ dynamic: true, size: 2048 }) })
              .setDescription(`✅ Successfully **muted** ${member.user.toString}!`)
              .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 }) })
              .setTimestamp();
            
            await interaction.editReply({ embeds: [muteEmbed], components: [] });
          } catch (error) {
            console.error(error);
            return buttonInteraction.reply({ 
              content: "❌ I couldn't **mute** that user!", 
              flags: ['Ephemeral'] 
            });
          }
        } else if (buttonInteraction.customId === 'cancel_mute_cmd') {
          await buttonInteraction.reply({ 
            content: "❌ Command cancelled!", 
            flags: ['Ephemeral'] 
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
          .setColor(colors.ADMIN)
          .setAuthor({ name: member.user.username, iconURL: member.user.displayAvatarURL({ dynamic: true, size: 2048 }) })
          .setDescription(`✅ Successfully **muted** ${member.user.toString}!`)
          .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 }) })
          .setTimestamp();
        
        return interaction.reply({ embeds: [muteEmbed] });
      } catch (error) {
        console.error(error);
        return interaction.reply({ 
          content: "❌ I couldn't **mute** that user!", 
          flags: ['Ephemeral'] 
        });
      }
    }
  },
};
