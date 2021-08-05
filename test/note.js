process.env.TESTENV = true

let note = require('../app/models/note.js')
let User = require('../app/models/user')

const crypto = require('crypto')

let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../server')
chai.should()

chai.use(chaiHttp)

const token = crypto.randomBytes(16).toString('hex')
let userId
let noteId

describe('notes', () => {
  const noteParams = {
    title: '13 JavaScript tricks SEI instructors don\'t want you to know',
    text: 'You won\'believe number 8!'
  }

  before(done => {
    note.deleteMany({})
      .then(() => User.create({
        email: 'caleb',
        hashedPassword: '12345',
        token
      }))
      .then(user => {
        userId = user._id
        return user
      })
      .then(() => note.create(Object.assign(noteParams, {owner: userId})))
      .then(record => {
        noteId = record._id
        done()
      })
      .catch(console.error)
  })

  describe('GET /notes', () => {
    it('should get all the notes', done => {
      chai.request(server)
        .get('/notes')
        .set('Authorization', `Token token=${token}`)
        .end((e, res) => {
          res.should.have.status(200)
          res.body.notes.should.be.a('array')
          res.body.notes.length.should.be.eql(1)
          done()
        })
    })
  })

  describe('GET /notes/:id', () => {
    it('should get one note', done => {
      chai.request(server)
        .get('/notes/' + noteId)
        .set('Authorization', `Token token=${token}`)
        .end((e, res) => {
          res.should.have.status(200)
          res.body.note.should.be.a('object')
          res.body.note.title.should.eql(noteParams.title)
          done()
        })
    })
  })

  describe('DELETE /notes/:id', () => {
    let noteId

    before(done => {
      note.create(Object.assign(noteParams, { owner: userId }))
        .then(record => {
          noteId = record._id
          done()
        })
        .catch(console.error)
    })

    it('must be owned by the user', done => {
      chai.request(server)
        .delete('/notes/' + noteId)
        .set('Authorization', `Bearer notarealtoken`)
        .end((e, res) => {
          res.should.have.status(401)
          done()
        })
    })

    it('should be succesful if you own the resource', done => {
      chai.request(server)
        .delete('/notes/' + noteId)
        .set('Authorization', `Bearer ${token}`)
        .end((e, res) => {
          res.should.have.status(204)
          done()
        })
    })

    it('should return 404 if the resource doesn\'t exist', done => {
      chai.request(server)
        .delete('/notes/' + noteId)
        .set('Authorization', `Bearer ${token}`)
        .end((e, res) => {
          res.should.have.status(404)
          done()
        })
    })
  })

  describe('POST /notes', () => {
    it('should not POST an note without a title', done => {
      let noTitle = {
        text: 'Untitled',
        owner: 'fakedID'
      }
      chai.request(server)
        .post('/notes')
        .set('Authorization', `Bearer ${token}`)
        .send({ note: noTitle })
        .end((e, res) => {
          res.should.have.status(422)
          res.should.be.a('object')
          done()
        })
    })

    it('should not POST an note without text', done => {
      let noText = {
        title: 'Not a very good note, is it?',
        owner: 'fakeID'
      }
      chai.request(server)
        .post('/notes')
        .set('Authorization', `Bearer ${token}`)
        .send({ note: noText })
        .end((e, res) => {
          res.should.have.status(422)
          res.should.be.a('object')
          done()
        })
    })

    it('should not allow a POST from an unauthenticated user', done => {
      chai.request(server)
        .post('/notes')
        .send({ note: noteParams })
        .end((e, res) => {
          res.should.have.status(401)
          done()
        })
    })

    it('should POST an note with the correct params', done => {
      let validnote = {
        title: 'I ran a shell command. You won\'t believe what happened next!',
        text: 'it was rm -rf / --no-preserve-root'
      }
      chai.request(server)
        .post('/notes')
        .set('Authorization', `Bearer ${token}`)
        .send({ note: validnote })
        .end((e, res) => {
          res.should.have.status(201)
          res.body.should.be.a('object')
          res.body.should.have.property('note')
          res.body.note.should.have.property('title')
          res.body.note.title.should.eql(validnote.title)
          done()
        })
    })
  })

  describe('PATCH /notes/:id', () => {
    let noteId

    const fields = {
      title: 'Find out which HTTP status code is your spirit animal',
      text: 'Take this 4 question quiz to find out!'
    }

    before(async function () {
      const record = await note.create(Object.assign(noteParams, { owner: userId }))
      noteId = record._id
    })

    it('must be owned by the user', done => {
      chai.request(server)
        .patch('/notes/' + noteId)
        .set('Authorization', `Bearer notarealtoken`)
        .send({ note: fields })
        .end((e, res) => {
          res.should.have.status(401)
          done()
        })
    })

    it('should update fields when PATCHed', done => {
      chai.request(server)
        .patch(`/notes/${noteId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ note: fields })
        .end((e, res) => {
          res.should.have.status(204)
          done()
        })
    })

    it('shows the updated resource when fetched with GET', done => {
      chai.request(server)
        .get(`/notes/${noteId}`)
        .set('Authorization', `Bearer ${token}`)
        .end((e, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.note.title.should.eql(fields.title)
          res.body.note.text.should.eql(fields.text)
          done()
        })
    })

    it('doesn\'t overwrite fields with empty strings', done => {
      chai.request(server)
        .patch(`/notes/${noteId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ note: { text: '' } })
        .then(() => {
          chai.request(server)
            .get(`/notes/${noteId}`)
            .set('Authorization', `Bearer ${token}`)
            .end((e, res) => {
              res.should.have.status(200)
              res.body.should.be.a('object')
              // console.log(res.body.note.text)
              res.body.note.title.should.eql(fields.title)
              res.body.note.text.should.eql(fields.text)
              done()
            })
        })
    })
  })
})
