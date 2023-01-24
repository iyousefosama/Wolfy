const discord= require('discord.js');
const schema = require('../../schema/Economy-Schema')
const { joinVoiceChannel } = require('@discordjs/voice');
const { Permissions } = require('discord.js');
const { AttachmentBuilder } = require('discord.js');
const { EmbedBuilder, GuildEmoji, ThreadAutoArchiveDuration, ChannelType } = require('discord.js');
const text = require('../../util/string');

module.exports = {
    name: "test",
    aliases: ["Test"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '',
    group: 'Unspecified',
    description: 'Developer test tool!',
    cooldown: 1, //seconds(s)
    guarded: false, //or false
    permissions: [],
    examples: [], 
    async execute(client, message, args) {
        /*
        let Channel = client.channels.cache.get("908906299511685150")
        const connection = joinVoiceChannel({
            channelId: Channel.id,
            guildId: Channel.guild.id,
            adapterCreator: Channel.guild.voiceAdapterCreator,
        });
         const emojisArgs = args.toString().split("><").join("> <")
         const Emojis = emojisArgs.split(' ');
         console.log(emojisArgs, Emojis)
         let NewRow = [];
         let emoticon;
         let emoji;
         for (let i = 0; i <= Emojis.length - 1; i++) {
            emoticon = require('discord.js').Util.parseEmoji(Emojis[i]);

            if(emoticon.id == null) return message.channel.send(`${Emojis[i]} I could not find this emoji!`);
            if(message.guild.emojis.cache.has(emoticon.id)) return message.reply(`${emoticon.name} That emoji is already on the server`)
   
            emoji = `https://cdn.discordapp.com/emojis/${emoticon.id}.${emoticon.animated  ? 'gif' : 'png'}`
            NewRow.push(emoji)
         }
         try {
         NewRow.forEach(e => {
         message.guild.emojis.create(e, e.name || 'Emoji')
         });
         await message.reply(`Successfully added ${Emojis.join(' ')} emoji to this server!`)
         }catch(error){
           return message.channel.send(`An error has occurred ${error}`)
         }
        */
       /*
         const fields = [];

         for (const group of Object.keys(client.commands.group).filter(g => g !== 'unspecified')){
           fields.push({
             name: group.charAt(0).toUpperCase() + group.slice(1).toLowerCase(), inline: true,
             value: text.joinArray(client.commands.group.get(group).map(x => `\`${x.name}\``))
           });
         };
     
         if (client.commands.group.get('unspecified').size){
           fields.push({
             name: 'Unspecified', inline: true,
             value: text.joinArray(client.commands.group.get('unspecified').map(x => `\`${x.name}\``))
           });
         };
     
         return message.channel.send(
           new EmbedBuilder()
           .setColor('Grey')
           .addFields(fields.sort((A,B) => B.value.length - A.value.length))
           .setDescription([
             `You may get the full detail of each command by typing \`help <command>\``,
             'Alternatively, you may check out  for full command details'
           ].join('\n'))
         );
         */
        /*
         const fs = require('fs');
         
         const file = fs.readFileSync('commands/test/commands.json')
         
         const data = JSON.parse(file.toString());
         let NewCommands;
         [client.commands].forEach(cmd => {
          data.push(cmd)
          //Important Line when Creating/Adding a Data to JSON
          NewCommands = JSON.stringify(cmd, null, 4)
          fs.writeFileSync('commands/test/commands.json', NewCommands)
         })

         console.log("Done...")
         */

         /* THE COMMANDS LIST
         const text = require('../../util/string');

         const fields = [];
         const groups = [];

         for (let cmd of client.commands){
          cmd = cmd[1]
          if(cmd.group) {
            groups.push(cmd.group);
          }
        };

        var uniqueArr = [...new Set(groups)]

         for (let group of uniqueArr.filter(g => g !== 'unspecified')){
           fields.push({
             name: group.charAt(0).toUpperCase() + group.slice(1).toLowerCase(), inline: true,
             value: text.joinArray(client.commands.filter(x => x.group == group).map(x => `\`${x.name}\``))
           });
         };
     
         return message.channel.send({ embeds: [
           new EmbedBuilder()
           .setColor('Grey')
           .addFields(fields.sort((A,B) => B.value.length - A.value.length))
           .setAuthor({ name: 'Wolfy\'s full commands list!'})
           .setFooter({ text: `Command List | \©️${new Date().getFullYear()} wolfy`})
           .setDescription([
             `You may get the full detail of each command by typing \`${client.prefix}help <command>\``
           ].join('\n'))
         ]});
         */
        /*
         const got = require('got'); // if you don't have "got" - install it with "npm install got"

         const apiKey = 'acc_b980ae380f93926';
         const apiSecret = '8b46b320a9a26dd1616c9a0fe60c942e';
         
         const imageUrl = args[0];
         const url = 'https://api.imagga.com/v2/categories/personal_photos?image_url=' + encodeURIComponent(imageUrl);
         
         (async () => {
             try {
                 const response = await got(url, {username: apiKey, password: apiSecret});
                 console.log(response.body);
             } catch (error) {
                 console.log(error.response.body);
             }
         })();
         */

         /*
         // Create a new private thread
         message.channel.threads
         .create({
          name: 'mod-talk',
          autoArchiveDuration: ThreadAutoArchiveDuration.OneDay,
          type: ChannelType.PrivateThread,
          reason: 'Needed a separate thread for moderation',
        })
       .then(async threadChannel => {
         message.channel.send("Done craeted!")
         await threadChannel.members.add('681146368361889905')
         await threadChannel.members.add(message.author.id)
         message.guild.roles.cache.find(r => r.perm)
       })
       */


}
}