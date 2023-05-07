const discord= require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');
const tc = require('../functions/TimeConvert')
const cfl = require('../functions/CapitalizedChar')
const moment = require("moment");

module.exports = {
    clientpermissions: [discord.PermissionsBitField.Flags.EmbedLinks, discord.PermissionsBitField.Flags.ReadMessageHistory],
	data: new SlashCommandBuilder()
		.setName('prays')
		.setDescription('Replies with prays times!')
        .addStringOption(option => option.setName('country').setDescription('Enter country name.').setRequired(true))
        .addStringOption(option => option.setName('city').setDescription('Enter city name.').setRequired(true))
        .addBooleanOption(option => option.setName('summertime').setDescription('Enable/Disable summer time')),
	async execute(client, interaction) {
        const country = interaction.options.getString('country');
        const city = interaction.options.getString('city');
        const summertime = interaction.options.getBoolean('summertime');

        const url = `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}}`;
        const options = {
          method: "GET",
        };
        fetch(url, options)
            .then(res => res.json())
            .then(async json => {
                if(json.code != 200) {
                  return interaction.editReply({ content: '<:error:888264104081522698> Please enter valid country and city in the options!' });
                };
                var json_data = json.data.timings;
                var result = [];
                for(var i in json_data)
                result.push([i, json_data [i]]);
                const len = json_data.Imsak.length-1;
                result.splice(-len)

                let d;
                let dinMS;
                try {

                const timezone = json.data.meta.timezone;

                let options = {};

                if (timezone) {
                  options = {
                    timeZone: timezone,
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric',
                    millisecond: 'numeric',
                  },
                  formatter = new Intl.DateTimeFormat([], options);

                  d = new Date(formatter.format(new Date()).split(",").join(" "))
                  dinMS = Math.floor(d.getTime() / 1000)
                } else {
                  return await interaction.editReply({ content: '<:error:888264104081522698> I can\'t identify this timezone, please write the right \`County, City\`!' });
                }
                options = {
                  timeZone: timezone,
                  year: 'numeric',
                  month: 'numeric',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  second: 'numeric',
                  millisecond: 'numeric',
                },
                formatter = new Intl.DateTimeFormat([], options);
                d = new Date(formatter.format(new Date()).split(",").join(" "))
                summertime ? d.setHours(d.getHours() + 1) : d.getTime() // add one hour for summer timezones
                dinMS = Math.floor(d.getTime() / 1000)

              } catch(e) {
                console.log(e)
                return await interaction.editReply({ content: '<:error:888264104081522698> I can\'t identify this timezone, please write the right \`Continent\`!' });
              }

                let pTimeInS;
                let str;
                let nxtStr = null;
                let num = -1;
                let marked = false;
                result.forEach(async pTime => {
                  num++
                  str = `${json.data.date.readable.split(' ').join('/')} ${pTime[1]}`;
                  const [dateComponents, timeComponents] = str.split(' ');
                  const [day, month, year] = dateComponents.split('/');
                  const [hours, minutes] = timeComponents.split(':');
             
                  pTimeInS = Math.floor(new Date(+year, +moment().month(month).format("M")-1, +day, +hours, +minutes, +00).getTime() / 1000);
                  if(dinMS < pTimeInS) {
                    if(!marked) {
                      const TimeDiff = Math.floor(pTimeInS - dinMS);
                      nxtStr = `${pTime[0]}  \`<t:${TimeDiff}:R>\`!`
                      result[num][0] = pTime[0] + '(\`Next\`)'
                      marked = true;
                    }
                  }
                });
                
                const embed = new discord.EmbedBuilder()
                .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
                .setDescription(`<:Tag:836168214525509653> Praying times for continent \`${cfl.capitalizeFirstLetter(country)}\` in city \`${cfl.capitalizeFirstLetter(city)}\`!`)
                .addFields(
                    { name: '<:star:888264104026992670> Date', value: `<t:${dinMS}>`, inline: false},
                    { name: '<:Timer:853494926850654249> Next Pray in:', value: nxtStr || "Tomorrow!", inline: false},
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
            .catch((err) => interaction.editReply({ content: '<:error:888264104081522698> Something went wrong, please try again later!' }));
	},
};