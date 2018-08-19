<h3>GREG TEST API</h3>

<form id="search_client" action="" method="post">
  <p>Enter name: 
    <input type="search" name="client_search" id="client_search"/>
    <input type="submit" name="search" id="search" value="Search">
  </p>
 </form>

<div id="client_results">
</div>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>

<script type="text/javascript">
  $('#search_client').on('submit', function(e) {
		e.preventDefault();				
		
		var $content = $('#client_results');		
		// var searchName = $('input[name="client_search"]', this).val();
		var searchName = $('#client_search').val();
		var url = "https://66.96.208.44:3443/api/acuity/clients?search=" + searchName;
		var msg = "<p>Parameter is " + searchName + "<br>URL is " + url + "</p>";    
		$content.html(msg);
		
		// API REQUEST
	
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
				msg += "<br>API RESPONSE SUCCESSFUL<br>";
				var i;
				for (i = 0; i < response.length; i++) {
					msg += `${response[i].firstName}'s email is ${response[i].email}<br>`;
				}				
				$content.html(msg);
			},
			error: function(xhr, status, error) {
				console.log(error);
				msg += "<br>API FAIL and status is " + xhr.status + " and statusText is " + xhr.statusText;
				msg +=`<br>${xhr.responseText}`;
				$content.html(msg);
			},
			complete: function(response) {
				console.log(response);
				$('#load').remove();		
				msg += "<br>API CALL COMPLETE";
				$content.html(msg);
			}
		});
  });
</script>