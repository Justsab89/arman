function create_table() {
    var mysql      = require('mysql');
    var connection = mysql.createConnection({
            host     : 'localhost',
    user     : 'mybd_user',
    password : 'admin123',
    database : 'my_bd'
});

        connection.connect();

        connection.query('CREATE TABLE iop (id INT NOT NULL AUTO_INCREMENT,id_inter INT, street TEXT, interception CHAR(10), PRIMARY KEY (id))', function (error, results, fields) {
        if (error) throw error;
        console.log('table created');
        });

        connection.end();

}
module.exports = {create_table}
