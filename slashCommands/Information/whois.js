const discord = require('discord.js');
const dayjs = require("dayjs");
const relativeTime = require("dayjs/plugin/relativeTime");
const axios = require("axios");
const { colors } = require('../../util/constants/constants');

dayjs.extend(relativeTime);

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
    data: {
        name: "whois",
        description: "Get user information",
        dmOnly: false,
        guildOnly: false,
        integration_types: [0, 1],
        contexts: [0, 1, 2],
        cooldown: 0,
        group: "Information",
        clientPermissions: ["SendMessages"],
        permissions: [],
        options: [
            {
                type: 6, // USER
                name: 'target',
                description: 'User to get information for'
            }
        ]
    },
    async execute(client, interaction) {
        let user = interaction.options.getUser('target') ?? interaction.user;
        let member = interaction.member;
        let activityNames = "None";
        let status = "🔴 Offline";
        let rolesValue = "None";
        let permissionsValue = "None";
        let joinedServerInfo = "None";

        if (interaction.guild) {
            try {
                member = await interaction.guild.members.fetch(user.id);
                const activity = member.presence?.activities;
                if (activity?.length) {
                    activityNames = activity.map(a => a?.name).join(", ");
                }

                if (member.presence?.status) {
                    const statuses = {
                        dnd: "⛔ Do Not Disturb",
                        online: "🟢 Online",
                        idle: "🟡 Idle",
                        offline: "🔴 Offline"
                    };
                    status = statuses[member.presence.status] || statuses.offline;
                }

                const roles = member.roles.cache
                    .sort((a, b) => b.position - a.position)
                    .map(role => role.toString())
                    .slice(0, -1);

                if (roles.length) {
                    rolesValue = roles.length < 20 ? roles.join(' ') : roles.slice(0, 20).join(' ');
                }

                const perms = member.permissions?.toArray();
                if (perms?.includes("Administrator")) {
                    permissionsValue = "🔨 Administrator";
                } else if (perms?.length) {
                    permissionsValue = perms.map(p => `\`${p.split('_').map(x => x[0] + x.slice(1).toLowerCase()).join(' ')}\``).join(", ");
                }

                if (member.joinedAt) {
                    const serverJoinedTime = dayjs(member.joinedAt).format("LT");
                    const serverJoinedDate = dayjs(member.joinedAt).format('LL');
                    const serverJoinedRelative = dayjs(member.joinedAt).fromNow();
                    joinedServerInfo = `${serverJoinedTime} ${serverJoinedDate} ${serverJoinedRelative}`;
                }
            } catch (err) {
                console.warn("Could not fetch member:", err);
            }
        }

        const flags = {
            DiscordEmployee: "👷 Discord Employee",
            DiscordPartner: "🤝 Discord Partner",
            HypeSquadEvents: "🎉 HypeSquad Events",
            HypeSquadOnlineHouse1: "🔥 HypeSquad Bravery",
            HypeSquadOnlineHouse2: "💡 HypeSquad Brilliance",
            HypeSquadOnlineHouse3: "⚖️ HypeSquad Balance",
            BugHunterLevel1: "🐛 Bug Hunter (Level 1)",
            BugHunterLevel2: "🐛 Bug Hunter (Level 2)",
            HouseBravery: "🔥 HypeSquad Bravery",
            HouseBrilliance: "💡 HypeSquad Brilliance",
            HouseBalance: "⚖️ HypeSquad Balance",
            EarlySupporter: "⭐ Early Supporter",
            TeamPseudoUser: "Team User",
            System: "🤖 System",
            VerifiedBot: "✅ Verified Bot",
            VerifiedDeveloper: "✅ Verified Bot Developer",
            ActiveDeveloper: "🧑‍💻 Active Developer"
        };

        const userFlags = user.flags?.toArray();
        const flagsValue = userFlags?.length
            ? userFlags.map(flag => flags[flag] ?? flag).join(", ")
            : "None";

        const data = await axios.get(`https://discord.com/api/users/${user.id}`, {
            headers: {
                Authorization: `Bot ${client.token}`
            }
        }).then(d => d.data).catch(() => null);

        const bannerUrl = data?.banner
            ? `https://cdn.discordapp.com/banners/${user.id}/${data.banner}${data.banner.startsWith("a_") ? ".gif?size=4096" : ".png?size=4096"}`
            : null;

        const accountCreatedTime = dayjs(user.createdAt).format('LT');
        const accountCreatedDate = dayjs(user.createdAt).format('LL');
        const accountCreatedRelative = dayjs(user.createdAt).fromNow();

        const avatarUrl = user.displayAvatarURL({ dynamic: true, size: 1024 });
        const year = new Date().getFullYear();

        const userEmbed = new discord.EmbedBuilder()
            .setColor(colors.INFORMATION)
            .setAuthor({
                name: `User information of ${member?.displayName || user.username}`,
                iconURL: avatarUrl,
                url: avatarUrl
            })
            .addFields(
                { name: "🏷️ Display Name", value: member?.displayName || user.username },
                { name: "👤 Username", value: user.username },
                { name: '\u200B', value: '\u200B' },
                { name: "🆔 ID", value: user.id, inline: true },
                { name: "💬 Status", value: status, inline: true },
                { name: "🎮 Game", value: activityNames, inline: true },
                {
                    name: "📅 Account Created At",
                    value: `${accountCreatedTime} ${accountCreatedDate} ${accountCreatedRelative}`,
                    inline: true
                },
                {
                    name: "📥 Joined The Server At",
                    value: joinedServerInfo,
                    inline: true
                },
                {
                    name: "🖼️ Avatar",
                    value: `[Click here to view Avatar](${avatarUrl})`,
                    inline: false
                },
                { name: "🎖️ Flags", value: flagsValue, inline: false },
                { name: "🎭 Roles", value: rolesValue, inline: false },
                { name: "🔐 Permissions", value: permissionsValue, inline: false }
            )
            .setThumbnail(avatarUrl)
            .setImage(bannerUrl)
            .setFooter({
                text: `User info. | ©${year} Wolfy`,
                iconURL: client.user.displayAvatarURL({ dynamic: true })
            })
            .setTimestamp();

        interaction.reply({ embeds: [userEmbed] });
    }
};
