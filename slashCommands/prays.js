const discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');
const tc = require('../functions/TimeConvert')
const cfl = require('../functions/CapitalizedChar')
const moment = require("moment-timezone");

module.exports = {
    clientpermissions: [discord.PermissionsBitField.Flags.EmbedLinks, discord.PermissionsBitField.Flags.ReadMessageHistory],
	data: new SlashCommandBuilder()
		.setName('prays')
		.setDescription('Replies with prays times!')
        .addStringOption(option => option.setName('location').setDescription('Name of the location or state-name or country-name or latitude and longitude .').setRequired(true)),
	async execute(client, interaction) {
        const location = interaction.options.getString('location');

        const url = `https://muslimsalat.p.rapidapi.com/${location}.json`;
        const options = {
          method: 'GET',
          headers: {
            'content-type': 'application/octet-stream',
            'X-RapidAPI-Key': 'f89e968f93msh68f7a95ca0c5119p175720jsnbe7d03e7d5f0',
            'X-RapidAPI-Host': 'muslimsalat.p.rapidapi.com'
          }
        };
        fetch(url, options)
            .then(res => res.json())
            .then(async json => {
                if(typeof json.data === "string" && json.status_error) {
                  return interaction.editReply({ content: '<:error:888264104081522698> Please enter valid country and city in the options!' });
                };

                var json_data = json.items[0];

                var result = [];

                for(var i in json_data)
                result.push([i, json_data [i]]);

                result.shift()

                let d;
                let dinMS;
                try {

                const timezone = moment.tz.guess([json.longitude, json.latitude]);

                let options = {
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
              } catch {
                return await interaction.editReply({ content: '<:error:888264104081522698> I can\'t identify this timezone, please write the right \`location\`!' });
              }

                let pTimeInS;
                let str;
                let nxtStr = null;
                let num = -1;
                let marked = false;

                result.forEach(async pTime => {
                  num++
                  str = `${json.items[0].date_for.split('-').join('/')} ${tc.t24Convert(pTime[1])}`;

                  const [dateComponents, timeComponents] = str.split(' ');
                  const [year, month, day] = dateComponents.split('/');
                  const [hours, minutes] = timeComponents.split(':');
             
                  pTimeInS = new Date(+year, +moment().month(month).format("M")-1, +day, +hours, +minutes, +00).getTime();
                  pTimeInS = Math.floor(pTimeInS / 1000)
                  console.log(pTimeInS)
                  console.log(dinMS)

                  if(dinMS < Math.floor(pTimeInS)) {
                    if(!marked) {
                      const TimeDiff = Math.floor((pTimeInS) - dinMS);
                      nxtStr = `${pTime[0]}  \`${moment.duration(TimeDiff * 1000, 'milliseconds').format('H [hours, and] m [minutes,]')}\`!`
                      result[num][0] = pTime[0] + '(\`Next\`)'
                      marked = true;
                    }
                  }
                });

                

                console.log(json)
                const embed = new discord.EmbedBuilder()
                .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
                .setDescription(`<:Tag:836168214525509653> Praying times for \`${json.country}\` \`${json.state}\`!`)
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
            .catch((err) => {
              interaction.editReply({ content: '<:error:888264104081522698> Something went wrong, please try again later!' })
            });
	},
};
