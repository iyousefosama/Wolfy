const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const notes = require("../../schema/releasenotes-Schema");
const { version, author } = require("../../package.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("release-notes")
    .setDescription("View/Publish release notes for wolfy bot")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("publish")
        .setDescription("🛠 Developers only, Publish new release notes")
        .addStringOption((option) =>
          option
            .setName("updates-notes")
            .setDescription("The notes to publish")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("view")
        .setDescription("View the most recent release notes")
    ),
  async execute(client, interaction) {
    const { options } = interaction;
    const sub = options.getSubcommand();
    var data = await notes.find();

    async function sendMessage(message) {
      const embed = new EmbedBuilder()
        .setColor(`Blurple`)
        .setDescription(message);

      await interaction.editReply({ embeds: [embed], ephemeral: true });
    }

    async function updateNotes(update, version) {
      await notes.create({
        Updates: update,
        Date: Date.now(),
        Developer: interaction.user.username,
        Version: version,
      });

      await sendMessage("✔ Release notes updated!");
    }

    switch (sub) {
      case "publish":
        if (!client.owners.includes(interaction.user.id)) {
          return interaction.editReply({
            content:
              "<a:pp802:768864899543466006> This command is limited for developers only!",
            ephemeral: true,
          });
        }

        const update = options.getString("updates-notes");
        const changeLogs =
          (await client.channels.cache.get(
            client.config.channels.changelogs
          )) || (await client.channels.cache.get("887589978127863808"));
        var notesVersion = 0;

        if (data.length > 0) {
          await notes.deleteMany();

          await data.forEach(async (value) => {
            notesVersion = +value.Version;
          });

          await updateNotes(update, version || `${(notesVersion + 0.1)}`);
        } else {
          await updateNotes(update, version || "1.0");
        }

        await data.forEach(async (value) => {
          const embed = new EmbedBuilder()
            .setColor(`#c19a6b`)
            .setAuthor({
              name: interaction.user.username,
              iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
            })
            .setDescription(
              [
                `<:Discord_Staff:911761250759893012> **${client.user.username}**(\`V: ${value.Version}\`) Changelogs!`,
                value.Title ? `${value.Title}` : ``,
                `**Updates:** \n\`\`\`diff\n${value.Updates}\`\`\``,
                `**Date:** <t:${Math.floor(value.Date / 1000)}:R>`,
              ].join("\n\n")
            )
            .setTimestamp();
          return await changeLogs.send({ embeds: [embed] });
        });
        break;
      case "view":
        if (data.length == 0) {
          await sendMessage("⚠ No release notes found!");
        } else {
          await data.forEach(async (value) => {
            const embed = new EmbedBuilder()
              .setColor(`#c19a6b`)
              .setAuthor({
                name: "Test",
                iconURL: client.user.displayAvatarURL({ dynamic: true }),
              })
              .setDescription(
                [
                  `<:Discord_Staff:911761250759893012> **${client.user.username}**(\`V: ${value.Version}\`) Changelogs!`,
                  value.Title ? `${value.Title}` : ``,
                  `**Updates:** \n\`\`\`diff\n${value.Updates}\`\`\``,
                  `**Date:** <t:${Math.floor(value.Date / 1000)}:R>`,
                ].join("\n\n")
              )
              .setFooter({
                text: interaction.guild.name,
                iconURL: interaction.guild.iconURL({ dynamic: true }),
              })
              .setTimestamp();
            return await interaction.editReply({ embeds: [embed], ephemeral: true });
          });
        }
        break;
    }
  },
};
