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
const { parsePermissions } = require("../util/class/utils");
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

        if (command.data.guildOnly && interaction.channel.type === ChannelType.DM) {
          return sendMessage("I can't execute that command **inside DMs**!");
        }


        if (command.data.ownerOnly && !client.owners.includes(interaction.user.id)) {
          return sendMessage(
            "This command is limited for **developers only**!"
          );
        }
        //+ permissions: [""],
        if (command.data.permissions && command.data.permissions > 0) {
          if (interaction.guild) {
            const userPerms = interaction.channel.permissionsFor(
              interaction.user
            );
            if (!userPerms || !userPerms.has(command.data.permissions)) {
              return sendMessage(
                `You don\'t have \`${parsePermissions(command.data.permissions)}\` permission(s) to use **${command.data.name}** command.`
              );
            }
          }
        }

        //+ clientPermissions: [""],
        if (command.data.clientPermissions && command.data.clientPermissions > 0) {
          if (interaction.guild) {
            const clientPerms = interaction.channel.permissionsFor(
              interaction.guild.members.me
            );
            if (!clientPerms || !clientPerms.has(command.data.clientPermissions)) {
              return sendMessage(
                `The client is missing \`${parsePermissions(client.data.clientPermissions)}\` permission(s)!`
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
