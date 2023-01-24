const discord = require('discord.js')
const schema = require('../schema/GuildSchema')
const UserSchema = require('../schema/LevelingSystem-Schema')

exports.Level = async function (message) {

    if(!message) {
        return;
    }

    let data;
    let Userdata;
    try{
        data = await schema.findOne({
            GuildID: message.guild.id
        })
        Userdata = await UserSchema.findOne({
            userId: message.author.id,
            guildId: message.guild.id
        })

        if(!data) {
          return;
        }

        if(!Userdata) {
          Userdata = await UserSchema.create({
            userId: message.author.id,
            guildId: message.guild.id
        })
        
        }
    } catch(err) {
        console.log(err)
        message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`)
    }

    if(!data.Mod.Level.isEnabled) {
      return;
    }

    const randomXp = Math.floor(Math.random() * 46) + 1;
    Userdata.System.xp += randomXp;
    if(Userdata.System.xp >= Userdata.System.required) {
        Userdata.System.required = Math.floor((Userdata.System.level +1) * (Userdata.System.level +1) * 100);
        Userdata.System.level++
        const LevelUp = new discord.EmbedBuilder()
        .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({dynamic: true, size: 2048})})
        .setDescription(`${message.author}, You have leveled up to level **${Userdata.System.level}!** <a:pp330:853495519455215627>`)
        .setColor('DarkGreen')
        .setTimestamp()
        message.channel.send({ embeds: [LevelUp] }).then(msg => {
            setTimeout(() => {
                msg.delete().catch(() => null)
             }, 5000)

             if(!data.Mod.Level.Roles.length) return;
             let role = data.Mod.Level.Roles.filter(x => x.Level == Userdata.System.level)
             if(role) {
              const RoleToAdd = message.guild.roles.cache.get(role[0]?.RoleId)
              message.member.roles.add(RoleToAdd).catch(() => null);
             } else {
              // Do nothing..
             }
    })
    }
    await Userdata.save();
  };