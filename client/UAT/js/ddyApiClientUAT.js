<!DOCTYPE html>
<html lang="en">
	<head>
		<link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
		<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.10.19/css/jquery.dataTables.css">
		<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.3/css/all.css" integrity="sha384-UHRtZLI+pbxtHCWp1t77Bi1L4ZtiqrqD80Kn4Z8NTSRyMA2Fd33n5dQ8lWUE00s/" crossorigin="anonymous">
		<link rel="stylesheet" type="text/css" href="https://sophiadance.squarespace.com/s/loadingSpinnerRingEase.css"></link>
		<link rel="stylesheet" type="text/css" href="https://sophiadance.squarespace.com/s/ddy-mystudio-UAT.css"></link>
	</head>
	
	<body>
		<!-- TITLE AND DARK MODE -->
		<div class="center margin-small" title="Toggle Dark Mode">
			<a id="toggle_dark_mode" class="float-right" href="#"><i class="fas fa-moon fa-2x"></i></a>
			<h3>Dream Dance and Yoga</h3>
			<h2><strong>MyStudio</strong></h2>			
			<h3><strong>....What would you like to do today?..今天你想做什么？....</strong></h3>
		</div>
		
		<!-- TOP LEVEL CARDS -->
		<div id="top_level_options" class="top-cards">
			<a href="#">
				<div id="buy_package_top" class="card">
					<h3><strong><i class="fas fa-gift fa-3x margin-small"></i><br>....BUY PACKAGE / MEMBERSHIP..购买配套或会员卡....</strong></h3>
				</div>
			</a>
			
			<a href="#">
				<div id="buy_class_top" class="card">
					<h3><strong><i class="fas fa-cubes fa-3x margin-small"></i><br>....BUY CLASS SERIES..购买成品系列课....</strong></h3>
				</div>
			</a>
			
			<a href="#">
				<div id="buy_single_class_top" class="card">
					<h3><strong><i class="fas fa-cube fa-3x margin-small"></i><br>....BOOK SINGLE CLASS..预定单节课 ....</strong></h3>
				</div>
			</a>

			<a href="#">
				<div id="book_private_class_top" class="card">
					<h3><strong><i class="fas fa-user-friends fa-3x margin-small"></i><br>....BOOK PRIVATE / GROUP CLASS..预定私教课....</strong></h3>
				</div>
			</a>

			<a href="#">
				<div id="view_student_package_top" class="card">
					<h3><strong><i class="fas fa-glasses fa-3x margin-small"></i><br>....VIEW STUDENT INFO..查看学生信息....</strong></h3>
				</div>
			</a>
			
			<a href="#">
				<div id="checkin_table_top" class="card">
					<h3><strong><i class="fas fa-table fa-3x margin-small"></i><br>....CHECK-IN TABLE..签到表....</strong></h3>
				</div>
			</a>

			<a href="#">
				<div id="instructor_report_top" class="card">
					<h3><strong><i class="fas fa-graduation-cap fa-3x margin-small"></i><br>....INSTRUCTOR REPORT..老师授课清单....</strong></h3>
				</div>
			</a>

			<a href="#">
				<div id="member_report_top" class="card">
					<h3><strong><i class="fas fa-users fa-3x margin-small"></i><br>....DDY MEMBER REPORT..会员人数清单....</strong></h3>
				</div>
			</a>

			<a href="#">
				<div id="studio_metrics_top" class="card">
					<h3><strong><i class="fas fa-chart-bar fa-3x margin-small"></i><br>....DDY STUDIO METRICS..会员出勤表....</strong></h3>
				</div>
			</a>
		</div>

		<!-- LOADER DIV -->
		<div id="loader-div" class="loader-ring hide">
			<div class="loading loading--full-height"></div>
		</div>

		<div id="details" class="details hide">
			<div id="details-top"></div>

			<!-- SEARCH STUDENT -->
			<div id="search_student_div" class="details-item hide">
				<form id="search_student" action="" method="post">
					<label for="search_student" class="form-label">....Student Name: ..会员姓名：.... </label>
					<input type="search" name="search_student_form" id="search_student_form" />
					<input type="submit" name="search_submit" id="search_submit" value="....Search..查找...." />
				</form>
			</div>

			<!-- SEARCH STUDENT DROPDOWN -->
			<div id="search_student_dropdown_div" class="details-item hide">
				<label for="search_student_dropdown" class="form-label">....Select Student: ..选择学生：....</label>
				<select id="search_student_dropdown" name="search_student_dropdown" class="dropdown">
					<option value="Select One">....Select One..选择一项....</option>	
				</select>
			</div>

			<!-- SELECT LOCATION -->
			<div id="select_location_div" class="details-item hide">
				<label for="select_location_dropdown" class="form-label">....Select Studio Location: ..选择地址：....</label>
				<select id="select_location_dropdown" class="dropdown">
					<option value="location">....Select One..选择一项....</option>
				</select>
			</div>

			<!-- SELECT PACKAGE/CLASS -->
			<div id="select_package_class_div" class="details-item hide">
				<label for="select_package_class_dropdown" class="form-label">....Select Package / Class: ..选择配套或课程：....</label>
				<select id="select_package_class_dropdown" class="dropdown">
					<option value="package">....Select One..选择一项....</option>
				</select> 
				<span id="select_class_checkbox" class="hide">
					<input type="checkbox" name="include_old_classes" id="include_old_classes_checkbox" value="false">
					<label for="include_old_classes_checkbox"><strong>....Include Old Classes..包括结束的课程....</strong></label>
				</span>
			</div>

			<!-- PAYMENT METHOD -->
			<div id="payment_method_div" class="details-item hide">
				<label for="payment_method_dropdown" class="form-label">....Select Payment Method: ..选择支付方式：....</label>
				<select id="payment_method_dropdown" class="select_dropdown">
					<option value="select">....Select One..选择一项....</option>
					<option value="none">....NONE (No Charge)..免费....</option>
					<option value="cc-online">....Credit / Debit Card..银行卡....</option>
					<option value="cashOrBankXfer">....Cash / Cheque / Bank Tranfer..现金或支票或银行转账....</option>
					<!--option value="cash">....Cash..现金...</option-->
					<option value="wechat-pay">....WeChat Pay..微信支付....</option>
				</select>
				<!-- PAYMENT OPTIONS -->
				<div id="payment_options_div" class="details-item hide">
					<input type="checkbox" name="create_invoice" id="create_invoice_checkbox" value="create_invoice" checked>
					<label for="create_invoice_checkbox">....Create Invoice..创建发票....</label>
					<br>
					<input type="checkbox" name="apply_payment" id="apply_payment_checkbox" value="apply_payment" checked>
					<label for="apply_payment_checkbox">....FULL Payment Received..收到全额付款....</label>
					
					<!-- DEPOSIT -->
					<div id="deposit_amount_div" class="details-item hide">
						<label for="deposit_amount"><strong>....DEPOSIT Amount Received: ..收到定金：....</strong></label>
						<span class="currency-input">$ <input type="number" min="1" max="9999" step="1" id="deposit_amount" name="deposit_amount" value="0.00"></span>
					</div>
				
				</div>
			</div>

			<!-- UPDATE PRICE -->
			<div id="updated_price_div" class="details-item hide">
				<label for="updated_price"><strong>....Discounted Price (Leave blank for original price): ..折扣后价格：....</strong></label>
				<span class="currency-input">$ <input type="number" min="1" max="9999" step="1" id="updated_price" name="updated_price"></span>
			</div>

			<!-- DDY EMPLOYEE COMMISSION -->
			<div id="employee_commission_div" class="details-item hide">
				<label for="employee_commission_dropdown" class="form-label">....Sold by: ..售卡人：....</label>
				<select id="employee_commission_dropdown" class="select_dropdown">
					<option value="select"></option>
				</select>
			</div>

			<!-- CONFIRMATION DIV -->
			<div id="confirm_details_div" class="details-item confirm-details hide"></div>

			<!-- CHECK-IN TABLE -->
			<div id="generate_checkin_table_div" class="details-item hide">
				<!-- Dropdown to hold upcoming classes to generate student check-in list -->
				<div id="upcoming_classes_div">
					<label for="upcoming_classes_dropdown" id="upcoming_classes_dropdown_label" class="form-label">....Today's classes: ..今日课程：....</label>
					<select id="upcoming_classes_dropdown" class="dropdown">
						<option value="class">....Select One..选择一项....</option>
					</select>
				</div>
				<div id="select_upcoming_class_date_div">
					<p><strong>....OR..或....</strong>.... Select another date: ..选择其他日期：....<input type="text" id="checkin_datepicker" class="margin" /></p>
				</div>
			</div>

			<!-- INSTRUCTOR REPORT -->
			<div id="instructor_report_div" class="details-item hide">
				<div id="select_instructor_report_date_div" class="hide">
					<p>....Select month: ..选择月份：....<input type="text" id="instructor_report_datepicker" class="margin" /></p>
				</div>		
			</div>

			<!-- STUDIO METRICS -->
			<div id="studio_metrics_div" class="inline-block hide">
				....Start date: ..开始日期：....<input type="text" id="metrics_date_range_from" class="margin" />
				....End date: ..结束日期：....<input type="text" id="metrics_date_range_to" class="margin" />
			</div>

			<!-- JQUERY UI MODAL CONTAINER -->
			<div id="modal_output"></div>

			<!-- Submit buttons -->
			<input type="submit" id="buy_package_submit" class="submit-button hide" value="....BUY PACKAGE..购买配套...." />
			<input type="submit" id="buy_class_submit" class="submit-button hide" value="....BUY CLASS..购买课程...." />
			<input type="submit" id="buy_single_class_submit" class="submit-button hide" value="....BOOK CLASS..订课...." />
			<input type="submit" id="view_packages_submit" class="submit-button hide" value="....VIEW PACKAGES..查看信息...." />
			<button type="button" id="generate_checkin_table_submit" class="submit-button hide" disabled>....GENERATE CHECK-IN TABLE..创建签到表....</button>
			<button type="button" id="get_instructor_report_submit" class="submit-button hide" disabled>....GET INSTRUCTOR REPORT..创建老师授课清单....</button>
			<input type="submit" id="studio_metrics_submit" class="submit-button hide" value="....GET STUDIO METRICS..创建会员出勤表...." />
			
			<!-- INSTRUCTOR REPORT -->
			<div id="instructor_report_container_div" class="instructor-container hide">
				<br><hr><br>
				<div id="instructor_report_display_div" class="instructor-info"></div>
				<div id="instructor_report_display_details_div" class="instructor-table">
					<!-- Placeholder HTML table for instructor report details - populated by DataTable() -->    
					<table id="instructor_report_details_table" class="display table">
						<caption><h3 class="center"><strong>....Class Details..课程详情....<hr></h3></strong></caption>
						<thead>
							<tr>
								<th>....Name..姓名....</th>
								<th>....Check-in Time..签到时间....</th>
								<th>....Late Check-in..迟到签到....</th>
								<th>....Class..课程....</th>
								<th>....Date..日期....</th>
							</tr>
						</thead>
					</table>
				</div>
			</div>
			
			<!-- STUDIO METRICS DATA-->
			<div id="studio_metrics_data_div" class="studio-metrics hide">
				<br><hr>
				<div id="ddy_member_div" class="ddy-member-cards">
					<a id="ddy_card_total_href" href="#" target=_blank>
						<div id="ddy_total_member_div">
							<div id="ddy_card_total" class="ddy-card ddy-card-maroon"></div>
						</div>
					</a>
					
					<a id="ddy_card_gold_href" href="#" target=_blank>
						<div id="ddy_gold_member_div">
							<div id="ddy_card_gold" class="ddy-card ddy-card-gold"></div>
						</div>
					</a>
					
					<a id="ddy_card_silver_href" href="#" target=_blank>
						<div id="ddy_silver_member_div">
							<div id="ddy_card_silver_dance" class="ddy-card ddy-card-silver"></div>
							<div id="ddy_card_silver_yoga" class="ddy-card ddy-card-silver"></div>
							<div id="ddy_card_silver_dance_and_yoga" class="ddy-card ddy-card-silver"></div>
						</div>
					</a>
					
					<a id="ddy_card_package_href" href="#" target=_blank>
						<div id="ddy_package_member_div">
							<div id="ddy_card_yoga_8" class="ddy-card ddy-card-green"></div>
							<div id="ddy_card_yoga_16" class="ddy-card ddy-card-green"></div>
							<div id="ddy_card_dance_8" class="ddy-card ddy-card-green"></div>
							<div id="ddy_card_dance_16" class="ddy-card ddy-card-green"></div>
							<div id="ddy_card_dance_and_yoga_8" class="ddy-card ddy-card-green"></div>
							<div id="ddy_card_dance_and_yoga_16" class="ddy-card ddy-card-green"></div>
							<div id="ddy_card_dance_and_yoga_1_year" class="ddy-card ddy-card-green"></div>
						</div>
					</a>
				</div>
				
				<div id="studio_metrics_data_charts_div" class="ddy-member-cards hide">
					<br><hr>		
					<div id="metrics_data_chart_1" class="ddy-data"></div>
					<div id="metrics_data_chart_2" class="ddy-data"></div>
					<div id="metrics_data_chart_3" class="ddy-data"></div>
				</div>
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
		var locations = [];
		var products = [];
		var productsArrayContains = null;
		var certificates = [];
		var allCertificates = [];
		var upcomingClasses = [];
		var ddyInstructors = [];

		// Var to hold selected action from top cards
		var action = '';

		// Var to hold selected location
		var selectedLocation = '';
		
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

		// Fill in version and environment details at bottom of page
		populateEnvironment();

		// EVENT: TOGGLE DARK MODE
		$('#toggle_dark_mode').on('click', async (e) => {	
			e.preventDefault();

			var $element = $('main');
			$element.toggleClass('dark-mode');
		});
		
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
					$detailsTop.html('<h2>....BUY A CLASS SERIES..购买成品系列课....</h2><hr/>');
					
					// Set submit button element and text
					$submitButtonElement = $('#buy_class_submit');
					submitButtonText = '....BUY CLASS SERIES..购买成品系列课....';

					// Set old classes checkbox to be visible
					$('#select_class_checkbox').removeClass('hide');
					
					// Reveal student search form and focus
					$revealedElements = revealElement($('#search_student_div'), $revealedElements);
					$('#search_student_form').focus();
					break;
				case 'buy_single_class_top':
					$detailsTop.html('<h2>....BOOK A SINGLE CLASS..预定单节课....</h2><hr/>');
					
					// Set submit button element and text
					$submitButtonElement = $('#buy_single_class_submit');
					submitButtonText = '....BOOK CLASS..订课....';

					// Hide old classes checkbox
					$('#select_class_checkbox').addClass('hide');

					// Reveal student search form and focus
					$revealedElements = revealElement($('#search_student_div'), $revealedElements);
					$('#search_student_form').focus();
					break;
				case 'buy_package_top':
					$detailsTop.html('<h2>....BUY A PACKAGE / MEMBERSHIP..购买配套或会员卡....</h2><hr/>');
					
					// Set submit button element and text
					$submitButtonElement = $('#buy_package_submit');
					submitButtonText = '....BUY PACKAGE..现在购买....';
					
					// Hide old classes checkbox
					$('#select_class_checkbox').addClass('hide');

					// Reveal student search form and focus
					$revealedElements = revealElement($('#search_student_div'), $revealedElements);
					$('#search_student_form').focus();
					break;
				case 'book_private_class_top':
					$detailsTop.html('<h2>....BOOK A PRIVATE / GROUP CLASS..预定私教课....</h2><hr/>');
					
					// Set submit button element and text
					$submitButtonElement = $('#buy_single_class_submit');
					submitButtonText = '....BOOK CLASS..订课....';

					// Hide old classes checkbox
					$('#select_class_checkbox').addClass('hide');

					// Reveal student search form and focus
					$revealedElements = revealElement($('#search_student_div'), $revealedElements);
					$('#search_student_form').focus();
					break;
				case 'view_student_package_top':
					$detailsTop.html('<h2>....VIEW STUDENT INFO..查看学生信息....</h2><hr/>');
					
					// Set submit button element and text
					$submitButtonElement = $('#view_packages_submit');
					submitButtonText = '....VIEW STUDENT INFO..查看学生信息....';
					
					// Reveal student search form and focus
					$revealedElements = revealElement($('#search_student_div'), $revealedElements);
					$('#search_student_form').focus();
					
					// AUTOCOMPLETE TEST
					// var studentNames = ['Greg Parker', 'Sophia Meng', 'Larry Parker', 'Grace Meng', 'Zhifen Liang'];
					// console.log('Enabling autocomplete with array: ', studentNames);
					// $('#search_student_form').autocomplete({source: studentNames});
					// END AUTOCOMPLETE TEST
					break;
				case 'checkin_table_top':
					$detailsTop.html('<h2>....CLASS CHECK-IN TABLE..签到表....</h2><hr/>');
					
					// Retrieve locations and reveal locations dropdown
					locations = await retrieveLocations(locations, $revealedElements);
									
					// Reveal dropdown table and store action
					$('#generate_checkin_table_div').data('action', e.currentTarget.id);
					
					// Clear date value from datepicker if one exists
					var selectedDate = $('#checkin_datepicker').val();
					if (selectedDate) { $('#checkin_datepicker').val(''); }
					
					// Reset location var to force user to select location
					selectedLocation = '';
					upcomingClasses = await retrieveUpcomingClasses(action, selectedLocation, upcomingClasses, $revealedElements);
					console.log('Upcoming Classes:', upcomingClasses);
					
					// Show datepicker to select past class if required
					$("#checkin_datepicker").datepicker({
						showOn: "button",
						buttonImage: "https://sophiadance.squarespace.com/s/calendar-tiny.gif",
						buttonImageOnly: true,
						buttonText: ''
					});
					break;
				case 'instructor_report_top':
					$detailsTop.html('<h2>....INSTRUCTOR REPORT..老师授课清单....</h2><hr/>');
					var $element = $('#instructor_report_div');
					$revealedElements = revealElement($element, $revealedElements);

					// Retrieve locations and reveal locations dropdown
					locations = await retrieveLocations(locations, $revealedElements);
					
					break;
				case 'member_report_top':
					$detailsTop.html('<h2>....DDY MEMBER REPORT..会员人数清单....<a href="#" id="ddy_member_report_title"><i class="fas fa-sync-alt fa-xs margin-small"></i></a></h2>');
					
					// Retrieve locations and reveal locations dropdown
					locations = await retrieveLocations(locations, $revealedElements);

					// Add ad-hoc all studios entry to second index to retrieve report for ALL studios
					$('#select_location_dropdown option').eq(1).before($('<option value="all_locations">ALL Locations</option>'));

					// EVENT: REFRESH DDY MEMBER REPORT button click
					$('#ddy_member_report_title').on('click', async (e) => {
						e.preventDefault();
						console.log(`Event captured: ${e.currentTarget.id}`);
						console.log(e);
						// Clear any error message
						writeMessage('error', "");

						if (debug) {
							writeMessage('debug', "<br><b>clicked REFRESH DDY MEMBER REPORT button...</b>");
						}
						
						// Refresh DDY member report details
						allCertificates = await getDdyMembers(allCertificates, $revealedElements);
					});

					break;
				case 'studio_metrics_top':
					$detailsTop.html('<h2>....DDY STUDIO METRICS..会员出勤表....</h2><hr/>');

					// Retrieve locations and reveal locations dropdown
					locations = await retrieveLocations(locations, $revealedElements);

					// Add ad-hoc all studios entry to second index to retrieve report for ALL studios
					$('#select_location_dropdown option').eq(1).before($('<option value="all_locations">ALL Locations</option>'));
					
					// Reveal datepicker
					var $element = $('#studio_metrics_div');
					$revealedElements = revealElement($element, $revealedElements);
					
					// Store action
					$element.data('action', e.currentTarget.id);
					
					// Store datepicker elements and clear date value from datepicker if one exists				
					var $datePickerFrom = $('#metrics_date_range_from');
					var $datePickerTo = $('#metrics_date_range_to');
					$datePickerFrom.val('');
					$datePickerTo.val('');
					
					// Show datepicker to select date range				
					var dateFormat = "mm/dd/yy";
					var from = $datePickerFrom.datepicker({
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
					var to = $datePickerTo.datepicker({
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
					$datePickerFrom.focus();

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
			clients = await retrieveStudents();
			if (clients) {
				// Reveal student dropdown menu
				$revealedElements = revealElement($('#search_student_dropdown_div'), $revealedElements);

				// Retrieve locations for selected actions
				switch (action) {
					case 'buy_class_top':
					case 'buy_package_top':
					case 'buy_single_class_top':
					case 'book_private_class_top':
					locations = await retrieveLocations(locations, $revealedElements);
						break;
					case 'view_student_package_top':
						$revealedElements = revealElement($('#view_packages_submit'), $revealedElements);
						break;
				}
			}

			// Clear search query, re-enable search submit button
			$('#search_student_form').val('');
			$searchSubmitButton.prop('disabled', false).removeClass('disabled');

			// Re-enable final submit button and update text (in case it's visible)
			// TESTING DISABLED - RE-ENABLE IF ISSUES
			// $submitButtonElement.prop('disabled', false).removeClass('disabled').val(submitButtonText);

			// Update payment confirmation details
			var event = e.currentTarget.id;
			confirmPaymentDetails(event, action, products, $revealedElements, $submitButtonElement, submitButtonText);
		});

		// EVENT: LOCATION DROPDOWN or old classes checkbox CHANGE
		$('#select_location_dropdown, #include_old_classes_checkbox').change(async (e) => { // add old clsses checkbox change alsp
			e.preventDefault();
			console.log(`Event captured: ${e.currentTarget.id}`);
			console.log(e);
			// Clear any error message
			writeMessage('error', "");

			selectedLocation = retrieveSelectedLocation();
			console.log(`LOCATION DROPDOWN OR OLD CLASSES CHECKBOX CHANGE: Selected location: ${selectedLocation}`);

			// Take appropriate action based on user action (Buy package, check-in table, etc)
			switch (action) {
				case 'checkin_table_top':
				case 'pastDate':
					// Populate upcoming classes dropdown
					upcomingClasses = await retrieveUpcomingClasses(action, selectedLocation, upcomingClasses, $revealedElements);

					// Reveal class check-in table dropdown and enable button to generate table
					var $element = $('#generate_checkin_table_div');
					$revealedElements = revealElement($element, $revealedElements);
					$('#upcoming_classes_dropdown').focus();

					break;
				case 'member_report_top':
					allCertificates = await getDdyMembers(allCertificates, $revealedElements);
					break;
				case 'instructor_report_top':
					// Show datepicker to select month to generate report
					// Month year only datepicker
					
					// Reveal instructor report datepicker
					var $element = $('#select_instructor_report_date_div');
					$revealedElements = revealElement($element, $revealedElements);

					var $datePickerElement = $("#instructor_report_datepicker");
					$datePickerElement.datepicker({
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
							
							// Reveal and enable instructor report submit button
							var $element = $('#get_instructor_report_submit');
							$element.prop('disabled', false).removeClass('disabled');
							$revealedElements = revealElement($element, $revealedElements);
						}
					}).focus(function () {
						$(".ui-datepicker-calendar").hide();
					});
					$datePickerElement.focus();
					
					// Clear date value from label if it exists
					$datePickerElement.val('');

					break;
				case 'studio_metrics_top':
					// Refresh studio metrics for new location

					// Get date range from datepicker
					let selectedDateFrom = $('#metrics_date_range_from').datepicker('getDate');
					let selectedDateTo = $('#metrics_date_range_to').datepicker('getDate');

					if (selectedDateFrom && selectedDateTo) {
						// Populate DDY member report details
						allCertificates = await getDdyMembers(allCertificates, $revealedElements);
						
						// GET APPOINTMENTS DATA AND BUILD CHARTS
						let result = await buildStudioMetricsCharts(selectedDateFrom, selectedDateTo);
					}

					break;
				default:
					// Populate products / classes array if not populated already
					products = await retrieveProductsClasses(action, products, productsArrayContains);

					// Update value of contents of products array
					productsArrayContains = 'products';	
					if (action === 'buy_class_top') { productsArrayContains = 'classes'; }

					// If successful, filter for selected action and location and populate dropdown
					if (products) {
						var filteredProducts = await filterProductsClasses(action, selectedLocation, products, $revealedElements);
						var $dropdown = $('#select_package_class_dropdown');
						var func = "products";
						populateDropdown($dropdown, filteredProducts, func);
					} else {
						console.error('ERROR: Products / classes API call failed!');
					}

					// Update payment confirmation details
					var event = e.currentTarget.id;
					confirmPaymentDetails(event, action, products, $revealedElements, $submitButtonElement, submitButtonText);
			}
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
			
			// If successful, don't re-enable submit button to avoid multiple / inadvertent purchases, and leave details on screen (don't clean up)
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
				console.log(`ERROR: Class is not a series`);
				var message = { title: "ERROR", body: '<b>You can only book a class series. To book a single class, use "BOOK SINGLE CLASS".<br>Please try again.</b>' };
				writeMessage('modal', message, $('#modal_output'));
			}
				
			// If successful, don't re-enable submit button to avoid multiple / inadvertent purchases, and leave details on screen
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
				console.error('Error or no appointments booked: ', e)
				var apptsBooked = 0;
			}
			
			// Populate output and display in modal
			if (certificates) {
				// Set single class prices to compute remaining value
				// REMOVED - PLEASE DON'T HARDCODE CLASS PRICES ANYMORE GREG
			    // var bdPrice = 32;
			    // var yogaPrice = 39;
				
				// Set var to hold student info for display in modal
				var certificatesOutput = "";
				for (var i=0; i < certificates.length; i++) {
					/*
                    // Determine single class price - no longer applicable since all classes have different prices, including private classes
                    var certName = certificates[i].name;
                    var classPrice = bdPrice;
                    if (certName.includes('Yoga')) {
                        classPrice = yogaPrice;
                    }
                    */
                    
                    // Store expiration and remaining values
                    var expiry = certificates[i].expiration;
					var expiryDate = new Date(expiry);
					var today = new Date();
					var expired = false;
					if (expiryDate < today) { expired = true; }

					var remainingValue = 'Unlimited';
					var remainingType = 'Classes';
					switch (certificates[i].type) {
						case 'value':
                            // remainingValue = (certificates[i].remainingValue / classPrice);
                            remainingValue = `$${parseFloat(certificates[i].remainingValue).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
						    remainingType = '';
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

					// Add HTML button to delete code
					var buttonID = `delete_code_submit_${certificates[i].certificate}`;
					certificatesOutput += `<button type="button" id=${buttonID} class="submit-button-delete-small">....DELETE CODE..删除....</button>`
					
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

			// EVENT: Capture delete code submit
			$('.submit-button-delete-small').on('click', async (e) => {
				e.preventDefault();
				console.log(`Event captured: ${e.currentTarget.id}`);
				console.log(e);

				// Cache delete button element to update properties after code deletion attempt
				var $deleteButtonElement = $(`#${e.currentTarget.id}`);

				// Capture delete code and search through certificates array and find ID of code to send for deletion
				var codeToDelete = e.currentTarget.id.split('_')[3];
				var codeIdToDelete = certificates.find(x => x.certificate === codeToDelete).id;
				console.log(`Code to delete: ${codeToDelete} and ID: ${codeIdToDelete}`);
				
				// Make API call to delete student code and disable button if successful
				var deleteCodeResult = await deleteCode(codeIdToDelete);
				
				if (deleteCodeResult) {
					$deleteButtonElement.text('DELETED').prop('disabled', true).addClass('disabled');
				} else {
					$deleteButtonElement.text('ERROR').prop('disabled', true).addClass('disabled');
				}
			});

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
			confirmPaymentDetails(event, action, products, $revealedElements, $submitButtonElement, submitButtonText);
		});
		
		// EVENT: Select package dropdown change - reveal payment method dropdown
		$('#select_package_class_dropdown').change( (e) => {
			e.preventDefault();
			console.log(`Event captured: ${e.currentTarget.id}`);
			console.log(e);

			// Make payment method dropdown visible or single class submit button
			switch (action) {
				case 'buy_class_top':
				case 'buy_package_top':
					var $element = $('#payment_method_div');
					$revealedElements = revealElement($element, $revealedElements);

					// Populate confirmation details
					var event = e.currentTarget.id;
					confirmPaymentDetails(event, action, products, $revealedElements, $submitButtonElement, submitButtonText);
					break;
				case 'buy_single_class_top':
				case 'book_private_class_top':
					// As long as value is selected enable submit button and apply submit text
					let selectedClassVal = $('#select_package_class_dropdown').val();
					if (selectedClassVal !== 'Select One' ) {
						// Perhaps no need to add multi-language submit button text here, causes issues as added after multilingualizer has parsed text
						// $submitButtonElement.prop('disabled', false).removeClass('disabled').val(submitButtonText);
						$submitButtonElement.prop('disabled', false).removeClass('disabled');
						var $element = $('#buy_single_class_submit');
						$revealedElements = revealElement($element, $revealedElements);
					} else {
						$submitButtonElement.prop('disabled', true).addClass('disabled');
					}
					break;
			}
		});

		// EVENT: Select payment method dropdown change - enable required options and reveal submit button
		$('#payment_method_dropdown, #employee_commission_dropdown').change(async (e) => {
			e.preventDefault();
			console.log(`Event captured: ${e.currentTarget.id}`);
			console.log(e);
			
			// Retrieve requested action (buy class or package) and store submit button element
			var $dropdown = $('#payment_method_dropdown');
			switch (action) {
				case 'buy_class_top':
					$submitButtonElement = $('#buy_class_submit');
					submitButtonText = '....BUY CLASS SERIES..购买成品系列课....';
					break;
				case 'buy_package_top':
					$submitButtonElement = $('#buy_package_submit');
					submitButtonText = '....BUY PACKAGE..现在购买....';
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
					submitButtonText = '....ENTER CARD DETAILS..输入银行卡的详细....';
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
					submitButtonText = '....SCAN QR CODE..扫二维码....';
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
					$commissionDropdown.prepend("<option value='select' selected='selected'>....Select One..选择一项....</option>");
				} else {
					console.log('PAYMENT METHOD CHANGE EVENT: DDY instructors array already populated, skipping API call.');
				}
			}

			// Populate confirmation details box for user to see all purchase details before submitting
			var event = e.currentTarget.id;
			confirmPaymentDetails(event, action, products, $revealedElements, $submitButtonElement, submitButtonText);
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
			confirmPaymentDetails(event, action, products, $revealedElements, $submitButtonElement, submitButtonText);
		});

		// EVENT: Dropdown or form change with NO additional dependencies - update relevant details in payment confirmation box
		$('#deposit_amount, #employee_commission_dropdown, #updated_price').change( (e) => {
			e.preventDefault();
			console.log(`Event captured: ${e.currentTarget.id}`);
			console.log(e);

			// Populate event and update payment confirmation box
			var event = e.currentTarget.id;
			confirmPaymentDetails(event, action, products, $revealedElements, $submitButtonElement, submitButtonText);
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
			upcomingClasses = await retrieveUpcomingClasses(action, selectedLocation, upcomingClasses, $revealedElements);
			console.log('Upcoming Classes:', upcomingClasses);
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
				// Capture selected class name and date to find class index				
				var selectedClass = $('#upcoming_classes_dropdown').val();
				var selectedClassName = selectedClass.split('-')[0].trim();
				var selectedClassDate = selectedClass.split('-')[1].trim();
				var selectedClassDateObj = new Date(selectedClassDate);
				
				// Search through array and match class name and time to retrieve selected class index to pass to child window
				var selected_class_index = upcomingClasses.findIndex(x => x.name === selectedClassName && new Date(x.time).getTime() === selectedClassDateObj.getTime());
				console.log(`GENERATE CHECK-IN TABLE: Selected class: ${selectedClass}`);
				console.log(`GENERATE CHECK-IN TABLE: Selected class index: ${selected_class_index}\n`, upcomingClasses[selected_class_index]);
				
				// Capture class date from datepicker to pass to child window
				var classDate = $('#checkin_datepicker').datepicker('getDate');

				// Retrieve all appointments for selected class
				var selectedAppointments = await retrieveAppointments(upcomingClasses, classDate, selected_class_index);
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
						window.upcomingClasses = upcomingClasses;
						window.classDate = classDate;
						window.selected_class_index = selected_class_index;
						window.selectedLocation = selectedLocation;
						
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

			// Populate DDY member report details
			allCertificates = await getDdyMembers(allCertificates, $revealedElements);

			// GET APPOINTMENTS DATA AND BUILD CHARTS
			if (allCertificates) {
				var result = await buildStudioMetricsCharts(selectedDateFrom, selectedDateTo);
						
				if (result) {
					// Reveal studio metrics containers and re-enable submit button
					var $element = $('#studio_metrics_data_div');
					$revealedElements = revealElement($element, $revealedElements);

					var $element = $('#studio_metrics_data_charts_div');
					$revealedElements = revealElement($element, $revealedElements);

					var $element = $('#studio_metrics_submit');
					$element.prop('disabled', false).removeClass('disabled');
				} else {
					console.error(`GET STUDIO METRICS: Error generating studio metrics`);				
					var message = { title: 'ERROR', body: "Error retrieving studio metrics, please try again." };
					writeMessage('modal', message);	
				}
			} else {
				console.error(`GET STUDIO METRICS: Error retrieving DDY member info`);				
				var message = { title: 'ERROR', body: "Error retrieving DDY member info, please try again." };
				writeMessage('modal', message);
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