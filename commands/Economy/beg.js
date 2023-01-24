const discord= require('discord.js');
const schema = require('../../schema/Economy-Schema')

module.exports = {
    name: "beg",
    aliases: ["Beg", "BEG"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '',
    group: 'Economy',
    description: 'Want to earn money some more? Why don\'t you try begging, maybe someone will give you.',
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
        const quest = data.progress.quests?.find(x => x.id == 3);
        let Box = quest?.current;
        const now = Date.now();
        const duration = Math.floor(Math.random() * 12000) + 100000;
        if (data.timer.beg.timeout > now){
            return message.channel.send(`\\❌ **${message.author.tag}**, You have already been given some *coins* earlier! Please try again later.`);
          };

        let ppl = ['WOLF', 'me', 'Mr.Beast', 'Tony Stark', 'Mr. joe', 'Anonymous', 'Rick', 'Morty', 'Steve', 'Drako', 'Elon Musk']
        let givers = Math.floor(Math.random() * ppl.length)
        let moneyget = Math.floor(Math.random() * 125) + 25;
        if(quest?.current < quest?.progress) {
            Box++;
            await schema.findOneAndUpdate({ userID: message.author.id, "progress.quests.id": 3 }, { $inc: { "progress.quests.$.current": 1 } });
          }
        if(Box && Box == quest?.progress && !quest?.received) {
            data.credits += Math.floor(quest.reward);
            await schema.findOneAndUpdate({ userID: message.author.id, "progress.quests.id": 3 }, { $set: { "progress.quests.$.received": true } });
            data.progress.completed++;
            message.reply({ content: `\\✔️  You received: <a:ShinyMoney:877975108038324224> **${quest.reward}** from this command quest.`})
          }
        data.timer.beg.timeout = Date.now() + duration;
        data.credits += Math.floor(moneyget);
        await data.save()
        .then(() => {
            message.channel.send({ content: `<a:Money:836169035191418951> **${message.author.tag}**, You received **<a:ShinyMoney:877975108038324224> ${moneyget}** from ${ppl[givers]}.`})
        })
        .catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`))
}
}