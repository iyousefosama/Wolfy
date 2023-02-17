const discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const got = require('got')

module.exports = {
    clientpermissions: [discord.PermissionsBitField.Flags.EmbedLinks, discord.PermissionsBitField.Flags.ReadMessageHistory],
	data: new SlashCommandBuilder()
		.setName('meme')
		.setDescription('Replies with a meme!')
        .addBooleanOption(option => option.setName('hide').setDescription('Hide the output')),
	async execute(client, interaction) {

        const hide = interaction.options.getBoolean('hide');
        
        const memeEmbed = new discord.EmbedBuilder() // creating an embed
        got('https://www.reddit.com/r/meme/random/.json').then(response => { // getting the lin that have the memes
    
            let content = JSON.parse(response.body); // setting the json file that hv the memes
    
            let permalink = content[0].data.children[0].data.permalink; // https://reddit/(this is the permalink) [URL]
    
            let memeURL = `https://reddit.com${permalink}`; // getting the meme URL
    
            let memeImage = content[0].data.children[0].data.url; // getting the meme image
    
            let memeTitle = content[0].data.children[0].data.title; // getting the meme Title
    
            let memeUpvotes = content[0].data.children[0].data.ups; // getting how much likes on the meme
    
            let memeDownvotes = content[0].data.children[0].data.downs; // getting how much dislikes on the meme
    
            let memeNumComments = content[0].data.children[0].data.num_comments; // getting how much comments on the meme
    
            memeEmbed.setTitle(`${memeTitle}`) // the title will be ${memeTitle}
            memeEmbed.setURL(`${memeURL}`) // gettin the URL of the meme in the embed         
            memeEmbed.setImage(memeImage) // gettin the image in the embed
            memeEmbed.setColor('#87ceeb') // getting a random embed color
            memeEmbed.setFooter({ text: `👍 ${memeUpvotes} | 👎 ${memeDownvotes} | 💬 ${memeNumComments}` })
    
            interaction.editReply({ embeds: [memeEmbed], ephemeral: hide }) // sending the embed
        })
	},
};