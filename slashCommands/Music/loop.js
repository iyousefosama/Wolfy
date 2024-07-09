const { SlashCommandBuilder } = require("@discordjs/builders");
const discord = require("discord.js");
const { QueueRepeatMode } = require("discord-player");

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "loop",
    description: "Loops the currently playing track!",
    dmOnly: false,
    guildOnly: true,
    cooldown: 0,
    group: "NONE",
    clientPermissions: [
      discord.PermissionsBitField.Flags.EmbedLinks,
      discord.PermissionsBitField.Flags.ReadMessageHistory,
      discord.PermissionsBitField.Flags.Connect,
      discord.PermissionsBitField.Flags.Speak
    ],
    permissions: [],
    options: [
      {
        type: 3, // STRING
        name: 'action',
        description: 'Action you want to perform on the command',
        required: true,
        choices: [
          { name: 'Queue', value: 'enable_loop_queue' },
          { name: 'Disable', value: 'disable_loop' },
          { name: 'Song', value: 'enable_loop_song' }
        ]
      }
    ]
  },
  async execute(client, interaction) {
    const repeat = interaction.options.getString('action');
    const queue = client.player.getQueue(interaction.guildId);

    if (!interaction.member.voice.channel) {
      return await interaction.reply(
        "<:error:888264104081522698> Sorry, you need to join a voice channel first to play a track!"
      );
    } else if (
      interaction.guild.members.me.voice.channelId &&
      interaction.member.voice.channelId !==
      interaction.guild.members.me.voice.channelId
    ) {
      return await interaction.reply(
        "<:error:888264104081522698> You are not in my voice channel!"
      );
    } else if (!queue) {
      return await interaction.reply(
        "<:error:888264104081522698> There are no tracks in the queue!"
      );
    }

    if (!queue.playing) {
      return await interaction.reply(
        "<:error:888264104081522698> There is no played track in this server!"
      );
    }

    switch (repeat) {
      case "enable_loop_queue": {
        if (queue.repeatMode === 1) {
          return interaction.reply({
            content: `❌ ${interaction.member}, You must first disable the current music in the loop mode \`(/loop [false])\` `,
            ephemeral: true,
          });
        }

        const success = queue.setRepeatMode(QueueRepeatMode.QUEUE);

        return interaction.reply({
          content: success
            ? `✔ Repeat mode **enabled** the whole queue will be repeated endlessly 🔁`
            : `❌ ${interaction.member}, Something went wrong!`,
        });
        break;
      }
      case "disable_loop": {
        const success = queue.setRepeatMode(QueueRepeatMode.OFF);

        return interaction.reply({
          content: success
            ? `✔ Repeat mode **disabled**!`
            : `❌ ${interaction.member}, Something went wrong!`,
        });
        break;
      }
      case "enable_loop_song": {
        if (queue.repeatMode === 2)
          return interaction.reply({
            content: `❌ ${interaction.member}, You must first disable the current music in the loop mode (\`/loop Disable\`)`,
            ephemeral: true,
          });

        const success = queue.setRepeatMode(QueueRepeatMode.TRACK);

        return interaction.reply({
          content: success
            ? `✔ Repeat mode **enabled** the current song will be repeated endlessly! (\`you can end the loop with /loop disable\`)`
            : `❌ ${interaction.member}, Something went wrong!`,
        });
        break;
      }
    }
  },
};
