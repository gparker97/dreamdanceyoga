<!DOCTYPE html>
<html lang="en">
	<head>
		<!--link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous"-->
		<style type="text/css">		
		.one-third {
			max-width: 33%;
			display: inline-block;
		}
		
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

		#top_level_options {
			text-align: center;
		}

		.card {		    
			background-color: #F2F2F2;
			box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
			transition: 0.3s;
			border-radius 5px;
			padding: 25px;
			margin: 10px;
			display: inline-block;
		}
		
		.card:hover {
			box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
		}	
		
		/* BOOTSTRAP ADDITIONAL STYLES
		
		.card-columns {
			column-count: 3;
		}
		
		/*
		body {
			font-family: futura-pt;
			font-weight: 400;
			font-style: normal;
			font-size: 15px;
			letter-spacing: 0em;
			color: #454545;
		}

		a {
			color: rgba(128,0,0,.9) !important;			
		}
		
		h2 {
			font-family: Arial,Helvetica,sans-serif;
			font-weight: 700;
			font-size: 24px;
			line-height: 1.2em;
			font-family: hypatia-sans-pro;
			font-weight: 400;
			font-style: normal;
			font-size: 34px;
			letter-spacing: 0em;
			line-height: .9em;
			text-transform: none;
			color: rgba(128,0,0,.9);
		}

		h3 {
			font-family: Arial,Helvetica,sans-serif;
			font-weight: 700;
			font-size: 18px;
			letter-spacing: 0em;
			text-transform: none;
			font-family: futura-pt;
			font-weight: 400;
			font-style: normal;
			font-size: 14px;
			letter-spacing: .22em;
			line-height: 1.2em;
			text-transform: uppercase;
			color: rgba(128,0,0,.9);
		}
		*/		
		</style>
	</head>
<body>

<div id="top_level_options">
	<a href="#">
		<div id="buy_subscription_top" class="card">
			<h2>BUY SUBSCRIPTION</h2>
		</div>
	</a>
	
	<a href="#">
		<div id="buy_package_top" class="card">
			<h2>BUY PACKAGE</h2>
		</div>
	</a>
	
	<a href="#">
		<div id="book_class_top" class="card">
			<h2>BOOK CLASS</h2>
		</div>
	</a>
	
	<a href="#">
		<div id="view_student_package_top" class="card">
			<h2>VIEW STUDENT PACKAGES</h2>
		</div>
	</a>
	
	<a href="#">
		<div id="add_to_class_top" class="card">
			<h2>ADD TO CLASS</h2>
		</div>	
	</a>
</div>

<div id="search_student_div" class="one-third hide">
	<form id="search_student" action="" method="post">  
		<label for="search_student">Enter Student Name: </label>
		<input type="search" name="search_student_form" id="search_student_form" />
		<input type="submit" name="search_submit" id="search_submit" value="Search" />	
	 </form>
</div>

<div id="search_student_dropdown_div" class="one-third hide">
	<label for="search_student_dropdown">Select Student: </label>
	<select id="search_student_dropdown" name="search_student_dropdown" class="dropdown">
		<option value="Select One">Select One</option>	
	</select>
</div>

<div id="select_package_class_div" class="one-third hide">
	<label for="select_package_class_dropdown">Select Package / Subscription: </label>
	<select id="select_package_class_dropdown" class="dropdown">
		<option value="package">Select One</option>
	</select> 
</div>

<div id="package_price_div" class="one-third hide">
	<p>Select Package Price Here</p>
</div>


<div id="payment_method_div" class="one-fourth hide">
	<p>Select Payment Method Here</p>
</div>

<button type="button" id="buy_package" class="buy_package hide">BUY PACKAGE</button>

<div id="debug" class="hide">
	<h3>ACUITY PRODUCTION API CLIENT DEBUG</h3>
	
	<form id="search_client_debug" action="" method="post">  
		<label for="search_client_debug">Enter Name: </label>
		<input type="search" name="search_client_form_debug" id="search_client_form_debug" />
		<input type="submit" name="search_debug" id="search_debug" value="Search" />	
	 </form>

	<label for="select_client">Select Student: </label>
	<select id="select_client" name="select_client" class="select_dropdown">	
		<option value="Select One">Select One</option>
		<option value="Test Student">Select One</option>
	</select>
	

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
	<button type="button" id="book_class" disabled>BOOK CLASS</button>

	<div id="select_codes_div">
		<label id="select_code_label" for="select_code_del">Select Code for Student: </label>
		<select id="select_code_del" class="select_dropdown">
			<option value="code">Select One</option>
		</select>  
	</div>

	<button type="button" id="get_codes" disabled>GET CODES</button>
	<button type="button" id="delete_code" disabled>DELETE CODE</button>

	<div id="loading"></div>
	<div id="error_message"></div>
	<div id="show_results"></div>
	<div id="debug_output_select" class="hide"></div>
	<div id="debug_output_api" class="hide"></div>
</div>
</body>

<script type="text/javascript">
{
// Declare global API call variables
var apiHost = 'https://66.96.208.44:3443/api/acuity';
var debug_msg = "";
var err_msg = "";
var debug = true;

var $debug_output = $('#debug_output_api');
var $error_output = $('#error_message');

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

async function callAPI(func, params) {
	var $loading = $('#loading');
	
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

//// MAIN ////
$( () => {
	if (debug) {
			$('#debug').removeClass('hide')
			$('#debug_output_api').removeClass('hide').addClass('debug-output');
			debug_msg = `<b>Debug mode ON</b>`;			
			$debug_output.html(debug_msg);
	}
	
	// EVENT (DEBUG): Display selected options on change
	if (debug) {		
		$('.select_dropdown').change( function() {
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
	
	// EVENT: TOP LEVEL BUY PACKAGE CLICK
	$('#buy_package_top').on('click', async (e) => {
		e.preventDefault();
		$('#search_student_div').removeClass('hide');
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
			var $dropdown = $('#select_package_class_dropdown');
			var func = "products";
			populateDropdown($dropdown, products, func);
		}
		catch(e) {
			console.log(`ERROR: Error detected in initApiCall: ${funcType}`);
			console.log (e);
			err_msg += `<b>An error occured retrieving products, please check and try again</b><br>`;
			$error_output.html(err_msg);
		}
	});	
	
	// EVENT: Search Student button submit PROD
	$('#search_student').on('submit', async (e) => {
		e.preventDefault();
		$('#search_submit').prop('disabled', true).addClass('disabled');
		$('#search_student_dropdown_div').removeClass('hide');
		var $debug_output = $('#debug_output_api');
		
		// Clear any error message
		err_msg = "";
		$error_output.html(err_msg);
		
		if (debug) {			
			debug_msg += `<br>Submit invoked on search_student`;
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
			var $dropdown = $('#search_student_dropdown');
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
			var $dropdown = $('#search_student_dropdown');
			clearDropdown($dropdown);
		}
		$('#search_submit').prop('disabled', false).removeClass('disabled');
	});	
	
	// EVENT: Search student dropdown change
	$('#search_student_dropdown').change( (e) => {
		e.preventDefault();
		if ($('this').val() != "Select One") {
			$('#select_package_class_div').removeClass('hide');
		} else {
			$('#select_package_class_div').addClass('hide');
		}
	});	
	
	// EVENT: Search button submit
	$('#search_client_debug').on('submit', async (e) => {
		e.preventDefault();
		$('#search_debug').prop('disabled', true).addClass('disabled');
		var $debug_output = $('#debug_output_api');
		
		// Clear any error message
		err_msg = "";
		$error_output.html(err_msg);
		
		if (debug) {			
			debug_msg += `<br>Submit invoked on search_client_debug`;
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
			$('#book_class').prop('disabled', false);
		}
		catch(e) {
			console.log(`ERROR: Error detected in initApiCall: ${funcType}`);
			console.log (e);
			err_msg += `<b>An error occured retrieving list of classes, please check and try again</b><br>`;
			$error_output.html(err_msg);
		}
		$('#search_debug').prop('disabled', false).removeClass('disabled');
	});	
	
	// EVENT: Populate student name in codes label on name change
	$('#select_client').change( (e) => {		
		e.preventDefault();
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

	// EVENT: BUY button click
	$('.buy_package').on('click', async (e) => {
		e.preventDefault();
		$('.buy_package').prop('disabled', true);
		
		// Clear any error message
		err_msg = "";
		$error_output.html(err_msg);

		if (debug) {
			debug_msg += "<br><b>clicked BUY button...</b>";
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
});
}
</script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js" integrity="sha256-VazP97ZCwtekAsvgPBSUwPFKdrwD3unUfSGVYrahUqU=" crossorigin="anonymous"></script>
<!--script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script-->
<!--script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script-->
</html>