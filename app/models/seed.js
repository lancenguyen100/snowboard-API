// seed.js is going to be the file we run, whenever we want to seed our database, we'll create a bunch of pets at once.

// we want to be careful with this, because when we run it, it'll delete all of the pets in the db. 

// we can modify this later, to only delete pets that don't have an owner already, but we'll keep it simple for now.

const mongoose = require('mongoose')
const Snowboard = require('./snowboard')
const db = require('../../config/db')

const starterSnowboards = [
    {brand: 'Burton', type: 'freestyle board', color: "black", size: 160},
    {brand: 'Ride', type: 'powder board', color: "pink", size: 154},
    {brand: 'Nitro', type: 'freestyle board', color: "sky blue", size: 165},
    {brand: 'Gnu', type: 'all mountain board', color: "tan", size: 170}
]

// first we need to connect to the database
mongoose.connect(db, {
    useNewUrlParser: true
})
    .then(() => {
        // first we remove all of the pets

        // owner: null prevents the deletion of items with an owner when we seed
        Snowboard.deleteMany({owner: null })
            .then(deletedSnowboards => {
                console.log('deletedSnowboards', deletedSnowboards)
                // the next step is to use our startPets array to create our seeded pets
                Snowboard.create(starterSnowboards)
                    .then(newSnowboards => {
                        console.log('the new snowboards', newSnowboards)
                        mongoose.connection.close()
                    })
                    .catch(error => {
                        console.log(error)
                        mongoose.connection.close()
                    })
            })
            .catch(error => {
                console.log(error)
                mongoose.connection.close()
            })
    })
    .catch(error => {
        console.log(error)
        mongoose.connection.close()
    })