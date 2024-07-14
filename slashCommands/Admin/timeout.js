const { EmbedBuilder } = require("discord.js");
const ms = require('ms')

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
    data: {
        name: "timeout",
        description: "Prevents a user from talking or connecting for voice channel for a period of time",
        dmOnly: false,
        guildOnly: true,
        cooldown: 3,
        group: "Moderation",
        clientPermissions: ["ModerateMembers"],
        permissions: [
            "ModerateMembers"
        ],
        options: [
            {
                type: 6, // USER
                name: 'target',
                description: 'The user to timeout',
                required: true
            },
            {
                type: 3, // STRING
                name: 'time',
                description: 'The time of timeout (ex: 5h), or type "0" to remove timeout',
                required: true
            },
            {
                type: 3, // STRING
                name: 'reason',
                description: 'The reason of the timeout',
                required: false
            },
        ]
    },
    async execute(client, interaction) {
        const { guild, options } = interaction;
        /**
         * @type {import("discord.js").User}
         */
        const user = options.getUser("target");
        /**
         * @type {string}
         */
        const time = options.getString("time");
        /**
         * @type {string}
         */
        const reason = options.getString("reason");

        const timeout_time = time == "0" ? null : ms(time);

        if(!timeout_time) {
            return interaction.reply({ content: `\\❌ Please add a valid time for the timeout!`, ephermal: true })
        }

        if (!user.id.match(/\d{17,19}/)){
            return interaction.reply({ content: `\\❌ Please choose valid member to timeout!`, ephermal: true });
          };
      
          const member = await interaction.guild.members
          .fetch(user.id.match(/\d{17,19}/)[0])
          .catch(() => null);
    
        if (!member){
          return interaction.reply({ content: `\\❌ User could not be found! Please ensure the supplied ID is valid.`, ephermal: true});
        } else if (member.id === interaction.user.id){
          return interaction.reply({ content: `\\❌ You cannot timeout yourself!`, ephermal: true });
        } else if (member.id === client.user.id){
          return interaction.reply({ content: `\\❌ You cannot timeout me!`, ephermal: true });
        } else if (member.id === interaction.guild.ownerId){
          return interaction.reply({ content: `\\❌ You cannot timeout a server owner!`, ephermal: true });
        } else if (client.owners.includes(member.id)){
          return interaction.reply({ content: `\\❌ You cannot timeout my developer through me!`, ephermal: true });
        } else if (interaction.member.roles.highest.position < member.roles.highest.position){
          return interaction.reply({ content: `\\❌ You cannot timeout that user! He/She has a higher role than yours`, ephermal: true });
        }

        return member.timeout(timeout_time, `Wolfy TIMEOUT: ${interaction.user.username}: ${reason || 'Unspecified'}`)
        .then(() => interaction.reply({ content: `\\✔️ Successfully ${!timeout_time.isNull() ? "timeout" : "removed timeout for"} the user **${member.user.username}**!`}))
        .catch(() => interaction.reply({ content: `\\❌ Unable to timeout **${member.user.username}**!`, ephermal: true}));
    },
};
