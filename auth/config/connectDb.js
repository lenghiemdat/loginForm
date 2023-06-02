const mysql = require('mysql');


function connectDb(sql) {
    return new Promise((resolve, reject) => {
        var con = mysql.createConnection({
            host: "localhost",
            port: 3306, //port mysql
            user: "root",
            password: "",
            database: "tdf"
        });

        con.connect((err) => {
            if (err) throw err;
            con.query(sql, (err, result, fields) => {
                if (err) throw err;
                resolve(result);
                con.end();
            });
        });
    });
}


function getUserData(id) {

    var sql = "SELECT * FROM users WHERE id = " + id;
    console.log(sql);
    connectDb(sql).then(
      function (value) {
        if (value) {
        //   console.log(value[0]);
  
          return value[0];
        } else {
          // res.render('findCustomer');
        }; 
  
      },
  
      function (error) { console.log('Error:', error) }
    );
  
  };

module.exports = getUserData;

