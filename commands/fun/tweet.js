const discord = require("discord.js")
const fetch = require("node-fetch");

module.exports = {
    name: "tweet",
    aliases: ["Tweet", "TWEET"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<text>',
    group: 'Fun',
    description: 'Send your message as tweet message',
    cooldown: 5, //seconds(s)
    guarded: false, //or false
    permissions: [],
    clientPermissions: [discord.PermissionsBitField.Flags.EmbedLinks, discord.PermissionsBitField.Flags.UseExternalEmojis, discord.PermissionsBitField.Flags.AttachFiles],
    examples: [
        'Hello, world!',
        'Wolfy bot!'
      ],
    async execute(client, message, args) {
    var loading = new discord.EmbedBuilder()
    .setColor(`Yellow`)
    .setDescription(`<a:Loading_Color:759734580122484757> Loading...`)
    var msg = await message.channel.send({ embeds: [loading] })

        let text = args.slice(0).join(" ");

        const ERR = new discord.EmbedBuilder()
        .setColor('Red')
        .setDescription('<a:pp681:774089750373597185> You must enter a message!')
        const ERR2 = new discord.EmbedBuilder()
        .setColor('Red')
        .setDescription('<a:pp681:774089750373597185> You must enter a message!')

        if(!text){
            return msg.edit({ embeds: [ERR] });
        }
if(text.length > 100) return message.channel.send({ content: 'Sorry you can\`t type more than 100 letters!' })


        try {
            let res = await fetch(encodeURI(`https://nekobot.xyz/api/imagegen?type=tweet&username=${message.author.username}&text=${text}`));
            let json = await res.json();
            let attachment = new discord.AttachmentBuilder(json.message, "tweet.png");
            await message.channel.send({ files: [attachment] });
            msg.delete();
        } catch(e){
            msg.edit({ embeds: [ERR2]});
        }
    }
};