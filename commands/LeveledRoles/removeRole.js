const schema = require('../../schema/GuildSchema')

/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
    name: "removerole",
    aliases: ['remove-role'],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<id>',
    group: 'LeveledRoles',
    description: 'Remove a level role from the list',
    cooldown: 2, //seconds(s)
    guarded: false, //or false
    permissions: ["Administrator", "ManageRoles"],
    examples: [
        '804860582066520104'
    ],

    async execute(client, message, [toRemove='']) {
        let data;
        try {
            data = await schema.findOne({
                GuildID: message.guild.id
            })
            if (!data) {
                data = await schema.create({
                    GuildID: message.guild.id
                })
            }
        } catch (err) {
            console.log(err)
            message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`)
        }

        const role = data.Mod.Level.Roles?.filter(x => x.RoleId == toRemove)[0];
        if (!data.Mod.Level.Roles.length || !role) return message.channel.send({ content: `\\❌ **${message.member.displayName}**, I can't find this role!` })

        await schema.findOneAndUpdate({ GuildID: message.guild.id }, { $pull: { "Mod.Level.Roles": { "RoleId": toRemove } } }).then(() => {
            return message.channel.send(`\\✔️ **${message.member.displayName}**, Successfully removed the role from this guild!`)
        }).catch((err) => {
            return message.channel.send({ content: `\`❌ [DATABASE_ERR]:\` The database responded with error: \`${err.name}\`` })
        })
    }
}