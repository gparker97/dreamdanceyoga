<!DOCTYPE html>
<html lang="en">
	<head>		
	<link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
		<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.10.19/css/jquery.dataTables.css">	
		<style type="text/css">				
		.hide {
			display: none;
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
		</style>
	</head>
<body>

<div id="debug" class="hide">
	<h3>ACUITY DEV/TEST API CLIENT</h3>
	
	<form id="search_client" action="" method="post">  
		<label for="search_client">Enter Name: </label>
		<input type="search" name="client_search" id="client_search"/>
		<input type="submit" name="search" id="search" value="Search">	
	 </form>

	<div id="select_client_div">
		<label for="select_client">Select Student: </label>
		<select id="select_client" name="select_client" class="select_dropdown">	
			<option value="Select One">Select One</option>
			<option value="Test Student">Select One</option>
		</select>  
	</div>

	<div id="select_product_div">
		<label for="select_product">Select Package / Subscription: </label>
		<select id="select_product" class="select_dropdown">
			<option value="package">Select One</option>
		</select> 
	</div>

	<div id="select_class_div">
		<label for="select_class">Select Class: </label>
		<select id="select_class" class="select_dropdown">
			<option value="class">Select One</option>
		</select>
	</div>

	<div id="select_pay_method_div">
	  <label for="select_pay_method">Select Payment Method: </label>
	  <select id="select_pay_method" class="select_dropdown">
		<option value="select">Select One</option>
		<option value="Credit Card (online)">Credit Card (online)</option>
		<option value="Credit Card (Terminal)">Credit Card (Terminal)</option>
		<option value="Cash">Cash</option>
		<option value="Bank Transfer">Bank Transfer</option>
	  </select> 
	</div>

	<button type="button" id="buy_package_debug" class="buy_package" disabled>BUY PACKAGE</button>
	<button type="button" id="buy_class" disabled>BUY CLASS</button>

	<div id="select_codes_div">
		<label id="select_code_label" for="select_code_del">Select Code for Student: </label>
		<select id="select_code_del" class="select_dropdown">
			<option value="code">Select One</option>
		</select>  
	</div>

	<button type="button" id="get_codes" disabled>GET CODES</button>
	<button type="button" id="delete_code" disabled>DELETE CODE</button>
	<br>
	<button type="button" id="get_student_list">GET STUDENT LIST</button>

	<div id="loading"></div>
	<div id="error_message"></div>
	<div id="show_results"></div>

	<div id="show_student_list"></div>
		<table id="student_list" class="display" style="width:100%">
			<thead>
				<tr>
					<th>First Name</th>
					<th>Last Name</th>
					<th>Certificate</th>
					<th>Label</th>					
				</tr>
			</thead>			
		</table>
	</div>

	<div id="debug_output_select" class="hide"></div>
	<div id="debug_output_api" class="hide"></div>
</div>
</body>

<script type="text/javascript">
$( () => {
    // Declare global API call variables
    var debug_msg = "";
    var err_msg = "";
    var debug = true;

    var $debug_output = $('#debug_output_api');
	var $error_output = $('#error_message');
	var $results_output = $('#show_results');

    var clients = [];
    var products = [];
    var classes = [];
    var certificates = [];
    var deleteCodeResult = [];

    async function initApiCall(func) {
        if (debug) {
            debug_msg += `<br>Starting initApiCall: ${func}`;
            $debug_output.html(debug_msg);
        }	

        // Initialize parameters for API call
        switch (func) {
            case 'clients_search':
                var searchTerm = $('#client_search').val();			
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
                var selected_class = $('#select_class').prop('selectedIndex');	
                var classId = classes[selected_class].id;
                var params = {		
                    appointmentTypeID: classId
                };
                break;
            case 'appointments_create':
                var selected_class = $('#select_class').prop('selectedIndex');
                var selected_client = $('#select_client').prop('selectedIndex');
                var classTime = $('#buy_class').data('classTime');
                var classId = classes[selected_class].id;            
                var client_firstName = clients[selected_client].firstName;
                var client_lastName = clients[selected_client].lastName;
                var client_email = clients[selected_client].email;
                var client_phone = clients[selected_client].phone;
                var params = {
                    method: "POST",
                    datetime: classTime,
                    appointmentTypeID: classId,
                    firstName: client_firstName,
                    lastName: client_lastName,
                    email: client_email,
                    phone: client_phone
                };
                break;
            case 'certificates_get':
                var selected_client = $('#select_client').prop('selectedIndex');
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
                var selected_product = $('#select_product').prop('selectedIndex');
                var productId = products[selected_product].id;		
                var selected_client = $('#select_client').prop('selectedIndex');
                var client_email = clients[selected_client].email;			
                var params = {
                    method: "POST",
                    productID: productId,
                    email: client_email
                };
                break;
			case 'appointments_get':
				var minDate = '2019-01-06';
				var maxDate = '2019-01-06';
                var maxResults = 100;                
                var params = {
                    minDate,
					maxDate,
					max: maxResults
                };
                break;
			default:
                console.log(`ERROR: Function not found: ${func}`);
                err_msg += "Problem with initApiCall function";
                $error_output.html(err_msg);
                return false;
        }
        
        // Make API call
        try {		
            if (debug) {			
                debug_msg += `<br><b>Starting API call: ${func}..</b>`;
                $debug_output.html(debug_msg);
            }
            var funcToCall = func.split('_')[0];
            console.log(`Starting API call: ${func}`);
            console.log(params);
            return await callAPI(funcToCall, params);
        } catch (e) {
            console.log(`ERROR: Error returned from callAPI function: ${func}`);
            console.log (e);
            if (debug) {
                debug_msg += `<br>${func} XHR responseText if error: ${e.responseText}`;
                $debug_output.html(debug_msg);
            }
            return e;
        }
    }

    async function callAPI(func, params) {
        var $loading = $('#loading');
		// var apiHost = 'https://66.96.208.44:3443/api/acuity'; // GREG
        var apiHost = 'https://greg-monster.dreamdanceyoga.com:3443/api/acuity'; // GREG COMPUTER
        // var apiHost = 'https://api.dreamdanceyoga.com:3444/api/acuity'; // AWS UAT API
        
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
            debug_msg += `<br>STARTED CALL API FUNCTION<br>Function: ${func}<br>URL: ${url}`;
            $debug_output.html(debug_msg);	
        }
        
        try {	
            let result = await $.ajax({
                method: "GET",
                crossDomain: true,
                url: url,
                datatype: "json",
                beforeSend: function() { $loading.html('<div id="load"><h2><b>LOADING - PLEASE WAIT</b></h2></div>'); },
                success: function(response, status, xhr) {
                    console.log(response);			
                    if (debug) {
                        debug_msg += `<br><b>API RESPONSE SUCCESSFUL</b><br>Function: ${func}`;				
                        $debug_output.html(debug_msg);
                        console.log('Status:');
                        console.log(status);
                        console.log('XHR:');
                        console.log(xhr);
                    }
                },
                error: function(xhr, status, error) {
                    console.log(`ERROR: API call error: ${func}`);
                    console.log(error);
                    if (debug) {
                        debug_msg += `<br><b>API FAIL</b><br>Function: ${func}<br>XHR status: ${xhr.status}<br>XHR statusText: ${xhr.statusText}<br>XHR responseText: ${xhr.responseText}`;
                        $debug_output.html(debug_msg);
                    }
                },
                complete: function(response) {			
                    $('#load').remove();				
                    if (debug) {
                        debug_msg += `<br><b>API CALL COMPLETE</b><br>Function: ${func}`;
                        $debug_output.html(debug_msg);
                    }
                },
                timeout: 10000
            });
            return result;
        } catch (e) {
            console.log(`ERROR: Error detected in first level API call: ${func}`);
            console.error(e);
            if (debug) {
                debug_msg += `<br><b>ERROR CAUGHT</b><br>Function: ${func}<br>Response text: ${e.responseText}`;
                $debug_output.html(debug_msg);
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

    function clearDropdown($drop) {
        // Empty dropdown menu if it exists	
        $drop.empty();
        $drop.append($('<option>').text('Select One').attr('value', 'Select One'));	
    }

    //// EVENTS ////

	if (debug) {
			$('#debug').removeClass('hide');
			$('#debug_output_api').removeClass('hide').addClass('debug-output');
			debug_msg = `<b>Debug mode ON</b>`;			
			$debug_output.html(debug_msg);
	}
	
	// EVENT (DEBUG): Display selected options on change
	if (debug) {		
		$('.select_dropdown').change(function() {
			$('#debug_output_select').removeClass('hide').addClass('debug-output');	
			var $debug_output = $('#debug_output_select');		
			var student = $('#select_client').val();
			var pay_method = $('#select_pay_method').val();
			var product = $('#select_product').val();
			var myclass = $('#select_class').val();
			var msg2 = '<b>Select Menu Debug</b>';
			msg2 += '<br>Student selected: ' + student;
			msg2 += '<br>Product: ' + product;
			msg2 += '<br>Class: ' + myclass;
			msg2 += '<br>Payment method: ' + pay_method;
			$debug_output.html(msg2);		
		});
	}	
	
	// EVENT: Search button submit
	$('#search_client').on('submit', async (e) => {
		e.preventDefault();
		$('#search').prop('disabled', true).addClass('disabled');
		var $debug_output = $('#debug_output_api');
		
		// Clear any error message
		err_msg = "";
		$error_output.html(err_msg);
		
		if (debug) {			
			debug_msg += `<br>Submit invoked on search_client`;
			$debug_output.html(debug_msg);
		}

		// API call to retrieve client data
		try {
			var funcType = "clients_search";
			clients = await initApiCall(funcType);
			if (debug) {
				debug_msg += `<br>Completed initApicall: ${func}`;
				$debug_output.html(debug_msg);
				console.log('Clients:');
				console.log(clients);
			}
			// If successful populate dropdown menu
			var $dropdown = $('#select_client');
			var func = "clients";
			populateDropdown($dropdown, clients, func);
		}
		catch(e) {
			console.log(`ERROR: Error detected in initApiCall: ${funcType}`);
			console.log (e);
			if (e.responseText === "No records returned") {
				err_msg += `<b>Student not found, please try again!</b>`;
				$error_output.html(err_msg);
			} else {
				err_msg += `<b>An error occured, please check and try again</b><br>`;
				$error_output.html(err_msg);
			}
			var $dropdown = $('#select_client');
			clearDropdown($dropdown);
		}
		
		// API call to retrieve products data
		try {
			var funcType = "products_get";
			products = await initApiCall(funcType);
			if (debug) {
				debug_msg += `<br>Completed initApicall: ${func}`;
				$debug_output.html(debug_msg);
				console.log('Products:');
				console.log(products);
			}
			// If successful populate dropdown menu
			var $dropdown = $('#select_product');
			var func = "products";
			populateDropdown($dropdown, products, func);
		}
		catch(e) {
			console.log(`ERROR: Error detected in initApiCall: ${funcType}`);
			console.log (e);
			err_msg += `<b>An error occured retrieving products, please check and try again</b><br>`;
			$error_output.html(err_msg);
		}

		// API call to retrieve classes data
		try {
			var funcType = "appointment-types_get";
			classes = await initApiCall(funcType);
			if (debug) {
				debug_msg += `<br>Completed initApicall: ${func}`;
				$debug_output.html(debug_msg);
				console.log('Classes:');
				console.log(classes);
			}		
			// If successful populate dropdown menu
			var $dropdown = $('#select_class');
			var func = "appointment-types";
			populateDropdown($dropdown, classes, func);
			// Enable buttons
			$('#get_codes').prop('disabled', false);
			$('.buy_package').prop('disabled', false);
			$('#buy_class').prop('disabled', false);
		}
		catch(e) {
			console.log(`ERROR: Error detected in initApiCall: ${funcType}`);
			console.log (e);
			err_msg += `<b>An error occured retrieving list of classes, please check and try again</b><br>`;
			$error_output.html(err_msg);
		}
		$('#search').prop('disabled', false).removeClass('disabled');
	});	
	
	// EVENT: Populate student name in codes label on name change
	$('#select_client').change(function() {		
		var selected_client = $('#select_client').val();
		$('#select_code_label').text(`Select code for ${selected_client}`);
	});	

	// EVENT: Get Codes button click
	$('#get_codes').on('click', async (e) => {
		e.preventDefault();	
		
		// Clear any error message
		err_msg = "";
		$error_output.html(err_msg);

		// API call to retrieve certificates
		try {
			var funcType = "certificates_get";
			certificates = await initApiCall('certificates_get');
			// If successful populate dropdown menu
			var $dropdown = $('#select_code_del');
			var func = "certificates";
			populateDropdown($dropdown, certificates, func);
			// Enable DELETE CODE button
			$('#delete_code').prop('disabled', false);
		}
		catch(e) {
			console.log(`ERROR: Error detected in initApiCall: ${funcType}`);
			console.log (e);
			if (e.responseText === "No records returned") {
				err_msg += `<b>No certificates found!</b>`;
				$error_output.html(err_msg);
			} else {
				err_msg += `<b>An error occured retrieving certificate codes, please check and try again</b><br>`;
				$error_output.html(err_msg);
			}		
			var $dropdown = $('#select_code_del');
			clearDropdown($dropdown);
		}
	});

	// EVENT: DELETE CODE button click
	$('#delete_code').on('click', async (e) => {
		e.preventDefault();
		$('#delete_code').prop('disabled', true);
		
		// Clear any error message
		err_msg = "";
		$error_output.html(err_msg);

		if (debug) {
			debug_msg += "<br><b>clicked DELETE CODE button...</b>";
			$debug_output.html(debug_msg);
		}
		
		// Confirm deletion
		var codeNameToDelete = $('#select_code_del').find(':selected').text().split(': ')[0];
		var codeToDelete = $('#select_code_del').find(':selected').text().split(': ')[1];
		var selectedStudent = $('#select_client').val();
		var confirmText = `Are you SURE you want to delete the below package code?\nPackage Name: ${codeNameToDelete}\nCode: ${codeToDelete}\nStudent: ${selectedStudent}`;
		if (confirm(confirmText)) {
			// API call to DELETE CODE
			var $dropdown = false;
			var func = "certificates";
			var funcType = "certificates_del";
			var selected_cert = $('#select_code_del').val();
			try {
				deleteCodeResult = await initApiCall(funcType);
				if (debug) {
					console.log('Delete Code Result:');
					console.log(deleteCodeResult);
				}
				// IF successful - API call to REFRESH CODES
				var $dropdown = $('#select_code_del');
				var func = "certificates";
				var funcType = "certificates_get";
				try {
					certificates = await initApiCall('certificates_get');				
					populateDropdown($dropdown, certificates, func);											
					alert(`Code Deleted!\nCode: ${selected_cert}`);
				}
				catch(e) {
					console.log(`ERROR: Error detected in initApiCall: ${funcType}`);
					console.log (e);
					err_msg += `<b>An error occured retrieving certificate codes, please check and try again</b><br>`;
					$error_output.html(err_msg);
				}
			}
			catch(e) {
				console.log(`ERROR: Error detected in initApiCall: ${funcType}`);
				console.log (e);
				err_msg += `<b>An error occured deleting certificate, please check and try again</b><br>`;
				$error_output.html(err_msg);
			}
		}
		$('#delete_code').prop('disabled', false);
	});

	// EVENT: BUY PACKAGE button click
	$('.buy_package').on('click', async (e) => {
		e.preventDefault();
		$('.buy_package').prop('disabled', true);
		
		// Clear any error message
		err_msg = "";
		$error_output.html(err_msg);

		if (debug) {
			debug_msg += "<br><b>clicked BUY PACKAGE button...</b>";
			$debug_output.html(debug_msg);
		}
		
		// API call to CREATE CODE
		try {		
			var funcType = "certificates_create";
			var generateCertResult = await initApiCall(funcType);						
			// IF successful - API call to REFRESH CODES		
			try {			
				certificates = await initApiCall('certificates_get');		
				// Populate select dropdown with client results
				var $dropdown = $('#select_code_del');		
				var func = "certificates";
				var funcType = "certificates_get";
				populateDropdown($dropdown, certificates, func);
				// Enable DELETE CODE button
				$('#delete_code').prop('disabled', false);
				var pay_method = $('#select_pay_method').find(':selected').text();
				alert(`Code Created!\nCode: ${generateCertResult.certificate}\nPayment Method: ${pay_method}`);
			}
			catch(e) {
				console.log(`ERROR: Error detected in initApiCall: ${funcType}`);
				console.log (e);
				err_msg += `<b>An error occured retrieving certificate codes, please check and try again</b><br>`;
				$error_output.html(err_msg);
			}
		}
		catch(e) {
			console.log(`ERROR: Error detected in initApiCall: ${funcType}`);
			console.log (e);
			err_msg += `<b>An error occured creating certificate code, please check and try again</b><br>`;
			$error_output.html(err_msg);
		}
		$('.buy_package').prop('disabled', false);
	});
    
    // EVENT: BUY CLASS SERIES button click
	$('#buy_class').on('click', async (e) => {
		e.preventDefault();
		$('#buy_class').prop('disabled', true);
		
		// Clear any error message
		err_msg = "";
		$error_output.html(err_msg);

		if (debug) {
			debug_msg += "<br><b>clicked BUY CLASS button...</b>";
			$debug_output.html(debug_msg);
		}
		
        // API call to BOOK CLASS
        // Check if class type = SERIES
        var selected_class = $('#select_class').prop('selectedIndex');
        var classType = classes[selected_class].type;        
        if (classType === "series") {
            try {                
                var funcType = "availability--classes_get";
                var classTimes = await initApiCall(funcType);                
                // Once we have all class times, loop through each and book
                try {
                    var bookClass = [];
                    var funcType = "appointments_create";
                    for (var i = 0; i < classTimes.length; i++) {                    
                        $('#buy_class').data('classTime', classTimes[i].time);
                        bookClass[i] = await initApiCall(funcType);
                        if (debug) {
                            console.log(`Booked class ${i}:`);
                            console.log(bookClass[i]);
                        }
                    }
                    var pay_method = $('#select_pay_method').find(':selected').text();
                    alert(`Classes Booked!\nSeries Name: ${bookClass[0].type}\nFirst Class: ${bookClass[0].datetime}\nPayment Method: ${pay_method}`);
                }
                catch(e) {
                    console.log(`ERROR: Error detected in initApiCall: ${funcType}`);
                    console.log (e);
                    err_msg += `<b>An error occured booking class, please check and try again</b><br>`;
                    $error_output.html(err_msg);
                }
            }
            catch(e) {
                console.log(`ERROR: Error detected in initApiCall: ${funcType}`);
                console.log (e);
                err_msg += `<b>An error occured retrieving class times, please check and try again</b><br>`;
                $error_output.html(err_msg);
            }
        } else {         
            console.log(`ERROR: Class is not a series`);                
            err_msg += `<b>Class is not a series, you can only book a series, not a single class.  Please try again.</b><br>`;
            $error_output.html(err_msg);                
        }
		$('#buy_class').prop('disabled', false);
	});

	// EVENT: GET STUDENT LIST button click
	$('#get_student_list').on('click', async (e) => {
		e.preventDefault();
		
		// Clear any error message
		err_msg = "";
		$error_output.html(err_msg);

		if (debug) {
			debug_msg += "<br><b>clicked BUY CLASS button...</b>";
			$debug_output.html(debug_msg);
		}

		// API call to get list of students (for next / selected class)
		try {
			var funcType = "appointments_get"
			var appointmentsResult = await initApiCall(funcType);
			// message = `First result is: ${appointmentsResult[0].firstName}`
			// $results_output.html(message);
			$('#student_list').DataTable({
				"data": appointmentsResult,
				"columns": [
					{ "data": "firstName"},
					{ "data": "lastName"},
					{ "data": "certificate"}
					// { "data": "labels.name"}
				]
			});
		}
		catch(e) {
			console.log(`ERROR: Error detected in initApiCall: ${funcType}`);
			console.log (e);
			err_msg += `<b>An error occured retrieving student list, please check and try again</b><br>`;
			$error_output.html(err_msg);
		}
	});
});
</script>
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<!-- DATATABLES TEST -->
<script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/1.10.19/js/jquery.dataTables.js"></script>
<!-- END DEV/TEST -->
</html>