const discord = require('discord.js');
const moment = require("moment");
const axios = require("axios")

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
    data: {
        name: "whois",
        description: "Get user information",
        dmOnly: false,
        guildOnly: true,
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
        let user = interaction.options.getUser('target')?.id;
        let member;
        let activityNames;
        let status;

        if (interaction.guild) {
            const id = (user?.match(/\d{17,19}/) || [])[0] || interaction.user.id;

            member = await interaction.guild.members.fetch(id).catch(() => interaction.member);
            user = member.user;
        } else {
            user = interaction.user;
            member = interaction.member;
        }

        const activity = member.presence?.activities;
        activityNames = activity?.map(activity => activity?.name).join(", ") || client.language.getString("WHOIS_ACTIVITY_NONE", interaction.guildId);

        status = member.presence?.status;
        if (!status || status === 'offline') {
            status = client.language.getString("WHOIS_STATUS_OFFLINE", interaction.guildId);
        } else if (status === 'dnd') {
            status = client.language.getString("WHOIS_STATUS_DND", interaction.guildId);
        } else if (status === 'online') {
            status = client.language.getString("WHOIS_STATUS_ONLINE", interaction.guildId);
        } else if (status === 'idle') {
            status = client.language.getString("WHOIS_STATUS_IDLE", interaction.guildId);
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

        const userFlags = member.user.flags?.toArray();

        // Map user flags to their corresponding emoji or text
        let flagsValue = client.language.getString("USER_FLAG_NONE", interaction.guildId);
        if (userFlags?.length) {
            flagsValue = userFlags.map(flag => {
                const flagEmoji = flags[flag];
                if (flagEmoji) {
                    return flagEmoji;
                } else {
                    return `${flag}`; // Handle undefined flags
                }
            }).join(", ");
        }
        const roles = member.roles.cache
            .sort((a, b) => b.position - a.position)
            .map(role => role.toString())
            .slice(0, -1);

        let displayRoles = roles.length < 20 ? roles.join(' ') : roles.slice(0, 20).join(' ');
        if (roles.length === 0) displayRoles = client.language.getString("WHOIS_ROLES_NONE", interaction.guildId);

        const data = await axios.get(`https://discord.com/api/users/${user.id}`, {
            headers: {
                Authorization: `Bot ${client.token}`
            }
        }).then(d => d.data);

        let url = null;
        if (data.banner) {
            const extension = data.banner.startsWith("a_") ? ".gif?size=4096" : ".png?size=4096";
            url = `https://cdn.discordapp.com/banners/${user.id}/${data.banner}${extension}`;
        }

        const accountCreatedTime = moment.utc(member.user.createdAt).format('LT');
        const accountCreatedDate = moment.utc(member.user.createdAt).format('LL');
        const accountCreatedRelative = moment.utc(member.user.createdAt).fromNow();
        
        const serverJoinedTime = moment(member.joinedAt).format("LT");
        const serverJoinedDate = moment(member.joinedAt).format('LL');
        const serverJoinedRelative = moment(member.joinedAt).fromNow();
        
        const avatarUrl = member.user.displayAvatarURL({ dynamic: true, size: 1024 });
        const year = new Date().getFullYear();

        const userEmbed = new discord.EmbedBuilder()
            .setAuthor({
                name: client.language.getString("WHOIS_AUTHOR", interaction.guildId, { displayName: member.displayName }),
                iconURL: member.user.displayAvatarURL({ dynamic: true, size: 2048 }),
                url: member.user.displayAvatarURL({ dynamic: true, size: 2048 })
            })
            .addFields(
                { name: client.language.getString("WHOIS_DISPLAYNAME", interaction.guildId), value: member.displayName },
                { name: client.language.getString("WHOIS_USERNAME", interaction.guildId), value: member.user.username },
                { name: '\u200B', value: '\u200B' },
                { name: client.language.getString("WHOIS_ID", interaction.guildId), value: member.id, inline: true },
                { name: client.language.getString("WHOIS_STATUS", interaction.guildId), value: status, inline: true },
                { name: client.language.getString("WHOIS_GAME", interaction.guildId), value: activityNames, inline: true },
                { name: client.language.getString("WHOIS_ACCOUNT_CREATED", interaction.guildId), 
                  value: `${accountCreatedTime} ${accountCreatedDate} ${accountCreatedRelative}`, inline: true },
                { name: client.language.getString("WHOIS_JOINED_SERVER", interaction.guildId), 
                  value: `${serverJoinedTime} ${serverJoinedDate} ${serverJoinedRelative}`, inline: true },
                { name: client.language.getString("WHOIS_AVATAR", interaction.guildId), 
                  value: `[${client.language.getString("WHOIS_AVATAR_LINK", interaction.guildId)}](${avatarUrl})`, inline: false },
                { name: client.language.getString("WHOIS_FLAGS", interaction.guildId), value: flagsValue, inline: false },
                { name: client.language.getString("WHOIS_ROLES", interaction.guildId), value: displayRoles, inline: false },
                { name: client.language.getString("WHOIS_PERMISSIONS", interaction.guildId), 
                  value: `${interaction.guild && member.permissions?.toArray().includes('Administrator') 
                    ? client.language.getString("WHOIS_ADMINISTRATOR", interaction.guildId) 
                    : member.permissions?.toArray().map(p => `\`${p.split('_').map(x => x[0] + x.slice(1).toLowerCase()).join(' ')}\``).join(", ")}`, 
                  inline: false }
            )
            .setImage(url)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 2048 }))
            .setFooter({
                text: client.language.getString("WHOIS_FOOTER", interaction.guildId, { year }),
                iconURL: client.user.avatarURL({ dynamic: true })
            })
            .setTimestamp();

        interaction.reply({ embeds: [userEmbed] });
    }
};