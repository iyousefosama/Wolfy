const discord = require('discord.js');
const config = require('../../config.json')

module.exports = {
  name: "addrole",
  aliases: ["Addrole", "ADDROLE", "addroles", "Addroles", "ADDROLES", "AddRole"],
  dmOnly: false, //or false
  guildOnly: true, //or false
  args: true, //or false
  usage: '<user> <reason>',
  group: 'Moderation',
  description: 'Adds the mentioned roles and/or role IDs to the mentioned user',
  cooldown: 3, //seconds(s)
  guarded: false, //or false
  permissions: ["MANAGE_ROLES", "ADMINISTRATOR"],
  clientpermissions: ["MANAGE_ROLES", "ADMINISTRATOR"],
  examples: [
    'addroles @user @role1 @role2 @role3',
    'addrole @user @role'
  ],
  async execute(client, message, [member = '', ...rawRoles]) {
      
    if (!member.match(/\d{17,19}/)){
        return message.channel.send(`<a:Wrong:812104211361693696> | ${message.author},  Please mention or provide the ID of the user to addroles.`);
      };
  
      member = await message.guild.members
      .fetch(member.match(/\d{17,19}/)[0])
      .catch(() => null);
  
      if (!member){
        return message.channel.send(`<a:Wrong:812104211361693696> | ${message.author}, Couldn't find this member in server`)
      };
  
      if (!rawRoles.length){
        return message.channel.send(`<a:Wrong:812104211361693696> | ${message.author}, Please type the ID or mention the roles you want to add to this member`);
      };
  
      const roles = [...new Set([...rawRoles
      .filter(r => r.match(/\d{17,19}/))
      .filter(r => message.guild.roles.cache.has(r.match(/\d{17,19}/)))
      .filter(r => !message.member.roles.cache.has(r.match(/\d{17,19}/)))
      .map(r => r.match(/\d{17,19}/)[0])])];
  
      if (!roles.length){
        return message.channel.send(`<a:Wrong:812104211361693696> | ${message.author}, either **${member.user.tag}** already had those roles, or role IDs were valid.`);
      };

      const Dnadded = new discord.MessageEmbed()
      .setDescription(`<a:pp399:768864799625838604> Succesfully added **${roles.length}** roles to **${_member.user.tag}**!`)
  
      return member.roles.add(roles)
      .then(_member => message.channel.send({ embeds: [Dnadded]}))
      .catch(() => message.channel.send(`Failed to add the roles to **${member.user.tag}**!`));
    }
}