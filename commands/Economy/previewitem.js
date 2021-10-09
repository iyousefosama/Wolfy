const discord = require('discord.js');
const market = require('../../assets/json/market.json');
const text = require('../../util/string');

module.exports = {
    name: "previewitem",
    aliases: ["Previewitem"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '[item ID]',
    group: 'Economy',
    description: 'Check what you can buy from the shop.',
    cooldown: 5, //seconds(s)
    guarded: false, //or false
    clientPermissions: [ 'MANAGE_MESSAGES', 'ATTACH_FILES' ],
    permissions: [],
    examples: [
        '6',
        '8'
    ], 
    async execute(client, message, [id]) {
        if (!id){
            return message.channel.send(`\\❌ **${message.author.tag}**, Please specify the item ID!`);
          };
      
          let selected = market.find(x => x.id == id);
      
          if (!selected){
            return message.channel.send(`\\❌ **${message.author.tag}**, Could not find the item with that id!`);
          };

          if(selected.assets?.link == null) {
            return message.channel.send(`\\❌ **${message.author.tag}**, there is no preview for this item!`);
          }

          return message.reply({ content: `> \`Item Name:\` **${selected.name}**, \`Item Type:\` **${selected.type}**, \`Item Price:\` **${text.commatize(selected.price)}**`, embeds: [{ image: { url: selected.assets.link }, color: 9807270}] })
    }
}