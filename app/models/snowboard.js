// SNOWBOARD -> have an owner, that is a user
// might bring in subdocument schema

const mongoose = require('mongoose')

const bootSchema = require ("./boot")

const { Schema, model } = mongoose


const snowboardSchema = new Schema(
    {
        brand: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        },
        color: {
            type: String,
            required: true
        },
        size: {
            type: Number,
            required: true
        },
        boots: [bootSchema],
        owner: {
			type: Schema.Types.ObjectId,
			ref: 'User'
		}
    }, {
        timestamps: true,

        // we're going to be adding virtuals to our model, the following lines will make sure that those virtuals are included whenever we return JSON or an Object
        toObject: { virtuals: true },
        toJSON: { virtuals: true }
    }
)

// virtuals go here
// these are virtual properties, that use existing data(saved in the database), to add a property whenever we retrieve a document and convert it to JSON or an object.
snowboardSchema.virtual('fullTitle').get(function () {
    // in here, we can do whatever javascripty things we want, to make sure we return some value that will be assigned to this virtual
    // fullTitle is going to combine the brand and type to build a title
    return `${this.brand} - ${this.type}`
})

snowboardSchema.virtual('isAShortBoard').get(function () {
    if (this.size < 145) {
        return "definitely a short board!"
    } else if (this.size >= 145 && this.size < 155) {
        return "definitely not a short board, but still a short board!"
    } else {
        return "a decent size board!"
    }
})

module.exports = model('Snowboard', snowboardSchema)