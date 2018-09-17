'use strict'

const express = require('express');
const app = express();
const directoryToServe = 'client';
const port = 3443;

const fs = require('fs');
const https = require('https');
const path = require('path');
const Joi = require('joi');

// Acuity API
const Acuity = require('acuityscheduling');
const config = require('../config');

// Xero API
const XeroClient = require('xero-node').AccountingAPIClient;
const configXero = require('../config-xero');

// DEBUG mode
const debug = true;

// Set up express for HTTPS
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

// Sample JOI validation
function validateCourse(course) {
    const schema = { name: Joi.string().min(3).required() };
    return Joi.validate(course, schema);
}

// Create XERO Invoice if required
async function createXeroInvoice() {
    console.log('Checking if necessary to create a Xero invoice...');
    
    // Initialize Xero API
    let xero = new XeroClient(configXero);
    // PSEUDOCODE //
    // If METHOD = POST AND FUNCTION = CERTIFICATE
    // STORE PRODUCTID
    // QUERY ACUITY FOR PRODUCTID and STORE PRICE
    // IF PRICE > 0 CREATE INVOICE

    // CREATE INVOICE
    // Check if invoice already exists for user - avoid duplicate invoice

    // Retrieve required parameters:
     // Student Name
     // Item ID based on Product ID
     // etc
    
    // Build param object
    
    // Create invoice

    // Return result

    // Sample
    // const result = await xero.contacts.get();
    const result = await xero.invoices.get();
    return result.Invoices[99].InvoiceID;
}

// ACUITY REST CONTROLLER and API CALL
app.get('/api/acuity/:function', (req, res) => {
    console.log(`== API call from ${req.headers.host} @ ${req.headers.origin} at ${req.ip} ==`);

    // List of supported Acuity API call functions, anything else will return 400
    const supportedFunctions = [
        'clients',
        'me',
        'certificates',
        'products',
        'appointments',
        'appointment-types',
        'availability--classes'
    ];
   
    // Query details
    const reqFunc = req.params.function;    
    const body = req.query;
    const queryIds = Object.keys(req.query);
    const queryId1 = Object.keys(req.query)[0];    
    const queryParam1 = eval(`req.query.${queryId1}`);

    // Return if function not in supportedFunctions array
    if (!supportedFunctions.includes(reqFunc)) { return res.status(400).send('Function not supported'); }

    // Update func var with proper syntax to make API call
    const func = reqFunc.replace("--", "/");

    if (debug) {
        console.log(`Function: ${func}`);
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

    // If first query ID is "method" then set method (PUT/POST/DELETE) otherwise default to GET
    var method = 'GET';
    if (queryId1 === 'method') { method = queryParam1; }    
    
    // Build JSON body from input URL for methods requiring body params
    var options = {};
    if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
        if (debug) {
            console.log('POST/PUT/DELETE - building options...');
        }
        delete body.method;
        var options = {
            method: eval(`'${method}'`),
            body
        };
    }

    // Build Acuity API call URL with params from input URL
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
                    if (debug) {
                        console.log(`queryId: ${queryId}`);
                        console.log(`queryParam: ${queryParam}`);
                    }                    
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
    
    // Initialize Acuity API
    const acuity = Acuity.basic(config);
    
    if (debug) {
        console.log('Options below');
        console.log(options);
    }
    
    acuity.request(acuityURL, options, async (err, resp, response) => {
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
                    // CALL XERO - CREATE INVOICE / APPLY PAYMENT / etc                    
                    var xeroInvoice = await createXeroInvoice();
                    console.log(`acuityAPIcall: COMPLETED SUCCESSFUL - returning 200 response to server: ${acuityURL}`);
                    console.log(`acuityAPIcall: XERO Invoice Result: ${xeroInvoice}`);
                    return res.status(200).send(response);
                }
            } else {
                console.log('acuityAPIcall: Response is undefined')
                return res.status(400).send('ERROR: Response is undefined');
            }
        }
        catch(e) {
            console.log(`ERROR: Error caught in API call: ${acuityURL}`);
            console.log(e);
            return res.status(400).send(`ERROR: Error detected in Acuity API call: ${acuityURL}`);
        }
    });    
});