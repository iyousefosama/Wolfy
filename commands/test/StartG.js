const discord= require('discord.js');
const schema = require('../../schema/GiveAway-Schema')
const ms = require('ms')

module.exports = {
    name: "startg",
    aliases: ["STARTG"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '[Winners Number] [Time] [Prize]',
    group: 'Test',
    description: 'Desc..',
    cooldown: 2, //seconds(s)
    guarded: false, //or false
    permissions: [discord.PermissionsBitField.Flags.ManageMessages],
    clientpermissions: [],
    examples: [],
    async execute(client, message, [Winners='', Time='', ...args]) {
        Prize = args.slice(0).join(" ");
        if (!Time || isNaN(ms(Time))) {
            return message.channel.send(`\\💥 ${message.author}, You haven\'t provided a \`duration\` of giveaway!`);
        } else if (isNaN(Winners) || (parseInt(Winners) <= 0)) {
            return message.channel.send(`\\💥 ${message.author}, You haven\'t provided a valid \`winners\` number for the giveaway!`);
        } else if (!Prize) {
            return message.channel.send(`\\💥 ${message.author}, You haven\'t provided a prize for the giveaway!`);
        }

        let data;
        try {
            data = schema.findOne({
                guildId: message.guild.id
            })
            if(!data) {
            data = schema.create({
                guildId: message.guild.id
            })
            }
        } catch (err) {
            console.log(err)
            message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`)
        }

        let msgid
        await message.channel.send(`Beta Giveaway message\nStarted!\nTime: ${Time}\nWinner: ${Winners}\nPrize: ${Prize}`).then(msg => {
            msgid = msg.id;
        })

        const giveawayObj = {
            authorId: message.author.id,
            timestamp: Math.floor(Date.now() + 1000),
            EndTime: Math.floor(ms(Time)),
            GiveAwayMsgID: msgid
        };

        data.giveaway.push(giveawayObj);
        return await data.save();       
}
}