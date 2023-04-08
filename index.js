require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const token = morgan.token('data', function (req, res) {
    return Object.keys(req.body).length === 0 ? "" : JSON.stringify(req.body)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    next(error)
}

const app = express()
app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

app.get('/info', (request, response, next) => {
    Person.find({}).then(persons => {
        response.send(`<div>Phonebook has info for ${persons.length} people</div>` +
            `<div>${new Date()}</div>`)
    }).catch(error => next(error))
})

app.get('/api/persons', (request, response, next) => {
    Person.find({}).then(persons => {
        response.json(persons)
    }).catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
        if (person)
            return response.json(person)
        else
            return response.status(404).end()
    }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id).then(result => {
        if (result)
            return response.status(204).end()
        else
            return response.status(404).end()
    }).catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    body = request.body
    if (!body.name)
        return response.status(400).json({ error: 'Name is missing.' })
    else if (!body.number)
        return response.status(400).json({ error: 'Number is missing.' })

    Person.find({}).then(persons => {
        if (persons.map(p => p.name).includes(body.name)) {
            return response.status(400).json({ error: 'Name must be unique.' })
        }
        const person = new Person({
            name: body.name,
            number: body.number
        })
        person.save().then(savedPerson => {
            response.json(savedPerson)
        }).catch(error => next(error))
    }).catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const person = {
        name: request.body.name,
        number: request.body.number,
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(result => response.json(result))
        .catch(error => next(error))
})

//Olemattomien osoitteiden ja virheiden käsittely
app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}!`)
})