$(document).ready(function() {
	var hc = new HomeController();
	var sv = new SessionValidator();

	var url = window.location.pathname;
	var id = url.substring(url.lastIndexOf('/') + 1);
	if(id == "Session1") {
		$('#session-1-tab').toggleClass('active-panel').show()
	}
	else if(id == "Session2") {
		$('#session-2-tab').toggleClass('active-panel').show()
	}
	else if(id == "Session3") {
		$('#session-3-tab').toggleClass('active-panel').show()
	}
	else if(id == "Session4") {
		$('#session-4-tab').toggleClass('active-panel').show()
	}
	else {
		$('.active-panel').show();
	}

	$('#session-1-btn').click(function() {
		console.log("Session 1 Btn Pressed");
		var current = $('.active-panel');
		var next = $('#session-1-tab');
		if(current != next) {
			var activeBtn = $('.active').toggleClass('active');
			current.toggleClass('active-panel');
			current.hide();
			$(this).toggleClass('active');
			next.toggleClass('active-panel');
			next.show();
		}
	});
	$('#session-2-btn').click(function() {
		console.log("Session 2 Btn Pressed");
		var current = $('.active-panel');
		var next = $('#session-2-tab');
		if(current != next) {
			var activeBtn = $('.active').toggleClass('active');
			current.toggleClass('active-panel');
			current.hide();
			$(this).toggleClass('active');
			next.toggleClass('active-panel');
			next.show();
		}
	});
	$('#session-3-btn').click(function() {
		console.log("Session 3 Btn Pressed");
		var current = $('.active-panel');
		var next = $('#session-3-tab');
		if(current != next) {
			var activeBtn = $('.active').toggleClass('active');
			current.toggleClass('active-panel');
			current.hide();
			$(this).toggleClass('active');
			next.toggleClass('active-panel');
			next.show();
		}
	});
	$('#session-4-btn').click(function() {
		console.log("Session 4 Btn Pressed");
		var current = $('.active-panel');
		var next = $('#session-4-tab');
		if(current != next) {
			var activeBtn = $('.active').toggleClass('active');
			current.toggleClass('active-panel');
			current.hide();
			$(this).toggleClass('active');
			next.toggleClass('active-panel');
			next.show();
		}
	});

	$('#session-form-1 div.sessionContent').click(function() {
		var classList = $(this).attr('class').split(/\s+/);
		var disabled = false;
		for(var pos = 0; pos < classList.length; pos++) {
			if(classList[pos] == "session-full") {
				disabled = true;
			}
		}
		if(!disabled) {
			console.log("A session 1 session has been clicked");
			var current = $('#session-form-1 .active-session');
			console.log(current);
			
			if(current != $(this)) {
				current.toggleClass('active-session');
				$(this).toggleClass('active-session');
			}
		}
	});

	$('#session-form-2 div.sessionContent').click(function() {
		var classList = $(this).attr('class').split(/\s+/);
		var disabled = false;
		for(var pos = 0; pos < classList.length; pos++) {
			if(classList[pos] == "session-full") {
				disabled = true;
			}
		}
		if(!disabled) {
			console.log("A session 2 session has been clicked");
			var current = $('#session-form-2 div.active-session');
			console.log(current);
			if(current != $(this)) {
				current.toggleClass('active-session');
				$(this).toggleClass('active-session');
			}
		}
	});

	$('#session-form-3 div.sessionContent').click(function() {
		var classList = $(this).attr('class').split(/\s+/);
		var disabled = false;
		for(var pos = 0; pos < classList.length; pos++) {
			if(classList[pos] == "session-full") {
				disabled = true;
			}
		}
		if(!disabled) {
			console.log("A session 3 session has been clicked");
			var current = $('#session-form-3 div.active-session');
			console.log(current);
			
			if(current != $(this)) {
				current.toggleClass('active-session');
				$(this).toggleClass('active-session');
			}
		}
	});

	$('#session-form-4 div.sessionContent').click(function() {
		var classList = $(this).attr('class').split(/\s+/);
		var disabled = false;
		for(var pos = 0; pos < classList.length; pos++) {
			if(classList[pos] == "session-full") {
				disabled = true;
			}
		}
		if(!disabled) {
			console.log("A session 4 session has been clicked");
			var current = $('#session-form-4 div.active-session');
			console.log(current);
			if(current != $(this)) {
				current.toggleClass('active-session');
				$(this).toggleClass('active-session');
			}
		}
	});


	function sessionEnrolled(enrolled, sessionNum) {
		if(enrolled) {
			var sessionSelector = "#session-form-" + sessionNum;
			var current = $(sessionSelector + " .enrolled");
			if(current && current != enrolled) {
				enrolled.toggleClass('active-session');
				current.toggleClass('enrolled');
				enrolled.toggleClass('enrolled').fadeIn(1000);

			}
		}
	}


	function handleError(error) {
		console.log("Error: " + error);
		if(error == "compulsory-error") {
			sv.showSessionError('Session Submission Failure', 
				'Unable to sign-up, you have a compulsory session to attend.');
		}
		else if(error == "no-session-selected") {
			sv.showSessionError('Session Submission Failure', 
				'Please select a session to enroll in.');			
		}
		else {
			sv.showSessionError('Session Submission Failure', 
				'An error occurred while saving session choice, please try again.');
		}
	}

	/* FORM DATA */


	$('#session-form-1').ajaxForm({
		beforeSubmit : function(formData, jqForm, options){
			//Add sessionId to formData
			formData.push({name:'sessionNum', value:'1'});
			formData.push({name:'sessionId', value:$('#session-form-1 .sessionContent.active-session').attr("id")});
			return true;
		},
		success	: function(responseText, status, xhr, $form){
			console.log("ajaxForm: success");
			// console.log(status);
			// console.log(responseText);
			if (status == 'success') {
				//status green. indicate the 
				console.log("Session 1 is green");
				sessionEnrolled($('#session-form-1 .active-session'), 1);
				window.location.href = '/student#Session1';
			}
		},
		error : function(e){
			if(e) {
				handleError(e.responseText);
			}
		}
	}); 
	$('#session-form-2').ajaxForm({
		beforeSubmit : function(formData, jqForm, options){
			formData.push({name:'sessionNum', value:'2'});
			formData.push({name:'sessionId', value:$('#session-form-2 .sessionContent.active-session').attr("id")});
			return true;
		},
		success	: function(responseText, status, xhr, $form){
			console.log("ajaxForm: success");
			// console.log(status);
			// console.log(responseText);
			if (status == 'success') {
				console.log("Session 2 is green");
				sessionEnrolled($('#session-form-2 .active-session'), 2);
				window.location.href = '/student#Session2';
			}
		},
		error : function(e){
			if(e) {
				handleError(e.responseText);
			}
		}
	}); 
	$('#session-form-3').ajaxForm({
		beforeSubmit : function(formData, jqForm, options){
			console.log($('#session-form-3 .sessionContent.active-session'));
			if($('#session-form-3 .sessionContent.active-session')) {
				formData.push({name:'sessionNum', value:'3'});
				formData.push({name:'sessionId', value:$('#session-form-3 .sessionContent.active-session').attr("id")});
				return true;
			}
			console.log("nothing-selected");
			return false;
		},
		success	: function(responseText, status, xhr, $form){
			console.log("ajaxForm: success");
			console.log(status);
			console.log(responseText);
			if (status == 'success') {
				//status green. indicate the 
				console.log("Session 3 is green");
				sessionEnrolled($('#session-form-3 .active-session'), 3);
				window.location.href = '/student#Session3';
			}
		},
		error : function(e){
			if(e) {
				handleError(e.responseText);
			}
		}
	}); 
	$('#session-form-4').ajaxForm({
		beforeSubmit : function(formData, jqForm, options){
			formData.push({name:'sessionNum', value:'4'});
			formData.push({name:'sessionId', value:$('#session-form-4 .sessionContent.active-session').attr("id")});
			return true;
		},
		success	: function(responseText, status, xhr, $form){
			console.log("ajaxForm: success");
			// console.log(status);
			// console.log(responseText);
			if (status == 'success') {
				//status green. indicate the 
				console.log("Session 4 is green");
				sessionEnrolled($('#session-form-4 .active-session'), 4);
				window.location.href = '/student#Session4';
			}
		},
		error : function(e){
			if(e) {
				handleError(e.responseText);
			}
		}
	}); 	
});