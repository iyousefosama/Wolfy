const discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const snekfetch = require('snekfetch');
const fetch = require('node-fetch');
const { decode } = require('he');
const html2md = require('html2markdown');
const text = require('../util/string');

module.exports = {
    clientpermissions: ['EMBED_LINKS'],
	data: new SlashCommandBuilder()
		.setName('steam')
		.setDescription('Gives informations about the steam game!')
        .addStringOption(option => option.setName('query').setDescription('Enter a query').setRequired(true)),
	async execute(client, interaction) {
		await interaction.deferReply({ ephemeral: false }).catch(() => {});
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

            if (!search.body.items.length) return interaction.editReply({ content: `\\❌ No results found for **${query}** on steam!`});

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

        const embed = new discord.MessageEmbed()
            .setColor(0x101D2F)
            .setAuthor('Steam', 'https://i.imgur.com/xxr2UBZ.png', 'http://store.steampowered.com/')
            .setTitle(data.name)
            .setURL(`http://store.steampowered.com/app/${data.steam_appid}`)
            .setImage(tiny_image)
            .addField('❯\u2000Price', `•\u2000 ${price}`, true)
            .addField('❯\u2000Metascore', `•\u2000 ${data.metacritic ? data.metacritic.score : '???'}`, true)
            .addField('❯\u2000Recommendations', `•\u2000 ${data.recommendations ? data.recommendations.total : '???'}`, true)
            .addField('❯\u2000Platforms', `•\u2000 ${platforms.join(', ') || 'None'}`, true)
            .addField('❯\u2000Release Date', `•\u2000 ${data.release_date ? data.release_date.date : '???'}`, true)
            .addField('❯\u2000DLC Count', `•\u2000 ${data.dlc ? data.dlc.length : 0}`, true)
            .addField('❯\u2000Developers', `•\u2000 ${data.developers ? data.developers.join(', ') || '???' : '???'}`, true)
            .addField('❯\u2000Publishers', `•\u2000 ${data.publishers ? data.publishers.join(', ') || '???' : '???'}`, true)
            .addField('❯\u2000Genres', `${data.genres ?  data.genres.map(m => `• ${m.description}`).join('\n') || '???' : '???'}`, true)
            .addFields([
            { name: '\u200b', value: text.truncate(decode(data.detailed_description.replace(/(<([^>]+)>)/ig,' ')),980)},
            { name: '❯\u2000Supported Languages', value: `•\u2000${text.truncate(html2md(data.supported_languages))}`},
            ])
            .setFooter(`Steam @ Steam.Inc©`)
            .setTimestamp()
        return interaction.editReply({ embeds: [embed] })
    })();
	},
};