'use strict'

const express = require('express');
const fs = require('fs');
const https = require('https');
const path = require('path');
const util = require('util');
const Joi = require('joi');

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

async function acuityAPIcall(url, opt) {
//function acuityAPIcall(url, opt) {
    const Acuity = require('acuityscheduling');
    const config = require('../config');
    const acuity = Acuity.basic(config);

    console.log('Starting acuity API call from acuityAPIcall function...');
    console.log(`Acuity URL: ${url}`);    

    /*
    // var resultArray = acuity.request(url, (err, res, client) => {    
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
    */
    
    await acuity.request(url, opt, (err, resp, response) => {
    // return acuity.request(url, opt, (err, resp, response) => {
        console.log('acuity api call started...');
        try {
            if (err) {
                if (debug) {
                    console.log(`err is true`);
                    console.log(`error is:`);
                    console.log(err);
                }
            } else if (response.statusCode >= 400) {
                if (debug) { console.log(`error 400 or more status code is ${response.statusCode} and message is ${response.message}`); }
            } else if (typeof response != 'undefined' && response.length < 1) {
                if (debug) { console.log(`no records returned error`); }
            } else {
                if (debug) {
                    if (err !== null) {
                        console.log(`error is ${err}`);
                        console.log('err is: ' + util.inspect(err, false, null));
                    }
                    if (typeof response != 'undefined') { console.log(`Records returned is: ${response.length}`); }
                    console.log('Response object is: ' + util.inspect(response, false, null));
                    console.log('end of acuityapicall');
                    console.log('sending response back to server...');
                    return(response);
                    //if (func == 'clients') {
                      //  for (var i = 0; i < response.length; i++) {
                        //    console.log(`${response[i].firstName} ${response[i].lastName}'s email is ${response[i].email}`);
                        //}
                    //}
                }
            }
        }
        catch(e) {
            console.log(e);           
        }
    });
}

// ACUITY REST CONTROLLER and API

app.get('/api/acuity/:function', async (req, res) => {
    console.log(`== API call from ${req.headers.host} @ ${req.headers.origin} at ${req.ip} ==`);

    const supportedFunctions = [
        'clients',
        'me',
        'certificates',
        'products',
        'appointment-types'
    ];
    const func = req.params.function;    
    // Query details - refactor this later
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
    
    if (method === 'POST' || method === 'DELETE') {
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
    
    console.log('Sending to Acuity API...');
    if (debug) {
        console.log(`Function: ${func}`);
        console.log(`Query ID 1: ${queryId1}`);
        console.log(`Query Param 1: ${queryParam1}`);
        console.log('Req query below');
        console.log(req.query);
        console.log('Query keys below');
        console.log(Object.keys(req.query));
        console.log(`Query keys length: ${queryIds.length}`);        
        console.log(`URL: ${req.url}`);
        console.log('Req params below');
        console.log(req.params);
        console.log(`Method: ${method}`);
        console.log(`Acuity URL: ${acuityURL}`);
    }    

    // API CALL
    const Acuity = require('acuityscheduling');
    const config = require('../config');
    const acuity = Acuity.basic(config);
    
    if (debug) {
        console.log('-- Starting acuity API call...');
        console.log('Options below');
        console.log(options);
    } //hi

    /*
    var APIresponse = await acuityAPIcall(acuityURL, options);    
    if (debug) {
        console.log('-- Finished API call function');
        console.log('Repsonse is:');
        console.log(APIresponse);
    }
    return res.send(APIresponse);
    */
    
    acuity.request(acuityURL, options, (err, resp, response) => {
        console.log('Acuity API call started...');
        try {
            if (err) {
                if (debug) { 
                    console.log(`err is true and output below`);                    
                    console.log(err);
                }
                return res.status(400).send('An error occured');
            } else if (response.status_code >= 400) {
                if (debug) { console.log(`Error status code: ${response.status_code} and error message: ${response.message}`); }
                return res.status(400).send(`Error 400 or occured status code is ${response.status_code} and message is ${response.message}`);            
            } else if (typeof response != 'undefined' && response.length < 1) {
                if (debug) { console.log(`Response length less than 1, no records returned`); }
                return res.status(400).send('No records returned');
            } else {
                if (debug) {
                    if (err !== null) {
                        console.log(`Error: ${err}`);
                        console.log('Err is: ' + util.inspect(err, false, null));
                    }                    
                    if (typeof response != 'undefined') { console.log(`Records returned: ${response.length}`); }
                    console.log('Response object is: ' + util.inspect(response, false, null));
                    console.log('acuityAPIcall COMPLETED SUCCESSFUL - returning 200 response to server');
                }
                return res.status(200).send(response);
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


function validateCourse(course) {
    const schema = { name: Joi.string().min(3).required() };
    return Joi.validate(course, schema);
}


// PORT
// const port = process.env.PORT || 3000;
// app.listen(port, () => console.log(`Listening on port ${port}...`));