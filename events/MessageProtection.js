const Discord = require('discord.js')
const schema = require('../schema/GuildSchema')
const UserSchema = require('../schema/Infraction-Schema')

module.exports = {
    name: 'messageCreate',
    async execute(client, message) {
        if (message.author == client.user) return;
        if (message.author.bot){
            return;
          };
          if (!message.guild) {
              return;
          };

          let GuildData;
          let data;
          try{
            GuildData = await schema.findOne({
                  GuildID: message.guild.id
              })
            data = await UserSchema.findOne({
                guildId: message.guild.id,
                userId: message.author.id
            })
            if(!data) {
              data = await UserSchema.create({
                guildId: message.guild.id,
                userId: message.author.id
              })
            }
          } catch(err) {
              console.log(err)
              message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`)
          }

          const owner = await message.guild.fetchOwner()
          if (message.author.id === message.guild.ownerId) {
            return;
           } else if (message.channel.permissionsFor(message.author).has("ADMINISTRATOR")) {
            return;
           } else if (!GuildData || !data || !GuildData.Mod.Infraction?.isEnabled) {
             return;
           } else {
             // Do nothing..
           };
           

           if(GuildData.Mod.AntiLink?.isEnabled) {
            if (message.content.toLowerCase().includes(`http://`) || message.content.toLowerCase().includes(`https://`) || message.content.toLowerCase().includes(`discord.gg/`)) {
                message.delete().then(() => {
                    setTimeout(async () => {
                    let time = Date.now() + GuildData.Mod.Infraction.TimeReset;
                    data.reset = time;
                    data.current++;
                    await data.save()
                    return message.channel.send(`⚠️ ${message.author}, Links and discord server invite links are not allowed in this server!` + `\nTotal Infraction points is \`${data.current}\` from \`${data.current > GuildData.Mod.Infraction.Options.MaxkickP ? GuildData.Mod.Infraction.Options.MaxbanP + ' to ban!' : GuildData.Mod.Infraction.Options.MaxkickP + ' to kick!'}\``)
                    }, 100)
                })
               }
           }
    }
}