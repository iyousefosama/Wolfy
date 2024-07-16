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
            return interaction.reply({ content: `\\❌ No new prefix detected! Please type the new prefix.`, ephemeral: true });
          } else if (prefix.length > 5) {
            return interaction.reply({ content: `\\❌ Invalid prefix. Prefixes cannot be longer than 5 characters!`, ephemeral: true });
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
              await interaction.reply({ content: `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`, ephemeral: true })
              throw new Error(err);
            }
      
            data.prefix = [prefix, null][Number(!!prefix.match(/clear|reset/i))];
            await data.save()
              .then(() => {
                return interaction.reply([
                  `\\✔️ **${interaction.user.username}**, Successfully`,
                  [
                    'removed this server\'s prefix!\nTo add prefix, simply pass the desired prefix as parameter.',
                    `set this server's prefix to \`${data.prefix}\`!\nTo remove the prefix, just pass in \`reset\` or \`clear\` as parameter.`
                  ][Number(!!data.prefix)]
                ].join(' '));
              }).catch(() => interaction.reply(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`));
          }
    }
};