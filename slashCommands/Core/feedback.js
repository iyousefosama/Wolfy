const { EmbedBuilder } = require('discord.js');
const TimeoutSchema = require('../../schema/TimeOut-Schema')
const moment = require('moment');

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
    data: {
        name: "feedback",
        description: "Give a feedback about bot or to report bug",
        group: "Bot",
        permissions: [],
        requiresDatabase: true,
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
                guildId: interaction.guildId,
                userId: interaction.user.id
            })
            if (!TimeOutData) {
                TimeOutData = await TimeoutSchema.create({
                    guildId: interaction.guildId,
                    userId: interaction.user.id
                })
            }
        } catch (err) {
            await interaction.reply({ content: client.language.getString("ERR_DB", interaction.guildId, { error: err.name }), ephemeral: true })
            client.logDetailedError({
                error: err,
                eventType: "DATABASE_ERR",
                interaction: interaction
            })
        }

        if (feedback.length > 1000) {
            return interaction.reply({ content: client.language.getString("FEEDBACK_TOO_LONG", interaction.guildId), ephemeral: true })
        };

        const owner = await client.users.fetch(client.owners[0]).catch(() => null);

        if (!owner) {
            return interaction.reply({ content: client.language.getString("FEEDBACK_OWNER_UNAVAILABLE", interaction.guildId), ephemeral: true });
        };

        if (TimeOutData.feedback > now) {
            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setTitle(client.language.getString("FEEDBACK_ALREADY_SENT", interaction.guildId))
                    .setDescription(client.language.getString("FEEDBACK_COOLDOWN_MESSAGE", interaction.guildId, { 
                        username: interaction.user.username, 
                        time: moment.duration(TimeOutData.feedback - now, 'milliseconds').format('H [hours,] m [minutes, and] s [seconds]')
                    }))
                    .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 }) })
                    .setColor('Red')], ephemeral: true
            })
        } else {
            TimeOutData.feedback = Math.floor(Date.now() + duration);
            
            await TimeOutData.save()
            const embed = new EmbedBuilder()
                .setColor('Orange')
                .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ extension: 'png', dynamic: true }) })
                .setTitle('Re: Feedback/Report')
                .setDescription([
                    moment(new Date()).format('dddd, do MMMM YYYY'),
                    `${interaction.guild.name}\u2000|\u2000#${interaction.channel.name}`,
                    `Guild ID: ${interaction.guildId}\u2000|\u2000Channel ID: ${interaction.channel.id}\u2000|\u2000User ID:${interaction.user.id}`,
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
            owner.send({ embeds: [embed] }).then(() => interaction.reply({ content: client.language.getString("FEEDBACK_SENT", interaction.guildId), ephemeral: true }))
                .catch(() => interaction.reply({ content: client.language.getString("FEEDBACK_DMS_CLOSED", interaction.guildId, { username: owner.username }), ephemeral: true }));
        }
    },
};
