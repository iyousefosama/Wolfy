const mongo = require('mongoose')

module.exports = async () => {
    await mongo.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    })

    return mongo
}

mongo.connection.on('connected', () => {
    console.log('✅ Sucessfully connected to mongo')
})
