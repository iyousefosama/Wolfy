const schema = require('../../schema/GuildSchema')

/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
    name: "editrole",
    aliases: ["editlevelrole", 'edit-role'],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<roleID> <number>',
    group: 'LeveledRoles',
    description: 'Edit the guild level role to another one',
    cooldown: 1, //seconds(s)
    guarded: false, //or false
    permissions: ["Administrator", "ManageRoles"],
    examples: [
        '804860582066520104 9'
    ],

    async execute(client, message, args) {

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

        const currentRole = Math.round(args[0])
        if (!currentRole) return message.channel.send({ embeds: [`\\❌ **${message.member.displayName}**,  You need to provide a \`roleID\`!`] })

        const newNumber = args[1]
        if (!newNumber || isNaN(newNumber)) return message.channel.send({ content: `\\❌ **${message.member.displayName}**,  Please provide a valid new \`Level Number\`!` });

        const role = data.Mod.Level.Roles?.filter(x => x.RoleId == currentRole)[0];
        if (!data.Mod.Level.Roles.length || !role) return message.channel.send({ content: `\\❌ **${message.member.displayName}**, I can't find this role!` })
        if (data.Mod.Level.Roles?.filter(x => x.Level == Math.floor(newNumber))[0]) return message.channel.send({ content: `\\❌ **${message.member.displayName}**, there is already a leveled role with the same level!` })

        const NumberToAdd = newNumber - role.Level
        await schema.findOneAndUpdate({ GuildID: message.guild.id, "Mod.Level.Roles.RoleId": currentRole }, { $inc: { "Mod.Level.Roles.$.Level": Math.floor(NumberToAdd) } }).then(() => {
            return message.channel.send(`\\✔️ ${message.author}, Successfully edited **${role.RoleName}** to level \`${Math.floor(newNumber)}\`!`)
        }).catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`))

    }
}