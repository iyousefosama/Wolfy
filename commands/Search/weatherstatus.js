const discord = require('discord.js')
const weather = require("weather-js");

/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
  name: "weather",
  aliases: ["weatherstatus", "weather-status"],
  dmOnly: false, //or false
  guildOnly: false, //or false
  args: true, //or false
  usage: '<city>',
  group: 'Search',
  description: 'Shows the weather status in any country',
  cooldown: 5, //seconds(s)
  guarded: false, //or false
  permissions: [],
  examples: [
    'Cairo, egypt'
  ],
  /**
   *
   * @param {import("discord.js").Client} client
   * @param {import("discord.js").Message} message
   * @param {String[]} args
   *
   */
  async execute(client, message, args) {
    let city = args.join(" ");
    let degreetype = "C"; // You can change it to F. (fahrenheit.)

    await weather.find({search: city, degreeType: degreetype}, function(err, result) {
        if (!city) return message.channel.send("Please insert the city.");
        if (err || result === undefined || result.length === 0) return message.channel.send({ content: "Unknown city. Please try again."});

        let current = result[0].current;
        let location = result[0].location;

        const embed = new discord.EmbedBuilder()
        .setAuthor({ name: '🗺 ' + current.observationpoint})
        .setDescription(`> ${current.skytext}`)
        .setThumbnail(current.imageUrl)
        .setTimestamp()
        .setColor(0x7289DA)
        .addFields([
          { name: "Latitude", value: location.lat, inline: true},
          { name: "Longitude", value:  location.long, inline: true},
          { name: "Feels Like", value: `${current.feelslike}° Degrees`, inline: true},
          { name: "Degree Type: ", value: location.degreetype, inline: true},
          { name: "Winds", value: current.winddisplay, inline: true},
          { name: "Humidity", value: `${current.humidity}%`, inline: true},
          { name: "Timezone", value: `GMT ${location.timezone}`, inline: true},
          { name: "Temperature: ", value: `${current.temperature}° Degrees`, inline: true},
          { name: "Observation:", value: current.observationtime, inline: true}
        ])
        .setFooter({ text: `${message.author.tag}`, iconURL: message.author.avatarURL({ dynamic: true })});
        
        return message.channel.send({ embeds: [embed] });
    })
  }
}