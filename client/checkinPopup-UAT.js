<!DOCTYPE html>
<html lang="en">
	<head>        
      	<link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
        <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.10.19/css/jquery.dataTables.css"></link>
  		
        <style type="text/css">
        .hide {
			display: none;
        }

        .debug-output {
			border: 1px solid lightgray;
			border-radius: 2px;  
			display: block;			
			margin: 5px 0px;
			padding: 5px;
        }

        .my-link {
            color: blue !important;
            text-decoration: underline;
        }

        .inline {
            display: inline-block;
            padding: 5px;
        }

        .right {
            float: right;
        }

        .center {
            text-align: center;
        }

        .disabled,
		button:disabled {
			border: 1px solid #999999;
			background-color: #cccccc;
			color: #666666;
		}

        .table-footer {            
            padding: 5px;
            background-color: #acbad4;
        }
        
        .class-details h3 {
			padding: 10px;
            text-align: center;
            background-color: #acbad4;
            font-size: 200% !important;
        }

        .checkin-message h3 {
            padding: 20px;
            font-weight: bold;
            text-align: center;
        }        

        .slot-details h3 {
            color: white;
            background-color: #acbad4;
            padding: 10px;            
        }

        .class-full h3 {
            background-color: maroon !important;
        }

        .register-now {
            padding: 10px;
            background-color: #acbad4;
            display: inline-block;            
            font-size: 150%;
            font-weight: bold;
        }

        .submit-button {            
            font-weight: bold;
        }

        .submit-button-bold {
            font-size: 150%;
            font-weight: bold;
        }

        .submit-button-large {
			font-size: 150%;
			font-weight: bold;
			padding: 20px;			
		}

        .spacer {
            padding: 5px;
        }
        
        .selected {
            background-color: #acbad4 !important;             
            color: DimGrey !important;
        }

        .checkin-table {            
            font-size: 110%;
        }

        .student-name {
            font-weight: bold;  
            font-size: 140%;          
        }

        .classpass {
            /* background-color: #acbad4 !important; */            
            font-weight: bold;
        }

        .trialclass {
            /* background-color: #acbad4 !important; */
            background-color: plum;
            font-weight: bold;
        }

        .ddy-member {
            /* background-color: #acbad4 !important; */
            color: orangered;
            font-weight: bold;
        }

    .instructor {
            /* background-color: #acbad4 !important; */
            color: DimGrey;
            font-weight: bold;
        }
        
        .modal-output {
            font-size: 120%;
        }

        .table tbody tr {
            cursor: pointer;
        }
        </style>	
    </head>

<body>
    <!-- Placeholder to hold teacher and class info -->
    <div id="class_info_div" class="class-details"></div>
    <div id="close_window_div" class="inline right">
            <input type="submit" id="close_window_submit" class="submit-button" value="Select a different class" />
    </div>
    <div id="checkin_message" class="checkin-message">
        <h3>Please tap your name to check in</h3>
    </div>
    <div id="spacer_div" class="spacer"></div>

    <div id="loading"></div>

	<!-- Placeholder HTML table for student check-in list - populated by DataTable() -->
    <div id="checkin_table_div" class="details-item">
        <table id="checkin_table" class="display table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>First Name</th>
                    <th>Type</th>
                    <th>Check In</th>					
                </tr>
            </thead>
        </table>
    </div>
    
    <div id="spacer_div" class="spacer"></div>
    
    <!-- Table footer -->
    <div id="table_footer_div" class="table-footer">
        <div id="teacher_checkin_div" class="teacher-checkin inline">
            <!-- Dropdown to hold DDY teacher names -->
            <div id="teacher_checkin_dropdown_div" class="inline">
                <label for="teacher_checkin_dropdown" class="form-label"><b>Instructor: </b></label>
                <select id="teacher_checkin_dropdown" class="dropdown">
                    <option value="select">Select One</option>
                </select>
                <input type="submit" id="teacher_checkin_submit" class="submit-button" value="Instructor Check-In" />
            </div>
        </div>        
        <div id="register_now_div" class="inline right">
            <input type="submit" id="register_now_submit" class="submit-button-bold" value="REGISTER WALK-IN" />
        </div>        
    </div>
    
    <div id="spacer_div" class="spacer"></div>
    
    <!-- Fullscreen and slots info -->
    <input type="submit" id="fullscreen_submit" class="submit-button inline" value="Toggle Fullscreen" />
    <div id="slots_info_div" class="slot-details right"></div>
    
    <!-- Debug and errors -->
    <div id="debug_output" class="hide"></div>    
    <div id="error_message"></div>
    
    <!-- JQUERY UI MODAL CONTAINER -->
	<div id="modal_output" class="modal-output"></div>
</body>

<script type="text/javascript">
{
$( async () => {
    // FUNCTION: toggleFullScreen()
    // 1) Toggle fullscreen mode with cross-browser compatibility
    function toggleFullScreen($element) {
        $element = $element || document.documentElement;
        if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
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
    function addClassInfo(upcoming_classes, selected_class_index, selectedAppointments) {
        // Get class slots info and check if class is full    
        var slotsAvail = upcoming_classes[selected_class_index].slotsAvailable;
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

        var classInfoDetailsHTML = `<h3><strong>${className}</strong><br>${classDate} ${classTime}`;
        $('#class_info_div').html(classInfoDetailsHTML);

        // Store slots available info and populate slots_info HTML        
        if (classFull) {
            var slotsInfoHTML = `<h3><strong>CLASS FULL!</strong></h3>`;
            $('#slots_info_div').addClass('class-full');
        } else {
            var slotsInfoHTML = `<h3>Spaces available: <strong>${slotsAvail}</strong></h3>`;
        }
        $('#slots_info_div').html(slotsInfoHTML);

        return classFull;
    }

    // FUNCTION: getInstructors()
    // 1) Capture Acuity clients list
    // 2) Iterate through list and search for text to specify the client is an instructor
    // 3) Populate the instructor dropdown with a list of instructors
    async function getInstructors() {
        // Make API call
        var funcType = 'clients_search';
        var clientsResult = await initApiCall(funcType);
        console.log('clientsResult is:', clientsResult);
        
        // Filter clients ressult to store instructors only by looking for text in the clients notes field
        var instructorNote = 'DDY Instructor';
        var instructorNoteUAT = 'DDY Instructor TEST';
        
        var instructors = $(clientsResult).filter((i) => {
            if (environment === 'UAT') {
                return (clientsResult[i].notes.includes(instructorNote) || clientsResult[i].notes.includes(instructorNoteUAT));
            } else {
                return clientsResult[i].notes.includes(instructorNote);
            }
        });
        console.log('Instructors is:', instructors);
        
        // Populate instructor dropdown menu
        var $dropdown = $('#teacher_checkin_dropdown');
        var func = "clients";
        populateDropdown($dropdown, instructors, func);

        return instructors;
    }

    // FUNCTION: prepareApptData()
    // 1) Loop through appointments object to prepare data for display
    //    a. Append buttom HTML to selectedAppointments for table rendering
    //    b. Prepare student type field with information based on certificate code
    function prepareApptData(selectedAppointments) {
        $.each(selectedAppointments, (i, val) => {
            // Append check-in button HTML
            selectedAppointments[i].buttonHTML = `<button type="button" id="${selectedAppointments[i].id}" class="check-in">Check In!</button>`;
            if (debug) {
                console.log(`selectedAppointments[${i}].buttonHTML is: `, selectedAppointments[i].buttonHTML);
            }
            
            // Generate full name
            selectedAppointments[i].fullName = `${selectedAppointments[i].firstName} ${selectedAppointments[i].lastName}`
            
            // Translate certificate code to readable student type
            cert = selectedAppointments[i].certificate;
            
            if (debug) {
                console.log(`Cert for ${selectedAppointments[i].firstName} is: ${cert}`);
            }

            if (cert) {
                if (cert.includes('TRIAL')) { cert = "TRIALCLASS"; }
                console.log('cert is: ', cert);
                
                switch (cert) {
                    case 'CLASSPASS':
                        selectedAppointments[i].studentType = 'Classpass';
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
                        break;
                    default:
                        selectedAppointments[i].studentType = "<p class='ddy-member'>Dream Dance and Yoga Member <img src='https://sophiadance.squarespace.com/s/dancer-icon-transparent-32px.png' alt='We love our DDY Members :)'></p>";
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
            var checkin_table = $('#checkin_table').DataTable({
                "data": selectedAppointments,                
                "pageLength": 25,            
                "order": [[1, 'asc']],
                "paging": false,
                "info": false,
                "searching": false,
                // "ordering": false,            
                responsive: true,
                columnDefs: [
                    { targets: 0, className: "student-name dt-center" },
                    { targets: '_all', orderable: false, className: "checkin-table dt-center" },                
                    { targets: 1, visible: false },                
                    { targets: 0, width: "65%" },
                    { targets: 2, width: "25%" },
                    { targets: 2,
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
                    { "data": "fullName"},
                    { "data": "firstName"},                
                    { "data": "studentType"}, 
                    { "data": "buttonHTML"}
                    // { "defaultContent": `<button type="button" class="check-in">Check In!</button>` }                
                ]
            });
        }
        catch (e) {
            console.log('ERROR: Error building datatable!');
            console.log (e);
            var message = { title: 'ERROR', body: `Error building student check-in table, please check and try again` };
            writeMessage('modal', message);
        }

        return checkin_table;
    }
    
    // FUNCTION: initRowStyles()
    // 1) Loop throw table rows and apply colors for specific conditions
    function initRowStyles(checkin_table) {
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
            $(`#${data.id}`).html('Check-in!');
        } else {            
            $($row).addClass('selected');
            $(`#${data.id}`).html('Cancel Check-in');
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
                
                // If successful alert student
                var message = { title: 'Check-in Cancelled', body: `Check-in for ${firstName} ${lastName} has been cancelled.` };
                writeMessage('modal', message);

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
            if (checkInType === 'student' ) {
                var checkInNote = `${timestamp}: ${firstName} ${lastName} checked in to ${className}`;
            } else {
                var checkInNote = `${timestamp}: [INSTRUCTOR CHECK-IN] ${firstName} ${lastName} checked in to ${className}`;
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
                var message = { title: `${firstName} ${lastName} Checked In!`, body: `Thanks for checking in, ${firstName}!<br>Enjoy your class :)` };
                writeMessage('modal', message);

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
        var params = {
            classId,
            datetime,
            firstName,
            lastName,
            email,
            certificate,
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
            var checkInResult = await checkIn(appointmentsResult, false, checkInType);
            console.log('Check-in result: ', checkInResult);
        }
        catch (e) {
            console.log(`ERROR: Error detected in initApiCall: ${funcType}`);
            console.log (e);
            var errorText = e.responseText;
            console.log(`Error text is: ${errorText}`);
            if (errorText.includes('invalid for appointment type')) {
                var message = { title: 'ERROR', body: `No valid code for this student to book classes!  Please try again.` };
            } else {
                var message = { title: 'ERROR', body: `Error creating appointment!  Please try again.` };
            }                
            writeMessage('modal', message);
            return false;
        }
        return appointmentsResult;
    }

    // MAIN //
    console.log('Popup window ready');
    
    // Pass vars from parent window
    var debug = window.opener.debug;
    var environment = window.opener.environment;
    var upcoming_classes = window.opener.upcoming_classes;
    var classDate = window.opener.classDate;
    var selected_class_index = window.opener.selected_class_index;    

    if (debug) {
        $('#debug_output').removeClass('hide').addClass('debug-output');
        writeMessage('debug', "<b>Debug mode ON</b>");

        // Log passed vars
        console.log('Upcoming classes: ');
        console.log(upcoming_classes);
    }

    // Retrieve all appointments for selected class
    var selectedAppointments = await retrieveAppointments(upcoming_classes, classDate, selected_class_index);
    console.log('Appointments result: ', selectedAppointments);    
    
    // Capture list of instructors the first time the window is open
    var instructors = await getInstructors();
    
    // Update appointments array with data for table
    selectedAppointments = prepareApptData(selectedAppointments);
    
    // Build the table
    var checkin_table = buildDatatable(selectedAppointments);

    // Add class detail to webpage
    var classFull = addClassInfo(upcoming_classes, selected_class_index, selectedAppointments);
    
    // Apply colors to the table rows as required
    initRowStyles(checkin_table);

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

        // Check if student has already checked in or not
        var checkedIn = $(this).hasClass('selected');
        if (debug) {
            console.log('This row: ', this);
            console.log(`CheckedIn for ${studentData.firstName}: ${checkedIn}`);
        }

        // Call checkIn function to amend student record in Acuity
        checkIn(studentData, checkedIn);

        // Apply row Styles etc        
        applyRowStyle(this, studentData, checkedIn);        
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
            body: `<div id="instructor_pin_div" class="details-item">                        
                        <form id="instructor_pin_form">
                            <label for="instrutor_pin" class="form-label"><b>Enter PIN: </b></label>
                            <input type="password" name="instructor_pin" id="instructor_pin" autocomplete="new-password" />
                            <input type="submit" name="instructor_pin_submit" id="instructor_pin_submit" value="Submit" />
                        </form>
                    </div>
                    <br>
                    <div id="pin_message_div" class="hide"><b>Pin Incorrect! Please try again.</b></div>`
        };
        writeMessage('modal-no-button', message);
        $('#instructor_pin_form').focus();

        // Retrieve actual PIN from server            
        var pin64 = await callAPI('pin');            
        var pin = atob(pin64);
            
        // EVENT: INSTRUCTOR PIN SUBMIT
        $('#instructor_pin_form').on('submit', async (e) => {
            e.preventDefault();

            if (debug) {
                writeMessage('debug', `<br>Submit invoked on instructor_pin`);                
            }

            // Cache and disable submit button, clear error messages
            writeMessage('error', "");
            $submitButton = $('#instructor_pin_submit');
            $submitButton.prop('disabled', true).addClass('disabled');

            // Check submitted PIN matches instructor PIN code
            var inputPin = $('#instructor_pin').val();

            if (inputPin != pin) {
                console.log('PIN incorrect!');
                // Show alert, clear PIN field and re-enable submit button
                // alert('PIN incorrect - please try again!');
                $('#pin_message_div').removeClass('hide');
                $('#instructor_pin').val('');
                $submitButton = $('#instructor_pin_submit');
                $submitButton.prop('disabled',false).removeClass('disabled');
            } else {
                // PIN is correct - proceed with instructor check-in
                console.log('PIN correct');
                $('#pin_message_div').html('Thank you!');                                
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

                        // If successful alert student and re-enable check-in button
                        var message = { title: 'Check-in cancelled', body: `Check-in cancelled for ${classInstructor[0].firstName} ${classInstructor[0].lastName}.` };
                        writeMessage('modal', message);

                        $('#teacher_checkin_submit').val('Instructor Check-in');
                        $('#teacher_checkin_dropdown').prop('disabled', false);
                        $('#teacher_checkin_dropdown').removeClass('disabled');

                        // If successful reload window
                        if (appointmentsResult) {
                            console.log('Reloading window...!');
                            window.location.reload();
                        }
                    }
                    catch (e) {
                        console.log(`ERROR: Error cancelling instructor check-in!`);
                        console.log (e);
                        var message = { title: 'ERROR!', body: `Error while cancelling instructor check-in!  Please try again.` };
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

                        // Alert instructor check-in was successful
                        var message = { title: `Instructor Check-in Successful for ${classInstructor[0].firstName} ${classInstructor[0].lastName}!`, body: `Thanks for checking in, ${classInstructor[0].firstName}.  Enjoy your class!` };
                        writeMessage('modal', message);

                        // If successful update check-in button
                        $('#teacher_checkin_submit').val('Cancel Instructor Check-in');
                        $('#teacher_checkin_dropdown').prop('disabled', true);
                        $('#teacher_checkin_dropdown').addClass('disabled');

                        // If successful reload window
                        if (addInstructorResult) {
                            console.log('Reloading window...!');                
                            window.location.reload();
                        }
                    }
                    catch (e) {
                        console.log(`ERROR: Error adding instructor to class!`);
                        console.log (e);
                    }
                }
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
            body: `<div id="search_student_div" class="details-item">
                <form id="search_student" action="" method="post">  
			        <label for="search_student" class="form-label"><b>Enter Your Name: </b></label>
			        <input type="search" name="search_student_form" id="search_student_form" />
			        <input type="submit" name="search_submit" id="search_submit" value="Search" />			
                </form>
            </div>
            <br>
            <div id="search_student_dropdown_div" class="details-item">
		        <label for="search_student_dropdown" class="form-label"><b>Select Your Name: </b></label>
		        <select id="search_student_dropdown" name="search_student_dropdown" class="dropdown">
			        <option value="Select One">Select One</option>	
                </select>
                <input type="checkbox" name="Trial_class" id="trial_class_walkin_checkbox" value="trial_class">
		        <label for="trial_class_walkin_checkbox"> <b>Trial Class? </b></label>
                <br><br>
                <div id="register_walkin_submit_div" class="center">
                    <input type="submit" id="register_walkin_submit" class="submit-button-large" value="REGISTER" />
                </div>
            </div>`
            // width: 600,
            // height: 300
        };    
        var $modalDialog = await writeMessage('modal-no-button', message);
        
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
            $submitButton = $('#search_submit');
            $submitButton.prop('disabled', true).addClass('disabled');
            
            // Retrieve student data
            try {
                clients = await retrieveStudents();
                if (debug) {
                    console.log("Clients:");
                    console.log(clients);
                }                
            }
            catch (e) {
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
                console.log('modalDialog is');
                console.log($modalDialog);
            }

            // Cache and disable submit button, clear error messages
            writeMessage('error', "");

            // Store selected student name from dropdown
            var selectedClientVal = $('#search_student_dropdown').val();
            var selectedClient = $.grep(clients, (i) => {
                return `${i.firstName} ${i.lastName}` === selectedClientVal;
            });

            // Store trial class checkbox entry
            var trialClassChecked = $('#trial_class_walkin_checkbox').is(':checked');            
            
            // Get the appropriate certificate to apply
            var certificate = await getCertificateForStudent(selectedClient, trialClassChecked);            
            
            // Set check-in type and add student to class
            var checkInType = 'student';
            var addStudentResult = await addStudentToClass(selectedClient, certificate, checkInType);
            console.log('addStudentResult:', addStudentResult);

            // If successful reload window
            if (addStudentResult) {
                console.log('Reloading window...!');                
                window.location.reload();
            }
        });
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
            writeMessage('debug', "<br><b>clicked CHECK-IN TABLE ROW OR BUTTON...</b>");                
        }

        // Toggle fullscreen mode
        toggleFullScreen();
    });
});
}
</script>
<!-- Acuity Client Functions -->
<script src="https://sophiadance.squarespace.com/s/acuityApiClientFunctions-UAT.js"></script>
<!-- JQUERY / JQUERY UI -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js" integrity="sha256-VazP97ZCwtekAsvgPBSUwPFKdrwD3unUfSGVYrahUqU=" crossorigin="anonymous"></script>
<!-- DATATABLES -->
<script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/1.10.19/js/jquery.dataTables.js"></script>
<!-- END POPUP WINDOW UAT -->
</html>