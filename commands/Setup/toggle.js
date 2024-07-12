const discord = require('discord.js');
const schema = require('../../schema/GuildSchema');

/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
    name: "toggle",
    aliases: [],
    dmOnly: false, // or false
    guildOnly: true, // or false
    args: true, // or false
    usage: '',
    group: 'setup',
    description: 'Toggle a command on/off in current server',
    cooldown: 5, // seconds(s)
    guarded: false, // or false
    permissions: ["Administrator"],
    examples: [''],

    async execute(client, message, args) {
        let data;
        try {
            data = await schema.findOne({ GuildID: message.guild.id });
            if (!data) {
                data = await schema.create({
                    GuildID: message.guild.id,
                    commands: []
                });
            }
        } catch (err) {
            console.log(err);
            return message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`);
        }

        const cmdName = args[0].toLowerCase();
        const toggleStatus = args[1].toLowerCase();

        if (toggleStatus !== 'on' && toggleStatus !== 'off') {
            return message.reply({ content: `\\❌ \`${toggleStatus}\` is an invalid toggle status!\nValid toggle status: \`on\` or \`off\``, ephemeral: true });
        }

        const status = toggleStatus === 'on' ? true : false;

        const cmd = client.commands.find(x => x.name === cmdName) || client.commands.find(x => x.aliases && x.aliases.includes(cmdName));

        if (!cmd) {
            return message.reply({ content: `\\❌ \`${cmdName}\` is an invalid command name!`, ephemeral: true });
        }

        const cmdObj = {
            name: cmd.name,
            aliases: cmd.aliases,
            isDisabled: !status // Note: Inverted because 'on' means enabled (not disabled)
        };

        // Ensure commands array is defined
        if (!Array.isArray(data.commands)) {
            data.commands = [];
        }

        // Check if the command is already in the array
        const existingCommandIndex = data.commands.findIndex(c => c.name === cmdObj.name);

        if (existingCommandIndex > -1) {
            // If command exists, update it
            data.commands[existingCommandIndex] = cmdObj;
        } else {
            // If command doesn't exist, add it
            data.commands.push(cmdObj);
        }

        try {
            await data.save();
            const state = status ? 'Enabled' : 'Disabled';
            const embed = new discord.EmbedBuilder()
                .setColor('Green')
                .setDescription([
                    '<a:Correct:812104211386728498>\u2000|\u2000',
                    `Command **${cmd.name}** has been Successfully **${state}**!\n\n`,
                    `To **${status ? 'disable' : 're-enable'}** this`,
                    `command, use the \`${client.prefix}toggle ${cmd.name}\` command.`
                ].join(' '));
            message.channel.send({ embeds: [embed] });
        } catch (err) {
            console.log(err);
            message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`);
        }
    }
};
