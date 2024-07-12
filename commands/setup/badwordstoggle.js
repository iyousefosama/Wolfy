const discord = require('discord.js');
const schema = require('../../schema/GuildSchema')

/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
    name: "badwordstoggle",
    aliases: ["BadWordsToggle", "Badwordstoggle", "BADWORDSTOGGLE"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '',
    group: 'setup',
    description: 'To enable/disable badwords filter!',
    cooldown: 5, //seconds(s)
    guarded: false, //or false
    permissions: ["ManageMessages", "Administrator"],
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

        data.Mod.BadWordsFilter.isEnabled = !data.Mod.BadWordsFilter.isEnabled;

        data.save()
        .then(() => {
          const state = ['Disabled', 'Enabled'][Number(data.Mod.BadWordsFilter.isEnabled)];
          data.Mod.BadWordsFilter.isEnabled = data.Mod.BadWordsFilter.isEnabled;
    
          const embed = new discord.EmbedBuilder()
            .setColor('Green')
            .setDescription([
              '<a:Correct:812104211386728498>\u2000|\u2000',
              `Badwords filter Feature has been Successfully **${state}**!\n\n`,
              `To **${!data.Mod.BadWordsFilter.isEnabled ? 're-enable' : 'disable'}** this`,
              `feature, use the \`${client.prefix}badwordstoggle\` command.`
            ].join(' '))
            message.channel.send({ embeds: [embed] })
          }).catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`));
}
}