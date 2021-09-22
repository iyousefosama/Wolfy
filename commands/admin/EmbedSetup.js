const discord = require('discord.js')
const { MessageActionRow, MessageButton } = require('discord.js');
const { prefix } = require('../../config.json');

module.exports = {
    name: "EmbedSetup",
    aliases: ["embedsetup", "Embedsetup", "EMBEDSETUP"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '',
    group: 'Moderation',
    description: 'Display the setup embed message!',
    cooldown: 120, //seconds(s)
    guarded: false, //or false
    permissions: ["MANAGE_MESSAGES", "ADMINISTRATOR"],
    clientpermissions: ["MANAGE_MESSAGES", "ADMINISTRATOR", "EMBED_LINKS"],
    examples: [''],
    async execute(client, message, args) {

        const button = new MessageButton()
        .setLabel(`desc`)
        .setCustomId("84994859419841841")
        .setStyle('PRIMARY')
        .setEmoji("845681277922967572");
        const button2 = new MessageButton()
        .setLabel(`title`)
        .setCustomId("8419684198419841")
        .setStyle('PRIMARY')
        .setEmoji("845681277922967572");
        const button3 = new MessageButton()
        .setLabel(`Color`)
        .setCustomId("984198419841984198")
        .setStyle('PRIMARY')
        .setEmoji("845681277922967572");
        const button4 = new MessageButton()
        .setLabel(`Thumbnail`)
        .setCustomId("968419841984198419")
        .setStyle('PRIMARY')
        .setEmoji("845681277922967572");
        const button5 = new MessageButton()
        .setLabel(`Image`)
        .setCustomId("985412985419849845")
        .setStyle('PRIMARY')
        .setEmoji("845681277922967572");
        const button6 = new MessageButton()
        .setLabel(`Send`)
        .setCustomId("65126958498549854")
        .setStyle('SUCCESS')
        .setEmoji("812104211386728498");
        const button7 = new MessageButton()
        .setLabel(`Cancel`)
        .setCustomId("7848948985418941")
        .setStyle('DANGER')
        .setEmoji("888264104081522698");
        const row = new MessageActionRow()
        .addComponents(button, button2, button3, button4, button5);
        const row2 = new MessageActionRow()
        .addComponents(button6, button7);
        let embed = new discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: true, size: 2048}))

        const msg = await message.reply({ embeds: [embed], components: [row, row2], fetch: true })
        const collector = msg.createMessageComponentCollector({ time: 120000, errors: ['time'] })

        collector.on('collect', async interactionCreate => {
            if(interactionCreate.customId === '84994859419841841'){
                if (!interactionCreate.member.id == message.author.id) return interactionCreate.deferUpdate()
                button.setDisabled(true)
                button2.setDisabled(true)
                button3.setDisabled(true)
                button4.setDisabled(true)
                button5.setDisabled(true)
                button6.setDisabled(true)
                button7.setDisabled(true)
                const newrow = new MessageActionRow()
                .addComponents(button, button2, button3, button4, button5);
                const newrow2 = new MessageActionRow()
                .addComponents(button6, button7);
                msg.edit({embeds: [embed], components: [newrow, newrow2] }).catch(() => null)
                await interactionCreate.reply({ content: `**${message.author.username}**, Type the embed description!`, ephemeral: true})

                const filter = msg => msg.author.id == message.author.id;

                let desc = await message.channel.awaitMessages({ filter, max: 1 })
                if(desc.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`embedsetup\` command!`});
                else if(desc.first().content == `${prefix}embedsetup`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`embedsetup\` command!`})
                desc = desc.first().content
                if(desc.length > 4026) {
                message.reply({ content: `\\❌ **${message.author.username}**, Embed description should be 4026 characters or less!`, ephemeral: true})
                return msg.edit({ embeds: [embed], components: [row, row2]}).catch(() => null)
                }
                embed.setDescription(desc)
                msg.edit({ embeds: [embed], components: [row, row2] }).catch(() => message.reply({ content: `<:error:888264104081522698>  | **${message.author.tag}**, I can't edit the embed message!`, ephemeral: true}))
                await message.reply({ content: `**${message.author.username}**, Successfully set the embed description!`, ephemeral: true})
                }
                if(interactionCreate.customId === '8419684198419841'){
                    if (!interactionCreate.member.id == message.author.id) return interactionCreate.deferUpdate()
                    button.setDisabled(true)
                    button2.setDisabled(true)
                    button3.setDisabled(true)
                    button4.setDisabled(true)
                    button5.setDisabled(true)
                    button6.setDisabled(true)
                    button7.setDisabled(true)
                    const newrow = new MessageActionRow()
                    .addComponents(button, button2, button3, button4, button5);
                    const newrow2 = new MessageActionRow()
                    .addComponents(button6, button7);
                    msg.edit({embeds: [embed], components: [newrow, newrow2]}).catch(() => null)
                    await interactionCreate.reply({ content: `**${message.author.username}**, Type the embed title!`, ephemeral: true})

                    const filter = msg => msg.author.id == message.author.id;
    
                    let title = await message.channel.awaitMessages({ filter, max: 1 })
                    if(title.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`embedsetup\` command!`});
                    else if(title.first().content == `${prefix}embedsetup`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`embedsetup\` command!`})
                    title = title.first().content
                    if(title.length > 246) {
                        message.reply({ content: `\\❌ **${message.author.username}**, Embed title should be 246 characters or less!`, ephemeral: true})
                        return msg.edit({ embeds: [embed], components: [row, row2]}).catch(() => null)
                        }
                    embed.setTitle(title)
                    msg.edit({ embeds: [embed], components: [row, row2]}).catch(() => message.reply({ content: `<:error:888264104081522698>  | **${message.author.tag}**, I can't edit the embed message!`, ephemeral: true}))
                    await message.reply({ content: `**${message.author.username}**, Successfully set the embed title!`, ephemeral: true})
                }
                if(interactionCreate.customId === '984198419841984198'){
                    if (!interactionCreate.member.id == message.author.id) return interactionCreate.deferUpdate()
                    button.setDisabled(true)
                    button2.setDisabled(true)
                    button3.setDisabled(true)
                    button4.setDisabled(true)
                    button5.setDisabled(true)
                    button6.setDisabled(true)
                    button7.setDisabled(true)
                    const newrow = new MessageActionRow()
                    .addComponents(button, button2, button3, button4, button5);
                    const newrow2 = new MessageActionRow()
                    .addComponents(button6, button7);
                    msg.edit({embeds: [embed], components: [newrow, newrow2]}).catch(() => null)
                    await interactionCreate.reply({ content: `**${message.author.username}**, Type the embed color!`, ephemeral: true})

                    const filter = msg => msg.author.id == message.author.id;
    
                    let color = await message.channel.awaitMessages({ filter, max: 1 })
                    if(color.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`embedsetup\` command!`});
                    else if(color.first().content == `${prefix}embedsetup`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`embedsetup\` command!`})
                    color = color.first().content
                    try {
                    embed.setColor(color)
                    } catch {
                    embed.setColor('RED')
                    message.reply({ content: `\\❌ **${message.author.username}**, Unable to set the embed color!`, ephemeral: true})
                    return msg.edit({ embeds: [embed], components: [row, row2]}).catch(() => null)
                    }
                    msg.edit({ embeds: [embed], components: [row, row2]}).catch(() => message.reply({ content: `<:error:888264104081522698>  | **${message.author.tag}**, I can't edit the embed message!`, ephemeral: true}))
                    await message.reply({ content: `**${message.author.username}**, Successfully set the embed color!`, ephemeral: true})
                }
                if(interactionCreate.customId === '968419841984198419'){
                    if (!interactionCreate.member.id == message.author.id) return interactionCreate.deferUpdate()
                    button.setDisabled(true)
                    button2.setDisabled(true)
                    button3.setDisabled(true)
                    button4.setDisabled(true)
                    button5.setDisabled(true)
                    button6.setDisabled(true)
                    button7.setDisabled(true)
                    const newrow = new MessageActionRow()
                    .addComponents(button, button2, button3, button4, button5);
                    const newrow2 = new MessageActionRow()
                    .addComponents(button6, button7);
                    msg.edit({embeds: [embed], components: [newrow, newrow2]}).catch(() => null)
                    await interactionCreate.reply({ content: `**${message.author.username}**, Type the embed thumbnail link!`, ephemeral: true})

                    const filter = msg => msg.author.id == message.author.id;
    
                    let thumb = await message.channel.awaitMessages({ filter, max: 1 })
                    if(thumb.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`embedsetup\` command!`});
                    else if(thumb.first().content == `${prefix}embedsetup`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`embedsetup\` command!`})
                    thumb = thumb.first().content
                    try {
                    embed.setThumbnail(thumb).catch(() => null)
                    msg.edit({ embeds: [embed], components: [row, row2]}).catch(() => message.reply({ content: `<:error:888264104081522698>  | **${message.author.tag}**, I can't edit the embed message!`, ephemeral: true}))
                    await message.reply({ content: `**${message.author.username}**, Successfully set the embed thumbnail!`, ephemeral: true})
                    } catch {
                    embed.setThumbnail('https://cdn.discordapp.com/avatars/821655420410003497/9633a398fbdb33906862000c39d813cd.png?size=512')
                    message.reply({ content: `\\❌ **${message.author.username}**, Unable to set the embed thumbnail!`, ephemeral: true})
                    return msg.edit({ embeds: [embed], components: [row, row2]}).catch(() => null)
                    }
                }
                if(interactionCreate.customId === '985412985419849845'){
                    if (!interactionCreate.member.id == message.author.id) return interactionCreate.deferUpdate()
                    button.setDisabled(true)
                    button2.setDisabled(true)
                    button3.setDisabled(true)
                    button4.setDisabled(true)
                    button5.setDisabled(true)
                    button6.setDisabled(true)
                    button7.setDisabled(true)
                    const newrow = new MessageActionRow()
                    .addComponents(button, button2, button3, button4, button5);
                    const newrow2 = new MessageActionRow()
                    .addComponents(button6, button7);
                    msg.edit({embeds: [embed], components: [newrow, newrow2]}).catch(() => null)
                    await interactionCreate.reply({ content: `**${message.author.username}**, Type the embed image!`, ephemeral: true})

                    const filter = msg => msg.author.id == message.author.id;
    
                    let img = await message.channel.awaitMessages({ filter, max: 1 })
                    if(img.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`embedsetup\` command!`});
                    else if(img.first().content == `${prefix}embedsetup`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`embedsetup\` command!`})
                    img = img.first().content
                    try {
                    embed.setImage(img).catch(() => null)
                    msg.edit({ embeds: [embed], components: [row, row2]}).catch(() => message.reply({ content: `<:error:888264104081522698>  | **${message.author.tag}**, I can't edit the embed message!`, ephemeral: true}))
                    await message.reply({ content: `**${message.author.username}**, Successfully set the embed image!`, ephemeral: true})
                    } catch {
                    embed.setImage('https://cdn.discordapp.com/attachments/830926767728492565/874773027177512960/c7d26cb2902f21277d32ad03e7a21139.gif')
                    message.reply({ content: `\\❌ **${message.author.username}**, Unable to set the embed image!`, ephemeral: true})
                    return msg.edit({ embeds: [embed], components: [row, row2]}).catch(() => null)
                    }
                }
                if(interactionCreate.customId === '65126958498549854'){
                    if (!interactionCreate.member.id == message.author.id) return interactionCreate.deferUpdate()
                    button.setDisabled(true)
                    button2.setDisabled(true)
                    button3.setDisabled(true)
                    button4.setDisabled(true)
                    button5.setDisabled(true)
                    button6.setDisabled(true)
                    button7.setDisabled(true)
                    const newrow = new MessageActionRow()
                    .addComponents(button, button2, button3, button4, button5);
                    const newrow2 = new MessageActionRow()
                    .addComponents(button6, button7);
                    msg.edit({embeds: [embed], components: [newrow, newrow2]}).catch(() => null)
                    const FinallEmb = new discord.MessageEmbed()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: true, size: 2048}))
                    .setColor('#e6a54a')
                    .setDescription(`**${message.author.username}**, What the channel to send the embed for?\n\n**(1)** Current channel\n**(2)** Another channel`)
                    .setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true, size: 2048}))
                    .setTimestamp()
                    await interactionCreate.reply({ embeds: [FinallEmb], ephemeral: true})

                    const filter = msg => msg.author.id == message.author.id;
    
                    let thmsg = await message.channel.awaitMessages({ filter, max: 1 })
                    if(thmsg.first().content == '1') {
                    message.channel.send({ embeds: [embed] })
                    } else if(thmsg.first().content == '2') {
                        const filter = msg => msg.author.id == message.author.id;

                        await message.reply({ content: `**${message.author.username}**, type the channel id!`, ephemeral: true})

                        let thchannel = await message.channel.awaitMessages({ filter, max: 1 })
                        thchannel = thchannel.first().content

                        Embedchannel = message.guild.channels.cache.get(thchannel);

                        if (!Embedchannel || Embedchannel.type !== 'GUILD_TEXT'){
                            message.Embedchannel.send(`\\❌ **${message.member.displayName}**, please provide a valid channel ID.`)
                            return msg.edit({ embeds: [embed], components: [row, row2]})
                          } else if (!Embedchannel.permissionsFor(message.guild.me).has('SEND_MESSAGES')){
                            message.Embedchannel.send(`\\❌ **${message.member.displayName}**, I need you to give me permission to send messages on ${channel} and try again.`)
                            return msg.edit({ embeds: [embed], components: [row, row2]})
                          } else if (!Embedchannel.permissionsFor(message.guild.me).has('EMBED_LINKS')){
                            message.Embedchannel.send(`\\❌ **${message.member.displayName}**, I need you to give me permission to embed links on ${channel} and try again.`)
                            return msg.edit({ embeds: [embed], components: [row, row2]})
                          };

                          button.setDisabled(true)
                          button2.setDisabled(true)
                          button3.setDisabled(true)
                          button4.setDisabled(true)
                          button5.setDisabled(true)
                          button6.setDisabled(true)
                          button7.setDisabled(true)
                          const newrow = new MessageActionRow()
                          .addComponents(button, button2, button3, button4, button5);
                          const newrow2 = new MessageActionRow()
                          .addComponents(button6, button7);
                          msg.edit({embeds: [embed], components: [newrow, newrow2]})
                          Embedchannel.send({ embeds: [embed] })
                          const dnEmbed = new discord.MessageEmbed()
                          .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: true, size: 2048}))
                          .setColor('DARK_GREEN')
                          .setDescription(`**${message.author.username}**, Successfuly send your embed to ${Embedchannel}`)
                          .setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true, size: 2048}))
                          .setTimestamp()
                          message.channel.send({ embeds: [dnEmbed]})
                    }
                }
                if(interactionCreate.customId === '7848948985418941'){
                    if (!interactionCreate.member.id == message.author.id) return interactionCreate.deferUpdate()
                    button.setDisabled(true)
                    button2.setDisabled(true)
                    button3.setDisabled(true)
                    button4.setDisabled(true)
                    button5.setDisabled(true)
                    button6.setDisabled(true)
                    button7.setDisabled(true)
                    const newrow = new MessageActionRow()
                    .addComponents(button, button2, button3, button4, button5);
                    const newrow2 = new MessageActionRow()
                    .addComponents(button6, button7);
                    msg.edit({embeds: [embed], components: [newrow, newrow2]})
                    await interactionCreate.reply({ content: `<:error:888264104081522698>  | **${message.author.tag}**, Cancelled the \`embedsetup\` command!`, ephemeral: true})
                    }
    })
}
}
