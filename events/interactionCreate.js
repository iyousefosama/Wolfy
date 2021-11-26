const Discord = require('discord.js')

module.exports = {
    name: 'interactionCreate',
    async execute(client, interaction) {
        if (!interaction.isCommand()) return;

        const slash = client.slashCommands.get(interaction.commandName);
    
        if(interaction.user.bot) return;
        if (!slash) return;
    
        try {
            if (slash.guildOnly && interaction.channel.type === 'DM') {
                return interaction.reply({ content: '<a:pp802:768864899543466006> I can\'t execute that command inside DMs!', ephemeral: true });
            }
      //+ permissions: [""],
      if (slash.permissions) {
        if (interaction.guild) {
            const sauthorPerms = interaction.channel.permissionsFor(interaction.user);
            if (!sauthorPerms || !sauthorPerms.has(slash.permissions)) {
    
               return interaction.reply({ content: `<a:pp802:768864899543466006> You don\'t have \`${slash.permissions}\` permission(s) to use ${interaction.commandName} command.`, ephemeral: true });
            }
           }
        }
    //+ clientpermissions: [""],
    if (slash.clientpermissions) {
       if (interaction.guild) {
       const sclientPerms = interaction.channel.permissionsFor(interaction.guild.me);
       if (!sclientPerms || !sclientPerms.has(slash.clientpermissions)) {
           return interaction.reply({ content: `<a:pp802:768864899543466006> The bot is missing \`${slash.clientpermissions}\` permission(s)!`, ephemeral: true });
       }
      }
    }  
    
    if (interaction.guild){
        if (!interaction.channel.permissionsFor(interaction.guild.me).has('SEND_MESSAGES')){
          return { executed: false, reason: 'PERMISSION_SEND'};
        } else {
          // Do nothing..
        };
      };
      if (interaction.guild){
        if (!interaction.channel.permissionsFor(interaction.guild.me).has('VIEW_CHANNEL')){
          return;
        } else {
          // Do nothing..
        };
      };
      if (interaction.guild){
        if (!interaction.channel.permissionsFor(interaction.guild.me).has('READ_MESSAGE_HISTORY')){
          return interaction.reply({ content: '"Missing Access", the bot is missing the \`READ_MESSAGE_HISTORY\` permission please enable it!'})
        } else {
          // Do nothing..
        };
      };
            console.log(`(/) ${interaction.user.tag}|(${interaction.user.id}) in #${interaction.channel.name}|(${interaction.channel.id}) used: /${interaction.commandName}`)
            await slash.execute(client, interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
}