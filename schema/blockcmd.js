const { Schema, model } = require("mongoose");

const blockcmdSchema = new Schema({
    Guild: { type: String, required: true },
    Command: { type: String, required: true },
});

module.exports = model("blockcmd", blockcmdSchema)