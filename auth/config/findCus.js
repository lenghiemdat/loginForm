const dataMod = require('./connectDb');

function findCus(data) {

    var findtext = data;
    var sql = "SELECT * FROM customers WHERE customers.name LIKE '" + findtext + "'";
    console.log(sql);
    dataMod(sql).then(
        function (value) {
            if (value) {
                console.log(value[0].name);
            } else {
                // res.render('findCustomer');
            }; return value;
        },

        function (error) { console.log('Error:', error) }
    );

};

// findCus("%nhung");

module.exports = findCus;