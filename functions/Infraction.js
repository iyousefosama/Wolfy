const InfSchema = require('../schema/Infraction-Schema')
const schema = require('../schema/GuildSchema')

exports.Infraction = async function (client, message) {

    let GuildData;
    let data;
    try{
      GuildData = await schema.findOne({
          GuildID: message.guild.id
       })
      data = await InfSchema.findOne({
          guildId: message.guild.id,
          userId: message.author.id
      })
      if(!data) {
        data = await InfSchema.create({
          guildId: message.guild.id,
          userId: message.author.id
        })
      }
    } catch(err) {
        console.log(err)
        return message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`)
    }

    if (!GuildData || !data || !GuildData.Mod.Infraction?.isEnabled) {
      return;
    }

    let time = Date.now() + GuildData.Mod.Infraction.TimeReset;
    data.reset = time;
    data.current++;
    await data.save()


        if (data.current >= GuildData.Mod.Infraction.Options.MaxkickP) {
              let reason = 'Reaching maximum points of **kick** points in infraction system!'

              if (client.owners.includes(message.member.id)){
                return;
              } else if (!message.member.kickable){
                return message.channel.send(`\\❌ | ${message.author} I couldn't kick that user!`)
              }

              return message.member.kick({ reason: `\`Wolfy AutoMod KICK:\` ${reason || 'Unspecified'}`})
              .then(_member => message.channel.send({ content: `⚠️ Wolfy AutoMod KICK: ${reason || 'Unspecified'}`}))
              .catch(() => message.channel.send(`\\❌ Failed to kicked **${message.member.user.tag}**!`));
            } else if (data.current >= GuildData.Mod.Infraction.Options.MaxkickP) {
              reason = 'Reaching maximum points of **ban** points in infraction system!'

              if (message.member.id === client.user.id){
                return;
              } else if (client.owners.includes(message.member.id)){
                return;
              } else if (!message.member.bannable){
                return message.channel.send(`\\❌ | ${message.author} I couldn't ban that user!`)
              };
          
              return message.guild.members.ban(member, { reason:  `Wolfy BAN: ${reason || 'Unspecified'}` })
              .then(() => message.channel.send({ content: `\`Wolfy AutoMod BAN:\` ${reason || 'Unspecified'}`}))
              .catch(() => message.channel.send(`\\❌ | ${message.author}, Unable to ban **${message.member.user.tag}**!`));
      } else { 
        return message.channel.send(`⚠️ ${message.author}, Your action is not allowed in this server!` + `\nTotal Infraction points is \`${data.current}\` from \`${data.current > GuildData.Mod.Infraction.Options.MaxkickP ? GuildData.Mod.Infraction.Options.MaxbanP + ' to ban!' : GuildData.Mod.Infraction.Options.MaxkickP + ' to kick!'}\``)
      }

};