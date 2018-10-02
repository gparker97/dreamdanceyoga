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

// Acuity API
const Acuity = require('acuityscheduling');
const config = require('../config');

// Xero API
const XeroClient = require('xero-node').AccountingAPIClient;
const configXero = require('../config-xero');

// Version
const acuityRestControllerVersion = '0.9.3b';

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
    
    if (debug) {
        console.log('params below');
        console.log(params);
        console.log(`CreateInvoice is ${params.xeroCreateInvoice}`);
        console.log(`ApplyPayment is ${params.xeroApplyPayment}`);
    }

    // Only create invoice if invoice creation checked on front end
    if (params.xeroCreateInvoice === "false") {
        return { xeroInvoiceStatus: false, xeroInvoiceStatusMessage: "XERO: Invoice NOT created as per request" };
    }

    // Retrieve details for the package being purchased    
    var productId = params.productID;
    var email = params.email;    

    if (debug) {        
        console.log(`productId: ${productId}`);
        console.log(`email: ${email}`);
    }    

    // Retrieve array indexes to find info for Xero call
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
    const invoiceNumber = `AC-${acuityCertificate.id}`;
    const invoiceType = 'ACCREC';
    // const invoiceStatus = 'DRAFT';
    const invoiceStatus = 'AUTHORISED';
    const tax = 'NoTax';
    const ref = `${acuityProducts[productIndex].name} ${acuityStudentInfo[studentIndex].firstName} ${acuityStudentInfo[studentIndex].lastName}`;
        
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
        InvoiceNumber: eval(`'${invoiceNumber}'`),
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
    if (params.xeroApplyPayment) {
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
            } else {
                console.log(`XERO: Xero apply payment SUCCESSFUL`);
                xeroResult.xeroPaymentErrorMessage = 'None';
            }
        } else {            
            // Payment was not applied - capture reason and append to response
            console.log(xeroPayment.xeroPaymentStatusMessage);            
            xeroResult.xeroPaymentErrorMessage = xeroPayment.xeroPaymentStatusMessage;
        }
    } else {
        console.log('XERO: NOT applying payment to XERO invoice');            
        xeroResult.xeroPaymentStatus = false;
        xeroResult.xeroPaymentStatusMessage = "XERO: Payment NOT applied as per request";
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

// ACUITY REST CONTROLLER and API CALL
// Refactor later as POST to accept JSON body
app.get('/api/acuity/:function', (req, res) => {
    console.log(`==== ACUITY REST CONTROLLER v${acuityRestControllerVersion} ====`);
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
            }
            
            // If response is defined then return response
            if (typeof response != 'undefined') {
                console.log(`Records returned: ${response.length}`);
                if (response.status_code >= 400) {
                    return res.status(400).send(`ERROR: Error 400 or higher occured\nStatus Code: ${response.status_code}\nError Message: ${response.message}`);
                } else if (response.length < 1) {
                    console.log(`acuityAPIcall: COMPLETED NO RECORDS - returning 400 response to server: ${acuityURL}`);
                    return res.status(400).send('No records returned');
                } else {                    
                    // Store Acuity API call responses (in case required for future use) and perform further actions
                    switch (func) {
                        case 'clients':
                            acuityStudentInfo = response;
                            break;
                        case 'products':
                            acuityProducts = response;                            
                            break;      
                        case 'certificates':                            
                            acuityCertificate = response;
                            
                            // If POST then create Xero Invoice for package purchase
                            if (method === "POST") {                                
                                var xeroInvoice = await createXeroInvoice(method, func, req.query);
                                console.log(`acuityAPIcall: Create XERO invoice result:`);
                                console.log(JSON.stringify(xeroInvoice, undefined, 2));

                                // Check if Xero invoice created - if so store response
                                response.xeroInvoiceStatus = xeroInvoice.xeroInvoiceStatus;
                                response.xeroInvoiceStatusMessage = xeroInvoice.xeroInvoiceStatusMessage;
                                if (response.xeroInvoiceStatus) {                                
                                    response.xeroInvoiceStatusString = xeroInvoice.Invoices[0].StatusAttributeString;
                                    // Check for errors in invoice creation
                                    if (!xeroInvoice || response.xeroInvoiceStatus !== "OK" || response.xeroInvoiceStatusString !== "OK") {
                                        // Is there a xero invoice validation errors array???
                                        console.log(`ERROR: Error in Xero Invoice creation.  Status: ${response.xeroInvoiceStatus} / ${response.xeroInvoiceStatusString}`);                        
                                    }                                
                                    
                                    // Check if Xero payment applied - if so store response
                                    response.xeroPaymentStatus = xeroInvoice.xeroPaymentStatus;
                                    response.xeroPaymentStatusMessage = xeroInvoice.xeroPaymentStatusMessage;
                                    if (response.xeroPaymentStatus) {
                                        response.xeroPaymentStatusString = xeroInvoice.xeroPaymentStatusString;
                                        // Check for errors in applying payment
                                        if (response.xeroPaymentStatus !== "OK" || response.xeroPaymentStatusString) {
                                            response.xeroPaymentErrorMessage = xeroInvoice.xeroPaymentErrorMessage;
                                            console.log(`ERROR: Error in applying payment to Xero invoice.  Status: ${response.xeroPaymentStatus} / ${response.xeroPaymentErrorMessage}`);
                                        } else {                                        
                                            response.xeroPaymentErrorMessage = 'None';
                                        }
                                    } else {
                                        console.log(`Xero payment NOT applied: ${response.xeroPaymentStatusMessage}`);
                                    }
                                }
                            }
                            break;                            
                    }                    
                    console.log(`acuityAPIcall: COMPLETED SUCCESSFUL - returning 200 response to server: ${acuityURL}`);
                    if (debug) {
                        console.log('Response object below:');
                        console.log(response);
                    }
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