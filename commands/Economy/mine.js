const Discord = require('discord.js');
const schema = require('../../schema/Economy-Schema')
const market = require('../../assets/json/market.json');

module.exports = {
    name: "mine",
    aliases: ["Mine", "MINE"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '',
    group: 'Economy',
    description: 'What you know about mining down in the deep?',
    cooldown: 8, //seconds(s)
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
        const item = data.profile.inventory.find(x => x.id == 3);
        const item2 = data.profile.inventory.find(x => x.id == 4);
        const item3 = data.profile.inventory.find(x => x.id == 5);

        const nulle = new Discord.MessageEmbed()
        .setTitle(`<a:Wrong:812104211361693696> Missing item!`)
        .setDescription(`**${message.author.username}**, you didn't buy a pickaxe to mine yet!\n\nType \`${client.prefix}market\` to show the market.`)
        .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL({dynamic: true, size: 2048}) })
        .setColor('RED')
        if(!item && !item2 && !item3) return message.channel.send({ embeds: [nulle] })
    
        const quest = data.progress.quests?.find(x => x.id == 7);
        let Box = quest?.current;

        if(quest?.current < quest?.progress) {
          Box++
          await schema.findOneAndUpdate({ userID: message.author.id, "progress.quests.id": 7 }, { $inc: { "progress.quests.$.current": 1 } });
        }
      if(Box && Box >= quest?.progress && !quest?.received) {
          data.credits += Math.floor(quest.reward);
          await schema.findOneAndUpdate({ userID: message.author.id, "progress.quests.id": 7 }, { $set: { "progress.quests.$.received": true } });
          data.progress.completed++;
          message.reply({ content: `\\✔️  You received: <a:ShinyMoney:877975108038324224> **${quest.reward}** from this command quest.`})
        }
        
        let itemget;
         if (item && !item2 && !item3 && Math.random() * 100 < 55) {
            const stone = ["Stone <:e_:887031111790764092>"]
            let itemget = Math.floor(Math.random() * 16) + 4
            data.inv.Stone += Math.floor(itemget);
            await data.save()
            .then(() => {
                message.channel.send({ content: `<:StonePickaxe:887032165437702277> **${message.author.tag}**, you mine: \`+${itemget}\` **${stone}** you can see this item count and sell it from your inv by \`${client.prefix}inv mining\`!`})
            })
            .catch((err) => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later! ${err}`))
          } else if (item && !item2 && !item3 && Math.random() * 100 < 35) {
            const coal = ["Coal <:e_:887034070842900552>"]
            let itemget = Math.floor(Math.random() * 6) + 6
            data.inv.Coal += Math.floor(itemget);
            await data.save()
            .then(() => {
                message.channel.send({ content: `<:StonePickaxe:887032165437702277> **${message.author.tag}**, you mine: \`+${itemget}\` **${coal}** you can see this item count and sell it from your inv by \`${client.prefix}inv mining\`!`})
            })
            .catch((err) => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later! ${err}`))
          } else if (item && !item2 && !item3 && Math.random() * 100 < 5) {
            const iron = ["Iron <:e_:887034687472689192>"]
            let itemget = Math.floor(Math.random() * 5) + 2
            data.inv.Iron += Math.floor(itemget);
            await data.save()
            .then(() => {
                message.channel.send({ content: `<:StonePickaxe:887032165437702277> **${message.author.tag}**, you mine: \`+${itemget}\` **${iron}** you can see this item count and sell it from your inv by \`${client.prefix}inv mining\`!`})
            })
            .catch((err) => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later! ${err}`))
          } else if (item && !item2 && !item3 && Math.random() * 100 < 3) {
            const gold = ["Gold <:e_:887036608874967121>"]
            let itemget = Math.floor(Math.random() * 2) + 1
            data.inv.Gold += Math.floor(itemget);
            await data.save()
            .then(() => {
                message.channel.send({ content: `<:StonePickaxe:887032165437702277> **${message.author.tag}**, you mine: \`+${itemget}\` **${gold}** you can see this item count and sell it from your inv by \`${client.prefix}inv mining\`!`})
            })
            .catch((err) => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later! ${err}`))
          } else if (item && !item2 && !item3 && Math.random() * 100 < 2) {
            const diamond = ["Diamond <a:Diamond:877975082868301824>"]
            let itemget = Math.floor(Math.random() * 1) + 1
            data.inv.Diamond += Math.floor(itemget);
            await data.save()
            .then(() => {
                message.channel.send({ content: `<:StonePickaxe:887032165437702277> **${message.author.tag}**, you mine: \`+${itemget}\` **${diamond}** you can see this item count and sell it from your inv by \`${client.prefix}inv mining\`!`})
            })
            .catch((err) => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later! ${err}`))
          } else if (item2 && !item3 &&  Math.random() * 100 < 30) {
            const stone = ["Stone <:e_:887031111790764092>"]
            let itemget = Math.floor(Math.random() * 25) * 4 + 1
            data.inv.Stone += Math.floor(itemget);
            await data.save()
            .then(() => {
                message.channel.send({ content: `<:e_:887042865715359774> **${message.author.tag}**, you mine: \`+${itemget}\` **${stone}** you can see this item count and sell it from your inv by \`${client.prefix}inv mining\`!`})
            })
            .catch((err) => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later! ${err}`))
          } else if (item2 && !item3 &&  Math.random() * 100 < 10) {
            const coal = ["Coal <:e_:887034070842900552>"]
            let itemget = Math.floor(Math.random() * 8) * 4 + 1
            data.inv.Coal += Math.floor(itemget);
            await data.save()
            .then(() => {
                message.channel.send({ content: `<:e_:887042865715359774> **${message.author.tag}**, you mine: \`+${itemget}\` **${coal}** you can see this item count and sell it from your inv by \`${client.prefix}inv mining\`!`})
            })
            .catch((err) => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later! ${err}`))
          } else if (item2 && !item3 && Math.random() * 100 < 40) {
            const iron = ["Iron <:e_:887034687472689192>"]
            let itemget = Math.floor(Math.random() * 8) * 2 + 1
            data.inv.Iron += Math.floor(itemget);
            await data.save()
            .then(() => {
                message.channel.send({ content: `<:e_:887042865715359774> **${message.author.tag}**, you mine: \`+${itemget}\` **${iron}** you can see this item count and sell it from your inv by \`${client.prefix}inv mining\`!`})
            })
            .catch((err) => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later! ${err}`))
          } else if (item2 && !item3 && Math.random() * 100 < 10) {
            const gold = ["Gold <:e_:887036608874967121>"]
            let itemget = Math.floor(Math.random() * 6) * 2 + 1
            data.inv.Gold += Math.floor(itemget);
            await data.save()
            .then(() => {
                message.channel.send({ content: `<:e_:887042865715359774> **${message.author.tag}**, you mine: \`+${itemget}\` **${gold}** you can see this item count and sell it from your inv by \`${client.prefix}inv mining\`!`})
            })
            .catch((err) => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later! ${err}`))
          } else if (item2 && !item3 && Math.random() * 100 < 10) {
            const diamond = ["Diamond <a:Diamond:877975082868301824>"]
            let itemget = Math.floor(Math.random() * 4) * 2 + 1
            data.inv.Diamond += Math.floor(itemget);
            await data.save()
            .then(() => {
                message.channel.send({ content: `<:e_:887042865715359774> **${message.author.tag}**, you mine: \`+${itemget}\` **${diamond}** you can see this item count and sell it from your inv by \`${client.prefix}inv mining\`!`})
            })
            .catch((err) => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later! ${err}`))
          } else if (item3 && Math.random() * 100 < 15) {
            const stone = ["Stone <:e_:887031111790764092>"]
            let itemget = Math.floor(Math.random() * 64) * 2 + 1
            data.inv.Stone += Math.floor(itemget);
            await data.save()
            .then(() => {
                message.channel.send({ content: `<:e_:887059604998078495> **${message.author.tag}**, you mine: \`+${itemget}\` **${stone}** you can see this item count and sell it from your inv by \`${client.prefix}inv mining\`!`})
            })
            .catch((err) => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later! ${err}`))
          } else if (item3 && Math.random() * 100 < 5) {
            const coal = ["Coal <:e_:887034070842900552>"]
            let itemget = Math.floor(Math.random() * 32) * 2 + 1
            data.inv.Coal += Math.floor(itemget);
            await data.save()
            .then(() => {
                message.channel.send({ content: `<:e_:887059604998078495> **${message.author.tag}**, you mine: \`+${itemget}\` **${coal}** you can see this item count and sell it from your inv by \`${client.prefix}inv mining\`!`})
            })
            .catch((err) => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later! ${err}`))
          } else if (item3 && Math.random() * 100 < 45) {
            const iron = ["Iron <:e_:887034687472689192>"]
            let itemget = Math.floor(Math.random() * 16) * 2 + 1
            data.inv.Iron += Math.floor(itemget);
            await data.save()
            .then(() => {
                message.channel.send({ content: `<:e_:887059604998078495> **${message.author.tag}**, you mine: \`+${itemget}\` **${iron}** you can see this item count and sell it from your inv by \`${client.prefix}inv mining\`!`})
            })
            .catch((err) => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later! ${err}`))
          } else if (item3 && Math.random() * 100 < 25) {
            const gold = ["Gold <:e_:887036608874967121>"]
            let itemget = Math.floor(Math.random() * 8) * 3 + 1
            data.inv.Gold += Math.floor(itemget);
            await data.save()
            .then(() => {
                message.channel.send({ content: `<:e_:887059604998078495> **${message.author.tag}**, you mine: \`+${itemget}\` **${gold}** you can see this item count and sell it from your inv by \`${client.prefix}inv mining\`!`})
            })
            .catch((err) => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later! ${err}`))
          } else if (item3 && Math.random() * 100 < 10) {
            const diamond = ["Diamond <a:Diamond:877975082868301824>"]
            let itemget = Math.floor(Math.random() * 12) * 2 + 1
            data.inv.Diamond += Math.floor(itemget);
            await data.save()
            .then(() => {
                message.channel.send({ content: `<:e_:887059604998078495> **${message.author.tag}**, you mine: \`+${itemget}\` **${diamond}** you can see this item count and sell it from your inv by \`${client.prefix}inv mining\`!`})
            })
            .catch((err) => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later! ${err}`))
          } else {
            const stone = ["Stone <:e_:887031111790764092>"]
            let itemget = Math.floor(Math.random() * 6) + 1
            data.inv.Stone += Math.floor(itemget);
            await data.save()
            .then(() => {
                message.channel.send({ content: `\\❌ **${message.author.tag}**, you mine: \`+${itemget}\` **${stone}** you can see this item count and sell it from your inv by \`${client.prefix}inv mining\`!`})
            })
            .catch((err) => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later! ${err}`))
            }
}
}