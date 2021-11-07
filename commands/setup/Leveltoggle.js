const Discord = require('discord.js');
const schema = require('../../schema/GuildSchema')
const { prefix } = require('../../config.json');

module.exports = {
    name: "leveltoggle",
    aliases: ["Leveltoggle", "LevelToggle", "LEVELTOGGLE", "leveltoggle"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '',
    group: 'setup',
    description: 'To enable/disable levelRoles cmd',
    cooldown: 30, //seconds(s)
    guarded: false, //or false
    permissions: ["MANAGE_MESSAGES", "ADMINISTRATOR"],
    clientpermissions: ["MANAGE_MESSAGES"],
    examples: [''],
    async execute(client, message, args) {
          
        let data;
        try{
            data = await schema.findOne({
                GuildID: message.guild.id
            })
            if(!data) {
                data = await schema.create({
                    GuildID: message.guild.id
                })
            }
        } catch(err) {
            console.log(err)
            message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`)
        }

        data.Mod.Level.isEnabled = !data.Mod.Level.isEnabled;

        data.save()
        .then(() => {
          const state = ['Disabled', 'Enabled'][Number(data.Mod.Level.isEnabled)];
          data.Mod.Level.isEnabled = data.Mod.Level.isEnabled;
    
          const embed = new Discord.MessageEmbed()
            .setColor('GREEN')
            .setDescription([
              '<a:Correct:812104211386728498>\u2000|\u2000',
              `Level Feature has been successfully **${state}**!\n\n`,
              `To **${!data.Mod.Level.isEnabled ? 're-enable' : 'disable'}** this`,
              `feature, use the \`${prefix}leveltoggle\` command.`
            ].join(' '))
            message.channel.send({ embeds: [embed] })
          }).catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`));
}
}