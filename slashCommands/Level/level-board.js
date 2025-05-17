const discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const schema = require("../../schema/GuildSchema");
const UserSchema = require("../../schema/LevelingSystem-Schema");
const { Font, LeaderboardBuilder } = require("canvacord");

// Load font
Font.loadDefault();

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "level-board",
    description: "Shows leaderboard for most leveled users",
    group: "PUBLIC",
    requiresDatabase: true,
    clientPermissions: [],
    guildOnly: true,
  },
  async execute(client, interaction) {
    await interaction.deferReply().catch(() => {});

    let data;
    try {
      data = await schema.findOne({
        GuildID: interaction.guildId,
      });
      if (!data || !data.Mod.Level.isEnabled) {
        return await interaction.editReply({
          content: client.language.getString("LEVEL_DISABLED", interaction.guildId, { 
            displayName: interaction.member.displayName,
            prefix: client.prefix
          }),
        });
      }

      // Fetch user data from the database
      const usersData = await UserSchema.find({
        guildId: interaction.guildId,
      })
        .sort({ "System.level": -1, "System.xp": -1 })
        .limit(10); // Change the limit as needed

      const leaderboardData = await Promise.all(
        usersData.map(async (user, index) => {
          let guildMember = interaction.guild.members.cache.get(user.userId);
          if (!guildMember) {
            guildMember = await interaction.guild.members
              .fetch(user.userId)
              .catch(() => {});
          }
          const { username, displayName } = guildMember?.user || {};
          const { level = 1, xp = 0 } = user.System || {};

          return {
            avatar:
              guildMember?.user?.displayAvatarURL({ extension: "jpg", dynamic: true }).replace(".gif", ".jpg") ||
              "https://github.com/twlite.png",
            username: username || "Unknown",
            displayName: displayName || "Unknown",
            level,
            xp,
            rank: index + 1,
          };
        })
      );

      const lb = new LeaderboardBuilder()
        .setHeader({
          title: client.language.getString("LEADERBOARD_TITLE", interaction.guildId, { guildName: interaction.guild.name }),
          image: interaction.guild.iconURL({ dynamic: true, extension: "png" }) || "", // Valid guild icon URL or empty string
          subtitle: client.language.getString("LEADERBOARD_SUBTITLE", interaction.guildId, { memberCount: interaction.guild.memberCount }),
        })
        .setBackgroundColor("#808080")
        .adjustCanvas()
        .setVariant("horizontal")
        .setBackground(
          "https://i.postimg.cc/MGDW9f0K/00ab9fc5305f4ef7d11e00bad735a1b1.jpg"
        )
        .setPlayers(
          leaderboardData.map((player) => ({
            ...player,
            avatar: player.avatar, // Provide a default avatar URL if it's empty
          }))
        );

      const image = await lb.build({ format: "png" });

      // Reply the image to the message
      return await interaction.editReply({ files: [image] });
    } catch (err) {
      console.error(err);
      return await interaction.editReply(
        client.language.getString("LEVEL_DATABASE_ERROR", interaction.guildId, { error: err.name })
      );
    }
  },
};
