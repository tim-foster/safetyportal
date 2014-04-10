
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('home', { title: 'Express' });
};
exports.signup = function(req, res){
  res.render('signup', { title: 'Express' });
};
exports.login = function(req, res){
  res.render('login', { title: 'Express' });
};

exports.newcont = function(req, res){
	res.render('newcont', { title: 'Contractor Questionaire'});
};
