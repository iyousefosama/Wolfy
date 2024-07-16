const schema = require('../../schema/blockcmd')
const { SuccessEmbed, ErrorEmbed, InfoEmbed } = require('../../util/modules/embeds')
const text = require("../../util/string")

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
    data: {
        name: "block-command",
        description: "Manage blocked commands in the current server",
        dmOnly: false,
        guildOnly: true,
        cooldown: 0,
        group: "Setup",
        requiresDatabase: true,
        clientPermissions: [],
        permissions: ["Administrator"],
        options: [
            {
                type: 1, // SUB_COMMAND
                name: 'add',
                description: 'Block a command from being used in the server',
                options: [
                    {
                        type: 3,
                        name: 'command',
                        description: 'The command to block',
                        required: true
                    }
                ]
            },
            {
                type: 1, // SUB_COMMAND
                name: 'remove',
                description: 'Unblock a command from being used in the server',
                options: [
                    {
                        type: 3,
                        name: 'command',
                        description: 'The command to unblock',
                        required: true
                    }
                ]
            },
            {
                type: 1, // SUB_COMMAND
                name: 'list',
                description: 'List all blocked commands',
            },
            {
                type: 1, // SUB_COMMAND
                name: 'clear',
                description: 'Clear all blocked commands',
            }
        ]
    },
    async execute(client, interaction) {
        const { options, guild } = interaction;
        const subs = options.getSubcommand();

        const compareCommands = async (command) => {
            command = options.getString('command');

            // Fetch both text commands and slash commands
            const textCommands = Array.from(client.commands.values());
            const slashCommands = await client.application.commands.fetch();

            // Convert the iterable to an array
            const slashCommandsArray = [...slashCommands.values()];

            // Combine both command sets into one array
            const allCommands = [...textCommands, ...slashCommandsArray];

            // Find the matching command
            const match = allCommands.find(cmd => cmd.name.toLowerCase() === command.toLowerCase())?.name.toLowerCase();

            // Query the database with the matched command
            const data = await schema.findOne({ Guild: guild.id, Command: match });

            if (data) {
                return { cmd: "Already Blocked", query: command, toRemove: match };
            } else if (!match) {
                return { cmd: "", query: command };
            } else {
                return { cmd: match, query: command };
            }
        };



        switch (subs) {
            case 'add': {
                var command = await compareCommands();
                if (command.cmd.length == 0) {
                    return interaction.reply({ embeds: [ErrorEmbed(`\\❌ Command \`${command.query}\` does not exist!`)], ephemeral: true })
                } else if (command.cmd === "Already Blocked") {
                    return interaction.reply({ embeds: [ErrorEmbed(`\\❌ Command \`${command.query}\` is already blocked!`)], ephemeral: true })
                } else if (command.cmd === "block-command") {
                    return interaction.reply({ embeds: [ErrorEmbed(`\\❌ You cannot block \`${command.query}\`!`)], ephemeral: true })
                }

                await schema.create({ Guild: guild.id, Command: command.cmd });
                interaction.reply({ embeds: [SuccessEmbed(`<a:Mod:853496185443319809> Command \`${command.query}\` has been successfully blocked!`)] })
            }
                break;

            case 'remove': {
                var command = await compareCommands();
                if (command.cmd.length == 0) {
                    return interaction.reply({ embeds: [ErrorEmbed(`\\❌ Command \`${command.query}\` does not exist!`)], ephemeral: true })
                } else if (command.cmd !== "Already Blocked") {
                    return interaction.reply({ embeds: [ErrorEmbed(`\\❌ Command \`${command.query}\` is already unblocked!`)], ephemeral: true })
                }

                await schema.deleteOne({ Guild: guild.id, Command: command.toRemove });
                interaction.reply({ embeds: [SuccessEmbed(`<a:Mod:853496185443319809> Command \`${command.query}\` has been successfully unblocked!`)] })
            }
                break;
            case 'list': {
                var data = await schema.find({ Guild: guild.id });
                if (data.length == 0) {
                    return interaction.reply({ embeds: [ErrorEmbed(`\\❌ There are no blocked commands in this server!`)], ephemeral: true })
                }

                var Names = [];
                data.forEach(cmd => {
                    Names.push(cmd.Command);
                })
                interaction.reply({ embeds: [InfoEmbed(text.joinArray(Names))] })
            }
                break;
            case 'clear': {
                await schema.deleteMany({ Guild: guild.id });

                interaction.reply({ embeds: [SuccessEmbed(`<a:Mod:853496185443319809> All blocked commands have been successfully cleared!`)] })
            }
                break;
        }
    }
};