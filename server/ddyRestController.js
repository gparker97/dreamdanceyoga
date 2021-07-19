'use strict'

var args = process.argv.slice(2);

const express = require('express');
const app = express();
const basicAuth = require('express-basic-auth');
const directoryToServe = 'client';
const port = args[0] || 3443;

const fs = require('fs');
const https = require('https');
const path = require('path');

// Read stripe keys
const stripeKeys = require('../stripe-keys.json');
const stripeSecretTest = stripeKeys.secret_test;
const stripeSecretLive = stripeKeys.secret_live;

// STRIPE TEST
const stripeTest = require('stripe')(stripeSecretTest);
// STRIPE LIVE
const stripe = require('stripe')(stripeSecretLive);

// Version
const ddyRestControllerVersion = '2.2.5';

// DEBUG mode
const debug = true;

// Acuity API
const Acuity = require('acuityscheduling');
const config = require('../config');

// Xero SDK v4 OAuth2
const XeroClient = require('xero-node').XeroClient;
const configXero = require('../config-xero4');

// Declare vars to store Acuity responses
var acuityStudentInfo = [];
var acuityProducts = [];
var acuityCertificate = [];
var acuityAppointment = [];
var acuityAppointmentTypes = [];

// Declare vars to store Xero responses
var xero;
var xeroTenants;
var xeroActiveTenantId;

// Declare var to hold studio location
var location;
var locationPretty;

// **** XERO INFO ****
// Store Xero tenant location IDs for each studio location
const xeroTenantIds = {};
xeroTenantIds.taiSengSoleProp = '179403c3-ae56-49d2-aead-0f5d9b309721';
xeroTenantIds.taiSeng = 'd6aa2084-d5d6-4224-a8f7-21d1cd9a7aa1';
xeroTenantIds.jurongEast = 'af44f83f-37d5-4099-b536-7dfb5cb96c9a';
xeroTenantIds.commonwealthOLD = '06f2d4f9-d6e0-4319-b8bb-1722bdd5cda0';
xeroTenantIds.commonwealth = '6dd8240e-40d3-49a8-8240-a5ac75fe3231';
xeroTenantIds.dhobyGhaut = 'b890d0c9-6679-42dd-86da-d93d5a5d96d8';
xeroTenantIds.tanjongPagar = 'a765da37-ad87-4a99-81f6-e5974161fbac';
xeroTenantIds.lavender = '0d37cd4f-bb36-4f12-b102-b5575eb2d843';

// Store Xero bank account IDs (retrieved from Xero UI) for each studio location
const xeroTaiSeng = {
    mainBank: 'cafc3de3-14e3-4731-ba2c-1012d9c299c5',
    cash: '35DED679-3A25-46F2-8C11-A9F83F1B0EE2'
}

const xeroJurongEast = {
    mainBank: '62AC05CD-D128-4B70-BD09-1CD7CA8F68A6',
    cash: '460A0BFF-52F5-46FB-8318-87722D9E4DEF'
}

const xeroCommonwealthOLD = {
    mainBank: 'FB20DE6C-927F-47CE-BE6E-3C95A796A5D0',
    cash: '8EC723A4-F0EB-462F-91EA-E8D4F40B5C8A'
}

const xeroCommonwealth = {
    mainBank: 'C5A6516D-A55F-47EF-952A-2E7CE6873C5A',
    cash: '7502d965-022c-476d-bac4-dddbb8f4feea'
}

const xeroDhobyGhaut = {
    mainBank: '59F13B0E-7E4F-4365-9850-B0A0AF303186',
    cash: '2A4BEDB6-1BB8-41B6-9789-B8FA330F710D'
}

const xeroTanjongPagar = {
    mainBank: '4C260FE6-4272-4259-90C8-AD23556B3A6B',
    cash: '92E15602-5E96-4D96-9101-4DA98CCEC282'
}

const xeroLavender = {
    mainBank: 'C6A09301-D179-4719-ACFC-FB347D8A1EEB',
    cash: '52D319EE-7D6C-41F8-BC2D-B91C8F55A41F'
}
// **** END XERO INFO ****

// List of supported DDY API call functions, anything else will return 400
const supportedFunctions = [
    'version',
    'pin',
    'ddytoken',
    'getXeroInvoice',
    'clients',
    'me',
    'certificates',
    'products',
    'appointments',
    'appointment-types',
    'availability',
    'forms',
    'calendars'
];

// Grab user info from file
const ddyUsers = require('../api-users.json');

// Set up express for HTTPS
app.use(express.json());
app.use('/', express.static(path.join(__dirname, '..', directoryToServe)));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://dreamdanceyoga.com");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Max-Age", "86400");
    res.header("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE");

    // Intercept OPTIONS method to enable basic auth (not sure why this is needed but it seems to work)
    if (req.method == 'OPTIONS') {
        return res.send(200);
    } else {
        // Check and intercept for token request only
        const reqUrl = req.url;
        console.log(`Requested URL: ${reqUrl}`);
        if (reqUrl.includes('ddytoken')) {
            const ddyToken = `ddyadmin:${ddyUsers.ddyadmin}`;
            let buff = Buffer.from(ddyToken);
            let ddyToken64 = buff.toString('base64');
            return res.send(ddyToken64);
        }
        next();
    }
});

app.use(basicAuth({
    // Perform Basic HTTP authentication
    users: ddyUsers,
    challenge: true,
    unauthorizedResponse: getUnauthorizedResponse
}));

const httpsOptions = {
    cert: fs.readFileSync(path.join(__dirname, 'ssl', 'api_dreamdanceyoga_com.crt')),
    key: fs.readFileSync(path.join(__dirname, 'ssl', 'dreamdanceyoga-api.key')),
    ca: [
        fs.readFileSync(path.join(__dirname,'ssl', 'SectigoRSADomainValidationSecureServerCA.crt'))
    ]
};

// Start DDY webserver
https.createServer(httpsOptions, app).listen(port, function () {
    console.log(`Serving the ${directoryToServe}/ dir at https://localhost:${port}`)
});

// Start acuity webhook webserver URL
/*
https.createServer(httpsOptions, acuityApp).listen(acuityPort, function () {
    console.log(`Serving the ${directoryToServe}/ dir at https://localhost:${acuityPort}`)
});
*/

// Basic auth unauthorized response
function getUnauthorizedResponse(req) {
    console.log(`Unauthenticated request:`, req.url);
    return req.auth ? ('Credentials ' + req.auth.user + ':' + req.auth.password + ' rejected') : 'No credentials provided';
}

// Refresh the Xero OAuth2 tokenset if required
async function refreshXeroTokenSet() {
    console.log('== XERO: OUATH2: Checking if necessary to refresh Xero token');
    
    // Instantiate Xero SDK v4 client
    xero = new XeroClient(configXero);
    
    // Retrieve Xero tokenset data from filesystem
    const tokenSetFile = 'xero-tokenset.json';
    const currentTokenSetRaw = fs.readFileSync(path.join(__dirname, 'cert', tokenSetFile), 'utf8');
    const currentTokenSet = JSON.parse(currentTokenSetRaw);

    try {
        // Set Xero OAuth2 token
        await xero.setTokenSet(currentTokenSet);
    }
    catch (err) {
        console.log(`XERO: ERROR: Error setting Xero tokenset:\n`, err.body);
        return false;
    }

    // SET OR REFRESH XERO TOKENS
    // Attempt to retrieve Xero Tenants X times and refresh token if fail    
    let count = 0;
    let tokenValid = false;
    while (!tokenValid && count < 3) {
        count++;
        try {
            // Try to get Xero tenants - if fail then refresh token
            xeroTenants = await xero.updateTenants();
            console.log(`XERO: Xero token set is valid - skipping token refresh`);
            console.log(`XERO: Tenants: ${xeroTenants.length}`);
            
            if (debug) {
                console.log(`XERO: DEBUG: Tenants Detail:\n`, xeroTenants);
            }

            // Set true only once successfully retrieved tenant Ids
            tokenValid = true;
        }
        catch (err) {        
            console.log(`XERO: WARNING: Failed to update Xero tenants - checking if token refresh required. Error:\n`, err.body);

            let retrieveTenantsError = err.body.Title;
            if (retrieveTenantsError === 'Unauthorized') {
                try {
                    // Refresh Xero OAuth2 tokens
                    console.log('XERO: Refreshing Xero tokenset...');

                    // refreshWithRefreshToken calls setAccessToken() so the refreshed token will be stored on newXeroClient    
                    const newTokenSet = await xero.refreshWithRefreshToken(configXero.client_id, configXero.client_secret, currentTokenSet.refresh_token);
                    console.log('XERO: New token set retrieved');
                    
                    // Write new tokens to a file
                    const tokenSetJSON = JSON.stringify(newTokenSet);
                    fs.writeFileSync(path.join(__dirname, 'cert', 'xero-tokenset.json'), tokenSetJSON, err => {
                        if (err) {
                            console.error('XERO: ERROR: Error writing Xero tokenset to file:\n', err);
                        }
                    });
                    console.log('XERO: Xero tokenset written to file');
                }
                catch (err) {
                    console.error(`XERO: ERROR: Could not refresh token. Error:\n`, err.body);
                }
            } else {
                console.log('XERO: ERROR: Could not update Xero tenants. Error:\n', err.body);
            }        
        }
    }

    // If token refresh was successful set proper return value
    if (tokenValid) {
        return true;
    } else {
        return false;
    }
}

function getStudioLocation(reqBody) {
    // Capture and store studio location parameter
    location = 'tai-seng';
    if (typeof reqBody.location !== 'undefined') {
        location = reqBody.location;
        locationPretty = location.replace(/-/g, ' ');
        console.log(`GET STUDIO LOCATION: DDY studio location selected: ${locationPretty}`);
        console.log('GET STUDIO LOCATION: Full request params:', reqBody);
        delete reqBody.location;
    }
    return location;
}

function getSSP(reqBody) {
    // Capture and store SSP parameter to determine whether server-side processing is required for query    
    var ssp = false;
    if (typeof reqBody.ssp !== 'undefined') {
        ssp = reqBody.ssp;
        console.log(`GET SSP: SSP function requested: ${ssp}`);
        delete reqBody.ssp;
    }
    return ssp;
}

// Unpack params URL from UI and set parameters for API calls
async function initAcuityAPIcall(req) {
    // Store query details
    const requestedFunction = req.params.function;
    const body = req.query;
    const queryIds = Object.keys(req.query);
    const queryId1 = Object.keys(req.query)[0];
    const queryParam1 = eval(`req.query.${queryId1}`);
    const queryId2 = Object.keys(req.query)[1];
    const queryParam2 = eval(`req.query.${queryId2}`);

    // Update func var with proper syntax to make API call    
    const func = requestedFunction.replace(/\-\-/g, "/");

    // Search for objects to include in URL request (for acuity labels)
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
        
        console.log('INIT ACUITY API CALL: NEW body after object insertion: ', body);
    }

    // Parse the incoming request params to get required data related to the Acuity and Xero API calls
    // Required data includes whether to send an email, create an invoice in Xero, and apply payment to invoice
    // Refactor this later to send properly formatted JSON via POST (let's be honest that's not gonna happen)
    
    // If first query ID is "method" then set method (PUT/POST/DELETE) otherwise default to GET and remove query
    var method = 'GET';
    if (queryId1 === 'method') {
        method = queryParam1;
        delete body.method;
    }

    // Check if noEmail parameter was set to turn off email confirmations to client
    if (queryId2 === 'noEmail') {
        var noEmail = queryParam2;
        delete body.noEmail;
    }

    // Build Acuity API call URL with params from input URL
    var acuityURL=`/${func}?admin=true`;
    switch (method) {
        case 'GET':
            if (queryIds.length > 0) {
                var count=0;
                queryIds.forEach(i => {
                    if (debug) {
                        console.log(`DEBUG: INIT ACUITY API CALL: Building URL at query id ${i}`)
                    }
                    var queryId = Object.keys(req.query)[count];
                    var queryParam = eval(`req.query.${queryId}`);
                    if (debug) {
                        console.log(`queryId: ${queryId}`);
                        console.log(`queryParam: ${queryParam}`);
                    }
                    acuityURL+=`&${queryId}=${queryParam}`;
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
                // In some cases PUT requires query parameters as well as JSON body - i.e. clients update PUT
                // Set query parameters and JSON body with same data for update (duplicate will be ignored)
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
                        acuityURL+=`&${queryId}=${queryParam}`;
                        count++;
                    });
                }
            } else {
                acuityURL =`/${func}/${idToUpdate}?admin=true`;
            }            
            delete body.id;
            break;
        default:
            return res.status(400).send(`ERROR: INIT ACUITY API CALL: Method not supported: ${method}`);
    }

    // If noEmail parameter was sent, append to end of URL to suppress email to student
    if (noEmail === 'true') {
        acuityURL+=`&noEmail=true`
    }

    // Replace any '+' symbols in URL with ASCII code
    acuityURL = acuityURL.replace(/\+/g, "%2B");

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
        console.log('Req query below');
        console.log(body);
        console.log('ORIGINAL req query (req.query):');
        console.log(req.query);
        console.log(`QueryIds: ${queryIds}`);        
        console.log('Query keys:');
        console.log(Object.keys(req.query));
        console.log('Req params:');
        console.log(req.params);
        console.log(`Query keys length: ${queryIds.length}`);        
        console.log(`URL from DDY MyStudio: ${req.url}`);
        console.log(`Acuity compiled URL: ${acuityURL}`);
        console.log('Acuity compiled options:');
        console.log(options);
    }

    // Make Acuity API call
    try {
        console.log(`INIT ACUITY API CALL: Starting API call: ${acuityURL}`);
        return await acuityAPIcall(acuityURL, options);
    }
    catch (e) {
        console.log(`ERROR: INIT ACUITY API CALL: ${acuityURL}`, e);
        return e;
    }    
}

function acuityAPIcall(func, options) {
    // Initialize Acuity API
    const acuity = Acuity.basic(config);
    
    const acuityPromise = new Promise((resolve, reject) => {
        acuity.request(func, options, (err, res, data) => {
            if (err) { 
                console.log(`ERROR: ACUITY API CALL: ${func}`, err);
                console.log(options);
                reject(err);
            } else {
                console.log('ACUITY API CALL: Completed SUCCESSFULLY!');
                console.log(`ACUITY API CALL: Response status code: ${res.statusCode}`);
                resolve(data);
            }
        });
    });
    return acuityPromise;
}

// Create XERO Invoice if required
async function createXeroInvoice(params, reqFunc) {
    console.log('Checking if necessary to get/create a Xero invoice...');
    
    if (debug) {
        console.log('Params for createXeroInvoice:');
        console.log(params);
        console.log(`CreateInvoice is ${params.xeroCreateInvoice}`);
        console.log(`ApplyPayment is ${params.xeroApplyPayment}`);
    }

    // SET STUDIO LOCATION
    // Set appropriate Xero tenant ID for the studio location received from MyStudio UI
    
    // FUTURE - align location var to object name and capture as below in one line:
    // xeroActiveTenantId = xeroTenantIds[location];
    switch (location) {
        case 'jurong-east':
            xeroActiveTenantId = xeroTenantIds.jurongEast;
            var xeroLocation = 'jurong-east';
            break;
        case 'commonwealth':
            xeroActiveTenantId = xeroTenantIds.commonwealth;
            var xeroLocation = 'commonwealth';
            break;
        case 'dhoby-ghaut':
            xeroActiveTenantId = xeroTenantIds.dhobyGhaut;
            var xeroLocation = 'dhoby-ghaut';
            break;
        case 'tanjong-pagar':
            xeroActiveTenantId = xeroTenantIds.tanjongPagar;
            var xeroLocation = 'tanjong-pagar';
            break;
        case 'lavender':
            xeroActiveTenantId = xeroTenantIds.lavender;
            var xeroLocation = 'lavender';
            break;
        default:
            // Set to Tai Seng by default
            xeroActiveTenantId = xeroTenantIds.taiSeng;
            var xeroLocation = 'tai-seng';
            break
    }
    console.log(`XERO: Xero active tenant for ${location}: ${xeroLocation} / ${xeroActiveTenantId}`);

    // Perform check to see if requested location matches Xero location, otherwise return error
    if (location !== xeroLocation) {
        console.error(`XERO: ERROR: Could not set Xero location, returning...`);
        return { xeroInvoiceStatus: false, xeroInvoiceStatusMessage: `XERO (${locationPretty}): ERROR: Could not set Xero location. Please contact IT support!` };
    }

    if (reqFunc === 'getXeroInvoice') {
        // Request is to get Xero invoices, store required params
        var startDate = params.startDate;
        var endDate = params.endDate;
        var unpaidOnly = params.unpaidOnly;
        console.log(`Getting Xero invoices for studio ${location} from ${startDate} to ${endDate}...`);
        console.log(`Unpaid only: ${unpaidOnly}`);
    } else {        
        // CREATE INVOICE - only create invoice if invoice creation checked on front end
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
            if (params.newPrice != 'false') {
                var price = params.newPrice;
            } else {
                var price = acuityProducts[productIndex].price;
            }
            var productName = acuityProducts[productIndex].name;
        } else { // Function is appointments - class booking
            var productIndex = acuityAppointmentTypes.findIndex(x => x.id == productId);
            if (debug) {
                console.log(`Selected Acuity appointment type:`);
                console.log(acuityAppointmentTypes[productIndex]);
            }            
            if (params.newPrice != 'false') {
                var price = params.newPrice;
            } else {
                var price = acuityAppointmentTypes[productIndex].price;
            }
            var productName = acuityAppointmentTypes[productIndex].name;
        }
        const studentIndex = acuityStudentInfo.findIndex(x => x.email == email);

        // Reduce product name to English only
        var productNameEng = productName.split('|');
        productNameEng = productNameEng.length > 1 ? productNameEng[1].trim() : productNameEng[0].trim();

        if (debug) {
            console.log(`Index for ${productId} is ${productIndex}`);
            console.log(`Index for ${email} is ${studentIndex}`);
            console.log(`Price is: ${price}`);
            console.log(`Product name is: ${productName}`);
            console.log(`Product name (English) is: ${productNameEng}`);
            console.log(`Student last name is: ${acuityStudentInfo[studentIndex].lastName}`);
        }

        if (price > 0) {
            console.log('Price of package is greater than 0, creating invoice...');        
        } else {
            return { xeroInvoiceStatus: false, xeroInvoiceStatusMessage: "XERO: Package price is 0 - invoice NOT created" };
        }

        // Call Xero API to get user details
        const xeroOptions = `EmailAddress="${email}"`;
        try {
            // Retrieve Xero contact with Xero v4 SDK
            const xeroContact = await xero.accountingApi.getContacts(xeroActiveTenantId, undefined, xeroOptions);

            if (xeroContact.response.body.Contacts.length > 1) {
                console.log(`XERO WARNING: More than one contact with email ${email}. Selecting first contact to create invoice: ${xeroContact.response.body.Contacts[0].FirstName} ${xeroContact.response.body.Contacts[0].LastName}.`);
            }
            var xeroContactID = xeroContact.response.body.Contacts[0].ContactID
            console.log(`XERO: Contact FOUND: ${xeroContactID}`);

            if (debug) {
                console.log(`Xero contact ID: ${xeroContactID}`);
            }
        } catch (e) {
            // Contact NOT found, create new Xero contact with student information
            console.log(`XERO: Contact NOT FOUND.  Creating new Xero contact for ${location}...`);

            // Capture student details from params
            var firstName = params.firstName;
            var lastName = params.lastName;
            var phone = params.phone;

            // Build Xero options for v4 SDK to create Xero contact
            var xeroContactBody = { 
                contacts: [
                    {
                        name: eval(`'${firstName} ${lastName}'`),
                        emailAddress: eval(`'${email}'`),
                        phones: [
                            {
                                phoneType: 'DEFAULT',
                                phoneNumber: eval(`'${phone}'`)
                            }
                        ],
                    }
                ]
            };

            console.log('Ready to send Xero CONTACTS API call.  Xero body below:');
            console.log(JSON.stringify(xeroContactBody, null, 2));

            try {
                // Create Xero Contact with Xero v4 SDK
                var xeroResult = await xero.accountingApi.createContacts(xeroActiveTenantId, xeroContactBody, true);
                var xeroContactID = xeroResult.response.body.Contacts[0].ContactID
                
                console.log('XERO: Contact creation SUCCESSFUL');
                console.log(`XERO: Contact created:\n`, xeroResult.response.body);
                console.log(`XERO: Contact ID: ${xeroContactID}`);
            }
            catch (e) {
                console.error(`XERO ERROR: Error caught creating Xero contact:\n`, e);
                return { xeroInvoiceStatus: false, xeroInvoiceStatusMessage: `XERO (${locationPretty}): ERROR caught retrieving contact information and failed to create new contact. Please contact IT support!` };
            }
        }

        // Capture required Xero parameters
        const invoiceType = 'ACCREC';
        // const invoiceStatus = 'DRAFT';
        const invoiceStatus = 'AUTHORISED';
        const tax = 'NoTax';
        const ref = `${productNameEng} ${acuityStudentInfo[studentIndex].firstName} ${acuityStudentInfo[studentIndex].lastName} (Added by DDY MyStudio)`;
        const accountCode = 200;
            
        // Calculate due date
        var daysUntilDue = 7 // Set to number of days before invoice is due
        var dateOptions = {day: '2-digit', month: '2-digit', year: 'numeric'};
        var dueDate = new Date();
        var addDays = dueDate.getDate() + daysUntilDue;
        dueDate.setDate(addDays);
        dueDate = dueDate.toLocaleDateString(undefined, dateOptions);

        // Build Xero options for v4 SDK
        var xeroBody = { 
            invoices: [
                {
                    type: eval(`'${invoiceType}'`),
                    contact: {
                        contactID: eval(`'${xeroContactID}'`),
                    },
                    lineAmountTypes: eval(`'${tax}'`),
                    dueDate: eval(`'${dueDate}'`),
                    status: eval(`'${invoiceStatus}'`),
                    reference: eval(`'${ref}'`),
                    lineItems: [
                        {                        
                            description: eval(`'${productNameEng}'`),
                            unitAmount: eval(`'${price}'`),
                            accountCode: eval(`'${accountCode}'`)
                        }
                    ]
                }
            ]
        };

        console.log('Ready to send Xero API call.  Xero body below:');
        console.log(JSON.stringify(xeroBody, null, 2));
    }
    
    // Send Xero API call
    try {
        if (reqFunc === 'getXeroInvoice') {
            // Get invoices for specified dates and return
            // If unpaidOnly flag is set, only return invoices pending payment            
            if (unpaidOnly == 'true') {
                var xeroOptions = `Date >= DateTime.Parse("${startDate}") && Date <= DateTime.Parse("${endDate}") && AmountDue > 0 && Status == "AUTHORISED"`;
            } else {
                var xeroOptions = `Date >= DateTime.Parse("${startDate}") && Date <= DateTime.Parse("${endDate}")`;
            }
            console.log(`Xero options:`, xeroOptions);

            // Get invoices with Xero v4 SDK
            var xeroResult = await xero.accountingApi.getInvoices(xeroActiveTenantId, null, xeroOptions);
            
            console.log(`XERO (${locationPretty}): Invoice retrieval SUCCESSFUL`);
            console.log(`Invoices returned: ${xeroResult.response.body.Invoices.length}`);
            
            xeroResult.xeroInvoiceStatus = true;
            xeroResult.xeroInvoiceStatusMessage = `XERO (${locationPretty}): Invoices retrieved SUCCESSFULLY`;
            return xeroResult.response.body;
        } else {
            // Create Xero invoice with Xero v4 SDK
            var xeroResult = await xero.accountingApi.createInvoices(xeroActiveTenantId, xeroBody, true);
            console.log(`XERO (${locationPretty}): Invoice creation SUCCESSFUL`);

            // Update Xero results object to remove unnecessary data
            xeroResult = xeroResult.response.body;
            if (debug) {
                console.log('DEBUG: Xero invoice creation result:', xeroResult);
            }

            xeroResult.xeroInvoiceStatus = true;
            xeroResult.xeroInvoiceStatusMessage = `XERO (${locationPretty}): Invoice created SUCCESSFULLY`;
        }
    } catch (e) {
        console.error('\nXERO ERROR: Error in XERO invoice retrieval / creation API call:\n', e);
        console.error('\nXERO: API call result:\n', JSON.stringify(xeroResult, undefined, 2));
        return { xeroInvoiceStatus: false, xeroInvoiceStatusMessage: `XERO (${locationPretty}): ERROR caught retrieving / creating XERO invoice. Please contact IT support!` };
    }

    // Apply payment to Xero invoice if required
    console.log('Checking whether to apply a payment to Xero invoice...');
    var applyPayment = false;    
    if (params.xeroApplyPayment === 'true') {
        applyPayment = true;
    } else if (params.xeroApplyPayment === 'false' && params.depositAmount != 'false') {
        applyPayment = true;
    }

    if (applyPayment) {
        console.log('XERO: Applying payment to Xero invoice...');
        try {
            var xeroPayment = await xeroApplyPayment(xeroResult, params);
            console.log('XERO: Apply payment result:');
            console.log(xeroPayment);
            // Store result of Xero apply payment status
            xeroResult.xeroPaymentStatus = xeroPayment.xeroPaymentStatus;
            xeroResult.xeroPaymentStatusMessage = xeroPayment.xeroPaymentStatusMessage;
        } catch (e) {
            console.log('XERO ERROR: Error in XERO apply payment API call');
            xeroResult.xeroPaymentStatus = false;
            xeroResult.xeroPaymentStatusMessage = `XERO (${locationPretty}): ERROR caught creating XERO payment. Please contact IT support!`;
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
                xeroResult.xeroPaymentWarningMessage = xeroPayment.Payments[0].Warnings[0].Message;
                console.log(`WARNING: Xero Payment warning message: ${xeroResult.xeroPaymentWarningMessage}`);
                console.log('XERO WARNING: THERE ARE WARNINGS');
                // xeroResult.xeroPaymentWarningMessage = 'SOME XERO WARNING';
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
        return xeroResult;
    }

    return xeroResult;
}

async function xeroApplyPayment(xeroInvoice, requestParams) {
    // Apply payment to Xero Invoice - capture required params
    var invoiceID = xeroInvoice.Invoices[0].InvoiceID;
    var invoiceNumber = xeroInvoice.Invoices[0].InvoiceNumber;    
    var todaysDate = new Date();
    var dateOptions = {day: '2-digit', month: '2-digit', year: 'numeric'};
    todaysDate = todaysDate.toLocaleDateString(undefined, dateOptions);

    // Apply deposit only if it exists, otherwise apply full payment
    if (debug) {
        console.log('Xero Apply Payment - request params below:');
        console.log(requestParams);
    }
    
    var depositAmount = requestParams.depositAmount;
    if (depositAmount === 'false') {        
        var paymentAmount = xeroInvoice.Invoices[0].AmountDue;
        console.log(`Applying full payment to invoice: ${paymentAmount}`);
    } else {        
        var paymentAmount = depositAmount;
        var applyDeposit = true;
        console.log(`Applying deposit to invoice: ${paymentAmount}`);
    }
    
    // NEW METHOD: Retrieve xero bank account IDs from const defined at top of program
    switch (location) {
        case 'tai-seng':
            var xeroAccounts = xeroTaiSeng;
            break;
        case 'jurong-east':
            var xeroAccounts = xeroJurongEast;
            break;
        case 'commonwealth':
            var xeroAccounts = xeroCommonwealth;
            break;
        case 'dhoby-ghaut':
            var xeroAccounts = xeroDhobyGhaut;
            break;
        case 'tanjong-pagar':
            var xeroAccounts = xeroTanjongPagar;
            break;
        case 'lavender':
            var xeroAccounts = xeroLavender;
            break;
        default:
            console.log('ERROR: Studio location not defined');
            return { xeroPaymentStatus: false, xeroPaymentStatusMessage: "ERROR: Studio location not defined" };
    }
    
    // Translate payment method to XERO account ID to apply payment
    switch (requestParams.paymentMethod) {
        case 'cashOrBankXfer':
            var accountID = xeroAccounts.mainBank;
            var ref = "Paid Cash / Bank Transfer (via DDY MyStudio)";
            break;
        case 'bankXfer':
            var accountID = xeroAccounts.mainBank;
            var ref = "Paid Bank Transfer (via DDY MyStudio)";
            break;
        case 'cash':
            var accountID = xeroAccounts.cash;
            var ref = "Paid CASH (via DDY MyStudio)";
            break;
        case 'cc-terminal':
            // FUTURE: Not possible via front-end today (we don't have a cc-terminal)
            var accountID = xeroAccountIDs.taiSengBank;
            var ref = "Paid CC TERMINAL (via DDY MyStudio)";
            break;
        case 'bankXfer-DDY':
            // LEGACY - no longer possible via front-end
            var accountID = xeroAccountIDs.taiSengBank;
            var ref = "Paid Bank Transfer to DDY Account (via DDY MyStudio)";
            break;
        case 'bankXfer-Sophia':
            // LEGACY - no longer possible via front-end
            var accountID = xeroAccountIDs.sophiaBank;
            var ref = "Paid Bank Transfer to Sophia (via DDY MyStudio)";
            break;
        default:
            console.log("XERO ERROR: Payment method not defined in Xero");
            return { xeroPaymentStatus: false, xeroPaymentStatusMessage: "XERO: Payment method not defined in Xero" };
    }

    // Build Xero Payment params for v4 SDK
    const xeroBody = { 
        invoice: { invoiceID: eval(`'${invoiceID}'`) },
        account: { accountID: eval(`'${accountID}'`) },
        date: eval(`'${todaysDate}'`),
        amount: eval(`'${paymentAmount}'`),
        reference: eval(`'${ref}'`)
    };
    
    console.log('XERO: Starting API call to apply Xero payment with below params:');
    console.log(xeroBody);

    try {
        let xeroPayment = await xero.accountingApi.createPayment(xeroActiveTenantId, xeroBody);
        console.log(`XERO (${locationPretty}): Apply payment completed successfully`);

        // Update Xero results object to remove unnecessary data
        xeroPayment = xeroPayment.response.body;

        xeroPayment.xeroPaymentStatus = true;
        xeroPayment.xeroPaymentStatusMessage = `XERO (${locationPretty}): Payment applied SUCCESSFULLY`;

        return xeroPayment;
    } catch (e) {
        console.log('XERO: Error caught in XERO apply payment API call:\n', e);
        return { xeroPaymentStatus: false, xeroPaymentStatusMessage: "XERO: Error caught in Xero apply payment API call. Please contact IT support!" };
    }    
}

function parseXeroApiCall(xeroInvoice, acuityResult) {
    console.log(`acuityAPIcall: Create XERO invoice result:`);
    console.log(xeroInvoice);

    // Check if Xero invoice created - if so store response
    acuityResult.xeroInvoiceStatus = xeroInvoice.xeroInvoiceStatus;
    acuityResult.xeroInvoiceStatusMessage = xeroInvoice.xeroInvoiceStatusMessage;    

    if (acuityResult.xeroInvoiceStatus) {
        acuityResult.xeroInvoiceStatusString = xeroInvoice.Status;
        // Check for errors in invoice creation
        if (!xeroInvoice || !acuityResult.xeroInvoiceStatus || acuityResult.xeroInvoiceStatusString !== "OK") {
            // Is there a xero invoice validation errors array???
            console.log(`ERROR: Error in Xero Invoice creation.  Status: ${acuityResult.xeroInvoiceStatus} / ${acuityResult.xeroInvoiceStatusString}`);                        
        }

        // If no errors store Invoice ID to build Xero URL for front-end
        acuityResult.xeroInvoiceId = xeroInvoice.Invoices[0].InvoiceID;
        acuityResult.xeroInvoiceNumber = xeroInvoice.Invoices[0].InvoiceNumber;
        
        // Check if Xero payment applied - if so store response
        acuityResult.xeroPaymentStatus = xeroInvoice.xeroPaymentStatus;
        acuityResult.xeroPaymentStatusMessage = xeroInvoice.xeroPaymentStatusMessage;
        acuityResult.xeroPaymentWarningMessage = xeroInvoice.xeroPaymentWarningMessage;
        if (acuityResult.xeroPaymentStatus) {
            acuityResult.xeroPaymentStatusString = xeroInvoice.xeroPaymentStatusString;
            // Check for errors in applying payment
            if (!acuityResult.xeroPaymentStatus) {
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

function getDdyInstructors(acuityClients) {
    
    var instructorNote = 'DDY Instructor';
    
    var instructors = acuityClients.filter(client => client.notes.includes(instructorNote));
    console.log('GET DDY INSTRUCTORS: Filtered instructors array: ', instructors);
    
    return instructors;
}

function getDdyMembers(allCerts) {    
    // Initialize object with each locations
    var today = new Date();
    var ddyMembers = {};
    
    // NEED FUNCTION TO GET DDY LOCATIONS HERE
    var locations = ['Tai Seng', 'Jurong East', 'Commonwealth', 'Dhoby Ghaut'];
    
    locations.forEach((location) => {
        console.log(`GET DDY MEMBERS: ${location}`);
        ddyMembers[location] = {};

        // Initialize vars to hold DDY info numbers
        ddyMembers[location].validCerts = 0;
        ddyMembers[location].expiredCerts = 0;
        ddyMembers[location].goldMembers = 0;
        ddyMembers[location].silverDance = 0;
        ddyMembers[location].silverYoga = 0;
        ddyMembers[location].silverDanceAndYoga = 0;
        ddyMembers[location].packageYoga8 = 0;
        ddyMembers[location].packageYoga16 = 0;
        ddyMembers[location].packageDance8 = 0;
        ddyMembers[location].packageDance16 = 0;
        ddyMembers[location].packageDanceAndYoga8 = 0;
        ddyMembers[location].packageDanceAndYoga16 = 0;
        ddyMembers[location].packageDanceAndYoga1Year = 0;
        ddyMembers[location].otherCerts = [];

        // Iterate through all certificates to determine member type
        for (var cert of allCerts) {
            var certExpiryString = cert.expiration;
            var certExpiry = new Date(certExpiryString);
            
            if (certExpiry < today) { // THIS SHOULD BE MOVED INTO LOCATION BRANCH
                ddyMembers[location].expiredCerts++;
            } else {
                ddyMembers[location].validCerts++;                
                var certType = cert.name;
                if (certType.includes(location)) {
                    if (!certType.includes('COVID')) {
                        if (certType.includes('GOLD')) {
                            ddyMembers[location].goldMembers++;
                        } else if (certType.includes('Silver') && certType.includes('Bellydance')) {
                            ddyMembers[location].silverDance++;
                        } else if (certType.includes('Silver') && certType.includes('Dance and Yoga')) {
                            ddyMembers[location].silverDanceAndYoga++;
                        } else if (certType.includes('Silver') && certType.includes('Yoga')) {
                            ddyMembers[location].silverYoga++;
                        } else if (certType.includes('Package') && certType.includes('Bellydance 8 Class')) {
                            ddyMembers[location].packageDance8++;
                        } else if (certType.includes('Package') && (certType.includes('Bellydance 16 Class') || certType.includes('Bellydance 16+8 Class'))) {
                            ddyMembers[location].packageDance16++;
                        } else if (certType.includes('Package') && certType.includes('Dance and Yoga 8 Class')) {
                            ddyMembers[location].packageDanceAndYoga8++;
                        } else if (certType.includes('Package') && certType.includes('Dance and Yoga 16')) {
                            ddyMembers[location].packageDanceAndYoga16++;
                        } else if (certType.includes('Package') && certType.includes('Yoga 8 Class')) {
                            ddyMembers[location].packageYoga8++;
                        } else if (certType.includes('Package') && (certType.includes('Yoga 16 Class') || certType.includes('Yoga 16+8 Class'))) {
                            ddyMembers[location].packageYoga16++;
                        } else if (certType.includes('1 Year')) {
                            ddyMembers[location].packageDanceAndYoga1Year++;
                        } else {
                            ddyMembers[location].otherCerts.push(cert);
                        }
                    }
                }
            }
        }
    });
    console.log('GET DDY MEMBERS: DDY members object: ', ddyMembers);

    return ddyMembers;
}

// DDY REST CONTROLLER / REPEATER API
// Refactor later as POST to accept JSON body
app.get('/api/ddy/:function', async (req, res) => {
    // Start perf timer
    if (debug) { console.time('ddyApiFunction'); }
    
    // Get timestamp
    var options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour12: true, hour: 'numeric', minute: 'numeric' };
    var datePretty = new Date().toLocaleString('en-US', options);
    
    console.log(`==== ${datePretty}: DDY REST CONTROLLER v${ddyRestControllerVersion} ====`);
    console.log(`== API call from ${req.headers.host} @ ${req.headers.origin} at ${req.ip} ==`);
    
    // Store the requested function and return if function not in supportedFunctions array
    const reqFunc = req.params.function.split('--')[0];
    console.log(`DDY API CALL: Requested function: ${reqFunc}`);
    if (!supportedFunctions.includes(reqFunc)) { return res.status(400).send('Function not supported'); }

    // XERO v4: Refresh Xero OAuth2 token if neccesary to ensure it remains current - skip some functions that don't require Xero
    if (reqFunc !== 'version' && reqFunc !== 'pin'  && reqFunc !== 'ddytoken') {
        const xeroRefreshTokenResult = await refreshXeroTokenSet();
        console.log(`XERO: Xero token refresh result: ${xeroRefreshTokenResult}`);

        if (!xeroRefreshTokenResult) {
            console.log('XERO: ERROR: Could not refresh Xero tokens - please check ASAP')
            return res.status(400).send('XERO: ERROR: Could not refresh Xero tokens. Please contact IT support!');
        }
    }

    // Retrieve and set location from params to set proper studio location and Xero instance
    location = getStudioLocation(req.query);

    // Retrieve and set SSP parameter if it exists to determine whether server-side processing has been requested
    var ssp = getSSP(req.query);

    // Invoke proper action based on requested function
    switch (reqFunc) {
        case 'version':
            // If VERSION request then return version
            return res.status(200).send(ddyRestControllerVersion);
        case 'pin':
            // If PIN request then return instructor PIN
            const instructorPin = '2468';
            let buff = Buffer.from(instructorPin);
            let instructorPin64 = buff.toString('base64');
            return res.status(200).send(instructorPin64);
        case 'getXeroInvoice':
            // Return list of Xero invoices
            var xeroInvoice = await createXeroInvoice(req.query, reqFunc);
            return res.status(200).send(xeroInvoice);
        default:
            // Acuity request, set proper options and make calls
            // If first query ID is "method" then set method (PUT/POST/DELETE) otherwise default to GET and remove query
            const queryId1 = Object.keys(req.query)[0];
            const queryParam1 = eval(`req.query.${queryId1}`);
            var method = 'GET';
            if (queryId1 === 'method') { method = queryParam1; }
            
            // Prepare options and store Acuity API call result
            var acuityResult = await initAcuityAPIcall(req);

            // Check if result is defined and return result
            if (typeof acuityResult != 'undefined') {
                console.log(`DDY API CALL: Records returned: ${acuityResult.length}`);
                if (acuityResult.status_code >= 400) {
                    return res.status(400).send(`ERROR: DDY API CALL: Error 400 or higher occured\nStatus Code: ${acuityResult.status_code}\nError Message: ${acuityResult.message}`);
                } else if (acuityResult.length < 1) {
                    console.log(`DDY API CALL: COMPLETED NO RECORDS - returning 200 response to server: ${reqFunc}`);
                    return res.status(200).send('No records returned');
                } else if (typeof acuityResult == 'string' && acuityResult.includes('Gateway Time-out')) {
                    console.log(`DDY API CALL: GATEWAY TIMEOUT - returning 400 response to server: ${reqFunc}`);
                    return res.status(400).send('Acuity gateway timeout - please try again');
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
                        console.log('DEBUG: DDY API CALL: API call response before server-side processing:');
                        console.log(JSON.stringify(acuityResult, undefined, 2));
                    }

                    // If server-side processing has been requested, call the appropriate function
                    if (ssp) {
                        console.log(`acuityAPIcall: SSP: Server side processing requested: ${ssp}`);
                        switch (ssp) {                            
                            case 'getDdyInstructors':
                                acuityResult = getDdyInstructors(acuityResult);
                                break;
                            case 'getDdyMembers':
                                acuityResult = getDdyMembers(acuityResult);
                                break;
                        }
                    }

                    // Print performance result
                    if (debug) { console.timeEnd('ddyApiFunction'); }

                    // Return response to client
                    return res.status(200).send(acuityResult);
                }
            } else {
                console.log('DDY API CALL: Acuity API call response is undefined');
                return res.status(200).send('DDY API CALL: Acuity API call response is undefined');
            }
    }
});

// Stripe webhook handler
app.post('/stripe/webhook', async (req, res) => {
    try {
        // Capture Stripe event high level details
        var stripeEvent = req.body;
        var stripeLiveMode = stripeEvent.data.object.livemode
        var stripePaymentType = stripeEvent.data.object.type;
        var stripePaymentId = stripeEvent.data.object.id;
        console.log('STRIPE webhook event is:', stripeEvent);
        console.log(`LIVEMODE: ${stripeLiveMode}`);

        // If payment type is WeChat, initiate payment, otherwise ignore
        if (stripePaymentType === 'wechat') {
            // Capture payment details                        
            var stripePaymentAmount = stripeEvent.data.object.amount;
            var stripePaymentCurrency = stripeEvent.data.object.currency;

            switch (stripeEvent.type) {
                case 'source.chargeable':
                    console.log('Making stripe payment...');
                    if (stripeLiveMode) {
                        stripe.charges.create({
                            amount: stripePaymentAmount,
                            currency: stripePaymentCurrency,
                            source: stripePaymentId,
                        }, (err, charge) => {
                            // asynchronously called
                            console.log('STRIPE: Stripe payment result:');
                            console.log('Errors', err);
                            console.log('Charge', charge);
                            console.log(`STRIPE: Stripe payment ${stripePaymentId} complete`);
                        });
                    } else {
                        // TEST MODE
                        stripeTest.charges.create({
                            amount: stripePaymentAmount,
                            currency: stripePaymentCurrency,
                            source: stripePaymentId,
                        }, (err, charge) => {
                            // asynchronously called
                            console.log('STRIPE: Stripe TEST payment result:');
                            console.log('Errors', err);
                            console.log('Charge', charge);
                            console.log(`STRIPE: Stripe TEST payment ${stripePaymentId} complete`);
                        });
                    }
                    break;
                case 'source.canceled':
                    console.log(`STRIPE: Stripe payment ${stripePaymentId} canceled`);
                    break;
                case 'source.failed':
                    console.log(`STRIPE: Stripe payment ${stripePaymentId} failed authorization`);
                    break;
                default:
                    console.log(`STRIPE: Unexepected WeChat event type: ${stripeEvent.type}`);
                    return res.status(400).end();
            }            
        }

        // Handle charges webhooks
        switch (stripeEvent.type) {
            case 'charge.succeeded':
                console.log(`STRIPE: Stripe payment ${stripePaymentId} CHARGE SUCCESSFUL`);
                // Do something here?  Maintain data in stripe object to kick off purchase?
                // Only need to generate cert and/or book classes, invoice not required
                break;
            case 'charge.failed':
                console.log(`STRIPE: Stripe payment ${stripePaymentId} FAILED`);
                break;
            default:
                console.log(`STRIPE: Unexepected event type - NOT charge success or fail: ${stripeEvent.type}`);
                // return res.status(400).end();
        }
        
        // Acknowledge receipt of event to sender
        res.status(200).json({received: true});
    }
    catch (err) {
        console.log('STRIPE webhook ERROR:', err.message);        
        res.status(400).send(`Webhook Error: ${err.message}`);
    }
});

// const acuityApp = express();
// const acuityPort = 443;

/*
// Acuity webhook handler
acuityApp.post('/acuity/webhook', async (req, res) => {
    try {
        // Capture Acuity event high level details
        var acuityEvent = req.body;        
        console.log('ACUITY webhook event is:', acuityEvent);
    }
    catch (err) {
        console.log('ACUITY webhook ERROR:', err.message);        
        res.status(400).send(`Acuity Webhook Error: ${err.message}`);
    }
});
*/