const discord = require("discord.js");
const {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  EmbedBuilder,
  Collection,
  PermissionsBitField,
  ChannelType,
} = require("discord.js");
const sourcebin = require("sourcebin_js");
const schema = require("../schema/GuildSchema");
const TicketSchema = require("../schema/Ticket-Schema");
const cooldowns = new Collection();
const CoolDownCurrent = {};
const text = require("../util/string");
const Ticket = require("../functions/ButtonHandle/Ticket");
const TicketControlls = require("../functions/ButtonHandle/TicketControlls");
const smRole = require("../functions/SelectMenuHandle/selectMenuRoles");

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
        if (
          !interaction.channel
            .permissionsFor(interaction.guild.members.me)
            .has(PermissionsBitField.Flags.ReadMessageHistory)
        ) {
          return interaction.channel.send({
            content:
              '"Missing Access", the bot is missing the `READ_MESSAGE_HISTORY` permission please enable it!',
          });
        } else {
          // Do nothing..
        }
        if (
          !interaction.channel
            .permissionsFor(interaction.guild.members.me)
            .has(PermissionsBitField.Flags.EmbedLinks)
        ) {
          return interaction.channel.send({
            content:
              '"Missing Permissions", the bot is missing the `EMBED_LINKS` permission please enable it!',
          });
        } else {
          // Do nothing..
        }
      }
    } catch (err) {
      console.log(err);
    }

    if (interaction.isButton()) {
      // * Ticket button inteaction
      if (interaction.customId === "ticket") {
        Ticket.ticketBtn(client, interaction);
      }
      // * Checks if Ticket controll interactions
      TicketControlls.click(client, interaction);
    }
    let data;

    if (interaction.isStringSelectMenu()) {
      smRole.select(client, interaction);
    }

    // * Modals submite interactions
    if (interaction.isModalSubmit()) {
      if (interaction.customId === "releaseNotesModal") {
        const releaseNotes = require("../functions/ModalsHandle/release-notes");
        return releaseNotes.publish(client, interaction);
      }
    }
    if (interaction.isChatInputCommand()) {
      const command = client.slashCommands.get(interaction.commandName);

      if (!command) {
        return;
      } else if (interaction.user.bot) {
        return;
      } else {
        // Do nothing..
      }

      try {
        function getPermissionName(permission) {
          for (const perm of Object.keys(discord.PermissionsBitField.Flags)) {
            if (discord.PermissionsBitField.Flags[perm] === permission) {
              return perm;
            }
          }
          return "UnknownPermission";
        }

        if (
          command.data.guildOnly
            ? command.data.guildOnly
            : command.guildOnly && interaction.channel.type === "DM"
        ) {
          return interaction.reply({
            content:
              "<a:pp802:768864899543466006> I can't execute that command inside DMs!",
            ephemeral: true,
          });
        }

        if (
          command.data.ownerOnly
            ? command.data.ownerOnly
            : command.ownerOnly && !client.owners.includes(interaction.user.id)
        ) {
          return interaction.reply({
            content:
              "<a:pp802:768864899543466006> This command is limited for developers only!",
            ephemeral: true,
          });
        }
        //+ permissions: [""],
        if (
          command.data.permissions
            ? command.data.permissions
            : command.permissions
        ) {
          if (interaction.guild) {
            const sauthorPerms = interaction.channel.permissionsFor(
              interaction.user
            );
            if (
              !sauthorPerms ||
              !sauthorPerms.has(
                command.data.permissions
                  ? command.data.permissions
                  : command.permissions
              )
            ) {
              const permsNames = command.permissions?.map((perm) =>
                getPermissionName(perm)
              );
              return interaction.reply({
                content: `<a:pp802:768864899543466006> You don\'t have \`${
                  command.data.permissions
                    ? command.data.permissions
                    : command.permissions
                }\` permission(s) to use ${text.joinArray(
                  permsNames
                )} command.`,
                ephemeral: true,
              });
            }
          }
        }

        const clientPermissions = command.data.permissions
          ? command.data.permissions
          : command.permissions;
        //+ clientpermissions: [""],
        if (clientPermissions) {
          if (interaction.guild) {
            const sclientPerms = interaction.channel.permissionsFor(
              interaction.guild.members.me
            );
            if (!sclientPerms || !sclientPerms.has(clientPermissions)) {
              return interaction.reply({
                content: `<a:pp802:768864899543466006> The bot is missing \`${clientPermissions}\` permission(s)!`,
                ephemeral: true,
              });
            }
          }
        }
        console.log(
          `(/) ${interaction.user.tag}|(${interaction.user.id}) in ${
            interaction.guild
              ? `${interaction.guild.name}(${interaction.guild.id}) | #${interaction.channel.name}(${interaction.channel.id})`
              : "DMS"
          } used: /${interaction.commandName}`
        );
        //await interaction.deferReply().catch(() => {});
        command.execute(client, interaction);
      } catch (error) {
        console.error(error);
        await interaction
          .editReply({
            content: "There was an error while executing this command!",
            ephemeral: true,
          })
          .catch(() => {});
      }
    }
  },
};
