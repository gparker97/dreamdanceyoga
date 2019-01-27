// Setup script
const environment = 'UAT';
const version = '1.1.0';

// Set API host
// var apiHostUAT = 'https://greg-monster.dreamdanceyoga.com:3443/api/acuity'; // GREG computer
var apiHostUAT = 'https://api.dreamdanceyoga.com:3444/api/acuity'; // AWS UAT
var apiHostPROD = 'https://api.dreamdanceyoga.com:3443/api/acuity'; // AWS PROD

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
        console.log('InitApiCall params:');
        console.log(params);
    }	

    // Initialize parameters for API call
    switch (func) {        
        case 'clients_search':
            var searchTerm = $('#search_student_form').val();
            if (!searchTerm) { searchTerm = ''; }
            var params = {
                search: searchTerm
            };
            break;
        case 'products_get':
            var params = {};
            break;
        case 'appointment-types_get':
            var params = {};
            break;
        case 'availability--classes_get':
            switch (activity) {
                case 'getClassesByDate':
                    // Find all classes scheduled for given date
                    var classDate = params;                
                    var minDate = $.datepicker.formatDate('yy/mm/dd', classDate);
                    var maxDate = classDate;
                    maxDate.setDate(classDate.getDate() + 1);
                    var maxDate = $.datepicker.formatDate('yy/mm/dd', maxDate);                    
                    var params = {		
                        minDate,
                        maxDate,
                        includeUnavailable: true
                    };                    
                    break;
                case 'classSeries':
                    // Buy a series - find all classes for the selected class series
                    var products = params;
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
                default:
                    return 'Activity not defined';
            }
            break;
        case 'appointments_post':
            switch (activity) {
                case 'addToClass':
                    var studentInfo = params;
                    var classId = studentInfo.classId;
                    var datetime = studentInfo.datetime;
                    var firstName = studentInfo.firstName;
                    var lastName = studentInfo.lastName;
                    var email = studentInfo.email;
                    var certificate = studentInfo.certificate;
                    var OBJECT = 'labels_id';
                    var labels_id = studentInfo.labelID;
                    var params = {
                        method: "POST",
                        datetime,
                        appointmentTypeID: classId,
                        firstName,
                        lastName,
                        email,
                        certificate,
                        OBJECT,
                        labels_id
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
                    if (debug) {
                        console.log('Appt ID is: ', apptId);                        
                    }
                    // Update func to send proper URL
                    func = `appointments--${apptId}--cancel`;
                    console.log('func is: ', func);
                    var params = {
                        method: "PUT",
                        cancelNote
                    };
                    break;
                default:
                    return 'Activity not defined';
            }
            break;
        case 'appointments_create':
            switch (activity) {
                case 'createAppt':
                    // Create an appointment in Acuity for selected student
                    // Set createInvoice to determine whether to create an invoice in Xero - only 1 invoice created for each class series
                    var products = params[0];
                    var clients = params[1];
                    var createInvoice = params[2];

                    var selectedClientVal = $('#search_student_dropdown').val();
                    var selected_client = $.grep(clients, (i) => {
                        return `${i.firstName} ${i.lastName}` === selectedClientVal;
                    });
                    var classTime = $('#buy_class_submit').data('classTime');								
                    var selectedClassVal = $('#select_package_class_dropdown').val();
                    var selectedClass = $.grep(products, (i) => {
                        return i.name === selectedClassVal;
                    });				
                    var classId = selectedClass[0].id;
                    if (debug) {
                        console.log(`selectedClassVal is ${selectedClassVal}`);
                        console.log(`selectedClass is ${selectedClass}`);
                        console.log(`classId is ${classId}`);
                    }
                    var client_firstName = selected_client[0].firstName;
                    var client_lastName = selected_client[0].lastName;
                    var client_email = selected_client[0].email;
                    var client_phone = selected_client[0].phone;
                    var paymentMethod = $('#payment_method_dropdown option:selected').val();                    
                    
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
                        firstName: client_firstName,
                        lastName: client_lastName,
                        email: client_email,
                        phone: client_phone
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
                    var products = params[0];
                    var clients = params[1];
                    var selectedProductVal = $('#select_package_class_dropdown').val();
                    var selectedProduct = $.grep(products, (i) => {
                        return i.name === selectedProductVal;
                    });				
                    var productId = selectedProduct[0].id;
                    // var selected_client = $('#search_student_dropdown').prop('selectedIndex');
                    var selectedClientVal = $('#search_student_dropdown').val();
                    var selected_client = $.grep(clients, (i) => {
                        return `${i.firstName} ${i.lastName}` === selectedClientVal;
                    });
                    if (debug) {
                        console.log(`selectedproductVal is ${selectedProductVal}`);								
                        console.log(`selectedProduct is ${selectedProduct}`);
                        console.log(selectedProduct);				
                        console.log(`productId is ${productId}`);
                        console.log('selected client is:');
                        console.log(selected_client);
                    }
                    // var client_email = clients[selected_client].email;
                    var client_email = selected_client[0].email;
                    
                    // Check Xero invoice checkboxes to determine whether to create invoice / apply payment
                    var createInvoiceChecked = $('#create_invoice_checkbox').is(':checked');
                    var applyPaymentChecked = $('#apply_payment_checkbox').is(':checked');
                    if (debug) {
                        console.log(`createInvoiceChecked is ${createInvoiceChecked}`);
                        console.log(`applyPaymentChecked is ${applyPaymentChecked}`);
                    }
                    // Additional params for XERO
                    var paymentMethod = $('#payment_method_dropdown option:selected').val();
                    var params = {
                        method: "POST",
                        paymentMethod: paymentMethod,
                        xeroCreateInvoice: createInvoiceChecked,
                        xeroApplyPayment: applyPaymentChecked,
                        productID: productId,
                        email: client_email
                    };
                    break;
                default:
                    return 'Activity not defined';
                }
            break;
        default:
            console.log(`ERROR: Function not found: ${func}`);				
            return false;            
    }
    
    // Make API call
    try {		
        if (debug) {			
            writeMessage('debug', `<br><b>Starting API call: ${func}..</b>`);				
        }
        var funcToCall = func.split('_')[0];
        console.log(`Starting API call: ${func}`);
        console.log(params);
        return await callAPI(funcToCall, params);
    } catch(e) {
        console.log(`ERROR: Error returned from callAPI function: ${func}`);
        console.error(e);
        if (debug) {
            writeMessage('debug', `<br>XHR responseText: ${e.responseText}`);
        }
        return e;
    }
}

async function callAPI(func, params) {
    var $loading = $('#loading');
    if (debug) {
        console.log('loading is: ', $loading);
    }

    // set apiHost based on environment
    apiHost = eval(`apiHost${environment}`);		
    
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
    
    // Replace any '+' symbols in URL with ASCII code
    url = url.replace(/\+/g, "%2B");
    
    if (debug) { 
        writeMessage('debug', `<br>STARTED CALL API FUNCTION<br>Function: ${func}<br>URL: ${url}`);
    }
    
    // AJAX GET call to acuityRestController
    // Refactor later to send POST with JSON body - no longer sustainable as GET with long query string
    try {	
        let result = await $.ajax({
            method: "GET",
            crossDomain: true,
            url: url,
            datatype: "json",
            beforeSend: function() { 
                // $loading.html('<div id="load"><h2><b>LOADING - PLEASE WAIT</b></h2></div>');
                $loading.progressbar({
                    value: false						
                });
            },
            success: function(response, status, xhr) {
                console.log('API call response:');
                console.log(response);			
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
                // $('#load').remove();
                $loading.progressbar('destroy');
                if (debug) {
                    writeMessage('debug', `<br><b>API CALL COMPLETE</b><br>Function: ${func}`);						
                }
            },
            timeout: 10000
        });
        return result;
    } catch (e) {
        console.log(`ERROR: Error detected in first level API call: ${func}`);
        console.error(e);
        if (debug) {
            writeMessage('debug', `<br><b>ERROR CAUGHT</b><br>Function: ${func}<br>Response text: ${e.responseText}`);
        }
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
                    $drop.append($('<option>').text(`${data[i].name} - ${data[i].time}`).attr('value', `${data[i].name}-${data[i].time}`));
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

async function retrieveProductsClasses(action, $revealedElements) {
    switch (action) {
        case 'buy_single_class_top':
        case 'buy_class_top':
            var funcType = "appointment-types_get";
            break;
        case 'buy_package_top':
            var funcType = "products_get";
            break;
    }

    try {			
        var result = await initApiCall(funcType);
        console.log(`${funcType} result:`);
        console.log(result);
        
        if (debug) {
            writeMessage('debug', `<br>Completed initApicall: ${funcType}`);				
        }
        
        // If successful populate dropdown menu based on selected action
        switch (action) {
            case 'buy_single_class_top':
                // Filter classes result for single class types only
                var singleClasses = $(result).filter((i) => {
                    return (result[i].type === 'class' || result[i].type === 'service');
                });
                console.log('singleClasses is:', singleClasses);
                
                var $dropdown = $('#select_package_class_dropdown');
                var func = "products";
                populateDropdown($dropdown, singleClasses, func);

                // Reveal select class dropdown
                var $element = $('#select_package_class_div');
                $revealedElements = revealElement($element, $revealedElements);
                
                return singleClasses;
                break;
            case 'buy_class_top':                
                // FUTURE - filter out class series more than a month old?
                // Filter classes result for SERIES class types only
                var classSeries = $(result).filter((i) => {
                    return (result[i].type === 'series');
                });
                console.log('classSeries is:', classSeries);

                var $dropdown = $('#select_package_class_dropdown');
                var func = "products";
                populateDropdown($dropdown, classSeries, func);
                break;              
            case 'buy_package_top':
                var $dropdown = $('#select_package_class_dropdown');
                var func = "products";
                populateDropdown($dropdown, result, func);
                break;
        }
        
        // Reveal student search container, store action, give focus to the form			
        $revealedElements = revealElement($('#search_student_div'), $revealedElements);
        $('#search_student_form').focus();
        $('#search_student_div').data('action', action);

        return result;
    }
    catch(e) {
        console.error(`ERROR: Error detected in initApiCall: ${funcType}`);
        console.error(e);
        var message = { title: 'ERROR', body: `An error occured with ${funcType}, please check and try again` };
        writeMessage('modal', message);
        return false;
    }		
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

    console.log('Selected class date is: ', classDate);

    // API call to retrieve today's classes
    try {
        var result = await initApiCall(funcType, activity, classDate);
        console.log(`${funcType} result:`);
        console.log(result);
        
        if (debug) {
            writeMessage('debug', `<br>Completed initApicall: ${funcType}`);				
        }
        
        // If successful populate dropdown table with today's classes and update label text
        $('#upcoming_classes_dropdown_label').text(dropdownLabel);
        var $dropdown = $('#upcoming_classes_dropdown');
        var func = "classes";
        populateDropdown($dropdown, result, func);
        
        // Reveal dropdown and enable button to generate table
        $element = $('#generate_checkin_table_div');
        var $revealedElements = revealElement($element, $revealedElements);
        return result;
    }
    catch(e) {
        console.log(`ERROR: Error detected in initApiCall: ${funcType}`);
        console.log (e);
        var message = { title: 'ERROR', body: `No classes scheduled on ${datePretty}.  Please try another date!` };
        writeMessage('modal', message);
        return false;
    }
}

async function retrieveStudents() {		
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
        
        // If successful populate dropdown menu			
        var func = "clients";
        populateDropdown($dropdown, result, func);
        return result;
    }
    catch(e) {
        console.log(`ERROR: Error detected in initApiCall: ${funcType}`);
        console.error(e);
        if (e.responseText === "No records returned") {
            var message = { title: 'ERROR', body: '<strong>Student not found!<br>Try again or <a class="my-link" href="https://secure.acuityscheduling.com/clients.php#" target="_blank">CREATE NEW STUDENT HERE</a>.</strong>' };
            writeMessage('modal', message);				
        } else {
            writeMessage('modal', "<strong>An error occured, please check and try again</strong>");
        }			
        clearDropdown($dropdown);
        return false;
    }		
}

// FUNCTION: buyPackage()
// 1. Generate a package certificate and assign to user's email address
// 2. Generate a Xero invoice for the package price (if requested)
// 3. Apply full payment to Xero invoice based on payment method selected (if requested)

async function buyPackage(products, clients) {		
    try {			
        // Find the array index of the selected product / package and extract expiry date to determine if package or subscription
        var selectedProductVal = $('#select_package_class_dropdown').val();
        var selectedProduct = $.grep(products, (i) => {
            return i.name === selectedProductVal;
        });
        console.log('Selected Product: ', selectedProduct);

        // If customer wants to pay with credit card online, re-direct to Acuity link
        var paymentMethod = $('#payment_method_dropdown option:selected').val();
        if (paymentMethod === 'cc-online') {
            // Capture selected client from clients array
            var selectedClientVal = $('#search_student_dropdown').val();
            var selectedClient = $.grep(clients, (i) => {
                return `${i.firstName} ${i.lastName}` === selectedClientVal;
            });
            console.log('selectedClient is: ', selectedClient);
            
            // Prepare Acuity direct purchase link URL
            var productID = selectedProduct[0].id;
            var productURL = `https://app.acuityscheduling.com/catalog.php?owner=15731779&action=addCart&clear=1&id=${productID}&firstName=${selectedClient[0].firstName}&lastName=${selectedClient[0].lastName}&email=${selectedClient[0].email}&phone=${selectedClient[0].phone}`;
            // Replace any '+' symbols in URL with ASCII code
            productURL = productURL.replace(/\+/g, "%2B");
            
            // Open new tab with Acuity direct purchase link
            var win = window.open(productURL, '_blank');
            return false;
        }
        
        var productExpiry = selectedProduct[0].expires;
        if (productExpiry == null) {
            var message = { title: 'ERROR', body: '<strong>Subscriptions can only be bought via Credit Card ONLINE.</strong><br><br>Please choose the Credit Card ONLINE option and use a valid credit card.' };
            writeMessage('modal', message);
            return false;
        }
        
        // If package then buy package
        var funcType = 'certificates_create';
        var activity = 'createCertificate';
        var params = [ products, clients ];
        var result = await initApiCall(funcType, activity, params);
        console.log('buyPackage result:');
        console.log(result);

        // Successful - display details in modal window
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
        var pay_method = $('#payment_method_dropdown').find(':selected').text();
        // var selected_client = $('#search_student_dropdown').prop('selectedIndex');
        // var client_email = clients[selected_client].email;
        var selectedClientVal = $('#search_student_dropdown').val();
        var selected_client = $.grep(clients, (i) => {
                return `${i.firstName} ${i.lastName}` === selectedClientVal;
        });
        var client_email = selected_client[0].email;
        var message = { 
            title: 'PURCHASE SUCCESS',
            body: `<b>Email:</b> ${client_email}<br><b>Code:</b> ${result.certificate}<br><b>Payment Method:</b> ${pay_method}<hr><strong>Xero Results</strong><br>${xeroInvoiceStatusMessage}<br>${xeroPaymentStatusMessage}<hr><strong>Inform student to use email address to book classes</strong>`
        };
        writeMessage('modal', message);			
        return result;
    }
    catch(e) {
        console.error(`ERROR: Error detected in initApiCall: ${funcType}`);
        console.error(e);
        var message = { title: 'ERROR', body: `An error occured with ${funcType}, please check and try again` };
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

// FUNCTION: buySeries()
// 1. Register for all classes in a class series
// 2. Generate a *single* invoice in Xero for all classes in the series for the class series price
// 3. Apply full payment to the Xero invoice based on the payment method selected
async function buySeries(products, clients) {
    try {
        // Find the array index of the selected product / package to get more info about selected product
        var selectedProductVal = $('#select_package_class_dropdown').val();
        var selectedProduct = $.grep(products, (i) => {
            return i.name === selectedProductVal;
        });

        // If customer wants to pay with credit card online, re-direct to Acuity link
        var paymentMethod = $('#payment_method_dropdown option:selected').val();
        if (paymentMethod === 'cc-online') {
            // Capture selected client from clients array
            var selectedClientVal = $('#search_student_dropdown').val();
            var selectedClient = $.grep(clients, (i) => {
                return `${i.firstName} ${i.lastName}` === selectedClientVal;
            });
            console.log('selectedClient is: ', selectedClient);

            // Open new tab with direct link to product in Acuity
            var productURL = selectedProduct[0].schedulingUrl;            
            productURL += `&firstName=${selectedClient[0].firstName}&lastName=${selectedClient[0].lastName}&email=${selectedClient[0].email}&phone=${selectedClient[0].phone}`;
            // Replace any '+' symbols in URL with ASCII code
            productURL = productURL.replace(/\+/g, "%2B");
            var win = window.open(productURL, '_blank');
            return false;
        }
        
        // Get all class times, once we have them loop through each and book
        var funcType = "availability--classes_get";
        var activity = 'classSeries';
        var params = products;
        var classTimes = await initApiCall(funcType, activity, params);
        
        // (FUTURE) Display confirmation dialog and progress if confirmed
        // var message = { title: 'BUY A CLASS SERIES', body: `About to buy class series:<br>${JSON.stringify(classTimes, undefined, 2)}<br>Confirm?`};
        // writeMessage('modal', message);
        
        try {
            var bookClass = [];
            var funcType = "appointments_create";
            var activity = 'createAppt';            
            var params = [ products, clients, false ];
            for (var i = 0; i < classTimes.length; i++) {                    
                $('#buy_class_submit').data('classTime', classTimes[i].time);
                
                // If reached last class in series, set createInvoice to true
                if (i === classTimes.length-1) { params[2] = true; }
                
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
            var pay_method = $('#payment_method_dropdown').find(':selected').text();
            
            // Write message that class series is booked
            var message = {
                title: 'BOOKING SUCCESS',
                body: `<strong>Series Name:</strong> ${bookClass[0].type}<br><strong>First Class:</strong> ${bookClass[0].datetime}<br><strong># of Classes:</strong> ${bookClass.length}<br><strong>Payment Method:</strong> ${pay_method}<hr><strong>Xero Results</strong><br>${xeroInvoiceStatusMessage}<br>${xeroPaymentStatusMessage}`
            };				
            writeMessage('modal', message);
            return bookClass;
        }
        catch(e) {
            console.log(`ERROR: Error detected in initApiCall: ${funcType}`);
            console.log (e);
            var message = { title: 'ERROR', body: `An error occured booking class, please check and try again` };
            writeMessage('modal', message);
            return false;
        }
    }
    catch(e) {
        console.log(`ERROR: Error detected in initApiCall: ${funcType}`);
        console.log (e);
        var message = { title: 'ERROR', body: 'An error occured retrieving class times (perhaps class started in the past), please check and try again' };
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
        if (e.responseText === "No records returned") {
            console.log('No certificates found');
        } else {
            console.error('ERROR: An error occured retrieving certificate codes');
        }
        return false;
        // var $dropdown = $('#select_code_del');
        // clearDropdown($dropdown);
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
        var message = { title: 'ERROR', body: `An error occured retrieving student list, please check and try again` };
        writeMessage('modal', message);
        return false;
    }
}

function revealElement($elementId, $revealedElements) {
    // Reveal container or button and store ID in array for cleanup later        
    $elementId.show('drop'); // $elementId.removeClass('hide');
    $revealedElements.push($elementId);

    if (debug) {
        console.log('revealedElements after push:', $revealedElements);			
    }    
    
    return $revealedElements
}

function cleanUp($revealedElements) {
    // Clean up errors, existing buttons, containers, messages, etc
    console.log('Cleaning up revealed elements...');

    writeMessage('error', "");
    // Loop through each item in revealed elements and re-hide				
    $.each($revealedElements, (i, $element) => {			
        $element.hide(); // $element.addClass('hide');
    });
    
    // Reset revealed elements
    $revealedElements = [];

    // Reset dropdown and checkboxes
    $('#payment_method_dropdown').val('select');
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
            var $output = $('#modal_output');
            $output.html(msg.body);            
            var modalOptions = {
                modal: true,
                title: msg.title,
                width: msg.width || 'auto',
                height: msg.height || 'auto',
                buttons: {
                    OK: () => { $modalDialog.dialog('close'); }
                }
            }            
            break;
        case 'modal-no-button':
            var $output = $('#modal_output');
            $output.html(msg.body);            
            var modalOptions = {
                modal: true,
                title: msg.title,
                width: msg.width || 'auto',
                height: msg.height || 'auto',
                buttons: { Cancel: () => { $modalDialog.dialog('close'); } }
            }            
            break;
    }
    
    // Clear or append to message
    if (type.includes('modal')) {
        var $modalDialog = $output.dialog(modalOptions);
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

async function populateEnvironment() {
    // Populate environment and version container
    try {
        const restControllerVersion = await callAPI('version');
        $('#environment').html(`Client version: ${version}<br>Server version: ${restControllerVersion}<br>Environment: ${environment}`);
    }
    catch (e) {			
        console.error('ERROR: Error caught retrieving rest controller version');
        $('#environment').html(`Client version: ${version}<br>Server version: <b>CANNOT CONTACT SERVER</b><br>Environment: ${environment}`);
        message = { title: "ERROR", body: "<b>Unable to contact server!!</b><br>Please check server process is up and running." };
        writeMessage('modal', message, $('#modal_output'));
    }
}

// END UAT FUNCTIONS