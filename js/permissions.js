// Prompt the user to allow notifications
Notification.requestPermission(function(status) {
	console.log('Notification permission status: ', status);
});
