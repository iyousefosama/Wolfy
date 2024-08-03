const discord = require("discord.js")

/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
    name: "tweet",
    aliases: [],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<text>',
    group: 'Fun',
    description: 'Send your message as tweet message',
    cooldown: 5, //seconds(s)
    guarded: false, //or false
    permissions: [],
    clientPermissions: ["EmbedLinks", "UseExternalEmojis", "AttachFiles"],
    examples: [
        'Hello, world!',
        'Wolfy bot!'
    ],

    async execute(client, message, args) {
        const fetch = (await import("node-fetch")).default;
        let text = args.slice(0).join(" ");

        if (!text) {
            return message.channel.send({ content: `\\❌ ${message.author.username}, You must enter a text!` });
        }
        if (text.length > 100) return message.channel.send({ content: `\\❌ ${message.author.username}, Sorry you can\`t type more than 100 letters!` })

        try {
            let res = await fetch(encodeURI(`https://nekobot.xyz/api/imagegen?type=tweet&username=${message.author.username}&text=${text}`));
            let json = await res.json();
            let attachment = new discord.AttachmentBuilder(json.message, "tweet.png");
            await message.channel.send({ files: [attachment] });
        } catch (e) {
            console.log(e);
            message.channel.send({ content: `💢 Their were a problem while fetching tweet api.` })
        }
    }
};