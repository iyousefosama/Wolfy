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
        params: {
            with_counts: true
        }
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
        params: {
            limit: 1000,
        }
    });
    const botGuilds = response.data;

    return botGuilds;
};

/**
 * Fetches a guild by ID and includes its channels and members.
 * 
 * @param {string} id - The guild ID.
 * @param {object} client - The Discord client object (optional).
 * @returns {Promise<object>} The guild data including channels and members.
 */
const getGuildInfo = async (id, client) => {
    let guild;

    if (client) {
        // Fetch guild from client's cache
        guild = client.guilds.cache.get(id);

        if (!guild) {
            throw new Error(`Guild with ID ${id} not found in client's cache.`);
        }

        // Fetch channels and members from client's cache
        const channels = guild.channels.cache.filter(c => c.guildId === id);
        const members = guild.members.cache;

        return {
            ...guild,
            channels,
            members,
        };
    } else {
        // Fetch guild, channels, and members from Discord API
        const guildResponse = await axios.get(`https://discord.com/api/v10/guilds/${id}`, {
            headers: {
                Authorization: `Bot ${process.env.TOKEN}`,
            },
            params: {
                with_counts: true
            }
        });

        guild = guildResponse.data;

        const channelsResponse = await axios.get(`https://discord.com/api/v10/guilds/${id}/channels`, {
            headers: {
                Authorization: `Bot ${process.env.TOKEN}`,
            },
        });

        const membersResponse = await axios.get(`https://discord.com/api/v10/guilds/${id}/members`, {
            headers: {
                Authorization: `Bot ${process.env.TOKEN}`,
            },
            params: {
                limit: 1000,
            }
        });

        // Combine guild data with channels and members
        return {
            ...guild,
            channels: channelsResponse.data,
            members: membersResponse.data,
        };
    }
};


module.exports = { getUserGuilds, getBotGuilds, getGuild, getGuildInfo, getGuildChannels, getGuildMembers }