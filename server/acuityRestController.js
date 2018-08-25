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

// ACUITY REST CONTROLLER and API CALL

app.get('/api/acuity/:function', (req, res) => {
    console.log(`== API call from ${req.headers.host} @ ${req.headers.origin} at ${req.ip} ==`);

    // List of supported Acuity API call functions, anything else will return 400
    const supportedFunctions = [
        'clients',
        'me',
        'certificates',
        'products',
        'appointment-types'
    ];
   
    // Query details
    const func = req.params.function;
    const body = req.query;
    const queryIds = Object.keys(req.query);
    const queryId1 = Object.keys(req.query)[0];    
    const queryParam1 = eval(`req.query.${queryId1}`);

    if (debug) {
        console.log(`QueryIds: ${queryIds}`);
        console.log('Req query below');
        console.log(body);
        console.log('Query keys below');
        console.log(Object.keys(req.query));
        console.log(`Query keys length: ${queryIds.length}`);        
        console.log(`URL: ${req.url}`);
        console.log('Req params below');
        console.log(req.params);
    }

    var method = 'GET';
    if (queryId1 === 'method') { method = queryParam1; }

    // Return if function not in supportedFunctions array
    if (!supportedFunctions.includes(func)) { return res.status(400).send('Function not supported'); }    
    
    // Build JSON body for post / delete
    if (method === 'POST' || method === 'DELETE') {
        if (debug) {
            console.log('POST/DELETE - building options...');
        }
        delete body.method;
        var options = {
            method: eval(`'${method}'`),
            body
        };
    } else {
        var options = {};
    }

    // Build Acuity API call URL
    var acuityURL=`/${func}`;
    switch (method) {
        case 'GET':
            if (queryIds.length > 0) {
                var count=0;
                var firstDone = false;
                queryIds.forEach(i => {
                    if (debug) {
                        console.log(`building URL at query id ${i}`)
                    }
                    var queryId = Object.keys(req.query)[count];
                    var queryParam = eval(`req.query.${queryId}`);
                    console.log(`queryId: ${queryId}`);
                    console.log(`queryParam: ${queryParam}`);                    
                    if (!firstDone) {
                        acuityURL +=`?${queryId}=${queryParam}`;
                        firstDone = true;
                    } else {
                        acuityURL +=`&${queryId}=${queryParam}`;
                    }     
                    count++;
                });
            }
            break;
        case 'POST':
            // Do nothing
            break;
        case 'DELETE':
            var idToDelete = req.query.id;
            acuityURL =`/${func}/${idToDelete}`;
            break;
        default:
            return res.status(400).send(`ERROR: Method not supported: ${method}`);
    }    

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
    console.log('-- Starting acuity API call...');    
    const Acuity = require('acuityscheduling');
    const config = require('../config');
    const acuity = Acuity.basic(config);
    
    if (debug) {        
        console.log('Options below');
        console.log(options);
    }
    
    acuity.request(acuityURL, options, (err, resp, response) => {
        console.log('Acuity API call started...');
        try {            
            if (err) {
                console.log(`ERROR: Error detected: ${acuityURL}`);
                console.log(err);                
                return res.status(400).send('An error occured');            
            } else if (typeof response != 'undefined') {                
                if (debug) {
                    console.log('Response object below:');
                    console.log(response);
                }
                console.log(`Records returned: ${response.length}`);
                if (response.status_code >= 400) {              
                    return res.status(400).send(`ERROR: Error 400 or higher occured\nStatus Code: ${response.status_code}\nError Message: ${response.message}`);
                } else if (response.length < 1) {
                    console.log(`acuityAPIcall: COMPLETED NO RECORDS - returning 400 response to server: ${acuityURL}`);
                    return res.status(400).send('No records returned');
                } else {
                    console.log(`acuityAPIcall: COMPLETED SUCCESSFUL - returning 200 response to server: ${acuityURL}`);                    
                    return res.status(200).send(response);
                }
            }
            return res.status(200).send(response);
        }
        catch(e) {
            console.log(`ERROR: Error caught in API call: ${acuityURL}`);
            console.log(e);
            return res.status(400).send(`ERROR: Error detected in Acuity API call: ${acuityURL}`);
        }
    });    
});

// ==== END ==== //

/*
    // Call attempt with async/await to function - not working
    try {
        // var APIresponse = await acuityAPIcall(acuityURL, options, () => {
        var await results = acuityAPIcall(acuityURL, options)
        if (debug) {
            console.log('-- Finished API call function');
            //console.log('Repsonse is:');
            //console.log(APIresponse);
            console.log(`First name is ${results.firstName}`);
        }
        console.log('--about to send result');
        res.status(200).send(results);
    }
    catch (e) {
        console.log("Error with API call!");
        console.log(e);
    }

// API call async function - not working
async function acuityAPIcall(url, opt) {
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
    /*
    const { promisify } = require('util');
    var acuityAsync = promisify(acuity.request);
    acuityAsync = Acuity.basic(config);
    

    acuityAsync(url, opt)
        .then((err, res, response) => {
            console.log(response);
            return response;
        })
        .catch((error) => {
            console.log(`ERROR with acuityAsync: ${error}`);
        });
    
    try {        
        let results = await acuity.request(url, opt, (err, res, response) => {    
            console.log(response);            
            return response;
            console.log('Acuity api call started...');
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
                    // console.log('Response object is: ' + util.inspect(response, false, null));
                    if (debug) {
                        console.log('Response object is:');
                        console.log(response);                    
                        console.log('Error object is:');
                        console.log(err);
                        console.log('end of acuityapicall function');
                        console.log('sending response back...');                    
                    }
                    return response;
                    //if (func == 'clients') {
                        //  for (var i = 0; i < response.length; i++) {
                        //    console.log(`${response[i].firstName} ${response[i].lastName}'s email is ${response[i].email}`);
                        //}
                    //}
                }
            }
        });
        // console.log("ABOUT TO RETURN RESULT");
        // console.log(results);
        // return results;
    }
    catch (e) {
        console.log(`Error with acuity request API call: ${url}`)
        console.log(e);
        return e;
    }    
}
*/

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