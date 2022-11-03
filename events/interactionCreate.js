const Discord = require('discord.js')
const { Collection } = require('discord.js')
const sourcebin = require('sourcebin_js');
const schema = require('../schema/GuildSchema')
const TicketSchema = require('../schema/Ticket-Schema')
const { MessageActionRow, MessageButton } = require('discord.js');
const cooldowns = new Collection();

module.exports = {
    name: 'interactionCreate',
    async execute(client, interaction) {
      try {
        // Permissions: To check for default permissions in the guild
        if (interaction.guild){
          if (!interaction.channel.permissionsFor(interaction.guild.me).has('SEND_MESSAGES')){
            return { executed: false, reason: 'PERMISSION_SEND'};
          } else {
            // Do nothing..
          };
          if (!interaction.channel.permissionsFor(interaction.guild.me).has('VIEW_CHANNEL')){
            return { executed: false, reason: 'PERMISSION_VIEW_CHANNEL'};
          } else {
            // Do nothing..
          };
          if (!interaction.channel.permissionsFor(interaction.guild.me).has('READ_MESSAGE_HISTORY')){
            return interaction.channel.send({ content: '"Missing Access", the bot is missing the \`READ_MESSAGE_HISTORY\` permission please enable it!'})
          } else {
            // Do nothing..
          };
          if (!interaction.channel.permissionsFor(interaction.guild.me).has('EMBED_LINKS')){
            return interaction.channel.send({ content: '\"Missing Permissions\", the bot is missing the \`EMBED_LINKS\` permission please enable it!'})
          } else {
            // Do nothing..
          };
        };
      } catch (err) {
        console.log(err)
      }
      let data;
      try{
          data = await schema.findOne({
              GuildID: interaction.guild.id
          })
      } catch(err) {
          console.log(err)
          interaction.reply({ content: `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`})
      }

      let TicketData;
      if (interaction.isButton()) {
        if(interaction.customId === '98418541981561') {
          interaction.deferUpdate()
          try{
          TicketData = await TicketSchema.findOne({
              guildId: interaction.guild.id,
              ChannelId: interaction.channel.id
          })
        } catch(err) {
            console.log(err)
            interaction.reply({ content: `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`})
        }
              //+ cooldown 1, //seconds(s)
              if (!cooldowns.has("98418541981561")) {
                  cooldowns.set("98418541981561", new Discord.Collection());
              }
              
              const now = Date.now();
              const timestamps = cooldowns.get("98418541981561");
              const cooldownAmount = (5 || 3) * 1000;
              
              if (timestamps.has(interaction.user.id)) {
                  const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
              
                  if (now < expirationTime) {
                      const timeLeft = (expirationTime - now) / 1000;
                      return interaction.channel.send({ content: ` **${interaction.user.username}**, please cool down! (**${timeLeft.toFixed(0)}** second(s) left)`}).then(msg => {
                          setTimeout(() => {
                              msg.delete().catch(() => null)
                           }, 3000)
                          })
                  }
              }
              timestamps.set(interaction.user.id, now);
              setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
          if(!TicketData) return interaction.channel.send(`\\❌ I can't find this guild \`data\` in the data base!`)
          if(TicketData.IsClosed) {
            return interaction.channel.send(`\\❌ This ticket is already closed!`)
          }
          const Channel = interaction.guild.channels.cache.get(TicketData.ChannelId)

          Channel.permissionOverwrites.edit(TicketData.UserId, {
                  VIEW_CHANNEL: false,
                  SEND_MESSAGES: false
        })

        const button = new MessageButton()
        .setLabel(`Transcript`)
        .setCustomId("98418541981564")
        .setStyle('SECONDARY')
        .setEmoji("853495194863534081");
        const button2 = new MessageButton()
        .setLabel(`Re-Open`)
        .setCustomId("98418541981565")
        .setStyle('PRIMARY')
        .setEmoji("🔓");
        const button3 = new MessageButton()
        .setLabel(`Delete`)
        .setCustomId("98418541981566")
        .setStyle('DANGER')
        .setEmoji("853496185443319809");
        const row = new MessageActionRow()
        .addComponents(button, button2, button3);
        const Closed = new Discord.MessageEmbed()
        .setAuthor({ name: `Closed by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
        .setColor("#2F3136")
        .setDescription(`\`\`\`Support team ticket controls\`\`\``)
        TicketData.IsClosed = true;
        await TicketData.save().then(() => {
          interaction.channel.send({ embeds: [Closed], components: [row]})
        }).catch(() => {
          interaction.channel.send({ content: `\`❌ [ERR]:\` Something is wrong, please try again later!`})
        })
        } else if(interaction.customId == "98418541981564") {
          interaction.deferUpdate()
          try{
            TicketData = await TicketSchema.findOne({
                guildId: interaction.guild.id,
                ChannelId: interaction.channel.id
            })
          } catch(err) {
              console.log(err)
              interaction.reply({ content: `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`})
          }
          if(!TicketData.IsClosed) {
            return interaction.channel.send(`\\❌ ${interaction.user}, This ticket is not closed!`)
          }
              //+ cooldown 1, //seconds(s)
              if (!cooldowns.has("98418541981561")) {
                  cooldowns.set("98418541981561", new Discord.Collection());
              }
              
              const now = Date.now();
              const timestamps = cooldowns.get("98418541981561");
              const cooldownAmount = (5 || 3) * 1000;
              
              if (timestamps.has(interaction.user.id)) {
                  const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
              
                  if (now < expirationTime) {
                      const timeLeft = (expirationTime - now) / 1000;
                      return interaction.channel.send({ content: ` **${interaction.user.username}**, please cool down! (**${timeLeft.toFixed(0)}** second(s) left)`}).then(msg => {
                          setTimeout(() => {
                              msg.delete().catch(() => null)
                           }, 3000)
                          })
                  }
              }
              timestamps.set(interaction.user.id, now);
              setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
          interaction.channel.messages.fetch().then(async (messages) => {
            const output = messages.reverse().map(m => `${new Date(m.createdAt).toLocaleString('en-US')} - ${m.author.tag}: ${m.attachments.size > 0 ? m.attachments.first().proxyURL : m.content}`).join('\n');
  
            let response;
            try {
              response = await sourcebin.create([
                {
                  name: ' ',
                  content: output,
                  languageId: 'text',
                },
              ], {
                title: `Chat transcript for ${interaction.channel.name}`,
                description: ' ',
              });
            }
            catch(e) {
              console.log(e)
              return interaction.channel.send('An error occurred, please try again!');
            }
  
            const embed = new Discord.MessageEmbed()
              .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true })})
              .setDescription(`<:Map:853495194863534081> ${interaction.guild.name}'s ticket transcript\n<:Tag:836168214525509653> [\`📄 View\`](${response.url}) for channel \`${interaction.channel.name}\`!`)
              .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true })})
              .setColor('738ADB');
              await interaction.user.send({ embeds: [embed] });
          })
        } else if(interaction.customId == "98418541981565") {
          interaction.deferUpdate()
          try{
            TicketData = await TicketSchema.findOne({
                guildId: interaction.guild.id,
                ChannelId: interaction.channel.id
            })
          } catch(err) {
              console.log(err)
              interaction.reply({ content: `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`})
          }
          if(!TicketData.IsClosed) {
            return interaction.channel.send(`\\❌ ${interaction.user}, This ticket is not closed!`)
          }
          //+ cooldown 1, //seconds(s)
              if (!cooldowns.has("98418541981561")) {
                  cooldowns.set("98418541981561", new Discord.Collection());
              }
              
              const now = Date.now();
              const timestamps = cooldowns.get("98418541981561");
              const cooldownAmount = (5 || 3) * 1000;
              
              if (timestamps.has(interaction.user.id)) {
                  const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
              
                  if (now < expirationTime) {
                      const timeLeft = (expirationTime - now) / 1000;
                      return interaction.channel.send({ content: ` **${interaction.user.username}**, please cool down! (**${timeLeft.toFixed(0)}** second(s) left)`}).then(msg => {
                          setTimeout(() => {
                              msg.delete().catch(() => null)
                           }, 3000)
                          })
                  }
              }
              timestamps.set(interaction.user.id, now);
              setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
          if(!TicketData) return interaction.channel.send(`\\❌ I can't find this guild \`data\` in the data base!`)
          const Channel = interaction.guild.channels.cache.get(TicketData.ChannelId)

          Channel.permissionOverwrites.edit(TicketData.UserId, {
                  VIEW_CHANNEL: true,
                  SEND_MESSAGES: true
        })

        const embed = new Discord.MessageEmbed()
        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
        .setDescription(`<:Verify:841711383191879690> Successfully re-opened the ticket by \`${interaction.user.tag}\`!`)
        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true })})
        .setColor('GREEN');
        TicketData.IsClosed = false;
        await TicketData.save().then(() => {
          interaction.channel.send({ embeds: [embed] });
        }).catch(() => {
          interaction.channel.send({ content: `\`❌ [ERR]:\` Something is wrong, please try again later!`})
        })

        } else if(interaction.customId == "98418541981566") {
          interaction.deferUpdate()
          try{
            TicketData = await TicketSchema.findOne({
                guildId: interaction.guild.id,
                ChannelId: interaction.channel.id
            })
          } catch(err) {
              console.log(err)
              interaction.reply({ content: `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`})
          }
          if(!TicketData.IsClosed) {
            return interaction.channel.send(`\\❌ ${interaction.user}, This ticket is not closed!`)
          }
          //+ cooldown 1, //seconds(s)
          if (!cooldowns.has("98418541981561")) {
            cooldowns.set("98418541981561", new Discord.Collection());
        }
        
        const now = Date.now();
        const timestamps = cooldowns.get("98418541981561");
        const cooldownAmount = (5 || 3) * 1000;
        
        if (timestamps.has(interaction.user.id)) {
            const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
        
            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return interaction.channel.send({ content: ` **${interaction.user.username}**, please cool down! (**${timeLeft.toFixed(0)}** second(s) left)`}).then(msg => {
                    setTimeout(() => {
                        msg.delete().catch(() => null)
                     }, 3000)
                    })
            }
        }
        timestamps.set(interaction.user.id, now);
        setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
          const close = new Discord.MessageEmbed()
          .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
          .setColor(`RED`)
          .setDescription('<a:pp681:774089750373597185> Ticket will be deleted in \`5 seconds\`!')
          .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true })})
          interaction.channel.send({ embeds: [close]})
          .then(channel => {
              setTimeout(async () => {
                  await interaction.channel.delete().catch(() => null)
              }, 5000);
          })
        }
      }
        if(interaction.isSelectMenu()){
          if(!data) return interaction.reply(`\\❌ I can't find this guild \`data\` in the data base!`)
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
            return interaction.reply({content: `\\❌ I can't find this role in the guild!`, ephemeral: true})
          }
          if (member.roles.cache.has(role1.id)) {
            member.roles.remove(role1).catch(async (err)=> await interaction.channel.send({ content: `\\❌ Failed to remove the role **${role1}** for ${member.user.tag}, \`${err}\`!`}));
            interaction.reply({content: `<a:pp833:853495989796470815> Successfully removed ${role1} from you!`, ephemeral: true})
          } else{
            member.roles.add(role1).catch(async (err)=> await interaction.channel.send({ content: `\\❌ Failed to add the role **${role1}** for ${member.user.tag}, \`${err}\`!`}));
            interaction.reply({ content: `<a:pp330:853495519455215627> Successfully addded ${role1} for you!`, ephemeral: true })
          }
         } else if(choice == data.Mod.smroles.value2) {
          if(!role2) return interaction.reply({content: `\\❌ I can't find this role in the guild!`, ephemeral: true})
          if (member.roles.cache.has(role2.id)) {
            member.roles.remove(role2).catch(async (err)=> await interaction.channel.send({ content: `\\❌ Failed to remove the role **${role2}** for ${member.user.tag}, \`${err}\`!`}));
            interaction.reply({content: `<a:pp833:853495989796470815> Successfully removed ${role2} from you!`, ephemeral: true})
          } else{
            member.roles.add(role2).catch(async (err)=> await interaction.channel.send({ content: `\\❌ Failed to add the role **${role2}** for ${member.user.tag}, \`${err}\`!`}));
            interaction.reply({ content: `<a:pp330:853495519455215627> Successfully addded ${role2} for you!`, ephemeral: true })
          }
         } else if(choice == data.Mod.smroles.value3) {
          if(!role3) return interaction.reply({content: `\\❌ I can't find this role in the guild!`, ephemeral: true})
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
         } else if (choice == "dollar5219198151218") {
          interaction.reply({ content: "You choosed the \`$\` currency!\nPlease type the number of credits to show it's currency!", ephemeral: true })
          const filter = msg => msg.member.id == interaction.member.id;
    
          let number = await interaction.channel.awaitMessages({ filter, max: 1 })
          if(number.first().content == 'cancel') return interaction.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`\` command!`});
          number = number.first().content
          interaction.channel.send({ content: `\`${number}$\` will equals *${number * 10} - ${number * 20}*!` })
         }
        }
        if (interaction.isCommand()) {

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
            await interaction.deferReply().catch(() => {});
            await slash.execute(client, interaction);
        } catch (error) {
            console.error(error);
            await interaction.editReply({ content: 'There was an error while executing this command!', ephemeral: true }).catch(() => {});
        }
      }
    }
}