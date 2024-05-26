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
const schema = require("../../schema/GuildSchema");

exports.select = async function (client, interaction) {
  let choice = interaction.values[0];

  async function SelectRoles() {
    if (interaction.guild) {
      try {
        data = await schema.findOne({
          GuildID: interaction.guild.id,
        });
      } catch (err) {
        console.log(err);
        interaction.reply({
          content: `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`,
        });
      }
    }
    if (!data)
      return interaction.reply(
        `\\❌ I can't find this guild \`data\` in the data base!`
      );
    const member = interaction.member;

    // Get all the roles at once
    const roles = [
      data?.Mod.smroles.value1,
      data?.Mod.smroles.value2,
      data?.Mod.smroles.value3,
      data?.Mod.smroles.value4,
      data?.Mod.smroles.value5,
      data?.Mod.smroles.value6,
    ]
      .map((value) => interaction.guild.roles.cache.get(value))
      .filter((role) => !!role);

    // Find the selected role and perform the necessary action
    const selectedRole = roles.find((role) => role?.id === choice);
    if (!selectedRole) {
      return interaction.reply({
        content: `\\❌ I can't find this role in the guild!`,
        ephemeral: true,
      });
    }

    if (member.roles.cache.has(selectedRole.id)) {
      return await member.roles
        .remove(selectedRole)
        .then(() => {
          interaction.reply({
            content: `<a:pp833:853495989796470815> Successfully removed ${selectedRole} from you!`,
            ephemeral: true,
          });
        })
        .catch(
          async (err) =>
            await interaction.channel.send({
              content: `\\❌ Failed to remove the role **${selectedRole}** for ${member.user.tag}, \`${err.message}\`!`,
            })
        );
    } else {
      return await member.roles
        .add(selectedRole)
        .then(() => {
          interaction.reply({
            content: `<a:pp330:853495519455215627> Successfully added ${selectedRole} for you!`,
            ephemeral: true,
          });
        })
        .catch(
          async (err) =>
            await interaction.channel.send({
              content: `\\❌ Failed to add the role **${selectedRole}** for ${member.user.tag}, \`${err.message}\`!`,
            })
        );
    }
  }

  switch (interaction.customId) {
    case "kwthbek4m221pyddhwk":
      return SelectRoles();
    case "kwthbek4m221pyddhwp4":
      if (choice == "auto_reminder1") {
      }
    default:
      return;
  }
};
