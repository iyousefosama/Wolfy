const schema = require('../../schema/Economy-Schema')
const { profileImage } = require("discord-arts");

/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
  name: "profile",
  aliases: [],
  dmOnly: false, //or false
  guildOnly: true, //or false
  args: false, //or false
  usage: '',
  group: 'Economy',
  description: 'Shows your profile card!',
  cooldown: 2, //seconds(s)
  guarded: false,
  requiresDatabase: true,
  permissions: [],
  examples: [''],
  async execute(client, message, [member = '']) {

    member = member.match(/\d{17,18}/)?.[0] || message.member.id;
    member = await message.guild.members.fetch(member).catch(() => message.member);

    if (member.user.bot) {
      return message.channel.send(`\\❌ Bots cannot earn XP!`);
    };

    message.channel.sendTyping()
    let data;
    try {
      data = await schema.findOne({
        userID: member.id
      })
      if (!data) {
        data = await schema.create({
          userID: member.id
        })
      }
    } catch (err) {
      console.log(err)
    }

    try {
      const profileData = {
        username: member.user.username,
        avatar: member.user.displayAvatarURL({ extension: 'png' }),
        bio: data.profile.bio || 'No bio set',
        balance: `${data.credits || '0'} credits`,
        bankBalance: `${data.Bank?.balance?.credits || '0'} credits`,
        birthday: data.profile.birthday || 'Not set',
        tips: data.tips?.received || '0',
        background: data.profile.ProfileBackground || 'https://i.imgur.com/Ry73PG3.jpg'
      };

      const buffer = await profileImage(member.id, {
        customBackground: profileData.background,
        borderColor: data.profile.color || '#5C5959'
      });

      return await message.channel.send({
        files: [{
          attachment: buffer,
          name: 'profile.png'
        }],
        embeds: [{
          title: `${member.user.username}'s Profile`,
          description: `**Bio:** ${profileData.bio}\n**Birthday:** ${profileData.birthday}\n**Tips Received:** ${profileData.tips}`,
          color: parseInt((data.profile.color || '#5C5959').replace('#', ''), 16),
          fields: [
            { name: '💰 Wallet', value: profileData.balance, inline: true },
            { name: '🏦 Bank', value: profileData.bankBalance, inline: true }
          ],
          thumbnail: { url: profileData.avatar }
        }]
      });
    } catch (err) {
      console.error('Error generating profile:', err);
      return message.channel.send('❌ Failed to generate profile image');
    }
  }
}