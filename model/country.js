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
    },
    // states: [
    //     {
    //       type: Schema.Types.ObjectId,
    //       ref: 'State'
    //     }
    //   ]
})


const Country  = mongoose.model('Country', countrySchema)
module.exports = Country