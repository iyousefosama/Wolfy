const Discord = require('discord.js');
const schema = require('../../schema/GuildSchema')
const { prefix } = require('../../config.json');

module.exports = {
    name: "setwelcomemsg",
    aliases: ["SetWelcomeMsg"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '',
    cooldown: 5, //seconds(s)
    guarded: false, //or false
    permissions: ["MANAGE_CHANNELS", "ADMINISTRATOR"],
    clientpermissions: ["MANAGE_CHANNELS", "ADMINISTRATOR"],
    async execute(client, message, [stats = '', ...args]) {
        
        let data;
        try{
            data = await schema.findOne({
                GuildID: message.guild.id
            })
            if(!data) {
            data = await schema.create({
                GuildID: message.guild.id
            })
            }
        } catch(err) {
            console.log(err)
            message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`)
        }

        stats = stats.toLowerCase();
        const event = 'welcome';
        const profile = client.guildProfiles.get(message.guild.id);
        const type = 'Member Greeter';
        const source = 'https://mai-san.ml/guides/';
        const variables = {
          '%TYPE': 'welcome',
          '%ACTION': 'joins',
          '%PREFIX': client.prefix,
          '%COMMAND': 'setwelcomemsg',
          '%STATE': 'Incoming',
          '%TITLE': 'Member Greeter'
        };
    
        if (!stats || !parser.checkStats(stats)){
          return parser.error(message, { type, source,
            title: errors.NO_OPTION_PARAM.title,
          });
        };
    
        //=========================================================//
        if (stats === 'default')
        {
          doc.greeter[event].type = 'default';
          return parser.saveDocument(doc, message, { type, source,
            title: parser.parseMessage(success.STATS_IS_DEF.title, variables),
            subtitle: parser.parseMessage(success.STATS_IS_DEF.subtitle, variables)
          }).then(() => {
            return profile.greeter[event].type = 'default';
          }).catch(() => {
            return sendError(message);
          });
        }
        else if (stats === 'msg=true')
        {
          if (!doc.greeter[event].message){
            return parser.error(message, { type, source,
              title: parser.parseMessage(errors.NO_TEXT_MESSAGE.title, variables),
              subtitle: parser.parseMessage(errors.NO_TEXT_MESSAGE.subtitle, variables)
            });
          } else {
            doc.greeter[event].type = 'msg';
            return parser.saveDocument(doc, message, { type, source,
              title: parser.parseMessage(success.TYPE_IS_MESSAGE.title, variables),
              subtitle: parser.parseMessage(success.TYPE_IS_MESSAGE.title, variables)
            }).then(() => {
              return profile.greeter[event].type = 'msg';
            }).catch(() => {
              return sendError(message);
            });
          };
        }
        else if (stats === 'embed=true')
        {
          if (!doc.greeter[event].embed || !Object.entries(doc.greeter[event].embed).length){
            return parser.error(message, { type, source,
              title: parser.parseMessage(errors.NO_EMBED.title, variables),
              subtitle: parser.parseMessage(errors.NO_EMBED.subtitle, variables)
            });
          } else {
            doc.greeter[event].type = 'embed'
            return parser.saveDocument(doc, message, { type, source,
              title: parser.parseMessage(success.TYPE_IS_EMBED.title, variables),
              subtitle: parser.parseMessage(success.TYPE_IS_EMBED.subtitle, variables)
            }).then(() => {
              return profile.greeter[event].type = 'embed';
            }).catch(() => {
              return sendError(message);
            })
          };
        }
        else if (stats === 'msg=set')
        {
          if (!args.length){
            return parser.error(message, { type, source,
              title: parser.parseMessage(errors.MESSAGE_SET_NO_ARGS.title, variables),
              subtitle: parser.parseMessage(errors.MESSAGE_SET_NO_ARGS.subtitle, variables)
            });
          } else {
            doc.greeter[event].message = args.join(' ');
            return parser.saveDocument(doc, message, { type, source,
              title: parser.parseMessage(success.MESSAGE_TEXT_SET.title, variables),
              subtitle: parser.parseMessage(success.MESSAGE_TEXT_SET.subtitle, variables),
            }).then(() => {
              return profile.greeter[event].message = args.join(' ');
            })
            .catch(() => {
              return sendError(message)
            });
          };
        }
        else if (stats === 'embed=set')
        {
          if (!args.length){
            return parser.error(message, { type, source,
              title: parser.parseMessage(errors.EMBED_SET_NO_ARGS.title, variables),
              subtitle: parser.parseMessage(errors.EMBED_SET_NO_ARGS.subtitle, variables)
            });
          } else {
            const status = parser.embed(args, doc.greeter[event].embed || {});
    
            if (status.error){
              return parser.error(message, { type, source,
                title: parser.parseMessage(errors[status.error].title, variables),
                subtitle: parser.parseMessage(errors[status.error].subtitle || status.fails.map(x => `\\⚠️ ${x}`).join('\n'), variables)
              });
            };
    
            doc.greeter[event].embed = status.embed
            return parser.saveDocument(doc, message, { type, source,
              title: parser.parseMessage(success.MESSAGE_EMBED_SET.title, variables),
              subtitle: [
                status.success.map(x => `\\✔️ ${x}`).join('\n'),
                status.fails.map(x => `\\⚠️ ${x}`).join('\n'),
                parser.parseMessage(success.MESSAGE_EMBED_SET.subtitle, variables)
              ].join('\n')
            }).then(() => {
              return profile.greeter[event].embed = status.embed;
            }).catch(() => {
              return sendError(message);
            });
          };
        }
        else
        {
          if (!profile.greeter[event].isEnabled)
          {
            return parser.error(message, { type, source,
              title: parser.parseMessage(errors.FEATURE_NOT_ENABLED.title, variables),
              subtitle: parser.parseMessage(errors.FEATURE_NOT_ENABLED.subtitle, variables)
            });
          }
          else if (!message.guild.channels.cache.get(profile.greeter[event].channel))
          {
            return parser.error(message, { type, source,
              title: parser.parseMessage(errors.CHANNEL_NOT_FOUND.title, variables),
              subtitle: parser.parseMessage(errors.CHANNEL_NOT_FOUND.subtitle, variables)
            });
          }
          else if (!profile.greeter[event].type)
          {
            return parser.error(message, { type, source,
              title: parser.parseMessage(errors.NO_TYPE.title, variables),
              subtitle: parser.parseMessage(errors.NO_TYPE.subtitle, variables)
            });
          }
          else if (stats === 'test')
          {
            message.react('✅');
            return client.emit('guildMemberAdd', message.member);
          } else {
            return message.channel.send(`\\❌ | **${message.author.tag}**, \`[${stats}]\` is not a valid option!`);
          };
        };
      }
    }
    
    function sendError(message){
      return message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`)
    };