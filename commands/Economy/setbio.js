const discord = require('discord.js');
const schema = require('../../schema/Economy-Schema')

module.exports = {
    name: "setbio",
    aliases: ["SetBio", "SETBIO"],
    dmOnly: false, //or false
    guildOnly: false, //or false
    args: true, //or false
    usage: '<bio>',
    group: 'Economy',
    description: 'Sets your profile card bio.',
    cooldown: 30, //seconds(s)
    guarded: false, //or false
    permissions: [],
    examples: [], 
    async execute(client, message, args) {

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
        if (!args.length){
            return message.channel.send(`\\❌ **${message.author.tag}**, Please provide the bio! (max 200 char.)`);
          } else if (args.join(' ').length > 200){
            return message.channel.send(`\\❌ **${message.author.tag}**, Bio text limit! (max 200 char.)`);
          } else {
            data.profile.bio = args.join(' ');
      
            return data.save()
            .then(() => message.channel.send(`\\✔️ **${message.author.tag}**, Successfully set the your profile bio!`))
            .catch(() => message.channel.send(`\\❌ **${message.author.tag}**, your bio update failed!`))
          }
    }
}