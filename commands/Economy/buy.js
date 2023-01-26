const market = require('../../assets/json/market.json');
const schema = require('../../schema/Economy-Schema')
const text = require('../../util/string');

module.exports = {
    name: "buy",
    aliases: ["Buy", "BUY"],
    dmOnly: false, //or false
    guildOnly: false, //or false
    args: true, //or false
    usage: '[item id]',
    group: 'Economy',
    description: 'To buy items from the market.',
    cooldown: 2, //seconds(s)
    guarded: false, //or false
    permissions: [],
    examples: [
      '1',
      '6'
    ],
    async execute(client, message, [id]) {
        let data;
        try{
            data = await schema.findOne({
                userID: message.author.id
            })
            if(!data) {
            data = await schema.create({
                userID: message.author.id
            })
            }
        } catch(err) {
            console.log(err)
        }

        const item = market.find(x => x.id == id);

        if (!item || item == null){
          return message.channel.send([
            `\\❌ **${message.author.tag}**, Could not find this \`item ID\`!`,
            `The proper usage for this command would be \`${client.prefix}buy [item id]\`.`,
            `Example: \`${client.prefix}buy ${Math.floor(Math.random() * market.length)}\``
          ].join('\n'));
        }

        const old = data.profile.inventory.find(x => x.id === item.id);
        const total = item.price;
        
         if(old) {
          return message.channel.send(`\\❌ **${message.author.tag}**, you already have this item in your inventory`)
        } else if (data.credits < total) { 
          return message.channel.send([
            `\\❌ **${message.author.tag}**, You do not have enough credits to proceed with this transaction!`,
            `You need **${text.commatize(total - data.credits)}** more for **${item.name}**`
          ].join('\n'));
        } else {
 
          data.profile.inventory.push({
            id: item.id
          })
          data.credits = data.credits - total;
          await data.save()
        .then(() => message.channel.send(`<a:Bagopen:877975110806540379> **${message.author.tag}**, Successfully purchased **${item.name}!** for \`${text.commatize(item.price)}\``))
        .catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`))
        }
    }
}