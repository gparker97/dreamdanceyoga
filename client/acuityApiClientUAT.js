<!DOCTYPE html>
<html lang="en">
	<head>
		<!--link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous"-->
		<link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
        <style type="text/css">
        .my-link {
            color: blue !important;
            text-decoration: underline;
        }        

		.debug-output {
			border: 1px solid lightgray;
			border-radius: 2px;  
			display: block;			
			margin: 5px 0px;
			padding: 5px;  
		}

		.submit-button {
			font-size: 150%;
			font-weight: bold;
			padding: 20px;			
		}
		
		.disabled,
		button:disabled {
			border: 1px solid #999999;
			background-color: #cccccc;
			color: #666666;
		}

		.top-cards {
            text-align: center;
		}

		.card {		    
			background-color: #F2F2F2;
			box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
			transition: 0.3s;
            border-radius 5px;
            padding: 50px 25px;
            margin: 10px;
            text-align: center;
			display: inline-block;
        }        
		
		.card:hover {
			box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
        }        
		
		.details {
            display: block;            
			vertical-align: middle;
			max-height: 500px;
			padding: 30px;
			margin: 20px;		
			background-color: #F2F2F2;
        }        

        .details-item {            
            margin: 10px;
		}

		.form-label {
			font-weight: bold;
		}

        .hide {
			display: none;
		}
		</style>
	</head>
<body>
<!-- ADD TOOLTIPS -->
<div id="top_level_options" class="top-cards">	
	<a href="#">
		<div id="buy_package_top" class="card">
			<h2><strong>BUY PACKAGE</strong></h2>
		</div>
	</a>
	
	<a href="#">
		<div id="buy_class_top" class="card">
			<h2><strong>BUY CLASS</strong></h2>
		</div>
	</a>
	
	<a href="#">
		<div id="view_student_package_top" class="card">
			<h2><strong>VIEW STUDENT PACKAGES</strong></h2>
		</div>
	</a>
	
	<a href="#">
		<div id="add_to_class_top" class="card">
			<h2><strong>ADD TO CLASS</strong></h2>
		</div>	
	</a>
</div>

<div id="loading"></div>

<div id="details" class="details hide">
	<div id="details-top"></div>

	<div id="search_student_div" class="details-item hide">
		<form id="search_student" action="" method="post">  
			<label for="search_student" class="form-label">Student Name: </label>
			<input type="search" name="search_student_form" id="search_student_form" />
			<input type="submit" name="search_submit" id="search_submit" value="Search" />			
		</form>
	</div>

	<div id="search_student_dropdown_div" class="details-item hide">
		<label for="search_student_dropdown" class="form-label">Select Student: </label>
		<select id="search_student_dropdown" name="search_student_dropdown" class="dropdown">
			<option value="Select One">Select One</option>	
		</select>
	</div>

	<div id="select_package_class_div" class="details-item hide">
		<label for="select_package_class_dropdown" class="form-label">Select Package / Class: </label>
		<select id="select_package_class_dropdown" class="dropdown">
			<option value="package">Select One</option>
		</select> 
	</div>

	<div id="package_price_div" class="details-item hide">
		<p>Select or Enter Updated Package Price Here</p>
	</div>


	<div id="payment_method_div" class="details-item hide">
		<label for="payment_method_dropdown" class="form-label">Select Payment Method: </label>
		<select id="payment_method_dropdown" class="select_dropdown">
			<option value="select">Select One</option>			
			<option value="none">NONE</option>
			<option value="cc-terminal">Credit Card (Terminal)</option>
			<option value="cash">Cash</option>
			<option value="bankXfer-DDY">Bank Transfer DDY</option>
			<option value="bankXfer-Sophia">Bank Transfer Sophia POSB</option>
		</select>
		
		<input type="checkbox" name="create_invoice" id="create_invoice_checkbox" value="create_invoice" checked>
		<label for="create_invoice_checkbox">Create Invoice in Xero</label>
		
		<input type="checkbox" name="apply_payment" id="apply_payment_checkbox" value="apply_payment" checked>
		<label for="apply_payment_checkbox">Apply Payment to Invoice</label>
	</div>
	
	<div id="add_to_class_div" class="details-item hide">Test div ADD TO CLASS</div>

	<!-- JQUERY UI MODAL CONTAINER -->
	<div id="modal_output"></div>

	<input type="submit" id="buy_package_submit" class="submit-button hide" value="BUY PACKAGE" />
	<input type="submit" id="buy_class_submit" class="submit-button hide" value="BUY CLASS" />
	<input type="submit" id="view_packages_submit" class="submit-button hide" value="VIEW PACKAGES" />
	<input type="submit" id="add_to_class_submit" class="submit-button hide" value="ADD TO CLASS" />
</div>

<div id="error_message"></div>
<div id="spacer"><br><br></div>
<div id="environment" class="env"></div>
<div id="debug_output" class="hide"></div>
</body>

<script type="text/javascript">
$( () => {
	// Setup script
	environment = "UAT";
	version = '0.9.5b';

	// Set API host
	// var apiHostUAT = 'https://greg-monster.dreamdanceyoga.com:3443/api/acuity'; // GREG computer
	var apiHostUAT = 'https://api.dreamdanceyoga.com:3444/api/acuity'; // AWS UAT
	var apiHostPROD = 'https://api.dreamdanceyoga.com:3443/api/acuity'; // AWS PROD
	
	// Arrays to cache Acuity API call responses (avoid making multiple calls)
	var clients = [];
    var products = [];
	var certificates = [];

	// Hold array of div/button elements to clean up
	var $revealedElements = [];

	// Debug mode
	const debug = true;

    async function initApiCall(func, createInvoice) {
        if (debug) {
			writeMessage("debug", `<br>Starting initApiCall: ${func}`);
        }	

        // Initialize parameters for API call
        switch (func) {
            case 'clients_search':
                var searchTerm = $('#search_student_form').val();			
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
                // var selected_class = $('#select_package_class_dropdown').prop('selectedIndex');	
				// var classId = products[selected_class].id;
				var selectedClassVal = $('#select_package_class_dropdown').val();
				var selectedClass = $.grep(products, (i) => {
					return i.name === selectedClassVal;
				});				
				var classId = selectedClass[0].id;
                var params = {		
                    appointmentTypeID: classId
                };
                break;
			case 'appointments_create':
				// var selected_class = $('#select_package_class_dropdown').prop('selectedIndex');
				// var classId = products[selected_class].id;
				// var selected_client = $('#search_student_dropdown').prop('selectedIndex');
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
            case 'certificates_get':
				// var selected_client = $('#search_student_dropdown').prop('selectedIndex');	
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
            case 'certificates_del':
                var selected_cert = $('#select_code_del').prop('selectedIndex');
                var certId = certificates[selected_cert].id;			
                var params = {
                    method: "DELETE",
                    id: certId
                };
                break;
            case 'certificates_create':
				// var selected_product = $('#select_package_class_dropdown').prop('selectedIndex');
				// var productId = products[selected_product].id;
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
            default:
                console.error('ERROR: Unknown dropdown type');
		}
		
		// Prepend "Select One" to top of dropdown list and select top item
		$drop.prepend($('<option>').text('Select One').attr('value', 'Select One'));
		$drop.get(0).selectedIndex = 0;
	}
	
	async function retrieveProductsClasses(action) {
		switch (action) {
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
			
			// If successful populate dropdown menu
			var $dropdown = $('#select_package_class_dropdown');
			var func = "products";
			populateDropdown($dropdown, result, func);
			
			// Reveal student search container, store action, give focus to the form			
			revealElement($('#search_student_div'));			
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
	async function buyPackage() {		
		try {			
			// Check whether seledted product is package or subscription
			var funcType = "products_get";			
			var products = await initApiCall(funcType);

			// var selectedProduct = $('#select_package_class_dropdown').prop('selectedIndex');
			// var productExpiry = products[selectedProduct].expires;
			
			// Find the array index of the selected product / package and extract expiry date to determine if package or subscription
			var selectedProductVal = $('#select_package_class_dropdown').val();
			var selectedProduct = $.grep(products, (i) => {
				return i.name === selectedProductVal;
			});				
			var productExpiry = selectedProduct[0].expires;			

			if (productExpiry == null) {
				var message = { title: 'ERROR', body: '<strong>You can only buy packages with this tool.</strong><br><br>Subscriptions / memberships must be bought from the <a class="my-link" href="https://dreamdanceyoga.com/" target="_blank">Dream Dance and Yoga website</a> using a valid credit card.' };
				writeMessage('modal', message);
				return false;
			}
			
			// If package then buy package
			var funcType = "certificates_create";
			var result = await initApiCall(funcType);
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

	// FUNCTION: buyClass() ** UNDER DEVELOPMENT **
	// 1. Purchase and register for a single class
	// 2. Apply appropriate certificate code and label
	// 3. Create Xero invoice for class (if requested)
	// 4. Apply full payment to Xero invoice based on payment method selected (if requested)
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
		
		// Populate dropdown with first XX classes in classTime array and ask user to select class to register


	}

	// FUNCTION: buySeries()
	// 1. Register for all classes in a class series
	// 2. Generate a *single* invoice in Xero for all classes in the series for the class series price
	// 3. Apply full payment to the Xero invoice based on the payment method selected
	async function buySeries() {
		try {
			// Get all class times, once we have them loop through each and book
			var funcType = "availability--classes_get";
			var classTimes = await initApiCall(funcType);
			
			// (FUTURE) Display confirmation dialog and progress if confirmed
			// var message = { title: 'BUY A CLASS SERIES', body: `About to buy class series:<br>${JSON.stringify(classTimes, undefined, 2)}<br>Confirm?`};
			// writeMessage('modal', message);
			
			try {
				var bookClass = [];
				var funcType = "appointments_create";
				for (var i = 0; i < classTimes.length; i++) {                    
					$('#buy_class_submit').data('classTime', classTimes[i].time);
					if (i === classTimes.length-1) {
						var createInvoice = true;
					} else {
						var createInvoice = false;
					}
					bookClass[i] = await initApiCall(funcType, createInvoice);
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
				
				// Write alert that class series is booked
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

	async function retrieveCertificates() {
		try {
			var funcType = "certificates_get";
            result = await initApiCall('certificates_get');
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
	
	function revealElement($elementId) {
		// Reveal container or button and store ID in array for cleanup later        
        $elementId.show('drop'); // $elementId.removeClass('hide');
		$revealedElements.push($elementId);

		if (debug) {
			console.log('revealedElements after push:');
			console.log($revealedElements);
		}		
	}

	function cleanUp() {
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
					buttons: {
						OK: () => { $modalDialog.dialog('close'); }
					}
				}
				break;
        }
		
		// Clear or append to message
		if (type === "modal") {
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

	//// EVENTS ////
	
	// Set debug mode
	if (debug) {
		$('#debug_output').removeClass('hide').addClass('debug-output');
		writeMessage('debug', "<b>Debug mode ON</b>");
	}

	// Fill in version and environment details at bottom of page
	populateEnvironment();

	// EVENT: TOP LEVEL CARD CLICK
	$('.card').on('click', async (e) => {	
		e.preventDefault();
			
		// Store action
		action = e.currentTarget.id	
		console.log(`Event captured: ${action}`);
		console.log(e);
		
		// On any top level card click clean up and remove existing containers, buttons, etc
		cleanUp();
		
		// Reveal details div and append action type
		$detailsContainer = $('#details');
		$detailsTop = $('#details-top');
		revealElement($detailsContainer);	
		
		switch (action) {
			case 'buy_class_top':
				$detailsTop.html('<h2>BUY A CLASS</h2><hr/>');
				products = await retrieveProductsClasses(action);
				break;
			case 'buy_package_top':
				$detailsTop.html('<h2>BUY A PACKAGE</h2><hr/>');
				products = await retrieveProductsClasses(action);
				break;
			case 'view_student_package_top':
				$detailsTop.html('<h2>VIEW STUDENT PACKAGES</h2><hr/>');
				// Reveal student search form and store action
				revealElement($('#search_student_div'));
				$('#search_student_form').focus();
				$('#search_student_div').data('action', e.currentTarget.id);
				break;
			case 'add_to_class_top':
				$detailsTop.html('<h2>ADD STUDENTS TO A CLASS</h2><hr/>Not implemented yet!');
				var message = { title: 'ALERT', body: "Not implemented yet!" };
				writeMessage('modal', message);
				// Select date/time and store in var
				// Show all classes from that date/time
				// Store class id (appointmentId) in var
				// Search student name
				// Display in multi-select box
				// When selected ask if cert code to apply
				// Add as object to array
				// Loop through all student names and add to class
				break;
			default:
				console.error('ERROR: Unsupported action');
		}
	});	
	
	// EVENT: SEARCH STUDENT SUBMIT
	$('#search_student').on('submit', async (e) => {
        e.preventDefault();		
		if (debug) {
            writeMessage('debug', `<br>Submit invoked on search_student`);
		}

        // Cache and disable submit button, clear error messages
		writeMessage('error', "");
		$submitButton = $('#search_submit');
		$submitButton.prop('disabled', true).addClass('disabled');
		
		// Retrieve student data
		try {
			clients = await retrieveStudents();
			if (clients) {
				// Reveal student dropdown menu and appropriate containers
				revealElement($('#search_student_dropdown_div'));
				var action = $('#search_student_div').data('action');
				switch (action) {
					case 'buy_class_top':
					case 'buy_package_top':
						revealElement($('#select_package_class_div'));
						break;
					case 'view_student_package_top':
						revealElement($('#view_packages_submit'));					
						break;
					default:
						break;
				}
			}
		}
		catch (e) {
			var message = { title: 'ERROR', body: "Error retrieving students, please try again." };
			writeMessage('modal', message);
		}		

        // Clear search query, re-enable submit button
        $('#search_student_form').val('');
		$submitButton.prop('disabled', false).removeClass('disabled');		
	});

	// EVENT: BUY PACKAGE SUBMIT
	$('#buy_package_submit').on('click', async (e) => {
		e.preventDefault();
		console.log(`Event captured: ${e.currentTarget.id}`);
		console.log(e);
		// Clear any error message		
        writeMessage('error', "");
        
        // Disable package submit button
        $('#buy_package_submit').prop('disabled', true).addClass('disabled');        
		
		if (debug) {
            writeMessage('debug', "<br><b>clicked BUY PACKAGE button...</b>");            
		}
		
		// Generate package code for selected student
		var generateCertResult = await buyPackage();
        
        // Re-enable submit button, clear student search dropdown
		$('#buy_package_submit').prop('disabled', false).removeClass('disabled');
		clearDropdown($('#search_student_dropdown'));
	});

	// EVENT: BUY CLASS SUBMIT
	$('#buy_class_submit').on('click', async (e) => {
		e.preventDefault();
		console.log(`Event captured: ${e.currentTarget.id}`);
		console.log(e);
		// Clear any error message		
		writeMessage('error', "");
		
		// Disable class submit button
		$('#buy_class_submit').prop('disabled', true).addClass('disabled');		
		
		if (debug) {
			writeMessage('debug', "<br><b>clicked BUY CLASS button...</b>");            
		}
		
		// Check if class type = SERIES
		// var selected_class = $('#select_package_class_dropdown').prop('selectedIndex');
		// var classType = products[selected_class].type;
		// NEW method
		var selectedClassVal = $('#select_package_class_dropdown').val();
		var selectedClass = $.grep(products, (i) => {
			return i.name === selectedClassVal;
		});				
		var classType = selectedClass[0].type;				
		if (debug) {
			console.log(`selectedClassVal is ${selectedClassVal}`);
			console.log(`selectedClass is ${selectedClass}`);
			console.log(`classType is ${classType}`);
		}		
		if (classType === "series") {
			// Book class series for selected student			
			var buySeriesResult = await buySeries();
		} else {
			// FUTURE - reveal datepicker and book single class
			// var buyClassResult = await buyClass();
			console.log(`ERROR: Class is not a series`);
			message = { title: "ERROR", body: "<b>You can only book a class series, not a single class.<br>Please try again.</b>" };
			writeMessage('modal', message, $('#modal_output'));
		}
			
		// Re-enable submit button, clear student search dropdown
		$('#buy_class_submit').prop('disabled', false).removeClass('disabled');		
		clearDropdown($('#search_student_dropdown'));
	});		

	// EVENT: VIEW PACKAGES SUBMIT
	$('#view_packages_submit').on('click', async (e) => {
		e.preventDefault();
		console.log(`Event captured: ${e.currentTarget.id}`);
		console.log(e);
		// Clear any error message		
		writeMessage('error', "");

		// Disable view packages submit button
        $('#view_packages_submit').prop('disabled', true).addClass('disabled');        
		
		if (debug) {
			writeMessage('debug', "<br><b>clicked VIEW PACKAGES button...</b>");            
		}

		// View certificates for selected student		
        var certificates = await retrieveCertificates();        
        
        // Populate output and display in modal        
        if (certificates) {
            // Set var to hold retrieved products            
            var certificatesOutput = "";            
            
            // FUTURE: if TYPE = value or type = appointments, add logic (value / price) to show remaining classes / appointments            
            for (var i=0; i < certificates.length; i++) {
                certificatesOutput += `<strong>${certificates[i].name}</strong><br>Email: ${certificates[i].email}<br>Code: ${certificates[i].certificate}<br>Expiry: <strong>${certificates[i].expiration}</strong>`;
                if (i !== (certificates.length - 1)) {
                    certificatesOutput += '<hr>';
                }
			}
		} else {
			certificatesOutput = "<strong>No certificates found!</strong>";
        }
		
		// Generate modal message with certificate details
		var selectedStudent = $('#search_student_dropdown option:selected').text();
		message = { title: `PACKAGES: ${selectedStudent}`, body: certificatesOutput };
		writeMessage('modal', message);

		// CLEAN UP: Re-enable view packages submit button, clear search dropdown		
		clearDropdown($('#search_student_dropdown'));		
		$('#view_packages_submit').prop('disabled', false).removeClass('disabled')		
	});
	
	// EVENT: Select package dropdown change - reveal payment method button
	$('#select_package_class_dropdown').change( (e) => {
		e.preventDefault();
		console.log(`Event captured: ${e.currentTarget.id}`);
		console.log(e);		

		// Make payment method dropdown visible		
		revealElement($('#payment_method_div'));
	});

	// EVENT: Select payment method dropdown change - reveal submit button
	$('#payment_method_dropdown').change( (e) => {
		e.preventDefault();
		console.log(`Event captured: ${e.currentTarget.id}`);
		console.log(e);
		
		// Retrieve requested action (buy class or package)
		var action = $('#search_student_div').data('action');

		// Disable Xero invoice creation if no payment method
		if ($('#payment_method_dropdown').val() === "none") {
			$('#create_invoice_checkbox').prop('checked', false);
			$('#apply_payment_checkbox').prop('checked', false);
		} else {
			$('#create_invoice_checkbox').prop('checked', true);
			$('#apply_payment_checkbox').prop('checked', true);
		}

		// Once payment method is chosen make submit button visible (doesn't re-hide - to fix later)
		if ($('#payment_method_dropdown').val() != "Select One") {
			switch (action) {
				case 'buy_class_top':				
					revealElement($('#buy_class_submit'));				
					break;
				case 'buy_package_top':				
					revealElement($('#buy_package_submit'));				
					break;
			}
		}
	});
});
</script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js" integrity="sha256-VazP97ZCwtekAsvgPBSUwPFKdrwD3unUfSGVYrahUqU=" crossorigin="anonymous"></script>
<!--script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script-->
<!--script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script-->
<!-- END UAT -->
</html>