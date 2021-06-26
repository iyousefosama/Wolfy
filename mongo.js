const Mongoose = require ('mongoose');
const Config   = require ('./config.json')

module.exports = {
name : 'mongo-connection',

run: async (/* no parameter here*/) => {
await Mongoose.connect ( Config.mongoPath, {
useNewUrlParser: Boolean, /*put this to true */
useUnifiedTopology: Boolean, /* put this to tue */
} ).then(() => {
console.log ('Connected to the db')
})
}
}
