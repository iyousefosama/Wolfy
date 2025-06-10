const {
  PermissionsBitField,
} = require("discord.js");
const consoleUtil = require("../../util/console")
const { ErrorEmbed } = require("../../util/modules/embeds")
const getLocalCommands = require('../../util/helpers/getLocalCommands');
const localCommands = getLocalCommands("/slashCommands");
const { handleApplicationCommand } = require("../../Handler/CommandOptions");
const handleInteractionError = require('../../util/handlers/interactionErrorHandler');

const BEV = require("../../util/types/baseEvents");

/** @type {BEV.BaseEvent<"interactionCreate">} */
module.exports = {
  name: "interactionCreate",
  async execute(client, interaction) {
    if (!interaction.isCommand()) return;
    try {
      // Permissions: To check for default permissions in the guild
      if (interaction.guild) {
        const botPermissions = interaction.channel.permissionsFor(interaction.guild.members.me);
        
        if (!botPermissions.has(PermissionsBitField.Flags.SendMessages)) {
          return { executed: false, reason: "PERMISSION_SEND" };
        }
        
        if (!botPermissions.has(PermissionsBitField.Flags.ViewChannel)) {
          return { executed: false, reason: "PERMISSION_VIEW_CHANNEL" };
        }
      }
    } catch (err) {
      console.log(err);
    }

    /**
     * @type {import("../../../util/types/baseCommandSlash")}
     */
    const command = localCommands.find(
      (cmd) => cmd.data ? cmd.data.name === interaction.commandName : cmd.name === interaction.commandName
    );

    if (!command) {
      return interaction
        .reply({ embeds: [ErrorEmbed(client.language.getString("ERROR", interaction.guild?.id))], ephemeral: true })
        .catch((error) => handleInteractionError(error, interaction, client));
    } else if (interaction.user.bot) {
      return;
    }

    try {
      const continueCommand = await handleApplicationCommand(interaction, command, client);
      if (!continueCommand) return;
    } catch (error) {
      consoleUtil.error(error);
      await handleInteractionError(error, interaction, client);
      return;
    }

    try {
      await command.execute(client, interaction);
      client.LogCmd(interaction, true, `${new Date()} (/) ${interaction.user.username}|(${interaction.user.id}) in ${interaction.guild
        ? `${interaction.guild.name}(${interaction.guildId}) | #${interaction.channel.name}(${interaction.channel.id})`
        : "DMS"
        } used: /${interaction.commandName}`);
    } catch (error) {
      consoleUtil.error(error, "command-execute");
      await handleInteractionError(error, interaction, client);
      
      // Log the error command attempt
      client.LogCmd(interaction, true, `${new Date()} (/) ${interaction.user.username}|(${interaction.user.id}) in ${interaction.guild
        ? `${interaction.guild.name}(${interaction.guildId}) | #${interaction.channel.name}(${interaction.channel.id})`
        : "DMS"
        } failed: /${interaction.commandName} - ${error.message}`);
    }
  }
};
