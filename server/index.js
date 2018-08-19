'use strict'

const Joi = require('joi');
const express = require('express');
const fs = require('fs');
const https = require('https');
const path = require('path');
const util = require('util');

const app = express();
const directoryToServe = 'client';
const port = 3443;

//DEBUG mode
const debug = true;

app.use(express.json());
app.use('/', express.static(path.join(__dirname, '..', directoryToServe)))
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://www.dreamdanceyoga.com");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const httpsOptions = {
    cert: fs.readFileSync(path.join(__dirname, 'ssl', 'server.crt')),
    key: fs.readFileSync(path.join(__dirname, 'ssl', 'server.key'))
}

https.createServer(httpsOptions, app).listen(port, function () {
    console.log(`Serving the ${directoryToServe}/ dir at https://localhost:${port}`)
})

function validateCourse(course) {
    const schema = { name: Joi.string().min(3).required() };
    return Joi.validate(course, schema);
}

function acuityAPIcall(url) {
    const Acuity = require('acuityscheduling');
    const acuity = Acuity.basic(config);

    console.log('Starting acuity API call...');
    console.log(`URL is ${url}`);
    var client = null;

    //var resultArray = acuity.request(url, (err, res, client) => {    
    return acuity.request(url, (err, res, client) => {
        console.log('acuity api call started...');
        console.log(`client is ${client}`);
        console.log(`Client 0 first name is: ${client[0].firstName}`);
        console.log(`error is ${err}`);
        console.log('err is: ' + util.inspect(err, false, null));
        console.log(`res body is ${res.body}`);
        if (err) return res.status(404).send(`Error is ${err}`);
        console.log('end of acuityapicall function');            
    });    
}

// ACUITY REST CONTROLLER and API

app.get('/api/acuity/:function', (req, res) => {
    console.log(`API call from ${req.headers.host} @ ${req.headers.origin} at ${req.ip}`);

    const supportedFunctions = [
        'clients',
        'me',
        'certificates',
        'products'
    ];
    
    const func = req.params.function;    
    
    // refactor this later
    const queryIds = Object.keys(req.query);
    const queryId1 = Object.keys(req.query)[0];
    const queryId2 = Object.keys(req.query)[1];
    const queryId3 = Object.keys(req.query)[2];
    const queryId4 = Object.keys(req.query)[3];
    const queryParam1 = eval(`req.query.${queryId1}`);
    const queryParam2 = eval(`req.query.${queryId2}`);
    const queryParam3 = eval(`req.query.${queryId3}`);
    const queryParam4 = eval(`req.query.${queryId4}`);

    var method = 'GET';
    if (queryId1 === 'method') { method = queryParam1; }

    // Return if function not in supportedFunctions array
    if (!supportedFunctions.includes(func)) { return res.status(404).send('Function not supported'); }    
    
    if (method === 'POST'  || method === 'DELETE') {
        if (debug) {
            console.log('POST/DELETE - building options...');
        }        
        var options = {
            method: eval(`'${method}'`),
            body: {
                [queryId2]: queryParam2,
                [queryId3]: queryParam3,
                [queryId4]: queryParam4
            }
        };
    } else {
        var options = {};
    }

    // Build Acuity API call URL
    var acuityURL=`/${func}`;
    if (queryIds.length > 0) {
        var count=1;
        queryIds.forEach(i => {
            if (debug) {
                console.log(`building URL at query id ${i}`)
            }            
            var queryId = eval(`queryId${count}`);
            var queryParam = eval(`queryParam${count}`);
            if (method === 'DELETE') {
                acuityURL =`/${func}/${queryParam}`;
            } else if (count === 1) {
                acuityURL +=`?${queryId}=${queryParam}`;
            } else {
                acuityURL +=`&${queryId}=${queryParam}`;
            }
            count++;
        });
    }

    if (debug) {
        console.log(`Func is ${func}`);
        console.log(`Query ID 1 is ${queryId1}`);
        console.log(`Query param 1 is ${queryParam1}`);
        console.log('req query is');        
        console.log(req.query);
        console.log('Query keys are:');
        console.log(Object.keys(req.query));
        console.log(`Query keys length is ${queryIds.length}`);        
        console.log(`url is ${req.url}`);
        console.log('params is');
        console.log(req.params);
        console.log(`Method is ${method}`);
        console.log(`Acuity URL is ${acuityURL}`);
    }
    
    console.log('Sending to Acuity API...');

    // API CALL
    const Acuity = require('acuityscheduling');
    const config = require('../config');
    const acuity = Acuity.basic(config);

    console.log('Starting acuity API call...');    
    
    if (debug) {
        console.log('options is');
        console.log(options);
    }

    acuity.request(acuityURL, options, (err, resp, response) => {
        try {
            if (err) {
                return res.status(400).send('An error occured');
            } else if (typeof response != 'undefined' && response.length < 1) {
                return res.status(400).send('No records returned');            
            } else {
                if (debug) {
                    if (err !== null) {
                        console.log(`error is ${err}`);
                        console.log('err is: ' + util.inspect(err, false, null));
                    }
                    console.log('acuity api call started...');
                    if (typeof response != 'undefined') { console.log(`Records returned is: ${response.length}`); }
                    console.log('Response object is: ' + util.inspect(response, false, null));
                    console.log('end of acuityapicall');
                    console.log('sending response back to server...');                    
                    if (func == 'clients') {
                        for (var i = 0; i < response.length; i++) {
                            console.log(`${response[i].firstName} ${response[i].lastName}'s email is ${response[i].email}`);
                        }
                    }
                }                                
                return res.send(response);
            }
        }
        catch(e) {
            console.log(e);
            return res.status(400).send('Acuity API call failed');
        }
    });
});

// ==== END ==== //

// EXAMPLES

const courses = [
    { id: 1, name: 'course 1'},
    { id: 2, name: 'course 2'},
    { id: 3, name: 'course 3'},
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