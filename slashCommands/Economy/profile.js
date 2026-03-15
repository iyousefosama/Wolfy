const schema = require('../../schema/Economy-Schema')
const { SlashCommandBuilder } = require("@discordjs/builders");
const { Profile } = require("discord-arts");
const { AttachmentBuilder } = require('discord.js');

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "profile",
    description: "Shows your profile card or another user's profile",
    dmOnly: false,
    guildOnly: true,
    cooldown: 2,
    group: "Economy",
    requiresDatabase: true,
    clientPermissions: [],
    permissions: [],
    options: [
      {
        name: "user",
        description: "The user whose profile you want to view",
        type: 6, // USER
        required: false
      }
    ]
  },
  async execute(client, interaction) {
    // Get the target user from options or default to the interaction user
    const member = interaction.options.getMember("user") || interaction.member;

    if (member.user.bot) {
      return interaction.reply({ 
        content: `\\❌ Bots cannot earn XP!`,
        ephemeral: true 
      });
    }

    // Defer the reply to show that the command is processing
    await interaction.deferReply();
    
    let data;
    try {
      data = await schema.findOne({
        userID: member.id
      });
      if (!data) {
        data = await schema.create({
          userID: member.id
        });
      }
    } catch (err) {
      return interaction.editReply({
        content: client.language.getString("ERR_DB", interaction.guild?.id, { error: err.name })
      });
    }

    try {
      const profileData = {
        username: member.user.username,
        avatar: member.user.displayAvatarURL({ extension: 'png' }),
        bio: data.profile.bio || 'No bio set',
        balance: `${data.credits || '0'} credits`,
        bankBalance: `${data.Bank?.balance?.credits || '0'} credits`,
        birthday: data.profile?.birthday || 'Not set',
        tips: data.tips?.received || '0',
        background: data.profile?.ProfileBackground || 'https://i.imgur.com/Ry73PG3.jpg'
      };

      const buffer = await Profile(member.id, {
        customBackground: profileData.background,
        borderColor: data.profile?.color || '#5C5959',
        presenceStatus: member.presence?.status || 'online'
      });

      const attachment = new AttachmentBuilder(buffer, { name: 'profile.png' });
      
      // Also send an embed with additional profile info
      const embed = {
        title: `${member.user.username}'s Profile`,
        description: `**Bio:** ${profileData.bio}\n**Birthday:** ${profileData.birthday}\n**Tips Received:** ${profileData.tips}`,
        color: parseInt((data.profile.color || '#5C5959').replace('#', ''), 16),
        fields: [
          { name: '💰 Wallet', value: profileData.balance, inline: true },
          { name: '🏦 Bank', value: profileData.bankBalance, inline: true }
        ],
        thumbnail: { url: profileData.avatar }
      };

      await interaction.editReply({ 
        files: [attachment], 
        embeds: [embed] 
      });

    } catch (err) {
      console.error('Error generating profile:', err);
      return interaction.editReply({
        content: '❌ Failed to generate profile image'
      });
    }
  },
}; 