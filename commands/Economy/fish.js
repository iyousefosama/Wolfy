const discord = require('discord.js');
const schema = require('../../schema/Economy-Schema')

/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
    name: "fish",
    aliases: [],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '',
    group: 'Economy',
    description: 'Take your fishingpole and start fishing',
    cooldown: 13, //seconds(s)
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

        const item = data.profile.inventory.find(x => x.id == 1);
        const quest = data.progress.quests?.find(x => x.id == 1);
        let Box = quest?.current;
        
        const nulle = new discord.EmbedBuilder()
        .setTitle(`<a:Wrong:812104211361693696> Missing item!`)
        .setDescription(`**${message.author.username}**, you didn't buy the **FishingPole** item from the shop!\nType \`${client.prefix}market\` to show the market.`)
        .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL({dynamic: true, size: 2048}) })
        .setColor('Red')
        if(!item) return message.channel.send({ embeds: [nulle] })
    
        let moneyget;
        let loadingMsg;
         if (Math.random() * 100 < 37) {
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
          } else if (Math.random() * 100 < 33) {
            const common = ["CommonFish 🐟"]
            let moneyget = Math.floor(Math.random() * 80) + 60
            data.credits += Math.floor(moneyget);
            if(quest?.current < quest?.progress) {
                Box++;
                await schema.findOneAndUpdate({ userID: message.author.id, "progress.quests.id": 1 }, { $inc: { "progress.quests.$.current": 1 } });
              }
            if(Box && Box == quest?.progress && !quest?.received) {
                data.credits += Math.floor(quest.reward);
                await schema.findOneAndUpdate({ userID: message.author.id, "progress.quests.id": 1 }, { $set: { "progress.quests.$.received": true } });
                data.progress.completed++;
                message.reply({ content: `\\✔️  You received: <a:ShinyMoney:877975108038324224> **${quest.reward}** from this command quest.`})
              }
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
            if(quest?.current < quest?.progress) {
              Box++;
              await schema.findOneAndUpdate({ userID: message.author.id, "progress.quests.id": 1 }, { $inc: { "progress.quests.$.current": 1 } });
            }
          if(Box && Box == quest?.progress && !quest?.received) {
              data.credits += Math.floor(quest.reward);
              await schema.findOneAndUpdate({ userID: message.author.id, "progress.quests.id": 1 }, { $set: { "progress.quests.$.received": true } });
              data.progress.completed++;
              message.reply({ content: `\\✔️  You received: <a:ShinyMoney:877975108038324224> **${quest.reward}** from this command quest.`})
            }
            await data.save()
            .then(async () => {
                let loadingMsg = await message.channel.send({ content: '> <a:Loading:841321898302373909> Fishing from the pond...'})
                loadingMsg.edit({ content: `🎣 **${message.author.tag}**, you caught: **${uncommon}** from the Pool and got <a:ShinyMoney:877975108038324224> **${moneyget}**!`})
            })
            .catch((err) => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later! ${err}`))
          } else if (Math.random() * 100 < 12) {
            const rare = ["RareFish <:fish:886630455795933264>"]
            let moneyget = Math.floor(Math.random() * 240) + 150
            data.credits += Math.floor(moneyget);
            if(quest?.current < quest?.progress) {
              Box++;
              await schema.findOneAndUpdate({ userID: message.author.id, "progress.quests.id": 1 }, { $inc: { "progress.quests.$.current": 1 } });
            }
          if(Box && Box == quest?.progress && !quest?.received) {
              data.credits += Math.floor(quest.reward);
              await schema.findOneAndUpdate({ userID: message.author.id, "progress.quests.id": 1 }, { $set: { "progress.quests.$.received": true } });
              data.progress.completed++;
              message.reply({ content: `\\✔️  You received: <a:ShinyMoney:877975108038324224> **${quest.reward}** from this command quest.`})
            }
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
            if(quest?.current < quest?.progress) {
              Box++;
              await schema.findOneAndUpdate({ userID: message.author.id, "progress.quests.id": 1 }, { $inc: { "progress.quests.$.current": 1 } });
            }
          if(Box && Box == quest?.progress && !quest?.received) {
              data.credits += Math.floor(quest.reward);
              await schema.findOneAndUpdate({ userID: message.author.id, "progress.quests.id": 1 }, { $set: { "progress.quests.$.received": true } });
              data.progress.completed++;
              message.reply({ content: `\\✔️  You received: <a:ShinyMoney:877975108038324224> **${quest.reward}** from this command quest.`})
            }
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
            if(quest?.current < quest?.progress) {
              Box++;
              await schema.findOneAndUpdate({ userID: message.author.id, "progress.quests.id": 1 }, { $inc: { "progress.quests.$.current": 1 } });
            }
          if(Box && Box == quest?.progress && !quest?.received) {
              data.credits += Math.floor(quest.reward);
              await schema.findOneAndUpdate({ userID: message.author.id, "progress.quests.id": 1 }, { $set: { "progress.quests.$.received": true } });
              data.progress.completed++;
              message.reply({ content: `\\✔️  You received: <a:ShinyMoney:877975108038324224> **${quest.reward}** from this command quest.`})
            }
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
            if(quest?.current < quest?.progress) {
              Box++;
              await schema.findOneAndUpdate({ userID: message.author.id, "progress.quests.id": 1 }, { $inc: { "progress.quests.$.current": 1 } });
            }
          if(Box && Box == quest?.progress && !quest?.received) {
              data.credits += Math.floor(quest.reward);
              await schema.findOneAndUpdate({ userID: message.author.id, "progress.quests.id": 1 }, { $set: { "progress.quests.$.received": true } });
              data.progress.completed++;
              message.reply({ content: `\\✔️  You received: <a:ShinyMoney:877975108038324224> **${quest.reward}** from this command quest.`})
            }
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