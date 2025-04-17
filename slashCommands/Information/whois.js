const discord = require('discord.js');
const moment = require("moment");
const axios = require("axios");

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
        let activityNames = client.language.getString("WHOIS_ACTIVITY_NONE", interaction.guildId);
        let status = client.language.getString("WHOIS_STATUS_OFFLINE", interaction.guildId);
        let rolesValue = client.language.getString("WHOIS_ROLES_NONE", interaction.guildId);
        let permissionsValue = client.language.getString("WHOIS_ROLES_NONE", interaction.guildId);
        let joinedServerInfo = client.language.getString("WHOIS_ROLES_NONE", interaction.guildId);

        if (interaction.guild) {
            try {
                member = await interaction.guild.members.fetch(user.id);
                const activity = member.presence?.activities;
                if (activity?.length) {
                    activityNames = activity.map(a => a?.name).join(", ");
                }

                if (member.presence?.status) {
                    const statuses = {
                        dnd: client.language.getString("WHOIS_STATUS_DND", interaction.guildId),
                        online: client.language.getString("WHOIS_STATUS_ONLINE", interaction.guildId),
                        idle: client.language.getString("WHOIS_STATUS_IDLE", interaction.guildId),
                        offline: client.language.getString("WHOIS_STATUS_OFFLINE", interaction.guildId)
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
                    permissionsValue = client.language.getString("WHOIS_ADMINISTRATOR", interaction.guildId);
                } else if (perms?.length) {
                    permissionsValue = perms.map(p => `\`${p.split('_').map(x => x[0] + x.slice(1).toLowerCase()).join(' ')}\``).join(", ");
                }

                if (member.joinedAt) {
                    const serverJoinedTime = moment(member.joinedAt).format("LT");
                    const serverJoinedDate = moment(member.joinedAt).format('LL');
                    const serverJoinedRelative = moment(member.joinedAt).fromNow();
                    joinedServerInfo = `${serverJoinedTime} ${serverJoinedDate} ${serverJoinedRelative}`;
                }
            } catch (err) {
                console.warn("Could not fetch member:", err);
            }
        }

        const flags = {
            DiscordEmployee: client.language.getString("USER_FLAG_EMPLOYEE", interaction.guildId),
            DiscordPartner: client.language.getString("USER_FLAG_PARTNER", interaction.guildId),
            HypeSquadEvents: client.language.getString("USER_FLAG_HYPESQUAD_EVENTS", interaction.guildId),
            HypeSquadOnlineHouse1: client.language.getString("USER_FLAG_BRAVERY", interaction.guildId),
            HypeSquadOnlineHouse2: client.language.getString("USER_FLAG_BRILLIANCE", interaction.guildId),
            HypeSquadOnlineHouse3: client.language.getString("USER_FLAG_BALANCE", interaction.guildId),
            BugHunterLevel1: client.language.getString("USER_FLAG_BUG_HUNTER_1", interaction.guildId),
            BugHunterLevel2: client.language.getString("USER_FLAG_BUG_HUNTER_2", interaction.guildId),
            HouseBravery: client.language.getString("USER_FLAG_BRAVERY", interaction.guildId),
            HouseBrilliance: client.language.getString("USER_FLAG_BRILLIANCE", interaction.guildId),
            HouseBalance: client.language.getString("USER_FLAG_BALANCE", interaction.guildId),
            EarlySupporter: client.language.getString("USER_FLAG_EARLY_SUPPORTER", interaction.guildId),
            TeamPseudoUser: client.language.getString("USER_FLAG_TEAM_USER", interaction.guildId),
            System: client.language.getString("USER_FLAG_SYSTEM", interaction.guildId),
            VerifiedBot: client.language.getString("USER_FLAG_VERIFIED_BOT", interaction.guildId),
            VerifiedDeveloper: client.language.getString("USER_FLAG_VERIFIED_DEVELOPER", interaction.guildId),
            ActiveDeveloper: client.language.getString("USER_FLAG_ACTIVE_DEVELOPER", interaction.guildId)
        };

        const userFlags = user.flags?.toArray();
        const flagsValue = userFlags?.length
            ? userFlags.map(flag => flags[flag] ?? flag).join(", ")
            : client.language.getString("USER_FLAG_NONE", interaction.guildId);

        const data = await axios.get(`https://discord.com/api/users/${user.id}`, {
            headers: {
                Authorization: `Bot ${client.token}`
            }
        }).then(d => d.data).catch(() => null);

        const bannerUrl = data?.banner
            ? `https://cdn.discordapp.com/banners/${user.id}/${data.banner}${data.banner.startsWith("a_") ? ".gif?size=4096" : ".png?size=4096"}`
            : null;

        const accountCreatedTime = moment.utc(user.createdAt).format('LT');
        const accountCreatedDate = moment.utc(user.createdAt).format('LL');
        const accountCreatedRelative = moment.utc(user.createdAt).fromNow();

        const avatarUrl = user.displayAvatarURL({ dynamic: true, size: 1024 });
        const year = new Date().getFullYear();

        const userEmbed = new discord.EmbedBuilder()
            .setAuthor({
                name: client.language.getString("WHOIS_AUTHOR", interaction.guildId, { displayName: member?.displayName || user.username }),
                iconURL: avatarUrl,
                url: avatarUrl
            })
            .addFields(
                { name: client.language.getString("WHOIS_DISPLAYNAME", interaction.guildId), value: member?.displayName || user.username },
                { name: client.language.getString("WHOIS_USERNAME", interaction.guildId), value: user.username },
                { name: '\u200B', value: '\u200B' },
                { name: client.language.getString("WHOIS_ID", interaction.guildId), value: user.id, inline: true },
                { name: client.language.getString("WHOIS_STATUS", interaction.guildId), value: status, inline: true },
                { name: client.language.getString("WHOIS_GAME", interaction.guildId), value: activityNames, inline: true },
                {
                    name: client.language.getString("WHOIS_ACCOUNT_CREATED", interaction.guildId),
                    value: `${accountCreatedTime} ${accountCreatedDate} ${accountCreatedRelative}`,
                    inline: true
                },
                {
                    name: client.language.getString("WHOIS_JOINED_SERVER", interaction.guildId),
                    value: joinedServerInfo,
                    inline: true
                },
                {
                    name: client.language.getString("WHOIS_AVATAR", interaction.guildId),
                    value: `[${client.language.getString("WHOIS_AVATAR_LINK", interaction.guildId)}](${avatarUrl})`,
                    inline: false
                },
                { name: client.language.getString("WHOIS_FLAGS", interaction.guildId), value: flagsValue, inline: false },
                { name: client.language.getString("WHOIS_ROLES", interaction.guildId), value: rolesValue, inline: false },
                { name: client.language.getString("WHOIS_PERMISSIONS", interaction.guildId), value: permissionsValue, inline: false }
            )
            .setThumbnail(avatarUrl)
            .setImage(bannerUrl)
            .setFooter({
                text: client.language.getString("WHOIS_FOOTER", interaction.guildId, { year }),
                iconURL: client.user.displayAvatarURL({ dynamic: true })
            })
            .setTimestamp();

        interaction.reply({ embeds: [userEmbed] });
    }
};
