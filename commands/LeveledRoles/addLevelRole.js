const schema = require('../../schema/GuildSchema');

module.exports = {
    name: "addrole",
    aliases: ["Addrole", "ADDROLE", "addlevelroole", "add-role"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<role> <number>',
    group: 'LeveledRoles',
    description: 'Add a level role as a prize for users when they be active',
    cooldown: 1, //seconds(s)
    guarded: false, //or false
    permissions: ["ADMINISTRATOR", "MANAGE_ROLES"],
    examples: [
        '@ActiveMember 5'
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

        const Role_To_Add = message.mentions.roles.first()
        if(!Role_To_Add) return message.channel.send(`\\❌ **${message.member.displayName}**, Please provide the role mention or id!`)

        const Level_To_Reach = args[1]
        if(!Level_To_Reach) return message.channel.send(`\\❌ **${message.member.displayName}**, Please provide the role level!`)
        if(isNaN(Level_To_Reach)) return message.channel.send(`\\❌ **${message.member.displayName}**, Please provide the role level with number of level!`)

        if(Level_To_Reach.includes('+')) return message.channel.send(`\\❌ **${message.member.displayName}**, Please provide the role level with number of level!`)
        if(Level_To_Reach.includes('-')) return message.channel.send(`\\❌ **${message.member.displayName}**, Please provide the role level with number of level!`)
        if(Level_To_Reach.includes('.')) return message.channel.send(`\\❌ **${message.member.displayName}**, Please provide the role level with number of level!`)
        if(!data.Mod.Level.isEnabled) return message.channel.send({ content: `\\❌ **${message.member.displayName}**, The **levels** command is disabled in this server!\nTo enable this feature, use the \`${client.prefix}leveltoggle\` command.`})

        if(data.Mod.Level.Roles.length && data.Mod.Level.Roles?.filter(x => x.Level == Math.floor(Level_To_Reach))[0]) return message.channel.send({ content: `\\❌ **${message.member.displayName}**, there is already a leveled role with the same level!`})
        const RoleObj = {
            RoleName: Role_To_Add.name,
            RoleId: Role_To_Add.id,
            Level: parseInt(Level_To_Reach)
        }
        data.Mod.Level.Roles.push(RoleObj)
        await data.save().then(() => {
            return message.channel.send(`\\✔️ **${message.member.displayName}**, New Level Role has been successfully added.`)
        }).catch(() => {
            return message.channel.send({ content: `\`❌ [DATABASE_ERR]:\` The database responded with error: \`${err.name}\``})
        })
    }
}