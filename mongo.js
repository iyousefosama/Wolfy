const mongo = require('mongoose')
const { mongoPath } = require('./config.json')

module.exports = async () => {
    await mongo.connect(mongoPath, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    return mongo
}

mongo.connection.on('connected', () => {
    console.log('✅ Sucessfully connected to mongo')
})
