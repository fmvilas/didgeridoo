load('application');
before(use('authRequired'));

action('index', function () {
    layout(false);
	render();
});