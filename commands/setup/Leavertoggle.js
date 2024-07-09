const discord = require('discord.js');
const schema = require('../../schema/GuildSchema')

/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
    name: "leavertoggle",
    aliases: ["Leavertoggle", "LeaverToggle", "LEAVERTOGGLE", "leavetoggle"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '',
    group: 'setup',
    description: 'To allow or disable leaver channel!',
    cooldown: 30, //seconds(s)
    guarded: false, //or false
    permissions: ["ManageChannels", "Administrator"],
    examples: [''],

  async execute(client, message, args) {
          
        let data;
        try{
            data = await schema.findOne({
                GuildID: message.guild.id
            })
            if(!data.greeter.leaving.channel) {
                return message.channel.send(`\\❌ **${message.member.displayName}**, You didn't set leaver channel yet`);
            }
        } catch(err) {
            console.log(err)
            message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`)
        }

        data.greeter.leaving.isEnabled = !data.greeter.leaving.isEnabled;

        data.save()
        .then(() => {
          const state = ['Disabled', 'Enabled'][Number(data.greeter.leaving.isEnabled)];
          data.greeter.leaving.isEnabled = data.greeter.leaving.isEnabled;
    
          const embed = new discord.EmbedBuilder()
            .setColor('Green')
            .setDescription([
              '<a:Correct:812104211386728498>\u2000|\u2000',
              `leaver Feature has been Successfully **${state}**!\n\n`,
              `To **${!data.greeter.leaving.isEnabled ? 're-enable' : 'disable'}** this`,
              `feature, use the \`${client.prefix}leavertoggle\` command.`
            ].join(' '))
            message.channel.send({ embeds: [embed] })
          }).catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`));
}
}