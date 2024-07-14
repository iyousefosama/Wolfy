const schema = require('../../schema/Economy-Schema')
const text = require('../../util/string');

/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
    name: "transfer",
    aliases: [],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '<user> <amount>',
    group: 'Economy',
    description: 'Transfer credits from your wallet to your friends!',
    cooldown: 5, //seconds(s)
    guarded: false, //or false
    requiresDatabase: true,
    permissions: [],
    examples: [
        '@WOLF 550'
      ],
    async execute(client, message, [user='', amount='', ...args]) {

        if (!user.match(/\d{17,19}/)){
            return message.channel.send({ content: `<a:pp802:768864899543466006> Please provide the ID of the user or mention!`});
          };
      
          user = await client.users
          .fetch(user.match(/\d{17,19}/)[0])
          .catch(() => null);
    
          amount = Math.round(amount.split(',').join('')) || 'Nothing';

          const reason = args.slice(0).join(" ")
    
          if (!user){
            return message.channel.send({ content: `<a:Wrong:812104211361693696> | ${message.author}, User could not be found! Please ensure the supplied ID is valid.`});
          };
    
          if (user.id === message.author.id){
            return message.channel.send({ content: `<a:Wrong:812104211361693696> | ${message.author}, You cannot transfer credits to yourself!`});
          };
      
          if (user.id === client.user.id){
            return message.channel.send({ content: `<a:Wrong:812104211361693696> | ${message.author}, You cannot transfer credits to me!`});
          };

          if(!amount || amount === 'Nothing' || isNaN(amount)) {
            return message.channel.send(`\\❌ **${message.author.tag}**, \`${amount}\` is not a valid amount!`);
          } else if(amount < 100 || amount > 50000) {
            return message.channel.send(`\\❌ **${message.author.tag}**, only valid amount to transfer is between **100** and **50,000**!`);
          }

        let data;
        let FriendData;
        try{
            data = await schema.findOne({
                userID: message.author.id
            })
            FriendData = await schema.findOne({
                userID: user.id
            })
            if(!data) {
            data = await schema.create({
                userID: message.author.id
            })
            } else if(!FriendData) {
                FriendData = await schema.create({
                    userID: user.id
                })
            }
        } catch(err) {
            console.log(err)
        }

        if(Math.ceil(amount * 1.1) > data.credits) { 
            message.channel.send(`\\❌ **${message.author.tag}**, Insuffecient credits! You only have **${data.credits}** in your wallet! (10% fee applies)`)
        } else {
            const amountToAdd = amount / 1.1;
            await message.channel.send({ content: `<a:iNFO:853495450111967253> **${message.author.tag}**, Are you sure you want to transfer **${text.commatize(amountToAdd)}** to ${user}(10% fee applies)? Your new palance will be **${Math.floor(data.credits - (amount * 1.1))}**! \`(y/n)\``})
            const filter = _message => message.author.id === _message.author.id && ['y','n','yes','no'].includes(_message.content.toLowerCase());
        
            const proceed = await message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
            .then(collected => ['y','yes'].includes(collected.first().content.toLowerCase()) ? true : false)
            .catch(() => false);
        
            if (!proceed){
              return message.channel.send({ content: `<a:Wrong:812104211361693696> | ${message.author}, Cancelled the \`transfer\` command!`});
            };

            data.credits -= Math.floor(amount * 1.1);
            FriendData.credits += Math.floor(amountToAdd);
            user.send({ content: `\`\`\`${message.author.tag} transfered ${text.commatize(amountToAdd)} to you\n${reason ? `Said:\n${reason}\`\`\`` : "\`\`\`"}` }).catch(() => null)
            return Promise.all([ data.save(), FriendData.save() ])
            .then(()=> message.channel.send(`<a:Money:836169035191418951> **${message.author.tag}**, Successfully transferred \`${text.commatize(Math.floor(amount))}\` to **${user}**!`))
            .catch(err => message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: \`${err.name}\``));
        }
}
}