const Discord = require('discord.js');
const schema = require('../../schema/Economy-Schema')
const { prefix } = require('../../config.json');

module.exports = {
    name: "fish",
    aliases: ["Fish", "FISH"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '',
    group: 'Economy',
    description: 'Take your fishingpole and start fishing',
    cooldown: 17, //seconds(s)
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
        .setDescription(`**${message.author.username}**, you didn't buy the **FishingPole** item from the shop!\nType \`${prefix}buy fishingpole\` to buy the item.`)
        .setFooter(message.author.username, message.author.displayAvatarURL({dynamic: true, size: 2048}))
        .setColor('RED')
        if(!data.inv.FishinPole || data.inv.FishinPole !== 1) return message.channel.send({ embeds: [nulle] })
    
        let moneyget;
        let loadingMsg;
         if (Math.random() * 100 < 36) {
            const trashitems = ["Trash 👞", "Trash 🔧", "Trash 🧻", "Trash 🗑️", "Trash 📎"]
            const trash = trashitems[Math.floor(Math.random() * trashitems.length)]
            let moneyget = Math.floor(Math.random() * 20) + 20
            data.credits += Math.floor(moneyget);
            await data.save()
            .then(async () => {
                let loadingMsg = await message.channel.send({ content: '> <a:Loading:841321898302373909> Fishing from the pond...'})
                loadingMsg.edit({ content: `🎣 **${message.author.tag}**, you caught: **${trash}** from the Pool and got <a:ShinyMoney:877975108038324224> **${moneyget}**!`})
            })
            .catch((err) => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later! ${err}`))
          } else if (Math.random() * 100 < 34) {
            const common = ["CommonFish 🐟"]
            let moneyget = Math.floor(Math.random() * 80) + 60
            data.credits += Math.floor(moneyget);
            await data.save()
            .then(async () => {
                let loadingMsg = await message.channel.send({ content: '> <a:Loading:841321898302373909> Fishing from the pond...'})
                loadingMsg.edit({ content: `🎣 **${message.author.tag}**, you caught: **${common}** from the Pool and got <a:ShinyMoney:877975108038324224> **${moneyget}**!`})
            })
            .catch((err) => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later! ${err}`))
          } else if (Math.random() * 100 < 15) {
            const uncommon = ["UncommonFish 🐠"]
            let moneyget = Math.floor(Math.random() * 180) + 130
            data.credits += Math.floor(moneyget);
            await data.save()
            .then(async () => {
                let loadingMsg = await message.channel.send({ content: '> <a:Loading:841321898302373909> Fishing from the pond...'})
                loadingMsg.edit({ content: `🎣 **${message.author.tag}**, you caught: **${uncommon}** from the Pool and got <a:ShinyMoney:877975108038324224> **${moneyget}**!`})
            })
            .catch((err) => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later! ${err}`))
          } else if (Math.random() * 100 < 12) {
            const rare = ["RareFish <:fish:886630455795933264>"]
            let moneyget = Math.floor(Math.random() * 440) + 150
            data.credits += Math.floor(moneyget);
            await data.save()
            .then(async () => {
                let loadingMsg = await message.channel.send({ content: '> <a:Loading:841321898302373909> Fishing from the pond...'})
                loadingMsg.edit({ content: `🎣 **${message.author.tag}**, you caught: **${rare}** from the Pool and got <a:ShinyMoney:877975108038324224> **${moneyget}**!`})
            })
            .catch((err) => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later! ${err}`))
          } else if (Math.random() * 100 < 2) {
            const epic = ["EpicFish <:e_:886630455175159818>"]
            let moneyget = Math.floor(Math.random() * 650) + 250
            data.credits += Math.floor(moneyget);
            await data.save()
            .then(async () => {
                let loadingMsg = await message.channel.send({ content: '> <a:Loading:841321898302373909> Fishing from the pond...'})
                loadingMsg.edit({ content: `🎣 **${message.author.tag}**, you caught: **${epic}** from the Pool and got <a:ShinyMoney:877975108038324224> **${moneyget}**!`})
            })
            .catch((err) => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later! ${err}`))
          } else if (Math.random() * 100 < 0.80) {
            const legendary = ["LegendaryFish <:fish:892685979918426112>"]
            let moneyget = Math.floor(Math.random() * 890) + 560
            data.credits += Math.floor(moneyget);
            await data.save()
            .then(async () => {
                let loadingMsg = await message.channel.send({ content: '> <a:Loading:841321898302373909> Fishing from the pond...'})
                loadingMsg.edit({ content: `🎣 **${message.author.tag}**, you caught: **${legendary}** from the Pool and got <a:ShinyMoney:877975108038324224> **${moneyget}**!`})
            })
            .catch((err) => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later! ${err}`))
          } else if (Math.random() * 100 < 0.20) {
            const Mythic = ["MythicFish <:carp:892687082621902859>"]
            let moneyget = Math.floor(Math.random() * 1500) + 860
            data.credits += Math.floor(moneyget);
            await data.save()
            .then(async () => {
                let loadingMsg = await message.channel.send({ content: '> <a:Loading:841321898302373909> Fishing from the pond...'})
                loadingMsg.edit({ content: `🎣 **${message.author.tag}**, you caught: **${Mythic}** from the Pool and got <a:ShinyMoney:877975108038324224> **${moneyget}**!`})
            })
            .catch((err) => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later! ${err}`))
          } else {
              let loadingMsg = await message.channel.send({ content: '> <a:Loading:841321898302373909> Fishing from the pond...'})
              loadingMsg.edit(`<:nofish:892685980916678696> **${message.author.tag}**, you caught: **<:sad1:887894228305342504> Nothing**`)
          }
}
}