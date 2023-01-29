const discord= require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const minecraftPlayer = require("minecraft-player");

module.exports = {
    clientpermissions: [discord.PermissionsBitField.Flags.EmbedLinks, discord.PermissionsBitField.Flags.ReadMessageHistory],
	data: new SlashCommandBuilder()
		.setName('mcuser')
		.setDescription('Gives informations about minecraft user player!')
        .addStringOption(option => option.setName('query').setDescription('Enter a player name').setRequired(true)),
	async execute(client, interaction) {
        const query = interaction.options.getString('query');

        let user;
        try {
        user = await minecraftPlayer(query);
        } catch {
            return;
        }
    
        if (user) {
            const embed = new discord.EmbedBuilder()
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .addFields(
                { name: "Name:", value: `${user.username}`, inline: true},
                { name: "NameHistory:", value: `${user.usernameHistory.map(x => `${x.username}\n`)}`, inline: false},
                { name: "UUID:", value: `\`${user.uuid}\``},
                { name: "CreatedAt", value: user.createdAt || "Unknown", inline: true },
                { name: "Download:", value: `[Download](https://minotar.net/download/${user.username})`, inline: true},
                { name: "NameMC:", value: `[Click Here](https://mine.ly/${user.username}.1)`, inline: true}
            )
            .setImage(`https://minotar.net/armor/body/${user.username}/100.png`)
            .setColor('#2c2f33')
            .setThumbnail(`https://minotar.net/helm/${user.username}/100.png`)
            .setTimestamp()
            .setFooter({ text: user.username + `\'s mcuser | \©️${new Date().getFullYear()} Wolfy`, iconURL: interaction.guild.iconURL({dynamic: true}) })
            interaction.editReply({ embeds: [embed] });
        } else {
            return interaction.editReply({ content: "<a:pp681:774089750373597185> **|** The specified user was not found!"})    
        }
	},
};