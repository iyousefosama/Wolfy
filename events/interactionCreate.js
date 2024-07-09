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
const text = require("../util/string");
const Ticket = require("../functions/ButtonHandle/Ticket");
const TicketControlls = require("../functions/ButtonHandle/TicketControlls");
const smRole = require("../functions/SelectMenuHandle/selectMenuRoles");
const logSys = require("../functions/logSys");

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
        async function sendMessage(message) {
          const embed = new EmbedBuilder()
            .setColor(`Red`)
            .setDescription(message);

          await interaction.reply({ embeds: [embed], ephemeral: true });
        }
        function getPermissionName(permission) {
          for (const perm of Object.keys(discord.PermissionsBitField.Flags)) {
            if (discord.PermissionsBitField.Flags[perm] === permission) {
              return perm;
            }
          }
          return "UnknownPermission";
        }

        let state = command.guildOnly
          ? command.guildOnly
          : command.data.guildOnly;

        if (state && interaction.channel.type === ChannelType.DM) {
          return sendMessage("I can't execute that command **inside DMs**!");
        }

        state = command.data.ownerOnly
          ? command.data.ownerOnly
          : command.ownerOnly;

        if (state && !client.owners.includes(interaction.user.id)) {
          return sendMessage(
            "This command is limited for **developers only**!"
          );
        }
        //+ permissions: [""],
        state = command.data.permissions
          ? command.data.permissions
          : command.permissions;
        if (state) {
          if (interaction.guild) {
            const sauthorPerms = interaction.channel.permissionsFor(
              interaction.user
            );
            if (!sauthorPerms || !sauthorPerms.has(state)) {
              const permsNames = state?.map((perm) => getPermissionName(perm));
              return sendMessage(
                `You don\'t have \`${text.joinArray(
                  permsNames
                )}\` permission(s) to use **${command.data.name}** command.`
              );
            }
          }
        }

        state = command.data.clientPermissions
          ? command.data.clientPermissions
          : command.clientPermissions;
        //+ clientPermissions: [""],
        if (state) {
          if (interaction.guild) {
            const sclientPerms = interaction.channel.permissionsFor(
              interaction.guild.members.me
            );
            if (!sclientPerms || !sclientPerms.has(state)) {
              const permsNames = state?.map((perm) => getPermissionName(perm));
              return sendMessage(
                `The client is missing \`${permsNames}\` permission(s)!`
              );
            }
          }
        }
        //await interaction.deferReply().catch(() => {});
        command.execute(client, interaction).then(() => {
          logSys(client, interaction, true);
          console.log(
            `(/) ${interaction.user.username}|(${interaction.user.id}) in ${
              interaction.guild
                ? `${interaction.guild.name}(${interaction.guild.id}) | #${interaction.channel.name}(${interaction.channel.id})`
                : "DMS"
            } used: /${interaction.commandName}`
          );
        });
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
