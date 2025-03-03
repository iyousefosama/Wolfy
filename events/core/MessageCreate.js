const { Collection, PermissionsBitField, ChannelType, EmbedBuilder } = require("discord.js");
const userSchema = require("../../schema/user-schema");
const schema = require("../../schema/GuildSchema");
const block = require("../../schema/blockcmd");
const consoleUtil = require("../../util/console");
const { ErrorEmbed } = require("../../util/modules/embeds");
const { commandsManager, level, wordFilter, linkProtection } = require('../../util/functions/moderationUtils');
const { handleMessageCommandcommand} = require("../../Handler/CommandOptions");

const BEV = require("../../util/types/baseEvents");

/** @type {BEV.BaseEvent<"messageCreate">} */
module.exports = {
  name: "messageCreate",
  async execute(client, message) {
    if (message.author == client.user) return;
    if (message.author.bot) {
      return;
    }
    
    let data;
    let prefix;
    if (message.guild) {
      if (client.database?.connected) {
        // Start Leveling up function at ../util/functions/LevelTrigger bath
        level(message);
        // Start Warning for badwords function at ../util/functions/BadWordsFilter bath
        wordFilter(client, message);
        // Start anti-links protection function at ../util/functions/AntiLinks bath
        linkProtection(client, message);

        try {
          data = await schema.findOne({
            GuildID: message.guild.id,
          });
        } catch (err) {
          console.log(err);
          message.channel.send(
            `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`
          );
        }
      }

      const serverprefix = data?.prefix || "Not Set";

      if (message.content === "prefix") {
        return message.reply(client.language.getString(message.guild.id, "PREFIX", {
          PREFIX: client.prefix,
          SERVERPREFIX: serverprefix,
        }));
      }
    }
    if (message.channel?.type === ChannelType.DM) {
      prefix = client.prefix;
    } else if (message.content.startsWith("wolfy")) {
      prefix = "wolfy ";
    } else if (!data || data.prefix == null) {
      prefix = client.prefix;
    } else if (data && data.prefix) {
      prefix = data.prefix;
    };

    if (!prefix || !message.content.startsWith(prefix)) {
      return { executed: false, reason: "PREFIX" };
    }
    const args = message.content.slice(prefix.length).split(/ +/g);
    const commandName = args.shift().toLowerCase();
    const cmd =
      client.commands.get(commandName) ||
      //+ aliases: [""],
      client.commands.find(
        (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
      );

    if (commandName.length < 1) return { executed: false, reason: "NOT_FOUND" };
    if (!cmd)
      return (
        message.channel.send({
          content: `\\❌ | ${message.author}, There is no command with name or alias \`${commandName}\`!`,
        }),
        { executed: false, reason: "NOT_FOUND" }
      );
    //+ Blacklisted
    try {
      UserData = await userSchema.findOne({
        userId: message.author.id,
      });
    } catch (err) {
      console.log(err);
      message.channel.send(
        `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`
      );
    }
    try {
      // Permissions: To check for default permissions in the guild
      if (message.guild) {
        if (
          !message.channel
            ?.permissionsFor(message.guild.members.me)
            .has(PermissionsBitField.Flags.SendMessages)
        ) {
          return { executed: false, reason: "PERMISSION_SEND" };
        } else {
          // Do nothing..
        }
        if (
          !message.channel
            ?.permissionsFor(message.guild.members.me)
            .has(PermissionsBitField.Flags.ViewChannel)
        ) {
          return { executed: false, reason: "PERMISSION_VIEW_CHANNEL" };
        } else {
          // Do nothing..
        }
      }

      const continueCommand = await handleMessageCommandcommand(message, cmd, args, client);
      if (!continueCommand) return;

      try {
        cmd.execute(client, message, args, { executed: true }).then(() => {
          // Start CmdManager function at ../util/functions/Manager bath
          commandsManager(client, message, cmd);
          client.LogCmd(message, false, `${new Date()} ${message.author.tag}|(${message.author.id}) in ${message.guild
            ? `${message.guild.name}(${message.guild.id}) | #${message.channel.name}(${message.channel.id})`
            : "DMS"
            } sent: ${message.content}`)
        });
      } catch (error) {
        consoleUtil.error(error, "message-execute");
        message.reply("An error occurred while running this command");
      }
    } catch (err) {
      message.reply(
        `<a:Settings:841321893750505533> There was an error in the console.\n\`Please report this with a screenshot to developers\``
      );
      console.log(err);
    }
  },
};
