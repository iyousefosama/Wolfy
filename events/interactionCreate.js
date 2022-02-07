const Discord = require('discord.js')
const schema = require('../schema/GuildSchema')

module.exports = {
    name: 'interactionCreate',
    async execute(client, interaction) {
      let data;
      try{
          data = await schema.findOne({
              GuildID: interaction.guild.id
          })
          if(!data) return interaction.reply(`\\❌ I can't find this guild \`data\` in the data base!`)
      } catch(err) {
          console.log(err)
          interaction.reply({ content: `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`})
      }
      
        if(interaction.isSelectMenu()){
          let choice = interaction.values[0]
          const member = interaction.member
          
          role1 = interaction.guild.roles.cache.get(data?.Mod.smroles.value1)
          role2 = interaction.guild.roles.cache.get(data?.Mod.smroles.value2)
          role3 = interaction.guild.roles.cache.get(data?.Mod.smroles.value3)
          role4 = interaction.guild.roles.cache.get(data?.Mod.smroles.value4)
          role5 = interaction.guild.roles.cache.get(data?.Mod.smroles.value5)
          role6 = interaction.guild.roles.cache.get(data?.Mod.smroles.value6)
          if(choice == data.Mod.smroles.value1){
          if(!role1) {
            return interaction.reply({content: `\\❌ I can't find this roloe in the guild!`, ephemeral: true})
          }
          if (member.roles.cache.has(role1.id)) {
            member.roles.remove(role1).catch(async (err)=> await interaction.channel.send({ content: `\\❌ Failed to remove the role **${role1}** for ${member.user.tag}, \`${err}\`!`}));
            interaction.reply({content: `<a:pp833:853495989796470815> Successfully removed ${role1} from you!`, ephemeral: true})
          } else{
            member.roles.add(role1).catch(async (err)=> await interaction.channel.send({ content: `\\❌ Failed to add the role **${role1}** for ${member.user.tag}, \`${err}\`!`}));
            interaction.reply({ content: `<a:pp330:853495519455215627> Successfully addded ${role1} for you!`, ephemeral: true })
          }
         } else if(choice == data.Mod.smroles.value2) {
          if(!role2) return interaction.reply({content: `\\❌ I can't find this roloe in the guild!`, ephemeral: true})
          if (member.roles.cache.has(role2.id)) {
            member.roles.remove(role2).catch(async (err)=> await interaction.channel.send({ content: `\\❌ Failed to remove the role **${role2}** for ${member.user.tag}, \`${err}\`!`}));
            interaction.reply({content: `<a:pp833:853495989796470815> Successfully removed ${role2} from you!`, ephemeral: true})
          } else{
            member.roles.add(role2).catch(async (err)=> await interaction.channel.send({ content: `\\❌ Failed to add the role **${role2}** for ${member.user.tag}, \`${err}\`!`}));
            interaction.reply({ content: `<a:pp330:853495519455215627> Successfully addded ${role2} for you!`, ephemeral: true })
          }
         } else if(choice == data.Mod.smroles.value3) {
          if(!role3) return interaction.reply({content: `\\❌ I can't find this roloe in the guild!`, ephemeral: true})
          if (member.roles.cache.has(role3.id)) {
            member.roles.remove(role3).catch(async (err)=> await interaction.channel.send({ content: `\\❌ Failed to remove the role **${role3}** for ${member.user.tag}, \`${err}\`!`}));
            interaction.reply({content: `<a:pp833:853495989796470815> Successfully removed ${role3} from you!`, ephemeral: true})
          } else{
            member.roles.add(role3).catch(async (err)=> await interaction.channel.send({ content: `\\❌ Failed to add the role **${role3}** for ${member.user.tag}, \`${err}\`!`}));
            interaction.reply({ content: `<a:pp330:853495519455215627> Successfully addded ${role3} for you!`, ephemeral: true })
          }
         } else if(choice == data.Mod.smroles.value4) {
          if(!role4) return interaction.reply({content: `\\❌ I can't find this roloe in the guild!`, ephemeral: true})
          if (member.roles.cache.has(role4.id)) {
            member.roles.remove(role4).catch(async (err)=> await interaction.channel.send({ content: `\\❌ Failed to add the role **${role4}** for ${member.user.tag}, \`${err}\`!`}));
            interaction.reply({content: `<a:pp833:853495989796470815> Successfully removed ${role4} from you!`, ephemeral: true})
          } else{
            member.roles.add(role4).catch(async (err)=> await interaction.channel.send({ content: `\\❌ Failed to add the role **${role4}** for ${member.user.tag}, \`${err}\`!`}));
            interaction.reply({ content: `<a:pp330:853495519455215627> Successfully addded ${role2} for you!`, ephemeral: true })
          }
         } else if(choice == data.Mod.smroles.value5) {
          if(!role5) return interaction.reply({content: `\\❌ I can't find this roloe in the guild!`, ephemeral: true})
          if (member.roles.cache.has(role5.id)) {
            member.roles.remove(role5).catch(async (err)=> await interaction.channel.send({ content: `\\❌ Failed to add the role **${role5}** for ${member.user.tag}, \`${err}\`!`}));
            interaction.reply({content: `<a:pp833:853495989796470815> Successfully removed ${role5} from you!`, ephemeral: true})
          } else{
            member.roles.add(role5).catch(async (err)=> await interaction.channel.send({ content: `\\❌ Failed to add the role **${role5}** for ${member.user.tag}, \`${err}\`!`}));
            interaction.reply({ content: `<a:pp330:853495519455215627> Successfully addded ${role5} for you!`, ephemeral: true })
          }
         } else if(choice == data.Mod.smroles.value6) {
          if(!role6) return interaction.reply({content: `\\❌ I can't find this roloe in the guild!`, ephemeral: true})
          if (member.roles.cache.has(role6.id)) {
            member.roles.remove(role6).catch(async (err)=> await interaction.channel.send({ content: `\\❌ Failed to add the role **${role6}** for ${member.user.tag}, \`${err}\`!`}));
            interaction.reply({content: `<a:pp833:853495989796470815> Successfully removed ${role6} from you!`, ephemeral: true})
          } else{
            member.roles.add(role6).catch(async (err)=> await interaction.channel.send({ content: `\\❌ Failed to add the role **${role6}** for ${member.user.tag}, \`${err}\`!`}));
            interaction.reply({ content: `<a:pp330:853495519455215627> Successfully addded ${role6} for you!`, ephemeral: true })
          }
         }
        }
        if (!interaction.isCommand()) return;

        const slash = client.slashCommands.get(interaction.commandName);
    
        if(!slash) {
          return;
        } else if(interaction.user.bot) {
          return;
        } else {
          // Do nothing..
        }
    
        try {
            if (slash.guildOnly && interaction.channel.type === 'DM') {
                return interaction.reply({ content: '<a:pp802:768864899543466006> I can\'t execute that command inside DMs!', ephemeral: true });
            }
      //+ permissions: [""],
      if (slash.permissions) {
        if (interaction.guild) {
            const sauthorPerms = interaction.channel.permissionsFor(interaction.user);
            if (!sauthorPerms || !sauthorPerms.has(slash.permissions)) {
    
               return interaction.reply({ content: `<a:pp802:768864899543466006> You don\'t have \`${slash.permissions}\` permission(s) to use ${interaction.commandName} command.`, ephemeral: true });
            }
           }
        }
    //+ clientpermissions: [""],
    if (slash.clientpermissions) {
       if (interaction.guild) {
       const sclientPerms = interaction.channel.permissionsFor(interaction.guild.me);
       if (!sclientPerms || !sclientPerms.has(slash.clientpermissions)) {
           return interaction.reply({ content: `<a:pp802:768864899543466006> The bot is missing \`${slash.clientpermissions}\` permission(s)!`, ephemeral: true });
       }
      }
    }  
    
    if (interaction.guild){
        if (!interaction.channel.permissionsFor(interaction.guild.me).has('SEND_MESSAGES')){
          return { executed: false, reason: 'PERMISSION_SEND'};
        } else {
          // Do nothing..
        };
      };
      if (interaction.guild){
        if (!interaction.channel.permissionsFor(interaction.guild.me).has('VIEW_CHANNEL')){
          return;
        } else {
          // Do nothing..
        };
      };
      if (interaction.guild){
        if (!interaction.channel.permissionsFor(interaction.guild.me).has('READ_MESSAGE_HISTORY')){
          return interaction.reply({ content: '"Missing Access", the bot is missing the \`READ_MESSAGE_HISTORY\` permission please enable it!'})
        } else {
          // Do nothing..
        };
      };
            console.log(`(/) ${interaction.user.tag}|(${interaction.user.id}) in #${interaction.channel.name}|(${interaction.channel.id}) used: /${interaction.commandName}`)
            await slash.execute(client, interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true }).catch(() => interaction.editReply({ content: 'There was an error while executing this command!', ephemeral: true }));
        }
    }
}