<!DOCTYPE html>
<html lang="en">
	<head>
		<!--link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous"-->
		<link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
		<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.10.19/css/jquery.dataTables.css">
		<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.3/css/all.css" integrity="sha384-UHRtZLI+pbxtHCWp1t77Bi1L4ZtiqrqD80Kn4Z8NTSRyMA2Fd33n5dQ8lWUE00s/" crossorigin="anonymous">
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
		
		.margin {
			margin: 5px
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
            padding: 30px 25px;
            margin: 10px;
            text-align: center;
			display: inline-block;			
		}
		
		.card h3 {
			font-size: 150%;
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
			<h3><strong><i class="fas fa-gift fa-3x"></i><br>BUY PACKAGE / SUBSCRIPTION</strong></h3>
		</div>
	</a>
	
	<a href="#">
		<div id="buy_class_top" class="card">
			<h3><strong><i class="fas fa-cubes fa-3x"></i><br>BUY CLASS SERIES</strong></h3>
		</div>
	</a>
	
	<a href="#">
		<div id="buy_single_class_top" class="card">
			<h3><strong><i class="fas fa-cube fa-3x"></i><br>BUY SINGLE CLASS</strong></h3>
		</div>
	</a>

	<a href="#">
		<div id="view_student_package_top" class="card">
			<h3><strong><i class="fas fa-glasses fa-3x"></i><br>VIEW STUDENT PACKAGES</strong></h3>
		</div>
	</a>
	
	<a href="#">
		<div id="checkin_table_top" class="card">
			<h3><strong><i class="fas fa-table fa-3x"></i><br>STUDENT CHECK-IN</strong></h3>
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
			<option value="none">NONE (No Charge)</option>
			<option value="cc-online">Credit Card ONLINE (Acuity)</option>
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

    <div id="generate_checkin_table_div" class="details-item hide">
        <!-- Dropdown to hold upcoming classes to generate student check-in list -->
        <div id="upcoming_classes_div">
            <label for="upcoming_classes_dropdown" id="upcoming_classes_dropdown_label" class="form-label">Today's classes: </label>
            <select id="upcoming_classes_dropdown" class="dropdown">
                <option value="class">Select One</option>
            </select>
		</div>
		<div id="select_upcoming_class_date_div">
			<p>Or select another date: <input type="text" id="checkin_datepicker" class="margin"></p>
        </div>
    </div>

	<!-- JQUERY UI MODAL CONTAINER -->
	<div id="modal_output"></div>
	
	<!-- Submit buttons -->
	<input type="submit" id="buy_package_submit" class="submit-button hide" value="BUY PACKAGE" />
	<input type="submit" id="buy_class_submit" class="submit-button hide" value="BUY CLASS" />
	<input type="submit" id="buy_single_class_submit" class="submit-button hide" value="BUY SINGLE CLASS" />
	<input type="submit" id="view_packages_submit" class="submit-button hide" value="VIEW PACKAGES" />
	<input type="submit" id="add_to_class_submit" class="submit-button hide" value="ADD TO CLASS" />	
	<button type="button" id="generate_checkin_table_submit" class="submit-button hide" disabled>GENERATE CHECK-IN TABLE</button>
</div>

<div id="error_message"></div>
<div id="spacer"><br><br></div>
<div id="environment" class="env"></div>
<div id="debug_output" class="hide"></div>
</body>

<script type="text/javascript">
{
$( () => {
	// Setup script
	const environment = 'PROD';
	const version = '1.0.3b';
	
	// Arrays to cache Acuity API call responses (avoid making multiple calls)
	var clients = [];
    var products = [];
    var certificates = [];
    var upcoming_classes = [];

	// Decalre var to dold array of div/button elements to clean up
	var $revealedElements = [];

	// Debug mode
    if (environment === 'UAT') {
        var debug = true;
    } else {
        var debug = false;
    }

    // Override default debug settings
    // const debug = true;

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
		cleanUp($revealedElements);
		
		// Reveal details div and append action type
		$detailsContainer = $('#details');
		$detailsTop = $('#details-top');
		$revealedElements = revealElement($detailsContainer, $revealedElements);
		
		switch (action) {
			case 'buy_class_top':
				$detailsTop.html('<h2>BUY A CLASS SERIES</h2><hr/>');
				$('#search_student_div').data('action', e.currentTarget.id);
				products = await retrieveProductsClasses(action, $revealedElements);
				break;
			case 'buy_single_class_top':
				$detailsTop.html('<h2>BUY A SINGLE CLASS</h2><hr/>');
				$('#search_student_div').data('action', e.currentTarget.id);
				products = await retrieveProductsClasses(action, $revealedElements);
				break;
			case 'buy_package_top':
				$detailsTop.html('<h2>BUY A PACKAGE / SUBSCRIPTION</h2><hr/>');
				$('#search_student_div').data('action', e.currentTarget.id);
				products = await retrieveProductsClasses(action, $revealedElements);
				break;
			case 'view_student_package_top':
				$detailsTop.html('<h2>VIEW STUDENT PACKAGES</h2><hr/>');
				// Reveal student search form and store action
				$revealedElements = revealElement($('#search_student_div'), $revealedElements);
				$('#search_student_form').focus();
				$('#search_student_div').data('action', e.currentTarget.id);
				// AUTOCOMPLETE TEST
				// var studentNames = ['Greg Parker', 'Sophia Meng', 'Larry Parker', 'Grace Meng', 'Zhifen Liang'];
				// console.log('Enabling autocompelte with array: ', studentNames);
				// $('#search_student_form').autocomplete({source: studentNames});
				// END AUTOCOMPLETE TEST
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
            case 'checkin_table_top':
                $detailsTop.html('<h2>STUDENT CHECK-IN LIST</h2><hr/>');
                // Reveal dropdown table and store action				
				$('#generate_checkin_table_div').data('action', e.currentTarget.id);
                // Make API call to retrieve today's classes
                upcoming_classes = await retrieveUpcomingClasses(action, $revealedElements);
				console.log('Upcoming Classes:', upcoming_classes);
				// Show datepicker to select past class if required
				$("#checkin_datepicker").datepicker({
					showOn: "button",
					buttonImage: "https://sophiadance.squarespace.com/s/calendar-tiny.gif",
					buttonImageOnly: true,
					buttonText: ''
				});
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
				$revealedElements = revealElement($('#search_student_dropdown_div'), $revealedElements);
				var action = $('#search_student_div').data('action');
				switch (action) {
					case 'buy_class_top':
					case 'buy_package_top':
                        $revealedElements = revealElement($('#select_package_class_div'), $revealedElements);
						break;
					case 'view_student_package_top':
                        $revealedElements = revealElement($('#view_packages_submit'), $revealedElements);					
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
        var generateCertResult = await buyPackage(products, clients);
        console.log('Generate cert result: ', generateCertResult);
        
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
            var buySeriesResult = await buySeries(products, clients);
            console.log('buySeries result: ', buySeriesResult);
		} else {
			// FUTURE - reveal datepicker and buy single class
			// var buyClassResult = await buyClass();
			console.log(`ERROR: Class is not a series`);
			var message = { title: "ERROR", body: "<b>You can only book a class series, not a single class.<br>Please try again.</b>" };
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
        var certificates = await retrieveCertificates(clients);
        
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
		$('#view_packages_submit').prop('disabled', false).removeClass('disabled');
	});

	// EVENT: BUY SINGLE CLASS SUBMIT
	$('#buy_single_class_submit').on('click', async (e) => {
		e.preventDefault();
		console.log(`Event captured: ${e.currentTarget.id}`);
		console.log(e);        
        // Clear any error message		
		writeMessage('error', "");

		// Find the array index of the selected product / package and extract expiry date to determine if package or subscription
        var selectedClassVal = $('#select_package_class_dropdown').val();
        var selectedClass = $.grep(products, (i) => {
            return i.name === selectedClassVal;
        });
        console.log('Selected Class: ', selectedClass);
		
		// Open new tab with direct link to product in Acuity
		var productURL = selectedClass[0].schedulingUrl;
		var win = window.open(productURL, '_blank');		
	});

	// EVENT: Select package dropdown change - reveal payment method button
	$('#select_package_class_dropdown').change( (e) => {
		e.preventDefault();
		console.log(`Event captured: ${e.currentTarget.id}`);
		console.log(e);		

		// Make payment method dropdown visible or single class submit button
		var action = $('#search_student_div').data('action');
		switch (action) {
			case 'buy_class_top':
			case 'buy_package_top':
				$element = $('#payment_method_div');
				$revealedElements = revealElement($element, $revealedElements);
				break;
			case 'buy_single_class_top':
				$element = $('#buy_single_class_submit');
				$revealedElements = revealElement($element, $revealedElements);
				break;
		}
		
	});

	// EVENT: Select payment method dropdown change - reveal submit button
	$('#payment_method_dropdown').change( (e) => {
		e.preventDefault();
		console.log(`Event captured: ${e.currentTarget.id}`);
		console.log(e);
		
		// Retrieve requested action (buy class or package)
		var action = $('#search_student_div').data('action');
		
		$dropdown = $('#payment_method_dropdown');
		switch (action) {
			case 'buy_class_top':
				$element = $('#buy_class_submit');
				break;
			case 'buy_package_top':
				$element = $('#buy_package_submit');
				break;
		}

		// Disable Xero invoice creation if no payment method
		if ($dropdown.val() === "none") {
			$('#create_invoice_checkbox').prop('checked', false);
			$('#apply_payment_checkbox').prop('checked', false);
		} else {
			$('#create_invoice_checkbox').prop('checked', true);
			$('#apply_payment_checkbox').prop('checked', true);
		}

		if (debug) {
			console.log('Payment method dropdown val: ', $dropdown.val());
		}

		// Once payment method is chosen make submit button visible
		if ($dropdown.val() != 'select') {
			$element.prop('disabled', false).removeClass('disabled');
			$revealedElements = revealElement($element, $revealedElements);
		} else {
			$element.prop('disabled', true).addClass('disabled');
		}
	});
	
	// EVENT: Generate check-in table dropdown change - reveal generate table button
	$('#upcoming_classes_dropdown').change( (e) => {
		e.preventDefault();
		console.log(`Event captured: ${e.currentTarget.id}`);
		console.log(e);

		// Reveal and enable checkin table button unless dropdown value is "select one"
		$dropdown = $('#upcoming_classes_dropdown');
		$element = $('#generate_checkin_table_submit');
		
		if (debug) {
			console.log('Upcoming classes dropdown val: ', $dropdown.val());
		}

		if ($dropdown.val() === 'Select One') {
			$element.prop('disabled', true).addClass('disabled');
		} else {			
			$element.prop('disabled', false).removeClass('disabled')
			$revealedElements = revealElement($element, $revealedElements);
		}
	});

	// EVENT: Find past date datepicker change - if user selects a past date, trigger search for classes on that day
	$('#checkin_datepicker').change( async (e) => {
		e.preventDefault();
		console.log(`Event captured: ${e.currentTarget.id}`);
		console.log(e);

		if (debug) {
            writeMessage('debug', "<br><b>Caught change in find class date datepicker...</b>");
		}		

		// Store selected date		
		selectedDate = $('#checkin_datepicker').datepicker('getDate');
		classDate = $.datepicker.formatDate('yy/mm/dd', selectedDate);
		console.log('Selected class date is: ', classDate);		
		
		// Make API call to retrieve selected day's classes and populate dropdown
		action = 'pastDate';
		upcoming_classes = await retrieveUpcomingClasses(action, $revealedElements);
		console.log('Upcoming Classes:', upcoming_classes);
	});

    // EVENT: GENERATE CHECK-IN TABLE button click
	$('#generate_checkin_table_submit').on('click', async (e) => {
		e.preventDefault();
		console.log(`Event captured: ${e.currentTarget.id}`);
		console.log(e);
        // Clear any error message
		writeMessage('error', "");

		if (debug) {
            writeMessage('debug', "<br><b>clicked GENERATE CHECK-IN TABLE button...</b>");
		}

		try {
			// Retrieve all appointments for selected class
			// Capture selected class index and class date from parent page to pass to child window
			var classDate = $('#checkin_datepicker').datepicker('getDate');
			
			var selected_class = $('#upcoming_classes_dropdown').prop('selectedIndex');
			var selected_class_index = selected_class - 1;
			
			var selectedAppointments = await retrieveAppointments(upcoming_classes, classDate, selected_class_index);
			console.log('Appointments result: ', selectedAppointments);

			// IF successful and students are scheduled, open a new window to build the student check-in table
			if (selectedAppointments !== 'None') {				
				// Open new window
				if (environment === 'UAT') {
					winName = 'checkin-window-uat';
				} else {
					winName = 'checkin-window';			
				}
				var win = window.open(winName, '_blank', 'fullscreen=yes');
				// var w = window.open("popup-table-uat", "Dream Dance and Yoga Student Check-In", "menubar='no',toolbar='no',location='no',width=" + screen.availWidth + ",height=" + screen.availHeight);
				if (win) {
					win.focus();					
					// Pass local vars to child window
					window.debug = debug;
					window.environment = environment;
					window.upcoming_classes = upcoming_classes;
					window.classDate = classDate;
					window.selected_class_index = selected_class_index;
					
					// Clear date value from label
					$('#checkin_datepicker').val('');
				} else {
					alert('Please enable pop-ups to view the student check-in table');
				}				
			} else {
				var message = { title: 'ERROR', body: "No students scheduled for that class, please try again." };
				writeMessage('modal', message);		
			}
		}
		catch(e) {
			var message = { title: 'ERROR', body: "Error retrieving appointments, please try again." };
			writeMessage('modal', message);	
		}
	});
});
}
</script>
<!-- Acuity Client Functions -->
<script src="https://sophiadance.squarespace.com/s/acuityApiClientFunctions-PROD.js"></script>
<!-- JQUERY / JQUERY UI -->
<!--script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script-->
<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js" integrity="sha256-VazP97ZCwtekAsvgPBSUwPFKdrwD3unUfSGVYrahUqU=" crossorigin="anonymous"></script>
<!-- BOOTSTRAP -->
<!--script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script-->
<!--script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script-->
<!-- END PROD -->
</html>