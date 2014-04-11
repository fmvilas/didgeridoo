exports.index = function(req, res){
	res.render('ide/index', {
		user: 'user = ' + JSON.stringify(req.user) + ';'
	});
};