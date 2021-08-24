const discord = require('discord.js');

module.exports = {
    name: "mute",
    aliases: ["Mute", "MUTE"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<user> <reason>',
    cooldown: 2, //seconds(s)
    guarded: false, //or false
    permissions: ["MANAGE_ROLES", "ADMINISTRATOR"],
    clientpermissions: ["MANAGE_ROLES", "ADMINISTRATOR", "READ_MESSAGE_HISTORY"],
    async execute(client, message, args) {

    const author = message.author
let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.user.username === args.slice(0).join(" ") || x.user.username === args[0])

let reason = ''
    if (!args[1]) reason = 'No reason specified'
    else reason = args.slice(1).join(' ')

/////////////////////////////////////////////// Errors /////////////////////////////////////////////
    const Err1 = new discord.MessageEmbed()
    .setTitle('Muting Error!')
    .setDescription('<a:pp802:768864899543466006> Please mention a user!')
    .setColor('RED')
    const Err2 = new discord.MessageEmbed()
    .setTitle('Muting Error!')
    .setDescription('<a:pp802:768864899543466006> You can\'t mute me!')
    .setColor('RED')
    const Err3 = new discord.MessageEmbed()
    .setTitle('Muting Error!')
    .setDescription('<a:pp802:768864899543466006> You can\'t mute yourself!')
    .setColor('RED')
    const Err4 = new discord.MessageEmbed()
    .setTitle('Muting Error!')
    .setDescription('<a:pp802:768864899543466006> User could not be muted!')
    .setColor('RED')
    const Err5 = new discord.MessageEmbed()
    .setTitle('Muting Error!')
    .setDescription('<a:pp802:768864899543466006> User is already muted!')
    .setColor('RED')
///////////////////////////////////////////////// Errors /////////////////////////////////////////////////
    if (!member) return message.reply(Err1)
    if (member.id === client.user.id) return message.reply(Err2)
    if (member.id === message.author.id) return message.reply(Err3)
    if (message.member.roles.highest.position <= member.roles.highest.position) return message.reply(Err4)
    if (member.roles.cache.find(r => r.name.toLowerCase() === 'muted')) return message.channel.send(Err5)
    const owner = client.users.fetch('829819269806030879').catch(() => null);
    if (user.id === owner){
      return message.channel.send(`<a:Wrong:812104211361693696> | ${message.author}, No, you can't mute my developers through me!`)
    };
//////////////////////////////////////////////////////////////////////////////////////////////////////////

    let mutedRole = message.guild.roles.cache.find(roles => roles.name === "Muted")
    // If bot didn't find Muted role in the server
    if (!mutedRole) {
        const Embed = new discord.MessageEmbed()
            .setTitle('Muting Error!')
            .setDescription('It appears that your discord server does not currently have a `Muted` role.\n\nWould you like to generate one?')
            .setColor('RED')
        message.channel.send(Embed).then(async message => {
            await message.react("✅")
            await message.react("❌")

            const filtro = (reaction, user) => ['✅', '❌'].includes(reaction.emoji.name) && user.id === author.id
            const collector = message.createReactionCollector(filtro)

            collector.on("collect", async r => {
                switch (r.emoji.name) {
                    case '✅':
                        if (message.guild.roles.cache.size >= 250) {
                            message.channel.send('Failed to generate a `Muted` role. Your server has too many roles! [250]')
                            collector.stop()
                            break
                        }
                        message.reactions.removeAll()
                        if (!message.guild.me.hasPermission('MANAGE_CHANNELS')) {
                            message.channel.send('I do not have the proper permissions to create this role! `MANAGE_CHANNELS`')
                            collector.stop()
                            break
                        }
                        const mutedRole = await message.guild.roles.create({
                            data: {
                                name: 'Muted',
                                color: 'GRAY'
                            }
                        })
                        message.channel.send('<a:Correct:812104211386728498> A `muted` role has been created!')
                        message.guild.channels.cache.forEach(async (channel, id) => {
                            await channel.createOverwrite(mutedRole, {
                                SEND_MESSAGES: false,
                                ADD_REACTIONS: false,
                                CONNECT: false,
                                SPEAK: false
                            })
                        });

                        try {
                            member.roles.add(mutedRole)
                            message.channel.send(`<:off:759732760562368534> ${member} has been successfully muted for \`${reason}\`!`)
                            collector.stop()
                        } catch (err) {
                            message.channel.send('I do not have permissions to add a role to this user! `[MANAGE_ROLES]`')
                            collector.stop()
                            break
                        }
                        break;
                    case '❌':
                        message.channel.send('Cancelled.')
                        collector.stop()
                        break;
                }
            })
        })

    } else {
        try {
            if(mutedRole) {
            member.roles.add(mutedRole);
            const mute = new discord.MessageEmbed()
            .setDescription(`<:off:759732760562368534> I muted ${member} for reason: \`${reason}\`!`);
            message.channel.send(mute);
            }            
        } catch (err) {
            message.reply('I do not have permissions to add a role to this user! `[MANAGE_ROLES]`')
        }
    }
}
}