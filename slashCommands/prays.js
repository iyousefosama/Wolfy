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

                var json_data = json.data.timings;
                var result = [];

                for(var i in json_data)
                result.push([i, json_data [i]]);

                const len = json.data.timings.Imsak.length-1;
                result.splice(-len)

                const d = new Date();
                let pTimeInS;
                let str;
                let nxtStr;
                let num = -1;
                let marked = false;
                result.forEach(pTime => {
                  num++
                  str = `${json.data.date.readable.split(' ').join('/')} ${pTime[1]}`;

                  const [dateComponents, timeComponents] = str.split(' ');
                  const [day, month, year] = dateComponents.split('/');
                  const [hours, minutes] = timeComponents.split(':');
             
                  pTimeInS = new Date(+year, moment().month(month).format("M")-1, +day, +hours, +minutes, +00).getTime();
                  if(json.data.date.timestamp < Math.floor(pTimeInS / 1000)) {
                    if(!marked) {
                      const now = Date.now();
                      nxtStr = `${pTime[0]}  \`${moment.duration(Math.floor(pTimeInS) - now, 'milliseconds').format('H [hours, and] m [minutes,]')}\``
                      result[num][0] = pTime[0] + '(\`Next\`)'
                      marked = true;
                    }
                  }
                });
                

                const embed = new discord.MessageEmbed()
                .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
                .setDescription(`<:Tag:836168214525509653> Praying times for country \`${cfl.capitalizeFirstLetter(country)}\` in city \`${cfl.capitalizeFirstLetter(city)}\`!`)
                .addFields(
                    { name: '<:star:888264104026992670> Date', value: `<t:${json.data.date.timestamp}>`, inline: false},
                    { name: '<:Timer:853494926850654249> Next Pray in:', value: nxtStr, inline: false},
                    { name: ' ‍ ', value: ` ‍ `, inline: false}
                )
                .addFields(
                  result.flatMap(i => [
                    { name: i[0], value: `\`\`\`${tc.tConvert(i[1])}\`\`\``, inline: true },
                  ])
                )
                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true })})
                .setTimestamp()
                interaction.editReply({ embeds: [embed] });
            })
            .catch(() => interaction.editReply({ content: '<:error:888264104081522698> Something went wrong, please try again later!' }));
	},
};
