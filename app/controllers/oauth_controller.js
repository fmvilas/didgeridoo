load('application');

action('github', function () {
	var https = require('https');

	var options = {
		hostname: 'github.com',
		path: '/login/oauth/access_token?client_id=45748c5a20c33ce26717&client_secret='+process.env.GITHUB_SECRET+'&code=' + req.param('code'),
		method: 'POST',
		headers: {
			'Accept': 'application/json'
		}
	};

	var request = https.request(options, function(response) {
		var body = '';

		response.on('data', function(data) {
			body += data;
		});

		response.on('end', function() {
			var json = JSON.parse(body),
				GitHubApi = require('github');

			var github = new GitHubApi({
			    version: "3.0.0",
			    timeout: 5000
			});

			github.authenticate({
			    type: 'oauth',
			    token: json.access_token
			});

			github.user.get({}, function(err, githubUser) {
				if( err ) {
					console.dir(err);
					send(500);
				} else {
					var u = {
						name: githubUser.name,
						email: githubUser.email,
						password: null,
						githubLogin: true,
						avatarURL: githubUser.avatar_url
					};
					
					User.create(u, function(err, didgeridooUser) {
					    if( err ) {
					        console.error(err);
					        send(500);
					    } else {
					        req.session.user = didgeridooUser;
					        redirect(path_to.ide);
					    }
					});
				}
			});
		});
	});

	request.end();

	request.on('error', function(err) {
		console.error(err);
		send(500);
	});
});