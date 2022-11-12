const discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');
const tc = require('../functions/TimeConvert')
const cfl = require('../functions/CapitalizedChar')
const moment = require("moment");

module.exports = {
    clientpermissions: ['EMBED_LINKS', 'READ_MESSAGE_HISTORY'],
	data: new SlashCommandBuilder()
		.setName('prays')
		.setDescription('Replies with prays times!')
        .addStringOption(option => option.setName('country').setDescription('Enter country name.').setRequired(true))
        .addStringOption(option => option.setName('city').setDescription('Enter city name.').setRequired(true)),
	async execute(client, interaction) {
        const country = interaction.options.getString('country');
        const city = interaction.options.getString('city');
        const url = `https://aladhan.p.rapidapi.com/timingsByCity?country=${country}&city=${city}`;
        
        const options = {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': 'b335761898msh3524b71f87e82dbp1956dfjsn3ad103632169',
            'X-RapidAPI-Host': 'aladhan.p.rapidapi.com'
          }
        };
        fetch(url, options)
            .then(res => res.json())
            .then(json => {
                if(typeof json.data === "string" && json.data.startsWith('Unable to locate city and country')) {
                  return interaction.editReply({ content: '<:error:888264104081522698> Please enter valid country and city in the options!' });
                };

                const embed = new discord.MessageEmbed()
                .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
                .setDescription(`<:Tag:836168214525509653> Prays times for country \`${cfl.capitalizeFirstLetter(country)}\` in city \`${cfl.capitalizeFirstLetter(city)}\`!`)
                .addFields(
                    { name: 'Date', value: `<t:${json.data.date.timestamp}>`, inline: false},
                    { name: ' ‍ ', value: ` ‍ `, inline: false},
                    { name: 'Fajr', value: `\`\`\`${tc.tConvert(json.data.timings.Fajr)}\`\`\``, inline: true},
                    { name: 'Sunrise', value: `\`\`\`${tc.tConvert(json.data.timings.Sunrise)}\`\`\``, inline: true},
                    { name: 'Dhuhr', value: `\`\`\`${tc.tConvert(json.data.timings.Dhuhr)}\`\`\``, inline: true},
                    { name: 'Asr', value: `\`\`\`${tc.tConvert(json.data.timings.Asr)}\`\`\``, inline: true},
                    { name: 'Sunset', value: `\`\`\`${tc.tConvert(json.data.timings.Sunset)}\`\`\``, inline: true},
                    { name: 'Maghrib', value: `\`\`\`${tc.tConvert(json.data.timings.Maghrib)}\`\`\``, inline: true},
                    { name: 'Isha', value: `\`\`\`${tc.tConvert(json.data.timings.Isha)}\`\`\``, inline: true},
                )
                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true })})
                .setTimestamp()
                interaction.editReply({ embeds: [embed] });
            })
            .catch(() => interaction.editReply({ content: '<:error:888264104081522698> Something went wrong, please try again later!' }));
	},
};
