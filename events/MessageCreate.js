const discord = require("discord.js");
const { Collection, PermissionsBitField, ChannelType } = require("discord.js");
const text = require("../util/string");
const userSchema = require("../schema/user-schema");
const schema = require("../schema/GuildSchema");
const cooldowns = new Collection();
const CoolDownCurrent = {};
const leveling = require("../functions/LevelTrigger");
const WordW = require("../functions/BadWordsFilter");
const AntiLinksProtection = require("../functions/AntiLinks");
const cmdManager = require("../functions/Manager");
const Chatbot = require("../functions/ChatBot");
const logSys = require("../functions/logSys");

module.exports = {
  name: "messageCreate",
  async execute(client, message) {
    if (message.author == client.user) return;
    if (message.author.bot) {
      return;
    }

    const attachment = message.attachments?.first();

    let data;
    let prefix;
    if (message.guild) {
      // Start Leveling up function at ../functions/LevelTrigger bath
      leveling.Level(message);
      // Start Warning for badwords function at ../functions/BadWordsFilter bath
      WordW.badword(client, message);
      // Start anti-links protection function at ../functions/AntiLinks bath
      AntiLinksProtection.checkMsg(client, message);
      // Start ChatBot function at ../functions/ChatBot bath
      Chatbot.chat(client, message);

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
      const serverprefix = data?.prefix || "Not Set";

      if (message.content === "prefix") {
        return message.channel.send(
          `**${message.author}**, My prefix is \`${client.prefix}\`, The custom prefix is \`${serverprefix}\`.`
        );
      } else {
        // Do nothing..
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
    } else {
      // Do nothing..
    }

    if (!prefix || !message.content.startsWith(prefix)) {
      return { executed: false, reason: "PREFIX" };
    }
    const args = message.content.slice(prefix.length).split(/ +/g);
    if (!args.length)
      return message.channel.send({
        content: `You didn't pass any command to reload, ${message.author}!`,
      });
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
        if (
          !message.channel
            ?.permissionsFor(message.guild.members.me)
            .has(PermissionsBitField.Flags.ReadMessageHistory)
        ) {
          return message.channel.send({
            content:
              '"Missing Access", the bot is missing the `READ_MESSAGE_HISTORY` permission please enable it!',
          });
        } else {
          // Do nothing..
        }
        if (
          !message.channel
            ?.permissionsFor(message.guild.members.me)
            .has(PermissionsBitField.Flags.EmbedLinks)
        ) {
          return message.channel.send({
            content:
              '"Missing Permissions", the bot is missing the `EMBED_LINKS` permission please enable it!',
          });
        } else {
          // Do nothing..
        }
      }

      //+ args: true/false,
      if (cmd.args && !args.length) {
        let desc = `You didn't provide any arguments`;

        //+ usage: '<> <>',
        if (cmd.usage) {
          desc += `, The proper usage would be:\n\`${prefix}${cmd.name} ${cmd.usage}\``;
        }
        if (cmd.examples && cmd.examples.length !== 0) {
          desc += `\n\nExamples:\n${cmd.examples
            .map((x) => `\`${prefix}${cmd.name} ${x}\n\``)
            .join(" ")}`;
        }

        const NoArgs = new discord.EmbedBuilder()
          .setDescription(desc)
          .setColor("Red");
        return message.channel.send({ embeds: [NoArgs] });
      }

      //+ cooldown 1, //seconds(s)
      if (!cooldowns.has(cmd.name)) {
        cooldowns.set(cmd.name, new discord.Collection());
      }

      const now = Date.now();
      const timestamps = cooldowns.get(cmd.name);
      const cooldownAmount = (cmd.cooldown || 3) * 1000;

      if (timestamps.has(message.author.id)) {
        const expirationTime =
          timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
          if (CoolDownCurrent[message.author.id]) {
            return;
          }
          const timeLeft = (expirationTime - now) / 1000;
          CoolDownCurrent[message.author.id] = true;
          return message.channel
            .send({
              content: ` **${
                message.author.username
              }**, please cool down! (**${timeLeft.toFixed(
                0
              )}** second(s) left)`,
            })
            .then((msg) => {
              setTimeout(() => {
                delete CoolDownCurrent[message.author.id];
                msg.delete().catch(() => null);
              }, 4000);
            });
        }
      }
      timestamps.set(message.author.id, now);
      setTimeout(
        () => timestamps.delete(message.author.id),
        cooldownAmount,
        delete CoolDownCurrent[message.author.id]
      );
      function getPermissionName(permission) {
        for (const perm of Object.keys(PermissionsBitField.Flags)) {
          if (PermissionsBitField.Flags[perm] === permission) {
            return perm;
          }
        }
        return "UnknownPermission";
      }
      //+ permissions: [""],
      if (cmd.permissions) {
        if (message.guild && !client.owners.includes(message.author.id)) {
          const authorPerms = message.channel.permissionsFor(message.member);
          if (!authorPerms || !authorPerms.has(cmd.permissions)) {
            const permsNames = cmd.permissions?.map((perm) =>
              getPermissionName(perm)
            );
            const PermsEmbed = new discord.EmbedBuilder()
              .setColor(`Red`)
              .setDescription(
                `<a:pp802:768864899543466006> You don't have \`${text.joinArray(
                  permsNames
                )}\` permission(s) to use ${cmd.name} command.`
              );
            return message.channel.send({ embeds: [PermsEmbed] });
          }
        }
      }

      //+ clientPermissions: [""],
      if (cmd.clientPermissions) {
        if (message.guild) {
          const clientPerms = message.channel.permissionsFor(
            message.guild.members.me
          );
          if (!clientPerms || !clientPerms.has(cmd.clientPermissions)) {
            const ClientPermsEmbed = new discord.EmbedBuilder()
              .setColor(`Red`)
              .setDescription(
                `<a:pp802:768864899543466006> The bot is missing \`${text.joinArray(
                  cmd.clientPermissions
                )}\` permission(s)`
              );
            return message.channel.send({ embeds: [ClientPermsEmbed] });
          }
        }
      }

      //+ guildOnly: true/false,
      if (cmd.guildOnly && message.channel.type === ChannelType.DM) {
        const NoDmEmbed = new discord.EmbedBuilder()
          .setColor(`Red`)
          .setDescription(
            `<a:pp802:768864899543466006> I can\'t execute that command inside DMs!`
          );
        return message.reply({ embeds: [NoDmEmbed] });
      }

      //+ dmOnly: true/false,
      if (cmd.dmOnly && message.channel.type === ChannelType.GuildText) {
        const NoGuildEmbed = new discord.EmbedBuilder()
          .setColor(`Red`)
          .setDescription(
            `<a:pp802:768864899543466006> I can\'t execute that command inside the server!`
          );
        return message.channel.send({ embeds: [NoGuildEmbed] });
      }

      if (cmd.guarded) {
        const GuardedEmbed = new discord.EmbedBuilder()
          .setColor(`Red`)
          .setDescription(
            `<a:pp802:768864899543466006> \`${cmd.name}\` is guarded!`
          );
        return message.channel.send({ embeds: [GuardedEmbed] });
      }

      if (cmd.OwnerOnly) {
        if (!client.owners.includes(message.author.id)) {
          const DevOnlyEmbed = new discord.EmbedBuilder()
            .setColor(`Red`)
            .setDescription(
              `<a:pp802:768864899543466006> **${message.author.username}**, the command \`${cmd.name}\` is limited for developers only!`
            );
          return message.channel.send({ embeds: [DevOnlyEmbed] });
        }
      }
      cmd.execute(client, message, args, { executed: true }).then(() => {
        // Start CmdManager function at ../functions/Manager bath
        cmdManager.manage(client, message, cmd);
        logSys(client, message, false);
        console.log(
          `${message.author.tag}|(${message.author.id}) in ${
            message.guild
              ? `${message.guild.name}(${message.guild.id}) | #${message.channel.name}(${message.channel.id})`
              : "DMS"
          } sent: ${message.content}`
        );
      });
    } catch (err) {
      message.reply(
        `<a:Settings:841321893750505533> There was an error in the console.\n\`Please report this with a screenshot to WOLF#1045\``
      );
      console.log(err);
    }
  },
};
