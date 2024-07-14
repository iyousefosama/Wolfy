const discord = require('discord.js');
const _ = require('lodash');
const { EmbedBuilder, GuildEmoji } = require('discord.js');
const Pages = require('../../util/Paginate');
const market = require('../../assets/json/market.json');
const text = require('../../util/string');
const schema = require('../../schema/Economy-Schema')

/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
    name: "market",
    aliases: ["shop"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '',
    group: 'Economy',
    description: 'Open the economy market!',
    cooldown: 15, //seconds(s)
    guarded: false, //or false
    requiresDatabase: true,
    permissions: [],
    clientPermissions: ["UseExternalEmojis", "AddReactions", "EmbedLinks"],
    examples: [''], 
    
    async execute(client, message, [type]) {

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

        let selected = market.filter(x => x.type === type?.toLowerCase());

        if (!selected.length){
          selected = market;
        };
    
        const quest = data.progress.quests?.find(x => x.id == 6);
        let Box = quest?.current;

        const pages = new Pages(_.chunk(selected, 24).map((chunk, i, o) => {
          return new EmbedBuilder()
          .setTitle('Wolfy\'s Market')
          .setColor('Grey')
          .setURL('https://wolfy.yoyojoe.repl.co/')
          .setFooter({ text: `Wolfy\'s Market | \©️${new Date().getFullYear()} Wolfy\u2000\u2000•\u2000\u2000Page ${i+1} of ${o.length}` })
          .addFields(...chunk.map(item => {
            return {
              inline: true,
              name: `\`[${item.id}]\` ${item.name}`,
              value: [
                item.description,
                `Type: *${item.type}*`,
                `Price: *${text.commatize(item.price)}*`,
                item.type != "Item" ? `Check Preview : \`${client.prefix}previewitem ${item.id}\`` : '',
                `Purchase: \`${client.prefix}buy ${item.id}\``
              ].join('\n')
            };
          }));
        }));
    
        const msg = await message.channel.send({ embeds: [pages.firstPage] });
    
        if(quest?.current < quest?.progress) {
          Box++;
          await schema.findOneAndUpdate({ userID: message.author.id, "progress.quests.id": 6 }, { $inc: { "progress.quests.$.current": 1 } });
        }
      if(Box && Box == quest?.progress && !quest?.received) {
          data.credits += Math.floor(quest.reward);
          await schema.findOneAndUpdate({ userID: message.author.id, "progress.quests.id": 6 }, { $set: { "progress.quests.$.received": true } });
          data.progress.completed++;
          await data.save();
          message.reply({ content: `\\✔️  You received: <a:ShinyMoney:877975108038324224> **${quest.reward}** from this command quest.`})
        }

        if (pages.size === 1){
          return;
        };
    
        const prev = client.emojis.cache.get('890490643548352572') || '◀';
        const next = client.emojis.cache.get('890490558492061736') || '▶';
        const terminate = client.emojis.cache.get('888264104081522698') || '❌';
    
        const filter = (_, user) => user.id === message.author.id;
        const collector = msg.createReactionCollector({ filter });
        const navigators = [ prev, next, terminate ];
        let timeout = setTimeout(()=> collector.stop(), 90000);
    
        for (let i = 0; i < navigators.length; i++) {
          await new Promise(r=>setTimeout(r,1500))
          await msg.react(navigators[i])
        };
    
        collector.on('collect', async reaction => {
    
          switch(reaction.emoji.name){
            case prev instanceof GuildEmoji ? prev.name : prev:
              msg.edit({ embeds: [pages.previous()] });
            break;
            case next instanceof GuildEmoji ? next.name : next:
              msg.edit({ embeds: [pages.next()] });
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