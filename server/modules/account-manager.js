
var crypto 		= require('crypto');
var mysql		= require('mysql');

var moment 		= require('moment');

/*
	ESTABLISH DATABASE CONNECTION
*/

var dbName = process.env.DB_NAME || 'scheduler';
var dbHost = process.env.DB_HOST || 'localhost'
var dbPort = process.env.DB_PORT || 8889;


// var connection = mysql.createConnection({
//   host: 'localhost',
//   port: '8889',
//   user: 'root',
//   password: 'root',
//   database: 'scheduler',
//   unix_socket: '/Applications/MAMP/tmp/mysql/mysql.sock'
// });

// connection.connect(function(err){
//   if(err){
//     console.log('\n\nError connecting to Db for Login');
//     console.log(err.code + " : " + err.message);
//     return;
//   }
//   console.log('...Login Connection established');
// });

var pool = mysql.createPool({
    connectionLimit: 100,
    host: 'localhost',
    port: '8889',
    user: 'root',
    password: 'root',
    database: 'scheduler',
    unix_socket: '/Applications/MAMP/tmp/mysql/mysql.sock'
});

/* login validation methods */

exports.autoLogin = function(user, pass, callback)
{
	console.log("AM - entering autoLogin");
	console.log("user: " + user );
	console.log("pass: " + pass );
	if(!user) {
		console.log("callback null no user");
		callback(null);
		return;
	}
	var o = null;

	pool.getConnection(function(err, connection) {
		if(err) {
			console.log(error);
			callback("connection-error");
			return;
		}
		var query = connection.query("select username, password, firstname, usertype from user where username = '" + user + "'"); 
		query
		  .on('error', function(err) {
		    // Handle error, an 'end' event will be emitted after this as well\
		    console.log("There is an error");
		    console.log(err);
		    callback(null);
		    return;
		})
		  .on('result', function(row) {
		    // Pausing the connection is useful if your processing involves I/O
		    connection.pause();

				if(row["username"] == user) {
					console.log("username found");
					o = row;
				}
		      connection.resume();
		})
		  .on('end', function() {
		  	if(!o) {
		  		callback(null);
		  		return;
		  	}
			callback(o);	
			return;    	
		});
	});
}

exports.manualLogin = function(user, pass, callback)
{
	console.log("AM:entering manualLogin");
	var o = null;

	pool.getConnection(function(err, connection) {
		if(err) {
			console.log(error);
			callback("connection-error");
			return;
		}
		var query = connection.query("select username, password, firstname, usertype from user where username = '" + user + "' and password = PASSWORD('"+ pass +"')"); 
		query
		  .on('error', function(err) {
		    // Handle error, an 'end' event will be emitted after this as well\
		    console.log("AM:There is an error");
		    console.log(err);
		    callback(null);
		    return;
		  })
		  .on('result', function(row) {
		    // Pausing the connnection is useful if your processing involves I/O
		    connection.pause();

			if(row["username"] == user) {
				console.log("AM:username found");
				console.log(row);
				o = row;
			}
	      	connection.resume();
		  })
		  .on('end', function() {
		  	if(!o) {
				console.log("AM:no user");
		  		callback('user-not-found');
		  		return;
		  	}
			callback(null, o);	
			return;    	
		  });
	});
}

/* record insertion, update & deletion methods */

exports.addNewAccount = function(newData, callback)
{
	callback('username-taken');
}

exports.updateAccount = function(newData, callback)
{
	callback(null);
}

exports.updatePassword = function(email, newPass, callback)
{
	/*
	accounts.findOne({email:email}, function(e, o){
		if (e){
			callback(e, null);
		}	else{
			saltAndHash(newPass, function(hash){
		        o.pass = hash;
		        accounts.save(o, {safe: true}, callback);
			});
		}
	});
	*/
}

/* account lookup methods */

exports.getAccountByEmail = function(email, callback)
{
	/*
	accounts.findOne({email:email}, function(e, o){ callback(o); });
	*/
}

/* private encryption & validation methods */

var generateSalt = function()
{
	var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
	var salt = '';
	for (var i = 0; i < 10; i++) {
		var p = Math.floor(Math.random() * set.length);
		salt += set[p];
	}
	return salt;
}

var md5 = function(str) {
	return crypto.createHash('md5').update(str).digest('hex');
}

var saltAndHash = function(pass, callback)
{
	var salt = generateSalt();
	callback(salt + md5(pass + salt));
}

var validatePassword = function(plainPass, hashedPass, callback)
{
	var salt = hashedPass.substr(0, 10);
	var validHash = salt + md5(plainPass + salt);
	callback(null, hashedPass === validHash);
}
