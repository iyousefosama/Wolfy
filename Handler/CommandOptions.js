const block = require("../schema/blockcmd");
const { ErrorEmbed, InfoEmbed } = require("../util/modules/embeds");
const { Collection, ChannelType, EmbedBuilder } = require("discord.js");
const { parsePermissions } = require("../util/class/utils");
const baseCommand = require("../util/types/baseCommand");
const baseCommandSlash = require("../util/types/baseCommandSlash");
const Client = require("../struct/Client");

/**
 * 
 * @param {import("discord.js").Interaction} interaction 
 * @param {baseCommandSlash
 * } command 
 * @param {Client} client 
 * @returns {boolean}
 */
const handleApplicationCommand = async (interaction, command, client) => {
    if (!client.cooldowns.has(command.name)) {
        client.cooldowns.set(command.name, new Collection());
    }

    const userId = interaction.user.id;
    const now = Date.now();
    const timestamps = client.cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(userId)) {
        const expirationTime = timestamps.get(userId) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;

            // Check if the remaining cooldown time is less than 1 second
            if (timeLeft < 1 && timeLeft > 0) {
                // Pause execution and wait for the remaining time
                await new Promise((resolve) => setTimeout(resolve, timeLeft * 1000));
                // Cooldown time has passed; continue to execute the code below
            } else {
                // Notify the user about the remaining cooldown time
                client.CoolDownCurrent[userId] = true;
                interaction.reply({
                    embeds: [InfoEmbed(`Please cool down! (**${timeLeft.toFixed(0)}** second(s) left)`)],
                    ephemeral: true,
                });
                return false;
            }
        }
    }

    // Set the cooldown timestamp and allow normal code execution
    timestamps.set(userId, now);
    setTimeout(() => {
        timestamps.delete(userId);
        delete client.CoolDownCurrent[userId];
    }, cooldownAmount);

    if (interaction.guild) {
        // Check if command blocked in the guild
        const blockdata = await block.findOne({
            Guild: interaction.guild.id,
            Command: command.data.name,
        })

        if (blockdata) {
            interaction.reply({
                embeds: [ErrorEmbed(`💢 \`${command.data.name}\` command is blocked in this server!`)],
                ephemeral: true
            })
            return false;
        }
    }
    if (command.data.guildOnly && interaction.channel.type === ChannelType.DM) {
        interaction.reply({ embeds: [ErrorEmbed("I can't execute that command **inside DMs**!")], ephemeral: true });
        return false;
    }


    if (command.data.ownerOnly && !client.owners.includes(interaction.user.id)) {
        interaction.reply({ embeds: [ErrorEmbed("This command can only be used by **developers**!")], ephemeral: true });
        return false;
    }

    if (command.data.requiresDatabase) {
        if (!client.database?.connected) {
            interaction.reply({
                embeds: [
                    ErrorEmbed(["💢 **Cannot connect to Database**", "This command requires a database connection."].join(" - "))
                ]
            });
            return false;
        };
    };


    //+ permissions: [""],
    if (command.data.permissions && command.data.permissions.length > 0) {
        if (interaction.guild) {
            if (!interaction.member.permissions.has(command.data.permissions)) {
                interaction.reply({ embeds: [ErrorEmbed(`You don\'t have ${parsePermissions(command.data.permissions)} to use **${command.data.name}** command.`)], ephemeral: true });
                return false;
            }
        }
    }

    //+ clientPermissions: [""],
    if (command.data.clientPermissions && command.data.clientPermissions.length > 0) {
        if (interaction.guild) {
            const clientPerms = interaction.channel.permissionsFor(
                interaction.guild.members.me
            );
            if (!clientPerms || !clientPerms.has(command.data.clientPermissions)) {
                interaction.reply({ embeds: [ErrorEmbed(`The client is missing \`${parsePermissions(client.clientPermissions)}\` permission(s)!`)], ephemeral: true });
                return false;
            }
        }
    }
    return true;
}

/**
 * 
 * @param {import("discord.js").Message} message 
 * @param {baseCommand} command 
 * @param {Client} client 
 * @param {string[]} args
 * @returns {boolean}
 */
const handleMessageCommandcommand = async (message, command, args, client) => {
    if (message.guild) {
        // Check if command blocked in the guild
        const blockdata = await block.findOne({
            Guild: message.guild.id,
            Command: command.name,
        })

        if (blockdata) {
            message.channel.send({
                embeds: [ErrorEmbed(`💢 \`${command.name}\` command is blocked in this server!`)]
            })
            return false;
        }
    }

    //+ args: true/false,
    if (command.args && !args.length) {
        let desc = `You didn't provide any arguments`;

        //+ usage: '<> <>',
        if (command.usage) {
            desc += `, The proper usage would be:\n\`${client.prefix}${command.name} ${command.usage}\``;
        }
        if (command.examples && command.examples.length !== 0) {
            desc += `\n\nExamples:\n${command.examples
                .map((x) => `\`${client.prefix}${command.name} ${x}\n\``)
                .join(" ")}`;
        }

        const NoArgs = new EmbedBuilder()
            .setDescription(desc)
            .setColor("Red");
        message.channel.send({ embeds: [NoArgs] });
        return false;
    }

    if (command.requiresDatabase) {
        if (!client.database?.connected) {
            message.channel.send({
                embeds: [
                    ErrorEmbed(["💢 **Cannot connect to Database**", "This command requires a database connection."].join(" - "))
                ]
            });
            return false;
        };
    };

    //+ cooldown 1, //seconds(s)
    if (!client.cooldowns.has(command.name)) {
        client.cooldowns.set(command.name, new Collection());
    }

    const now = Date.now();
    const timestamps = client.cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime =
            timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            if (client.CoolDownCurrent[message.author.id]) {
                return false;
            }
            const timeLeft = (expirationTime - now) / 1000;
            client.CoolDownCurrent[message.author.id] = true;
            message.channel
                .send({
                    content: `**${message.author.username
                        }**, please cool down! (**${timeLeft.toFixed(
                            0
                        )}** second(s) left)`,
                })
                .then((msg) => {
                    setTimeout(() => {
                        delete client.CoolDownCurrent[message.author.id];
                        msg.delete().catch(() => null);
                    }, 4000);
                });
            return false;
        }
    }
    timestamps.set(message.author.id, now);
    setTimeout(
        () => timestamps.delete(message.author.id),
        cooldownAmount,
        delete client.CoolDownCurrent[message.author.id]
    );

    //+ permissions: [""],
    if (command.permissions && command.permissions.length > 0) {
        if (message.guild && !client.owners.includes(message.author.id)) {
            const authorPerms = message.channel.permissionsFor(message.member);
            if (!authorPerms || !authorPerms.has(command.permissions)) {
                message.channel.send({ embeds: [ErrorEmbed(`<a:pp802:768864899543466006> You don't have ${parsePermissions(command.permissions)} to use ${command.name} command.`)] });
                return false;
            }
        }
    }

    //+ clientPermissions: [""],
    if (command.clientPermissions && command.clientPermissions.length > 0) {
        if (message.guild) {
            const clientPerms = message.channel.permissionsFor(
                message.guild.members.me
            );
            if (!clientPerms || !clientPerms.has(command.clientPermissions)) {
                message.channel.send({ embeds: [ErrorEmbed(`<a:pp802:768864899543466006> The bot is missing ${parsePermissions(command.clientPermissions)}`)] });
                return false;
            }
        }
    }

    //+ guildOnly: true/false,
    if (command.guildOnly && message.channel.type === ChannelType.DM) {
        message.reply({ embeds: [ErrorEmbed(`<a:pp802:768864899543466006> I can\'t execute that command inside DMs!`)] });
        return false;
    }

    //+ dmOnly: true/false,
    if (command.dmOnly && message.channel.type === ChannelType.GuildText) {
        message.channel.send({ embeds: [ErrorEmbed(`<a:pp802:768864899543466006> I can\'t execute that command inside the server!`)] });
        return false;
    }

    if (command.guarded) {
        message.channel.send({ embeds: [ErrorEmbed(`<a:pp802:768864899543466006> \`${command.name}\` is guarded!`)] });
        return false;
    }

    if (command.ownerOnly) {
        if (!client.owners.includes(message.author.id)) {
            message.channel.send({ embeds: [ErrorEmbed(`<a:pp802:768864899543466006> **${message.author.username}**, the command \`${command.name}\` is limited for developers only!`)] });
            return false;
        }
    }
    return true;
}

module.exports = { handleApplicationCommand, handleMessageCommandcommand }