require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()
app.use(cors())
app.use(express.static('build'))
app.use(express.json())
const token = morgan.token('data', function (req, res) {
    return Object.keys(req.body).length === 0 ? "" : JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

/*
var persons = [
    {
        id: 1,
        name: 'Arto Hellas',
        number: '040-123456'
    }, {
        id: 2,
        name: 'Ada Lovelace',
        number: '39-44-5323523'
    }, {
        id: 3,
        name: 'Dan Abramov',
        number: '12-34-234345'
    }, {
        id: 4,
        name: 'Mary Peppendick',
        number: '39-23-6423122'
    },
]*/

app.get('/info', (request, response) => {
    response.send(`<div>Phonebook has info for ${persons.length} people</div>` +
        `<div>${new Date()}</div>`)
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
    /*
    const id = Number(request.params.id)
    const info = persons.find(person => person.id === id)
    if (info) {
        response.json(info)
    } else {
        response.status(404).end()
    }*/
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id).then(result => {
        if (result)
            return response.status(204).end()
        else
            return response.status(404).end()
    }).catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
    body = request.body
    if (!body.name) {
        return response.status(400).json({ error: 'Name is missing.' })
    }

    /*    if (persons.map(p => p.name).includes(body.name)) {
            return response.status(400).json({ error: 'Name must be unique.' })
        }*/
    if (!body.number) {
        return response.status(400).json({ error: 'Number is missing.' })
    }
    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}!`)
})