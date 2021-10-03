const discord = require('discord.js');
const _ = require('lodash');
const { MessageEmbed, GuildEmoji } = require('discord.js');
const Pages = require('../../util/Paginate');
const market = require('../../assets/json/market.json');
const text = require('../../util/string');
const { prefix } = require('../../config.json');

module.exports = {
    name: "test",
    aliases: ["Test"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '',
    group: 'test',
    description: 'Developer test tool!',
    cooldown: 2, //seconds(s)
    guarded: false, //or false
    permissions: [],
    examples: [], 
    async execute(client, message, [type]) {
        let selected = market.filter(x => x.type === type?.toLowerCase());

        if (!selected.length){
          selected = market;
        };
    
        const pages = new Pages(_.chunk(selected, 24).map((chunk, i, o) => {
          return new MessageEmbed()
          .setTitle('Wolfy\'s Market')
          .setColor('#ffd167')
          .setURL('https://wolfy.yoyojoe.repl.co/')
          .setFooter(`Wolfy\'s Market | \©️${new Date().getFullYear()} Wolfy\u2000\u2000•\u2000\u2000Page ${i+1} of ${o.length}`)
          .addFields(...chunk.map(item => {
            return {
              inline: true,
              name: `\`[${item.id}]\` ${item.name}`,
              value: [
                item.description,
                `Type: *${item.type}*`,
                `Price: *${text.commatize(item.price)}*`,
                `Check Preview : \`${prefix}previewitem ${item.id}\``,
                `Purchase: \`${prefix}buy ${item.id}\``
              ].join('\n')
            };
          }));
        }));
    
        const msg = await message.channel.send({ embeds: [pages.firstPage] });
    
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