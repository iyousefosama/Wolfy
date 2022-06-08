const Discord = require('discord.js');
const schema = require('../../schema/Economy-Schema')
const moment = require("moment");
const { MessageAttachment, MessageEmbed } = require('discord.js');
const file = new MessageAttachment('./assets/Images/treasure.png');
const quests = require('../../assets/json/quests.json');
const _ = require('lodash');
const Pages = require('../../util/Paginate');

module.exports = {
    name: "quests",
    aliases: ["Quests", "QUESTS", "quest"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '',
    group: 'Economy',
    description: 'Refresh/Show current quests and the current progress.',
    cooldown: 5, //seconds(s)
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

        const now = Date.now();
        const duration = Math.floor(86400000)

        if(data.progress.TimeReset < now) {
        let bucket = [];
        
        for (let i=0; i < quests.length; i++) {
            bucket.push(i);
        }
        function getRandomFromBucket() {
           let randomIndex = Math.floor(Math.random() * bucket.length);
           return bucket.splice(randomIndex, 1)[0];
        }
            data.progress.quests = []
            data.progress.completed = 0;
            data.progress.quests.push(quests[getRandomFromBucket()], quests[getRandomFromBucket()], quests[getRandomFromBucket()], quests[getRandomFromBucket()], quests[getRandomFromBucket()])
            data.progress.TimeReset = Math.floor(now + duration);
            await data.save()
            return message.channel.send(`\\✔️ **${message.author.tag}**, Successfully refreshed the quests`)
        }
        const QuestEmbed = new Pages(_.chunk(data.progress.quests, 4).map((chunk, i, o) => {
            return new MessageEmbed()
        .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({dynamic: true})})
        .setTitle("Daily Quests")
        .setDescription(`Your daily quests will be refreshed at \`${moment.duration(data.progress.TimeReset - now, 'milliseconds').format('H [hours, and] m [minutes,]')}\`\nYou completed ${data.progress.completed} out of 4 from your daily quests!\n\n<:star:888264104026992670> Your Progress:`)
        .setThumbnail('attachment://treasure.png')
        .setFooter({ text: message.author.tag + ` | \©️${new Date().getFullYear()} Wolfy`, iconURL: message.author.avatarURL({dynamic: true}) })
        .addFields(...chunk.sort((A,B) => A.id - B.id ).map(d => {
            const quest = quests.find(x => x.id == d.id);
            const dataquest = data.progress.quests.find(x => x.id == d.id);
            return {
              inline: false,
              name: quest.name + ` (${dataquest.current}/${dataquest.progress})`,
              value: [
                `**Rewards:** <a:ShinyMoney:877975108038324224> \`${quest.reward}\` credits`
              ].join('\n')
            }
          }));
        }));

        await message.channel.send({ embeds: [QuestEmbed.firstPage], files: [file] });
}
}