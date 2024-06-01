const discord = require("discord.js");
const schema = require("../../schema/GuildSchema");
const UserSchema = require("../../schema/LevelingSystem-Schema");
const { Font, LeaderboardBuilder } = require("canvacord");

// Load font
Font.loadDefault();

module.exports = {
  name: "levelboard",
  aliases: [],
  dmOnly: false,
  guildOnly: true,
  args: false,
  usage: "",
  group: "LeveledRoles",
  description: "Shows leaderboard for most leveled users",
  cooldown: 10,
  guarded: false,
  permissions: [],
  clientPermissions: [discord.PermissionsBitField.Flags.UseExternalEmojis],
  examples: [],
  async execute(client, message, args) {
    message.channel.sendTyping();
    let data;
    try {
      data = await schema.findOne({
        GuildID: message.guild.id,
      });
      if (!data || !data.Mod.Level.isEnabled) {
        return message.channel.send({
          content: `\\❌ **${message.member.displayName}**, The **levels** command is disabled in this server!\nTo enable this feature, use the \`${client.prefix}leveltoggle\` command.`,
        });
      }

      // Fetch user data from the database
      const usersData = await UserSchema.find({
        guildId: message.guild.id,
      })
        .sort({ "System.level": -1, "System.xp": -1 })
        .limit(10); // Change the limit as needed

      const leaderboardData = await Promise.all(
        usersData.map(async (user, index) => {
          let guildMember = message.guild.members.cache.get(user.userId);
          if (!guildMember) {
            guildMember = await message.guild.members
              .fetch(user.userId)
              .catch(() => {});
          }
          const { username, displayName } = guildMember?.user || {};
          const { level = 1, xp = 0 } = user.System || {};

          return {
            avatar:
              guildMember?.user?.displayAvatarURL({ dynamic: true }) ||
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
          title: message.guild.name,
          image: message.guild.iconURL({ dynamic: true }) || "", // Valid guild icon URL or empty string
          subtitle: `${message.guild.memberCount} members`,
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
      return message.reply({ files: [image] });
    } catch (err) {
      console.log(err);
      message.channel.send(
        `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`
      );
    }
  },
};
