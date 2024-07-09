const discord = require('discord.js');
const currentGames = {};

/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
    name: "guess",
    aliases: ["Guess", "GUESS"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '',
    group: 'Fun',
    description: 'Start playing new guess the number game.',
    cooldown: 10, //seconds(s)
    guarded: false, //or false
    permissions: [],
    clientPermissions: [discord.PermissionsBitField.Flags.UseExternalEmojis, discord.PermissionsBitField.Flags.ReadMessageHistory],
    examples: [''],

  async execute(client, message, args) {
        if (currentGames[message.guild.id]) {
			return message.channel.send(`\\❌ | ${message.author}, There is a game already running in this guild!`);
		}

		const participants = [];
		const number = Math.floor(Math.random() * 499) + 1;

		const StartEmbed = new discord.EmbedBuilder()
		.setColor('#d6a565')
		.setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true })})
		.setDescription("<a:Right:877975111846731847> Guess the number game has started!\n\nHint:\n\`\`\`diff\n+ Try to guess the number that is between (1-500)\n- You have 30 seconds to find it!\n\`\`\`")
		.setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true })})
		.setTimestamp()
		await message.channel.send({ embeds: [StartEmbed]});

		// Store the date wich the game has started
		const gameCreatedAt = Date.now();

		const filter  = m => !m.author.bot
		const collector = message.channel.createMessageCollector(
			{
				filter,
				time: 30000, // 30 seconds
			    errors: ['time']
			}
		);
		currentGames[message.guild.id] = true;

		collector.on("collect", async msg => {
			if (msg.author == client || !msg.author || message.embeds[0] || message.attachments.size) {
				return;
			}

			// if it's not a number, return
			if (isNaN(msg.content)) {
				return;
			}

			if (!participants.includes(msg.author.id)) {
				participants.push(msg.author.id);
			}
			
			const parsedNumber = parseInt(msg.content);
      	const parsedNumber1 = parseInt(msg.content, 10);
  

			if (parsedNumber === number) {
				const WinEmbed = new discord.EmbedBuilder()
				.setColor('Green')
				.setAuthor({ name: msg.author.tag, iconURL: msg.author.displayAvatarURL({ dynamic: true })})
				.setDescription(`<a:Fire:841321886365122660> **${msg.author.toString()}** WON the Game!\n\n<:star:888264104026992670> Game Stats:\n\`\`\`\n• Winner: ${msg.author.username}\n• Number: ${number}\n• Participants Count: ${participants.length}\n• Participants: ${participants.map(p => message.guild.members.cache.get(p).user.username).join(", ")}\n\`\`\``)
				.setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true })})
				.setTimestamp()
				await message.channel.send({ embeds: [WinEmbed]})
				collector.stop(msg.author.username);
			}
      if(participants.length >= 10)
      {
        return;
      }
			if (parseInt(msg.content) < number) {
				message.reply(`<a:Nnno:853494186002481182> The number (\`${parsedNumber}\`) is Smaller than my number try again!`);
			}
			if (parseInt(msg.content) > number) {
				message.reply(`<a:Nnno:853494186002481182> The number (\`${parsedNumber}\`) is Bigger than my number try again!`);
			}
		});

		collector.on("end", (_collected, reason) => {
			delete currentGames[message.guild.id];
			if (reason === "time") {
				const LoseEmbed = new discord.EmbedBuilder()
				.setColor('Red')
				.setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL({ dynamic: true })})
				.setDescription(`<:error:888264104081522698> You lose!\nThe number was: (\`${number}\`)`)
				.setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true })})
				.setTimestamp()
				return message.channel.send({ embeds: [LoseEmbed] });
			}
		});
}
}