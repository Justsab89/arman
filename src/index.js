const TelegramBot = require('node-telegram-bot-api')
const config = require('./config')
const helper = require('./helper')
//const create_table = require('./create_table')
//const select = require('./select')
//const date_format = require('date_format')
const fs = require('fs')
//const TaskTimer = require('tasktimer')
//const database = require('./database')
const admin = 110638690

//SABYR  336243307
//ARMAN  110638690


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
//  var str = query.data;
//  var res = str.split("#");
//  console.log('res is:', res[0]);

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

                        connection.query(' CREATE TABLE ?? (id INT(100) NOT NULL AUTO_INCREMENT, id_report INT(11), id_user INT(11), date_entry DATETIME, product VARCHAR(100), size VARCHAR(100), ina3 INT(11), number INT(11), offprice INT(11), paper_type VARCHAR(100), paper_exp INT(11), paper_side VARCHAR(10), cut_exp INT(11), PRIMARY KEY(id)) ',
                        [order] ,function(err, rows, fields) {
                        if (err) throw err;
                        })

                    })
                })
            })
        }
// В ином случае, если только это не запрос от админа, то вводим имя юзера в БД либо обрабатываем другие запросы
        else {
            if (user[0].id_user == admin) {
                      if (msg.text === config.keyboard.kb2.one) {show_products(msg)}
                      else if (msg.text === config.keyboard.kb2.two) {show_commands(msg)}
                      else if (msg.text === config.keyboard.kb2.three) {show_users(msg)}
                      else if (msg.text === config.keyboard.kb2.four) {show_managers(msg)}
                      else if (msg.text === config.keyboard.kb2.five) {del_products(msg)}
                      else if (msg.text === config.keyboard.kb2.six) {show_tiraj(msg)}
                      else if (msg.text === config.keyboard.kb2.seven) {show_cutting(msg)}
                      else if (msg.text === config.keyboard.kb2.eight) {show_paper(msg)}

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
                                         }],

                                         [{
                                           text: config.keyboard.kb2.five
                                         }],

                                         [{
                                           text: config.keyboard.kb2.six
                                         }]
                                       ],
                                       resize_keyboard: true
                                     }
                               })
            }
            else {

                      if (msg.text === config.keyboard.kb1.one) {show_products(msg)}

                      bot.sendMessage(user_id, 'nm', {
                                     reply_markup: {
                                       keyboard: [
                                         [{
                                           text: config.keyboard.kb1.one
                                         }],

                                         [{
                                           text: config.keyboard.kb1.two
                                         }]
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

  var user_id = query.message.chat.id;
  var str = query.data;
  var res = str.split("#");
  console.log('res is:', res[0]);
//  var res2 = str.split("#");


  if (res[0] =='product') { insert_product(query); bot.deleteMessage(query.message.chat.id, query.message.message_id) }
  else if (res[0] =='size')  { insert_size(query); bot.deleteMessage(query.message.chat.id, query.message.message_id) }
  else if (res[0] =='size-other')  { bot.deleteMessage(query.message.chat.id, query.message.message_id); bot.sendMessage(user_id, 'Укажите размер набрав /razmer и длину и ширину в сантиметрах через решетку. Например вот так /razmer 10#12') }
  else if (res[0] =='product_more') { insert_product_more(query); bot.deleteMessage(query.message.chat.id, query.message.message_id) }
  else if (res[0] =='number')  { insert_number(query); bot.deleteMessage(query.message.chat.id, query.message.message_id) }
  else if (res[0] =='paper')  { insert_paper(query); bot.deleteMessage(query.message.chat.id, query.message.message_id) }
  else if (res[0] =='side')  { insert_side(query); bot.deleteMessage(query.message.chat.id, query.message.message_id) }
  else if (res[0] =='more')  { show_products_query(query); bot.deleteMessage(query.message.chat.id, query.message.message_id) }
  else if (res[0] =='send')  { ask_tel(query); bot.deleteMessage(query.message.chat.id, query.message.message_id) }
  else if (res[0] =='manager')  { appoint_manager(query); bot.deleteMessage(query.message.chat.id, query.message.message_id) }
  else if (res[0] =='del_manager')  { delete_manager(query); bot.deleteMessage(query.message.chat.id, query.message.message_id) }
  else if (res[0] =='del_product')  { delete_product(query); bot.deleteMessage(query.message.chat.id, query.message.message_id) }
  else if (res[0] =='del_tiraj')  { delete_tiraj(query); bot.deleteMessage(query.message.chat.id, query.message.message_id) }
  else if (res[0] =='del_cutting')  { delete_cutting(query); bot.deleteMessage(query.message.chat.id, query.message.message_id) }
  else if (res[0] =='del_paper')  { delete_paper(query); bot.deleteMessage(query.message.chat.id, query.message.message_id) }
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



function delete_paper(query) {

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

    var sql = 'DELETE FROM paper WHERE id = ?';

    connection.query( sql , [res[1]], function(err, rows, fields) {
    if (err) throw err;
    var deleted = JSON.parse(JSON.stringify(rows));
    console.log('deleted ', deleted);
    })
})
}



function delete_cutting(query) {

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

    var sql = 'DELETE FROM cutting WHERE id = ?';

    connection.query( sql , [res[1]], function(err, rows, fields) {
    if (err) throw err;
    var deleted = JSON.parse(JSON.stringify(rows));
    console.log('deleted ', deleted);
    })
})
}



function delete_tiraj(query) {

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

    var sql = 'DELETE FROM tiraj WHERE id = ?';

    connection.query( sql , [res[1]], function(err, rows, fields) {
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



function show_tiraj(msg) {

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

    var sql = ' SELECT * FROM tiraj ';

    connection.query( sql , function(err, rows, fields) {
    if (err) throw err;
    var tiraj = JSON.parse(JSON.stringify(rows));
    var keyboard = [];
    console.log('products ', tiraj);

        for(var i = 0; i < tiraj.length; i++){
//        keyboard.push([{'text': ('Удалить строку') , 'callback_data': ('del_tiraj#' + tiraj[i].id)}]);


         var text = 'Тираж от ' + tiraj[i].n_from+ ' до ' + tiraj[i].n_to + ' цена - ' + tiraj[i].price ;

         bot.sendMessage(user_id, text, {
                                     reply_markup: {
                                       inline_keyboard: [
                                         [{
                                           text: 'Удалить строку',
                                           callback_data: 'del_tiraj#' + tiraj[i].id
                                         }]
                                       ],
                                       resize_keyboard: true
                                     }
                               })
        }
    })
})
}



function show_cutting(msg) {

var user_id = msg.chat.id;

    var mysql  = require('mysql');
    var pool  = mysql.createPool({
    host     : 'localhost',
    user     :  config.user,
    password :  config.db_password,
    database :  config.db_name
    })

pool.getConnection(function(err, connection) {

    var sql = ' SELECT * FROM cutting ';

    connection.query( sql , function(err, rows, fields) {
    if (err) throw err;
    var cutting = JSON.parse(JSON.stringify(rows));
    var keyboard = [];
    console.log('cutting ', cutting);

        for(var i = 0; i < cutting.length; i++){

         var text = 'Кол-во от ' + cutting[i].n_from+ ' до ' + cutting[i].n_to + ' цена на резку - ' + cutting[i].price ;

         bot.sendMessage(user_id, text, {
                                     reply_markup: {
                                       inline_keyboard: [
                                         [{
                                           text: 'Удалить строку',
                                           callback_data: 'del_cutting#' + cutting[i].id
                                         }]
                                       ],
                                       resize_keyboard: true
                                     }
                               })
        }
    })
})
}



function show_paper(msg) {

var user_id = msg.chat.id;

    var mysql  = require('mysql');
    var pool  = mysql.createPool({
    host     : 'localhost',
    user     :  config.user,
    password :  config.db_password,
    database :  config.db_name
    })

pool.getConnection(function(err, connection) {

    var sql = ' SELECT * FROM paper ';

    connection.query( sql , function(err, rows, fields) {
    if (err) throw err;
    var paper = JSON.parse(JSON.stringify(rows));
    var keyboard = [];
    console.log('paper ', paper);

        for(var i = 0; i < paper.length; i++){

         var text = 'Толщина бумаги ' + paper[i].thickness+ ' гр. стоит ' + paper[i].price ;

         bot.sendMessage(user_id, text, {
                                     reply_markup: {
                                       inline_keyboard: [
                                         [{
                                           text: 'Удалить строку',
                                           callback_data: 'del_paper#' + paper[i].id
                                         }]
                                       ],
                                       resize_keyboard: true
                                     }
                               })
        }
    })
})
}



function del_products(msg) {

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
    test.push([ order[i].id_report, order[i].id_user, order[i].date_entry, order[i].product, order[i].size, order[i].number, order[i].offprice, order[i].paper_type, order[i].paper_exp, order[i].paper_side]);
    }

        var sql3 = ' INSERT INTO zakaz (id_report, id_user, date_entry, product, size, number, offprice, paper_type, paper_exp, paper_side) VALUES ? ';

        connection.query( sql3 , [test], function(err, rows, fields) {
        if (err) throw err;
            var text = 'Вы сделали заявку на ';

            for(var i = 0; i < order.length; i++){
            text += order[i].product + ' размер ' + order[i].size + ' тиражом ' + order[i].number + '\n';
            }

            var sql31 = ' SELECT size FROM product WHERE size = "non" AND name = (SELECT name FROM ?? WHERE size LIKE "%*%" AND id_report = (SELECT id_report FROM ?? ORDER BY id DESC LIMIT 1) ORDER BY id DESC LIMIT 1 ) ';

            connection.query( sql31 , [order_table, order_table], function(err, rows, fields) {
            if (err) throw err;
            var non = JSON.parse(JSON.stringify(rows));
            if (non.length == 0) {

            var sql4 = ' SELECT product.name, product.size, product.number AS ina3, product.print_exp, product.print_profit, product.cut_exp, product.cut_profit, product.expense, product.profit, ' +
                       ' product.offprint_exp, product.offprint_profit, product.digprint_exp, product.digprint_profit, ??.number AS number, ??.offprice AS offprice, ??.paper_exp AS paper_exp, ??.paper_type, ??.paper_side ' +
                       ' FROM product JOIN ?? WHERE product.name = ??.product AND product.size = ??.size AND ??.size NOT LIKE "%*%" AND ??.id_report = (SELECT id_report FROM ?? ORDER BY id DESC LIMIT 1) ';

            connection.query( sql4 , [order_table, order_table, order_table, order_table, order_table, order_table, order_table, order_table, order_table, order_table, order_table], function(err, rows, fields) {
            if (err) throw err;
            var counting = JSON.parse(JSON.stringify(rows));
            console.log('joining result ', counting);

             for(var i = 0; i < counting.length; i++){

                          if (counting[i].number % counting[i].ina3 !== 0) {
                          var kolvoa3 = counting[i].number % counting[i].ina3;
                           var n_paper = (counting[i].number - kolvoa3)/counting[i].ina3  + 1;
             //              var print_exp = counting[i].print_exp*n_paper;
                           var print_exp = parseInt(counting[i].print_exp*n_paper);

             //              var print_profit = counting[i].print_profit*n_paper;
                           var print_profit = parseInt(counting[i].print_profit*n_paper);

             //              var offprint_exp = counting[i].offprice*n_paper/2;
                           var offprint_exp = parseInt(counting[i].offprice*n_paper/2);

             //              var offprint_profit = counting[i].offprice*n_paper/2;
                           var offprint_profit = parseInt(counting[i].offprice*n_paper/2);

             //              var rizprint_exp = counting[i].rizprint_exp*n_paper;
                           var rizprint_exp = parseInt(counting[i].rizprint_exp*n_paper);

             //              var rizprint_profit = counting[i].rizprint_profit*n_paper;
                           var rizprint_profit = parseInt(counting[i].rizprint_profit*n_paper);

             //              var digprint_exp = counting[i].digprint_exp*n_paper;
                           var digprint_exp = parseInt(counting[i].digprint_exp*n_paper);

             //              var digprint_profit = counting[i].digprint_profit*n_paper;
                           var digprint_profit = parseInt(counting[i].digprint_profit*n_paper);

             //              var print = counting[i].print_exp*n_paper + counting[i].print_profit*n_paper;
                           var print = parseInt(counting[i].print_exp*n_paper + counting[i].print_profit*n_paper);

             //              var offprint = counting[i].offprint_exp*n_paper + counting[i].offprint_profit*n_paper;
                           var offprint = parseInt(counting[i].offprint_exp*n_paper + counting[i].offprint_profit*n_paper);

             //              var rizprint = counting[i].rizprint_exp*n_paper + counting[i].rizprint_profit*n_paper;
                           var rizprint = parseInt(counting[i].rizprint_exp*n_paper + counting[i].rizprint_profit*n_paper);

             //              var digprint = counting[i].digprint_exp*n_paper + counting[i].digprint_profit*n_paper;
                           var digprint = parseInt(counting[i].digprint_exp*n_paper + counting[i].digprint_profit*n_paper);

             //              var paper_exp = counting[i].paper_exp*n_paper;
                           var paper_exp = parseInt(counting[i].paper_exp*n_paper);

             //              var cut_exp = counting[i].cut_exp*n_paper;
                           var cut_exp = parseInt(counting[i].cut_exp*n_paper);

             //              var cut_profit = counting[i].cut_profit*n_paper;
                           var cut_profit = parseInt(counting[i].cut_profit*n_paper);

             //              var cut = counting[i].cut_exp*n_paper +counting[i].cut_profit*n_paper;
                           var cut = parseInt(counting[i].cut_exp*n_paper +counting[i].cut_profit*n_paper);

                           var exp = print_exp + paper_exp + cut_exp;
                           var profit = print_profit + cut_profit;
                           var total = profit + exp;
                           var offexp = offprint_exp + paper_exp + cut_exp;
                           var offprofit = offprint_profit + cut_profit;
                           var offtotal = offexp + offprofit;
                           var digexp = digprint_exp + paper_exp + cut_exp;
             //              var digexp2 = parseInt(digexp);

                           var digprofit = digprint_profit + cut_profit;
             //              var digprofit2 = parseInt(digprofit);

                           var digtotal = digexp + digprofit;
             //              var digtotal2 = parseInt(digtotal);

                           var rizexp = rizprint_exp + paper_exp + cut_exp;
                           var rizprofit = rizprint_profit + cut_profit;
                           var riztotal = rizexp + rizprofit;

                           var sum = print_exp+print_profit+paper_exp+cut_exp+cut_profit;

                           var paper_type = counting[i].paper_type;
                           var paper_side = counting[i].paper_side;
                             if(counting[i].paper_side === 'one') {var side = 'Односторонняя печать';}
                             else if(counting[i].paper_side === 'two') {var side = 'Двухсторонняя печать';}

                             var str = counting[i].size;
                             var res = str.split("*");

                             if(res.length == 2) {var size_type = 'с нестандартным размером' + counting[i].size ;}
                             else {var size_type = counting[i].size ;}
                          }

                          else {
                           var n_paper = counting[i].number/counting[i].ina3;
             //              var print_exp = counting[i].print_exp*n_paper;
                           var print_exp = parseInt(counting[i].print_exp*n_paper);

             //              var print_profit = counting[i].print_profit*n_paper;
                           var print_profit = parseInt(counting[i].print_profit*n_paper);

             //              var offprint_exp = counting[i].offprice*n_paper/2;
                           var offprint_exp = parseInt(counting[i].offprice*n_paper/2);

             //              var offprint_profit = counting[i].offprice*n_paper/2;
                           var offprint_profit = parseInt(counting[i].offprice*n_paper/2);

             //              var rizprint_exp = counting[i].rizprint_exp*n_paper;
                           var rizprint_exp = parseInt(counting[i].rizprint_exp*n_paper);

             //              var rizprint_profit = counting[i].rizprint_profit*n_paper;
                           var rizprint_profit = parseInt(counting[i].rizprint_profit*n_paper);

             //              var digprint_exp = counting[i].digprint_exp*n_paper;
                           var digprint_exp = parseInt(counting[i].digprint_exp*n_paper);

             //              var digprint_profit = counting[i].digprint_profit*n_paper;
                           var digprint_profit = parseInt(counting[i].digprint_profit*n_paper);

             //              var print = counting[i].print_exp*n_paper + counting[i].print_profit*n_paper;
                           var print = parseInt(counting[i].print_exp*n_paper + counting[i].print_profit*n_paper);

             //              var offprint = counting[i].offprint_exp*n_paper + counting[i].offprint_profit*n_paper;
                           var offprint = parseInt(counting[i].offprint_exp*n_paper + counting[i].offprint_profit*n_paper);

             //              var rizprint = counting[i].rizprint_exp*n_paper + counting[i].rizprint_profit*n_paper;
                           var rizprint = parseInt(counting[i].rizprint_exp*n_paper + counting[i].rizprint_profit*n_paper);

             //              var digprint = counting[i].digprint_exp*n_paper + counting[i].digprint_profit*n_paper;
                           var digprint = parseInt(counting[i].digprint_exp*n_paper + counting[i].digprint_profit*n_paper);

             //              var paper_exp = counting[i].paper_exp*n_paper;
                           var paper_exp = parseInt(counting[i].paper_exp*n_paper);

             //              var cut_exp = counting[i].cut_exp*n_paper;
                           var cut_exp = parseInt(counting[i].cut_exp*n_paper);

             //              var cut_profit = counting[i].cut_profit*n_paper;
                           var cut_profit = parseInt(counting[i].cut_profit*n_paper);

             //              var cut = counting[i].cut_exp*n_paper +counting[i].cut_profit*n_paper;
                           var cut = parseInt(counting[i].cut_exp*n_paper +counting[i].cut_profit*n_paper);

                           var exp = print_exp + paper_exp + cut_exp;
                           var profit = print_profit + cut_profit;
                           var total = profit + exp;
                           var offexp = offprint_exp + paper_exp + cut_exp;
                           var offprofit = offprint_profit + cut_profit;
                           var offtotal = offexp + offprofit;
                           var digexp = digprint_exp + paper_exp + cut_exp;
             //              var digexp2 = parseInt(digexp);

                           var digprofit = digprint_profit + cut_profit;
             //              var digprofit2 = parseInt(digprofit);

                           var digtotal = digexp + digprofit;
             //              var digtotal2 = parseInt(digtotal);

                           var rizexp = rizprint_exp + paper_exp + cut_exp;
                           var rizprofit = rizprint_profit + cut_profit;
                           var riztotal = rizexp + rizprofit;

                           var sum = print_exp+print_profit+paper_exp+cut_exp+cut_profit;

                           var paper_type = counting[i].paper_type;
                           var paper_side = counting[i].paper_side;

                             if(counting[i].paper_side === 'one') {var side = 'Односторонняя печать';}
                             else if(counting[i].paper_side === 'two') {var side = 'Двухсторонняя печать';}

                             var str = counting[i].size;
                             var res = str.split("*");

                             if(res.length == 2) {var size_type = 'с нестандартным размером' + counting[i].size ;}
                             else {var size_type = counting[i].size ;}
                          }


                            text += ' Имя: ' + nomer[0].username + ' номер: ' + nomer[0].tel + '\n' +
                                    '🔹 ' + counting[i].name + ' ' +  size_type + ' на сумму ' + sum + '\n' +
                                    ' кол-во А3 - ' + n_paper + '\n' +
                                    '(себестоимость и наценка)' + '\n' +
                                    side + '\n' +
                                    'Струйная печать' + '\n' +
                                    ' ЦП ' + print_exp + ' + ' + print_profit + ' = ' + print + '\n' +
                                    ' ЦБ ' + paper_exp + ' = ' + paper_exp + '\n' +
                                    ' ЦР ' + cut_exp + ' + ' + cut_profit + ' = ' + cut + '\n' +
                                    ' Всего ' + exp + ' + ' + profit + ' = ' + total + '\n' +
                                    'Ризограф печать' + '\n' +
                                    ' ЦП ' + rizprint_exp + ' + ' + rizprint_profit + ' = ' + rizprint + '\n' +
                                    ' ЦБ ' + paper_exp + ' = ' + paper_exp + '\n' +
                                    ' ЦР ' + cut_exp + ' + ' + cut_profit + ' = ' + cut + '\n' +
                                    ' Всего ' + rizexp + ' + ' + rizprofit + ' = ' + riztotal + '\n' +
                                    'Офсетная печать' + '\n' +
                                    ' ЦП ' + offprint_exp + ' + ' + offprint_profit + ' = ' + offprint + '\n' +
                                    ' ЦБ ' + paper_exp + ' = ' + paper_exp + '\n' +
                                    ' ЦР ' + cut_exp + ' + ' + cut_profit + ' = ' + cut + '\n' +
                                    ' Всего ' + offexp + ' + ' + offprofit + ' = ' + offtotal + '\n' +
                                    'Цифровая печать' + '\n' +
                                    ' ЦП ' + digprint_exp + ' + ' + digprint_profit + ' = ' + digprint + '\n' +
                                    ' ЦБ ' + paper_exp + ' = ' + paper_exp + '\n' +
                                    ' ЦР ' + cut_exp + ' + ' + cut_profit + ' = ' + cut + '\n' +
                                    ' Всего ' + digexp + ' + ' + digprofit + ' = ' + digtotal + '\n' ;

                          }
            console.log('ATEXXXT ',text)

             var sql5 = ' SELECT product.name AS name, product.number AS ina3, product.print_exp AS print_exp, product.print_profit AS print_profit, ??.cut_exp AS cut_exp, product.expense AS expense, product.profit AS profit, ' +
                        ' product.offprint_exp AS offprint_exp, product.offprint_profit AS offprint_profit, product.digprint_exp AS digprint_exp, product.digprint_profit AS digprint_profit, ??.size AS size, ??.number AS number, ??.offprice AS offprice, ??.paper_exp AS paper_exp, ??.paper_type AS paper_type, ??.paper_side AS paper_side ' +
                        ' FROM product JOIN ?? WHERE product.name = ??.product AND ??.size LIKE "%*%" AND product.size = "non" AND ??.id_report = (SELECT id_report FROM ?? ORDER BY id DESC LIMIT 1) ';

             connection.query( sql5 , [order_table, order_table, order_table, order_table, order_table, order_table, order_table, order_table, order_table, order_table, order_table, order_table ], function(err, rows, fields) {
             if (err) throw err;
             var counting = JSON.parse(JSON.stringify(rows));
             console.log('НЕСТАНДАРт ', counting);



              for(var i = 0; i < counting.length; i++){

                           if (counting[i].number % counting[i].ina3 !== 0) {
                           var kolvoa3 = counting[i].number % counting[i].ina3;
                          var n_paper = (counting[i].number - kolvoa3)/counting[i].ina3  + 1;
              //              var print_exp = counting[i].print_exp*n_paper;
                            var print_exp = parseInt(counting[i].print_exp*n_paper);

              //              var print_profit = counting[i].print_profit*n_paper;
                            var print_profit = parseInt(counting[i].print_profit*n_paper);

              //              var offprint_exp = counting[i].offprice*n_paper/2;
                            var offprint_exp = parseInt(counting[i].offprice*n_paper/2);

              //              var offprint_profit = counting[i].offprice*n_paper/2;
                            var offprint_profit = parseInt(counting[i].offprice*n_paper/2);

              //              var rizprint_exp = counting[i].rizprint_exp*n_paper;
                            var rizprint_exp = parseInt(counting[i].rizprint_exp*n_paper);

              //              var rizprint_profit = counting[i].rizprint_profit*n_paper;
                            var rizprint_profit = parseInt(counting[i].rizprint_profit*n_paper);

              //              var digprint_exp = counting[i].digprint_exp*n_paper;
                            var digprint_exp = parseInt(counting[i].digprint_exp*n_paper);

              //              var digprint_profit = counting[i].digprint_profit*n_paper;
                            var digprint_profit = parseInt(counting[i].digprint_profit*n_paper);

              //              var print = counting[i].print_exp*n_paper + counting[i].print_profit*n_paper;
                            var print = parseInt(counting[i].print_exp*n_paper + counting[i].print_profit*n_paper);

              //              var offprint = counting[i].offprint_exp*n_paper + counting[i].offprint_profit*n_paper;
                            var offprint = parseInt(counting[i].offprint_exp*n_paper + counting[i].offprint_profit*n_paper);

              //              var rizprint = counting[i].rizprint_exp*n_paper + counting[i].rizprint_profit*n_paper;
                            var rizprint = parseInt(counting[i].rizprint_exp*n_paper + counting[i].rizprint_profit*n_paper);

              //              var digprint = counting[i].digprint_exp*n_paper + counting[i].digprint_profit*n_paper;
                            var digprint = parseInt(counting[i].digprint_exp*n_paper + counting[i].digprint_profit*n_paper);

              //              var paper_exp = counting[i].paper_exp*n_paper;
                            var paper_exp = parseInt(counting[i].paper_exp*n_paper);

              //              var cut_exp = counting[i].cut_exp*n_paper;
                            var cut_exp = parseInt(counting[i].cut_exp*n_paper);

              //              var cut = counting[i].cut_exp*n_paper +counting[i].cut_profit*n_paper;
                            var cut = parseInt(counting[i].cut_exp*n_paper);

                            var exp = print_exp + paper_exp + cut_exp;
                            var profit = print_profit ;
                            var total = profit + exp;
                            var offexp = offprint_exp + paper_exp + cut_exp;
                            var offprofit = offprint_profit ;
                            var offtotal = offexp + offprofit;
                            var digexp = digprint_exp + paper_exp + cut_exp;
              //              var digexp2 = parseInt(digexp);

                            var digprofit = digprint_profit;
              //              var digprofit2 = parseInt(digprofit);

                            var digtotal = digexp + digprofit;
              //              var digtotal2 = parseInt(digtotal);

                            var rizexp = rizprint_exp + paper_exp + cut_exp;
                            var rizprofit = rizprint_profit ;
                            var riztotal = rizexp + rizprofit;

                            var sum = print_exp+print_profit+paper_exp+cut_exp;

                            var paper_type = counting[i].paper_type;
                            var paper_side = counting[i].paper_side;
                              if(counting[i].paper_side === 'one') {var side = 'Односторонняя печать';}
                              else if(counting[i].paper_side === 'two') {var side = 'Двухсторонняя печать';}

                              var str = counting[i].size;
                              var res = str.split("*");

                              if(res.length == 2) {var size_type = 'с нестандартным размером' + counting[i].size ;}
                              else {var size_type = counting[i].size ;}
                           }

                           else {
                            var n_paper = counting[i].number/counting[i].ina3;
              //              var print_exp = counting[i].print_exp*n_paper;
                            var print_exp = parseInt(counting[i].print_exp*n_paper);

              //              var print_profit = counting[i].print_profit*n_paper;
                            var print_profit = parseInt(counting[i].print_profit*n_paper);

              //              var offprint_exp = counting[i].offprice*n_paper/2;
                            var offprint_exp = parseInt(counting[i].offprice*n_paper/2);

              //              var offprint_profit = counting[i].offprice*n_paper/2;
                            var offprint_profit = parseInt(counting[i].offprice*n_paper/2);

              //              var rizprint_exp = counting[i].rizprint_exp*n_paper;
                            var rizprint_exp = parseInt(counting[i].rizprint_exp*n_paper);

              //              var rizprint_profit = counting[i].rizprint_profit*n_paper;
                            var rizprint_profit = parseInt(counting[i].rizprint_profit*n_paper);

              //              var digprint_exp = counting[i].digprint_exp*n_paper;
                            var digprint_exp = parseInt(counting[i].digprint_exp*n_paper);

              //              var digprint_profit = counting[i].digprint_profit*n_paper;
                            var digprint_profit = parseInt(counting[i].digprint_profit*n_paper);

              //              var print = counting[i].print_exp*n_paper + counting[i].print_profit*n_paper;
                            var print = parseInt(counting[i].print_exp*n_paper + counting[i].print_profit*n_paper);

              //              var offprint = counting[i].offprint_exp*n_paper + counting[i].offprint_profit*n_paper;
                            var offprint = parseInt(counting[i].offprint_exp*n_paper + counting[i].offprint_profit*n_paper);

              //              var rizprint = counting[i].rizprint_exp*n_paper + counting[i].rizprint_profit*n_paper;
                            var rizprint = parseInt(counting[i].rizprint_exp*n_paper + counting[i].rizprint_profit*n_paper);

              //              var digprint = counting[i].digprint_exp*n_paper + counting[i].digprint_profit*n_paper;
                            var digprint = parseInt(counting[i].digprint_exp*n_paper + counting[i].digprint_profit*n_paper);

              //              var paper_exp = counting[i].paper_exp*n_paper;
                            var paper_exp = parseInt(counting[i].paper_exp*n_paper);

              //              var cut_exp = counting[i].cut_exp*n_paper;
                            var cut_exp = parseInt(counting[i].cut_exp*n_paper);

              //              var cut = counting[i].cut_exp*n_paper +counting[i].cut_profit*n_paper;
                            var cut = parseInt(counting[i].cut_exp*n_paper);

                            var exp = print_exp + paper_exp + cut_exp;
                            var profit = print_profit ;
                            var total = profit + exp;
                            var offexp = offprint_exp + paper_exp + cut_exp;
                            var offprofit = offprint_profit ;
                            var offtotal = offexp + offprofit;
                            var digexp = digprint_exp + paper_exp + cut_exp;
              //              var digexp2 = parseInt(digexp);

                            var digprofit = digprint_profit;
              //              var digprofit2 = parseInt(digprofit);

                            var digtotal = digexp + digprofit;
              //              var digtotal2 = parseInt(digtotal);

                            var rizexp = rizprint_exp + paper_exp + cut_exp;
                            var rizprofit = rizprint_profit;
                            var riztotal = rizexp + rizprofit;

                            var sum = print_exp+print_profit+paper_exp+cut_exp;

                            var paper_type = counting[i].paper_type;
                            var paper_side = counting[i].paper_side;

                              if(counting[i].paper_side === 'one') {var side = 'Односторонняя печать';}
                              else if(counting[i].paper_side === 'two') {var side = 'Двухсторонняя печать';}

                              var str = counting[i].size;
                              var res = str.split("*");

                              if(res.length == 2) {var size_type = 'с нестандартным размером ' + counting[i].size ;}
                              else {var size_type = counting[i].size ;}
                           }


                             text += ' Имя: ' + nomer[0].username + ' номер: ' + nomer[0].tel + '\n' +
                                     '🔹 ' + counting[i].name + ' ' +  size_type + ' на сумму ' + sum + '\n' +
                                     ' кол-во А3 - ' + n_paper + '\n' +
                                     '(себестоимость и наценка)' + '\n' +
                                     side + '\n' +
                                     'Струйная печать' + '\n' +
                                     ' ЦП ' + print_exp + ' + ' + print_profit + ' = ' + print + '\n' +
                                     ' ЦБ ' + paper_exp + ' = ' + paper_exp + '\n' +
                                     ' ЦР ' + cut_exp + ' = ' + cut + '\n' +
                                     ' Всего ' + exp + ' + ' + profit + ' = ' + total + '\n' +
                                     'Ризограф печать' + '\n' +
                                     ' ЦП ' + rizprint_exp + ' + ' + rizprint_profit + ' = ' + rizprint + '\n' +
                                     ' ЦБ ' + paper_exp + ' = ' + paper_exp + '\n' +
                                     ' ЦР ' + cut_exp + ' = ' + cut + '\n' +
                                     ' Всего ' + rizexp + ' + ' + rizprofit + ' = ' + riztotal + '\n' +
                                     'Офсетная печать' + '\n' +
                                     ' ЦП ' + offprint_exp + ' + ' + offprint_profit + ' = ' + offprint + '\n' +
                                     ' ЦБ ' + paper_exp + ' = ' + paper_exp + '\n' +
                                     ' ЦР ' + cut_exp + ' = ' + cut + '\n' +
                                     ' Всего ' + offexp + ' + ' + offprofit + ' = ' + offtotal + '\n' +
                                     'Цифровая печать' + '\n' +
                                     ' ЦП ' + digprint_exp + ' + ' + digprint_profit + ' = ' + digprint + '\n' +
                                     ' ЦБ ' + paper_exp + ' = ' + paper_exp + '\n' +
                                     ' ЦР ' + cut_exp + ' = ' + cut + '\n' +
                                     ' Всего ' + digexp + ' + ' + digprofit + ' = ' + digtotal + '\n' ;

                           }

                     console.log('ATEXXXT non standard',text)

                      var sql6 = ' SELECT * FROM users WHERE status = "manager" ';

                      connection.query( sql6 , [ user_id ], function(err, rows, fields) {
                      if (err) throw err;
                      var manager = JSON.parse(JSON.stringify(rows));
                          for(var i = 0; i < manager.length; i++){
                          bot.sendMessage(manager[i].id_user, text)
                          }
                          bot.sendMessage(admin, text)
                      })
             })

            })
            }
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
//var text = 'Выберите продукт:';

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
    test.push([ order[i].id_report, order[i].id_user, order[i].date_entry, order[i].product, order[i].size, order[i].number, order[i].offprice, order[i].paper_type, order[i].paper_exp, order[i].paper_side]);
    }
            console.log('DO INSERTA ');
        var sql3 = ' INSERT INTO zakaz (id_report, id_user, date_entry, product, size, number, offprice, paper_type, paper_exp, paper_side) VALUES ? ';
            console.log('POSLE INSERTA');
        connection.query( sql3 , [test], function(err, rows, fields) {
        if (err) throw err;
            var text = 'Вы сделали заявку на ';

            for(var i = 0; i < order.length; i++){
            text += order[i].product + ' размер ' + order[i].size + ' тиражом ' + order[i].number + '\n';
            }
            console.log('POSLE INSERTA', text);
            var sql31 = ' SELECT size FROM product WHERE size = "non" AND name = (SELECT name FROM ?? WHERE size LIKE "%*%" AND id_report = (SELECT id_report FROM ?? ORDER BY id DESC LIMIT 1) ORDER BY id DESC LIMIT 1 ) ';

            connection.query( sql31 , [order_table, order_table], function(err, rows, fields) {
            if (err) throw err;
            var non = JSON.parse(JSON.stringify(rows));
            console.log('POSLE INSERTA', non.length);
            if (non.length == 0) {

            var sql4 = ' SELECT product.name, product.size, product.number AS ina3, product.print_exp, product.print_profit, product.cut_exp, product.cut_profit, product.expense, product.profit, ' +
                       ' product.offprint_exp, product.offprint_profit, product.digprint_exp, product.digprint_profit, ??.number AS number, ??.offprice AS offprice, ??.paper_exp AS paper_exp, ??.paper_type, ??.paper_side ' +
                       ' FROM product JOIN ?? WHERE product.name = ??.product AND product.size = ??.size AND ??.size NOT LIKE "%*%" AND ??.id_report = (SELECT id_report FROM ?? ORDER BY id DESC LIMIT 1) ';

            connection.query( sql4 , [order_table, order_table, order_table, order_table, order_table, order_table, order_table, order_table, order_table, order_table, order_table], function(err, rows, fields) {
            if (err) throw err;
            var counting = JSON.parse(JSON.stringify(rows));
            console.log('joining result ', counting);

             for(var i = 0; i < counting.length; i++){

                          if (counting[i].number % counting[i].ina3 !== 0) {
                          var kolvoa3 = counting[i].number % counting[i].ina3;
                           var n_paper = (counting[i].number - kolvoa3)/counting[i].ina3  + 1;
             //              var print_exp = counting[i].print_exp*n_paper;
                           var print_exp = parseInt(counting[i].print_exp*n_paper);

             //              var print_profit = counting[i].print_profit*n_paper;
                           var print_profit = parseInt(counting[i].print_profit*n_paper);

             //              var offprint_exp = counting[i].offprice*n_paper/2;
                           var offprint_exp = parseInt(counting[i].offprice*n_paper/2);

             //              var offprint_profit = counting[i].offprice*n_paper/2;
                           var offprint_profit = parseInt(counting[i].offprice*n_paper/2);

             //              var rizprint_exp = counting[i].rizprint_exp*n_paper;
                           var rizprint_exp = parseInt(counting[i].rizprint_exp*n_paper);

             //              var rizprint_profit = counting[i].rizprint_profit*n_paper;
                           var rizprint_profit = parseInt(counting[i].rizprint_profit*n_paper);

             //              var digprint_exp = counting[i].digprint_exp*n_paper;
                           var digprint_exp = parseInt(counting[i].digprint_exp*n_paper);

             //              var digprint_profit = counting[i].digprint_profit*n_paper;
                           var digprint_profit = parseInt(counting[i].digprint_profit*n_paper);

             //              var print = counting[i].print_exp*n_paper + counting[i].print_profit*n_paper;
                           var print = parseInt(counting[i].print_exp*n_paper + counting[i].print_profit*n_paper);

             //              var offprint = counting[i].offprint_exp*n_paper + counting[i].offprint_profit*n_paper;
                           var offprint = parseInt(counting[i].offprint_exp*n_paper + counting[i].offprint_profit*n_paper);

             //              var rizprint = counting[i].rizprint_exp*n_paper + counting[i].rizprint_profit*n_paper;
                           var rizprint = parseInt(counting[i].rizprint_exp*n_paper + counting[i].rizprint_profit*n_paper);

             //              var digprint = counting[i].digprint_exp*n_paper + counting[i].digprint_profit*n_paper;
                           var digprint = parseInt(counting[i].digprint_exp*n_paper + counting[i].digprint_profit*n_paper);

             //              var paper_exp = counting[i].paper_exp*n_paper;
                           var paper_exp = parseInt(counting[i].paper_exp*n_paper);

             //              var cut_exp = counting[i].cut_exp*n_paper;
                           var cut_exp = parseInt(counting[i].cut_exp*n_paper);

             //              var cut_profit = counting[i].cut_profit*n_paper;
                           var cut_profit = parseInt(counting[i].cut_profit*n_paper);

             //              var cut = counting[i].cut_exp*n_paper +counting[i].cut_profit*n_paper;
                           var cut = parseInt(counting[i].cut_exp*n_paper +counting[i].cut_profit*n_paper);

                           var exp = print_exp + paper_exp + cut_exp;
                           var profit = print_profit + cut_profit;
                           var total = profit + exp;
                           var offexp = offprint_exp + paper_exp + cut_exp;
                           var offprofit = offprint_profit + cut_profit;
                           var offtotal = offexp + offprofit;
                           var digexp = digprint_exp + paper_exp + cut_exp;
             //              var digexp2 = parseInt(digexp);

                           var digprofit = digprint_profit + cut_profit;
             //              var digprofit2 = parseInt(digprofit);

                           var digtotal = digexp + digprofit;
             //              var digtotal2 = parseInt(digtotal);

                           var rizexp = rizprint_exp + paper_exp + cut_exp;
                           var rizprofit = rizprint_profit + cut_profit;
                           var riztotal = rizexp + rizprofit;

                           var sum = print_exp+print_profit+paper_exp+cut_exp+cut_profit;

                           var paper_type = counting[i].paper_type;
                           var paper_side = counting[i].paper_side;
                             if(counting[i].paper_side === 'one') {var side = 'Односторонняя печать';}
                             else if(counting[i].paper_side === 'two') {var side = 'Двухсторонняя печать';}

                             var str = counting[i].size;
                             var res = str.split("*");

                             if(res.length == 2) {var size_type = 'с нестандартным размером' + counting[i].size ;}
                             else {var size_type = counting[i].size ;}
                          }

                          else {
                           var n_paper = counting[i].number/counting[i].ina3;
             //              var print_exp = counting[i].print_exp*n_paper;
                           var print_exp = parseInt(counting[i].print_exp*n_paper);

             //              var print_profit = counting[i].print_profit*n_paper;
                           var print_profit = parseInt(counting[i].print_profit*n_paper);

             //              var offprint_exp = counting[i].offprice*n_paper/2;
                           var offprint_exp = parseInt(counting[i].offprice*n_paper/2);

             //              var offprint_profit = counting[i].offprice*n_paper/2;
                           var offprint_profit = parseInt(counting[i].offprice*n_paper/2);

             //              var rizprint_exp = counting[i].rizprint_exp*n_paper;
                           var rizprint_exp = parseInt(counting[i].rizprint_exp*n_paper);

             //              var rizprint_profit = counting[i].rizprint_profit*n_paper;
                           var rizprint_profit = parseInt(counting[i].rizprint_profit*n_paper);

             //              var digprint_exp = counting[i].digprint_exp*n_paper;
                           var digprint_exp = parseInt(counting[i].digprint_exp*n_paper);

             //              var digprint_profit = counting[i].digprint_profit*n_paper;
                           var digprint_profit = parseInt(counting[i].digprint_profit*n_paper);

             //              var print = counting[i].print_exp*n_paper + counting[i].print_profit*n_paper;
                           var print = parseInt(counting[i].print_exp*n_paper + counting[i].print_profit*n_paper);

             //              var offprint = counting[i].offprint_exp*n_paper + counting[i].offprint_profit*n_paper;
                           var offprint = parseInt(counting[i].offprint_exp*n_paper + counting[i].offprint_profit*n_paper);

             //              var rizprint = counting[i].rizprint_exp*n_paper + counting[i].rizprint_profit*n_paper;
                           var rizprint = parseInt(counting[i].rizprint_exp*n_paper + counting[i].rizprint_profit*n_paper);

             //              var digprint = counting[i].digprint_exp*n_paper + counting[i].digprint_profit*n_paper;
                           var digprint = parseInt(counting[i].digprint_exp*n_paper + counting[i].digprint_profit*n_paper);

             //              var paper_exp = counting[i].paper_exp*n_paper;
                           var paper_exp = parseInt(counting[i].paper_exp*n_paper);

             //              var cut_exp = counting[i].cut_exp*n_paper;
                           var cut_exp = parseInt(counting[i].cut_exp*n_paper);

             //              var cut_profit = counting[i].cut_profit*n_paper;
                           var cut_profit = parseInt(counting[i].cut_profit*n_paper);

             //              var cut = counting[i].cut_exp*n_paper +counting[i].cut_profit*n_paper;
                           var cut = parseInt(counting[i].cut_exp*n_paper +counting[i].cut_profit*n_paper);

                           var exp = print_exp + paper_exp + cut_exp;
                           var profit = print_profit + cut_profit;
                           var total = profit + exp;
                           var offexp = offprint_exp + paper_exp + cut_exp;
                           var offprofit = offprint_profit + cut_profit;
                           var offtotal = offexp + offprofit;
                           var digexp = digprint_exp + paper_exp + cut_exp;
             //              var digexp2 = parseInt(digexp);

                           var digprofit = digprint_profit + cut_profit;
             //              var digprofit2 = parseInt(digprofit);

                           var digtotal = digexp + digprofit;
             //              var digtotal2 = parseInt(digtotal);

                           var rizexp = rizprint_exp + paper_exp + cut_exp;
                           var rizprofit = rizprint_profit + cut_profit;
                           var riztotal = rizexp + rizprofit;

                           var sum = print_exp+print_profit+paper_exp+cut_exp+cut_profit;

                           var paper_type = counting[i].paper_type;
                           var paper_side = counting[i].paper_side;

                             if(counting[i].paper_side === 'one') {var side = 'Односторонняя печать';}
                             else if(counting[i].paper_side === 'two') {var side = 'Двухсторонняя печать';}

                             var str = counting[i].size;
                             var res = str.split("*");

                             if(res.length == 2) {var size_type = 'с нестандартным размером' + counting[i].size ;}
                             else {var size_type = counting[i].size ;}
                          }


                            text += ' Имя: ' + nomer[0].username + ' номер: ' + nomer[0].tel + '\n' +
                                    '🔹 ' + counting[i].name + ' ' +  size_type + ' на сумму ' + sum + '\n' +
                                    ' кол-во А3 - ' + n_paper + '\n' +
                                    '(себестоимость и наценка)' + '\n' +
                                    side + '\n' +
                                    'Струйная печать' + '\n' +
                                    ' ЦП ' + print_exp + ' + ' + print_profit + ' = ' + print + '\n' +
                                    ' ЦБ ' + paper_exp + ' = ' + paper_exp + '\n' +
                                    ' ЦР ' + cut_exp + ' + ' + cut_profit + ' = ' + cut + '\n' +
                                    ' Всего ' + exp + ' + ' + profit + ' = ' + total + '\n' +
                                    'Ризограф печать' + '\n' +
                                    ' ЦП ' + rizprint_exp + ' + ' + rizprint_profit + ' = ' + rizprint + '\n' +
                                    ' ЦБ ' + paper_exp + ' = ' + paper_exp + '\n' +
                                    ' ЦР ' + cut_exp + ' + ' + cut_profit + ' = ' + cut + '\n' +
                                    ' Всего ' + rizexp + ' + ' + rizprofit + ' = ' + riztotal + '\n' +
                                    'Офсетная печать' + '\n' +
                                    ' ЦП ' + offprint_exp + ' + ' + offprint_profit + ' = ' + offprint + '\n' +
                                    ' ЦБ ' + paper_exp + ' = ' + paper_exp + '\n' +
                                    ' ЦР ' + cut_exp + ' + ' + cut_profit + ' = ' + cut + '\n' +
                                    ' Всего ' + offexp + ' + ' + offprofit + ' = ' + offtotal + '\n' +
                                    'Цифровая печать' + '\n' +
                                    ' ЦП ' + digprint_exp + ' + ' + digprint_profit + ' = ' + digprint + '\n' +
                                    ' ЦБ ' + paper_exp + ' = ' + paper_exp + '\n' +
                                    ' ЦР ' + cut_exp + ' + ' + cut_profit + ' = ' + cut + '\n' +
                                    ' Всего ' + digexp + ' + ' + digprofit + ' = ' + digtotal + '\n' ;

                          }
            console.log('ATEXXXT ',text)

             var sql5 = ' SELECT product.name AS name, product.number AS ina3, product.print_exp AS print_exp, product.print_profit AS print_profit, ??.cut_exp AS cut_exp, product.expense AS expense, product.profit AS profit, ' +
                        ' product.offprint_exp AS offprint_exp, product.offprint_profit AS offprint_profit, product.digprint_exp AS digprint_exp, product.digprint_profit AS digprint_profit, ??.size AS size, ??.number AS number, ??.offprice AS offprice, ??.paper_exp AS paper_exp, ??.paper_type AS paper_type, ??.paper_side AS paper_side ' +
                        ' FROM product JOIN ?? WHERE product.name = ??.product AND ??.size LIKE "%*%" AND product.size = "non" AND ??.id_report = (SELECT id_report FROM ?? ORDER BY id DESC LIMIT 1) ';

             connection.query( sql5 , [order_table, order_table, order_table, order_table, order_table, order_table, order_table, order_table, order_table, order_table, order_table, order_table ], function(err, rows, fields) {
             if (err) throw err;
             var counting = JSON.parse(JSON.stringify(rows));
             console.log('НЕСТАНДАРт ', counting);



              for(var i = 0; i < counting.length; i++){

                           if (counting[i].number % counting[i].ina3 !== 0) {
                           var kolvoa3 = counting[i].number % counting[i].ina3;
                          var n_paper = (counting[i].number - kolvoa3)/counting[i].ina3  + 1;
              //              var print_exp = counting[i].print_exp*n_paper;
                            var print_exp = parseInt(counting[i].print_exp*n_paper);

              //              var print_profit = counting[i].print_profit*n_paper;
                            var print_profit = parseInt(counting[i].print_profit*n_paper);

              //              var offprint_exp = counting[i].offprice*n_paper/2;
                            var offprint_exp = parseInt(counting[i].offprice*n_paper/2);

              //              var offprint_profit = counting[i].offprice*n_paper/2;
                            var offprint_profit = parseInt(counting[i].offprice*n_paper/2);

              //              var rizprint_exp = counting[i].rizprint_exp*n_paper;
                            var rizprint_exp = parseInt(counting[i].rizprint_exp*n_paper);

              //              var rizprint_profit = counting[i].rizprint_profit*n_paper;
                            var rizprint_profit = parseInt(counting[i].rizprint_profit*n_paper);

              //              var digprint_exp = counting[i].digprint_exp*n_paper;
                            var digprint_exp = parseInt(counting[i].digprint_exp*n_paper);

              //              var digprint_profit = counting[i].digprint_profit*n_paper;
                            var digprint_profit = parseInt(counting[i].digprint_profit*n_paper);

              //              var print = counting[i].print_exp*n_paper + counting[i].print_profit*n_paper;
                            var print = parseInt(counting[i].print_exp*n_paper + counting[i].print_profit*n_paper);

              //              var offprint = counting[i].offprint_exp*n_paper + counting[i].offprint_profit*n_paper;
                            var offprint = parseInt(counting[i].offprint_exp*n_paper + counting[i].offprint_profit*n_paper);

              //              var rizprint = counting[i].rizprint_exp*n_paper + counting[i].rizprint_profit*n_paper;
                            var rizprint = parseInt(counting[i].rizprint_exp*n_paper + counting[i].rizprint_profit*n_paper);

              //              var digprint = counting[i].digprint_exp*n_paper + counting[i].digprint_profit*n_paper;
                            var digprint = parseInt(counting[i].digprint_exp*n_paper + counting[i].digprint_profit*n_paper);

              //              var paper_exp = counting[i].paper_exp*n_paper;
                            var paper_exp = parseInt(counting[i].paper_exp*n_paper);

              //              var cut_exp = counting[i].cut_exp*n_paper;
                            var cut_exp = parseInt(counting[i].cut_exp*n_paper);

              //              var cut = counting[i].cut_exp*n_paper +counting[i].cut_profit*n_paper;
                            var cut = parseInt(counting[i].cut_exp*n_paper);

                            var exp = print_exp + paper_exp + cut_exp;
                            var profit = print_profit ;
                            var total = profit + exp;
                            var offexp = offprint_exp + paper_exp + cut_exp;
                            var offprofit = offprint_profit ;
                            var offtotal = offexp + offprofit;
                            var digexp = digprint_exp + paper_exp + cut_exp;
              //              var digexp2 = parseInt(digexp);

                            var digprofit = digprint_profit;
              //              var digprofit2 = parseInt(digprofit);

                            var digtotal = digexp + digprofit;
              //              var digtotal2 = parseInt(digtotal);

                            var rizexp = rizprint_exp + paper_exp + cut_exp;
                            var rizprofit = rizprint_profit ;
                            var riztotal = rizexp + rizprofit;

                            var sum = print_exp+print_profit+paper_exp+cut_exp;

                            var paper_type = counting[i].paper_type;
                            var paper_side = counting[i].paper_side;
                              if(counting[i].paper_side === 'one') {var side = 'Односторонняя печать';}
                              else if(counting[i].paper_side === 'two') {var side = 'Двухсторонняя печать';}

                              var str = counting[i].size;
                              var res = str.split("*");

                              if(res.length == 2) {var size_type = 'с нестандартным размером' + counting[i].size ;}
                              else {var size_type = counting[i].size ;}
                           }

                           else {
                            var n_paper = counting[i].number/counting[i].ina3;
              //              var print_exp = counting[i].print_exp*n_paper;
                            var print_exp = parseInt(counting[i].print_exp*n_paper);

              //              var print_profit = counting[i].print_profit*n_paper;
                            var print_profit = parseInt(counting[i].print_profit*n_paper);

              //              var offprint_exp = counting[i].offprice*n_paper/2;
                            var offprint_exp = parseInt(counting[i].offprice*n_paper/2);

              //              var offprint_profit = counting[i].offprice*n_paper/2;
                            var offprint_profit = parseInt(counting[i].offprice*n_paper/2);

              //              var rizprint_exp = counting[i].rizprint_exp*n_paper;
                            var rizprint_exp = parseInt(counting[i].rizprint_exp*n_paper);

              //              var rizprint_profit = counting[i].rizprint_profit*n_paper;
                            var rizprint_profit = parseInt(counting[i].rizprint_profit*n_paper);

              //              var digprint_exp = counting[i].digprint_exp*n_paper;
                            var digprint_exp = parseInt(counting[i].digprint_exp*n_paper);

              //              var digprint_profit = counting[i].digprint_profit*n_paper;
                            var digprint_profit = parseInt(counting[i].digprint_profit*n_paper);

              //              var print = counting[i].print_exp*n_paper + counting[i].print_profit*n_paper;
                            var print = parseInt(counting[i].print_exp*n_paper + counting[i].print_profit*n_paper);

              //              var offprint = counting[i].offprint_exp*n_paper + counting[i].offprint_profit*n_paper;
                            var offprint = parseInt(counting[i].offprint_exp*n_paper + counting[i].offprint_profit*n_paper);

              //              var rizprint = counting[i].rizprint_exp*n_paper + counting[i].rizprint_profit*n_paper;
                            var rizprint = parseInt(counting[i].rizprint_exp*n_paper + counting[i].rizprint_profit*n_paper);

              //              var digprint = counting[i].digprint_exp*n_paper + counting[i].digprint_profit*n_paper;
                            var digprint = parseInt(counting[i].digprint_exp*n_paper + counting[i].digprint_profit*n_paper);

              //              var paper_exp = counting[i].paper_exp*n_paper;
                            var paper_exp = parseInt(counting[i].paper_exp*n_paper);

              //              var cut_exp = counting[i].cut_exp*n_paper;
                            var cut_exp = parseInt(counting[i].cut_exp*n_paper);

              //              var cut = counting[i].cut_exp*n_paper +counting[i].cut_profit*n_paper;
                            var cut = parseInt(counting[i].cut_exp*n_paper);

                            var exp = print_exp + paper_exp + cut_exp;
                            var profit = print_profit ;
                            var total = profit + exp;
                            var offexp = offprint_exp + paper_exp + cut_exp;
                            var offprofit = offprint_profit ;
                            var offtotal = offexp + offprofit;
                            var digexp = digprint_exp + paper_exp + cut_exp;
              //              var digexp2 = parseInt(digexp);

                            var digprofit = digprint_profit;
              //              var digprofit2 = parseInt(digprofit);

                            var digtotal = digexp + digprofit;
              //              var digtotal2 = parseInt(digtotal);

                            var rizexp = rizprint_exp + paper_exp + cut_exp;
                            var rizprofit = rizprint_profit;
                            var riztotal = rizexp + rizprofit;

                            var sum = print_exp+print_profit+paper_exp+cut_exp;

                            var paper_type = counting[i].paper_type;
                            var paper_side = counting[i].paper_side;

                              if(counting[i].paper_side === 'one') {var side = 'Односторонняя печать';}
                              else if(counting[i].paper_side === 'two') {var side = 'Двухсторонняя печать';}

                              var str = counting[i].size;
                              var res = str.split("*");

                              if(res.length == 2) {var size_type = 'с нестандартным размером ' + counting[i].size ;}
                              else {var size_type = counting[i].size ;}
                           }


                             text += ' Имя: ' + nomer[0].username + ' номер: ' + nomer[0].tel + '\n' +
                                     '🔹 ' + counting[i].name + ' ' +  size_type + ' на сумму ' + sum + '\n' +
                                     ' кол-во А3 - ' + n_paper + '\n' +
                                     '(себестоимость и наценка)' + '\n' +
                                     side + '\n' +
                                     'Струйная печать' + '\n' +
                                     ' ЦП ' + print_exp + ' + ' + print_profit + ' = ' + print + '\n' +
                                     ' ЦБ ' + paper_exp + ' = ' + paper_exp + '\n' +
                                     ' ЦР ' + cut_exp + ' = ' + cut + '\n' +
                                     ' Всего ' + exp + ' + ' + profit + ' = ' + total + '\n' +
                                     'Ризограф печать' + '\n' +
                                     ' ЦП ' + rizprint_exp + ' + ' + rizprint_profit + ' = ' + rizprint + '\n' +
                                     ' ЦБ ' + paper_exp + ' = ' + paper_exp + '\n' +
                                     ' ЦР ' + cut_exp + ' = ' + cut + '\n' +
                                     ' Всего ' + rizexp + ' + ' + rizprofit + ' = ' + riztotal + '\n' +
                                     'Офсетная печать' + '\n' +
                                     ' ЦП ' + offprint_exp + ' + ' + offprint_profit + ' = ' + offprint + '\n' +
                                     ' ЦБ ' + paper_exp + ' = ' + paper_exp + '\n' +
                                     ' ЦР ' + cut_exp + ' = ' + cut + '\n' +
                                     ' Всего ' + offexp + ' + ' + offprofit + ' = ' + offtotal + '\n' +
                                     'Цифровая печать' + '\n' +
                                     ' ЦП ' + digprint_exp + ' + ' + digprint_profit + ' = ' + digprint + '\n' +
                                     ' ЦБ ' + paper_exp + ' = ' + paper_exp + '\n' +
                                     ' ЦР ' + cut_exp + ' = ' + cut + '\n' +
                                     ' Всего ' + digexp + ' + ' + digprofit + ' = ' + digtotal + '\n' ;

                           }

                     console.log('ATEXXXT non standard',text)



                      var sql6 = ' SELECT * FROM users WHERE status = "manager" ';

                      connection.query( sql6 , [ user_id ], function(err, rows, fields) {
                      if (err) throw err;
                      var manager = JSON.parse(JSON.stringify(rows));
                          for(var i = 0; i < manager.length; i++){
                          bot.sendMessage(manager[i].id_user, text)
                          }
                          bot.sendMessage(admin, text)
                      })
             })

            })
            }
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

        var sql3 = ' SELECT * FROM product WHERE name = ? AND size <> "non" ';

            connection.query( sql3 , res[1], function(err, rows, fields) {
            if (err) throw err;
            var product = JSON.parse(JSON.stringify(rows));
            var keyboard = [];
            keyboard.push([{'text': ( 'Указать нестандартный размер' ) , 'callback_data': ('size-other#' + 'боолванка' + '#' + res[1] + '#' + 'бооолванка' )}]);

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

        var sql3 = ' SELECT id,name,size FROM product WHERE name = ? AND size <> "non" ';

            connection.query( sql3 , res[1], function(err, rows, fields) {
            if (err) throw err;
            var product = JSON.parse(JSON.stringify(rows));
            var keyboard = [];
            keyboard.push([{'text': ( 'Указать нестандартный размер' ) , 'callback_data': ('size-other#' + 'боолванка' + '#' + res[1] + '#' + 'бооолванка' )}]);

            for(var i = 0; i < product.length; i++){
            keyboard.push([{'text': ( product[i].size ) , 'callback_data': ('size#' + product[i].size + '#' + res[1] + '#' + product[i].id )}]);
            }
            const text = 'Теперь выберите размер '

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

        var sql3 = ' SELECT thickness, price FROM paper ';

            connection.query( sql3 , function(err, rows, fields) {
            if (err) throw err;
            var product = JSON.parse(JSON.stringify(rows));
            var keyboard = [];

            keyboard.push([{'text': ( 'Вы сами выберите мне оптимальную толщину бумаги' ) , 'callback_data': ('paper_pofig#')}]);
            for(var i = 0; i < product.length; i++){
            keyboard.push([{'text': ( product[i].thickness ) , 'callback_data': ('paper#'  + product[i].thickness + '#' +  product[i].price  + '#' + res[1] + '#' + res[3]  )}]);
            }

            const text = 'Теперь выберите толщину бумаги '

                 bot.sendMessage( user_id, text,
                 {
                 'reply_markup': JSON.stringify({
                 inline_keyboard: keyboard
                                                })
                 }
                 )
            })

//        var sql3 = ' SELECT number FROM product WHERE name = ? ORDER BY id DESC LIMIT 1 ';
//
//            connection.query( sql3 , res[2], function(err, rows, fields) {
//            if (err) throw err;
//            var product = JSON.parse(JSON.stringify(rows));
//            var keyboard = [];
//
//            for(var i = 0; i < 20; i++){
//            var num = product[0].number*i;
//            keyboard.push([{'text': ( num ) , 'callback_data': ('number#' + num)}]);
//            }
//            const text = 'Теперь укажите тираж '
//
//                 bot.sendMessage( user_id, text,
//                 {
//                 'reply_markup': JSON.stringify({
//                 inline_keyboard: keyboard
//                                                })
//                 }
//                 )
//            })
        })
    })
})
}



function insert_paper (query) {

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

    var sql2 = ' UPDATE ?? SET paper_type = ?, paper_exp = ?   WHERE id = ? ';

        connection.query( sql2 , [ order, res[1], res[2], id[0].id ], function(err, rows, fields) {
        if (err) throw err;

            const text = 'Одностороннее или двухсторонняя печать?'

            bot.sendMessage(user_id, text, {
                                 reply_markup: {
                                   inline_keyboard: [
                                     [{
                                       text: 'Односторонняя печать',
                                       callback_data: 'side#one#' + res[4]
                                     }],

                                     [{
                                       text: 'Двухсторонняя печать',
                                       callback_data: 'side#two#' + res[4]
                                     }]
                                     ]
                                 }
                           })
            })
        })

})
}



function insert_side (query) {

var str = query.data;
var res = str.split("#");
console.log('res is:', res[0]);
console.log('res is:', res[1]);
console.log('res is:', res[2]);

if (res[1] === 'one') {
var coef = 1;
}
else if (res[1] === 'two')
{
var coef = 2;
}

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

var sql1 = ' SELECT id, paper_exp FROM ??  ORDER BY id DESC LIMIT 1 ';

    connection.query( sql1 , [ order ], function(err, rows, fields) {
    if (err) throw err;
    var id = JSON.parse(JSON.stringify(rows));
    var exp = coef*id[0].paper_exp;

    var sql2 = ' UPDATE ?? SET paper_exp = ?, paper_side = ?   WHERE id = ? ';

        connection.query( sql2 , [ order, exp, res[1], id[0].id ], function(err, rows, fields) {
        if (err) throw err;

//        var sql3 = ' SELECT * FROM product WHERE id = ?';
        var sql3 = ' SELECT * FROM product WHERE name = (SELECT product FROM ?? ORDER BY id DESC LIMIT 1)';

            connection.query( sql3 , order, function(err, rows, fields) {
            if (err) throw err;
            var product = JSON.parse(JSON.stringify(rows));
            var keyboard = [];

            for(var i = 0; i < 20; i++){
            var num = product[0].interval*i;
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

    var sql11 = ' SELECT price FROM tiraj WHERE n_from < ? AND n_to >= ? ';

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

    var sql = ' INSERT INTO product (name, size, number, print_exp, print_profit, rizprint_exp, rizprint_profit, offprint_exp, offprint_profit, digprint_exp, digprint_profit, paper_exp, paper_type, cut_exp, cut_profit, intervalchik ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';

    connection.query( sql , [ splited[0], id_jk, splited[1], splited[2], splited[3], splited[4], splited[5], splited[6], splited[7], splited[8], splited[9], splited[10], splited[11], splited[12], splited[13], splited[14] ], function(err, rows, fields) {
    if (err) throw err;
//, splited[15]
    })
})
})




bot.onText(/\/cut (.+)/, (msg, [source, match]) => {

var user_id = msg.chat.id;
var msg_text = msg.text;

var text = msg_text.replace("/cut", "");
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

    var sql = ' INSERT INTO cutting (price, n_from, n_to) VALUES (?,?,?) ';

    connection.query( sql , [ splited[0], splited[1], splited[2] ], function(err, rows, fields) {
    if (err) throw err;

        var sql1 = ' SELECT * FROM tiraj ';

        connection.query( sql1 , function(err, rows, fields) {
        if (err) throw err;
        var tiraj = JSON.parse(JSON.stringify(rows));
        var text = 'Цены по резке: \n';
        for(var i = 0; i < tiraj.length; i++){
        text += tiraj[i].n_from  + ' - ' + tiraj[i].n_to + ' цена ' + tiraj[i].price + ' тг' + '\n';
        }
        bot.sendMessage(user_id, text)
        })
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



bot.onText(/\/paper (.+)/, (msg, [source, match]) => {

var user_id = msg.chat.id;
var msg_text = msg.text;

var text = msg_text.replace("/paper", "");
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

    var sql = ' INSERT INTO paper (thickness, price) VALUES (?,?) ';

    connection.query( sql , [ splited[0], splited[1] ], function(err, rows, fields) {
    if (err) throw err;

        var sql1 = ' SELECT * FROM paper ';

        connection.query( sql1 , function(err, rows, fields) {
        if (err) throw err;
        var paper = JSON.parse(JSON.stringify(rows));
        var text = 'Цены по бумагам: \n';
        for(var i = 0; i < paper.length; i++){
        text += paper[i].thickness  + ' гр - цена ' + paper[i].price + ' тг' + '\n';
        }
        bot.sendMessage(user_id, text)
        })
    })
})
})




bot.onText(/\/razmer (.+)/, (msg, [source, match]) => {

var user_id = msg.chat.id;
var msg_text = msg.text;

var text = msg_text.replace("/razmer", "");
var splited = text.split("#");

console.log('NNtext ', splited)

if(splited[0]<splited[1]) {
var long = splited[1];
var short = splited[0];
}
else
{
var long = splited[0];
var short = splited[1];
}

var rem_long = 45%long;
var rem_short = 22%short;

var rem_45short = 45%short;
var rem_22long = 22%long;

var llss = (45-rem_long)/long*(22-rem_short)/short;
var lsls = (45-rem_45short)/short*(22-rem_22long)/long;

if(llss>lsls) { var ina3 = llss; var vib = '45 на длинную '; }
else { var ina3 = lsls; var vib = '45 на короткую ';}

var text = 'Максимальное кол-во будет если делить' + vib + ' получается ' + ina3;

bot.sendMessage(user_id, text)

var n_report = 'n_report'+user_id;
var order = 'order'+user_id;
// Размер продукта указываем вот так: splited[1] + '*' + splited[0]
var size = splited[1] + '*' + splited[0];

    var mysql  = require('mysql');
    var pool  = mysql.createPool({
    host     : 'localhost',
    user     :  config.user,
    password :  config.db_password,
    database :  config.db_name
    })

pool.getConnection(function(err, connection) {

var sql1 = ' SELECT id FROM ?? ORDER BY id DESC LIMIT 1 ';

    connection.query( sql1 , [order], function(err, rows, fields) {
    if (err) throw err;
    var id = JSON.parse(JSON.stringify(rows));

var sql11 = ' SELECT price FROM cutting WHERE n_from < ? AND n_to >= ? ';

    connection.query( sql11 , [ ina3, ina3 ], function(err, rows, fields) {
    if (err) throw err;
    var cutting = JSON.parse(JSON.stringify(rows));

var sql2 = ' UPDATE ?? SET size = ?, ina3 = ?, cut_exp = ?  WHERE id = ?';

    connection.query( sql2 , [order, size, ina3, cutting[0].price, id[0].id], function(err, rows, fields) {
    if (err) throw err;

    var sql3 = ' SELECT thickness, price FROM paper ';

        connection.query( sql3 , function(err, rows, fields) {
        if (err) throw err;
        var paper = JSON.parse(JSON.stringify(rows));
        var keyboard = [];

        keyboard.push([{'text': ( 'Вы сами выберите мне оптимальную толщину бумаги' ) , 'callback_data': ('paper_pofig#')}]);
        for(var i = 0; i < paper.length; i++){
        keyboard.push([{'text': ( paper[i].thickness ) , 'callback_data': ('paper#'  + paper[i].thickness + '#' +  paper[i].price  + '#' + size + 'болванка' )}]);
        }

        const text = 'Теперь выберите толщину бумаги '

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
})
})

//dfgdg