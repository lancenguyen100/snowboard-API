// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for snowboard
const Snowboard = require('../models/snowboard')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { example: { title: '', text: 'foo' } } -> { example: { text: 'foo' } } // MIDDLEWARE //
const removeBlanks = require('../../lib/remove_blank_fields')
const snowboard = require('../models/snowboard')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()


// ROUTES GO HERE
// we only need three, and we want to set them up using the same conventions as our other routes, which means we might need to refer to those other files to make sure we're using our middleware correctly

// POST - TO CREATE A BOOT
// POST /boots/<snowboard_id>
router.post('/boots/:snowboardId', removeBlanks, (req, res, next) => {
    // get our boot from req.body
    const boot = req.body.boot
    // get our snowboard's id from req.params.snowboardId
    const snowboardId = req.params.snowboardId
    // find the snowboard
    Snowboard.findById(snowboardId)
        .then(handle404)
        .then(snowboard => {
            console.log('this is the snowboard', snowboard)
            console.log('this is the boot', boot)

            // push the boot into the snowboard's boots array
            snowboard.boots.push(boot)

            // save the snowboard
            return snowboard.save()
            
        })
        // send the newly updated snowboard as json
        .then(snowboard => res.status(201).json({ snowboard: snowboard }))
        .catch(next)
})


// UPDATE A BOOT
// PATCH /boots/<snowboard_id><boot_id>
router.patch('/boots/:snowboardId/:bootId', requireToken, removeBlanks, (req, res, next) => {
    // get the boot and the snowboard ids saved to variables
    const snowboardId = req.params.snowboardId
    const bootId = req.params.bootId

    // find our snowboard
    Snowboard.findById(snowboardId)
        .then(handle404)
        .then(snowboard => {
            // single out the boot (.id is a subdoc method to find something in an array of subdocs)
            const theBoot = snowboard.boots.id(bootId)
            // make sure the user sending the request is the owner
            requireOwnership(req, snowboard)
            // update the boot with a subdocument method
            theBoot.set(req.body.boot)
            // return the saved snowboard
            return snowboard.save()
        })
        .then(() => res.sendStatus(204))
        .catch(next)
})


// DELETE A BOOT
// DELETE /boots/<snowboard_id><boot_id>
router.delete('/boots/:snowboardId/:bootId', requireToken, (req, res, next) => {
    // get the boot and the snowboard ids saved to variables
    const snowboardId = req.params.snowboardId
    const bootId = req.params.bootId
    // then we find the snowboard
    Snowboard.findById(snowboardId)
        // handle a 404
        .then(handle404)
        // do stuff with the boot(in this case, delete it)
        .then(snowboard => {
            // we can get the subdoc the same way as update
            const theBoot = snowboard.boots.id(bootId)
            // require that the user deleting this boot is the snowboard's owner
            requireOwnership(req, snowboard)
            // call remove on the subdoc
            theBoot.remove()

            // return the saved snowboard
            return snowboard.save()
        })
        // send 204 no content status
        .then(() => res.sendStatus(204))
        // handle errors
        .catch(next)
})

// export the router
module.exports = router