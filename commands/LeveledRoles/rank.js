const discord = require('discord.js')
const canvacord = require('canvacord')
const Levels = require('discord-xp')

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
        message.channel.sendTyping()
    let RankUser = message.mentions.members.first() || message.member;
    const userData = await Levels.fetch(RankUser.id, message.guild.id)
    const requiredXP = (userData.level +1) * (userData.level +1) *100 // Enter the formula for calculating the experience here. I used mine, which is used in discord-xp.
    const rank = new canvacord.Rank()
    .setAvatar(RankUser.user.displayAvatarURL({format: "png", size: 1024}))
    .setProgressBar("#FFFFFF", "COLOR")
    .setCurrentXP(userData.xp)
    .setLevel(userData.level)
    .setRequiredXP(requiredXP)
    .setUsername(RankUser.user.username)
    .setDiscriminator(RankUser.user.discriminator)
    const img = await rank.build()
    .then(data => {
        const attachment = new discord.MessageAttachment(data, "RankCard.png");
        message.channel.send({ files: [attachment] });
    });
    }
}