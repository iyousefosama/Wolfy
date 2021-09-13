const Discord = require('discord.js')
const schema = require('../schema/user-schema')
const text = require('../util/string');
const { prefix } = require('../config.json');

module.exports = {
    async execute(client, req, res) {
        const user = await client.users.fetch(req.vote.user).catch(()=>{ return {}});
        const isWeekend = req.vote.isWeekend;
        const reward =  isWeekend ? 1500 : 750;
        const reason = [
          'there was an error accessing your profile from the database!',
          'you did not register to the economy system first. Use the command `register` to register and receive vote rewards.'
        ];
      
        let data;
        try{
            data = await schema.findOne({
                userID: user.id
            })
            if(!data) {
            data = await schema.create({
                userID: user.id
            })
            }
        } catch(err) {
            console.log(err)
        }
      
        let overflow = false, excess = null;
      
        if (data.credits + reward > 5e4){
          overflow = true;
          excess = data.credits + reward - 5e4;
        };
      
        data.credits += overflow ? reward - excess : reward;
      
        return data.save()
        .then(() => {
          const message = [
            `<a:animatedcheck:758316325025087500> | **${user.tag}**, Thanks for voting!`,
            `You received **${text.commatize(reward)}** ${isWeekend ? '**(Double Weekend Reward)**' : ''} credits as a reward!`,
            overflow ? `\n⚠️Overflow warning! Please deposit some of your account to your **bank**. You only received ${reward - excess} for this one!` :'',
            `Don't want to get notified of every vote you make? Use the command \`${prefix}togglevotenotif\` to enable/disable vote notifications!\n(Does not prevent you from receiving rewards)`
          ].join('\n')
      
            user?.send(message).catch(()=>{
              return console.log(`[VOTE_EVENT]: Could not send message to user ${req.vote.user}`);
            });
      
          return;
        })
    }
}