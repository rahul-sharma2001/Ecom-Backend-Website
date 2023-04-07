const mongoose = require('mongoose')

const offresSchema = new mongoose.Schema({
    images: {
        type: [String],
        required: true
    },
    startDate:{
        type: Number,
        default: Date.now()
    },
    endDate: {
        type: Number,
        required: true
    }

    // expiresAt: {
    //     type: Date,
    //     required: true
    // }
})

const offersModel = mongoose.model('offers', offresSchema);

module.exports = offersModel