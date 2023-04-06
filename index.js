const express = require('express')
const app = express()

const persons = [
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
/*
const info = () => {
    return (
        <div>
            <p>Phonebook has {persons.length}</p>
            <p>{new Date()}</p>
        </div>
    )
}*/

app.get('/info', (request, response) => {
    response.send(`<div>Phonebook has info for ${persons.length} people</div>` +
        `<div>${new Date()}</div>`)
})

app.get('/api/persons', (request, response) => {
    response.send(persons)
})

const PORT = 3001

app.listen(PORT, () => {
    console.log("Server running on PORT 3001!")
})