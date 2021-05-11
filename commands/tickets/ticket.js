const discord = require('discord.js');
const cooldown = new Set();

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;
    if(!message.guild.me.permissions.has('MANAGE_CHANNELS', 'ADMINISTRATOR')) return message.channel.send('<a:pp297:768866022081036319> Please Check My Permission <a:pp297:768866022081036319>')
    if(cooldown.has(message.author.id)) {
        message.reply('Please wait \`5 seconds\` between using the command, because you are on cooldown')
    } else {
    // getting in the ticket category
    const categoryID = message.member.guild.channels.cache.find(c => c.name == "TICKETS")

    // if there is no ticket category return
    if(!categoryID) return message.channel.send(":rolling_eyes: I can't find a \`TICKETS\` category in this server, please create one!")
    if(!categoryID) return;

    // getting the username of the member who created the ticket
    var userName = message.author.username;
    
    // getting the Discriminator (KarimX#9586) of the ticket creator
    var userDiscriminator = message.author.discriminator;

    // making the var for the funtion
    var ticketexist = false;

    // getting all the channels in the server
    message.guild.channels.cache.forEach(channel => {
        
        // making sure that the user dont already have a ticket
        if(channel.name == userName.toLowerCase() + "-" + userDiscriminator){
        
            // setting it to true so there is already a ticket
            ticketexist = true;

            // returning the cmd
            return;
        }
    });

    // if the user already have a ticket return ( dont create another ticket for him)
    if(ticketexist) return message.channel.send("<a:pp681:774089750373597185> You already have a ticket!")
    if(ticketexist) return;
    // making the ticket channel
    message.guild.channels.create(userName.toLowerCase() + "-" + userDiscriminator, {type: 'text'}).then(
        (createdChannel) => {
            // when it creates a ticket, it will create a category and name it ticket and put the ticket there
            createdChannel.setParent(categoryID).then(
                (settedParent) => {
                    // setting the perms for the channel so no one can see it
                    settedParent.updateOverwrite(message.guild.roles.cache.find(x => x.name === '@everyone'),{
                        SEND_MESSAGES: false,
                        VIEW_CHANNEL: false
                    });

                    // setting the perm so the ticket creator can see it and send msgs in it
                    settedParent.updateOverwrite(message.author.id,{
                        SEND_MESSAGES: true,
                        VIEW_CHANNEL: true,
                        CREATE_INSTANT_INVITE: false,
                        READ_MESSAGES: true,
                        ATTACH_FILES: true,
                        CONNECT: true,
                        ADD_REACTIONS: true,
                        READ_MESSAGE_HISTORY: true
                    });

                    // sending a embed when someone creates a ticket 
                    var ticketEmbed = new discord.MessageEmbed()
                    .setTitle(`Welcome in your ticket ${message.author.username}`)
                    .setDescription(`<:tag:813830683772059748>Send here your message or question!
                    
                    User: <@${message.author.id}>
                    UserID: ${message.author.id}`)
                    .setTimestamp()
                    settedParent.send(ticketEmbed).then(sentEmbed => {
                        sentEmbed.react("768869552871571496")
                        settedParent.send(`<@${message.author.id}>`)
                       message.react('758141943833690202')
                    })
                }
            ).catch(err => {
                // if err console err
                return console.log(err)
            });
        }
    ).catch(err => {
        // if err console err
        return console.log(err)
    });
    cooldown.add(message.author.id);
    setTimeout(() => {
        cooldown.delete(message.author.id)
    }, 5000); // here will be the time in miliseconds 5 seconds = 5000 miliseconds
}
}

module.exports.help = {
    name: "ticket",
    aliases: ['Ticket']
}