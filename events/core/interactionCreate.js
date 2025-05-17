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
        if (
          !interaction.channel
            .permissionsFor(interaction.guild.members.me)
            .has(PermissionsBitField.Flags.SendMessages)
        ) {
          return { executed: false, reason: "PERMISSION_SEND" };
        } else {
          // Do nothing..
        }
        if (
          !interaction.channel
            .permissionsFor(interaction.guild.members.me)
            .has(PermissionsBitField.Flags.ViewChannel)
        ) {
          return { executed: false, reason: "PERMISSION_VIEW_CHANNEL" };
        } else {
          // Do nothing..
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
      command.execute(client, interaction).then(() => {
        client.LogCmd(interaction, true, `${new Date()} (/) ${interaction.user.username}|(${interaction.user.id}) in ${interaction.guild
          ? `${interaction.guild.name}(${interaction.guildId}) | #${interaction.channel.name}(${interaction.channel.id})`
          : "DMS"
          } used: /${interaction.commandName}`)
      });
    } catch (error) {
      consoleUtil.error(error, "command-execute");

      interaction.isRepliable
        ? await interaction.reply({
          content: client.language.getString("ERROR_EXEC", interaction.guild?.id),
          ephemeral: true,
        })
        : interaction.editReply({
          content: client.language.getString("ERROR_EXEC", interaction.guild?.id),
        });
    }
  },
};
