const discord = require('discord.js');
const minecraftPlayer = require("minecraft-player");

module.exports = {
    name: "mcuser",
    aliases: ["Mcuser", "MCUSER"],
    dmOnly: false, //or false
    guildOnly: false, //or false
    args: true, //or false
    usage: '<player>',
    group: 'Informations',
    description: 'Get a minecraft player info/skin',
    cooldown: 2, //seconds(s)
    guarded: false, //or false
    permissions: [],
    clientpermissions: [discord.PermissionsBitField.Flags.EmbedLinks, discord.PermissionsBitField.Flags.AttachFiles],
    examples: [
        'Notch'
      ],
    async execute(client, message, args) {

    const mcuser = args.join(" ");

    let user;
    try {
    user = await minecraftPlayer(mcuser);
    } catch {
        return;
    }

    if (user) {
        const embed = new discord.EmbedBuilder()
        .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        .addFields(
            { name: "Name:", value: `${user.username}`, inline: true},
            { name: "NameHistory:", value: `${user.usernameHistory.map(x => `${x.username}\n`)}`, inline: false},
            { name: "UUID:", value: user.uuid},
            { name: "CreatedAt", value: user.createdAt || "Unknown", inline: true },
            { name: "Download:", value: `[Download](https://minotar.net/download/${user.username})`, inline: true},
            { name: "NameMC:", value: `[Click Here](https://mine.ly/${user.username}.1)`, inline: true}
        )
        .setImage(`https://minotar.net/armor/body/${user.username}/100.png`)
        .setColor('#2c2f33')
        .setThumbnail(`https://minotar.net/helm/${user.username}/100.png`)
        .setTimestamp()
        .setFooter({ text: user.username + `\'s mcuser | \©️${new Date().getFullYear()} Wolfy`, iconURL: message.guild.iconURL({dynamic: true}) })
        message.channel.send({ embeds: [embed] });
    } else {
        return message.reply({ content: "<a:pp681:774089750373597185> **|** The specified user was not found!"})    
    }
}
}