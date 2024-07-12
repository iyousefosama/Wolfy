const schema = require('../../schema/Economy-Schema')
const quests = require('../../assets/json/quests.json');

/**
 * @param {import("discord.js").Client} client
 */
module.exports = async (client) => {
    await new Promise(r=>setTimeout(r,10000))
    const checkQuests = async () => {
        if(!client.database.connected) return;
        let data;
        try{
          data = await schema.find({})
      } catch(err) {
          console.log(err)
          console.log(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`)
      }
          let members = []
      
          for (let obj of data) {
              if(client.users.cache
              .map((user) => user.id)
              .includes(obj.userID)) members.push(obj)
          }
      
          members = members.sort(function (b, a) {
              return a.progress.TimeReset - b.progress.TimeReset
          })
      
          members = members.filter(function BigEnough(value) {
              return value.progress.TimeReset > 0 || value.progress.TimeReset > Date.now();
          })
      
          members.forEach(async (member) => {
            const now = Date.now();
            if(member.progress.TimeReset > now) {
                return;
            }
            const duration = Math.floor(86400000)
            let bucket = [];
        
            for (let i=0; i < quests.length; i++) {
                bucket.push(i);
            }
            function getRandomFromBucket() {
               let randomIndex = Math.floor(Math.random() * bucket.length);
               return bucket.splice(randomIndex, 1)[0];
            }
            member.progress.quests = []
            member.progress.claimed = false;
            member.progress.completed = 0;
            member.progress.quests.push(quests[getRandomFromBucket()], quests[getRandomFromBucket()], quests[getRandomFromBucket()], quests[getRandomFromBucket()], quests[getRandomFromBucket()])
            member.progress.TimeReset = Math.floor(now + duration);
            return await member.save()
          });
        setTimeout(checkQuests, 30000)
      }
      checkQuests()
};