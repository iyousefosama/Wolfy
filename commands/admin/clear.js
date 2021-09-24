const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const config = require('../../config.json')

module.exports = {
  name: 'clear',
  aliases: [ 'delete', 'Clear', 'CLEAR'],
  dmOnly: false, //or false
  guildOnly: true, //or false
  args: true, //or false
  usage: '<quantity>',
  group: 'Moderation',
  description: 'Clear/Delete message with quantity you want (from 2 to 100)',
  cooldown: 10, //seconds(s)
  guarded: false, //or false
  permissions: ['MANAGE_MESSAGES', 'ADMINISTRATOR'],
  clientPermissions: ['MANAGE_MESSAGES', 'EMBED_LINKS', 'USE_EXTERNAL_EMOJIS', 'ADMINISTRATOR', 'ATTACH_FILES'],
  examples: [
    '20'],
    async execute(client, message, [quantity]) {

    quantity = Math.round(quantity);

    if (!quantity || quantity < 2 || quantity > 100){
      return message.reply({ content: `<a:Wrong:812104211361693696> | ${message.author}, Please provide the quantity of messages to be deleted which must be greater than two (2) and less than one hundred (100)`});
    };

    return message.channel.bulkDelete(quantity, true)
    .then(async messages => {

      const count = messages.size;
      const _id = Math.random().toString(36).slice(-7);
      const debug = await client.channels.cache.get(config.debug)
      const debug2 = await client.channels.cache.get(config.debug2)

      messages = messages.filter(Boolean).map(message => {
        return [
          `[${moment(message.createdAt).format('dddd, do MMMM YYYY hh:mm:ss')}]`,
          `${message.author.tag} : ${message.content}\r\n\r\n`
        ].join(' ');
      });

      messages.push(`Messages Cleared on ![](${message.guild.iconURL({size: 32})}) **${message.guild.name}** - **#${message.channel.name}** --\r\n\r\n`);
      messages = messages.reverse().join('');

      const res = debug ? await debug.send({
        content: `\`\`\`BULKDELETE FILE - ServerID: ${message.guild.id} ChannelID: ${message.channel.id} AuthorID: ${message.author.id}\`\`\``,
        files: [{ attachment: Buffer.from(messages), name: `bulkdlt-${_id}.txt`}]
      }).then(message => [message.attachments.first().url, message.attachments.first().id])
      .catch(() => ['', null]) : ['', null];
      const res2 = debug2 ? await debug2.send({
        content: `\`\`\`BULKDELETE FILE - ServerID: ${message.guild.id} ChannelID: ${message.channel.id} AuthorID: ${message.author.id}\`\`\``,
        files: [{ attachment: Buffer.from(messages), name: `bulkdlt-${_id}.txt`}]
      }).then(message => [message.attachments.first().url, message.attachments.first().id])
      .catch(() => ['', null]) : ['', null];

      const url = (res[0].match(/\d{17,19}/)||[])[0];
      const id = res[1];

        await message.channel.send({ content: `\`\`\`diff\n- ${message.author.tag}, Successfully deleted ${count} messages from this channel!\`\`\``}).then(msg => {
          setTimeout(() => {
              msg.delete().catch(() => null)
           }, 5000)
          })
    });
  }
}
