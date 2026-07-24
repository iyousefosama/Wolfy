const discord = require('discord.js');
const snekfetch = require('snekfetch');
const { decode } = require('he');
const html2md = require('html2markdown');
const text = require('../../util/string');
const { colors } = require('../../util/constants/constants');

module.exports = {
    data: {
        name: "steam",
        description: "Gives information about the Steam game!",
        dmOnly: false,
        guildOnly: false,
        cooldown: 0,
        group: "Utility",
        clientPermissions: [
            "EmbedLinks"
        ],
        permissions: [],
        options: [
            {
                type: 3, // STRING
                name: 'query',
                description: 'Enter a query',
                required: true
            }
        ]
    },
    async execute(client, interaction) {
        const query = interaction.options.getString('query');

        // Input Checking
        (async () => {
            try {
                // Executing
                const search = await snekfetch
                    .get('https://store.steampowered.com/api/storesearch')
                    .query({
                        cc: 'us',
                        l: 'en',
                        term: query
                    });

                if (!search.body.items.length) {
                    return interaction.reply({ 
                        content: `❌ | ${interaction.user}, I couldn't find that game on Steam!`
                    });
                }

                const {
                    id,
                    tiny_image
                } = search.body.items[0];

                const {
                    body
                } = await snekfetch
                    .get('https://store.steampowered.com/api/appdetails')
                    .query({
                        appids: id
                    });

                const {
                    data
                } = body[id.toString()];
                const current = data.price_overview ? `$${data.price_overview.final / 100}` : 'Free';
                const original = data.price_overview ? `$${data.price_overview.initial / 100}` : 'Free';
                const price = current === original ? current : `~~${original}~~ ${current}`;
                const platforms = [];
                if (data.platforms) {
                    if (data.platforms.windows) platforms.push('Windows');
                    if (data.platforms.mac) platforms.push('Mac');
                    if (data.platforms.linux) platforms.push('Linux');
                }

                const year = new Date().getFullYear();
                const discount = data.price_overview && data.price_overview.discount_percent ? data.price_overview.discount_percent : 0;

                const embed = new discord.EmbedBuilder()
                    .setColor(colors.UTILITY)
                    .setAuthor({ name: 'Steam', iconURL: 'https://i.imgur.com/xxr2UBZ.png', url: 'http://store.steampowered.com/' })
                    .setTitle(`${data.name} on Steam`)
                    .setURL(`http://store.steampowered.com/app/${data.steam_appid}`)
                    .setImage(tiny_image)
                    .addFields({ 
                        name: "**Price:**",
                        value: price,
                        inline: true 
                    })
                    .addFields({ 
                        name: "**Discount:**", 
                        value: discount > 0 ? `${discount}%` : '\u200b', 
                        inline: true 
                    })
                    .addFields({ 
                        name: "❯\u2000Metascore", 
                        value: `•\u2000 ${data.metacritic ? data.metacritic.score : '???'}`, 
                        inline: true 
                    })
                    .addFields({ 
                        name: "❯\u2000Reviews", 
                        value: `•\u2000 ${data.recommendations ? data.recommendations.total : '???'}`, 
                        inline: true 
                    })
                    .addFields({ 
                        name: "❯\u2000Platforms", 
                        value: `•\u2000 ${platforms.join(', ') || 'None'}`, 
                        inline: true 
                    })
                    .addFields({ 
                        name: "❯\u2000Release Date", 
                        value: `•\u2000 ${data.release_date ? data.release_date.date : '???'}`, 
                        inline: true 
                    })
                    .addFields({ 
                        name: "❯\u2000DLC Count", 
                        value: `•\u2000 ${data.dlc ? data.dlc.length : 0}`, 
                        inline: true 
                    })
                    .addFields({ 
                        name: "❯\u2000Developers", 
                        value: `•\u2000 ${data.developers ? data.developers.join(', ') || '???' : '???'}`,
                        inline: true 
                    })
                    .addFields({ 
                        name: "❯\u2000Publishers", 
                        value: `•\u2000 ${data.publishers ? data.publishers.join(', ') || '???' : '???'}`, 
                        inline: true 
                    })
                    .addFields({ 
                        name: "❯\u2000Genres", 
                        value: `${data.genres ? data.genres.map(m => `• ${m.description}`).join('\n') || '???' : '???'}`, 
                        inline: true 
                    })
                    .addFields([
                        { name: '\u200b', value: text.truncate(decode(data.detailed_description.replace(/(<([^>]+)>)/ig, ' ')), 980) },
                        { name: "❯\u2000Supported Languages", value: `•\u2000${text.truncate(html2md(data.supported_languages))}` },
                    ])
                    .setFooter({ 
                        text: `Steam Game Info | ©${year} Wolfy`
                    })
                    .setTimestamp();
                
                return interaction.reply({ embeds: [embed] });
            } catch (error) {
                console.error(error);
                return interaction.reply({ 
                    content: `❌ | ${interaction.user}, Something went wrong, please try again later!`,
                    flags: ['Ephemeral'] 
                });
            }
        })();
    },
};