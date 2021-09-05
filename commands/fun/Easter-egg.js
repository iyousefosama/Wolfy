const discord = require('discord.js');
const axios = require('axios');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "omayowolf",
    aliases: ["OMAYOWOLF", "OmayoWolf"],
    dmOnly: true, //or false
    guildOnly: false, //or false
    args: false, //or false
    usage: '',
    cooldown: 9600, //seconds(s)
    guarded: false, //or false
    async execute(client, message, args) {
    message.channel.sendTyping()
    const filter = msg => msg.author.id == message.author.id;

    let numbers = new discord.MessageEmbed()
    .setDescription(`\n\`\`\`01010100 01101000 01100101 01001100 01100101 01100111 01100101 01101110 01100100 01100001 01110010 01111001 01000010 01100001 01110011 01101011 01101111 01110100 01100001 01001101 01100001 01101110\`\`\``)
    let easter = new discord.MessageEmbed()
    .setAuthor(client.user.username, client.user.displayAvatarURL())
    .setThumbnail(message.author.displayAvatarURL({dynamic: true, format: 'png', size: 512}))
    .setColor(`DARK_GREEN`)
    .setDescription(`You just found the bot \`easter egg\`!\n\`\`\`Type the secret password to complete this!\`\`\``)
    .setFooter(message.author.username, message.author.displayAvatarURL())
    let loading = new discord.MessageEmbed()
    .setColor(`YELLOW`)
    .setDescription(`<a:Chest:853495583238651905> You have a gift from the bot developer! wait until opening the **gift box**...`)
    let win = new discord.MessageEmbed()
    .setColor(`GREEN`)
    .setDescription(`\`\`\`https://ptb.discordapp.com/store/skus/550277544025522176/heroes-generals-wwii 
    https://ptb.discordapp.com/store/skus/488607666231443456/minion-masters/ 
    https://ptb.discordapp.com/store/skus/528145079819436043/paladins 
    https://ptb.discordapp.com/store/skus/518088627234930688/realm-royale 
    https://ptb.discord.com/store/skus/519249930611589141/sandboxes 
    https://ptb.discordapp.com/store/skus/494959992483348480/warframe 
    https://ptb.discordapp.com/store/skus/519338998791929866/zombsroyale-io 
    https://ptb.discordapp.com/store/skus/420676877766623232/scp-secret-laboratory%7C
    https://ptb.discordapp.com/store/skus/519338998791929866/zombsroyale-io
    https://ptb.discord.com/store/skus/420676877766623232/scp-secret-laboratory
    https://ptb.discord.com/store/skus/620936102064291871/patch-quest
    https://ptb.discord.com/store/skus/560643262424285194/pickcrafter
    https://ptb.discord.com/store/skus/565994833953554432/it-s-hard-being-a-dog
    https://ptb.discord.com/store/skus/554072621000556584/forestir
    https://ptb.discord.com/store/skus/601864041731719189/avoid
    https://ptb.discord.com/store/skus/620936102064291871/patch-quest
    https://ptb.discord.com/store/skus/528145079819436043/paladins
    https://ptb.discord.com/store/skus/554072621000556584/forestirForestir
    https://ptb.discord.com/store/skus/554072366213234729/the-adventures-of-pepel
    https://ptb.discord.com/store/skus/459415040227803141/star-sonata-2\`\`\``)
    message.channel.send({ embeds: [numbers] }).then(msg => {
        setTimeout(() => { 
            msg.edit({ embeds: [easter] })
         }, 500)
        })
        
    let col = await message.channel.awaitMessages({ filter, max: 1 })
    if(col.first().content !== 'TheLegendaryBaskotaMan!') return message.channel.send({ content: "<a:pp681:774089750373597185> **Wrong!**"});
    else if(col.first().content == `TheLegendaryBaskotaMan!`) return message.channel.send({ content: "<a:CHECKCHECK:841321920456556554> You typed the right password you are **awesome**!"}).then(msg => {
        setTimeout(() => { 
            setTimeout(function() {
                msg.edit({ embeds: [loading] })
            }, 500);
            setTimeout(function() {
                msg.edit({ content: `\`\`\`You win discord games reward!\`\`\``, embeds: [win] })
            }, 4000);
         }, 500)
        })
        
    }
}