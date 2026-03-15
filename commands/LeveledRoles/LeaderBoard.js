const discord = require("discord.js");
const schema = require("../../schema/GuildSchema");
const UserSchema = require("../../schema/LevelingSystem-Schema");

/**
 * @type {import("../../util/types/baseCommand")}
 */
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
  clientPermissions: ["UseExternalEmojis"],
  examples: [],
  /**
   *
   * @param {import("discord.js").Client} client
   * @param {import("discord.js").Message} message
   * @param {String[]} args
   *
   */
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
              guildMember.user?.displayAvatarURL({ extension: "jpg", dynamic: true }).replace(".gif", ".jpg") ||
              "https://github.com/twlite.png",
            username: username || "Unknown",
            displayName: displayName || "Unknown",
            level,
            xp,
            rank: index + 1,
          };
        })
      );

      // Create text-based leaderboard embed
      const embed = new discord.EmbedBuilder()
        .setTitle(`${message.guild.name} Leaderboard`)
        .setColor("Gold")
        .setThumbnail(message.guild.iconURL({ dynamic: true, extension: "png" }) || null)
        .setDescription(`${message.guild.memberCount} members`)
        .addFields(
          leaderboardData.map((player, index) => ({
            name: `#${index + 1} ${player.displayName}`,
            value: `**Level:** ${player.level} | **XP:** ${player.xp}`,
            inline: false
          }))
        )
        .setTimestamp()
        .setFooter({ text: message.guild.name });

      return message.reply({ embeds: [embed] });
    } catch (err) {
      console.log(err);
      message.channel.send(
        `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`
      );
    }
  },
};
