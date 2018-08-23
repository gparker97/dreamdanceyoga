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
<div id="debug_output_api"></div>
<div id="debug_output_select"></div>

<script type="text/javascript">
apiHost = 'https://66.96.208.44:3443/api/acuity';
debug_msg = "";
err_msg = "";
debug = true;

$loading = $('#loading');
$debug_output = $('#debug_output_api');
$error_output = $('#error_message');

// async function callAPI(func, qId, qParam, params, $dropdn) {
async function callAPI(func, params, $dropdn) {
	// Build API call URL
	// NOTE: BUILD with method and multiple query parameters
	// url = `${apiHost}/${func}/${method} IF NOT GET/?${qId1}=${qParam1}&${qId2}=${qParam2}$ etc...`;
	/*
	if (qParam) {
		var url = `${apiHost}/${func}?${qId}=${qParam}`;
	} else {
		var url = `${apiHost}/${func}`;
	}
	*/
	
	// Loop through params and build API call URL
	var url = `${apiHost}/${func}`;	
	var count = 1;	
	$.each(params, (key, value) => {
		if (count === 1) {
			url += `?${key}=${value}`;
			count++;
		}
		else {
			url += `&${key}=${value}`;
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
		success: function(response) {
			console.log(response);			
			if (debug) {
				debug_msg += `<br><b>API RESPONSE SUCCESSFUL</b><br>Function: ${func}`;				
				$debug_output.html(debug_msg);
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
		console.error(e);
		if (debug) {
			debug_msg += `<br><b>ERROR CAUGHT</b><br>Function: ${func}<br>Response text: ${e.responseText}`;
			$debug_output.html(debug_msg);
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
		debug_msg = `Debug mode ON`;
		debug_msg += `<br>Submit invoked on search_client`;
		$debug_output.html(debug_msg);
	}

	// API call to retrieve client list
	err_msg = "";
	$error_output.html(err_msg);	
	var func = "clients";	
	var queryId = "search";
	var queryParam = $('#client_search').val();
	var searchTerm = $('#client_search').val();	
	var params = {
		search: searchTerm
	};
	var $dropdown = $('#select_client');
	if (debug) {
		debug_msg += `<br><b>Starting clients call..</b>`;
		debug_msg += `<br>Params.search: ${params.search}`;
		$debug_output.html(debug_msg);
	}	
	try {
		err_msg = "";
		$error_output.html(err_msg);
		// clients = await callAPI(func, queryId, queryParam, params, $dropdown);
		clients = await callAPI(func, params, $dropdown);		
		console.log(clients);
		if (debug) {
			debug_msg += `<br>Clients: ${clients}`;	
			$debug_output.html(debug_msg);
		}		
		// Populate select dropdown with client results
		populateDropdown($dropdown, clients, func);
	} catch (e) {
		console.log (e);
		err_msg = `<b>Problem with ${func}, please check and try again</b>`;
		$error_output.html(err_msg);
		if (debug) {
			debug_msg += `<br>${func} XHR responseText if error: ${e.responseText}`;
			$debug_output.html(debug_msg);
		}		
	}	
	
	// TEMP debug
	// throw new error('stopping here');
	
	// API CALL for products
	var func = 'products';
	var queryId = false;
	var queryParam = false;
	var params = {};	
	var $dropdown = $('#select_product');	
	if (debug) {
		debug_msg += `<br><b>Starting products call..</b>`;
		$debug_output.html(debug_msg);
	}	
	try {
		// products = await callAPI(func, queryId, queryParam, params, $dropdown);
		products = await callAPI(func, params, $dropdown);
		console.log(products);
		if (debug) {
			debug_msg += `<br>Products: ${products}`;
			$debug_output.html(debug_msg);
		}		
		// Populate select dropdown with client results
		populateDropdown($dropdown, products, func);
	} catch (e) {
		console.log(e);
		err_msg = `<b>Problem with ${func}, please check and try again</b>`;
		$error_output.html(err_msg);
		if (debug) {
			debug_msg += `<br>${func} XHR responseText if error: ${e.responseText}`;
			$debug_output.html(debug_msg);
		}
	}	

	// API CALL for classes
	var func = 'appointment-types';
	var queryId = false;
	var queryParam = false;
	var params = {};
	var $dropdown = $('#select_class');	
	if (debug) {
		debug_msg += `<br><b>Starting classes call..</b>`;
		$debug_output.html(debug_msg);
	}	
	try {		
		// classes = await callAPI(func, queryId, queryParam, params, $dropdown);
		classes = await callAPI(func, params, $dropdown);
		console.log(classes);
		if (debug) {
			debug_msg += `<br>Classes: ${classes}`;
			$debug_output.html(debug_msg);
		}		
		// Populate select dropdown with client results
		populateDropdown($dropdown, classes, func);
	} catch (e) {
		console.log(e);
		err_msg = `<b>Problem with ${func}, please check and try again</b>`;
		$error_output.html(err_msg);
		if (debug) {
			debug_msg += `<br>${func} XHR responseText if error: ${e.responseText}`;
			$debug_output.html(debug_msg);
		}
	}	
});

if (debug) {
	// Display selected options on change
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

// EVENT: Get Codes button click
$('#get_codes_button').on('click', async (e) => {
	e.preventDefault();	
	
	var func = "certificates";
	var queryId = "email";
	var selected_client = $('#select_client').prop('selectedIndex');
	var client_email = clients[selected_client].email;
	var queryParam = clients[selected_client].email;
	var params = {		
		email: client_email
	};
	var $dropdown = $('#select_code_del');		
	
	if (debug) {
		debug_msg += `<h2>clicked GET CODES button!</h2>`;
		debug_msg += `<br>selected_client: ${selected_client}`;
		debug_msg += `<br>queryParam: ${queryParam}`;				
		debug_msg += `<br><b>Starting get codes call for email..</b>`;
		$debug_output.html(debug_msg);
	}
		
	try {
		// var certificates = await callAPI(func, queryId, queryParam, params, $dropdown);
		certificates = await callAPI(func, params, $dropdown);
		if (debug) { console.log(certificates);	}
		// Populate select dropdown with client results
		populateDropdown($dropdown, certificates, func);
	} catch (e) {
		console.log(e);
		if (debug) {
			debug_msg += `<br>${func} XHR responseText if error: ${e.responseText}`;
			$debug_output.html(debug_msg);
		}		
	}	
});

// EVENT: DELETE CODE button click
$('#delete_code_button').on('click', async (e) => {
	e.preventDefault();
	
	if (debug) {
		debug_msg += "<br><b>clicked DELETE CODE button...</b>";
		$debug_output.html(debug_msg);
	}
	
	var func = "certificates";
	var selected_cert = $('#select_code_del').prop('selectedIndex');
	var certId = certificates[selected_cert].id;			
	var params = {
		method: "DELETE",
		id: certId
	};
	var $dropdown = false;
	
	if (debug) { 
		debug_msg += "<br>Deleting code...";
		// debug_msg += `<br>Query ID 1: ` + Object.keys(params[0]) + `<br>Query Param 1: ${params.productID}<br>Query ID 2: ` + ${Object.keys(params[1]} + `<br>Query Param 2: ${params.email}`;
		// debug_msg += JSON.stringify(params);
		$debug_output.html(debug_msg);
	}
	try {
		err_msg = "";
		$error_output.html(err_msg);
		// var generateCertResult = await callAPI(func, queryId1, queryParam1, params, $dropdown);
		var deleteCodeResult = await callAPI(func, params, $dropdown);
		if (debug) { 
			console.log(deleteCodeResult);
			debug_msg += `<br>${func} XHR responseText if error: ${e.responseText}`;
			debug_msg += `<br>Code deletion successful!<br>Package name: ${deleteCodeResult.name}<br>Code: ${deleteCodeResult.certificate}<br>`;
			$debug_output.html(debug_msg);
			alert(`Code Deleted!  Code: ${generateCertResult.certificate}`);
		}
	} catch (e) {
		console.log(e);
		err_msg = `<b>Problem with ${func}, please check and try again</b>`;
		$error_output.html(err_msg);
		if (debug) {
			debug_msg += `<br>${func} XHR responseText if error: ${e.responseText}`;
			$debug_output.html(debug_msg);
		}		
	}
});

// EVENT: BUY button click
$('#buy_button').on('click', async (e) => {
	e.preventDefault();
	
	if (debug) {
		debug_msg += "<br><b>clicked BUY button...</b>";
		$debug_output.html(debug_msg);
	}
	
	var func = "certificates";
	var selected_product = $('#select_product').prop('selectedIndex');
	var productId = products[selected_product].id;		
	var selected_client = $('#select_client').prop('selectedIndex');
	var client_email = clients[selected_client].email;
	var queryId1 = "productID";
	var queryParam1 = productId;
	var queryId2 = "email";	
	var queryParam2 = client_email;	
	var params = {
		method: "POST",
		productID: productId,
		email: client_email
	};
	var $dropdown = false;
	
	if (debug) { 
		debug_msg += "<br>Starting cerificate code generation...";
		// debug_msg += `<br>Query ID 1: ` + Object.keys(params[0]) + `<br>Query Param 1: ${params.productID}<br>Query ID 2: ` + ${Object.keys(params[1]} + `<br>Query Param 2: ${params.email}`;
		// debug_msg += JSON.stringify(params);
		$debug_output.html(debug_msg);
	}
	try {
		err_msg = "";
		$error_output.html(err_msg);
		// var generateCertResult = await callAPI(func, queryId1, queryParam1, params, $dropdown);
		var generateCertResult = await callAPI(func, params, $dropdown);
		if (debug) {
			console.log(generateCertResult);
			debug_msg += `<br>${func} XHR responseText if error: ${e.responseText}`;
			debug_msg += `<br>Code generation successful!<br>Package name: ${generateCertResult.name}<br>Code: ${generateCertResult.certificate}<br>`;
			$debug_output.html(debug_msg);
			alert(`Code Generated!  Code: ${generateCertResult.certificate}`);			
		}
	} catch (e) {
		console.log(e);
		err_msg = `<b>Problem with ${func}, please check and try again</b>`;
		$error_output.html(err_msg);
		if (debug) {
			debug_msg += `<br>${func} XHR responseText if error: ${e.responseText}`;
			$debug_output.html(debug_msg);
		}
	}
});
</script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>