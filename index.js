const express = require('express');
const db = require('./data/db');

const server = express();

server.use(express.json());

server.get('/api/users', (req, res) =>  {
    db.find()
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res
                .status(500)
                .json({ message : "the users information could not be retrieved" });
        });
})

server.get('/api/users/:id', (req, res) => {
    const { id } = req.params;
    db.findById(id)
        .then(data => {
            data 
            ? res.json(data)
            : res
                .status(404)
                .json({ message: "the user with specified id doesn't exist" });
        })
        .catch(
            res
                .status(500)
                .json({ message: "the user information could not be retrived" })
        );
})

server.post('/api/users', (req, res) => {
    const user = req.body;
    user.name && user.bio 
    ? db.insert(user)
        .then(data => {
            db.findById(data.id)
                .then(data => {
                    res
                        .status(201)
                        .json(data);
                })
        })
        .catch(err => {
            res
                .status(500)
                .json({ error: "There was an error while saving the user to the database" });
        })
    : res
        .status(400)
        .json({ errorMessage: "Please provide name and bio for the user." });    
})

server.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;
    db.remove(id)
        .then(data => {
            data
            ? db.find()
                .then(data => {
                    res.json(data);
                })
            : res
                .status(404)
                .json({ message: "The user with the specified ID does not exist." });
        })
        .catch(err => {
            res
                .status(500)
                .json({ error: "The user could not be removed" });
        });
})

server.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const user = req.body;
    user.name && user.bio
    ? db.update(id, user)
        .then(data => {
            data
            ? db.findById(id)
                .then(data => {
                    res.json(data);
                })
            : res
                .status(404)
                .json({ message: "The user with the specified ID does not exist." });
        })
        .catch(err => {
            res
                .status(500)
                .json({ error: "The user information could not be modified." });
        })
    : res
        .status(400)
        .json({ errorMessage: "Please provide name and bio for the user." });
})

server.listen(4001, () => console.log('server listening on port 4001'));