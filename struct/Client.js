'use strict';

const { Client, Intents, Collection, version } = require('discord.js');
const { performance } = require('perf_hooks');

const Mongoose = require(`./Mongoose`);
const processEvents = require(`../util/processEvents`);

const consoleUtil = require(`../util/console`);

/**
 * Optimized hub for interacting with the discord API
 * @extends {Client}
 */

module.exports = class WolfyClient extends Client{
  /**
   * @param {ClientSettings} [settings] for this client, including the ClientOptions [options] for the client
   */
  constructor(settings = {}){
    super(settings.client);

    // Initialize bot, log on terminal when instantiated.
    console.log(`Initializing the client. Please wait...`);

    /**
     * The default prefix this bot instance will be using.
     * @type {?string}
     */
    if (typeof settings.prefix !== 'string'){
      settings.prefix = 'w!';
    };

    if (!this.token && 'TOKEN' in process.env){
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

    if (settings.database?.enable === true){
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
    if (typeof settings.channels?.debug === 'string'){
      this.config.channels.debug = settings.channels.debug;
    } else {
      // Do nothing...
    };

    /**
     * Channel ID used by the bot to send vote messages
     * @type {?Snowflake}
     */
    if (typeof settings.channels?.votes === 'string'){
      this.config.channels.votes = settings.channels.votes;
    } else {
      // Do nothing...
    };

        /**
     * Channel ID used for the chatbot
     * @type {?Snowflake}
     */
         if (typeof settings.channels?.chatbot === 'string'){
          this.config.channels.chatbot = settings.channels.chatbot;
        } else {
          // Do nothing...
        };

     /**
     * 
     * @type {?Boolean}
     */
         if (typeof settings.loadSlashsGlobal === 'boolean'){
          this.config.loadSlashsGlobal = settings.loadSlashsGlobal;
        } else {
          // Do nothing...
        };

    /**
     * Array of {@link User} IDs that will be considered by the bot it's owner.
     * Will be used by {@link CommandHandler} when attempting to read ownerOnly commands.
     * @type {?string[]}
     */
    if (Array.isArray(settings.owners)){
      if (settings.owners.length){
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
      return;
    });

    // increment message count whenever this client emits the message event
    this.on('messageCreate', message => {
      if (message.author.id === this.user.id){
        return this.messages.sent++;
      } else {
        return this.messages.received++;
      };
    });
  };
  

  /**
   * Bulk add collections to the collection manager
   * @param {...CollectionName} string The name of collections to add
   * @returns {WolfyClient}
   */
  defineCollections(collection = []){
    if (!Array.isArray(collection)){
      throw new TypeError(`Client#defineCollections parameter expected type Array, received ${typeof collection}`);
    };

    for (const col of collection){
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
   listentoProcessEvents(events = [], config = {}){
    if (!Array.isArray(events)){
      return;
    };

    if (typeof config !== 'object'){
      config = {};
    };

    for (const event of events){
      process.on(event, (...args) => {
        if (config.ignore && typeof config.ignore === 'boolean'){
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
  loop(fn, delay, ...param){
    fn();
    return setInterval(fn, delay, ...param);
  };

  
  /**
  * get logs
  * @returns {string<logs>} logged messages for this bot
  */
  getlogs(){
    return this.logs.join('\n') || 'Logs are currently Empty!'
  };

  /**
   * The prefix this client instance has been using
   * @type {ClientPrefix}
   * @readonly
   */
  get prefix(){
    return this.config.prefix;
  };

  /**
   * The owners of this bot
   * @type {ClientOwners[]}
   * @readonly
   */
  get owners(){
    return this.config.owners;
  };

  /**
   * The version of this app and the library its been using
   * @type {Version{}}
   * @readonly
   */
  get version(){
    return {
      library: version,
      client: require(`${process.cwd()}/package.json`).version
    };
  };
};