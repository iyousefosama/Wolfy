const text = require('../../util/string');
const schema = require('../../schema/Economy-Schema')

module.exports = {
    name: "deposit",
    aliases: ["Deposit", "DEPOSIT"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '',
    group: 'Economy',
    description: 'Deposit credits from your wallet to safeguard',
    cooldown: 5, //seconds(s)
    guarded: false, //or false
    permissions: [],
    examples: [
      '500',
      'all'
    ],
    async execute(client, message, [amount='']) {

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

    if (!data || data.Bank.balance.credits === null || data.Bank.info.Enabled == false) {
      return message.channel.send(`\\❌ **${message.author.tag}**, You don't have a *bank* yet! To create one, type \`${client.prefix}register\`.`);
    } else {

      const amt = amount;
      const quest = data.progress.quests.find(x => x.id == 5);
      let Box = quest.current;

      if (amount?.toLowerCase() === 'all'){
        amount = Math.floor(data.credits / 1.05);
      } else {
        amount = Math.round(amount?.split(',').join(''));
      };

      if (!amount){
        return message.channel.send(`\\❌ **${message.author.tag}**, [ **${amt || 0}** ] is not a valid amount!.`);
      } else if (amount < 500){
        return message.channel.send(`\\❌ **${message.author.tag}**, The amount to be deposited must be at least **500**.`);
      } else if(data.Bank.balance.credits + amount > 100000) {
        data.Bank.balance.credits = Math.floor(100000);
        return data.save()
        .then(() => {
            message.channel.send(`\\❌ **${message.author.tag}**, Your bank is overflowed please withdraw some money from your bank.`);
        })
        .catch(err => message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: \`${err.name}\``))
      } else if (amount * 1.05 > data.credits){
        return message.channel.send([
          `\\❌ **${message.author.tag}**, You don't have enough credits in your wallet to proceed with this transaction.`,
          ` You only have **${text.commatize(data.credits)}** left, **${text.commatize(amount - data.credits + Math.ceil(amount * 0.05))}** less than the amount you want to deposit (Transaction fee of 5% included)`,
          `To deposit all credits instead, please type \`${client.prefix}deposit all\`.`
        ].join('\n'));
      };

      if(quest.current < quest.progress) {
        Box += Math.floor(amount);
        await schema.findOneAndUpdate({ userID: message.author.id, "progress.quests.id": 5 }, { $inc: { "progress.quests.$.current": Math.floor(amount) } });
      }
    if(Box && Box == quest.progress && !quest.received) {
        data.credits += Math.floor(quest.reward);
        await schema.findOneAndUpdate({ userID: message.author.id, "progress.quests.id": 5 }, { $set: { "progress.quests.$.received": true } });
        data.progress.completed++;
        await data.save();
        message.reply({ content: `\\✔️  You received: <a:ShinyMoney:877975108038324224> **${quest.reward}** from this command quest.`})
      }
      data.Bank.balance.credits = data.Bank.balance.credits + Math.floor(amount);
      data.credits = data.credits - Math.floor(amount * 1.05);

      return data.save()
      .then(() => message.channel.send(`<:moneytransfer:892745164324474900> **${message.author.tag}**, you successfully deposited **${text.commatize(Math.floor(amount / 1.05))}** credits to your bank! (+5% fee).`))
      .catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`));
    };
  }
};
