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
        activityNames = activity?.map(activity => activity?.name).join(", ") || client.language.getString("WHOIS_ACTIVITY_NONE", interaction.guild.id);

        status = member.presence?.status;
        if (!status || status === 'offline') {
            status = client.language.getString("WHOIS_STATUS_OFFLINE", interaction.guild.id);
        } else if (status === 'dnd') {
            status = client.language.getString("WHOIS_STATUS_DND", interaction.guild.id);
        } else if (status === 'online') {
            status = client.language.getString("WHOIS_STATUS_ONLINE", interaction.guild.id);
        } else if (status === 'idle') {
            status = client.language.getString("WHOIS_STATUS_IDLE", interaction.guild.id);
        }

        const flags = {
            DiscordEmployee: client.language.getString("USER_FLAG_EMPLOYEE", interaction.guild.id),
            DiscordPartner: client.language.getString("USER_FLAG_PARTNER", interaction.guild.id),
            HypeSquadEvents: client.language.getString("USER_FLAG_HYPESQUAD_EVENTS", interaction.guild.id),
            HypeSquadOnlineHouse1: client.language.getString("USER_FLAG_BRAVERY", interaction.guild.id),
            HypeSquadOnlineHouse2: client.language.getString("USER_FLAG_BRILLIANCE", interaction.guild.id),
            HypeSquadOnlineHouse3: client.language.getString("USER_FLAG_BALANCE", interaction.guild.id),
            BugHunterLevel1: client.language.getString("USER_FLAG_BUG_HUNTER_1", interaction.guild.id),
            BugHunterLevel2: client.language.getString("USER_FLAG_BUG_HUNTER_2", interaction.guild.id),
            HouseBravery: client.language.getString("USER_FLAG_BRAVERY", interaction.guild.id),
            HouseBrilliance: client.language.getString("USER_FLAG_BRILLIANCE", interaction.guild.id),
            HouseBalance: client.language.getString("USER_FLAG_BALANCE", interaction.guild.id),
            EarlySupporter: client.language.getString("USER_FLAG_EARLY_SUPPORTER", interaction.guild.id),
            TeamPseudoUser: client.language.getString("USER_FLAG_TEAM_USER", interaction.guild.id),
            System: client.language.getString("USER_FLAG_SYSTEM", interaction.guild.id),
            VerifiedBot: client.language.getString("USER_FLAG_VERIFIED_BOT", interaction.guild.id),
            VerifiedDeveloper: client.language.getString("USER_FLAG_VERIFIED_DEVELOPER", interaction.guild.id),
            ActiveDeveloper: client.language.getString("USER_FLAG_ACTIVE_DEVELOPER", interaction.guild.id)
        };

        const userFlags = member.user.flags?.toArray();

        // Map user flags to their corresponding emoji or text
        let flagsValue = client.language.getString("USER_FLAG_NONE", interaction.guild.id);
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
        if (roles.length === 0) displayRoles = client.language.getString("WHOIS_ROLES_NONE", interaction.guild.id);

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
                name: client.language.getString("WHOIS_AUTHOR", interaction.guild.id, { displayName: member.displayName }),
                iconURL: member.user.displayAvatarURL({ dynamic: true, size: 2048 }),
                url: member.user.displayAvatarURL({ dynamic: true, size: 2048 })
            })
            .addFields(
                { name: client.language.getString("WHOIS_DISPLAYNAME", interaction.guild.id), value: member.displayName },
                { name: client.language.getString("WHOIS_USERNAME", interaction.guild.id), value: member.user.username },
                { name: '\u200B', value: '\u200B' },
                { name: client.language.getString("WHOIS_ID", interaction.guild.id), value: member.id, inline: true },
                { name: client.language.getString("WHOIS_STATUS", interaction.guild.id), value: status, inline: true },
                { name: client.language.getString("WHOIS_GAME", interaction.guild.id), value: activityNames, inline: true },
                { name: client.language.getString("WHOIS_ACCOUNT_CREATED", interaction.guild.id), 
                  value: `${accountCreatedTime} ${accountCreatedDate} ${accountCreatedRelative}`, inline: true },
                { name: client.language.getString("WHOIS_JOINED_SERVER", interaction.guild.id), 
                  value: `${serverJoinedTime} ${serverJoinedDate} ${serverJoinedRelative}`, inline: true },
                { name: client.language.getString("WHOIS_AVATAR", interaction.guild.id), 
                  value: `[${client.language.getString("WHOIS_AVATAR_LINK", interaction.guild.id)}](${avatarUrl})`, inline: false },
                { name: client.language.getString("WHOIS_FLAGS", interaction.guild.id), value: flagsValue, inline: false },
                { name: client.language.getString("WHOIS_ROLES", interaction.guild.id), value: displayRoles, inline: false },
                { name: client.language.getString("WHOIS_PERMISSIONS", interaction.guild.id), 
                  value: `${interaction.guild && member.permissions?.toArray().includes('Administrator') 
                    ? client.language.getString("WHOIS_ADMINISTRATOR", interaction.guild.id) 
                    : member.permissions?.toArray().map(p => `\`${p.split('_').map(x => x[0] + x.slice(1).toLowerCase()).join(' ')}\``).join(", ")}`, 
                  inline: false }
            )
            .setImage(url)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 2048 }))
            .setFooter({
                text: client.language.getString("WHOIS_FOOTER", interaction.guild.id, { year }),
                iconURL: client.user.avatarURL({ dynamic: true })
            })
            .setTimestamp();

        interaction.reply({ embeds: [userEmbed] });
    }
};