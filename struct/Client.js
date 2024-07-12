'use strict';

const { Client, Collection, EmbedBuilder, version } = require('discord.js');
const { performance } = require('perf_hooks');
const ComponentsLoader = require("../Handler/ComponentsActionLoader");
const SlashCommandLoader = require("../Handler/SlashHandler");
const Mongoose = require(`./Mongoose`);
const processEvents = require(`../util/processEvents`);
const consoleUtil = require("../util/console")

let Embedlogs = [];

/**
 * Optimized hub for interacting with the discord API
 * @extends {Client}
 */

module.exports = class WolfyClient extends Client {
  /**
   * @param {ClientSettings} [settings] for this client, including the ClientOptions [options] for the client
   */
  constructor(settings = {}) {
    super(settings.client);

    // Initialize bot, log on terminal when instantiated.
    console.log(`Initializing the client. Please wait...`);

    /**
 * @type  {Collection<string, import("../util/types/baseComponent")>}
 */
    this.commands = new Collection();
    this.ComponentsAction = new Collection();
    this.components = new Collection();

    /**
     * The default prefix this bot instance will be using.
     * @type {?string}
     */
    if (typeof settings.prefix !== 'string') {
      settings.prefix = 'w!';
    };

    if (!this.token && 'TOKEN' in process.env) {
      /**
      * Authorization token for the logged in bot.
      * If present, this defaults to `process.env.TOKEN` or `process.env.discord_TOKEN` when instantiated
      * <warn> This should be kept private at all times </warn>
      * @type {?string}
      */
      this.token = process.env.TOKEN;
    };

    /**
     * Time took by the bot to start from loading files to the first `READY` state
     * @type {?Number}
     */
    this.bootTime = null;


    /**
     * The external database connected to this bot (null when disabled);
     * @type {?Mongoose}
    */
    this.database = null;

    if (settings.database?.enable === true) {
      this.database = new Mongoose(this, settings.database);
    } else {
      // Do nothing..
    };

    /**
     * Counter for messages received and sent by the bot
     * @type {?MessageCount}
     */
    this.messages = { received: 0, sent: 0 };

    /**
     * Pre-defined bot conifigurations.
     * @type {ClientConfig}
     */
    this.config = {
      prefix: settings.prefix || 'w!',
      features: [],
      owners: [],
      loadSlashsGlobal: undefined,
      channels: { debug: null, votes: null, uploads: null, logs: null, chatbot: null },
      websites: settings.websites
    };

    /**
     * Channel ID used by the bot to log errors when enabled.
     * @type {?Snowflake}
     */
    if (typeof settings.channels?.debug === 'string') {
      this.config.channels.debug = settings.channels.debug;
    } else {
      // Do nothing...
    };

    /**
     * Channel ID used by the bot to send vote messages
     * @type {?Snowflake}
     */
    if (typeof settings.channels?.votes === 'string') {
      this.config.channels.votes = settings.channels.votes;
    } else {
      // Do nothing...
    };

    /**
 * Channel ID used for the chatbot
 * @type {?Snowflake}
 */
    if (typeof settings.channels?.chatbot === 'string') {
      this.config.channels.chatbot = settings.channels.chatbot;
    } else {
      // Do nothing...
    };

    /**
    * 
    * @type {?Boolean}
    */
    if (typeof settings.loadSlashsGlobal === 'boolean') {
      this.config.loadSlashsGlobal = settings.loadSlashsGlobal;
    } else {
      // Do nothing...
    };

    /**
     * Array of {@link User} IDs that will be considered by the bot it's owner.
     * Will be used by {@link CommandHandler} when attempting to read ownerOnly commands.
     * @type {?string[]}
     */
    if (Array.isArray(settings.owners)) {
      if (settings.owners.length) {
        this.config.owners = settings.owners;
      } else {
        // Do nothing
      };
    } else {
      // Do nothing
    };


    /**
     * Logs for this bot.
     * @type {array}
     */
    this.logs = [];

    // Execute these internal functions once the bot is ready!!
    this.once('ready', () => {
      this.bootTime = Math.round(performance.now());

      this.loadSlashCommands("/slashCommands");
      this.loadComponents("/components");
      return;
    });


    // increment message count whenever this client emits the message event
    this.on('messageCreate', message => {
      if (message.author.id === this.user.id) {
        return this.messages.sent++;
      } else {
        return this.messages.received++;
      };
    });
  };

  /**
 * Load all loadComponent from the specified directory
 * @param {string} directory
 */
  loadComponents(directory) {
    ComponentsLoader(this, directory)
  };

  /**
* Load all loadComponent from the specified directory
* @param {string} directory
*/
  loadSlashCommands(directory) {
    SlashCommandLoader(this, directory)
  }

  /**
   * Register Component file in the client
   * @param {import("../util/types/baseComponent")} Component
   */
  loadComponent(Component) {

    if (Component?.enabled) {
      /*
      if (this.Component.has(Component.name)) {
        throw new Error(`Component ${Component.name} already registered`);
      }*/
      this.ComponentsAction.set(Component.name, Component);
    } else {
      this.logger.debug(`Skipping Component ${Component.name}. Disabled!`);
    }


  };

  /**
   * Bulk add collections to the collection manager
   * @param {...CollectionName} string The name of collections to add
   * @returns {WolfyClient}
   */
  defineCollections(collection = []) {
    if (!Array.isArray(collection)) {
      throw new TypeError(`Client#defineCollections parameter expected type Array, received ${typeof collection}`);
    };

    for (const col of collection) {
      this.collections.add(col);
    };

    return this;
  };

  /**
   * Attach a listener for process events.
   * @param {...string} event The process event name to listen to
   * @param {ProcessEventConfig} config The configuration for the process events.
   * @returns {void}
   */
  listentoProcessEvents(events = [], config = {}) {
    if (!Array.isArray(events)) {
      return;
    };

    if (typeof config !== 'object') {
      config = {};
    };

    for (const event of events) {
      process.on(event, (...args) => {
        if (config.ignore && typeof config.ignore === 'boolean') {
          return;
        } else {
          return processEvents(event, args, this);
        };
      });
    };
  };

  /**
  * Executes a function once and then loops it
  * @param {function} function The function to execute
  * @param {number} delay The delay between each execution
  * @param {params} parameter Additional parameters for the Interval function
  * @returns {Timeout} timeout returns a Timeout object
  */
  loop(fn, delay, ...param) {
    fn();
    return setInterval(fn, delay, ...param);
  };

  /**
   * Logging function that logs the interactions users do with Wolfy client
   * @param {import("../struct/Client")} client the client instance
   * @param {import("discord.js").Message | import("discord.js").Interaction} e the type of event
   * @param {Boolean} isSlash is the event a slash command
   * @param {string} message the console message
   */
  async Log(client, e, isSlash = false, message) {
    const user = e.user ? e.user : e.author;
    const guild = e.guild ? e.guild : "DM";
    const guildId = guild != "DM" ? guild.id : null;
    const Debug =
      (client.channels.cache.get(client.config.channels.debug)) ||
      (client.channels.cache.get("1204206801495793735"));
    const cmdName = isSlash
      ? e.commandName
      : e.content.slice(client.config.prefix.length).trim();

    const logEm = new EmbedBuilder()
      .setTitle("System Log")
      .setAuthor({
        name: user.username,
        iconURL: user.displayAvatarURL({ dynamic: true }),
      })
      .setThumbnail(guild != "DM" ? guild.iconURL({ dynamic: true }) : user.displayAvatarURL({ dynamic: true }))
      .addFields(
        {
          name: "User",
          value: `**${user.username}**(\`${user.id}\`)`,
          inline: true,
        },
        {
          name: "Server",
          value: `**${guild}**${guildId ? `(\`${guildId}\`)` : ""}`,
          inline: true,
        },
        {
          name: "Action Type",
          value: `**${isSlash ? "Slash Command" : "Message"}**`,
          inline: false,
        },
        {
          name: "Action name",
          value: cmdName || "Unknown",
          inline: false,
        }
      )
      .setTimestamp()
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setColor("#2F3136");

    console.log(message);
    this.logs.push(message);
    const botname = client.user.username;
    const webhooks = await Debug.fetchWebhooks();
    Embedlogs.push(logEm);
    setTimeout(async function () {
      let webhook = webhooks.filter((w) => w.token).first();
      if (!webhook) {
        webhook = await Debug.createWebhook({
          name: botname,
          avatar: client.user.displayAvatarURL({
            extension: "png",
            dynamic: true,
            size: 128,
          }),
        })(botname, {
          avatar: client.user.displayAvatarURL({
            extension: "png",
            dynamic: true,
            size: 128,
          }),
        });
      } else if (webhooks.size <= 10) {
        // Do no thing...
      }
      while (Embedlogs.length > 0) {
        webhook.send({ embeds: Embedlogs.slice(0, 10) }).catch(() => { });
        Embedlogs = Embedlogs.slice(10); // Remove the sent embeds from the logs
      }
    }, 40000);
  };


  /**
  * get logs
  * @returns {string<logs>} logged messages for this bot
  */
  getlogs() {
    return this.logs.join('\n') || 'Logs are currently Empty!'
  };

  /**
   * The prefix this client instance has been using
   * @type {ClientPrefix}
   * @readonly
   */
  get prefix() {
    return this.config.prefix;
  };

  /**
   * The owners of this bot
   * @type {ClientOwners[]}
   * @readonly
   */
  get owners() {
    return this.config.owners;
  };

  /**
   * The version of this app and the library its been using
   * @type {Version{}}
   * @readonly
   */
  get version() {
    return {
      library: version,
      client: require(`${process.cwd()}/package.json`).version
    };
  };
};