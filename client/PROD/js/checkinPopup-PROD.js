<!DOCTYPE html>
<html lang="en">
	<head>
      	<link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
        <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.10.19/css/jquery.dataTables.css"></link>
        <link rel="stylesheet" type="text/css" href="https://sophiadance.squarespace.com/s/loadingSpinnerRingEase.css"></link>
        <link rel="stylesheet" type="text/css" href="https://sophiadance.squarespace.com/s/ddy-mystudio-PROD.css"></link>
        <style type="text/css">
            html, body {
                min-height: 100%;
                margin: auto;
                background-color: white;
            }
        </style>
    </head>

<body>
    <div id="popup_window_div" class="popup-window-top">
        <!-- Placeholder to hold teacher and class info -->
        <div id="class_title_div" class="class-title"></div>
        <div id="top_of_table_div" class="top-of-table">
            <div class="center"><h3 class="inline-block"><strong>点击您的名字登录 | TAP YOUR NAME TO CHECK IN</h3></strong></div>
        </div>
        <div id="class_info_div" class="class-details"></div>
        <div id="spacer_div" class="spacer"></div>
        
        <!-- LOADING DIV -->
        <div id="loader-div" class="loader-ring hide">
			<div class="loading loading--full-height"></div>
		</div>

        <!-- Placeholder HTML table for student check-in list - populated by DataTable() -->    
        <div id="checkin_table_div" class="checkin-table-head">
            <table id="checkin_table" class="display table">
                <thead>
                    <tr>
                        <th></th>
                        <th>First Name</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
            </table>
        </div>        
        
        <!-- Table footer -->
        <div id="table_footer_div" class="table-footer">
            <div id="teacher_checkin_div" class="teacher-checkin">
                <!-- Dropdown to hold DDY teacher names -->
                <div id="teacher_checkin_dropdown_div">
                    <label for="teacher_checkin_dropdown" class="form-label"><b>Instructor: </b></label>
                    <select id="teacher_checkin_dropdown" class="dropdown">
                        <option value="select">Select One</option>
                    </select>
                    <input type="submit" id="teacher_checkin_submit" class="submit-button-checkin" value="Instructor Check-In" />
                </div>
            </div>        
            <div id="register_now_div" class="register-now">
                <input type="submit" id="register_now_submit" class="submit-button-checkin right" value="Register Now" />
            </div>
        
            <!-- Dropdown to select another class -->            
            <div id="select_another_class_dropdown_div" class="select-another-class-dropdown">
                <label for="select_another_class_dropdown" class="form-label"><b>Select another class: </b></label>
                <select id="select_another_class_dropdown" class="dropdown">
                    <option value="select">Select One</option>
                </select>
            </div>
        </div>

        <!-- Fullscreen and slots info -->
        <input type="submit" id="fullscreen_submit" class="submit-button-checkin inline-block hide" value="Fullscreen" />
        <div id="slots_info_div" class="slot-details right"></div>        
    </div>
    
    <!-- Debug and errors -->
    <div id="debug_output" class="hide"></div>    
    <div id="error_message"></div>
    
    <!-- JQUERY UI MODAL CONTAINER -->
	<div id="modal_output"></div>
</body>

<script type="text/javascript">
{
$( async () => {
    'use strict';

    // FUNCTION: toggleFullScreen()
    // 1) Toggle fullscreen mode with cross-browser compatibility
    // NOTE: Fullscreen button has been hidden as not needed with kiosk app functionality (already fullscreen)
    function toggleFullScreen($element) {
        var $element = $element || document.documentElement;
        if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
            $('#fullscreen_submit').val('Exit Fullscreen');
            if ($element.requestFullscreen) {
                $element.requestFullscreen();
            } else if ($element.msRequestFullscreen) {
                $element.msRequestFullscreen();
            } else if ($element.mozRequestFullScreen) {
                $element.mozRequestFullScreen();
            } else if ($element.webkitRequestFullscreen) {
                $element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            }
        } else {
            $('#fullscreen_submit').val('Fullscreen');
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
    }
    
    // FUNCTION: addClassInfo()
    // 1) Take appointments as argument and populate the class name, time, available slots, and other info on the check-in page
    function addClassInfo(upcomingClasses, selected_class_index, selectedAppointments) {
        // Get class slots info and check if class is full    
        var slotsAvail = upcomingClasses[selected_class_index].slotsAvailable;
        var classFull = false;
        if (slotsAvail < 1) {
            classFull = true;
        }

        if (debug) {
            console.log('classFull is: ', classFull);
        }
        
        // Store class name and date and populate class_info HTML
        var className = selectedAppointments[0].type;
        var classDate = selectedAppointments[0].date;
        var classTime = selectedAppointments[0].time;

        var classTitleHTML = `<h2><strong>Welcome to Dream Dance and Yoga @ ${selectedLocation}</strong></h2>`;
        $('#class_title_div').html(classTitleHTML);
        
        // OLD design with select another class button that closes window
        // var classInfoDetailsHTML = `<h3 class="inline"><strong>${className}</strong><br>${classDate} ${classTime}
        // <input type="submit" id="close_window_submit" class="select-another-class submit-button" value="Select another class" /></h3>`;
        var classInfoDetailsHTML = `<h3 class="inline-block"><strong>${className}</strong><br>${classDate} ${classTime}</h3>`;        
        $('#class_info_div').html(classInfoDetailsHTML);

        // Store slots available info and populate slots_info HTML
        if (classFull) {
            var slotsInfoHTML = `<h3><strong>CLASS FULL!</strong></h3>`;
            $('#slots_info_div').addClass('class-full');
        } else {
            var slotsInfoHTML = `<h3>Slots available: <strong>${slotsAvail}</strong></h3>`;
        }
        $('#slots_info_div').html(slotsInfoHTML);

        return classFull;
    }

    // FUNCTION: populateClasses(upcomingClasses)
    // 1) Receive list of upcoming classes for the selected day
    // 2) Populate dropdown menu with list of upcoming classes
    async function populateClasses(upcomingClasses, selectedLocation) {
    // Filter upcoming classes array to only include classes from selected studio location
    console.log(`POPULATE CLASSES POPUP: Upcoming classes:`, upcomingClasses);
    console.log(`POPULATE CLASSES POPUP: Selected location:`, selectedLocation);

    var action = 'select_another_class_dropdown';
    var filteredClasses = await filterProductsClasses(action, selectedLocation, upcomingClasses, $revealedElements);
    console.log(`POPULATE CLASSES POPUP: Filtered classes for ${selectedLocation}:`, filteredClasses);
    
    // Populate select another class dropdown menu with upcoming classes
    var $dropdown = $('#select_another_class_dropdown');
    var func = "classes";
    populateDropdown($dropdown, filteredClasses, func);
    }

    // FUNCTION: prepareApptData()
    // 1) Loop through appointments object to prepare data for display
    //    a. Append buttom HTML to selectedAppointments for table rendering
    //    b. Prepare student type field with information based on certificate code
    function prepareApptData(selectedAppointments) {
        $.each(selectedAppointments, (i, val) => {
            // Append check-in button HTML
            selectedAppointments[i].buttonHTML = `<button type="button" id="${selectedAppointments[i].id}" class="submit-button-checkin">Check In</button>`;
            if (debug) {
                console.log(`selectedAppointments[${i}].buttonHTML is: `, selectedAppointments[i].buttonHTML);
            }
            
            // Generate full name
            selectedAppointments[i].fullName = `${selectedAppointments[i].firstName} ${selectedAppointments[i].lastName}`
            
            // Translate certificate code to readable student type
            var cert = selectedAppointments[i].certificate;
            
            if (debug) {
                console.log(`Cert for ${selectedAppointments[i].firstName}: ${cert}`);
            }

            if (cert) {
                if (cert.includes('TRIAL')) { cert = "TRIALCLASS"; }
                switch (cert) {
                    case 'CLASSPASS':
                        selectedAppointments[i].studentType = "<img class='ddy-member' src='https://sophiadance.squarespace.com/s/classpass-logo-transparent.png'>";
                        break;
                    case 'TRIALCLASS':
                    case 'FIRSTCLASSFREE':
                        selectedAppointments[i].studentType = 'TRIAL CLASS';
                        break;
                    case 'DDYINSTRUCTOR':
                        selectedAppointments[i].studentType = 'INSTRUCTOR';
                        // Set instructor dropdown value
                        $('#teacher_checkin_dropdown').val(`${selectedAppointments[i].firstName} ${selectedAppointments[i].lastName}`);
                        // Disable instructor check-ins
                        $('#teacher_checkin_submit').val('Cancel Instructor Check-in');
                        $('#teacher_checkin_dropdown').prop('disabled', true);
                        $('#teacher_checkin_dropdown').addClass('disabled');
                        // Clear button HTML so check-in button is not displayed for instructors
                        selectedAppointments[i].buttonHTML = '';
                        // Hack to ensure the instructor name is listed at top of the table
                        selectedAppointments[i].firstName=`00${selectedAppointments[i].firstName}`;
                        break;
                    default:
                        selectedAppointments[i].studentType = "<img class='ddy-member' src='https://sophiadance.squarespace.com/s/ddy-logo-small.png'>";
                }
            } else {
                selectedAppointments[i].studentType = 'Single class';
            }
        });
    
        if (debug) {
            console.log('Appointments list is:', selectedAppointments);
            console.log('debug is: ', debug);        
        }
        
        return selectedAppointments;
    }

    // FUNCTION: buildDatatable()
    // 1) Take object as an argument
    // 2) Build a table using the DataTable() API
    function buildDatatable(selectedAppointments) {
        // Build datatable
        try {
            checkin_table = $('#checkin_table').DataTable({
                "data": selectedAppointments,                
                "pageLength": 25,            
                "order": [[2, 'asc']],
                "paging": false,
                "info": false,
                "searching": false,
                columnDefs: [
                    { targets: 1, className: "student-name dt-center" },
                    { targets: '_all', orderable: false, className: "checkin-table dt-center" },
                    { targets: 2, visible: false },                
                    // { targets: 0, width: "65%" },
                    { targets: 3, width: "25%" },
                    { targets: 0,                        
                        createdCell: function(td, cellData, rowData, col) {
                            switch (cellData) {
                                case 'Classpass':
                                    $(td).addClass('classpass');
                                    break;
                                case 'TRIAL CLASS':
                                    $(td).addClass('trialclass');
                                    break;
                                case 'INSTRUCTOR':
                                    $(td).addClass('instructor');
                                    break;
                                case 'Dream Dance and Yoga Member':
                                    $(td).addClass('ddy-member');
                                    break;
                            }
                        }
                    }
                ],
                "columns": [
                    { "data": "studentType"},
                    { "data": "fullName"},
                    { "data": "firstName"},                    
                    { "data": "buttonHTML"}
                    // { "defaultContent": `<button type="button" class="check-in">Check In</button>` }                
                ]
            });
        }
        catch (e) {
            console.log('ERROR: Error building datatable!');
            console.log (e);
            var message = { title: 'ERROR', body: `Error building student check-in table, please check and try again` };
            writeMessage('modal', message);
        }        
    }
    
    // FUNCTION: initRowStyles()
    // 1) Loop throw table rows and apply colors for specific conditions
    function initRowStyles() {
        // Run once at initialization to apply selected color to row if student is already checked in
        checkin_table.rows().every(function() {
            var currentRow = this.data()
            var studentNote = currentRow.notes;
            var type = currentRow.studentType;
            if (debug) {
                console.log('Current row:', currentRow);
                console.log('Notes is: ', studentNote);
                console.log('Type is: ', type);
            }

            // If NOTES field contains "checked in" then apply class and update button text
            if (typeof studentNote === 'undefined') {
                console.log(`${currentRow.firstName} has NOT checked in`);
            } else if (studentNote.includes('checked in')) {
                console.log(`${currentRow.firstName} has checked in`);                
                this.nodes().to$().addClass('selected');
                $(`#${currentRow.id}`).html('Cancel Check-in');
            } else {
                console.log(`${currentRow.firstName} has NOT checked in`);
            }
        });
    }

    // FUNCTION: applyRowStyle()
    // 1. Update css class to selected row
    // 2. Update check-in button HTML
    function applyRowStyle($row, data, checkedIn) {
        console.log('In applyRowStyle() checkedIn is: ', checkedIn);
        if (checkedIn) {
            $($row).removeClass('selected');
            $(`#${data.id}`).html('Check In');
        } else {            
            $($row).addClass('selected');
            $(`#${data.id}`).html('Cancel Check In');
        }
    }

    // FUNCTION: checkIn()
    // 1) Receive reference to clicked row and student data as an object
    // 2) If check-in, populate Acuity appointment notes field with check-in detils
    // 3) If cancel check-in, remove notes from Acuity appointment notes field
    async function checkIn(data, checkedIn, checkInType) {
        // Store student information
        var apptId = data.id;
        var firstName = data.firstName;
        var lastName = data.lastName;
        var className = data.type;

        if (debug) {
            console.log('data is:');
            console.log(data);
            console.log(`checkInType: ${checkInType}`);
        }        

        // Store timestamp and check-in string for log message in Acuity notes field
        var timestamp = new Date().toLocaleString();
        
        if (checkedIn) {
            // Cancel check in - remove text from Acuity notes field and update table            
            // var checkInNote = `${timestamp}: Check-in cancelled for ${firstName} ${lastName}`;
            var checkInNote = '';
            var params = {
                id: apptId,
                checkInNote
            }
            
            try {
                var funcType = 'appointments_put';
                var activity = 'updateStudentNotes';
                var appointmentsResult = await initApiCall(funcType, activity, params);
                console.log('AppointmentsResult is:', appointmentsResult);
                
                // If successful update table and alert student
                // add below to update row function
                // applyRowStyle($row, data, 'checkout');
                // Confirm check in message
                
                // If successful alert student - REMOVE MODAL TO MAKE QUICKER
                // var message = { title: 'Check-in Cancelled', body: `Check-in for ${firstName} ${lastName} has been cancelled.` };
                // writeMessage('modal', message);

                return appointmentsResult;
            }
            catch (e) {
                console.log(`ERROR: Error detected in initApiCall: ${funcType}`);
                console.log (e);
                var message = { title: 'ERROR', body: `An error occured updating appointment notes, please check and try again` };
                writeMessage('modal', message);
                return false;
            }
        } else {
            // Student / Instructor has not checked in yet, gather data and make Acuity API call to update notes
            if (checkInType === 'instructor' ) {
                var checkInNote = `${timestamp}: [INSTRUCTOR CHECK-IN] ${firstName} ${lastName} checked in to ${className}`;
            } else {
                var checkInNote = `${timestamp}: ${firstName} ${lastName} checked in to ${className}`;
            }
            var params = {
                id: apptId,
                checkInNote
            }
            
            try {
                var funcType = 'appointments_put';
                var activity = 'updateStudentNotes';
                var appointmentsResult = await initApiCall(funcType, activity, params);
                console.log('AppointmentsResult is:', appointmentsResult);
                
                // If successful update table row with new class and alert student                
                // add below to update row function
                // applyRowStyle($row, data, 'checkin');

                // If successful alert student
                // var message = { title: `${firstName} ${lastName} Checked In!`, body: `Thanks for checking in, ${firstName}!<br>Enjoy your class :)` };
                // writeMessage('modal', message);

                return appointmentsResult;
            }
            catch (e) {
                console.log(`ERROR: Error detected in initApiCall: ${funcType}`);
                console.log (e);
                var message = { title: 'ERROR', body: `An error occured updating appointment notes, please check and try again` };
                writeMessage('modal', message);
                return false;
            }
        }
                
    }

    // FUNCTION: getCertificateForStudent()
    // 1) Receive a client object and trial class boolean
    // 2) Apply trial class cert if appropriate, otherwise iterate through available certificates
    // 3) Return the most recent appropriate, non-expired certificate
    async function getCertificateForStudent(selectedClient, trialClass) {
        var trialClassCert = 'TRIALCLASSWALKIN'
        var certificate = '';
        if (trialClass) {
            return trialClassCert;
        } else {
            try {                
                var funcType = 'certificates_get';
                var activity = 'retrieveCertificatesByEmail';
                var clientEmail = selectedClient[0].email;
                var certificatesResult = await initApiCall(funcType, activity, clientEmail);
                console.log('certificatesResult is:', certificatesResult);                    
                
                if (!certificatesResult || certificatesResult.length < 1) {
                    certificate = '';
                } else {
                    // Iterate through array of certificates and select the latest, non-expired certificate                        
                    var today = new Date();
                    var appointmentTypeID = selectedAppointments[0].appointmentTypeID;
                    $.each(certificatesResult, (i, val) => {
                        var latestCertExpiryString = val.expiration;
                        var latestCertExpiry = new Date(latestCertExpiryString);    
                    
                        if (latestCertExpiry < today) {
                            // Cert is expired
                            console.log(`Certificate ${val.certificate} for ${clientEmail} is expired`);
                            certificate = '';
                        } else {
                            // Check if certificate includes the appointment type of the class being booked                                
                            var appointmentTypeIDs = val.appointmentTypeIDs;
                            if (debug) {
                                console.log(`Certificate ${val.certificate} is not expired`);
                                console.log(`Appointment type: ${appointmentTypeID}`);
                                console.log('Appointment Type IDs array:', appointmentTypeIDs);
                            }
                            
                            if (appointmentTypeIDs.includes(appointmentTypeID)) {
                                certificate = val.certificate;
                                console.log(`VALID CERT FOUND: ${certificate}`);
                                return false;
                            }
                        }
                    });                   
                }
            }
            catch (e) {
                console.log(`ERROR: No records returned for ${clientEmail}`);
                console.log(e);
                certificate = '';
            }
        }
        console.log(`Cert to be applied is: ${certificate}`);
        return certificate;
    }

    // FUNCTION: addStudentToClass()
    // 1) Receive array of appointments and a client object
    // 2) Add the client to the specified class with appropriate note    
    async function addStudentToClass(selectedClient, certificate, checkInType) {
        // If cert type is instructor, add label for instructor
        var instructorLabelID = 233422;
        if (certificate === 'DDYINSTRUCTOR') {
            var labelID = instructorLabelID;
        }
        
        // Store required parameters for appointment post API call
        var classId = selectedAppointments[0].appointmentTypeID;
        var datetime = selectedAppointments[0].datetime;
        var firstName = selectedClient[0].firstName;
        var lastName = selectedClient[0].lastName;
        var email = selectedClient[0].email;
        var phone = selectedClient[0].phone;
        // var calendarID = upcoming_classes[selected_class_index].calendarID;
        var calendarID = selectedAppointments[0].calendarID;
        var params = {
            classId,
            datetime,
            firstName,
            lastName,
            email,
            phone,
            certificate,
            calendarID,
            labelID
        };
        
        if (debug) {
            console.log('Appointments POST params:', params);
        }
        
        // Make API call to add walk-in student to class
        try {
            var funcType = 'appointments_post';
            var activity = 'addToClass';
            var appointmentsResult = await initApiCall(funcType, activity, params);
            console.log('AppointmentsResult is:', appointmentsResult);
            
            // If successful call check-in for added student to add notes
            if (appointmentsResult) {
                var checkInResult = await checkIn(appointmentsResult, false, checkInType);
                console.log('Check-in result: ', checkInResult);
            }
        }
        catch (e) {
            console.log(`ERROR: Error detected in initApiCall: ${funcType}`);
            console.log (e);
            var errorText = e.responseText;
            console.log(`Error text is: ${errorText}`);
            if (errorText.includes('invalid for appointment type')) {
                var message = { title: 'ERROR', body: `No valid code for this student to book classes!  Please check with Dream Dance and Yoga staff.` };
            } else {
                var message = { title: 'ERROR', body: `Error creating appointment!  Please tell Greg!<hr>${errorText}` };
            }
            writeMessage('modal', message);
            return false;
        }
        return appointmentsResult;
    }

    // FUNCTION: initializeAppointmentsTable()
    // 1) Run the required functions to gather and prepare data
    // 2) Build the datatable
    async function initializeAppointmentsTable(firstLoad, selected_class_index) {
        // Retrieve all appointments for selected class
        selectedAppointments = await retrieveAppointments(upcomingClasses, classDate, selected_class_index);
        console.log('INIT APPTS TABLE: Upcoming classes: ', upcomingClasses);
        console.log('INIT APPTS TABLE: Appointments result: ', selectedAppointments);
        
        if (!selectedAppointments) {
            var message = { title: 'No Bookings!', body: `No bookings for this class!` };
            writeMessage('modal', message);            
            return false;
        }

        // Capture list of instructors the first time the window is open
        if (instructors.length === 0) {
            instructors = await getDdyInstructors();
            
            // Populate instructor dropdown menu
            var $dropdown = $('#teacher_checkin_dropdown');
            var func = "teachers";
            populateDropdown($dropdown, instructors, func);
        } else {
            console.log('INIT APPTS TABLE: Instructors array already populated, skipping instructor capture.');
        }

        // Populate dropdown list of other classes
        populateClasses(upcomingClasses, selectedLocation);

        // Enable instructor check-in button
        $('#teacher_checkin_submit').val('Instructor Check-in');
        $('#teacher_checkin_dropdown').prop('disabled', false);
        $('#teacher_checkin_dropdown').removeClass('disabled');

        // Update appointments array with data for table
        selectedAppointments = prepareApptData(selectedAppointments);

        // Build the table
        if (firstLoad) {
            buildDatatable(selectedAppointments);
        } else {
            checkin_table.clear().draw();
            checkin_table.rows.add(selectedAppointments);
            checkin_table.columns.adjust().draw();
        }

        // Add class detail to webpage
        classFull = addClassInfo(upcomingClasses, selected_class_index, selectedAppointments);

        // Apply colors to the table rows as required
        initRowStyles();
    }

    // MAIN //
    console.log('Popup window ready');
    
    // Pass vars from parent window
    var debug = window.opener.debug;
    var environment = window.opener.environment;
    var upcomingClasses = window.opener.upcomingClasses;
    var classDate = window.opener.classDate;
    var selected_class_index = window.opener.selected_class_index;
    var selectedLocation = window.opener.selectedLocation;

    // Declare vars
    var selectedAppointments = [];
    var instructors = [];
    var clients = [];
    var checkin_table = {};
    var classFull = false;
    var pin64 = null;

    // Declare var to hold array of div/button elements to clean up
    var $revealedElements = [];

    if (debug) {
        $('#debug_output').removeClass('hide').addClass('debug-output');
        writeMessage('debug', "<b>Debug mode ON</b>");

        // Log passed vars
        console.log('Upcoming classes: ');
        console.log(upcomingClasses);
    }    

    // Gather data and build the table
    await initializeAppointmentsTable(true, selected_class_index);

    // EVENT: CHECK-IN TABLE ROW / CHECK-IN BUTTON click - event to be captured after dynamic table is generated    
    $('#checkin_table tbody').on('click', 'tr', async function(e) {
        e.preventDefault();
        // Clear any error message
        writeMessage('error', "");

        if (debug) {
            writeMessage('debug', "<br><b>clicked CHECK-IN TABLE ROW OR BUTTON...</b>");                
        }

        // Capture clicked row data
        var studentData = checkin_table.row(this).data();

        if (debug) {
            console.log('This row: ', this);
            console.log('studentData: ', studentData);            
        }

        // Check if instructor row was clicked, otherwise proceed
        if (studentData.certificate === 'DDYINSTRUCTOR') {
            var message = { title: 'Note', body: `Cancel check-in for instructors using the Instructor button below.` };
            writeMessage('modal', message);
        } else {
            // Check if student has already checked in or not
            var checkedIn = $(this).hasClass('selected');
            if (debug) {                
                console.log(`CheckedIn for ${studentData.firstName}: ${checkedIn}`);
            }

            // Call checkIn function to amend student record in Acuity
            checkIn(studentData, checkedIn);

            // Apply row Styles etc        
            applyRowStyle(this, studentData, checkedIn);    
        }
    });

    // EVENT: TEACHER CHECK-IN BUTTON click
    // FUNCTION: Add instructor to class and mark as teacher for reporting purposes
    $('#teacher_checkin_submit').on('click', async (e) => {
        e.preventDefault();
        // Clear any error message
        writeMessage('error', "");

        if (debug) {
            writeMessage('debug', "<br><b>clicked TEACHER CHECK-IN BUTTON...</b>");                
        }

        // Bring up PIN window - check PIN is valid
        // Bring up modal with search and student dropdown fields to register a walk-in student
        var message = {
            title: 'Instructor Check-in',
            body: `<div id="instructor_pin_div" class="sqsp-font">                        
                        <form id="instructor_pin_form">
                            <label for="instrutor_pin" class="sqsp-font"><b>Enter PIN: </b></label>
                            <input type="text" name="instructor_pin" id="instructor_pin" value="" autocomplete="new-password" />
                            <input type="submit" name="instructor_pin_submit" id="instructor_pin_submit" class="sqsp-font" value="Submit" />
                        </form>
                    </div>
                    <br>
                    <div id="pin_message_div" class="hide center"></div>`
        };
        var $pinModalDialog = writeMessage('modal-cancel', message);
        $('#instructor_pin_form').focus();

        // If PIN not retrieved yet, retrieve from server
        if (pin64 === null) {
            // PIN has not been retrieved yet - retrieve from server
            pin64 = await initApiCall('pin');
        } else {
            console.log('TEACHER CHECK-IN: PIN already retrieved.');
        }

        // Set pin
        var pin = atob(pin64);
        var badPinCount = 0;
        const MAX_TRIES = 3;

        // EVENT: INSTRUCTOR PIN SUBMIT
        $('#instructor_pin_form').on('submit', async (e) => {
            e.preventDefault();

            if (debug) {
                writeMessage('debug', `<br>Submit invoked on instructor_pin`);
            }

            // Cache and disable submit button, clear error messages
            writeMessage('error', "");
            var $submitButton = $('#instructor_pin_submit');
            $submitButton.prop('disabled', true).addClass('disabled');

            // Check submitted PIN matches instructor PIN code
            var inputPin = $('#instructor_pin').val();

            if (inputPin != pin) {
                badPinCount++;
                console.log('PIN incorrect!');                
                
                // Show alert, clear PIN field and re-enable submit button                
                var $pinMsgElement = $('#pin_message_div');
                $pinMsgElement.removeClass('hide');
                $pinMsgElement.html(`<b>Pin Incorrect! Please try again. (${badPinCount}/${MAX_TRIES})`);
                $('#instructor_pin').val('');

                // Check if exceeded max retries
                if (badPinCount > MAX_TRIES) {
                    // Close PIN dialog modal
                    $pinMsgElement.html(`<b>Exceeded max retry attmpts!  Closing...</b>`);
                    $pinModalDialog.dialog('close');
                    console.log(`INSTRUCTOR PIN: Exceeded max pin retry attempts`);
                }
                
                $submitButton.prop('disabled',false).removeClass('disabled');
            } else {
                // PIN is correct - proceed with instructor check-in
                console.log('PIN correct');
                $('#pin_message_div').removeClass('hide');
                $('#pin_message_div').html('<b>Thank you!</b>');
                
                // Filter instructor object for selected instructor
                var selectedInstructor = $('#teacher_checkin_dropdown').val();
                
                if (debug) {
                    console.log(`Selected instructor: ${selectedInstructor}`);
                    console.log('Instructors:', instructors);
                }
                
                // Filter instructors array for the selected instructor from dropdown
                var classInstructor = $(instructors).filter((i) => {
                    return (`${instructors[i].firstName} ${instructors[i].lastName}` === selectedInstructor);
                });
                console.log('Selected instructor is:', classInstructor);

                // If CANCEL check-in - remove instructor from class, re-enable instructor dropdown
                if ($('#teacher_checkin_dropdown').hasClass('disabled')) {
                    // CREATE FUNCTION HERE - cancelInstructorCheckin(selectedAppointments)

                    // Call checkIn to cancel instructor check-in
                    try {
                        // Filter selected appointments array to get instructor appointment data
                        var classInstructorAppt = $(selectedAppointments).filter((i) => {
                            return (`${selectedAppointments[i].certificate}` === 'DDYINSTRUCTOR');
                        });                        
                        console.log('Class instructor appt is:', classInstructorAppt);

                        var cancelNote = 'Instructor check-in cancel';
                        var apptId = classInstructorAppt[0].id;
                        var funcType = 'appointments_put';
                        var activity = 'cancelAppointment';
                        var params = {
                            apptId,
                            cancelNote
                        }
                        
                        var appointmentsResult = await initApiCall(funcType, activity, params);
                        console.log('AppointmentsResult is:', appointmentsResult);

                        // If successful alert student and re-enable check-in button - REMOVE MODAL TO MAKE QUICKER
                        // var message = { title: 'Check-in cancelled', body: `Check-in cancelled for ${classInstructor[0].firstName} ${classInstructor[0].lastName}.` };
                        // writeMessage('modal', message);

                        $('#teacher_checkin_submit').val('Instructor Check-in');
                        $('#teacher_checkin_dropdown').prop('disabled', false);
                        $('#teacher_checkin_dropdown').removeClass('disabled');

                        // If successful reload table
                        if (appointmentsResult) {
                            console.log('Reloading table...!');
                            // window.location.reload();
                            initializeAppointmentsTable(false, selected_class_index);
                        }
                    }
                    catch (e) {
                        console.log(`ERROR: Error cancelling instructor check in!`);
                        console.log (e);
                        var message = { title: 'ERROR!', body: `Error while cancelling instructor check in!  Please try again.` };
                        writeMessage('modal', message);
                    }
                } else {
                    // Add instructor to class with 'instructor' check-in note
                    // Set check-in type and add student to class
                    try {
                        var checkInType = 'instructor';
                        var certificate = 'DDYINSTRUCTOR';
                        var addInstructorResult = await addStudentToClass(classInstructor, certificate, checkInType);
                        console.log('addInstructorResult:', addInstructorResult);

                        if (addInstructorResult) {
                            // Alert instructor check-in was successful - REMOVE MODAL TO MAKE FASTER
                            // var message = { title: `Instructor Check-in Successful for ${classInstructor[0].firstName} ${classInstructor[0].lastName}!`, body: `Thanks for checking in, ${classInstructor[0].firstName}.  Enjoy your class!` };
                            // writeMessage('modal', message);

                            // If successful update check-in button
                            $('#teacher_checkin_submit').val('Cancel Instructor Check-in');
                            $('#teacher_checkin_dropdown').prop('disabled', true);
                            $('#teacher_checkin_dropdown').addClass('disabled');

                            // If successful reload table                            
                            console.log('Reloading table...!');                
                            // window.location.reload();
                            initializeAppointmentsTable(false, selected_class_index);                            
                        }
                    }
                    catch (e) {
                        console.log(`ERROR: Error adding instructor to class!`);
                        console.log (e);
                    }
                }                
                // Close PIN dialog modal
                $pinModalDialog.dialog('close');
            }            
        });
    });
    
    // EVENT: REGISTER NOW BUTTON click
    // FUNCTION: Register walk-in student to class if spaces available
    $('#register_now_submit').on('click', async function(e) {
        e.preventDefault();
        // Clear any error message
        writeMessage('error', "");

        if (debug) {
            writeMessage('debug', "<br><b>clicked REGISTER WALK-IN BUTTON...</b>");                
        }

        // If class is full, don't allow walk-in registrations
        if (classFull) {
            var message = {
                title: 'Class Full!',
                body: "Sorry!  Today's class is already full."
            }
            writeMessage('modal', message);
            
            return false;
        }

        // Bring up modal with search and student dropdown fields to register a walk-in student
        var message = {
            title: 'Register Walk-in Student',
            body: `<div id="search_student_div" class="margin-small sqsp-font">
                        <form id="search_student" action="" method="post">  
                            <label for="search_student" class="sqsp-font"><b>Search Name / Phone / Email: </b></label>
                            <input type="search" name="search_student_form" id="search_student_form" />
                            <input type="submit" name="search_submit" id="search_submit" class="sqsp-font" value="Search" />			
                        </form>
                    </div>            
                    <div id="search_student_dropdown_div" class="margin-small sqsp-font hide">
                        <div class="margin-small">
                            <div class="select-name-dropdown">
                                <label for="search_student_dropdown" class="sqsp-font"><strong>Select Your Name: </strong></label>
                                <select id="search_student_dropdown" name="search_student_dropdown" class="sqsp-font">
                                    <option value="Select One">Select One</option>	
                                </select>
                            </div>
                            <div class="trial-class-checkbox">
                                <input type="checkbox" name="trial_class" id="trial_class_walkin_checkbox" value="trial_class">
                                <label for="trial_class_walkin_checkbox"><strong>Trial Class?</strong></label>
                            </div>
                        </div>
                        <hr>
                        <div id="register_walkin_submit_div" class="margin-small center hide">
                            <input type="submit" id="register_walkin_submit" class="submit-button-large sqsp-font font-size-15x" value="REGISTER" />
                        </div>
                    </div>`
        };    
        var $modalDialog = await writeMessage('modal-cancel', message);        
        
        // AUTOCOMPLETE TEST
        var studentNames = ['Greg Parker', 'Sophia Meng', 'Larry Parker', 'Grace Meng', 'Zhifen Liang'];
        if ($modalDialog) {            
            $('#search_student_form').autocomplete({
                source: studentNames
            });
        }
        // END AUTOCOMPLETE TEST        

        // EVENT: SEARCH STUDENT SUBMIT
        $('#search_student').on('submit', async (e) => {
            e.preventDefault();		
            if (debug) {
                writeMessage('debug', `<br>Submit invoked on search_student`);
            }

            // Cache and disable submit button, clear error messages
            writeMessage('error', "");
            var $submitButton = $('#search_submit');
            $submitButton.prop('disabled', true).addClass('disabled');
            
            // Retrieve student data
            try {
                var checkIn = true;
                clients = await retrieveStudents(checkIn);
                if (debug) {
                    console.log("Clients:");
                    console.log(clients);
                }

                // If successful reveal select student dropdown and submit button
                var $element = $('#search_student_dropdown_div');
                $revealedElements = revealElement($element, $revealedElements);
                var $element = $('#register_walkin_submit_div');
                $revealedElements = revealElement($element, $revealedElements);
            }
            catch (e) {
                console.error(`REGISTER NOW: Error retrieving students: ${e.responseText}`);
                console.error(e);
                var message = { title: 'ERROR', body: "Error retrieving students, please try again." };
                writeMessage('modal', message);
            }		

            // Clear search query, re-enable submit button
            // $('#search_student_form').val('');
            $submitButton.prop('disabled', false).removeClass('disabled');		
        });

        // EVENT: REGISTER WALK-IN STUDENT SUBMIT
        $('#register_walkin_submit').on('click', async (e) => {
            e.preventDefault();		
            if (debug) {
                writeMessage('debug', `<br>Submit invoked on search_student`);
                console.log('modalDialog is: ', $modalDialog);
            }

            // Cache and disable submit button, clear error messages
            writeMessage('error', "");            

            // Store selected student name from dropdown
            var selectedClientVal = $('#search_student_dropdown').val();
            var selectedClient = $.grep(clients, (i) => {
                return `${i.firstName} ${i.lastName}` === selectedClientVal;
            });

            // Check if student is already registered 
            console.log('Selected appts:', selectedAppointments);
            var studentExists = false;
            $.each(selectedAppointments, (i, val) => {
                if (`${selectedAppointments[i].email}` === `${selectedClient[0].email}`) {
                    console.log(`${selectedClient[0].firstName} already registered!`);
                    var message = { title: 'Student Already Registered!', body: `${selectedClient[0].firstName} ${selectedClient[0].lastName} is already registered for this class.` };
                    writeMessage('modal', message);
                    studentExists = true;
                    return false;
                }
            });

            if (!studentExists) {
                // Store trial class checkbox entry
                var trialClassChecked = $('#trial_class_walkin_checkbox').is(':checked');            
                
                // Get the appropriate certificate to apply
                var certificate = await getCertificateForStudent(selectedClient, trialClassChecked);

                // If no certificate then alert student to contact staff
                if (!certificate || certificate === '') {
                    var message = { title: 'No Certificate!', body: "<strong>Sorry, we couldn't find a valid certificate code!</strong><br>Please check with Dream Dance and Yoga staff to register." };
                    writeMessage('modal', message);
                } else {
                    // Set check-in type and add student to class
                    var checkInType = 'student';
                    var addStudentResult = await addStudentToClass(selectedClient, certificate, checkInType);
                    console.log('addStudentResult:', addStudentResult);

                    // If successful close dialog and reload table
                    if (addStudentResult) {
                        console.log('Reloading table...!');       
                        $modalDialog.dialog('close');
                        // window.location.reload();
                        initializeAppointmentsTable(false, selected_class_index);
                    }
                }
            }
        });
    });

    // EVENT: Select another class dropdown change - reload window with selected class
	$('#select_another_class_dropdown').change( (e) => {
		e.preventDefault();
		console.log(`Event captured: ${e.currentTarget.id}`);
        console.log(e);

        if (debug) {
            writeMessage('debug', '<br><b>SELECT ANOTHER CLASS dropdown menu change...</b>');
        }
        
        // Update global selected_class_index var with new class index
        // Capture selected class name and date to find class index
        var selectedClass = $('#select_another_class_dropdown').val();
        var selectedClassName = selectedClass.split('-')[0].trim();
        var selectedClassDate = selectedClass.split('-')[1].trim();
        var selectedClassDateObj = new Date(selectedClassDate);
        
        // Search through array and match class name and time to retrieve selected class index to pass to child window
        selected_class_index = upcomingClasses.findIndex(x => x.name === selectedClassName && new Date(x.time).getTime() === selectedClassDateObj.getTime());
        console.log(`SELECT ANOTHER CLASS: Selected class: ${selectedClass}`);
        console.log(`SELECT ANOTHER CLASS: Selected class index: ${selected_class_index}\n`, upcomingClasses[selected_class_index]);
        
        console.log('Reloading table with new class selection...!');
        initializeAppointmentsTable(false, selected_class_index);
    });

    // EVENT: SELECT A DIFFERENT CLASS click
    // FUNCTION: Close window on button click
    $('#close_window_submit').on('click', async function(e) {
        e.preventDefault();
        // Clear any error message
        writeMessage('error', "");

        if (debug) {
            writeMessage('debug', "<br><b>clicked CLOSE WINDOW BUTTON...</b>");
        }

        window.close();
    });

    // EVENT: FULLSCREEN button click - toggle fullscreen mode
    $('#fullscreen_submit').on('click', function(e) {
        e.preventDefault();
        // Clear any error message
        writeMessage('error', "");

        if (debug) {
            writeMessage('debug', "<br><b>clicked TOGGLE FULLSCREEN BUTTON...</b>");                
        }

        // Toggle fullscreen mode
        toggleFullScreen();
    });
});
}
</script>
<!-- Acuity Client Functions -->
<script src="https://sophiadance.squarespace.com/s/ddyApiClientFunctions-PROD.js"></script>
<!-- JQUERY / JQUERY UI -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js" integrity="sha256-VazP97ZCwtekAsvgPBSUwPFKdrwD3unUfSGVYrahUqU=" crossorigin="anonymous"></script>
<!-- DATATABLES -->
<script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/1.10.19/js/jquery.dataTables.js"></script>
<!-- END POPUP WINDOW PROD -->
</html>