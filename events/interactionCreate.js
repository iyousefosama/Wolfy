const discord = require('discord.js')
const { Collection, PermissionsBitField, ChannelType } = require('discord.js')
const sourcebin = require('sourcebin_js');
const schema = require('../schema/GuildSchema')
const TicketSchema = require('../schema/Ticket-Schema')
const { ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder } = require('discord.js');
const cooldowns = new Collection();
const CoolDownCurrent = {};

module.exports = {
    name: 'interactionCreate',
    async execute(client, interaction) {
      try {
        // Permissions: To check for default permissions in the guild
        if (interaction.guild){
          if (!interaction.channel.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.SendMessages)){
            return { executed: false, reason: 'PERMISSION_SEND'};
          } else {
            // Do nothing..
          };
          if (!interaction.channel.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.ViewChannel)){
            return { executed: false, reason: 'PERMISSION_VIEW_CHANNEL'};
          } else {
            // Do nothing..
          };
          if (!interaction.channel.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.ReadMessageHistory)){
            return interaction.channel.send({ content: '"Missing Access", the bot is missing the \`READ_MESSAGE_HISTORY\` permission please enable it!'})
          } else {
            // Do nothing..
          };
          if (!interaction.channel.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.EmbedLinks)){
            return interaction.channel.send({ content: '\"Missing Permissions\", the bot is missing the \`EMBED_LINKS\` permission please enable it!'})
          } else {
            // Do nothing..
          };
        };
      } catch (err) {
        console.log(err)
      }
     
      if (interaction.isButton()) {
              ///////////// Ticket button inteaction
              if (interaction.customId === 'ticket') {
                //+ cooldown 1, //seconds(s)
                if (!cooldowns.has("btn")) {
                  cooldowns.set("btn", new discord.Collection());
              }
              

              const now = Date.now();
              const timestamps = cooldowns.get("btn");
              const cooldownAmount = (4 || 2) * 1000;
              
              if (timestamps.has(interaction.user.id)) {
                  const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
              
                  if (now < expirationTime) {
                    if(CoolDownCurrent[interaction.user.id]) {
                      return;
                    }
                    const timeLeft = (expirationTime - now) / 1000;
                    CoolDownCurrent[interaction.user.id] = true;
                      return await interaction.reply({ content: ` **${interaction.user.username}**, please cool down! (**${timeLeft.toFixed(0)}** second(s) left)`, ephemeral: true, fetchReply: true}).then(() => {
                          setTimeout(() => {
                              delete CoolDownCurrent[interaction.user.id]
                           }, 3000)
                          })
                  }
              }
              timestamps.set(interaction.user.id, now);
              setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount, delete CoolDownCurrent[interaction.user.id]);

                await interaction.deferUpdate()
                let data;
                let TicketData;
                try{
                    data = await schema.findOne({
                        GuildID: interaction.guild.id
                    })
                    TicketData = await TicketSchema.findOne({
                        guildId: interaction.guild.id,
                        UserId: interaction.user.id
                    })
                    if(!data) {
                    data = await schema.create({
                        GuildID: interaction.guild.id
                    })
                    }
                    if(!TicketData) {
                        TicketData = await TicketSchema.create({
                            guildId: interaction.guild.id,
                            UserId: interaction.user.id
                        })
                        }
                } catch(err) {
                    console.log(err)
                    interaction.channel.send({ content: `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`})
                }
        
        // getting in the ticket category
        const categoryID = interaction.guild.channels.cache.get(data.Mod.Tickets.channel)
        let Channel = client.channels.cache.get(TicketData.ChannelId)
    
        // if there is no ticket category return
        if(!categoryID) {
        return interaction.followUp({ content: `\\❌ **${interaction.member.displayName}**, I can't find the tickets channel please contact mod or use \`w!setticketch\` cmd`, ephemeral: true})
        } else if(!data.Mod.Tickets.isEnabled) {
        return interaction.followUp({ content: `\\❌ **${interaction.member.displayName}**, The **tickets** command is disabled in this server!`, ephemeral: true})
        } else {
        // Do nothing..
        }
    
        var userName = interaction.user.username;
        
        var userDiscriminator = interaction.user.discriminator;
    
        let TicketAvailable = false
        interaction.guild.channels.cache.forEach(channel => {
            
            if(Channel && channel.id == Channel.id){
                TicketAvailable = true
                return;
            }
        });
    
        if(TicketAvailable) return interaction.followUp({ content: "<:error:888264104081522698> **|** You already have a ticket!", ephemeral: true})
    
        interaction.guild.channels.create({ name: userName.toLowerCase() + "-" + userDiscriminator, 
            type: ChannelType.GuildText,
            parent: categoryID,
            permissionOverwrites: [
              {
                  id: interaction.guild.id,
                  deny: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel],
              },
              {
                  id: interaction.user.id,
                  allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.AttachFiles, PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.AddReactions, PermissionsBitField.Flags.ReadMessageHistory],
              },
          ],
        }).then(async (channel) => {
                        interaction.followUp({ content: `<:Verify:841711383191879690> Successfully created ${channel} ticket!`, ephemeral: true})
                        const button = new ButtonBuilder()
                        .setLabel(`Close`)
                        .setCustomId("98418541981561")
                        .setStyle('Secondary')
                        .setEmoji("🔒");
                        const row = new ActionRowBuilder()
                        .addComponents(button);
                        var ticketEmbed = new discord.EmbedBuilder()
                        .setAuthor({ name: `Welcome in your ticket ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({dynamic: true, size: 2048}) })
                        .setDescription(`<:tag:813830683772059748> Send here your message or question!
                        
                        > <:Humans:853495153280155668> User: ${interaction.user}
                        > <:pp198:853494893439352842> UserID: \`${interaction.user.id}\``)
                        .setTimestamp()
                        channel.send({ content: `${interaction.user}`, embeds: [ticketEmbed], components: [row] })
                        TicketData.ChannelId = channel.id;
                        TicketData.IsClosed = false;
                        TicketData.OpenTimeStamp = Math.floor(Date.now() / 1000);
                        await TicketData.save().catch((err) => channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}!`));
                    })
                }
                //// Ticket controll interactions
        if(interaction.customId === '98418541981561') {
          //+ cooldown 1, //seconds(s)
                                if (!cooldowns.has("btn")) {
                                  cooldowns.set("btn", new discord.Collection());
                              }
                              
                
                              const now = Date.now();
                              const timestamps = cooldowns.get("btn");
                              const cooldownAmount = (4 || 2) * 1000;
                              
                              if (timestamps.has(interaction.user.id)) {
                                  const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
                              
                                  if (now < expirationTime) {
                                    if(CoolDownCurrent[interaction.user.id]) {
                                      return;
                                    }
                                    const timeLeft = (expirationTime - now) / 1000;
                                    CoolDownCurrent[interaction.user.id] = true;
                                      return await interaction.reply({ content: ` **${interaction.user.username}**, please cool down! (**${timeLeft.toFixed(0)}** second(s) left)`, ephemeral: true, fetchReply: true}).then(() => {
                                          setTimeout(() => {
                                              delete CoolDownCurrent[interaction.user.id]
                                           }, 3000)
                                          })
                                  }
                              }
                              timestamps.set(interaction.user.id, now);
                              setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount, delete CoolDownCurrent[interaction.user.id]);
          await interaction.deferUpdate()
          try{
          TicketData = await TicketSchema.findOne({
              guildId: interaction.guild.id,
              ChannelId: interaction.channel.id
          })
        } catch(err) {
            console.log(err)
            interaction.followUp({ content: `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`})
        }
          
          if(!TicketData) return interaction.channel.send(`\\❌ I can't find this guild \`data\` in the data base!`)
          if(TicketData.IsClosed) {
            return interaction.channel.send(`\\❌ This ticket is already closed!`)
          }
          const Channel = interaction.guild.channels.cache.get(TicketData.ChannelId)

          Channel.permissionOverwrites.edit(TicketData.UserId, {
            'SendMessages': false,
            'ViewChannel': false
        })

        const button = new ButtonBuilder()
        .setLabel(`Transcript`)
        .setCustomId("98418541981564")
        .setStyle('Secondary')
        .setEmoji("853495194863534081");
        const button2 = new ButtonBuilder()
        .setLabel(`Re-Open`)
        .setCustomId("98418541981565")
        .setStyle('Primary')
        .setEmoji("🔓");
        const button3 = new ButtonBuilder()
        .setLabel(`Delete`)
        .setCustomId("98418541981566")
        .setStyle('Danger')
        .setEmoji("853496185443319809");
        const row = new ActionRowBuilder()
        .addComponents(button, button2, button3);
        const Closed = new discord.EmbedBuilder()
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
          await interaction.deferUpdate()
          try{
            TicketData = await TicketSchema.findOne({
                guildId: interaction.guild.id,
                ChannelId: interaction.channel.id
            })
          } catch(err) {
              console.log(err)
              interaction.followUp({ content: `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`})
          }
          if(!TicketData.IsClosed) {
            return interaction.channel.send(`\\❌ ${interaction.user}, This ticket is not closed!`)
          }
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
  
            const TicketUser = client.users.cache.get(TicketData.UserId)

            const embed = new discord.EmbedBuilder()
              .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true })})
              .setTitle("Ticket Logs.")
              .setDescription(`<:Tag:836168214525509653> ${interaction.channel.name} Ticket at ${interaction.guild.name}!`)
              .addFields(
                { name: "Ticket transcript", value: `[View](${response.url})`, inline: true },
                { name: "Opened by", value: `${TicketUser.tag}`, inline: true },
                { name: "Opened At", value: `<t:${TicketData.OpenTimeStamp}>`, inline: true}
              )
              .setTimestamp()
              .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true })})
              .setColor('738ADB');
              return await interaction.user.send({ embeds: [embed] }), interaction.followUp({ content: `${interaction.user} Successfully sent you the \`transcript\` in the dms!`, ephemeral: true });
          })
        } else if(interaction.customId == "98418541981565") {
          //+ cooldown 1, //seconds(s)
                                if (!cooldowns.has("btn")) {
                                  cooldowns.set("btn", new discord.Collection());
                              }
                              
                
                              const now = Date.now();
                              const timestamps = cooldowns.get("btn");
                              const cooldownAmount = (4 || 2) * 1000;
                              
                              if (timestamps.has(interaction.user.id)) {
                                  const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
                              
                                  if (now < expirationTime) {
                                    if(CoolDownCurrent[interaction.user.id]) {
                                      return;
                                    }
                                    const timeLeft = (expirationTime - now) / 1000;
                                    CoolDownCurrent[interaction.user.id] = true;
                                      return await interaction.reply({ content: ` **${interaction.user.username}**, please cool down! (**${timeLeft.toFixed(0)}** second(s) left)`, ephemeral: true, fetchReply: true}).then(() => {
                                          setTimeout(() => {
                                              delete CoolDownCurrent[interaction.user.id]
                                           }, 3000)
                                          })
                                  }
                              }
                              timestamps.set(interaction.user.id, now);
                              setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount, delete CoolDownCurrent[interaction.user.id]);
          await interaction.deferUpdate()
          try{
            TicketData = await TicketSchema.findOne({
                guildId: interaction.guild.id,
                ChannelId: interaction.channel.id
            })
          } catch(err) {
              console.log(err)
              interaction.followUp({ content: `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`})
          }
          if(!TicketData.IsClosed) {
            return interaction.channel.send(`\\❌ ${interaction.user}, This ticket is not closed!`)
          }
          if(!TicketData) return interaction.channel.send(`\\❌ I can't find this guild \`data\` in the data base!`)
          const Channel = interaction.guild.channels.cache.get(TicketData.ChannelId)

          Channel.permissionOverwrites.edit(TicketData.UserId, {
            'SendMessages': true,
            'ViewChannel': true
        })

        const embed = new discord.EmbedBuilder()
        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
        .setDescription(`<:Verify:841711383191879690> Successfully re-opened the ticket by \`${interaction.user.tag}\`!`)
        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true })})
        .setColor('Green');
        TicketData.IsClosed = false;
        await TicketData.save().then(() => {
          interaction.channel.send({ embeds: [embed] });
        }).catch(() => {
          interaction.channel.send({ content: `\`❌ [ERR]:\` Something is wrong, please try again later!`})
        })

        } else if(interaction.customId == "98418541981566") {
          //+ cooldown 1, //seconds(s)
                                if (!cooldowns.has("btn")) {
                                  cooldowns.set("btn", new discord.Collection());
                              }
                              
                
                              const now = Date.now();
                              const timestamps = cooldowns.get("btn");
                              const cooldownAmount = (4 || 2) * 1000;
                              
                              if (timestamps.has(interaction.user.id)) {
                                  const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
                              
                                  if (now < expirationTime) {
                                    if(CoolDownCurrent[interaction.user.id]) {
                                      return;
                                    }
                                    const timeLeft = (expirationTime - now) / 1000;
                                    CoolDownCurrent[interaction.user.id] = true;
                                      return await interaction.reply({ content: ` **${interaction.user.username}**, please cool down! (**${timeLeft.toFixed(0)}** second(s) left)`, ephemeral: true, fetchReply: true}).then(() => {
                                          setTimeout(() => {
                                              delete CoolDownCurrent[interaction.user.id]
                                           }, 3000)
                                          })
                                  }
                              }
                              timestamps.set(interaction.user.id, now);
                              setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount, delete CoolDownCurrent[interaction.user.id]);
          await interaction.deferUpdate()
          try{
            TicketData = await TicketSchema.findOne({
                guildId: interaction.guild.id,
                ChannelId: interaction.channel.id
            })
          } catch(err) {
              console.log(err)
              interaction.followUp({ content: `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`})
          }
          if(!TicketData.IsClosed) {
            return interaction.channel.send(`\\❌ ${interaction.user}, This ticket is not closed!`)
          }
          const close = new discord.EmbedBuilder()
          .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
          .setColor(`Red`)
          .setDescription('<a:pp681:774089750373597185> Ticket will be deleted in \`5 seconds\`!')
          .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true })})
          interaction.channel.send({ embeds: [close]})
          .then(channel => {
              setTimeout(async () => {
                  let response;
                  const Ticket = interaction.guild.channels.cache.get(TicketData.ChannelId)
                  return await interaction.channel.messages.fetch().then(async (messages) => {
                    const output = messages.reverse().map(m => `${new Date(m.createdAt).toLocaleString('en-US')} - ${m.author.tag}: ${m.attachments.size > 0 ? m.attachments.first().proxyURL : m.content}`).join('\n');
          
                    

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
                  }).then(async () => {
                    return await interaction.channel.delete()
                  })
                  .then(async () => {
                    const TicketUser = client.users.cache.get(TicketData.UserId)

                    const Closedembed = new discord.EmbedBuilder()
                    .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true })})
                    .setTitle("Ticket Closed.")
                    .setDescription(`<:Tag:836168214525509653> ${Ticket.name} Ticket at ${interaction.guild.name} Just closed!`)
                    .addFields(
                      { name: "Ticket transcript", value: `[View](${response.url}) for channel`, inline: true },
                      { name: "Opened by", value: `${TicketUser.tag}`, inline: true },
                      { name: "Closed by", value: `${interaction.user.tag}`, inline: true},
                      { name: "Opened At", value: `<t:${TicketData.OpenTimeStamp}>`, inline: true}
                    )
                    .setTimestamp()
                    .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true })})
                    .setColor('#2F3136');
                    await TicketUser.send({ embeds: [Closedembed] });
                  }).catch((err) => console.log(err))
              }, 5000);
          })
        }
      }
        let data;

        if(interaction.isStringSelectMenu()){
          if(interaction.guild) {
            try{
                data = await schema.findOne({
                    GuildID: interaction.guild.id
                })
            } catch(err) {
                console.log(err)
                interaction.reply({ content: `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`})
            }
          } 
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
         };


         // Just a function!
         async function SettingChannel() {
          await interaction.update({ content: `<:Tag:836168214525509653> **${interaction.guild.name}** Set Channels list!`, components: [row1] });
          await interaction.followUp("Please type the id of the channel to set!")
          const filter = msg => msg.member.id == interaction.member.id;

          let iDContent = await interaction.channel.awaitMessages({ filter, max: 1 })
          if(iDContent.first().content == 'cancel') return interaction.channel.send({ content: `<:error:888264104081522698>  **|** **${interaction.author.tag}**, Cancelled the \`command\`!`});
          iDContent = iDContent.first().content
          channel = interaction.guild.channels.cache.get(iDContent);
  
          if (!channel || channel.type !== ChannelType.GuildText){
            return interaction.followUp({ content: `\\❌ **${interaction.member.displayName}**, please provide a valid channel ID.`});
          } else if (!channel.permissionsFor(interaction.guild.members.me).has('SEND_MESSAGES')){
            return interaction.followUp({ content: `\\❌ **${interaction.member.displayName}**, I need you to give me permission to send messages on ${channel} and try again.`});
          } else if (!channel.permissionsFor(interaction.guild.members.me).has(discord.PermissionsBitField.Flags.EmbedLinks)){
            return interaction.followUp({ content: `\\❌ **${interaction.member.displayName}**, I need you to give me permission to embed links on ${channel} and try again.`});
          };

          try{
            data = await schema.findOne({
                GuildID: interaction.guild.id
            })
        } catch(err) {
            console.log(err)
            interaction.followUp({ content: `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`})
        }
          return await channel;
        }

         const row1 = new ActionRowBuilder()
         .addComponents(
             new StringSelectMenuBuilder()
                 .setCustomId('kwthbek4m221pyDAdowp')
                 .setPlaceholder('Nothing selected!').addOptions([
                     {
                         label: 'Welcome Channel',
                         description: 'Choose to set the channel for greeting event',
                         value: '9851985198150',
                         //emoji: ':wave:',
                     },
                     {
                         label: 'Leaver Channel',
                         description: 'Choose to set the channel for leaver event',
                         value: '9851985198151',
                         //emoji: '853495989796470815',
                     },
                     {
                         label: 'Logs Channel',
                         description: 'Choose to set the channel for logs events',
                         value: '9851985198152',
                         //emoji: '853496185443319809',
                     },
                     {
                         label: 'Suggestions Channel',
                         description: 'Choose to set the channel for suggestion command',
                         value: '9851985198153',
                         //emoji: '853494953560375337',
                     },
                     {
                         label: 'Reports Channel',
                         description: 'Choose to set the channel for report command',
                         value: '9851985198154',
                         //emoji: '911761250759893012',
                     },
                 ]),
         )
         if (choice == "9485179841985419841") {
            await interaction.update({ content: `<:Tag:836168214525509653> **${interaction.guild.name}** Set Channels list!`, components: [row1] });
         }
         // For choices inside (Selecting channels) menu!
         if (choice == "9851985198150") {
          const Channel = await SettingChannel();

          data.greeter.welcome.channel = Channel.id
          return await data.save()
          .then(async () => {
            const embed = new discord.EmbedBuilder()
            .setColor('DarkGreen')
            .setDescription([
              '<a:Correct:812104211386728498>\u2000|\u2000',
              `Successfully set the welcome channel to ${Channel}!\n\n`,
              !data.greeter.welcome.isEnabled ? `\\⚠️ Welcome is disabled! To enable, type \`${client.prefix}welcometoggle\`\n` :
              `To disable this feature, use the \`${client.prefix}welcometoggle\` command.`
            ].join(''))
            interaction.followUp({ embeds: [embed] })
        })
        } else if (choice == "9851985198151") {
          const Channel = await SettingChannel();

          data.greeter.leaving.channel = Channel.id
          data.save()
          .then(() => {
            const embed = new discord.EmbedBuilder()
            .setColor('DarkGreen')
            .setDescription([
              '<a:Correct:812104211386728498>\u2000|\u2000',
              `Successfully set the leave channel to ${Channel}!\n\n`,
              !data.greeter.leaving.isEnabled ? `\\⚠️ Leavermsg is disabled! To enable, type \`${client.prefix}leavertoggle\`\n` :
              `To disable this feature, use the \`${client.prefix}leavertoggle\` command.`
            ].join(''))
            interaction.followUp({ embeds: [embed] })
        })
        } else if (choice == "9851985198152") {
          const Channel = await SettingChannel();

          data.Mod.Logs.channel = Channel.id
          await data.save()
          .then(() => {
            const embed = new discord.EmbedBuilder()
            .setColor('DarkGreen')
            .setDescription([
              '<a:Correct:812104211386728498>\u2000|\u2000',
              `Successfully set the Logs channel to ${Channel}!\n\n`,
              !data.Mod.Logs.isEnabled ? `\\⚠️ Logs channel is disabled! To enable, type \`${client.prefix}logstoggle\`\n` :
              `To disable this feature, use the \`${client.prefix}logstoggle\` command.`
            ].join(''))
            interaction.followUp({ embeds: [embed] })
        })
        } else if (choice == "9851985198153") {
          const Channel = await SettingChannel();

          if(data.Mod.Suggestion.channel !== null && Channel.id == data.Mod.Suggestion.channel) {
            return interaction.followUp ({ content: `\\❌ **${interaction.member.displayName}**, Suggestions channel is already set to ${Channel}!`});
          }

          data.Mod.Suggestion.channel = Channel.id
          data.save()
          .then(() => {
            const embed = new discord.EmbedBuilder()
            .setColor('DarkGreen')
            .setDescription([
              '<a:Correct:812104211386728498>\u2000|\u2000',
              `Successfully set the Suggestions channel to ${Channel}!\n\n`,
              !data.Mod.Suggestion.isEnabled ? `\\⚠️ Suggestion cmd is disabled! To enable, type \`${client.prefix}suggtoggle\`\n` :
              `To disable this feature, use the \`${client.prefix}suggtoggle\` command.`
            ].join(''))
            interaction.followUp({ embeds: [embed] })
        })
        } else if(choice == "9851985198154") {
          const Channel = await SettingChannel();

          data.Mod.Logs.channel = Channel.id
          await data.save()
          .then(() => {
            const embed = new discord.EmbedBuilder()
            .setColor('DarkGreen')
            .setDescription([
              '<a:Correct:812104211386728498>\u2000|\u2000',
              `Successfully set the Logs channel to ${Channel}!\n\n`,
              !data.Mod.Logs.isEnabled ? `\\⚠️ Logs channel is disabled! To enable, type \`${client.prefix}logstoggle\`\n` :
              `To disable this feature, use the \`${client.prefix}logstoggle\` command.`
            ].join(''))
            interaction.followUp({ embeds: [embed] })
        })
        }
        }
        if (interaction.isChatInputCommand()) {

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
       const sclientPerms = interaction.channel.permissionsFor(interaction.guild.members.me);
       if (!sclientPerms || !sclientPerms.has(slash.clientpermissions)) {
           return interaction.reply({ content: `<a:pp802:768864899543466006> The bot is missing \`${slash.clientpermissions}\` permission(s)!`, ephemeral: true });
       }
      }
    }  
            console.log(`(/) ${interaction.user.tag}|(${interaction.user.id}) in ${interaction.guild ? `${interaction.guild.name}(${interaction.guild.id}) | #${interaction.channel.name}(${interaction.channel.id})` : 'DMS'} used: /${interaction.commandName}`)
            await interaction.deferReply().catch(() => {});
            slash.execute(client, interaction);
        } catch (error) {
            console.error(error);
            await interaction.editReply({ content: 'There was an error while executing this command!', ephemeral: true }).catch(() => {});
        }
      }
    }
}