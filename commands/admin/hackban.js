const discord = require('discord.js');

module.exports = {
    name: "hackban",
    aliases: ["HackBan", "HACKBAN"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<user> <reason>',
    cooldown: 1, //seconds(s)
    guarded: false, //or false
    permissions: ["BAN_MEMBERS", "ADMINISTRATOR"],
    clientpermissions: ["BAN_MEMBERS", "ADMINISTRATOR"],
    async execute(client, message, [user = '', ...reason] ) {
        const owner = client.users.fetch('829819269806030879').catch(() => null);

        if (!user.match(/\d{17,19}/)){
            return message.channel.send(`<a:Wrong:812104211361693696> | ${message.author}, Please provide the ID of the user to ban.`);
          };
      
          user = await client.users
          .fetch(user.match(/\d{17,19}/)[0])
          .catch(() => null);
      
          if (!user){
            return message.channel.send(`<a:Wrong:812104211361693696> | ${message.author}, User could not be found! Please ensure the supplied ID is valid.`);
          };
      
          if (user.id === message.guild.ownerID){
            return message.channel.send(`<a:Wrong:812104211361693696> | ${message.author}, You cannot ban a server owner!`);
          };
      
          member = await message.guild.members
          .fetch(user.id)
          .catch(() => false);
      
          if (!!member){
            return message.channel.send(`<a:Wrong:812104211361693696> | ${message.author}, Hackban will skip a role validation check! Please use \`ban\` command instead if the user is in your server.`);
          };
      
          if (user.id === message.author.id){
            return message.channel.send(`<a:Wrong:812104211361693696> | ${message.author}, You cannot ban yourself!`);
          };
      
          if (user.id === client.user.id){
            return message.channel.send(`<a:Wrong:812104211361693696> | ${message.author}, Please don't ban me!`);
          };
      
          if (user.id === owner){
            return message.channel.send(`<a:Wrong:812104211361693696> | ${message.author}, No, you can't ban my developers through me!`)
          };
      
          await message.channel.send(`Are you sure you want to ban **${user.tag}** from this server? (y/n)`)
      
          const filter = _message => message.author.id === _message.author.id && ['y','n','yes','no'].includes(_message.content.toLowerCase());
          const options = { max: 1, time: 30000, errors: ['time'] };
      
          const proceed = await message.channel.awaitMessages(filter, options)
          .then(collected => ['y','yes'].includes(collected.first().content.toLowerCase()) ? true : false)
          .catch(() => false);
      
          if (!proceed){
            return message.channel.send(`<:cancel:767062250279927818> | ${message.author}, cancelled the hackban command!`);
          };
      
          return message.guild.members.ban(user, { reason: `Wolfy Hackban Command: ${message.author.tag}: ${reason.join(' ') || 'Unspecified'}`})
          .then(_user => message.channel.send(`<a:Wrong:812104211361693696> Successfully banned **${_user.tag}** from this server!`))
          .catch(() => message.channel.send(`Failed to ban **${user.tag}**!`));
    }
}