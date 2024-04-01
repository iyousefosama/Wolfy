const { SlashCommandBuilder } = require("@discordjs/builders");
const discord = require("discord.js");
const { QueueRepeatMode } = require("discord-player");

module.exports = {
  clientpermissions: [
    discord.PermissionsBitField.Flags.EmbedLinks,
    discord.PermissionsBitField.Flags.ReadMessageHistory,
    discord.PermissionsBitField.Flags.Connect,
    discord.PermissionsBitField.Flags.Speak,
  ],
  guildOnly: true,
  data: new SlashCommandBuilder()
    .setName("loop")
    .setDescription("Loops the currently playing track!")
    .addStringOption((option) =>
      option
        .setName("action")
        .setDescription("Action you want to preform on the command")
        .setRequired(true)
        .addChoices(
          { name: "Queue", value: "enable_loop_queue" },
          { name: "Disable", value: "disable_loop" },
          { name: "Song", value: "enable_loop_song" }
        )
    ),
  async execute(client, interaction) {
    const repeat = interaction.options.getString('action');
    const queue = client.player.getQueue(interaction.guildId);

    if (!interaction.member.voice.channel) {
      return await interaction.editReply(
        "<:error:888264104081522698> Sorry, you need to join a voice channel first to play a track!"
      );
    } else if (
      interaction.guild.members.me.voice.channelId &&
      interaction.member.voice.channelId !==
        interaction.guild.members.me.voice.channelId
    ) {
      return await interaction.editReply(
        "<:error:888264104081522698> You are not in my voice channel!"
      );
    } else if (!queue) {
      return await interaction.editReply(
        "<:error:888264104081522698> There are no tracks in the queue!"
      );
    }

    if (!queue.playing) {
      return await interaction.editReply(
        "<:error:888264104081522698> There is no played track in this server!"
      );
    }

    switch (repeat) {
      case "enable_loop_queue": {
        if (queue.repeatMode === 1) {
          return interaction.editReply({
            content: `❌ ${interaction.member}, You must first disable the current music in the loop mode \`(/loop [false])\` `,
            ephemeral: true,
          });
        }

        const success = queue.setRepeatMode(QueueRepeatMode.QUEUE);

        return interaction.editReply({
          content: success
            ? `✔ Repeat mode **enabled** the whole queue will be repeated endlessly 🔁`
            : `❌ ${interaction.member}, Something went wrong!`,
        });
        break;
      }
      case "disable_loop": {
        const success = queue.setRepeatMode(QueueRepeatMode.OFF);

        return interaction.editReply({
          content: success
            ? `✔ Repeat mode **disabled**!`
            : `❌ ${interaction.member}, Something went wrong!`,
        });
        break;
      }
      case "enable_loop_song": {
        if (queue.repeatMode === 2)
          return interaction.editReply({
            content: `❌ ${interaction.member}, You must first disable the current music in the loop mode (\`/loop Disable\`)`,
            ephemeral: true,
          });

        const success = queue.setRepeatMode(QueueRepeatMode.TRACK);

        return interaction.editReply({
          content: success
            ? `✔ Repeat mode **enabled** the current song will be repeated endlessly! (\`you can end the loop with /loop disable\`)`
            : `❌ ${interaction.member}, Something went wrong!`,
        });
        break;
      }
    }
  },
};
