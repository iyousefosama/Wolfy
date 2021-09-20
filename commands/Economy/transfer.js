const Discord = require('discord.js');
const schema = require('../../schema/Economy-Schema')

module.exports = {
    name: "transfer",
    aliases: ["Transfer", "TRANSFER"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '<user> <amount>',
    group: 'Economy',
    description: 'Transfer credits from your wallet to your friends!',
    cooldown: 5, //seconds(s)
    guarded: false, //or false
    permissions: [],
    examples: [
        '@WOLF 550'
      ],
    async execute(client, message, args) {

        let Friend = message.mentions.members.first()
        if(!Friend) return message.channel.send({ content: `\\❌ **${message.member.displayName}**, please provide a valid channel ID.` })

        let amount = args[1]
        amount = Math.round(amount.split(',').join('')) || 'Nothing';
        if(!amount) return message.channel.send({ content: `\\❌ **${message.member.displayName}**, please provide a valid credits number.` })
        if(isNaN(amount)) return message.channel.send({ content: `\\❌ **${message.member.displayName}**, please provide a valid credits number.` })
        if(!amount || amount === 'Nothing') return message.channel.send(`\\❌ **${message.author.tag}**, \`${amount}\` is not a valid amount!`);
        if(amount < 100 || amount > 20000) return message.channel.send(`\\❌ **${message.author.tag}**, only valid amount to transfer is between **100** and **20,000**!`);

        let data;
        let FriendData;
        try{
            data = await schema.findOne({
                userID: message.author.id
            })
            FriendData = await schema.findOne({
                userID: Friend.id
            })
            if(!data) {
            data = await schema.create({
                userID: message.author.id
            })
            } else if(!FriendData) {
                FriendData = await schema.create({
                    userID: Friend.id
                })
            }
        } catch(err) {
            console.log(err)
        }
        if(Math.ceil(amount * 1.1) > data.credits) { 
            message.channel.send(`\\❌ **${message.author.tag}**, Insuffecient credits! You only have **${data.credits}** in your wallet! (10% fee applies)`)
        } else {
            await message.channel.send({ content: `<a:iNFO:853495450111967253> **${message.author.tag}**, Are you sure you want to transfer **${amount * 1.1}** to ${friend}? Your new palance will be **${data.credits - amount * 1.1}**! \`(y/n)\``})
            const filter = _message => message.author.id === _message.author.id && ['y','n','yes','no'].includes(_message.content.toLowerCase());
        
            const proceed = await message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
            .then(collected => ['y','yes'].includes(collected.first().content.toLowerCase()) ? true : false)
            .catch(() => false);
        
            if (!proceed){
              return message.channel.send({ content: `<a:Wrong:812104211361693696> | ${message.author}, Cancelled the \`transfer\` command!`});
            };

            data.credits -= Math.floor(amount * 1.1);
            FriendData.credits += Math.floor(amount);
            return Promise.all([ data.save(), FriendData.save() ])
            .then(()=> message.channel.send(`\\✔️ **${message.author.tag}**, Successfully transferred **${amount}** to **${Friend.user.username}**`))
            .catch(err => message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: \`${err.name}\``));
        }
}
}