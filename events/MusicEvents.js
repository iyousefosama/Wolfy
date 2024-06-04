module.exports.registerPlayerEvents = (player) => {
  const { VoiceConnectionStatus } = require("@discordjs/voice");
  const { EmbedBuilder } = require("discord.js");
  let currentTrack = null;

  /*
// v6
player.events.on('connection', (queue) => {
    queue.dispatcher.voiceConnection.on('stateChange', (oldState, newState) => {
        if (oldState.status === VoiceConnectionStatus.Ready && newState.status === VoiceConnectionStatus.Connecting) {
            queue.dispatcher.voiceConnection.configureNetworking();
        }
    });
});
*/

  async function sendMessage(message, location, color = "Red") {
    const embed = new EmbedBuilder().setColor(color).setDescription(message);

    await location.send({ embeds: [embed] });
  }

  player.on("connectionCreate", async (queue) => {
    queue.connection.voiceConnection.on(
      "stateChange",
      async (oldState, newState) => {
        if (
          oldState.status === VoiceConnectionStatus.Ready &&
          newState.status === VoiceConnectionStatus.Connecting
        ) {
          return await queue.connection.voiceConnection.configureNetworking();
        }
      }
    );
  });

  player.on("error", async (queue, error) => {
    console.log(`[${queue.guild.name}] Error emitted from the queue: ${error}`);
    await sendMessage(
      `[${queue.guild.name}] Error emitted from the queue: ${error.message}`,
      queue.metadata.channel
    );
  });

  player.on("connectionError", async (queue, error) => {
    console.log(
      `[${queue.guild.name}] Error emitted from the connection: ${error}`
    );
    await sendMessage(
      `[${queue.guild.name}] Error emitted from the connection: ${error.message}`,
      queue.metadata.channel
    );
  });

  player.on("trackStart", async (queue, track) => {
    if (currentTrack !== track.title) {
      currentTrack = track.title;
      await sendMessage(
        `<a:Up:853495519455215627> Started playing: **${track.title}** in **${queue.connection.channel.name}**!`,
        queue.metadata.channel,
        "#ffa800"
      );
    }
  });

  player.on("botDisconnect", async (queue) => {
    currentTrack = null; // Reset currentTrack on bot disconnect
    return await sendMessage(
      "\\❌ Clearing queue, I was manually(or by errors) disconnected from the **voice-channel**!",
      queue.metadata.channel
    );
  });

  player.on("channelEmpty", async (queue) => {
    currentTrack = null; // Reset currentTrack when channel is empty
    return await sendMessage(
      "\\❌ Left, Nobody is in the **voice-channel**!",
      queue.metadata.channel
    );
  });

  player.on("queueEnd", async (queue) => {
    currentTrack = null; // Reset currentTrack when queue ends
    return await sendMessage(
      "<:Verify:841711383191879690> Queue **finished**!",
      queue.metadata.channel,
      "Green"
    );
  });
};
