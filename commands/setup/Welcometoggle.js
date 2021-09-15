const Discord = require('discord.js');
const schema = require('../../schema/GuildSchema')
const { prefix } = require('../../config.json');

module.exports = {
    name: "welcometoggle",
    aliases: ["Welcometoggle", "WelcomeToggle", "WELCOMETOGGLE", "welctoggle"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '',
    cooldown: 5, //seconds(s)
    guarded: false, //or false
    permissions: ["MANAGE_CHANNELS", "ADMINISTRATOR"],
    clientpermissions: ["MANAGE_CHANNELS", "ADMINISTRATOR"],
    async execute(client, message, args) {
          
        let data;
        try{
            data = await schema.findOne({
                GuildID: message.guild.id
            })
            if(!data.greeter.welcome.channel) {
                return message.channel.send(`\\❌ **${message.member.displayName}**, You didn't set welcome channel yet`);
            }
        } catch(err) {
            console.log(err)
            message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`)
        }

        data.greeter.welcome.isEnabled = !data.greeter.welcome.isEnabled;

        data.save()
        .then(() => {
          const state = ['Disabled', 'Enabled'][Number(data.greeter.welcome.isEnabled)];
          data.greeter.welcome.isEnabled = data.greeter.welcome.isEnabled;
    
          const embed = new Discord.MessageEmbed()
            .setColor('GREEN')
            .setDescription([
              '<a:Correct:812104211386728498>\u2000|\u2000',
              `Welcomer Feature has been successfully **${state}**!\n\n`,
              `To **${!data.greeter.welcome.isEnabled ? 're-enable' : 'disable'}** this`,
              `feature, use the \`${prefix}welcometoggle\` command.`
            ].join(' '))
            message.channel.send({ embeds: [embed] })
          }).catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`));
}
}