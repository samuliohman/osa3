const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())
app.use(morgan('tiny'))

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
]

app.get('/info', (request, response) => {
    response.send(`<div>Phonebook has info for ${persons.length} people</div>` +
        `<div>${new Date()}</div>`)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const info = persons.find(person => person.id === id)
    if (info) {
        response.json(info)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    if (!persons.map(p => p.id).includes(id)) {
        return response.status(404).end()
    }
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    var newId = Math.floor(Math.random() * 100000)
    while (persons.map(p => p.id).includes(newId)) {
        newId = Math.floor(Math.random() * 100000)
    }
    body = request.body
    if (!body.name) {
        return response.status(400).json({ error: 'Name is missing.' })
    }
    if (persons.map(p => p.name).includes(body.name)) {
        return response.status(400).json({ error: 'Name must be unique.' })
    }
    if (!body.number) {
        return response.status(400).json({ error: 'Number is missing.' })
    }
    person = {
        id: newId,
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)
    response.json(person)
})

const PORT = 3001

app.listen(PORT, () => {
    console.log("Server running on PORT 3001!")
})