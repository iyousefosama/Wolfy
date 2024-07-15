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
        activityNames = activity?.map(activity => activity?.name).join(", ") || "None";

        status = member.presence?.status;
        if (!status || status === 'offline') {
            status = '<:offline:809995754021978112> Offline';
        } else if (status === 'dnd') {
            status = "<:8608_do_not_disturb:809995753577644073> Do Not Disturb";
        } else if (status === 'online') {
            status = "<:online:809995753921576960> Online";
        } else if (status === 'idle') {
            status = "<:Idle:809995753656549377> Idle";
        }

        const flags = {
            DiscordEmployee: '<:discord_Staff:911761250759893012> Discord Employee',
            DiscordPartner: '<:discord_partner:911760719266086942> Discord Partner',
            HypeSquadEvents: '<:HypeSquad_Event:911760719345762355> HypeSquad Events',
            HypeSquadOnlineHouse1: '<:HypeSquad_Bravery:911760719106703371> HypeSquad Bravery',
            HypeSquadOnlineHouse2: '<:HypeSquad_Brilliance:911760719417065523> HypeSquad Brilliance',
            HypeSquadOnlineHouse3: '<:HypeSquad_Balance:911760719429632020> HypeSquad Balance',
            BugHunterLevel1: '<:Bug_Hunter:911761250843762718> Bug Hunter (Level 1)',
            BugHunterLevel2: '<:Bug_Hunter_level2:911760719429660683> Bug Hunter (Level 2)',
            HouseBravery: '<:HypeSquad_Bravery:911760719106703371> House of Bravery',
            HouseBrilliance: '<:HypeSquad_Brilliance:911760719417065523> House of Brilliance',
            HouseBalance: '<:HypeSquad_Balance:911760719429632020> House of Balance',
            EarlySupporter: '<:early_supporter:911760718880194645> Early Supporter',
            TeamPseudoUser: 'Team User',
            System: '<:discord:887894225323192321> System',
            VerifiedBot: '<:Verified:911762191731015740> Verified Bot',
            VerifiedDeveloper: '<:Verified_Bot_Developer:911760719261859870> Verified Bot Developer',
            ActiveDeveloper: '<:ActiveDeveloper:1067072669117333515> Active Developer'
        };

        const userFlags = member.user.flags?.toArray();

        // Map user flags to their corresponding emoji or text
        let flagsValue = 'None';
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
        if (roles.length === 0) displayRoles = "None";

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

        const userEmbed = new discord.EmbedBuilder()
            .setAuthor({
                name: `User information of ${member.displayName}`,
                iconURL: member.user.displayAvatarURL({ dynamic: true, size: 2048 }),
                url: member.user.displayAvatarURL({ dynamic: true, size: 2048 })
            })
            .addFields(
                { name: '<a:pp224:853495450111967253> **DisplayName:**', value: member.displayName },
                { name: '<:pp499:836168214525509653> **Username:**', value: member.user.username },
                { name: '\u200B', value: '\u200B' },
                { name: '<:pp198:853494893439352842> **ID:**', value: member.id, inline: true },
                { name: '<a:pp472:853494788791861268> **Status:**', value: status, inline: true },
                { name: '<:pp179:853495316186791977> **Game:**', value: activityNames, inline: true },
                { name: '📆 **Account Created At:**', value: `${moment.utc(member.user.createdAt).format('LT')} ${moment.utc(member.user.createdAt).format('LL')} ${moment.utc(member.user.createdAt).fromNow()}`, inline: true },
                { name: '📥 **Joined The Server At:**', value: `${moment(member.joinedAt).format("LT")} ${moment(member.joinedAt).format('LL')} ${moment(member.joinedAt).fromNow()}`, inline: true },
                { name: `🖼️ **Avatar:**`, value: `[Click here to view Avatar](${member.user.displayAvatarURL({ dynamic: true, size: 1024 })})`, inline: false },
                { name: "<:medal:898358296694628414> Flags", value: flagsValue, inline: false },
                { name: "Roles", value: displayRoles, inline: false },
                { name: "Permissions", value: `${interaction.guild && member.permissions?.toArray().includes('Administrator') ? "<:MOD:836168687891382312> Administrator" : member.permissions?.toArray().map(p => `\`${p.split('_').map(x => x[0] + x.slice(1).toLowerCase()).join(' ')}\``).join(", ")}`, inline: false }
            )
            .setImage(url)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 2048 }))
            .setFooter({
                text: `User info. | ©️${new Date().getFullYear()} Wolfy`,
                iconURL: client.user.avatarURL({ dynamic: true })
            })
            .setTimestamp();

        interaction.reply({ embeds: [userEmbed] });
    }
};