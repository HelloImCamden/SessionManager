var crypto 		= require('crypto');
var mysql		= require('mysql');
//var MongoDB 	= require('mongodb').Db;
//var Server 		= require('mongodb').Server;
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
//     console.log('\n\nError connecting to Db for Updating Sessions');
//     console.log(err.code + " : " + err.message);
//     return;
//   }
//   console.log('...Session Updater Connection established');
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

exports.updateSession = function(data, callback) {
	// does the session for this teacher already exist?
	console.log("---==SM: updateSession==---");
	console.log(data);

	var sessionQuery = "UPDATE session SET " + 
						"teacher = '" + data["teacher"] + "', " +
						"sessionNum = " + data["sessionNo"] + ", " +
						"title = '" + data["title"] + "', " +
						"description = '" + data["description"] + "', " +
						"max = " + data["max"] + ", " +
						"resources = '" + data["resources"] + "', " +
						"location = '" + data["location"] + "', " +
						"extra = '" + data["extra"] + "' " +
						"WHERE sessionId = " + data["sessionId"];
	console.log(sessionQuery);	
	
	var sessionId = data['sessionId'];
	console.log(sessionId);
	
	if(sessionId == undefined) {
		console.log("Confirmed undefined Session ID ... Changing the query to insert");
		sessionQuery = "INSERT INTO session " + 
					"(teacher, sessionNum, title, description, " +
					"max, resources, location, extra) VALUES " +
					"('" + data['teacher'] + "', " +
					data['sessionNo'] + ", " +
					"'" + data['title'] + "', " +
					"'" + data['description'] + "', " +
					+ data['max'] + ", " +
					"'" + data['resources'] + "', " +
					"'" + data['location'] +  "', " +
					"'" + data['extra'] + "')";	
	}


	console.log("About to run the query")
	console.log(sessionQuery);
	pool.getConnection(function(err, connection) {
		if(err) {
			console.log(error);
			callback("connection-error");
			return;
		}
		query = connection.query(sessionQuery, function(error, results, fields) {
			if(error) {
				console.log(error);
				callback("session-error");
				return;
			}	
			console.log(results);
			callback(null, 'success');
		});
	});
	
		
}

exports.getTeacherSessionData = function(data, callback) {
	console.log("---=== SM.getTeacherSessionData ==---");
	var dataList = [];
	var queryStr = "select sessionId, sessionNum, title, description, max, resources, location, extra " + 
					"from session where teacher = '" + data["teacher"] + "'";

	console.log(queryStr);

	pool.getConnection(function(err, connection) {
		if(err) {
			console.log(error);
			callback("connection-error");
			return;
		}
		var query = connection.query(queryStr);
		query
			.on('error', function(error) {
				console.log("---== SM.getTeacherSessionData SQL ERROR ==---");
				console.log(error);

				callback('error');
			})
			.on('result', function(row) {
				// Pausing the connection is useful if your processing involves I/O
				connection.pause();

				if(row) {
					dataList.push(row);
				}
				connection.resume();
			})
		  	.on('end', function() {
				if(dataList.length > 0) {
					// callback to return the the dataList with all session data
					console.log("---== SM.getTeacherSessionData Data List Object ==---");
					console.log(dataList);
					callback(null, dataList);
				}
				else {
					// callback returns null as there is no data to return
					console.log("---== SM.getTeacherSessionData No Data List Object ==---");
					callback(null);	    	
				}
			});
	});	
}

exports.getSessions = function(studentId, callback) {
	console.log("---=== SM.getSessions ==---");
	var session1 = [];
	var session2 = [];
	var session3 = [];
	var session4 = [];
	var dataList = [session1, session2, session3, session4];
	var queryStr = "select sessionId, sessionNum, title, description, max, location, compulsory, user.firstname, user.surname from session inner join user on session.teacher = user.username";
	var enrolledQueryStr = "select enrollId, sessionId from enrollment where userId = "+studentId;
	var sessionEnrollCountQryStr = "select sessionId, count(sessionId) as enrollCount from enrollment group by sessionId";

	console.log(sessionEnrollCountQryStr);
	pool.getConnection(function(err, connection) {
		if(err) {
			console.log(error);
			callback("connection-error");
			return;
		}
		var enrollCountQuery = connection.query(sessionEnrollCountQryStr, function(countError, countResult) {
			if(countError) {
				console.log(error);
			}
			console.log(countResult);
			console.log(enrolledQueryStr);
			var enrollQuery = connection.query(enrolledQueryStr, function(eqError, eqResult) {

				if(eqError) {
					console.log(eqError)
				}
				console.log(eqResult);

				console.log(queryStr);
				var query = connection.query(queryStr)
				query
					.on('error', function(error) {
						console.log("---== SM.getSessions SQL ERROR ==---");
						console.log(error);

						callback('error');
						return;
					})
					.on('result', function(row) {
						// Pausing the connection is useful if your processing involves I/O
						connection.pause();

						if(row) {
							//Create new data object to return add to the session arrays
							var data = {
								sessionId: row['sessionId'],
								sessionNum:row['sessionNum'], 
								title:row['title'],
								description:row['description'],
								max:row['max'],
								location:row['location'],
								tFname:row['firstname'],
								tSname:row['surname'],
								enrolled: false,
								compulsory: false,
								sessionFull: false
							}
							for(var pos = 0; pos < countResult.length; pos++) {
								var item = countResult[pos];
								console.log(item);
								console.log("dataSession: " + data['sessionId']);
								console.log("itemSession: " + item['sessionId']);
								console.log("dataMax: " + data['max']);
								console.log("itemEnrollCount: " + item['enrollCount']);
								if(data['sessionId'] == item['sessionId'] && item['enrollCount'] >= data['max']) {

									data['sessionFull'] = true;
								}
							}
							for(var pos = 0; pos < eqResult.length; pos++) {
								var item = eqResult[pos]
								if(data['sessionId'] == item['sessionId']) {
									data['enrolled'] = true;
								}
								data['compulsory'] = row['compulsory'] == 1 ? true : false;

							}

							data['tFname'] = data['tFname'].charAt(0).toUpperCase() + ". "; 
							switch(data['sessionNum']) {
								case 1: session1.push(data); break;
								case 2: session2.push(data); break;
								case 3: session3.push(data); break;
								case 4: session4.push(data); break;
							}
						}
						connection.resume();
					})
				  	.on('end', function() {
						// callback to return the the dataList with all session data
						console.log("---== SM.getSessions Data List Object ==---");
						console.log(dataList);
						callback(null, dataList);
					});	
		  });
		});
	});
}

exports.enrollInSession = function(data, callback) {
	console.log("---==SM: enrollInSession==---");
	console.log(data);

	var isEnrolledQryStr = "select session.sessionId, enrollment.enrollId, compulsory " +
							"from session left outer join enrollment " +
							"on session.sessionId = enrollment.sessionId " +
							"where enrollment.userId = '" + data['userId'] + "' " +
							"and sessionNum = " + data['sessionNum']; 

	console.log(isEnrolledQryStr);
	var queryStr = "";

		pool.getConnection(function(err, connection) {
		if(err) {
			console.log(error);
			callback("connection-error");
			return;
		}
		var isEnrolledQuery = connection.query(isEnrolledQryStr, function(error, result) {
			if(error) {
				console.log("---== isEnrolledQuery Error ==---");
				console.log(error);
				callback("error");
				return;
			}
			else {
				if(result.length > 0) {
					var resultData = result[0];
					console.log("---== isEnrolledQurey Result ==---");
					console.log(resultData);
					if(resultData['compulsory']) {
						callback('compulsory-error');
						return;
					}
					else {
						queryStr = "UPDATE enrollment SET " + 
									"sessionId = '" + data["sessionId"] + "' " +
									"WHERE enrollId = " + resultData["enrollId"];				}
					
				}
				else {
					queryStr = "INSERT INTO enrollment " + 
								"(sessionId, userId) VALUES " +
								"(" + data['sessionId'] + ", " +
								"'" + data['userId'] + "')";	
				}
				console.log(queryStr);	
				query = connection.query(queryStr, function(error, results, fields) {
					if(error) {
						console.log(error);
						callback("enrollment-error");
						return;
					}	
					console.log(results);
					callback(null, 'success');			
				});
			}
		});
	});
}