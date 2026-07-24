const schema = require("../../schema/Economy-Schema");
const text = require("../../util/string");
const { SlashCommandBuilder } = require("@discordjs/builders");

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "transfer",
    description: "Transfer credits from your wallet to your friends!",
    dmOnly: false,
    guildOnly: true,
    cooldown: 0,
    group: "Economy",
    requiresDatabase: true,
    clientPermissions: [],
    permissions: [],
    options: [
      {
        type: 6, // USER
        name: 'user',
        description: 'User to transfer credits to',
        required: true
      },
      {
        type: 4, // INTEGER
        name: 'quantity',
        description: 'The total credits to transfer',
        required: true
      },
      {
        type: 3, // STRING
        name: 'reason',
        description: 'Enter the reason for the transfer'
      }
    ]
  },
  async execute(client, interaction) {
    const { guild, options } = interaction;

    const user = options.getUser("user");
    let quantity = options.getInteger("quantity") || 100;

    let amount = Math.round(quantity) || "Nothing";

    let reason = options.getString("reason");

    if (!user) {
      return interaction.reply({
        content: "\\❌ | User could not be found! Please ensure the supplied ID is valid.",
        ephemeral: true
      });
    }

    if (user.id === interaction.user.id) {
      return interaction.reply({
        content: `<a:Wrong:812104211361693696> | ${interaction.user}, You cannot transfer credits to yourself!`,
        ephemeral: true
      });
    }

    if (user.id === client.user.id) {
      return interaction.reply({
        content: `<a:Wrong:812104211361693696> | ${interaction.user}, You cannot transfer credits to me!`,
        ephemeral: true
      });
    }

    if (!amount || amount === "Nothing" || isNaN(amount)) {
      return interaction.reply({
        content: `\\❌ **${interaction.user.tag}**, \`${amount}\` is not a valid amount!`,
        ephemeral: true
      });
    } else if (amount < 100 || amount > 50000) {
      return interaction.reply({
        content: `\\❌ **${interaction.user.tag}**, only valid amount to transfer is between **100** and **50,000**!`,
        ephemeral: true
      });
    }

    let data;
    let FriendData;
    try {
      data = await schema.findOne({
        userID: interaction.user.id,
      });
      FriendData = await schema.findOne({
        userID: user.id,
      });
      if (!data) {
        data = await schema.create({
          userID: interaction.user.id,
        });
      } else if (!FriendData) {
        FriendData = await schema.create({
          userID: user.id,
        });
      }
    } catch (err) {
      interaction.reply({
        content: `💢 [DATABASE_ERR]: The database responded with error: ${err.name}`,
        ephemeral: true
      });
      return client.logDetailedError({
        error: err,
        eventType: "DATABASE_ERR",
        interaction: interaction
      })
    }

    if (Math.ceil(amount * 1.1) > data.credits) {
      interaction.reply({
        content: `\\❌ **${interaction.user.tag}**, Insufficient credits! You only have **${data.credits}** in your wallet! (10% fee applies)`,
        ephemeral: true
      });
    } else {
      const amountToAdd = amount / 1.1;
      await interaction.reply({
        content: `<a:iNFO:853495450111967253> **${interaction.user.tag}**, Are you sure you want to transfer **${text.commatize(amountToAdd)}** to ${user}(10% fee applies)? Your new balance will be **${Math.floor(data.credits - amount * 1.1)}**! \`(y/n)\``,
      });
      const filter = (_message) =>
        interaction.user.id === _message.author.id &&
        ["y", "n", "yes", "no"].includes(_message.content.toLowerCase());

      const proceed = await interaction.channel
        .awaitMessages({ filter, max: 1, time: 30000, errors: ["time"] })
        .then((collected) =>
          ["y", "yes"].includes(collected.first().content.toLowerCase())
            ? true
            : false
        )
        .catch(() => false);

      if (!proceed) {
        return interaction.editReply({
          content: `<a:Wrong:812104211361693696> | ${interaction.user}, Cancelled the \`transfer\` command!`,
          ephemeral: true
        });
      }

      data.credits -= Math.floor(amount * 1.1);
      FriendData.credits += Math.floor(amountToAdd);
      user
        .send({
          content: `\`\`\`${interaction.user.tag} transferred ${text.commatize(amountToAdd)} to you\n${reason ? reason : ""}\`\`\``,
        })
        .catch(() => null);
      return Promise.all([data.save(), FriendData.save()])
        .then(() =>
          interaction.editReply({
            content: `<a:Money:836169035191418951> **${interaction.user.tag}**, Successfully transferred \`${text.commatize(Math.floor(amount))}\` to **${user}**!`
          })
        )
        .catch((err) =>
          interaction.editReply({
            content: `💢 [DATABASE_ERR]: The database responded with error: ${err.name}`,
            ephemeral: true
          })
        );
    }
  },
};