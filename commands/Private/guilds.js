const discord = require('discord.js');

module.exports = {
    name: "guilds",
    aliases: ["Guilds", "servers"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '',
    group: 'developer',
    cooldown: 5, //seconds(s)
    guarded: false, //or false
    OwnerOnly: true,
    permissions: [],
    async execute(client, message, args) {
        var list = "";
        client.guilds.cache.forEach(guild => {
            list += `${guild.name} (${guild.id}) | ${guild.memberCount} members | Owner: ${guild.ownerId}.\n`
        })
    
        const output = new discord.AttachmentBuilder(Buffer.from(list), { name: 'guilds.txt'})
        return await message.reply({ content: `${message.author}, Here is my guilds(\`${client.guilds.cache.size}\`) list!`, files: [output] });
}
}