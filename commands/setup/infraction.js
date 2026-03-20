const discord = require('discord.js');
const schema = require('../../schema/GuildSchema');

/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
    name: "infraction",
    aliases: [],
    dmOnly: false,
    guildOnly: true,
    args: false,
    usage: '',
    group: 'setup',
    description: 'To enable/disable/Edit infraction point protection system!',
    cooldown: 5,
    guarded: false,
    requiresDatabase: true,
    permissions: ["Administrator"],
    clientPermissions: ["ManageMessages"],
    examples: [],
    async execute(client, message, [type = '', ...args]) {
        const num = Number(args[0]);

        let data;
        try {
            data = await schema.findOne({
                GuildID: message.guild.id
            });
            if (!data) {
                data = await schema.create({
                    GuildID: message.guild.id
                });
            }
        } catch (err) {
            console.log(err);
            return message.channel.send(`\`âŒ [DATABASE_ERR]:\` The database responded with error: ${err.name}`);
        }

        const persistGuildData = async () => {
            await data.save();
            client.setCachedGuildData(message.guild.id, data.toObject());
        };

        if (type.toLowerCase() === 'kick') {
            if (!num) {
                return message.channel.send(`\\âŒ **${message.member.displayName}**, Please add the maximum number of infraction points to kick!`);
            }
            if (num < 1 || num > 10) {
                return message.channel.send(`\\âŒ **${message.member.displayName}**, Maximum infraction points can't be less than (1) and more than (10).`);
            }

            if (!data.Mod.Infraction.Options) {
                data.Mod.Infraction.Options = {};
            }
            data.Mod.Infraction.Options.MaxkickP = num;
            return persistGuildData()
                .then(() => {
                    message.channel.send(`\\âœ”ï¸ ${message.member.displayName}, Successfully set the maximum number of \`kick\` infraction point(s) to **${num}**!`);
                }).catch(() => message.channel.send(`\`âŒ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`));
        }

        if (type.toLowerCase() === 'ban') {
            if (!num) {
                return message.channel.send(`\\âŒ **${message.member.displayName}**, Please add the maximum number of infraction points to ban!`);
            }
            if (num < 10 || num > 20) {
                return message.channel.send(`\\âŒ **${message.member.displayName}**, Maximum infraction points can't be less than (10) and more than (20).`);
            }

            if (!data.Mod.Infraction.Options) {
                data.Mod.Infraction.Options = {};
            }
            data.Mod.Infraction.Options.MaxbanP = num;
            return persistGuildData()
                .then(() => {
                    message.channel.send(`\\âœ”ï¸ ${message.member.displayName}, Successfully set the maximum number of \`ban\` infraction point(s) to **${num}**!`);
                }).catch(() => message.channel.send(`\`âŒ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`));
        }

        if (!isNaN(num)) {
            if (num < 5000 || num > 604800000) {
                return message.channel.send(`\\âŒ **${message.member.displayName}**, Infraction point TimeReset can't be less than (5 Min) and more than (7 Days).`);
            }

            data.Mod.Infraction.TimeReset = num;
            return persistGuildData()
                .then(() => {
                    message.channel.send(`\\âœ”ï¸ ${message.member.displayName}, Successfully set \`TimeReset\` for infraction point(s) to **${num}**!`);
                }).catch(() => message.channel.send(`\`âŒ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`));
        }

        if (type.toLowerCase() === 'toggle') {
            data.Mod.Infraction.isEnabled = !data.Mod.Infraction.isEnabled;
            return persistGuildData()
                .then(() => {
                    const state = data.Mod.Infraction.isEnabled ? 'Enabled' : 'Disabled';
                    const embed = new discord.EmbedBuilder()
                        .setColor('Green')
                        .setDescription([
                            '<a:Correct:812104211386728498>\u2000|\u2000',
                            `Infraction points Feature has been Successfully **${state}**!\n\n`,
                            `To **${!data.Mod.Infraction.isEnabled ? 're-enable' : 'disable'}** this`,
                            `feature, use the \`${client.prefix}infraction toggle\` command.`
                        ].join(' '));
                    message.channel.send({ embeds: [embed] });
                }).catch(() => message.channel.send(`\`âŒ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`));
        }

        const embed = new discord.EmbedBuilder()
            .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setColor('738ADB')
            .setDescription([
                `\`ban\` maximum infraction points is (**${data.Mod.Infraction.Options.MaxbanP}**)`,
                `\n\`kick\` maximum infraction points is (**${data.Mod.Infraction.Options.MaxkickP}**)`,
                `\nThe Infraction points \`TimeReset\` is (\`${data.Mod.Infraction.TimeReset}\`ms)`,
                `\nTo **${!data.Mod.Infraction.isEnabled ? 'enable' : 'disable'}** this`,
                `feature, use the \`${client.prefix}infraction toggle\` command.`
            ].join(' '))
            .setFooter({ text: `${client.prefix}infraction (kick/ban/toggle/(Time of Timereset)) (Number)`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });
        return message.channel.send({ embeds: [embed] });
    }
};
