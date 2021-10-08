const Discord = require('discord.js');
const { MessageEmbed} = require('discord.js');
const schema = require('../../schema/Economy-Schema')
const _ = require('lodash');
const Pages = require('../../util/Paginate');
const { prefix } = require('../../config.json');
const market = require('../../assets/json/market.json');
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: "inv",
    aliases: ["Inv", "inventory", "Inventory", "INVENTORY"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '',
    group: 'Economy',
    description: 'Show your inventory items!',
    cooldown: 5, //seconds(s)
    guarded: false, //or false
    permissions: [],
    examples: [''],
    async execute(client, message, args) {

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
        let button = new MessageButton()
        .setStyle('PRIMARY')
        .setEmoji('853495153280155668')
        .setLabel('Minging inventory')
        .setCustomId("652196854196854984")
        const row = new MessageActionRow()
        .addComponents(button);
        const Mineinv = new Discord.MessageEmbed()
        .setAuthor(client.user.username, client.user.displayAvatarURL({dynamic: true, size: 2048}))
        .setColor('#2F3136')
        .setTitle(`<a:BackPag:776670895371714570> ${message.author.username}\'s mining Inventory!`)
        .addFields(
            { name: '<:e_:887034070842900552> Coal', value: `\`\`\`${data.inv.Coal}\`\`\``},
            { name: '<:e_:887031111790764092> Stone', value: `\`\`\`${data.inv.Stone}\`\`\``},
            { name: '<:e_:887034687472689192> Iron', value: `\`\`\`${data.inv.Iron}\`\`\``},
            { name: '<:e_:887036608874967121> Gold', value: `\`\`\`${data.inv.Gold}\`\`\``},
            { name: '<a:Diamond:877975082868301824> Diamond', value: `\`\`\`${data.inv.Diamond}\`\`\``},
        )
        .setURL('https://Wolfy.yoyojoe.repl.co')
        .setFooter(`${prefix}sell [item] (amount)`, message.author.displayAvatarURL({dynamic: true, size: 2048}))
        .setTimestamp()

        const pages = new Pages(_.chunk(data.profile.inventory, 25).map((chunk, i, o) => {
          return new MessageEmbed()
          .setColor('GREY')
          .setTitle(`${message.author.tag}'s Inventory`)
          .setURL('https://wolfy.yoyojoe.repl.co/')
          .setFooter(`${message.author.tag}'s Inventory | \©️${new Date().getFullYear()} Wolfy\u2000\u2000•\u2000\u2000Page ${i+1} of ${o.length}`)
          .addFields(...chunk.sort((A,B) => A.id - B.id ).map(d => {
            const item = market.find(x => x.id == d.id);
            return {
              inline: true,
              name: `\`[${item.id}]\` ${item.name}`,
              value: [
                `Type: *${item.type}*`,
                `Selling Price: *${Math.floor(item.price / 0.7)}*`,
                `Use: \`${prefix}use ${item.id}\``
              ].join('\n')
            }
          }));
        }));
    
        if (!pages.size){
          return message.channel.send(`\\❌ **${message.author.tag}**, your inventory is empty.`);
        };
    
        const msg = await message.channel.send({ embeds: [pages.firstPage], components: [row] });
        const Butcollector = msg.createMessageComponentCollector({ time: 15000, fetch: true });

        Butcollector.on('collect', async interactionCreate => {
            if(interactionCreate.customId === '652196854196854984'){
                if (!interactionCreate.member.id == message.author.id) return interactionCreate.deferUpdate()
                interactionCreate.reply({ embeds: [Mineinv], ephemeral: true})
                }
    })
        Butcollector.on('end', message => {
            button.setDisabled(true)
            const newrow = new MessageActionRow()
            .addComponents(button);
            msg.edit({embeds: [pages.firstPage], components: [newrow]}).catch(() => null)
        })
    
        if (pages.size === 1){
          return;
        };
    
        const prev = client.emojis.cache.get('890490643548352572') || '◀';
        const next = client.emojis.cache.get('890490558492061736') || '▶';
        const terminate = client.emojis.cache.get('888264104081522698') || '❌';
    
        const filter = (_, user) => user.id === message.author.id;
        const collector = msg.createReactionCollector(filter);
        const navigators = [ prev, next, terminate ];
        let timeout = setTimeout(()=> collector.stop(), 90000);
    
        for (let i = 0; i < navigators.length; i++) {
          await msg.react(navigators[i]);
        };
    
        collector.on('collect', async reaction => {
    
          switch(reaction.emoji.name){
            case prev instanceof GuildEmoji ? prev.name : prev:
              msg.edit(pages.previous());
            break;
            case next instanceof GuildEmoji ? next.name : next:
              msg.edit(pages.next());
            break;
            case terminate instanceof GuildEmoji ? terminate.name : terminate:
              collector.stop();
            break;
          };
    
          await reaction.users.remove(message.author.id);
          timeout.refresh();
        });
    
        collector.on('end', async () => await msg.reactions.removeAll());
}
}