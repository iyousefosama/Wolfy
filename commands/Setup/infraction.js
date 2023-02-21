const discord = require('discord.js');
const schema = require('../../schema/GuildSchema')

module.exports = {
    name: "infraction",
    aliases: ["infraction", "INFRACTION"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '',
    group: 'setup',
    description: 'To enable/disable/Edit infraction point protection system!',
    cooldown: 5, //seconds(s)
    guarded: false, //or false
    permissions: [discord.PermissionsBitField.Flags.Administrator],
    clientpermissions: [discord.PermissionsBitField.Flags.ManageMessages],
    examples: [
    ''
    ],
    async execute(client, message, [type = '', ...args]) {

        let num = Math.round(args[0]);

        let data;
        try{
            data = await schema.findOne({
                GuildID: message.guild.id
            })
            if(!data) {
                data = await schema.create({
                    GuildID: message.guild.id
                })
            }
        } catch(err) {
            console.log(err)
            message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`)
        }

        if(type.toLowerCase() == 'kick') {
            if(!num) {
            return message.channel.send(`\\❌ **${message.member.displayName}**, Please add the maximum number of infraction point to kick!`)
            } else if(num < 1 || num > 10) {
            return message.channel.send(`\\❌ **${message.member.displayName}**, Maximum infraction point can't be less than(1) and more than(10)`)
            }

            data.Infraction.Options.MaxkickP = num;
            await data.save()
            .then(() => {
                message.channel.send(`\\✔️ ${message.member.displayName}, Successfully set the maximum number of \`kick\` infraction point(s) to **${num}**!`)
              }).catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`));
        } else if(type.toLowerCase() == 'ban') {
            if(!num) {
            return message.channel.send(`\\❌ **${message.member.displayName}**, Please add the maximum number of infraction point to ban!`)
            } else if(num < 10 || num > 20) {
            return message.channel.send(`\\❌ **${message.member.displayName}**, Maximum infraction point can't be less than(10) and more than(20)`)
            }

            data.Infraction.Options.MaxbanP = num;
            await data.save()
            .then(() => {
                message.channel.send(`\\✔️ ${message.member.displayName}, Successfully set the maximum number of \`ban\` infraction point(s) to **${num}**!`)
              }).catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`));
        } else if(type && typeof type === 'number') {
            if(type < 5000 || type > 604800000) {
            return message.channel.send(`\\❌ **${message.member.displayName}**, Infraction point TimeReset can't be less than(5 Min) and more than(7 Days)`)
            }

            data.Mod.Infraction.TimeReset = type;
            await data.save()
            .then(() => {
                message.channel.send(`\\✔️ ${message.member.displayName}, Successfully set \`TimeReset\` for infraction point(s) to **${type}**!`)
              }).catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`));
        } else if(type.toLowerCase() == 'toggle') {
            
        data.Mod.Infraction.isEnabled = !data.Mod.Infraction.isEnabled;

        data.save()
        .then(() => {
          const state = ['Disabled', 'Enabled'][Number(data.Mod.Logs.isEnabled)];
          data.Mod.Infraction.isEnabled = data.Mod.Infraction.isEnabled;
    
          const embed = new discord.EmbedBuilder()
            .setColor('Green')
            .setDescription([
              '<a:Correct:812104211386728498>\u2000|\u2000',
              `Infraction points Feature has been Successfully **${state}**!\n\n`,
              `To **${!data.Mod.Infraction.isEnabled ? 're-enable' : 'disable'}** this`,
              `feature, use the \`${client.prefix}infraction toggle\` command.`
            ].join(' '))
            message.channel.send({ embeds: [embed] })
          }).catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`));
        } else {
            const Else = new discord.EmbedBuilder()
            .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({dynamic: true})})
            .setColor('738ADB')
            .setDescription([
                `\`ban\` maximum infraction points is (**${data.Mod.Infraction.Options.MaxbanP}**)`,
                `\n\`kick\` maximum infraction points is (**${data.Mod.Infraction.Options.MaxkickP}**)`,
                `\nThe Infraction points \`TimeReset\` is (\`${data.Mod.Infraction.TimeReset}\`ms)`,
                `\nTo **${!data.Mod.Infraction.isEnabled ? 'enable' : 'disable'}** this`,
                `feature, use the \`${client.prefix}infraction toggle\` command.`
              ].join(' '))
            .setFooter({text: `${client.prefix}infraction (kick/ban/toggle/(Time of Timereset)) (Number)`, iconURL: client.user.displayAvatarURL({dyanmic: true})})
            return message.channel.send({ embeds: [Else]})
        }

}
}