const mongoose = require('mongoose')

const countrySchema = mongoose.Schema({
    _id:{
        type: Number
    },
    name: {
        type: String
    },
    shortname:{
        type: String,
        required: true
    }
})


const Country  = mongoose.model('Country', countrySchema)
module.exports = Country