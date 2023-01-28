const discord = require('discord.js')
const schema = require('../schema/CommandsManager-Schema')
const Ecoschema = require('../schema/Economy-Schema')
const text = require('../util/string');

exports.manage = async function (client, message, cmd) {

    if(!message) {
        return;
    }

    if (message.author == client.user) return;
    if (message.author.bot){
        return;
    };


    const cmdObj = {
        authorTag: message.author.tag,
        timestamp: Math.floor(Date.now() / 1000),
        content: message.content
    };

    const cmdData = await schema.findOneAndUpdate(
        {
            userID: message.author.id,
        },
        {
            $set: {
                userID: message.author.id,
            },
            $push: {
                [`UsedCommandsInv.${cmd.name}`]: cmdObj
            }
        },
        {
            upsert: true,
        },
    );

    const cmdCount = cmdData.UsedCommandsInv[cmd.name] ? cmdData.UsedCommandsInv[cmd.name].length + 1 : 1;

    const firstLvl = Math.floor(Math.random() * 20) + 25;
    if(cmdCount >= firstLvl) {
        let data;
        try{
            data = await schema.findOne({
                userID: message.author.id
            })
            if(!data) {
            data = await schema.create({
                userID: message.author.id
            })
            }
        } catch(err) {
            console.log(err)
        }

        const user = client.users.cache.get(message.author.id)
        user?.send({ content: `:wave: ​Hello **${message.author.tag}**, We have discovered that you used the \`${cmd.name}\` command for **${firstLvl}** times!\n\n• We want to know your rating and if you have any suggestion for us that will be very helpful for us! \❤️ \n• Send your feedback with \`w${client.prefix}feedback\`​ command or just type it here! 🤝 \n **Thanks** for using \🤖 Wolfy!`}).then(async () => {
            data.credits += Math.floor(firstLvl * 5);
            return await data.save()
            .then(()=> user?.send(`<a:Money:836169035191418951> **${message.author.tag}**, You successfully collected \`${text.commatize(Math.floor(firstLvl * 5))}\` as a reward for this!`))
            .catch(err => user?.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: \`${err.name}\``));
        }).catch(() => null)
    }
  };