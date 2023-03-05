module.exports.registerPlayerEvents = (player) => {

const { VoiceConnectionStatus } = require('@discordjs/voice');

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

// v5
player.on('connectionCreate', (queue) => {
    queue.connection.voiceConnection.on('stateChange', (oldState, newState) => {
        if (oldState.status === VoiceConnectionStatus.Ready && newState.status === VoiceConnectionStatus.Connecting) {
            queue.connection.voiceConnection.configureNetworking();
        }
    })
});

    player.on("error", (queue, error) => {
        console.log(`[${queue.guild.name}] Error emitted from the queue: ${error.message}`);
        queue.metadata.channel.send(`[${queue.guild.name}] Error emitted from the queue: ${error.message}`);
    });

    player.on("connectionError", (queue, error) => {
        console.log(`[${queue.guild.name}] Error emitted from the connection: ${error.message}`);
        queue.metadata.channel.send(`[${queue.guild.name}] Error emitted from the connection: ${error.message}`);
    });

    /*
    player.on("trackAdd", async (queue, track) => {
    });
    */

    player.on("trackStart", async (queue, track) => {
        return await queue.metadata.channel.send(`<a:Up:853495519455215627> Started playing: **${track.title}** in **${queue.connection.channel.name}**!`);
    });

    player.on("botDisconnect", async (queue) => {
        return await queue.metadata.channel.send("\\❌ **clearing queue,** I was manually disconnected from the voice channel!");
    });

    player.on("channelEmpty", async (queue) => {
        return await queue.metadata.channel.send("\\❌ **left,** Nobody is in the voice channel!");
    });

    player.on("queueEnd", async (queue) => {
        return await queue.metadata.channel.send("<:Verify:841711383191879690> Queue finished!");
    });

};