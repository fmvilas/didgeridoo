before('protect from forgery', function () {
  protectFromForgery('df81aee98224fbe20431231ecd8bbcbb0a2a3ae3');
});

publish('authRequired', authRequired);

function authRequired () {
	if( !req.session.user ) {
		redirect( path_to.login );
	} else {
		next();
	}
}

this.pathToCDN = '/Users/flanpackdeseis/www/didgeridoo-content';