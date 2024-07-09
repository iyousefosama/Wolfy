const market = require('../../assets/json/market.json');
const schema = require('../../schema/Economy-Schema')

/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
    name: "use",
    aliases: ["Use", "USE", "equip"],
    dmOnly: false, //or false
    guildOnly: false, //or false
    args: true, //or false
    usage: '[item id]',
    group: 'Economy',
    description: 'Equips an item from your inventory.',
    cooldown: 2, //seconds(s)
    guarded: false, //or false
    permissions: [],
    examples: [
        '6',
        '8'
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

        const item = data.profile.inventory.find(x => x.id == id);

        if (!item){
          return message.channel.send(`\\❌ **${message.author.tag}**, You do not have this item in your inventory!`);
        };
    
        const metadata = market.find(x => x.id === item.id);
    
        if (!metadata){
          return message.channel.send(`\\❌ **${message.author.tag}**, This item can no longer be used!`);
        };

        if(metadata.assets?.link == null) {
            return message.channel.send(`\\❌ **${message.author.tag}**, You can't use this item!`);
        }
    
        data.profile[metadata.type] = metadata.assets.link;
    
        return data.save()
        .then(() => message.channel.send(`\\✔️ **${message.author.tag}**, Successfully used **${metadata.name}!**`))
        .catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`));
    }
}