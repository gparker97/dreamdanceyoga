<!DOCTYPE html>
<html lang="en">
	<head>
		<!--link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous"-->
		<link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
        <style type="text/css">
        .my-link {
            color: blue;
            text-decoration: underline;
        }
        
        .one-third {			
            max-width: 33%;
            display: inline-block;
		}		

		.debug-output {
			border: 1px solid lightgray;
			border-radius: 2px;  
			display: block;
			max-width: 50%;
			margin: 5px 0px;
			padding: 5px;  
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
        
        .hide {
			display: none;
		}
		</style>
	</head>
<body>

<!-- ADD TOOLTIPS -->
<div id="top_level_options" class="top-cards">
	<a href="#">
		<div id="buy_subscription_top" class="card hide">
			<h2><strong>BUY SUBSCRIPTION</strong></h2>
		</div>
	</a>
	
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

<div id="search_student_div" class="hide">
	<form id="search_student" action="" method="post">  
		<label for="search_student">Search Student Name: </label>
		<input type="search" name="search_student_form" id="search_student_form" />
		<input type="submit" name="search_submit" id="search_submit" value="Search" />	
	 </form>
</div>

<div id="search_student_dropdown_div" class="hide">
	<label for="search_student_dropdown">Select Student: </label>
	<select id="search_student_dropdown" name="search_student_dropdown" class="dropdown">
		<option value="Select One">Select One</option>	
	</select>
</div>

<div id="select_package_class_div" class="hide">
	<label for="select_package_class_dropdown">Select Package / Class: </label>
	<select id="select_package_class_dropdown" class="dropdown">
		<option value="package">Select One</option>
	</select> 
</div>

<div id="package_price_div" class="hide">
	<p>Select or Enter Updated Package Price Here</p>
</div>


<div id="payment_method_div" class="hide">
	<label for="payment_method_dropdown">Select Payment Method: </label>
	<select id="payment_method_dropdown" class="select_dropdown">
		<option value="select">Select One</option>
		<option value="cc-online">Credit Card (online)</option>
		<option value="cc-terminal">Credit Card (Terminal)</option>
		<option value="cash">Cash</option>
		<option value="bankXfer-DDY">Bank Transfer DDY</option>
        <option value="bankXfer-Sophia">Bank Transfer Sophia POSB</option>
	</select> 
</div>

<div id="view_packages_div" class="hide"></div>
<!-- JQUERY UI MODAL FOR VIEW PACKAGE -->
<div id="view_packages_modal" title="PACKAGES"></div>

<input type="submit" id="buy_package_submit" class="submit-button hide" value="BUY PACKAGE" />
<input type="submit" id="buy_class_submit" class="submit-button hide" value="BUY CLASS" />
<input type="submit" id="view_packages_submit" class="submit-button hide" value="VIEW PACKAGES" />
<input type="submit" id="add_to_class_submit" class="submit-button hide" value="ADD TO CLASS" />

<div id="loading"></div>
<div id="error_message"></div>
<div id="spacer"><br><br></div>
<div id="debug_output" class="hide"></div>
</body>

<script type="text/javascript">
$( () => {
    // Declare API call variables
	const debug = true;
	
    var clients = [];
    var products = [];
    var certificates = [];    

    async function initApiCall(func) {
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
                var selected_class = $('#select_package_class_dropdown').prop('selectedIndex');	
                var classId = products[selected_class].id;
                var params = {		
                    appointmentTypeID: classId
                };
                break;
			case 'appointments_create':
				var selected_class = $('#select_package_class_dropdown').prop('selectedIndex');
				var selected_client = $('#search_student_dropdown').prop('selectedIndex');
				var classTime = $('#buy_class_submit').data('classTime');
				var classId = products[selected_class].id;            
				var client_firstName = clients[selected_client].firstName;
				var client_lastName = clients[selected_client].lastName;
				var client_email = clients[selected_client].email;
                var client_phone = clients[selected_client].phone;
                // Additional params for XERO
				var paymentMethod = $('#payment_method_dropdown option:selected').val(); // Add to URL for XERO consumption later
				console.log(`Payment Method: ${paymentMethod}`);
				var params = {
					method: "POST",
					paymentMethod: paymentMethod,
					datetime: classTime,
					appointmentTypeID: classId,
					firstName: client_firstName,
					lastName: client_lastName,
					email: client_email,
					phone: client_phone
				};
				break;
            case 'certificates_get':
                var selected_client = $('#search_student_dropdown').prop('selectedIndex');
                var client_email = clients[selected_client].email;
                var queryParam = clients[selected_client].email;
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
                var selected_product = $('#select_package_class_dropdown').prop('selectedIndex');
                var productId = products[selected_product].id;		
                var selected_client = $('#search_student_dropdown').prop('selectedIndex');
                var client_email = clients[selected_client].email;
                // Additional params for XERO
                var paymentMethod = $('#payment_method_dropdown option:selected').val(); // Add to URL for XERO consumption later
                var params = {
					method: "POST",
					paymentMethod: paymentMethod,
                    productID: productId,
                    email: client_email
                };
                break;
            default:
                console.log(`ERROR: Function not found: ${func}`);
				writeMessage('error', `ERROR: Function ${func} not defined`);
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
        var apiHost = 'https://66.96.208.44:3443/api/acuity'; // GREG computer
        // var apiHost = 'https://54.191.24.176:3443/api/acuity'; // AWS
        
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
        
        try {	
            let result = await $.ajax({
                method: "GET",
                crossDomain: true,
                url: url,
                datatype: "json",
                beforeSend: function() { $loading.html('<div id="load"><h2><b>LOADING - PLEASE WAIT</b></h2></div>'); },
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
                    $('#load').remove();				
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
        $drop.empty();
        switch(func) {
            case 'clients':
                $.each(data, (i, val) => {
                    $drop.append($('<option>').text(`${data[i].firstName} ${data[i].lastName}`).attr('value', `${data[i].firstName} ${data[i].lastName}`));
                });
                break;
            case 'products':
            case 'appointment-types':
                $.each(data, (i, val) => {
                    $drop.append($('<option>').text(data[i].name).attr('value', data[i].name));
                });
                break;		
            case 'certificates':			
                $.each(data, (i, val) => {				
                        $drop.append($('<option>').text(`${data[i].name} Code: ${data[i].certificate}`).attr('value', data[i].certificate));
                    });
                break;
            default:
                console.log('Unable to populate dropdown');
        }
	}
	
	async function retrieveProductsClasses(action) {
		if (action === "buy_class_top") {
			// Get all class types
			var funcType = "appointment-types_get";				
		} else {
			// Get all product types
			var funcType = "products_get";
		}

		try {			
			var result = await initApiCall(funcType);
			console.log(`${funcType} result:`);
			console.log(result);
			
			if (debug) {
				writeMessage('debug', `<br>Completed initApicall: ${func}`);				
			}
			
			// If successful populate dropdown menu
			var $dropdown = $('#select_package_class_dropdown');
			var func = "products";
            populateDropdown($dropdown, result, func);
            return result;
		}
		catch(e) {
			console.log(`ERROR: Error detected in initApiCall: ${funcType}`);
			console.error(e);
            writeMessage('error', `<b>An error occured with ${funcType}, please check and try again</b><br>`);			
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
                writeMessage('debug', `<br>Completed initApicall: ${func}`);				
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
                writeMessage('error', `<strong>Student not found!  Try again or <a class="my-link" href="https://secure.acuityscheduling.com/clients.php#" target="_blank">CREATE NEW STUDENT HERE</a>.</strong>`);
			} else {
                writeMessage('error', "<strong>An error occured, please check and try again</strong><br>");
			}			
			clearDropdown($dropdown);
			return false;
		}		
	}

	async function buyPackage() {		
		try {			
			// Check whether seledted product is package or subscription
			var funcType = "products_get";			
			var products = await initApiCall(funcType);
			var selectedProduct = $('#select_package_class_dropdown').prop('selectedIndex');
			var productExpiry = products[selectedProduct].expires;
			if (productExpiry == null) {
				alert("You can only buy packages, not subscriptions.  Please try again.");
				return false;
			}
			
			// If package then buy package
			var funcType = "certificates_create";
			var result = await initApiCall(funcType);
			if (debug) {
				console.log('buyPackage result:');
				console.log(result);
			}
			// IF successful - show alert with details
			var xeroResult = result.xeroStatus;
			if (debug) {
				writeMessage('debug', `<br>Xero Status: ${xeroResult}`);
			}
			var pay_method = $('#payment_method_dropdown').find(':selected').text();
			var selected_client = $('#search_student_dropdown').prop('selectedIndex');
            var client_email = clients[selected_client].email;
            alert(`Code Created!\nEmail: ${client_email}\nCode: ${result.certificate}\nPayment Method: ${pay_method}\nInform student to use their email to book classes`);
            return result;
		}
		catch(e) {
			console.log(`ERROR: Error detected in initApiCall: ${funcType}`);
			console.error(e);
            alert(`An error occured with ${funcType}, please check and try again`);
            return false;
		}		
	}

	async function buySeries() {
		try {
			// Get all class times, once we have them loop through each and book
			var funcType = "availability--classes_get";
			var classTimes = await initApiCall(funcType);                                
			try {
				var bookClass = [];
				var funcType = "appointments_create";
				for (var i = 0; i < classTimes.length; i++) {                    
					$('#buy_class_submit').data('classTime', classTimes[i].time);
					bookClass[i] = await initApiCall(funcType);
					console.log(`Booked class ${i}:`);
					console.log(bookClass[i]);					
				}
				// Write alert that class series is booked
				var pay_method = $('#payment_method_dropdown').find(':selected').text();
                alert(`Classes Booked!\nSeries Name: ${bookClass[0].type}\nFirst Class: ${bookClass[0].datetime}\nPayment Method: ${pay_method}`);
                return bookClass;
			}
			catch(e) {
				console.log(`ERROR: Error detected in initApiCall: ${funcType}`);
				console.log (e);
                writeMessage('error', `<b>An error occured booking class, please check and try again</b><br>`);
                return false;
			}
		}
		catch(e) {
			console.log(`ERROR: Error detected in initApiCall: ${funcType}`);
			console.log (e);
            writeMessage('error', `<b>An error occured retrieving class times (perhaps class started in the past), please check and try again</b><br>`);
            return false;
		}		
	}

	async function retrieveCertificates() {
		try {
			var funcType = "certificates_get";
            result = await initApiCall('certificates_get');
            return result;
			// If successful populate dropdown menu - LATER
			// var $dropdown = $('#select_code_del');
			// var func = "certificates";
			// populateDropdown($dropdown, certificates, func);
			// Enable DELETE CODE button - LATER
			// $('#delete_code').prop('disabled', false);
		}
		catch(e) {
			console.log(`ERROR: Error detected in initApiCall: ${funcType}`);
			console.log (e);
			if (e.responseText === "No records returned") {
                writeMessage('error', `<b>No certificates found!</b>`);				
			} else {
                writeMessage('error', `<b>An error occured retrieving certificate codes, please check and try again</b><br>`);
            }
            return false;
			// var $dropdown = $('#select_code_del');
			// clearDropdown($dropdown);
		}		
	}

    function clearDropdown($drop) {
        // Empty dropdown menu if it exists	
        $drop.empty();
        $drop.append($('<option>').text('Select One').attr('value', 'Select One'));	
    }

    function writeMessage(type, msg) {        
        switch (type) {
            case 'error':
                var $output = $('#error_message');                
                break;
            case 'debug':
                var $output = $('#debug_output');                
                break;
            default:
                var $output = $('#debug_output');
        }
		
		// Clear or append to message
		var message = "";
		if (msg !== "") {
			// Set message
			message = $output.html();
            message += msg;
        }
        $output.html(message);
    }

	//// EVENTS ////
	if (debug) {
		$('#debug_output').removeClass('hide').addClass('debug-output');
		writeMessage('debug', "<b>Debug mode ON</b>");
	}

	// EVENT: TOP LEVEL BUY PACKAGE / CLASS / SUBSCRIPTION CLICK
	$('#buy_package_top, #buy_class_top, #buy_subscription_top').on('click', async (e) => {
        e.preventDefault();		
		console.log(`Event captured: ${e.currentTarget.id}`);
		console.log(e);
		
		// Retrieve list of either products or classes
		products = await retrieveProductsClasses(e.currentTarget.id);

        // Show student search form and store requested action
        $('#search_student_div').removeClass('hide').data('action', e.currentTarget.id);				
	});
	
	// EVENT: Search Student button submit PROD
	$('#search_student').on('submit', async (e) => {
        e.preventDefault();
        
        // Cache submit button - ENABLE LATER
        // $submitButton = $('search_submit');        
		
		// Clear any error message
		writeMessage('error', "");        

        // Disable search submit button and reveal student dropdown menu
        $('#search_submit').prop('disabled', true).addClass('disabled');
		$('#search_student_dropdown_div').removeClass('hide');
		
		if (debug) {
            writeMessage('debug', `<br>Submit invoked on search_student`);
		}

		// Retrieve student data
		clients = await retrieveStudents();

        // Clear search query and re-enable submit button
        $('#search_student_form').val('');		
		$('#search_submit').prop('disabled', false).removeClass('disabled');
		
		if (clients) {
            // If data was returned, reveal appropriate container
            // Retrieve action that invoked student search
		    var action = $('#search_student_div').data('action');
			switch (action) {
				case 'buy_class_top':
				case 'buy_package_top':
				case 'buy_subscription_top':
					$('#select_package_class_div').removeClass('hide');
					break;
				case 'view_student_package_top':
					$('#view_packages_submit').removeClass('hide');
					$('#view_packages_div').removeClass('hide');
					break;
				default:
					break;
			}
		}
	});

	// EVENT: BUY PACKAGE button click PROD
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
        
        // Hide containers and start over
        $('#buy_package_submit').prop('disabled', false).removeClass('disabled');
        $('#search_student_div').addClass('hide');
        $('#search_student_dropdown_div').addClass('hide');
        $('#payment_method_div').addClass('hide');
        $('#select_package_class_div').addClass('hide');
        $('#buy_package_submit').addClass('hide');
	});

	// EVENT: BUY CLASS button click PROD
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
		var selected_class = $('#select_package_class_dropdown').prop('selectedIndex');
		var classType = products[selected_class].type;
		if (classType === "series") {
			// Book class series for selected student			
			var buySeriesResult = await buySeries();			
		} else {
			console.log(`ERROR: Class is not a series`);
			writeMessage('error', `<b>Class is not a series, you can only book a series, not a single class.  Please try again.</b><br>`);
		}
			
		// Re-enable buy class submit button
		$('#buy_class_submit').prop('disabled', false).removeClass('disabled');
	});

	// EVENT: VIEW PACKAGES click
	$('#view_student_package_top').on('click', async (e) => {
		e.preventDefault();
		console.log(`Event captured: ${e.currentTarget.id}`);
		console.log(e);
		// Clear any error message		
		writeMessage('error', "");

		// Show student search form and store requested action
        $('#search_student_div').removeClass('hide').data('action', e.currentTarget.id);                
	});

	// EVENT: ADD TO CLASS click
	$('#add_to_class_top').on('click', async (e) => {
		e.preventDefault();
		console.log(`Event captured: ${e.currentTarget.id}`);
		console.log(e);
		// Clear any error message		
		writeMessage('error', "");
        alert(`Not implemented yet!`);
        
        // Select date/time and store in var
        // Show all classes from that date/time
        // Store class id (appointmentId) in var
        // Search student name
        // Display in multi-select box
        // When selected ask if cert code to apply
        // Add as object to array
        // Loop through all student names and add to class
	});

	// EVENT: VIEW PACKAGES submit PROD
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
        
        // If student has packages - populate output and display in modal
        if (certificates) {
            // Set var to hold retrieved products            
            var certificatesOutput = "";
            
            var $outputModal = $('#view_packages_modal');            
            // FUTURE: if TYPE = value or type = appointments, add logic (value / price) to show remaining classes / appointments            
            for (var i=0; i < certificates.length; i++) {
                certificatesOutput += `<b>${certificates[i].name}</b><br>Email: ${certificates[i].email}<br>Code: ${certificates[i].certificate}<br>Expiry: <b>${certificates[i].expiration}</b>`;
                if (i !== (certificates.length - 1)) {
                    certificatesOutput += '<hr>';
                }
            }            
            var selectedStudent = $('#search_student_dropdown option:selected').text();
            $outputModal.html(certificatesOutput);
            // JQUERY UI MODAL            
            var $modalDialog = $outputModal.dialog({
                modal: true,
                title: `PACKAGES: ${selectedStudent}`,
                buttons: {
                    OK: () => {
                        $modalDialog.dialog("close");
                    }
                }
            }); 
        }               

		// Re-enable view packages submit button and hide the relevant containers
        $('#view_packages_submit').prop('disabled', false).removeClass('disabled').addClass('hide');
        $('#search_student_div').addClass('hide');
        $('#search_student_dropdown_div').addClass('hide');
        $('#view_packages_div').addClass('hide');
	});

	// EVENT: Select student dropdown change PROD
	$('#search_student_dropdown').change( (e) => {
		e.preventDefault();
		console.log(`Event captured: ${e.currentTarget.id}`);
		console.log(e);
		var action = $('#search_student_div').data('action');
		
		// As long as student list is populated, make appropriate button visible
		// Deprecated - will not do anything
		if ($('this').val() != "Select One") {
			switch (action) {
				case 'view_student_package_top':
					$('#view_packages_submit').removeClass('hide');
					break;
				default:
					break;
			}
		}		
	});

	// EVENT: Select package dropdown change PROD
	$('#select_package_class_dropdown').change( (e) => {
		e.preventDefault();
		console.log(`Event captured: ${e.currentTarget.id}`);
		console.log(e);
		var action = $('#search_student_div').data('action');

		// Make payment method dropdown visible
		$('#payment_method_div').removeClass('hide');
		
		// As long as package/class is selected make submit button visible
		// ** Fix this to hide submit button when both packager/class and payment method
		// ** are not filled in
		if (action === "buy_class_top" && $('this').val() != "Select One") {
			$('#buy_class_submit').removeClass('hide');
		} else {
			$('#buy_package_submit').removeClass('hide');
		}
	});	
});
</script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js" integrity="sha256-VazP97ZCwtekAsvgPBSUwPFKdrwD3unUfSGVYrahUqU=" crossorigin="anonymous"></script>
<!--script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script-->
<!--script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script-->
</html>