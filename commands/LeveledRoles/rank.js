const discord = require('discord.js')
const canvacord = require('canvacord')
const Levels = require('discord-xp')
const cooldown = new Set();

module.exports = {
    name: "rank",
    aliases: ["level", "Level", "LEVEL", "RANK", "Rank"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '',
    cooldown: 5, //seconds(s)
    guarded: false, //or false
    clientpermissions: ["EMBED_LINKS", "USE_EXTERNAL_EMOJIS", "ATTACH_FILES"],
    async execute(client, message, args) {
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
    }
}