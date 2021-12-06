const discord = require('discord.js');
const { MessageActionRow, MessageSelectMenu } = require('discord.js');
const { prefix } = require('../../config.json');
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

    const filter = msg => msg.author.id == message.author.id;
    
    if(quantity === 1) {
    await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the \`role id\`!`)

    let id = await message.channel.awaitMessages({ filter, max: 1 })
    if(id.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
    else if(id.first().content == `${prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
    id = id.first().content
    role = message.guild.roles.cache.get(id) ||
    message.guild.roles.cache.find(r => r.id === role);

    if (!role){
      return message.channel.send(`\\❌ **${message.author}**, Invalid Role - Please supply the mention of the role or the id!`)
    } else {
        await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the \`emoji id\`!`)

        let emojiID = await message.channel.awaitMessages({ filter, max: 1 })
        if(emojiID.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
        else if(emojiID.first().content == `${prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
        emojiID = emojiID.first().content
        emoji = message.guild.emojis.cache.get(emojiID) ||
        message.guild.emojis.cache.find(e => e.emojiID === emoji);
        if (!emoji){
            return message.channel.send(`\\❌ **${message.author}**, Invalid Emoji - Please supply the id of the emoji!`)
        }

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
    }
    } else if(quantity === 2) {
        await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **first** \`role id\`!`)

        let id = await message.channel.awaitMessages({ filter, max: 1 })
        if(id.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
        else if(id.first().content == `${prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
        id = id.first().content
        role = message.guild.roles.cache.get(id) ||
        message.guild.roles.cache.find(r => r.id === role);
    
        if (!role){
          return message.channel.send(`\\❌ **${message.author}**, Invalid Role - Please supply the mention of the role or the id!`)
        } else {
            await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **first** \`emoji id\`!`)
    
            let emojiID = await message.channel.awaitMessages({ filter, max: 1 })
            if(emojiID.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
            else if(emojiID.first().content == `${prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
            emojiID = emojiID.first().content
            emoji = message.guild.emojis.cache.get(emojiID) ||
            message.guild.emojis.cache.find(e => e.emojiID === emoji);
            if (!emoji){
                return message.channel.send(`\\❌ **${message.author}**, Invalid Emoji - Please supply the id of the emoji!`)
            }
        }
        await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **second** \`role id\`!`)

        id = await message.channel.awaitMessages({ filter, max: 1 })
        if(id.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
        else if(id.first().content == `${prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
        id = id.first().content
        role2 = message.guild.roles.cache.get(id) ||
        message.guild.roles.cache.find(r => r.id === role2);
    
        if (!role2){
          return message.channel.send(`\\❌ **${message.author}**, Invalid Role - Please supply the mention of the role or the id!`)
        } else {
            await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **second** \`emoji id\`!`)
    
            emojiID = await message.channel.awaitMessages({ filter, max: 1 })
            if(emojiID.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
            else if(emojiID.first().content == `${prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
            emojiID = emojiID.first().content
            emoji2 = message.guild.emojis.cache.get(emojiID) ||
            message.guild.emojis.cache.find(e => e.emojiID === emoji2);
            if (!emoji2){
                return message.channel.send(`\\❌ **${message.author}**, Invalid Emoji - Please supply the id of the emoji!`)
            }
        }

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
    } else if(quantity === 3) {
        await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **first** \`role id\`!`)

        let id = await message.channel.awaitMessages({ filter, max: 1 })
        if(id.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
        else if(id.first().content == `${prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
        id = id.first().content
        role = message.guild.roles.cache.get(id) ||
        message.guild.roles.cache.find(r => r.id === role);
    
        if (!role){
          return message.channel.send(`\\❌ **${message.author}**, Invalid Role - Please supply the mention of the role or the id!`)
        } else {
            await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **first** \`emoji id\`!`)
    
            let emojiID = await message.channel.awaitMessages({ filter, max: 1 })
            if(emojiID.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
            else if(emojiID.first().content == `${prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
            emojiID = emojiID.first().content
            emoji = message.guild.emojis.cache.get(emojiID) ||
            message.guild.emojis.cache.find(e => e.emojiID === emoji);
            if (!emoji){
                return message.channel.send(`\\❌ **${message.author}**, Invalid Emoji - Please supply the id of the emoji!`)
            }
        }
        await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **second** \`role id\`!`)

        id = await message.channel.awaitMessages({ filter, max: 1 })
        if(id.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
        else if(id.first().content == `${prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
        id = id.first().content
        role2 = message.guild.roles.cache.get(id) ||
        message.guild.roles.cache.find(r => r.id === role2);
    
        if (!role2){
          return message.channel.send(`\\❌ **${message.author}**, Invalid Role - Please supply the mention of the role or the id!`)
        } else {
            await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **second** \`emoji id\`!`)
    
            emojiID = await message.channel.awaitMessages({ filter, max: 1 })
            if(emojiID.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
            else if(emojiID.first().content == `${prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
            emojiID = emojiID.first().content
            emoji2 = message.guild.emojis.cache.get(emojiID) ||
            message.guild.emojis.cache.find(e => e.emojiID === emoji2);
            if (!emoji2){
                return message.channel.send(`\\❌ **${message.author}**, Invalid Emoji - Please supply the id of the emoji!`)
            }
        }
        await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **third** \`role id\`!`)

        id = await message.channel.awaitMessages({ filter, max: 1 })
        if(id.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
        else if(id.first().content == `${prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
        id = id.first().content
        role3 = message.guild.roles.cache.get(id) ||
        message.guild.roles.cache.find(r => r.id === role3);
    
        if (!role3){
          return message.channel.send(`\\❌ **${message.author}**, Invalid Role - Please supply the mention of the role or the id!`)
        } else {
            await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **third** \`emoji id\`!`)
    
            emojiID = await message.channel.awaitMessages({ filter, max: 1 })
            if(emojiID.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
            else if(emojiID.first().content == `${prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
            emojiID = emojiID.first().content
            emoji3 = message.guild.emojis.cache.get(emojiID) ||
            message.guild.emojis.cache.find(e => e.emojiID === emoji3);
            if (!emoji3){
                return message.channel.send(`\\❌ **${message.author}**, Invalid Emoji - Please supply the id of the emoji!`)
            }
        }

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
    } else if(quantity === 4) {
        await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **first** \`role id\`!`)

        let id = await message.channel.awaitMessages({ filter, max: 1 })
        if(id.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
        else if(id.first().content == `${prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
        id = id.first().content
        role = message.guild.roles.cache.get(id) ||
        message.guild.roles.cache.find(r => r.id === role);
    
        if (!role){
          return message.channel.send(`\\❌ **${message.author}**, Invalid Role - Please supply the mention of the role or the id!`)
        } else {
            await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **first** \`emoji id\`!`)
    
            let emojiID = await message.channel.awaitMessages({ filter, max: 1 })
            if(emojiID.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
            else if(emojiID.first().content == `${prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
            emojiID = emojiID.first().content
            emoji = message.guild.emojis.cache.get(emojiID) ||
            message.guild.emojis.cache.find(e => e.emojiID === emoji);
            if (!emoji){
                return message.channel.send(`\\❌ **${message.author}**, Invalid Emoji - Please supply the id of the emoji!`)
            }
        }
        await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **second** \`role id\`!`)

        id = await message.channel.awaitMessages({ filter, max: 1 })
        if(id.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
        else if(id.first().content == `${prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
        id = id.first().content
        role2 = message.guild.roles.cache.get(id) ||
        message.guild.roles.cache.find(r => r.id === role2);
    
        if (!role2){
          return message.channel.send(`\\❌ **${message.author}**, Invalid Role - Please supply the mention of the role or the id!`)
        } else {
            await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **second** \`emoji id\`!`)
    
            emojiID = await message.channel.awaitMessages({ filter, max: 1 })
            if(emojiID.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
            else if(emojiID.first().content == `${prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
            emojiID = emojiID.first().content
            emoji2 = message.guild.emojis.cache.get(emojiID) ||
            message.guild.emojis.cache.find(e => e.emojiID === emoji2);
            if (!emoji2){
                return message.channel.send(`\\❌ **${message.author}**, Invalid Emoji - Please supply the id of the emoji!`)
            }
        }
        await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **third** \`role id\`!`)

        id = await message.channel.awaitMessages({ filter, max: 1 })
        if(id.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
        else if(id.first().content == `${prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
        id = id.first().content
        role3 = message.guild.roles.cache.get(id) ||
        message.guild.roles.cache.find(r => r.id === role3);
    
        if (!role3){
          return message.channel.send(`\\❌ **${message.author}**, Invalid Role - Please supply the mention of the role or the id!`)
        } else {
            await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **third** \`emoji id\`!`)
    
            emojiID = await message.channel.awaitMessages({ filter, max: 1 })
            if(emojiID.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
            else if(emojiID.first().content == `${prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
            emojiID = emojiID.first().content
            emoji3 = message.guild.emojis.cache.get(emojiID) ||
            message.guild.emojis.cache.find(e => e.emojiID === emoji3);
            if (!emoji3){
                return message.channel.send(`\\❌ **${message.author}**, Invalid Emoji - Please supply the id of the emoji!`)
            }
        }
        await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **fourth** \`role id\`!`)

        id = await message.channel.awaitMessages({ filter, max: 1 })
        if(id.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
        else if(id.first().content == `${prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
        id = id.first().content
        role4 = message.guild.roles.cache.get(id) ||
        message.guild.roles.cache.find(r => r.id === role4);
    
        if (!role4){
          return message.channel.send(`\\❌ **${message.author}**, Invalid Role - Please supply the mention of the role or the id!`)
        } else {
            await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **fourth** \`emoji id\`!`)
    
            emojiID = await message.channel.awaitMessages({ filter, max: 1 })
            if(emojiID.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
            else if(emojiID.first().content == `${prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
            emojiID = emojiID.first().content
            emoji4 = message.guild.emojis.cache.get(emojiID) ||
            message.guild.emojis.cache.find(e => e.emojiID === emoji4);
            if (!emoji4){
                return message.channel.send(`\\❌ **${message.author}**, Invalid Emoji - Please supply the id of the emoji!`)
            }
        }

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
    } else if(quantity === 5) {
        await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **first** \`role id\`!`)

        let id = await message.channel.awaitMessages({ filter, max: 1 })
        if(id.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
        else if(id.first().content == `${prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
        id = id.first().content
        role = message.guild.roles.cache.get(id) ||
        message.guild.roles.cache.find(r => r.id === role);
    
        if (!role){
          return message.channel.send(`\\❌ **${message.author}**, Invalid Role - Please supply the mention of the role or the id!`)
        } else {
            await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **first** \`emoji id\`!`)
    
            let emojiID = await message.channel.awaitMessages({ filter, max: 1 })
            if(emojiID.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
            else if(emojiID.first().content == `${prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
            emojiID = emojiID.first().content
            emoji = message.guild.emojis.cache.get(emojiID) ||
            message.guild.emojis.cache.find(e => e.emojiID === emoji);
            if (!emoji){
                return message.channel.send(`\\❌ **${message.author}**, Invalid Emoji - Please supply the id of the emoji!`)
            }
        }
        await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **second** \`role id\`!`)

        id = await message.channel.awaitMessages({ filter, max: 1 })
        if(id.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
        else if(id.first().content == `${prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
        id = id.first().content
        role2 = message.guild.roles.cache.get(id) ||
        message.guild.roles.cache.find(r => r.id === role2);
    
        if (!role2){
          return message.channel.send(`\\❌ **${message.author}**, Invalid Role - Please supply the mention of the role or the id!`)
        } else {
            await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **second** \`emoji id\`!`)
    
            emojiID = await message.channel.awaitMessages({ filter, max: 1 })
            if(emojiID.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
            else if(emojiID.first().content == `${prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
            emojiID = emojiID.first().content
            emoji2 = message.guild.emojis.cache.get(emojiID) ||
            message.guild.emojis.cache.find(e => e.emojiID === emoji2);
            if (!emoji2){
                return message.channel.send(`\\❌ **${message.author}**, Invalid Emoji - Please supply the id of the emoji!`)
            }
        }
        await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **third** \`role id\`!`)

        id = await message.channel.awaitMessages({ filter, max: 1 })
        if(id.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
        else if(id.first().content == `${prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
        id = id.first().content
        role3 = message.guild.roles.cache.get(id) ||
        message.guild.roles.cache.find(r => r.id === role3);
    
        if (!role3){
          return message.channel.send(`\\❌ **${message.author}**, Invalid Role - Please supply the mention of the role or the id!`)
        } else {
            await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **third** \`emoji id\`!`)
    
            emojiID = await message.channel.awaitMessages({ filter, max: 1 })
            if(emojiID.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
            else if(emojiID.first().content == `${prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
            emojiID = emojiID.first().content
            emoji3 = message.guild.emojis.cache.get(emojiID) ||
            message.guild.emojis.cache.find(e => e.emojiID === emoji3);
            if (!emoji3){
                return message.channel.send(`\\❌ **${message.author}**, Invalid Emoji - Please supply the id of the emoji!`)
            }
        }
        await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **fourth** \`role id\`!`)

        id = await message.channel.awaitMessages({ filter, max: 1 })
        if(id.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
        else if(id.first().content == `${prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
        id = id.first().content
        role4 = message.guild.roles.cache.get(id) ||
        message.guild.roles.cache.find(r => r.id === role4);
    
        if (!role4){
          return message.channel.send(`\\❌ **${message.author}**, Invalid Role - Please supply the mention of the role or the id!`)
        } else {
            await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **fourth** \`emoji id\`!`)
    
            emojiID = await message.channel.awaitMessages({ filter, max: 1 })
            if(emojiID.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
            else if(emojiID.first().content == `${prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
            emojiID = emojiID.first().content
            emoji4 = message.guild.emojis.cache.get(emojiID) ||
            message.guild.emojis.cache.find(e => e.emojiID === emoji4);
            if (!emoji4){
                return message.channel.send(`\\❌ **${message.author}**, Invalid Emoji - Please supply the id of the emoji!`)
            }
        }
        await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **Fifth** \`role id\`!`)

        id = await message.channel.awaitMessages({ filter, max: 1 })
        if(id.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
        else if(id.first().content == `${prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
        id = id.first().content
        role5 = message.guild.roles.cache.get(id) ||
        message.guild.roles.cache.find(r => r.id === role5);
    
        if (!role5){
          return message.channel.send(`\\❌ **${message.author}**, Invalid Role - Please supply the mention of the role or the id!`)
        } else {
            await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **Fifth** \`emoji id\`!`)
    
            emojiID = await message.channel.awaitMessages({ filter, max: 1 })
            if(emojiID.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
            else if(emojiID.first().content == `${prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
            emojiID = emojiID.first().content
            emoji5 = message.guild.emojis.cache.get(emojiID) ||
            message.guild.emojis.cache.find(e => e.emojiID === emoji5);
            if (!emoji5){
                return message.channel.send(`\\❌ **${message.author}**, Invalid Emoji - Please supply the id of the emoji!`)
            }
        }

        data.Mod.smroles.value1 = role.id;
        data.Mod.smroles.value2 = role2.id;
        data.Mod.smroles.value3 = role3.id;
        data.Mod.smroles.value4 = role4.id;
        data.Mod.smroles.value5 = role4.id;
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
    } else if(quantity === 6) {
        await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **first** \`role id\`!`)

        let id = await message.channel.awaitMessages({ filter, max: 1 })
        if(id.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
        else if(id.first().content == `${prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
        id = id.first().content
        role = message.guild.roles.cache.get(id) ||
        message.guild.roles.cache.find(r => r.id === role);
    
        if (!role){
          return message.channel.send(`\\❌ **${message.author}**, Invalid Role - Please supply the mention of the role or the id!`)
        } else {
            await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **first** \`emoji id\`!`)
    
            let emojiID = await message.channel.awaitMessages({ filter, max: 1 })
            if(emojiID.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
            else if(emojiID.first().content == `${prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
            emojiID = emojiID.first().content
            emoji = message.guild.emojis.cache.get(emojiID) ||
            message.guild.emojis.cache.find(e => e.emojiID === emoji);
            if (!emoji){
                return message.channel.send(`\\❌ **${message.author}**, Invalid Emoji - Please supply the id of the emoji!`)
            }
        }
        await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **second** \`role id\`!`)

        id = await message.channel.awaitMessages({ filter, max: 1 })
        if(id.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
        else if(id.first().content == `${prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
        id = id.first().content
        role2 = message.guild.roles.cache.get(id) ||
        message.guild.roles.cache.find(r => r.id === role2);
    
        if (!role2){
          return message.channel.send(`\\❌ **${message.author}**, Invalid Role - Please supply the mention of the role or the id!`)
        } else {
            await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **second** \`emoji id\`!`)
    
            emojiID = await message.channel.awaitMessages({ filter, max: 1 })
            if(emojiID.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
            else if(emojiID.first().content == `${prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
            emojiID = emojiID.first().content
            emoji2 = message.guild.emojis.cache.get(emojiID) ||
            message.guild.emojis.cache.find(e => e.emojiID === emoji2);
            if (!emoji2){
                return message.channel.send(`\\❌ **${message.author}**, Invalid Emoji - Please supply the id of the emoji!`)
            }
        }
        await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **third** \`role id\`!`)

        id = await message.channel.awaitMessages({ filter, max: 1 })
        if(id.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
        else if(id.first().content == `${prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
        id = id.first().content
        role3 = message.guild.roles.cache.get(id) ||
        message.guild.roles.cache.find(r => r.id === role3);
    
        if (!role3){
          return message.channel.send(`\\❌ **${message.author}**, Invalid Role - Please supply the mention of the role or the id!`)
        } else {
            await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **third** \`emoji id\`!`)
    
            emojiID = await message.channel.awaitMessages({ filter, max: 1 })
            if(emojiID.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
            else if(emojiID.first().content == `${prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
            emojiID = emojiID.first().content
            emoji3 = message.guild.emojis.cache.get(emojiID) ||
            message.guild.emojis.cache.find(e => e.emojiID === emoji3);
            if (!emoji3){
                return message.channel.send(`\\❌ **${message.author}**, Invalid Emoji - Please supply the id of the emoji!`)
            }
        }
        await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **fourth** \`role id\`!`)

        id = await message.channel.awaitMessages({ filter, max: 1 })
        if(id.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
        else if(id.first().content == `${prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
        id = id.first().content
        role4 = message.guild.roles.cache.get(id) ||
        message.guild.roles.cache.find(r => r.id === role4);
    
        if (!role4){
          return message.channel.send(`\\❌ **${message.author}**, Invalid Role - Please supply the mention of the role or the id!`)
        } else {
            await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **fourth** \`emoji id\`!`)
    
            emojiID = await message.channel.awaitMessages({ filter, max: 1 })
            if(emojiID.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
            else if(emojiID.first().content == `${prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
            emojiID = emojiID.first().content
            emoji4 = message.guild.emojis.cache.get(emojiID) ||
            message.guild.emojis.cache.find(e => e.emojiID === emoji4);
            if (!emoji4){
                return message.channel.send(`\\❌ **${message.author}**, Invalid Emoji - Please supply the id of the emoji!`)
            }
        }
        await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **Fifth** \`role id\`!`)

        id = await message.channel.awaitMessages({ filter, max: 1 })
        if(id.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
        else if(id.first().content == `${prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
        id = id.first().content
        role5 = message.guild.roles.cache.get(id) ||
        message.guild.roles.cache.find(r => r.id === role5);
    
        if (!role5){
          return message.channel.send(`\\❌ **${message.author}**, Invalid Role - Please supply the mention of the role or the id!`)
        } else {
            await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **Fifth** \`emoji id\`!`)
    
            emojiID = await message.channel.awaitMessages({ filter, max: 1 })
            if(emojiID.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
            else if(emojiID.first().content == `${prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
            emojiID = emojiID.first().content
            emoji5 = message.guild.emojis.cache.get(emojiID) ||
            message.guild.emojis.cache.find(e => e.emojiID === emoji5);
            if (!emoji5){
                return message.channel.send(`\\❌ **${message.author}**, Invalid Emoji - Please supply the id of the emoji!`)
            }
        }
        await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **Sixth** \`role id\`!`)

        id = await message.channel.awaitMessages({ filter, max: 1 })
        if(id.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
        else if(id.first().content == `${prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
        id = id.first().content
        role6 = message.guild.roles.cache.get(id) ||
        message.guild.roles.cache.find(r => r.id === role6);
    
        if (!role6){
          return message.channel.send(`\\❌ **${message.author}**, Invalid Role - Please supply the mention of the role or the id!`)
        } else {
            await message.reply(`<a:Loading:841321898302373909> **${message.author}**, Please type the **Sixth** \`emoji id\`!`)
    
            emojiID = await message.channel.awaitMessages({ filter, max: 1 })
            if(emojiID.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`});
            else if(emojiID.first().content == `${prefix}smr`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`})
            emojiID = emojiID.first().content
            emoji6 = message.guild.emojis.cache.get(emojiID) ||
            message.guild.emojis.cache.find(e => e.emojiID === emoji6);
            if (!emoji6){
                return message.channel.send(`\\❌ **${message.author}**, Invalid Emoji - Please supply the id of the emoji!`)
            }
        }

        data.Mod.smroles.value1 = role.id;
        data.Mod.smroles.value2 = role2.id;
        data.Mod.smroles.value3 = role3.id;
        data.Mod.smroles.value4 = role4.id;
        data.Mod.smroles.value5 = role4.id;
        data.Mod.smroles.value6 = role4.id;
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
    } else {
        return message.channel.send(`\\❌ **${message.author}**, Some thing is \`wrong\`!`)
    }


}
}