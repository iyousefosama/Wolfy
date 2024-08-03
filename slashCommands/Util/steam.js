const discord = require('discord.js');
const snekfetch = require('snekfetch');
const { decode } = require('he');
const html2md = require('html2markdown');
const text = require('../../util/string');

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

            // Executing
            const search = await snekfetch
                .get('https://store.steampowered.com/api/storesearch')
                .query({
                    cc: 'us',
                    l: 'en',
                    term: query
                });

            if (!search.body.items.length) return interaction.reply({ content: `\\❌ No results found for **${query}** on steam!` });

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

            const embed = new discord.EmbedBuilder()
                .setColor(0x101D2F)
                .setAuthor({ name: 'Steam', iconURL: 'https://i.imgur.com/xxr2UBZ.png', url: 'http://store.steampowered.com/' })
                .setTitle(data.name)
                .setURL(`http://store.steampowered.com/app/${data.steam_appid}`)
                .setImage(tiny_image)
                .addFields({ name: '❯\u2000Price', value: `•\u2000 ${price}`, inline: true })
                .addFields({ name: '❯\u2000Metascore', value: `•\u2000 ${data.metacritic ? data.metacritic.score : '???'}`, inline: true })
                .addFields({ name: '❯\u2000Recommendations', value: `•\u2000 ${data.recommendations ? data.recommendations.total : '???'}`, inline: true })
                .addFields({ name: '❯\u2000Platforms', value: `•\u2000 ${platforms.join(', ') || 'None'}`, inline: true })
                .addFields({ name: '❯\u2000Release Date', value: `•\u2000 ${data.release_date ? data.release_date.date : '???'}`, inline: true })
                .addFields({ name: '❯\u2000DLC Count', value: `•\u2000 ${data.dlc ? data.dlc.length : 0}`, inline: true })
                .addFields({ name: '❯\u2000Developers', value: `•\u2000 ${data.developers ? data.developers.join(', ') || '???' : '???'}`, inline: true })
                .addFields({ name: '❯\u2000Publishers', value: `•\u2000 ${data.publishers ? data.publishers.join(', ') || '???' : '???'}`, inline: true })
                .addFields({ name: '❯\u2000Genres', value: `${data.genres ? data.genres.map(m => `• ${m.description}`).join('\n') || '???' : '???'}`, inline: true })
                .addFields([
                    { name: '\u200b', value: text.truncate(decode(data.detailed_description.replace(/(<([^>]+)>)/ig, ' ')), 980) },
                    { name: '❯\u2000Supported Languages', value: `•\u2000${text.truncate(html2md(data.supported_languages))}` },
                ])
                .setFooter({ text: `Steam @ Steam.Inc©` })
                .setTimestamp()
            return interaction.reply({ embeds: [embed] })
        })();
    },
};