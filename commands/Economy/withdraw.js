const text = require('../../util/string');
const schema = require('../../schema/Economy-Schema')
const { prefix } = require('../../config.json');

module.exports = {
    name: "withdraw",
    aliases: ["Withdraw", "WITHDRAW"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '<amount>',
    group: 'Economy',
    description: 'Withdraw credits from your bank to your wallet',
    cooldown: 5, //seconds(s)
    guarded: false, //or false
    permissions: [],
    examples: [
      '900',
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

    if (!data || data.Bank.balance.credits === null || data.Bank.info.Enabled == false){
      return message.channel.send(`\\❌ **${message.author.tag}**, You don't have a *bank* yet! To create one, type \`${prefix}register\`.`);
    } else {

      const amt = amount;
      if (amount.toLowerCase() === 'all'){
        amount = Math.round(data.Bank.balance.credits );
      } else {
        amount = Math.round(amount.split(',').join('')) / 0.95;
      };

      if (!amount){
        return message.channel.send(`\\❌ **${message.author.tag}**, [ **${amt}** ] is not a valid amount!.`);
      } else if (amount < 100){
        return message.channel.send(`\\❌ **${message.author.tag}**, The amount to be withdrawn must be at least **100**.`);
      } else if (amount > data.Bank.balance.credits){
        return message.channel.send([
          `\\❌ **${message.author.tag}**, You don't have enough credits in your bank to proceed with this transaction.`,
          ` You only have **${text.commatize(data.Bank.balance.credits)}** left, **${text.commatize(amount - data.Bank.balance.credits + Math.ceil(amount * 0.05))}** less than the amount you want to withdraw (Transaction fee of 5% included)`,
          `To withdraw all credits instead, please type \`${prefix}withdraw all\`.`
        ].join('\n'));
      } else if (amount + data.Bank.balance.credits > 50000){
        return message.channel.send(`\\❌ **${message.author.tag}**, You can't withdraw this large sum of money (Overflow imminent)!`)
      };

      data.Bank.balance.credits = Math.round(data.Bank.balance.credits - amount);
      data.credits = data.credits + Math.round(amount * 0.95);

      return data.save()
      .then(() => message.channel.send(`\\✔️ **${message.author.tag}**, you successfully withdrawn **${text.commatize(amount * 0.95)}** credits from your bank! (+5% fee).`))
      .catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`));
    }
  }
};
