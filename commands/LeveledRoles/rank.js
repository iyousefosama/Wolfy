const discord = require('discord.js')
const canvacord = require('canvacord')
const schema = require('../../schema/GuildSchema')
const ecoschema = require('../../schema/Economy-Schema')
const Userschema = require('../../schema/LevelingSystem-Schema')

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
    permissions: [],
    clientpermissions: [discord.PermissionsBitField.Flags.EmbedLinks, discord.PermissionsBitField.Flags.UseExternalEmojis, discord.PermissionsBitField.Flags.AttachFiles],
    examples: [
        '@WOLF',
        ''
      ],
    async execute(client, message, [user = '']) {

      
        const id = (user.match(/\d{17,19}/)||[])[0] || message.author.id;

        if (message.guild){
        member = await message.guild.members.fetch(id)
        .catch(() => message.member);
        user = member.user;
        } else {
        user = message.author;
      };

        let data;
        let ecodata;
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
    message.channel.sendTyping()
    if(!data.Mod.Level.isEnabled) return message.channel.send({ content: `\\❌ **${message.member.displayName}**, The **levels** command is disabled in this server!\nTo enable this feature, use the \`${client.prefix}leveltoggle\` command.`})
    try{
        ecodata = await ecoschema.findOne({
            userID: user.id
        })
        Userdata = await Userschema.findOne({
            userId: message.author.id,
            guildId: message.guild.id
        })
        if(!ecodata) {
        ecodata = await ecoschema.create({
            userID: user.id
        })
        }
        if(!Userdata) {
            return message.channel.send({ content: `\\❌ **${message.member.displayName}**, This member didn't get xp yet!`})
        }
    } catch(err) {
        console.log(err)
        message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`)
    }
    var status = member.presence?.status;
    const requiredXP = Userdata.System.required;
    const rank = new canvacord.Rank()
    .setAvatar(user.displayAvatarURL({extension:"png", size: 1024}))
    .setProgressBar("#FFFFFF", "COLOR")
    .setBackground("IMAGE", `${ecodata.profile?.background || 'https://i.imgur.com/299Kt1F.png'}` || 'https://i.imgur.com/299Kt1F.png')
    .setCurrentXP(Userdata.System.xp)
    .setLevel(Userdata.System.level)
    .setStatus(status)
    .setRequiredXP(requiredXP)
    .setUsername(user.username)
    .setDiscriminator(user.discriminator)
    const img = await rank.build()
    .then(data => {
        const attachment = new discord.AttachmentBuilder(data, { name: "RankCard.png"});
        message.channel.send({ files: [attachment] });
    });
    }
}