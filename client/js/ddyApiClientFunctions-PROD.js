// Setup script
const environment = 'PROD';
const version = '2.0.0';
var ddyToken = null;

// Set API host
// var apiHostUAT = 'https://greg-monster.dreamdanceyoga.com:3443/api/ddy'; // GREG computer
// var apiHostUAT = 'https://localhost:3443/api/ddy'; // GREG computer localhost
var apiHostUAT = 'https://api.dreamdanceyoga.com:3444/api/ddy'; // AWS UAT
var apiHostPROD = 'https://api.dreamdanceyoga.com:3443/api/ddy'; // AWS PROD

// Debug mode
if (environment === 'UAT') {
    var debug = true;
} else {
    var debug = false;
}

// Override default debug settings
// const debug = true;

async function initApiCall(func, activity, params) {
    if (debug) {
        writeMessage("debug", `<br>Starting initApiCall: ${func} - ${activity}`);        
        if (params) {
            console.log('InitApiCall params:');
            console.log(params);
        }
    }

    // Initialize parameters for API call
    switch (func) {
        case 'clients_search':
            switch (activity) {
                case 'retrieveAllClients':
                    var searchTerm = '';
                    break;
                case 'retrieveClientInfo':
                    var searchTerm = params.searchTerm;                    
                    break;
                default:            
                    var searchTerm = $('#search_student_form').val();
                    if (!searchTerm) { searchTerm = ''; }                    
                    break;
            }
            // Set search parameters
            var params = {
                search: searchTerm
            };
            break;
        case 'clients_add':
            switch (activity) {
                case 'addStudent':
                    var firstName = params.firstName;
                    var lastName = params.lastName;
                    var email = params.email;
                    var phone = params.phone;
                    var notes = params.notes;
                    var params = {
                        method: 'POST',
                        firstName,
                        lastName,
                        email,
                        phone,
                        notes
                    };
                    break;
                default:
                    return 'Activity not defined';
            }
            break;
        case 'clients_update':
        switch (activity) {
            case 'addClientNotes':
                var firstName = params.firstName;
                var lastName = params.lastName;
                var phone = params.phone;
                var notes = params.notes;
                var params = {
                    method: 'PUT',
                    firstName,
                    lastName,
                    phone,
                    notes
                };
                break;
            default:
                return 'Activity not defined';
        }
        break;
        case 'products_get':
            var params = {};
            break;
        case 'appointment-types_get':
            var params = {};
            break;
        case 'calendars_get':
            var params = {};
            break;
        case 'availability--classes_get':
            switch (activity) {
                case 'getClassesByDate':
                    // Find all classes scheduled for given date
                    var classDateMin = params[0] || params;
                    var minDate = $.datepicker.formatDate('yy/mm/dd', classDateMin);
                    var classDateMax = params[1] || params;
                    var maxDate = classDateMax;
                    if (classDateMin === classDateMax) {
                        // Get availability for single date - set maxDate to date + 1                        
                        maxDate.setDate(classDateMin.getDate() + 1);
                        maxDate = $.datepicker.formatDate('yy/mm/dd', maxDate);
                    } else {
                        // Get availabilty for date range
                        maxDate.setDate(classDateMax.getDate() + 1);
                        maxDate = $.datepicker.formatDate('yy/mm/dd', classDateMax);
                    }
                    var params = {		
                        minDate,
                        maxDate,
                        includeUnavailable: true,
                        includePrivate: true
                    };                    
                    break;
                case 'classSeries':
                    // Buy a series - find all classes for the selected class series
                    // 
                    // UPDATE HERE - pass selectedClass object DIRECTLY - no need to loop through array again
                    // 
                    var products = params;
                    // var selectedClass = params; NEW
                    var selectedClassVal = $('#select_package_class_dropdown').val();
                    var selectedClass = $.grep(products, (i) => {
                        return i.name === selectedClassVal;
                    });				
                    var classId = selectedClass[0].id;
                    var params = {		
                        appointmentTypeID: classId,
                        includeUnavailable: true
                    };
                    break;
                case 'classSeriesNEW':
                    // Buy a series - find all classes for the selected class series
                    // 
                    // UPDATE HERE - pass selectedClass object DIRECTLY - no need to loop through array again
                    // 
                    var selectedClass = params;                    
                    var classId = selectedClass[0].id;

                    var params = {
                        appointmentTypeID: classId,
                        includeUnavailable: true
                    };
                    break;
                default:
                    return 'Activity not defined';
            }
            break;
        case 'appointments_get':
            switch (activity) {
                case 'getApptsForClass':
                    var classId = params[0];
                    var classDate = params[1];
                    var classDate = $.datepicker.formatDate('yy/mm/dd', classDate);
                    var minDate = classDate;
                    var maxDate = classDate;
                    var maxResults = 200;
                    var params = {
                        appointmentTypeID: classId,
                        minDate,
                        maxDate,
                        max: maxResults
                    };
                    break;
                case 'getApptsByDateRange':                    
                    var minDate = params[0];
                    var maxDate = params[1];
                    minDate = $.datepicker.formatDate('mm/dd/yy', minDate);
                    maxDate = $.datepicker.formatDate('mm/dd/yy', maxDate);
                    var params = {
                        minDate,
                        maxDate,
                        max: 9999
                    };
                    break;
                case 'getApptsByEmail':
                    var clients = params;
                    var selectedClientVal = $('#search_student_dropdown').val();
                    var selected_client = $.grep(clients, (i) => {
                        return `${i.firstName} ${i.lastName}` === selectedClientVal;
                    });
                    var clientEmail = selected_client[0].email;
                    var params = {
                        email: clientEmail,
                        max: 9999
                    };
                    break;
                default:
                    return 'Activity not defined';
            }
            break;
        case 'appointments_post':
            // BOOK A SINGLE APPOINTMENT
            switch (activity) {
                case 'addToClass':
                    var studentInfo = params;
                    var classId = studentInfo.classId;
                    var datetime = studentInfo.datetime;
                    var firstName = studentInfo.firstName;
                    var lastName = studentInfo.lastName;
                    var email = studentInfo.email;
                    var certificate = studentInfo.certificate;
                    var calendarID = studentInfo.calendarID;
                    var OBJECT = 'labels_id';
                    var labels_id = studentInfo.labelID;
                    var noEmail = studentInfo.noEmail || false;
                    var params = {
                        method: "POST",
                        noEmail,
                        datetime,
                        appointmentTypeID: classId,
                        firstName,
                        lastName,
                        email,
                        certificate,
                        calendarID,
                        OBJECT,
                        labels_id
                    };
                    break;
                case 'addToClassSeries':
                    // BOOK A CLASS SERIES AND CREATE INVOICE
                    // Create an appointment in an Acuity class series for selected student
                    var classTimes = params[0];
                    var selectedClient = params[1];
                    
                    // Set client information
                    var client_firstName = selectedClient[0].firstName;
                    var client_lastName = selectedClient[0].lastName;
                    var client_email = selectedClient[0].email;
                    var client_phone = selectedClient[0].phone;

                    // Set createInvoice to determine whether to create an invoice in Xero - only 1 invoice created for each class series
                    var createInvoice = params[2];
                    console.log('classTimes is: ', classTimes);

                    var classTime = $('#buy_class_submit').data('classTime');
                    var classId = classTimes[0].appointmentTypeID;
                    var calendarId = classTimes[0].calendarID;
                    var paymentMethod = $('#payment_method_dropdown option:selected').val();
                    if (debug) {
                        console.log(`classId is ${classId}`);
                        console.log(`calendarID is ${calendarId}`);
                    }
                    
                    // Get updated package price if specified
                    var newPrice = $('#updated_price').val() || false;
                    if (newPrice) {
                        newPrice = parseFloat(newPrice).toFixed(2);
                    }
                    console.log('UPDATED PRICE: ', newPrice);

                    // Get deposit amount if specified
                    var depositAmount = $('#deposit_amount').val() || false;
                    if (depositAmount) {
                        depositAmount = parseFloat(depositAmount).toFixed(2);
                    }
                    console.log('DEPOSIT AMOUNT: ', depositAmount);

                    // Check Xero invoice checkboxes to determine whether to create invoice / apply payment
                    // Check checkboxes on last run of class series booking
                    if (createInvoice) {
                        var createInvoiceChecked = $('#create_invoice_checkbox').is(':checked');
                        var applyPaymentChecked = $('#apply_payment_checkbox').is(':checked');
                    } else {
                        var createInvoiceChecked = false
                        var applyPaymentChecked = false
                    }
                    if (debug) {
                        console.log(`createInvoiceChecked is ${createInvoiceChecked}`);
                        console.log(`applyPaymentChecked is ${applyPaymentChecked}`);
                    }
                    
                    var params = {
                        method: "POST",
                        paymentMethod: paymentMethod,
                        xeroCreateInvoice: createInvoiceChecked,
                        xeroApplyPayment: applyPaymentChecked,
                        datetime: classTime,
                        appointmentTypeID: classId,
                        calendarID: calendarId,
                        firstName: client_firstName,
                        lastName: client_lastName,
                        email: client_email,
                        phone: client_phone,
                        newPrice,
                        depositAmount
                    };                    
                    break;
                default:
                    return 'Activity not defined';
            }
            break;
        case 'appointments_put':
            switch (activity) {
                case 'updateStudentNotes':
                    var apptId = params.id;
                    var checkInNote = params.checkInNote;
                    var noEmail = params.noEmail || false;
                    if (debug) {
                        console.log('Appt ID is: ', apptId);
                        console.log('Check-in note is: ', checkInNote);
                    }
                    var params = {
                        method: "PUT",                        
                        id: apptId,
                        notes: `${checkInNote}`
                    };
                    break;
                case 'cancelAppointment':
                    var apptId = params.apptId;
                    var cancelNote = params.cancelNote;
                    var noEmail = params.noEmail || false;
                    if (debug) {
                        console.log('Appt ID is: ', apptId);                        
                    }
                    // Update func to send proper URL
                    func = `appointments--${apptId}--cancel`;
                    console.log('func is: ', func);
                    var params = {
                        method: "PUT",
                        noEmail,
                        cancelNote
                    };
                    break;
                default:
                    return 'Activity not defined';
            }
            break;
        case 'certificates_get':
            switch (activity) {
                case 'retrieveCertificates':
                    // var selected_client = $('#search_student_dropdown').prop('selectedIndex');	
                    var clients = params;
                    var selectedClientVal = $('#search_student_dropdown').val();
                    var selected_client = $.grep(clients, (i) => {
                        return `${i.firstName} ${i.lastName}` === selectedClientVal;
                    });
                    var client_email = selected_client[0].email;
                    if (debug) {
                        console.log(`selectedClientVal is ${selectedClientVal}`);
                        console.log(`selected_client is:`);
                        console.log(selected_client);
                        console.log(`client email is ${client_email}`);
                    }				
                    var params = {		
                        email: client_email
                    };
                    break;
                case 'retrieveCertificatesByEmail':
                    var client_email = params;                    	
                    var params = {		
                        email: client_email
                    };
                    break;
                case 'retrieveAllCertificates':                    
                    break;
                default:
                    return 'Activity not defined';
                }                
            break;
        case 'certificates_del':
            var selected_cert = $('#select_code_del').prop('selectedIndex');
            var certId = certificates[selected_cert].id;			
            var params = {
                method: "DELETE",
                id: certId
            };
            break;
        case 'certificates_create':
            switch (activity) {
                case 'createCertificate':
                    var selectedProduct = params[0];
                    var selectedClient = params[1];
                    var productId = selectedProduct[0].id;
                    var clientEmail = selectedClient[0].email;
                    var createInvoice = true;
                    var paymentMethod = $('#payment_method_dropdown option:selected').val();

                    // Don't create invoice if payment is via wechat, since wechat is Stripe and will create Invoice via Zapier
                    if (paymentMethod === 'wechat-pay') {
                        createInvoice = false;
                    }

                    if (debug) {
                        console.log(`selectedProduct is ${selectedProduct}`);
                        console.log(selectedProduct);				
                        console.log(`productId is ${productId}`);
                        console.log('selected client is:');
                        console.log(selectedClient);
                        console.log('selected client email is:');
                        console.log(clientEmail);
                        console.log(`Payment method: ${paymentMethod}`);
                    }                    

                    // Get updated package price if specified
                    var newPrice = $('#updated_price').val() || false;
                    console.log('UPDATED PRICE: ', newPrice);

                    // Get deposit amount if specified
                    var depositAmount = $('#deposit_amount').val() || false;
                    if (depositAmount) {
                        depositAmount = parseFloat(depositAmount).toFixed(2);
                    }
                    console.log('DEPOSIT AMOUNT: ', depositAmount);
                    
                    // Check Xero invoice checkboxes to determine whether to create invoice / apply payment
                    var createInvoiceChecked = $('#create_invoice_checkbox').is(':checked');
                    var applyPaymentChecked = $('#apply_payment_checkbox').is(':checked');
                    if (debug) {
                        console.log(`createInvoiceChecked is ${createInvoiceChecked}`);
                        console.log(`applyPaymentChecked is ${applyPaymentChecked}`);
                    }

                    // Check Xero invoice checkboxes to determine whether to create invoice / apply payment
                    // Check checkboxes on last run of class series booking
                    if (createInvoice) {
                        var createInvoiceChecked = $('#create_invoice_checkbox').is(':checked');
                        var applyPaymentChecked = $('#apply_payment_checkbox').is(':checked');
                    } else {
                        var createInvoiceChecked = false
                        var applyPaymentChecked = false
                    }

                    // Additional params for XERO                    
                    var params = {
                        method: "POST",
                        paymentMethod: paymentMethod,
                        xeroCreateInvoice: createInvoiceChecked,
                        xeroApplyPayment: applyPaymentChecked,
                        productID: productId,
                        email: clientEmail,
                        newPrice,
                        depositAmount
                    };
                    break;
                default:
                    return 'Activity not defined';
                }
            break;
        case 'version':
        case 'pin':
            var params = {};
            break;
        default:
            console.log(`ERROR: Function not found: ${func}`);				
            return false;            
    }

    // Capture selected location from dropdown if it exists and parse down to location name to send to server
    // REST controller will use location data to determine which Xero tenant to activate among other things
    selectedLocation = $('#select_location_dropdown').val();
    if (debug) {
        console.log(`DEBUG: TYPE OF selectedLocation: ${typeof selectedLocation}`);
    }
    if ( typeof selectedLocation !== 'undefined' && selectedLocation !== 'location') {
        selectedLocation = selectedLocation.split(',')[0].trim();
        if (selectedLocation.includes('@')) {
            selectedLocation = selectedLocation.split('@')[1].trim().toLowerCase().replace(' ', '-');
        } else {
            selectedLocation = 'tai-seng';
        }
        console.log(`Selected location for API call params: ${selectedLocation}`);
        params.location = selectedLocation;
    }

    // Make API call
    try {		
        if (debug) {			
            writeMessage('debug', `<br><b>Starting API call: ${func}..</b>`);				
        }

        // Retrieve token from server if not defined
        if (!ddyToken) {
            try {
                ddyToken = await callAPI('ddytoken');
                console.log('Token retrieved');
            } catch (e) {
                console.error(`ERROR: Could not retrieve token: ${e.responseText}`);
                console.error(e);
            }
        }

        var funcToCall = func.split('_')[0];
        console.log(`Starting API call: ${func}`);
        console.log('Params:', params);
        return await callAPI(funcToCall, params, ddyToken);
    } catch(e) {
        console.log(`ERROR: Error returned from callAPI function: ${func}`);
        console.error(e);
        console.error(`Error response: ${e.responseText}`);
        return e;
    }
}

async function callAPI(func, params, ddyToken) {
    // set apiHost based on environment    
    var apiHost = eval(`apiHost${environment}`);

    // Set secure functions to prevent logging response to console
    var secureFuncs = ['pin', 'ddytoken'];

    // Loop through params and build API call URL	
    var url = `${apiHost}/${func}`;
    var count = 1;	
    $.each(params, (key, val) => {
        if (count === 1) {
            url += `?${key}=${val}`;
            count++;
        }
        else {
            url += `&${key}=${val}`;
        }			
    });
    
    // Replace any '+' symbols in URL with ASCII code and remove chinese characters
    url = url.replace(/\+/g, "%2B");
    url = url.replace(/[^\x00-\x7F]/g, "");

    if (debug) { 
        writeMessage('debug', `<br>STARTED CALL API FUNCTION<br>Function: ${func}<br>URL: ${url}`);
    }

    // Define loader div
    // var $loading = $('#loading');
    var $loading = $('#loader-div');

    // Set headers with auth
    const tokenString = `Basic ${ddyToken}`;
    var headers = {};
    headers.Authorization = tokenString;
    
    // AJAX GET call to ddyRestController
    // Refactor later (as in never) to send POST with JSON body - not sustainable as GET with long query string
    try {	
        let result = await $.ajax({
            method: "GET",
            crossDomain: true,
            xhrFields: { withCredentials: true },
            headers,
            url,
            datatype: 'json',            
            beforeSend: function(xhr) {
                $loading.show();                
            },
            success: function(response, status, xhr) {
                // Log result to console unless it is a secure function
                if (!secureFuncs.includes(func)) {
                    console.log(`API call response for function ${func}:`);
                    console.log(response);
                }

                if (debug) {
                    writeMessage('debug', `<br><b>API RESPONSE SUCCESSFUL</b><br>Function: ${func}`);                        
                    console.log('Status:');
                    console.log(status);
                    console.log('XHR:');
                    console.log(xhr);
                }
            },
            error: function(xhr, status, error) {
                console.log(`ERROR: API call error: ${func}`);
                console.error(error);
                if (debug) {
                    writeMessage('debug', `<br><b>API FAIL</b><br>Function: ${func}<br>XHR status: ${xhr.status}<br>XHR statusText: ${xhr.statusText}<br>XHR responseText: ${xhr.responseText}`);						
                }
            },
            complete: function(response) {
                $loading.hide();
                if (debug) {
                    writeMessage('debug', `<br><b>API CALL COMPLETE</b><br>Function: ${func}`);						
                }
            },
            timeout: 45000
        });
        return result;
    } catch (e) {
        console.log(`ERROR: Error detected in first level API call: ${func}`);
        console.error(e);
        console.error(`ERROR RESPONSE: ${e.responseText}`);
        return e;
    }
}

function populateDropdown($drop, data, func) {
    // Empty items from the dropdown
    $drop.empty();		
    
    // Populate dropdown with values from data array
    switch(func) {
        case 'clients':
            $.each(data, (i, val) => {
                $drop.append($('<option>').text(`${data[i].firstName} ${data[i].lastName}`).attr('value', `${data[i].firstName} ${data[i].lastName}`));
            });
            break;
        case 'products':
        case 'appointment-types':
            $.each(data, (i, val) => {
                var value = data[i].name;
                var engVal = $.trim(value.split('|')[1]) || value;					
                $drop.append($('<option>').text(engVal).attr('value', data[i].name));
            });				
            // Sort items in dropdown list
            $drop.html($('option', $drop).sort(function(x,y) {
                return $(x).text() > $(y).text() ? 1 : -1;
            }));
            break;		
        case 'certificates':
            $.each(data, (i, val) => {				
                    $drop.append($('<option>').text(`${data[i].name} Code: ${data[i].certificate}`).attr('value', data[i].certificate));
            });
            break;
        case 'classes':            
            $.each(data, (i, val) => {
                // Format date for dropdown display
                var options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour12: true, hour: 'numeric', minute: 'numeric' };
                var datePretty = new Date(data[i].time).toLocaleString('en-US', options);
                $drop.append($('<option>').text(`${data[i].name} - ${datePretty}`).attr('value', `${data[i].name}-${datePretty}`));
            });            
            break;
        case 'locations':
            $.each(data, (i, val) => {				
                    $drop.append($('<option>').text(data[i]).attr('value', data[i]));
            });
            break;
        default:
            console.error('ERROR: Unknown dropdown type');
    }
    if (func != 'clients') {
        // Prepend "Select One" to top of dropdown list and select top item
        $drop.prepend($('<option>').text('Select One').attr('value', 'Select One'));
        $drop.get(0).selectedIndex = 0;
    }
}

// FUNCTION: retrieveLocations()
// 1. Retrieve all Acuity calendars and filter for Location
// 2. Create array of unique location values
// 3. Populate Studio Location dropdown menu
async function retrieveLocations($revealedElements) {
    // Capture all calendars from Acuity
    var funcType = 'calendars_get';
    try {			
        var ddyCalendars = await initApiCall(funcType);
        console.log(`${funcType} result:`, ddyCalendars);
    }
    catch(e) {
        console.error(`ERROR: Error detected in initApiCall: ${funcType}`);
        console.error(e);
        var message = { title: 'ERROR', body: `An error occured with ${funcType}, please check and try again.<hr><strong>Error Message:</strong> ${e.responseText}` };
        writeMessage('modal', message);
        return false;
    }

    // Capture unique location values to array for dropdown
    var ddyLocations = [];
    $.each(ddyCalendars, (i, cal) => {
        ddyLocations.push(cal.location)
    });
    console.log(`DDY Locations (all):`, ddyLocations);
    
    // Filter for unique locations only and update text for display
    var ddyLocationsUnique = ddyLocations.filter((val, index, self) => self.indexOf(val) === index );
    $.each(ddyLocationsUnique, (i, loc) => {
        if (ddyLocationsUnique[i].includes('@')) {
            ddyLocationsUnique[i] = ddyLocationsUnique[i].replace('Dream Dance and Yoga', 'DDY');
        }
    });
    // Sort array by location in order
    ddyLocationsUnique.sort();
    
    // Find index of main studio in Tai Seng and place at top of array
    var ddyIndex = ddyLocationsUnique.findIndex(x => x.includes('Tai Seng'));
    var ddyVal = ddyLocationsUnique[ddyIndex];
    ddyLocationsUnique.splice(ddyIndex, 1);
    ddyLocationsUnique.unshift(ddyVal);
    
    console.log(`DDY Locations (unique):`, ddyLocationsUnique);

    // Populate Studio Locations dropdown
    var $dropdown = $('#select_location_dropdown');
    var func = "locations";
    populateDropdown($dropdown, ddyLocationsUnique, func);

    // Reveal locations dropdown
    $revealedElements = revealElement($('#select_location_div'), $revealedElements);
}

// FUNCTION: retrieveproductsClasses()
// 1. Retrieve products or appointments based on action and return to calling function
async function retrieveProductsClasses(action, products) {
    // Capture action from top page
    switch (action) {
        case 'buy_single_class_top':
        case 'book_private_class_top':
        case 'buy_class_top':
            var funcType = "appointment-types_get";
            break;
        case 'buy_package_top':
            var funcType = "products_get";
            break;
    }

    // If not populated already, retrieve products or appointments
    if (products.length === 0) {
        try {
            var products = await initApiCall(funcType);
            console.log(`${funcType} result:`, products);
            
            if (debug) {
                writeMessage('debug', `<br>Completed initApicall: ${funcType}`);				
            }
        }
        catch(e) {
            console.error(`ERROR: Error detected in initApiCall: ${funcType}`);
            console.error(e);        
            var message = { title: 'ERROR', body: `An error occured with ${funcType}, please check and try again.<hr><strong>Error Message:</strong> ${e.responseText}` };
            writeMessage('modal', message);
            return false;
        }
    } else {
        console.log('RETRIEVE PRODUCTS: Products array already populated');
    }

    return products;
}

// FUNCTION: filterProductsClasses()
// 1. Receive products or appointments array from calling function
// 2. Filter based on selected action (i.e. Packages/Memberships, Group Classes, Single Classes, etc)
// 3. Filter based on selected location
// 4. Reveal the next div in the user flow based on action
async function filterProductsClasses(action, location, products, $revealedElements) {
    // Filter products array based on selected action
    switch (action) {            
        case 'buy_single_class_top':
            // Filter classes result for SINGLE class types
            products = $(products).filter((i) => {
                return (products[i].type === 'class');
            });
            console.log('Result updated for single classes:', products);
            break;
        case 'book_private_class_top':
            // Filter classes result for SERVICE class types (by selecting type "service")    
            products = $(products).filter((i) => {
                return (products[i].type === 'service');
            });
            console.log('Result updated for private classes:', products);
            break;
        case 'buy_class_top':                
            // Filter classes result for SERIES class types and for series associated with a calender ID ONLY
            // This should be a way to return only ACTIVE class series, and discard anything inactive or from the past
            // Have not validated this logic with Acuity
            products = $(products).filter((i) => {
                return (products[i].type === 'series' && products[i].calendarIDs.length > 0);
            });
            console.log('Result updated for only ACTIVE class series:', products);
            break;
    }

    // Filter products array for selected location
    if (location === 'Dream Dance and Yoga') {
        products = $(products).filter((i) => {
            return (!products[i].name.includes('@'));
        });
    } else {
        products = $(products).filter((i) => {
            return (products[i].name.includes(location));
        });
    }
    console.log(`Products / classes array updated for ${location}:`, products);

    // Reveal appropriate div based on action selected
    if (action === 'view_student_package_top') {
        $revealedElements = revealElement($('#view_packages_submit'), $revealedElements);
    } else {
        $revealedElements = revealElement($('#select_package_class_div'), $revealedElements);
    }

return products;
}

// FUNCTION: retrieveUpcomingClasses()
// 1. Retrieve the list of classes available either for today or the selected date
// 2. Populate the appropriate dropdown with the list of classes
async function retrieveUpcomingClasses(action, $revealedElements) {
    switch (action) {
        case 'checkin_table_top':
            var funcType = 'availability--classes_get';
            var activity = 'getClassesByDate';
            // Get today's date for params to API call
            var classDate = new Date();
            // Format class date for display
            var datePretty = $.datepicker.formatDate('yy/mm/dd', classDate);
            var dropdownLabel = "Today's Classes: ";
            break;
        case 'pastDate':
            var funcType = 'availability--classes_get';
            var activity = 'getClassesByDate';            
            // Grab selected date from datepicker
            classDate = $('#checkin_datepicker').datepicker('getDate');
            // Format class date for display
            var datePretty = $.datepicker.formatDate('yy/mm/dd', classDate);
            var dropdownLabel = `Classes for ${datePretty}: `;
            break;
    }    
    console.log('Selected class date is: ', datePretty);

    // API call to retrieve today's classes
    try {
        var result = await initApiCall(funcType, activity, classDate);
        console.log(`${funcType} result:`, result);
        
        if (result === "No records returned") {
            var message = { title: 'ERROR', body: `No classes scheduled on ${datePretty}.  Please try another date!` };
            writeMessage('modal', message);
            // Reveal dropdown and enable button to generate table
            var $element = $('#generate_checkin_table_div');
            $revealedElements = revealElement($element, $revealedElements);
        } else {
            // Classes found - populate dropdown table with classes and update label text
            $('#upcoming_classes_dropdown_label').text(dropdownLabel);
            var $dropdown = $('#upcoming_classes_dropdown');
            var func = "classes";
            populateDropdown($dropdown, result, func);            
        }
    }
    catch(e) {
        console.log(`ERROR: Error detected in initApiCall: ${funcType}`);
        console.log(e);        
        var message = { title: 'ERROR', body: `Error while retrieving upcoming classes.  Please try again!<hr><strong>Error Message:</strong> ${e.responseText}` };
        writeMessage('modal', message);
    }
    
    // Reveal dropdown and enable button to generate table
    var $element = $('#generate_checkin_table_div');
    $revealedElements = revealElement($element, $revealedElements);
    $('#upcoming_classes_dropdown').focus();

    return result;
}

// FUNCTION: retrieveStudents()
// 1. Take a search query from form and make API call to Acuity to receive list of students
// 2. Populate the appropriate dropdown with the list of students returned
async function retrieveStudents(checkIn) {
    // Cache dropdown menu to populate
    var $dropdown = $('#search_student_dropdown');

    try {
        var funcType = "clients_search";			
        var result = await initApiCall(funcType);
        console.log(`${funcType} result:`);
        console.log(result);
        
        if (debug) {
            writeMessage('debug', `<br>Completed initApicall: ${funcType}`);				
        }

        // Check if any students were returned, otherwise display error modal or option to create new student
        if (result === "No records returned") {
            if (checkIn) {
                var message = { 
                    title: 'Student Not Found',
                    body: `<div class="center"><strong>Student not found!</strong></div>
                            <strong>NOTE:</strong> Use "Firstname Lastname" to search your name.<br>
                            If not found, please check with Dream Dance and Yoga staff to register.`
                };
            } else {
                var message = { 
                    title: 'Student Not Found',
                    body: `<div class="center"><strong>Student not found!</strong></div>
                            <strong>NOTE:</strong> Use "Firstname Lastname" to search students.<br>
                            Click the button below to create a new student.<br>
                            <div class="center margin10"><button type="button" id="add_new_student_modal"><strong>CREATE STUDENT</strong></button></div>`
                };
            }
            writeMessage('modal-cancel', message);
        } else {
            // If successful populate dropdown menu
            var func = "clients";
            populateDropdown($dropdown, result, func);
            return result;
        }
    
        // ADD EVENT TO CAPTURE NEW STUDENT BUTTON CLICK
        $('#add_new_student_modal').on('click', async (e) => {
            e.preventDefault();                
            if (debug) {
                writeMessage('debug', "<br><b>clicked ADD NEW STUDENT INSIDE MODAL button...</b>");
            }
            // Gather student info and kick off process to create new student
            gatherNewStudentInfo();        
        });
    }
    catch(e) {
        console.log(`ERROR: Error detected in initApiCall: ${funcType}`);
        console.error(e);
        writeMessage('modal', "<strong>An error occured, please check and try again</strong><hr><strong>Error Message:</strong> ${e.responseText}");
        clearDropdown($dropdown);
        return false;
    }		
}

// FUNCTION: gatherNewStudentInfo()
// 1. Display modal to gather information for new student
async function gatherNewStudentInfo() {
    // Gather new student information
    var message = {
        title: 'ADD NEW STUDENT',
        body: `<div id="add_new_student_div" class="margin sqsp-font">
                    <label for="student_first_name"><b>First Name: </b></label>
                    <input type="text" id="student_first_name" class="margin" placeholder="名" name="student_first_name" required>
                    <label for="student_last_name"><b>Last Name: </b></label>
                    <input type="text" id="student_last_name" class="margin" placeholder="姓" name="student_last_name" required>
                    <br>
                    <label for="student_phone"><b>Phone Number: </b></label>
                    <input type="text" id="student_phone" class="margin" placeholder="电话号码" name="student_phone" value="+65 " required>
                    <label for="student_email"><b>Email: </b></label>
                    <input type="email" id="student_email" class="margin" placeholder="电子邮箱" name="student_email" required>
                    <br>
                    <label for="select_language_dropdown" class="form-label">Preferred Language: </label>
                    <select id="select_language_dropdown" class="select_dropdown margin">
                        <option value="English">English</option>			
                        <option value="Chinese">Chinese</option>                        
                    </select>                    
                    <label for="select_english_level_dropdown" class="form-label">English Level: </label>
                    <select id="select_english_level_dropdown" class="select_dropdown margin">
                        <option value="None">None</option>
                        <option value="Basic">Basic</option>
                        <option value="Advanced">Advanced</option>
                    </select>
                    <div id="modal_error" class="margin10"></div>
                </div>`
    }
    writeMessage('modal-new-student', message);
    $('#student_first_name').focus();
}

// FUNCTION: addNewStudent()
// 1. Retrieve new student info from new student modal
// 2. Make POST call to Acuity API to add new student
async function addNewStudent() {
    // Capture student info from form values
    var firstName = $('#student_first_name').val() || false;
    var lastName = $('#student_last_name').val() || false;
    var phone = $('#student_phone').val() || false;
    var email = $('#student_email').val() || false;
    var language = $('#select_language_dropdown').val();
    var englishLevel = $('#select_english_level_dropdown').val();
    var notes = `Preferred language: ${language} English Level: ${englishLevel}`;

    try {
        var funcType = 'clients_add';
        var activity = 'addStudent';
        var params = {
            firstName,
            lastName,
            phone,
            email,
            notes
        }
        console.log('New student params: ', params);        
        
        var result = await initApiCall(funcType, activity, params);
        console.log(`${funcType} result:`, result);        
        
        if (debug) {
            writeMessage('debug', `<br>Completed initApicall: ${funcType}`);				
        }

        // Next, book any upcoming appointment and delete the appointment
        // In order for new student data to be pushed to Xero, Acuity requires an appointment to be booked        
        console.log('Booking/cancelling temporary class to trigger Xero contact synchronization...');
        var tempClassResult = await bookCancelTempClass(params);

        // If successful inform user
        if (tempClassResult) {
            var message = {
                title: 'Student Created!',
                body: `<strong>New student created successfully!</strong><br><br>
                        <strong>Name:</strong> ${firstName} ${lastName}<br>
                        <strong>Phone:</strong> ${phone}<br>
                        <strong>Email:</strong> ${email}<br>
                        <strong>Preferred Language:</strong> ${language}<br>
                        <strong>English Level:</strong> ${englishLevel}`
            };
            writeMessage('modal', message);
            return result;
        } else {
            throw 'ERROR CREATING NEW STUDENT - TEMP CLASS BOOKING ERROR!';
        }
    }
    catch(e) {
        console.log(`ERROR: Error detected in initApiCall: ${funcType}`);
        console.error(e);
        var message = { title: 'ERROR', body: `<strong>Error occured creating new student, please check and try again</strong><hr><strong>Error Message:</strong> ${e.responseText}` };
        writeMessage('modal', message);
        return false;
    }		
}

// FUNCTION: bookCancelTempClass()
// 1. Find the next available class
// 2. Book the class with the currently selected student
// 3. Cancel the same class
// 4. Return result to calling function
async function bookCancelTempClass(studentData) {
    // UPDATE: CHECK HERE IF STUDENT HAS EXISTING APPOINTMENTS, IF SO THEN DO NOT TRIGGER
    
    // Retrieve list of upcoming classes and select first class
    try {
        var classList = await findClassByDate(false);
    }
    catch(e) {        
        return false;
    }    

    // Once a class is found, book a temp appointment for selected student using the first class found
    // Store required parameters for appointment post API call                
    var firstName = studentData.firstName || studentData[0].firstName;
    var lastName = studentData.lastName || studentData[0].lastName;
    var email = studentData.email || studentData[0].email;
    var classId = classList[0].appointmentTypeID;
    var calendarID = classList[0].calendarID;
    var datetime = classList[0].time;
    var noEmail = true;
    var notes = 'TEST BOOKING FOR NEW STUDENT ADD';
    var certificate = 'DDYINSTRUCTOR';
    var params = {
        classId,
        datetime,
        firstName,
        lastName,
        email,
        certificate,
        calendarID,
        notes,
        noEmail
    };

    // Make API call to book temporary appointment and store temp appt ID for cancellation
    try {
    var bookApptResult = await bookAppointment(params);
    var apptIdToCancel = bookApptResult.id;
    }
    catch(e) {
        return false;
    }

    // Cancel the same appointment
    try {
        var cancelApptResult = await cancelAppointment(apptIdToCancel, noEmail);
    }
    catch(e) {
        return false;
    }

    return true;
}

// FUNCTION: findClassByDate()
// 1. Return all classes on a given date, if no date specified return classes for the current day
// 2. Return result to calling function
async function findClassByDate(date) {
    // Retrieve list of upcoming classes and select one
    var funcType = 'availability--classes_get';
    var activity = 'getClassesByDate';    
    var classDate = date || new Date();
    var classExists = false;

    // API call to retrieve class list for selected date, if no classes then try next day
    while (!classExists) {
        try {                
            var result = await initApiCall(funcType, activity, classDate);
            console.log(`${funcType} result:`, result);
            
            if (result === "No records returned") {
                console.log(`No classes detected on ${classDate}!  Trying next day...`);
                classDate.setDate(classDate.getDate() + 1);
                console.log(`NEW classDate is: ${classDate}`);
            } else {
                var classId = result[0].appointmentTypeID;
                classExists = true;
                console.log(`CLASS FOUND: ${result[0].name} on ${result[0].localeTime}, ID ${classId}`);
                return result;
            }
        }
        catch(e) {
            console.error(`Error caught retrieving classes on ${classDate}!\nError message: ${e.responseText}\nTrying next day...`);
            classDate.setDate(classDate.getDate() + 1);
            console.log(`NEW classDate is: ${classDate}`);
        }
    }
}

// FUNCTION: bookAppointment()
// 1. Collect details for appointment to book from calling function
// 2. Book appointment
// 3. Return result to calling function
async function bookAppointment(apptDetails) {
    // Make API call to book temporary appointment
    try {
        console.log('Booking temp appointment...');

        var funcType = 'appointments_post';
        var activity = 'addToClass';
        var appointmentsResult = await initApiCall(funcType, activity, apptDetails);
        console.log('AppointmentsResult is:', appointmentsResult);
        return appointmentsResult;
    }
    catch (e) {
        console.error(`ERROR: Error detected in initApiCall: ${funcType}`);        
        console.error(`Error response: ${e.responseText}`);
        console.error(e);
        return false;
    }
}

// FUNCTION: cancelAppointment()
// 1. Collect details for appointment to cancel from calling function
// 2. Cancel appointment
// 3. Return result to calling function
async function cancelAppointment(apptId, noEmail) {
    try {
        console.log(`Cancelling appointment id ${apptId}...`);
        
        var cancelNote = 'Temp appt cancel';
        var funcType = 'appointments_put';
        var activity = 'cancelAppointment';
        var params = {
            apptId,
            cancelNote,
            noEmail
        }                        
        
        var appointmentsResult = await initApiCall(funcType, activity, params);
        console.log('Cancel appointment result is:', appointmentsResult);
        return appointmentsResult;
    }
    catch (e) {
        console.error(`ERROR: Error cancelling appointment!`);
        console.error(`Error response: ${e.responseText}`);
        console.error(e);
        return false;
    }
}

// FUNCTION: confirmPaymentDetails()
// 1. Gather all details for upcoming payment
// 2. Present details to user for confirmation
function confirmPaymentDetails(event, products, $revealedElements, $submitButtonElement, submitButtonText) {
    // Initialize var to determine whether to enable submit button
    var revealSubmit = false;
    var enableSubmit = true;
    
    // Populate confirmation details
    var $confirmElement = $('#confirm_details_div');
    var studentName = $('#search_student_dropdown option:selected').text();
    var studioLocation = $('#select_location_dropdown').val();
    var productName = $('#select_package_class_dropdown option:selected').text();
    var paymentMethod = $('#payment_method_dropdown option:selected').text();
    var paymentMethodVal = $('#payment_method_dropdown').val();
    var updatedPrice = $('#updated_price').val() || false;
    var depositAmount = $('#deposit_amount').val() || 'FULLY PAID';
    var amountDue = 0;
    var soldBy = $('#employee_commission_dropdown').val();
    // Set sold by value to none if no person is selected
    if (soldBy === 'select') { soldBy = 'None'; }

    // If payment method is not NONE (free) and employee is not selected, disable submit button
    if (soldBy === 'None' && paymentMethodVal !== 'none') {
        enableSubmit = false;
    }

    // If studio location is not selected, disable submit button
    if (studioLocation === 'Select One') {
        enableSubmit = false;
    }

    // Reveal submit button as long as both Payment Method and Employee Commission have values, or when payment method is none
    if (paymentMethodVal !== 'select' && soldBy !== 'None') {
        revealSubmit = true;
    } else if (paymentMethodVal === 'none') {
        revealSubmit = true;
    }
    
    // Find the array index of the selected product / package and extract price
    var selectedProductVal = $('#select_package_class_dropdown').val();
    var selectedProduct = $.grep(products, (i) => {
        return i.name === selectedProductVal;
    });
    console.log(`Confirm payment details selected product: `, selectedProduct);

    // Set updated price if exists and format price var
    var priceExists = false;
    if (selectedProduct.length > 0) {
        var price = updatedPrice || selectedProduct[0].price;
        price = parseFloat(price).toFixed(2);
        priceExists = true;
    } else {
        var price = 'No product selected';
        enableSubmit = false;
    }

    if (priceExists && depositAmount !== 'FULLY PAID') {
        depositAmount = parseFloat(depositAmount).toFixed(2);

        // Check if deposit amount is more than the total price
        if (parseFloat(price) > 0 && parseFloat(depositAmount) >= parseFloat(price)) {
            var message = { title: 'ERROR', body: "<strong>Deposit is more than the total price. Please reduce deposit amount.</strong>" };
            writeMessage('modal', message);
            enableSubmit = false;
        } else {
            // Calculate amount due
            amountDue = price - depositAmount;
            amountDue = parseFloat(amountDue).toFixed(2);
            // Set deposit amount for display
            depositAmount = `$${depositAmount}`;
        }
        
        // Format price string for display
        price = `$${parseFloat(price).toFixed(2)}`;
    }

    var confirmDetails = `<div class="center confirm-title"><strong>CONFIRM DETAILS</strong></div>
                            <strong>Student Name:</strong> ${studentName}<br>
                            <strong>Studio Location:</strong> ${studioLocation}<br>
                            <strong>Package / Class:</strong> ${productName}<br>
                            <strong>Payment Method:</strong> ${paymentMethod}<br>
                            <strong>Price:</strong> ${price}<br>
                            <strong>Deposit:</strong> ${depositAmount}<br>
                            <font color="red"><strong>Amount Due:</strong> $${amountDue}</font><br>
                            <strong>Sold By:</strong> ${soldBy}<br><br>
                            <div class="confirm-final"><strong>SINGAPORE #1 CONFIRM?</strong></div>`;
    $confirmElement.html(confirmDetails);
    
    // Reveal CONFIRM DETAILS container when final element is changed (EMPLOYEE COMMISSION), unless payment option is not selected
    if (paymentMethodVal === 'none' || event === 'employee_commission_dropdown' && paymentMethodVal !== 'select') {
        $revealedElements = revealElement($confirmElement, $revealedElements);
    }

    // Enable or disable submit button
    if (enableSubmit) {
        $submitButtonElement.prop('disabled', false).removeClass('disabled').val(submitButtonText);
    } else{
        $submitButtonElement.prop('disabled', true).addClass('disabled');
    }

    // Reveal submit button
    if (revealSubmit) {
        $revealedElements = revealElement($submitButtonElement, $revealedElements);
    }
    
    return enableSubmit;
}

// FUNCTION: weChatPay()
// 1. Create a Stripe client and source charge via Stripe API
// 2. If successful generate QR code for client to scan, otherwise handle error
// 3. Wait for webhook indicating QR code has been scanned (payment authorized) and complete charge via DDY API call to Stripe API
// 4. Return Stripe charge result to calling function
function weChatPay(action, selectedProduct, selectedClient, newPrice) {
    // Create a Stripe client
    if (environment === 'UAT') {
        // Load TEST public key
        var stripe = Stripe('pk_test_BLvdPHkTidmTseJ1AYyTJgJw');
    } else {
        // Load LIVE public key
        var stripe = Stripe('pk_live_CMB25yauNZEeA66zhsGmCUE8');
    }

    // Set price
    var stripePrice = newPrice || selectedProduct[0].price;
    var stripePriceFloat = parseFloat(stripePrice) * 100;
    console.log('Stripe price is: ', stripePriceFloat);

    // Create a Stripe payment source for WeChat pay
    stripe.createSource({
        type: 'wechat',
        amount: stripePriceFloat,
        currency: 'sgd',
        statement_descriptor: selectedProduct[0].name,
        owner: {
            name: `${selectedClient[0].firstName} ${selectedClient[0].lastName}`,
            email: selectedClient[0].email
        },
    }).then((result) => {
        // handle result.error or result.source
        console.log('Stripe create payment result:');
        console.log(result);
        
        // If successful then open wechat QR code in modal
        if (result) {            
            // Store Stripe source vars
            var weChatQRCodeURL = result.source.wechat.qr_code_url;
            var sourceId = result.source.id;
            var clientSecret = result.source.client_secret;
            var stripeAmount = (parseFloat(result.source.amount) / 100).toFixed(2);
            var stripeCurrency = (result.source.currency).toUpperCase();
            var stripePrice = `${stripeCurrency} $${stripeAmount}`;

            // Poll source status here until it becomes chargeable
            var MAX_POLL_COUNT = 300;
            var pollCount = 0;

            // Bring up modal with details of purchase and WeChat QR Code            
            var message = { 
                title: `WECHAT PAY - PLEASE SCAN QR CODE`,
                body: `<div id="qrcode-modal-title" class="qrcode-container center"><h3>WeChat Pay Amount: <strong>${stripePrice}</h3>DO NOT REFRESH THIS PAGE UNTIL PAYMENT IS MADE!<br>Please make payment within ${MAX_POLL_COUNT} seconds</strong></div>
                        <div id="qrcode-modal-output" class="center"></div>
                        <div id="qrcode-modal-timer" class="qrcode-container center"><h3><strong>${MAX_POLL_COUNT}</strong> seconds...</h3></div>`,
                qrCodeURL: weChatQRCodeURL
            };
            writeMessage('modal-qrcode', message);

            // Capture QR Code timer element to update timer
            var $qrcodeModalTimerElement = $('#qrcode-modal-timer');

            // Gather parameters for Stripe poll
            var stripePollParams = {
                action,
                stripe,
                stripePrice,
                MAX_POLL_COUNT,
                pollCount,
                sourceId,
                clientSecret,
                $qrcodeModalTimerElement,
                selectedProduct,
                selectedClient
            }
            
            // Call polling function to check Stripe source until payment is made
            stripePollForSourceStatus(stripePollParams);
        }
    });
    // console.log(`Stripe POLLING COMPLETE - sourceResult is: ${sourceResult}`);
}

// FUNCTION: stripePollForSourceStatus()
// 1. Poll the Stripe API for the Stripe payment just made to get source status
// 2. Once source status is chargeable, initiate Stripe charge via API or handle error
// function stripePollForSourceStatus(action, stripe, stripePrice, MAX_POLL_COUNT, pollCount, sourceId, clientSecret, $qrcodeTitleElement) {
function stripePollForSourceStatus(stripePollParams) {
    // Retrieve required poll vars
    var stripe = stripePollParams.stripe;
    var sourceId = stripePollParams.sourceId;
    var clientSecret = stripePollParams.clientSecret;
    var stripePrice = stripePollParams.stripePrice;
    var MAX_POLL_COUNT = stripePollParams.MAX_POLL_COUNT;
    var pollCount = stripePollParams.pollCount;
    var $qrcodeModalTimerElement = stripePollParams.$qrcodeModalTimerElement;

    console.log(`Polling Stripe for result of source charge, timeout ${MAX_POLL_COUNT} seconds...`);

    // Make call to Stripe API to retrieve status of source transation just created
    try {
        stripe.retrieveSource({id: sourceId, client_secret: clientSecret}).then(async (result) => {
            var source = result.source;
            var sourceStatus = source.status;

            // Charge customer or keep polling based on status of the Stripe source object
            switch (sourceStatus) {
                case 'chargeable':
                case 'consumed':
                    // Charge has been authorized, proceed with purchase
                    // Assumes the server receives the charges webhook and processes the charge
                    console.log(`Stripe charge ${sourceId} is CHARGEABLE`);
                    console.log(`Source status is ${source.status}`);

                    // Update timer element with result
                    $qrcodeModalTimerElement.html(`<h3><strong>PAYMENT AUTHORIZED!</strong><br>`);
                    
                    // Trigger buyPackage / buySeries as required with appropriate params
                    // Determine if package or class series purchase and invoke appropriate function, return result
                    var action = stripePollParams.action;
                    var selectedProduct = stripePollParams.selectedProduct;
                    var selectedClient = stripePollParams.selectedClient;
                    console.log(`READY TO MAKE PURCHASE!  ACTION IS: ${action}`);
                    console.log(`Selected product:`, selectedProduct);                
                    console.log(`Selected client:`, selectedClient);

                    switch (action) {        
                        case 'buy_class_top':
                            var buySeriesResult = await buySeries(selectedProduct, selectedClient);
                            console.log(`BUY CLASS SERIES RESULT:`, buySeriesResult);                        
                            break;
                        case 'buy_package_top':
                            var buyPackageResult = await buyPackage(selectedProduct, selectedClient);
                            console.log(`BUY PACKAGE RESULT:`, buyPackageResult);
                            return buyPackageResult;
                            break;
                    }

                    return source.status;                    
                    break;
                case 'pending':
                    if (pollCount < MAX_POLL_COUNT) {
                        console.log(`Try ${pollCount}: Stripe charge ${sourceId} still pending...`);
                        console.log(`Source status is ${source.status}`);
                        
                        // Update pollCount and qrcode HTML element timer
                        pollCount += 1;
                        newTimer = MAX_POLL_COUNT - pollCount;
                        
                        $qrcodeModalTimerElement.html(`<h3><strong>${newTimer}</strong> seconds...</strong></h3>`);
                                    
                        // Gather params and try again in a second, if the Source is still `pending`
                        stripePollParams = {
                            action: stripePollParams.action,
                            stripe,
                            stripePrice,
                            MAX_POLL_COUNT,
                            pollCount,
                            sourceId,
                            clientSecret,
                            $qrcodeModalTimerElement,
                            selectedProduct: stripePollParams.selectedProduct,
                            selectedClient: stripePollParams.selectedClient
                        }

                        // If status is still pending, poll again after timeout of 1 second
                        setTimeout(() => { stripePollForSourceStatus(stripePollParams); }, 1000);

                        return source.status;
                    } else {
                        // Timer has run out - inform customer payment has timed out
                        // Note WeChat payment can technically still be made within an hour if QR code is saved,
                        // but package purchase will not progress if user navigates away from page
                        console.log(`WeChat Pay timeout!  Source status is ${source.status}`);

                        // Update timer element with result
                        $qrcodeModalTimerElement.html(`<h3><strong>PAYMENT TIMED OUT!<br>
                                                        Source status: ${source.status}<br>
                                                        Please confirm payment was made!</strong></h3></h3>`);

                        // MANUALLY CANCEL SOURCE HERE VIA STRIPE.JS IF POSSIBLE
                        // Which I don't think it is...
                        
                        return source.status;
                    }
                    break;
                case 'failed':
                    // If the payment isn't authorized, show customer the relevant message
                    console.log(`Source status is ${source.status}`);

                    // Update timer element with result
                    $qrcodeModalTimerElement.html(`<h3><strong>PAYMENT CANCELLED!<br>
                                                    Source status: ${source.status}</strong>`);

                    return source.status;
                    break;
                default:
                    // Unknown source status - inform customer payment has failed
                    console.log(`Source status is ${source.status}`);

                    // Update timer element with result
                    $qrcodeModalTimerElement.html(`<strong>UNKNOWN ERROR!<br>
                                                    Source status: ${source.status}<br>
                                                    Please confirm payment was made!</strong>`);                    

                    return source.status;
                    break;
            }
        });
    }
    catch(e) {
        console.error(`ERROR: Error detected in Stripe retrieveSource call`);
        console.error(e);
        var message = { title: 'ERROR', body: `An error occured with Stripe API call: ${e.message}<br>Please check and try again.<hr><strong>Error Message:</strong> ${e.responseText}` };
        writeMessage('modal', message);
        return false;
    }
}

// FUNCTION: initPurchase()
// 1. Get details of purchase to determine whether package or class series
// 2. Extract payment method and redirect as required
// 3. Call appropriate function to continue purchase (package or class series)
// 4. If purchase successful, add student note to record DDY employee commission (if applicable)
async function initPurchase(action, products, clients) {
    try {			
        // Find the array index of the selected product / package or class series
        var selectedProductVal = $('#select_package_class_dropdown').val();
        var selectedProduct = $.grep(products, (i) => {
            return i.name === selectedProductVal;
        });
        var price = selectedProduct[0].price;
        console.log('Selected Product: ', selectedProduct);

        // Capture selected client from clients array
        var selectedClientVal = $('#search_student_dropdown').val();
        var selectedClient = $.grep(clients, (i) => {
            return `${i.firstName} ${i.lastName}` === selectedClientVal;
        });
        console.log('selectedClient is: ', selectedClient);

        // Get updated package price if specified
        var newPrice = $('#updated_price').val() || false;

        // Capture payment method from dropdown menu
        var paymentMethod = $('#payment_method_dropdown option:selected').val();
        console.log(`paymentMethod: ${paymentMethod}`);
        
        // If customer wants to pay with credit card online or wechat, redirect as appropriate        
        switch (paymentMethod) {
            case 'cc-online':
                // Prepare Acuity direct purchase link URL
                
                // Grab teacher name from dropdown to store employee name for commission - will put this in the certificate field
                // This data will be scraped from the order page later to record for teacher commission using Zapier (when I get around to it)
                var soldBy = $('#employee_commission_dropdown option:selected').text();
                soldBy = soldBy.replace(/\s+/g,'-').toUpperCase();
                
                switch (action) {
                    case 'buy_class_top':
                        var productURL = selectedProduct[0].schedulingUrl;
                        productURL += `&firstName=${selectedClient[0].firstName}&lastName=${selectedClient[0].lastName}&email=${selectedClient[0].email}&phone=${selectedClient[0].phone}&certificate=${soldBy}-CLS`;
                        break;
                    case 'buy_package_top':
                        var productID = selectedProduct[0].id;
                        var productURL = `https://app.acuityscheduling.com/catalog.php?owner=15731779&action=addCart&clear=1&id=${productID}&firstName=${selectedClient[0].firstName}&lastName=${selectedClient[0].lastName}&email=${selectedClient[0].email}&phone=${selectedClient[0].phone}&certificate=${soldBy}-PRD`;
                        break;
                }
                
                // Replace any '+' symbols in URL with ASCII code
                productURL = productURL.replace(/\+/g, "%2B");
                
                // Open new tab with Acuity direct purchase link                
                var win = window.open(productURL, '_blank');
                return false;
                break;
            case 'wechat-pay':
                // Do wechat stuff
                console.log('Paying via WeChat Pay...');
                
                // If package purchase then check if subscription - otherwise initiate weChat Pay charge
                if (action === 'buy_package_top') {
                    var productExpiry = selectedProduct[0].expires;
                    if (productExpiry == null) {
                        var message = { title: 'ERROR', body: '<strong>Memberships / subscriptions can only be bought via CREDIT or DEBIT CARD.</strong><br>Please select <strong>"Credit/Debit Card"</strong> payment method and use a valid card.' };
                        writeMessage('modal', message);
                        return false;
                    }
                }

                // Only trigger wechat pay if price is > 0 otherwise stripe will return an error
                var pricePaid = newPrice || price;
                if (pricePaid > 0) {
                    var weChatPayResult = await weChatPay(action, selectedProduct, selectedClient, newPrice);
                    console.log(`weChatPayResult: ${weChatPayResult}`);

                    // Return false back to calling function as WeChat payment needs to be authorized before package purchase will continue
                    return false;
                }
                else {
                    break;
                }
        }
    }
    catch(e) {
        console.error(`ERROR: Error detected in initPurchase: ${e.message}`);
        console.error(e);
        var message = { title: 'ERROR', body: `An error occured with initPurchase, please check and try again.<hr><strong>Error Message:</strong> ${e.responseText}` };
        writeMessage('modal', message);
        return false;
    }

    // Determine if package or class series purchase and invoke appropriate function, return result
    switch (action) {        
        case 'buy_class_top':
            var purchaseResult = await buySeries(selectedProduct, selectedClient);            
            break;
        case 'buy_package_top':
            var purchaseResult = await buyPackage(selectedProduct, selectedClient);            
            break;
    }

    return purchaseResult;
}

// FUNCTION: employeeCommissionNotes(selectedProduct, selectedClient)
// 1. Capture student notes
// 2. Build and append commission note with DDY employee and details of product sold
// 3. Append commission message to student notes (for display / processing later)
async function employeeCommissionNotes(selectedProduct, selectedClient) {
    // For all purchases except CC (done via Zapier) - update student notes with DDY employee commission details in Acuity
    // If purchase made via Acuity / Stripe - to be done only upon successful purchase via zapier

    // Capture relevant details    
    var productName = selectedProduct[0].name;    
    var price = selectedProduct[0].price;
    var updatedPrice = $('#updated_price').val() || price;
    var soldBy = $('#employee_commission_dropdown option:selected').text();

    // Return if product price is 0
    if (parseFloat(updatedPrice) === 0) {
        console.log(`Product price is 0, not recording commission`);
        return false;
    }

    // Capture student notes and details
    var firstName = selectedClient[0].firstName;
    var lastName = selectedClient[0].lastName;
    var phone = selectedClient[0].phone;
    var studentNotes = selectedClient[0].notes;
    
    // Convert line breaks to ASCII code
    studentNotes = studentNotes.replace(/(?:\r\n|\r|\n)/g, "%0A");
    console.log(`Notes with converted LB for ${firstName} ${lastName}: `, studentNotes);

    // Build DDY employee commission note
    var options = { year: 'numeric', month: 'short', day: '2-digit', hour12: false, hour: 'numeric', minute: 'numeric' };
    var timestamp = new Date().toLocaleString('en-US', options);
    var commissionNote = `%0A${timestamp}~${productName}~sold by ${soldBy}~$${updatedPrice}`;
    studentNotes += commissionNote;
    console.log(`FULL commission note with history: ${studentNotes}`);
    
    // Update student notes with commission detail
    var params = { 
        firstName,
        lastName,
        phone,
        notes: studentNotes
    }
    var funcType = 'clients_update';
    var activity = 'addClientNotes';
    
    // Make API call to update student notes
    try {
        var clientUpdateResult = await initApiCall(funcType, activity, params);
        console.log('COMMISSION: Commission notes update result:', clientUpdateResult);
        return true;
    }
    catch (e) {
        console.error(`ERROR: Error detected in enmployeeCommissionNotes: ${funcType}`);        
        console.error('COMMISSION: Commission notes update error:', clientUpdateResult);
        console.error(`Error response: ${e.responseText}`);
        console.error(e);
        return false;
    }
}

// FUNCTION: buyPackage(selectedProduct, selectedClient)
// 1. Generate a package certificate and assign to user's email address
// 2. Generate a Xero invoice for the package price (if requested)
// 3. Apply full payment to Xero invoice based on payment method selected (if requested)
async function buyPackage(selectedProduct, selectedClient) {
    try {
        console.log('BUY PACKAGE - Selected Product is:', selectedProduct);
        // Check if product is a package or a subscription, if subscription then payment method must be CC
        var productExpiry = selectedProduct[0].expires;
        if (productExpiry == null) {
            var message = { title: 'ERROR', body: '<strong>Memberships / subscriptions can only be bought via CREDIT or DEBIT CARD.</strong><br>Please select <strong>"Credit/Debit Card"</strong> payment method and use a valid card.' };
            writeMessage('modal', message);
            return false;
        }

        // Before creating certificate, book and cancel temp appt for student to ensure Xero details are up to date
        // In order for new student data to be pushed to Xero, Acuity requires an appointment to be booked
        // UPDATE: ONLY DO THIS IF IT IS A NEW STUDENT OTHERWISE SKIP (TAKES TOO MUCH TIME)
        console.log('Booking/cancelling temporary class to trigger Xero contact synchronization...');
        var tempClassResult = await bookCancelTempClass(selectedClient);

        if (tempClassResult) {
            // If package then buy package
            var funcType = 'certificates_create';
            var activity = 'createCertificate';
            var params = [ selectedProduct, selectedClient ];        
            var result = await initApiCall(funcType, activity, params);
            console.log('buyPackage result:');
            console.log(result);

            // If successful, call function to update student notes to record DDY employee commission details
            var commissionResult = await employeeCommissionNotes(selectedProduct, selectedClient);
            
            // Successful - display details in modal window        
            var commissionResultString = 'NONE';
            if (commissionResult) {
                var soldBy = $('#employee_commission_dropdown option:selected').text();
                commissionResultString = `Sold by ${soldBy}`;
            }

            var xeroInvoiceResult = result.xeroInvoiceStatus;
            var xeroInvoiceStatusMessage = result.xeroInvoiceStatusMessage;
            var xeroInvoiceStatusString = result.xeroInvoiceStatusString;
            var xeroPaymentResult = result.xeroPaymentStatus;
            var xeroPaymentStatusMessage = result.xeroPaymentStatusMessage || "XERO: Payment not applied";
            if (debug) {				
                writeMessage('debug', `<br>Xero Invoice Status: ${xeroInvoiceResult}`);
                writeMessage('debug', `<br>Xero Invoice Status String: ${xeroInvoiceStatusString}`);
                writeMessage('debug', `<br>Xero Payment Status: ${xeroPaymentResult}`);
            }
            var paymentMethod = $('#payment_method_dropdown').find(':selected').text();
            var clientName = `${selectedClient[0].firstName} ${selectedClient[0].lastName}`;
            var clientEmail = selectedClient[0].email;
            var message = { 
                title: 'PURCHASE SUCCESS',
                body: `<b>Student Name:</b> ${clientName}<br>
                        <b>Email:</b> ${clientEmail}<br>
                        <b>Code:</b> ${result.certificate}<br>
                        <b>Payment Method:</b> ${paymentMethod}<br>
                        <b>Commission:</b> ${commissionResultString}<br>
                        <strong>Xero Results</strong><br>
                        ${xeroInvoiceStatusMessage}<br>
                        ${xeroPaymentStatusMessage}<hr>
                        <strong>Inform student to use email address to book classes</strong>`
            };
            writeMessage('modal', message);
            return result;
        } else {
            throw 'ERROR IN BUY PACKAGE - TEMP CLASS BOOKING ERROR';
        }
    }
    catch(e) {
        console.error(`ERROR: Error detected in initApiCall: ${funcType}`);
        console.error(e);
        var message = { title: 'ERROR', body: `An error occured with ${funcType}, please check and try again.<hr><strong>Error Message:</strong> ${e.responseText}` };
        writeMessage('modal', message);
        return false;        
    }
}

// FUNCTION: buyClass() **** IN DEVELOPMENT ****
// 1. Purchase and register for a single class
// 2. Create Xero invoice for class (if requested)
// 3. Apply full payment to Xero invoice based on payment method selected (if requested)
async function buyClass() {
    // Retrieve next XX instances of selected class
    try {
        var funcType = "availability--classes_get";
        var classTimes = await initApiCall(funcType);
    }
    catch (e) {
        console.log(`ERROR: Error detected in initApiCall: ${funcType}`);
        console.log (e);
        var message = { title: 'ERROR', body: `An error occured retrieving class times, please check and try again` };
        writeMessage('modal', message);
        return false;
    }

    // Find the array index of the selected product / package and extract expiry date to determine if package or subscription
    var selectedProductVal = $('#select_package_class_dropdown').val();
    var selectedProduct = $.grep(products, (i) => {
        return i.name === selectedProductVal;
    });				
    futureClasses = 10;
    
    // Populate dropdown with first 10 classes in classTime array and ask user to select class to register
    // POST appointments call to add user to class
    // Move xero invoice create code block to a separate function and invoke
}

// FUNCTION: buySeries(selectedProduct, selectedClient) NEW ****
// 1. Register for all classes in a class series
// 2. Generate a *single* invoice in Xero for all classes in the series for the class series price
// 3. Apply full payment to the Xero invoice based on the payment method selected
async function buySeries(selectedClass, selectedClient) {
    try {
        // Get all class times, once we have them loop through each and book
        var funcType = "availability--classes_get";
        var activity = 'classSeries';
        var params = selectedClass;
        // GO CHANGE classSeries ACTIVITY to pass selectedProduct!!!!
        var classTimes = await initApiCall(funcType, activity, params);
        
        // (FUTURE) Display confirmation dialog and progress if confirmed
        // var message = { title: 'BUY A CLASS SERIES', body: `About to buy class series:<br>${JSON.stringify(classTimes, undefined, 2)}<br>Confirm?`};
        // writeMessage('modal', message);
        
        try {
            var bookClass = [];
            var funcType = "appointments_post";
            var activity = 'addToClassSeries';
            var params = [ classTimes, selectedClient, false ];
            var paymentMethod = $('#payment_method_dropdown option:selected').val();

            for (var i = 0; i < classTimes.length; i++) {
                $('#buy_class_submit').data('classTime', classTimes[i].time);
                
                // If reached last class in series, set createInvoice to true
                // Since WeChat payments are via Stripe, invoices are already created automatically via Zapier                
                if (i === classTimes.length-1 && paymentMethod !== 'wechat-pay') { params[2] = true; }
                
                bookClass[i] = await initApiCall(funcType, activity, params);
                console.log(`Booked class ${i}:`);
                console.log(bookClass[i]);
            }
            
            // Store results of acuity and Xero API calls
            result = bookClass[classTimes.length-1];
            var xeroInvoiceResult = result.xeroInvoiceStatus;
            var xeroInvoiceStatusMessage = result.xeroInvoiceStatusMessage;
            var xeroInvoiceStatusString = result.xeroInvoiceStatusString;
            var xeroPaymentResult = result.xeroPaymentStatus;
            var xeroPaymentStatusMessage = result.xeroPaymentStatusMessage || "XERO: Payment not applied";
            if (debug) {				
                writeMessage('debug', `<br>Xero Invoice Status: ${xeroInvoiceResult}`);
                writeMessage('debug', `<br>Xero Invoice Status String: ${xeroInvoiceStatusString}`);
                writeMessage('debug', `<br>Xero Payment Status: ${xeroPaymentResult}`);
            }
            var paymentMethod = $('#payment_method_dropdown').find(':selected').text();

            // Store client name
            var clientName = `${selectedClient[0].firstName} ${selectedClient[0].lastName}`;
            
            // Store first class date and time
            var options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour12: true, hour: 'numeric', minute: 'numeric' };
            var firstClassDatePretty = new Date(bookClass[0].datetime).toLocaleString('en-US', options);
            
            // Write message that class series is booked
            var message = {
                title: 'BOOKING SUCCESS',
                body: `<strong>Student Name:</strong> ${clientName}<br>
                        <strong>Class:</strong> ${bookClass[0].type}<br>
                        <strong>First Class:</strong> ${firstClassDatePretty}<br>
                        <strong># of Classes:</strong> ${bookClass.length}<br>
                        <strong>Payment Method:</strong> ${paymentMethod}<hr>
                        <strong>Xero Results</strong><br>
                        ${xeroInvoiceStatusMessage}<br>${xeroPaymentStatusMessage}`
            };				
            writeMessage('modal', message);
            return bookClass;
        }
        catch(e) {
            console.log(`ERROR: Error detected in initApiCall: ${funcType}`);
            console.log (e);
            var message = { title: 'ERROR', body: `An error occured booking class, please check and try again.<hr><strong>Error Message:</strong> ${e.responseText}` };
            writeMessage('modal', message);
            return false;
        }
    }
    catch(e) {
        console.log(`ERROR: Error detected in initApiCall: ${funcType}`);
        console.log (e);
        var message = { title: 'ERROR', body: `An error occured retrieving class times (perhaps class started in the past), please check and try again.<hr><strong>Error Message:</strong> ${e.responseText}` };
        writeMessage('modal', message);
        return false;
    }		
}

async function retrieveCertificates(clients) {
    try {
        var funcType = "certificates_get";
        var activity = "retrieveCertificates"
        var params = clients;
        result = await initApiCall('certificates_get', activity, params);
        if (result === "No records returned") {
            console.log('No certificates found');
            
            // Clear delete codes dropdown - LATER?
            // var $dropdown = $('#select_code_del');
            // clearDropdown($dropdown);
        }
        return result;
        
        // If successful populate dropdown menu for deletion - LATER?
        // var $dropdown = $('#select_code_del');
        // var func = "certificates";
        // populateDropdown($dropdown, certificates, func);
        // Enable DELETE CODE button - LATER
        // $('#delete_code').prop('disabled', false);
    }
    catch(e) {
        console.error(`ERROR: Error detected in initApiCall: ${funcType}`);
        console.error (e);
        console.error(`ERROR: An error occured retrieving certificate codes.<hr><strong>Error Message:</strong> ${e.responseText}`);
        return false;
    }		
}

// FUNCTION: retrieveAppointments()
// 1. Receive the list of classes scheduled on the day selected
// 2. Retrieve all appointments for the class selected in the dropdown menu
async function retrieveAppointments(upcoming_classes, classDate, selected_class_index) {
    // If datepicker date is selected store date, otherwise get classes for today		
    // var classDate = $('#checkin_datepicker').datepicker('getDate');    
    if (!classDate) { classDate = new Date() }
    console.log('Selected class date is: ', classDate);
    
    // API call to get list of students (for next / selected class)
    try {
        // Retrieve selected class and send to API call function        
        var classId = upcoming_classes[selected_class_index].appointmentTypeID;

        // Make API call
        var funcType = 'appointments_get';
        var activity = 'getApptsForClass';
        var params = [ classId, classDate ];
        var appointmentsResult = await initApiCall(funcType, activity, params);
        console.log('appointmentsResult is:', appointmentsResult);
        
        // Filter appointmentsResult for only the selected class
        var selectedClassDatetime = upcoming_classes[selected_class_index].time;			
        if (debug) {
            console.log('SelectedClassDatetime is:', selectedClassDatetime);
            console.log('Upcoming classes datetime:', upcoming_classes[selected_class_index].time);
        }
        var selectedAppointments = $(appointmentsResult).filter((i) => {
            return appointmentsResult[i].datetime === selectedClassDatetime;
        });
        console.log('selectedAppointments is:', selectedAppointments);
        console.log('# of appointments: ', selectedAppointments.length);

        if (selectedAppointments.length < 1) {
            console.log('No students scheduled');
            return 'None';
        }
        
        return selectedAppointments;
    }
    catch(e) {
        console.log(`ERROR: Error detected in initApiCall: ${funcType}`);
        console.log (e);
        var message = { title: 'ERROR', body: `An error occured retrieving student list, please check and try again.<hr><strong>Error Message:</strong> ${e.responseText}`};
        writeMessage('modal', message);
        return false;
    }
}

// FUNCTION: generateInstructorReport()
// 1. Retrieve all clients and parse notes field to generate commission report
// 2. Retrieve list of appointments for the selected month
// 3. Iterate through list an filter for instructor appointments only
// 4. Add instructor appointments to an object with relevant stats
// 5. Display instructor report for user
// 6. Provide option to generate a pay run in Xero
async function generateInstructorReport(reportMonth, $revealedElements) {
    // Get first and last day of report month
    var minDate = new Date(reportMonth.getFullYear(), reportMonth.getMonth(), 1);
    var maxDate = new Date(reportMonth.getFullYear(), reportMonth.getMonth() + 1, 0);
    var maxDateNext = new Date(reportMonth.getFullYear(), reportMonth.getMonth() + 1);
    console.log(`minDate: ${minDate}, maxDate: ${maxDate}, maxDateNext: ${maxDateNext}`);

    // EMPLOYEE COMMISSION
    // Retrieve all clients from Acuity and gather student notes to determine commission
    var funcType = 'clients_search';
    var activity = 'retrieveAllClients';
    var clientsResult = await initApiCall(funcType, activity);

    // Read NOTES field and search for line to indicate commissions (sold by) in selected month
    var employeeCommissionDetails = [];
    var count = 0;
    $.each(clientsResult, (i, client) => {
        var clientNotes = client.notes;
        var clientFirstName = client.firstName;
        var clientLastName = client.lastName;
        // Move to next client if notes field is empty or doesn't include any commission related info
        if (clientNotes.length === 0) { return true }
        if (!clientNotes.includes('sold by')) { return true }

        // Capture each line in notes field and parse to capture required commission info
        var notesByLine = clientNotes.split('\n');
        for (var i=0; i < notesByLine.length; i++) {
            // Return if line does not include commission related info            
            if (!notesByLine[i].includes('sold by')) { continue; }
            
            // Capture commission date and remove Chinese characters if any
            var timeSold = notesByLine[i].split('~')[0];
            timeSold = timeSold.replace(/[^\x00-\x7F]/g, "");
            var timeSoldDate = new Date(timeSold);
            
            // Store commission details if entry is within date range, otherwise move on
            if (timeSoldDate >= minDate && timeSoldDate <= maxDateNext) {
                var options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
                var timeSoldDatePretty = timeSoldDate.toLocaleString('en-US', options);
                var clientName = `${clientFirstName} ${clientLastName}`;
                var productSold = notesByLine[i].split('~')[1].trim();
                var employeeNameTemp = notesByLine[i].split('sold by')[1];
                var employeeName = employeeNameTemp.split('~')[0].trim();
                var productPrice = notesByLine[i].split('$')[1];
                                
                console.log(`${clientFirstName} ${clientLastName} notes line ${i}: ${notesByLine[i]}`);                
                console.log(`Package sold details: ${productSold} by ${employeeName} for $${productPrice} at ${timeSoldDate}`);

                // Add commission details to object
                employeeCommissionDetails[count] = {
                    employeeName,
                    clientName,
                    date: timeSoldDatePretty,
                    product: productSold,
                    price: productPrice,
                    match: false
                };
                count++;
            } else {
                console.log(`Commission for ${clientFirstName} ${clientLastName} sold on ${timeSoldDate}: Not in range of mindate ${minDate} and maxdate ${maxDateNext}, skipping...`);
            }            
        }        
    });

    console.log(`Employee commission details:`, employeeCommissionDetails);
    
    // DDY INSTRUCTOR CLASS COUNT
    // Retrieve appointments for selected month
    var func = 'appointments_get';
    var activity = 'getApptsByDateRange';
    var params = [minDate, maxDate];
    appointmentsResult = await initApiCall(func, activity, params);
    console.log('Instructor report appointments result:', appointmentsResult);
    
    // Rollup appointments array by class and notes    
    var apptsByType = d3.nest().key(function(i) {
        return `${i.type} ${i.datetime}`;
    }).entries(appointmentsResult);
    console.log('Appointments by Class Type: ', apptsByType);

    // Filter out ONLINE classes from array as they do not have any instructor check-in
    var apptsByType = $(apptsByType).filter((i) => {
        return (!apptsByType[i].key.includes('ONLINE'));
    });
    console.log('Appointments by type updated to exclude ONLINE classes:', apptsByType);

    // Loop through data and store instructor info
    var instructorData = [];
    var instructorCounts = {};
    var instructorCheckinNote = 'INSTRUCTOR CHECK-IN';

    // Iterate through ALL appointments and prepare for display in table
    $.each(apptsByType, (i, className) => {
        className['hasInstructor'] = false;
        var classType = className.values[0].type;
        var engClassType = $.trim(classType.split('|')[1]) || classType;
        var date = className.values[0].datetime;
        var classDate = new Date(date);
        
        // Format class date for display
        var options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour12: true, hour: 'numeric', minute: 'numeric' };
        var datePretty = classDate.toLocaleString('en-US', options);

        // Push data to array, class names and times and placeholder for check-in time
        className['class'] = engClassType;
        className['instructor'] = 'NO CHECK IN';
        className['date'] = datePretty;
        className['checkInTime'] = '';
        className['lateCheckIn'] = false;

        // If PRIVATE or GROUP CLASS then capture class duration and move on (no instructor check-in yet)
        // Assume that if class exists, teacher has checked in and should be paid
        if (engClassType.includes('Private')) {
            var teacherName = className.values[0].calendar;
            var classDuration = parseInt(className.values[0].duration);
            
            // Populate instructor value since check-in is assumed for private classes
            className['instructor'] = teacherName;

            // Update class name with student name for Private Classes
            var studentName = `${className.values[0].firstName} ${className.values[0].lastName}`;
            className['class'] = `${engClassType} - ${studentName}`;
            
            // Add class duration to instructor counts
            if (!instructorCounts.hasOwnProperty(teacherName)) {
                instructorCounts[teacherName] = {};
                instructorCounts[teacherName][engClassType] = classDuration;
            } else if (!instructorCounts[teacherName].hasOwnProperty(engClassType)) {
                instructorCounts[teacherName][engClassType] = classDuration;
            } else {
                instructorCounts[teacherName][engClassType] += classDuration;
            }
            return true;
        }

        $.each(className.values, (i2, apptDetails) => {
            // Check notes field in Acuity to determine if instructor has checked in or not
            var notes = apptDetails.notes;
            
            if (notes.includes(instructorCheckinNote)) {
                // Gather required data to store
                var name = `${apptDetails.firstName} ${apptDetails.lastName}`;
                var checkInTime = notes.split(/: /)[0];
                checkInTime = checkInTime.replace(/[^\x00-\x7F]/g, "");
                var checkInTimeDate = new Date(checkInTime);                

                // Format check-in time for display
                var options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour12: true, hour: 'numeric', minute: 'numeric' };
                var checkInTimeDatePretty = checkInTimeDate.toLocaleString('en-US', options);
                
                // On-time check-in is considered to be XX min before the class starts, so set expected check-in time
                const MIN_EARLY = 14;
                const MS_PER_MIN = 60000;
                var classCheckInTime = new Date(classDate - (MIN_EARLY * MS_PER_MIN));

                // Compare check-in time to class time to determine if check-in was on time or late
                var lateCheckIn = false;
                if (checkInTimeDate >= classCheckInTime) {
                    lateCheckIn = true;
                }

                // Push data to object
                className['hasInstructor'] = true;
                className['instructor'] = name;
                className['checkInTime'] = checkInTimeDatePretty;
                className['lateCheckIn'] = lateCheckIn;
    
                // Initialize and increment class counter object and late check-ins for instructors
                if (!instructorCounts.hasOwnProperty(name)) {
                    instructorCounts[name] = {};
                    instructorCounts[name][engClassType] = 1;
                } else {
                    if (!instructorCounts[name].hasOwnProperty(engClassType)) {
                        instructorCounts[name][engClassType] = 1;
                    } else {
                        instructorCounts[name][engClassType]++;
                    }
                }

                // Check for late check-ins
                if (!instructorCounts[name].hasOwnProperty('LATE')) {
                    if (className['lateCheckIn'] === true) {
                        instructorCounts[name]['LATE'] = 1;
                    } else {
                        instructorCounts[name]['LATE'] = 0;
                    }
                } else {
                    if (className['lateCheckIn'] === true) {
                        instructorCounts[name]['LATE']++;
                    }
                }
            }
        });

        // Create instructor data object and push to array
        var data = {
            name,
            class: engClassType,
            date
        }
        instructorData.push(data);
    });
    console.log('Instructor data: ', instructorData);
    console.log('Instructor counts: ', instructorCounts);
    console.log('Appointments by Class Type with teacher names and check-in data: ', apptsByType);

    // Iterate through object and output report
    var selectedMonthVal = $('#instructor_report_datepicker').val();
    var msg = `<h3 class="center"><b>INSTRUCTOR REPORT for ${selectedMonthVal}</h3></b><hr>`;

    // Iterate through instructorCounts array and prepare message to display instructor report summary on screen
    $.each(instructorCounts, (name, className) => {
        var lateCount = 0;
        var bellyCount = 0;
        var yogaCount = 0;
        var privateDuration = 0;
        
        // Populate arrays with strings to capture class names for categorization
        var danceClassStr = ['Dance', 'dance', 'Ballet', 'ballet'];
        var yogaClassStr = ['Yoga', 'yoga'];
        var privateClassStr = ['Private', 'private'];

        msg += `<center><b>${name}</b></center>`;
        $.each(className, (className1, count) => {
            if (className1 === 'LATE') {
                lateCount = count;
                return true;
            }
            // Match the class name with a string in a class array to increment counter for techers
            if (privateClassStr.some(substring => className1.includes(substring))) {
                privateDuration += count;
                msg += `${className1} x ${count / 60} hour(s)<br>`;
            } else if (danceClassStr.some(substring => className1.includes(substring))) {
                bellyCount = bellyCount + count;
                msg += `${className1} x ${count}<br>`;
            } else if (yogaClassStr.some(substring => className1.includes(substring))) {
                yogaCount = yogaCount + count;
                msg += `${className1} x ${count}<br>`;
            }
        });
        
        // Display totals
        msg += `<strong>TOTAL DANCE:</strong> ${bellyCount}<br>`;
        msg += `<strong>TOTAL YOGA:</strong> ${yogaCount}<br>`;
        msg += `<strong>TOTAL PRIVATE:</strong> ${privateDuration / 60} hour(s)<br>`;
        
        // Calculate and display commissions
        msg += `<strong>COMMISSION: </strong>`;
        var commissions = false;
        var commissionMsgTemp = '';
        var commissionCount = 0;
        // Iterate through commissions array and display line if match to teacher name
        for (var i=0; i < employeeCommissionDetails.length; i++) {
            if (employeeCommissionDetails[i].employeeName === name) {
                let num = commissionCount + 1;
                commissionMsgTemp += `&nbsp&nbsp&nbsp${num}) ${employeeCommissionDetails[i].date}: ${employeeCommissionDetails[i].product} @ $${employeeCommissionDetails[i].price} - ${employeeCommissionDetails[i].clientName}<br>`
                commissions = true;
                employeeCommissionDetails[i].match = true;
                commissionCount++;
            }
        }

        if (!commissions) {
            msg += 'None<br>';
        } else {
            msg += `${commissionCount}<br>${commissionMsgTemp}`;
        }

        msg += `<font color="red"><strong>LATE:</strong> ${lateCount}</font><br><hr>`;
    });

    console.log(`Employee commission details AFTER message iteration: `, employeeCommissionDetails);

    // Add additional commission lines if applicable
    var addlCommissionTempMsg = '<center><strong>Additional Sales - No Commission</strong></center>';
    var noCommissionTempMsg = '<center><strong>Unmatched Commissions</strong></center>';
    var addlCommission = false;
    var noCommission = false;
    for (var i=0; i < employeeCommissionDetails.length; i++) {
        if (!employeeCommissionDetails[i].match) {
            var employeeName = employeeCommissionDetails[i].employeeName;
            if (employeeName === 'N/A' || employeeName === 'Select One') {
                // Unmatched commissions
                noCommissionTempMsg += `${employeeCommissionDetails[i].date}: ${employeeCommissionDetails[i].product} @ $${employeeCommissionDetails[i].price} - ${employeeCommissionDetails[i].clientName}<br>`
                noCommission = true;
            } else {
                // Commissions for non-teachers
                addlCommissionTempMsg += `<strong>${employeeCommissionDetails[i].employeeName}</strong> - ${employeeCommissionDetails[i].date}: ${employeeCommissionDetails[i].product} @ $${employeeCommissionDetails[i].price} - ${employeeCommissionDetails[i].clientName}<br>`
                addlCommission = true;
            }
        }
    }
    if (addlCommission) { msg += `${addlCommissionTempMsg}<hr>`; }
    if (noCommission) { msg += `${noCommissionTempMsg}<hr>`; }
    console.log(msg);
    
    // Build details table
    var instructorReportDetailsTable = $('#instructor_report_details_table').DataTable({
        "data": apptsByType,
        "pageLength": 50,            
        "order": [[4, 'asc']],
        "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
        dom: 'lfrtipB',
        buttons: [{ extend: 'excel', text: '<strong>Export to Excel</strong>'}],
        destroy: true,
        columnDefs: [
            { targets: 4, type: "date"},
            { targets: 2, visible: false },            
            { targets: 0, width: "5%" },
            
            // Apply new class to Name column if no check-in
            { targets: 0,
                createdCell: function(td, cellData, rowData, col) {
                    switch (cellData) {
                        case 'NO CHECK IN':
                            $(td).addClass('instructor-table-no-checkin');
                            break;
                        default:
                            $(td).addClass('instructor-table-checkedin');
                            break;
                    }
                }
            },
            
            // Apply new class to check-in column if LATE check-in
            { targets: 1,
                createdCell: function(td, cellData, rowData, col) {
                    if (rowData['lateCheckIn']) {
                        $(td).addClass('instructor-table-no-checkin');
                    } else {
                        $(td).addClass('instructor-table-checkedin');
                    }
                }
            }
        ],
        "columns": [
            { "data": "instructor"},
            { "data": "checkInTime"},
            { "data": "lateCheckIn"},
            { "data": "class"},
            { "data": "date"}
        ]
    });

    // Reveal instructor report div and display report
    var $element = $('#instructor_report_container_div');
    $revealedElements = revealElement($element, $revealedElements);    

    var $element = $('#instructor_report_display_div');
    $element.html(msg);
    
    return appointmentsResult;
}

// FUNCTION: buildStudioMetricsCharts(fromDate, toDate)
// 1. Retrieve list of appointments for the selected date range
// 2. Retrieve the relevant appointment and appointment type data
// 3. Build relevant charts for display
async function buildStudioMetricsCharts(fromDate, toDate) {
    // Get appointment data for selected date range
    // Get first and last day of report month
    var minDate = fromDate;
    var maxDate = toDate;
    console.log(`minDate: ${minDate}, maxDate: ${maxDate}`);

    // Retrieve appointments for selected month
    var funcType = 'appointments_get';
    var activity = 'getApptsByDateRange';
    var params = [minDate, maxDate];
    try {
        var appointmentsResult = await initApiCall(funcType, activity, params);
        console.log('Appointments result:', appointmentsResult);

        if (appointmentsResult === "No records returned") {
            var message = { title: 'ERROR', body: `No appointments on ${minDate} - ${maxDate}.  Please try another date!<hr><strong>Error Message:</strong> ${e.responseText}` };
            writeMessage('modal', message);
            return false;
        } else {
            // If successful, filter results array to remove DDY instructors
            var appointmentsResult = $(appointmentsResult).filter((i) => {
                return (appointmentsResult[i].certificate != 'DDYINSTRUCTOR');
            });
            console.log('Appointments result updated to exclude DDY instructors:', appointmentsResult);
        }
    }
    catch(e) {
        console.error(`ERROR: Error detected in initApiCall: ${funcType}`);
        console.error(e);
        if (e.statusText === 'timeout') {
            var message = { title: 'ERROR', body: `TIMEOUT retrieving appointments for ${minDate} - ${maxDate}.  Please select a shorter date range.<hr><strong>Error Message:</strong> ${e.statusText}` };
        } else {
            var message = { title: 'ERROR', body: `Error caught retrieving appointments for ${minDate} - ${maxDate}.<hr><strong>Error Message:</strong> ${e.responseText}` };
        }
        writeMessage('modal', message);
        return false;
    }

    // CHART #1: APPOINTMENTS BY DATE
    // Parse appointments result using D3.JS grouping functions to group by day / week / month
    var apptsByDayCounts = d3.nest().key(function(i) {
        // return i.date;
        var apptDate = new Date(i.date);
        // var apptMonthYear = $.datepicker.formatDate('MM yy', apptDate);
        var apptMonth = $.datepicker.formatDate('M', apptDate);
        var apptWeek = $.datepicker.iso8601Week(apptDate);
        return `${apptMonth} Week ${apptWeek}`;
    }).rollup(function(i) {
        return i.length;
    }).entries(appointmentsResult);
    console.log('apptsByDayCounts: ', apptsByDayCounts);

    var apptsByCert = d3.nest().key(function(i) {
        var apptDate = new Date(i.date);
        var apptMonth = $.datepicker.formatDate('M', apptDate);
        var apptWeek = $.datepicker.iso8601Week(apptDate);
        return `${apptMonth} Week ${apptWeek}`;
    }).key(function(i) {
        if (i.certificate === 'CLASSPASS') {
            return i.certificate
        } else {
            return 'DDY'
        }        
    }).rollup(function(i) {
        return i.length;        
    }).entries(appointmentsResult);
    console.log('apptsByCert: ', apptsByCert);

    // Push cert values to 2-dimensional array and reverse order for chronological chart display
    var apptsByCertCP = [];
    var apptsByCertDDY = [];
    $.each(apptsByCert, (i, val) => {        
        $.each(val.values, (i2, certType) => {            
            if (certType.key === 'CLASSPASS') {
                apptsByCertCP.push([val.key, certType.value]);
            } else {
                apptsByCertDDY.push([val.key, certType.value]);
            }
        });        
    });    
    apptsByCertCP.reverse();
    apptsByCertDDY.reverse();
    console.log('appts by cert CP: ', apptsByCertCP);
    console.log('appts by cert DDY: ', apptsByCertDDY);

    // Push total appt values to 2-dimensional array and reverse order for chronological chart display
    var appointmentsByDay = [];    
    $.each(apptsByDayCounts, (i, val) => {			
        appointmentsByDay.push([val.key, val.value]);        
    });    
    appointmentsByDay.reverse();    
    console.log('appts by day: ', appointmentsByDay);
    // CHART #1 END

    // CHART #2: AVERAGE CLASS FULL PERCENTAGE
    // Retrieve available classes for date range
    var funcType = 'availability--classes_get';
    var activity = 'getClassesByDate';
    var params = [minDate, maxDate];
    try {
        availClassesResult = await initApiCall(funcType, activity, params);
        console.log('Classes availability result:', availClassesResult);
        
        if (availClassesResult === "No records returned") {
            var message = { title: 'ERROR', body: `No classes scheduled on ${minDate} - ${maxDate}.  Please try another date!` };
            writeMessage('modal', message);
            return false;    
        }
    }
    catch(e) {
        console.log(`ERROR: Error detected in initApiCall: ${funcType}`);
        console.log (e);
        var message = { title: 'ERROR', body: `Error caught retrieving classes on ${minDate} - ${maxDate}.<hr><strong>Error Message:</strong> ${e.responseText}` };
        writeMessage('modal', message);
        return false;
    }

    // Filter available classes result to exclude online classes
    var availClassesResult = $(availClassesResult).filter((i) => {
        return (availClassesResult[i].category != 'LIVE STREAM - Online Classes');
    });
    console.log('Classes availability result with ONLINE classes removed:', availClassesResult);

    // Parse and rollup appointments array by class day and certificate for class availability chart
    var weekday = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
    $.each(appointmentsResult, (i, val) => {
        // Create value for day of week + class name + time
        var engClassName = val.type.split('|')[1] || val.type;
        engClassName = engClassName.trim();
        var classTime = val.datetime.split('T')[1].split('+')[0];
        var classDateText = val.datetime.split('T')[0];
        var classDate = new Date(classDateText);
        var classDay = weekday[classDate.getDay()];
        val.dayOfWeek = `${engClassName} - ${classDay} ${classTime}`;
        
        // Create value for certificate type
        var cert = val.certificate || '';
        if (cert.includes('TRIAL')) { cert = "TRIALCLASS"; }
        switch (cert) {
            case 'CLASSPASS':
                val.certType = 'CLASSPASS';
                break;
            case 'FIRSTCLASSFREE':
            case 'TRIALCLASS':
                val.certType = 'FREE TRIAL';
                break;
            case '':
                val.certType = 'SINGLE CLASS';
                break;
            default:
                val.certType = 'DDY MEMBER';
                break;
        }        
    });
    console.log('NEW appts result: ', appointmentsResult);

    // Rollup appointments array by day of week to generate cert type numbers
    var appointmentsGrouped = d3.nest().key(function(i) {
        return i.dayOfWeek;
    }).key(function(i2) {
        return i2.certType;
    }).rollup(function(i2) { return {
        count: i2.length,        
        };
    }).object(appointmentsResult);
    console.log('Appointments GROUPED: ', appointmentsGrouped);

    // Parse and rollup appointments availability    
    $.each(availClassesResult, (i, val) => {
        var engClassName = val.name.split('|')[1] || val.name;
        engClassName = engClassName.trim();            
        var classTime = val.time.split('T')[1].split('+')[0];
        var classDateText = val.time.split('T')[0];
        var classDate = new Date(classDateText);
        var classDay = weekday[classDate.getDay()];
        val.dayOfWeek = `${engClassName} - ${classDay} ${classTime}`;
    });
    console.log('NEW class avail: ', availClassesResult);

    // Rollup class availabilty by day of week and time in order to calculate average class size
    var classAvailGrouped = d3.nest().key(function(i) {
        return i.dayOfWeek;
    }).rollup(function(i2) { return {
        count: i2.length,
        totalSlots: d3.sum(i2, function(i) { return i.slots; }),
        totalSlotsAvail: d3.sum(i2, function(i) { return i.slotsAvailable; }),
        };
    }).object(availClassesResult);

    // Calculate average class full size from grouped array    
    $.each(classAvailGrouped, (i, val) => {        
        classAvailGrouped[i].avgPctFullByCert = {};
        $.each(appointmentsGrouped[i], (i2, val2) => {            
            // val[i2] = (val2.count / val.totalSlots) * 100;
            val.avgPctFullByCert[i2] = (val2.count / val.totalSlots) * 100;
        });        
        val.avgPercentFull = ((val.totalSlots - val.totalSlotsAvail) / val.totalSlots) * 100;        
    });
    console.log('Class avail grouped: ', classAvailGrouped);

    // Push data points to 2-dimensional array for charting
    // var classesFull = [];
    // $.each(classAvailGrouped, (i, val) => {
        // classesFull.push([i, val.avgPercentFull]);
    // });

    // Push data points for all certs to nested 2-dimensional array of objects for highcharts
    var classFullByCert = [];
    $.each(classAvailGrouped, (i, val) => {
        $.each(val.avgPctFullByCert, (i2, val2) => {
            if (!classFullByCert.some(obj => obj.name === i2)) {
                // Object with cert type doesn't exist yet, create object and empty data array
                classFullByCert.push({name: i2, data: []});
            }
            // Find index of cert type and push class full data to array
            // Also push total class full percentage to sort by total later
            index = classFullByCert.findIndex(obj => obj.name === i2);            
            classFullByCert[index].data.push([i, val2, val.avgPercentFull]);            
        });
    });
    console.log('Class full BY CERT: ', classFullByCert);

    // Sort array by class full percentage for chart display
    // classesFull.sort(function(a, b) {
        // return b[1] - a[1];
    // }); 
    // console.log('Classes full: ', classesFull);

    // Sort classes full by cert array by array at index 0 for chart display
    // Looks at 3rd position of array, which contains the total pct full for each type of class
    // This will only sort for the cert types present in the first cert, which is typically DDY MEMBER
    classFullByCert[0].data.sort(function(a, b) {        
        return b[2] - a[2];
    });
    console.log('Class full BY CERT SORTED: ', classFullByCert);
    
    // Calculate average percent full for average line
    totalAppts = appointmentsResult.length;

    // Rollup class availabilty by day of week and time in order to calculate average class size
    var totalSlots = d3.nest().rollup(function(i) { return {        
        slots: d3.sum(i, function(i) { return i.slots; }),
        };
    }).object(availClassesResult);

    var totalPctFull = ((totalAppts / totalSlots.slots) * 100).toFixed(1);

    console.log('total appts: ', totalAppts);
    console.log('total slots: ', totalSlots.slots);
    console.log(`Avg percent avail: ${totalPctFull}%`);

    // CHART #2 END

    // CHART #3: APPOINTMENTS BOOKED BY DDY MEMBERS
    // Parse appointments result using D3.JS grouping functions
    // Filter appointments result out to only count appointment booked by DDY members
    var apptsByStudentCounts = d3.nest().key(function(i) {
        if (i.certType === 'DDY MEMBER') {
            return `${i.firstName} ${i.lastName}`;
        } else { 
            return 'Non-member';
        }
    }).rollup(function(i) {
        return i.length;
    }).entries(appointmentsResult);
    
    // Filter out NON-MEMBER appointsments from student counts array
    apptsByStudentCounts = $(apptsByStudentCounts).filter((i) => {
        return (apptsByStudentCounts[i].key != 'Non-member');
    });
    console.log('apptsByStudentCounts for DDY members ONLY: ', apptsByStudentCounts);

    // Push values to 2-dimensional array and sort from top to bottom
    var appointmentsByStudent = [];    
    $.each(apptsByStudentCounts, (i, val) => {			
        appointmentsByStudent.push([val.key, val.value]);        
    });    
    appointmentsByStudent.sort(function(a, b) {
        return b[1] - a[1];
    });    

    // Reduce to top XX students only
    var numOfStudents = 150;
    appointmentsByStudent.length = numOfStudents;
    console.log('Appts by student sorted and reduced: ', appointmentsByStudent);
    // CHART #3 END

    // Build appointments chart
    var apptsChart = Highcharts.chart('metrics_data_chart_1', {
        chart: {
            type: 'line'
        },
        title: {
            text: 'How many appointments are booked each week and what is the trend?'
        },        
        xAxis: {            
            type: 'category',
            title: {
                text: 'Date'
            }
        },
        yAxis: {
            title: {
                text: '# of Appointments'
            }
        },
        series: [{
            name: 'TOTAL Appointments',
            data: appointmentsByDay,
            lineWidth: 3,
            color: 'maroon'
        }, {
            name: 'DDY Appointments',
            data: apptsByCertDDY,
            dashStyle: 'dash'
        }, {       
            name: 'ClassPass Appointments',
            data: apptsByCertCP,
            dashStyle: 'dash'
        }],
        credits: false
    });

    // Add moving average to appointments chart
    var series = apptsChart.series[0];
    var data = [];
    var period = 3;
    var sumForAverage = 0;
    var i;
    for(i=0; i<series.data.length; i++) {
        sumForAverage += series.data[i].y;
        if (i < period) {
            data.push(null);
        } else {
            sumForAverage -= series.data[i-period].y;
            data.push([series.data[i].x, sumForAverage/period]);
        }
    }
    apptsChart.addSeries({
        name: 'Moving Average',
        data: data,
        type: 'spline',
        color: '#adadad',
        marker: {
            enabled: false
        }
    });

    // Build % full chart
    var percentClassFullChart = Highcharts.chart('metrics_data_chart_2', {
        chart: {
            type: 'bar',
            height: 900,
        },
        title: {
            text: 'How full are my classes?'
        },        
        xAxis: {            
            labels: {
                step: 1
            },
            type: 'category',
            title: {
                text: 'Classes'
            }
        },
        yAxis: {
            labels: {
                formatter: function() {
                    return `${this.value}%`;
                }
            },
            title: {
                text: '% Full'
            },
            plotLines: [{
                color: 'red',
                value: totalPctFull,
                width: '2',
                dashStyle: 'LongDash',
                label: {
                    text: `AVERAGE: ${totalPctFull}%`,                    
                    textAlign: 'left',
                    rotation: 0,
                    style: {
                        fontWeight: 'bold',
                        color: 'red'
                    }
                },
                zIndex: 99
            }]
        },
        plotOptions: {
            series: {
                stacking: 'normal'
            }
        },
        series: classFullByCert,
        tooltip: {
            valueDecimals: 1,
            valueSuffix: '%'
        },
        credits: false
    });

    // Build appointments by student chart
    var apptsChart = Highcharts.chart('metrics_data_chart_3', {
        chart: {
            type: 'bar',
            height: 2800
        },
        title: {
            text: 'Which students book the most appointments?'
        },        
        xAxis: {            
            type: 'category',
            title: {
                text: 'Date'
            }
        },
        yAxis: {
            title: {
                text: '# of Appointments'
            }
        },
        series: [{
            name: '# of Appointments',
            data: appointmentsByStudent
        }],
        credits: false
    });

    return appointmentsResult;
}

function revealElement($elementId, $revealedElements) {
    // Reveal container or button and store ID in array for cleanup later        
    $elementId.show('drop');
    $revealedElements.push($elementId);
    // $elementId.removeClass('hide');
    
    return $revealedElements
}

function cleanUp($revealedElements) {
    // Clean up errors, existing buttons, containers, messages, etc
    console.log('Cleaning up revealed elements...');

    writeMessage('error', "");
    // Loop through each item in revealed elements and re-hide				
    $.each($revealedElements, (i, $element) => {			
        $element.hide();
        // $element.addClass('hide');
    });
    
    // Reset revealed elements
    $revealedElements = [];

    // Reset dropdown and checkboxes
    $('#payment_method_dropdown').val('select');
    $('#employee_commission_dropdown').val('select');
    $('#create_invoice_checkbox').prop('checked', true);
    $('#apply_payment_checkbox').prop('checked', true);

    return $revealedElements;
}

function clearDropdown($drop) {
    // Empty dropdown menu if it exists	
    $drop.empty();
    $drop.append($('<option>').text('Select One').attr('value', 'Select One'));
}

function writeMessage(type, msg, $output) {    
    switch (type) {
        case 'error':
            var $output = $('#error_message');                
            break;
        case 'debug':
            var $output = $('#debug_output');
            break;
        case 'modal':        
            var modalButtons = [{
                text: "OK",
                icon: "ui-icon-check",
                class: "modal-output",
                click: () => { $modalDialog.dialog('close'); }
            }];                    
            break;
        case 'modal-cancel':
        case 'modal-qrcode':
            var modalButtons = [{
                text: "Cancel",
                icon: "ui-icon-closethick",
                class: "modal-output",
                click: () => { $modalDialog.dialog('close'); }
            }];
            break;
        case 'modal-close-window':
            var modalButtons = [{
                text: "Close Window",
                icon: "ui-icon-closethick",
                class: "modal-output",
                click: () => { window.close(); }
            }];
            break;
        case 'modal-new-student':
            var modalButtons = [{
                text: "ADD NEW STUDENT",
                icon: "ui-icon-plus",
                class: "modal-output",
                click: () => { 
                    var firstName = $('#student_first_name').val() || false;
                    var lastName = $('#student_last_name').val() || false;
                    var phone = $('#student_phone').val() || false;
                    var email = $('#student_email').val() || false;
                    var emailValid = validateEmail(email);
                    
                    // Validate fields are completed correctly
                    if (!firstName || !lastName || !phone || !email) {
                        $('#modal_error').html('<h3 class="center"><strong>Please complete all fields!</strong></h3>');
                    } else if (!emailValid) {
                        $('#modal_error').html('<h3 class="center"><strong>Please enter a valid e-mail address!</strong></h3>');
                    } else {
                        $('#modal_error').html('');
                        addNewStudent();
                        $modalDialog.dialog('close');
                    }
                }
            }];
            break;
    }

    // Clear or append to message
    if (type.includes('modal')) {
        // Build modal options
        var modalOptions = {
            modal: true,
            classes: { 
                "ui-dialog": "modal-output",
                "ui-dialog-content": "modal-output",
                "ui-dialog-titlebar": "modal-output",
                "ui-dialog-title": "modal-output",
                "ui-dialog-titlebar-close": "modal-output",
                "ui-dialog-buttons": "modal-output",
                "ui-dialog-buttonpane": "modal-output",
                "ui-dialog-buttonset": "modal-output"
            },
            title: msg.title,
            width: msg.width || 'auto',
            height: msg.height || 'auto',            
            buttons: modalButtons
        }
        // Populate modal
        var $output = $('#modal_output');
        $output.html(msg.body);
        var $modalDialog = $output.dialog(modalOptions);
        
        if (type === 'modal-qrcode') {
            // Print QR Code in modal            
            var $qrcodeOutput = $('#qrcode-modal-output');
            var qrCodeURL = msg.qrCodeURL;
            // debug
            console.log('PRINTING QRCODE IN MODAL: ', qrCodeURL);
            $qrcodeOutput.qrcode(qrCodeURL);
        }
    } else {
        var message = "";
        if (msg !== "") {
            // Set message
            message = $output.html();
            message += msg;
        }
        $output.html(message);
    }
    return $modalDialog;
}

// FUNCTION: validateEmail()
// 1) Take email address as input
// 2) Return whether email is valid or not
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// FUNCTION: populateDDYInfo()
// 1) Retrieve certificates
// 2) Iterate through and store info on memberships, etc
// 3) Populate the DDY information div with relevant info
async function populateDDYInfo() {
    try {
        // Retrieve all certificates
        var funcType = "certificates_get";
        var activity = "retrieveAllCertificates"	
        var allCerts = await initApiCall(funcType, activity);
        console.log('All certificates: ', allCerts);
        
        // Initialize vars to hold DDY info numbers
        var validCerts = 0;
        var expiredCerts = 0;
        var goldMembers = 0;
        var silverBelly = 0;
        var silverYoga = 0;
        var packageYoga8 = 0;
        var packageYoga16 = 0;
        var packageBelly8 = 0;
        var packageBelly16 = 0;
        var otherCerts = [];
        var today = new Date();

        // Iterate through all certificates to determine member type
        $.each(allCerts, (i, val) => {
            var certExpiryString = val.expiration;
            var certExpiry = new Date(certExpiryString);	
            if (certExpiry < today) {                
                expiredCerts++;
            } else {
                validCerts++;
                var certType = allCerts[i].name;
                if (certType.includes('GOLD')) {
                    goldMembers++;
                } else if (certType.includes('Silver') && certType.includes('Bellydance')) {
                    silverBelly++;
                } else if (certType.includes('Silver') && certType.includes('Yoga')) {
                    silverYoga++;
                } else if (certType.includes('Package') && certType.includes('Bellydance 8 Class')) {
                    packageBelly8++;
                } else if (certType.includes('Package') && (certType.includes('Bellydance 16 Class') || certType.includes('Bellydance 16+8 Class'))) {
                    packageBelly16++;
                } else if (certType.includes('Package') && certType.includes('Yoga 8 Class')) {
                    packageYoga8++;
                } else if (certType.includes('Package') && (certType.includes('Yoga 16 Class') || certType.includes('Yoga 16+8 Class'))) {
                    packageYoga16++;
                } else {
                    otherCerts.push(val);
                }
            }
        });
        console.log('Valid OTHER certificates: ', otherCerts);

        // Calculate total number of members in each category
        var totalMembers = goldMembers + silverYoga + silverBelly;
        console.log(`Valid certs: ${validCerts}`);
        console.log(`Expired certs: ${expiredCerts}`);

        // Populate DDY info element
        var $element = $('#ddy_card_1');
        $element.html(`<div class="ddy-card-heading">TOTAL MEMBERS</div>
                        <div class="ddy-card-text">${totalMembers}</div>
                        <div class="ddy-card-subtext">As of today</div>`);
        
        var $element = $('#ddy_card_2');
        $element.html(`<div class="ddy-card-heading">GOLD MEMBERS</div>
                        <div class="ddy-card-text">${goldMembers}</div>
                        <div class="ddy-card-subtext">As of today</div>`);

        var $element = $('#ddy_card_3');
        $element.html(`<div class="ddy-card-heading">SILVER MEMBERS<br>BELLY DANCE</div>
                        <div class="ddy-card-text">${silverBelly}</div>
                        <div class="ddy-card-subtext">As of today</div>`);
        
        var $element = $('#ddy_card_4');
        $element.html(`<div class="ddy-card-heading">SILVER MEMBERS<br>YOGA</div>
                        <div class="ddy-card-text">${silverYoga}</div>
                        <div class="ddy-card-subtext">As of today</div>`);
        
        var $element = $('#ddy_card_5');
        $element.html(`<div class="ddy-card-heading">PACKAGES<br>YOGA (8 CLASS)</div>
                        <div class="ddy-card-text">${packageYoga8}</div>
                        <div class="ddy-card-subtext">As of today</div>`);
        
        var $element = $('#ddy_card_6');
        $element.html(`<div class="ddy-card-heading">PACKAGES<br>YOGA (16 CLASS)</div>
                        <div class="ddy-card-text">${packageYoga16}</div>
                        <div class="ddy-card-subtext">As of today</div>`);
        
        var $element = $('#ddy_card_7');
        $element.html(`<div class="ddy-card-heading">PACKAGES<br>BELLY (8 CLASS)</div>
                        <div class="ddy-card-text">${packageBelly8}</div>
                        <div class="ddy-card-subtext">As of today</div>`);
        
        var $element = $('#ddy_card_8');
        $element.html(`<div class="ddy-card-heading">PACKAGES<br>BELLY (16 CLASS)</div>
                        <div class="ddy-card-text">${packageBelly16}</div>
                        <div class="ddy-card-subtext">As of today</div>`);
    }
    catch (e) {        
        console.error('ERROR: Error caught populating DDY info!');
        console.error(e);
        var $element = $('#studio_metrics_data_div');
        $element.html(`Error caught populating DDY information.`);        
    }
}

// FUNCTION: getDdyInstructors()
// 1) Retrieve Acuity clients list
// 2) Iterate through list and search for text to specify the client is an instructor, populate instructors array
// 3) Return list of DDY instructors in an array to calling function
async function getDdyInstructors() {
    // Make API call
    // Initiate performance timer
    let clientsApiCallt0 = performance.now();
    var funcType = 'clients_search';
    var activity = 'retrieveAllClients';
    var clientsResult = await initApiCall(funcType, activity);
    let clientsApiCallt1 = performance.now();
    console.log('clientsResult is:', clientsResult);
    console.log('Client API call took: ', (clientsApiCallt1 - clientsApiCallt0), ' milliseconds');
    
    // Filter clients result to store instructors only by looking for text in the clients notes field
    // Initiate performance timer
    let instructorArrayCheckt0 = performance.now();
    var instructorNote = 'DDY Instructor';
    var instructorNoteUAT = 'DDY TEST Instructor';
    
    var instructors = $(clientsResult).filter((i) => {
        if (environment === 'UAT') {
            return (clientsResult[i].notes.includes(instructorNote) || clientsResult[i].notes.includes(instructorNoteUAT));
        } else {
            return clientsResult[i].notes.includes(instructorNote);
        }
    });
    let instructorArrayCheckt1 = performance.now();
    console.log('Instructors is:', instructors);
    console.log('Instructor array iteration took: ', (instructorArrayCheckt1 - instructorArrayCheckt0), ' milliseconds');

    return instructors;
}

async function populateEnvironment() {
    // Populate environment and version container
    try {
        // const restControllerVersion = await callAPI('version');
        const restControllerVersion = await initApiCall('version');
        $('#environment').html(`Client version: ${version}<br>Server version: ${restControllerVersion}<br>Environment: ${environment}`);
    }
    catch (e) {			
        console.error('ERROR: Error caught retrieving rest controller version');
        console.error(e);
        $('#environment').html(`Client version: ${version}<br>Server version: <b>CANNOT CONTACT SERVER</b><br>Environment: ${environment}`);
        message = { title: "ERROR", body: "<b>Unable to contact server!!</b><br>Please check server process is up and running." };
        writeMessage('modal', message, $('#modal_output'));
    }
}

// END PROD FUNCTIONS