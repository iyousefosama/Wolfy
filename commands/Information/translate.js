const discord = require('discord.js');

module.exports = {
    name: "translate",
    aliases: ["Translate"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<language code> <language to translate>',
    group: 'Informations',
    description: 'Translate from to any language you want!',
    cooldown: 5, //seconds(s)
    guarded: false, //or false
    permissions: [],
    clientpermissions: [],
    examples: [],
    async execute(client, message, [lang='', ...args]) {

        const text = args.slice(0).join(" ")

        const fetch = require('node-fetch');

        const encodedParams = new URLSearchParams();
        encodedParams.append("q", text);
        encodedParams.append("target", lang);
        
        const url = 'https://google-translate1.p.rapidapi.com/language/translate/v2';
        
        const options = {
          method: 'POST',
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Accept-Encoding': 'application/gzip',
            'X-RapidAPI-Key': 'fb2e04e80fmsh04e1c6145236183p1be7b5jsn634d4772bd71',
            'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com'
          },
          body: encodedParams
        };
        
        const LangCodes = ["Afrikaans af", "Albanian sq", "Amharic am", "Arabic ar", "Chinese (Simplified) zh-CN (BCP-47)", "Dutch nl", "English en", "French fr"]
        fetch(url, options)
            .then(res => res.json())
            .then(json => {
              const embed = new discord.EmbedBuilder()
              .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
              .setDescription([
                '<:star:888264104026992670> Translations:\n',
                json.data.translations.map(x => `\`${x.translatedText}\`\n`)
              ].join(" "))
              .setColor('#2c2f33')
              .setTimestamp()
              .setFooter({ text: `Translated to ${lang} | \©️${new Date().getFullYear()} Wolfy`, iconURL: message.guild.iconURL({dynamic: true}) })
              return message.reply({ embeds: [embed] }).catch(() => null);
            })
            .catch(err => {
              if(err.name == 'TypeError') {
                const LangsE = new discord.EmbedBuilder()
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                .setDescription(`Make sure that you typed a valid language code.\n\nLanguage - ISO-639-1 Codes(like):\n\`\`\`${LangCodes.map(x => x).join(", ")}\`\`\``)
                .setColor('Red')
                .setTimestamp()
                .setFooter({ text: `Translated to ${lang} | \©️${new Date().getFullYear()} Wolfy`, iconURL: message.guild.iconURL({dynamic: true}) })
                return message.channel.send({ embeds: [LangsE] });
              } else {
                return message.channel.send(`${message.author}, There was an error, please try again later!`)
              }
            });
}
}