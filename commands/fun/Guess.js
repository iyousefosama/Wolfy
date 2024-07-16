const currentGames = {};
const { ErrorEmbed, InfoEmbed, SuccessEmbed } = require('../../util/modules/embeds');

/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
	name: "guess",
	aliases: [],
	dmOnly: false,
	guildOnly: true,
	args: false,
	usage: '',
	group: 'Fun',
	description: 'Start playing new guess the number game.',
	cooldown: 10,
	guarded: false,
	permissions: [],
	clientPermissions: ["UseExternalEmojis", "ReadMessageHistory"],
	examples: [],

	async execute(client, message, args) {
		// Check if a game is already running in the guild
		if (currentGames[message.guild.id]) {
			return message.channel.send(`\\❌ | ${message.author}, There is a game already running in this guild!`);
		}

		const participants = [];
		const number = Math.floor(Math.random() * 499) + 1;

		await message.channel.send({
			embeds: [InfoEmbed("<a:Right:877975111846731847> Guess the number game has started!\n\nHint:\n\`\`\`diff\n+ Try to guess the number that is between (1-500)\n- You have 30 seconds to find it!\n\`\`\`")]
		});

		const filter = m => !m.author.bot;
		const collector = message.channel.createMessageCollector({
			filter,
			time: 30000, // 30 seconds
			errors: ['time']
		});
		currentGames[message.guild.id] = true;

		collector.on("collect", async msg => {
			if (msg.author.bot || isNaN(msg.content)) {
				return;
			}

			const parsedNumber = parseInt(msg.content, 10);

			if (!participants.includes(msg.author.id)) {
				participants.push(msg.author.id);
			}

			if (parsedNumber === number) {
				await message.channel.send({
					embeds: [SuccessEmbed(
						`<a:Fire:841321886365122660> **${msg.author.toString()}** WON the Game!\n\n<:star:888264104026992670> Game Stats:\n\`\`\`\n• Winner: ${msg.author.username}\n• Number: ${number}\n• Participants Count: ${participants.length}\n• Participants: ${participants.map(p => message.guild.members.cache.get(p)?.user.username || 'Unknown').join(", ")}\n\`\`\``
					)]
				});
				return collector.stop(msg.author.username);
			}

			if (participants.length >= 10) {
				return;
			}

			if (parsedNumber < number) {
				message.reply(`<a:Nnno:853494186002481182> The number (\`${parsedNumber}\`) is Smaller than my number, try again!`);
			} else if (parsedNumber > number) {
				message.reply(`<a:Nnno:853494186002481182> The number (\`${parsedNumber}\`) is Bigger than my number, try again!`);
			}
		});

		collector.on("end", (_collected, reason) => {
			delete currentGames[message.guild.id];
			if (reason === "time") {
				return message.channel.send({
					embeds: [ErrorEmbed(`<:error:888264104081522698> You lose!\nThe number was: (\`${number}\`)`)]
				});
			}
		});
	}
}
