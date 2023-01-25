const schema = require('../schema/GuildSchema')
const UserSchema = require('../schema/Infraction-Schema')
const InfFunction = require('../functions/Infraction')
const { PermissionsBitField } = require('discord.js')

exports.checkMsg = async function (client, message) {
    if(!message) {
        return;
    }

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
       } else if (message.channel?.permissionsFor(message.member).has(PermissionsBitField.Flags.Administrator)) {
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
                // Start the Infraction for links at ../functions/Infraction bath
                InfFunction.Infraction(client, message)
                }, 100)
            })
           }
       }
  };