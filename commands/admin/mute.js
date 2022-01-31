const discord = require('discord.js');
const config = require('../../config.json');
const schema = require('../../schema/Mute-Schema')
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: "mute",
    aliases: ["Mute", "MUTE"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<user> <reason>',
    group: 'Moderation',
    description: 'Mute someone from texting!',
    cooldown: 2, //seconds(s)
    guarded: false, //or false
    permissions: ["MANAGE_ROLES"],
    clientpermissions: ["MANAGE_ROLES", "MANAGE_CHANNELS"],
    examples: [
        '@BADGUY Don\'t spam in chat!',
        '742682490216644619'
      ],
    async execute(client, message, [member = '', ...args]) {

    const owner = await message.guild.fetchOwner()
    const author = message.author
    let reason = args.slice(0).join(" ")

    if (!member.match(/\d{17,19}/)){
        return message.channel.send(`\\❌ | ${message.author}, Please type the id or mention the user to mute.`);
      };
  
      member = await message.guild.members
      .fetch(member.match(/\d{17,19}/)[0])
      .catch(() => null);

      let data;
      try{
          data = await schema.findOne({
              guildId: message.guild.id,
              userId: member.id
          })
          if(!data) {
              data = await schema.create({
                  guildId: message.guild.id,
                  userId: member.id
              })  
          }
      } catch(err) {
          console.log(err)
          message.channel.send({ content: `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`})
      }


    if (!member) return message.channel.send(`\\❌ | ${message.author}, User could not be found! Please ensure the supplied ID is valid.`);
    if (member.id === client.user.id) return message.channel.send(`\\❌ | ${message.author}, You can't mute me!`);
    if (member.id === message.author.id) return message.channel.send(`\\❌ | ${message.author}, You can't mute yourself!`);
    if (message.member.roles.highest.position <= member.roles.highest.position) return message.channel.send(`\\❌ | ${message.author}, User could not be muted!`);
    if (member.roles.cache.find(r => r.name.toLowerCase() === 'muted') && data?.Muted == true) return message.channel.send(`\\❌ | ${message.author}, User is already muted!`);
    if (member.id === config.developer){
      return message.channel.send({ content: `<a:Wrong:812104211361693696> | ${message.author}, No, you can't mute my developers through me!`})
    };
    if (member.id === message.guild.ownerId){
        return message.channel.send(`\\❌ | ${message.author}, You cannot mute a server owner!`)
    }

    let mutedRole = message.guild.roles.cache.find(roles => roles.name === "Muted")
    // If bot didn't find Muted role in the server
    if (!mutedRole) {
        const button = new MessageButton()
        .setLabel(`Yes`)
        .setCustomId("98541984198419841")
        .setStyle('SUCCESS')
        .setEmoji("758141943833690202");
        const button2 = new MessageButton()
        .setLabel(`No`)
        .setCustomId("8749481894198419841")
        .setStyle('DANGER')
        .setEmoji("888264104081522698");
        const row = new MessageActionRow()
        .addComponents(button, button2);
        const Embed = new discord.MessageEmbed()
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({dynamic: true, size: 2048}) })
            .setTimestamp()
            .setDescription(`\\❌ **${message.author.tag}**, There is no \`muted\` role in this guild,\n\nWould you like to generate one?`)
            .setColor('RED')
        const msg = await message.reply({ embeds: [Embed], components: [row] })
        const collector = msg.createMessageComponentCollector({ time: 15000, fetch: true });

        collector.on('collect', async interactionCreate => {
            if(interactionCreate.customId === '98541984198419841'){
                if (!interactionCreate.member.id == message.author.id) return interactionCreate.deferUpdate()
                if (message.guild.roles.cache.size >= 250) {
                    return interactionCreate.reply({ content: `\\❌ **${message.author.tag}**, Failed to generate a \`Muted\` role. Your server has too many roles! **[250]**`, ephemeral: true})
                }
                if (!message.channel.permissionsFor(message.guild.me).has('MANAGE_CHANNELS')) {
                    return interactionCreate.reply({ content: `\\❌ **${message.author.tag}**, I do not have the proper permissions to create this role! \`MANAGE_CHANNELS\``, ephemeral: true})
                }
                const mutedRole = await message.guild.roles.create({
                        name: 'Muted',
                        color: '#646060'
                })
                interactionCreate.reply({ content: '<:Verify:841711383191879690> A `muted` role has been created!', ephemeral: true})
                message.guild.channels.cache.forEach(async (channel, id) => {
                    await channel.permissionOverwrites.edit(mutedRole, {
                        SEND_MESSAGES: false,
                        ADD_REACTIONS: false,
                        CONNECT: false,
                        SPEAK: false
                    })
                });

                try {
                    member.roles.add(mutedRole)
                    const muteAdded = new discord.MessageEmbed()
                    .setAuthor({ name: member.user.username, iconURL: member.user.displayAvatarURL({dynamic: true, size: 2048}) })
                    .setDescription(`<:off:759732760562368534> I muted ${member} for reason: \`${reason}\`!`)
                    .setFooter({ name: message.author.tag, iconURL: message.author.displayAvatarURL({dynamic: true, size: 2048}) })
                    .setTimestamp()
                    message.channel.send({ embeds: [muteAdded] });
                } catch (err) {
                    return message.channel.send({ content: `\\❌ **${message.author.tag}**, I do not have permissions to add a role to this user! \`[MANAGE_ROLES]\``})
                }
                button.setDisabled(true)
                button2.setDisabled(true)
                const newrow = new MessageActionRow()
                .addComponents(button, button2);
                msg.edit({embeds: [Embed], components: [newrow]}).catch(() => null)
                }
                if(interactionCreate.customId === '8749481894198419841'){
                    if (!interactionCreate.member.id == message.author.id) return interactionCreate.deferUpdate()
                    interactionCreate.reply({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`mute\` command!`, ephemeral: true})
                    button.setDisabled(true)
                    button2.setDisabled(true)
                    const newrow = new MessageActionRow()
                    .addComponents(button, button2);
                    msg.edit({embeds: [Embed], components: [newrow]}).catch(() => null)
                }
    })
        collector.on('end', message => {
            button.setDisabled(true)
            button2.setDisabled(true)
            const newrow = new MessageActionRow()
            .addComponents(button, button2);
            msg.edit({embeds: [Embed], components: [newrow]}).catch(() => null)
        })
    } else {
        try {
            if(mutedRole) {
            member.roles.add(mutedRole, `Wolfy MUTE: ${message.author.tag}: ${reason || 'Unspecified'}`).catch(() => message.reply({ content: `\\❌ **${message.author.tag}**, I can\'t add \`mutedRole\` to the user, please check that my role is higher!`}))
            data.Muted = true
            await data.save()
            .then(() => {
                const mute = new discord.MessageEmbed()
                .setAuthor({ name: member.user.username, iconURL: member.user.displayAvatarURL({dynamic: true, size: 2048}) })
                .setDescription(`<:off:759732760562368534> I muted ${member} for reason: \`${reason || 'Unspecified'}\`!`)
                .setFooter({ text: message.author.tag, iconURL: message.author.displayAvatarURL({dynamic: true, size: 2048}) })
                .setTimestamp()
                message.channel.send({ embeds: [mute] })
            })
            .catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`))
            } 
        } catch (err) {
            console.log(err)
            message.reply({ content: `\\❌ **${message.author.tag}**, Unable to mute the user!`})
        }
    }
}
}