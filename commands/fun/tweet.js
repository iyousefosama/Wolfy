const canvacord = require("canvacord");
const Discord = require("discord.js")
const fetch = require("node-fetch");

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;
    var loading = new Discord.MessageEmbed()
    .setColor(`YELLOW`)
    .setDescription(`<a:Loading_Color:759734580122484757> Loading...`)
    var msg = await message.channel.send(loading)
        let text = args.slice(0).join(" ");


        if(!text){

            return m.edit("You must enter a message! <a:pp681:774089750373597185>");
        }
if(text.length > 100) return message.channel.send('Sorry you can\`t type more than 100 letters!')


        try {
            let res = await fetch(encodeURI(`https://nekobot.xyz/api/imagegen?type=tweet&username=${message.author.username}&text=${text}`));
            let json = await res.json();
            let attachment = new Discord.MessageAttachment(json.message, "tweet.png");
            await message.channel.send(``, attachment);
            msg.delete();
        } catch(e){
            m.edit("Error, Try Again! Mention Someone");
            
        }
};


module.exports.help = {
    name: "tweet",
    aliases: ['Tweet']
}