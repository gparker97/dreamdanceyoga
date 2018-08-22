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
    <option value="cc_acuity">Credit Card (Acuity)</option>
    <option value="cc_terminal">Credit Card (Terminal)</option>
    <option value="cash">Cash</option>
    <option value="bank_xfer">Bank Transfer</option>
  </select>
 </p>
</div>

<button type="button" id="buy_button">BUY</button>
<button type="button" id="get_codes_button">GET CODES</button>

<div id="select_codes_div">
 <p>Select Code to Delete:
	<select id="select_code_del" class="select_dropdown">
		<option value="code">Select One</option>
	</select>
 </p>
</div>

<div id="loading"></div>
<div id="error_message"></div>
<div id="debug_output_api"></div>
<div id="debug_output_select"></div>
<div id="debug_output_buy"></div>

<script type="text/javascript">
var msg = "";
var err_msg = "";
var debug = true;
var $error_output = $('#error_message');

async function callAPI(func, qId, qParam, $dropdn) {	
	let result;
	var $debug_output = $('#debug_output_api');
	var $loading = $('#loading');	
	var apiHost = 'https://66.96.208.44:3443/api/acuity';	
		
	// Build API call URL
	if (qParam) {
		var url = `${apiHost}/${func}?${qId}=${qParam}`;
	} else {
		var url = `${apiHost}/${func}`;
	}
	
	msg += `<br>INSIDE CALL API FUNCTION<br>Function: ${func}<br>Query: ${qId}<br>Param: ${qParam}<br>URL: ${url}`;
	$debug_output.html(msg);
	
	try {	
		result = await $.ajax({
		method: "GET",
		crossDomain: true,
		url: url,
		datatype: "json",
		beforeSend: function() { $loading.html('<div id="load"><b>LOADING...</b></div>').hide().fadeIn(100); },
		success: function(response) {
			console.log(response);			
			if (debug) {
				msg += `<br><b>API RESPONSE SUCCESSFUL</b><br>Function: ${func}`;				
				$debug_output.html(msg);
			}
		},
		error: function(xhr, status, error) {			
			console.log(error);			
			// Set error message for users			
			switch (xhr.responseText) {
				case 'No records returned':
					err_msg = "<b>Student not found, please try again</b>";
					break;
				default:
					err_msg = `<b>An error occured with ${func}, please try again</b>`;
			}
			$error_output.html(err_msg);			
			// Empty dropdown menu 
			if ($dropdn) {
				$dropdn.empty();
				$dropdn.append($('<option>').text('Select One').attr('value', 'Select One'));			
			}

			if (debug) {				
				msg += `<br><b>API FAIL</b><br>Function: ${func}<br>XHR status: ${xhr.status}<br>XHR statusText: ${xhr.statusText}<br>XHR responseText: ${xhr.responseText}`;
				$debug_output.html(msg);
			}
		},
		complete: function(response) {			
			$('#load').remove();
			
			if (debug) {
				msg += `<br><b>API CALL COMPLETE</b><br>Function: ${func}`;
				$debug_output.html(msg);
			}
		},
		timeout: 10000
	});
	return result;
	} catch (e) {
		console.error(e);
		if (debug) {
			msg += `<br><b>ERROR CAUGHT</b><br>Function: ${func}<br>Response text: ${e.responseText}`;
			$debug_output.html(msg);
		}
		return e;
	}
}

function populateDropdown($drop, list, fun) {	
	$drop.empty();
	switch(fun) {
		case 'clients':
			$.each(list, function(i, value) {				
				$drop.append($('<option>').text(`${list[i].firstName} ${list[i].lastName}`).attr('value', `${list[i].firstName} ${list[i].lastName}`));
			});
			break;
		case 'products':
		case 'appointment-types':
			$.each(list, function(i, value) {				
				$drop.append($('<option>').text(list[i].name).attr('value', list[i].name));
			});
			break;		
		case 'certificates':
			$.each(list, function(i, value) {				
				$drop.append($('<option>').text(`${list[i].name} Code: ${list[i].certificate}`).attr('value', list[i].id));
			});
			default:
			console.log('Unable to populate dropdown');
	}
}

// EVENT: Search button submit
$('#search_client').on('submit', async (e) => {
	var $debug_output = $('#debug_output_api');
	e.preventDefault();
	
	if (debug) {
		msg += `Debug mode ON`
		msg += `<br>Submit invoked on search_client`
		$debug_output.html(msg);
	}

	// API call to retrieve client list	
	msg = "";
	err_msg = "";
	$error_output.html(err_msg);
	var func = "clients";
	var queryId = "search";
	var queryParam = $('#client_search').val();
	var $dropdown = $('#select_client');
	if (debug) {
		msg += `<br><b>Starting clients call..</b>`;
		$debug_output.html(msg);
	}	
	try {
		clients = await callAPI(func, queryId, queryParam, $dropdown);
		console.log(clients);
		if (debug) {
			msg += `<br>Clients: ${clients}`;	
			$debug_output.html(msg);
		}		
		// Populate select dropdown with client results
		populateDropdown($dropdown, clients, func);
	} catch (e) {
		console.log (e);
		msg += `<br>${func} XHR responseText if error: ${e.responseText}`;
		$debug_output.html(msg);
	}	
	
	// API CALL for products
	var func = 'products';
	var queryId = false;
	var queryParam = false;
	var $dropdown = $('#select_product');	
	if (debug) {
		msg += `<br><b>Starting products call..</b>`;
		$debug_output.html(msg);
	}	
	try {
		products = await callAPI(func, queryId, queryParam, $dropdown);
		console.log(products);
		if (debug) {
			msg += `<br>Products: ${products}`;
			$debug_output.html(msg);
		}		
		// Populate select dropdown with client results
		populateDropdown($dropdown, products, func);
	} catch (e) {
		console.log(e);
		msg += `<br>${func} XHR responseText if error: ${e.responseText}`;
		$debug_output.html(msg);
	}	

	// API CALL for classes
	var func = 'appointment-types';
	var queryId = false;
	var queryParam = false;
	var $dropdown = $('#select_class');	
	if (debug) {
		msg += `<br><b>Starting classes call..</b>`;
		$debug_output.html(msg);
	}	
	try {
		classes = await callAPI(func, queryId, queryParam, $dropdown);
		console.log(classes);
		if (debug) {
			msg += `<br>Classes: ${classes}`;
			$debug_output.html(msg);
		}		
		// Populate select dropdown with client results
		populateDropdown($dropdown, classes, func);
	} catch (e) {
		console.log(e);
		msg += `<br>${func} XHR responseText if error: ${e.responseText}`;
		$debug_output.html(msg);
	}	
});

if (debug) {
	// Display selected options
	$('.select_dropdown').change(function() {
		var $debug_output = $('#debug_output_select');		
		var student = $('#select_client').val();
		var pay_method = $('#select_pay_method').val();
		var product = $('#select_product').val();				
		var msg2 = '<p>Student selected: ' + student;
		msg2 += '<br>Payment method: ' + pay_method;
		msg2 += '<br>Product: ' + product + '</p>';
		$debug_output.html(msg2);		
	});
}

// EVENT: BUY button click
$('#buy_button').on('click', async (e) => {
	e.preventDefault();
	var $debug_output = $('#debug_output_buy');
	
	if (debug) { 
		var msg_buy = "<h2>clicked buy button!</h2>";
		$debug_output.html(msg_buy).hide().fadeIn(500);
	}
});

// EVENT: Get Codes button click
$('#get_codes_button').on('click', async (e) => {
	e.preventDefault();
	var $debug_output = $('#debug_output_buy');
	
	var func = "certificates";
	var queryId = "email";
	//var queryParam = email_address;	
	var selected_client = $('#select_client').prop('selectedIndex');	
	var queryParam = clients[selected_client].email;
	var $dropdown = $('#select_code_del');		
	
	if (debug) {
		var msg_buy = "<h2>clicked GET CODES button!</h2>";
		msg_buy += `<br>selected_client: ${selected_client}`;
		msg_buy += `<br>queryParam: ${queryParam}`;				
		msg_buy += `<br><b>Starting get codes call for email..</b>`;
		$debug_output.html(msg_buy);
	}
		
	try {
		var certificates = await callAPI(func, queryId, queryParam, $dropdown);
		if (debug) {
			console.log(certificates);
			msg_buy += `<br>Certificates: ${certificates}`;
			msg_buy += `<br>Certificate name: ${certificates[0].name}`;
			msg_buy += `<br>Certificate ID: ${certificates[0].id}`;
			msg_buy += `<br>Certificate code: ${certificates[0].certificate}`;
			$debug_output.html(msg_buy)
		}
		// Populate select dropdown with client results
		populateDropdown($dropdown, certificates, func);
	} catch (e) {
		console.log(e);
		msg += `<br>${func} XHR responseText if error: ${e.responseText}`;
		$debug_output.html(msg);
	}	
});	
</script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>