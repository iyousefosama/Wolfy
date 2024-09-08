const { getGuild, getGuildChannels, getGuildMembers, getGuildInfo } = require("../utils/services/getGuilds");
const schema = require('../../schema/GuildSchema');

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

const getGuildInfoController = async (req, res) => {
    const { id } = req.params;
    try {
        const guild = await getGuildInfo(id);

        res.json(guild);
    } catch (error) {
        if (error.response?.status === 429) {
            return res.status(429).json({ msg: 'Rate limit exceeded. Please try again later.' });
        }
        console.error(error);
        res.status(500).json({ msg: 'Failed to fetch a guild' });
    }
}

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

const patchGuildData = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Check if the request body is valid JSON
        if (typeof updates !== 'object' || updates === null) {
            return res.status(400).json({ msg: 'Invalid request body' });
        }

        // Remove the `id` or `GuildID` from the updates object to prevent modification
        delete updates.id;
        delete updates._id;
        delete updates.GuildID;

        // Find the existing guild data
        const guildData = await schema.findOne({ GuildID: id });

        if (!guildData) {
            return res.status(404).json({ msg: 'Guild data not found' });
        }

        // Merge the updates into the existing data
        Object.assign(guildData, updates);

        // Validate the merged document without saving
        await guildData.validate();

        // Update the document in the database
        const updatedData = await schema.findOneAndUpdate(
            { GuildID: id },
            updates,
            { new: true } // Return the updated document
        );

        res.status(200).json(updatedData);
    } catch (error) {
        // Suppress specific JSON parsing errors
        if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
            return res.status(400).json({ msg: 'Invalid JSON payload' });
        }

        // Handle validation errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({ msg: 'Validation failed', errors: error.errors });
        }

        // Handle specific API errors if needed
        if (error.response?.status === 429) {
            return res.status(429).json({ msg: 'Rate limit exceeded. Please try again later.' });
        }

        // Log the error for debugging
        console.error('Error in patchGuildData:', error);

        // Send a generic error response
        res.status(500).json({ msg: 'Failed to update the guild data' });
    }
};



module.exports = { getGuildController, getGuildInfoController, getGuildData, patchGuildData, getGuildChannelsController, getGuildMembersController };