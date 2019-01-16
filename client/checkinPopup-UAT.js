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
        
        .class-details {            
			padding: 10px;
            text-align: center;
            background-color: #acbad4;
        }

        .slot-details {            
			padding: 10px;            
            background-color: pink;
        }

        .spacer {
            padding: 20px;
        }
        
        .checked-in {
            /* background-color: #acbad4 !important; */
            background-color: pink !important;
            color: DimGrey !important;
        }
        </style>	
    </head>

<body>
    <!-- Placeholder to hold teacher and class info -->
    <div id="class_info_div" class="class-details"></div>
    <div id="slots_info_div" class="slot-details"></div>
    <div id="spacer_div" class="spacer"></div>

	<!-- Placeholder HTML table for student check-in list - populated by DataTable() -->
    <div id="checkin_table_div" class="details-item">
        <table id="checkin_table" class="display table">
            <thead>
                <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Class Type</th>
                    <th>Class Time</th>
                    <th>Certificate</th>
                    <th>Check In</th>					
                </tr>
            </thead>			
        </table>
    </div>
    
    <div id="debug_output" class="hide"></div>
    <div id="error_message"></div>
</body>

<script type="text/javascript">
{
$( () => {
    console.log('Popup window ready');
    
    // Pass vars from parent window
    var selectedAppointments = window.opener.selectedAppointments;
    var debug = window.opener.debug;
    var testbool = window.opener.testbool;
    var env = window.opener.environment;
    var slotsAvail = window.opener.slotsAvail;
    var classFull = window.opener.classFull;

    // Set debug mode
    if (debug) {
        $('#debug_output').removeClass('hide').addClass('debug-output');
        writeMessage('debug', "<b>Debug mode ON</b>");
    }

    // test function
    writeMessage("debug", `<br>TEST MESSAGE IN POPUP`);
    
    // Store class name and date and populate class_info HTML
    var className = selectedAppointments[0].type;
    var classDate = selectedAppointments[0].date;
    var classTime = selectedAppointments[0].time;
    $('#class_info_div').html(`<h3>Class Name: <strong>${className}</strong><br>Class Time: <strong>${classDate} ${classTime}</strong>`);

    // Store slots available info and populate slots_info HTML    
    $('#slots_info_div').html(`<h3>Spaces available: <strong>${slotsAvail}</strong><br>Class Full: <strong>${classFull} ${classTime}</strong>`);

    // Append buttom HTML to selectedAppointments for table renering    
    $.each(selectedAppointments, (i, val) => {
        selectedAppointments[i].buttonHTML = `<button type="button" id="${selectedAppointments[i].id}" class="check-in">Check In!</button>`;
        console.log(`selectedAppointments[${i}].buttonHTML is: `, selectedAppointments[i].buttonHTML);
    });

    console.log('Appointments list is:', selectedAppointments);
    console.log('debug is: ', debug);
    console.log('testbool is: ', testbool);
    console.log('environment: ', env);

    try {
        var checkin_table = $('#checkin_table').DataTable({
            "data": selectedAppointments,
            "pageLength": 25,
            // "order": [[1, 'asc']],
            "ordering": false,
            "columns": [
                { "data": "firstName"},
                { "data": "lastName"},
                { "data": "type"},
                { "data": "datetime"},
                { "data": "certificate"},                
                { "data": "buttonHTML"}
                // { "defaultContent": `<button type="button" class="check-in">Check In!</button>` }
                // { "data": "labels.name"}
            ]
        });

        // Loop through table rows to determine if student has already checked in
        checkin_table.rows().every(function() {            
            var currentRow = this.data()
            var studentNote = currentRow.notes;
            if (debug) {
                console.log('Current row:', currentRow);            
                console.log('Notes is: ', studentNote);
            }

            // If NOTES field contains "checked in" then apply class and update button text
            if (typeof studentNote === 'undefined') {
                console.log(`${currentRow.firstName} has NOT checked in`);
            } else if (studentNote.includes('Checked in')) {
                console.log(`${currentRow.firstName} has checked in`);                
                this.nodes().to$().addClass('checked-in');
                $(`#${currentRow.id}`).html('Cancel Check-in');
            } else {
                console.log(`${currentRow.firstName} has NOT checked in`);
            }
        });

        // If successful reveal table div
        // revealElement($('#checkin_table_div'));
    }
    catch (e) {
        console.log('ERROR: Error building datatable!');
        console.log (e);
        var message = { title: 'ERROR', body: `Error building student check-in table, please check and try again` };
        writeMessage('modal', message);
    }

    // EVENT: CHECK-IN TABLE ROW / CHECK-IN BUTTON click - event to be captured after dynamic table is generated    
    $('#checkin_table tbody').on('click', 'tr', function(e) {
        e.preventDefault();
        // Clear any error message
        writeMessage('error', "");

        if (debug) {
            writeMessage('debug', "<br><b>clicked CHECK-IN TABLE ROW OR BUTTON...</b>");                
        }        

        // Capture clicked row data
        var data = checkin_table.row(this).data();
        if (debug) {
            console.log('data is:');
            console.log(data);
        }

        // Check if student has already checked in or not
        var checkedIn = $(this).hasClass('checked-in');
        console.log('checked in is: ', checkedIn);
        
        // IF BUTTON TEXT IS CHECK IN THEN POPULATE ACUITY NOTES FIELD
        // IF BUTTON TEXT IS CANCEL CHECKIN THEN REMOVE TEXT FROM ACUITY NOTES FIELD
        if (checkedIn) {
            $(this).removeClass('checked-in');
            $(`#${data.id}`).html('Check-in!');    
            alert(`Check in cancelled!\n\nName: ${data.firstName} ${data.lastName}\nstart time: ${data.datetime}\nclass type: ${data.type}\nappt id: ${data.id}`);
        } else {
            // apply new class to row to show checked in and change button text
            $(this).addClass('checked-in');
            $(`#${data.id}`).html('Cancel Check-in');
            alert(`You have checked in!\n\nName: ${data.firstName} ${data.lastName}\nstart time: ${data.datetime}\nclass type: ${data.type}\nappt id: ${data.id}`);
        }
    });
});
}
</script>
<!-- Parent window -->
<script src="https://sophiadance.squarespace.com/s/acuityApiClientFunctions-UAT.js"></script>
<!-- JQUERY / JQUERY UI -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js" integrity="sha256-VazP97ZCwtekAsvgPBSUwPFKdrwD3unUfSGVYrahUqU=" crossorigin="anonymous"></script>
<!-- DATATABLES -->
<script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/1.10.19/js/jquery.dataTables.js"></script>
</html>