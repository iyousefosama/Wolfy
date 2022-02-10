const Discord = require('discord.js');
const got = require('got')

module.exports = {
    name: "meme",
    aliases: ["Meme", "MEME"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '',
    group: 'Fun',
    description: 'Get a random memes from reddit',
    cooldown: 2, //seconds(s)
    guarded: false, //or false
    permissions: [],
    clientpermissions: ["EMBED_LINKS", "ATTACH_FILES"],
    examples: [''],
    async execute(client, message, args) {
    message.channel.sendTyping()
    
    const memeEmbed = new Discord.MessageEmbed() // creating an embed
    got('https://www.reddit.com/r/meme/random/.json').then(response => { // getting the lin that have the memes

        let content = JSON.parse(response.body); // setting the json file that hv the memes

        let permalink = content[0].data.children[0].data.permalink; // https://reddit/(this is the permalink) [URL]

        let memeURL = `https://reddit.com${permalink}`; // getting the meme URL

        let memeImage = content[0].data.children[0].data.url; // getting the meme image

        let memeTitle = content[0].data.children[0].data.title; // getting the meme Title

        let memeUpvotes = content[0].data.children[0].data.ups; // getting how much likes on the meme

        let memeDownvotes = content[0].data.children[0].data.downs; // getting how much dislikes on the meme

        let memeNumComments = content[0].data.children[0].data.num_comments; // getting how much comments on the meme

        memeEmbed.setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({dynamic: true})})
        memeEmbed.setTitle(memeTitle) // the title will be ${memeTitle}
        memeEmbed.setURL(memeURL) // gettin the URL of the meme in the embed         
        memeEmbed.setImage(memeImage) // gettin the image in the embed
        memeEmbed.setColor('#ffd167') // getting a random embed color
        memeEmbed.setFooter({ text: `👍 ${memeUpvotes} | 👎 ${memeDownvotes} | 💬 ${memeNumComments}`, iconURL: client.user.displayAvatarURL({dynamic: true}) })
        memeEmbed.setTimestamp()

        message.channel.send({ embeds: [memeEmbed] }) // sending the embed
    })
}
}