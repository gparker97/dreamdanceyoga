<h3>GREG TEST API</h3>

<form id="search_client" action="" method="post">
  <p>Enter name: 
    <input type="search" name="client_search" id="client_search"/>
    <input type="submit" name="search" id="search" value="search">
  </p>
 </form>

<div id="select_client_div">
  <p>Select Student:
	<select id="select_client" class="select_dropdown">  
		<option value="student">Select One</option>    
	</select>  
  </p>
</div>

<div id="select_product_div">
 <p>Select Package / Subscription:
	<select id="select_product" class="select_dropdown">
		<option value="package">Select One</option>
	</select>
 </p>
</div>

<div id="select_class_div">
 <p>Select Class:
	<select id="select_class" class="select_dropdown">
		<option value="class">Select One</option>
	</select>
 </p>
</div>

<div id="select_pay_method_div">
 <p>Select Payment Method:
  <select id="select_pay_method" class="select_dropdown">
    <option value="select">Select One</option>
    <option value="Credit Card (online)">Credit Card (online)</option>
    <option value="Credit Card (Terminal)">Credit Card (Terminal)</option>
    <option value="Cash">Cash</option>
    <option value="Bank Transfer">Bank Transfer</option>
  </select>
 </p>
</div>

<button type="button" id="get_codes_button">GET CODES</button>
<button type="button" id="buy_button">BUY</button>

<div id="select_codes_div">
 <p>Select Code to Delete:
	<select id="select_code_del" class="select_dropdown">
		<option value="code">Select One</option>
	</select>
 </p>
</div>

<button type="button" id="delete_code_button">DELETE CODE</button>

<div id="loading"></div>
<div id="error_message"></div>
<div id="show_results"></div>
<div id="debug_output_select"></div>
<div id="debug_output_api"></div>

<script type="text/javascript">
apiHost = 'https://66.96.208.44:3443/api/acuity';
debug_msg = "";
err_msg = "";
debug = true;

$debug_output = $('#debug_output_api');
$error_output = $('#error_message');

// Declare global API call variables
var clients = [];
var products = [];
var classes = [];
var certificates = [];
var deleteCodeResult = [];

async function callAPI(func, params) {
	// Loop through params and build API call URL
	var $loading = $('#loading');
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
	
	if (debug) {
		debug_msg += `<br>INSIDE CALL API FUNCTION<br>Function: ${func}<br>URL: ${url}`;		
		$debug_output.html(debug_msg);	
	}
	
	try {	
		let result = await $.ajax({
			method: "GET",
			crossDomain: true,
			url: url,
			datatype: "json",
			beforeSend: function() { $loading.html('<div id="load"><b>LOADING...</b></div>').hide().fadeIn(100); },
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
					$drop.append($('<option>').text(`${data[i].name} Code: ${data[i].certificate}`).attr('value', data[i].id));
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

// MAIN //

// EVENT: Search button submit
$('#search_client').on('submit', async (e) => {
	e.preventDefault();
	var $debug_output = $('#debug_output_api');
	
	// Clear any error message
	err_msg = "";
	$error_output.html(err_msg);
	
	if (debug) {
		debug_msg = `<b>Debug mode ON</b>`;
		debug_msg += `<br>Submit invoked on search_client`;
		$debug_output.html(debug_msg);
	}

	// API call to retrieve client data with FUNCTION	
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
			err_msg += `<b>An error occured, please check and try again</b>`;
			$error_output.html(err_msg);
		}
		var $dropdown = $('#select_client');
		clearDropdown($dropdown);
	}
	
	// API call to retrieve products data with FUNCTION	
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
		err_msg += `<b>An error occured retrieving products, please check and try again</b>`;
		$error_output.html(err_msg);
	}

	// API call to retrieve classes data with FUNCTION	
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
	}
	catch(e) {
		console.log(`ERROR: Error detected in initApiCall: ${funcType}`);
		console.log (e);
		err_msg += `<b>An error occured retrieving list of classes, please check and try again</b>`;
		$error_output.html(err_msg);
	}	
});


if (debug) {
	// Display selected options on change
	$('.select_dropdown').change(function() {
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

// EVENT: Get Codes button click
$('#get_codes_button').on('click', async (e) => {
	e.preventDefault();	
	
	// Clear any error message
	err_msg = "";
	$error_output.html(err_msg);

	// API call to retrieve certificates with FUNCTION	
	try {
		var funcType = "certificates_get";
		certificates = await initApiCall('certificates_get');
		// If successful populate dropdown menu
		var $dropdown = $('#select_code_del');		
		var func = "certificates";
		populateDropdown($dropdown, certificates, func);
	}
	catch(e) {
		console.log(`ERROR: Error detected in initApiCall: ${funcType}`);
		console.log (e);
		err_msg += `<b>An error occured retrieving certificate codes, please check and try again</b>`;
		$error_output.html(err_msg);
	}
});

// EVENT: DELETE CODE button click
$('#delete_code_button').on('click', async (e) => {
	e.preventDefault();
	
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
		// API call to DELETE CODE with FUNCTION
		var $dropdown = false;
		var func = "certificates";
		var funcType = "certificates_del";
		try {
			deleteCodeResult = await initApiCall(funcType);
			if (debug) {
				console.log('Delete Code Result:');
				console.log(deleteCodeResult);
			}			
			// IF successful			
			// API call to REFRESH CODES
			var $dropdown = $('#select_code_del');
			var func = "certificates";
			var funcType = "certificates_get";
			try {
				certificates = await initApiCall('certificates_get');				
				populateDropdown($dropdown, certificates, func);				
				if (debug) {
					if (typeof deleteCodeResult != 'undefined') {
						console.log('DELETECODERESTULT IS NOT UNDEFINED');
						console.log(deleteCodeResult);
					} else {
						console.log('DELETECODERESTULT IS UNDEFINED');					
					}
					while (typeof deleteCodeResult == 'undefined') {
						setTimeout( () => {
							if (debug) {
								console.log('Waiting for deleteCodeResult to be defined...');
							}						
						}, 250);
					}
				}				
				alert(`Code Deleted!\nCode: ${deleteCodeResult[0].certificate}`);
			}
			catch(e) {
				console.log(`ERROR: Error detected in initApiCall: ${funcType}`);
				console.log (e);
				err_msg += `<b>An error occured retrieving certificate codes, please check and try again</b>`;
				$error_output.html(err_msg);
			}
		}
		catch(e) {
			console.log(`ERROR: Error detected in initApiCall: ${funcType}`);
			console.log (e);
			err_msg += `<b>An error occured deleting certificate, please check and try again</b>`;
			$error_output.html(err_msg);
		}
    }	
});

// EVENT: BUY button click
$('#buy_button').on('click', async (e) => {
	e.preventDefault();
	
	// Clear any error message
	err_msg = "";
	$error_output.html(err_msg);

	if (debug) {
		debug_msg += "<br><b>clicked BUY button...</b>";
		$debug_output.html(debug_msg);
	}
	
	// API call to CREATE CODE with FUNCTION
	try {		
		var funcType = "certificates_create";
		var generateCertResult = await initApiCall(funcType);
		// IF successful				
		// API call to REFRESH CODES		
		try {			
			certificates = await initApiCall('certificates_get');		
			// Populate select dropdown with client results
			var $dropdown = $('#select_code_del');		
			var func = "certificates";
			var funcType = "certificates_get";
			populateDropdown($dropdown, certificates, func);
			var pay_method = $('#select_pay_method').find(':selected').text();
			alert(`Code Created!\nCode: ${generateCertResult.certificate}\nPayment Method: ${pay_method}`);
		}
		catch(e) {
			console.log(`ERROR: Error detected in initApiCall: ${funcType}`);
			console.log (e);
			err_msg += `<b>An error occured retrieving certificate codes, please check and try again</b>`;
			$error_output.html(err_msg);
		}
	}
	catch(e) {
		console.log(`ERROR: Error detected in initApiCall: ${funcType}`);
		console.log (e);
		err_msg += `<b>An error occured creating certificate code, please check and try again</b>`;
		$error_output.html(err_msg);
	}	
});
</script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>