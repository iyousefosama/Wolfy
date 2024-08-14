const express = require('express')
const app = express();
const cors = require("cors");

/**
 * @param {import('../../struct/Client')} client
 */
module.exports = (client) => {
    const port = process.env.PORT || 4000;

    app.use(express.json());
    
    app.use(cors({
        origin: 'https://wolfy-navy.vercel.app',
        methods: ['GET', 'POST'],
        credentials: true,
    }));
    
    app.get('/', (req, res) => {
        res.send('Hello World!')
    });

    app.get('/client-stats', (req, res) => {
        try {
            // Transform client.user into a plain object
            const user = {
                id: client.user.id,
                username: client.user.username,
                discriminator: client.user.discriminator,
                avatar: client.user.avatar,
            };

            const commands = client.commands?.size;
            const SlashCommands = client.application.commands?.cache.size;

            const totalCommands = commands + SlashCommands;
    
            // Send the simplified data
            res.status(200).json({
                user,
                guilds: client.guilds.cache.size,
                members: client.guilds.cache.reduce((a, b) => a + b.memberCount, 0),
                totalCommands
            });
        } catch (error) {
            // Log the error for debugging
            console.error(error);
    
            // Send the error response only if no response has been sent
            if (!res.headersSent) {
                res.status(500).send('An error occurred while processing your request.');
            }
        }
    });

    app.listen(port, () => console.log("Server is running on port " + port))
}