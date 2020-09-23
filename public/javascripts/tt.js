function update() {
	$.ajax({
		url: '/update',
		type: "GET",
		data: {},
		success: function(res) {
			
			let currentActivity = $('#currentActivity').val();
			let newActivity = res.data.currentEvent.activity;
			if (currentActivity != newActivity) {
				$('#currentActivityImage').attr('src', '/images/' + newActivity + '.png');
			}

			let duration = res.data.duration;
			$('#currentActivityDuration').text(duration);

		},
		error: function(jqXHR, textStatus, errorMessage) {
			alert(errorMessage);
		}
	});
}

setTimeout(function() {
	update();
}, 1 * 1000);