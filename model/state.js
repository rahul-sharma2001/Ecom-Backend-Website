const mongoose = require('mongoose')
const stateSchema = mongoose.Schema({
    _id: {
        type: Number
    },
    name: {
        type: String,
        required:true
    },
      country_id: {
        type: String,
        required: true
      }
})

const State = mongoose.model('State', stateSchema)
module.exports = State