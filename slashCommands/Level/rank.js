const discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { Font, RankCardBuilder } = require("canvacord");

// load default font
Font.loadDefault();
const schema = require("../../schema/GuildSchema");
const ecoschema = require("../../schema/Economy-Schema");
const Userschema = require("../../schema/LevelingSystem-Schema");

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "rank",
    description: "Show your level & rank and your current and next xp!",
    dmOnly: false,
    guildOnly: true,
    cooldown: 0,
    group: "PUBLIC",
    requiresDatabase: true,
    clientPermissions: [
      "AttachFiles"
    ],
    permissions: [],
    options: [
      {
        type: 6, // USER
        name: 'target',
        description: 'User to show the level for'
      }
    ]
  },
  async execute(client, interaction) {
    const hide = interaction.options.getBoolean("hide");
    const target = interaction.options.getUser("target");

    const id = (target?.id.match(/\d{17,19}/) || [])[0] || interaction.user.id;

    if (interaction.guild) {
      member = await interaction.guild.members
        .fetch(id)
        .catch(() => interaction.member);
      user = member.user;
    } else {
      user = interaction.user;
    }

    let data;
    try {
      data = await schema.findOne({
        GuildID: interaction.guild.id,
      });
      if (!data) {
        data = await schema.create({
          GuildID: interaction.guild.id,
        });
      }
    } catch (err) {
      console.log(err);
      interaction.reply(
        `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`
      );
    }
    if (!data.Mod.Level.isEnabled)
      return interaction.reply({
        content: `\\❌ **${interaction.member.displayName}**, The **levels** command is disabled in this server!\nTo enable this feature, use the \`${prefix}leveltoggle\` command.`,
      });
    let ecodata;
    let Userdata;
    try {
      ecodata = await ecoschema.findOne({
        userID: user.id,
      });
      Userdata = await Userschema.findOne({
        userId: user.id,
        guildId: interaction.guild.id,
      });
      if (!ecodata) {
        ecodata = await ecoschema.create({
          userID: user.id,
        });
        if (!Userdata || Userdata == null || Userdata == undefined) {
          return interaction.channel.send({
            content: `\\❌ **${interaction.member.displayName}**, This member didn't get xp yet!`,
          });
        }
      }
    } catch (err) {
      console.log(err);
      return interaction.channel.send(
        `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`
      );
    }
    var status = member.presence?.status;
    const requiredXP = Userdata.System?.required;
    const rank = new RankCardBuilder()
      .setAvatar(user.displayAvatarURL({ extension: "png", size: 256 }))
      .setBackground(ecodata.profile?.background || "") // https://i.imgur.com/299Kt1F.png
      .setCurrentXP(Userdata.System.xp)
      .setLevel(Userdata.System.level)
      .setStatus(status || "online")
      .setRequiredXP(requiredXP)
      .setUsername(user.username);
    await rank
      .build({
        format: "png",
      })
      .then((data) => {
        const attachment = new discord.AttachmentBuilder(data, {
          name: "RankCard.png",
        });
        interaction.reply({ files: [attachment], ephemeral: hide });
      });
  },
};
