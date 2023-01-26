const discord= require('discord.js');
const schema = require('../../schema/Economy-Schema')
const text = require('../../util/string');

module.exports = {
    name: "leaderboard",
    aliases: ["Lb", "LB", "lb", "LEADERBOARD"],
    dmOnly: false, //or false
    guildOnly: false, //or false
    args: false, //or false
    usage: '',
    group: 'Economy',
    description: 'Developer test tool!',
    cooldown: 2, //seconds(s)
    guarded: false, //or false
    permissions: [],
    examples: [], 
    async execute(client, message, args) {
    message.channel.sendTyping()
    try{
        data = await schema.find({})
    } catch(err) {
        console.log(err)
        message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`)
    }
        let members = []

        for (let obj of data) {
            if(client.users.cache
            .map((user) => user.id)
            .includes(obj.userID)) members.push(obj)
        }

        members = members.sort(function (b, a) {
            return a.credits - b.credits
        })
    
        members = members.filter(function BigEnough(value) {
            return value.credits > 0
        })

        let pos = 0

        const embed = new discord.EmbedBuilder()
        .setAuthor({ name: client.user.username + '\'s leaderboard', iconURL: client.user.displayAvatarURL(({dynamic: true, extension:'png', size: 512})) })
        .setColor('738ADB')
        .setTitle('<a:ShinyMoney:877975108038324224> Credits LeaderBoard!')
        .setTimestamp()
        for (let obj of members) {
            pos++
            if(obj.userID == message.author.id) {
                embed.setFooter({ text: `Your position is ${pos}!`, iconURL: message.author.displayAvatarURL({ dynamic: true, size: 1024 }) });
                
            }
        }
    
        members = members.slice(0, 10)
        let desc = ''
    
        for(let i = 0; i < members.length; i++) {
            let user = client.users.cache.get(members[i].userID)
            if(!user) return;
            let bal = members[i].credits
            if(i == 0) {
            Num = "<:medal:898358296694628414>"
            } else if(i == 1) {
            Num = "🥈"
            } else if(i == 2) {
            Num = "🥉"
            } else {
            Num = `*${i+1}.*`
            }
            desc += `${Num} ${user.tag} - \`${text.commatize(bal)}\` \n`
        }

        embed.setDescription(desc)
        message.channel.send({ embeds: [embed]})

}
}