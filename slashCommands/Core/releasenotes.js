const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const notes = require("../../schema/releasenotes-Schema");
const { version, author } = require("../../package.json");
const annChannel = "943861446243139648";

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
        .setColor("Blurify")
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
        if (client.owners.includes(interaction.user.id)) {
          return interaction.reply({
            content:
              "<a:pp802:768864899543466006> This command is limited for developers only!",
            ephemeral: true,
          });
        }

        const update = options.getString("updates-notes");
        const Channel = client.guild.channels.cache.get(annChannel);
        var notesVersion = 0;

        if (data.length > 0) {
          await notes.deleteMany();

          await data.forEach(async (value) => {
            notesVersion = +value.Version;
          });

          await updateNotes(update, version | (notesVersion + 0.1));
        } else {
          await updateNotes(update, version | 1.0);
        }

        await data.forEach(async (value) => {
          const embed = new EmbedBuilder()
            .setColor("DarkGreen")
            .setDescription(
              [
                `<:Discord_Staff:911761250759893012> ${client.user.username}(\`V: ${value.Version}\`) Changelogs!`,
                value.Title ? `${value.Title}` : ``,
                `**Updates:** \n\`\`\`diff\n${value.Updates}\`\`\``,
                `**Date:** <t:${Math.floor(value.Date / 1000)}:R>`,
                `Developer: \n\`\`\`${value.Developer}\`\`\``,
              ].join("\n\n")
            )
            .setTimestamp();
          Channel.send({ embeds: [embed] }).catch(() => {});
        });
        break;
      case "view":
        if (data.length == 0) {
          await sendMessage("⚠ No release notes found!");
        } else {
          await data.forEach(async (value) => {
            const embed = new EmbedBuilder()
              .setColor("DarkGreen")
              .setDescription(
                [
                  `<:Discord_Staff:911761250759893012> ${client.user.username}(\`V: ${value.Version}\`) Changelogs!`,
                  value.Title ? `${value.Title}` : ``,
                  `**Updates:** \n\`\`\`diff\n${value.Updates}\`\`\``,
                  `**Date:** <t:${Math.floor(value.Date / 1000)}:R>`,
                  `Developer: \n\`\`\`${value.Developer}\`\`\``,
                ].join("\n\n")
              )
              .setTimestamp();
            await interaction.reply({ embeds: [embed], ephemeral: true });
          });
        }
        break;
    }
  },
};
