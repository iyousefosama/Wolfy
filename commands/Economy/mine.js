const Discord = require('discord.js');
const schema = require('../../schema/Economy-Schema')
const { prefix } = require('../../config.json');

module.exports = {
    name: "mine",
    aliases: ["Mine", "MINE"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '',
    group: 'Economy',
    description: 'What you know about mining down in the deep?',
    cooldown: 6, //seconds(s)
    guarded: false, //or false
    permissions: [],
    examples: [''],
    async execute(client, message, args) {

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
        const nulle = new Discord.MessageEmbed()
        .setTitle(`<a:Wrong:812104211361693696> Missing item!`)
        .setDescription(`**${message.author.username}**, you didn't buy a pickaxe to mine yet!\n\nType \`${prefix}buy stonepickaxe\`, \`${prefix}buy ironpickaxe\`, \`${prefix}buy diamondpickaxe\` to buy the item.`)
        .setFooter(message.author.username, message.author.displayAvatarURL({dynamic: true, size: 2048}))
        .setColor('RED')
        if(!data.inv || data.inv.StonePickaxe !== 1 && data.inv.IronPickaxe !== 1 && data.inv.DiamondPickaxe !== 1) return message.channel.send({ embeds: [nulle] })
    
        
        let itemget;
         if (data.inv.StonePickaxe == 1 && data.inv.IronPickaxe !== 1 && data.inv.DiamondPickaxe !== 1 && Math.random() * 100 < 55) {
            const stone = ["Stone <:e_:887031111790764092>"]
            let itemget = Math.floor(Math.random() * 16) * 2
            data.inv.Stone += Math.floor(itemget);
            await data.save()
            .then(() => {
                message.channel.send({ content: `<:StonePickaxe:887032165437702277> **${message.author.tag}**, you mine: \`+${itemget}\` **${stone}** you can see this item count and sell it from your inv by \`${prefix}inv\`!`})
            })
            .catch((err) => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later! ${err}`))
          } else if (data.inv.StonePickaxe == 1 && data.inv.IronPickaxe !== 1 && data.inv.DiamondPickaxe !== 1 && Math.random() * 100 < 35) {
            const coal = ["Coal <:e_:887034070842900552>"]
            let itemget = Math.floor(Math.random() * 6) * 3
            data.inv.Coal += Math.floor(itemget);
            await data.save()
            .then(() => {
                message.channel.send({ content: `<:StonePickaxe:887032165437702277> **${message.author.tag}**, you mine: \`+${itemget}\` **${coal}** you can see this item count and sell it from your inv by \`${prefix}inv\`!`})
            })
            .catch((err) => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later! ${err}`))
          } else if (data.inv.StonePickaxe == 1 && data.inv.IronPickaxe !== 1 && data.inv.DiamondPickaxe !== 1 && Math.random() * 100 < 5) {
            const iron = ["Iron <:e_:887034687472689192>"]
            let itemget = Math.floor(Math.random() * 5) * 2
            data.inv.Iron += Math.floor(itemget);
            await data.save()
            .then(() => {
                message.channel.send({ content: `<:StonePickaxe:887032165437702277> **${message.author.tag}**, you mine: \`+${itemget}\` **${iron}** you can see this item count and sell it from your inv by \`${prefix}inv\`!`})
            })
            .catch((err) => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later! ${err}`))
          } else if (data.inv.StonePickaxe == 1 && data.inv.IronPickaxe !== 1 && data.inv.DiamondPickaxe !== 1 && Math.random() * 100 < 3) {
            const gold = ["Gold <:e_:887036608874967121>"]
            let itemget = Math.floor(Math.random() * 2) * 2
            data.inv.Gold += Math.floor(itemget);
            await data.save()
            .then(() => {
                message.channel.send({ content: `<:StonePickaxe:887032165437702277> **${message.author.tag}**, you mine: \`+${itemget}\` **${gold}** you can see this item count and sell it from your inv by \`${prefix}inv\`!`})
            })
            .catch((err) => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later! ${err}`))
          } else if (data.inv.StonePickaxe == 1 && data.inv.IronPickaxe !== 1 && data.inv.DiamondPickaxe !== 1&& Math.random() * 100 < 2) {
            const diamond = ["Diamond <a:Diamond:877975082868301824>"]
            let itemget = Math.floor(Math.random() * 1) * 2
            data.inv.Diamond += Math.floor(itemget);
            await data.save()
            .then(() => {
                message.channel.send({ content: `<:StonePickaxe:887032165437702277> **${message.author.tag}**, you mine: \`+${itemget}\` **${diamond}** you can see this item count and sell it from your inv by \`${prefix}inv\`!`})
            })
            .catch((err) => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later! ${err}`))
          } else {
            const stone = ["Stone <:e_:887031111790764092>"]
            let itemget = Math.floor(Math.random() * 6) * 2
            data.inv.Stone += Math.floor(itemget);
            await data.save()
            .then(() => {
                message.channel.send({ content: `<:StonePickaxe:887032165437702277> **${message.author.tag}**, you mine: \`+${itemget}\` **${stone}** you can see this item count and sell it from your inv by \`${prefix}inv\`!`})
            })
            .catch((err) => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later! ${err}`))
          }

          ///// Iron Pickaxe
          if (data.inv.IronPickaxe == 1 && data.inv.DiamondPickaxe !== 1 &&  Math.random() * 100 < 30) {
            const stone = ["Stone <:e_:887031111790764092>"]
            let itemget = Math.floor(Math.random() * 25) * 4
            data.inv.Stone += Math.floor(itemget);
            await data.save()
            .then(() => {
                message.channel.send({ content: `<:e_:887042865715359774> **${message.author.tag}**, you mine: \`+${itemget}\` **${stone}** you can see this item count and sell it from your inv by \`${prefix}inv\`!`})
            })
            .catch((err) => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later! ${err}`))
          } else if (data.inv.IronPickaxe == 1 && data.inv.DiamondPickaxe !== 1 &&  Math.random() * 100 < 10) {
            const coal = ["Coal <:e_:887034070842900552>"]
            let itemget = Math.floor(Math.random() * 8) * 4
            data.inv.Coal += Math.floor(itemget);
            await data.save()
            .then(() => {
                message.channel.send({ content: `<:e_:887042865715359774> **${message.author.tag}**, you mine: \`+${itemget}\` **${coal}** you can see this item count and sell it from your inv by \`${prefix}inv\`!`})
            })
            .catch((err) => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later! ${err}`))
          } else if (data.inv.IronPickaxe == 1 && data.inv.DiamondPickaxe !== 1 && Math.random() * 100 < 40) {
            const iron = ["Iron <:e_:887034687472689192>"]
            let itemget = Math.floor(Math.random() * 8) * 2
            data.inv.Iron += Math.floor(itemget);
            await data.save()
            .then(() => {
                message.channel.send({ content: `<:e_:887042865715359774> **${message.author.tag}**, you mine: \`+${itemget}\` **${iron}** you can see this item count and sell it from your inv by \`${prefix}inv\`!`})
            })
            .catch((err) => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later! ${err}`))
          } else if (data.inv.IronPickaxe == 1 && data.inv.DiamondPickaxe !== 1 && Math.random() * 100 < 10) {
            const gold = ["Gold <:e_:887036608874967121>"]
            let itemget = Math.floor(Math.random() * 6) * 2
            data.inv.Gold += Math.floor(itemget);
            await data.save()
            .then(() => {
                message.channel.send({ content: `<:e_:887042865715359774> **${message.author.tag}**, you mine: \`+${itemget}\` **${gold}** you can see this item count and sell it from your inv by \`${prefix}inv\`!`})
            })
            .catch((err) => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later! ${err}`))
          } else if (data.inv.IronPickaxe == 1 && data.inv.DiamondPickaxe !== 1 && Math.random() * 100 < 10) {
            const diamond = ["Diamond <a:Diamond:877975082868301824>"]
            let itemget = Math.floor(Math.random() * 4) * 2
            data.inv.Diamond += Math.floor(itemget);
            await data.save()
            .then(() => {
                message.channel.send({ content: `<:e_:887042865715359774> **${message.author.tag}**, you mine: \`+${itemget}\` **${diamond}** you can see this item count and sell it from your inv by \`${prefix}inv\`!`})
            })
            .catch((err) => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later! ${err}`))
          } else {
            const stone = ["Stone <:e_:887031111790764092>"]
            let itemget = Math.floor(Math.random() * 16) * 2
            data.inv.Stone += Math.floor(itemget);
            await data.save()
            .then(() => {
                message.channel.send({ content: `<:e_:887042865715359774> **${message.author.tag}**, you mine: \`+${itemget}\` **${stone}** you can see this item count and sell it from your inv by \`${prefix}inv\`!`})
            })
            .catch((err) => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later! ${err}`))
            }

          // Diamond Pickaxe
          if (data.inv.DiamondPickaxe == 1 && Math.random() * 100 < 15) {
            const stone = ["Stone <:e_:887031111790764092>"]
            let itemget = Math.floor(Math.random() * 64) * 2
            data.inv.Stone += Math.floor(itemget);
            await data.save()
            .then(() => {
                message.channel.send({ content: `<:e_:887059604998078495> **${message.author.tag}**, you mine: \`+${itemget}\` **${stone}** you can see this item count and sell it from your inv by \`${prefix}inv\`!`})
            })
            .catch((err) => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later! ${err}`))
          } else if (data.inv.DiamondPickaxe == 1 && Math.random() * 100 < 5) {
            const coal = ["Coal <:e_:887034070842900552>"]
            let itemget = Math.floor(Math.random() * 64) * 2
            data.inv.Coal += Math.floor(itemget);
            await data.save()
            .then(() => {
                message.channel.send({ content: `<:e_:887059604998078495> **${message.author.tag}**, you mine: \`+${itemget}\` **${coal}** you can see this item count and sell it from your inv by \`${prefix}inv\`!`})
            })
            .catch((err) => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later! ${err}`))
          } else if (data.inv.DiamondPickaxe == 1 && Math.random() * 100 < 45) {
            const iron = ["Iron <:e_:887034687472689192>"]
            let itemget = Math.floor(Math.random() * 16) * 2
            data.inv.Iron += Math.floor(itemget);
            await data.save()
            .then(() => {
                message.channel.send({ content: `<:e_:887059604998078495> **${message.author.tag}**, you mine: \`+${itemget}\` **${iron}** you can see this item count and sell it from your inv by \`${prefix}inv\`!`})
            })
            .catch((err) => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later! ${err}`))
          } else if (data.inv.DiamondPickaxe == 1 && Math.random() * 100 < 25) {
            const gold = ["Gold <:e_:887036608874967121>"]
            let itemget = Math.floor(Math.random() * 8) * 3
            data.inv.Gold += Math.floor(itemget);
            await data.save()
            .then(() => {
                message.channel.send({ content: `<:e_:887059604998078495> **${message.author.tag}**, you mine: \`+${itemget}\` **${gold}** you can see this item count and sell it from your inv by \`${prefix}inv\`!`})
            })
            .catch((err) => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later! ${err}`))
          } else if (data.inv.DiamondPickaxe == 1  && Math.random() * 100 < 10) {
            const diamond = ["Diamond <a:Diamond:877975082868301824>"]
            let itemget = Math.floor(Math.random() * 12) * 2
            data.inv.Diamond += Math.floor(itemget);
            await data.save()
            .then(() => {
                message.channel.send({ content: `<:e_:887059604998078495> **${message.author.tag}**, you mine: \`+${itemget}\` **${diamond}** you can see this item count and sell it from your inv by \`${prefix}inv\`!`})
            })
            .catch((err) => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later! ${err}`))
          } else {
            const stone = ["Stone <:e_:887031111790764092>"]
            let itemget = Math.floor(Math.random() * 32) * 2
            data.inv.Stone += Math.floor(itemget);
            await data.save()
            .then(() => {
                message.channel.send({ content: `<:e_:887059604998078495> **${message.author.tag}**, you mine: \`+${itemget}\` **${stone}** you can see this item count and sell it from your inv by \`${prefix}inv\`!`})
            })
            .catch((err) => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later! ${err}`))
            }
}
}