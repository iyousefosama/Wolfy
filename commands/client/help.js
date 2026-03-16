const discord = require('discord.js')
const { ActionRowBuilder, ButtonBuilder } = require('discord.js');
const text = require('../../util/string');

/**
 * @type {import("../../util/types/baseCommand")}
 */
/**
 * Helper function to generate a category embed dynamically from client.commands
 * @param {Object} client - The bot client
 * @param {string} groupName - The group/category name
 * @param {string} title - The embed title with emoji
 * @param {string} emoji - The emoji for the title
 * @returns {discord.EmbedBuilder} The generated embed
 */
function generateCategoryEmbed(client, groupName, title, emoji) {
    const commands = client.commands.filter(cmd => cmd.group === groupName);
    const embed = new discord.EmbedBuilder()
        .setColor('738ADB')
        .setTitle(`${emoji} **${title}**`)
        .setURL(client.config.websites["website"])
        .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
        .setThumbnail(client.user.displayAvatarURL())
        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
        .setTimestamp();

    if (commands.size === 0) {
        embed.setDescription('No commands found in this category.');
    } else {
        const fields = commands.map(cmd => ({
            name: `${client.config.prefix}${cmd.name}`,
            value: `> \`${cmd.description || 'No description available'}\``
        }));
        embed.addFields(fields);
    }

    return embed;
}

module.exports = {
    name: "help",
    aliases: ["helpme"],
    dmOnly: false, //or false
    guildOnly: false, //or false
    args: false, //or false
    usage: '',
    group: 'bot',
    description: 'Display main bot helplist embed.',
    cooldown: 5, //seconds(s)
    guarded: false, //or false
    permissions: [],
    clientPermissions: ["UseExternalEmojis", "AttachFiles"],
    examples: [''],
    async execute(client, message, args) {
        let EmbedName = args.slice(0).join(" ")

        // Define button data in an array
        const buttonData = [
            { label: 'Info', customId: '1', style: 'Primary', emoji: '776670895371714570' },
            { label: 'Search', customId: '2', style: 'Primary', emoji: '845681277922967572' },
            { label: 'Utilities', customId: '3', style: 'Primary', emoji: '836168684379701279' },
            { label: 'Moderator', customId: '4', style: 'Danger', emoji: '853496185443319809' },
            { label: 'Fun', customId: '5', style: 'Success', emoji: '768867196302524426' },
            { label: 'Setup', customId: '6', style: 'Primary', emoji: '836168687891382312' },
            { label: 'Bot', customId: '7', style: 'Primary', emoji: '888265210350166087' },
            { label: 'Levels', customId: '8', style: 'Primary', emoji: '853495519455215627' },
            { label: 'Economy', customId: '9', style: 'Primary', emoji: '877975108038324224' },
        ];

        // Create an array to store all button builders
        const buttons = buttonData.map(data => (
            new ButtonBuilder()
                .setLabel(data.label)
                .setCustomId(data.customId)
                .setStyle(data.style)
                .setEmoji(data.emoji)
        ));


        // Create rows of action components
        const rows = [
            new ActionRowBuilder().addComponents(...buttons.slice(0, 5)), // First row with first 5 buttons
            new ActionRowBuilder().addComponents(...buttons.slice(5)),    // Second row with remaining buttons
        ];


        // Add a link button as the last component in the second row
        const linkButton = new ButtonBuilder()
            .setStyle('Link')
            .setEmoji('853495912775942154')
            .setURL(client.websites["invite"])
            .setLabel('Add me');

        rows[1].addComponents(linkButton);

        const help = new discord.EmbedBuilder()
            .setColor('738ADB')
            .setTitle(`Hi ${message.author.username}, how can i help you?`)
            .setURL(client.config.websites["website"])
            .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
            .setThumbnail(client.user.displayAvatarURL())
            .setDescription([`<a:Right:877975111846731847> Type \`${client.config.prefix}feedback\` to report a bug`, `for a full list of commands use: \`${client.config.prefix}help all\``].join("\n"))
            .setFooter({ text: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true, size: 2048 }) })
            .setTimestamp()
            .addFields(
                { name: '<a:BackPag:776670895371714570> informations helplist', value: `\`\`\`${client.config.prefix}help info\`\`\``, inline: true },
                { name: '<a:Search:845681277922967572> Search helplist', value: `\`\`\`${client.config.prefix}help search\`\`\``, inline: true },
                { name: '<a:pp350:836168684379701279> Utilities helplist', value: `\`\`\`${client.config.prefix}help Util\`\`\``, inline: true },
                { name: '<a:pp989:853496185443319809> Moderator helplist', value: `\`\`\`${client.config.prefix}help mod\`\`\``, inline: true },
                { name: '<a:pp434:836168673755660290> Fun helplist', value: `\`\`\`${client.config.prefix}help fun\`\`\``, inline: true },
                { name: '<:MOD:836168687891382312> Setup Commands', value: `\`\`\`${client.config.prefix}help setup\`\`\``, inline: true },
                { name: '<a:pp90:853496126153031710> Bot helplist', value: `\`\`\`${client.config.prefix}help bot\`\`\``, inline: true },
                { name: '<a:Up:853495519455215627> Levels helplist', value: `\`\`\`${client.config.prefix}help level\`\`\``, inline: true },
                { name: '<a:ShinyMoney:877975108038324224> Economy helplist', value: `\`\`\`${client.config.prefix}help eco\`\`\``, inline: true }
            )
        // Generate category embeds dynamically
        const info = generateCategoryEmbed(client, 'Information', 'Informations Commands', '<a:BackPag:776670895371714570>');
        const search = generateCategoryEmbed(client, 'Search', 'Search Commands', '<a:Search:845681277922967572>');
        const Utl = generateCategoryEmbed(client, 'Utilities', 'Utilities Commands', '<a:pp350:836168684379701279>');
        const moderator = generateCategoryEmbed(client, 'admin', 'Moderator Commands', '<a:pp989:853496185443319809>');
        const Fun = generateCategoryEmbed(client, 'fun', 'Fun Commands', '<a:pp434:836168673755660290>');
        const setup = generateCategoryEmbed(client, 'setup', 'Setup Commands', '<:MOD:836168687891382312>');
        const bot = generateCategoryEmbed(client, 'bot', 'Bot Commands', '<:Bot:841711382739157043>');
        const level = generateCategoryEmbed(client, 'LeveledRoles', 'LeveledRoles Commands', '<a:Up:853495519455215627>');
        const Eco = generateCategoryEmbed(client, 'Economy', 'Economy Commands', '<a:ShinyMoney:877975108038324224>');
        if (EmbedName) {
            const fields = [];
            const groups = [];

            for (let cmd of client.commands) {
                cmd = cmd[1]
                if (cmd.group) {
                    groups.push(cmd.group);
                }
            };

            var uniqueArr = [...new Set(groups)]

            for (let group of uniqueArr.filter(g => g.toLowerCase() !== 'unspecified' && g.toLowerCase() !== "developer")) {
                fields.push({
                    name: group.charAt(0).toUpperCase() + group.slice(1).toLowerCase(), inline: true,
                    value: text.joinArray(client.commands.filter(x => x.group == group).map(x => `\`${x.name}\``))
                });
            };
            const allCmds = new discord.EmbedBuilder()
                .setColor('738ADB')
                .setTitle('<:Tag:836168214525509653> Wolfy\'s full commands list!')
                .addFields(fields.sort((A, B) => B.value.length - A.value.length))
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                .setFooter({ text: `Full Commands List | \©️${new Date().getFullYear()} wolfy` })
                .setDescription([
                    `<:star:888264104026992670> You can get the full detail of each command by typing \`${client.prefix}cmd <command name>\``
                ].join('\n'))

            const responses = {
                "info": { embeds: [info], ephemeral: true },
                "search": { embeds: [search], ephemeral: true },
                "util": { embeds: [Utl], ephemeral: true },
                "moderator": { embeds: [moderator], ephemeral: true },
                "fun": { embeds: [Fun], ephemeral: true },
                "setup": { embeds: [setup], ephemeral: true },
                "bot": { embeds: [bot], ephemeral: true },
                "level": { embeds: [level], ephemeral: true },
                "eco": { embeds: [Eco], ephemeral: true },
                "all": { embeds: [allCmds], ephemeral: true }
            };

            if (!responses[EmbedName.toLowerCase()]) return message.reply({ content: "\\❗ Invalid embed name!", ephemeral: true });

            return message.reply(responses[EmbedName.toLowerCase()]);
        } else {
            const msg = await message.reply({ embeds: [help], components: rows })
            const collector = msg.createMessageComponentCollector({ time: 1800000, fetch: true });

            collector.on('collect', async interaction => {
                const { customId, member, user } = interaction;

                // Define responses based on customId
                const responses = {
                    "1": { embeds: [info], ephemeral: true },
                    "2": { embeds: [search], ephemeral: true },
                    "3": { embeds: [Utl], ephemeral: true },
                    "4": { embeds: [moderator], ephemeral: true },
                    "5": { embeds: [Fun], ephemeral: true },
                    "6": { embeds: [setup], ephemeral: true },
                    "7": { embeds: [bot], ephemeral: true },
                    "8": { embeds: [level], ephemeral: true },
                    "9": { embeds: [Eco], ephemeral: true },
                };

                // Respond based on customId
                if (responses[customId]) {
                    interaction.reply(responses[customId]);
                }
            })
            collector.on("end", (message) => {
                // Disable all buttons
                buttons.forEach(button => button.setDisabled(true));

                // Create new rows with disabled buttons
                const newrow = new ActionRowBuilder().addComponents(
                    ...buttons.slice(0, 5)
                );
                const newrow2 = new ActionRowBuilder().addComponents(
                    ...buttons.slice(5),
                );

                msg
                    .edit({ embeds: [help], components: [newrow, newrow2] })
                    .catch(() => null);
            });
        }
    }
}
