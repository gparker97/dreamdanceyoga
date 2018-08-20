<h3>GREG TEST API</h3>

<form id="search_client" action="" method="post">
  <p>Enter name: 
    <input type="search" name="client_search" id="client_search"/>
    <input type="submit" name="search" id="search" value="Search">
  </p>
 </form>

<div id="select_client_div">
  <select id="select_client" class="select_dropdown">  
    <option value="Select Student">Select Student</option>    
  </select>  
</div>

<div id="select_product_div">
  <select id="select_product" class="select_dropdown">
    <option value="Select Product">Select Product</option>
  </select>
</div>

<div id="select_pay_method_div">
  <select id="select_pay_method" class="select_dropdown">
    <option value="select">Select Payment Method</option>
    <option value="cc_acuity">Credit Card (Acuity)</option>
    <option value="cc_terminal">Credit Card (Terminal)</option>
    <option value="cash">Cash</option>
    <option value="bank_xfer">Bank Transfer</option>
  </select>
</div>

<div id="client_results">
</div>

<div id="select_output">  
</div>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>

<script type="text/javascript">

var apiHost = 'https://66.96.208.44:3443/api/acuity';
var $content = $('#client_results');

function callAPI(funct1, queryId1, queryParam1, $menuLoc) {
	var msg = "";
	var $content = $('#client_results');
		
	if (queryParam1) {
		var url = `${apiHost}/${funct1}?${queryId1}=${queryParam1}`;
	} else {
		var url = `${apiHost}/${funct1}`;
	}
	
	msg += `<p>INSIDE CALL API FUNCTION<br>Parameter is ${queryParam1}<br>URL is ${url}</p>`;
	$content.html(msg);

	$.ajax({
		method: "GET",
		crossDomain: true,
		url: url,
		datatype: "jsonp",
		beforeSend: function() {
			$content.html('<div id="load">LOADING...</div>');
		},
		success: function(response) {
			//console.log(`First name is ${response[0].firstName}`);
			console.log(response);
			
			// Populate select dropdown with client results			
			if (funct1 === "clients") { populateDropdown($menuLoc, response); }			
			
			msg += "<br>API RESPONSE SUCCESSFUL<br>";
			
			//for (var i = 0; i < response.length; i++) {
			//	msg += `${response[i].firstName}'s email is ${response[i].email}<br>`;
			//}
			$content.html(msg);
		},
		error: function(xhr, status, error) {
			console.log(error);
			msg += "API FAIL and status is " + xhr.status + " and statusText is " + xhr.statusText;
			msg +=`<br>${xhr.responseText}`;
			$content.html(msg);
		},
		complete: function(response) {
			console.log(response);
			$('#load').remove();		
			msg += "<br>API CALL COMPLETE";
			$content.html(msg);
		},
		timeout: 5000
	});
}

function populateDropdown($location, list) {
	$location.empty();
			$.each(list, function(i, value) {
				$location.append($('<option>').text(`${list[i].firstName} ${list[i].lastName}`).attr('value', `${list[i].firstName} ${list[i].lastName}`));
			});
}

$('#search_client').on('submit', function(e) {
	e.preventDefault();

	// API call to retrieve client list
	var msg = "";
	var func = 'clients';
	var queryId = 'search';	
	var queryParam = $('#client_search').val();
	var $menu = $('#select_client');
	callAPI(func, queryId, queryParam, $menu);

	// API CALL for products
	var func = 'products';
	var queryId = false;
	var queryParam = false;
	var $menu = $('#select_product');
	msg += `Starting products call..`;
	$content.html(msg);
	callAPI(func, queryId, queryParam);
});

// Display selected options
$('.select_dropdown').change(function() {
	var student = $('#select_client').val();
	var pay_method = $('#select_pay_method').val();
	var product = $('#select_product').val();
	msg1 = '<p>Student selected is: ' + student;
	msg1 += '<br>Payment method is: ' + pay_method;
	msg1 += '<br>Product is: ' + product + '</p>';
	$('#select_output').html(msg1);
});

	/*
	$.ajax({
		method: "GET",
		crossDomain: true,
		url: url,
		datatype: "jsonp",
		beforeSend: function() {
			$content.html('<div id="load">LOADING...</div>');
		},
		success: function(response) {				
			console.log(`First name is ${response[0].firstName}`);
			
			// Populate select dropdown with client results
			$('#select_client').empty();
			$.each(response, function(i, value) {
				$('#select_client').append($('<option>').text(`${response[i].firstName} ${response[i].lastName}`).attr('value', `${response[i].firstName} ${response[i].lastName}`));
			});
			
			msg += "<br>API RESPONSE SUCCESSFUL<br>";
			var i;
			for (i = 0; i < response.length; i++) {
				msg += `${response[i].firstName}'s email is ${response[i].email}<br>`;
			}				
			$content.html(msg);
		},
		error: function(xhr, status, error) {
			console.log(error);
			msg += "API FAIL and status is " + xhr.status + " and statusText is " + xhr.statusText;
			msg +=`<br>${xhr.responseText}`;
			$content.html(msg);
		},
		complete: function(response) {
			console.log(response);
			$('#load').remove();		
			msg += "<br>API CALL COMPLETE";
			$content.html(msg);
		},
		timeout: 5000
	});	
});
	$.ajax({
		method: "GET",
		crossDomain: true,
		url: url,
		datatype: "jsonp",
		beforeSend: function() {
			$content.html('<div id="load">LOADING...</div>');
		},
		success: function(response) {				
			console.log(`First name is ${response[0].firstName}`);
			
			// Populate products dropdown with products
			$('#select_product').empty();
			$.each(response, function(i, value) {
				$('#select_product').append($('<option>').text(response[i].name).attr('value', response[i].name));
			});
			
			msg += "<br>API RESPONSE SUCCESSFUL<br>";
			$content.html(msg);
		},
		error: function(xhr, status, error) {
			console.log(error);
			msg += "API FAIL and status is " + xhr.status + " and statusText is " + xhr.statusText;
			msg +=`<br>${xhr.responseText}`;
			$content.html(msg);
		},
		complete: function(response) {
			console.log(response);
			$('#load').remove();		
			msg += "<br>API CALL COMPLETE";
			$content.html(msg);
		},
		timeout: 5000
	});
});
*/
</script>