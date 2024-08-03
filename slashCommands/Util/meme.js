const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: {
        name: "meme",
        description: "Replies with a meme!",
        dmOnly: false,
        guildOnly: false,
        cooldown: 0,
        group: "Utility",
        clientPermissions: [
            "EmbedLinks",
            "ReadMessageHistory"
        ],
        permissions: [],
        options: [
            {
                type: 5, // BOOLEAN
                name: 'hide',
                description: 'Hide the output',
                required: false
            }
        ]
    },
    async execute(client, interaction) {
        const hide = interaction.options.getBoolean('hide');

        // Dynamic import of 'discord.js' and 'got'
        const discord = await import('discord.js');
        const got = (await import('got')).default;

        const memeEmbed = new discord.EmbedBuilder(); // Creating an embed

        try {
            const response = await got('https://www.reddit.com/r/meme/random/.json'); // Getting the link that has the memes
            const content = JSON.parse(response.body); // Setting the JSON file that has the memes

            const memeData = content[0].data.children[0].data;
            const memeURL = `https://reddit.com${memeData.permalink}`; // Getting the meme URL
            const memeImage = memeData.url; // Getting the meme image
            const memeTitle = memeData.title; // Getting the meme title
            const memeUpvotes = memeData.ups; // Getting how many likes on the meme
            const memeDownvotes = memeData.downs; // Getting how many dislikes on the meme
            const memeNumComments = memeData.num_comments; // Getting how many comments on the meme

            memeEmbed
                .setTitle(memeTitle) // The title will be the meme title
                .setURL(memeURL) // Setting the URL of the meme in the embed
                .setImage(memeImage) // Setting the image in the embed
                .setColor('#87ceeb') // Setting a random embed color
                .setFooter({ text: `👍 ${memeUpvotes} | 👎 ${memeDownvotes} | 💬 ${memeNumComments}` });

            interaction.reply({ embeds: [memeEmbed], ephemeral: hide }); // Sending the embed
        } catch (error) {
            console.error('Error fetching meme:', error);
            interaction.reply({ content: 'There was an error fetching a meme. Please try again later.', ephemeral: true });
        }
    },
};
