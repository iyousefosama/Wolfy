const axios = require("axios");

const getUserGuilds = async (user) => {
    const userGuildsResponse = await axios.get('https://discord.com/api/v10/users/@me/guilds', {
        headers: {
            Authorization: `Bearer ${user.accessToken}`,
        },
    });
    const userGuilds = userGuildsResponse.data;

    return userGuilds;
};

const getBotGuilds = async () => {
    const botGuildsResponse = await axios.get('https://discord.com/api/v10/users/@me/guilds', {
        headers: {
            Authorization: `Bot ${process.env.TOKEN}`,
        },
    });
    const botGuilds = botGuildsResponse.data;

    return botGuilds;
};

/**
 * 
 * @param {string} id 
 */
const getGuild = async (id, client) => {
    if (client) {
        return client.guilds.cache.get(id);
    }
    const response = await axios.get(`https://discord.com/api/v10/guilds/${id}`, {
        headers: {
            Authorization: `Bot ${process.env.TOKEN}`,
        },
    });
    const botGuilds = response.data;

    return botGuilds;
};
/**
 * 
 * @param {string} id 
 */
const getGuildChannels = async (id, client) => {
    if (client) {
        return client.channels.cache.filter(c => c.guildId === id);
    }
    const botGuildsResponse = await axios.get(`https://discord.com/api/v10/guilds/${id}/channels`, {
        headers: {
            Authorization: `Bot ${process.env.TOKEN}`,
        },
    });
    const botGuilds = botGuildsResponse.data;

    return botGuilds;
};

/**
 * 
 * @param {string} id 
 */
const getGuildMembers = async (id, client) => {
    if (client) {
        return client.guilds.cache.get(id).members.cache;
    }
    const response = await axios.get(`https://discord.com/api/v10/guilds/${id}/members`, {
        headers: {
            Authorization: `Bot ${process.env.TOKEN}`,
        },
    });
    const botGuilds = response.data;

    return botGuilds;
};

module.exports = { getUserGuilds, getBotGuilds, getGuild, getGuildChannels, getGuildMembers }