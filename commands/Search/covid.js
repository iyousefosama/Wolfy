const discord = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    name: "covid",
    aliases: ["Covid", "COVID"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<countrie>',
    group: 'Search',
    description: 'Shows informations about covid in any country',
    cooldown: 3, //seconds(s)
    guarded: false, //or false
    permissions: [],
    examples: [
        'Canada',
        'all'
      ],
    async execute(client, message, args) {
        let countries = args.join(" ");

        const noArgs = new discord.EmbedBuilder()
        .setTitle('Invalid Command Usage')
        .setColor(0xFF0000)
        .setDescription(`You Can Try Using **${client.prefix}covid all** or **${client.prefix}covid Canada**`)

        if(!args[0]) return message.channel.send({ embeds: [noArgs] });


        if(args[0] === "all"){
            fetch(`https://covid19.mathdro.id/api`)
            .then(response => response.json())
            .then(data => {
                let confirmed = data.confirmed.value.toLocaleString()
                let recovered = data.recovered.value.toLocaleString()
                let deaths = data.deaths.value.toLocaleString()

                const embed = new discord.EmbedBuilder()
                .setTitle(`Worldwide COVID-19 Stats 🌎`)
                .addField('Confirmed Cases', confirmed)
                .addField('Recovered', recovered)
                .addField('💀 Deaths', deaths)

                message.channel.send({ embeds: [embed] })
            })
        } else {
            fetch(`https://covid19.mathdro.id/api/countries/${countries}`)
            .then(response => response.json())
            .then(data => {
                let confirmed = data.confirmed.value.toLocaleString()
                let recovered = data.recovered.value.toLocaleString()
                let deaths = data.deaths.value.toLocaleString()

                const embed = new discord.EmbedBuilder()
                .setTitle(`COVID-19 Stats for **${countries}**`)
                .addField('Confirmed Cases', confirmed)
                .addField('Recovered', recovered)
                .addField('💀 Deaths', deaths)

                message.channel.send({ embeds: [embed] })
            }).catch(e => {
                return message.channel.send({ content: 'Invalid country provided'})
            })
        }
    }
}
