const Discord = require('discord.js');
const schema = require('../../schema/Economy-Schema')

module.exports = {
    name: "buy",
    aliases: ["Buy", "BUY"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<item>',
    group: 'Economy',
    description: 'To buy items from the shop.',
    cooldown: 5, //seconds(s)
    guarded: false, //or false
    examples: [
        'fishingpole',
        'ultimatecookie'
      ],
    async execute(client, message, [item = '', ...args]) {

        let data;
        try{
            data = await schema.findOne({
                userID: message.author.id
            })
            if(!data) {
            data = await schema.create({
                userID: message.author.id
            })
            }
        } catch(err) {
            console.log(err)
        }

        if(!item) {
            const nulle = new Discord.MessageEmbed()
            .setTitle(`<a:Wrong:812104211361693696> Unknown item!`)
            .setDescription(`**${message.author.username}**, You didn't type the item to buy!`)
            .setFooter(message.author.username, message.author.displayAvatarURL({dynamic: true, size: 2048}))
            .setColor('RED')
            message.channel.send({ embeds: [nulle] })
        }

        if(item.toLowerCase() === 'fishingpole') {
            if(data.inv.FishinPole == 1) return message.channel.send(`\\❌ **${message.author.tag}**, You already have this item in your inventory!`)
            if(Math.ceil(2500) > data.credits) return message.channel.send(`\\❌ **${message.author.tag}**, Insuffecient credits! You only have **${data.credits}**!`)
            await message.channel.send({ content: `<a:iNFO:853495450111967253> **${message.author.tag}**, Are you sure you want to buy **🎣 FishingPole** item? your new palance will be **${data.credits - 2500}**! \`(y/n)\``})
      
            const filter = _message => message.author.id === _message.author.id && ['y','n','yes','no'].includes(_message.content.toLowerCase());
        
            const proceed = await message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
            .then(collected => ['y','yes'].includes(collected.first().content.toLowerCase()) ? true : false)
            .catch(() => false);
        
            if (!proceed){
              return message.channel.send({ content: `<a:Wrong:812104211361693696> | ${message.author}, Cancelled the \`buy\` command!`});
            };

            data.inv.FishinPole = 1;
            data.credits -= Math.floor(2500)
            .then(async () => {
            await data.save()
            message.channel.send(`<a:Bagopen:877975110806540379> **${message.author.tag}**, You bought **🎣 FishingPole** for \`2,500\`!`)
            })
            .catch(() => message.channel.send({ content: `<a:Wrong:812104211361693696> | Failed to buy **🎣 FishingPole**!`}))
        } else if(item.toLowerCase() === 'ultimatecookie') {
            if(data.inv.UltimateCookie == 1) return message.channel.send(`\\❌ **${message.author.tag}**, You already have this item in your inventory!`)
            if(Math.ceil(50000) > data.credits) return message.channel.send(`\\❌ **${message.author.tag}**, Insuffecient credits! You only have **${data.credits}**!`)
            await message.channel.send({ content: `<a:iNFO:853495450111967253> **${message.author.tag}**, Are you sure you want to buy **<a:Cookie:853495749370839050> UltimateCookie Machine** item? your new palance will be **${data.credits - 50000}**! \`(y/n)\``})
      
            const filter = _message => message.author.id === _message.author.id && ['y','n','yes','no'].includes(_message.content.toLowerCase());
        
            const proceed = await message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
            .then(collected => ['y','yes'].includes(collected.first().content.toLowerCase()) ? true : false)
            .catch(() => false);
        
            if (!proceed){
              return message.channel.send({ content: `<a:Wrong:812104211361693696> | ${message.author}, Cancelled the \`buy\` command!`});
            };

            data.inv.UltimateCookie = 1;
            data.credits -= Math.floor(50000)
            .then(async () => {
            await data.save()
            message.channel.send(`<a:Bagopen:877975110806540379> **${message.author.tag}**, You bought **<a:Cookie:853495749370839050> UltimateCookie Machine** for \`50,000\`!`)
            })
            .catch(() => message.channel.send({ content: `<a:Wrong:812104211361693696> | Failed to buy **<a:Cookie:853495749370839050> UltimateCookie Machine**!`}));
        } else if(item .toLowerCase()=== 'stonepickaxe') {
            if(data.inv.StonePickaxe == 1) return message.channel.send(`\\❌ **${message.author.tag}**, You already have this item in your inventory!`)
            if(Math.ceil(15000) > data.credits) return message.channel.send(`\\❌ **${message.author.tag}**, Insuffecient credits! You only have **${data.credits}**!`)
            await message.channel.send({ content: `<a:iNFO:853495450111967253> **${message.author.tag}**, Are you sure you want to buy **<:StonePickaxe:887032165437702277> StonePickaxe** item? your new palance will be **${data.credits - 15000}**! \`(y/n)\``})
      
            const filter = _message => message.author.id === _message.author.id && ['y','n','yes','no'].includes(_message.content.toLowerCase());
        
            const proceed = await message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
            .then(collected => ['y','yes'].includes(collected.first().content.toLowerCase()) ? true : false)
            .catch(() => false);
        
            if (!proceed){
              return message.channel.send({ content: `<a:Wrong:812104211361693696> | ${message.author}, Cancelled the \`buy\` command!`});
            };

            data.inv.StonePickaxe = 1;
            data.credits -= Math.floor(15000)
            .then(async () => {
            await data.save()
            message.channel.send(`<a:Bagopen:877975110806540379> **${message.author.tag}**, You bought **<:StonePickaxe:887032165437702277> StonePickaxe** for \`15,000\`!`)
            })
            .catch(() => message.channel.send({ content: `<a:Wrong:812104211361693696> | Failed to buy **<:StonePickaxe:887032165437702277> StonePickaxe**!`}));
        } else if(item.toLowerCase() === 'ironpickaxe') {
            if(data.inv.IronPickaxe == 1) return message.channel.send(`\\❌ **${message.author.tag}**, You already have this item in your inventory!`)
            if(Math.ceil(28000) > data.credits) return message.channel.send(`\\❌ **${message.author.tag}**, Insuffecient credits! You only have **${data.credits}**!`)
            await message.channel.send({ content: `<a:iNFO:853495450111967253> **${message.author.tag}**, Are you sure you want to buy **<:e_:887042865715359774> IronPickaxe** item? your new palance will be **${data.credits - 28000}**! \`(y/n)\``})
      
            const filter = _message => message.author.id === _message.author.id && ['y','n','yes','no'].includes(_message.content.toLowerCase());
        
            const proceed = await message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
            .then(collected => ['y','yes'].includes(collected.first().content.toLowerCase()) ? true : false)
            .catch(() => false);
        
            if (!proceed){
              return message.channel.send({ content: `<a:Wrong:812104211361693696> | ${message.author}, Cancelled the \`buy\` command!`});
            };

            data.inv.IronPickaxe = 1;
            data.credits -= Math.floor(28000)
            .then(async () => {
            await data.save()
            message.channel.send(`<a:Bagopen:877975110806540379> **${message.author.tag}**, You bought **<:e_:887042865715359774> IronPickaxe** for \`28,000\`!`)
            })
            .catch(() => message.channel.send({ content: `<a:Wrong:812104211361693696> | Failed to buy **<:e_:887042865715359774> IronPickaxe**!`}));
        } else if(item.toLowerCase() === 'diamondpickaxe') {
            if(data.inv.DiamondPickaxe == 1) return message.channel.send(`\\❌ **${message.author.tag}**, You already have this item in your inventory!`)
            if(Math.ceil(52000) > data.credits) return message.channel.send(`\\❌ **${message.author.tag}**, Insuffecient credits! You only have **${data.credits}**!`)
            await message.channel.send({ content: `<a:iNFO:853495450111967253> **${message.author.tag}**, Are you sure you want to buy **<:e_:887059604998078495> DiamondPickaxe** item? your new palance will be **${data.credits - 52000}**! \`(y/n)\``})
      
            const filter = _message => message.author.id === _message.author.id && ['y','n','yes','no'].includes(_message.content.toLowerCase());
        
            const proceed = await message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
            .then(collected => ['y','yes'].includes(collected.first().content.toLowerCase()) ? true : false)
            .catch(() => false);
        
            if (!proceed){
              return message.channel.send({ content: `<a:Wrong:812104211361693696> | ${message.author}, Cancelled the \`buy\` command!`});
            };

            data.inv.DiamondPickaxe = 1;
            data.credits -= Math.floor(52000)
            .then(async () => {
            await data.save()
            message.channel.send(`<a:Bagopen:877975110806540379> **${message.author.tag}**, You bought **<:e_:887059604998078495> DiamondPickaxe** for \`52,000\`!`)
            })
            .catch(async () => message.channel.send({ content: `<a:Wrong:812104211361693696> | Failed to buy **<:e_:887059604998078495> DiamondPickaxe**!`}));
        } else {
            const nulle = new Discord.MessageEmbed()
            .setTitle(`<a:Wrong:812104211361693696> Unknown item!`)
            .setDescription(`**${message.author.username}**, **${item}** this item not from the items listed on shop!`)
            .setFooter(message.author.username, message.author.displayAvatarURL({dynamic: true, size: 2048}))
            .setColor('RED')
            return message.channel.send({ embeds: [nulle] })
        }
}
}
