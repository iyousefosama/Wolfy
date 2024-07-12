const discord = require("discord.js");
const {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ChannelType,
} = require("discord.js");
const schema = require("../../schema/GuildSchema");

/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
  name: "smrole",
  aliases: [
    "SelectMenuRole",
    "smrole",
    "SMROLE",
    "SMRole",
    "SelectMenuRoles",
    "selectmenurole",
  ],
  dmOnly: false, //or false
  guildOnly: true, //or false
  args: true, //or false
  usage: "(Roles count)",
  group: "setup",
  description: "Setup the select menu role list!",
  cooldown: 5, //seconds(s)
  guarded: false, //or false
  permissions: ["ManageRoles"],
  clientPermissions: ["ManageRoles"],
  examples: ["1", "6"],
  
  async execute(client, message, [quantity]) {
    let data;
    try {
      data = await schema.findOne({
        GuildID: message.guild.id,
      });
      if (!data) {
        data = await schema.create({
          GuildID: message.guild.id,
        });
      }
    } catch (err) {
      console.log(err);
      message.channel.send({
        content: `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`,
      });
    }

    quantity = Math.round(quantity);

    if (!quantity || quantity < 1 || quantity > 6) {
      return message.reply({
        content: `<a:Wrong:812104211361693696> | ${message.author}, Please provide the quantity of drop down menu roles which must be greater than one (1) and less than six (6)`,
      });
    }

    async function resetSmRoles(data, message) {
      await message.channel.send({
        content: `<a:Loading:841321898302373909> **${message.author.tag}** This server already has another select menu role, are you sure you want to delete it to create a new one? \`(y/n)\``,
      });

      const filter = (_message) =>
        message.author.id === _message.author.id &&
        ["y", "n", "yes", "no"].includes(_message.content.toLowerCase());

      const proceed = await message.channel
        .awaitMessages({
          filter,
          max: 1,
          time: 30000,
          errors: ["time"],
        })
        .then((collected) =>
          ["y", "yes"].includes(collected.first().content.toLowerCase())
            ? true
            : false
        )
        .catch(() => false);

      if (!proceed) {
        return message.channel.send({
          content: `<a:Wrong:812104211361693696> | ${message.author}, Cancelled the \`smRole\` command!`,
        });
      }

      data.Mod.smroles.value1 = null;
      data.Mod.smroles.value2 = null;
      data.Mod.smroles.value3 = null;
      data.Mod.smroles.value4 = null;
      data.Mod.smroles.value5 = null;
      data.Mod.smroles.value6 = null;
      await data.save();
      return message.channel
        .send({
          content: `\\✔️ ${message.author}, Successfully reset all values at the database!`,
        })
        .catch((err) =>
          message.channel.send({
            content: `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`,
          })
        );
    }

    async function getSelectedRole(message, filter) {
      await message.reply(
        `<a:Loading:841321898302373909> **${message.author}**, Please send the \`role-id\`!`
      );

      let receivedMessage = await message.channel.awaitMessages({
        filter,
        max: 1,
      });

      if (
        receivedMessage.first().content == "cancel"
      ) {
        await message.channel.send({
          content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`,
        });
        return null;
      }

      let selectedRoleId = receivedMessage.first().content;
      let role =
        message.guild.roles.cache.get(selectedRoleId) ||
        message.guild.roles.cache.find((r) => r.id === selectedRoleId);

      return role;
    }
    async function MessageInput(message, filter) {

      let receivedMessage = await message.channel.awaitMessages({
        filter,
        max: 1,
      });

      if (
        receivedMessage.first().content == "cancel"
      ) {
        await message.channel.send({
          content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`,
        });
        return null;
      }

      return receivedMessage.first().content;;
    }

    async function getEmoji(message, _filter) {
      const msg = await message.reply(
        `<a:Loading:841321898302373909> **${message.author}**, Please react to this message with the emoji of role (From the server)`
      );

      // Wait for the user to react to the message
      let Emoji;
      await msg
        .awaitReactions({
          filter: _filter,
          max: 1,
          time: 60000,
        })
        .then(async (collected) => {
          if (collected.first()?.emoji) {
            const Colemoji = collected.first()?.emoji;

            Emoji = Colemoji;
          } else {
            await message.channel.send({
              content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`Select Menu role\` command!`,
            });
          }
        })
        .catch(async (err) => {
          message.reply(
            "<:error:888264104081522698>  **|** **${message.author.tag}**, Timeout reached. Cancelled the `Select Menu role` command!"
          );
        });

      return Emoji;
    }

    if (data.Mod.smroles.value1) {
      await resetSmRoles(data, message);
    } else {
      // Do nothing...
    }

    const FinallEmb = new discord.EmbedBuilder()
      .setAuthor({
        name: message.author.tag,
        icon: message.author.displayAvatarURL({ dynamic: true, size: 2048 }),
      })
      .setColor("#e6a54a")
      .setDescription(
        `<a:Right:877975111846731847> **${message.author.username}**, What the channel to send the menu to?\n\n<:1_:890489883032952876> Current channel\n<:2_:890489925059887134> Another channel`
      )
      .setFooter({
        text: message.author.tag,
        icon: message.author.displayAvatarURL({ dynamic: true, size: 2048 }),
      })
      .setTimestamp();

    let Arr = [];
    for (let i = 1; i <= quantity; i++) {
      const filter = (m) => m.author.id === message.author.id;
      const EmjFilter = (reaction, user) => user.id === message.author.id;

      const role = await getSelectedRole(message, filter);
      const emoji = await getEmoji(message, EmjFilter);
      const inServer = emoji?.id && emoji?.name;

      if (!role) {
        return message.channel.send(
          `\\❌ **${message.author}**, Invalid Role - Please supply the mention of the role or the id!`
        );
      } else if (!emoji) {
        return message.channel.send(
          `\\❌ **${message.author}**, Invalid emoji - Please supply a valid emoji!`
        );
      }

      await Arr.push({
        label: role.name,
        description: `Choose this option to get role ${role.name}!`,
        value: role.id,
        emoji: inServer ? emoji.id : emoji.name,
      });

      data.Mod.smroles["value" + i] = role.id || null;
    }

    const row = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("menu_selectRole")
        .setPlaceholder("Nothing selected!")
        .addOptions(Arr)
    );

    await message.channel.send({ embeds: [FinallEmb], ephemeral: true });

    const filter = (msg) => msg.author.id == message.author.id;

    const msgI = await MessageInput(message, filter);

    if (msgI == "1") {
      await data
        .save()
        .then(() => {
          message.channel.send({
            content: "<:Tag:836168214525509653> **Choose your roles!**",
            components: [row],
          });
        })
        .catch(() =>
          message.channel.send(
            `\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`
          )
        );
    } else if (msgI == "2") {
      const filter = (msg) => msg.author.id == message.author.id;

      await message.reply({
        content: `**${message.author.username}**, type the channel id!`,
        ephemeral: true,
      });

      let thchannel = await message.channel.awaitMessages({ filter, max: 1 });
      thchannel = thchannel.first().content;

      Embedchannel = message.guild.channels.cache.get(thchannel);

      if (
        !Embedchannel ||
        (Embedchannel.type !== ChannelType.GuildText &&
          Embedchannel.type !== ChannelType.GuildAnnouncement)
      ) {
        return message.channel.send(
          `\\❌ **${message.member.displayName}**, please provide a valid channel ID.`
        );
      } else if (
        !Embedchannel.permissionsFor(message.guild.members.me).has(
          "SendMessages"
        )
      ) {
        return message.channel.send(
          `\\❌ **${message.member.displayName}**, I need you to give me permission to send messages on ${Embedchannel} and try again.`
        );
      }

      await data
        .save()
        .then(() => {
          Embedchannel.send({
            content: "<:Tag:836168214525509653> **Choose your roles!**",
            components: [row],
          });
        })
        .catch(() =>
          message.channel.send(
            `\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`
          )
        );

      message.channel.send(
        `\\✔️ **${message.author}**, Successfully send the \`select-menu-role\` to ${Embedchannel}!`
      );
    } else {
      return message.reply({
        content: `<:error:888264104081522698>  **|**  That is an invalid response. Please try again.`,
        ephemeral: true,
      });
    }
  },
};
