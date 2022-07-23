const discord = require('discord.js');
const { MessageActionRow, MessageSelectMenu } = require('discord.js');
const schema = require('../../schema/GuildSchema')

module.exports = {
    name: "smRole",
    aliases: ["SelectMenuRole", "smrole", "SMROLE", "SMRole", "SelectMenuRoles", "selectmenurole"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '(Roles count)',
    group: 'setup',
    description: 'Setup the select menu role list!',
    cooldown: 15, //seconds(s)
    guarded: false, //or false
    permissions: ['MANAGE_ROLES'],
    clientPermissions: ['MANAGE_ROLES'],
    examples: ['1', '6'], 
    async execute(client, message, [quantity]) {

        let data;
        try{
            data = await schema.findOne({
                GuildID: message.guild.id
            })
            if(!data) {
            data = await schema.create({
                GuildID: message.guild.id
            })
            }
        } catch(err) {
            console.log(err)
            message.channel.send({ content: `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`})
        }

    quantity = Math.round(quantity);

    if (!quantity || quantity < 1 || quantity > 6){
      return message.reply({ content: `<a:Wrong:812104211361693696> | ${message.author}, Please provide the quantity of drop down menu roles which must be greater than one (1) and less than six (6)`});
    };
    if(data.Mod.smroles.value1) {
        await message.channel.send({ content: `<a:Loading:841321898302373909> **${message.author.tag}** This server already have an another select menu role, are you sure you want to delete it to create new one? \`(y/n)\``})
      
        const filter = _message => message.author.id === _message.author.id && ['y','n','yes','no'].includes(_message.content.toLowerCase());
    
        const proceed = await message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
        .then(collected => ['y','yes'].includes(collected.first().content.toLowerCase()) ? true : false)
        .catch(() => false);
    
        if (!proceed){
          return message.channel.send({ content: `<a:Wrong:812104211361693696> | ${message.author}, Cancelled the \`smRole\` command!`});
        };
    
        data.Mod.smroles.value1 = null
        data.Mod.smroles.value2 = null
        data.Mod.smroles.value3 = null
        data.Mod.smroles.value4 = null
        data.Mod.smroles.value5 = null
        data.Mod.smroles.value6 = null
        await data.save()
        return message.channel.send({ content: `\\✔️ ${message.author}, Successfully reset all values at the database!`})
        .catch((err) => message.channel.send({ content: `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`}));
    }

    const filter = msg => msg.author.id == message.author.id;
    
    if(quantity === 1) {
    await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the \`role id\`!`)

    let id = await message.channel.awaitMessages({ filter, max: 1 })
    if(id.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
    else if(id.first().content == `${client.prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
    id = id.first().content
    role = message.guild.roles.cache.get(id) ||
    message.guild.roles.cache.find(r => r.id === id);

    if (!role){
      return message.channel.send(`\\❌ **${message.author}**, Invalid Role - Please supply the mention of the role or the id!`)
    } else {
        await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the \`emoji id\`!`)

        let emojiID = await message.channel.awaitMessages({ filter, max: 1 })
        if(emojiID.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
        else if(emojiID.first().content == `${client.prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
        emojiID = emojiID.first().content
        emoji = message.guild.emojis.cache.get(emojiID) ||
        message.guild.emojis.cache.find(e => e.id === emojiID);
        if (!emoji){
            return message.channel.send(`\\❌ **${message.author}**, Invalid Emoji - Please supply the id of the emoji!`)
        }

        const FinallEmb = new discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: true, size: 2048}))
        .setColor('#e6a54a')
        .setDescription(`<a:Right:877975111846731847> **${message.author.username}**, What the channel to send the menu to?\n\n<:1_:890489883032952876> Current channel\n<:2_:890489925059887134> Another channel`)
        .setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true, size: 2048}))
        .setTimestamp()
        await message.channel.send({ embeds: [FinallEmb], ephemeral: true})

        let thmsg = await message.channel.awaitMessages({ filter, max: 1 })
        if(thmsg.first().content == '1') {
        data.Mod.smroles.value1 = role.id;
        await data.save().then(() => {
            const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('kwthbek4m221pyddhwk')
                    .setPlaceholder('Nothing selected!').addOptions([
                        {
                            label: role.name,
                            description: `Choose this option to get role ${role.name}!`,
                            value: role.id,
                            emoji: emoji.id,
                        },
                    ]),
            )
            message.channel.send({ content: '<:Tag:836168214525509653> **Choose your roles!**', components: [row] });
          }).catch(()=> message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`)); 
        } else if(thmsg.first().content == '2') {
            const filter = msg => msg.author.id == message.author.id;

            await message.reply({ content: `**${message.author.username}**, type the channel id!`, ephemeral: true})

            let thchannel = await message.channel.awaitMessages({ filter, max: 1 })
            thchannel = thchannel.first().content

            Embedchannel = message.guild.channels.cache.get(thchannel);

            if (!Embedchannel || Embedchannel.type !== 'GUILD_TEXT' && Embedchannel.type !== 'GUILD_NEWS'){
                return message.channel.send(`\\❌ **${message.member.displayName}**, please provide a valid channel ID.`)
              } else if (!Embedchannel.permissionsFor(message.guild.me).has('SEND_MESSAGES')){
                return message.channel.send(`\\❌ **${message.member.displayName}**, I need you to give me permission to send messages on ${channel} and try again.`)
              } else if (!Embedchannel.permissionsFor(message.guild.me).has('EMBED_LINKS')){
                return message.channel.send(`\\❌ **${message.member.displayName}**, I need you to give me permission to embed links on ${channel} and try again.`)
              };

              data.Mod.smroles.value1 = role.id;
              await data.save().then(() => {
                  const row = new MessageActionRow()
                  .addComponents(
                      new MessageSelectMenu()
                          .setCustomId('kwthbek4m221pyddhwk')
                          .setPlaceholder('Nothing selected!').addOptions([
                              {
                                  label: role.name,
                                  description: `Choose this option to get role ${role.name}!`,
                                  value: role.id,
                                  emoji: emoji.id,
                              },
                          ]),
                  )
                  Embedchannel.send({ content: '<:Tag:836168214525509653> **Choose your roles!**', components: [row] });
                }).catch(()=> message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`));
                message.channel.send(`\\✔️ **${message.author}**, Successfully send the \`select-menu-role\` to ${Embedchannel}!`)
        } else {
            return message.reply({ content: `<:error:888264104081522698>  **|**  That is an invalid response. Please try again.`, ephemeral: true })
        }
    }
    } else if(quantity === 2) {
        await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **first** \`role id\`!`)

        let id = await message.channel.awaitMessages({ filter, max: 1 })
        if(id.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
        else if(id.first().content == `${client.prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
        id = id.first().content
        role = message.guild.roles.cache.get(id) ||
        message.guild.roles.cache.find(r => r.id === id);
    
        if (!role){
          return message.channel.send(`\\❌ **${message.author}**, Invalid Role - Please supply the mention of the role or the id!`)
        } else {
            await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **first** \`emoji id\`!`)
    
            let emojiID = await message.channel.awaitMessages({ filter, max: 1 })
            if(emojiID.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
            else if(emojiID.first().content == `${client.prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
            emojiID = emojiID.first().content
            emoji = message.guild.emojis.cache.get(emojiID) ||
            message.guild.emojis.cache.find(e => e.id === emojiID);
            if (!emoji){
                return message.channel.send(`\\❌ **${message.author}**, Invalid Emoji - Please supply the id of the emoji!`)
            }
        }
        await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **second** \`role id\`!`)

        id = await message.channel.awaitMessages({ filter, max: 1 })
        if(id.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
        else if(id.first().content == `${client.prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
        id = id.first().content
        role2 = message.guild.roles.cache.get(id) ||
        message.guild.roles.cache.find(r => r.id === id);
    
        if (!role2){
          return message.channel.send(`\\❌ **${message.author}**, Invalid Role - Please supply the mention of the role or the id!`)
        } else {
            await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **second** \`emoji id\`!`)
    
            emojiID = await message.channel.awaitMessages({ filter, max: 1 })
            if(emojiID.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
            else if(emojiID.first().content == `${client.prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
            emojiID = emojiID.first().content
            emoji2 = message.guild.emojis.cache.get(emojiID) ||
            message.guild.emojis.cache.find(e => e.id === emojiID);
            if (!emoji2){
                return message.channel.send(`\\❌ **${message.author}**, Invalid Emoji - Please supply the id of the emoji!`)
            }
        }

        const FinallEmb = new discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: true, size: 2048}))
        .setColor('#e6a54a')
        .setDescription(`<a:Right:877975111846731847> **${message.author.username}**, What the channel to send the menu to?\n\n<:1_:890489883032952876> Current channel\n<:2_:890489925059887134> Another channel`)
        .setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true, size: 2048}))
        .setTimestamp()
        await message.channel.send({ embeds: [FinallEmb], ephemeral: true})

        let thmsg = await message.channel.awaitMessages({ filter, max: 1 })
        if(thmsg.first().content == '1') {
        data.Mod.smroles.value1 = role.id;
        data.Mod.smroles.value2 = role2.id;
        await data.save().then(() => {
            const row2 = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('kwthbek4m221pyddhwk')
                    .setPlaceholder('Nothing selected!').addOptions([
                        {
                            label: role.name,
                            description: `Choose this option to get role ${role.name}!`,
                            value: role.id,
                            emoji: emoji.id,
                        },
                        {
                            label: role2.name,
                            description: `Choose this option to get role ${role2.name}!`,
                            value: role2.id,
                            emoji: emoji2.id,
                        },
                    ]),
            )
            message.channel.send({ content: '<:Tag:836168214525509653> **Choose your roles!**', components: [row2] });
          }).catch(()=> message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`)); 
        } else if(thmsg.first().content == '2') {
            const filter = msg => msg.author.id == message.author.id;

            await message.reply({ content: `**${message.author.username}**, type the channel id!`, ephemeral: true})

            let thchannel = await message.channel.awaitMessages({ filter, max: 1 })
            thchannel = thchannel.first().content

            Embedchannel = message.guild.channels.cache.get(thchannel);

            if (!Embedchannel || Embedchannel.type !== 'GUILD_TEXT' && Embedchannel.type !== 'GUILD_NEWS'){
                return message.channel.send(`\\❌ **${message.member.displayName}**, please provide a valid channel ID.`)
              } else if (!Embedchannel.permissionsFor(message.guild.me).has('SEND_MESSAGES')){
                return message.channel.send(`\\❌ **${message.member.displayName}**, I need you to give me permission to send messages on ${channel} and try again.`)
              } else if (!Embedchannel.permissionsFor(message.guild.me).has('EMBED_LINKS')){
                return message.channel.send(`\\❌ **${message.member.displayName}**, I need you to give me permission to embed links on ${channel} and try again.`)
              };

              data.Mod.smroles.value1 = role.id;
              data.Mod.smroles.value2 = role2.id;
              await data.save().then(() => {
                const row2 = new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setCustomId('kwthbek4m221pyddhwk')
                        .setPlaceholder('Nothing selected!').addOptions([
                            {
                                label: role.name,
                                description: `Choose this option to get role ${role.name}!`,
                                value: role.id,
                                emoji: emoji.id,
                            },
                            {
                                label: role2.name,
                                description: `Choose this option to get role ${role2.name}!`,
                                value: role2.id,
                                emoji: emoji2.id,
                            },
                        ]),
                )
                Embedchannel.send({ content: '<:Tag:836168214525509653> **Choose your roles!**', components: [row2] });
                }).catch(()=> message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`));
                message.channel.send(`\\✔️ **${message.author}**, Successfully send the \`select-menu-role\` to ${Embedchannel}!`)
        } else {
            return message.reply({ content: `<:error:888264104081522698>  **|**  That is an invalid response. Please try again.`, ephemeral: true })
        }
    } else if(quantity === 3) {
        await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **first** \`role id\`!`)

        let id = await message.channel.awaitMessages({ filter, max: 1 })
        if(id.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
        else if(id.first().content == `${client.prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
        id = id.first().content
        role = message.guild.roles.cache.get(id) ||
        message.guild.roles.cache.find(r => r.id === id);
    
        if (!role){
          return message.channel.send(`\\❌ **${message.author}**, Invalid Role - Please supply the mention of the role or the id!`)
        } else {
            await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **first** \`emoji id\`!`)
    
            let emojiID = await message.channel.awaitMessages({ filter, max: 1 })
            if(emojiID.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
            else if(emojiID.first().content == `${client.prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
            emojiID = emojiID.first().content
            emoji = message.guild.emojis.cache.get(emojiID) ||
            message.guild.emojis.cache.find(e => e.id === emojiID);
            if (!emoji){
                return message.channel.send(`\\❌ **${message.author}**, Invalid Emoji - Please supply the id of the emoji!`)
            }
        }
        await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **second** \`role id\`!`)

        id = await message.channel.awaitMessages({ filter, max: 1 })
        if(id.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
        else if(id.first().content == `${client.prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
        id = id.first().content
        role2 = message.guild.roles.cache.get(id) ||
        message.guild.roles.cache.find(r => r.id === id);
    
        if (!role2){
          return message.channel.send(`\\❌ **${message.author}**, Invalid Role - Please supply the mention of the role or the id!`)
        } else {
            await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **second** \`emoji id\`!`)
    
            emojiID = await message.channel.awaitMessages({ filter, max: 1 })
            if(emojiID.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
            else if(emojiID.first().content == `${client.prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
            emojiID = emojiID.first().content
            emoji2 = message.guild.emojis.cache.get(emojiID) ||
            message.guild.emojis.cache.find(e => e.id === emojiID);
            if (!emoji2){
                return message.channel.send(`\\❌ **${message.author}**, Invalid Emoji - Please supply the id of the emoji!`)
            }
        }
        await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **third** \`role id\`!`)

        id = await message.channel.awaitMessages({ filter, max: 1 })
        if(id.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
        else if(id.first().content == `${client.prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
        id = id.first().content
        role3 = message.guild.roles.cache.get(id) ||
        message.guild.roles.cache.find(r => r.id === id);
    
        if (!role3){
          return message.channel.send(`\\❌ **${message.author}**, Invalid Role - Please supply the mention of the role or the id!`)
        } else {
            await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **third** \`emoji id\`!`)
    
            emojiID = await message.channel.awaitMessages({ filter, max: 1 })
            if(emojiID.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
            else if(emojiID.first().content == `${client.prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
            emojiID = emojiID.first().content
            emoji3 = message.guild.emojis.cache.get(emojiID) ||
            message.guild.emojis.cache.find(e => e.id === emojiID);
            if (!emoji3){
                return message.channel.send(`\\❌ **${message.author}**, Invalid Emoji - Please supply the id of the emoji!`)
            }
        }


        const FinallEmb = new discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: true, size: 2048}))
        .setColor('#e6a54a')
        .setDescription(`<a:Right:877975111846731847> **${message.author.username}**, What the channel to send the menu to?\n\n<:1_:890489883032952876> Current channel\n<:2_:890489925059887134> Another channel`)
        .setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true, size: 2048}))
        .setTimestamp()
        await message.channel.send({ embeds: [FinallEmb], ephemeral: true})

        let thmsg = await message.channel.awaitMessages({ filter, max: 1 })
        if(thmsg.first().content == '1') {
            data.Mod.smroles.value1 = role.id;
            data.Mod.smroles.value2 = role2.id;
            data.Mod.smroles.value3 = role3.id;
            await data.save().then(() => {
                const row2 = new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setCustomId('kwthbek4m221pyddhwk')
                        .setPlaceholder('Nothing selected!').addOptions([
                            {
                                label: role.name,
                                description: `Choose this option to get role ${role.name}!`,
                                value: role.id,
                                emoji: emoji.id,
                            },
                            {
                                label: role2.name,
                                description: `Choose this option to get role ${role2.name}!`,
                                value: role2.id,
                                emoji: emoji2.id,
                            },
                            {
                                label: role3.name,
                                description: `Choose this option to get role ${role3.name}!`,
                                value: role3.id,
                                emoji: emoji3.id,
                            },
                        ]),
                )
                message.channel.send({ content: '<:Tag:836168214525509653> **Choose your roles!**', components: [row2] });
              }).catch(()=> message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`)); 
        } else if(thmsg.first().content == '2') {
            const filter = msg => msg.author.id == message.author.id;

            await message.reply({ content: `**${message.author.username}**, type the channel id!`, ephemeral: true})

            let thchannel = await message.channel.awaitMessages({ filter, max: 1 })
            thchannel = thchannel.first().content

            Embedchannel = message.guild.channels.cache.get(thchannel);

            if (!Embedchannel || Embedchannel.type !== 'GUILD_TEXT' && Embedchannel.type !== 'GUILD_NEWS'){
                return message.channel.send(`\\❌ **${message.member.displayName}**, please provide a valid channel ID.`)
              } else if (!Embedchannel.permissionsFor(message.guild.me).has('SEND_MESSAGES')){
                return message.channel.send(`\\❌ **${message.member.displayName}**, I need you to give me permission to send messages on ${channel} and try again.`)
              } else if (!Embedchannel.permissionsFor(message.guild.me).has('EMBED_LINKS')){
                return message.channel.send(`\\❌ **${message.member.displayName}**, I need you to give me permission to embed links on ${channel} and try again.`)
              };

              data.Mod.smroles.value1 = role.id;
              data.Mod.smroles.value2 = role2.id;
              data.Mod.smroles.value3 = role3.id;
              await data.save().then(() => {
                  const row2 = new MessageActionRow()
                  .addComponents(
                      new MessageSelectMenu()
                          .setCustomId('kwthbek4m221pyddhwk')
                          .setPlaceholder('Nothing selected!').addOptions([
                              {
                                  label: role.name,
                                  description: `Choose this option to get role ${role.name}!`,
                                  value: role.id,
                                  emoji: emoji.id,
                              },
                              {
                                  label: role2.name,
                                  description: `Choose this option to get role ${role2.name}!`,
                                  value: role2.id,
                                  emoji: emoji2.id,
                              },
                              {
                                  label: role3.name,
                                  description: `Choose this option to get role ${role3.name}!`,
                                  value: role3.id,
                                  emoji: emoji3.id,
                              },
                          ]),
                  )
                  Embedchannel.send({ content: '<:Tag:836168214525509653> **Choose your roles!**', components: [row2] });
                }).catch(()=> message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`)); 
                message.channel.send(`\\✔️ **${message.author}**, Successfully send the \`select-menu-role\` to ${Embedchannel}!`)
        } else {
            return message.reply({ content: `<:error:888264104081522698>  **|**  That is an invalid response. Please try again.`, ephemeral: true })
        }
    } else if(quantity === 4) {
        await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **first** \`role id\`!`)

        let id = await message.channel.awaitMessages({ filter, max: 1 })
        if(id.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
        else if(id.first().content == `${client.prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
        id = id.first().content
        role = message.guild.roles.cache.get(id) ||
        message.guild.roles.cache.find(r => r.id === id);
    
        if (!role){
          return message.channel.send(`\\❌ **${message.author}**, Invalid Role - Please supply the mention of the role or the id!`)
        } else {
            await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **first** \`emoji id\`!`)
    
            let emojiID = await message.channel.awaitMessages({ filter, max: 1 })
            if(emojiID.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
            else if(emojiID.first().content == `${client.prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
            emojiID = emojiID.first().content
            emoji = message.guild.emojis.cache.get(emojiID) ||
            message.guild.emojis.cache.find(e => e.id === emojiID);
            if (!emoji){
                return message.channel.send(`\\❌ **${message.author}**, Invalid Emoji - Please supply the id of the emoji!`)
            }
        }
        await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **second** \`role id\`!`)

        id = await message.channel.awaitMessages({ filter, max: 1 })
        if(id.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
        else if(id.first().content == `${client.prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
        id = id.first().content
        role2 = message.guild.roles.cache.get(id) ||
        message.guild.roles.cache.find(r => r.id === id);
    
        if (!role2){
          return message.channel.send(`\\❌ **${message.author}**, Invalid Role - Please supply the mention of the role or the id!`)
        } else {
            await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **second** \`emoji id\`!`)
    
            emojiID = await message.channel.awaitMessages({ filter, max: 1 })
            if(emojiID.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
            else if(emojiID.first().content == `${client.prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
            emojiID = emojiID.first().content
            emoji2 = message.guild.emojis.cache.get(emojiID) ||
            message.guild.emojis.cache.find(e => e.id === emojiID);
            if (!emoji2){
                return message.channel.send(`\\❌ **${message.author}**, Invalid Emoji - Please supply the id of the emoji!`)
            }
        }
        await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **third** \`role id\`!`)

        id = await message.channel.awaitMessages({ filter, max: 1 })
        if(id.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
        else if(id.first().content == `${client.prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
        id = id.first().content
        role3 = message.guild.roles.cache.get(id) ||
        message.guild.roles.cache.find(r => r.id === id);
    
        if (!role3){
          return message.channel.send(`\\❌ **${message.author}**, Invalid Role - Please supply the mention of the role or the id!`)
        } else {
            await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **third** \`emoji id\`!`)
    
            emojiID = await message.channel.awaitMessages({ filter, max: 1 })
            if(emojiID.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
            else if(emojiID.first().content == `${client.prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
            emojiID = emojiID.first().content
            emoji3 = message.guild.emojis.cache.get(emojiID) ||
            message.guild.emojis.cache.find(e => e.id === emojiID);
            if (!emoji3){
                return message.channel.send(`\\❌ **${message.author}**, Invalid Emoji - Please supply the id of the emoji!`)
            }
        }
        await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **fourth** \`role id\`!`)

        id = await message.channel.awaitMessages({ filter, max: 1 })
        if(id.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
        else if(id.first().content == `${client.prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
        id = id.first().content
        role4 = message.guild.roles.cache.get(id) ||
        message.guild.roles.cache.find(r => r.id === id);
    
        if (!role4){
          return message.channel.send(`\\❌ **${message.author}**, Invalid Role - Please supply the mention of the role or the id!`)
        } else {
            await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **fourth** \`emoji id\`!`)
    
            emojiID = await message.channel.awaitMessages({ filter, max: 1 })
            if(emojiID.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
            else if(emojiID.first().content == `${client.prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
            emojiID = emojiID.first().content
            emoji4 = message.guild.emojis.cache.get(emojiID) ||
            message.guild.emojis.cache.find(e => e.id === emojiID);
            if (!emoji4){
                return message.channel.send(`\\❌ **${message.author}**, Invalid Emoji - Please supply the id of the emoji!`)
            }
        }

        const FinallEmb = new discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: true, size: 2048}))
        .setColor('#e6a54a')
        .setDescription(`<a:Right:877975111846731847> **${message.author.username}**, What the channel to send the menu to?\n\n<:1_:890489883032952876> Current channel\n<:2_:890489925059887134> Another channel`)
        .setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true, size: 2048}))
        .setTimestamp()
        await message.channel.send({ embeds: [FinallEmb], ephemeral: true})

        let thmsg = await message.channel.awaitMessages({ filter, max: 1 })
        if(thmsg.first().content == '1') {
            data.Mod.smroles.value1 = role.id;
            data.Mod.smroles.value2 = role2.id;
            data.Mod.smroles.value3 = role3.id;
            data.Mod.smroles.value4 = role4.id;
            await data.save().then(() => {
                const row2 = new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setCustomId('kwthbek4m221pyddhwk')
                        .setPlaceholder('Nothing selected!').addOptions([
                            {
                                label: role.name,
                                description: `Choose this option to get role ${role.name}!`,
                                value: role.id,
                                emoji: emoji.id,
                            },
                            {
                                label: role2.name,
                                description: `Choose this option to get role ${role2.name}!`,
                                value: role2.id,
                                emoji: emoji2.id,
                            },
                            {
                                label: role3.name,
                                description: `Choose this option to get role ${role3.name}!`,
                                value: role3.id,
                                emoji: emoji3.id,
                            },
                            {
                                label: role4.name,
                                description: `Choose this option to get role ${role4.name}!`,
                                value: role4.id,
                                emoji: emoji4.id,
                            },
                        ]),
                )
                message.channel.send({ content: '<:Tag:836168214525509653> **Choose your roles!**', components: [row2] });
              }).catch(()=> message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`)); 
        } else if(thmsg.first().content == '2') {
            const filter = msg => msg.author.id == message.author.id;

            await message.reply({ content: `**${message.author.username}**, type the channel id!`, ephemeral: true})

            let thchannel = await message.channel.awaitMessages({ filter, max: 1 })
            thchannel = thchannel.first().content

            Embedchannel = message.guild.channels.cache.get(thchannel);

            if (!Embedchannel || Embedchannel.type !== 'GUILD_TEXT' && Embedchannel.type !== 'GUILD_NEWS'){
                return message.channel.send(`\\❌ **${message.member.displayName}**, please provide a valid channel ID.`)
              } else if (!Embedchannel.permissionsFor(message.guild.me).has('SEND_MESSAGES')){
                return message.channel.send(`\\❌ **${message.member.displayName}**, I need you to give me permission to send messages on ${channel} and try again.`)
              } else if (!Embedchannel.permissionsFor(message.guild.me).has('EMBED_LINKS')){
                return message.channel.send(`\\❌ **${message.member.displayName}**, I need you to give me permission to embed links on ${channel} and try again.`)
              };

              data.Mod.smroles.value1 = role.id;
              data.Mod.smroles.value2 = role2.id;
              data.Mod.smroles.value3 = role3.id;
              data.Mod.smroles.value4 = role4.id;
              await data.save().then(() => {
                  const row2 = new MessageActionRow()
                  .addComponents(
                      new MessageSelectMenu()
                          .setCustomId('kwthbek4m221pyddhwk')
                          .setPlaceholder('Nothing selected!').addOptions([
                              {
                                  label: role.name,
                                  description: `Choose this option to get role ${role.name}!`,
                                  value: role.id,
                                  emoji: emoji.id,
                              },
                              {
                                  label: role2.name,
                                  description: `Choose this option to get role ${role2.name}!`,
                                  value: role2.id,
                                  emoji: emoji2.id,
                              },
                              {
                                  label: role3.name,
                                  description: `Choose this option to get role ${role3.name}!`,
                                  value: role3.id,
                                  emoji: emoji3.id,
                              },
                              {
                                  label: role4.name,
                                  description: `Choose this option to get role ${role4.name}!`,
                                  value: role4.id,
                                  emoji: emoji4.id,
                              },
                          ]),
                  )
                  Embedchannel.send({ content: '<:Tag:836168214525509653> **Choose your roles!**', components: [row2] });
                }).catch(()=> message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`)); 
                message.channel.send(`\\✔️ **${message.author}**, Successfully send the \`select-menu-role\` to ${Embedchannel}!`)
        } else {
            return message.reply({ content: `<:error:888264104081522698>  **|**  That is an invalid response. Please try again.`, ephemeral: true })
        }
    } else if(quantity === 5) {
        await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **first** \`role id\`!`)

        let id = await message.channel.awaitMessages({ filter, max: 1 })
        if(id.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
        else if(id.first().content == `${client.prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
        id = id.first().content
        role = message.guild.roles.cache.get(id) ||
        message.guild.roles.cache.find(r => r.id === id);
    
        if (!role){
          return message.channel.send(`\\❌ **${message.author}**, Invalid Role - Please supply the mention of the role or the id!`)
        } else {
            await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **first** \`emoji id\`!`)
    
            let emojiID = await message.channel.awaitMessages({ filter, max: 1 })
            if(emojiID.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
            else if(emojiID.first().content == `${client.prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
            emojiID = emojiID.first().content
            emoji = message.guild.emojis.cache.get(emojiID) ||
            message.guild.emojis.cache.find(e => e.id === emojiID);
            if (!emoji){
                return message.channel.send(`\\❌ **${message.author}**, Invalid Emoji - Please supply the id of the emoji!`)
            }
        }
        await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **second** \`role id\`!`)

        id = await message.channel.awaitMessages({ filter, max: 1 })
        if(id.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
        else if(id.first().content == `${client.prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
        id = id.first().content
        role2 = message.guild.roles.cache.get(id) ||
        message.guild.roles.cache.find(r => r.id === id);
    
        if (!role2){
          return message.channel.send(`\\❌ **${message.author}**, Invalid Role - Please supply the mention of the role or the id!`)
        } else {
            await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **second** \`emoji id\`!`)
    
            emojiID = await message.channel.awaitMessages({ filter, max: 1 })
            if(emojiID.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
            else if(emojiID.first().content == `${client.prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
            emojiID = emojiID.first().content
            emoji2 = message.guild.emojis.cache.get(emojiID) ||
            message.guild.emojis.cache.find(e => e.id === emojiID);
            if (!emoji2){
                return message.channel.send(`\\❌ **${message.author}**, Invalid Emoji - Please supply the id of the emoji!`)
            }
        }
        await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **third** \`role id\`!`)

        id = await message.channel.awaitMessages({ filter, max: 1 })
        if(id.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
        else if(id.first().content == `${client.prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
        id = id.first().content
        role3 = message.guild.roles.cache.get(id) ||
        message.guild.roles.cache.find(r => r.id === id);
    
        if (!role3){
          return message.channel.send(`\\❌ **${message.author}**, Invalid Role - Please supply the mention of the role or the id!`)
        } else {
            await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **third** \`emoji id\`!`)
    
            emojiID = await message.channel.awaitMessages({ filter, max: 1 })
            if(emojiID.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
            else if(emojiID.first().content == `${client.prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
            emojiID = emojiID.first().content
            emoji3 = message.guild.emojis.cache.get(emojiID) ||
            message.guild.emojis.cache.find(e => e.id === emojiID);
            if (!emoji3){
                return message.channel.send(`\\❌ **${message.author}**, Invalid Emoji - Please supply the id of the emoji!`)
            }
        }
        await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **fourth** \`role id\`!`)

        id = await message.channel.awaitMessages({ filter, max: 1 })
        if(id.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
        else if(id.first().content == `${client.prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
        id = id.first().content
        role4 = message.guild.roles.cache.get(id) ||
        message.guild.roles.cache.find(r => r.id === id);
    
        if (!role4){
          return message.channel.send(`\\❌ **${message.author}**, Invalid Role - Please supply the mention of the role or the id!`)
        } else {
            await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **fourth** \`emoji id\`!`)
    
            emojiID = await message.channel.awaitMessages({ filter, max: 1 })
            if(emojiID.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
            else if(emojiID.first().content == `${client.prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
            emojiID = emojiID.first().content
            emoji4 = message.guild.emojis.cache.get(emojiID) ||
            message.guild.emojis.cache.find(e => e.id === emojiID);
            if (!emoji4){
                return message.channel.send(`\\❌ **${message.author}**, Invalid Emoji - Please supply the id of the emoji!`)
            }
        }
        await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **Fifth** \`role id\`!`)

        id = await message.channel.awaitMessages({ filter, max: 1 })
        if(id.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
        else if(id.first().content == `${client.prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
        id = id.first().content
        role5 = message.guild.roles.cache.get(id) ||
        message.guild.roles.cache.find(r => r.id === id);
    
        if (!role5){
          return message.channel.send(`\\❌ **${message.author}**, Invalid Role - Please supply the mention of the role or the id!`)
        } else {
            await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **Fifth** \`emoji id\`!`)
    
            emojiID = await message.channel.awaitMessages({ filter, max: 1 })
            if(emojiID.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
            else if(emojiID.first().content == `${client.prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
            emojiID = emojiID.first().content
            emoji5 = message.guild.emojis.cache.get(emojiID) ||
            message.guild.emojis.cache.find(e => e.id === emojiID);
            if (!emoji5){
                return message.channel.send(`\\❌ **${message.author}**, Invalid Emoji - Please supply the id of the emoji!`)
            }
        }

        const FinallEmb = new discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: true, size: 2048}))
        .setColor('#e6a54a')
        .setDescription(`<a:Right:877975111846731847> **${message.author.username}**, What the channel to send the menu to?\n\n<:1_:890489883032952876> Current channel\n<:2_:890489925059887134> Another channel`)
        .setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true, size: 2048}))
        .setTimestamp()
        await message.channel.send({ embeds: [FinallEmb], ephemeral: true})

        let thmsg = await message.channel.awaitMessages({ filter, max: 1 })
        if(thmsg.first().content == '1') {
            data.Mod.smroles.value1 = role.id;
            data.Mod.smroles.value2 = role2.id;
            data.Mod.smroles.value3 = role3.id;
            data.Mod.smroles.value4 = role4.id;
            data.Mod.smroles.value5 = role5.id;
            await data.save().then(() => {
                const row2 = new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setCustomId('kwthbek4m221pyddhwk')
                        .setPlaceholder('Nothing selected!').addOptions([
                            {
                                label: role.name,
                                description: `Choose this option to get role ${role.name}!`,
                                value: role.id,
                                emoji: emoji.id,
                            },
                            {
                                label: role2.name,
                                description: `Choose this option to get role ${role2.name}!`,
                                value: role2.id,
                                emoji: emoji2.id,
                            },
                            {
                                label: role3.name,
                                description: `Choose this option to get role ${role3.name}!`,
                                value: role3.id,
                                emoji: emoji3.id,
                            },
                            {
                                label: role4.name,
                                description: `Choose this option to get role ${role4.name}!`,
                                value: role4.id,
                                emoji: emoji4.id,
                            },
                            {
                                label: role5.name,
                                description: `Choose this option to get role ${role5.name}!`,
                                value: role5.id,
                                emoji: emoji5.id,
                            },
                        ]),
                )
                message.channel.send({ content: '<:Tag:836168214525509653> **Choose your roles!**', components: [row2] });
              }).catch(()=> message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`)); 
        } else if(thmsg.first().content == '2') {
            const filter = msg => msg.author.id == message.author.id;

            await message.reply({ content: `**${message.author.username}**, type the channel id!`, ephemeral: true})

            let thchannel = await message.channel.awaitMessages({ filter, max: 1 })
            thchannel = thchannel.first().content

            Embedchannel = message.guild.channels.cache.get(thchannel);

            if (!Embedchannel || Embedchannel.type !== 'GUILD_TEXT' && Embedchannel.type !== 'GUILD_NEWS'){
                return message.channel.send(`\\❌ **${message.member.displayName}**, please provide a valid channel ID.`)
              } else if (!Embedchannel.permissionsFor(message.guild.me).has('SEND_MESSAGES')){
                return message.channel.send(`\\❌ **${message.member.displayName}**, I need you to give me permission to send messages on ${channel} and try again.`)
              } else if (!Embedchannel.permissionsFor(message.guild.me).has('EMBED_LINKS')){
                return message.channel.send(`\\❌ **${message.member.displayName}**, I need you to give me permission to embed links on ${channel} and try again.`)
              };

              data.Mod.smroles.value1 = role.id;
              data.Mod.smroles.value2 = role2.id;
              data.Mod.smroles.value3 = role3.id;
              data.Mod.smroles.value4 = role4.id;
              data.Mod.smroles.value5 = role5.id;
              await data.save().then(() => {
                  const row2 = new MessageActionRow()
                  .addComponents(
                      new MessageSelectMenu()
                          .setCustomId('kwthbek4m221pyddhwk')
                          .setPlaceholder('Nothing selected!').addOptions([
                              {
                                  label: role.name,
                                  description: `Choose this option to get role ${role.name}!`,
                                  value: role.id,
                                  emoji: emoji.id,
                              },
                              {
                                  label: role2.name,
                                  description: `Choose this option to get role ${role2.name}!`,
                                  value: role2.id,
                                  emoji: emoji2.id,
                              },
                              {
                                  label: role3.name,
                                  description: `Choose this option to get role ${role3.name}!`,
                                  value: role3.id,
                                  emoji: emoji3.id,
                              },
                              {
                                  label: role4.name,
                                  description: `Choose this option to get role ${role4.name}!`,
                                  value: role4.id,
                                  emoji: emoji4.id,
                              },
                              {
                                  label: role5.name,
                                  description: `Choose this option to get role ${role5.name}!`,
                                  value: role5.id,
                                  emoji: emoji5.id,
                              },
                          ]),
                  )
                  Embedchannel.send({ content: '<:Tag:836168214525509653> **Choose your roles!**', components: [row2] });
                }).catch(()=> message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`));
                message.channel.send(`\\✔️ **${message.author}**, Successfully send the \`select-menu-role\` to ${Embedchannel}!`)
        } else {
            return message.reply({ content: `<:error:888264104081522698>  **|**  That is an invalid response. Please try again.`, ephemeral: true })
        }
    } else if(quantity === 6) {
        await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **first** \`role id\`!`)

        let id = await message.channel.awaitMessages({ filter, max: 1 })
        if(id.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
        else if(id.first().content == `${client.prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
        id = id.first().content
        role = message.guild.roles.cache.get(id) ||
        message.guild.roles.cache.find(r => r.id === id);
    
        if (!role){
          return message.channel.send(`\\❌ **${message.author}**, Invalid Role - Please supply the mention of the role or the id!`)
        } else {
            await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **first** \`emoji id\`!`)
    
            let emojiID = await message.channel.awaitMessages({ filter, max: 1 })
            if(emojiID.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
            else if(emojiID.first().content == `${client.prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
            emojiID = emojiID.first().content
            emoji = message.guild.emojis.cache.get(emojiID) ||
            message.guild.emojis.cache.find(e => e.id === emojiID);
            if (!emoji){
                return message.channel.send(`\\❌ **${message.author}**, Invalid Emoji - Please supply the id of the emoji!`)
            }
        }
        await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **second** \`role id\`!`)

        id = await message.channel.awaitMessages({ filter, max: 1 })
        if(id.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
        else if(id.first().content == `${client.prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
        id = id.first().content
        role2 = message.guild.roles.cache.get(id) ||
        message.guild.roles.cache.find(r => r.id === id);
    
        if (!role2){
          return message.channel.send(`\\❌ **${message.author}**, Invalid Role - Please supply the mention of the role or the id!`)
        } else {
            await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **second** \`emoji id\`!`)
    
            emojiID = await message.channel.awaitMessages({ filter, max: 1 })
            if(emojiID.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
            else if(emojiID.first().content == `${client.prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
            emojiID = emojiID.first().content
            emoji2 = message.guild.emojis.cache.get(emojiID) ||
            message.guild.emojis.cache.find(e => e.id === emojiID);
            if (!emoji2){
                return message.channel.send(`\\❌ **${message.author}**, Invalid Emoji - Please supply the id of the emoji!`)
            }
        }
        await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **third** \`role id\`!`)

        id = await message.channel.awaitMessages({ filter, max: 1 })
        if(id.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
        else if(id.first().content == `${client.prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
        id = id.first().content
        role3 = message.guild.roles.cache.get(id) ||
        message.guild.roles.cache.find(r => r.id === id);
    
        if (!role3){
          return message.channel.send(`\\❌ **${message.author}**, Invalid Role - Please supply the mention of the role or the id!`)
        } else {
            await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **third** \`emoji id\`!`)
    
            emojiID = await message.channel.awaitMessages({ filter, max: 1 })
            if(emojiID.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
            else if(emojiID.first().content == `${client.prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
            emojiID = emojiID.first().content
            emoji3 = message.guild.emojis.cache.get(emojiID) ||
            message.guild.emojis.cache.find(e => e.id === emojiID);
            if (!emoji3){
                return message.channel.send(`\\❌ **${message.author}**, Invalid Emoji - Please supply the id of the emoji!`)
            }
        }
        await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **fourth** \`role id\`!`)

        id = await message.channel.awaitMessages({ filter, max: 1 })
        if(id.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
        else if(id.first().content == `${client.prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
        id = id.first().content
        role4 = message.guild.roles.cache.get(id) ||
        message.guild.roles.cache.find(r => r.id === id);
    
        if (!role4){
          return message.channel.send(`\\❌ **${message.author}**, Invalid Role - Please supply the mention of the role or the id!`)
        } else {
            await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **fourth** \`emoji id\`!`)
    
            emojiID = await message.channel.awaitMessages({ filter, max: 1 })
            if(emojiID.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
            else if(emojiID.first().content == `${client.prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
            emojiID = emojiID.first().content
            emoji4 = message.guild.emojis.cache.get(emojiID) ||
            message.guild.emojis.cache.find(e => e.id === emojiID);
            if (!emoji4){
                return message.channel.send(`\\❌ **${message.author}**, Invalid Emoji - Please supply the id of the emoji!`)
            }
        }
        await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **Fifth** \`role id\`!`)

        id = await message.channel.awaitMessages({ filter, max: 1 })
        if(id.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
        else if(id.first().content == `${client.prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
        id = id.first().content
        role5 = message.guild.roles.cache.get(id) ||
        message.guild.roles.cache.find(r => r.id === id);
    
        if (!role5){
          return message.channel.send(`\\❌ **${message.author}**, Invalid Role - Please supply the mention of the role or the id!`)
        } else {
            await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **Fifth** \`emoji id\`!`)
    
            emojiID = await message.channel.awaitMessages({ filter, max: 1 })
            if(emojiID.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
            else if(emojiID.first().content == `${client.prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
            emojiID = emojiID.first().content
            emoji5 = message.guild.emojis.cache.get(emojiID) ||
            message.guild.emojis.cache.find(e => e.id === emojiID);
            if (!emoji5){
                return message.channel.send(`\\❌ **${message.author}**, Invalid Emoji - Please supply the id of the emoji!`)
            }
        }
        await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **Sixth** \`role id\`!`)

        id = await message.channel.awaitMessages({ filter, max: 1 })
        if(id.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
        else if(id.first().content == `${client.prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
        id = id.first().content
        role6 = message.guild.roles.cache.get(id) ||
        message.guild.roles.cache.find(r => r.id === id);
    
        if (!role6){
          return message.channel.send(`\\❌ **${message.author}**, Invalid Role - Please supply the mention of the role or the id!`)
        } else {
            await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **Sixth** \`emoji id\`!`)
    
            emojiID = await message.channel.awaitMessages({ filter, max: 1 })
            if(emojiID.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
            else if(emojiID.first().content == `${client.prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
            emojiID = emojiID.first().content
            emoji6 = message.guild.emojis.cache.get(emojiID) ||
            message.guild.emojis.cache.find(e => e.id === emojiID);
            if (!emoji6){
                return message.channel.send(`\\❌ **${message.author}**, Invalid Emoji - Please supply the id of the emoji!`)
            }
        }

        
        const FinallEmb = new discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: true, size: 2048}))
        .setColor('#e6a54a')
        .setDescription(`<a:Right:877975111846731847> **${message.author.username}**, What the channel to send the menu to?\n\n<:1_:890489883032952876> Current channel\n<:2_:890489925059887134> Another channel`)
        .setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true, size: 2048}))
        .setTimestamp()
        await message.channel.send({ embeds: [FinallEmb], ephemeral: true})

        let thmsg = await message.channel.awaitMessages({ filter, max: 1 })
        if(thmsg.first().content == '1') {
            data.Mod.smroles.value1 = role.id;
            data.Mod.smroles.value2 = role2.id;
            data.Mod.smroles.value3 = role3.id;
            data.Mod.smroles.value4 = role4.id;
            data.Mod.smroles.value5 = role5.id;
            data.Mod.smroles.value6 = role6.id;
            await data.save().then(() => {
                const row2 = new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setCustomId('kwthbek4m221pyddhwk')
                        .setPlaceholder('Nothing selected!').addOptions([
                            {
                                label: role.name,
                                description: `Choose this option to get role ${role.name}!`,
                                value: role.id,
                                emoji: emoji.id,
                            },
                            {
                                label: role2.name,
                                description: `Choose this option to get role ${role2.name}!`,
                                value: role2.id,
                                emoji: emoji2.id,
                            },
                            {
                                label: role3.name,
                                description: `Choose this option to get role ${role3.name}!`,
                                value: role3.id,
                                emoji: emoji3.id,
                            },
                            {
                                label: role4.name,
                                description: `Choose this option to get role ${role4.name}!`,
                                value: role4.id,
                                emoji: emoji4.id,
                            },
                            {
                                label: role5.name,
                                description: `Choose this option to get role ${role5.name}!`,
                                value: role5.id,
                                emoji: emoji5.id,
                            },
                            {
                                label: role6.name,
                                description: `Choose this option to get role ${role6.name}!`,
                                value: role6.id,
                                emoji: emoji6.id,
                            },
                        ]),
                )
                message.channel.send({ content: '<:Tag:836168214525509653> **Choose your roles!**', components: [row2] });
              }).catch(()=> message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`));
        } else if(thmsg.first().content == '2') {
            const filter = msg => msg.author.id == message.author.id;

            await message.reply({ content: `**${message.author.username}**, type the channel id!`, ephemeral: true})

            let thchannel = await message.channel.awaitMessages({ filter, max: 1 })
            thchannel = thchannel.first().content

            Embedchannel = message.guild.channels.cache.get(thchannel);

            if (!Embedchannel || Embedchannel.type !== 'GUILD_TEXT' && Embedchannel.type !== 'GUILD_NEWS'){
                return message.channel.send(`\\❌ **${message.member.displayName}**, please provide a valid channel ID.`)
              } else if (!Embedchannel.permissionsFor(message.guild.me).has('SEND_MESSAGES')){
                return message.channel.send(`\\❌ **${message.member.displayName}**, I need you to give me permission to send messages on ${channel} and try again.`)
              } else if (!Embedchannel.permissionsFor(message.guild.me).has('EMBED_LINKS')){
                return message.channel.send(`\\❌ **${message.member.displayName}**, I need you to give me permission to embed links on ${channel} and try again.`)
              };

              data.Mod.smroles.value1 = role.id;
              data.Mod.smroles.value2 = role2.id;
              data.Mod.smroles.value3 = role3.id;
              data.Mod.smroles.value4 = role4.id;
              data.Mod.smroles.value5 = role5.id;
              data.Mod.smroles.value6 = role6.id;
              await data.save().then(() => {
                  const row2 = new MessageActionRow()
                  .addComponents(
                      new MessageSelectMenu()
                          .setCustomId('kwthbek4m221pyddhwk')
                          .setPlaceholder('Nothing selected!').addOptions([
                              {
                                  label: role.name,
                                  description: `Choose this option to get role ${role.name}!`,
                                  value: role.id,
                                  emoji: emoji.id,
                              },
                              {
                                  label: role2.name,
                                  description: `Choose this option to get role ${role2.name}!`,
                                  value: role2.id,
                                  emoji: emoji2.id,
                              },
                              {
                                  label: role3.name,
                                  description: `Choose this option to get role ${role3.name}!`,
                                  value: role3.id,
                                  emoji: emoji3.id,
                              },
                              {
                                  label: role4.name,
                                  description: `Choose this option to get role ${role4.name}!`,
                                  value: role4.id,
                                  emoji: emoji4.id,
                              },
                              {
                                  label: role5.name,
                                  description: `Choose this option to get role ${role5.name}!`,
                                  value: role5.id,
                                  emoji: emoji5.id,
                              },
                              {
                                  label: role6.name,
                                  description: `Choose this option to get role ${role6.name}!`,
                                  value: role6.id,
                                  emoji: emoji6.id,
                              },
                          ]),
                  )
                  Embedchannel.send({ content: '<:Tag:836168214525509653> **Choose your roles!**', components: [row2] });
                }).catch(()=> message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`));
                message.channel.send(`\\✔️ **${message.author}**, Successfully send the \`select-menu-role\` to ${Embedchannel}!`)
        } else {
            return message.reply({ content: `<:error:888264104081522698>  **|**  That is an invalid response. Please try again.`, ephemeral: true })
        }
    } else {
        return message.channel.send(`\\❌ **${message.author}**, Some thing is \`wrong\`!`)
    }


}
}