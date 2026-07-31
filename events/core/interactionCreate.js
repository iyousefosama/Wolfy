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
      console.log(`[WARNING] Unknown command executed: /${interaction.commandName}`);
      return interaction
        .reply({ embeds: [ErrorEmbed("💢 An error has occurred, please try again later.")], flags: ['Ephemeral'] })
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

      // Build extra info for console log (subcommand + options)
      const extra = [];
      if (interaction.options) {
        const sub = interaction.options.getSubcommand(false);
        const group = interaction.options.getSubcommandGroup(false);
        if (sub) extra.push(group ? `[${group} ${sub}]` : `[${sub}]`);

        const opts = interaction.options._hoistedOptions || [];
        if (opts.length > 0) {
          const parts = opts.map(o => `${o.name}=${String(o.value).length > 60 ? String(o.value).slice(0, 60) + '…' : o.value}`);
          extra.push(`{${parts.join(', ')}}`);
        }
      }
      const extraStr = extra.length > 0 ? ' ' + extra.join(' ') : '';

      client.LogCmd(interaction, true, `${new Date()} (/) ${interaction.user.username}|(${interaction.user.id}) in ${interaction.guild
        ? `${interaction.guild.name}(${interaction.guildId}) | #${interaction.channel.name}(${interaction.channel.id})`
        : "DMS"
        } used: /${interaction.commandName}${extraStr}`);
    } catch (error) {
      consoleUtil.error(error, "command-execute");
      await handleInteractionError(error, interaction, client);

      // Build extra info for console log (subcommand + options)
      const extra = [];
      if (interaction.options) {
        const sub = interaction.options.getSubcommand(false);
        const group = interaction.options.getSubcommandGroup(false);
        if (sub) extra.push(group ? `[${group} ${sub}]` : `[${sub}]`);

        const opts = interaction.options._hoistedOptions || [];
        if (opts.length > 0) {
          const parts = opts.map(o => `${o.name}=${String(o.value).length > 60 ? String(o.value).slice(0, 60) + '…' : o.value}`);
          extra.push(`{${parts.join(', ')}}`);
        }
      }
      const extraStr = extra.length > 0 ? ' ' + extra.join(' ') : '';

      // Log the error command attempt
      client.LogCmd(interaction, true, `${new Date()} (/) ${interaction.user.username}|(${interaction.user.id}) in ${interaction.guild
        ? `${interaction.guild.name}(${interaction.guildId}) | #${interaction.channel.name}(${interaction.channel.id})`
        : "DMS"
        } failed: /${interaction.commandName}${extraStr} - ${error.message}`);
    }
  }
};
