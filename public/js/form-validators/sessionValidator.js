function SessionValidator() {
	this.sessionErrors = $('.modal-alert');
	
	this.showSessionError = function(title, message)
	{
		$('.modal-alert .modal-header h4').text(title);
		$('.modal-alert .modal-body').html(message);
		this.sessionErrors.modal('show');
	}

}