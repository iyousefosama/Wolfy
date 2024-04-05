const notes = require("../../schema/releasenotes-Schema");
const { version, author } = require("../../package.json");
const { EmbedBuilder } = require("discord.js")

exports.publish = async function (client, interaction) {

    const update = interaction.fields.getTextInputValue("notesInput");

    const notesData = await notes.find();
    async function updateNotes(update, version) {
      await notes.create({
        Updates: update,
        Date: Date.now(),
        Developer: interaction.user.username,
        Version: version,
      });
    }

    const changeLogs =
      (await client.channels.cache.get(client.config.channels.changelogs)) ||
      (await client.channels.cache.get("887589978127863808"));
    var notesVersion = 0;

    if (notesData.length > 0) {
      await notes.deleteMany();

      await notesData.forEach(async (value) => {
        notesVersion = +value.Version;
      });

      await updateNotes(update, version || `${notesVersion + 0.1}`);
    } else {
      await updateNotes(update, version || "1.0");
    }

    await notesData.forEach(async (value) => {
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
      return await changeLogs.send({ embeds: [embed] }).catch(() => {});
    });
    await interaction.reply({
      content: "👌 Your submission was received successfully!",
      ephemeral: true,
    });
};
