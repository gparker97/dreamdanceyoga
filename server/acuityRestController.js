'use strict'

var args = process.argv.slice(2);

const express = require('express');
const app = express();
const directoryToServe = 'client';
const port = args[0] || 3443;

const fs = require('fs');
const https = require('https');
const path = require('path');
const Joi = require('joi');

// Version
const acuityRestControllerVersion = '1.0.0';

// DEBUG mode
const debug = true;

// Acuity API
const Acuity = require('acuityscheduling');
const config = require('../config');

// Xero API
const XeroClient = require('xero-node').AccountingAPIClient;
const configXero = require('../config-xero');

// Declare vars to store Acuity responses
var acuityStudentInfo = [];
var acuityProducts = [];
var acuityCertificate = [];
var acuityAppointment = [];
var acuityAppointmentTypes = [];

// List of supported Acuity API call functions, anything else will return 400
const supportedFunctions = [
    'version',
    'pin',
    'clients',
    'me',
    'certificates',
    'products',
    'appointments',
    'appointment-types',
    'availability',
    'forms'
];

// Set up express for HTTPS
app.use(express.json());
app.use('/', express.static(path.join(__dirname, '..', directoryToServe)))
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://dreamdanceyoga.com");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const httpsOptions = {
    cert: fs.readFileSync(path.join(__dirname, 'ssl', 'api_dreamdanceyoga_com.crt')),
    key: fs.readFileSync(path.join(__dirname, 'ssl', 'dreamdanceyoga-api.key')),
    ca: [
        fs.readFileSync(path.join(__dirname,'ssl', 'COMODORSADomainValidationSecureServerCA.crt')),
        fs.readFileSync(path.join(__dirname, 'ssl', 'COMODORSAAddTrustCA.crt'))
    ]
};

https.createServer(httpsOptions, app).listen(port, function () {
    console.log(`Serving the ${directoryToServe}/ dir at https://localhost:${port}`)
});

// Sample JOI validation
function validateCourse(course) {
    const schema = { name: Joi.string().min(3).required() };
    return Joi.validate(course, schema);
}

async function initAcuityAPIcall(req) {
    // Store query details
    const requestedFunction = req.params.function;
    const body = req.query;
    const queryIds = Object.keys(req.query);
    const queryId1 = Object.keys(req.query)[0];
    const queryParam1 = eval(`req.query.${queryId1}`);

    // Update func var with proper syntax to make API call    
    const func = requestedFunction.replace(/\-\-/g, "/");

    // Search for objects to include in URL request (for labels)
    // Jimmy hacked corn and I don't care
    if ('OBJECT' in body) {
        var objectValue = body.OBJECT;
        var objectVals = body.OBJECT.split('_');
        var objectKey = objectVals[0];
        var innerObjectKey = objectVals[1]
        var innerObjectVal = body[objectValue];        
        
        if (debug) {
            console.log('body is: ', body);
            console.log('Object Value: ', objectValue);
            console.log('Object Values:', objectVals);
            console.log('Object key: ', objectKey);
            console.log('Inner object key: ', innerObjectKey);
            console.log('Inner object val: ', innerObjectVal);
        }
        
        // Clean up body
        delete body.OBJECT;
        delete body[objectValue];
        
        // Add object to a new object array within body
        body[objectKey] = [];
        body[objectKey][0] = {};
        body[objectKey][0][innerObjectKey] = innerObjectVal;
        
        console.log('NEW body after object insertion: ', body);        
    }    

    // Decode URL to store key params
    // If first query ID is "method" then set method (PUT/POST/DELETE) otherwise default to GET and remove query
    var method = 'GET';
    if (queryId1 === 'method') {
        method = queryParam1;
        delete body.method;
    }
    
    // If buying a package, parse the URL to get required data
    // Refactor this later to send properly formatted JSON via POST    
    if (method === "POST" && func === "certificates") {        
        const queryId2 = Object.keys(req.query)[1];
        const queryParam2 = eval(`req.query.${queryId2}`);
        const queryId3 = Object.keys(req.query)[2];
        const queryParam3 = eval(`req.query.${queryId3}`);
        const queryId4 = Object.keys(req.query)[3];
        const queryParam4 = eval(`req.query.${queryId4}`);
        
        if (queryId2 === 'paymentMethod') { 
            var paymentMethod = queryParam2;
            delete body.paymentMethod;
        }

        if (queryId3 === 'xeroCreateInvoice') { 
            var xeroCreateInvoice = queryParam3;
            delete body.xeroCreateInvoice;
        }

        if (queryId4 === 'xeroApplyPayment') { 
            var xeroApplyPayment = queryParam4;
            delete body.xeroApplyPayment;
        }
    }

    // Build Acuity API call URL with params from input URL
    var acuityURL=`/${func}?admin=true`;
    switch (method) {
        case 'GET':
            if (queryIds.length > 0) {
                var count=0;                
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
                    acuityURL +=`&${queryId}=${queryParam}`;                      
                    count++;
                });
            }
            break;
        case 'POST':
            // Do nothing
            break;
        case 'PUT':
        case 'DELETE':
            var idToUpdate = body.id;
            if (!idToUpdate) {
                acuityURL =`/${func}?admin=true`;
            } else {
                acuityURL =`/${func}/${idToUpdate}?admin=true`;
            }            
            delete body.id;
            break;
        default:
            return res.status(400).send(`ERROR: Method not supported: ${method}`);
    }

    // Build JSON body from input URL for methods requiring body params
    var options = {};
    if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
        var options = {
            method: eval(`'${method}'`),
            body
        };
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
        console.log('Req params below');
        console.log(req.params);
        console.log(`Query keys length: ${queryIds.length}`);        
        console.log(`URL: ${req.url}`);        
        console.log(`Acuity URL: ${acuityURL}`);
        console.log('Acuity options below');
        console.log(options);
    }

    // Make Acuity API call
    try {
        console.log(`Starting Acuity API call INSIDE FUNCTION: ${acuityURL}`);
        return await acuityAPIcall(acuityURL, options);
    }
    catch (e) {
        console.log(`ERROR: Error caught in acuityAPIcall function: ${acuityURL}`);
        console.log(e);
        return e;
    }    
}

function acuityAPIcall(func, options) {
    // Initialize Acuity API
    const acuity = Acuity.basic(config);
    
    const acuityPromise = new Promise((resolve, reject) => {
        acuity.request(func, options, (err, res, data) => {
            if (err) { 
                console.log(`ERROR: Error detected in Acuity API call: ${func}`);                
                console.log(options);
                reject(err);
            } else {                
                console.log('acuityAPIcall: Acuity API call completed SUCCESSFULLY!');
                resolve(data);
            }
        });
    });
    return acuityPromise;    
}

// Create XERO Invoice if required
async function createXeroInvoice(params, reqFunc) {
    console.log('Checking if necessary to create a Xero invoice...');
    
    if (debug) {
        console.log('params below');
        console.log(params);
        console.log(`CreateInvoice is ${params.xeroCreateInvoice}`);
        console.log(`ApplyPayment is ${params.xeroApplyPayment}`);
    }

    // Only create invoice if invoice creation checked on front end
    if (!params.xeroCreateInvoice || params.xeroCreateInvoice === 'false') {
        console.log('NOT creating Xero invoice as per user request.');
        return { xeroInvoiceStatus: false, xeroInvoiceStatusMessage: "XERO: Invoice NOT created as per request" };
    }

    console.log('Creating Xero invoice...');
    
    // Retrieve details for the package being purchased
    // Product ID is stored under a different parameter for products (certificates) and classes (appointments)
    if (reqFunc === "certificates") {
        var productId = params.productID;        
    } else { // Function is appointments - class booking
        var productId = params.appointmentTypeID;
    }
    var email = params.email;

    if (debug) {        
        console.log(`productId: ${productId}`);
        console.log(`email: ${email}`);        
    }

    // Retrieve array indexes to find info for Xero call
    if (reqFunc === "certificates") {
        var productIndex = acuityProducts.findIndex(x => x.id == productId);
        var price = acuityProducts[productIndex].price;
        var productName = acuityProducts[productIndex].name;
    } else { // Function is appointments - class booking
        var productIndex = acuityAppointmentTypes.findIndex(x => x.id == productId);
        var price = acuityAppointmentTypes[productIndex].price;
        var productName = acuityAppointmentTypes[productIndex].name;
    }
    const studentIndex = acuityStudentInfo.findIndex(x => x.email == email);

    if (debug) {
        console.log(`Index for ${productId} is ${productIndex}`);
        console.log(`Index for ${email} is ${studentIndex}`);
        console.log(`Price is: ${price}`);
        console.log(`Product name is: ${productName}`);
        console.log(`Student last name is: ${acuityStudentInfo[studentIndex].lastName}`);
    }

    if (price > 0) {
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
            case '506912':
                itemCode = "SILVER-BELLY-YEARLY-ONETIME";
                break;
            case '554068':
                itemCode = "SILVER-YOGA-YEARLY-ONETIME";
                break;
            case '551767':
                itemCode = "GOLD-6MONTH-ONETIME";
                break;
            case '556141':
                itemCode = "SILVER-YOGA-MONTHLY-ONETIME";
                break;
            case '8067151':
                itemCode = "TEST-SERIES-1";
                break;
            case '8735137':
                itemCode = "BELLY-CHOREO-L2-FIONA-JAN2019";
                break;
            case '8954238':
                itemCode = "BELLY-INTENSIVE-5MAR2019";
                break;
            case '8765245':
                itemCode = "MOTHER-CHILD-BELLY-4-6-MAR2019";
                break;
            case '8765254':
                itemCode = "MOTHER-CHILD-BELLY-7-9-MAR2019";
                break;
            case '8998950':
                itemCode = "BELLY-WORKSHOP-YAYA-FEB2019";
                break;
            default:
                // (FUTURE) Create inventory item if not defined yet
                console.log(`XERO ERROR: Class ${productId} not defined.  Cannot create invoice.`);
                return { xeroInvoiceStatus: false, xeroInvoiceStatusMessage: "XERO: Product / package not defined" };
        }
    } else {
        return { xeroInvoiceStatus: false, xeroInvoiceStatusMessage: "XERO: Package price is 0 - invoice NOT created" };
    }
        
    // Initialize Xero API
    let xero = new XeroClient(configXero);

    // Call Xero API to get user details
    const xeroOptions = {where: eval(`'EmailAddress="${email}"'`)};        
    try {
        const xeroContact = await xero.contacts.get(xeroOptions);
        if (xeroContact.Contacts.length > 1) {
            console.log(`XERO WARNING: More than one contact with email ${email}. Selecting first contact to create invoice: ${xeroContact.Contacts[0].FirstName} ${xeroContact.Contacts[0].LastName}.`);
        }
        var xeroContactID = xeroContact.Contacts[0].ContactID;
        if (debug) {
            console.log(`Xero contact ID: ${xeroContactID}`);
        }
    } catch (e) {
        console.log('XERO ERROR: Error in XERO contacts API call');
        return { xeroInvoiceStatus: false, xeroInvoiceStatusMessage: "XERO: ERROR caught retrieving contact information" };
    }

    // Capture required Xero parameters    
    // No need to specify invoice number - Xero will create a random number
    // const invoiceNumber = `AC-${acuityCertificate.id}`;    
    const invoiceType = 'ACCREC';
    // const invoiceStatus = 'DRAFT';
    const invoiceStatus = 'AUTHORISED';
    const tax = 'NoTax';
    const ref = `${productName} ${acuityStudentInfo[studentIndex].firstName} ${acuityStudentInfo[studentIndex].lastName}`;
        
    // Calculate due date
    var daysUntilDue = 7 // Set to number of days before invoice is due
    var dateOptions = {day: '2-digit', month: '2-digit', year: 'numeric'};
    var dueDate = new Date();
    var addDays = dueDate.getDate() + daysUntilDue;
    dueDate.setDate(addDays);
    dueDate = dueDate.toLocaleDateString(undefined, dateOptions);

    // Build Xero options
    const xeroBody = {
        Type: eval(`'${invoiceType}'`),
        Contact: {
            ContactID: eval(`'${xeroContactID}'`),
        },
        // InvoiceNumber: eval(`'${invoiceNumber}'`),
        LineAmountTypes: eval(`'${tax}'`),
        DueDate: eval(`'${dueDate}'`),
        Status: eval(`'${invoiceStatus}'`),
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
    try {
        var xeroResult = await xero.invoices.create(xeroBody);
        console.log('XERO: Invoice creation SUCCESSFUL');
        xeroResult.xeroInvoiceStatus = true;
        xeroResult.xeroInvoiceStatusMessage = "XERO: Invoice created SUCCESSFULLY";
    } catch (e) {
        console.log('XERO ERROR: Error in XERO invoice creation API call');
        return { xeroInvoiceStatus: false, xeroInvoiceStatusMessage: "XERO: ERROR caught creating XERO invoice" };
    }

    // Apply payment to Xero invoice if required
    if (!params.xeroApplyPayment || params.xeroApplyPayment === 'false' ) {        
        console.log('XERO: NOT applying payment to XERO invoice');            
        xeroResult.xeroPaymentStatus = false;
        xeroResult.xeroPaymentStatusMessage = "XERO: Payment NOT applied as per request";        
        return xeroResult;        
    } else {
        console.log('XERO: Applying payment to Xero invoice...');
        try {
            var xeroPayment = await xeroApplyPayment(xeroResult, params);
            console.log('XERO: Apply payment result:');
            console.log(JSON.stringify(xeroPayment, undefined, 2)); // JSON STRINGIFY TEST - CHECK LATER
            // Store result of Xero apply payment status
            xeroResult.xeroPaymentStatus = xeroPayment.xeroPaymentStatus;
            xeroResult.xeroPaymentStatusMessage = xeroPayment.xeroPaymentStatusMessage;
        } catch (e) {
            console.log('XERO ERROR: Error in XERO apply payment API call');
            xeroResult.xeroPaymentStatus = false;
            xeroResult.xeroPaymentStatusMessage = "XERO: ERROR caught creating XERO payment";
            return xeroResult;
        }

        // Capture Xero apply payment results and append to response
        if (xeroResult.xeroPaymentStatus) {            
            xeroResult.xeroPaymentStatusString = xeroPayment.Payments[0].StatusAttributeString;
            if (xeroPayment.Status !== "OK" || xeroResult.xeroPaymentStatusString === "ERROR") {
                xeroResult.xeroPaymentErrorMessage = xeroPayment.Payments[0].ValidationErrors[0].Message;
                console.log(`XERO ERROR: Xero Payment error: ${xeroResult.xeroPaymentStatusString}`);
                console.log(`XERO ERROR: Xero Payment error message: ${xeroResult.xeroPaymentErrorMessage}`);                
            } else if (xeroResult.xeroPaymentStatusString === "WARNING") {
                // xeroResult.xeroPaymentErrorMessage = xeroPayment.Payments[0].Warnings[0].Message;
                // console.log(`ERROR: Xero Payment error message: ${xeroResult.xeroPaymentErrorMessage}`);
                console.log('XERO WARNING: THERE ARE WARNINGS - FIX THIS LATER');
                xeroResult.xeroPaymentWarningMessage = 'SOMETHING';
            } else {
                console.log(`XERO: Xero apply payment SUCCESSFUL`);
                xeroResult.xeroPaymentErrorMessage = 'None';
            }
        } else {            
            // Payment was not applied - capture reason and append to response
            console.log(xeroPayment.xeroPaymentStatusMessage);            
            xeroResult.xeroPaymentErrorMessage = xeroPayment.xeroPaymentStatusMessage;
        }
    }
    return xeroResult;
}

async function xeroApplyPayment(xeroInvoice, requestParams) {
    // Apply payment to Xero Invoice - capture required params
    var invoiceID = xeroInvoice.Invoices[0].InvoiceID;
    var invoiceNumber = xeroInvoice.Invoices[0].InvoiceNumber;
    var productPrice = xeroInvoice.Invoices[0].AmountDue;
    var todaysDate = new Date();
    var dateOptions = {day: '2-digit', month: '2-digit', year: 'numeric'};
    todaysDate = todaysDate.toLocaleDateString(undefined, dateOptions);
    
    // Translate payment method to XERO account ID to apply payment
    // Accounts:
    // DDY: 7BF68928-8142-4D96-BA10-89616DD5B514
    // Sophia POSB: 6d788d69-f5dd-47ff-a143-f4f9ec3ea987
    // Sophia Cash: cdadb1ae-21ef-4a79-9102-384063283939
    switch (requestParams.paymentMethod) {
        case 'cash':
            var accountID = 'cdadb1ae-21ef-4a79-9102-384063283939';
            var ref = "Paid CASH (Message added by XERO API)";
            break;
        case 'cc-terminal':
            var accountID = '7BF68928-8142-4D96-BA10-89616DD5B514';
            var ref = "Paid CC TERMINAL (Message added by XERO API)";
            break;
        case 'bankXfer-DDY':
            var accountID = '7BF68928-8142-4D96-BA10-89616DD5B514';
            var ref = "Paid Bank Transfer to DDY Account (Message added by XERO API)";
            break;
        case 'bankXfer-Sophia':
            var accountID = '6d788d69-f5dd-47ff-a143-f4f9ec3ea987';
            var ref = "Paid Bank Transfer to Sophia (Message added by XERO API)";
            break;
        default:
            console.log("XERO ERROR: Payment method not defined in Xero");
            return { xeroPaymentStatus: false, xeroPaymentStatusMessage: "XERO: Payment method not defined in Xero" };
    }
    
    // BUILD Xero Payment params
    const xeroBody = {
        Invoice: { "InvoiceID": eval(`'${invoiceID}'`) },
        Account: { "AccountID": eval(`'${accountID}'`) },
        InvoiceNumber: eval(`'${invoiceNumber}'`),
        Date: eval(`'${todaysDate}'`),
        Amount: eval(`'${productPrice}'`),
        Reference: eval(`'${ref}'`)
    };

    if (debug) {
        console.log('Starting API call to apply Xero payment with below params:');
        console.log(xeroBody);
    }

    // Initialize Xero API
    let xero = new XeroClient(configXero);    
    try {
        const xeroPayment = await xero.payments.create(xeroBody);
        console.log('XERO: Apply payment completed successfully');
        xeroPayment.xeroPaymentStatus = true;
        xeroPayment.xeroPaymentStatusMessage = "XERO: Payment applied SUCCESSFULLY";
        return xeroPayment
    } catch (e) {
        console.log('XERO: Error caught in XERO apply payment API call');
        return { xeroPaymentStatus: false, xeroPaymentStatusMessage: "XERO: Error caught in Xero apply payment API call" };
    }    
}

function parseXeroApiCall(xeroInvoice, acuityResult) {
    console.log(`acuityAPIcall: Create XERO invoice result:`);
    console.log(JSON.stringify(xeroInvoice, undefined, 2));

    // Check if Xero invoice created - if so store response
    acuityResult.xeroInvoiceStatus = xeroInvoice.xeroInvoiceStatus;
    acuityResult.xeroInvoiceStatusMessage = xeroInvoice.xeroInvoiceStatusMessage;
    if (acuityResult.xeroInvoiceStatus) {                                
        acuityResult.xeroInvoiceStatusString = xeroInvoice.Invoices[0].StatusAttributeString;
        // Check for errors in invoice creation
        if (!xeroInvoice || !acuityResult.xeroInvoiceStatus || acuityResult.xeroInvoiceStatusString !== "OK") {
            // Is there a xero invoice validation errors array???
            console.log(`ERROR: Error in Xero Invoice creation.  Status: ${acuityResult.xeroInvoiceStatus} / ${acuityResult.xeroInvoiceStatusString}`);                        
        }                                
        
        // Check if Xero payment applied - if so store response
        acuityResult.xeroPaymentStatus = xeroInvoice.xeroPaymentStatus;
        acuityResult.xeroPaymentStatusMessage = xeroInvoice.xeroPaymentStatusMessage;
        acuityResult.xeroPaymentWarningMessage = xeroInvoice.xeroPaymentWarningMessage;
        if (acuityResult.xeroPaymentStatus) {
            acuityResult.xeroPaymentStatusString = xeroInvoice.xeroPaymentStatusString;
            // Check for errors in applying payment
            if (!acuityResult.xeroPaymentStatus || acuityResult.xeroPaymentStatusString !== "OK") {
                acuityResult.xeroPaymentErrorMessage = xeroInvoice.xeroPaymentErrorMessage;
                console.log(`ERROR: Error in applying payment to Xero invoice.  Status: ${acuityResult.xeroPaymentStatus} / ${acuityResult.xeroPaymentErrorMessage}`);
            } else {                                        
                acuityResult.xeroPaymentErrorMessage = 'None';
            }
        } else {
            console.log(`Xero payment NOT applied: ${acuityResult.xeroPaymentStatusMessage}`);
        }
    }
    return acuityResult;
}

// ACUITY REST CONTROLLER and API CALL
// Refactor later as POST to accept JSON body
app.get('/api/acuity/:function', async (req, res) => {
    console.log(`==== ACUITY REST CONTROLLER v${acuityRestControllerVersion} ====`);
    console.log(`== API call from ${req.headers.host} @ ${req.headers.origin} at ${req.ip} ==`);

    // Store the requested function and return if function not in supportedFunctions array
    const reqFunc = req.params.function.split('--')[0];
    console.log(`Requested function: ${reqFunc}`);
    if (!supportedFunctions.includes(reqFunc)) { return res.status(400).send('Function not supported'); }

    // If VERSION request then return version
    if (reqFunc === "version") { return res.status(200).send(acuityRestControllerVersion); }

    // If PIN request then return instructor PIN
    const instructorPin = '2468';
    let buff = new Buffer(instructorPin);
    let instructorPin64 = buff.toString('base64');    
    if (reqFunc === "pin") { return res.status(200).send(instructorPin64); }

    // If first query ID is "method" then set method (PUT/POST/DELETE) otherwise default to GET and remove query
    const queryId1 = Object.keys(req.query)[0];
    const queryParam1 = eval(`req.query.${queryId1}`);
    var method = 'GET';
    if (queryId1 === 'method') { method = queryParam1; }
    
    // Prepare options and store Acuity API call result
    var acuityResult = await initAcuityAPIcall(req);

    // Check if result is defined and return result
    if (typeof acuityResult != 'undefined') {
        console.log(`Records returned: ${acuityResult.length}`);
        if (acuityResult.status_code >= 400) {
            return res.status(400).send(`ERROR: Error 400 or higher occured\nStatus Code: ${acuityResult.status_code}\nError Message: ${acuityResult.message}`);
        } else if (acuityResult.length < 1) {
            console.log(`acuityAPIcall: COMPLETED NO RECORDS - returning 400 response to server: ${reqFunc}`);
            return res.status(400).send('No records returned');
        } else {
            // Store Acuity API call responses (in case required for future use) and perform further actions
            switch (reqFunc) {
                case 'clients':
                    acuityStudentInfo = acuityResult;
                    break;
                case 'products':
                    acuityProducts = acuityResult;
                    break;
                case 'appointment-types':
                    acuityAppointmentTypes = acuityResult;
                    break;
                case 'certificates':
                    acuityCertificate = acuityResult;
                    // If client is buying a new product or series (POST) then create Xero Invoice for purchase
                    if (method === "POST") {
                        var xeroInvoice = await createXeroInvoice(req.query, reqFunc);
                        // Parse results of Xero API calls and append results to acuityResult
                        acuityResult = parseXeroApiCall(xeroInvoice, acuityResult);
                    }
                    break;
                case 'appointments':
                    acuityAppointment = acuityResult;
                    // If client is buying a new product or series (POST) then create Xero Invoice for purchase
                    if (method === "POST") {
                        var xeroInvoice = await createXeroInvoice(req.query, reqFunc);
                        // Parse results of Xero API calls and append results to acuityResult
                        acuityResult = parseXeroApiCall(xeroInvoice, acuityResult);
                    }
                    break;
            }
            console.log(`acuityAPIcall: COMPLETED SUCCESSFUL - returning 200 response to server: ${reqFunc}`);
            if (debug) {
                console.log('acuityResult object below:');
                console.log(JSON.stringify(acuityResult, undefined, 2));
            }
            return res.status(200).send(acuityResult);
        }
    } else {
        console.log('acuityAPIcall: acuityResult is undefined')
        return res.status(400).send('ERROR: acuityResult is undefined');
    }
});