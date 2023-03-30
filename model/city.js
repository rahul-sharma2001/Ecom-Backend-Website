const mongoose = require('mongoose')

const citySchema = mongoose.Schema({
    id: {
        type: Number
    },
    name: {
        type: String,
        required: true
    },
    state_id: {
        type: String,
        required: true
    }
})


const Cities = mongoose.model("Cities", citySchema)
module.exports = Cities