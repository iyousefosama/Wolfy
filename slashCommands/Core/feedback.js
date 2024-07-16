const discord = require('discord.js');
const TimeoutSchema = require('../../schema/TimeOut-Schema')
const moment = require('moment');
const { author } = require('../../package.json');

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
    data: {
        name: "feedback",
        description: "Give a feedback about bot or to report bug",
        group: "Bot",
        permissions: [],
        clientPermissions: [
            "SendMessages"
        ],
        options: [
            {
                type: 3, // STRING
                name: 'feedback',
                description: 'Feedback to send to developer',
                required: true
            }
        ]
    },
    async execute(client, interaction) {
        const { options } = interaction;

        const feedback = options.getString("feedback");

        const now = Date.now();
        const duration = Math.floor(86400000)
        let TimeOutData;
        try {
            TimeOutData = await TimeoutSchema.findOne({
                guildId: interaction.guild.id,
                userId: interaction.user.id
            })
            if (!TimeOutData) {
                TimeOutData = await TimeoutSchema.create({
                    guildId: interaction.guild.id,
                    userId: interaction.user.id
                })
            }
        } catch (err) {
            console.log(err)
            interaction.reply({ content: `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`, ephemeral: true })
        }

        if (feedback.length > 1000) {
            return interaction.reply({ content: `<a:Wrong:812104211361693696> Please make your report brief and short! (MAX 1000 characters!)`, ephemeral: true})
        };

        const owner = await client.users.fetch(client.owners[0]).catch(() => null);

        if (!owner) {
            return interaction.reply({ content: `💢 Couldn't contact \`owner\`!`, ephemeral: true});
        };

        if (TimeOutData.feedback > now) {
            const embed = new discord.EmbedBuilder()
                .setTitle(`<a:pp802:768864899543466006> Feedback already Send!`)
                .setDescription(`\\❌ **${interaction.user.username}**, You already send your **feedback** earlier!\nYou can send your feedback again after \`${moment.duration(TimeOutData.feedback - now, 'milliseconds').format('H [hours,] m [minutes, and] s [seconds]')}\``)
                .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 }) })
                .setColor('Red')
            interaction.reply({ embeds: [embed], ephemeral: true })
        } else {
            TimeOutData.feedback = Math.floor(Date.now() + duration);
            await TimeOutData.save()
            const embed = new discord.EmbedBuilder()
                .setColor('Orange')
                .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ extension: 'png', dynamic: true }) })
                .setTitle('Re: Feedback/Report')
                .setDescription([
                    moment(new Date()).format('dddd, do MMMM YYYY'),
                    `${interaction.guild.name}\u2000|\u2000#${interaction.channel.name}`,
                    `Guild ID: ${interaction.guild.id}\u2000|\u2000Channel ID: ${interaction.channel.id}\u2000|\u2000User ID:${interaction.user.id}`,
                    '\n',
                    feedback
                ].filter(Boolean).join('\n'))
                .addFields({
                    name: 'Please use the template below to reply',
                    value: [
                        '```js',
                        '// REPLY TO USER',
                        `w!eval message.client.users.fetch('${interaction.user.id}').then(u => {`,
                        `  u.send(\`YOUR MESSAGE HERE\`)`,
                        `})`,
                        '\n',
                        '// REPLY TO CHANNEL',
                        `w!eval message.client.channels.cache.get('${interaction.channel.id}').send(\`YOUR MESSAGE HERE\`)`,
                        '```'
                    ].join('\n')
                })
            owner.send({ embeds: [embed] }).then(() => interaction.reply({content: '<:Verify:841711383191879690> Feedback Sent!', ephemeral: true}))
                .catch(err => interaction.reply({ content: `**${owner.username}** is currently not accepting any Feedbacks right now via DMs.`, ephemeral: true}));
        }
    },
};
