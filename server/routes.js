
var CT = require('./modules/country-list');
var AM = require('./modules/account-manager');
var EM = require('./modules/email-dispatcher');
var SM = require('./modules/session-manager');

module.exports = function(app) {

// main login page //
	app.get('/', function(req, res){
	// check if the user's credentials are saved in a cookie //

		console.log("\n---== REQUEST ==---\n");
		console.log(req.session);

		
		if (req.cookies.user == 'undefined' || req.cookies.pass == 'undefined'){
			console.log("User &&|| Pass are undefined");
			res.render('login', { title: 'Hello - Please Login To Your Account' });
			return;
		}	
		else{
			// attempt automatic login //
			AM.autoLogin(req.cookies.user, req.cookies.pass, function(o){
				console.log("AM - AUTOLOGIN - CALLBACK");
				console.log(req.cookies);
				console.log("/-AM-object: "+ o);
				if (o != null){
					console.log("o is not null. redirect");
				    req.session.user = o;
					
					console.log("usertype: "+req.cookies.usertype);
					
					if(req.cookies.usertype.toLowerCase() == "s") {
						res.redirect("/student");
						return;
					}
					else if(req.cookies.usertype.toLowerCase() == "t") {
						res.redirect("/teacher");
						return;
					}
					else if(req.cookies.usertype.toLowerCase() == "a") {
						res.redirect("/admin");
						return;
					}
					else {
						res.render('login', { title: 'Hello - Please Login To Your Account' });
						return;
					}
				}	
				else{
					console.log("render login since the cookie user cannot be found");
					res.render('login', { title: 'Hello - Please Login To Your Account' });
					return;
				}
			});
		}
	});
	
	app.post('/', function(req, res){
		// console.log("\n---== REQUEST ==---\n")
		// console.log(req.cookies);
		// console.log("===================");
		// console.log(req.session);

		AM.manualLogin(req.body['user'], req.body['pass'], function(e, o){
			if (!o){
				res.status(400).send(e);
			}	
			else{
				req.session.user = o;
				if (req.body['remember-me'] == 'true'){
					// console.log(o);
					// console.log("\n---== REMEMBER ME ==---\n")
					res.cookie('user', o['username']);
					res.cookie('pass', o['password']);
					res.cookie('usertype', o['usertype']);
					// console.log(res.get('Set-Cookie'));
				}
				res.status(200).send(o);
			}
		});
	});
	
// logged-in user homepage //

	app.get('/student', function(req, res) {
		if (req.session.user == null){
		// if user is not logged-in redirect back to login page //
			res.redirect('/');
		}	
		else {

			SM.getSessions(req.session.user['username'], function(error, object) {
				if(error) {
					console.log("There was an error from getSessions - load blank page");
					console.log(error);
					res.render('student', {
						title : 'Passion Session Sign-up',
						udata : "Firstname S."
					});
				}
				else {
					console.log("--== Session 1 List ==---");
					console.log(object[0]);
					console.log("--== Session 2 List ==---");
					console.log(object[1]);
					console.log("--== Session 3 List ==---");
					console.log(object[2]);
					console.log("--== Session 4 List ==---");
					console.log(object[3]);

					res.render('student', {
						title  : 'Passion Session Sign-up',
						udata  : "Firstname S.",
						s1data : object[0],
						s2data : object[1],
						s3data : object[2],
						s4data : object[3]
					});
				}
			});
		}
	});
	
	app.post('/student', function(req, res){
		console.log("---== ROUTES : POST : STUDENT ==---");
		console.log(req.body);
		console.log
		if (req.session.user == null){
			res.redirect('/');
		}	
		else if(req.body['sessionId'] == undefined || req.body['sessionId'].length == 0 || req.body['sessionId'] == ''){
			res.status(400).send('no-session-selected');
		}
		else {
			console.log(req.body);
			var data = {
				userId: req.session.user['username'],
				sessionId: req.body['sessionId'],
				sessionNum: req.body['sessionNum']
			}
			SM.enrollInSession(data, function(error) {
				if(error) {
					console.log("*** ERROR ***");
					console.log(error);
					console.log("*** ERROR ***");
					res.status(400).send(error);
				}	
				else{
					res.status(200).send('success');
				}
			});
		}
	});


	app.get('/teacher', function(req, res) {
		console.log("---== ROUTES : GET : TEACHER ==---");
		if (req.session.user == null){
	// if user is not logged-in redirect back to login page //
			res.redirect('/');
		}	
		else{
			//Get the session data for the current user
			console.log("user: " + req.session.user['username']);
			var data = {
				teacher: req.session.user['username']
			}
			console.log("data: \n" + data);

			SM.getTeacherSessionData(data, function(error, object) {
				if(error) {
					console.log("There was an error from getTeacherSession - load blank page");
					console.log(error);
					res.render('teacher', {
						title : 'Teacher Session Form',
						udata : "TeacherSurname, F."
					});
				}
				else {
					console.log(object)
					if(!object) {
						console.log("No data from getTeaherSession - load blank page");
					}
					var sessionOne, sessionTwo, sessionThree, sessionFour = null;
					for (var sessionCount in object) {
						var session = object[sessionCount];
						console.log("Counter" + sessionCount);
						console.log(session)
						switch(session['sessionNum']) {
							case 1: sessionOne = session; break;
							case 2: sessionTwo = session; break;
							case 3: sessionThree = session; break;
							case 4: sessionFour = session; break;
						}
					}

					res.render('teacher', {
						title : 'Teacher Session Form',
						s1data : sessionOne,
						s2data : sessionTwo,
						s3data : sessionThree,
						s4data : sessionFour,
						udata : "TeacherSurname, F."
					});
				}

			})
			
		}
	});
	
	app.post('/teacher', function(req, res){
		console.log("---== ROUTES - TEACHER - POST ==---");
		console.log(req.body);
		if (req.session.user["username"] == null){
			res.redirect('/');
		}	
		else {
			// create the  session data object
			var data = {
				sessionId: req.body['sessionId'], 
				teacher: req.session.user['username'],
				sessionNo: req.body['session'],
				title: req.body['session-title'],
				description: req.body['description'],
				location: req.body['location'],
				max: req.body['max-students'],
				resources: req.body['resources'],
				extra: req.body['extra']
			}

			SM.updateSession(data, function (error, object) {
				console.log("---== Update Teacher Session ==---")
				if (error){
					res.status(400).send('error-updating-session');
				}	else{
					res.status(200).send('success');
				}
			});
		}
	});

	app.get('/admin', function(req, res) {
		if (req.session.user == null){
	// if user is not logged-in redirect back to login page //
			res.redirect('/');
		}	
		else{
			res.render('admin', {
				title : 'Control Panel',
				countries : CT,
				udata : req.session.user
			});
		}
	});
	
	app.post('/admin', function(req, res){
		if (req.session.user == null){
			res.redirect('/');
		}	
		else{
			AM.updateAccount({
				id		: req.session.user._id,
				name	: req.body['firstname'],
				email	: req.body['email'],
				pass	: req.body['pass'],
				country	: req.body['usertype']
			}, function(e, o){
				if (e){
					res.status(400).send('error-updating-account');
				}	else{
					req.session.user = o;
			// update the user's login cookies if they exists //
					if (req.cookies.user != undefined && req.cookies.pass != undefined){
						res.cookie('user', o.user, { maxAge: 900000 });
						res.cookie('pass', o.pass, { maxAge: 900000 });	
						res.cookie('usertype', o.usertype, { maxAge: 900000 });
					}
					res.status(200).send('ok');
				}
			});
		}
	});


	app.post('/logout', function(req, res){
		res.clearCookie('user');
		res.clearCookie('pass');
		res.clearCookie('usertype');
		req.session.destroy(function(e){ res.status(200).send('ok'); });
	})
	
// password reset //

	app.post('/lost-password', function(req, res){
	// look up the user's account via their email //
		AM.getAccountByEmail(req.body['email'], function(o){
			if (o){
				EM.dispatchResetPasswordLink(o, function(e, m){
				// this callback takes a moment to return //
				// TODO add an ajax loader to give user feedback //
					if (!e){
						res.status(200).send('ok');
					}	else{
						for (k in e) console.log('ERROR : ', k, e[k]);
						res.status(400).send('unable to dispatch password reset');
					}
				});
			}	else{
				res.status(400).send('email-not-found');
			}
		});
	});

	app.get('/reset-password', function(req, res) {
		var email = req.query["e"];
		var passH = req.query["p"];
		AM.validateResetLink(email, passH, function(e){
			if (e != 'ok'){
				res.redirect('/');
			} else{
	// save the user's email in a session instead of sending to the client //
				req.session.reset = { email:email, passHash:passH };
				res.render('reset', { title : 'Reset Password' });
			}
		})
	});
	
	app.post('/reset-password', function(req, res) {
		var nPass = req.body['pass'];
	// retrieve the user's email from the session to lookup their account and reset password //
		var email = req.session.reset.email;
	// destory the session immediately after retrieving the stored email //
		req.session.destroy();
		AM.updatePassword(email, nPass, function(e, o){
			if (o){
				res.status(200).send('ok');
			}	else{
				res.status(400).send('unable to update password');
			}
		})
	});
	
// view & delete accounts //
	
	app.get('/print', function(req, res) {
		AM.getAllRecords( function(e, accounts){
			res.render('print', { title : 'Account List', accts : accounts });
		})
	});
	
	app.post('/delete', function(req, res){
		AM.deleteAccount(req.body.id, function(e, obj){
			if (!e){
				res.clearCookie('user');
				res.clearCookie('pass');
				req.session.destroy(function(e){ res.status(200).send('ok'); });
			}	else{
				res.status(400).send('record not found');
			}
	    });
	});
	
	app.get('/reset', function(req, res) {
		AM.delAllRecords(function(){
			res.redirect('/print');	
		});
	});
	
	app.get('*', function(req, res) { res.render('404', { title: 'Page Not Found'}); });

};
