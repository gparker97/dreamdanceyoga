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

// Declare vars to store Acuity responses
var acuityStudentInfo = [];
var acuityProducts = [];
var acuityCertificate = [];

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

/*
function acuityAPIcall(func) {
    // Initialize Acuity API
    const acuity = Acuity.basic(config);
    
    acuity.request(func, (err, resp, response) => {
        if (err) { return false; }
        if (debug) {
            console.log('Response from acuityAPIcall:');
            console.log(response);
        }
        return response;
    });
}
*/

// Create XERO Invoice if required
async function createXeroInvoice(method, func, params) {
    console.log('Checking if necessary to create a Xero invoice...');    
    
    // Only create invoice if student is buying a package
    if (method !== "POST" || func !== "certificates") {
        return { Status: 'Not a package purchase' };
    }    

    // Retrieve details for the package being purchased    
    var productId = params.productID;
    var email = params.email;    

    if (debug) {        
        console.log(`productId: ${productId}`);
        console.log(`email: ${email}`);
    }

    // Retrieve price of package being purchased and create invoice if price > 0
    // var funcToCall = '/products';
    // const acuityProducts = await acuityAPIcall(funcToCall);    

    // Retrieve array indexes
    const productIndex = acuityProducts.findIndex(x => x.id == productId);
    const studentIndex = acuityStudentInfo.findIndex(x => x.email == email);    

    if (debug) {
        console.log(`Index for ${productId} is ${productIndex}`);
        console.log(`Index for ${email} is ${studentIndex}`);
        console.log(`Price is: ${acuityProducts[productIndex].price}`);
        console.log(`Student last name is: ${acuityStudentInfo[studentIndex].lastName}`);
    }

    if (acuityProducts[productIndex].price > 0) {
        console.log('Price of package is greater than 0, creating invoice...');
        
        // Translate Acuity package name into Xero Item ID
        var itemCode = "";
        switch (productId) {
            case '539782':
                itemCode = "TEST-PACKAGE-1";
                break;
            case '501622':
                itemCode = "BELLY-16-CLASS";
                break;
            case '501618':
                itemCode = "BELLY-8-CLASS";
                break;
            case '501678':
                itemCode = "YOGA-16-CLASS";
                break;
            case '501676':
                itemCode = "YOGA-8-CLASS";
                break;
            default:
                console.log(`ERROR: Class ${productId} not defined.  Cannot create invoice.`);
                return { Status: 'Product not defined' };
        }
        
        // Initialize Xero API
        let xero = new XeroClient(configXero);
        
        // Capture required Xero parameters
        const xeroOptions = {where: eval(`'EmailAddress="${email}"'`)};        
        const xeroContact = await xero.contacts.get(xeroOptions);
        const xeroContactID = xeroContact.Contacts[0].ContactID;
        
        const invoiceNumber = `AC-${acuityCertificate.id}`;
        const invoiceType = 'ACCREC';
        const tax = 'NoTax';
        const ref = `${acuityProducts[productIndex].name} ${acuityStudentInfo[studentIndex].firstName} ${acuityStudentInfo[studentIndex].lastName}`;
        
        // Calculate due date
        var daysUntilDue = 7 // Set to number of days before invoice is due
        var dateOptions = {day: '2-digit', month: '2-digit', year: 'numeric'};
        var dueDate = new Date();
        var addDays = dueDate.getDate() + daysUntilDue;
        dueDate.setDate(addDays);
        dueDate = dueDate.toLocaleDateString(undefined, dateOptions);

        if (xeroContact.Contacts.length > 1) {
            console.log(`WARNING: More than one contact with email ${email}. Selecting first contact to create invoice: ${xeroContact.Contacts[0].FirstName} ${xeroContact.Contacts[0].LastName}.`);
        }

        // Build Xero options

        const xeroBody = {
            Type: eval(`'${invoiceType}'`),
            Contact: {
                ContactID: eval(`'${xeroContactID}'`),
            },
            InvoiceNumber: eval(`'${invoiceNumber}'`),
            LineAmountTypes: eval(`'${tax}'`),
            DueDate: eval(`'${dueDate}'`),
            Reference: eval(`'${ref}'`),
            LineItems: [
                {
                    ItemCode: eval(`'${itemCode}'`),
                }
            ]
        }

        console.log('Ready to send Xero API call.  Xero body below:');
        console.log(xeroBody);
        
        // Send Xero API call
        return await xero.invoices.create(xeroBody);        
    }    

    // CHECK IF PAID = (anything but NONE) - from payment_method dropdown selection (send in query?)
    // IF PAID - APPLY PAYMENT
    // Required params:
    // InvoiceNumber: $InvoiceNumber
    // Date: $TODAY()
    // Amount: $PRODUCT_PRICE // from acuity
    // Reference: $PAYMENT_REF (something like - online stripe payment)

    // Return result

    // Sample
    // const result = await xero.contacts.get();
    // const result = await xero.invoices.get();
    // return result.Invoices[99].InvoiceID;
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
    const queryId2 = Object.keys(req.query)[1];
    const queryParam2 = eval(`req.query.${queryId2}`);

    // Return if function not in supportedFunctions array
    if (!supportedFunctions.includes(reqFunc)) { return res.status(400).send('Function not supported'); }

    // Update func var with proper syntax to make API call
    const func = reqFunc.replace("--", "/");    

    // Decode URL to store key params
    // If first query ID is "method" then set method (PUT/POST/DELETE) otherwise default to GET and remove query
    var method = 'GET';
    if (queryId1 === 'method') { 
        method = queryParam1;
        delete body.method;
    }
    
    // If second query ID is "paymentMethod" then store paymentMethod and remove query
    if (queryId2 === 'paymentMethod') { 
        var paymentMethod = queryParam2;
        delete body.paymentMethod;
    }
    
    // Build JSON body from input URL for methods requiring body params
    var options = {};
    if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
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
        console.log(`Method: ${method}`);
        console.log(`Payment Method: ${paymentMethod}`);
        console.log('Req query below');
        console.log(body);
        console.log(`QueryIds: ${queryIds}`);        
        console.log('Query keys below');
        console.log(Object.keys(req.query));
        console.log(`Query keys length: ${queryIds.length}`);        
        console.log('Req params below');
        console.log(req.params);        
        console.log(`Query keys length: ${queryIds.length}`);        
        console.log(`URL: ${req.url}`);        
        console.log(`Acuity URL: ${acuityURL}`);
        console.log('Acuity options below');
        console.log(options);
    }

    // API CALL
    console.log('-- Starting acuity API call...');    
    
    // Initialize Acuity API
    const acuity = Acuity.basic(config);    
    
    acuity.request(acuityURL, options, async (err, resp, response) => {
        console.log('Acuity API call started...');
        try {            
            if (err) {
                console.log(`ERROR: Error detected: ${acuityURL}`);
                console.log(err);                
                return res.status(400).send('An error occured');            
            } else if (typeof response != 'undefined') {
                console.log(`Records returned: ${response.length}`);
                if (response.status_code >= 400) {              
                    return res.status(400).send(`ERROR: Error 400 or higher occured\nStatus Code: ${response.status_code}\nError Message: ${response.message}`);
                } else if (response.length < 1) {
                    console.log(`acuityAPIcall: COMPLETED NO RECORDS - returning 400 response to server: ${acuityURL}`);
                    return res.status(400).send('No records returned');
                } else {
                    // Store Acuity API call responses (in case required for future use) and return
                    switch (func) {
                        case 'clients':
                            acuityStudentInfo = response;
                            break;
                        case 'products':
                            acuityProducts = response;                            
                            break;      
                        case 'certificates':
                            acuityCertificate = response;
                            break;
                    }
                    // CALL XERO - CREATE INVOICE / APPLY PAYMENT / etc
                    var xeroInvoice = await createXeroInvoice(method, func, body);
                    console.log(`acuityAPIcall: XERO Invoice Result:`);
                    console.log(xeroInvoice);                    
                    
                    // Add Xero status response to response object
                    response.xeroStatus = xeroInvoice.Status;
                    if (!xeroInvoice || xeroInvoice.Status !== "OK") {
                        console.log(`ERROR: Error in Xero Invoice creation.  Status: ${xeroInvoice.Status}`);                        
                    }
                    
                    if (debug) {
                        console.log('Response object below:');
                        console.log(response);
                    }
                    
                    console.log(`acuityAPIcall: COMPLETED SUCCESSFUL - returning 200 response to server: ${acuityURL}`);
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