const discord = require("discord.js");
const schema = require("../../schema/GuildSchema");
const UserSchema = require("../../schema/LevelingSystem-Schema");

/**
 * @param {import('discord.js').Message} message
 */
exports.Level = async function (message) {
    if (!message || message.author.bot) return;

    try {
        const data = await schema.findOne({ GuildID: message.guild.id });
        if (!data) return;

        let Userdata = await UserSchema.findOne({
            userId: message.author.id,
            guildId: message.guild.id,
        });

        if (!Userdata) {
            Userdata = await UserSchema.create({
                userId: message.author.id,
                guildId: message.guild.id,
            });
        }

        if (!data.Mod?.Level?.isEnabled) return;

        const randomXp = Math.floor(Math.random() * 46) + 1;
        Userdata.System.xp += randomXp;

        if (Userdata.System.xp >= Userdata.System.required) {
            Userdata.System.level++;
            Userdata.System.required = Math.floor((Userdata.System.level + 1) ** 2 * 100);
            await Userdata.save();

            const LevelUp = new discord.EmbedBuilder()
                .setAuthor({
                    name: message.author.username,
                    iconURL: message.author.displayAvatarURL({ dynamic: true, size: 2048 }),
                })
                .setDescription(
                    `${message.author}, You have leveled up to level **${Userdata.System.level}!** <a:pp330:853495519455215627>`
                )
                .setColor("DarkGreen")
                .setTimestamp();

            const sentMessage = await message.channel.send({ embeds: [LevelUp] });
            setTimeout(() => sentMessage.delete().catch(() => null), 10000);

            if (data.Mod.Level.Roles.length) {
                const roleData = data.Mod.Level.Roles.find(x => x.Level === Userdata.System.level);
                if (roleData) {
                    const RoleToAdd = message.guild.roles.cache.get(roleData.RoleId);
                    if (RoleToAdd) {
                        message.member.roles.add(RoleToAdd).catch(() => null);
                    }
                }
            }
        } else {
            await Userdata.save();
        }
    } catch (err) {
        console.error(err);
        message.channel.send(
            `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.message}`
        );
    }
};
