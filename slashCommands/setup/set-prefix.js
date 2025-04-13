const schema = require('../../schema/GuildSchema')

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
    data: {
        name: "set-prefix",
        description: "Set the server prefix for the bot",
        dmOnly: false,
        guildOnly: true,
        cooldown: 0,
        group: "Setup",
        requiresDatabase: true,
        clientPermissions: [],
        permissions: ["Administrator"],
        options: [
            {
                type: 3, // STRING
                name: 'prefix',
                description: 'The new prefix',
                required: true
            }
        ]
    },
    async execute(client, interaction) {
        const { options, guild } = interaction;
        const prefix = options.getString("prefix");

        if (!prefix) {
            return interaction.reply({ 
                content: client.language.getString("SETUP_PREFIX_MISSING", interaction.guild?.id), 
                ephemeral: true 
            });
        } else if (prefix.length > 5) {
            return interaction.reply({ 
                content: client.language.getString("SETUP_PREFIX_TOO_LONG", interaction.guild?.id, {
                    max_length: 5
                }), 
                ephemeral: true 
            });
        } else {
      
            let data;
            try {
                data = await schema.findOne({
                    GuildID: guild.id
                })
                if (!data) {
                    data = await schema.create({
                        GuildID: guild.id
                    })
                }
            } catch (err) {
                await interaction.reply({ 
                    content: client.language.getString("ERR_DB", interaction.guild?.id, { 
                        error: err.name 
                    }), 
                    ephemeral: true 
                })
                throw new Error(err);
            }
      
            data.prefix = [prefix, null][Number(!!prefix.match(/clear|reset/i))];
            await data.save()
                .then(() => {
                    const isPrefixRemoved = !data.prefix;
                    return interaction.reply(
                        client.language.getString("SETUP_PREFIX_SUCCESS", interaction.guild?.id, {
                            username: interaction.user.username,
                            action: isPrefixRemoved ? 
                                client.language.getString("SETUP_PREFIX_REMOVED", interaction.guild?.id) :
                                client.language.getString("SETUP_PREFIX_SET", interaction.guild?.id, {
                                    prefix: data.prefix
                                })
                        })
                    );
                }).catch((err) => interaction.reply(
                    client.language.getString("ECONOMY_DB_SAVE_ERROR", interaction.guild?.id, {
                        error: err.message
                    })
                ));
        }
    }
};