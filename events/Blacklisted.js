const Discord = require('discord.js')
const userSchema = require('../schema/user-schema')

module.exports = {
    name: 'message',
    async execute(client, message) {
        let UserData;
        try {
            UserData = await userSchema.findOne({
                userId: message.author.id
            })
            if(!UserData) {
                UserData = await userSchema.create({
                    userId: message.author.id
                })
            }
        } catch (error) {
            console.log(error)
        }
        if(UserData.blacklisted == true) return message.channel.send(`\`\`\`diff\n- You are blacklisted from using the bot!\`\`\``)
    }
} 
