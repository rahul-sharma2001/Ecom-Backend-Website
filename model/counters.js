const mongoose = require('mongoose');
let counterSchema = mongoose.Schema({
    orderIdCounter:Number
})
module.exports = mongoose.model('counters',counterSchema);