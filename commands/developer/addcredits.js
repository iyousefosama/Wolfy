const discord = require('discord.js')
const schema = require('../../schema/Economy-Schema')

module.exports = {
    name: "addcredits",
    aliases: ["Addcredits", "ADDCREDITS"],
    dmOnly: false, //or false
    guildOnly: false, //or false
    args: true, //or false
    usage: '<user>',
    group: 'developer',
    cooldown: 5, //seconds(s)
    guarded: false, //or false
    OwnerOnly: true,
    clientpermissions: ["USE_EXTERNAL_EMOJIS", "VIEW_CHANNEL"],
    async execute(client, message, [user='', amount=''] ) {

    if (!user.match(/\d{17,19}/)){
        return message.channel.send({ content: `<a:pp802:768864899543466006> Please provide the ID of the user or mention!`});
      };
  
      user = await client.users
      .fetch(user.match(/\d{17,19}/)[0])
      .catch(() => null);

      amount = Math.round(amount.split(',').join('')) || 'Nothing';

      if (!user){
        return message.channel.send({ content: `<a:Wrong:812104211361693696> | ${message.author}, User could not be found! Please ensure the supplied ID is valid.`});
      };

      if (user.id === message.author.id){
        return message.channel.send({ content: `<a:Wrong:812104211361693696> | ${message.author}, You cannot add credits to yourself!`});
      };
  
      if (user.id === client.user.id){
        return message.channel.send({ content: `<a:Wrong:812104211361693696> | ${message.author}, You cannot add credits to me!`});
      };
      if(!amount || amount === 'Nothing' || isNaN(amount)) {
        return message.channel.send(`\\❌ **${message.author.tag}**, \`${amount}\` is not a valid amount!`);
      } else if(amount < 100 || amount > 50000) {
        return message.channel.send(`\\❌ **${message.author.tag}**, only valid amount to add is between **100** and **50,000**!`);
      }

      try{
        data = await schema.findOne({
            userID: user.id
        })
        if(!data) {
        data = await schema.create({
            userID: user.id
        })
        }
    } catch(err) {
        console.log(err)
    }

    data.credits += Math.floor(amount);
    return data.save()
    .then(()=> message.channel.send(`\\✔️ **${message.author.tag}**, Successfully added \`${Math.floor(amount)}\` to **${user}**!`))
    .catch(err => message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: \`${err.name}\``));
    }
}