const discord= require('discord.js');

module.exports = {
    name: "purge",
    aliases: ["Purge"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<quantity>',
    group: 'Moderation',
    description: 'Clear messages of the user with quantity you want (from 2 to 100)',
    cooldown: 5, //seconds(s)
    guarded: false, //or false
    permissions: ['MANAGE_MESSAGES'],
    clientPermissions: ['MANAGE_MESSAGES'],
    examples: [
      '20'],
    async execute(client, message, [member = '', ...args]) {
        let amount = args.slice(0).join(" ")

        if (!member.match(/\d{17,19}/)){
            return message.channel.send({ content: `<a:Wrong:812104211361693696> | ${message.author}, Please mention the user or provide the id to purge.`});
          };
      
          member = await message.guild.members
          .fetch(member.match(/\d{17,19}/)[0])
          .catch(() => null);
      
          if (!member){
            return message.channel.send({ content: `<a:Wrong:812104211361693696> | ${message.author}, User could not be found!`});
          };

          if (!amount  || isNaN(amount) || parseInt(amount) < 1){
            return message.channel.send({ content: `<a:Wrong:812104211361693696> | ${message.author}, Please provide a valid amount of messages to purge!`});
          };
      
          if (member.id === message.guild.ownerId){
            return message.channel.send({ content: `<a:Wrong:812104211361693696> | ${message.author}, You cannot purge a server owner!`});
          };

          if (parseInt(amount) < 2 || parseInt(amount) > 100){
            return message.reply({ content: `<a:Wrong:812104211361693696> | ${message.author}, Please provide the quantity of messages to be deleted which must be greater than two (2) and less than one hundred (100)`});
          };

          let messages = await message.channel.messages.fetch({ limit: 100 });

          messages = await messages.filter((m) => m.author.id === member.id);

          if(messages.length > amount){
              messages.length = parseInt(amount, 10);
          }
          messages = messages.filter((m) => !m.pinned);
  
          return await message.channel.bulkDelete(messages, true).then(() => {
            message.channel.send(`<a:Mod:853496185443319809> ${message.author}, Successfully cleared **${amount}** message for user \`${member.user.tag}\`!`)
          }).catch(() => message.reply(`<a:Wrong:812104211361693696> | Unable to purge message for \`${member.user.tag}\`!`));
      
}
}
