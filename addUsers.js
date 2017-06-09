var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit: 100,
    host: 'localhost',
    port: '8889',
    user: 'root',
    password: 'root',
    database: 'scheduler',
    unix_socket: '/Applications/MAMP/tmp/mysql/mysql.sock'
})

// var connection = mysql.createConnection({
// });


var lineReader = require('readline').createInterface({
    terminal: false,
    input: require('fs').createReadStream('junior_users.csv')
});


var userList = [];

lineReader.on('line', function(line) {
        var data = line.split(',');
        var user = [
            data[2],
            "password",
            data[1],
            data[0].charAt(0).toUpperCase(),
            'S'
        ];
        userList.push(user);
    }).on('close', function() {
	    userList.forEach(function(item) {
	    	if(item[0] != undefined) {
	    		pool.getConnection(function(error, connection) {
	    			console.log(item);
                    var sql = "insert into user (username, password, firstname, surname, usertype) values " + 
                    	"( '" + item[0] + "', " + 
                    	"password('" + item[1] + "'), '" + 
                    	item[2] + "', '" + 
                    	item[3] + "', '" +                     	
                    	item[4] + "')";
                    console.log(sql);
                    query = connection.query(sql, item, function(error, result) {
						if (error) {
            	            console.log(error);
                        }
	                    console.log(result);
	                    connection.release();
					});
	    		});
	    	}
	    });
	});
