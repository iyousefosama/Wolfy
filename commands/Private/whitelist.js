const discord = require('discord.js')
const schema = require('../../schema/user-schema')

/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
    name: "whitelist",
    aliases: [],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<user>',
    group: 'developer',
    cooldown: 5, //seconds(s)
    guarded: false, //or false
    ownerOnly: true,
    permissions: [],
    
    async execute(client, message, [user = '', ...reason] ) {

        if (!user.match(/\d{17,19}/)){
            return message.channel.send({ content: `<a:pp802:768864899543466006> Please provide the ID of the user or mention to blacklist!` });
          };
      
          user = await client.users
          .fetch(user.match(/\d{17,19}/)[0])
          .catch(() => null);
    
          if (!user){
            return message.channel.send({ content: `<a:Wrong:812104211361693696> | ${message.author}, User could not be found! Please ensure the supplied ID is valid.` });
          };
    
          if (user.id === message.author.id){
            return message.channel.send({ content: `<a:Wrong:812104211361693696> | ${message.author}, You cannot blacklist yourself!` });
          };
      
          if (user.id === client.user.id){
            return message.channel.send({ content: `<a:Wrong:812104211361693696> | ${message.author}, You cannot blacklist me!` });
          };

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
    if(data.Status.Blacklisted.current === false) {
      return message.channel.send({ content: `<a:Wrong:812104211361693696> | ${message.author}, This user is already whitelisted!` });
    }

    data.Status.Blacklisted.current = false;
    await data.save()
    .then(() => {
      const done = new discord.EmbedBuilder()
      .setAuthor({ name: user.username, iconURL: user.displayAvatarURL({dynamic: true, size: 2048}) })
      .setColor(`GREEN`)
      .setDescription(`<a:pp399:768864799625838604> Successfully whitelisted **${user.tag}**`)
      .setFooter({ text: `Whitelist | \©️${new Date().getFullYear()} WOLFY` })
      .setTimestamp()
      return message.channel.send({ embeds: [done] })
      }).catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`));
    }
}