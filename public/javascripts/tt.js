function setImage(activity) {
	$('#currentActivityImage').attr('src', '/images/' + activity + '.png');
}

function getHiddenInput() {
	return $('#currentActivity').val();
}

function setHiddenInput(activity) {
	$('#currentActivity').val(activity);	
}

function setDuration(duration) {
	$('#currentActivityDuration').text(duration.split(':').slice(0, 2).join(':'));
}

function setRandomBackground() {
	$('body').css('background', "url('https://source.unsplash.com/random/1024x600') no-repeat center center fixed");
}

function setBackgroundColor() {
	$('body').css('background', "#f9f9f9");
}

function update() {
	$.ajax({
		url: '/update',
		type: "GET",
		data: {},
		success: function(res) {
	
			if (res.data.isEvent) {

				let oldActivity = getHiddenInput();
				let newActivity = res.data.currentEvent.activity;
				
				
				// if we are not changing events
				if (oldActivity == newActivity) {

					setDuration(res.data.duration);

				// if we are transitioning from nothing to something
				} else if (oldActivity == 'none' && newActivity != 'none') {

					// setBackgroundColor();

					setImage(res.data.currentEvent.activity);
					setDuration(res.data.duration);
					setHiddenInput(res.data.currentEvent.activity);

					// hide & show divs
					$('#isEventDiv').show();
					$('#noEventDiv').hide();

				// if we are transitioning from one event to another
				} else {

					setImage(res.data.currentEvent.activity);
					setDuration(res.data.duration);
					setHiddenInput(res.data.currentEvent.activity);

				}

			// if we are trasitioning from something to nothing
			} else {

				// setRandomBackground();
				setHiddenInput('none');

				// hide & show divs
				$('#isEventDiv').hide();
				$('#noEventDiv').show();

			}

		},
		error: function(jqXHR, textStatus, errorMessage) {
			alert(errorMessage);
		}
	});
}

$.ajax({
	url: '/update',
	type: "GET",
	data: {},
	success: function(res) {

		if (res.data.isEvent) {

			// set event in hidden input
			setHiddenInput(res.data.currentEvent.activity);

			// set image
			setImage(res.data.currentEvent.activity);

			// set duration
			setDuration(res.data.duration);

			// hide & show divs
			$('#isEventDiv').show();
			$('#noEventDiv').hide();

		}

	},
	error: function(jqXHR, textStatus, errorMessage) {
		alert(errorMessage);
	}
});

setInterval(function() {
	update();
}, 30 * 1000);
