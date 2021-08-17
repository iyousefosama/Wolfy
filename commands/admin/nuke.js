const discord = require('discord.js');

module.exports = {
    name: "nuke",
    aliases: ["Nuke", "NUKE"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '',
    cooldown: 20, //seconds(s)
    guarded: false, //or false
    permissions: ["MANAGE_MESSAGES", "ADMINISTRATOR"],
    clientpermissions: ["MANAGE_MESSAGES", "ADMINISTRATOR"],
    async execute(client, message, args) {

    var channel = client.channels.cache.get(message.channel.id)

    // getting the position of the channel by the category
    var posisi = channel.position

    if(!channel) return;
   // clonning the channel
    channel.clone().then((channel2) => {
        
        // sets the position of the new channel
        channel2.setPosition(posisi)

        // deleting the nuked channel
        channel.delete()

        // sending a msg in the new channel
    let nuke = new discord.MessageEmbed()
    .setColor(`RED`)
    .setDescription(`<a:Error:836169051310260265> Channel nuked by **${message.author.username}**`)
    channel2.send(nuke)
    })
    .catch(err => {
        const UnknownErr = new discord.MessageEmbed()
        .setColor(`RED`)
        .setDescription(`<a:pp802:768864899543466006> Error, please report this to on our support server!`)
        .setURL(`https://discord.gg/qYjus2rujb`)
        message.channel.send(UnknownErr)
        console.error(err)
      })
}
}