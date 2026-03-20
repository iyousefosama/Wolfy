const discord = require('discord.js')
const schema = require('../../schema/user-schema')

/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
    name: "blacklist",
    aliases: [],
    dmOnly: false,
    guildOnly: false,
    args: true,
    usage: '<user>',
    group: 'developer',
    cooldown: 5,
    guarded: false,
    ownerOnly: true,
    permissions: [],
    
    async execute(client, message, [user = '', ...reason] ) {
    if (!user.match(/\d{17,19}/)){
        return message.channel.send({ content: `<a:pp802:768864899543466006> Please provide the ID of the user or mention to blacklist!`});
      };
  
      user = await client.users
      .fetch(user.match(/\d{17,19}/)[0])
      .catch(() => null);

      if (!user){
        return message.channel.send({ content: `<a:Wrong:812104211361693696> | ${message.author}, User could not be found! Please ensure the supplied ID is valid.`});
      };

      if (user.id === message.author.id){
        return message.channel.send({ content: `<a:Wrong:812104211361693696> | ${message.author}, You cannot blacklist yourself!`});
      };
  
      if (user.id === client.user.id){
        return message.channel.send({ content: `<a:Wrong:812104211361693696> | ${message.author}, You cannot blacklist me!`});
      };

    const timestamp = Math.floor(Date.now() / 1000)

    let data;
    try {
        data = await schema.findOne({
            userId: user.id
        })
        if(!data) {
            data = await schema.create({
                userId: user.id
            })
        }
    } catch (error) {
        console.log(error)
    }

    if(data.Status.Blacklisted.current === true) {
      return message.channel.send({ content: `<a:Wrong:812104211361693696> | ${message.author}, This user is already blacklisted!\n\`\`\`diff\n+ Reason: ${data.Status.Blacklisted.reason || 'Unspecified'}\`\`\`` });
    }

    data.Status.Blacklisted.current = true;
    data.Status.Blacklisted.reason = reason.join(' ') || 'Unspecified';
    await data.save()
    .then(() => {
      client.setCachedUserData(user.id, data.toObject());
      user.send(`âŒ ${user.tag}, You are blacklisted from using wolfy bot!\n\nReason:\n ${reason.join(' ') || 'Unspecified'}`).catch(() => null)
      const done = new discord.EmbedBuilder()
      .setAuthor({ name: user.username, iconURL: user.displayAvatarURL({dynamic: true, size: 2048}) })
      .setColor(`Red`)
      .setDescription(`<a:pp399:768864799625838604> Successfully blacklisted **${user.tag}**\nâ€¢ At: <t:${timestamp}>\n\n\`\`\`${reason.join(' ') || 'Unspecified'}\`\`\``)
      .setTimestamp()
      .setFooter({ text: `BlackList | \Â©ï¸${new Date().getFullYear()} WOLFY` })
      return message.channel.send({ embeds: [done] })
      }).catch(() => message.channel.send(`\`âŒ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`));
    }
}
