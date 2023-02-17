const discord = require('discord.js');
const schema = require('../../schema/Economy-Schema')

module.exports = {
    name: "sell",
    aliases: ["Sell", "SELL"],
    dmOnly: false, //or false
    guildOnly: false, //or false
    args: true, //or false
    usage: '[item] <amount>',
    group: 'Economy',
    description: 'Sell item from your inventory and get some credits!',
    cooldown: 5, //seconds(s)
    guarded: false, //or false
    permissions: [],
    examples: [
        'coal 13',
        'diamond 2'
      ],
    async execute(client, message, [item = '', ...amount]) {

        if(!item) {
            return message.channel.send({ content: `\\❌ **${message.member.displayName}**, Please provide a valid item.` })
        } else if(isNaN(amount)) {
            return message.channel.send({ content: `\\❌ **${message.member.displayName}**, please provide a valid item amount.` })
        } else if(!amount || amount == 0) {
            return message.channel.send({ content: `\\❌ **${message.member.displayName}**, please provide a valid item amount.` })
        }

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
        const Coal_price = Math.floor(12)
        const Stone_price = Math.floor(5)
        const Iron_price = Math.floor(25)
        const gold_price = Math.floor(55)
        const Diamond_price = Math.floor(90)
        if(res === 'coal') {
            if(data.inv.Coal < amount) return message.channel.send({ content: `\\❌ **${message.author.tag}**, You only have **${data.inv.Coal}** in your inventory!`})
            const finall = Math.floor(Coal_price * 0.7 * amount)
            data.credits += finall
            data.inv.Coal -= Math.floor(amount)
            await data.save()
            .then(()=> message.channel.send(`\\✔️ **${message.author.tag}**, Successfully sold **<:e_:887034070842900552> Coal** for <a:ShinyMoney:877975108038324224> \`+${finall}\`!`))
            .catch(err => message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: \`${err.name}\``));
        } else if(res === 'stone') {
            if(data.inv.Stone < amount) return message.channel.send({ content: `\\❌ **${message.author.tag}**, You only have **${data.inv.Stone}** in your inventory!`})
            const finall = Math.floor(Stone_price * 0.7 * amount)
            data.credits += finall
            data.inv.Stone -= Math.floor(amount)
            await data.save()
            .then(()=> message.channel.send(`\\✔️ **${message.author.tag}**, Successfully sold **<:e_:887031111790764092> Stone** for <a:ShinyMoney:877975108038324224> \`+${finall}\`!`))
            .catch(err => message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: \`${err.name}\``));
        } else if(res === 'iron') {
            if(data.inv.Iron < amount) return message.channel.send({ content: `\\❌ **${message.author.tag}**, You only have **${data.inv.Iron}** in your inventory!`})
            const finall = Math.floor(Iron_price * 0.7 * amount)
            data.credits += finall
            data.inv.Iron -= Math.floor(amount)
            await data.save()
            .then(()=> message.channel.send(`\\✔️ **${message.author.tag}**, Successfully sold **<:e_:887034687472689192> Iron** for <a:ShinyMoney:877975108038324224> \`+${finall}\`!`))
            .catch(err => message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: \`${err.name}\``));
        } else if(res === 'gold') {
            if(data.inv.Gold < amount) return message.channel.send({ content: `\\❌ **${message.author.tag}**, You only have **${data.inv.Gold}** in your inventory!`})
            const finall = Math.floor(gold_price * 0.7 * amount)
            data.credits += finall
            data.inv.Gold -= Math.floor(amount)
            await data.save()
            .then(()=> message.channel.send(`\\✔️ **${message.author.tag}**, Successfully sold **<:e_:887036608874967121> Gold** for <a:ShinyMoney:877975108038324224> \`+${finall}\`!`))
            .catch(err => message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: \`${err.name}\``));
        } else if(res === 'diamond') {
            if(data.inv.Diamond < amount) return message.channel.send({ content: `\\❌ **${message.author.tag}**, You only have **${data.inv.Diamond}** in your inventory!`})
            const finall = Math.floor(Diamond_price * 0.7 * amount)
            data.credits += finall
            data.inv.Diamond -= Math.floor(amount)
            await data.save()
            .then(()=> message.channel.send(`\\✔️ **${message.author.tag}**, Successfully sold **<a:Diamond:877975082868301824> Diamond** for <a:ShinyMoney:877975108038324224> \`+${finall}\`!`))
            .catch(err => message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: \`${err.name}\``));
        } else {
            const nulle = new discord.EmbedBuilder()
            .setTitle(`<a:Wrong:812104211361693696> Unknown item!`)
            .setDescription(`**${message.author.username}**, **${res}** this item not from the items listed in the inventory!`)
            .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL({dynamic: true, size: 2048}) })
            .setColor('Red')
            return message.channel.send({ embeds: [nulle] })
        }
}
}