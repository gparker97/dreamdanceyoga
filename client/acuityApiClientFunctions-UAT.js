// Setup script
const environment = 'UAT';
const version = '1.3.0';

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
        if (params) {
            console.log('InitApiCall params:');
            console.log(params);
        }
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
                    var params = {
                        method: "POST",
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
                    var classTimes = params[0];
                    var clients = params[1];
                    var createInvoice = params[2];
                    console.log('classTimes is: ', classTimes);

                    var selectedClientVal = $('#search_student_dropdown').val();
                    var selected_client = $.grep(clients, (i) => {
                        return `${i.firstName} ${i.lastName}` === selectedClientVal;
                    });
                    var classTime = $('#buy_class_submit').data('classTime');
                    var classId = classTimes[0].appointmentTypeID;
                    var calendarId = classTimes[0].calendarID;
                    if (debug) {
                        console.log(`classId is ${classId}`);
                        console.log(`calendarID is ${calendarId}`);
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
                        calendarID: calendarId,
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
            timeout: 45000
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
    }
    catch(e) {
        console.log(`ERROR: Error detected in initApiCall: ${funcType}`);
        console.log (e);
        var message = { title: 'ERROR', body: `No classes scheduled on ${datePretty}.  Please try another date!` };
        writeMessage('modal', message);        
    }
    // Populate dropdown table with classes and update label text
    $('#upcoming_classes_dropdown_label').text(dropdownLabel);
    var $dropdown = $('#upcoming_classes_dropdown');
    var func = "classes";
    populateDropdown($dropdown, result, func);
    
    // Reveal dropdown and enable button to generate table
    $element = $('#generate_checkin_table_div');
    $revealedElements = revealElement($element, $revealedElements);
    
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
        
        // If successful populate dropdown menu			
        var func = "clients";
        populateDropdown($dropdown, result, func);
        return result;
    }
    catch(e) {
        console.log(`ERROR: Error detected in initApiCall: ${funcType}`);
        console.error(e);
        if (e.responseText === "No records returned") {            
            if (checkIn) {
                var message = { title: 'ERROR', body: '<strong>Student not found!<br>Please check with Dream Dance and Yoga staff to register.</strong>' };
            } else {
                var message = { title: 'ERROR', body: '<strong>Student not found!<br>Try again or <a class="my-link" href="https://secure.acuityscheduling.com/clients.php#" target="_blank">CREATE NEW STUDENT HERE</a>.</strong>' };
            }
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

// FUNCTION: buySeries(products, clients)
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
            var params = [ classTimes, clients, false ];
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

// FUNCTION: generateInstructorReport()
// 1. Retrieve list of appointments for the selected month
// 2. Iterate through list an filter for instructor appointments only
// 3. Add instructor appointments to an object with relevant stats
// 4. Display instructor report for user
// 5. Provide option to generate a pay run in Xero
async function generateInstructorReport(reportMonth, $revealedElements) {
    // Get first and last day of report month
    var minDate = new Date(reportMonth.getFullYear(), reportMonth.getMonth(), 1);
    var maxDate = new Date(reportMonth.getFullYear(), reportMonth.getMonth() + 1, 0);
    console.log(`minDate: ${minDate}, maxDate: ${maxDate}`);
    
    // Retrieve appointments for selected month
    var func = 'appointments_get';
    var activity = 'getApptsByDateRange';
    var params = [minDate, maxDate];
    appointmentsResult = await initApiCall(func, activity, params);
    console.log('Instructor report appointments result:', appointmentsResult);
    
    // Rollup appointments array by class and notes
    var instructorCheckinNote = 'INSTRUCTOR CHECK-IN';
    var apptsByType = d3.nest().key(function(i) {
        return `${i.type} ${i.datetime}`;
    }).entries(appointmentsResult);
    console.log('Appointments by Class Type: ', apptsByType);

    // Loop through data and store instructor info
    var instructorData = [];
    var instructorCounts = {};
    var instructorCheckinNote = 'INSTRUCTOR CHECK-IN';
    
    /*
    $.each(appointmentsResult, (i, val) => {
        var notes = val.notes;        
        if (notes.includes(instructorCheckinNote)) {
            // Gather required data to store
            var name = `${val.firstName} ${val.lastName}`;            
            var classType = val.type;
            var engClassType = $.trim(classType.split('|')[1]) || classType;
            var date = val.datetime;
            // Format date to look nice here
            // var datePretty = xxxxx
            
            // Create instructor data object and push to array
            // var data = {
                // name,
                // class: engClassType,
                // date
            // }
            // instructorData.push(data);

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
        } else {
            // Populate name with blank as no instructor has checked in yet
            var name = 'NO CHECK IN';            
        }
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
    */

    // 2ND ATTEMPT - TEST
    $.each(apptsByType, (i, className) => {
        className['hasInstructor'] = false;
        var classType = className.values[0].type;
        var engClassType = $.trim(classType.split('|')[1]) || classType;
        var date = className.values[0].datetime;
        
        // Format class date for display
        var dateString = date.split('T')[0];
        var timeString = date.split('T')[1].split('+')[0];
        var datePretty = `${dateString} ${timeString}`
        
        // var classDate = new Date(date);
        // var datePretty = classDate.toLocaleString();

        // Push class names and times
        className['class'] = engClassType;
        className['date'] = datePretty;

        $.each(className.values, (i2, apptDetails) => {
            var notes = apptDetails.notes;
            if (notes.includes(instructorCheckinNote)) {
                // Gather required data to store
                var name = `${apptDetails.firstName} ${apptDetails.lastName}`;               

                // Push data to object
                className['hasInstructor'] = true;
                className['instructor'] = name;
    
                // Initialize and increment class counter object for instructors
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
            }
        });

        if (className['hasInstructor'] === false) {
            // Populate name with blank as no instructor has checked in yet
            var name = 'NO CHECK IN';
            // Push data to object                    
            className['instructor'] = name;
        }

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
    console.log('Appointments by Class Type AFTER iteration: ', apptsByType);

    // Iterate through object and output report
    var selectedMonthVal = $('#instructor_report_datepicker').val();
    var msg = `<h3 class="center"><b>INSTRUCTOR REPORT for ${selectedMonthVal}</h3></b><hr>`;
    
    $.each(instructorCounts, (name, className) => {
        console.log(`${name} | ${className}`);
        msg += `<b>${name}: </b>`;
        $.each(className, (className1, count) => {
            console.log(`${className1} | ${count}`);
            msg += `${className1} x ${count} `;
        });
        msg += '<br>';
    });
    msg += '<hr>';
    console.log(msg);
    
    // Build details table
    var instructorReportDetailsTable = $('#instructor_report_details_table').DataTable({
        // "data": instructorData,
        "data": apptsByType,
        "pageLength": 50,            
        "order": [[2, 'asc']],
        destroy: true,
        "columns": [
            { "data": "instructor"},
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
        appointmentsResult = await initApiCall(funcType, activity, params);
        console.log('Appointments result:', appointmentsResult);
    }
    catch(e) {
        console.log(`ERROR: Error detected in initApiCall: ${funcType}`);
        console.log (e);
        var message = { title: 'ERROR', body: `No appointments on ${minDate} - ${maxDate}.  Please try another date!` };
        writeMessage('modal', message);
        return false;
    }

    // CHART #1: APPOINTMENTS BY DATE
    // Parse appointments result using D3.JS grouping functions to group by day / week / month
    var apptsByDayCounts = d3.nest().key(function(i) {
        // return i.date;
        var apptDate = new Date(i.date);
        // var apptMonthYear = $.datepicker.formatDate('MM yy', apptDate);
        var apptMonth = $.datepicker.formatDate('MM', apptDate);
        var apptWeek = $.datepicker.iso8601Week(apptDate);
        return `${apptMonth} Week ${apptWeek}`;
    }).rollup(function(i2) {
        return i2.length;
    }).entries(appointmentsResult);
    console.log('apptsByDayCounts: ', apptsByDayCounts);

    // Push values to 2-dimensional array and reverse order for chronological chart display
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
    }
    catch(e) {
        console.log(`ERROR: Error detected in initApiCall: ${funcType}`);
        console.log (e);
        var message = { title: 'ERROR', body: `No classes scheduled on ${minDate} - ${maxDate}.  Please try another date!` };
        writeMessage('modal', message);
        return false;
    }

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

    // CHART #3: APPOINTMENTS BOOKED BY STUDENT
    // Parse appointments result using D3.JS grouping functions
    var apptsByStudentCounts = d3.nest().key(function(i) {
        return `${i.firstName} ${i.lastName}`;
    }).rollup(function(i) {
        return i.length;
    }).entries(appointmentsResult);
    console.log('apptsByStudentCounts: ', apptsByStudentCounts);

    // Push values to 2-dimensional array and sort from top to bottom
    var appointmentsByStudent = [];    
    $.each(apptsByStudentCounts, (i, val) => {			
        appointmentsByStudent.push([val.key, val.value]);        
    });    
    appointmentsByStudent.sort(function(a, b) {
        return b[1] - a[1];
    });    

    // Reduce to top XX students only
    var numOfStudents = 20;
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
            name: '# of Appointments',
            data: appointmentsByDay
        }],
        credits: false
    });

    // Add moving average to appointments chart
    var series = apptsChart.series[0];
    var data = [];
    var period = 2;
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
            text: 'How full are my classes on average?'
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
                        color: 'red',
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
            height: 700
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
    // $elementId.removeClass('hide');
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
        $element.hide();
        // $element.addClass('hide');
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
            var modalButtons = [{
                text: "OK",
                icon: "ui-icon-check",
                class: "modal-output",
                click: () => { $modalDialog.dialog('close'); }
            }];                    
            break;
        case 'modal-cancel':            
            var modalButtons = [{
                text: "Cancel",
                icon: "ui-icon-closethick",
                class: "modal-output",
                click: () => { $modalDialog.dialog('close'); }
            }];
        case 'modal-close-window':
            var modalButtons = [{
                text: "Close Window",
                icon: "ui-icon-closethick",
                class: "modal-output",
                click: () => { window.close(); }
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
        var $output = $('#modal_output');
        $output.html(msg.body);
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
        var silverMembers = 0;
        var packageMembers = 0;
        var today = new Date();

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
                } else if (certType.includes('Silver')) {
                    silverMembers++;
                } else if (certType.includes('Package')) {
                    packageMembers++;
                }
            }
        });
        var subscribers = goldMembers + silverMembers;
        var totalMembers = subscribers + packageMembers;
        console.log(`Valid certs: ${validCerts}`);
        console.log(`Expired certs: ${expiredCerts}`);

        // Populate DDY info element
        var $element = $('#ddy_card_1');
        $element.html(`<div class="ddy-card-heading">TOTAL MEMBERS</div>
                        <div class="ddy-card-text">${totalMembers}</div>
                        <div class="ddy-card-subtext">As of today</div>`);
        /*
        $element.html(`<div>Valid certificates: ${validCerts}
                        <br>Expired certificates: ${expiredCerts}
                        <br>Subscribers (Gold + Silver): ${subscribers}
                        <br>GOLD Members: ${goldMembers}
                        <br>Silver Members: ${silverMembers}
                        <br>Package Members: ${packageMembers}                            
                        <br>TOTAL Members: ${totalMembers}
                        </div>`); */        
        
        var $element = $('#ddy_card_2');
        $element.html(`<div class="ddy-card-heading">GOLD MEMBERS</div>
                        <div class="ddy-card-text">${goldMembers}</div>
                        <div class="ddy-card-subtext">As of today</div>`);

        var $element = $('#ddy_card_3');
        $element.html(`<div class="ddy-card-heading">SILVER MEMBERS</div>
                        <div class="ddy-card-text">${silverMembers}</div>
                        <div class="ddy-card-subtext">As of today</div>`);

        var $element = $('#ddy_card_4');
        $element.html(`<div class="ddy-card-heading">PACKAGES</div>
                        <div class="ddy-card-text">${packageMembers}</div>
                        <div class="ddy-card-subtext">As of today</div>`);
    }
    catch (e) {        
        console.error('ERROR: Error caught populating DDY info!');
        console.error(e);
        var $element = $('#studio_metrics_data_div');
        $element.html(`Error caught populating DDY information.`);        
    }
}

async function populateEnvironment() {
    // Populate environment and version container
    try {
        const restControllerVersion = await callAPI('version');
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

// END UAT FUNCTIONS