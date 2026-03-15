const discord = require("discord.js");
const { Profile } = require("discord-arts");
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
    // Defer reply immediately as image generation takes time
    await interaction.deferReply({ ephemeral: interaction.options.getBoolean("hide") });

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
        GuildID: interaction.guildId,
      });
      if (!data) {
        data = await schema.create({
          GuildID: interaction.guildId,
        });
      }
    } catch (err) {
      console.log(err);
      return interaction.editReply(
        client.language.getString("LEVEL_DATABASE_ERROR", interaction.guildId, { error: err.name })
      );
    }

    if (!data.Mod.Level.isEnabled)
      return interaction.editReply({
        content: client.language.getString("LEVEL_DISABLED", interaction.guildId, {
          displayName: interaction.member.displayName,
          prefix: client.prefix
        }),
      });

    let ecodata;
    let Userdata;
    try {
      ecodata = await ecoschema.findOne({
        userID: user.id,
      });
      Userdata = await Userschema.findOne({
        userId: user.id,
        guildId: interaction.guildId,
      });
      if (!ecodata) {
        ecodata = await ecoschema.create({
          userID: user.id,
        });
        if (!Userdata || Userdata == null || Userdata == undefined) {
          return interaction.editReply({
            content: client.language.getString("LEVEL_NO_XP", interaction.guildId, {
              displayName: interaction.member.displayName
            }),
          });
        }
      }
    } catch (err) {
      console.log(err);
      return interaction.editReply(
        client.language.getString("LEVEL_DATABASE_ERROR", interaction.guildId, { error: err.name })
      );
    }
    var status = member.presence?.status;
    const requiredXP = Userdata.System?.required;

    const rankData = {
      currentXP: Userdata.System.xp,
      requiredXP: requiredXP,
      level: Userdata.System.level,
      rank: 1, // You may want to calculate actual rank
      status: status || "online",
      username: user.username,
      avatar: user.displayAvatarURL({ extension: "png", size: 256 }),
      background: ecodata.profile?.background || "https://i.imgur.com/299Kt1F.png"
    };

    try {
      const buffer = await Profile(user.id, {
        customBackground: rankData.background,
        presenceStatus: status || "online",
        font: 'ROBOTO',
        badgesFrame: true,
        customDate: 'AWESOME!',
        moreBackgroundBlur: true,
        backgroundBrightness: 50,
        rankData: {
          currentXp: Userdata.System.xp,
          requiredXp: requiredXP,
          rank: rankData.rank,
          level: Userdata.System.level,
          barColor: '#fcdce1',
          levelColor: '#ada8c6',
          autoColorRank: true
        }
      });

      const attachment = new discord.AttachmentBuilder(buffer, {
        name: "RankCard.png",
      });
      interaction.editReply({ files: [attachment] });
    } catch (err) {
      console.error("Error generating rank card:", err);

      // Check if it's a JSON parsing error (external service down)
      if (err.type === 'invalid-json' || err.message.includes('invalid json response body')) {
        // Provide a text-based fallback when external service is down
        const embed = new discord.EmbedBuilder()
          .setColor('#FF9900')
          .setTitle(`📊 ${user.username}'s Rank Card`)
          .setThumbnail(user.displayAvatarURL({ extension: "png", size: 256 }))
          .addFields(
            { name: '🏆 Rank', value: `#${rankData.rank}`, inline: true },
            { name: '📈 Level', value: `${rankData.level}`, inline: true },
            { name: '⭐ Current XP', value: `${rankData.currentXP.toLocaleString()}`, inline: true },
            { name: '🎯 Required XP', value: `${rankData.requiredXP.toLocaleString()}`, inline: true },
            { name: '📊 Progress', value: `${Math.round((rankData.currentXP / rankData.requiredXP) * 100)}%`, inline: true },
            { name: '🟢 Status', value: rankData.status, inline: true }
          )
          .setFooter({ text: 'External rank card service is temporarily unavailable' })
          .setTimestamp();

        return interaction.editReply({ embeds: [embed] });
      }

      return interaction.editReply({
        content: client.language.getString("LEVEL_ERROR", interaction.guildId),
        ephemeral: true
      });
    }
  },
};
