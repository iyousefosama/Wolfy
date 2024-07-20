const discord = require('discord.js')
const { ActionRowBuilder, ButtonBuilder } = require('discord.js');
const text = require('../../util/string');

/**
 * @type {import("../../util/types/baseCommand")}
 */
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
            .setDescription(`<a:Right:877975111846731847> Type \`${client.config.prefix}feedback\` to report a bug`)
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
        const info = new discord.EmbedBuilder()
            .setColor('738ADB')
            .setTitle(`<a:BackPag:776670895371714570> Informations Commands`)
            .setURL(client.config.websites["website"])
            .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
            .setThumbnail(client.user.displayAvatarURL())
            .addFields(
                { name: `${client.config.prefix}server`, value: `> \`Shows informations about a server\`` },
                { name: `${client.config.prefix}user`, value: `> \`Shows informations about a user\`` },
                { name: `${client.config.prefix}mcuser`, value: `> \`To get Mincraft user informations\`` },
                { name: `${client.config.prefix}avatar`, value: `> \`Get a user's avatar.\`` },
                { name: `${client.config.prefix}savatar`, value: `> \`Get a server's avatar.\`` }
            )
            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
            .setTimestamp()
        const search = new discord.EmbedBuilder()
            .setColor('738ADB')
            .setTitle('<a:Search:845681277922967572> Search Commands')
            .setURL(client.config.websites["website"])
            .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
            .setThumbnail(client.user.displayAvatarURL())
            .addFields(
                { name: `${client.config.prefix}steam`, value: `> \`To search for any game information in steam\`` },
                { name: `${client.config.prefix}weather`, value: `> \`Shows the weather status in any country\`` },
                { name: `${client.config.prefix}lyrics`, value: `> \`The bot will show you the lyrics for the music you are searching for!\`` }
            )
            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
            .setTimestamp()
        const Utl = new discord.EmbedBuilder()
            .setColor('738ADB')
            .setTitle('<a:pp350:836168684379701279> Utilities Commands')
            .setURL(client.config.websites["website"])
            .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
            .setThumbnail(client.user.displayAvatarURL())
            .addFields(
                { name: `${client.config.prefix}suggestion`, value: `> \`Send your suggestion for the server\`` },
                { name: `${client.config.prefix}remind`, value: `> \`The bot will reminde you for anything\`` },
                { name: `${client.config.prefix}bin`, value: `> \`To upload a code to sourcebin\`` },
                { name: `${client.config.prefix}ticket`, value: `> \`Open new ticket in the server\`` },
                { name: `${client.config.prefix}rename`, value: `> \`Change ticket name\`` },
                { name: `${client.config.prefix}delete`, value: `> \`Delete your ticket in the server\`` },
                { name: `${client.config.prefix}calc`, value: `> \`Calculates an equation by wolfy\`` }
            )
            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
            .setTimestamp()
        const moderator = new discord.EmbedBuilder()
            .setColor('738ADB')
            .setTitle('<a:pp989:853496185443319809> Moderator Commands')
            .setURL(client.config.websites["website"])
            .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
            .setThumbnail(client.user.displayAvatarURL())
            .addFields(
                { name: `${client.config.prefix}ban`, value: `> \`Bans a member from the server\`` },
                { name: `${client.config.prefix}hackban`, value: `> \`Bans a member not in the server\`` },
                { name: `${client.config.prefix}softban`, value: `> \`Kicks a user and deletes all their messages in the past 7 days\`` },
                { name: `${client.config.prefix}unban`, value: `> \`unBans a member from the server\`` },
                { name: `${client.config.prefix}kick`, value: `> \`Kick a member from the server\`` },
                { name: `${client.config.prefix}dm`, value: `> \`Dms someone in the server with message\`` },
                { name: `${client.config.prefix}warn`, value: `> \`Warn a user in the server!\`` },
                { name: `${client.config.prefix}warnings`, value: `> \`Display the mentioned user warns list and ids\`` },
                { name: `${client.config.prefix}removewarn`, value: `> \`Remove a user warn from the warns list by the id\`` },
                { name: `${client.config.prefix}say`, value: `> \`The bot will repeat what you say\`` },
                { name: `${client.config.prefix}embed`, value: `> \`The bot will repeat what you say with embed\`` },
                { name: `${client.config.prefix}embedsetup`, value: `> \`Display the setup embed message!\`` },
                { name: `${client.config.prefix}respond`, value: `> \`Respond to a user suggestion in the server.\`` },
                { name: `${client.config.prefix}nick`, value: `> \`Changes the nickname of a member\`` },
                { name: `${client.config.prefix}slowmo`, value: `> \`Adding slowmotion chat to a channel\`` },
                { name: `${client.config.prefix}nuke`, value: `> \`Nuke any channel (this will delete all the channel and create newone!)\`` },
                { name: `${client.config.prefix}mute/unmute`, value: `> \`Mute/Unmute someone from texting!\`` },
                { name: `${client.config.prefix}timeout`, value: `> \`Timeout the user for temporarily time to not chat or react or connect to voice channels!\`` },
                { name: `${client.config.prefix}lock`, value: `> \`Lock the permissions for @everyone from talking in the channel\`` },
                { name: `${client.config.prefix}unlock`, value: `> \`Unlock the permissions for @everyone from talking in the channel\`` },
                { name: `${client.config.prefix}voicekick`, value: `> \`Kick all users that are connected to the current channel\`` },
                { name: `${client.config.prefix}clear`, value: `> \`Clear/Delete message with quantity you want (from 2 to 100)\`` },
                { name: `${client.config.prefix}purge`, value: `> \`Clear messages of the user with quantity you want (from 2 to 100)\`` },
                { name: `${client.config.prefix}infraction`, value: `> \`To enable/disable/Edit infraction point protection system!\`` }
            )
            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
            .setTimestamp()
        const Fun = new discord.EmbedBuilder()
            .setColor('738ADB')
            .setTitle('<a:pp434:836168673755660290> **Fun Commands**')
            .setURL(client.config.websites["website"])
            .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
            .setThumbnail(client.user.displayAvatarURL())
            .addFields(
                { name: `${client.config.prefix}8ball`, value: `> \`Ask the 8ball anything and it will answer\`` },
                { name: `${client.config.prefix}clyde`, value: `> \`Send your message as clyed text message\`` },
                { name: `${client.config.prefix}fast`, value: `> \`Start playing fast typer game\`` },
                { name: `${client.config.prefix}meme`, value: `> \`Gives random memes\`` },
                { name: `${client.config.prefix}rps`, value: `> \`Playing rock/paper/scissors vs the bot\`` },
                { name: `${client.config.prefix}tweet`, value: `> \`Send your message as tweet message\`` },
                { name: `${client.config.prefix}guess`, value: `> \`Start playing new guess the number game.\`` }
            )
            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
            .setTimestamp()
        const setup = new discord.EmbedBuilder()
            .setColor('738ADB')
            .setTitle('<:MOD:836168687891382312> **Setup Commands**')
            .setURL(client.config.websites["website"])
            .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
            .setThumbnail(client.user.displayAvatarURL())
            .addFields(
                { name: `${client.config.prefix}setLogsch`, value: `> \`Setup the logs channel bot will send logs there!\`` },
                { name: `${client.config.prefix}setSuggch`, value: `> \`Setup the suggestion channel bot will send suggestions from users there!\`` },
                { name: `${client.config.prefix}setwelcomech`, value: `> \`Setup the welcome channel bot will send message when user join there!\`` },
                { name: `${client.config.prefix}setleaverch`, value: `> \`Setup the leaver channel bot will send message when user join there!\`` },
                { name: `${client.config.prefix}setTicketch`, value: `> \`Setup the ticket category bot will create tickets channels from users there!\`` },
                { name: `${client.config.prefix}setwelcomemsg`, value: `> \`To set the welcome (msg/embed)\`` },
                { name: `${client.config.prefix}setleavermsg`, value: `> \`To set the leaver (msg/embed)\`` },
                { name: `${client.config.prefix}smRole`, value: `> \`Setup the select menu role list!\`` },
                { name: `${client.config.prefix}badwords`, value: `> \`Add/remove/show blacklisted words for the current guild.\`` },
                { name: `${client.config.prefix}[cmd]toggle`, value: `> \`To toggle a cmd <off/on> from setup cmds!\`` },
                { name: `${client.config.prefix}antilinktoggle`, value: `> \`To enable/disable Anti-Links protection!\`` },
                { name: `${client.config.prefix}setprefix`, value: `> \`To set the bot setprefix to another one!\`` },
            )
            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
            .setTimestamp()
        const bot = new discord.EmbedBuilder()
            .setColor('738ADB')
            .setTitle('<:Bot:841711382739157043> **Bot Commands**')
            .setURL(client.config.websites["website"])
            .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
            .setThumbnail(client.user.displayAvatarURL())
            .addFields(
                { name: `${client.config.prefix}stats`, value: `> \`Show bot stats and informations\`` },
                { name: `${client.config.prefix}links`, value: `> \`Shows all bot special link vote/invite ..\`` },
                { name: `${client.config.prefix}feedback`, value: `> \`To give a feedback about bot or to report bug\`` },
                { name: `${client.config.prefix}help`, value: `> \`Display main bot helplist embed.\`` },
                { name: `${client.config.prefix}ping`, value: `> \`Shows the bot ping\`` },
                { name: `${client.config.prefix}uptime`, value: `> \`Show the bot uptime\`` }
            )
            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
            .setTimestamp()
        const level = new discord.EmbedBuilder()
            .setColor('738ADB')
            .setTitle('<a:Up:853495519455215627> **LeveledRoles Commands**')
            .setURL(client.config.websites["website"])
            .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
            .setThumbnail(client.user.displayAvatarURL())
            .addFields(
                { name: `${client.config.prefix}leveltoggle`, value: `> \`To enable/disable levelRoles cmd\`` },
                { name: `${client.config.prefix}rank`, value: `> \`Show your level & rank and your current and next xp\`` },
                { name: `${client.config.prefix}level-roles`, value: `> \`To show you all level roles in the guild\`` },
                { name: `${client.config.prefix}add-role`, value: `> \`Add a level role as a prize for users when they be active\`` },
                { name: `${client.config.prefix}edit-level-role`, value: `> \`Edit the guild level role to another one\`` },
                { name: `${client.config.prefix}clearxp`, value: `> \`Clear the xp for a user in the server\`` },
                { name: `${client.config.prefix}remove-role`, value: `> \`Remove a level role from the list\`` }
            )
            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
            .setTimestamp()
        const Eco = new discord.EmbedBuilder()
            .setColor('738ADB')
            .setTitle('<a:ShinyMoney:877975108038324224> **Economy Commands**')
            .setURL(client.config.websites["website"])
            .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
            .setThumbnail(client.user.displayAvatarURL())
            .addFields(
                { name: `${client.config.prefix}profile`, value: `> \`Shows your profile card!\`` },
                { name: `${client.config.prefix}setbio`, value: `> \`Sets your profile card bio.\`` },
                { name: `${client.config.prefix}setbirthday`, value: `> \`Sets your profile card birthday.\`` },
                { name: `${client.config.prefix}quest`, value: `> \`Refresh/Show current quests and the current progress.\`` },
                { name: `${client.config.prefix}credits`, value: `> \`To check your credits balance in wallet\`` },
                { name: `${client.config.prefix}tip`, value: `> \`Send a tip for your friend!\`` },
                { name: `${client.config.prefix}cookie`, value: `> \`To send cookie for a friend as a gift\`` },
                { name: `${client.config.prefix}beg`, value: `> \`Want to earn money some more? Why don\'t you try begging, maybe someone will give you.\`` },
                { name: `${client.config.prefix}daily`, value: `> \`To get your daily reward\`` },
                { name: `${client.config.prefix}fish`, value: `> \`Take your fishingpole and start fishing\`` },
                { name: `${client.config.prefix}mine`, value: `> \`What you know about mining down in the deep?\`` },
                { name: `${client.config.prefix}register`, value: `> \`To register a bank account\`` },
                { name: `${client.config.prefix}bank`, value: `> \`To check your credits balance in wallet\`` },
                { name: `${client.config.prefix}deposit`, value: `> \`Deposit credits from your wallet to safeguard\`` },
                { name: `${client.config.prefix}withdraw`, value: `> \`Withdraw credits from your bank to your wallet\`` },
                { name: `${client.config.prefix}inv`, value: `> \`Show your inventory items! (currently support mining only)\`` },
                { name: `${client.config.prefix}sell`, value: `> \`Sell item from your inventory and get some credits!\`` },
                { name: `${client.config.prefix}market`, value: `> \`Open the economy market!\`` },
                { name: `${client.config.prefix}buy`, value: `> \`To buy items from the market\`` },
                { name: `${client.config.prefix}use`, value: `> \`Equips an item from your inventory.\`` },
                { name: `${client.config.prefix}previewitem`, value: `> \`Check what you can buy from the shop.\`` },
                { name: `${client.config.prefix}leaderboard`, value: `> \`Get a list for the 10 richest users that using wolfy\`` },
            )
            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
            .setTimestamp()
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

            for (let group of uniqueArr.filter(g => g.toLowerCase() !== 'unspecified')) {
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
