const { GatewayIntentBits, Partials } = require('discord.js')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '.env') })

const settings = {
    // pass in any client configuration you want for the bot.
    // more client options can be found at
    // https://discord.js.org/#/docs/main/stable/typedef/ClientOptions
    /**
     * @type {import('discord.js').ClientOptions}
     */
    client: {
        presence: {
            activity: {
                name: 'Wolfy',
                type: 'COMPETING'
            }
        },
        partials: [Partials.Message, Partials.Channel, Partials.Reaction],
        // Intents flags
        intents: ["MessageContent", "GuildMembers"/* , "GuildPresences" */, "Guilds", "GuildMessages", "GuildBans", "GuildInvites", "GuildMessageReactions", "GuildModeration", "GuildWebhooks", "DirectMessages", "GuildMessageReactions", "GuildVoiceStates"],
        // Disable Mentions except Users
        allowedMentions: { parse: ['users', 'roles'], repliedUser: true },
    },

    // set the default prefix, if non-string data-type is provided, will resolve
    // to the prefix 'w!'
    prefix: 'w!',

    // logging channels for the bot. To disable logging specific events - pass
    // a falsy value (undefined, null, 0). You may also remove the property
    // altogether, although this is not preferred.
    channels: { debug: '887505644146536458', uploads: "887505644146536458", votes: "840892477614587914", chatbot: "1115038503139545108", changelogs: "887589978127863808" },

    // enable/disable database system in the bot, this will automatically disable
    // all commands and features that requires database if disabled.
    database: {
        enable: true,
        uri: process.env.MONGO_URI,
        config: {
            autoIndex: false,
            connectTimeoutMS: 10000,
            family: 4
        }
    },

    // * enable/disable loading slash commands as global slash commands, or loading them for the developing guild.
    // ? Make sure loadGlobal set to true on main client
    slashCommands: {
        loadGlobal: true,
        devGuild: "943861446243139645",
        forceUpdate: true,
        DELETE_ALL: false,
    },

    // * Array of owners recognized by the bot. ID here will be given access to
    // owner based commands.

    owners: ['724580315481243668', '829819269806030879'],

    ticket: {
        max_panels: 6,
    },

    // websites affiliated with the bot, can be accessed through
    // Client#config#websites
    websites: {
        "website": "https://wolfy-navy.vercel.app",
        "invite": "https://discord.com/api/oauth2/authorize?client_id=821655420410003497&permissions=8&scope=bot%20applications.commands",
        "support": "https://discord.gg/qYjus2rujb",
        "top.gg": "https://top.gg/bot/821655420410003497",
    },
};

module.exports = settings;
