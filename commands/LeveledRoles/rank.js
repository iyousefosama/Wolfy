const discord = require('discord.js')
const canvacord = require('canvacord')
const Levels = require('discord-xp')
const schema = require('../../schema/GuildSchema')
const ecoschema = require('../../schema/Economy-Schema')
const { prefix } = require('../../config.json');

module.exports = {
    name: "rank",
    aliases: ["level", "Level", "LEVEL", "RANK", "Rank"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '',
    group: 'LeveledRoles',
    description: 'Show your level & rank and your current and next xp',
    cooldown: 5, //seconds(s)
    guarded: false, //or false
    clientpermissions: ["EMBED_LINKS", "USE_EXTERNAL_EMOJIS", "ATTACH_FILES"],
    examples: [
        '@WOLF',
        ''
      ],
    async execute(client, message, args) {

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
        let ecodata;
        try{
            ecodata = await ecoschema.findOne({
                userID: message.author.id
            })
            if(!data) {
            data = await ecoschema.create({
                ecodata: message.author.id
            })
            }
        } catch(err) {
            console.log(err)
        }

    message.channel.sendTyping()
    if(!data.Mod.Level.isEnabled) return message.channel.send({ content: `\\❌ **${message.member.displayName}**, The **levels** command is disabled in this server!\nTo enable this feature, use the \`${prefix}leveltoggle\` command.`})
    let RankUser = message.mentions.members.first() || message.member;
    const userData = await Levels.fetch(RankUser.id, message.guild.id)
    const requiredXP = (userData.level +1) * (userData.level +1) *100 // Enter the formula for calculating the experience here. I used mine, which is used in discord-xp.
    const rank = new canvacord.Rank()
    .setAvatar(RankUser.user.displayAvatarURL({format: "png", size: 1024}))
    .setProgressBar("#FFFFFF", "COLOR")
    .setBackground("IMAGE", `${ecodata.profile.background || 'https://cdn.discordapp.com/attachments/805088270756872214/893620901264900096/1f6c66afbf9849801b85e9cc761983b5ec00fbe9.png'}`)
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