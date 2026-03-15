const discord = require("discord.js");
const { profileImage } = require("discord-arts");
const schema = require("../../schema/GuildSchema");
const ecoschema = require("../../schema/Economy-Schema");
const Userschema = require("../../schema/LevelingSystem-Schema");

/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
  name: "rank",
  aliases: ["level"],
  dmOnly: false, //or false
  guildOnly: true, //or false
  args: false, //or false
  usage: "",
  group: "LeveledRoles",
  description: "Show your level & rank and your current and next xp",
  cooldown: 5, //seconds(s)
  guarded: false, //or false
  permissions: [],
  clientPermissions: [
    "EmbedLinks",
    "UseExternalEmojis",
    "AttachFiles",
  ],
  examples: ["@WOLF", ""],
  
  async execute(client, message, [user = ""]) {
    const id = (user.match(/\d{17,19}/) || [])[0] || message.author.id;
    message.channel.sendTyping();

    if (message.guild) {
      member = await message.guild.members
        .fetch(id)
        .catch(() => message.member);
      user = member.user;
    } else {
      user = message.author;
    }

    let data;
    let ecodata;
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
      message.channel.send(
        `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`
      );
    }

    if (!data.Mod.Level.isEnabled)
      return message.channel.send({
        content: `\\❌ **${message.member.displayName}**, The **levels** system is disabled in this server!\nTo enable this feature, use the \`${client.prefix}leveltoggle\` command.`,
      });

    try {
      ecodata = await ecoschema.findOne({
        userID: user.id,
      });
      Userdata = await Userschema.findOne({
        userId: message.author.id,
        guildId: message.guild.id,
      });
      if (!ecodata) {
        ecodata = await ecoschema.create({
          userID: user.id,
        });
      }
      if (!Userdata) {
        return message.channel.send({
          content: `\\❌ **${message.member.displayName}**, This member didn't get xp yet!`,
        });
      }
    } catch (err) {
      console.log(err);
      message.channel.send(
        `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`
      );
    }
    
    var status = member.presence?.status;
    const requiredXP = Userdata.System.required;
    
    const rankData = {
      currentXP: Userdata.System.xp,
      requiredXP: requiredXP,
      level: Userdata.System.level,
      rank: 1, // You may want to calculate actual rank
      status: status || "online",
      username: user.username,
      avatar: user.displayAvatarURL({ extension: "jpg", size: 256 }).replace(".gif", ".jpg"),
      background: ecodata.profile?.background || "https://i.imgur.com/299Kt1F.png"
    };

    try {
      const buffer = await profileImage(user.id, {
        rankData: rankData,
        customBackground: rankData.background
      });
      
      const attachment = new discord.AttachmentBuilder(buffer, {
        name: "RankCard.png",
      });
      message.channel.send({ files: [attachment] });
    } catch (err) {
      console.error("Error generating rank card:", err);
      return message.channel.send("\❌ Failed to generate rank card");
    }
  },
};
