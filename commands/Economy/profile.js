const Discord = require('discord.js');
const schema = require('../../schema/Economy-Schema')
const { createCanvas, loadImage } = require('canvas');
const moment = require("moment");
const config = require('../../config.json')

module.exports = {
    name: "profile",
    aliases: ["Profile", "PROFILE"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '',
    group: 'Economy',
    description: 'Shows your profile card!',
    cooldown: 2, //seconds(s)
    guarded: false, //or false
    permissions: [],
    examples: [''],
    async execute(client, message, [member = '']) {

        member = member.match(/\d{17,18}/)?.[0] || message.member.id;
        member = await message.guild.members.fetch(member).catch(() => message.member);
    
        if (member.user.bot){
          return message.channel.send(`\\❌ Bots cannot earn XP!`);
        };

        let data;
        try{
            data = await schema.findOne({
                userID: member.id
            })
            if(!data) {
            data = await schema.create({
                userID: member.id
            })
            }
        } catch(err) {
            console.log(err)
        }
    
          const canvas = createCanvas(800,600);
          const ctx = canvas.getContext('2d');
          const color = data.profile.color || 'rgb(92,89,89)'
    
          const emblem = data.profile.badge ? await loadImage(data.profile.badge) : null;
          const def = await loadImage(data.profile.ProfileBackground || 'https://i.imgur.com/Ry73PG3.jpg');
          const defpattern = await loadImage('https://i.imgur.com/s4IHLbB.jpg');
          const avatar = await loadImage(member.user.displayAvatarURL({format: 'png'}));
          // add the wallpaper
          ctx.drawImage(def,300,65,475,250);
    
          // add the bio card
          ctx.beginPath();
          ctx.moveTo(300,315);
          ctx.lineTo(canvas.width-5,315);
          ctx.lineTo(canvas.width-5,canvas.height-25);
          ctx.lineTo(300, canvas.height - 25);
          ctx.fillStyle = 'rgba(255,255,255,0.8)'
          ctx.shadowColor = "rgba(0,0,0,0.5)";
          ctx.shadowBlur = 40;
          ctx.shadowOffsetX = -10;
          ctx.shadowOffsetY = -40;
          ctx.fill();
    
          // add bio outline
          ctx.beginPath();
          ctx.moveTo(370, 338);
          ctx.lineTo(canvas.width-40, 338)
          ctx.arcTo(canvas.width-20, 338, canvas.width - 20, 358, 20);
          ctx.lineTo(canvas.width-20, 378)
          ctx.arcTo(canvas.width -20, 398, canvas.width - 40, 398, 20);
          ctx.lineTo(330, 398)
          ctx.arcTo(310,398,310,378,20)
          ctx.lineTo(310, 358)
          ctx.arcTo(310,338,330,338,20)
          ctx.lineWidth = 1;
          ctx.strokeStyle = 'rgba(0,0,0,0.4)'
          ctx.stroke();
    
          // add bio title
          ctx.beginPath();
          ctx.font = 'bold 20px sans-serif'
          ctx.fillStyle = 'rgba(0,0,0,0.4)'
          ctx.fillText('BIO', 330, 345, 50)
    
          // add bio text to bio carrd
          ctx.beginPath();
          ctx.font = '15px sans-serif'
          ctx.fillStyle = 'rgba(0,0,0,0.8)'
          ctx.textAlign = 'center'
          ctx.fillText(data.profile.bio, 555, 368, 490)
    
          // add birthday outline
          ctx.beginPath();
          ctx.moveTo(410, 419);
          ctx.lineTo(520,419);
          ctx.arcTo(540,419,540,439,20);
          ctx.arcTo(540,459,520,459,20);
          ctx.lineTo(330,459);
          ctx.arcTo(310,459,310,439,20);
          ctx.arcTo(310,419,320,419,20);
          ctx.stroke();
    
          // add birthday title
          ctx.beginPath();
          ctx.font = 'bold 18px sans-serif'
          ctx.fillStyle = 'rgba(0,0,0,0.4)'
          ctx.textAlign = 'left'
          ctx.fillText('BIRTHDAY', 330, 425, 80)
    
          // add birthday text to birthday card
          ctx.beginPath();
          ctx.font = '15px sans-serif'
          ctx.fillStyle = 'rgba(0,0,0,0.8)'
          ctx.fillText(data.profile.birthday || 'Not Set', 330, 445, 230)
    
          // add balance outline
          ctx.beginPath();
          ctx.moveTo(410,479);
          ctx.lineTo(520,479);
          ctx.arcTo(540,479,540,499,20);
          ctx.lineTo(540,509);
          ctx.arcTo(540,529,520,529,20);
          ctx.lineTo(330,529);
          ctx.arcTo(310,529,310,509,20);
          ctx.lineTo(310,499);
          ctx.arcTo(310,479,330,479,20);
          ctx.stroke();
    
          // add balance title
          ctx.beginPath();
          ctx.font = 'bold 18px sans-serif'
          ctx.fillStyle = 'rgba(0,0,0,0.4)'
          ctx.fillText('BALANCE', 330, 485, 80)
    
          // add balance text to balance card
          ctx.beginPath();
          ctx.font = '18px sans-serif'
          ctx.fillStyle = 'rgba(0,0,0,0.8)'
          ctx.fillText(`💴: ${data.credits || '0'}`, 330, 512, 80)
          ctx.fillText(`🏦: ${data.Bank.balance.credits || '0'}`, 430, 512, 80)
    
          // add emblem indicator
          if (!emblem){
            ctx.beginPath();
            ctx.fillStyle = 'rgba(0,0,0,0.4)'
            ctx.font = 'bold 25px sans-serif'
            ctx.textAlign = 'center'
            ctx.fillText('NO', 660 , 469, 150)
            ctx.fillText('Badge', 660, 500, 150)
          } else {
            ctx.shadowBlur = 10;
            ctx.shadowOffsetX = 10;
            ctx.shadowOffsetY = 10;
            ctx.beginPath();
            ctx.drawImage(emblem,580,400,160,160);
          };
    
    
          // add the tip shape
          ctx.beginPath();
          ctx.moveTo(800,10);
          ctx.lineTo(575,10);
          ctx.lineTo(620,80);
          ctx.lineTo(820,80);
          ctx.fillStyle = color;
          ctx.shadowBlur = 30;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 30;
          ctx.fill();
    
          // write tip on tip shape
          ctx.beginPath();
          ctx.font = 'bold 30px sans-serif'
          ctx.fillStyle = 'rgba(255,255,255,0.8)'
          ctx.textAlign = 'left'
          ctx.fillText('TIP',610,50,50)
    
          // write received tips on tip shape
          ctx.beginPath();
          ctx.font = 'bold 30px sans-serif'
          ctx.textAlign = 'right'
          ctx.fillText("0", canvas.width - 30, 50, 120)
    
          // reset shadow
          ctx.shadowOffsetY = 0;
    
          // add card on left side
          // add pattern inside card
          ctx.fillStyle = 'rgba(255,255,255,1)'
          ctx.beginPath();
          ctx.moveTo(0,65);
          ctx.lineTo(0,535);
          ctx.arcTo(0,585,50,585,50);
          ctx.lineTo(250,585);
          ctx.lineTo(300,585);
          ctx.arcTo(300,15,250,15,50);
          ctx.lineTo(50,15);
          ctx.arcTo(0,15,0,65,50);
          ctx.stroke();
          ctx.shadowBlur = 10;
          ctx.shadowOffsetX = 10;
          ctx.fill();
          ctx.save();
          ctx.clip();
          ctx.drawImage(defpattern,0,0,300,600);
          ctx.restore();
    
          // reset shadow
          ctx.shadowOffsetX = 0;
    
          // add wavy shape below the pattern
          ctx.beginPath();
          ctx.moveTo(0, 255);
          ctx.bezierCurveTo(0,265,50,265,50,255);
          ctx.bezierCurveTo(70,245,100,245,100,255);
          ctx.bezierCurveTo(120,265,150,265,150,255);
          ctx.bezierCurveTo(170,245,200,245,200,255);
          ctx.bezierCurveTo(220,265,250,265,250,255);
          ctx.bezierCurveTo(270,245,300,245,300,255);
          ctx.lineTo(300,585);
          ctx.lineTo(50,585);
          ctx.arcTo(0,585,0,535,50);
          ctx.fillStyle = color
          ctx.fill();
          ctx.shadowBlur = 0;
    
          // add name
          ctx.beginPath()
          ctx.font = 'bold 30px sans-serif'
          ctx.fillStyle = '#ffffff'
          ctx.textAlign = 'center'
          ctx.fillText(member.displayName, 150, 350, 280)
          ctx.font = '20px sans-serif'
          ctx.fillText(member.user.tag, 150, 375, 280)
    
          // add avatar
          ctx.beginPath();
          ctx.arc(150,225,75, 0, Math.PI * 2);
          ctx.lineWidth = 6;
          ctx.strokeStyle = 'rgba(0,0,0,0.6)'
          ctx.stroke();
          ctx.closePath();
          ctx.save();
          ctx.clip();
          ctx.drawImage(avatar,75,150,150,150);
          ctx.restore();
    
          message.channel.send({
            files: [{
              attachment: canvas.toBuffer(),
              name: 'rank.png'
            }]
          });
}
}