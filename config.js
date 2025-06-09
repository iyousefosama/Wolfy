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
        intents: [
            "MessageContent",
            "GuildMembers",
            "Guilds",
            "GuildMessages",
            "GuildBans",
            "GuildInvites",
            "GuildMessageReactions",
            "GuildModeration",
            "GuildWebhooks",
            "DirectMessages",
            "GuildVoiceStates"
        ],
        allowedMentions: { 
            parse: ['users', 'roles'], 
            repliedUser: true 
        },
    },

    // set the default prefix, if non-string data-type is provided, will resolve
    // to the prefix 'w!'
    prefix: 'w!',

    // logging channels for the bot. To disable logging specific events - pass
    // a falsy value (undefined, null, 0). You may also remove the property
    // altogether, although this is not preferred.
    channels: {
        debug: process.env.DEBUG_CHANNEL,
        uploads: process.env.UPLOADS_CHANNEL,
        votes: process.env.VOTES_CHANNEL,
        chatbot: process.env.CHATBOT_CHANNEL,
        changelogs: process.env.CHANGELOGS_CHANNEL
    },

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
        devGuild: process.env.DEV_GUILD,
        forceUpdate: false,
        DELETE_ALL: false,
    },

    // * Array of owners recognized by the bot. ID here will be given access to
    // owner based commands.

    owners: process.env.OWNERS?.split(',') || [],

    ticket: {
        max_panels: 6,
    },

    // websites affiliated with the bot, can be accessed through
    // Client#config#websites
    websites: {
        website: process.env.WEBSITE_URL,
        invite: process.env.BOT_INVITE_URL,
        support: process.env.SUPPORT_SERVER_URL,
        "top.gg": process.env.TOPGG_URL,
    },
};

module.exports = settings;
