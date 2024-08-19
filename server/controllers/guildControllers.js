const { getGuild } = require("../utils/services/getGuilds");
const schema = require('../../schema/GuildSchema');
const { getGuildChannels, getGuildMembers} = require('../utils/services/getGuilds')

/**
 * Get a specific guild discord data with the id
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
const getGuildController = async (req, res) => {
    const { id } = req.params;
    try {
        const guild = await getGuild(id);

        res.json(guild);
    } catch (error) {
        if (error.response?.status === 429) {
            return res.status(429).json({ msg: 'Rate limit exceeded. Please try again later.' });
        }
        console.error(error);
        res.status(500).json({ msg: 'Failed to fetch a guild' });
    }
};

/**
 * Get a specific guild discord data with the id
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
const getGuildChannelsController = async (req, res) => {
    const { id } = req.params;
    try {
        const channels = await getGuildChannels(id, req.client);

        res.json(channels);
    } catch (error) {
        if (error.response?.status === 429) {
            return res.status(429).json({ msg: 'Rate limit exceeded. Please try again later.' });
        }
        console.error(error);
        res.status(500).json({ msg: 'Failed to fetch guild channels' });
    }
};

/**
 * Get a specific guild discord data with the id
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
const getGuildMembersController = async (req, res) => {
    const { id } = req.params;
    try {
        const members = await getGuildMembers(id, req.client);

        res.json(members);
    } catch (error) {
        if (error.response?.status === 429) {
            return res.status(429).json({ msg: 'Rate limit exceeded. Please try again later.' });
        }
        console.error(error);
        res.status(500).json({ msg: 'Failed to fetch guild members' });
    }
};


/**
 * Get a specific guild discord data with the id
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
const getGuildData = async (req, res) => {
    const { id } = req.params;

    try {
        // Check if guild data exists in the database
        let data = await schema.findOne({ GuildID: id });

        if (!data) {
            // Create and save a new data entry for the guild
            data = await schema.create({ GuildID: id });
            data.save();
        };

        res.status(200).json(data);
    } catch (error) {
        if (error.response?.status === 429) {
            return res.status(429).json({ msg: 'Rate limit exceeded. Please try again later.' });
        }
        console.error(error);
        res.status(500).json({ msg: 'Failed to fetch a guild' });
    }
};

/**
 * Get a specific guild discord data with the id
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
const patchGuildData = async (req, res) => {
    const { id } = req.params;
    const body = req.body;

    try {
        // Check if guild data exists in the database
        let data = await schema.findOneAndUpdate({ GuildID: id }, body, { new: true });

        if (!data) {
            res.status(404).json({ msg: 'Guild data not found' });
        };

        res.status(200).json(data);
    } catch (error) {
        if (error.response?.status === 429) {
            return res.status(429).json({ msg: 'Rate limit exceeded. Please try again later.' });
        }
        console.error(error);
        res.status(500).json({ msg: 'Failed to fetch a guild' });
    }
};

module.exports = { getGuildController, getGuildData, patchGuildData, getGuildChannelsController, getGuildMembersController };