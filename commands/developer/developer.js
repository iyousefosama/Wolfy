const discord = require('discord.js');

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;
    if(message.author.id !== '829819269806030879') return

    const developer = new discord.MessageEmbed()
    .setColor('RANDOM')
    .setTitle('<:Developer:841321892060201021> Developer Commands')
    .setThumbnail(Client.user.displayAvatarURL())
    .setImage('https://cdn.discordapp.com/attachments/804847293118808074/808859216064413716/Line.gif')
    .addFields(
        { name: `${prefix}blacklist/whitelist`, value: `> \`To prevent/allow people from using the bot\``},
        { name: `${prefix}line`, value: `> \`Send your line sir\``},
        { name: `${prefix}shutdown`, value: `> \`Shutdown the bot\``},
        { name: `${prefix}vcjoin`, value: `> \`Make's bot join the vc you are in\``},
        { name: `${prefix}guilds`, value: `> \`Show the guilds what bot in\``}
    )
    .setFooter(Client.user.username, Client.user.displayAvatarURL())
    .setTimestamp()
    const err = new discord.MessageEmbed()
    .setColor(`RED`)
    .setDescription(`<a:pp802:768864899543466006> Error`)

    try {
        await message.author.send(developer)
    } catch (error) {
        return message.channel.send(err)
    }
    let done = new discord.MessageEmbed()
    .setColor(`GREEN`)
    .setDescription(`<a:pp399:768864799625838604> Check your dm sir <:Developer:841321892060201021>`)
    message.channel.send(done)

}

    

module.exports.help = {
    name: "developer",
    aliases: ['Developer']
}