$(document).ready(function(){

	var hc = new HomeController();
	// var sv = new SessionValidator();

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

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

	$('#session-form-1').ajaxForm({
		beforeSubmit : function(formData, jqForm, options){
			// add session number to formData
			formData.push({name:'session', value:'1'});
			//formData.push({name:'teacher', })
			formData.push({name:'description', value:$('#session-form-1 textarea#desc').val()});
			formData.push({name:'resources', value:$('#session-form-1 textarea#resource').val()});
			formData.push({name:'extra', value:$('#session-form-1 textarea#resource').val()});
			formData.push({name:'sessionId', value:$('#session-form-1 #sessionId').val()});
			// add the text areas to formData
			console.log(formData);
			return true;
		},
		success	: function(responseText, status, xhr, $form){
			console.log("ajaxForm: success");
			// console.log(status);
			// console.log(responseText);
			if (status == 'success') {
				//status green. indicate the 
				console.log("Session 1 is green");
				window.location.href = '/teacher#Session1';
			}
		},
		error : function(e){
			console.log("teacher.js error");
			console.log(e);
			//lv.showLoginError('Form Submission Failure', 'Unable to update the session information. Please try again.');
		}
	}); 
	$('#session-form-2').ajaxForm({
		beforeSubmit : function(formData, jqForm, options){
			formData.push({name:'session', value:'2'});
			formData.push({name:'description', value:$('#session-form-2 textarea#desc').val()});
			formData.push({name:'resources', value:$('#session-form-2 textarea#resource').val()});
			formData.push({name:'extra', value:$('#session-form-2 textarea#resource').val()});
			formData.push({name:'sessionId', value:$('#session-form-2 #sessionId').val()});
			console.log(formData);
			return true;
		},
		success	: function(responseText, status, xhr, $form){
			console.log("ajaxForm: success");
			// console.log(status);
			// console.log(responseText);
			if (status == 'success') {
				//status green. indicate the 
				console.log("Session 2 is green");
				window.location.href = '/teacher#Session2';
			}
		},
		error : function(e){
			console.log("teacher.js error");
			console.log(e);
			//lv.showLoginError('Form Submission Failure', 'Unable to update the session information. Please try again.');
		}
	}); 
	$('#session-form-3').ajaxForm({
		beforeSubmit : function(formData, jqForm, options){
			formData.push({name:'session', value:'3'});
			formData.push({name:'description', value:$('#session-form-3 textarea#desc').val()});
			formData.push({name:'resources', value:$('#session-form-3 textarea#resource').val()});
			formData.push({name:'extra', value:$('#session-form-3 textarea#resource').val()});
			formData.push({name:'sessionId', value:$('#session-form-3 #sessionId').val()});
			console.log(formData);
			return true;
		},
		success	: function(responseText, status, xhr, $form){
			console.log("ajaxForm: success");
			// console.log(status);
			// console.log(responseText);
			if (status == 'success') {
				//status green. indicate the 
				console.log("Session 3 is green");
				window.location.href = '/teacher#Session3';
			}
		},
		error : function(e){
			console.log("teacher.js error");
			console.log(e);
			//lv.showLoginError('Form Submission Failure', 'Unable to update the session information. Please try again.');
		}
	}); 
	$('#session-form-4').ajaxForm({
		beforeSubmit : function(formData, jqForm, options){
			formData.push({name:'session', value:'4'});
			formData.push({name:'description', value:$('#session-form-4 textarea#desc').val()});
			formData.push({name:'resources', value:$('#session-form-4 textarea#resource').val()});
			formData.push({name:'extra', value:$('#session-form-4 textarea#resource').val()});
			formData.push({name:'sessionId', value:$('#session-form-4 #sessionId').val()});
			console.log(formData);
			return true;
		},
		success	: function(responseText, status, xhr, $form){
			console.log("ajaxForm: success");
			// console.log(status);
			// console.log(responseText);
			if (status == 'success') {
				//status green. indicate the 
				console.log("Session 4 is green");
				window.location.href = '/teacher#Session4';
			}
		},
		error : function(e){
			console.log("teacher.js error");
			console.log(e);
			//lv.showLoginError('Form Submission Failure', 'Unable to update the session information. Please try again.');
		}
	}); 

});
