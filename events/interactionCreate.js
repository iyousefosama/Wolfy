const {
  EmbedBuilder,
  PermissionsBitField,
  ChannelType,
} = require("discord.js");
const consoleUtil = require("../util/console")
const { parsePermissions } = require("../util/class/utils");
const { ErrorEmbed, InfoEmbed, SuccessEmbed } = require("../util/modules/embeds")
const getLocalCommands = require('../util/helpers/getLocalCommands');

const BEV = require("../util/types/baseEvents");

/** @type {BEV.BaseEvent<"interactionCreate">} */
module.exports = {
  name: "interactionCreate",
  async execute(client, interaction) {
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
        /*         if (
          !interaction.channel
            .permissionsFor(interaction.guild.members.me)
            .has(PermissionsBitField.Flags.ReadMessageHistory)
        ) {
          return interaction.reply({
            content:
              '"Missing Access", the bot is missing the `READ_MESSAGE_HISTORY` permission please enable it!',
          });
        } else {
          // Do nothing..
        } */
      }
    } catch (err) {
      console.log(err);
    }
    // Check if interaction is a button, select menu or modal submit
    if (
      interaction.isButton() ||
      interaction.isModalSubmit() ||
      interaction.isAnySelectMenu()
    ) {
      if (interaction?.customId?.startsWith("collect")) return;

      let customId = interaction?.customId;

      const parts = customId?.split("_");

      // Check if interaction is a button
      const component =
        client.ComponentsAction.get(`${parts[0]}_${parts[1]}`) ||
        client.ComponentsAction.get(`${parts[0]}_${parts[1]}_${parts[2]}`) ||
        client.ComponentsAction.get(parts[0]) ||
        client.ComponentsAction.get(customId);

      if (!component) return;

      await component.action(client, interaction, parts);
    }
    if (interaction.isChatInputCommand()) {
      const localCommands = getLocalCommands("/slashCommands");

      /**
       * @type {import("../util/types/baseCommandSlash")}
       */
      const command = localCommands.find(
        (cmd) => cmd.data.name === interaction.commandName
      );
      /*       const command = client.slashCommands.get(interaction.commandName); */

      if (!command) {
        return interaction
          .reply({ embeds: [ErrorEmbed(`💢 An error has occurred, please try again later.`)], ephemeral: true })
          .catch(() => { });
      } else if (interaction.user.bot) {
        return;
      } else {
        // Do nothing..
      }

      try {

        if (command.data.guildOnly && interaction.channel.type === ChannelType.DM) {
          return interaction.reply({ embeds: [ErrorEmbed("I can't execute that command **inside DMs**!")], ephemeral: true });
        }


        if (command.data.ownerOnly && !client.owners.includes(interaction.user.id)) {
          return interaction.reply({ embeds: [ErrorEmbed("This command can only be used by **developers**!")], ephemeral: true });
        }


        //+ permissions: [""],
        if (command.data.permissions && command.data.permissions.length > 0) {
          if (interaction.guild) {
            if (!interaction.member.permissions.has(command.data.permissions)) {
              return interaction.reply({ embeds: [ErrorEmbed(`You don\'t have ${parsePermissions(command.data.permissions)} to use **${command.data.name}** command.`)], ephemeral: true });
            }
          }
        }

        //+ clientPermissions: [""],
        if (command.data.clientPermissions && command.data.clientPermissions.length > 0) {
          if (interaction.guild) {
            const clientPerms = interaction.channel.permissionsFor(
              interaction.guild.members.me
            );
            if (!clientPerms || !clientPerms.has(command.data.clientPermissions)) {
              return interaction.reply({ embeds: [ErrorEmbed(`The client is missing \`${parsePermissions(client.clientPermissions)}\` permission(s)!`)], ephemeral: true });
            }
          }
        }
        try {
          //await interaction.deferReply().catch(() => {});
          command.execute(client, interaction).then(() => {
            client.Log(client, interaction, true, `${new Date()} (/) ${interaction.user.username}|(${interaction.user.id}) in ${interaction.guild
              ? `${interaction.guild.name}(${interaction.guild.id}) | #${interaction.channel.name}(${interaction.channel.id})`
              : "DMS"
              } used: /${interaction.commandName}`)
          });
        } catch (error) {
          consoleUtil.error(error, "command-execute");

          interaction.isRepliable
            ? await interaction.reply({
              content: "There was an error while executing this command!",
              ephemeral: true,
            })
            : interaction.editReply({
              content: "There was an error while executing this command!",
            });
        }
      } catch (error) {
        consoleUtil.error(error);
        interaction.isRepliable
          ? await interaction.reply({
            content: "There was an error while executing this command!",
            ephemeral: true,
          })
          : interaction.editReply({
            content: "There was an error while executing this command!",
          });
      }
    }
  },
};
