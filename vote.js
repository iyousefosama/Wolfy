const express = require('express')
const { Webhook } = require(`@top-gg/sdk`)

const app = express()
const wh = new Webhook('webhookauth123')

app.post('/dblwebhook', wh.listener(vote => {
  // vote is your vote object e.g
  vote.user.send(`<a:Diamond:853496052899381258> Thanks for supporting our bot!`)
  console.log(vote.user) // => 321714991050784770
}))

app.listen(80)