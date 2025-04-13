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
        content: client.language.getString("USER_NOT_FOUND", interaction.guild?.id, { user: interaction.user }),
        ephemeral: true
      });
    }

    if (user.id === interaction.user.id) {
      return interaction.reply({
        content: client.language.getString("ECONOMY_TRANSFER_SELF", interaction.guild?.id, { user: interaction.user }),
        ephemeral: true
      });
    }

    if (user.id === client.user.id) {
      return interaction.reply({
        content: client.language.getString("ECONOMY_TRANSFER_BOT", interaction.guild?.id, { user: interaction.user }),
        ephemeral: true
      });
    }

    if (!amount || amount === "Nothing" || isNaN(amount)) {
      return interaction.reply({
        content: client.language.getString("ECONOMY_TRANSFER_INVALID_AMOUNT", interaction.guild?.id, { 
          username: interaction.user.tag, 
          amount: amount 
        }),
        ephemeral: true
      });
    } else if (amount < 100 || amount > 50000) {
      return interaction.reply({
        content: client.language.getString("ECONOMY_TRANSFER_AMOUNT_LIMIT", interaction.guild?.id, { 
          username: interaction.user.tag
        }),
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
        content: client.language.getString("ERR_DB", interaction.guild?.id, { error: err.name }),
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
        content: client.language.getString("ECONOMY_TRANSFER_INSUFFICIENT", interaction.guild?.id, { 
          username: interaction.user.tag, 
          credits: data.credits 
        }),
        ephemeral: true
      });
    } else {
      const amountToAdd = amount / 1.1;
      await interaction.reply({
        content: client.language.getString("ECONOMY_TRANSFER_CONFIRM", interaction.guild?.id, { 
          username: interaction.user.tag,
          amount: text.commatize(amountToAdd),
          recipient: user,
          balance: Math.floor(data.credits - amount * 1.1)
        }),
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
          content: client.language.getString("ECONOMY_TRANSFER_CANCELLED", interaction.guild?.id, { 
            user: interaction.user 
          }),
          ephemeral: true
        });
      }

      data.credits -= Math.floor(amount * 1.1);
      FriendData.credits += Math.floor(amountToAdd);
      user
        .send({
          content: client.language.getString("ECONOMY_TRANSFER_DM", interaction.guild?.id, { 
            sender: interaction.user.tag,
            amount: text.commatize(amountToAdd),
            reason: reason ? reason : ""
          }),
        })
        .catch(() => null);
      return Promise.all([data.save(), FriendData.save()])
        .then(() =>
          interaction.editReply({
            content: client.language.getString("ECONOMY_TRANSFER_SUCCESS", interaction.guild?.id, { 
              username: interaction.user.tag,
              amount: text.commatize(Math.floor(amount)),
              recipient: user
            })
          })
        )
        .catch((err) =>
          interaction.editReply({
            content: client.language.getString("ERR_DB", interaction.guild?.id, { error: err.name }),
            ephemeral: true
          })
        );
    }
  },
};
