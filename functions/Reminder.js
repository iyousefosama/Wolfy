const Discord = require('discord.js')
const { Client } = require('discord.js')
const schema = require('../schema/TimeOut-Schema')

/**
 * @param {Client} client
 */

module.exports = async (client) => {
    await new Promise(r=>setTimeout(r,10000))
    const checkReminders = async () => {
        if(!client.database.connected) return;
        let data;
        try{
          data = await schema.find({})
      } catch(err) {
          console.log(err)
          console.log(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`)
      }
          let members = []
      
          for (let obj of data) {
              if(client.users.cache
              .map((user) => user.id)
              .includes(obj.userId)) members.push(obj)
          }
      
          members = members.sort(function (b, a) {
              return a.Reminder.time - b.Reminder.time
          })
      
          members = members.filter(function BigEnough(value) {
              return value.Reminder.time > 0 || value.Reminder.time > Date.now();
          })
      
          members.forEach(async (member) => {
            const user = client.users.cache.get(member.userId)
            member.Reminder.current = false;
            member.Reminder.time = 0;
            await member.save().then(async () => {
              const reminderEmbed = new Discord.MessageEmbed()
              .setAuthor({ name: 'Reminder Alert!', iconURL: user.displayAvatarURL() })
              .setColor('DARK_GREEN')
              .addField('❯ Remind Reason', `${member.Reminder.reason}`)
              .setTimestamp()
              .setFooter({ text: 'Successfully Reminded!', iconURL: client.user.displayAvatarURL() })
          try {
              await user.send({ embeds: [reminderEmbed] })
          } catch (error) {
              return //message.channel.send({ content: `> **Here is your reminder! • [** <@${message.author.id}> **]**`, embeds: [reminderEmbed]});
          }
            })
          });
        setTimeout(checkReminders, 30000)
      }
      checkReminders()
};