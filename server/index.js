'use strict'

const Joi = require('joi');
const express = require('express');
const fs = require('fs');
const https = require('https');
const path = require('path');

const app = express();
const directoryToServe = 'client';
const port = 3443;

app.use(express.json());
app.use('/', express.static(path.join(__dirname, '..', directoryToServe)))
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const httpsOptions = {
    cert: fs.readFileSync(path.join(__dirname, 'ssl', 'server.crt')),
    key: fs.readFileSync(path.join(__dirname, 'ssl', 'server.key'))
}

https.createServer(httpsOptions, app).listen(port, function () {
    console.log(`Serving the ${directoryToServe}/ directory at https://localhost:${port}`)
})

//app.get()
//app.post()
//app.put()
//app.delete()

const courses = [
    { id: 1, name: 'course1'},
    { id: 2, name: 'course2'},
    { id: 3, name: 'course3'},
]

app.get('/', (req, res) => {
    res.send('Hello World!!');
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

// /api/courses/1
// app.get('/api/courses/:id', (req, res) => {
//    res.send(req.params.id);
// });

app.get('/api/courses/:id', (req, res) => {
    // res.send(req.query);
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) { return res.status(404).send('The course with the given ID was not found'); }
    res.send(course);
});

app.get('/api/posts/:year/:month', (req, res) => {
    res.send(req.params);
});

app.post('/api/courses', (req, res) => {
    // const result = validateCourse(req.body);
    const { error } = validateCourse(req.body); // object destructuring - result.error
    
    // if (!req.body.name || req.body.name.length < 3) {
    if (error) {
        // 400 Bad Request
        // res.status(400).send('Name is required and must be at least 3 characters long');
        return res.status(400).send(error.details[0].message);        
    }
    
    const course = {
        id: courses.length + 1,
        name: req.body.name
    }
    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
    // Look up the course
    const course = courses.find(c => c.id === parseInt(req.params.id));
    // If not existing, return 404
    if (!course) { return res.status(404).send('The course with the given ID was not found'); }
    // Validate
    // If invalid, return 400 - Bad request
    // const result = validateCourse(req.body);
    const { error } = validateCourse(req.body); // object destructuring - result.error

    if (error) {
        // 400 Bad Request
        // res.status(400).send('Name is required and must be at least 3 characters long');
        return res.status(400).send(error.details[0].message);        
    }
    // Update course
    course.name = req.body.name;
    // Return updated course to client
    res.send(course);
});

app.delete('/api/courses/:id', (req, res) => {
    // Look up the course
    const course = courses.find(c => c.id === parseInt(req.params.id));
    // If not existing, return 404
    if (!course) { return res.status(404).send('The course with the given ID was not found'); }
    
    // Delete
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    //Return the course that was deleted
    res.send(course);
});

// PORT
// const port = process.env.PORT || 3000;
// app.listen(port, () => console.log(`Listening on port ${port}...`));

function validateCourse(course) {
    const schema = { name: Joi.string().min(3).required() };
    return Joi.validate(course, schema);
}