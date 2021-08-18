const Discord = require('discord.js')
const fetch = require('node-fetch')

module.exports = {
    name: 'clickMenu',
    async execute(client, menu, clickMenu) {
        const Member = await menu.message.guild.members.fetch({ user: menu.clicker.user.id, force: true})
        if(menu.values[0] == 'DR1') {
            if(!Member.roles.cache.has('836422893696450590')) {
                await Member.roles.add('836422893696450590')
                return menu.reply.send("<a:pp330:853495519455215627> You got the All Annoucments mention role", true)
            } else if(Member.roles.cache.has('836422893696450590')) {
                await Member.roles.remove('836422893696450590')
                return menu.reply.send("<a:pp833:853495989796470815> Removed the All Annoucments mention role", true)
            }
        }
    
        if(menu.values[0] == 'DR2') {
            if(!Member.roles.cache.has('836422786247294976')) {
                await Member.roles.add('836422786247294976')
                return menu.reply.send("<a:pp330:853495519455215627> You got the Free Games Mention role", true)
            } else if(Member.roles.cache.has('836422786247294976')) {
                await Member.roles.remove('836422786247294976')
                return menu.reply.send("<a:pp833:853495989796470815> Removed the Free Games Mention role", true)
            }
        }
        if(menu.values[0] == 'DR3') {
            if(!Member.roles.cache.has('836423291601944596')) {
                await Member.roles.add('836423291601944596')
                return menu.reply.send("<a:pp330:853495519455215627> You got the Looking For group mention role", true)
            } else if(Member.roles.cache.has('836423291601944596')) {
                await Member.roles.remove('836423291601944596')
                return menu.reply.send("<a:pp833:853495989796470815> Removed the Looking For group mention role", true)
            }
        }
        if(menu.values[0] == 'DR4') {
            if(!Member.roles.cache.has('836422784317259777')) {
                await Member.roles.add('836422784317259777')
                return menu.reply.send("<a:pp330:853495519455215627> You got the Watching party mention role", true)
            } else if(Member.roles.cache.has('836422784317259777')) {
                await Member.roles.remove('836422784317259777')
                return menu.reply.send("<a:pp833:853495989796470815> Removed the Watching party mention role", true)
            }
        }
        if(menu.values[0] == 'DR5') {
            if(!Member.roles.cache.has('870351250502340680')) {
                await Member.roles.add('870351250502340680')
                return menu.reply.send("<a:pp330:853495519455215627> You got the Partner mention role", true)
            } else if(Member.roles.cache.has('870351250502340680')) {
                await Member.roles.remove('870351250502340680')
                return menu.reply.send("<a:pp833:853495989796470815> Removed the highest hit role", true)
            }
        }
    
        if(menu.values[0] == 'DRreturn') {
            return menu.reply.defer()
        }
    }
}
