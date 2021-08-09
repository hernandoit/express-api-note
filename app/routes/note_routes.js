// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for notes
const Note = require('../models/note')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existent document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { note: { title: '', text: 'foo' } } -> { note: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
// GET /notes
router.get('/notes', requireToken, (req, res, next) => {
  Note.find({ owner: req.user.id })
    .then((notes) => {
      // `notes` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      // fetch all the events from mongodb
      return notes.map((note) => note.toObject())
    })
  // respond with status 200 and JSON of the notes
    .then((notes) => res.status(200).json({ notes: notes }))
  // if an error occurs, pass it to the handler
    .catch(next)
})

// SHOW
// GET /notes/5a7db6c74d55bc51bdf39793
router.get('/notes/:id', requireToken, (req, res, next) => {
  // req.params.id will be set based on the `:id` in the route
  Note.findById(req.params.id)
    .then(handle404)
    // if `findById` is successful, respond with 200 and "note" JSON
    .then(note => res.status(200).json({ note: note.toObject() }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// CREATE
// POST /notes
router.post('/notes', requireToken, (req, res, next) => {
  // set owner of new note to be current user
  req.body.note.owner = req.user.id

  Note.create(req.body.note)
    // respond to successful `create` with status 201 and JSON of new "note"
    .then(note => {
      res.status(201).json({ note: note.toObject() })
    })
    // if an error occurs, pass it off to our error handler
    // the error handler needs the error message and the `res` object so that it
    // can send an error message back to the client
    .catch(next)
})

// UPDATE
// PATCH /notes/5a7db6c74d55bc51bdf39793
router.patch('/notes/:id', requireToken, removeBlanks, (req, res, next) => {
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
  delete req.body.note.owner

  Note.findById(req.params.id)
    .then(handle404)
    .then(note => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, note)

      // pass the result of Mongoose's `.update` to the next `.then`
      return note.updateOne(req.body.note)
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// DESTROY
// DELETE /notes/5a7db6c74d55bc51bdf39793
router.delete('/notes/:id', requireToken, (req, res, next) => {
  Note.findById(req.params.id)
    .then(handle404)
    .then(note => {
      // throw an error if current user doesn't own `note`
      requireOwnership(req, note)
      // delete the note ONLY IF the above didn't throw
      note.deleteOne()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

module.exports = router
