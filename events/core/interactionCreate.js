const {
  PermissionsBitField,
} = require("discord.js");
const consoleUtil = require("../../util/console")
const { ErrorEmbed } = require("../../util/modules/embeds")
const getLocalCommands = require('../../util/helpers/getLocalCommands');
const localCommands = getLocalCommands("/slashCommands");
const { handleApplicationCommand } = require("../../Handler/CommandOptions");

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

    /*       const command = client.slashCommands.get(interaction.commandName); */

    if (!command) {
      return interaction
        .reply({ embeds: [ErrorEmbed(client.language.getString("ERROR", interaction.guild?.id))], ephemeral: true })
        .catch(() => { });
    } else if (interaction.user.bot) {
      return;
    } else {
      // Do nothing..
    }

    try {
      const continueCommand = await handleApplicationCommand(interaction, command, client);
      if (!continueCommand) return;
    } catch (error) {
      consoleUtil.error(error);
      
      // Handle permission errors specifically
      if (error.code === 50013) {
        const missingPerms = error.missingPermissions || [];
        const permNames = missingPerms.map(perm => perm.toLowerCase().replace(/_/g, ' '));
        
        return interaction.reply({
          embeds: [ErrorEmbed(client.language.getString("BOT_PERMS_REQ", interaction.guild?.id, { 
            permissions: permNames.join(', ')
          }))],
          ephemeral: true
        });
      }
      
      interaction.isRepliable
        ? await interaction.reply({
          content: client.language.getString("ERROR_EXEC", interaction.guild?.id),
          ephemeral: true,
        })
        : interaction.editReply({
          content: client.language.getString("ERROR_EXEC", interaction.guild?.id),
        });
    }
    try {
      //await interaction.deferReply().catch(() => {});
      await command.execute(client, interaction);
      client.LogCmd(interaction, true, `${new Date()} (/) ${interaction.user.username}|(${interaction.user.id}) in ${interaction.guild
        ? `${interaction.guild.name}(${interaction.guildId}) | #${interaction.channel.name}(${interaction.channel.id})`
        : "DMS"
        } used: /${interaction.commandName}`);
    } catch (error) {
      consoleUtil.error(error, "command-execute");
      
      // Handle permission errors specifically
      if (error.code === 50013) {
        const missingPerms = error.missingPermissions || [];
        const permNames = missingPerms.map(perm => perm.toLowerCase().replace(/_/g, ' '));
        
        return interaction.reply({
          embeds: [ErrorEmbed(client.language.getString("BOT_PERMS_REQ", interaction.guild?.id, { 
            permissions: permNames.join(', ')
          }))],
          ephemeral: true
        });
      }
      
      interaction.isRepliable
        ? await interaction.reply({
          content: client.language.getString("ERROR_EXEC", interaction.guild?.id),
          ephemeral: true,
        })
        : interaction.editReply({
          content: client.language.getString("ERROR_EXEC", interaction.guild?.id),
        });
        
      // Log the error command attempt
      client.LogCmd(interaction, true, `${new Date()} (/) ${interaction.user.username}|(${interaction.user.id}) in ${interaction.guild
        ? `${interaction.guild.name}(${interaction.guildId}) | #${interaction.channel.name}(${interaction.channel.id})`
        : "DMS"
        } failed: /${interaction.commandName} - ${error.message}`);
    }
  },
};
