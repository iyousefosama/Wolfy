const discord = require("discord.js");
const {
  ActionRowBuilder,
  ButtonBuilder,
  Collection,
  PermissionsBitField,
  ChannelType,
} = require("discord.js");
const schema = require("../../schema/GuildSchema");
const TicketSchema = require("../../schema/Ticket-Schema");
const cooldowns = new Collection();
const CoolDownCurrent = {};

exports.ticketBtn = async function (client, interaction) {
  //+ cooldown 1, //seconds(s)
  if (!cooldowns.has("btn")) {
    cooldowns.set("btn", new discord.Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get("btn");
  const cooldownAmount = (4 || 2) * 1000;

  if (timestamps.has(interaction.user.id)) {
    const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

    if (now < expirationTime) {
      if (CoolDownCurrent[interaction.user.id]) {
        return;
      }
      const timeLeft = (expirationTime - now) / 1000;
      CoolDownCurrent[interaction.user.id] = true;
      return await interaction
        .reply({
          content: ` **${
            interaction.user.username
          }**, please cool down! (**${timeLeft.toFixed(0)}** second(s) left)`,
          ephemeral: true,
          fetchReply: true,
        })
        .then(() => {
          setTimeout(() => {
            delete CoolDownCurrent[interaction.user.id];
          }, 3000);
        });
    }
  }
  timestamps.set(interaction.user.id, now);
  setTimeout(
    () => timestamps.delete(interaction.user.id),
    cooldownAmount,
    delete CoolDownCurrent[interaction.user.id]
  );

  await interaction.deferUpdate();
  let data;
  let TicketData;
  try {
    data = await schema.findOne({
      GuildID: interaction.guild.id,
    });
    TicketData = await TicketSchema.findOne({
      guildId: interaction.guild.id,
      UserId: interaction.user.id,
    });
    if (!data) {
      data = await schema.create({
        GuildID: interaction.guild.id,
      });
    }
    if (!TicketData) {
      TicketData = await TicketSchema.create({
        guildId: interaction.guild.id,
        UserId: interaction.user.id,
      });
    }
  } catch (err) {
    console.log(err);
    interaction.channel.send({
      content: `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`,
    });
  }

  // getting in the ticket category
  const categoryID = interaction.guild.channels.cache.get(
    data.Mod.Tickets.channel
  );
  let Channel = client.channels.cache.get(TicketData.ChannelId);

  // if there is no ticket category return
  if (!categoryID) {
    return interaction.followUp({
      content: `\\❌ **${interaction.member.displayName}**, I can't find the tickets channel please contact mod or use \`w!setticketch\` cmd`,
      ephemeral: true,
    });
  } else if (!data.Mod.Tickets.isEnabled) {
    return interaction.followUp({
      content: `\\❌ **${interaction.member.displayName}**, The **tickets** command is disabled in this server!`,
      ephemeral: true,
    });
  } else {
    // Do nothing..
  }

  var userName = interaction.user.username;

  var userDiscriminator = interaction.user.discriminator;

  let TicketAvailable = false;
  interaction.guild.channels.cache.forEach((channel) => {
    if (Channel && channel.id == Channel.id) {
      TicketAvailable = true;
      return;
    }
  });

  if (TicketAvailable)
    return interaction.followUp({
      content: "<:error:888264104081522698> **|** You already have a ticket!",
      ephemeral: true,
    });

  interaction.guild.channels
    .create({
      name: userName.toLowerCase() + "-" + userDiscriminator,
      type: ChannelType.GuildText,
      parent: categoryID,
      permissionOverwrites: [
        {
          id: interaction.guild.id,
          deny: [
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ViewChannel,
          ],
        },
        {
          id: interaction.user.id,
          allow: [
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.AttachFiles,
            PermissionsBitField.Flags.Connect,
            PermissionsBitField.Flags.AddReactions,
            PermissionsBitField.Flags.ReadMessageHistory,
          ],
        },
      ],
    })
    .then(async (channel) => {
      interaction.followUp({
        content: `<:Verify:841711383191879690> Successfully created ${channel} ticket!`,
        ephemeral: true,
      });
      const button = new ButtonBuilder()
        .setLabel(`Close`)
        .setCustomId("98418541981561")
        .setStyle("Secondary")
        .setEmoji("🔒");
      const row = new ActionRowBuilder().addComponents(button);
      var ticketEmbed = new discord.EmbedBuilder()
        .setAuthor({
          name: `Welcome in your ticket ${interaction.user.tag}`,
          iconURL: interaction.user.displayAvatarURL({
            dynamic: true,
            size: 2048,
          }),
        })
        .setDescription(
          `<:tag:813830683772059748> Send here your message or question!
                              
                              > <:Humans:853495153280155668> User: ${interaction.user}
                              > <:pp198:853494893439352842> UserID: \`${interaction.user.id}\``
        )
        .setTimestamp();
      channel.send({
        content: `${interaction.user}`,
        embeds: [ticketEmbed],
        components: [row],
      });
      TicketData.ChannelId = channel.id;
      TicketData.IsClosed = false;
      TicketData.OpenTimeStamp = Math.floor(Date.now() / 1000);
      await TicketData.save().catch((err) =>
        channel.send(
          `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}!`
        )
      );
    });
};
