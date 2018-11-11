const TelegramBot = require('node-telegram-bot-api')
const config = require('./config')
const helper = require('./helper')
//const create_table = require('./create_table')
//const select = require('./select')
//const date_format = require('date_format')
const fs = require('fs')
//const TaskTimer = require('tasktimer')
//const database = require('./database')

const bot = new TelegramBot(config.TOKEN, {
  polling: true
})

helper.logStart()

function debug(obj = {}) {
     return JSON.stringify(obj, null, 4)
}


bot.on('contact', msg => {

var user_id = msg.chat.id;
var username = msg.chat.first_name;
var tel = msg.contact.phone_number;

    var mysql  = require('mysql');
    var pool  = mysql.createPool({
    host     : 'localhost',
    user     :  config.user,
    password :  config.db_password,
    database :  config.db_name
    })


pool.getConnection(function(err, connection) {

    var sql = ' UPDATE users SET tel = ? WHERE id_user = ? ';

    connection.query( sql , [ tel, user_id ], function(err, rows, fields) {
    if (err) throw err;
// После ввода контакта заказчика отправляем заказ менеджеру
    send_order_msg(msg);
    })
})
})



bot.on('message', msg => {
  console.log('Working', msg.from.first_name, msg.chat.id)

    var mysql  = require('mysql');
    var pool  = mysql.createPool({
    host     : 'localhost',
    user     :  config.user,
    password :  config.db_password,
    database :  config.db_name
    })

var user_id = msg.chat.id;
var username = msg.chat.first_name;
var msg_text = msg.text;
var n_report = 'n_report'+user_id;
var order = 'order'+user_id;

pool.getConnection(function(err, connection) {

    var sql = ' SELECT DISTINCT * FROM users WHERE id_user = ? ';

    connection.query( sql , [ user_id ], function(err, rows, fields) {
    if (err) throw err;
    var user = JSON.parse(JSON.stringify(rows));
    console.log('selected', user)

// Если юзер еще не зарегистрировался, то вводим в БД его id_user и first_name
        if (user.length == 0){

            pool.getConnection(function(err, connection) {

                var sql = ' INSERT INTO users (id_user, username) VALUES (?,?) ';

                connection.query( sql , [ user_id, username ], function(err, rows, fields) {
                if (err) throw err;
                console.log('inserted id_user and username')

                const text = 'Здравствуйте, я электронный секретарь Армана\nЧтобы сделать заявку нажмите на "Сделать заказ"\nЧтобы посмотреть контакты нажмите "Контакты"'

                bot.sendMessage(user_id, text, {
                                     reply_markup: {
                                       keyboard: [
                                         [{
                                           text: config.keyboard.kb1.one
                                         }],

                                         [{
                                           text: config.keyboard.kb1.two
                                         }]
//                                          ,
//                                         [{
//                                           text: config.keyboard.kb1.three
//                                         }]
                                       ],
                                       resize_keyboard: true
                                     }
                               })

                    connection.query(' CREATE TABLE ?? (id INT(100) NOT NULL AUTO_INCREMENT, id_user INT(11), PRIMARY KEY(id)) ',
                    [n_report] ,function(err, rows, fields) {
                    if (err) throw err;

                        connection.query(' CREATE TABLE ?? (id INT(100) NOT NULL AUTO_INCREMENT, id_report INT(11), id_user INT(11), date_entry DATETIME, product VARCHAR(100), size VARCHAR(100), number INT(11), offprice INT(11), PRIMARY KEY(id)) ',
                        [order] ,function(err, rows, fields) {
                        if (err) throw err;
                        })

                    })
                })
            })
        }
// В ином случае, если только это не запрос от админа, то вводим имя юзера в БД либо обрабатываем другие запросы
        else {
            if (user[0].id_user == 336243307) {
                      if (msg.text === config.keyboard.kb2.one) {show_products(msg)}
                      else if (msg.text === config.keyboard.kb2.two) {show_commands(msg)}
                      else if (msg.text === config.keyboard.kb2.three) {show_users(msg)}
                      else if (msg.text === config.keyboard.kb2.four) {show_managers(msg)}
                      else if (msg.text === config.keyboard.kb2.five) {show_products(msg)}

                      bot.sendMessage(user_id, 'Вы администратор', {
                                     reply_markup: {
                                       keyboard: [
                                         [{
                                           text: config.keyboard.kb2.one
                                         }],

                                         [{
                                           text: config.keyboard.kb2.two
                                         }],

                                         [{
                                           text: config.keyboard.kb2.three
                                         }],

                                         [{
                                           text: config.keyboard.kb2.four
                                         }]
                                       ],
                                       resize_keyboard: true
                                     }
                               })
            }
            else {

                      if (msg.text === config.keyboard.kb1.one) {show_products(msg)}
//                      else if (msg.text === config.keyboard.kb1.two) {new_jk(msg)}
                      bot.sendMessage(user_id, 'nm', {
                                     reply_markup: {
                                       keyboard: [
                                         [{
                                           text: config.keyboard.kb1.one
                                         }],

                                         [{
                                           text: config.keyboard.kb1.two
                                         }]
//                                          ,
//                                         [{
//                                           text: config.keyboard.kb1.three
//                                         }]
                                       ],
                                       resize_keyboard: true
                                     }
                               })

            }
        }
    })
})
})



bot.on('callback_query', query => {

  var str = query.data;
  var res = str.split("#");
  console.log('res is:', res[0]);
//  var res2 = str.split("#");
//  console.log('res is:', res2[0]); send_order(query);


  if (res[0] =='product') { insert_product(query); bot.deleteMessage(query.message.chat.id, query.message.message_id) }
  else if (res[0] =='size')  { insert_size(query); bot.deleteMessage(query.message.chat.id, query.message.message_id) }
  else if (res[0] =='product_more') { insert_product_more(query); bot.deleteMessage(query.message.chat.id, query.message.message_id) }
  else if (res[0] =='number')  { insert_number(query); bot.deleteMessage(query.message.chat.id, query.message.message_id) }
  else if (res[0] =='more')  { show_products_query(query); bot.deleteMessage(query.message.chat.id, query.message.message_id) }
  else if (res[0] =='send')  { ask_tel(query); bot.deleteMessage(query.message.chat.id, query.message.message_id) }
  else if (res[0] =='manager')  { appoint_manager(query); bot.deleteMessage(query.message.chat.id, query.message.message_id) }
  else if (res[0] =='del_manager')  { delete_manager(query); bot.deleteMessage(query.message.chat.id, query.message.message_id) }
  else if (res[0] =='del_product')  { delete_product(query); bot.deleteMessage(query.message.chat.id, query.message.message_id) }
})



function show_commands(msg) {

var user_id = msg.chat.id;

const text = '☑️ Чтобы ввести новый продукт наберите команду /product затем в этом порядке через # наберите 15 данных.\nНапример у вас следующие данные\n' +
             '\nПервое название продукта: флаер' +
             '\nВторое размер продукта: А5' +
             '\nТретье кол-во на А3: 8 ' +
             '\nЧетвертое себестоимость печати на струйном: 20 ' +
             '\nПятое наценка печати на струйном: 10 ' +
             '\nШестое себестоимость печати на ризографе: 10 ' +
             '\nСедьмое наценка печати на ризографе: 5 ' +
             '\nВосьмое себестоимость печати на офсете: 12 ' +
             '\nДевятое наценка печати на офсете: 8 ' +
             '\nДесятое себестоимость печати на цифровом: 30 ' +
             '\nОдиннацатое наценка печати на цифровом: 10 ' +
             '\nДвенадцатое себестоимость бумаги А3: 20 ' +
             '\nТринадцатое наценка бумаги А3: 5 ' +
             '\nЧетырнадцатое себестоимость резки: 5 ' +
             '\nПятнадцатое наценка резки: 2 ' +
             '\nВ итоге вы вводите следующую команду' +
             '\n/product флаер#A5#8#20#10#10#5#12#8#30#10#20#5#5#2\n' +
             '\n\n☑️ Чтобы ввести цену на тираж наберите команду /tiraj затем в этом порядке через # наберите 3 данных' +
             '\nПервое цену за тираж: 50' +
             '\nВторое кол-во ОТ: 0' +
             '\nТретье кол-во ДО: 100 ' +
             '\nВ итоге вы вводите следующую команду' +
             '\n/tiraj 50#0#100' 

bot.sendMessage(user_id, text)
//    var mysql  = require('mysql');
//    var pool  = mysql.createPool({
//    host     : 'localhost',
//    user     :  config.user,
//    password :  config.db_password,
//    database :  config.db_name
//    })
//
//pool.getConnection(function(err, connection) {
//
//    var sql = 'DELETE FROM product WHERE id = ?';
//
//    connection.query( sql , [res[2]], function(err, rows, fields) {
//    if (err) throw err;
//    var deleted = JSON.parse(JSON.stringify(rows));
//    })
//})

}



function delete_product(query) {

var user_id = query.message.chat.id;
  var str = query.data;
  var res = str.split("#");
  console.log('appoint manager res is:', res[0]);

    var mysql  = require('mysql');
    var pool  = mysql.createPool({
    host     : 'localhost',
    user     :  config.user,
    password :  config.db_password,
    database :  config.db_name
    })

pool.getConnection(function(err, connection) {

    var sql = 'DELETE FROM product WHERE id = ?';

    connection.query( sql , [res[2]], function(err, rows, fields) {
    if (err) throw err;
    var deleted = JSON.parse(JSON.stringify(rows));
    console.log('deleted ', deleted);
//    console.log('update affected ', upd[0].affectedRows);

//    if (upd[0].affectedRows === 1){
//    var text = res[2] + ' назначен менеджером';
//    }
//    else{
//    var text = 'Никто не назначен менеджером';
//    }
//
//    bot.sendMessage(user_id, text )
    })
})
}



function delete_manager(query) {

var user_id = query.message.chat.id;
  var str = query.data;
  var res = str.split("#");
  console.log('appoint manager res is:', res[0]);

    var mysql  = require('mysql');
    var pool  = mysql.createPool({
    host     : 'localhost',
    user     :  config.user,
    password :  config.db_password,
    database :  config.db_name
    })

pool.getConnection(function(err, connection) {

    var sql = ' UPDATE users SET status = NULL WHERE id_user = ?';

    connection.query( sql , [res[1]], function(err, rows, fields) {
    if (err) throw err;
    var upd = JSON.parse(JSON.stringify(rows));
    console.log('update ', upd);
//    console.log('update affected ', upd[0].affectedRows);

//    if (upd[0].affectedRows === 1){
//    var text = res[2] + ' назначен менеджером';
//    }
//    else{
//    var text = 'Никто не назначен менеджером';
//    }
//
//    bot.sendMessage(user_id, text )
    })
})
}



function appoint_manager(query) {

var user_id = query.message.chat.id;
  var str = query.data;
  var res = str.split("#");
  console.log('appoint manager res is:', res[0]);

    var mysql  = require('mysql');
    var pool  = mysql.createPool({
    host     : 'localhost',
    user     :  config.user,
    password :  config.db_password,
    database :  config.db_name
    })

pool.getConnection(function(err, connection) {

    var sql = ' UPDATE users SET status = "manager" WHERE id_user = ?';

    connection.query( sql , [res[1]], function(err, rows, fields) {
    if (err) throw err;
    var upd = JSON.parse(JSON.stringify(rows));
    console.log('update ', upd);
//    console.log('update affected ', upd[0].affectedRows);

//    if (upd[0].affectedRows === 1){
//    var text = res[2] + ' назначен менеджером';
//    }
//    else{
//    var text = 'Никто не назначен менеджером';
//    }
//
//    bot.sendMessage(user_id, text )
    })
})
}



function ask_tel(query) {

var user_id = query.message.chat.id;
var n_report = 'n_report'+user_id;
var order = 'order'+user_id;

    var mysql  = require('mysql');
    var pool  = mysql.createPool({
    host     : 'localhost',
    user     :  config.user,
    password :  config.db_password,
    database :  config.db_name
    })

pool.getConnection(function(err, connection) {

    var sql = ' SELECT tel FROM users WHERE id_user = ?';

    connection.query( sql , [user_id], function(err, rows, fields) {
    if (err) throw err;
    var tel = JSON.parse(JSON.stringify(rows));

    if (tel[0].tel === null){
    var text = 'Нажмите на "Отправить свой телефон", чтобы наш менеджер связался с вами. В ручную не набирайте свой номер телефона';
    bot.sendMessage(user_id, text, {
                   reply_markup: {
                     keyboard: [
                       [{
                         text: 'Отправить свой телефон',
                         request_contact: true
                       }]
                     ],
                     resize_keyboard: true
                   }
                   }
    )
    }
    else{
    send_order(query)
    }

    })
})
}



function show_products(msg) {

var user_id = msg.chat.id;
var n_report = 'n_report'+user_id;
var order_table = 'order'+user_id;

    var mysql  = require('mysql');
    var pool  = mysql.createPool({
    host     : 'localhost',
    user     :  config.user,
    password :  config.db_password,
    database :  config.db_name
    })

pool.getConnection(function(err, connection) {

    var sql2 = ' SELECT * FROM product ';

    connection.query( sql2 , function(err, rows, fields) {
    if (err) throw err;
    var product = JSON.parse(JSON.stringify(rows));
    var keyboard = [];
    console.log('products ', product);

        for(var i = 0; i < product.length; i++){
        keyboard.push([{'text': ('Удалить ' + product[i].name + ' ' + product[i].size) , 'callback_data': ('del_product#' + product[i].name + '#' + product[i].id)}]);


         var text = product[i].name + ' ' + product[i].size + ' в одном А3 ' + product[i].size + ' шт' + '\n' +
                    'Себестоимость бумаги ' + product[i].paper_exp + '\n' +
                    'Наценка на бумагу ' + product[i].paper_profit + '\n' +
                    'Себестоимость резки ' + product[i].cut_exp + '\n' +
                    'Наценка на резку ' + product[i].cut_profit + '\n' +
                    'Себестоимость печати ' + product[i].print_exp + '\n' +
                    'Наценка на печать ' + product[i].print_profit + '\n' +
                    'Себестоимость офф. печати ' + product[i].offprint_exp + '\n' +
                    'Наценка на офф. печать ' + product[i].offprint_profit + '\n' +
                    'Себестоимость риз. печати ' + product[i].rizprint_exp + '\n' +
                    'Наценка на риз. печать ' + product[i].rizprint_profit + '\n' +
                    'Себестоимость цифр. печати ' + product[i].digprint_exp + '\n' +
                    'Наценка на цифр. печать ' + product[i].digprint_profit;

         bot.sendMessage( user_id, text,
         {
         'reply_markup': JSON.stringify({
         inline_keyboard: keyboard
                                        })
         }
         )
        }
    })
})
}



function show_managers(msg) {

var user_id = msg.chat.id;
var n_report = 'n_report'+user_id;
var order_table = 'order'+user_id;

    var mysql  = require('mysql');
    var pool  = mysql.createPool({
    host     : 'localhost',
    user     :  config.user,
    password :  config.db_password,
    database :  config.db_name
    })

pool.getConnection(function(err, connection) {

    var sql2 = ' SELECT * FROM users WHERE status = "manager" ';

    connection.query( sql2 , [order_table, order_table], function(err, rows, fields) {
    if (err) throw err;
    var all_users = JSON.parse(JSON.stringify(rows));
    var keyboard = [];
    console.log('all users ', all_users);

        for(var i = 0; i < all_users.length; i++){
        keyboard.push([{'text': (all_users[i].username + ' ' + all_users[i].lname) , 'callback_data': ('del_manager#' + all_users[i].id_user + '#' + all_users[i].username)}]);
        }

        var text = 'Выберите кого убрать из менеджеров ';

             bot.sendMessage( user_id, text,
             {
             'reply_markup': JSON.stringify({
             inline_keyboard: keyboard
                                            })
             }
             )
    })
})
}



function show_users(msg) {

var user_id = msg.chat.id;
var n_report = 'n_report'+user_id;
var order_table = 'order'+user_id;

    var mysql  = require('mysql');
    var pool  = mysql.createPool({
    host     : 'localhost',
    user     :  config.user,
    password :  config.db_password,
    database :  config.db_name
    })

pool.getConnection(function(err, connection) {

    var sql1 = ' SELECT * FROM users WHERE status = "manager" ';

    connection.query( sql1 , [order_table, order_table], function(err, rows, fields) {
    if (err) throw err;
    var current = JSON.parse(JSON.stringify(rows));

        var sql2 = ' SELECT * FROM users WHERE status IS NULL ';

        connection.query( sql2 , [order_table, order_table], function(err, rows, fields) {
        if (err) throw err;
        var all_users = JSON.parse(JSON.stringify(rows));
        var keyboard = [];
        console.log('all users ', all_users);

            for(var i = 0; i < all_users.length; i++){
            keyboard.push([{'text': (all_users[i].username + ' ' + all_users[i].lname) , 'callback_data': ('manager#' + all_users[i].id_user + '#' + all_users[i].username)}]);
            }

            if(current.length == 0){
            var text = 'Выберите кого назначить менеджером ';
            }
            else{
                for(var i = 0; i < current.length; i++){
                var text = 'Ваши текущие менеджера: ' + current[i].username + ' ' + current[i].lname + '\n';
                }
                text += 'Выберите кого назначить менеджером ';
            }

                 bot.sendMessage( user_id, text,
                 {
                 'reply_markup': JSON.stringify({
                 inline_keyboard: keyboard
                                                })
                 }
                 )
        })
    })
})
}



function send_order_msg(msg) {

var user_id = msg.chat.id;
var n_report = 'n_report'+user_id;
var order_table = 'order'+user_id;
var text = 'Выберите продукт:';

    var mysql  = require('mysql');
    var pool  = mysql.createPool({
    host     : 'localhost',
    user     :  config.user,
    password :  config.db_password,
    database :  config.db_name
    })

pool.getConnection(function(err, connection) {

var sql1 = ' SELECT * FROM users WHERE id_user = ?';

connection.query( sql1 , [ user_id ], function(err, rows, fields) {
if (err) throw err;
var nomer = JSON.parse(JSON.stringify(rows));

    var sql2 = ' SELECT * FROM ?? WHERE id_report = (SELECT id_report FROM ?? ORDER BY id DESC LIMIT 1)';

    connection.query( sql2 , [order_table, order_table], function(err, rows, fields) {
    if (err) throw err;
    var order = JSON.parse(JSON.stringify(rows));
    var test = [];

    for(var i = 0; i < order.length; i++){
    test.push([ order[i].id_report, order[i].id_user, order[i].date_entry, order[i].product, order[i].size, order[i].number, order[i].offprice]);
    }

        var sql3 = ' INSERT INTO zakaz (id_report, id_user, date_entry, product, size, number, offprice) VALUES ? ';

        connection.query( sql3 , [test], function(err, rows, fields) {
        if (err) throw err;
            var text = 'Клиент по имени: ' + nomer[0].username + ' с номером: ' + '+' + nomer[0].tel ;

            for(var i = 0; i < order.length; i++){
            text += order[i].product + ' размер ' + order[i].size + ' тиражом ' + order[i].number + '\n';
            }

            var sql4 = ' SELECT product.name, product.size, product.number AS ina3, product.print_exp, product.print_profit, product.paper_exp, product.paper_profit, product.cut_exp, product.cut_profit, product.expense, product.profit, ' +
                       ' product.offprint_exp, product.offprint_profit, product.digprint_exp, product.digprint_profit, ??.number, ??.offprice ' +
                       ' FROM product JOIN ?? WHERE product.name = ??.product AND product.size = ??.size AND ??.id_report = (SELECT id_report FROM ?? ORDER BY id DESC LIMIT 1) ';

            connection.query( sql4 , [order_table, order_table, order_table, order_table, order_table, order_table, order_table], function(err, rows, fields) {
            if (err) throw err;
            var counting = JSON.parse(JSON.stringify(rows));
            console.log('joining result ', counting);
//            var test = [];
//
//            for(var i = 0; i < order.length; i++){
//            test.push([ order[i].id_report, order[i].id_user, order[i].date_entry, order[i].product, order[i].size, order[i].number]);
//            }
             for(var i = 0; i < counting.length; i++){

             if (counting[i].number % counting[i].ina3 !== 0) {
             var kolvoa3 = counting[i].number % counting[i].ina3;
              var n_paper = counting[i].number/counting[i].ina3 + 1;
              var print_exp = counting[i].print_exp*n_paper;
              var print_profit = counting[i].print_profit*n_paper;
//              var offprint_exp = counting[i].offprint_exp*n_paper;
//              var offprint_profit = counting[i].offprint_profit*n_paper;
              var offprint_exp = counting[i].offprice*n_paper/2;
              var offprint_profit = counting[i].offprice*n_paper/2;

              var rizprint_exp = counting[i].rizprint_exp*n_paper;
              var rizprint_profit = counting[i].rizprint_profit*n_paper;
              var digprint_exp = counting[i].digprint_exp*n_paper;
              var digprint_profit = counting[i].digprint_profit*n_paper;
              var print = counting[i].print_exp*n_paper + counting[i].print_profit*n_paper;
              var offprint = counting[i].offprint_exp*n_paper + counting[i].offprint_profit*n_paper;
              var rizprint = counting[i].rizprint_exp*n_paper + counting[i].rizprint_profit*n_paper;
              var digprint = counting[i].digprint_exp*n_paper + counting[i].digprint_profit*n_paper;
              var paper_exp = counting[i].paper_exp*n_paper;
              var paper_profit = counting[i].paper_profit*n_paper;
              var paper = counting[i].paper_exp*n_paper + counting[i].paper_profit*n_paper;
              var cut_exp = counting[i].cut_exp*n_paper;
              var cut_profit = counting[i].cut_profit*n_paper;
              var cut = counting[i].cut_exp*n_paper +counting[i].cut_profit*n_paper;

              var exp = print_exp + paper_exp + cut_exp;
              var profit = print_profit + paper_profit + cut_profit;
              var total = profit + exp;
              var offexp = offprint_exp + paper_exp + cut_exp;
              var offprofit = offprint_profit + paper_profit + cut_profit;
              var offtotal = offexp + offprofit;
              var digexp = digprint_exp + paper_exp + cut_exp;
              var digprofit = digprint_profit + paper_profit + cut_profit;
              var digtotal = digexp + digprofit;
              var rizexp = rizprint_exp + paper_exp + cut_exp;
              var rizprofit = rizprint_profit + paper_profit + cut_profit;
              var riztotal = rizexp + rizprofit;

              var sum = print_exp+print_profit+paper_exp+paper_profit+cut_exp+cut_profit;
             }

             else {
              var n_paper = counting[i].number/counting[i].ina3 + 1;
              var print_exp = counting[i].print_exp*n_paper;
              var print_profit = counting[i].print_profit*n_paper;
//              var offprint_exp = counting[i].offprint_exp*n_paper;
//              var offprint_profit = counting[i].offprint_profit*n_paper;
              var offprint_exp = counting[i].offprice*n_paper/2;
              var offprint_profit = counting[i].offprice*n_paper/2;

              var rizprint_exp = counting[i].rizprint_exp*n_paper;
              var rizprint_profit = counting[i].rizprint_profit*n_paper;
              var digprint_exp = counting[i].digprint_exp*n_paper;
              var digprint_profit = counting[i].digprint_profit*n_paper;
              var print = counting[i].print_exp*n_paper + counting[i].print_profit*n_paper;
              var offprint = counting[i].offprint_exp*n_paper + counting[i].offprint_profit*n_paper;
              var rizprint = counting[i].rizprint_exp*n_paper + counting[i].rizprint_profit*n_paper;
              var digprint = counting[i].digprint_exp*n_paper + counting[i].digprint_profit*n_paper;
              var paper_exp = counting[i].paper_exp*n_paper;
              var paper_profit = counting[i].paper_profit*n_paper;
              var paper = counting[i].paper_exp*n_paper + counting[i].paper_profit*n_paper;
              var cut_exp = counting[i].cut_exp*n_paper;
              var cut_profit = counting[i].cut_profit*n_paper;
              var cut = counting[i].cut_exp*n_paper +counting[i].cut_profit*n_paper;

              var exp = print_exp + paper_exp + cut_exp;
              var profit = print_profit + paper_profit + cut_profit;
              var total = profit + exp;
              var offexp = offprint_exp + paper_exp + cut_exp;
              var offprofit = offprint_profit + paper_profit + cut_profit;
              var offtotal = offexp + offprofit;
              var digexp = digprint_exp + paper_exp + cut_exp;
              var digprofit = digprint_profit + paper_profit + cut_profit;
              var digtotal = digexp + digprofit;
              var rizexp = rizprint_exp + paper_exp + cut_exp;
              var rizprofit = rizprint_profit + paper_profit + cut_profit;
              var riztotal = rizexp + rizprofit;

              var sum = print_exp+print_profit+paper_exp+paper_profit+cut_exp+cut_profit;
             }


               text += ' Имя: ' + nomer[0].username + ' номер: ' + '+' + nomer[0].tel + '\n' +
                       '🔹 ' + counting[i].name + ' ' +  counting[i].size + ' на сумму ' + sum + '\n' +
                       ' кол-во А3 - ' + n_paper + '\n' +
                       '(себестоимость и наценка)' + '\n' +
                       'Струйная печать' + '\n' +
                       ' ЦП ' + print_exp + ' + ' + print_profit + ' = ' + print + '\n' +
                       ' ЦБ ' + paper_exp + ' + ' + paper_profit + ' = ' + paper + '\n' +
                       ' ЦР ' + cut_exp + ' + ' + cut_profit + ' = ' + cut + '\n' +
                       ' Всего ' + exp + ' + ' + profit + ' = ' + total + '\n' +
                       'Ризограф печать' + '\n' +
                       ' ЦП ' + rizprint_exp + ' + ' + rizprint_profit + ' = ' + rizprint + '\n' +
                       ' ЦБ ' + paper_exp + ' + ' + paper_profit + ' = ' + paper + '\n' +
                       ' ЦР ' + cut_exp + ' + ' + cut_profit + ' = ' + cut + '\n' +
                       ' Всего ' + rizexp + ' + ' + rizprofit + ' = ' + riztotal + '\n' +
                       'Офсетная печать' + '\n' +
                       ' ЦП ' + offprint_exp + ' + ' + offprint_profit + ' = ' + offprint + '\n' +
                       ' ЦБ ' + paper_exp + ' + ' + paper_profit + ' = ' + paper + '\n' +
                       ' ЦР ' + cut_exp + ' + ' + cut_profit + ' = ' + cut + '\n' +
                       ' Всего ' + offexp + ' + ' + offprofit + ' = ' + offtotal + '\n' +
                       'Цифровая печать' + '\n' +
                       ' ЦП ' + digprint_exp + ' + ' + digprint_profit + ' = ' + digprint + '\n' +
                       ' ЦБ ' + paper_exp + ' + '  + paper_profit + ' = ' + paper + '\n' +
                       ' ЦР ' + cut_exp + ' + ' + cut_profit + ' = ' + cut + '\n' +
                       ' Всего ' + digexp + ' + ' + digprofit + ' = ' + digtotal + '\n' ;

//               text += '🔹 ' + counting[i].name + ' ' +  counting[i].size + ' на сумму ' + sum + '\n' +
//                       ' кол-во А3 - ' + n_paper + '\n' +
//                       '(себестоимость и наценка)' + '\n' +
//                       'Простая печать' + '\n' +
//                       ' ЦП ' + counting[i].print_exp + ' > ' + print_exp + ' + ' + counting[i].print_profit + ' > ' + print_profit + ' = ' + print + '\n' +
//                       ' ЦБ ' + counting[i].paper_exp + ' > ' + paper_exp + ' + ' + counting[i].paper_profit + ' > ' + paper_profit + ' = ' + paper + '\n' +
//                       ' ЦР ' + counting[i].cut_exp + ' > ' + cut_exp + ' + ' + counting[i].cut_profit + ' > ' + cut_profit + ' = ' + cut + '\n' +
//                       'Офсетная печать' + '\n' +
//                       ' ЦП ' + counting[i].offprint_exp + ' > ' + offprint_exp + ' + ' + counting[i].offprint_profit + ' > ' + offprint_profit + ' = ' + print + '\n' +
//                       ' ЦБ ' + counting[i].paper_exp + ' > ' + paper_exp + ' + ' + counting[i].paper_profit + ' > ' + paper_profit + ' = ' + paper + '\n' +
//                       ' ЦР ' + counting[i].cut_exp + ' > ' + cut_exp + ' + ' + counting[i].cut_profit + ' > ' + cut_profit + ' = ' + cut + '\n' +
//                       'Цифровая печать' + '\n' +
//                       ' ЦП ' + counting[i].digprint_exp + ' > ' + digprint_exp + ' + ' + counting[i].digprint_profit + ' > ' + digprint_profit + ' = ' + print + '\n' +
//                       ' ЦБ ' + counting[i].paper_exp + ' > ' + paper_exp + ' + ' + counting[i].paper_profit + ' > ' + paper_profit + ' = ' + paper + '\n' +
//                       ' ЦР ' + counting[i].cut_exp + ' > ' + cut_exp + ' + ' + counting[i].cut_profit + ' > ' + cut_profit + ' = ' + cut + '\n' ;

             }

                 var sql5 = ' SELECT * FROM users WHERE status = "manager" ';

                 connection.query( sql5 , [ user_id ], function(err, rows, fields) {
                 if (err) throw err;
                 var manager = JSON.parse(JSON.stringify(rows));
                     for(var i = 0; i < manager.length; i++){
                     bot.sendMessage(manager[i].id_user, text)
                     }
                 })
            })
        })
    })
})
})
}


//когда уже номер зарегистрирован в базе и сразу после нажатия на "отправить заявку" срабатывает эта функция
function send_order(query) {

var user_id = query.message.chat.id;
var n_report = 'n_report'+user_id;
var order_table = 'order'+user_id;
var text = 'Выберите продукт:';

    var mysql  = require('mysql');
    var pool  = mysql.createPool({
    host     : 'localhost',
    user     :  config.user,
    password :  config.db_password,
    database :  config.db_name
    })

pool.getConnection(function(err, connection) {

var sql1 = ' SELECT * FROM users WHERE id_user = ?';

connection.query( sql1 , [ user_id ], function(err, rows, fields) {
if (err) throw err;
var nomer = JSON.parse(JSON.stringify(rows));

    var sql2 = ' SELECT * FROM ?? WHERE id_report = (SELECT id_report FROM ?? ORDER BY id DESC LIMIT 1)';

    connection.query( sql2 , [order_table, order_table], function(err, rows, fields) {
    if (err) throw err;
    var order = JSON.parse(JSON.stringify(rows));
    var test = [];

    for(var i = 0; i < order.length; i++){
    test.push([ order[i].id_report, order[i].id_user, order[i].date_entry, order[i].product, order[i].size, order[i].number, order[i].offprice]);
    }

        var sql3 = ' INSERT INTO zakaz (id_report, id_user, date_entry, product, size, number, offprice) VALUES ? ';

        connection.query( sql3 , [test], function(err, rows, fields) {
        if (err) throw err;
            var text = 'Вы сделали заявку на ';

            for(var i = 0; i < order.length; i++){
            text += order[i].product + ' размер ' + order[i].size + ' тиражом ' + order[i].number + '\n';
            }

            var sql4 = ' SELECT product.name, product.size, product.number AS ina3, product.print_exp, product.print_profit, product.paper_exp, product.paper_profit, product.cut_exp, product.cut_profit, product.expense, product.profit, ' +
                       ' product.offprint_exp, product.offprint_profit, product.digprint_exp, product.digprint_profit, ??.number, ??.offprice ' +
                       ' FROM product JOIN ?? WHERE product.name = ??.product AND product.size = ??.size AND ??.id_report = (SELECT id_report FROM ?? ORDER BY id DESC LIMIT 1) ';

            connection.query( sql4 , [order_table, order_table, order_table, order_table, order_table, order_table, order_table], function(err, rows, fields) {
            if (err) throw err;
            var counting = JSON.parse(JSON.stringify(rows));
            console.log('joining result ', counting);
//            var test = [];
//
//            for(var i = 0; i < order.length; i++){
//            test.push([ order[i].id_report, order[i].id_user, order[i].date_entry, order[i].product, order[i].size, order[i].number]);
//            }
             for(var i = 0; i < counting.length; i++){

             if (counting[i].number % counting[i].ina3 !== 0) {
             var kolvoa3 = counting[i].number % counting[i].ina3;
             var n_paper = counting[i].number/counting[i].ina3 + 1;

//                var sql5 = ' SELECT price FROM tiraj WHERE n_from > ? AND n_to < ? ';
//                connection.query( sql5 , [order_table, order_table], function(err, rows, fields) {
//                if (err) throw err;
//                var counting = JSON.parse(JSON.stringify(rows));
//                })

              var print_exp = counting[i].print_exp*n_paper;
              var print_profit = counting[i].print_profit*n_paper;
//              var offprint_exp = counting[i].offprint_exp;
//              var offprint_profit = counting[i].offprint_profit;
              var offprint_exp = counting[i].offprice*n_paper/2;
              var offprint_profit = counting[i].offprice*n_paper/2;

              var rizprint_exp = counting[i].rizprint_exp*n_paper;
              var rizprint_profit = counting[i].rizprint_profit*n_paper;
              var digprint_exp = counting[i].digprint_exp*n_paper;
              var digprint_profit = counting[i].digprint_profit*n_paper;
              var print = counting[i].print_exp*n_paper + counting[i].print_profit*n_paper;
              var offprint = counting[i].offprint_exp*n_paper + counting[i].offprint_profit*n_paper;
              var rizprint = counting[i].rizprint_exp*n_paper + counting[i].rizprint_profit*n_paper;
              var digprint = counting[i].digprint_exp*n_paper + counting[i].digprint_profit*n_paper;
              var paper_exp = counting[i].paper_exp*n_paper;
              var paper_profit = counting[i].paper_profit*n_paper;
              var paper = counting[i].paper_exp*n_paper + counting[i].paper_profit*n_paper;
              var cut_exp = counting[i].cut_exp*n_paper;
              var cut_profit = counting[i].cut_profit*n_paper;
              var cut = counting[i].cut_exp*n_paper +counting[i].cut_profit*n_paper;

              var exp = print_exp + paper_exp + cut_exp;
              var profit = print_profit + paper_profit + cut_profit;
              var total = profit + exp;
              var offexp = offprint_exp + paper_exp + cut_exp;
              var offprofit = offprint_profit + paper_profit + cut_profit;
              var offtotal = offexp + offprofit;
              var digexp = digprint_exp + paper_exp + cut_exp;
              var digprofit = digprint_profit + paper_profit + cut_profit;
              var digtotal = digexp + digprofit;
              var rizexp = rizprint_exp + paper_exp + cut_exp;
              var rizprofit = rizprint_profit + paper_profit + cut_profit;
              var riztotal = rizexp + rizprofit;

              var sum = print_exp+print_profit+paper_exp+paper_profit+cut_exp+cut_profit;
             }

             else {
              var n_paper = counting[i].number/counting[i].ina3 + 1;
              var print_exp = counting[i].print_exp*n_paper;
              var print_profit = counting[i].print_profit*n_paper;
//              var offprint_exp = counting[i].offprint_exp;
//              var offprint_profit = counting[i].offprint_profit;
              var offprint_exp = counting[i].offprice*n_paper/2;
              var offprint_profit = counting[i].offprice*n_paper/2;

              var rizprint_exp = counting[i].rizprint_exp*n_paper;
              var rizprint_profit = counting[i].rizprint_profit*n_paper;
              var digprint_exp = counting[i].digprint_exp*n_paper;
              var digprint_profit = counting[i].digprint_profit*n_paper;
              var print = counting[i].print_exp*n_paper + counting[i].print_profit*n_paper;
              var offprint = counting[i].offprint_exp*n_paper + counting[i].offprint_profit*n_paper;
              var rizprint = counting[i].rizprint_exp*n_paper + counting[i].rizprint_profit*n_paper;
              var digprint = counting[i].digprint_exp*n_paper + counting[i].digprint_profit*n_paper;
              var paper_exp = counting[i].paper_exp*n_paper;
              var paper_profit = counting[i].paper_profit*n_paper;
              var paper = counting[i].paper_exp*n_paper + counting[i].paper_profit*n_paper;
              var cut_exp = counting[i].cut_exp*n_paper;
              var cut_profit = counting[i].cut_profit*n_paper;
              var cut = counting[i].cut_exp*n_paper +counting[i].cut_profit*n_paper;

              var exp = print_exp + paper_exp + cut_exp;
              var profit = print_profit + paper_profit + cut_profit;
              var total = profit + exp;
              var offexp = offprint_exp + paper_exp + cut_exp;
              var offprofit = offprint_profit + paper_profit + cut_profit;
              var offtotal = offexp + offprofit;
              var digexp = digprint_exp + paper_exp + cut_exp;
              var digprofit = digprint_profit + paper_profit + cut_profit;
              var digtotal = digexp + digprofit;
              var rizexp = rizprint_exp + paper_exp + cut_exp;
              var rizprofit = rizprint_profit + paper_profit + cut_profit;
              var riztotal = rizexp + rizprofit;

              var sum = print_exp+print_profit+paper_exp+paper_profit+cut_exp+cut_profit;
             }


               text += ' Имя: ' + nomer[0].username + ' номер: ' + '+' + nomer[0].tel + '\n' +
                       '🔹 ' + counting[i].name + ' ' +  counting[i].size + ' на сумму ' + sum + '\n' +
                       ' кол-во А3 - ' + n_paper + '\n' +
                       '(себестоимость и наценка)' + '\n' +
                       'Струйная печать' + '\n' +
                       ' ЦП ' + print_exp + ' + ' + print_profit + ' = ' + print + '\n' +
                       ' ЦБ ' + paper_exp + ' + ' + paper_profit + ' = ' + paper + '\n' +
                       ' ЦР ' + cut_exp + ' + ' + cut_profit + ' = ' + cut + '\n' +
                       ' Всего ' + exp + ' + ' + profit + ' = ' + total + '\n' +
                       'Ризограф печать' + '\n' +
                       ' ЦП ' + rizprint_exp + ' + ' + rizprint_profit + ' = ' + rizprint + '\n' +
                       ' ЦБ ' + paper_exp + ' + ' + paper_profit + ' = ' + paper + '\n' +
                       ' ЦР ' + cut_exp + ' + ' + cut_profit + ' = ' + cut + '\n' +
                       ' Всего ' + rizexp + ' + ' + rizprofit + ' = ' + riztotal + '\n' +
                       'Офсетная печать' + '\n' +
                       ' ЦП ' + offprint_exp + ' + ' + offprint_profit + ' = ' + offprint + '\n' +
                       ' ЦБ ' + paper_exp + ' + ' + paper_profit + ' = ' + paper + '\n' +
                       ' ЦР ' + cut_exp + ' + ' + cut_profit + ' = ' + cut + '\n' +
                       ' Всего ' + offexp + ' + ' + offprofit + ' = ' + offtotal + '\n' +
                       'Цифровая печать' + '\n' +
                       ' ЦП ' + digprint_exp + ' + ' + digprint_profit + ' = ' + digprint + '\n' +
                       ' ЦБ ' + paper_exp + ' + '  + paper_profit + ' = ' + paper + '\n' +
                       ' ЦР ' + cut_exp + ' + ' + cut_profit + ' = ' + cut + '\n' +
                       ' Всего ' + digexp + ' + ' + digprofit + ' = ' + digtotal + '\n' ;

//               text += '🔹 ' + counting[i].name + ' ' +  counting[i].size + ' на сумму ' + sum + '\n' +
//                       ' кол-во А3 - ' + n_paper + '\n' +
//                       '(себестоимость и наценка)' + '\n' +
//                       'Простая печать' + '\n' +
//                       ' ЦП ' + counting[i].print_exp + ' > ' + print_exp + ' + ' + counting[i].print_profit + ' > ' + print_profit + ' = ' + print + '\n' +
//                       ' ЦБ ' + counting[i].paper_exp + ' > ' + paper_exp + ' + ' + counting[i].paper_profit + ' > ' + paper_profit + ' = ' + paper + '\n' +
//                       ' ЦР ' + counting[i].cut_exp + ' > ' + cut_exp + ' + ' + counting[i].cut_profit + ' > ' + cut_profit + ' = ' + cut + '\n' +
//                       'Офсетная печать' + '\n' +
//                       ' ЦП ' + counting[i].offprint_exp + ' > ' + offprint_exp + ' + ' + counting[i].offprint_profit + ' > ' + offprint_profit + ' = ' + print + '\n' +
//                       ' ЦБ ' + counting[i].paper_exp + ' > ' + paper_exp + ' + ' + counting[i].paper_profit + ' > ' + paper_profit + ' = ' + paper + '\n' +
//                       ' ЦР ' + counting[i].cut_exp + ' > ' + cut_exp + ' + ' + counting[i].cut_profit + ' > ' + cut_profit + ' = ' + cut + '\n' +
//                       'Цифровая печать' + '\n' +
//                       ' ЦП ' + counting[i].digprint_exp + ' > ' + digprint_exp + ' + ' + counting[i].digprint_profit + ' > ' + digprint_profit + ' = ' + print + '\n' +
//                       ' ЦБ ' + counting[i].paper_exp + ' > ' + paper_exp + ' + ' + counting[i].paper_profit + ' > ' + paper_profit + ' = ' + paper + '\n' +
//                       ' ЦР ' + counting[i].cut_exp + ' > ' + cut_exp + ' + ' + counting[i].cut_profit + ' > ' + cut_profit + ' = ' + cut + '\n' ;

             }

                 var sql5 = ' SELECT * FROM users WHERE status = "manager" ';

                 connection.query( sql5 , [ user_id ], function(err, rows, fields) {
                 if (err) throw err;
                 var manager = JSON.parse(JSON.stringify(rows));
                     for(var i = 0; i < manager.length; i++){
                     bot.sendMessage(manager[i].id_user, text)
                     }
                 })
            })
        })
    })
})
})
}



function show_products_query (query) {

var user_id = query.message.chat.id;
var text = 'Выберите продукт:';

    var mysql  = require('mysql');
    var pool  = mysql.createPool({
    host     : 'localhost',
    user     :  config.user,
    password :  config.db_password,
    database :  config.db_name
    })

pool.getConnection(function(err, connection) {

    var sql = ' SELECT DISTINCT name FROM product ';

    connection.query( sql , function(err, rows, fields) {
    if (err) throw err;
    var product = JSON.parse(JSON.stringify(rows));
    var keyboard = [];

    for(var i = 0; i < product.length; i++){
    keyboard.push([{'text': ( product[i].name ) , 'callback_data': ('product_more#' + product[i].name)}]);
    }
    const text = 'Выберите еще один продукт '


         bot.sendMessage( user_id, text,
         {
         'reply_markup': JSON.stringify({
         inline_keyboard: keyboard
                                        })
         }
         )
    })
})
}



function show_products (msg) {

var user_id = msg.chat.id;
var text = 'Выберите продукт:';

    var mysql  = require('mysql');
    var pool  = mysql.createPool({
    host     : 'localhost',
    user     :  config.user,
    password :  config.db_password,
    database :  config.db_name
    })

pool.getConnection(function(err, connection) {

    var sql = ' SELECT DISTINCT name FROM product ';

    connection.query( sql , function(err, rows, fields) {
    if (err) throw err;
    var product = JSON.parse(JSON.stringify(rows));
    var keyboard = [];

    for(var i = 0; i < product.length; i++){
    keyboard.push([{'text': ( product[i].name ) , 'callback_data': ('product#' + product[i].name)}]);
    }
    const text = 'Теперь выберите продукт '

         bot.sendMessage( user_id, text,
         {
         'reply_markup': JSON.stringify({
         inline_keyboard: keyboard
                                        })
         }
         )
    })
})
}




function insert_product_more (query) {

var str = query.data;
var res = str.split("#");
console.log('insert_product  res[0] is:', res[0]);
console.log('insert_product  res[1] is:', res[1]);

var user_id = query.message.chat.id;
var n_report = 'n_report'+user_id;
var order = 'order'+user_id;

    var mysql  = require('mysql');
    var pool  = mysql.createPool({
    host     : 'localhost',
    user     :  config.user,
    password :  config.db_password,
    database :  config.db_name
    })

pool.getConnection(function(err, connection) {

    var sql2 = '  INSERT INTO ?? (id_report, id_user, product, date_entry ) VALUES ((SELECT id_report FROM ?? AS ord ORDER BY id DESC LIMIT 1), ?, ?, ADDTIME (NOW(), "03:00:00") ) ';

        connection.query( sql2 , [ order, order, user_id, res[1] ], function(err, rows, fields) {
        if (err) throw err;

        var sql3 = ' SELECT size FROM product WHERE name = ? ';

            connection.query( sql3 , res[1], function(err, rows, fields) {
            if (err) throw err;
            var product = JSON.parse(JSON.stringify(rows));
            var keyboard = [];

            for(var i = 0; i < product.length; i++){
            keyboard.push([{'text': ( product[i].size ) , 'callback_data': ('size#' + product[i].size + '#' + res[1] )}]);
            }
            const text = 'Теперь выберите размер '

                 bot.sendMessage( user_id, text,
                 {
                 'reply_markup': JSON.stringify({
                 inline_keyboard: keyboard
                                                })
                 }
                 )
                // Теперь рисунок с видами размеров
                 bot.sendPhoto(user_id, fs.readFileSync(__dirname + '/picture-map.png'), {
                 caption: 'Посмотрите виды размеров'
                 })
            })
        })
})
}



function insert_product (query) {

var str = query.data;
var res = str.split("#");
console.log('insert_product  res[0] is:', res[0]);
console.log('insert_product  res[1] is:', res[1]);

var user_id = query.message.chat.id;
var n_report = 'n_report'+user_id;
var order = 'order'+user_id;

    var mysql  = require('mysql');
    var pool  = mysql.createPool({
    host     : 'localhost',
    user     :  config.user,
    password :  config.db_password,
    database :  config.db_name
    })

pool.getConnection(function(err, connection) {

    var sql = '  INSERT INTO ?? (id_user) VALUES (?)  ';

    connection.query( sql , [ n_report, user_id ], function(err, rows, fields) {
    if (err) throw err;

    var sql2 = '  INSERT INTO ?? (id_report, id_user, product, date_entry ) VALUES ((SELECT id FROM ?? ORDER BY id DESC LIMIT 1), ?, ?, ADDTIME (NOW(), "03:00:00") ) ';

        connection.query( sql2 , [ order, n_report, user_id, res[1] ], function(err, rows, fields) {
        if (err) throw err;

        var sql3 = ' SELECT size FROM product WHERE name = ? ';

            connection.query( sql3 , res[1], function(err, rows, fields) {
            if (err) throw err;
            var product = JSON.parse(JSON.stringify(rows));
            var keyboard = [];

            for(var i = 0; i < product.length; i++){
            keyboard.push([{'text': ( product[i].size ) , 'callback_data': ('size#' + product[i].size + '#' + res[1] )}]);
            }
            const text = 'Теперь выберите размер '

                 bot.sendMessage( user_id, text,
                 {
                 'reply_markup': JSON.stringify({
                 inline_keyboard: keyboard
                                                })
                 }
                 )
                // Теперь рисунок с видами размеров
                 bot.sendPhoto(user_id, fs.readFileSync(__dirname + '/picture-map.png'), {
                 caption: 'Посмотрите виды размеров'
                 })
            })
        })
    })
})
}



function insert_size (query) {

var str = query.data;
var res = str.split("#");
console.log('res is:', res[0]);
console.log('res is:', res[1]);
console.log('res is:', res[2]);

var user_id = query.message.chat.id;
var n_report = 'n_report'+user_id;
var order = 'order'+user_id;

    var mysql  = require('mysql');
    var pool  = mysql.createPool({
    host     : 'localhost',
    user     :  config.user,
    password :  config.db_password,
    database :  config.db_name
    })

pool.getConnection(function(err, connection) {

var sql1 = ' SELECT id FROM ??  ORDER BY id DESC LIMIT 1 ';

    connection.query( sql1 , [ order ], function(err, rows, fields) {
    if (err) throw err;
    var id = JSON.parse(JSON.stringify(rows));

    var sql2 = ' UPDATE ?? SET size = ? WHERE id = ? ';

        connection.query( sql2 , [ order, res[1], id[0].id ], function(err, rows, fields) {
        if (err) throw err;

        var sql3 = ' SELECT number FROM product WHERE name = ? ORDER BY id DESC LIMIT 1 ';

            connection.query( sql3 , res[2], function(err, rows, fields) {
            if (err) throw err;
            var product = JSON.parse(JSON.stringify(rows));
            var keyboard = [];

            for(var i = 0; i < 20; i++){
            var num = product[0].number*i;
            keyboard.push([{'text': ( num ) , 'callback_data': ('number#' + num)}]);
            }
            const text = 'Теперь укажите тираж '

                 bot.sendMessage( user_id, text,
                 {
                 'reply_markup': JSON.stringify({
                 inline_keyboard: keyboard
                                                })
                 }
                 )
            })
        })
    })
})
}



function insert_number (query) {

var str = query.data;
var res = str.split("#");
console.log('res is:', res[0]);
console.log('res is:', res[1]);
console.log('res is:', res[2]);

var user_id = query.message.chat.id;
var n_report = 'n_report'+user_id;
var order = 'order'+user_id;

    var mysql  = require('mysql');
    var pool  = mysql.createPool({
    host     : 'localhost',
    user     :  config.user,
    password :  config.db_password,
    database :  config.db_name
    })

pool.getConnection(function(err, connection) {

var sql1 = ' SELECT id FROM ??  ORDER BY id DESC LIMIT 1 ';

    connection.query( sql1 , [ order ], function(err, rows, fields) {
    if (err) throw err;
    var id = JSON.parse(JSON.stringify(rows));

    var sql11 = ' SELECT price FROM tiraj WHERE n_from < ? AND n_to > ? ';

        connection.query( sql11 , [ res[1], res[1] ], function(err, rows, fields) {
        if (err) throw err;
        var price = JSON.parse(JSON.stringify(rows));
        console.log(' offprice: ', price);

        var sql2 = ' UPDATE ?? SET number = ?, offprice = ? WHERE id = ? ';

            connection.query( sql2 , [ order, res[1], price[0].price, id[0].id ], function(err, rows, fields) {
            if (err) throw err;
            console.log('update offprice: ', rows);

            var sql3 = ' SELECT * FROM ?? WHERE id_report = (SELECT id FROM ?? ORDER BY id DESC LIMIT 1) ';

                connection.query( sql3 , [order, n_report], function(err, rows, fields) {
                if (err) throw err;
                var order = JSON.parse(JSON.stringify(rows));
                var text = 'Вы сделали заявку на ';

                for(var i = 0; i < order.length; i++){
                text += order[i].product + ' размер ' + order[i].size + ' тиражом ' + order[i].number + '\n';
                }

                bot.sendMessage(user_id, text, {
                                             reply_markup: {
                                               inline_keyboard: [
                                                 [{
                                                   text: 'Сделать заказ еще одних вещей',
                                                   callback_data: 'more'
                                                 }],

                                                 [{
                                                   text: 'Отправить заявку',
                                                   callback_data: 'send'
                                                 }]
                                               ]
                                             }
                                       })
                 })
        })
      })
    })
})
}



//function insert_date (query) {
//
//var str = query.data;
//var res = str.split(" ");
//console.log('res is:', res[0]);
//console.log('res is:', res[1]);
//
//var user_id = query.message.chat.id;
//var n_report = 'n_report'+user_id;
//
//var obj = new Date(res[1]);
//console.log('Время конвертировано ', obj);
//
//var day = obj.getDate();
//var month = obj.getMonth();
//var year = obj.getFullYear();
//
//var obj1 = new Date(day + '-' + month + '-' + year);
//console.log('Время конвертировано исправлено', obj1);
//
//
//    var mysql  = require('mysql');
//    var pool  = mysql.createPool({
//    host     : 'localhost',
//    user     :  config.user,
//    password :  config.db_password,
//    database :  config.db_name
//    })
//
//pool.getConnection(function(err, connection) {
//// (id_user, worker_name, date_entry, date_report, res_complex, entrance, floor, task_type, n_done)
//    var sql = '  INSERT INTO ?? (id_user) VALUES (?)  ';
//
//    connection.query( sql , [ n_report, user_id ], function(err, rows, fields) {
//    if (err) throw err;
//
//    var sql2 = '  INSERT INTO report (id_report, id_user, worker_name, date_entry, date_report) VALUES ((SELECT id FROM ?? ORDER BY id DESC LIMIT 1), ?, (SELECT DISTINCT name FROM users WHERE id_user = ?),  ADDTIME (NOW(), "03:00:00"), ? ) ';
//
//        connection.query( sql2 , [ n_report, user_id, user_id, res[1] ], function(err, rows, fields) {
//        if (err) throw err;
//
//        var sql3 = ' SELECT DISTINCT * FROM residential_complex ';
//
//            connection.query( sql3 , function(err, rows, fields) {
//            if (err) throw err;
//            var all_jk = JSON.parse(JSON.stringify(rows));
//            var keyboard = [];
//
//            for(var i = 0; i < all_jk.length; i++){
//            keyboard.push([{'text': ( all_jk[i].name ) , 'callback_data': ('JK ' + all_jk[i].name)}]);
//            }
//            const text = 'Укажите жилой комплекс '
//
//                 bot.sendMessage( user_id, text,
//                 {
//                 'reply_markup': JSON.stringify({
//                 inline_keyboard: keyboard
//                                                })
//                 }
//                 )
//            })
//        })
//    })
//})
//}





// Это функция прибавляет дни
function show_dates (msg) {

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

var date = new Date();
var yesterday = date.addDays(-1);
var minus2 = date.addDays(-2);
var minus3 = date.addDays(-3);
var minus4 = date.addDays(-4);
var minus5 = date.addDays(-5);

// Прибавляем 1 к месяцу
var date_month = date.getMonth()+1;
var yesterday_month = yesterday.getMonth()+1;
var minus2_month = minus2.getMonth()+1;
var minus3_month = minus3.getMonth()+1;
var minus4_month = minus4.getMonth()+1;
var minus5_month = minus5.getMonth()+1;

var newdate = date.getDate() + '-' + date_month + '-' + date.getFullYear();
var newyesterday = yesterday.getDate() + '-' + yesterday_month + '-' + yesterday.getFullYear();
var newminus2 = minus2.getDate() + '-' + minus2_month + '-' + minus2.getFullYear();
var newminus3 = minus3.getDate() + '-' + minus3_month + '-' + minus3.getFullYear();
var newminus4 = minus4.getDate() + '-' + minus4_month + '-' + minus4.getFullYear();
var newminus5 = minus5.getDate() + '-' + minus5_month + '-' + minus5.getFullYear();

var newdateF = date.getFullYear() + '-' + date_month + '-' + date.getDate();
var newyesterdayF = yesterday.getFullYear() + '-' + yesterday_month + '-' + yesterday.getDate();
var newminus2F = minus2.getFullYear() + '-' + minus2_month + '-' + minus2.getDate();
var newminus3F = minus3.getFullYear() + '-' + minus3_month + '-' + minus3.getDate();
var newminus4F = minus4.getFullYear() + '-' + minus4_month + '-' + minus4.getDate();
var newminus5F = minus5.getFullYear() + '-' + minus5_month + '-' + minus5.getDate();


const chatId = msg.chat.id
const text = 'Выберите день, за который вы отчитываетесь'
bot.sendMessage(chatId, text, {
                     reply_markup: {
                       inline_keyboard: [
                         [{
                           text: 'Сегодня  ' + newdate,
                           callback_data: 'date ' + newdateF
                         }],

                         [{
                           text: 'Вчера  ' + newyesterday,
                           callback_data: 'date ' + newyesterdayF
                         }],

                         [{
                           text: 'Позавчера  ' + newminus2,
                           callback_data: 'date ' + newminus2F
                         }],

                         [{
                           text: newminus3,
                           callback_data: 'date ' + newminus3F
                         }],

                         [{
                           text: newminus4,
                           callback_data: 'date ' + newminus4F
                         }]
                       ]
                     }
                })
}



// Это функция показывает продукты
function show_product (msg) {

var user_id = msg.chat.id;

var sql = ' SELECT DISTINCT name FROM products ';

connection.query( sql , function(err, rows, fields) {
if (err) throw err;
var product = JSON.parse(JSON.stringify(rows));
var keyboard = [];

for(var i = 0; i < product.name; i++){
keyboard.push([{'text': ( product[0].name ) , 'callback_data': ('product ' + product[0].name)}]);
}

const text = 'Выберите продукт '

     bot.sendMessage( user_id, text,
     {
     'reply_markup': JSON.stringify({
     inline_keyboard: keyboard
                                    })
     }
     )
})
}




//// Это функция показывает подъезды
//function show_entrance (query) {
//
//var str = query.data;
//var res = str.split(" ");
//console.log('res is:', res[0]);
//console.log('res is:', res[1]);
//
//var user_id = query.message.chat.id;
//
//var sql3 = ' SELECT n_entrance FROM residential_complex WHERE name = ? ';
//
//connection.query( sql3 , [ res[1] ], function(err, rows, fields) {
//if (err) throw err;
//var all_jk = JSON.parse(JSON.stringify(rows));
//var keyboard = [];
//
//for(var i = 0; i < all_jk.n_entrance; i++){
//var entr = i+1;
//keyboard.push([{'text': ( entr ) , 'callback_data': ('entrance ' + entr)}]);
//}
//
//const text = 'Выберите сначала один подъезд '
//
//     bot.sendMessage( user_id, text,
//     {
//     'reply_markup': JSON.stringify({
//     inline_keyboard: keyboard
//                                    })
//     }
//     )
//})
//}



function commands (msg) {

var user_id = msg.chat.id;

const text = '☑️ Чтобы создать новый ЖК наберите команду /nov-jk и название через пробел.\nНапример: /nov-jk ЖК Уют' +
             '\n☑️ Чтобы редактировать ЖК наберите команду /redak-jk и номер редактируемого ЖК и после новое название через пробел.\nНапример:\n/redak-jk 5 ЖК Арнау' +
             '\n☑️ Чтобы редактировать кол-во подъездов в ЖК наберите команду /redak-pod и номер редактируемого ЖК и после новое кол-во подъездов через пробел.\nНапример:\n/redak-pod 5 10' +
             '\n☑️ Чтобы добавить новую работу наберите команду /nov-rab и название работы через пробел.\nНапример:\n/nov-rab Монтаж клапана'

bot.sendMessage(user_id, text)

}




bot.onText(/\/redak-jk (.+)/, (msg, [source, match]) => {

var user_id = msg.chat.id;
var msg_text = msg.text;

var text = msg_text.replace("/redak-jk", "");
var splited = text.split(" ");
var id_jk = splited.splice(1,1);
var edited_text = splited.join(" ");

    var mysql  = require('mysql');
    var pool  = mysql.createPool({
    host     : 'localhost',
    user     :  config.user,
    password :  config.db_password,
    database :  config.db_name
    })

pool.getConnection(function(err, connection) {

    var sql = ' SELECT * FROM residential_complex WHERE id = ? ';

    connection.query( sql , [ id_jk[0] ], function(err, rows, fields) {
    if (err) throw err;
    var prev_jk = JSON.parse(JSON.stringify(rows));
    console.log('previous name of JK ', prev_jk)

    var sql2 = ' UPDATE residential_complex SET name = ? WHERE id = ? ';

        connection.query( sql2 , [ edited_text, id_jk ], function(err, rows, fields) {
        if (err) throw err;
        console.log('new name of JK ', edited_text)

        const text = 'Вы отредактировали ' + prev_jk[0].name + ' на ' + edited_text
        bot.sendMessage(user_id, text)
        })
    })
})
})


bot.onText(/\/redak-pod (.+)/, (msg, [source, match]) => {

var user_id = msg.chat.id;
var msg_text = msg.text;

var text = msg_text.replace("/redak-pod", "");
var splited = text.split(" ");
var id_jk = splited.splice(1,1);
var edited_text = splited.join(" ");

    var mysql  = require('mysql');
    var pool  = mysql.createPool({
    host     : 'localhost',
    user     :  config.user,
    password :  config.db_password,
    database :  config.db_name
    })

pool.getConnection(function(err, connection) {

    var sql = ' SELECT * FROM residential_complex WHERE id = ? ';

    connection.query( sql , [ id_jk[0] ], function(err, rows, fields) {
    if (err) throw err;
    var prev_jk = JSON.parse(JSON.stringify(rows));
    console.log('previous number of podezd of JK ', prev_jk)

    var sql2 = ' UPDATE residential_complex SET n_entrance = ? WHERE id = ? ';

        connection.query( sql2 , [ edited_text, id_jk ], function(err, rows, fields) {
        if (err) throw err;
        console.log('new number of JK entrance', edited_text)

        const text = 'Вы отредактировали кол-во подъездов с ' + prev_jk[0].n_entrance + ' на ' + edited_text
        bot.sendMessage(user_id, text)
        })
    })
})
})



bot.onText(/\/product (.+)/, (msg, [source, match]) => {

var user_id = msg.chat.id;
var msg_text = msg.text;

var text = msg_text.replace("/product", "");
var splited = text.split("#");
var id_jk = splited.splice(1,1);
var edited_text = splited.join(" ");
console.log('edited_text ', edited_text)
console.log('SPLICE  ', id_jk)
console.log('NNtext ', splited)

    var mysql  = require('mysql');
    var pool  = mysql.createPool({
    host     : 'localhost',
    user     :  config.user,
    password :  config.db_password,
    database :  config.db_name
    })

pool.getConnection(function(err, connection) {

    var sql = ' INSERT INTO product (name, size, number, print_exp, print_profit, rizprint_exp, rizprint_profit, offprint_exp, offprint_profit, digprint_exp, digprint_profit, paper_exp, paper_profit, cut_exp, cut_profit ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';

    connection.query( sql , [ splited[0], id_jk, splited[1], splited[2], splited[3], splited[4], splited[5], splited[6], splited[7], splited[8], splited[9], splited[10], splited[11], splited[12], splited[13], splited[14], splited[15] ], function(err, rows, fields) {
    if (err) throw err;
//    const text = 'Вы ввели в БД новый ЖК '  + edited_text + ' с ' + id_jk[0] + ' подъездами'
//    bot.sendMessage(user_id, text)
//
//
//    var sql2 = ' SELECT * FROM residential_complex ';
//
//        connection.query( sql2 , function(err, rows, fields) {
//        if (err) throw err;
//        var all_jk = JSON.parse(JSON.stringify(rows));
//        console.log('previous number of podezd of JK ', all_jk)
//        var text = 'Список ЖК\n';
//
//        for(var i = 0; i < all_jk.length; i++){
//        text += all_jk[i].id  + ' ' + all_jk[i].name + ' кол-во подъездов ' + all_jk[i].n_entrance + '\n';
//        }
//
//        console.log('ptext ', text)
//        bot.sendMessage(user_id, text)
//        })
    })
})
})



bot.onText(/\/tiraj (.+)/, (msg, [source, match]) => {

var user_id = msg.chat.id;
var msg_text = msg.text;

var text = msg_text.replace("/tiraj", "");
var splited = text.split("#");

console.log('NNtext ', splited)

    var mysql  = require('mysql');
    var pool  = mysql.createPool({
    host     : 'localhost',
    user     :  config.user,
    password :  config.db_password,
    database :  config.db_name
    })

pool.getConnection(function(err, connection) {

    var sql = ' INSERT INTO tiraj (price, n_from, n_to) VALUES (?,?,?) ';

    connection.query( sql , [ splited[0], splited[1], splited[2] ], function(err, rows, fields) {
    if (err) throw err;

        var sql1 = ' SELECT * FROM tiraj ';

        connection.query( sql1 , function(err, rows, fields) {
        if (err) throw err;
        var tiraj = JSON.parse(JSON.stringify(rows));
        var text = 'Цены по тиражам: \n';
        for(var i = 0; i < tiraj.length; i++){
        text += tiraj[i].n_from  + ' - ' + tiraj[i].n_to + ' цена ' + tiraj[i].price + ' тг' + '\n';
        }
        bot.sendMessage(user_id, text)
        })
    })
})
})



bot.onText(/\/nov-rab (.+)/, (msg, [source, match]) => {

var user_id = msg.chat.id;
var msg_text = msg.text;

var text = msg_text.replace("/nov-rab", "");
var splited = text.split(" ");
var id_jk = splited.splice(1,1);
var edited_text = splited.join(" ");
console.log('edited_text ', text)

    var mysql  = require('mysql');
    var pool  = mysql.createPool({
    host     : 'localhost',
    user     :  config.user,
    password :  config.db_password,
    database :  config.db_name
    })

pool.getConnection(function(err, connection) {

    var sql = ' INSERT INTO task_types (name) VALUES (?)';

    connection.query( sql , [ text ], function(err, rows, fields) {
    if (err) throw err;
    const text2 = 'Вы ввели в БД новое задание '  + text
    bot.sendMessage(user_id, text2)


//    var sql2 = ' SELECT * FROM residential_complex ';
//
//        connection.query( sql2 , function(err, rows, fields) {
//        if (err) throw err;
//        var all_jk = JSON.parse(JSON.stringify(rows));
//        console.log('previous number of podezd of JK ', all_jk)
//        var text = 'Список ЖК\n';
//
//        for(var i = 0; i < all_jk.length; i++){
//        text += all_jk[i].id  + ' ' + all_jk[i].name + ' кол-во подъездов ' + all_jk[i].n_entrance + '\n';
//        }
//
//        console.log('ptext ', text)
//        bot.sendMessage(user_id, text)
//        })
    })
})
})


//              var street = JSON.parse(JSON.stringify(rows));
//               var keyboard = [];
//
//               for(var i = 0; i < street.length; i++){
//               keyboard.push([{'text': ( street[i].interception ) , 'callback_data': ('22 ' + street[i].id_interception)}]);
//               }