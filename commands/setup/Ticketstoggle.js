const discord= require('discord.js');
const schema = require('../../schema/GuildSchema')

module.exports = {
    name: "ticketstoggle",
    aliases: ["Ticketstoggle", "TicketsToggle", "TICKETSTOGGLE"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '',
    group: 'setup',
    description: 'To allow or disable ticket feature!',
    cooldown: 30, //seconds(s)
    guarded: false, //or false
    permissions: [discord.PermissionsBitField.Flags.ManageChannels, discord.PermissionsBitField.Flags.Administrator],
    examples: [''],
    async execute(client, message, args) {
          
        let data;
        try{
            data = await schema.findOne({
                GuildID: message.guild.id
            })
            if(!data.Mod.Tickets.channel || !data) {
                return message.channel.send(`\\❌ **${message.member.displayName}**, You didn't set tickets channel yet`);
            }
        } catch(err) {
            console.log(err)
            message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`)
        }

        data.Mod.Tickets.isEnabled = !data.Mod.Tickets.isEnabled;

        data.save()
        .then(() => {
          const state = ['Disabled', 'Enabled'][Number(data.Mod.Tickets.isEnabled)];
          data.Mod.Tickets.isEnabled = data.Mod.Tickets.isEnabled;
    
          const embed = new discord.EmbedBuilder()
            .setColor('Green')
            .setDescription([
              '<a:Correct:812104211386728498>\u2000|\u2000',
              `Tickets channel Feature has been Successfully **${state}**!\n\n`,
              `To **${!data.Mod.Tickets.isEnabled ? 're-enable' : 'disable'}** this`,
              `feature, use the \`${client.prefix}ticketstoggle\` command.`
            ].join(' '))
            message.channel.send({ embeds: [embed] })
          }).catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`));
}
}