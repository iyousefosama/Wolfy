const discord = require('discord.js');
const schema = require('../../schema/GuildSchema')

/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
    name: "smroletoggle",
    aliases: ["Smroletoggle", "SMROLETOGGLE", "Selectmenuroletoggle"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '',
    group: 'setup',
    description: 'To enable/disable Select menu roles!',
    cooldown: 5, //seconds(s)
    guarded: false, //or false
    permissions: ["ManageRoles", "Administrator"],
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

        data.Mod.smroles.isEnabled = !data.Mod.smroles.isEnabled;

        data.save()
        .then(() => {
          const state = ['Disabled', 'Enabled'][Number(data.Mod.smroles.isEnabled)];
          data.Mod.smroles.isEnabled = data.Mod.smroles.isEnabled;
    
          const embed = new discord.EmbedBuilder()
            .setColor('Green')
            .setDescription([
              '<a:Correct:812104211386728498>\u2000|\u2000',
              `Select menu roles Feature has been Successfully **${state}**!\n\n`,
              `To **${!data.Mod.smroles.isEnabled ? 're-enable' : 'disable'}** this`,
              `feature, use the \`${client.prefix}smroletoggle\` command.`
            ].join(' '))
            message.channel.send({ embeds: [embed] })
          }).catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`));
}
}