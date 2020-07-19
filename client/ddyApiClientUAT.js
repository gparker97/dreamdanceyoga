<!DOCTYPE html>
<html lang="en">
	<head>
		<link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
		<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.10.19/css/jquery.dataTables.css">
		<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.3/css/all.css" integrity="sha384-UHRtZLI+pbxtHCWp1t77Bi1L4ZtiqrqD80Kn4Z8NTSRyMA2Fd33n5dQ8lWUE00s/" crossorigin="anonymous">
		<link rel="stylesheet" type="text/css" href="https://sophiadance.squarespace.com/s/loadingSpinner.css"></link>
		<link rel="stylesheet" type="text/css" href="https://sophiadance.squarespace.com/s/ddy-mystudio-UAT.css"></link>
	</head>
<body>

<!-- TOP LEVEL CARDS -->
<div id="top_level_options" class="top-cards">	
	<a href="#">
		<div id="buy_package_top" class="card">
			<h3><strong><i class="fas fa-gift fa-3x margin-small"></i><br>BUY PACKAGE / MEMBERSHIP</strong></h3>
		</div>
	</a>
	
	<a href="#">
		<div id="buy_class_top" class="card">
			<h3><strong><i class="fas fa-cubes fa-3x margin-small"></i><br>BUY CLASS SERIES</strong></h3>
		</div>
	</a>
	
	<a href="#">
		<div id="buy_single_class_top" class="card">
			<h3><strong><i class="fas fa-cube fa-3x margin-small"></i><br>BOOK SINGLE CLASS</strong></h3>
		</div>
	</a>

	<a href="#">
		<div id="book_private_class_top" class="card">
			<h3><strong><i class="fas fa-user-friends fa-3x margin-small"></i><br>BOOK PRIVATE / GROUP CLASS</strong></h3>
		</div>
	</a>

	<a href="#">
		<div id="view_student_package_top" class="card">
			<h3><strong><i class="fas fa-glasses fa-3x margin-small"></i><br>VIEW STUDENT INFO</strong></h3>
		</div>
	</a>
	
	<a href="#">
		<div id="checkin_table_top" class="card">
			<h3><strong><i class="fas fa-table fa-3x margin-small"></i><br>CHECK-IN TABLE</strong></h3>
		</div>
	</a>

	<a href="#">
		<div id="instructor_report_top" class="card">
			<h3><strong><i class="fas fa-graduation-cap fa-3x margin-small"></i><br>INSTRUCTOR REPORT</strong></h3>
		</div>
	</a>

	<a href="#">
		<div id="studio_metrics_top" class="card">
			<h3><strong><i class="fas fa-chart-bar fa-3x margin-small"></i><br>DDY STUDIO METRICS</strong></h3>
		</div>
	</a>
</div>

<!-- LOADER DIV -->
<div id="loader-div" class="lds-ring hide"><div></div><div></div><div></div><div></div></div>

<div id="details" class="details hide">
	<div id="details-top"></div>

	<!-- SEARCH STUDENT -->
	<div id="search_student_div" class="details-item hide">
		<form id="search_student" action="" method="post">  
			<label for="search_student" class="form-label">Search Student Name: </label>
			<input type="search" name="search_student_form" id="search_student_form" />
			<input type="submit" name="search_submit" id="search_submit" value="Search" />
		</form>
	</div>

	<!-- SEARCH STUDENT DROPDOWN -->
	<div id="search_student_dropdown_div" class="details-item hide">
		<label for="search_student_dropdown" class="form-label">Select Student: </label>
		<select id="search_student_dropdown" name="search_student_dropdown" class="dropdown">
			<option value="Select One">Select One</option>	
		</select>
	</div>

	<!-- SELECT PACKAGE/CLASS -->
	<div id="select_package_class_div" class="details-item hide">
		<label for="select_package_class_dropdown" class="form-label">Select Package / Class: </label>
		<select id="select_package_class_dropdown" class="dropdown">
			<option value="package">Select One</option>
		</select> 
	</div>

	<!-- PAYMENT METHOD -->
	<div id="payment_method_div" class="details-item hide">
		<label for="payment_method_dropdown" class="form-label">Select Payment Method: </label>
		<select id="payment_method_dropdown" class="select_dropdown">
			<option value="select">Select One</option>
			<option value="none">NONE (No Charge)</option>
			<option value="cc-online">Credit/Debit Card</option>
			<option value="cash">Cash</option>
			<option value="bankXfer-DDY">Bank Transfer DDY</option>
			<option value="bankXfer-Sophia">Bank Transfer Sophia POSB</option>
			<option value="wechat-pay">WeChat Pay</option>
		</select>
		<!-- PAYMENT OPTIONS -->
		<div id="payment_options_div" class="details-item hide">
			<input type="checkbox" name="create_invoice" id="create_invoice_checkbox" value="create_invoice" checked>
			<label for="create_invoice_checkbox">Create Invoice</label>
			<br>
			<input type="checkbox" name="apply_payment" id="apply_payment_checkbox" value="apply_payment" checked>
			<label for="apply_payment_checkbox">FULL Payment Received (If DEPOSIT, uncheck this box)</label>		
			
			<!-- DEPOSIT -->
			<div id="deposit_amount_div" class="details-item hide">
				<label for="deposit_amount"><strong>DEPOSIT Amount Received: </strong></label>
				<span class="currency-input">$ <input type="number" min="1" max="9999" step="1" id="deposit_amount" name="deposit_amount" value="0.00"></span>
			</div>
		
		</div>
	</div>

	<!-- UPDATE PRICE -->
	<div id="updated_price_div" class="details-item hide">
		<label for="updated_price"><strong>Updated / Discounted Price (Leave blank for original price): </strong></label>
		<span class="currency-input">$ <input type="number" min="1" max="9999" step="1" id="updated_price" name="updated_price"></span>
	</div>

	<!-- DDY EMPLOYEE COMMISSION -->
	<div id="employee_commission_div" class="details-item hide">
		<label for="employee_commission_dropdown" class="form-label">Sold by: </label>
		<select id="employee_commission_dropdown" class="select_dropdown">
			<option value="select">Select One</option>
		</select>
	</div>

	<!-- CONFIRMATION DIV -->
	<div id="confirm_details_div" class="details-item confirm-details hide"></div>

    <!-- CHECK-IN TABLE -->
	<div id="generate_checkin_table_div" class="details-item hide">
        <!-- Dropdown to hold upcoming classes to generate student check-in list -->
        <div id="upcoming_classes_div">
            <label for="upcoming_classes_dropdown" id="upcoming_classes_dropdown_label" class="form-label">Today's classes: </label>
            <select id="upcoming_classes_dropdown" class="dropdown">
                <option value="class">Select One</option>
            </select>
		</div>
		<div id="select_upcoming_class_date_div">
			<p><strong>OR</strong> Select another date: <input type="text" id="checkin_datepicker" class="margin" /></p>
        </div>
    </div>

	<!-- INSTRUCTOR REPORT -->
	<div id="instructor_report_div" class="details-item hide">
		<div id="select_instructor_report_date_div">
			<p>Select month: <input type="text" id="instructor_report_datepicker" class="margin" /></p>
        </div>		
    </div>

	<!-- STUDIO METRICS -->
	<div id="studio_metrics_div" class="inline-block hide">
		Start date: <input type="text" id="metrics_date_range_from" class="margin" />
		End date: <input type="text" id="metrics_date_range_to" class="margin" />
	</div>

	<!-- JQUERY UI MODAL CONTAINER -->
	<div id="modal_output"></div>

	<!-- Submit buttons -->
	<input type="submit" id="buy_package_submit" class="submit-button hide" value="BUY PACKAGE" />
	<input type="submit" id="buy_class_submit" class="submit-button hide" value="BUY CLASS" />
	<input type="submit" id="buy_single_class_submit" class="submit-button hide" value="BOOK CLASS" />
	<input type="submit" id="view_packages_submit" class="submit-button hide" value="VIEW PACKAGES" />
	<button type="button" id="generate_checkin_table_submit" class="submit-button hide" disabled>GENERATE CHECK-IN TABLE</button>
	<button type="button" id="get_instructor_report_submit" class="submit-button hide" disabled>GET INSTRUCTOR REPORT</button>
	<input type="submit" id="studio_metrics_submit" class="submit-button hide" value="GET STUDIO METRICS" />	
	
	<!-- INSTRUCTOR REPORT -->
	<div id="instructor_report_container_div" class="instructor-container hide">
		<br><hr><br>
		<div id="instructor_report_display_div" class="instructor-info"></div>
		<div id="instructor_report_display_details_div" class="instructor-table">
			<!-- Placeholder HTML table for instructor report details - populated by DataTable() -->    
			<table id="instructor_report_details_table" class="display table">
				<caption><h3 class="center"><strong>Class Details<hr></h3></strong></caption>
				<thead>
					<tr>
						<th>Name</th>
						<th>Check-in Time</th>
						<th>Late Check-in</th>
						<th>Class</th>
						<th>Date</th>
					</tr>
				</thead>
			</table>		
		</div>
	</div>
	
	<!-- STUDIO METRICS DATA-->
	<div id="studio_metrics_data_div" class="studio-metrics hide">
		<br><hr>
		<div id="ddy_card_1" class="ddy-card ddy-card-maroon"></div>
		<div id="ddy_card_2" class="ddy-card ddy-card-gold"></div>
		<div id="ddy_card_3" class="ddy-card ddy-card-silver"></div>
		<div id="ddy_card_4" class="ddy-card ddy-card-green"></div>
		<br><hr>
		<div id="metrics_data_chart_1" class="ddy-data"></div>
		<div id="metrics_data_chart_2" class="ddy-data"></div>
		<div id="metrics_data_chart_3" class="ddy-data"></div>
		<div id="metrics_data_chart_4" class="ddy-data"></div>
		<div id="metrics_data_chart_5" class="ddy-data"></div>
	</div>
</div>

<div class="spacer"></div>
<div id="environment" class="inline-block"></div>

<div class="spacer"></div>
<div id="error_message"></div>
<div id="debug_output" class="hide"></div>
</body>

<script type="text/javascript">
{
$( () => {
	'use strict';

	// Setup script
	const environment = 'UAT';
	
	// Arrays to cache Acuity API call responses (avoid making multiple calls)
	var clients = [];
    var products = [];
    var certificates = [];
	var upcoming_classes = [];
	var ddyInstructors = [];

	// Var to hold selected action
	var action = '';
	
	// Declare var to hold array of div/button elements to clean up
	var $revealedElements = [];

	// Declare var to hold popup window
	var win;

	// Var to hold submit button element and text
	var $submitButtonElement;
	var submitButtonText;
	
	// Set debug based on environment
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

	// Grab certificates and populate with relevant DDY info
	populateDDYInfo();
	
	// Fill in version and environment details at bottom of page
	populateEnvironment();	

	// EVENT: TOP LEVEL CARD CLICK
	$('.card').on('click', async (e) => {	
		e.preventDefault();
			
		// Store action
		action = e.currentTarget.id;
		console.log(`Event captured: ${action}`);
		console.log(e);
		
		// On any top level card click clean up and remove existing containers, buttons, etc
		cleanUp($revealedElements);
		
		// Reveal details div and append action type
		var $detailsContainer = $('#details');
		var $detailsTop = $('#details-top');
		$revealedElements = revealElement($detailsContainer, $revealedElements);

		// Clear student dropdown if it exists
		clearDropdown($('#search_student_dropdown'));
		
		switch (action) {
			case 'buy_class_top':
				$detailsTop.html('<h2>BUY A CLASS SERIES</h2><hr/>');
				$('#search_student_div').data('action', e.currentTarget.id);
				products = await retrieveProductsClasses(action, $revealedElements);
				break;
			case 'buy_single_class_top':
				$detailsTop.html('<h2>BOOK A SINGLE CLASS</h2><hr/>');
				$('#search_student_div').data('action', e.currentTarget.id);
				products = await retrieveProductsClasses(action, $revealedElements);
				break;
			case 'buy_package_top':
				$detailsTop.html('<h2>BUY A PACKAGE / MEMBERSHIP</h2><hr/>');
				$('#search_student_div').data('action', e.currentTarget.id);
				products = await retrieveProductsClasses(action, $revealedElements);
				break;
			case 'book_private_class_top':
				$detailsTop.html('<h2>BOOK A PRIVATE / GROUP CLASS</h2><hr/>');
				$('#search_student_div').data('action', e.currentTarget.id);
				products = await retrieveProductsClasses(action, $revealedElements);
				break;
			case 'view_student_package_top':
				$detailsTop.html('<h2>VIEW STUDENT INFO</h2><hr/>');
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
            case 'checkin_table_top':
                $detailsTop.html('<h2>CHECK-IN TABLE - SELECT CLASS</h2><hr/>');
                // Reveal dropdown table and store action
				$('#generate_checkin_table_div').data('action', e.currentTarget.id);
				// Clear date value from datepicker if one exists
				var selectedDate = $('#checkin_datepicker').val();
				if (selectedDate) { $('#checkin_datepicker').val(''); }
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
			case 'instructor_report_top':
				$detailsTop.html('<h2>INSTRUCTOR REPORT</h2><hr/>');
				var $element = $('#instructor_report_div');
				$revealedElements = revealElement($element, $revealedElements);
				
				// Show datepicker to select month to generate report
				// Month year only datepicker
				$("#instructor_report_datepicker").datepicker({
					showOn: "button",
					buttonImage: "https://sophiadance.squarespace.com/s/calendar-tiny.gif",
					buttonImageOnly: true,
					buttonText: '',
					changeMonth: true,
					changeYear: true,
					dateFormat: "M yy",
					showButtonPanel: true,
					currentText: "This Month",
					onChangeMonthYear: function (year, month, inst) {
						$(this).val($.datepicker.formatDate('M yy', new Date(year, month - 1, 1)));
					},
					onClose: function(dateText, inst) {
						var month = $(".ui-datepicker-month :selected").val();
						var year = $(".ui-datepicker-year :selected").val();
						$(this).val($.datepicker.formatDate('M yy', new Date(year, month, 1)));
						// Reveal and enable submit button
						var $element = $('#get_instructor_report_submit');
						$element.prop('disabled', false).removeClass('disabled');
						$revealedElements = revealElement($element, $revealedElements);
					}
				}).focus(function () {
					$(".ui-datepicker-calendar").hide();
				});
				
				// Clear date value from label if it exists
				$('#instructor_report_datepicker').val('');
				break;
			case 'studio_metrics_top':
				$detailsTop.html('<h2>DDY STUDIO METRICS</h2><hr/>');
				// Reveal datepicker
				var $element = $('#studio_metrics_div');
				$revealedElements = revealElement($element, $revealedElements);
				// Store action
				$element.data('action', e.currentTarget.id);
				// Clear date value from datepicker if one exists				
				$('#metrics_date_range_from').val('');
				$('#metrics_date_range_to').val('');
				// Show datepicker to select date range				
				var dateFormat = "mm/dd/yy";
				var from = $('#metrics_date_range_from').datepicker({
					showOn: "button",
					buttonImage: "https://sophiadance.squarespace.com/s/calendar-tiny.gif",
					buttonImageOnly: true,
					buttonText: '',
					defaultDate: "-1w",
					changeMonth: true,
					numberOfMonths: 1
					}).on('change', function() {
						to.datepicker('option', 'minDate', getDate(this));
					});
				var to = $('#metrics_date_range_to').datepicker({
					showOn: "button",
					buttonImage: "https://sophiadance.squarespace.com/s/calendar-tiny.gif",
					buttonImageOnly: true,
					buttonText: '',
					defaultDate: "-1d",
					changeMonth: true,
					numberOfMonths: 1
				}).on('change', function() {
					from.datepicker('option', 'maxDate', getDate(this));
				});			
				function getDate(element) {
					var date;
					try {
						date = $.datepicker.parseDate(dateFormat, element.value);
					} catch(e) {
						date = null;
					}			
					return date;
				}
				break;
            default:
				console.error('ERROR: Unsupported action');
		}
	});	
	
    // EVENT: ADD NEW STUDENT SUBMIT
	$('#add_new_student_submit').on('click', async (e) => {
		e.preventDefault();
		console.log(`Event captured: ${e.currentTarget.id}`);
		console.log(e);
        // Clear any error message		
		writeMessage('error', "");		
		
		if (debug) {
			writeMessage('debug', "<br><b>clicked ADD NEW STUDENT button...</b>");
        }

        // Gather student info and kick off process to create new student
		gatherNewStudentInfo();        
    });
    
    // EVENT: SEARCH STUDENT SUBMIT
	$('#search_student').on('submit', async (e) => {
        e.preventDefault();		
		if (debug) {
			writeMessage('debug', `<br>Submit invoked on search_student`);			
		}

        // Cache and disable search submit button, clear error messages
		writeMessage('error', "");
		var $searchSubmitButton = $('#search_submit');
		$searchSubmitButton.prop('disabled', true).addClass('disabled');
		
		// Retrieve student data
		try {
			clients = await retrieveStudents();
			if (clients) {
				// Reveal student dropdown menu and appropriate containers
				$revealedElements = revealElement($('#search_student_dropdown_div'), $revealedElements);
				var action = $('#search_student_div').data('action');
				switch (action) {
					case 'buy_single_class_top':
					case 'buy_class_top':
					case 'buy_package_top':
					case 'book_private_class_top':
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
			console.error(`SEARCH STUDENTS: Error retrieving students: ${e.responseText}`);
            console.error(e);
			var message = { title: 'ERROR', body: "Error retrieving students, please try again." };
			writeMessage('modal', message);
		}

        // Clear search query, re-enable search submit button
        $('#search_student_form').val('');
		$searchSubmitButton.prop('disabled', false).removeClass('disabled');

		// Re-enable final submit button and update text (in case it's visible)
		$submitButtonElement.prop('disabled', false).removeClass('disabled').val(submitButtonText);
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
		
		// Initiate purchase with relevant details and call appropriate function
		var generateCertResult = await initPurchase(action, products, clients);

        console.log('Generate cert result: ', generateCertResult);
        
        // If successful, don't re-enable submit button to avoid multiple purchases, and leave details on screen (don't clean up)
		// $('#buy_package_submit').prop('disabled', false).removeClass('disabled');
		if (generateCertResult) {			
			$submitButtonElement.val('DONE');
		}
	});

	// EVENT: BUY CLASS SERIES SUBMIT
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
			// Initiate purchase with relevant details and call appropriate function
			var buySeriesResult = await initPurchase(action, products, clients);

			console.log('buySeries result: ', buySeriesResult);
			
			// Clean up here if successful?
			// cleanUp($revealedElements);
		} else {
			// FUTURE - reveal datepicker and buy single class
			// var buyClassResult = await buyClass();
			console.log(`ERROR: Class is not a series`);
			var message = { title: "ERROR", body: '<b>You can only book a class series. To book a single class, use "BOOK SINGLE CLASS".<br>Please try again.</b>' };
			writeMessage('modal', message, $('#modal_output'));
		}
			
		// If successful, don't re-enable submit button to avoid multiple purchases, and leave details on screen
		// $('#buy_class_submit').prop('disabled', false).removeClass('disabled');
		if (buySeriesResult) {			
			$submitButtonElement.val('DONE');
		}
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

		// Retrieve certificates for selected student
		var certificates = await retrieveCertificates(clients);
		var selectedClientVal = $('#search_student_dropdown').val();		
		console.log(`Certificates for ${selectedClientVal}: `, certificates);

		// Get student email
		var selectedClient = $.grep(clients, (i) => {
			return `${i.firstName} ${i.lastName}` === selectedClientVal;
		});
		var clientEmail = selectedClient[0].email || 'No email registered';
		
		// Retrieve appointments for selected student
		try {
			var func = 'appointments_get';
			var activity = 'getApptsByEmail';
			var appointments = await initApiCall(func, activity, clients);
			console.log('Appointments from certificates by email: ', appointments);
			var apptsBooked = appointments.length;
		}
		catch (e) {
			console.log('Error or no appointments booked: ', e)
			var apptsBooked = 0;
		}
        
        // Populate output and display in modal
        if (certificates) {
			// Set single class prices to compute remaining value
			var bdPrice = 32;
			var yogaPrice = 39;
			
			// Set var to hold student info for display in modal
            var certificatesOutput = "";
            for (var i=0; i < certificates.length; i++) {				
				// Store expiration and remaining values
				var certName = certificates[i].name;				
				var classPrice = bdPrice;
				if (certName.includes('Yoga')) {					
					classPrice = yogaPrice;
				}
				var expiry = certificates[i].expiration;
				var expiryDate = new Date(expiry);
				var today = new Date();
				var expired = false;
				if (expiryDate < today) { expired = true; }

				var remainingValue = 'Unlimited';
				var remainingType = 'Classes';
				switch (certificates[i].type) {
					case 'value':
						remainingValue = (certificates[i].remainingValue / classPrice);
						break;
					case 'count':
						remainingValue = certificates[i].remainingCounts;
						break;
					case 'minutes':
						remainingValue = certificates[i].remainingMinutes;
						remainingType = 'Minutes';
						break;
				}

				certificatesOutput += `<strong>${certificates[i].name}</strong><br>
										<strong>Email:</strong> ${clientEmail}<br>
										<strong>Code:</strong> ${certificates[i].certificate}<br>
										<strong>Remaining:</strong> ${remainingValue} ${remainingType}<br>`
				
				// Update expiration date style if certificate is already expired
				if (expired) {
					certificatesOutput += `<strong>Expiry:</strong> <span id="certificate_expiry" class="certificate-expired"><strong>${certificates[i].expiration}</strong></span><br>`;
				} else {
					certificatesOutput += `<strong>Expiry:</strong> <span id="certificate_expiry" class="certificate-valid"><strong>${certificates[i].expiration}</strong></span><br>`;
				}
				
				// Output a line unless at last certificate
				if (i !== (certificates.length - 1)) {
                    certificatesOutput += '<hr>';
                }
			}
		} else {
			certificatesOutput = "<strong>No certificates found!</strong>";
		}
		
		// Add number of appointments booked
		certificatesOutput += `<hr><strong>Appointments booked:</strong> ${apptsBooked}`;
		
		// Generate modal message with certificate details
		var selectedStudent = $('#search_student_dropdown option:selected').text();
		var message = { title: `PACKAGES: ${selectedStudent}`, body: certificatesOutput };
		writeMessage('modal', message);

		// CLEAN UP: Re-enable view packages submit button, clear search dropdown		
		$('#view_packages_submit').prop('disabled', false).removeClass('disabled');
		
		// Clear dropdown at top level instead
		// clearDropdown($('#search_student_dropdown'));
	});

	// EVENT: BUY SINGLE CLASS SUBMIT
	$('#buy_single_class_submit').on('click', async (e) => {
		e.preventDefault();
		console.log(`Event captured: ${e.currentTarget.id}`);
		console.log(e);        
        // Clear any error message		
		writeMessage('error', "");

		// Find the array index of the selected product / package to capture Acuity direct booking URL
        var selectedClassVal = $('#select_package_class_dropdown').val();
        var selectedClass = $.grep(products, (i) => {
            return i.name === selectedClassVal;
        });
        console.log('Selected Class: ', selectedClass);
		
		// Capture client information from search dropdown to customize Acuity URL with student info
		var selectedClientVal = $('#search_student_dropdown').val();
		var selectedClient = $.grep(clients, (i) => {
			return `${i.firstName} ${i.lastName}` === selectedClientVal;
		});
		var email = selectedClient[0].email;
		var certificate = email;
		var firstName = selectedClient[0].firstName;
		var lastName = selectedClient[0].lastName;
		var phone = selectedClient[0].phone;		
		var className = selectedClass[0].name;

		// If booking a private trial class, use the trial class coupon code
		if (className.includes('Trial Class')) { certificate = 'TRIALCLASS'; }

		// Customize URL and open new tab with direct link to product in Acuity
		var productURL = selectedClass[0].schedulingUrl;
		productURL += `&firstName=${firstName}&lastName=${lastName}&email=${email}&phone=${phone}&certificate=${certificate}`;
		
		var win = window.open(productURL, '_blank');
	});

	// EVENT: Search student dropdown change - update confirmation details
	$('#search_student_dropdown').change( (e) => {
		e.preventDefault();
		console.log(`Event captured: ${e.currentTarget.id}`);
		console.log(e);

		// Populate confirmation details
		var event = e.currentTarget.id;
		confirmPaymentDetails(event, products, $revealedElements, $submitButtonElement);

		// Re-enable final submit button and update text (in case it's visible)
		$submitButtonElement.prop('disabled', false).removeClass('disabled').val(submitButtonText);
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
				var $element = $('#payment_method_div');
				$revealedElements = revealElement($element, $revealedElements);

				// Populate confirmation details
				var event = e.currentTarget.id;
				var paymentDetailsOK = confirmPaymentDetails(event, products, $revealedElements, $submitButtonElement);

				// If all payment details are OK, enable (or re-enable) submit button and update text
				if (paymentDetailsOK) {			
					$submitButtonElement.prop('disabled', false).removeClass('disabled').val(submitButtonText);
				}
				break;
			case 'buy_single_class_top':
			case 'book_private_class_top':
				var $element = $('#buy_single_class_submit');
				$revealedElements = revealElement($element, $revealedElements);
				break;
		}
	});

	// EVENT: Select payment method dropdown change - enable required options and reveal submit button
	$('#payment_method_dropdown').change(async (e) => {
		e.preventDefault();
		console.log(`Event captured: ${e.currentTarget.id}`);
		console.log(e);
		
		// Retrieve requested action (buy class or package) and store submit button element
		var action = $('#search_student_div').data('action');
		
		var $dropdown = $('#payment_method_dropdown');
		switch (action) {
			case 'buy_class_top':
				$submitButtonElement = $('#buy_class_submit');
				submitButtonText = 'BUY CLASS SERIES';
				break;
			case 'buy_package_top':
				$submitButtonElement = $('#buy_package_submit');
				submitButtonText = 'BUY PACKAGE';
				break;
		}

		// Reset and hide deposit amount div
		var $depositAmountDivElement = $('#deposit_amount_div');
		var $depositAmountElement = $('#deposit_amount');
		$depositAmountElement.val('');
		$depositAmountDivElement.hide();

		// Store various elements to enable/disable
		var $updatePriceElement = $('#updated_price_div');
		var $updatePriceFormElement = $('#updated_price');
		var $createInvoiceElement = $('#create_invoice_checkbox');
		var $applyPaymentElement = $('#apply_payment_checkbox');
		var $paymentOptionsElement = $('#payment_options_div');		

		// Store selected payment method
		var paymentMethod = $dropdown.val();

		// If payment method is anything besides "Select One" or "None", reveal employee commission dropdown and store selected name
		var $commissionElement = $('#employee_commission_div');
		var $commissionDropdown = $('#employee_commission_dropdown');		
		var employeeCommission = $commissionDropdown.val();
		if (debug) {
			console.log('Payment method dropdown val: ', paymentMethod);
			console.log('Employee commission dropdown val: ', employeeCommission);
		}

		// Enable and disable various elements based on payment method selection
		switch (paymentMethod) {
			case 'select':
				// Disable submit button if payment method not selected
				$submitButtonElement.prop('disabled', true).addClass('disabled');
				// Reset price to default and hide payment options
				$paymentOptionsElement.hide();
				$updatePriceElement.hide();
				$updatePriceFormElement.val('');
				// Hide and disable payment options and commission element
				$createInvoiceElement.prop('checked', false).prop('disabled', true).addClass('disabled');
				$applyPaymentElement.prop('checked', false).prop('disabled', true).addClass('disabled');				
				$commissionDropdown.val('select');				
				$commissionElement.hide();
				break;
			case 'none':
				// If payment method is not selected or NONE, disable Xero invoice creation and update price to zero
				$createInvoiceElement.prop('checked', false).prop('disabled', true).addClass('disabled');
				$applyPaymentElement.prop('checked', false).prop('disabled', true).addClass('disabled');
				$updatePriceFormElement.val('0.00');
				// Reset and hide commission element
				$commissionDropdown.val('select');
				$commissionElement.hide();
				break;
			case 'cc-online':
				// Hide payment options as payment will be via Acuity
				$paymentOptionsElement.hide();
				$updatePriceElement.hide();
				// Reset price to default
				$updatePriceFormElement.val('');
				// Update submit button text
				submitButtonText = 'ENTER CARD DETAILS';
				// Reveal commission element
				$revealedElements = revealElement($commissionElement, $revealedElements);
				break;
			case 'wechat-pay':
				// Disable invoice creation checkbox as payment will be via Stripe and invoice created via Zapier
				$createInvoiceElement.prop('checked', true).prop('disabled', true).addClass('disabled');
				$applyPaymentElement.prop('checked', true).prop('disabled', true).addClass('disabled');
				// Reveal update price and payment options checkboxes and reset price
				$revealedElements = revealElement($paymentOptionsElement, $revealedElements);
				$revealedElements = revealElement($updatePriceElement, $revealedElements);				
				$updatePriceFormElement.val('');
				// Update submit button text
				submitButtonText = 'SCAN QR CODE';
				// Reveal commission element
				$revealedElements = revealElement($commissionElement, $revealedElements);
				break;
			default:
				// Reveal and enable payment options checkboxes				
				$revealedElements = revealElement($paymentOptionsElement, $revealedElements);
				$createInvoiceElement.prop('checked', true).prop('disabled', false).removeClass('disabled');
				$applyPaymentElement.prop('checked', true).prop('disabled', false).removeClass('disabled');
				$updatePriceFormElement.val('');
				// Reveal update price form and commission element
				$revealedElements = revealElement($updatePriceElement, $revealedElements);
				$revealedElements = revealElement($commissionElement, $revealedElements);
				break;
		}

		// If not populated yet, make API call and populate employee commission dropdown with DDY employee names
		if (paymentMethod != 'select' && paymentMethod != 'none') {
			if (ddyInstructors.length === 0) {
				ddyInstructors = await getDdyInstructors();
				console.log('DDY Instructors list: ', ddyInstructors);
				
				// Populate employee commission dropdown with list of DDY instructors
				var func = "clients";
				populateDropdown($commissionDropdown, ddyInstructors, func);
				
				// Prepend "Select One" to top of dropdown
				$commissionDropdown.prepend("<option value='select' selected='selected'>Select One</option>");
			} else {
				console.log('PAYMENT METHOD CHANGE EVENT: DDY instructors array already populated, skipping API call.');
			}
		}

		// Populate confirmation details box for user to see all purchase details before submitting
		var event = e.currentTarget.id;
		var paymentDetailsOK = confirmPaymentDetails(event, products, $revealedElements, $submitButtonElement);

		// Enable and reveal submit button unless payment method is 'Select One'
		if (paymentMethod !== 'select') {
			// Reveal submit button element
			$revealedElements = revealElement($submitButtonElement, $revealedElements);
			if (paymentDetailsOK) {
				// Enable submit button
				$submitButtonElement.prop('disabled', false).removeClass('disabled').val(submitButtonText);				
			} else {
				// Disable submit button
				$submitButtonElement.prop('disabled', true).addClass('disabled').val(submitButtonText);
			}
		}
	});

	
	// EVENT: Payment Received checkbox change - reveal or hide deposit input box
	$('#apply_payment_checkbox').change( (e) => {
		e.preventDefault();
		console.log(`Event captured: ${e.currentTarget.id}`);
		console.log(e);

		// If checked, hide deposit input, otherwise reveal deposit input
		var $applyPaymentElement = $('#apply_payment_checkbox');
		var applyPaymentChecked = $applyPaymentElement.is(':checked');
		var $depositAmountDivElement = $('#deposit_amount_div');
		var $depositAmountElement = $('#deposit_amount');
		if (applyPaymentChecked) {
			// Clear deposit amount and hide deposit amount input
			$depositAmountElement.val('');
			$depositAmountDivElement.hide();
		} else {
			// Reveal deposit amount input and add focus
			$revealedElements = revealElement($depositAmountDivElement, $revealedElements);
			$depositAmountElement.focus();
		}

		// Update payment confirmation box
		var paymentDetailsOK = confirmPaymentDetails(event, products, $revealedElements, $submitButtonElement);

		// If all payment details are OK, enable (or re-enable) submit button and update text
		if (paymentDetailsOK) {
			$submitButtonElement.prop('disabled', false).removeClass('disabled').val(submitButtonText);
		}
	});

	// EVENT: Dropdown or form change with NO additional dependencies - update relevant details in payment confirmation box
	$('#deposit_amount, #employee_commission_dropdown, #updated_price').change( (e) => {
		e.preventDefault();
		console.log(`Event captured: ${e.currentTarget.id}`);
		console.log(e);

		// Populate event and update payment confirmation box
		var event = e.currentTarget.id;
		var paymentDetailsOK = confirmPaymentDetails(event, products, $revealedElements, $submitButtonElement);

		// If all payment details are OK, enable (or re-enable) submit button and update text
		if (paymentDetailsOK) {
			$submitButtonElement.prop('disabled', false).removeClass('disabled').val(submitButtonText);
		} else {
			// Disable submit button
			$submitButtonElement.prop('disabled', true).addClass('disabled').val(submitButtonText);
		}
	});
	
	// EVENT: Generate check-in table dropdown change - reveal generate table button
	$('#upcoming_classes_dropdown').change( (e) => {
		e.preventDefault();
		console.log(`Event captured: ${e.currentTarget.id}`);
		console.log(e);

		// Reveal and enable checkin table button unless dropdown value is "select one"
		var $dropdown = $('#upcoming_classes_dropdown');
		var $element = $('#generate_checkin_table_submit');
		
		if (debug) {
			console.log('Upcoming classes dropdown val: ', $dropdown.val());
		}

		if ($dropdown.val() === 'Select One') {
			$element.prop('disabled', true).addClass('disabled');
		} else {			
			$element.prop('disabled', false).removeClass('disabled');
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

		// Disable GENERATE TABLE SUBMIT button
		var $element = $('#generate_checkin_table_submit');
		$element.prop('disabled', true).addClass('disabled');

		// Store selected date
		var selectedDate = $('#checkin_datepicker').datepicker('getDate');
		var classDate = $.datepicker.formatDate('yy/mm/dd', selectedDate);
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
					var winName = 'checkin-window-uat';
				} else {
					var winName = 'checkin-window';
				}

				// Close open window if it exists
				if (win) { 
					console.log('Closing open window: ', win);
					win.close();
				}

				// var win = window.open(winName, '_blank', 'fullscreen=yes,width=' + screen.availWidth + ',height=' + screen.availHeight);
				// var w = window.open("popup-table-uat", "Dream Dance and Yoga Student Check-In", "menubar='no',toolbar='no',location='no',width=" + screen.availWidth + ",height=" + screen.availHeight);
				win = window.open(winName, '_blank', 'fullscreen=yes, width=828, height=1200');

				if (win) {
					win.focus();					
					// Pass local vars to child window
					window.debug = debug;
					window.environment = environment;
					window.upcoming_classes = upcoming_classes;
					window.classDate = classDate;
					window.selected_class_index = selected_class_index;
					
					// Clear date value from label - causing bug when selecting new class after closing window
					// $('#checkin_datepicker').val('');
				} else {
					alert('Please enable pop-ups to view the student check-in table');
				}				
			} else {
				var message = { title: 'ERROR', body: "No students scheduled for that class, please try again." };
				writeMessage('modal', message);
			}
		}
		catch(e) {
			console.error(`GENERATE CHECK-IN TABLE: Error generating check-in table: ${e.responseText}`);
			console.error(e);
			var message = { title: 'ERROR', body: "Error retrieving appointments, please try again." };
			writeMessage('modal', message);	
		}
	});
	
	// EVENT: GET INSTRUCTOR REPORT button click
	$('#get_instructor_report_submit').on('click', async (e) => {
		e.preventDefault();
		console.log(`Event captured: ${e.currentTarget.id}`);
		console.log(e);
        // Clear any error message
		writeMessage('error', "");

		if (debug) {
            writeMessage('debug', "<br><b>clicked GET INSTRUCTOR REPORT button...</b>");
		}

		// Store selected date		
		var selectedMonthVal = $('#instructor_report_datepicker').val();
		var selectedMonth = new Date(selectedMonthVal);
		console.log('Selected report month and date is: ', selectedMonthVal, selectedMonth);

		// Make API call to retrieve appointments for selected month
		var appointmentsResult = await generateInstructorReport(selectedMonth, $revealedElements);		
	});

	
	// EVENT: Studio metrics datepicker change - reveal submit button upon datepicker change
	$('#metrics_date_range_from, #metrics_date_range_to').change( (e) => {
		e.preventDefault();
		console.log(`Event captured: ${e.currentTarget.id}`);
		console.log(e);
		console.log(`action is: ${action}`);

		if (debug) {
            writeMessage('debug', "<br><b>Caught datepicker change...</b>");
		}
		
		// Store selected dates
		var selectedDateFrom = $('#metrics_date_range_from').datepicker('getDate');
		var selectedDateTo = $('#metrics_date_range_to').datepicker('getDate');
		// classDate = $.datepicker.formatDate('yy/mm/dd', selectedDate);
		console.log(`CHANGE: Selected date range is ${selectedDateFrom} TO ${selectedDateTo}`);
		
		if (selectedDateFrom && selectedDateTo) {
			// Enable and reveal submit button
			var $element = $('#studio_metrics_submit');
			$element.prop('disabled', false).removeClass('disabled');
			$revealedElements = revealElement($element, $revealedElements);
		}
	});
	
	// EVENT: GET STUDIO METRICS button click
	$('#studio_metrics_submit').on('click', async (e) => {
		e.preventDefault();
		console.log(`Event captured: ${e.currentTarget.id}`);
		console.log(e);
        // Clear any error message
		writeMessage('error', "");

		if (debug) {
            writeMessage('debug', "<br><b>clicked GET STUDIO METRICS button...</b>");
		}

		// Disable submit button while fetching data
		var $element = $('#studio_metrics_submit');
		$element.prop('disabled', true).addClass('disabled');

		// Get date range from datepicker
		var selectedDateFrom = $('#metrics_date_range_from').datepicker('getDate');
		var selectedDateTo = $('#metrics_date_range_to').datepicker('getDate');
		
		console.log(`SUBMIT: Selected date range is ${selectedDateFrom} TO ${selectedDateTo}`);

		// GET APPOINTMENTS DATA AND BUILD CHARTS
		var result = await buildStudioMetricsCharts(selectedDateFrom, selectedDateTo);
				
		if (result) {
			// Reveal studio metrics container and re-enable submit button
			var $element = $('#studio_metrics_data_div');
			$revealedElements = revealElement($element, $revealedElements);

			var $element = $('#studio_metrics_submit');
			$element.prop('disabled', false).removeClass('disabled');
		}
	});
});
}
</script>
<!-- Acuity Client Functions -->
<script src="https://sophiadance.squarespace.com/s/ddyApiClientFunctions-UAT.js"></script>
<!-- JQUERY / JQUERY UI -->
<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js" integrity="sha256-VazP97ZCwtekAsvgPBSUwPFKdrwD3unUfSGVYrahUqU=" crossorigin="anonymous"></script>
<!-- STRIPE -->
<script src="https://js.stripe.com/v3/"></script>
<!-- DATATABLES -->
<script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/1.10.19/js/jquery.dataTables.js"></script>
<script type="text/javascript" charset="utf8" src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js"></script>
<script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/buttons/1.5.6/js/dataTables.buttons.min.js"></script>
<script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/buttons/1.5.6/js/buttons.html5.min.js"></script>
<!-- HIGHCHARTS -->
<script src="https://code.highcharts.com/highcharts.js"></script>
<!-- D3.JS -->
<script src="https://d3js.org/d3.v5.min.js"></script>
<!-- JQUERY QRCODE --></div>
<script type="text/javascript" src="https://sophiadance.squarespace.com/s/jqueryqrcodemin.js"></script>

<!-- END UAT -->
</html>