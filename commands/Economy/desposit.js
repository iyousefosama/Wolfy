const text = require('../../util/string');
const schema = require('../../schema/Economy-Schema')
const { prefix } = require('../../config.json');
module.exports = {
    name: "deposit",
    aliases: ["Deposit", "DEPOSIT"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '',
    group: 'Economy',
    description: 'Deposit credits from your wallet to safeguard',
    cooldown: 2, //seconds(s)
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
      return message.channel.send(`\\❌ **${message.author.tag}**, You don't have a *bank* yet! To create one, type \`${prefix}register\`.`);
    } else {

      const amt = amount;

      if (amount?.toLowerCase() === 'all'){
        amount = Math.floor(data.credits * 0.95);
      } else {
        amount = Math.round(amount?.split(',').join(''));
      };

      if (!amount){
        return message.channel.send(`\\❌ **${message.author.tag}**, [ **${amt || 0}** ] is not a valid amount!.`);
      } else if (amount < 100){
        return message.channel.send(`\\❌ **${message.author.tag}**, The amount to be deposited must be at least **100**.`);
      } else if (amount * 1.05 > data.credits){
        return message.channel.send([
          `\\❌ **${message.author.tag}**, You don't have enough credits in your wallet to proceed with this transaction.`,
          ` You only have **${text.commatize(data.credits)}** left, **${text.commatize(amount - data.credits + Math.ceil(amount * 0.05))}** less than the amount you want to deposit (Transaction fee of 5% included)`,
          `To deposit all credits instead, please type \`${prefix}deposit all\`.`
        ].join('\n'));
      };

      data.Bank.balance.credits = data.Bank.balance.credits + amount;
      data.credits = data.credits - Math.floor(amount * 1.05);

      return data.save()
      .then(() => message.channel.send(`\\✔️ **${message.author.tag}**, you successfully deposited **${text.commatize(amount)}** credits to your bank! (+5% fee).`))
      .catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`));
    };
  }
};
