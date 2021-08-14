const discord = require('discord.js')
const canvacord = require('canvacord')
const Levels = require('discord-xp')
const cooldown = new Set();

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return
    if(!message.guild.me.permissions.has('SEND_MESSAGES')) return;
    if(cooldown.has(message.author.id)) {
        message.reply('Please wait \`15 seconds\` between using the command, because you are on cooldown')
    } else {
        message.channel.startTyping()
    const userData = await Levels.fetch(message.author.id, message.guild.id)
    const requiredXP = (userData.level +1) * (userData.level +1) *100 // Enter the formula for calculating the experience here. I used mine, which is used in discord-xp.
    const rank = new canvacord.Rank()
    .setAvatar(message.author.displayAvatarURL({format: "png", size: 1024}))
    .setProgressBar("#FFFFFF", "COLOR")
    .setCurrentXP(userData.xp)
    .setLevel(userData.level)
    .setRequiredXP(requiredXP)
    .setUsername(message.author.username)
    .setDiscriminator(message.author.discriminator)
    const img = await rank.build()
    .then(data => {
        const attachment = new discord.MessageAttachment(data, "RankCard.png");
        message.channel.send(attachment);
    });
    message.channel.stopTyping()
    cooldown.add(message.author.id);
    setTimeout(() => {
        cooldown.delete(message.author.id)
    }, 15000); // here will be the time in miliseconds 5 seconds = 5000 miliseconds
}
}

module.exports.help = {
    name: 'level',
    aliases: ['Level', 'LEVEL', 'rank', 'Rank', 'RANK']
}