const Discord = require('discord.js');
const schema = require('../../schema/Economy-Schema')

module.exports = {
    name: "sell",
    aliases: ["Sell", "SELL"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '',
    cooldown: 5, //seconds(s)
    guarded: false, //or false
    async execute(client, message, [item = '', ...amount]) {

        if(!item) return message.channel.send({ content: `\\❌ **${message.member.displayName}**, Please provide a valid item.` })

        if(!amount) return message.channel.send({ content: `\\❌ **${message.member.displayName}**, please provide a valid credits number.` })
        if(isNaN(amount)) return message.channel.send({ content: `\\❌ **${message.member.displayName}**, please provide a valid credits number.` })
        if(!amount || amount === 'Nothing') return message.channel.send(`\\❌ **${message.author.tag}**, \`${amount}\` is not a valid amount!`);

        let data;
        try{
            data = await schema.findOne({
                userID: message.author.id
            })
            if(!data) {
            data = await schema.create({
                userID: message.author.id
            })
        }
        } catch(err) {
            console.log(err)
        }
        let res = item.toLowerCase();
        if(res === 'coal') {
            if(data.inv.Coal < amount) return message.channel.send({ content: `\\❌ **${message.author.tag}**, Insuffecient credits! You only have **${data.credits}** in your wallet!`})
            const finall = Math.floor(amount) * 2
            data.credits += finall
            data.inv.Coal -= Math.floor(amount)
            await data.save()
            .then(()=> message.channel.send(`\\✔️ **${message.author.tag}**, Successfully sold **<:e_:887034070842900552> Coal** for <a:ShinyMoney:877975108038324224> \`+${amount * 2}\`!`))
            .catch(err => message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: \`${err.name}\``));
        } else if(res === 'stone') {
            if(data.inv.Stone < amount) return message.channel.send({ content: `\\❌ **${message.author.tag}**, Insuffecient credits! You only have **${data.credits}** in your wallet!`})
            const finall = Math.floor(amount) * 1
            data.credits += finall
            data.inv.Stone -= Math.floor(amount)
            await data.save()
            .then(()=> message.channel.send(`\\✔️ **${message.author.tag}**, Successfully sold **<:e_:887031111790764092> Stone** for <a:ShinyMoney:877975108038324224> \`+${amount * 1}\`!`))
            .catch(err => message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: \`${err.name}\``));
        } else if(res === 'iron') {
            if(data.inv.Iron < amount) return message.channel.send({ content: `\\❌ **${message.author.tag}**, Insuffecient credits! You only have **${data.credits}** in your wallet!`})
            const finall = Math.floor(amount) * 3
            data.credits += finall
            data.inv.Iron -= Math.floor(amount)
            await data.save()
            .then(()=> message.channel.send(`\\✔️ **${message.author.tag}**, Successfully sold **<:e_:887034687472689192> Iron** for <a:ShinyMoney:877975108038324224> \`+${amount * 3}\`!`))
            .catch(err => message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: \`${err.name}\``));
        } else if(res === 'gold') {
            if(data.inv.Gold < amount) return message.channel.send({ content: `\\❌ **${message.author.tag}**, Insuffecient credits! You only have **${data.credits}** in your wallet!`})
            const finall = Math.floor(amount) * 20
            data.credits += finall
            data.inv.Gold -= Math.floor(amount)
            await data.save()
            .then(()=> message.channel.send(`\\✔️ **${message.author.tag}**, Successfully sold **<:e_:887036608874967121> Gold** for <a:ShinyMoney:877975108038324224> \`+${amount * 4}\`!`))
            .catch(err => message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: \`${err.name}\``));
        } else if(res === 'diamond') {
            if(data.inv.Diamond < amount) return message.channel.send({ content: `\\❌ **${message.author.tag}**, Insuffecient credits! You only have **${data.credits}** in your wallet!`})
            const finall = Math.floor(amount) * 120
            data.credits += finall
            data.inv.Diamond -= Math.floor(amount)
            await data.save()
            .then(()=> message.channel.send(`\\✔️ **${message.author.tag}**, Successfully sold **<a:Diamond:877975082868301824> Diamond** for <a:ShinyMoney:877975108038324224> \`+${amount * 6}\`!`))
            .catch(err => message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: \`${err.name}\``));
        }
}
}