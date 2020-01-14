// implement your API here
const express = require('express'); // installing express dependency - npm i express

const Users = require('./data/db'); // database library

const server = express(); // creating server variable

server.use(express.json()); // need to parse JSON

// routes or endpoints

server.get('/', (req, res) => {
    res.send({ hello: 'Is this working?'})
})

// When the client makes a GET request to /api/users:
server.get('/api/users', (req, res) => {
    Users.find()
    .then(users => {
        res.status(200).json(users)
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({
            errorMessage: "The users information could not be retrieved."
        })
    })
})

// When the client makes a POST request to /api/users:
server.post('/api/users', (req, res) => {
    const { name, bio} = req.body;
    Users.insert(req.body)
        .then(user => {
            if (!name || !bio) {
                res.status(400).json({
                    errorMessage: "Please provide name and bio for the user."
                })
            } else {
                res.status(201).json(user)
            }
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({
                errorMessage: "There was an error while saving the user to the database"
            })
        })
})

// When the client makes a GET request to /api/users/:id:
server.get('/api/users/:id', (req, res) => {
    const specificData = req.params.id;
    Users.findById(specificData)
        .then(specificData => {
            if (specificData) {
                res.status(201).json(specificData)
                console.log(specificData)
            } else {
                res.status(404).json({
                    message: "The user with the specific ID does not exist."
                })
            }
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({
                errorMessage: "The user information could not be retrieved."
            })
        })
})

// When the client makes a DELETE request to /api/users/:id:
server.delete('/api/users/:id', (req, res) => {
    const userToDelete = req.params.id;
    Users.remove(userToDelete)
        .then(deleted => {
            if (deleted) {
                res.status(200).json(deleted)
                console.log('User Deleted: ', deleted)
            } else {
                res.status(404).json({
                    errorMessage: "The user with the sepcified ID does not exist."
                })
            }
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({
                errorMessage: "The user could not be removed"
            })
        })
})

// When the client makes a PUT request to /api/users/:id:
server.put('/api/users/:id', (req, res) => {
    const userIdToUpdate = req.params.id;
    const { name, bio } = req.body;
    if (!name || !bio) {
        res.status(400).json({
            errorMessage: "Please provide name and bio for the user"
        })
    }
    Users.update(userIdToUpdate, {name, bio})
        .then(UpdateUser => {
            if (UpdateUser) {
                Users.findById(userIdToUpdate)
                .then(user => {
                    res.status(201).json(user);
                })
            } else {
                res.status(404).json({
                    errorMessage: "The user with the specified ID does not exist."
                })
            }
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({
                errorMessage: "The user information could not be modified."
            })
        })
})


const port = 8000;
server.listen(port, () => console.log(`\n** api on port: ${port} ** \n`))