const { Client, GatewayIntentBits, Partials } = require('discord.js')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '.env') })
/*
Make sure that loadSlashsGlobal is set to true if this is for the main bot!!!!
*/

const settings = {
    // pass in any client configuration you want for the bot.
    // more client options can be found at
    // https://discord.js.org/#/docs/main/stable/typedef/ClientOptions
    client: {
      presence: {
        activity: {
          name: 'Wolfy',
          type: 'COMPETING'
        }
      },
      partials: [Partials.Message, Partials.Channel, Partials.Reaction],
      // Intents flags
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildBans, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildBans, GatewayIntentBits.MessageContent],
      // Disable Mentions except Users
      allowedMentions: { parse: ['users', 'roles'], repliedUser: true },
    },

    // set the default prefix, if non-string data-type is provided, will resolve
    // to the prefix 'w!'
    prefix: 't!',
  
    // logging channels for the bot. To disable logging specific events - pass
    // a falsy value (undefined, null, 0). You may also remove the property
    // altogether, although this is not preferred.
    channels: { debug: '840892477614587914', votes: "840892477614587914", chatbot: "911566889849876512" },
  
    // enable/disable database system in the bot, this will automatically disable
    // all commands and features that requires database if disabled.
    database: {
      enable: true,
      uri: process.env.MONGO_URI,
      config: {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        autoIndex: false,
        poolSize: 5,
        connectTimeoutMS: 10000,
        family: 4
      }
    },

    player: {
      ytdlOptions: {
          quality: "highestaudio",
          highWaterMark: 1 << 25,
          dlChunkSize: 0
      }
    },

    loadSlashsGlobal: true,
    
    // Array of owners recognized by the bot. ID here will be given access to
    // owner based commands.
    owners: [ '724580315481243668' ],
  
    // websites affiliated with the bot, can be accessed through
    // Client#config#websites
    websites: {
      "website": "https://iiblackwolf.github.io/WolfySite/index.html",
      "invite": "https://discord.com/api/oauth2/authorize?client_id=821655420410003497&permissions=8&scope=bot%20applications.commands",
      "support": "https://discord.gg/qYjus2rujb",
      "top.gg": "https://top.gg/bot/821655420410003497",
    }
  };
  
  module.exports = settings;
