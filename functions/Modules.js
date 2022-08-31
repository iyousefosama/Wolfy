module.exports = async (client) => {
    const path = require('path')
    require('dotenv').config({ path: path.resolve(__dirname, '.env') })

    const { Player } = require("discord-player")
    
    const { registerPlayerEvents } = require('../events/MusicEvents');
    
    client.player = new Player(client, client.config.ytdlOptions)
    
    client.database?.init();
    
    registerPlayerEvents(client.player);
};