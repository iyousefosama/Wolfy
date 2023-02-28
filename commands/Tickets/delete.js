const discord = require('discord.js');
const schema = require('../../schema/GuildSchema')
const TicketSchema = require('../../schema/Ticket-Schema')
const sourcebin = require('sourcebin_js');

module.exports = {
    name: "delete",
    aliases: ["Delete", "DELETE"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '',
    group: 'Tickets',
    description: 'Delete your ticket in the server',
    cooldown: 2, //seconds(s)
    guarded: false, //or false
    permissions: [discord.PermissionsBitField.Flags.ManageChannels],
    clientpermissions: [discord.PermissionsBitField.Flags.ManageChannels],
    examples: [''],
    async execute(client, message, args) {

        let data;
        let TicketData;
        try{
            data = await schema.findOne({
                GuildID: message.guild.id
            })
            TicketData = await TicketSchema.findOne({
                guildId: message.guild.id,
                UserId: message.author.id
            })
            if(!data) {
            data = await schema.create({
                GuildID: message.guild.id
            })
            }
            if(!TicketData) {
                TicketData = await TicketSchema.create({
                    guildId: message.guild.id,
                    UserId: message.author.id
                })
                }
        } catch(err) {
            console.log(err)
            message.channel.send({ content: `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`})
        }

// getting in the ticket category
const categoryID = message.guild.channels.cache.get(data.Mod.Tickets.channel)

// if there is no ticket category return
if(!categoryID) {
return message.channel.send({ content: `\\❌ **${message.member.displayName}**, I can't find the tickets channel please contact mod or use \`w!setticketch\` cmd`})
} else if(!data.Mod.Tickets.isEnabled) {
    return message.channel.send({ content: `\\❌ **${message.member.displayName}**, The **tickets** command is disabled in this server!`})
} else {
// Do nothing..
}

    // if the channel is a ticket then...
    if(message.channel.parent == categoryID){
    
        // deletes the ticket / channel
        const close = new discord.EmbedBuilder()
        .setColor(`Red`)
        .setDescription('<a:pp681:774089750373597185> Ticket will be deleted in 5 seconds')
        message.channel.send({ embeds: [close]})
        .then(async () => {
            setTimeout(async () => {
                let response;
                const Ticket = message.guild.channels.cache.get(TicketData.ChannelId)
                return await message.channel.messages.fetch().then(async (messages) => {
                  const output = messages.reverse().map(m => `${new Date(m.createdAt).toLocaleString('en-US')} - ${m.author.tag}: ${m.attachments.size > 0 ? m.attachments.first().proxyURL : m.content}`).join('\n');
        
                    response = await sourcebin.create([
                      {
                        name: ' ',
                        content: output,
                        languageId: 'text',
                      },
                    ], {
                      title: `Chat transcript for ${message.channel.name}`,
                      description: ' ',
                    });
                })
                .then(async () => {
                  await message.channel.delete()
                  const TicketUser = client.users.cache.get(TicketData.UserId)

                  const Closedembed = new discord.EmbedBuilder()
                  .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true })})
                  .setTitle("Ticket Closed.")
                  .setDescription(`<:Tag:836168214525509653> ${Ticket.name} Ticket at ${message.guild.name} Just closed!`)
                  .addFields(
                    { name: "Ticket transcript", value: `[View](${response?.url}) for channel`, inline: true },
                    { name: "Opened by", value: `${TicketUser.tag}`, inline: true },
                    { name: "Closed by", value: `${message.author.tag}`, inline: true},
                    { name: "Opened At", value: `<t:${TicketData.OpenTimeStamp}>`, inline: true}
                  )
                  .setTimestamp()
                  .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true })})
                  .setColor('#2F3136');
                  await TicketUser.send({ embeds: [Closedembed] });
                }).catch((err) => {
                    console.log(err)
                    return message.channel.send('An error occurred, please try again!');
                })
            }, 5000);
        })

    // if its not a ticket channel return
    } else {
        return message.channel.send({ content: `\\❌ **${message.member.displayName}**, You can use this cmd only in the ticket!`})
    }
    }
}
