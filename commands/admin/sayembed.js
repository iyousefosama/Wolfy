const discord = require('discord.js');
capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
    name: "embed",
    aliases: ["Sayembed", "SAYEMBED", "sayembed"],
    dmOnly: false,
    guildOnly: true,
    args: true,
    usage: '<text>',
    group: 'Moderation',
    description: 'The bot will repeat what you say with embed',
    cooldown: 5,
    guarded: false,
    permissions: [discord.PermissionsBitField.Flags.ManageMessages],
    clientPermissions: [discord.PermissionsBitField.Flags.ManageMessages],
    examples: [
        'GREEN Hello, this is an example embed',
        '#d8bfd8 Hello, this is an example embed'
    ],

  async execute(client, message, args) {
        let text = args.slice(0).join(" ");

        /*

        if (!isValidColor(color)) {
          color = getRandomColor();
 
            return message.channel.send({
                content: `<a:Wrong:812104211361693696> **Invalid embed color**\n\`Ex: !embed {color} {Description} / !embed RED test\``
            });
     
        }
        */

        if (!text) {
            return message.channel.send({
                content: `<a:Wrong:812104211361693696> **I can't find the embed Description**\n\`Ex: !embed{Description} / !embed test\``
            });
        }

        const sayEmbed = new discord.EmbedBuilder()
            .setColor(getRandomColor())
            .setDescription(text)
            .setTimestamp();

        message.channel.send({ embeds: [sayEmbed] });
        message.delete().catch(() => null);
    }
}

function getRandomColor() {
  // Generate a random hex color
  const randomColor = Math.floor(Math.random()*16777215).toString(16);
  return '#' + '0'.repeat(6 - randomColor.length) + randomColor;
}

/*
function isValidColor(color) {
    // Regular expression to match hex color codes
    const hexColorRegex = /^#(?:[0-9a-fA-F]{3}){1,2}$/;
    return hexColorRegex.test(color);
}
*/