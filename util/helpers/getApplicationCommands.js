/**
 * 
 * @param {import("../../struct/Client")} client 
 * @param {import("discord.js").Snowflake|null} guildId 
 * @returns {import('discord.js').ApplicationCommand}
 */
module.exports = async (client, guildId) => {
    let applicationCommands;
  
    if (guildId && typeof guildId == "string") {
      const guild = await client.guilds.fetch(guildId);
      applicationCommands = guild.commands;
      client.application.commands.set([]);
    } else {
      applicationCommands = await client.application.commands;
    }
  
    await applicationCommands.fetch();
    return applicationCommands;
  };