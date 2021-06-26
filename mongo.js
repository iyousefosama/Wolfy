const Mongoose = require ('mongoose');
const Config   = require ('./config.json')

module.exports = {
name : 'mongo-connection',

run: async (/* no parameter here*/) => {
await Mongoose.connect ( Config.mongoPath, {
useNewUrlParser: true, /*put this to true */
useUnifiedTopology: true, /* put this to tue */
} ).then(() => {
console.log ('Connected to the db')
})
}
}
