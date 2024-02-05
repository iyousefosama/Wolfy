const discord = require('discord.js')
const schema = require('../schema/CommandsManager-Schema')
const Ecoschema = require('../schema/Economy-Schema')
const text = require('../util/string');
const Manager = require('./Manager'); // Add this line to import the Manager module

exports.manage = async function (client, message, cmd) {

    if(!message) {
        return;
    }

    if (message.author == client.user) return;
    if (message.author.bot){
        return;
    };

    const now = Math.floor(Date.now() / 1000);
    const DeleteDuration = Math.floor(1.814e+9 / 1000); // 4 Weeks
    const DateToDel = Math.floor(now + DeleteDuration)
    const duration = Math.floor(3000)
    const UsedCommandsWarnsResetduration = Math.floor(57600000)
    const GlobalWarnsResetResetduration = Math.floor(86400000)

    const cmdObj = {
        authorTag: message.author.tag,
        timestamp: now,
        content: message.content
    };

    await schema.findOneAndUpdate(
        {
            userID: message.author.id,
        },
        {
            $set: {
                userID: message.author.id,
            },
            $push: {
                [`UsedCommandsInv.${cmd.name}`]: cmdObj
            },
            $setOnInsert: {
                timerStart: 0,
                timerEnd: 0,
                timeoutReset: null,
                UsedCommandsWarn: 0,
                UsedCommandsWarnsReset: null,
                GlobalWarns: 0,
                GlobalWarnsReset: null,
                'Status.SilentBlacklist.reason': null,
            },
        },
        {
            upsert: true,
            new: true, // return the updated document
        },
    ).then(async cmdData => {

    if (cmdData.timeoutReset > now && cmdData.UsedCommandsWarn !== 25 && cmdData.GlobalWarns !== 3) {
        cmdData.UsedCommandsWarn += 1;
        cmdData.UsedCommandsWarnsReset = Date.now() + UsedCommandsWarnsResetduration;
    } else if (cmdData.UsedCommandsWarnsReset < now) {
        cmdData.UsedCommandsWarn = 0;
    } else if (cmdData.UsedCommandsWarn === 25 && cmdData.GlobalWarns !== 3) {
        cmdData.GlobalWarns += 1;
        cmdData.UsedCommandsWarn = 0;
        cmdData.GlobalWarnsReset = Date.now() + GlobalWarnsResetResetduration;
    } else if (cmdData.GlobalWarnsReset < now) {
        cmdData.GlobalWarns = 0;
    } else if (cmdData.GlobalWarns === 3) {
        cmdData.Status.SilentBlacklist.current = true;
        cmdData.Status.SilentBlacklist.reason = 'Wolfy: SelfBot, spamming commands!';
    }

    await cmdData.save();

        if (cmdData.UsedCommandsInv[cmd.name]?.some(obj => obj.authorTag === message.author.tag)) {
            // Command has already been executed by the user, no need to send reward again
            return;
        }

        if (cmdData.timerStart == 0) {
            cmdData.timerStart = now;
            cmdData.timerEnd = DateToDel;
            await cmdData.save().then(() => {
                setTimeout(async () => {
                    cmdData.timerStart = 0;
                    cmdData.timerEnd = 0;
                    await cmdData.deleteOne({ userID: message.author.id });
                }, DeleteDuration);
            })
        }

        const cmdCount = cmdData.UsedCommandsInv[cmd.name] ? cmdData.UsedCommandsInv[cmd.name].length + 1 : 1;

        const firstLvl = Math.floor(Math.random() * 20) + 50;
        if (cmdCount >= firstLvl) {
            let data;
            try {
                data = await Ecoschema.findOne({
                    userID: message.author.id
                })
                if (!data) {
                    data = await Ecoschema.create({
                        userID: message.author.id
                    })
                }
            } catch (err) {
                console.log(err)
            }

            const user = client.users.cache.get(message.author.id)
            user?.send({ content: `:wave: ​Hello **${message.author.tag}**, We have discovered that you used the \`${cmd.name}\` command for **${firstLvl}** times!\n\n• We want to know your rating and if you have any suggestion for us that will be very helpful for us! \❤️ \n• Send your feedback with \`w${client.prefix}feedback\`​ command! 🤝 \n **Thanks** for using \🤖 Wolfy!` }).then(async () => {
                data.credits += Math.floor(firstLvl * 5);
                await data.save()
                    .then(() => user?.send(`<a:Money:836169035191418951> **${message.author.tag}**, You successfully collected \`${text.commatize(Math.floor(firstLvl * 5))}\` as a reward for this!`))
                    .catch(err => user?.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: \`${err.name}\``));
            }).catch(() => null)
        }
    })
}