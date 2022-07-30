const mongoose = require('mongoose')

// boot is a subdocument NOT A MODEL
// boot will be part of the boots array added to specific snowboards

// we dont, DO NOT, need to get the model from mongoose, so we're going to save a lil real estate in our file and skip destructuring, in favor of the regular syntax
const bootSchema = new mongoose.Schema({
    brand: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    typeBoa: {
        type: Boolean,
        default: false,
        required: true
    },
    condition: {
        type: String,
        // here we're going to use enum, which means we can only use specific strings to satisfy this field.
        // enum is a validator on the type String, that says "you can only use one of these values"
        enum: ['new', 'used', 'antique'],
        default: 'new'
    }
}, {
    timestamps: true
})

module.exports = bootSchema