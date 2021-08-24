const Discord = require('discord.js');
const client = new Discord.Client();
const express = require('express')
const { Webhook } = require(`@top-gg/sdk`)

const app = express()
const wh = new Webhook('webhookauth123')

app.post('/dblwebhook', wh.listener(vote => {
  console.log(vote.user)
  client.users.fetch(vote.user).then(u => {
    u.send("Thanks for voting")
  }).catch(console.error)
}))

app.listen(process.env.PORT) 
