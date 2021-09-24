const discord = require('discord.js');

module.exports = {
    name: "market",
    aliases: ["Market", "MARKET", "shop", "Shop", "SHOP"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '[ItemName]',
    group: 'Economy',
    description: 'Open the economy market!',
    cooldown: 10, //seconds(s)
    guarded: false, //or false
    permissions: [],
    examples: [''], 
    async execute(client, message, args) {
        const MainEmbed = new discord.MessageEmbed()
        .setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))
	    .setColor('#ffd167')
	    .setTitle('Wolfy Market!')
	    .setURL('https://wolfy.yoyojoe.repl.co/')
	    .setDescription('Choose the item to buy.\n\`w!buy [ItemName]\`')
	    .setThumbnail('https://cdn-icons-png.flaticon.com/512/362/362364.png')
	    .addFields(
		{ name: '🎣 FishingPole', value: '\`2,500\`', inline: true },
		{ name: '<a:Cookie:853495749370839050> UltimateCookie Machine', value: '\`50,000\`', inline: true },
        { name: '<:StonePickaxe:887032165437702277> StonePickaxe', value: '\`15,000\`', inline: true },
        { name: '<:e_:887042865715359774> IronPickaxe', value: '\`28,000\`', inline: true },
        { name: '<:e_:887059604998078495> DiamondPickaxe', value: '\`52,000\`', inline: true },
        )
	.setTimestamp()
	.setFooter(client.user.username, client.user.displayAvatarURL({dynamic: true}));
    message.channel.send({ embeds: [MainEmbed]})
    }
}