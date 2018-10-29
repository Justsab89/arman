const TelegramBot = require('node-telegram-bot-api')
const config = require('./config')
const helper = require('./helper')
const create_table = require('./create_table')
const select = require('./select')
const date_format = require('date_format')
const fs = require('fs')
const TaskTimer = require('tasktimer')
const database = require('./database')

const bot = new TelegramBot(config.TOKEN, {
  polling: true
})

//const bot = new TelegramBot(config.TOKEN, {
//  webHook:
//  {
//    port: 80,
//    autoOpen: false
//  }
//})
//
//bot.setWebHook(`https:/\/tbot.kz/bot/${config.TOKEN}`)


helper.logStart()

function debug(obj = {}) {
     return JSON.stringify(obj, null, 4)
}

bot.on('message', msg => {
  console.log('Working', msg.from.first_name, msg.chat.id)
})

bot.onText(/\/hey/, msg => {

  const text = `Здравствуйте, ${msg.from.first_name}\nВыберите команду для начала работы:`
  bot.sendMessage(helper.getChatId(msg), text)
})


function edit_profile_driver(msg) {

        var mysql  = require('mysql');
        var pool  = mysql.createPool({
        host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
        database : 'sitebot'
    })

var user_id = msg.chat.id;

pool.getConnection(function(err, connection) {

      connection.query(' SELECT marka, nomer, tel FROM users WHERE id_user = ? AND vibor = "driver" ',[ user_id ] ,function(err, rows, fields) {
      if (err) throw err;
      var driver = JSON.parse(JSON.stringify(rows));

      var text = 'Ваши данные:\n' +
                 'Марка авто: ' + driver[0].marka + '\n' +
                 'Номер авто: ' + driver[0].nomer + '\n' +
                 'Телефон: ' + driver[0].tel + '\n\n' +
                 'Чтобы редактировать данные набирайте в строке следующие команды и затем новые данные через пробел:\n' +
                 'Например:\n' +
                 '/marka Тойота королла\n' +
                 '/nomer M 777 HAN\n' +
                 '/phone +77013334444';

      bot.sendMessage(msg.chat.id, text)
      })
})
}


function edit_profile_pass(msg) {

        var mysql  = require('mysql');
        var pool  = mysql.createPool({
        host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
        database : 'sitebot'
    })

var user_id = msg.chat.id

pool.getConnection(function(err, connection) {

      connection.query(' SELECT tel FROM users WHERE id_user = ? AND vibor = "passenger" ',[ user_id ] ,function(err, rows, fields) {
      if (err) throw err;
      var pass = JSON.parse(JSON.stringify(rows));

      var text = 'Ваши данные:\n' +
                 'Телефон: ' + pass[0].tel + '\n\n' +
                 'Чтобы редактировать данные набирайте в строке следующие команды и затем новые данные через пробел:\n' +
                 'Например:\n' +
                 '/tel +77013334444';

      bot.sendMessage(msg.chat.id, text)
      })
})
}


bot.onText(/\/marka (.+)/, (msg, [source, match]) => {

  const { id } = msg.chat

        var mysql  = require('mysql');
        var pool  = mysql.createPool({
        host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
        database : 'sitebot'
    })

var user_id = msg.chat.id

pool.getConnection(function(err, connection) {

      connection.query(' UPDATE users SET marka = ? WHERE id_user = ? ',[ match, user_id ] ,function(err, rows, fields) {
        if (err) throw err;

      var text = 'Марка вашего авто отредактирована на: ' + match;
      bot.sendMessage(msg.chat.id, text)
      })
})
})


bot.onText(/\/nomer (.+)/, (msg, [source, match]) => {

  const { id } = msg.chat

        var mysql  = require('mysql');
        var pool  = mysql.createPool({
        host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
        database : 'sitebot'
    })

var user_id = msg.chat.id;

pool.getConnection(function(err, connection) {

      connection.query(' UPDATE users SET nomer = ? WHERE id_user = ? ',[ match, user_id ] ,function(err, rows, fields) {
      if (err) throw err;

      var text = 'Номер вашего авто отредактирован на: ' + match;
      bot.sendMessage(msg.chat.id, text)
      })
})
})


bot.onText(/\/phone (.+)/, (msg, [source, match]) => {

  const { id } = msg.chat

        var mysql  = require('mysql');
        var pool  = mysql.createPool({
        host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
        database : 'sitebot'
    })

var user_id = msg.chat.id

pool.getConnection(function(err, connection) {

      connection.query(' UPDATE users SET tel = ? WHERE id_user = ? ',[ match, user_id ] ,function(err, rows, fields) {
      if (err) throw err;

      var text = 'Ваш номер телефона отредактирован на: ' + match;
      bot.sendMessage(msg.chat.id, text)
      })
})
})


bot.onText(/\/tel (.+)/, (msg, [source, match]) => {

  const { id } = msg.chat

    var mysql  = require('mysql');
    var pool  = mysql.createPool({
    host     : 'localhost',
    user     : 'mybd_user',
    password : 'admin123',
    database : 'sitebot'
    })

var user_id = msg.chat.id

pool.getConnection(function(err, connection) {

      connection.query(' UPDATE users SET tel = ? WHERE id_user = ? ',[ match, user_id ] ,function(err, rows, fields) {
      if (err) throw err;

      var text = 'Ваш номер телефона отредактирован на: ' + match;
      bot.sendMessage(msg.chat.id, text)
      })
})
})



bot.onText(/\/route (.+)/, (msg, [source, match]) => {

    var mysql  = require('mysql');
    var pool  = mysql.createPool({
    host     : 'localhost',
    user     : 'mybd_user',
    password : 'admin123',
    database : 'route_driver'
    })

var user_id = msg.chat.id;
var route_driver = 'route'+user_id;
var n_route_driver = 'n_route'+user_id;

pool.getConnection(function(err, connection) {
//' SELECT DISTINCT n_zapros, street FROM ?? WHERE n_zapros > 1 AND id_route = (SELECT id_route FROM ??  ORDER BY id_route DESC LIMIT 1) '
        var route_sql = ' SELECT DISTINCT n_zapros, street FROM ?? WHERE id_route = (SELECT id_route FROM ??  ORDER BY id_route DESC LIMIT 1)  ';

        connection.query( route_sql , [ route_driver, route_driver ], function(err, rows, fields) {
        if (err) throw err;
        var route = JSON.parse(JSON.stringify(rows));
//        if (route.length !== 0) {
//        console.log('route-sql ',route);
//        console.log('route-sql street ',route[0].street);
//        var text = 'Вы едите по ' + route[0].street + ' до ' + route[1].street;
//          for(var i = 1; i < route.length/2; i++){
//          text += '\nпо ' + route[2*i].street + ' до ' + route[2*i+1].street
//          }
//        console.log('route text ', text);


//
        if (route.length !== 0 && route.length !== 1) {
             console.log('!! kbd !! route-sql ',route);
             console.log('!! kbd !! route-sql street ',route[0].street);

             if (route.length%2 == 0){

             var text = 'Вы едите по ' + route[0].street + ' до ' + route[2].street;

             for(var i = 1; i < route.length/2; i++){
             text += '\nпо ' + route[2*i].street + ' до ' + route[2*i+1].street
             }

             text += '\nпо ' + route[route.length-1].street + ' до ...'
             console.log('!! kbd !! route-sql-текст ',text);

                         connection.query(' INSERT INTO saved_routes (id_user, id_route, route_name, route_text) VALUES (?,(SELECT id_route FROM ?? ORDER BY id_route DESC LIMIT 1),?,?) ',
                         [ user_id, route_driver, match, text ] ,function(err, rows, fields) {
                         if (err) throw err;

                         var text2 = 'Маршрут сохранен как: "' + match + '"\nТеперь укажите кол-во пассажиров';
                         bot.sendMessage(msg.chat.id, text2)
                         })
             }
             else{

             var text = 'Вы едите по ' + route[0].street + ' до ' + route[2].street;

             for(var i = 1; i < (route.length-1)/2; i++){
             text += '\nпо ' + route[2*i+1].street + ' до ' + route[2*i+2].street
             }

             text += '\nпо ' + route[route.length-1].street + ' до ...'
             console.log('!! kbd !! route-sql-текст ',text);

                         connection.query(' INSERT INTO saved_routes (id_user, id_route, route_name, route_text) VALUES (?,(SELECT id_route FROM ?? ORDER BY id_route DESC LIMIT 1),?,?) ',
                         [ user_id, route_driver, match, text ] ,function(err, rows, fields) {
                         if (err) throw err;

                         var text2 = 'Маршрут сохранен как: "' + match + '"\nТеперь укажите кол-во пассажиров';
                         bot.sendMessage(msg.chat.id, text2)
                         })
             }
         }
         else if (route.length == 1) {
             console.log('!! kbd !! route-sql ',route);
             console.log('!! kbd !! route-sql street ',route[0].street);

             var text = 'Вы едите по ' + route[0].street + ' до ...';
                         connection.query(' INSERT INTO saved_routes (id_user, id_route, route_name, route_text) VALUES (?,(SELECT id_route FROM ?? ORDER BY id_route DESC LIMIT 1),?,?) ',
                         [ user_id, route_driver, match, text ] ,function(err, rows, fields) {
                         if (err) throw err;

                         var text2 = 'Маршрут сохранен как: "' + match + '"\nТеперь укажите кол-во пассажиров';
                         bot.sendMessage(msg.chat.id, text2)
                         })
         }
        })
})
})



function activate_route(query) {

    var mysql  = require('mysql');
    var pool  = mysql.createPool({
    host     : 'localhost',
    user     : 'mybd_user',
    password : 'admin123',
//    database : 'route_driver'
    })

var str = query.data;
var res = str.split(" ");
console.log('res0 is:', res[0]);
console.log('res1 is:', res[1]);

var user_id = query.message.chat.id;
var route_driver = 'route'+user_id;
var n_route_driver = 'n_route'+user_id;

pool.getConnection(function(err, connection) {

var sql1 = 'INSERT INTO route_driver.?? (id_user) VALUES (?)';
connection.query( sql1 , [ n_route_driver, user_id ] ,function(err, rows, fields) {
if (err) throw err;
var route1 = JSON.parse(JSON.stringify(rows));

      var sql = ' INSERT INTO sitebot.route (begend, id_user, district, id_route, point_type, id_street, street, id_interception, interception, id_point, busstop, ordinal, nearby_interception, point_parinter_min5, point_parinter_plu5, time_beg, time_end, status, limit_place, uje_seli, all_districts) ' +
                ' SELECT begend, id_user, district, (SELECT id FROM route_driver.?? AS route2 ORDER BY id DESC LIMIT 1) AS id_route, point_type, id_street, street, id_interception, interception, id_point, busstop, ordinal, nearby_interception, point_parinter_min5, point_parinter_plu5, NOW() AS time_beg, ADDTIME (NOW(), "00:40:00") AS time_end, status, limit_place, uje_seli, all_districts FROM route_driver.?? WHERE id_route = ? ' ;

      connection.query( sql , [ n_route_driver, route_driver, res[1] ] ,function(err, rows, fields) {
      if (err) throw err;
      var route = JSON.parse(JSON.stringify(rows));
      console.log('Activated saved route ',route);

                 const text = 'По всем направлениям цена 300 тг на одного пассажира\nКроме этих направлений:\nВнутри любого района 200 тг\nРайон Базара - Юго-восток 200 тг\nРайон Базара - Федоровка 200 тг\nМайкудук - Сортировка 200 тг\nУштобе - Юго-восток 200 тг '
                 bot.sendMessage(user_id, text)

                                driv_offer_topass (query);
                                driv_offer_todriv (query);
      })
})
})
}


function choose_route_toactivate(msg) {

    var mysql  = require('mysql');
    var pool  = mysql.createPool({
    host     : 'localhost',
    user     : 'mybd_user',
    password : 'admin123',
    database : 'route_driver'
    })

var user_id = msg.chat.id;
var route_driver = 'route'+user_id;
var n_route_driver = 'n_route'+user_id;

pool.getConnection(function(err, connection) {

      connection.query(' SELECT * FROM saved_routes WHERE id_user = ? ',
      [ user_id ] ,function(err, rows, fields) {
      if (err) throw err;
      var route = JSON.parse(JSON.stringify(rows));

         if (route.length !== 0){
         for(var i = 0; i < route.length; i++){
          var pasu_text = 'Название маршрута: "' + route[i].route_name + '"\n' +  route[i].route_text ;
          var id_route = route[i].id_route;

          console.log('PASU  ', pasu_text);
          bot.sendMessage(user_id, pasu_text ,{
                           reply_markup: {
                             inline_keyboard: [
                               [{
                                 text: 'Активизировать этот маршрут',
                                 callback_data:  'route ' + id_route
                               }]
                             ]
                           }

          })
         }
         }
         else {
         var pasu_text = 'У вас нет сохраненных маршрутов';
         bot.sendMessage(user_id, pasu_text)
         }
      })
})
}



function telpas(msg){
        var mysql  = require('mysql');
        var pool  = mysql.createPool({
        host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
        database : 'sitebot'
        })

pool.getConnection(function(err, connection) {

var phone = msg.text;
var zapros = msg.chat.id;

    connection.query('UPDATE users SET tel = ?, date =  NOW()  WHERE id_user = ? AND pol IS NOT NULL AND tel IS NULL',[phone, zapros], function(err, rows, fields) {
      if (err) throw err;
      pass(msg);
      bot.sendMessage( zapros, '‼️ Обязательно подпишитесь на канал t.me/popooti\nПройдите по ссылке t.me/popooti и нажмите "Подписаться"')
      bot.sendMessage( 336243307, '👤 Еще один пассажир зарегался')
      bot.sendVideo(zapros, fs.readFileSync(__dirname + '/video-passenger.mp4'), {
                  caption: 'Инструкция для пассажиров'
                  })

      var mysql  = require('mysql');
      var pool  = mysql.createPool({
      host     : 'localhost',
      user     : 'mybd_user',
      password : 'admin123',
      database : 'route_passenger'
      })

      var user_id = msg.chat.id;
      var point_type = 1;
      var route_passenger = 'route_p'+user_id;
      var n_route = 'n_route_p'+user_id;

      pool.getConnection(function(err, connection) {

            connection.query(' CREATE TABLE ?? (id INT(100) NOT NULL AUTO_INCREMENT, begend VARCHAR (5), n_zapros INT (5) , id_user INT(11) , id_route INT(11) , district VARCHAR (20) , point_type INT(11), id_street INT(11), street VARCHAR (100), id_interception INT(11), interception VARCHAR (100), id_point VARCHAR (20) , busstop VARCHAR (100), ordinal INT(11), nearby_interception VARCHAR (80), point_parinter_min5 VARCHAR (30), point_parinter_plu5 VARCHAR (30),  time_beg DATETIME, time_end DATETIME, status VARCHAR (30), n_pass INT(11) , all_districts VARCHAR (60), PRIMARY KEY(id)) ',[route_passenger] ,function(err, rows, fields) {
              if (err) throw err;
              })

            connection.query(' CREATE TABLE ?? (id INT(100) NOT NULL AUTO_INCREMENT, id_user INT(11), route_name VARCHAR (100), start VARCHAR (20) , finish VARCHAR (20) , n_inter INT(11), PRIMARY KEY(id)) ',[n_route] ,function(err, rows, fields) {
              if (err) throw err;
              })

      })

    })
})
}


function pol(query){
        var mysql  = require('mysql');
        var pool  = mysql.createPool({
        host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
        database : 'sitebot'
        })

pool.getConnection(function(err, connection) {

  var str = query.data;
  var res = str.split(" ");
  console.log('res is:', res[0]);
  var zapros = query.message.chat.id;

    connection.query('UPDATE users SET pol = ? WHERE id_user = ? AND vibor = "passenger" AND pol IS NULL',[res[0], zapros], function(err, rows, fields) {
      if (err) throw err;
    })

})
}


function tel(msg){
        var mysql  = require('mysql');
        var pool = mysql.createPool({
        host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
        database : 'sitebot'
        })

var phone = msg.text;
var zapros = msg.chat.id;

pool.getConnection(function(err, connection) {

    connection.query('UPDATE users SET tel = ?, date =  NOW() WHERE id_user = ? AND nomer IS NOT NULL AND tel IS NULL',[phone, zapros], function(err, rows, fields) {
      if (err) throw err;
      driv(msg);
      create_route_driver(msg);
      bot.sendMessage( zapros, '📌 Вы успешно зарегистрировались\nТеперь можете находить себе попутчиков\n📌 Чтобы найти попутчиков нажмите на "Найти попутчиков"\n📌 Чтобы изменить марку авто или гос.номер авто или номер телефона зайдите в раздел "Мои данные"\n📌 Чтобы перейти в режим пассажира нажмите "Стать пассажиром"\n\n‼️ Обязательно подпишитесь на канал t.me/popooti\nПройдите по ссылке t.me/popooti и нажмите "Подписаться"')
      bot.sendMessage( 336243307, '🚘 Еще один водитель зарегался')
    })
})
}





function nomer(msg){

        var mysql  = require('mysql');
        var pool = mysql.createPool({
        host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
        database : 'sitebot'
        })

var nomer = msg.text;
var zapros = msg.chat.id;

pool.getConnection(function(err, connection) {

    connection.query(' UPDATE users SET nomer = ? WHERE id_user = ? AND nomer IS NULL AND marka IS NOT NULL ', [nomer, zapros], function(err, rows, fields) {
      if (err) throw err;
    })
})
}


function marka(msg){
        var mysql  = require('mysql');
        var pool = mysql.createPool({
        host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
        database : 'sitebot'
        })

var marka = msg.text;
var zapros = msg.chat.id;

pool.getConnection(function(err, connection) {

      connection.query(' UPDATE users SET marka = ? WHERE id_user = ? AND marka IS NULL',[marka, zapros], function(err, rows, fields) {
      if (err) throw err; bot.sendMessage(msg.chat.id, 'Номер вашего автомобиля\nНапишите в таком формате:\nM 456 BNM');
      })

})
}


function register_pass_asdriv(query) {

        var mysql  = require('mysql');
        var pool = mysql.createPool({
        host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
        database : 'sitebot'
        })

var user_id = query.message.chat.id;

pool.getConnection(function(err, connection) {

   connection.query( ' INSERT INTO users (vibor, id_user, fname, tel) VALUES ( "driver", ? , (SELECT fname FROM users AS users1 WHERE id_user = ?), (SELECT tel FROM users AS users2 WHERE id_user = ?) ) ', [ user_id, user_id, user_id ], function(err, rows, fields) {
   if (err) throw err;
   var passenger = JSON.parse(JSON.stringify(rows));
   bot.sendMessage(user_id, 'Марка вашего автомобиля\nНапишите в таком формате:\nБелая Toyota Camry 30')
   console.log('reg as driv first')

         var mysql  = require('mysql');
         var pool  = mysql.createPool({
         host     : 'localhost',
         user     : 'mybd_user',
         password : 'admin123',
         database : 'route_driver'
         })

         var route = 'route'+user_id;
         var n_route = 'n_route'+user_id;

         pool.getConnection(function(err, connection) {

               connection.query(' CREATE TABLE ?? (id INT(100) NOT NULL AUTO_INCREMENT, begend VARCHAR (5), n_zapros INT (5) , id_user INT(11) , id_route INT(11) , district VARCHAR (20) , point_type INT(11), id_street INT(11), street VARCHAR (100), id_interception INT(11), interception VARCHAR (100), id_point VARCHAR (20) , busstop VARCHAR (100), ordinal INT(11), nearby_interception VARCHAR (80), point_parinter_min5 VARCHAR (30), point_parinter_plu5 VARCHAR (30),  time_beg DATETIME, time_end DATETIME, status VARCHAR (30), n_pass INT(11) , all_districts VARCHAR (60), PRIMARY KEY(id)) ', [ route ] ,function(err, rows, fields) {
                 if (err) throw err;
                 })

               connection.query(' CREATE TABLE ?? (id INT(100) NOT NULL AUTO_INCREMENT, id_user INT(11), route_name VARCHAR (100), start VARCHAR (20) , finish VARCHAR (20) , n_inter INT(11), PRIMARY KEY(id)) ', [ n_route ] ,function(err, rows, fields) {
                 if (err) throw err;
                 })

         })
   })
})
}



function register_driv_aspass(query) {

        var mysql  = require('mysql');
        var pool = mysql.createPool({
        host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
        database : 'sitebot'
    })

var user_id = query.message.chat.id;

pool.getConnection(function(err, connection) {


       connection.query( ' INSERT INTO users (vibor, id_user, fname, tel) VALUES ( "passenger", ? , (SELECT fname FROM users AS users1 WHERE id_user = ?), (SELECT tel FROM users AS users2 WHERE id_user = ?) ) ',
       [ user_id, user_id, user_id ],
       function(err, rows, fields) {
       if (err) throw err;

         var mysql  = require('mysql');
         var pool  = mysql.createPool({
         host     : 'localhost',
         user     : 'mybd_user',
         password : 'admin123',
         database : 'route_passenger'
         })

         var route_p = 'route_p'+user_id;
         var n_route_p = 'n_route_p'+user_id;

         pool.getConnection(function(err, connection) {

               connection.query(' CREATE TABLE ?? (id INT(100) NOT NULL AUTO_INCREMENT, begend VARCHAR (5), n_zapros INT (5) , id_user INT(11) , id_route INT(11) , district VARCHAR (20) , point_type INT(11), id_street INT(11), street VARCHAR (100), id_interception INT(11), interception VARCHAR (100), id_point VARCHAR (20) , busstop VARCHAR (100), ordinal INT(11), nearby_interception VARCHAR (80), point_parinter_min5 VARCHAR (30), point_parinter_plu5 VARCHAR (30),  time_beg DATETIME, time_end DATETIME, status VARCHAR (30), n_pass INT(11) , all_districts VARCHAR (60), PRIMARY KEY(id)) ', [ route_p ] ,function(err, rows, fields) {
                 if (err) throw err;
                 })

               connection.query(' CREATE TABLE ?? (id INT(100) NOT NULL AUTO_INCREMENT, id_user INT(11), route_name VARCHAR (100), start VARCHAR (20) , finish VARCHAR (20) , n_inter INT(11), PRIMARY KEY(id)) ', [ n_route_p ] ,function(err, rows, fields) {
                 if (err) throw err;
                 })

         })

       // Затем предлагаем указать пол
       mujorjen(query);
       })
})
}


function pass(msg){

    const chatId = msg.chat.id

    if (msg.text === 'Стать водителем'){bot.sendMessage(chatId, '.', {
                                                 reply_markup: {remove_keyboard:true}})}

    else {
    const chatId = msg.chat.id
    const text_keyboard = '🔹 Вы успешно зарегистрировались\nТеперь можете находить себе попутное авто\n\n❗️ В данный момент пока только 170 водителей в основном из Майкудука, поэтому сейчас маловероятно что вы найдете попутное авто. Как их будет 200. Мы вас обязательно уведомим.\n\n🔹 Чтобы изменить номер телефона зайдите в раздел "Мои данные"\n🔹 Чтобы перейти в режим водителя нажмите "Стать водителем"'
    bot.sendMessage(chatId, text_keyboard, main_menu_passenger)
    }
}


function pass_query(query){

    const chatId = query.message.chat.id
    if (query.data === 'yes_to_pass'){ bot.sendMessage(chatId, 'Теперь вы в режиме пассажира', main_menu_passenger)  }

}

//
var main_menu_passenger = {
      reply_markup: {
        keyboard: [
          [{
            text: '🚗 Найти авто'
          }],
          ['💾 Мои данные.'],
          [{
            text: 'Стать водителем'
          }]
        ],
        resize_keyboard: true
      }
}

var main_menu_passenger_query = {
      reply_markup: {
        keyboard: [
          [{
            text: '🚗 Найти авто'
          }],
          ['💾 Мои данные.'],
          [{
            text: 'Стать водителем'
          }]
        ],
        resize_keyboard: true
      }
}




function pass_again(query){

    const chatId = query.message.chat.id

    bot.sendMessage(chatId, 'Добро пожаловать опять!', {
      reply_markup: {
        keyboard: [
          [{
            text: '🚗 Найти авто'
          }],
          ['💾 Мои данные.'],
          [{
            text: 'Стать водителем'
          }]
        ],
        resize_keyboard: true
      }
    })
}



function choose_direction(msg) {

const chatId = msg.chat.id

//const text = 'Указав направление (ОТКУДА >> КУДА),\nПостройте свой маршрут, выбрав по порядку улицы, по которым проедите. Затем, как укажете последнюю улицу вашего маршрута, нажмите "Завершить маршрут".\n\nP.S. Когда указываете начало маршрута (стартовое пересечение), сначала выберите пересекающую улицу, а затем ту по которой поедите'

const text = 'c'

bot.sendMessage(chatId, text, {
                     reply_markup: {
                       keyboard: [
//                         [{
//                           text: 'Назад на прежний перекресток'
//                         }],

//                         [{
//                           text: 'Завершить маршрут'
//                         }],

                         [{
                           text: '⬅️ Назад на главное меню'
                         }]

                       ],
                       resize_keyboard: true
                     }
                   })

// Теперь отправляем карту
bot.sendPhoto(chatId, fs.readFileSync(__dirname + '/picture-map.png'), {
caption: 'На карте указаны границы районов'
})

bot.sendMessage(chatId, 'Выберите направление. ОТКУДА\n👇 Границы районов указаны на карте ниже списка', {
                     reply_markup: {
                      inline_keyboard: [
                         [{
                           text: 'Из майкудука',
                           callback_data: 'mkdk'
                         }],
                         [{
                           text: 'Из центра',
                           callback_data: 'grd'
                         }],
                         [{
                           text: 'Из юго-востока',
                           callback_data: 'yug'
                         }],
                         [{
                           text: 'Из района базара',
                           callback_data: 'bazar'
                         }],
                         [{
                           text: 'Из пришахтинска',
                           callback_data: 'prihon'
                         }],
                         [{
                           text: 'Из новоузенки',
                           callback_data: 'novouzenka'
                         }],
                         [{
                           text: 'Из района ЖБИ',
                           callback_data: 'zhbi'
                         }],
                         [{
                           text: 'Из сарани',
                           callback_data: 'saran'
                         }],
                         [{
                           text: 'Из малой сарани',
                           callback_data: 'malsaran'
                         }],
                         [{
                           text: 'Из актаса',
                           callback_data: 'aktas'
                         }],
                         [{
                           text: 'Из дубовки',
                           callback_data: 'dubovka'
                         }],
                         [{
                           text: 'Из федоровки',
                           callback_data: 'fedorovka'
                         }],
                         [{
                           text: 'Из сортировки',
                           callback_data: 'srt'
                         }],
                         [{
                           text: 'Из доскея',
                           callback_data: 'doskey'
                         }],
                         [{
                           text: 'Из поселка Трудовое',
                           callback_data: 'trud'
                         }],
                         [{
                           text: 'Из уштобе',
                           callback_data: 'uwtobe'
                         }]
                       ]
                     }
                   })

}



function choose_direction_to(query) {

const chatId = query.message.chat.id

bot.sendMessage(chatId, 'Выберите направление. КУДА:', {
                     reply_markup: {
                       inline_keyboard: [
                         [{
                           text: 'В майкудук',
                           callback_data: 'mkdk2'
                         }],
                         [{
                           text: 'В центр',
                           callback_data: 'grd2'
                         }],
                         [{
                           text: 'На юго-восток',
                           callback_data: 'yug2'
                         }],
                         [{
                           text: 'В район базара',
                           callback_data: 'bazar2'
                         }],
                         [{
                           text: 'В пришахтинск',
                           callback_data: 'prihon2'
                         }],
                         [{
                           text: 'В новоузенку',
                           callback_data: 'novouzenka2'
                         }],
                         [{
                           text: 'В район ЖБИ',
                           callback_data: 'zhbi2'
                         }],
                         [{
                           text: 'В сарань',
                           callback_data: 'saran2'
                         }],
                         [{
                           text: 'В малую сарань',
                           callback_data: 'malsaran2'
                         }],
                         [{
                           text: 'В актас',
                           callback_data: 'aktas2'
                         }],
                         [{
                           text: 'В дубовку',
                           callback_data: 'dubovka2'
                         }],
                         [{
                           text: 'В федоровку',
                           callback_data: 'fedorovka2'
                         }],
                         [{
                           text: 'В сортировку',
                           callback_data: 'srt2'
                         }],
                         [{
                           text: 'В доскей',
                           callback_data: 'doskey2'
                         }],
                         [{
                           text: 'В поселок Трудовое',
                           callback_data: 'trud2'
                         }],
                         [{
                           text: 'В уштобе',
                           callback_data: 'uwtobe2'
                         }]
                       ]
                     }
                   })
}



function choose_from_district_driver(query) {

var mysql  = require('mysql');
        var pool = mysql.createPool({
        host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
        database : 'route_driver'
    })

pool.getConnection(function(err, connection) {

var user_id = query.message.chat.id
var route_driver = 'route'+user_id;
var n_route = 'n_route'+user_id;
  var str = query.data;
  var res = str.split(" ");
console.log(res[0]);

if (res[0] == 'mkdk'){ var district = 'mkdk';}
else if (res[0] == 'grd'){ var district = 'grd';}
else if (res[0] == 'saran'){ var district = 'saran';}
else if (res[0] == 'aktas'){ var district = 'aktas';}
else if (res[0] == 'dubovka'){ var district = 'dubovka';}
else if (res[0] == 'fedorovka'){ var district = 'fedorovka';}
else if (res[0] == 'bazar'){ var district = 'bazar';}
else if (res[0] == 'yug'){ var district = 'yug';}
else if (res[0] == 'srt'){ var district = 'srt';}
else if (res[0] == 'doskey'){ var district = 'doskey';}
else if (res[0] == 'trud'){ var district = 'trud';}
else if (res[0] == 'uwtobe'){ var district = 'uwtobe';}
else if (res[0] == 'prihon'){ var district = 'prihon';}
else if (res[0] == 'zhbi'){ var district = 'zhbi';}
else if (res[0] == 'novouzenka'){ var district = 'novouzenka';}
else if (res[0] == 'malsaran'){ var district = 'malsaran';}

connection.query('INSERT INTO ?? (id_user, start) VALUES(?,?) ',
[ n_route, user_id, district], function(err, rows, fields) {
if (err) throw err;
console.log(rows);
})

})

choose_direction_to(query);
}





function choose_to_district_driver(query) {

var mysql  = require('mysql');
        var pool = mysql.createPool({
        host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
//        database : 'route_driver'
    })

pool.getConnection(function(err, connection) {

var user_id = query.message.chat.id;
var route_driver = 'route'+user_id;
var n_route = 'n_route'+user_id;
  var str = query.data;
  var res = str.split(" ");
console.log('choose_to_district_driver res[0]', res[0]);
console.log('choose_to_district_driver user_id', user_id);

if (res[0] == 'mkdk2'){ var district = 'mkdk';}
else if (res[0] == 'grd2'){ var district = 'grd';}
else if (res[0] == 'saran2'){ var district = 'saran';}
else if (res[0] == 'aktas2'){ var district = 'aktas';}
else if (res[0] == 'dubovka2'){ var district = 'dubovka';}
else if (res[0] == 'fedorovka2'){ var district = 'fedorovka';}
else if (res[0] == 'bazar2'){ var district = 'bazar';}
else if (res[0] == 'yug2'){ var district = 'yug';}
else if (res[0] == 'srt2'){ var district = 'srt';}
else if (res[0] == 'doskey2'){ var district = 'doskey';}
else if (res[0] == 'trud2'){ var district = 'trud';}
else if (res[0] == 'uwtobe2'){ var district = 'uwtobe';}
else if (res[0] == 'prihon2'){ var district = 'prihon';}
else if (res[0] == 'zhbi2'){ var district = 'zhbi';}
else if (res[0] == 'novouzenka2'){ var district = 'novouzenka';}
else if (res[0] == 'malsaran2'){ var district = 'malsaran';}

    connection.query(' UPDATE route_driver.?? SET finish = ? WHERE id = (SELECT MAX(id) FROM (SELECT MAX(id) FROM route_driver.??) AS route2 )',
    [ n_route, district, n_route ], function(err, rows, fields) {
    if (err) throw err;

            connection.query(' SELECT * FROM route_driver.?? WHERE id = (SELECT id FROM route_driver.?? ORDER BY id DESC LIMIT 1) ',
            [ n_route, n_route ], function(err, rows, fields) {
            if (err) throw err;
            var district = JSON.parse(JSON.stringify(rows));

// Если из юго-востока в центр
            if (district[0].start === 'yug' && district[0].finish === 'grd') {

            var all_districts = district[0].start + '00' + 'bazar' + '00' + district[0].finish;
            var test = [];
            test.push([ 'beg', user_id, district[0].id, district[0].start, all_districts ]);
            test.push([  null, user_id, district[0].id, 'bazar', all_districts ]);
            test.push([ 'end', user_id, district[0].id, district[0].finish, all_districts ]);

                    connection.query(' INSERT INTO route_driver.?? ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                    [ route_driver, test ], function(err, rows, fields) {
                    if (err) throw err;

                                connection.query(' UPDATE route_driver.?? SET time_beg = NOW(), time_end = ADDTIME (NOW(), "00:40:00") WHERE id_route = (SELECT MAX(id_route) FROM (SELECT * FROM route_driver.??) AS route2) AND id_user = ? ',
                                [ route_driver, route_driver, user_id ], function(err, rows, fields) {
                                if (err) throw err;

                                            connection.query(' INSERT INTO sitebot.route ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                                            [ test ], function(err, rows, fields) {
                                            if (err) throw err;

                                                        connection.query(' UPDATE sitebot.route SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT id_route FROM route_driver.?? WHERE id_user = ? ORDER BY id_route DESC LIMIT 1 ) AND id_user = ? ',
                                                        [ route_driver , user_id, user_id ], function(err, rows, fields) {
                                                        if (err) throw err;

                                                        send_rayon_poputi_query (query)

                                                        var text = all_districts + ' юзер ' + user_id;
                                                        bot.sendMessage(336243307, text)
                                                        })
                                            })
                                })
                    })
            }
// Если из центра в юго-восток
            else if (district[0].start === 'grd' && district[0].finish === 'yug') {

            var all_districts = district[0].start + '00' + 'bazar' + '00' + district[0].finish;
            var test = [];
            test.push([ 'beg', user_id, district[0].id, district[0].start, all_districts ]);
            test.push([  null, user_id, district[0].id, 'bazar', all_districts ]);
            test.push([ 'end', user_id, district[0].id, district[0].finish, all_districts ]);

                    connection.query(' INSERT INTO route_driver.?? ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                    [ route_driver, test ], function(err, rows, fields) {
                    if (err) throw err;

                                connection.query(' UPDATE route_driver.?? SET time_beg = NOW(), time_end = ADDTIME (NOW(), "00:40:00") WHERE id_route = (SELECT MAX(id_route) FROM (SELECT * FROM route_driver.??) AS route2) AND id_user = ? ',
                                [ route_driver, route_driver, user_id ], function(err, rows, fields) {
                                if (err) throw err;

                                            connection.query(' INSERT INTO sitebot.route ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                                            [ test ], function(err, rows, fields) {
                                            if (err) throw err;

                                                        connection.query(' UPDATE sitebot.route SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT id_route FROM route_driver.?? WHERE id_user = ? ORDER BY id_route DESC LIMIT 1 ) AND id_user = ? ',
                                                        [ route_driver , user_id, user_id ], function(err, rows, fields) {
                                                        if (err) throw err;

                                                        send_rayon_poputi_query (query)

                                                        var text = all_districts + ' юзер ' + user_id;
                                                        bot.sendMessage(336243307, text)
                                                        })
                                            })
                                })
                    })

            }
// Если из юго-востока в прихонь
            else if (district[0].start === 'yug' && district[0].finish === 'prihon') {

            var all_districts = district[0].start + '00' + 'bazar' + '00' + 'grd' + '00' + district[0].finish;
            var test = [];
            test.push([ 'beg', user_id, district[0].id, district[0].start, all_districts ]);
            test.push([  null, user_id, district[0].id, 'bazar', all_districts ]);
            test.push([  null, user_id, district[0].id, 'grd', all_districts ]);
            test.push([ 'end', user_id, district[0].id, district[0].finish, all_districts ]);

                    connection.query(' INSERT INTO route_driver.?? ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                    [ route_driver, test ], function(err, rows, fields) {
                    if (err) throw err;

                                connection.query(' UPDATE route_driver.?? SET time_beg = NOW(), time_end = ADDTIME (NOW(), "00:40:00") WHERE id_route = (SELECT MAX(id_route) FROM (SELECT * FROM route_driver.??) AS route2) AND id_user = ? ',
                                [ route_driver, route_driver, user_id ], function(err, rows, fields) {
                                if (err) throw err;

                                            connection.query(' INSERT INTO sitebot.route ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                                            [ test ], function(err, rows, fields) {
                                            if (err) throw err;

                                                        connection.query(' UPDATE sitebot.route SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT id_route FROM route_driver.?? WHERE id_user = ? ORDER BY id_route DESC LIMIT 1 ) AND id_user = ? ',
                                                        [ route_driver , user_id, user_id ], function(err, rows, fields) {
                                                        if (err) throw err;

                                                        send_rayon_poputi_query (query)

                                                        var text = all_districts + ' юзер ' + user_id;
                                                        bot.sendMessage(336243307, text)
                                                        })
                                            })
                                })
                    })

            }
// Если из прихони в юго-восток
            else if (district[0].start === 'prihon' && district[0].finish === 'yug') {

            var all_districts = district[0].start + '00' + 'grd' + '00' + 'bazar' + '00' + district[0].finish;
            var test = [];
            test.push([ 'beg', user_id, district[0].id, district[0].start, all_districts ]);
            test.push([  null, user_id, district[0].id, 'grd', all_districts ]);
            test.push([  null, user_id, district[0].id, 'bazar', all_districts ]);
            test.push([ 'end', user_id, district[0].id, district[0].finish, all_districts ]);

                    connection.query(' INSERT INTO route_driver.?? ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                    [ route_driver, test ], function(err, rows, fields) {
                    if (err) throw err;

                                connection.query(' UPDATE route_driver.?? SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT MAX(id_route) FROM (SELECT * FROM route_driver.??) AS route2) AND id_user = ? ',
                                [ route_driver, route_driver, user_id ], function(err, rows, fields) {
                                if (err) throw err;

                                            connection.query(' INSERT INTO sitebot.route ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                                            [ test ], function(err, rows, fields) {
                                            if (err) throw err;

                                                        connection.query(' UPDATE sitebot.route SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT id_route FROM route_driver.?? WHERE id_user = ? ORDER BY id_route DESC LIMIT 1 ) AND id_user = ? ',
                                                        [ route_driver , user_id, user_id ], function(err, rows, fields) {
                                                        if (err) throw err;

                                                        send_rayon_poputi_query (query)

                                                        var text = all_districts + ' юзер ' + user_id;
                                                        bot.sendMessage(336243307, text)
                                                        })
                                            })
                                })
                    })

            }
// Если из района базара в прихонь
            else if (district[0].start === 'bazar' && district[0].finish === 'prihon') {

            var all_districts = district[0].start + '00' + 'grd' + '00' + district[0].finish;
            var test = [];
            test.push([ 'beg', user_id, district[0].id, district[0].start, all_districts ]);
            test.push([  null, user_id, district[0].id, 'grd', all_districts ]);
            test.push([ 'end', user_id, district[0].id, district[0].finish, all_districts ]);

                    connection.query(' INSERT INTO route_driver.?? ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                    [ route_driver, test ], function(err, rows, fields) {
                    if (err) throw err;

                                connection.query(' UPDATE route_driver.?? SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT MAX(id_route) FROM (SELECT * FROM route_driver.??) AS route2) AND id_user = ? ',
                                [ route_driver, route_driver, user_id ], function(err, rows, fields) {
                                if (err) throw err;

                                            connection.query(' INSERT INTO sitebot.route ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                                            [ test ], function(err, rows, fields) {
                                            if (err) throw err;

                                                        connection.query(' UPDATE sitebot.route SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT id_route FROM route_driver.?? WHERE id_user = ? ORDER BY id_route DESC LIMIT 1 ) AND id_user = ? ',
                                                        [ route_driver , user_id, user_id ], function(err, rows, fields) {
                                                        if (err) throw err;

                                                        send_rayon_poputi_query (query)

                                                        var text = all_districts + ' юзер ' + user_id;
                                                        bot.sendMessage(336243307, text)
                                                        })
                                            })
                                })
                    })

            }
// Если из прихони в район базара
            else if (district[0].start === 'prihon' && district[0].finish === 'bazar') {

            var all_districts = district[0].start + '00' + 'grd' + '00'  + district[0].finish;
            var test = [];
            test.push([ 'beg', user_id, district[0].id, district[0].start, all_districts ]);
            test.push([  null, user_id, district[0].id, 'grd', all_districts ]);
            test.push([ 'end', user_id, district[0].id, district[0].finish, all_districts ]);

                    connection.query(' INSERT INTO route_driver.?? ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                    [ route_driver, test ], function(err, rows, fields) {
                    if (err) throw err;

                                connection.query(' UPDATE route_driver.?? SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT MAX(id_route) FROM (SELECT * FROM route_driver.??) AS route2) AND id_user = ? ',
                                [ route_driver, route_driver, user_id ], function(err, rows, fields) {
                                if (err) throw err;

                                            connection.query(' INSERT INTO sitebot.route ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                                            [ test ], function(err, rows, fields) {
                                            if (err) throw err;

                                                        connection.query(' UPDATE sitebot.route SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT id_route FROM route_driver.?? WHERE id_user = ? ORDER BY id_route DESC LIMIT 1 ) AND id_user = ? ',
                                                        [ route_driver , user_id, user_id ], function(err, rows, fields) {
                                                        if (err) throw err;

                                                        send_rayon_poputi_query (query)

                                                        var text = all_districts + ' юзер ' + user_id;
                                                        bot.sendMessage(336243307, text)
                                                        })
                                            })
                                })
                    })

            }
// Если из майкудука в федоровку
            else if (district[0].start === 'mkdk' && district[0].finish === 'fedorovka') {

            var all_districts = district[0].start + '00' + 'bazar' + '00'  + district[0].finish;
            var test = [];
            test.push([ 'beg', user_id, district[0].id, district[0].start, all_districts ]);
            test.push([  null, user_id, district[0].id, 'bazar', all_districts ]);
            test.push([ 'end', user_id, district[0].id, district[0].finish, all_districts ]);

                    connection.query(' INSERT INTO route_driver.?? ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                    [ route_driver, test ], function(err, rows, fields) {
                    if (err) throw err;

                                connection.query(' UPDATE route_driver.?? SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT MAX(id_route) FROM (SELECT * FROM route_driver.??) AS route2) AND id_user = ? ',
                                [ route_driver, route_driver, user_id ], function(err, rows, fields) {
                                if (err) throw err;

                                            connection.query(' INSERT INTO sitebot.route ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                                            [ test ], function(err, rows, fields) {
                                            if (err) throw err;

                                                        connection.query(' UPDATE sitebot.route SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT id_route FROM route_driver.?? WHERE id_user = ? ORDER BY id_route DESC LIMIT 1 ) AND id_user = ? ',
                                                        [ route_driver , user_id, user_id ], function(err, rows, fields) {
                                                        if (err) throw err;

                                                        send_rayon_poputi_query (query)

                                                        var text = all_districts + ' юзер ' + user_id;
                                                        bot.sendMessage(336243307, text)
                                                        })
                                            })
                                })
                    })

            }
// Если из федоровки в майкудук
            else if (district[0].start === 'fedorovka' && district[0].finish === 'mkdk') {

            var all_districts = district[0].start + '00' + 'bazar' + '00'  + district[0].finish;
            var test = [];
            test.push([ 'beg', user_id, district[0].id, district[0].start, all_districts ]);
            test.push([  null, user_id, district[0].id, 'bazar', all_districts ]);
            test.push([ 'end', user_id, district[0].id, district[0].finish, all_districts ]);

                    connection.query(' INSERT INTO route_driver.?? ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                    [ route_driver, test ], function(err, rows, fields) {
                    if (err) throw err;

                                connection.query(' UPDATE route_driver.?? SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT MAX(id_route) FROM (SELECT * FROM route_driver.??) AS route2) AND id_user = ? ',
                                [ route_driver, route_driver, user_id ], function(err, rows, fields) {
                                if (err) throw err;

                                            connection.query(' INSERT INTO sitebot.route ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                                            [ test ], function(err, rows, fields) {
                                            if (err) throw err;

                                                        connection.query(' UPDATE sitebot.route SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT id_route FROM route_driver.?? WHERE id_user = ? ORDER BY id_route DESC LIMIT 1 ) AND id_user = ? ',
                                                        [ route_driver , user_id, user_id ], function(err, rows, fields) {
                                                        if (err) throw err;

                                                        send_rayon_poputi_query (query)

                                                        var text = all_districts + ' юзер ' + user_id;
                                                        bot.sendMessage(336243307, text)
                                                        })
                                            })
                                })
                    })

            }
// Если из сарани в район базара
            else if (district[0].start === 'saran' && district[0].finish === 'bazar') {

            var all_districts = district[0].start + '00' + 'grd' + '00'  + district[0].finish;
            var test = [];
            test.push([ 'beg', user_id, district[0].id, district[0].start, all_districts ]);
            test.push([  null, user_id, district[0].id, 'grd', all_districts ]);
            test.push([ 'end', user_id, district[0].id, district[0].finish, all_districts ]);

                    connection.query(' INSERT INTO route_driver.?? ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                    [ route_driver, test ], function(err, rows, fields) {
                    if (err) throw err;

                                connection.query(' UPDATE route_driver.?? SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT MAX(id_route) FROM (SELECT * FROM route_driver.??) AS route2) AND id_user = ? ',
                                [ route_driver, route_driver, user_id ], function(err, rows, fields) {
                                if (err) throw err;

                                            connection.query(' INSERT INTO sitebot.route ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                                            [ test ], function(err, rows, fields) {
                                            if (err) throw err;

                                                        connection.query(' UPDATE sitebot.route SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT id_route FROM route_driver.?? WHERE id_user = ? ORDER BY id_route DESC LIMIT 1 ) AND id_user = ? ',
                                                        [ route_driver , user_id, user_id ], function(err, rows, fields) {
                                                        if (err) throw err;

                                                        send_rayon_poputi_query (query)

                                                        var text = all_districts + ' юзер ' + user_id;
                                                        bot.sendMessage(336243307, text)
                                                        })
                                            })
                                })
                    })

            }
// Если с района базара в сарань
            else if (district[0].start === 'bazar' && district[0].finish === 'saran') {

            var all_districts = district[0].start + '00' + 'grd' + '00'  + district[0].finish;
            var test = [];
            test.push([ 'beg', user_id, district[0].id, district[0].start, all_districts ]);
            test.push([  null, user_id, district[0].id, 'grd', all_districts ]);
            test.push([ 'end', user_id, district[0].id, district[0].finish, all_districts ]);

                    connection.query(' INSERT INTO route_driver.?? ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                    [ route_driver, test ], function(err, rows, fields) {
                    if (err) throw err;

                                connection.query(' UPDATE route_driver.?? SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT MAX(id_route) FROM (SELECT * FROM route_driver.??) AS route2) AND id_user = ? ',
                                [ route_driver, route_driver, user_id ], function(err, rows, fields) {
                                if (err) throw err;

                                            connection.query(' INSERT INTO sitebot.route ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                                            [ test ], function(err, rows, fields) {
                                            if (err) throw err;

                                                        connection.query(' UPDATE sitebot.route SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT id_route FROM route_driver.?? WHERE id_user = ? ORDER BY id_route DESC LIMIT 1 ) AND id_user = ? ',
                                                        [ route_driver , user_id, user_id ], function(err, rows, fields) {
                                                        if (err) throw err;

                                                        send_rayon_poputi_query (query)

                                                        var text = all_districts + ' юзер ' + user_id;
                                                        bot.sendMessage(336243307, text)
                                                        })
                                            })
                                })
                    })

            }
// Если из сарани в юго-восток
            else if (district[0].start === 'saran' && district[0].finish === 'yug') {

            var all_districts = district[0].start + '00' + 'grd' + '00'  + 'bazar' + '00'  + district[0].finish;
            var test = [];
            test.push([ 'beg', user_id, district[0].id, district[0].start, all_districts ]);
            test.push([  null, user_id, district[0].id, 'grd', all_districts ]);
            test.push([  null, user_id, district[0].id, 'bazar', all_districts ]);
            test.push([ 'end', user_id, district[0].id, district[0].finish, all_districts ]);

                    connection.query(' INSERT INTO route_driver.?? ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                    [ route_driver, test ], function(err, rows, fields) {
                    if (err) throw err;

                                connection.query(' UPDATE route_driver.?? SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT MAX(id_route) FROM (SELECT * FROM route_driver.??) AS route2) AND id_user = ? ',
                                [ route_driver, route_driver, user_id ], function(err, rows, fields) {
                                if (err) throw err;

                                            connection.query(' INSERT INTO sitebot.route ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                                            [ test ], function(err, rows, fields) {
                                            if (err) throw err;

                                                        connection.query(' UPDATE sitebot.route SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT id_route FROM route_driver.?? WHERE id_user = ? ORDER BY id_route DESC LIMIT 1 ) AND id_user = ? ',
                                                        [ route_driver , user_id, user_id ], function(err, rows, fields) {
                                                        if (err) throw err;

                                                        send_rayon_poputi_query (query)

                                                        var text = all_districts + ' юзер ' + user_id;
                                                        bot.sendMessage(336243307, text)
                                                        })
                                            })
                                })
                    })

            }
// Если из юго-востока в сарань
            else if (district[0].start === 'yug' && district[0].finish === 'saran') {

            var all_districts = district[0].start + '00' + 'bazar' + '00' + 'grd' + '00'  + district[0].finish;
            var test = [];
            test.push([ 'beg', user_id, district[0].id, district[0].start, all_districts ]);
            test.push([  null, user_id, district[0].id, 'bazar', all_districts ]);
            test.push([  null, user_id, district[0].id, 'grd', all_districts ]);
            test.push([ 'end', user_id, district[0].id, district[0].finish, all_districts ]);

                    connection.query(' INSERT INTO route_driver.?? ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                    [ route_driver, test ], function(err, rows, fields) {
                    if (err) throw err;

                                connection.query(' UPDATE route_driver.?? SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT MAX(id_route) FROM (SELECT * FROM route_driver.??) AS route2) AND id_user = ? ',
                                [ route_driver, route_driver, user_id ], function(err, rows, fields) {
                                if (err) throw err;

                                            connection.query(' INSERT INTO sitebot.route ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                                            [ test ], function(err, rows, fields) {
                                            if (err) throw err;

                                                        connection.query(' UPDATE sitebot.route SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT id_route FROM route_driver.?? WHERE id_user = ? ORDER BY id_route DESC LIMIT 1 ) AND id_user = ? ',
                                                        [ route_driver , user_id, user_id ], function(err, rows, fields) {
                                                        if (err) throw err;

                                                        send_rayon_poputi_query (query)

                                                        var text = all_districts + ' юзер ' + user_id;
                                                        bot.sendMessage(336243307, text)
                                                        })
                                            })
                                })
                    })

            }
// Если из актаса в юго-восток
            else if (district[0].start === 'aktas' && district[0].finish === 'yug') {

            var all_districts = district[0].start + '00' + 'grd' + '00'  + 'bazar' + '00'  + district[0].finish;
            var test = [];
            test.push([ 'beg', user_id, district[0].id, district[0].start, all_districts ]);
            test.push([  null, user_id, district[0].id, 'grd', all_districts ]);
            test.push([  null, user_id, district[0].id, 'bazar', all_districts ]);
            test.push([ 'end', user_id, district[0].id, district[0].finish, all_districts ]);

                    connection.query(' INSERT INTO route_driver.?? ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                    [ route_driver, test ], function(err, rows, fields) {
                    if (err) throw err;

                                connection.query(' UPDATE route_driver.?? SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT MAX(id_route) FROM (SELECT * FROM route_driver.??) AS route2) AND id_user = ? ',
                                [ route_driver, route_driver, user_id ], function(err, rows, fields) {
                                if (err) throw err;

                                            connection.query(' INSERT INTO sitebot.route ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                                            [ test ], function(err, rows, fields) {
                                            if (err) throw err;

                                                        connection.query(' UPDATE sitebot.route SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT id_route FROM route_driver.?? WHERE id_user = ? ORDER BY id_route DESC LIMIT 1 ) AND id_user = ? ',
                                                        [ route_driver , user_id, user_id ], function(err, rows, fields) {
                                                        if (err) throw err;

                                                        send_rayon_poputi_query (query)

                                                        var text = all_districts + ' юзер ' + user_id;
                                                        bot.sendMessage(336243307, text)
                                                        })
                                            })
                                })
                    })

            }
// Если из юго-востока в актас
            else if (district[0].start === 'yug' && district[0].finish === 'aktas') {

            var all_districts = district[0].start + '00' + 'bazar' + '00' + 'grd' + '00'  + district[0].finish;
            var test = [];
            test.push([ 'beg', user_id, district[0].id, district[0].start, all_districts ]);
            test.push([  null, user_id, district[0].id, 'bazar', all_districts ]);
            test.push([  null, user_id, district[0].id, 'grd', all_districts ]);
            test.push([ 'end', user_id, district[0].id, district[0].finish, all_districts ]);

                    connection.query(' INSERT INTO route_driver.?? ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                    [ route_driver, test ], function(err, rows, fields) {
                    if (err) throw err;

                                connection.query(' UPDATE route_driver.?? SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT MAX(id_route) FROM (SELECT * FROM route_driver.??) AS route2) AND id_user = ? ',
                                [ route_driver, route_driver, user_id ], function(err, rows, fields) {
                                if (err) throw err;

                                            connection.query(' INSERT INTO sitebot.route ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                                            [ test ], function(err, rows, fields) {
                                            if (err) throw err;

                                                        connection.query(' UPDATE sitebot.route SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT id_route FROM route_driver.?? WHERE id_user = ? ORDER BY id_route DESC LIMIT 1 ) AND id_user = ? ',
                                                        [ route_driver , user_id, user_id ], function(err, rows, fields) {
                                                        if (err) throw err;

                                                        send_rayon_poputi_query (query)

                                                        var text = all_districts + ' юзер ' + user_id;
                                                        bot.sendMessage(336243307, text)
                                                        })
                                            })
                                })
                    })

            }
// Если из актаса в район базара
            else if (district[0].start === 'aktas' && district[0].finish === 'bazar') {

            var all_districts = district[0].start + '00' + 'grd' + '00'  + district[0].finish;
            var test = [];
            test.push([ 'beg', user_id, district[0].id, district[0].start, all_districts ]);
            test.push([  null, user_id, district[0].id, 'grd', all_districts ]);
            test.push([ 'end', user_id, district[0].id, district[0].finish, all_districts ]);

                    connection.query(' INSERT INTO route_driver.?? ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                    [ route_driver, test ], function(err, rows, fields) {
                    if (err) throw err;

                                connection.query(' UPDATE route_driver.?? SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT MAX(id_route) FROM (SELECT * FROM route_driver.??) AS route2) AND id_user = ? ',
                                [ route_driver, route_driver, user_id ], function(err, rows, fields) {
                                if (err) throw err;

                                            connection.query(' INSERT INTO sitebot.route ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                                            [ test ], function(err, rows, fields) {
                                            if (err) throw err;

                                                        connection.query(' UPDATE sitebot.route SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT id_route FROM route_driver.?? WHERE id_user = ? ORDER BY id_route DESC LIMIT 1 ) AND id_user = ? ',
                                                        [ route_driver , user_id, user_id ], function(err, rows, fields) {
                                                        if (err) throw err;

                                                        send_rayon_poputi_query (query)

                                                        var text = all_districts + ' юзер ' + user_id;
                                                        bot.sendMessage(336243307, text)
                                                        })
                                            })
                                })
                    })

            }
// Если с района базара в актас
            else if (district[0].start === 'bazar' && district[0].finish === 'aktas') {

            var all_districts = district[0].start + '00' + 'grd' + '00'  + district[0].finish;
            var test = [];
            test.push([ 'beg', user_id, district[0].id, district[0].start, all_districts ]);
            test.push([  null, user_id, district[0].id, 'grd', all_districts ]);
            test.push([ 'end', user_id, district[0].id, district[0].finish, all_districts ]);

                    connection.query(' INSERT INTO route_driver.?? ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                    [ route_driver, test ], function(err, rows, fields) {
                    if (err) throw err;

                                connection.query(' UPDATE route_driver.?? time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT MAX(id_route) FROM (SELECT * FROM route_driver.??) AS route2) AND id_user = ? ',
                                [ route_driver, route_driver, user_id ], function(err, rows, fields) {
                                if (err) throw err;

                                            connection.query(' INSERT INTO sitebot.route ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                                            [ test ], function(err, rows, fields) {
                                            if (err) throw err;

                                                        connection.query(' UPDATE sitebot.route SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT id_route FROM route_driver.?? WHERE id_user = ? ORDER BY id_route DESC LIMIT 1 ) AND id_user = ? ',
                                                        [ route_driver , user_id, user_id ], function(err, rows, fields) {
                                                        if (err) throw err;

                                                        send_rayon_poputi_query (query)

                                                        var text = all_districts + ' юзер ' + user_id;
                                                        bot.sendMessage(336243307, text)
                                                        })
                                            })
                                })
                    })

            }
// Если из дубовки в юго-восток
            else if (district[0].start === 'dubovka' && district[0].finish === 'yug') {

            var all_districts = district[0].start + '00' + 'grd' + '00'  + 'bazar' + '00'  + district[0].finish;
            var test = [];
            test.push([ 'beg', user_id, district[0].id, district[0].start, all_districts ]);
            test.push([  null, user_id, district[0].id, 'grd', all_districts ]);
            test.push([  null, user_id, district[0].id, 'bazar', all_districts ]);
            test.push([ 'end', user_id, district[0].id, district[0].finish, all_districts ]);

                    connection.query(' INSERT INTO route_driver.?? ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                    [ route_driver, test ], function(err, rows, fields) {
                    if (err) throw err;

                                connection.query(' UPDATE route_driver.?? SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT MAX(id_route) FROM (SELECT * FROM route_driver.??) AS route2) AND id_user = ? ',
                                [ route_driver, route_driver, user_id ], function(err, rows, fields) {
                                if (err) throw err;

                                            connection.query(' INSERT INTO sitebot.route ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                                            [ test ], function(err, rows, fields) {
                                            if (err) throw err;

                                                        connection.query(' UPDATE sitebot.route SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT id_route FROM route_driver.?? WHERE id_user = ? ORDER BY id_route DESC LIMIT 1 ) AND id_user = ? ',
                                                        [ route_driver , user_id, user_id ], function(err, rows, fields) {
                                                        if (err) throw err;

                                                        send_rayon_poputi_query (query)

                                                        var text = all_districts + ' юзер ' + user_id;
                                                        bot.sendMessage(336243307, text)
                                                        })
                                            })
                                })
                    })

            }
// Если из юго-востока в дубовку
            else if (district[0].start === 'yug' && district[0].finish === 'dubovka') {

            var all_districts = district[0].start + '00' + 'bazar' + '00' + 'grd' + '00'  + district[0].finish;
            var test = [];
            test.push([ 'beg', user_id, district[0].id, district[0].start, all_districts ]);
            test.push([  null, user_id, district[0].id, 'bazar', all_districts ]);
            test.push([  null, user_id, district[0].id, 'grd', all_districts ]);
            test.push([ 'end', user_id, district[0].id, district[0].finish, all_districts ]);

                    connection.query(' INSERT INTO route_driver.?? ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                    [ route_driver, test ], function(err, rows, fields) {
                    if (err) throw err;

                                connection.query(' UPDATE route_driver.?? SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT MAX(id_route) FROM (SELECT * FROM route_driver.??) AS route2) AND id_user = ? ',
                                [ route_driver, route_driver, user_id ], function(err, rows, fields) {
                                if (err) throw err;

                                            connection.query(' INSERT INTO sitebot.route ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                                            [ test ], function(err, rows, fields) {
                                            if (err) throw err;

                                                        connection.query(' UPDATE sitebot.route SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT id_route FROM route_driver.?? WHERE id_user = ? ORDER BY id_route DESC LIMIT 1 ) AND id_user = ? ',
                                                        [ route_driver , user_id, user_id ], function(err, rows, fields) {
                                                        if (err) throw err;

                                                        send_rayon_poputi_query (query)

                                                        var text = all_districts + ' юзер ' + user_id;
                                                        bot.sendMessage(336243307, text)
                                                        })
                                            })
                                })
                    })

            }
// Если из дубовки в район базара
            else if (district[0].start === 'dubovka' && district[0].finish === 'bazar') {

            var all_districts = district[0].start + '00' + 'grd' + '00'  + district[0].finish;
            var test = [];
            test.push([ 'beg', user_id, district[0].id, district[0].start, all_districts ]);
            test.push([  null, user_id, district[0].id, 'grd', all_districts ]);
            test.push([ 'end', user_id, district[0].id, district[0].finish, all_districts ]);

                    connection.query(' INSERT INTO route_driver.?? ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                    [ route_driver, test ], function(err, rows, fields) {
                    if (err) throw err;

                                connection.query(' UPDATE route_driver.?? SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT MAX(id_route) FROM (SELECT * FROM route_driver.??) AS route2) AND id_user = ? ',
                                [ route_driver, route_driver, user_id ], function(err, rows, fields) {
                                if (err) throw err;

                                            connection.query(' INSERT INTO sitebot.route ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                                            [ test ], function(err, rows, fields) {
                                            if (err) throw err;

                                                        connection.query(' UPDATE sitebot.route SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT id_route FROM route_driver.?? WHERE id_user = ? ORDER BY id_route DESC LIMIT 1 ) AND id_user = ? ',
                                                        [ route_driver , user_id, user_id ], function(err, rows, fields) {
                                                        if (err) throw err;

                                                        send_rayon_poputi_query (query)

                                                        var text = all_districts + ' юзер ' + user_id;
                                                        bot.sendMessage(336243307, text)
                                                        })
                                            })
                                })
                    })

            }
// Если с района базара в дубовку
            else if (district[0].start === 'bazar' && district[0].finish === 'dubovka') {

            var all_districts = district[0].start + '00' + 'grd' + '00'  + district[0].finish;
            var test = [];
            test.push([ 'beg', user_id, district[0].id, district[0].start, all_districts ]);
            test.push([  null, user_id, district[0].id, 'grd', all_districts ]);
            test.push([ 'end', user_id, district[0].id, district[0].finish, all_districts ]);

                    connection.query(' INSERT INTO route_driver.?? ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                    [ route_driver, test ], function(err, rows, fields) {
                    if (err) throw err;

                                connection.query(' UPDATE route_driver.?? SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT MAX(id_route) FROM (SELECT * FROM route_driver.??) AS route2) AND id_user = ? ',
                                [ route_driver, route_driver, user_id ], function(err, rows, fields) {
                                if (err) throw err;

                                            connection.query(' INSERT INTO sitebot.route ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                                            [ test ], function(err, rows, fields) {
                                            if (err) throw err;

                                                        connection.query(' UPDATE sitebot.route SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT id_route FROM route_driver.?? WHERE id_user = ? ORDER BY id_route DESC LIMIT 1 ) AND id_user = ? ',
                                                        [ route_driver , user_id, user_id ], function(err, rows, fields) {
                                                        if (err) throw err;

                                                        send_rayon_poputi_query (query)

                                                        var text = all_districts + ' юзер ' + user_id;
                                                        bot.sendMessage(336243307, text)
                                                        })
                                            })
                                })
                    })

            }
// Если из юго-востока в район ЖБИ
            else if (district[0].start === 'yug' && district[0].finish === 'zhbi') {

            var all_districts = district[0].start + '00' + 'bazar' + '00' + 'grd' + '00' + district[0].finish;
            var test = [];
            test.push([ 'beg', user_id, district[0].id, district[0].start, all_districts ]);
            test.push([  null, user_id, district[0].id, 'bazar', all_districts ]);
            test.push([  null, user_id, district[0].id, 'grd', all_districts ]);
            test.push([ 'end', user_id, district[0].id, district[0].finish, all_districts ]);

                    connection.query(' INSERT INTO route_driver.?? ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                    [ route_driver, test ], function(err, rows, fields) {
                    if (err) throw err;

                                connection.query(' UPDATE route_driver.?? SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT MAX(id_route) FROM (SELECT * FROM route_driver.??) AS route2) AND id_user = ? ',
                                [ route_driver, route_driver, user_id ], function(err, rows, fields) {
                                if (err) throw err;

                                            connection.query(' INSERT INTO sitebot.route ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                                            [ test ], function(err, rows, fields) {
                                            if (err) throw err;

                                                        connection.query(' UPDATE sitebot.route SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT id_route FROM route_driver.?? WHERE id_user = ? ORDER BY id_route DESC LIMIT 1 ) AND id_user = ? ',
                                                        [ route_driver , user_id, user_id ], function(err, rows, fields) {
                                                        if (err) throw err;

                                                        send_rayon_poputi_query (query)

                                                        var text = all_districts + ' юзер ' + user_id;
                                                        bot.sendMessage(336243307, text)
                                                        })
                                            })
                                })
                    })

            }
// Если из района ЖБИ в юго-восток
            else if (district[0].start === 'zhbi' && district[0].finish === 'yug') {

            var all_districts = district[0].start + '00' + 'grd' + '00' + 'bazar' + '00' + district[0].finish;
            var test = [];
            test.push([ 'beg', user_id, district[0].id, district[0].start, all_districts ]);
            test.push([  null, user_id, district[0].id, 'grd', all_districts ]);
            test.push([  null, user_id, district[0].id, 'bazar', all_districts ]);
            test.push([ 'end', user_id, district[0].id, district[0].finish, all_districts ]);

                    connection.query(' INSERT INTO route_driver.?? ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                    [ route_driver, test ], function(err, rows, fields) {
                    if (err) throw err;

                                connection.query(' UPDATE route_driver.?? SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT MAX(id_route) FROM (SELECT * FROM route_driver.??) AS route2) AND id_user = ? ',
                                [ route_driver, route_driver, user_id ], function(err, rows, fields) {
                                if (err) throw err;

                                            connection.query(' INSERT INTO sitebot.route ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                                            [ test ], function(err, rows, fields) {
                                            if (err) throw err;

                                                        connection.query(' UPDATE sitebot.route SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT id_route FROM route_driver.?? WHERE id_user = ? ORDER BY id_route DESC LIMIT 1 ) AND id_user = ? ',
                                                        [ route_driver , user_id, user_id ], function(err, rows, fields) {
                                                        if (err) throw err;

                                                        send_rayon_poputi_query (query)

                                                        var text = all_districts + ' юзер ' + user_id;
                                                        bot.sendMessage(336243307, text)
                                                        })
                                            })
                                })
                    })

            }
// Если из района базара в район ЖБИ
            else if (district[0].start === 'bazar' && district[0].finish === 'zhbi') {

            var all_districts = district[0].start + '00' + 'grd' + '00' + district[0].finish;
            var test = [];
            test.push([ 'beg', user_id, district[0].id, district[0].start, all_districts ]);
            test.push([  null, user_id, district[0].id, 'grd', all_districts ]);
            test.push([ 'end', user_id, district[0].id, district[0].finish, all_districts ]);

                    connection.query(' INSERT INTO route_driver.?? ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                    [ route_driver, test ], function(err, rows, fields) {
                    if (err) throw err;

                                connection.query(' UPDATE route_driver.?? SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT MAX(id_route) FROM (SELECT * FROM route_driver.??) AS route2) AND id_user = ? ',
                                [ route_driver, route_driver, user_id ], function(err, rows, fields) {
                                if (err) throw err;

                                            connection.query(' INSERT INTO sitebot.route ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                                            [ test ], function(err, rows, fields) {
                                            if (err) throw err;

                                                        connection.query(' UPDATE sitebot.route SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT id_route FROM route_driver.?? WHERE id_user = ? ORDER BY id_route DESC LIMIT 1 ) AND id_user = ? ',
                                                        [ route_driver , user_id, user_id ], function(err, rows, fields) {
                                                        if (err) throw err;

                                                        send_rayon_poputi_query (query)

                                                        var text = all_districts + ' юзер ' + user_id;
                                                        bot.sendMessage(336243307, text)
                                                        })
                                            })
                                })
                    })

            }
// Если из района ЖБИ в район базара
            else if (district[0].start === 'zhbi' && district[0].finish === 'bazar') {

            var all_districts = district[0].start + '00' + 'grd' + '00'  + district[0].finish;
            var test = [];
            test.push([ 'beg', user_id, district[0].id, district[0].start, all_districts ]);
            test.push([  null, user_id, district[0].id, 'grd', all_districts ]);
            test.push([ 'end', user_id, district[0].id, district[0].finish, all_districts ]);

                    connection.query(' INSERT INTO route_driver.?? ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                    [ route_driver, test ], function(err, rows, fields) {
                    if (err) throw err;

                                connection.query(' UPDATE route_driver.?? SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT MAX(id_route) FROM (SELECT * FROM route_driver.??) AS route2) AND id_user = ? ',
                                [ route_driver, route_driver, user_id ], function(err, rows, fields) {
                                if (err) throw err;

                                            connection.query(' INSERT INTO sitebot.route ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                                            [ test ], function(err, rows, fields) {
                                            if (err) throw err;

                                                        connection.query(' UPDATE sitebot.route SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT id_route FROM route_driver.?? WHERE id_user = ? ORDER BY id_route DESC LIMIT 1 ) AND id_user = ? ',
                                                        [ route_driver , user_id, user_id ], function(err, rows, fields) {
                                                        if (err) throw err;

                                                        send_rayon_poputi_query (query)

                                                        var text = all_districts + ' юзер ' + user_id;
                                                        bot.sendMessage(336243307, text)
                                                        })
                                            })
                                })
                    })

            }
// Если из сортировки в район базара
            else if (district[0].start === 'srt' && district[0].finish === 'bazar') {

            var all_districts = district[0].start + '00' + 'mkdk' + '00'  + district[0].finish;
            var test = [];
            test.push([ 'beg', user_id, district[0].id, district[0].start, all_districts ]);
            test.push([  null, user_id, district[0].id, 'mkdk', all_districts ]);
            test.push([ 'end', user_id, district[0].id, district[0].finish, all_districts ]);

                    connection.query(' INSERT INTO route_driver.?? ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                    [ route_driver, test ], function(err, rows, fields) {
                    if (err) throw err;

                                connection.query(' UPDATE route_driver.?? SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT MAX(id_route) FROM (SELECT * FROM route_driver.??) AS route2) AND id_user = ? ',
                                [ route_driver, route_driver, user_id ], function(err, rows, fields) {
                                if (err) throw err;

                                            connection.query(' INSERT INTO sitebot.route ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                                            [ test ], function(err, rows, fields) {
                                            if (err) throw err;

                                                        connection.query(' UPDATE sitebot.route SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT id_route FROM route_driver.?? WHERE id_user = ? ORDER BY id_route DESC LIMIT 1 ) AND id_user = ? ',
                                                        [ route_driver , user_id, user_id ], function(err, rows, fields) {
                                                        if (err) throw err;

                                                        send_rayon_poputi_query (query)

                                                        var text = all_districts + ' юзер ' + user_id;
                                                        bot.sendMessage(336243307, text)
                                                        })
                                            })
                                })
                    })

            }
// Если из район базара в сортировку
            else if (district[0].start === 'bazar' && district[0].finish === 'srt') {

            var all_districts = district[0].start + '00' + 'mkdk' + '00'  + district[0].finish;
            var test = [];
            test.push([ 'beg', user_id, district[0].id, district[0].start, all_districts ]);
            test.push([  null, user_id, district[0].id, 'mkdk', all_districts ]);
            test.push([ 'end', user_id, district[0].id, district[0].finish, all_districts ]);

                    connection.query(' INSERT INTO route_driver.?? ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                    [ route_driver, test ], function(err, rows, fields) {
                    if (err) throw err;

                                connection.query(' UPDATE route_driver.?? SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT MAX(id_route) FROM (SELECT * FROM route_driver.??) AS route2) AND id_user = ? ',
                                [ route_driver, route_driver, user_id ], function(err, rows, fields) {
                                if (err) throw err;

                                            connection.query(' INSERT INTO sitebot.route ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                                            [ test ], function(err, rows, fields) {
                                            if (err) throw err;

                                                        connection.query(' UPDATE sitebot.route time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT id_route FROM route_driver.?? WHERE id_user = ? ORDER BY id_route DESC LIMIT 1 ) AND id_user = ? ',
                                                        [ route_driver , user_id, user_id ], function(err, rows, fields) {
                                                        if (err) throw err;

                                                        send_rayon_poputi_query (query)

                                                        var text = all_districts + ' юзер ' + user_id;
                                                        bot.sendMessage(336243307, text)
                                                        })
                                            })
                                })
                    })

            }
// Если из сортировки в юго-восток
            else if (district[0].start === 'srt' && district[0].finish === 'yug') {

            var all_districts = district[0].start + '00' + 'mkdk' + '00'  + district[0].finish;
            var test = [];
            test.push([ 'beg', user_id, district[0].id, district[0].start, all_districts ]);
            test.push([  null, user_id, district[0].id, 'mkdk', all_districts ]);
            test.push([ 'end', user_id, district[0].id, district[0].finish, all_districts ]);

                    connection.query(' INSERT INTO route_driver.?? ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                    [ route_driver, test ], function(err, rows, fields) {
                    if (err) throw err;

                                connection.query(' UPDATE route_driver.?? SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT MAX(id_route) FROM (SELECT * FROM route_driver.??) AS route2) AND id_user = ? ',
                                [ route_driver, route_driver, user_id ], function(err, rows, fields) {
                                if (err) throw err;

                                            connection.query(' INSERT INTO sitebot.route ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                                            [ test ], function(err, rows, fields) {
                                            if (err) throw err;

                                                        connection.query(' UPDATE sitebot.route SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT id_route FROM route_driver.?? WHERE id_user = ? ORDER BY id_route DESC LIMIT 1 ) AND id_user = ? ',
                                                        [ route_driver , user_id, user_id ], function(err, rows, fields) {
                                                        if (err) throw err;

                                                        send_rayon_poputi_query (query)

                                                        var text = all_districts + ' юзер ' + user_id;
                                                        bot.sendMessage(336243307, text)
                                                        })
                                            })
                                })
                    })

            }
// Если из юго-востока в сортировку
            else if (district[0].start === 'yug' && district[0].finish === 'srt') {

            var all_districts = district[0].start + '00' + 'mkdk' + '00'  + district[0].finish;
            var test = [];
            test.push([ 'beg', user_id, district[0].id, district[0].start, all_districts ]);
            test.push([  null, user_id, district[0].id, 'mkdk', all_districts ]);
            test.push([ 'end', user_id, district[0].id, district[0].finish, all_districts ]);

                    connection.query(' INSERT INTO route_driver.?? ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                    [ route_driver, test ], function(err, rows, fields) {
                    if (err) throw err;

                                connection.query(' UPDATE route_driver.?? SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT MAX(id_route) FROM (SELECT * FROM route_driver.??) AS route2) AND id_user = ? ',
                                [ route_driver, route_driver, user_id ], function(err, rows, fields) {
                                if (err) throw err;

                                            connection.query(' INSERT INTO sitebot.route ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                                            [ test ], function(err, rows, fields) {
                                            if (err) throw err;

                                                        connection.query(' UPDATE sitebot.route SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT id_route FROM route_driver.?? WHERE id_user = ? ORDER BY id_route DESC LIMIT 1 ) AND id_user = ? ',
                                                        [ route_driver , user_id, user_id ], function(err, rows, fields) {
                                                        if (err) throw err;

                                                        send_rayon_poputi_query (query)

                                                        var text = all_districts + ' юзер ' + user_id;
                                                        bot.sendMessage(336243307, text)
                                                        })
                                            })
                                })
                    })

            }
// Если из сортировки в центр
            else if (district[0].start === 'srt' && district[0].finish === 'grd') {

            var all_districts = district[0].start + '00' + 'mkdk' + '00'  + district[0].finish;
            var test = [];
            test.push([ 'beg', user_id, district[0].id, district[0].start, all_districts ]);
            test.push([  null, user_id, district[0].id, 'mkdk', all_districts ]);
            test.push([ 'end', user_id, district[0].id, district[0].finish, all_districts ]);

                    connection.query(' INSERT INTO route_driver.?? ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                    [ route_driver, test ], function(err, rows, fields) {
                    if (err) throw err;

                                connection.query(' UPDATE route_driver.?? SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT MAX(id_route) FROM (SELECT * FROM route_driver.??) AS route2) AND id_user = ? ',
                                [ route_driver, route_driver, user_id ], function(err, rows, fields) {
                                if (err) throw err;

                                            connection.query(' INSERT INTO sitebot.route ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                                            [ test ], function(err, rows, fields) {
                                            if (err) throw err;

                                                        connection.query(' UPDATE sitebot.route SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT id_route FROM route_driver.?? WHERE id_user = ? ORDER BY id_route DESC LIMIT 1 ) AND id_user = ? ',
                                                        [ route_driver , user_id, user_id ], function(err, rows, fields) {
                                                        if (err) throw err;

                                                        send_rayon_poputi_query (query)

                                                        var text = all_districts + ' юзер ' + user_id;
                                                        bot.sendMessage(336243307, text)
                                                        })
                                            })
                                })
                    })

            }
// Если из центра в сортировку
            else if (district[0].start === 'grd' && district[0].finish === 'srt') {

            var all_districts = district[0].start + '00' + 'mkdk' + '00'  + district[0].finish;
            var test = [];
            test.push([ 'beg', user_id, district[0].id, district[0].start, all_districts ]);
            test.push([  null, user_id, district[0].id, 'mkdk', all_districts ]);
            test.push([ 'end', user_id, district[0].id, district[0].finish, all_districts ]);

                    connection.query(' INSERT INTO route_driver.?? ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                    [ route_driver, test ], function(err, rows, fields) {
                    if (err) throw err;

                                connection.query(' UPDATE route_driver.?? SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT MAX(id_route) FROM (SELECT * FROM route_driver.??) AS route2) AND id_user = ? ',
                                [ route_driver, route_driver, user_id ], function(err, rows, fields) {
                                if (err) throw err;

                                            connection.query(' INSERT INTO sitebot.route ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                                            [ test ], function(err, rows, fields) {
                                            if (err) throw err;

                                                        connection.query(' UPDATE sitebot.route SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT id_route FROM route_driver.?? WHERE id_user = ? ORDER BY id_route DESC LIMIT 1 ) AND id_user = ? ',
                                                        [ route_driver , user_id, user_id ], function(err, rows, fields) {
                                                        if (err) throw err;

                                                        send_rayon_poputi_query (query)

                                                        var text = all_districts + ' юзер ' + user_id;
                                                        bot.sendMessage(336243307, text)
                                                        })
                                            })
                                })
                    })

            }
// Если из доскея в район базара
            else if (district[0].start === 'srt' && district[0].finish === 'doskey') {

            var all_districts = district[0].start + '00' + 'mkdk' + '00'  + district[0].finish;
            var test = [];
            test.push([ 'beg', user_id, district[0].id, district[0].start, all_districts ]);
            test.push([  null, user_id, district[0].id, 'mkdk', all_districts ]);
            test.push([ 'end', user_id, district[0].id, district[0].finish, all_districts ]);

                    connection.query(' INSERT INTO route_driver.?? ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                    [ route_driver, test ], function(err, rows, fields) {
                    if (err) throw err;

                                connection.query(' UPDATE route_driver.?? SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT MAX(id_route) FROM (SELECT * FROM route_driver.??) AS route2) AND id_user = ? ',
                                [ route_driver, route_driver, user_id ], function(err, rows, fields) {
                                if (err) throw err;

                                            connection.query(' INSERT INTO sitebot.route ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                                            [ test ], function(err, rows, fields) {
                                            if (err) throw err;

                                                        connection.query(' UPDATE sitebot.route SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT id_route FROM route_driver.?? WHERE id_user = ? ORDER BY id_route DESC LIMIT 1 ) AND id_user = ? ',
                                                        [ route_driver , user_id, user_id ], function(err, rows, fields) {
                                                        if (err) throw err;

                                                        send_rayon_poputi_query (query)

                                                        var text = all_districts + ' юзер ' + user_id;
                                                        bot.sendMessage(336243307, text)
                                                        })
                                            })
                                })
                    })

            }
// Если из район базара в доскей
            else if (district[0].start === 'doskey' && district[0].finish === 'srt') {

            var all_districts = district[0].start + '00' + 'mkdk' + '00'  + district[0].finish;
            var test = [];
            test.push([ 'beg', user_id, district[0].id, district[0].start, all_districts ]);
            test.push([  null, user_id, district[0].id, 'mkdk', all_districts ]);
            test.push([ 'end', user_id, district[0].id, district[0].finish, all_districts ]);

                    connection.query(' INSERT INTO route_driver.?? ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                    [ route_driver, test ], function(err, rows, fields) {
                    if (err) throw err;

                                connection.query(' UPDATE route_driver.?? SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT MAX(id_route) FROM (SELECT * FROM route_driver.??) AS route2) AND id_user = ? ',
                                [ route_driver, route_driver, user_id ], function(err, rows, fields) {
                                if (err) throw err;

                                            connection.query(' INSERT INTO sitebot.route ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                                            [ test ], function(err, rows, fields) {
                                            if (err) throw err;

                                                        connection.query(' UPDATE sitebot.route SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT id_route FROM route_driver.?? WHERE id_user = ? ORDER BY id_route DESC LIMIT 1 ) AND id_user = ? ',
                                                        [ route_driver , user_id, user_id ], function(err, rows, fields) {
                                                        if (err) throw err;

                                                        send_rayon_poputi_query (query)

                                                        var text = all_districts + ' юзер ' + user_id;
                                                        bot.sendMessage(336243307, text)
                                                        })
                                            })
                                })
                    })

            }
// Если из доскея в юго-восток
            else if (district[0].start === 'doskey' && district[0].finish === 'yug') {

            var all_districts = district[0].start + '00' + 'mkdk' + '00'  + district[0].finish;
            var test = [];
            test.push([ 'beg', user_id, district[0].id, district[0].start, all_districts ]);
            test.push([  null, user_id, district[0].id, 'mkdk', all_districts ]);
            test.push([ 'end', user_id, district[0].id, district[0].finish, all_districts ]);

                    connection.query(' INSERT INTO route_driver.?? ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                    [ route_driver, test ], function(err, rows, fields) {
                    if (err) throw err;

                                connection.query(' UPDATE route_driver.?? SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT MAX(id_route) FROM (SELECT * FROM route_driver.??) AS route2) AND id_user = ? ',
                                [ route_driver, route_driver, user_id ], function(err, rows, fields) {
                                if (err) throw err;

                                            connection.query(' INSERT INTO sitebot.route ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                                            [ test ], function(err, rows, fields) {
                                            if (err) throw err;

                                                        connection.query(' UPDATE sitebot.route SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT id_route FROM route_driver.?? WHERE id_user = ? ORDER BY id_route DESC LIMIT 1 ) AND id_user = ? ',
                                                        [ route_driver , user_id, user_id ], function(err, rows, fields) {
                                                        if (err) throw err;

                                                        send_rayon_poputi_query (query)

                                                        var text = all_districts + ' юзер ' + user_id;
                                                        bot.sendMessage(336243307, text)
                                                        })
                                            })
                                })
                    })

            }
// Если из юго-востока в доскей
            else if (district[0].start === 'yug' && district[0].finish === 'doskey') {

            var all_districts = district[0].start + '00' + 'mkdk' + '00'  + district[0].finish;
            var test = [];
            test.push([ 'beg', user_id, district[0].id, district[0].start, all_districts ]);
            test.push([  null, user_id, district[0].id, 'mkdk', all_districts ]);
            test.push([ 'end', user_id, district[0].id, district[0].finish, all_districts ]);

                    connection.query(' INSERT INTO route_driver.?? ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                    [ route_driver, test ], function(err, rows, fields) {
                    if (err) throw err;

                                connection.query(' UPDATE route_driver.?? SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT MAX(id_route) FROM (SELECT * FROM route_driver.??) AS route2) AND id_user = ? ',
                                [ route_driver, route_driver, user_id ], function(err, rows, fields) {
                                if (err) throw err;

                                            connection.query(' INSERT INTO sitebot.route ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                                            [ test ], function(err, rows, fields) {
                                            if (err) throw err;

                                                        connection.query(' UPDATE sitebot.route SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT id_route FROM route_driver.?? WHERE id_user = ? ORDER BY id_route DESC LIMIT 1 ) AND id_user = ? ',
                                                        [ route_driver , user_id, user_id ], function(err, rows, fields) {
                                                        if (err) throw err;

                                                        send_rayon_poputi_query (query)

                                                        var text = all_districts + ' юзер ' + user_id;
                                                        bot.sendMessage(336243307, text)
                                                        })
                                            })
                                })
                    })

            }
// Если из доскея в центр
            else if (district[0].start === 'doskey' && district[0].finish === 'grd') {

            var all_districts = district[0].start + '00' + 'mkdk' + '00'  + district[0].finish;
            var test = [];
            test.push([ 'beg', user_id, district[0].id, district[0].start, all_districts ]);
            test.push([  null, user_id, district[0].id, 'mkdk', all_districts ]);
            test.push([ 'end', user_id, district[0].id, district[0].finish, all_districts ]);

                    connection.query(' INSERT INTO route_driver.?? ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                    [ route_driver, test ], function(err, rows, fields) {
                    if (err) throw err;

                                connection.query(' UPDATE route_driver.?? SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT MAX(id_route) FROM (SELECT * FROM route_driver.??) AS route2) AND id_user = ? ',
                                [ route_driver, route_driver, user_id ], function(err, rows, fields) {
                                if (err) throw err;

                                            connection.query(' INSERT INTO sitebot.route ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                                            [ test ], function(err, rows, fields) {
                                            if (err) throw err;

                                                        connection.query(' UPDATE sitebot.route SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT id_route FROM route_driver.?? WHERE id_user = ? ORDER BY id_route DESC LIMIT 1 ) AND id_user = ? ',
                                                        [ route_driver , user_id, user_id ], function(err, rows, fields) {
                                                        if (err) throw err;

                                                        send_rayon_poputi_query (query)

                                                        var text = all_districts + ' юзер ' + user_id;
                                                        bot.sendMessage(336243307, text)
                                                        })
                                            })
                                })
                    })

            }
// Если из центра в доскей
            else if (district[0].start === 'grd' && district[0].finish === 'doskey') {

            var all_districts = district[0].start + '00' + 'mkdk' + '00'  + district[0].finish;
            var test = [];
            test.push([ 'beg', user_id, district[0].id, district[0].start, all_districts ]);
            test.push([  null, user_id, district[0].id, 'mkdk', all_districts ]);
            test.push([ 'end', user_id, district[0].id, district[0].finish, all_districts ]);

                    connection.query(' INSERT INTO route_driver.?? ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                    [ route_driver, test ], function(err, rows, fields) {
                    if (err) throw err;

                                connection.query(' UPDATE route_driver.?? SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT MAX(id_route) FROM (SELECT * FROM route_driver.??) AS route2) AND id_user = ? ',
                                [ route_driver, route_driver, user_id ], function(err, rows, fields) {
                                if (err) throw err;

                                            connection.query(' INSERT INTO sitebot.route ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                                            [ test ], function(err, rows, fields) {
                                            if (err) throw err;

                                                        connection.query(' UPDATE sitebot.route SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT id_route FROM route_driver.?? WHERE id_user = ? ORDER BY id_route DESC LIMIT 1 ) AND id_user = ? ',
                                                        [ route_driver , user_id, user_id ], function(err, rows, fields) {
                                                        if (err) throw err;

                                                        send_rayon_poputi_query (query)

                                                        var text = all_districts + ' юзер ' + user_id;
                                                        bot.sendMessage(336243307, text)
                                                        })
                                            })
                                })
                    })

            }
            else {

            var all_districts = district[0].start + '00' + district[0].finish;

            var test = [];
            test.push([ 'beg', user_id, district[0].id, district[0].start, all_districts ]);
            test.push([ 'end', user_id, district[0].id, district[0].finish, all_districts ]);

                    connection.query(' INSERT INTO route_driver.?? ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                    [ route_driver, test ], function(err, rows, fields) {
                    if (err) throw err;

                                connection.query(' UPDATE route_driver.?? SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT MAX(id_route) FROM (SELECT * FROM route_driver.??) AS route2) AND id_user = ? ',
                                [ route_driver, route_driver, user_id ], function(err, rows, fields) {
                                if (err) throw err;

                                            connection.query(' INSERT INTO sitebot.route ( begend, id_user, id_route, district, all_districts ) VALUES ? ',
                                            [ test ], function(err, rows, fields) {
                                            if (err) throw err;

                                                        connection.query(' UPDATE sitebot.route SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_route = (SELECT id_route FROM route_driver.?? WHERE id_user = ? ORDER BY id_route DESC LIMIT 1 ) AND id_user = ? ',
                                                        [ route_driver , user_id, user_id ], function(err, rows, fields) {
                                                        if (err) throw err;

                                                        send_rayon_poputi_query (query)

                                                        var text = all_districts + ' юзер ' + user_id;
                                                        bot.sendMessage(336243307, text)
                                                        })
                                            })
                                })
                    })
            }


            })

    })

})

   const chatId = query.message.chat.id
   const omenu = '📌 Сейчас бот ищет вам пассажиров, которые едут с того же района, в тот район, которые вы указали.\n 📌 Как найдет, сразу вас уведомит'
            bot.sendMessage(chatId, omenu, {
                     reply_markup: {
                       keyboard: [
                         [{
                           text: '🙋‍♂️ Найти попутчиков'
                         }],
                         ['💽 Мои данные'],
                         [{
                           text: 'Стать пассажиром'
                         }]
                       ],
                       resize_keyboard: true
                     }
                   })

//            bot.sendMessage(chatId, omenu, {
//                     reply_markup: {
//                       keyboard: [
//                         [{
//                           text: '▶️ Создать новый маршрут'
//                         }],
//
//                         [{
//                           text: '⏯ Активизировать сохраненные маршруты'
//                         }],
//
//                         [{
//                           text: '⬅️ Назад на главное меню'
//                         }]
//                       ],
//                       resize_keyboard: true
//                     }
//                   })

}



function findpas(msg){
const chatId = msg.chat.id
    const omenu = 'Чтобы найти попутного пассажира сначала укажите свой маршрут. Если вы прежде сохранили этот маршрут можете просто активизировать'
            bot.sendMessage(chatId, omenu, {
                     reply_markup: {
                       keyboard: [
                         [{
                           text: '▶️ Создать новый маршрут'
                         }],

                         [{
                           text: '⏯ Активизировать сохраненные маршруты'
                         }],

                         [{
                           text: '⬅️ Назад на главное меню'
                         }]
                       ],
                       resize_keyboard: true
                     }
                   })

}


function driv(msg){
    const chatId = msg.chat.id
    const omenu = 'Вы на главном меню'
            bot.sendMessage(chatId, omenu, {
                     reply_markup: {
                       keyboard: [
                         [{
                           text: '🙋‍♂️ Найти попутчиков'
                         }],
                         ['💽 Мои данные'],
                         [{
                           text: 'Стать пассажиром'
                         }]
                       ],
                       resize_keyboard: true
                     }
                   })
//            bot.sendVideo(chatId, fs.readFileSync(__dirname + '/video-driver.mp4'), {
//                          caption: 'Инструкция для водителей'
//                          })
}


function driv_query (query){
    const chatId = query.message.chat.id
    const omenu = 'Вы успешно зарегистрировались\nТеперь можете находить себе попутчиков\nЧтобы изменить марку авто или номер авто или номер телефона зайдите в раздел "Мои данные"\nЧтобы перейти в режим пассажира нажмите "Вы сейчас водитель"'
            bot.sendMessage(chatId, omenu, {
                     reply_markup: {
                       keyboard: [
                         [{
                           text: '🙋‍♂️ Найти попутчиков'
                         }],
                         ['💽 Мои данные'],
                         [{
                           text: 'Стать пассажиром'
                         }]
                       ],
                       resize_keyboard: true
                     }
                   })
}


function driv_again(query){
   const chatId = query.message.chat.id
   const omenu = 'вы на главном меню'
            bot.sendMessage(chatId, omenu, {
                     reply_markup: {
                       keyboard: [
                         [{
                           text: '🙋‍♂️ Найти попутчиков'
                         }],
                         ['💽 Мои данные'],
                         [{
                           text: 'Стать пассажиром'
                         }]
                       ],
                       resize_keyboard: true
                     }
                   })
}



function create_user(query) {

        var mysql  = require('mysql');
        var pool = mysql.createPool({
        host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
        database : 'sitebot'
        })

    var vibor = query.data;
    var user_id = query.message.chat.id;
    var fname = query.message.chat.first_name;

pool.getConnection(function(err, connection) {

    connection.query('INSERT INTO users (vibor, id_user, fname) VALUES(?,?,?) ',[vibor, user_id, fname], function(err, rows, fields) {
    if (err) throw err;
    console.log('inserted');
    })
})
}



function choose_street_again(msg) {

        var mysql  = require('mysql');
        var pool = mysql.createPool({
        host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
        database : 'route_driver'
        })

var user_id = msg.chat.id;
var route_driver = 'route'+user_id;
var n_route_driver = 'n_route'+user_id;

pool.getConnection(function(err, connection) {


    connection.query('SELECT * FROM kowe WHERE district1 = (SELECT start FROM ?? WHERE id = (SELECT MAX(id) FROM ??)) OR district2 = (SELECT start FROM ?? WHERE id = (SELECT MAX(id) FROM ??)) ',
    [ n_route_driver, n_route_driver, n_route_driver, n_route_driver ], function(err, rows, fields) {
    if (err) throw err;
    var interception = JSON.parse(JSON.stringify(rows));
    console.log('int chosen', interception);

    var keyboard = [];
    for(var i = 0; i < rows.length; i++){
    keyboard.push([{'text': ( interception[i].streetname ) , 'callback_data': ('beg_inter1#' + interception[i].district1 + '#' + interception[i].id_str)}]);
    }

     bot.sendMessage( msg.chat.id, 'Выберите пересекающую улицу стартового пересечения',
     {
     'reply_markup': JSON.stringify({
     inline_keyboard: keyboard
                                    })
     }
     )

    })

})
}



function choose_street_msg(msg) {

        var mysql  = require('mysql');
        var pool = mysql.createPool({
        host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
        database : 'route_driver'
        })


var user_id = msg.chat.id;
var route_driver = 'route'+user_id;
var n_route_driver = 'n_route'+user_id;

bot.sendVideo(user_id, fs.readFileSync(__dirname + '/video-driver.mp4'), {
              caption: 'Инструкция для водителей'
              })

pool.getConnection(function(err, connection) {

    connection.query('INSERT INTO ?? (begend, n_zapros, id_user, id_route) VALUES(?,?,?,(SELECT id FROM ?? WHERE id_user = ? AND id = (SELECT MAX(id) FROM ??) )) ',
    [ route_driver, 'beg', 1, user_id, n_route_driver, user_id, n_route_driver ], function(err, rows, fields) {
    if (err) throw err;


    connection.query('SELECT * FROM kowe WHERE district1 = (SELECT start FROM ?? WHERE id = (SELECT MAX(id) FROM ??)) OR district2 = (SELECT start FROM ?? WHERE id = (SELECT MAX(id) FROM ??)) ORDER BY streetname',
    [ n_route_driver, n_route_driver, n_route_driver, n_route_driver ], function(err, rows, fields) {
    if (err) throw err;
    var interception = JSON.parse(JSON.stringify(rows));
    console.log('int chosen', interception);

    var keyboard = [];
    for(var i = 0; i < rows.length; i++){
    keyboard.push([{'text': ( interception[i].streetname ) , 'callback_data': ('beg_inter1#' + interception[i].district1 + '#' + interception[i].id_str)}]);
    }

     bot.sendMessage( msg.chat.id, 'Выберите пересекающую улицу стартового пересечения',
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



function choose_street(query) {

        var mysql  = require('mysql');
        var pool = mysql.createPool({
        host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
        database : 'route_driver'
        })

var zapros = query.data;
var user_id = query.message.chat.id;
var route_driver = 'route'+user_id;
var n_route_driver = 'n_route'+user_id;

pool.getConnection(function(err, connection) {

    connection.query('INSERT INTO ?? (begend, n_zapros, id_user, id_route) VALUES(?,?,?,(SELECT id FROM ?? WHERE id_user = ? AND id = (SELECT MAX(id) FROM ??) )) ',
    [ route_driver, 'beg', 1, user_id, n_route_driver, user_id, n_route_driver ], function(err, rows, fields) {
    if (err) throw err;


    connection.query('SELECT * FROM kowe WHERE district1 = (SELECT start FROM ?? WHERE id = (SELECT MAX(id) FROM ??)) OR district2 = (SELECT start FROM ?? WHERE id = (SELECT MAX(id) FROM ??)) ORDER BY streetname',
    [ n_route_driver, n_route_driver, n_route_driver, n_route_driver ], function(err, rows, fields) {
    if (err) throw err;
    var interception = JSON.parse(JSON.stringify(rows));
    console.log('int chosen', interception);

    var keyboard = [];
    for(var i = 0; i < rows.length; i++){
    keyboard.push([{'text': ( interception[i].streetname ) , 'callback_data': ('beg_inter1#' + interception[i].district1 + '#' + interception[i].id_str)}]);
    }

     bot.sendMessage( query.message.chat.id, 'Выберите пересекающую улицу стартового пересечения',
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



function choose_beg_inter(query) {

 var mysql  = require('mysql');
        var pool  = mysql.createPool({
        host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
        database : 'route_driver'
    })

var zapros = query.data;
var user_id = query.message.chat.id;
var route_driver = 'route'+user_id;
var n_route_driver = 'n_route'+user_id;
  var str = query.data;
  var res = str.split("#");
  console.log('Район', res[1]);

pool.getConnection(function(err, connection) {

connection.query('UPDATE ?? SET id_interception = ?, interception = (SELECT streetname FROM kowe WHERE id_str = ?) WHERE begend = "beg" AND id_route = (SELECT MAX(id_route) FROM (SELECT * FROM ??) AS route2)  ',
 [ route_driver, res[2], res[2], route_driver ], function(err, rows, fields) {
})
    connection.query('SELECT * FROM points WHERE id_street = ? AND point_type = ? ORDER BY ordinal DESC', [ res[2], 1 ], function(err, rows, fields) {
    if (err) throw err;
    var street = JSON.parse(JSON.stringify(rows));
    var keyboard = [];

    for(var i = 0; i < street.length; i++){
    keyboard.push([{'text': ( street[i].interception ) , 'callback_data': ('beg_inter2#' + street[i].id_interception)}]);
    }

    bot.sendMessage( query.message.chat.id, 'Выберите вторую улицу стартового пересечения',
    {
    'reply_markup': JSON.stringify({
    inline_keyboard: keyboard
                                   })
    }
    )
    })
})

}



function choose_beg_inter2(query) {

 var mysql  = require('mysql');
        var pool  = mysql.createPool({
        host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
        database : 'route_driver'
    })


var zapros = query.data;
var user_id = query.message.chat.id;
var route_driver = 'route'+user_id;
var n_route_driver = 'n_route'+user_id;
  var str = query.data;
  var res = str.split("#");
  console.log('ID interception', res[1]);

pool.getConnection(function(err, connection) {

connection.query('SELECT * FROM points WHERE id_street = ? AND id_interception = (SELECT id_interception FROM ?? WHERE begend = "beg" ORDER BY id DESC LIMIT 1) ',
[ res[1], route_driver ], function(err, rows, fields) {
if (err) throw err;
var beg_inter = JSON.parse(JSON.stringify(rows));
console.log('Данные стрита для первого интерсепшна ', beg_inter);

connection.query(' UPDATE ?? SET street = ?, district = ?, point_type = ?, id_street = ?, id_point = ?, ordinal = ?, nearby_interception = ?, point_parinter_min5 = ?, point_parinter_plu5 = ? WHERE begend = "beg" AND id_route = (SELECT MAX(id_route) FROM (SELECT * FROM ??) AS route2) ',
[ route_driver, beg_inter[0].street, beg_inter[0].district, beg_inter[0].point_type, beg_inter[0].id_street, beg_inter[0].id_point, beg_inter[0].ordinal, beg_inter[0].nearby_interception, beg_inter[0].point_parinter_min5, beg_inter[0].point_parinter_plu5, route_driver ], function(err, rows, fields) {
})

    connection.query('SELECT * FROM points WHERE id_street = ? AND point_type = ? ', [ res[1], 1 ], function(err, rows, fields) {
    if (err) throw err;
    var street = JSON.parse(JSON.stringify(rows));
    var keyboard = [];

    for(var i = 0; i < street.length; i++){
    keyboard.push([{'text': ( street[i].interception ) , 'callback_data': ('kbd#' + street[i].id_interception)}]);
    }
    var text = 'Вы едите по улице ' + beg_inter[0].street + ' до улицы ...'
    bot.sendMessage( query.message.chat.id, text,
    {
    'reply_markup': JSON.stringify({
    inline_keyboard: keyboard
                                   })
    }
    )
    })
})
})

bot.sendMessage(user_id, 'a', {
                     reply_markup: {
                       keyboard: [
                         [{
                           text: 'Назад на прежний перекресток'
                         }],

                         [{
                           text: 'Завершить маршрут'
                         }],

                         [{
                           text: '⬅️ Назад на главное меню'
                         }]

                       ],
                       resize_keyboard: true
                     }
                   })

}




function kbd (query){

        var mysql  = require('mysql');
        var pool  = mysql.createPool({
        host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
        database : 'route_driver'
    })

var zapros = query.data;
var user_id = query.message.chat.id;
var point_type = 1;
var route_driver = 'route'+user_id;
  var str = query.data;
  var res = str.split("#");
  console.log('!! kbd !! id_inter', res[1]);


pool.getConnection(function(err, connection) {

// Выбор и ввод в БД точек пересечения между текущим и последним перекрестком

   connection.query('SELECT n_zapros, id_route, street, ordinal FROM ?? WHERE id_user = ? ORDER BY id DESC LIMIT 1 ',
   [route_driver, user_id], function(err, rows, fields) {
   if (err && str_parse_ordinal1 !== undefined) throw err;
   var str_parse_ordinal1 = JSON.parse(JSON.stringify(rows));
   console.log('!! kbd !! >> ordinal1: ', str_parse_ordinal1[0].ordinal);
   var street = str_parse_ordinal1[0].street;
   var ordinal_i = str_parse_ordinal1[0].ordinal;
   var di_route = str_parse_ordinal1[0].id_route;
   var n_zapros = str_parse_ordinal1[0].n_zapros+1;
   console.log('!! kbd !! Номер запроса',n_zapros);

         connection.query('SELECT ordinal FROM points WHERE street = (SELECT street FROM ?? ORDER BY id DESC LIMIT 1) AND id_interception = ? ',[route_driver, res[1]], function(err, rows, fields) {
         if (err) throw err;
         var str_parse_ordinal2 = JSON.parse(JSON.stringify(rows));
         console.log('!! kbd !! >> ordinal2: ', str_parse_ordinal2[0].ordinal);
         var ordinal_f = str_parse_ordinal2[0].ordinal;

         if (str_parse_ordinal2[0].ordinal > str_parse_ordinal1[0].ordinal) {

            // Выбор точек пересечения между текущим и последним перекрестком
            var insert1 = 'SELECT * FROM points WHERE  street = (SELECT street FROM ?? ORDER BY id DESC LIMIT 1) AND ordinal < ? AND ordinal > ? ORDER BY ordinal ASC';

            connection.query(insert1, [ route_driver, str_parse_ordinal2[0].ordinal, str_parse_ordinal1[0].ordinal ], function(err, rows, fields) {
            if (err) throw err;

            var str_vse = JSON.parse(JSON.stringify(rows));

            var test = [];
            for(var i = 0; i < rows.length; i++){
            test.push([ n_zapros, user_id, di_route, str_vse[i].district, str_vse[i].point_type, str_vse[i].id_street, str_vse[i].street, str_vse[i].id_interception, str_vse[i].interception, str_vse[i].id_point, str_vse[i].busstop, str_vse[i].ordinal, str_vse[i].nearby_interception, str_vse[i].point_parinter_min5, str_vse[i].point_parinter_plu5 ]);
            }
            console.log('!! kbd !! TEST между текущим и последним перекрестком', test);

// На случай если между двумя точками нет ни одной точки. Чтобы не выдавало ошибку
            if( test.length !== 0 ) {
                  // Ввод в БД точек пересечения между текущим и последним перекрестком
                  connection.query('INSERT INTO ?? (n_zapros, id_user, id_route, district, point_type, id_street, street, id_interception, interception, id_point, busstop, ordinal, nearby_interception, point_parinter_min5, point_parinter_plu5) VALUES ?', [ route_driver, test ], function(err, rows, fields) {
                  if (err) throw err;

                        // Выбор последнего перекрестка
                        var last_sql1 = ' SELECT district, point_type, id_street, street, id_interception, interception, id_point, busstop, ordinal, nearby_interception, ' +
                                        ' (SELECT point_parinter_min5 FROM points WHERE street = ? AND id_interception = ?) AS point_parinter_min5, ' +
                                        ' (SELECT point_parinter_plu5 FROM points WHERE street = ? AND id_interception = ?) AS point_parinter_plu5  ' +
                                        ' FROM points WHERE  id_street = ? AND interception = (SELECT street FROM ?? ORDER BY id DESC LIMIT 1) ';

                        connection.query( last_sql1 ,
                        [ street, res[1], street, res[1], res[1], route_driver ], function(err, rows, fields) {
                        if (err) throw err;
                        console.log(rows);
                        var str_vse = JSON.parse(JSON.stringify(rows));

                        var test0 = [];
                        for(var i = 0; i < rows.length; i++){
                            test0.push([ n_zapros, user_id, di_route, str_vse[i].district, str_vse[i].point_type, str_vse[i].id_street, str_vse[i].street, str_vse[i].id_interception, str_vse[i].interception, str_vse[i].id_point, str_vse[i].busstop, str_vse[i].ordinal, str_vse[i].nearby_interception, str_vse[i].point_parinter_min5, str_vse[i].point_parinter_plu5 ]);
                        }
                        console.log('!! kbd !! Выбор последнего перекрестка ',test0);

                               // Ввод последнего перекрестка в БД
                               connection.query('INSERT INTO ?? (n_zapros, id_user, id_route, district, point_type, id_street, street, id_interception, interception, id_point, busstop, ordinal, nearby_interception, point_parinter_min5, point_parinter_plu5) VALUES ?', [ route_driver, test0 ], function(err, rows, fields) {
                               if (err) throw err;

                               // Выдача списка улиц пользователю

                                   connection.query('SELECT * FROM points WHERE id_street = ? AND point_type = ? ORDER BY ordinal DESC ',[res[1], point_type], function(err, rows, fields) {
                                   if (err) throw err;
                                   var user = JSON.parse(JSON.stringify(rows));

                                    var keyboard = [];

                                    for(var i = 0; i < rows.length; i++){
                                    keyboard.push([{'text': ( user[i].interception ) , 'callback_data': ('kbd#' + user[i].id_interception)}]);
                                    }
                                     console.log('!! kbd !! keyboard', keyboard);


                                       var route_sql = ' SELECT DISTINCT n_zapros, street FROM ?? WHERE id_route = (SELECT id_route FROM ??  ORDER BY id_route DESC LIMIT 1)  ';

                                       connection.query( route_sql , [ route_driver, route_driver  ], function(err, rows, fields) {
                                         if (err) throw err;
                                         var route = JSON.parse(JSON.stringify(rows));
                                         if (route.length !== 0 && route.length !== 1) {
                                             console.log('!! kbd !! route-sql ',route);
                                             console.log('!! kbd !! route-sql street ',route[0].street);

                                             if (route.length%2 == 0){

                                             var text = 'Вы едите по ' + route[0].street + ' до ' + route[2].street;

                                             for(var i = 1; i < route.length/2; i++){
                                             text += '\nпо ' + route[2*i].street + ' до ' + route[2*i+1].street
                                             }

                                             text += '\nпо ' + route[route.length-1].street + ' до ...'
                                             console.log('!! kbd !! route-sql-текст ',text);
                                             }
                                             else{

                                             var text = 'Вы едите по ' + route[0].street + ' до ' + route[2].street;

                                             for(var i = 1; i < (route.length-1)/2; i++){
                                             text += '\nпо ' + route[2*i+1].street + ' до ' + route[2*i+2].street
                                             }

                                             text += '\nпо ' + route[route.length-1].street + ' до ...'
                                             console.log('!! kbd !! route-sql-текст ',text);

                                             }
                                         }
                                         else if (route.length == 1) {
                                             console.log('!! kbd !! route-sql ',route);
                                             console.log('!! kbd !! route-sql street ',route[0].street);

                                             var text = 'Вы едите по ' + route[0].street + ' до ...';
                                         }

                                                bot.sendMessage( query.message.chat.id, text,
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
             }
             else{
                        // Выбор последнего перекрестка
                        var last_sql1 = ' SELECT district, point_type, id_street, street, id_interception, interception, id_point, busstop, ordinal, nearby_interception, ' +
                                        ' (SELECT point_parinter_min5 FROM points WHERE street = ? AND id_interception = ?) AS point_parinter_min5, ' +
                                        ' (SELECT point_parinter_plu5 FROM points WHERE street = ? AND id_interception = ?) AS point_parinter_plu5  ' +
                                        ' FROM points WHERE  id_street = ? AND interception = (SELECT street FROM ?? ORDER BY id DESC LIMIT 1) ';

                        connection.query( last_sql1 ,
                        [ street, res[1], street, res[1], res[1], route_driver ], function(err, rows, fields) {
                        if (err) throw err;
                        console.log(rows);
                        var str_vse = JSON.parse(JSON.stringify(rows));

                        var test0 = [];
                        for(var i = 0; i < rows.length; i++){
                            test0.push([ n_zapros, user_id, di_route, str_vse[i].district, str_vse[i].point_type, str_vse[i].id_street, str_vse[i].street, str_vse[i].id_interception, str_vse[i].interception, str_vse[i].id_point, str_vse[i].busstop, str_vse[i].ordinal, str_vse[i].nearby_interception, str_vse[i].point_parinter_min5, str_vse[i].point_parinter_plu5 ]);
                        }
                        console.log('!! kbd !! test0',test0);

                               // Ввод последнего перекрестка в БД
                               connection.query('INSERT INTO ?? (n_zapros, id_user, id_route, district, point_type, id_street, street, id_interception, interception, id_point, busstop, ordinal, nearby_interception, point_parinter_min5, point_parinter_plu5) VALUES ?', [ route_driver, test0 ], function(err, rows, fields) {
                               if (err) throw err;

                               // Выдача списка улиц пользователю

                                   connection.query('SELECT * FROM points WHERE id_street = ? AND point_type = ? ORDER BY ordinal DESC ',[res[1], point_type], function(err, rows, fields) {
                                   if (err) throw err;
                                   var user = JSON.parse(JSON.stringify(rows));

                                    var keyboard = [];

                                    for(var i = 0; i < rows.length; i++){
                                    keyboard.push([{'text': ( user[i].interception ) , 'callback_data': ('kbd#' + user[i].id_interception)}]);
                                    }
                                    console.log('!! kbd !! keyboard', keyboard);

                                       var route_sql = ' SELECT DISTINCT n_zapros, street FROM ?? WHERE id_route = (SELECT id_route FROM ??  ORDER BY id_route DESC LIMIT 1)  ';

                                       connection.query( route_sql , [ route_driver, route_driver  ], function(err, rows, fields) {
                                         if (err) throw err;
                                         var route = JSON.parse(JSON.stringify(rows));
                                         if (route.length !== 0 && route.length !== 1) {
                                             console.log('!! kbd !! route-sql ',route);
                                             console.log('!! kbd !! route-sql street ',route[0].street);

                                             if (route.length%2 == 0){

                                             var text = 'Вы едите по ' + route[0].street + ' до ' + route[2].street;

                                             for(var i = 1; i < route.length/2; i++){
                                             text += '\nпо ' + route[2*i].street + ' до ' + route[2*i+1].street
                                             }

                                             text += '\nпо ' + route[route.length-1].street + ' до ...'
                                             console.log('!! kbd !! route-sql-текст ',text);
                                             }
                                             else{

                                             var text = 'Вы едите по ' + route[0].street + ' до ' + route[2].street;

                                             for(var i = 1; i < (route.length-1)/2; i++){
                                             text += '\nпо ' + route[2*i+1].street + ' до ' + route[2*i+2].street
                                             }

                                             text += '\nпо ' + route[route.length-1].street + ' до ...'
                                             console.log('!! kbd !! route-sql-текст ',text);

                                             }
                                         }
                                         else if (route.length == 1) {
                                             console.log('!! kbd !! route-sql ',route);
                                             console.log('!! kbd !! route-sql street ',route[0].street);

                                             var text = 'Вы едите по ' + route[0].street + ' до ...';
                                         }

                                                bot.sendMessage( query.message.chat.id, text,
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
            })
         }

// Если же str_parse_ordinal2[0].ordinal < str_parse_ordinal1[0].ordinal, то выполняется следующий код..
         else {

         // Выбор точек пересечения между текущим и последним перекрестком
         var insert2 = 'SELECT district, point_type, id_street, street, id_interception, interception, id_point, busstop, ordinal, nearby_interception FROM points WHERE street = (SELECT street FROM ?? ORDER BY id DESC LIMIT 1) AND  ordinal > ? AND ordinal < ?  ORDER BY (CASE WHEN ? > ? THEN ordinal END) ASC, (CASE WHEN ? < ? THEN ordinal END) DESC ';

         connection.query(insert2, [ route_driver, str_parse_ordinal2[0].ordinal, str_parse_ordinal1[0].ordinal, str_parse_ordinal2[0].ordinal, str_parse_ordinal1[0].ordinal, str_parse_ordinal2[0].ordinal, str_parse_ordinal1[0].ordinal], function(err, rows, fields) {
         if (err) throw err;
console.log('!! kbd !! ROWWWSSSS str_parse_ordinal2[0].ordinal < str_parse_ordinal1[0].ordinal',rows);
         var str_vse2 = JSON.parse(JSON.stringify(rows));

console.log('!! kbd !! user_id',user_id);
console.log('!! kbd !! di_route',di_route);
         var test2 = [];
         for(var i = 0; i < rows.length; i++){
             test2.push([ n_zapros, user_id, di_route, str_vse2[i].district, str_vse2[i].point_type, str_vse2[i].id_street, str_vse2[i].street, str_vse2[i].id_interception, str_vse2[i].interception, str_vse2[i].id_point, str_vse2[i].busstop, str_vse2[i].ordinal, str_vse2[i].nearby_interception, str_vse2[i].point_parinter_min5, str_vse2[i].point_parinter_plu5 ]);
         }
         console.log('!! kbd !! TEST2',test2);

// На случай если между двумя точками нет ни одной точки. Чтобы не выдавало ошибку
         if( test2.length !== 0 ) {
             // Ввод в БД точек пересечения между текущим и последним перекрестком
             connection.query( 'INSERT INTO ?? (n_zapros, id_user, id_route, district, point_type, id_street, street, id_interception, interception, id_point, busstop, ordinal, nearby_interception, point_parinter_min5, point_parinter_plu5) VALUES ? ', [ route_driver, test2 ], function(err, rows, fields) {
             if (err) throw err;

                        // Выбор последнего перекрестка
                        var last_sql1 = ' SELECT district, point_type, id_street, street, id_interception, interception, id_point, busstop, ordinal, nearby_interception, ' +
                                        ' (SELECT point_parinter_min5 FROM points WHERE street = ? AND id_interception = ?) AS point_parinter_min5, ' +
                                        ' (SELECT point_parinter_plu5 FROM points WHERE street = ? AND id_interception = ?) AS point_parinter_plu5  ' +
                                        ' FROM points WHERE  id_street = ? AND interception = (SELECT street FROM ?? ORDER BY id DESC LIMIT 1) ';

                        connection.query( last_sql1 ,
                        [ street, res[1], street, res[1], res[1], route_driver ], function(err, rows, fields) {
                        if (err) throw err;
                        console.log(rows);
                        var str_vse = JSON.parse(JSON.stringify(rows));

                        var test0 = [];
                        for(var i = 0; i < rows.length; i++){
                            test0.push([ n_zapros, user_id, di_route, str_vse[i].district, str_vse[i].point_type, str_vse[i].id_street, str_vse[i].street, str_vse[i].id_interception, str_vse[i].interception, str_vse[i].id_point, str_vse[i].busstop, str_vse[i].ordinal, str_vse[i].nearby_interception, str_vse[i].point_parinter_min5, str_vse[i].point_parinter_plu5 ]);
                        }
                        console.log('!! kbd !!', test0);

                               // Ввод последнего перекрестка в БД
                               connection.query(' INSERT INTO ?? (n_zapros, id_user, id_route, district, point_type, id_street, street, id_interception, interception, id_point, busstop, ordinal, nearby_interception, point_parinter_min5, point_parinter_plu5) VALUES ? ', [ route_driver, test0 ], function(err, rows, fields) {
                               if (err) throw err;

                               // Выдача списка улиц пользователю

                                   connection.query('SELECT * FROM points WHERE id_street = ? AND point_type = ? ORDER BY ordinal DESC ',[res[1], point_type], function(err, rows, fields) {
                                   if (err) throw err;
                                   var user = JSON.parse(JSON.stringify(rows));

                                    var keyboard = [];

                                    for(var i = 0; i < rows.length; i++){
                                    keyboard.push([{'text': ( user[i].interception ) , 'callback_data': ('kbd#' + user[i].id_interception)}]);
                                    }
                                    console.log('!! kbd !! keyboard', keyboard);

                                       var route_sql = ' SELECT DISTINCT n_zapros, street FROM ?? WHERE id_route = (SELECT id_route FROM ??  ORDER BY id_route DESC LIMIT 1)  ';

                                       connection.query( route_sql , [ route_driver, route_driver  ], function(err, rows, fields) {
                                         if (err) throw err;
                                         var route = JSON.parse(JSON.stringify(rows));
                                         if (route.length !== 0 && route.length !== 1) {
                                             console.log('!! kbd !! route-sql ',route);
                                             console.log('!! kbd !! route-sql street ',route[0].street);

                                             if (route.length%2 == 0){

                                             var text = 'Вы едите по ' + route[0].street + ' до ' + route[2].street;

                                             for(var i = 1; i < route.length/2; i++){
                                             text += '\nпо ' + route[2*i].street + ' до ' + route[2*i+1].street
                                             }

                                             text += '\nпо ' + route[route.length-1].street + ' до ...'
                                             console.log('!! kbd !! route-sql-текст ',text);
                                             }
                                             else{

                                             var text = 'Вы едите по ' + route[0].street + ' до ' + route[2].street;

                                             for(var i = 1; i < (route.length-1)/2; i++){
                                             text += '\nпо ' + route[2*i+1].street + ' до ' + route[2*i+2].street
                                             }

                                             text += '\nпо ' + route[route.length-1].street + ' до ...'
                                             console.log('!! kbd !! route-sql-текст ',text);

                                             }
                                         }
                                         else if (route.length == 1) {
                                             console.log('!! kbd !! route-sql ',route);
                                             console.log('!! kbd !! route-sql street ',route[0].street);

                                             var text = 'Вы едите по ' + route[0].street + ' до ...';
                                         }

                                                bot.sendMessage( query.message.chat.id, text,
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
          }
          else{
                        // Выбор последнего перекрестка
                        var last_sql1 = ' SELECT district, point_type, id_street, street, id_interception, interception, id_point, busstop, ordinal, nearby_interception, ' +
                                        ' (SELECT point_parinter_min5 FROM points WHERE street = ? AND id_interception = ?) AS point_parinter_min5, ' +
                                        ' (SELECT point_parinter_plu5 FROM points WHERE street = ? AND id_interception = ?) AS point_parinter_plu5  ' +
                                        ' FROM points WHERE  id_street = ? AND interception = (SELECT street FROM ?? ORDER BY id DESC LIMIT 1) ';

                        connection.query( last_sql1 ,
                        [ street, res[1], street, res[1], res[1], route_driver ], function(err, rows, fields) {
                        if (err) throw err;
                        console.log(rows);
                        var str_vse = JSON.parse(JSON.stringify(rows));

                        var test0 = [];
                        for(var i = 0; i < rows.length; i++){
                            test0.push([ n_zapros, user_id, di_route, str_vse[i].district, str_vse[i].point_type, str_vse[i].id_street, str_vse[i].street, str_vse[i].id_interception, str_vse[i].interception, str_vse[i].id_point, str_vse[i].busstop, str_vse[i].ordinal, str_vse[i].nearby_interception, str_vse[i].point_parinter_min5, str_vse[i].point_parinter_plu5 ]);
                        }
                        console.log('!! kbd !! ничего МЕЖДУ ДВУМЯ ПЕРЕКРЕСТКАМИ! ');

                               // Ввод последнего перекрестка в БД
                               connection.query(' INSERT INTO ?? (n_zapros, id_user, id_route, district, point_type, id_street, street, id_interception, interception, id_point, busstop, ordinal, nearby_interception, point_parinter_min5, point_parinter_plu5) VALUES ? ', [ route_driver, test0 ], function(err, rows, fields) {
                               if (err) throw err;

                               // Выдача списка улиц пользователю

                                   connection.query('SELECT * FROM points WHERE id_street = ? AND point_type = ? ORDER BY ordinal DESC',[res[1], point_type], function(err, rows, fields) {
                                   if (err) throw err;
                                   var user = JSON.parse(JSON.stringify(rows));

                                    var keyboard = [];

                                    for(var i = 0; i < rows.length; i++){
                                    keyboard.push([{'text': ( user[i].interception ) , 'callback_data': ('kbd#' + user[i].id_interception)}]);
                                    }
                                     console.log('!! kbd !! keyboard', keyboard);


                                       var route_sql = ' SELECT DISTINCT n_zapros, street FROM ?? WHERE id_route = (SELECT id_route FROM ??  ORDER BY id_route DESC LIMIT 1)  ';

                                       connection.query( route_sql , [ route_driver, route_driver  ], function(err, rows, fields) {
                                         if (err) throw err;
                                         var route = JSON.parse(JSON.stringify(rows));
                                         if (route.length !== 0 && route.length !== 1) {
                                             console.log('!! kbd !! route-sql ',route);
                                             console.log('!! kbd !! route-sql street ',route[0].street);

                                             if (route.length%2 == 0){

                                             var text = 'Вы едите по ' + route[0].street + ' до ' + route[2].street;

                                             for(var i = 1; i < route.length/2; i++){
                                             text += '\nпо ' + route[2*i].street + ' до ' + route[2*i+1].street
                                             }

                                             text += '\nпо ' + route[route.length-1].street + ' до ...'
                                             console.log('!! kbd !! route-sql-текст ',text);
                                             }
                                             else{

                                             var text = 'Вы едите по ' + route[0].street + ' до ' + route[2].street;

                                             for(var i = 1; i < (route.length-1)/2; i++){
                                             text += '\nпо ' + route[2*i+1].street + ' до ' + route[2*i+2].street
                                             }

                                             text += '\nпо ' + route[route.length-1].street + ' до ...'
                                             console.log('!! kbd !! route-sql-текст ',text);

                                             }
                                         }
                                         else if (route.length == 1) {
                                             console.log('!! kbd !! route-sql ',route);
                                             console.log('!! kbd !! route-sql street ',route[0].street);

                                             var text = 'Вы едите по ' + route[0].street + ' до ...';
                                         }

                                                bot.sendMessage( query.message.chat.id, text,
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
         })
         }
         })

   })
})
}




function indicate_number_of_places(msg) {

const chatId = msg.chat.id
const text = 'Перед тем как указать кол-во пассажиров, вы можете сохранить этот маршрут набрав\n/route пробел и название маршрута\nНапример:\n/route С работы до дома\n\nСколько пассажиров можете забрать?'
bot.sendMessage(chatId, text, {
                     reply_markup: {
                       inline_keyboard: [
                        [{
                           text: '1',
                           callback_data: 'n_place one_pass'
                         },
                         {
                           text: '2',
                           callback_data: 'n_place two_pass'
                         },
                         {
                           text: '3',
                           callback_data: 'n_place three_pass'
                         }
                          ],

                        [{
                           text: '4',
                           callback_data: 'n_place four_pass'
                         },
                         {
                           text: '5',
                           callback_data: 'n_place five_pass'
                         },
                         {
                           text: '6',
                           callback_data: 'n_place six_pass'
                         }
                          ],

                        [{
                           text: '7',
                           callback_data: 'n_place seven_pass'
                         },
                         {
                           text: '8',
                           callback_data: 'n_place eight_pass'
                         },
                         {
                           text: '9',
                           callback_data: 'n_place nine_pass'
                         }
                          ]

                       ]
                     }
                   })
}



function end_route(query){

    var mysql      = require('mysql');
    var pool  = mysql.createPool({
    host     : 'localhost',
    user     : 'mybd_user',
    password : 'admin123',
    database : 'route_driver'
    })

var user_id = query.message.chat.id;
var route_driver = 'route'+user_id;
var n_route_driver = 'n_route'+user_id;
var route_driver = 'route'+user_id;
var zapros = query.data;
var zapros_v_massiv = zapros.split(" ");
var zapros_v_massiv2 = zapros_v_massiv.shift();
var zapros_v_massiv3 = zapros_v_massiv.join(" ");


if (zapros_v_massiv3 === 'one_pass') { var limit_place = 1 }
else if (zapros_v_massiv3 === 'two_pass') { var limit_place = 2 }
else if (zapros_v_massiv3 === 'three_pass') { var limit_place = 3 }
else if (zapros_v_massiv3 === 'four_pass') { var limit_place = 4 }
else if (zapros_v_massiv3 === 'five_pass') { var limit_place = 5 }
else if (zapros_v_massiv3 === 'six_pass') { var limit_place = 6 }
else if (zapros_v_massiv3 === 'seven_pass') { var limit_place = 7 }
else if (zapros_v_massiv3 === 'eight_pass') { var limit_place = 8 }
else { var limit_place = 9 }
console.log('N-places',limit_place);

pool.getConnection(function(err, connection) {
//connection.connect()

connection.query(' UPDATE ?? SET limit_place = ?, time_beg = NOW(), time_end = ADDTIME (NOW(), "00:40:00") WHERE id_route = (SELECT MAX(id_route) FROM (SELECT * FROM ??) AS route2) ',
[ route_driver, limit_place, route_driver ], function(err, rows, fields) {
 if (err) throw err;
console.log('Добавили колво мест и установили время');



  connection.query('SELECT id FROM ?? WHERE id_user = ? ORDER BY id DESC LIMIT 1',[ route_driver , user_id ], function (err, rows, fields) {
  if (err) throw err;
  var str_vse3 = JSON.parse(JSON.stringify(rows));
  console.log(str_vse3[0].id);

     connection.query('UPDATE ?? SET begend = ? WHERE id_user = ? AND id = ?',[ route_driver , 'end', user_id, str_vse3[0].id], function (err, rows, fields) {
     if (err) throw err;

       connection.query(' SELECT DATE_ADD(time_beg, INTERVAL  "6:0:0" DAY_SECOND) AS time_beg, DATE_ADD(time_end, INTERVAL  "6:0:0" DAY_SECOND) AS time_end FROM ?? WHERE id_route = (SELECT MAX(id_route) FROM ??) ',
       [ route_driver, route_driver ], function(err, rows, fields) {
       if (err) throw err;
       var str_vse_time = JSON.parse(JSON.stringify(rows));

          connection.query(' SELECT * FROM ?? WHERE begend = "beg" OR begend = "end" ORDER BY id DESC LIMIT 2',[ route_driver ], function (err, rows, fields) {
          if (err) throw err;
          var str_vse2 = JSON.parse(JSON.stringify(rows));
          console.log(rows);
          console.log(str_vse2);
          var pp = '%' + str_vse2[0].district + '%';
          var pp1 = '%' + str_vse2[1].district + '%';

               connection.query(' SELECT DISTINCT district FROM ?? WHERE id_route = ? AND district NOT LIKE ? AND district NOT LIKE ?  ',[ route_driver, str_vse2[0].id_route, pp, pp1 ], function (err, rows, fields) {
               if (err) throw err;
               var str_vse3 = JSON.parse(JSON.stringify(rows));
               console.log('rayon', str_vse3);
                  if (str_vse3 === [] ){
                  var all_districts = str_vse2[1].district + '00' + str_vse2[0].district;
                  console.log('all distrs if', all_districts);
                  }
                  else {
                  var all_districts0 = [];
                  for(var i = 0; i < rows.length; i++){
                  all_districts0[all_districts0.length] = rows[i].district;
                  }
                  all_districts0.unshift(str_vse2[1].district);
                  all_districts0.push(str_vse2[0].district);
                  var all_districts = all_districts0.join('00')
                  console.log('all distrs else', all_districts);
                  }

                 connection.query(' UPDATE ?? SET all_districts = ? WHERE id_route = ? ',[ route_driver, all_districts, str_vse2[0].id_route ], function (err, rows, fields) {
                 if (err) throw err;

                 connection.query('SELECT * FROM ?? WHERE id_user = ? AND id BETWEEN ? AND ? ORDER BY id ',
                 [ route_driver, user_id, str_vse2[1].id, str_vse2[0].id ], function (err, rows, fields) {
                 if (err) throw err;
                  var str_vse = JSON.parse(JSON.stringify(rows));
                  var test = [];
                  for(var i = 0; i < rows.length; i++){
                  test.push([ str_vse[i].begend, user_id, str_vse[i].district, str_vse[i].id_route, str_vse[i].point_type, str_vse[i].id_street, str_vse[i].street, str_vse[i].id_interception, str_vse[i].interception, str_vse[i].id_point, str_vse[i].busstop, str_vse[i].ordinal, str_vse[i].nearby_interception, str_vse[i].point_parinter_min5, str_vse[i].point_parinter_plu5, str_vse_time[i].time_beg, str_vse_time[i].time_end, str_vse[i].status, str_vse[i].limit_place, str_vse[i].uje_seli, str_vse[i].all_districts ]);
                  }
                  console.log('TEST', test);

// Вводим маршрут водителя в общую таблицу route в БД sitebot
                  var mysql      = require('mysql');
                  var pool  = mysql.createPool({
                  host     : 'localhost',
                  user     : 'mybd_user',
                  password : 'admin123',
                  database : 'sitebot'
                  })

                  pool.getConnection(function(err, connection) {

                      connection.query(' DELETE FROM route WHERE id_user = ? AND id_route = (SELECT id_route FROM (SELECT * FROM route) AS route2 WHERE id_user = ? ORDER BY id_route DESC LIMIT 1) ', [ user_id, user_id ], function (err, rows, fields) {
                      if (err) throw err;

                          connection.query('INSERT INTO route ( begend, id_user, district, id_route, point_type, id_street, street, id_interception, interception, id_point, busstop, ordinal, nearby_interception, point_parinter_min5, point_parinter_plu5, time_beg, time_end, status, limit_place, uje_seli, all_districts ) VALUES ? ',[ test ], function (err, rows, fields) {
                          if (err) throw err;
// Затем находим попутчиков водителю   DELETE FROM ?? WHERE n_zapros = ?


                             const text = 'По всем направлениям цена 300 тг на одного пассажира\nКроме этих направлений:\nВнутри любого района 200 тг\nРайон Базара - Юго-восток 200 тг\nРайон Базара - Федоровка 200 тг\nМайкудук - Сортировка 200 тг\nУштобе - Юго-восток 200 тг '
                             bot.sendMessage(user_id, text)

                          driv_offer_topass (query)
                          driv_offer_todriv (query)
                          notify_admin_driv_start (query)
                          })
                      })

                 })
             })
            })
          })
       })
     })
  })
})
})
})

bot.deleteMessage(query.message.chat.id, query.message.message_id)
}

bot.onText(/\/start_timer_driver/, msg => {
bot.sendMessage(msg.chat.id, 'started');
start_timer_driver(msg);
})


function start_timer_driver(msg){

    var mysql      = require('mysql');
    var pool  = mysql.createPool({
    host     : 'localhost',
    user     : 'mybd_user',
    password : 'admin123',
    database : 'sitebot'
    })

//var user_id = query.message.chat.id;
var user_id = msg.chat.id;

pool.getConnection(function(err, connection) {

connection.query(' SELECT DISTINCT id_user FROM route WHERE time_end > NOW() ', function (err, rows, fields) {
if (err) throw err;
var str_parse = JSON.parse(JSON.stringify(rows));
console.log(str_parse);
console.log(str_parse.length);
if(str_parse.length == 1){
timer.start();
}
else{}
})
})
}



function back_to_prev(msg){

    var mysql = require('mysql');
    var pool  = mysql.createPool({
    host     : 'localhost',
    user     : 'mybd_user',
    password : 'admin123',
    database : 'route_driver'
    })

var user_id = msg.chat.id;
var route_driver = 'route'+user_id;
var point_type = 1;

pool.getConnection(function(err, connection) {

connection.query('SELECT * FROM ?? WHERE id_user = ? ORDER BY id DESC LIMIT 1 ',[ route_driver, user_id ], function (err, rows, fields) {
if (err) throw err;
var str_parse = JSON.parse(JSON.stringify(rows));
var last_n_zapros = str_parse[0].n_zapros;

    if(last_n_zapros == 1 ) {
    choose_street_again(msg)
    }
    else {
       connection.query('DELETE FROM ?? WHERE n_zapros = ? ',[ route_driver, last_n_zapros ], function (err, rows, fields) {
       if (err) throw err;
       console.log('DELETED LAST ZAPROS');

                 connection.query(' SELECT * FROM points WHERE id_street = (SELECT id_street FROM ?? ORDER BY id DESC LIMIT 1) AND point_type = ? ',[route_driver, point_type], function(err, rows, fields) {
                 if (err) throw err;
                 var str_parse2 = JSON.parse(JSON.stringify(rows));
                 var by_street = str_parse2[0].street;
                 console.log('By street', by_street);
                 console.log(str_parse2);
//                 var goods = [];
//
//                 for(var i = 0; i < rows.length; i++){
//                 goods[goods.length] = rows[i].interception;
//                 }

                var keyboard = [];

                for(var i = 0; i < rows.length; i++){
                keyboard.push([{'text': ( str_parse2[i].interception ) , 'callback_data': ('kbd#' + str_parse2[i].id_interception)}]);
                }
                console.log('!! back_to_prev !! keyboard', keyboard);

                     var route_sql = ' SELECT DISTINCT n_zapros, street FROM ?? WHERE id_route = (SELECT id_route FROM ??  ORDER BY id_route DESC LIMIT 1)  ';

                     connection.query( route_sql , [ route_driver, route_driver ], function(err, rows, fields) {
                     if (err) throw err;
                     var route = JSON.parse(JSON.stringify(rows));
                     if (route.length !== 0 && route.length !== 1) {
                         console.log('route-sql ',route);
                         console.log('route-sql street ',route[0].street);

                         if (route.length%2 == 0){

                         var text = 'Вы едите по ' + route[0].street + ' до ' + route[2].street;

                         for(var i = 1; i < route.length/2; i++){
                         text += '\nпо ' + route[2*i].street + ' до ' + route[2*i+1].street
                         }

                         text += '\nпо ' + route[route.length-1].street + ' до ...'
                         console.log('route-sql-текст ',text);
                         }
                         else{

                         var text = 'Вы едите по ' + route[0].street + ' до ' + route[2].street;

                         for(var i = 1; i < (route.length-1)/2; i++){
                         text += '\nпо ' + route[2*i+1].street + ' до ' + route[2*i+2].street
                         }

                         text += '\nпо ' + route[route.length-1].street + ' до ...'
                         console.log('route-sql-текст ',text);

                         }
                     }
                     else if (route.length == 1) {
                         console.log('route-sql ',route);
                         console.log('route-sql street ',route[0].street);

                         var text = 'Вы едите по ' + route[0].street + ' до ...';
                     }

//                         bot.sendMessage(msg.chat.id, text, { reply_markup: JSON.stringify({
//                                                                         inline_keyboard: goods.map((x, xi) => ([{
//                                                                             text: x,
//                                                                             callback_data: 'kbd#' + x,
//                                                                         }])),
//
//                                                            }),})

                            bot.sendMessage( msg.chat.id, text,
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
})

})
}



function variant(msg) {
    var mysql      = require('mysql');
    var connection = mysql.createConnection({
            host     : 'localhost',
    user     : 'mybd_user',
    password : 'admin123',
    database : 'sitebot'
})

connection.connect()

connection.query('SELECT * FROM interception WHERE street = "Шахтеров" ', function(err, rows, fields) {
  if (err) throw err;
var user = JSON.stringify(rows);
console.log(user);
console.log(rows[0]);


var goods = [];

for(var i = 0; i < rows.length; i++){
goods[goods.length] = rows[i].interception;
}
const chatId = msg.chat.id

  bot.sendMessage(chatId, 'Улицы', { reply_markup: JSON.stringify({
                                                    inline_keyboard: goods.map((x, xi) => ([{
                                                        text: x,
                                                        callback_data: x,
                                                    }])),

                                       }),})


console.log(goods);

})

  connection.end()
}



function mujorjen (query){

 bot.sendMessage(query.message.chat.id, 'Выберите ваш пол:', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Мужской',
            callback_data: 'man'
          },
          {
            text: 'Женский',
            callback_data: 'woman'
          }
        ]
      ]
    }
  })
}



function mujorjen_msg (msg){

 bot.sendMessage(msg.chat.id, 'Выберите ваш пол:', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Мужской',
            callback_data: 'man msg'
          },
          {
            text: 'Женский',
            callback_data: 'woman msg'
          }
        ]
      ]
    }
  })
}



function vodorpas (msg){

 const chatId = msg.chat.id

 bot.sendMessage(chatId, 'Выберите:', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Я водитель',
            callback_data: 'driver'
          },
          {
            text: 'Я пассажир',
            callback_data: 'passenger'
          }
        ]
      ]
    }
  })
}



function vodorpas_query (query){

 const chatId = query.message.chat.id

 bot.sendMessage(chatId, 'Выберите:', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Я водитель',
            callback_data: 'driver'
          },
          {
            text: 'Я пассажир',
            callback_data: 'passenger'
          }
        ]
      ]
    }
  })
}



function vodorpas_again (msg){

 const chatId = msg.chat.id

 bot.sendMessage(chatId, 'Выберите режим:', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Режим водителя',
            callback_data: 'driver_again'
          },
          {
            text: 'Режим пассажира',
            callback_data: 'passenger_again'
          }
        ]
      ]
    }
  })
}



function create_route_driver(msg){

  var mysql  = require('mysql');
         var pool = mysql.createPool({
         host     : 'localhost',
         user     : 'mybd_user',
         password : 'admin123',
         database : 'route_driver'
      })

      var user_id = msg.chat.id;
      var route = 'route'+user_id;
      var n_route = 'n_route'+user_id;

pool.getConnection(function(err, connection) {
      connection.query(' CREATE TABLE ?? (id INT(100) NOT NULL AUTO_INCREMENT, begend VARCHAR (5), n_zapros INT (5) , id_user INT(11) , id_route INT(11) , district VARCHAR (20) , point_type INT(11) , id_street INT(11), street VARCHAR (100), id_interception INT(11), interception VARCHAR (100), id_point VARCHAR (20), busstop VARCHAR (100) , ordinal INT(11), nearby_interception VARCHAR (80), point_parinter_min5 VARCHAR (30), point_parinter_plu5 VARCHAR (30), time_beg DATETIME, time_end DATETIME, status VARCHAR (30), limit_place INT(11) , uje_seli INT(11) , all_districts VARCHAR (60), PRIMARY KEY(id)) ',[route] ,function(err, rows, fields) {
        if (err) throw err;
        })
      connection.query(' CREATE TABLE ?? (id INT(100) NOT NULL AUTO_INCREMENT, id_user INT(11), route_name VARCHAR (100), start VARCHAR (20), finish VARCHAR (20), n_inter INT(11), PRIMARY KEY(id)) ',[n_route] ,function(err, rows, fields) {
        if (err) throw err;
        })
})
}


function after_choosing_district(query) {

const chatId = query.message.chat.id
const text = ' asddd '
bot.sendMessage(chatId, text, {
                     reply_markup: {
                       keyboard: [
                         [{
                           text: 'Указать пересечение улиц'
                         }],

                         [{
                           text: 'Назад в меню'
                         }]

                       ],
                       resize_keyboard: true
                     }
                   })
}

function after_choosing_district_msg(msg) {

const chatId = msg.chat.id
const text = ' asddd '
bot.sendMessage(chatId, text, {
                     reply_markup: {
                       keyboard: [
                         [{
                           text: 'Указать пересечение улиц'
                         }],

                         [{
                           text: 'Назад в меню'
                         }]

                       ],
                       resize_keyboard: true
                     }
                   })
}


function after_choosing_beg_busstop(query) {

const chatId = query.message.chat.id
const text = 'Если неправильно указали начало вашего пути, можете исправить нажав на "Исправить начало пути"'
bot.sendMessage(chatId, text, {
                     reply_markup: {
                       keyboard: [
                         [{
                           text: 'Указать пересечение улиц.'
                         }],

                         [{
                           text: 'Исправить начало пути'
                         }],

                         [{
                           text: 'Назад в меню'
                         }]

                       ],
                       resize_keyboard: true
                     }
                   })
}


function after_choosing_end_interception (query) {

const chatId = query.message.chat.id
const text = 'Если неправильно указали конец вашего пути, можете исправить нажав на "Исправить конец пути."'
bot.sendMessage(chatId, text, {
                     reply_markup: {
                       keyboard: [
                         [{
                           text: 'Указать автобусную остановку'
                         }],

                         [{
                           text: 'Исправить конец пути.'
                         }],

                         [{
                           text: 'Назад в меню'
                         }]

                       ],
                       resize_keyboard: true
                     }
                   })
}


function after_choosing_beg_interception(query) {

const chatId = query.message.chat.id
const text = 'Если неправильно указали начало вашего пути, можете исправить нажав на "Исправить начало пути"'
bot.sendMessage(chatId, text, {
                     reply_markup: {
                       keyboard: [
                         [{
                           text: 'Указать автобусную остановку'
                         }],

                         [{
                           text: 'Исправить начало пути.'
                         }],

                         [{
                           text: 'Назад в меню'
                         }]

                       ],
                       resize_keyboard: true
                     }
                   })
}


function after_choosing_beg_interception_msg(msg) {

const chatId = msg.chat.id
const text = 'Если неправильно указали начало вашего пути, можете исправить нажав на "Исправить начало пути"'
bot.sendMessage(chatId, text, {
                     reply_markup: {
                       keyboard: [
                         [{
                           text: 'Указать автобусную остановку'
                         }],

                         [{
                           text: 'Исправить начало пути.'
                         }],

                         [{
                           text: 'Назад в меню'
                         }]

                       ],
                       resize_keyboard: true
                     }
                   })
}


function after_choosing_beg_busstop_msg(msg) {

const chatId = msg.chat.id
const text = 'Если неправильно указали начало вашего пути, можете исправить нажав на "Исправить начало пути"'
bot.sendMessage(chatId, text, {
                     reply_markup: {
                       keyboard: [
                         [{
                           text: 'Указать пересечение улиц.'
                         }],

                         [{
                           text: 'Исправить начало пути'
                         }],

                         [{
                           text: 'Назад в меню'
                         }]

                       ],
                       resize_keyboard: true
                     }
                   })
}



function after_choosing_end_busstop(query) {

const chatId = query.message.chat.id
const text = 'Если неправильно указали конец вашего пути, можете исправить нажав на "Исправить конец пути"'
bot.sendMessage(chatId, text, {
                     reply_markup: {
                       keyboard: [

                         [{
                           text: 'Исправить конец пути'
                         }],

                         [{
                           text: 'Назад в меню'
                         }]

                       ],
                       resize_keyboard: true
                     }
                   })
}


function search_regime_query(query) {

const chatId = query.message.chat.id
const text = ' Сейчас БОТ ищет попутчика. Когда найдет, отправит телефон попутчика и укажет откуда забрать\nПараллельно можете сами искать попутчиков, нажав на "Показать попутчиков по району". Если вы едете с Майкудука в центр, БОТ выдаст всех пассажиров, которые едут с Майкудука в центр'
bot.sendMessage(chatId, text, {
                     reply_markup: {
                       keyboard: [
                         [{
                           text: '🔴 Показать попутчиков по району'
                         }],

                         [{
                           text: '🔵 Отменить поиск попутчиков'
                         }],

                         [{
                           text: '⚫️ На главное меню'
                         }]

                       ],
                       resize_keyboard: true
                     }
                   })
}



function search_regime(msg) {

const chatId = msg.chat.id
const text = ' Сейчас БОТ ищет попутчика. Когда найдет, отправит телефон попутчика и укажет откуда забрать\nПараллельно можете сами искать попутчиков, нажав на "Показать попутчиков по району". Если вы едете с Майкудука в центр, БОТ выдаст всех пассажиров, которые едут с Майкудука в центр'
bot.sendMessage(chatId, text, {
                     reply_markup: {
                       keyboard: [
                         [{
                           text: '🔴 Показать попутчиков по району'
                         }],

                         [{
                           text: '🔵 Отменить поиск попутчиков'
                         }],

                         [{
                           text: '⚫️ На главное меню'
                         }]

                       ],
                       resize_keyboard: true
                     }
                   })
}


function to_busy_regime(msg) {

const chatId = msg.chat.id

var mysql  = require('mysql');
        var pool = mysql.createPool({
        host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
        database : 'sitebot'
    })

pool.getConnection(function(err, connection) {

connection.query(' UPDATE route SET status = "busy" WHERE id_user = ? ',[ chatId ], function(err, rows, fields) {
                           if (err) throw err;})
})
}


function edit_beg_interception (msg){

var mysql  = require('mysql');
        var pool = mysql.createPool({
        host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
        database : 'route_passenger'
    })

pool.getConnection(function(err, connection) {

var user_id = msg.chat.id;
var route_p = 'route_p'+user_id;
var n_route_p = 'n_route_p'+user_id;

after_choosing_district_msg(msg);

connection.query('DELETE FROM ?? WHERE id_route = (SELECT MAX(id) FROM ??) ',[ route_p, n_route_p ], function(err, rows, fields) {
                           if (err) throw err;})

    connection.query('SELECT start FROM ?? WHERE id = (SELECT MAX(id) FROM ??) ',[ n_route_p, n_route_p], function(err, rows, fields) {
    if (err) throw err;
    var district = JSON.parse(JSON.stringify(rows));
    console.log(district);

    connection.query('SELECT * FROM kowe WHERE district1 = ? ',[district[0].start], function(err, rows, fields) {
    if (err) throw err;
    var streetname = JSON.parse(JSON.stringify(rows));
    var keyboard = [];

    for(var i = 0; i < streetname.length; i++){
    keyboard.push([{'text': ( streetname[i].streetname ) , 'callback_data': ('11 ' + streetname[i].id_str)}]);
    }

    bot.sendMessage( user_id, 'Выберите одну из улиц вашего пересечения ',
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


function edit_end_interception (msg){

var mysql  = require('mysql');
        var pool = mysql.createPool({
        host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
        database : 'route_passenger'
    })

pool.getConnection(function(err, connection) {

var user_id = msg.chat.id;
var route_p = 'route_p'+user_id;
var n_route_p = 'n_route_p'+user_id;

after_choosing_district_msg(msg);

connection.query(' DELETE FROM ?? WHERE id_route = (SELECT MAX(id) FROM ??) AND begend = "end" ',[ route_p, n_route_p ], function(err, rows, fields) {
                           if (err) throw err;})

    connection.query('SELECT finish FROM ?? WHERE id = (SELECT MAX(id) FROM ??) ',[ n_route_p, n_route_p], function(err, rows, fields) {
    if (err) throw err;
    var district = JSON.parse(JSON.stringify(rows));
    console.log(district);

    connection.query('SELECT * FROM kowe WHERE district1 = ? ',[district[0].finish], function(err, rows, fields) {
    if (err) throw err;
    var streetname = JSON.parse(JSON.stringify(rows));
    var keyboard = [];

    for(var i = 0; i < streetname.length; i++){
    keyboard.push([{'text': ( streetname[i].streetname ) , 'callback_data': ('21 ' + streetname[i].id_str)}]);
    }

    bot.sendMessage( user_id, 'Выберите одну из улиц вашего пересечения ',
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



function edit_beg_busstop(msg){

var mysql  = require('mysql');
        var pool = mysql.createPool({
        host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
        database : 'route_passenger'
    })

pool.getConnection(function(err, connection) {

var user_id = msg.chat.id;
var route_p = 'route_p'+user_id;
var n_route_p = 'n_route_p'+user_id;

after_choosing_district_msg(msg);

connection.query('DELETE FROM ?? WHERE id_route = (SELECT MAX(id) FROM ??) ',[ route_p, n_route_p ], function(err, rows, fields) {
                           if (err) throw err;})

connection.query(' SELECT * FROM ?? WHERE id = (SELECT MAX(id) FROM ??) ',
[ n_route_p, n_route_p ], function(err, rows, fields) {
if (err) throw err;
var start = JSON.parse(JSON.stringify(rows));

// Если стартовый district равен "grd"
    if (start[0].start === 'grd'){

        var page1 = [];

        for(var i = 0; i < bet1.length; i++){
        page1.push([{'text': ( bet1[i].busstop ) , 'callback_data': ('busstop_beg ' + bet1[i].id_point)}]);
        }
        page1.push([ {'text': '1️⃣' , 'callback_data': 'page1'},   {'text': '2️⃣' , 'callback_data': 'page2'},  {'text': '3️⃣' , 'callback_data': 'page3'},  {'text': '4️⃣' , 'callback_data': 'page4'} ]);

        var text = 'Укажите начало пути, как автобусную остановку из списка ниже\nИЛИ\nкак пересечение улиц, нажав на "Указать пересечение улиц"' ;

        bot.sendMessage( msg.chat.id, text,
        {
        'reply_markup': JSON.stringify({
        inline_keyboard: page1
                                       })
        }
        )
    }

// В остальных случаях делаем стандартно
    else {

         connection.query(' SELECT busstop, id_point FROM points WHERE district = (SELECT start FROM ?? WHERE id = ((SELECT MAX(id) FROM ??))) AND point_type = 0 ',
         [ n_route_p, n_route_p ], function(err, rows, fields) {
         if (err) throw err;
         var busstop = JSON.parse(JSON.stringify(rows));
         var keyboard = [];

         for(var i = 0; i < busstop.length; i++){
         keyboard.push([{'text': ( busstop[i].busstop ) , 'callback_data': ('busstop_beg ' + busstop[i].id_point)}]);
         }

         var text = 'Выберите стартовую автобусную остановку из списка ниже\nИЛИ\nУкажите пересечение улиц, нажав на "Указать пересечение улиц"' ;

         bot.sendMessage( user_id, text,
         {
         'reply_markup': JSON.stringify({
         inline_keyboard: keyboard
                                       })
         }
         )
    })
    }
})
})
}


function edit_end_busstop(msg){

var mysql  = require('mysql');
        var pool = mysql.createPool({
                host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
        database : 'route_passenger'
    })

pool.getConnection(function(err, connection) {

var user_id = msg.chat.id;
var route_p = 'route_p'+user_id;
var n_route_p = 'n_route_p'+user_id;

after_choosing_beg_busstop_msg(msg);

connection.query('DELETE FROM ?? WHERE id_route = (SELECT MAX(id) FROM ??) AND begend = ? ',[ route_p, n_route_p, 'end' ], function(err, rows, fields) {
                           if (err) throw err;})

connection.query(' SELECT finish FROM ?? WHERE id = (SELECT MAX(id) FROM ??) ',
[ n_route_p, n_route_p ], function(err, rows, fields) {
if (err) throw err;
var start = JSON.parse(JSON.stringify(rows));

// Если стартовый district равен "grd"
    if (start[0].finish === 'grd'){

        var page1 = [];

        for(var i = 0; i < bet1.length; i++){
        page1.push([{'text': ( bet1[i].busstop ) , 'callback_data': ('busstop_end ' + bet1[i].id_point)}]);
        }
        page1.push([ {'text': '1️⃣' , 'callback_data': 'page1_end'},   {'text': '2️⃣' , 'callback_data': 'page2_end'},  {'text': '3️⃣' , 'callback_data': 'page3_end'},  {'text': '4️⃣' , 'callback_data': 'page4_end'} ]);

        var text = 'Выберите конечную автобусную остановку' ;

        bot.sendMessage( msg.chat.id, text,
        {
        'reply_markup': JSON.stringify({
        inline_keyboard: page1
                                       })
        }
        )
    }

// В остальных случаях делаем стандартно
    else {

         connection.query(' SELECT busstop, id_point FROM points WHERE district = (SELECT finish FROM ?? WHERE id = ((SELECT MAX(id) FROM ??))) AND point_type = 0 ',
         [ n_route_p, n_route_p ], function(err, rows, fields) {
         if (err) throw err;
         var busstop = JSON.parse(JSON.stringify(rows));
         var keyboard = [];

         for(var i = 0; i < busstop.length; i++){
         keyboard.push([{'text': ( busstop[i].busstop ) , 'callback_data': ('busstop_end ' + busstop[i].id_point)}]);
         }

         var text = 'Выберите конечную автобусную остановку' ;

         bot.sendMessage( user_id, text,
         {
         'reply_markup': JSON.stringify({
         inline_keyboard: keyboard
                                       })
         }
         )
    })
    }
})})
}


function passenger_choose_time(query) {

const chatId = query.message.chat.id

bot.sendMessage(chatId, 'Теперь укажите время:', {
                     reply_markup: {
                       inline_keyboard: [
                         [{
                           text: 'Готов ехать сейчас',
                           callback_data: 'ready now'
                         }],

                         [{
                           text: 'Запланировать выезд',
                           callback_data: 'plan time'
                         }]
                       ]
                     }
                   })
}


function passenger_update_time(query){

var mysql  = require('mysql');
        var pool = mysql.createPool({
        host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
        database : 'route_passenger'
    })

pool.getConnection(function(err, connection) {

var user_id = query.message.chat.id;
var route_p = 'route_p'+user_id;
var n_route_p = 'n_route_p'+user_id;

connection.query(' SELECT id FROM ?? ORDER BY id DESC LIMIT 1 ',
                 [ route_p ], function(err, rows, fields) {
                 if (err) throw err;
                 var str_parse = JSON.parse(JSON.stringify(rows));
                 console.log('max id1', rows);
                 console.log('max id2', str_parse);

      connection.query(' UPDATE ?? SET time_beg = NOW(), time_end = ADDTIME (NOW(), "00:40:00") WHERE id = ? AND begend = ? ',
                      [ route_p, str_parse[0].id, 'end' ], function(err, rows, fields) {
                       if (err) throw err;

           connection.query(' SELECT * FROM ?? WHERE id_route = (SELECT MAX(id_route) FROM ??) ',
                 [ route_p, route_p ], function(err, rows, fields) {
                 if (err) throw err;
                 var str_vse = JSON.parse(JSON.stringify(rows));
                 console.log('ROWS', rows);
                 console.log('STR_VSE', str_vse);
                if(str_vse !== undefined){
                 var all_districts = str_vse[0].district + '00' + str_vse[1].district;
                 console.log('all distrs ', all_districts);


                connection.query(' UPDATE ?? SET all_districts = ? WHERE id_route = ? ',[ route_p, all_districts, str_vse[0].id_route ], function (err, rows, fields) {
           if (err) throw err;


            connection.query(' SELECT DATE_ADD(time_beg, INTERVAL  "6:0:0" DAY_SECOND) AS time_beg, DATE_ADD(time_end, INTERVAL  "6:0:0" DAY_SECOND) AS time_end FROM ?? WHERE id_route = (SELECT MAX(id_route) FROM ??) ',
                             [ route_p, route_p ], function(err, rows, fields) {
                             if (err) throw err;
                             var str_vse_time = JSON.parse(JSON.stringify(rows));
                             console.log('Время добавили 6 часов', rows);
                             console.log('Время добавили 6 часов JSON parse', str_vse_time);

                             var test = [];
                             for(var i = 0; i < rows.length; i++){
//                             test.push([ str_vse[i].begend, str_vse[i].n_zapros, user_id, str_vse[i].id_route, str_vse[i].district, str_vse[i].point_type, str_vse[i].id_street, str_vse[i].street, str_vse[i].id_interception, str_vse[i].interception, str_vse[i].id_point, str_vse[i].busstop, str_vse[i].ordinal, str_vse[i].nearby_interception, str_vse[i].point_parinter_min5, str_vse[i].point_parinter_plu5, str_vse_time[1].time_beg, str_vse_time[1].time_end, 'free', str_vse[i].n_pass, all_districts ]);
                             test.push([ str_vse[i].begend, str_vse[i].n_zapros, user_id, str_vse[i].id_route, str_vse[i].district, str_vse[i].point_type, str_vse[i].id_street, str_vse[i].street, str_vse[i].id_interception, str_vse[i].interception, str_vse[i].id_point, str_vse[i].busstop, str_vse[i].ordinal, str_vse[i].nearby_interception, str_vse[i].point_parinter_min5, str_vse[i].point_parinter_plu5, 'free', str_vse[i].n_pass, all_districts ]);

                             }
                             console.log('Данные пассажира для ввода в общую БД ', test);

//            connection.query(' SELECT * FROM ?? WHERE id_route = (SELECT MAX(id_route) FROM ??)  ',
//                                 [ route_p, route_p ], function(err, rows, fields) {
//                                 if (err) throw err;
//                                 var sel = JSON.parse(JSON.stringify(rows));
//                                 console.log('SELECTiwe', sel);
//                                 })

//                connection.query(' INSERT INTO ?? ( begend, n_zapros, id_user, id_route, district, point_type, id_street, street, id_interception, interception, id_point, busstop, ordinal, nearby_interception, point_parinter_min5, point_parinter_plu5, time_beg, time_end, status, n_pass, all_districts) VALUES ? ',
//                                 [ route_p, test ], function(err, rows, fields) {
//                                 if (err) throw err;
//                                 console.log('Время вставили в общее!', rows);
//                                 })

                 var mysql  = require('mysql');
                         var pool = mysql.createPool({
                         host     : 'localhost',
                         user     : 'mybd_user',
                         password : 'admin123',
                         database : 'sitebot'
                     })
                pool.getConnection(function(err, connection) {

//                connection.query(' INSERT INTO route_p ( begend, n_zapros, id_user, id_route, district, point_type, id_street, street, id_interception, interception, id_point, busstop, ordinal, nearby_interception, point_parinter_min5, point_parinter_plu5, status, n_pass, all_districts ) VALUES ? ',
//                                 [ test ], function(err, rows, fields) {
//                                 if (err) throw err;
//                                 console.log('Время вставили в общее!', rows);

                connection.query(' INSERT INTO route_p ( begend, n_zapros, id_user, id_route, district, point_type, id_street, street, id_interception, interception, id_point, busstop, ordinal, nearby_interception, point_parinter_min5, point_parinter_plu5, status, n_pass, all_districts) VALUES ? ',
                                 [ test ], function(err, rows, fields) {
                                 if (err) throw err;
                                 console.log('Время вставили в общее!', rows);

                    connection.query(' UPDATE route_p SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_user = ? AND id_route = ? ',
                                     [ user_id, str_vse[0].id_route ], function(err, rows, fields) {
                                     if (err) throw err;
                                     console.log('Время вставили в общее!', rows);

                                    const text = 'По всем направлениям цена 300 тг на одного пассажира\nКроме этих направлений:\nВнутри любого района 200 тг\nРайон Базара - Юго-восток 200 тг\nРайон Базара - Федоровка 200 тг\nМайкудук - Сортировка 200 тг\nУштобе - Юго-восток 200 тг '
                                    bot.sendMessage(user_id, text)

                                     pass_offer_topass (query);
                                     pass_offer_todriv (query);
                                     send_rayon_poputi_pass_query (query);
                                     notify_driv_about_pass (query)

                                     })

// Теперь отправляем карту
//                 bot.sendPhoto(user_id, fs.readFileSync(__dirname + '/picture-map.png'))

                 })
            })
            })
      })
                }
           })
console.log('Время вставили!');
})
})
})
//После окончания заказа на поиск авто возвращаемся в главное меню
const chatId = query.message.chat.id;
const text_keyboard = '❗️ Сейчас бот ищет авто!\nТеперь бот будет высылать вам варианты попутного авто\nВам нужно будет выбрать, нажав на один из вариантов';
bot.sendMessage(chatId, text_keyboard, main_menu_passenger)
}




function passenger_plan_time(query){


var user_id = query.message.chat.id;
var route_p = 'route_p'+user_id;
var n_route_p = 'n_route_p'+user_id;

var now = new Date();
var hours = now.getHours();
var minutes = now.getMinutes();
var time = now.toTimeString();
console.log('Час', hours);
console.log('Минута', minutes);
console.log( time );

if(minutes<10) {var near_minute = 10;}
else if(minutes>10 && minutes<20) {var near_minute = 20;}
else if(minutes>20 && minutes<30) {var near_minute = 30;}
else if(minutes>30 && minutes<40) {var near_minute = 40;}
else if(minutes>40 && minutes<50) {var near_minute = 50;}
else {var near_minute = 0;}

var hh = hours.toString();
var hh1 = (hours+1).toString();
var hh3 = (hours+3).toString();
var hh4 = (hours+4).toString();
var mm = near_minute.toString();

console.log('Часик', hh);
console.log('час+1', hh1);
console.log('ьинутка', mm );

//if(near_minute!=0) {
//    //var totalminutes = hours*60+near_minute;
//    //var ostatok = totalminutes%60;
//    //var chastnoe = ~~(totalminutes/60);
//    var massiv_time = [hh+':'+mm];
//    for (i = 0; i < 5; i++) {
//       var near_minute = near_minute+10;
//       if(near_minute>50) { var near_minute2 = near_minute-60;
//         console.log('nearminute2', near_minute2);
//         if(near_minute2==0){
//           var hh1 = (hours+1).toString();
//           var mm = near_minute2.toString();
//           massiv_time.push(hh1+':'+mm+'0');
//           console.log('>50+0');
//         }
//         else {
//           var hh1 = (hours+1).toString();
//           var mm = near_minute2.toString();
//           massiv_time.push(hh1+':'+mm);
//           console.log('>50');
//         }
//       }
//       else {
//            var hh = hours.toString();
//            var mm = near_minute.toString();
//            massiv_time.push(hh+':'+mm);
//            console.log('<<50');
//            }
//    }
//    console.log('qwer', massiv_time);
//}
//else{
//    var massiv_time = [hh1+':'+mm+'0'];
//    for (i = 0; i < 5; i++) {
//       var near_minute = near_minute+10;
//       var hh = hours.toString();
//       var mm = near_minute.toString();
//       massiv_time.push(hh1+':'+mm);
//    }
//    console.log('Neartime=0', massiv_time);
//}


if(near_minute!=0) {

    var massiv_time = [hh3+':'+mm];
    for (i = 0; i < 5; i++) {
       var near_minute = near_minute+10;
       if(near_minute>50) { var near_minute2 = near_minute-60;
         console.log('nearminute2', near_minute2);
         if(near_minute2==0){
           var hh1 = (hours+4).toString();
           var mm = near_minute2.toString();
           massiv_time.push(hh1+':'+mm+'0');
           console.log('>50+0');
         }
         else {
           var hh1 = (hours+4).toString();
           var mm = near_minute2.toString();
           massiv_time.push(hh1+':'+mm);
           console.log('>50');
         }
       }
       else {
            var hh = (hours+3).toString();
            var mm = near_minute.toString();
            massiv_time.push(hh+':'+mm);
            console.log('<<50');
            }
    }
    console.log('qwer', massiv_time);
}
else{
    var massiv_time = [hh4+':'+mm+'0'];
    for (i = 0; i < 5; i++) {
       var near_minute = near_minute+10;
       var hh = hours.toString();
       var mm = near_minute.toString();
       massiv_time.push(hh4+':'+mm);
    }
    console.log('Neartime=0', massiv_time);
}

console.log('Ближайшая минута', near_minute);
var asddd = JSON.stringify(massiv_time);
var bbb = JSON.parse(JSON.stringify(massiv_time));

console.log('strinfy', asddd);
console.log('strinfy', bbb);

bot.sendMessage(query.message.chat.id, 'Я буду стоять на остановке или у дороги в:', { reply_markup: JSON.stringify({
                                                               inline_keyboard: massiv_time.map((x, xi) => ([{
                                                                   text: x,
                                                                   callback_data: 'time ' + x,
                                                               }])),

                                                  }),})
}




function passenger_update_plan_time(query){

  var str = query.data;
  var res = str.split(" ");
  console.log('Время выбрано!', res[1]);

//  var a = "13:15"
  var intime_format = toDate(res[1], "h:m")
  var formatted_time =  date_format(intime_format, 'Y-m-d, H-i-s')
//  alert(b);  , H-i-s
 console.log('Время отформатировано!', intime_format);
 console.log('Еще раз отформатировано!', formatted_time);

  function toDate(dStr, format) {
    var now = new Date();
    if (format == "h:m") {
      now.setHours(dStr.substr(0, dStr.indexOf(":")));
      now.setMinutes(dStr.substr(dStr.indexOf(":") + 1));
      now.setSeconds(0);
      return now;
    } else
      return "Invalid Format";
  }

var mysql  = require('mysql');
        var pool = mysql.createPool({
                host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
        database : 'route_passenger'
    })

pool.getConnection(function(err, connection) {

var user_id = query.message.chat.id;
var route_p = 'route_p'+user_id;
var n_route_p = 'n_route_p'+user_id;

connection.query(' SELECT id FROM ?? ORDER BY id DESC LIMIT 1 ',
                 [ route_p ], function(err, rows, fields) {
                 if (err) throw err;
                 var str_parse = JSON.parse(JSON.stringify(rows));
                 console.log('max id1', rows);
                 console.log('max id2', str_parse);
//   connection.query(' SET time_zone = "+06:00" ',
//                       function(err, rows, fields) {
//                        if (err) throw err;
     connection.query(' UPDATE ?? SET time_beg = ?, time_end = ADDTIME (?, "00:40:00") WHERE id = ? AND begend = ? ',
                     [ route_p, formatted_time, formatted_time, str_parse[0].id, 'end' ], function(err, rows, fields) {
                     if (err) throw err;

            connection.query(' SELECT * FROM ?? WHERE id_route = (SELECT MAX(id_route) FROM ??) ',
                             [ route_p, route_p ], function(err, rows, fields) {
                             if (err) throw err;
                             var str_vse = JSON.parse(JSON.stringify(rows));
                             console.log('ROWS', rows);
                             console.log('STR_VSE', str_vse);

                             var all_districts = str_vse[0].district + '00' + str_vse[1].district;
                             console.log('all distrs ', all_districts);


           connection.query(' UPDATE ?? SET all_districts = ? WHERE id_route = ? ',[ route_p, all_districts, str_vse[0].id_route ], function (err, rows, fields) {
           if (err) throw err;

            connection.query(' SELECT DATE_ADD(time_beg, INTERVAL  "6:0:0" DAY_SECOND) AS time_beg, DATE_ADD(time_end, INTERVAL  "6:0:0" DAY_SECOND) AS time_end FROM ?? WHERE id_route = (SELECT MAX(id_route) FROM ??) ',
                             [ route_p, route_p ], function(err, rows, fields) {
                             if (err) throw err;
                             var str_vse_time = JSON.parse(JSON.stringify(rows));
                             console.log('Время добавили 6 часов', rows);
                             console.log('Время добавили 6 часов JSON parse', str_vse_time);

                             var test = [];
                             for(var i = 0; i < rows.length; i++){
                             test.push([ str_vse[i].begend, str_vse[i].n_zapros, user_id, str_vse[i].id_route, str_vse[i].district, str_vse[i].point_type, str_vse[i].id_street, str_vse[i].street, str_vse[i].id_interception, str_vse[i].interception, str_vse[i].id_point, str_vse[i].busstop, str_vse[i].ordinal, str_vse[i].nearby_interception, str_vse[i].point_parinter_min5, str_vse[i].point_parinter_plu5, 'free', str_vse[i].n_pass, all_districts ]);
//                             test.push([ str_vse[i].begend, str_vse[i].n_zapros, user_id, str_vse[i].id_route, str_vse[i].district, str_vse[i].point_type, str_vse[i].id_street, str_vse[i].street, str_vse[i].id_interception, str_vse[i].interception, str_vse[i].id_point, str_vse[i].busstop, str_vse[i].ordinal, str_vse[i].nearby_interception, str_vse[i].point_parinter_min5, str_vse[i].point_parinter_plu5, str_vse_time[1].time_beg, str_vse_time[1].time_end, 'free', str_vse[i].n_pass, all_districts ]);
                             }
                             console.log('Тест', test);


                 var mysql  = require('mysql');
                         var pool = mysql.createPool({
                         host     : 'localhost',
                         user     : 'mybd_user',
                         password : 'admin123',
                         database : 'sitebot'
                         })

                 pool.getConnection(function(err, connection) {

                 connection.query(' INSERT INTO route_p ( begend, n_zapros, id_user, id_route, district, point_type, id_street, street, id_interception, interception, id_point, busstop, ordinal, nearby_interception, point_parinter_min5, point_parinter_plu5, status, n_pass, all_districts) VALUES ? ',
                                 [ test ], function(err, rows, fields) {
                                 if (err) throw err;
                                 console.log('Время вставили в общее!', rows);

                         connection.query(' UPDATE route_p SET time_beg = ADDTIME (NOW(), "03:00:00"), time_end = ADDTIME (NOW(), "03:40:00") WHERE id_user = ? AND id_route = ? ',
                                     [ user_id, str_vse[0].id_route ], function(err, rows, fields) {
                                     if (err) throw err;
                                     console.log('Время вставили в общее!', rows);

                                    const text = 'По всем направлениям цена 300 тг на одного пассажира\nКроме этих направлений:\nВнутри любого района 200 тг\nРайон Базара - Юго-восток 200 тг\nРайон Базара - Федоровка 200 тг\nМайкудук - Сортировка 200 тг\nУштобе - Юго-восток 200 тг '
                                    bot.sendMessage(user_id, text)

                                     pass_offer_topass (query);
                                     pass_offer_todriv (query);
                                     send_rayon_poputi_pass_query (query);
                                     notify_driv_about_pass (query)

                                     })
                 })
            })
            })
            })
            })
     })
//   })
})
console.log('Время вставили!');
})
//После окончания заказа на поиск авто возвращаемся в главное меню
const chatId = query.message.chat.id;
const text_keyboard = '❗️ Сейчас бот ищет авто!\nТеперь бот будет высылать вам варианты попутного авто\nВам нужно будет выбрать, нажав на один из вариантов';
bot.sendMessage(chatId, text_keyboard, main_menu_passenger)

}




function choose_direction_passenger(msg) {

const chatId = msg.chat.id
const text = 'Чтобы найти попутное авто вам нужно сделать 2 действия пошагово:\n1) Выбрать направление (с какого района в какой район едите)\n2) Указать перекресток или автобусную остановку начала и конца вашего пути\n  '
bot.sendMessage(chatId, text, {
                     reply_markup: {
                       keyboard: [

                         [{
                           text: 'Назад в меню'
                         }]

                       ],
                       resize_keyboard: true
                     }
                   })
// Теперь отправляем карту
bot.sendPhoto(chatId, fs.readFileSync(__dirname + '/picture-map.png'), {
caption: 'На карте указаны границы районов'
})

bot.sendMessage(chatId, '1-ый шаг: Сейчас выберите направление. ОТКУДА:', {
                     reply_markup: {
                       inline_keyboard: [
                         [{
                           text: 'Из майкудука',
                           callback_data: 'mkdk_pass1'
                         }],
                         [{
                           text: 'Из центра',
                           callback_data: 'grd_pass1'
                         }],
                         [{
                           text: 'Из юго-востока',
                           callback_data: 'yug_pass1'
                         }],
                         [{
                           text: 'Из района базара',
                           callback_data: 'bazar_pass1'
                         }],
                         [{
                           text: 'Из пришахтинска',
                           callback_data: 'prihon_pass1'
                         }],
                         [{
                           text: 'Из новоузенки',
                           callback_data: 'novouzenka_pass1'
                         }],
                         [{
                           text: 'Из района ЖБИ',
                           callback_data: 'zhbi_pass1'
                         }],
                         [{
                           text: 'Из сарани',
                           callback_data: 'saran_pass1'
                         }],
                         [{
                           text: 'Из малой сарани',
                           callback_data: 'malsaran_pass1'
                         }],
                         [{
                           text: 'Из актаса',
                           callback_data: 'aktas_pass1'
                         }],
                         [{
                           text: 'Из дубовки',
                           callback_data: 'dubovka_pass1'
                         }],
                         [{
                           text: 'Из федоровки',
                           callback_data: 'fedorovka_pass1'
                         }],
                         [{
                           text: 'Из сортировки',
                           callback_data: 'srt_pass1'
                         }],
                         [{
                           text: 'Из доскея',
                           callback_data: 'doskey_pass1'
                         }],
                         [{
                           text: 'Из поселка Трудовое',
                           callback_data: 'trud_pass1'
                         }],
                         [{
                           text: 'Из уштобе',
                           callback_data: 'uwtobe_pass1'
                         }]
                       ]
                     }
                   })
}


function choose_direction_passenger_2(query) {

const chatId = query.message.chat.id

bot.sendMessage(chatId, '2-ой шаг: Сейчас выберите направление. КУДА:', {
                     reply_markup: {
                       inline_keyboard: [
                         [{
                           text: 'В майкудук',
                           callback_data: 'mkdk_pass2'
                         }],
                         [{
                           text: 'В центр',
                           callback_data: 'grd_pass2'
                         }],
                         [{
                           text: 'На юго-восток',
                           callback_data: 'yug_pass2'
                         }],
                         [{
                           text: 'В район базара',
                           callback_data: 'bazar_pass2'
                         }],
                         [{
                           text: 'В пришахтинск',
                           callback_data: 'prihon_pass2'
                         }],
                         [{
                           text: 'В новоузенку',
                           callback_data: 'novouzenka_pass2'
                         }],
                         [{
                           text: 'В район ЖБИ',
                           callback_data: 'zhbi_pass2'
                         }],
                         [{
                           text: 'В сарань',
                           callback_data: 'saran_pass2'
                         }],
                         [{
                           text: 'В малую сарань',
                           callback_data: 'malsaran_pass2'
                         }],
                         [{
                           text: 'В актас',
                           callback_data: 'aktas_pass2'
                         }],
                         [{
                           text: 'В дубовку',
                           callback_data: 'dubovka_pass2'
                         }],
                         [{
                           text: 'В федоровку',
                           callback_data: 'fedorovka_pass2'
                         }],
                         [{
                           text: 'В сортировку',
                           callback_data: 'srt_pass2'
                         }],
                         [{
                           text: 'В доскей',
                           callback_data: 'doskey_pass2'
                         }],
                         [{
                           text: 'В поселок Трудовое',
                           callback_data: 'trud_pass2'
                         }],
                         [{
                           text: 'В уштобе',
                           callback_data: 'uwtobe_pass2'
                         }]
                       ]
                     }
                   })
}


function are_u_sure(msg) {

const chatId = msg.chat.id
const text = 'Вы уверены, что хотите отменить поиск попутчиков?'
bot.sendMessage(chatId, text, {
                     reply_markup: {
                       keyboard: [
                         [{
                           text: 'Да, я уверен'
                         }],

                         [{
                           text: 'Нет'
                         }]

                       ]
                     }
                   })
}


function choose_from_district(query) {

var mysql  = require('mysql');
        var pool = mysql.createPool({
        host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
        database : 'route_passenger'
    })

pool.getConnection(function(err, connection) {

var user_id = query.message.chat.id
var route_passenger = 'route_p'+user_id;
var n_route_p = 'n_route_p'+user_id;
  var str = query.data;
  var res = str.split(" ");
console.log(res[0]);

if (res[0] == 'mkdk_pass1'){ var district = 'mkdk';}
else if (res[0] == 'grd_pass1'){ var district = 'grd';}
else if (res[0] == 'saran_pass1'){ var district = 'saran';}
else if (res[0] == 'aktas_pass1'){ var district = 'aktas';}
else if (res[0] == 'dubovka_pass1'){ var district = 'dubovka';}
else if (res[0] == 'fedorovka_pass1'){ var district = 'fedorovka';}
else if (res[0] == 'bazar_pass1'){ var district = 'bazar';}
else if (res[0] == 'yug_pass1'){ var district = 'yug';}
else if (res[0] == 'srt_pass1'){ var district = 'srt';}
else if (res[0] == 'doskey_pass1'){ var district = 'doskey';}
else if (res[0] == 'trud_pass1'){ var district = 'trud';}
else if (res[0] == 'uwtobe_pass1'){ var district = 'uwtobe';}
else if (res[0] == 'prihon_pass1'){ var district = 'prihon';}
else if (res[0] == 'zhbi_pass1'){ var district = 'zhbi';}
else if (res[0] == 'novouzenka_pass1'){ var district = 'novouzenka';}
else if (res[0] == 'malsaran_pass1'){ var district = 'malsaran';}

connection.query('INSERT INTO ?? (id_user, start) VALUES(?,?) ',
[ n_route_p, user_id, district], function(err, rows, fields) {
if (err) throw err;
console.log(rows);
})

})

choose_direction_passenger_2(query);
}


bot.onText(/\/kolvo_direction/, msg => {database.kolvo_direction()})

bot.onText(/\/base/, msg => {database.base()})


const bet1 = [ { busstop: 'ДСК', id_point: '305000000000S01' },
               { busstop: 'Шахта им. Т.Кузембаева',
                 id_point: '305000000000S02' },
               { busstop: 'Станционная', id_point: '211000000000S01' },
               { busstop: 'Стадион Шахтер', id_point: '211000000000S02' },
               { busstop: '15-й магазин', id_point: '211000000000S03' },
               { busstop: 'ДК Горняков', id_point: '211000000000S04' },
               { busstop: 'ЦУМ', id_point: '211000000000S05' },
               { busstop: 'ТД Абзал', id_point: '211000000000S06' },
               { busstop: '45-й квартал', id_point: '211000000000S07' },
               { busstop: 'Кронштадская', id_point: '283000000000S01' },
               { busstop: 'Аманжолова', id_point: '283000000000S02' },
               { busstop: 'Комиссионный', id_point: '283000000000S03' },
               { busstop: 'Хлебзавод', id_point: '283000000000S04' },
               { busstop: 'Боулинг', id_point: '283000000000S05' },
               { busstop: 'Магазин Юбилейный по Гоголя',
                 id_point: '283000000000S06' },
               { busstop: '92-й квартал', id_point: '261000000000S01' },
               { busstop: 'Таксокомбинат', id_point: '261000000000S02' },
               { busstop: 'Санаторий Березка', id_point: '261000000000S03' },
               { busstop: 'ЖД Вокзал', id_point: '308000000000S01' },
               { busstop: 'Детсад ул. Ержанова', id_point: '278000000000S01' }]

const bet2 = [ { busstop: 'ЦОН ул. Ержанова', id_point: '278000000000S02' },
               { busstop: 'СТО москвич', id_point: '265000000000S01' },
               { busstop: 'Экономический университет',
                 id_point: '263000000000S01' },
               { busstop: 'КЮИ', id_point: '259000000000S01' },
               { busstop: 'Гостиница Турист', id_point: '259000000000S02' },
               { busstop: 'Чкалова', id_point: '253000000000S01' },
               { busstop: 'Медучилище', id_point: '253000000000S02' },
               { busstop: 'Медучилище по Кривогуза',
                 id_point: '239000000000S01' },
               { busstop: 'Кривогуза', id_point: '239000000000S02' },
               { busstop: 'Детсад ул. Кривогуза', id_point: '239000000000S03' },
               { busstop: 'Онкология', id_point: '239000000000S04' },
               { busstop: 'Новонижняя', id_point: '239000000000S05' },
               { busstop: 'Баженова', id_point: '229000000000S01' },
               { busstop: 'Баженова по Прогресса',
                 id_point: '237000000000S01' },
               { busstop: 'Прогресса', id_point: '237000000000S02' },
               { busstop: 'Лесхоз', id_point: '237000000000S03' },
               { busstop: 'Мясокомбинат', id_point: '237000000000S04' },
               { busstop: 'Кирзавод 3-4', id_point: '243000000000S01' },
               { busstop: 'ЖБИ Михайловка', id_point: '227000000000S01' },
               { busstop: 'Геология', id_point: '227000000000S02' } ]

const bet3 = [ { busstop: 'Баня по Сейфуллина', id_point: '225000000000S01' },
               { busstop: 'Поликлиника ул. Сейфуллина',
                 id_point: '225000000000S02' },
               { busstop: 'Строительная', id_point: '225000000000S03' },
               { busstop: 'Михайловский рынок', id_point: '272000000000S01' },
               { busstop: 'Школа №21', id_point: '272000000000S02' },
               { busstop: 'Горноспасательная', id_point: '313000000000S01' },
               { busstop: 'Олимпийская', id_point: '313000000000S02' },
               { busstop: 'Охотская', id_point: '313000000000S03' },
               { busstop: 'ДСУ - 19', id_point: '213000000000S01' },
               { busstop: 'Волгодонская', id_point: '288000000000S01' },
               { busstop: 'Казэнерго', id_point: '288000000000S02' },
               { busstop: 'Аманжолова по Волгодонской',
                 id_point: '288000000000S03' },
               { busstop: '19-й квартал', id_point: '296000000000S01' },
               { busstop: 'Овощной магазин по Жангозина',
                 id_point: '296000000000S02' },
               { busstop: 'Площадь Гагарина', id_point: '296000000000S03' },
               { busstop: 'Городской акимат', id_point: '296000000000S04' },
               { busstop: 'Акимат по Мира', id_point: '298000000000S01' },
               { busstop: 'Политех', id_point: '298000000000S02' },
               { busstop: 'Ердос', id_point: '298000000000S03' },
               { busstop: 'Поликлиника №2', id_point: '298000000000S04' } ]

const bet4 = [ { busstop: 'Театр им. Станиславского',
                 id_point: '298000000000S05' },
               { busstop: 'Ерубаева по Мира', id_point: '298000000000S06' },
               { busstop: 'Диетстоловая', id_point: '298000000000S07' },
               { busstop: 'Детский сад по Нуркена Абдирова',
                 id_point: '304000000000S01' },
               { busstop: 'Магазин Юбилейный по Нуркена',
                 id_point: '304000000000S02' },
               { busstop: 'Парикмахерская Айсулу',
                 id_point: '304000000000S03' },
               { busstop: 'Магазин Мечта', id_point: '304000000000S04' },
               { busstop: '1000 мелочей', id_point: '304000000000S05' },
               { busstop: 'Валют Транзит', id_point: '304000000000S06' },
               { busstop: 'Меридиан', id_point: '282000000000S01' },
               { busstop: 'Автосервис ул. Терешкова',
                 id_point: '282000000000S02' },
               { busstop: 'Терешкова', id_point: '282000000000S03' },
               { busstop: '32-й квартал по Терешкова',
                 id_point: '282000000000S04' },
               { busstop: 'УВК', id_point: '299000000000S01' },
               { busstop: 'Поспелова', id_point: '287000000000S01' },
               { busstop: '32-й квартал по Мустафина',
                 id_point: '293000000000S01' },
               { busstop: '26-й квартал', id_point: '293000000000S02' },
               { busstop: 'КУБУП', id_point: '291000000000S01' },
               { busstop: 'Аэлита', id_point: '291000000000S02' } ]


function through_pages (query) {

if (query.data === 'page1') { var bet = bet1; }
else if (query.data === 'page2') { var bet = bet2; }
else if (query.data === 'page3') { var bet = bet3; }
else if (query.data === 'page4') { var bet = bet4; }

        var page = [];

        for(var i = 0; i < bet.length; i++){
        page.push([{'text': ( bet[i].busstop ) , 'callback_data': ('busstop_beg ' + bet[i].id_point)}]);
        }
        page.push([ {'text': '1️⃣' , 'callback_data': 'page1'},   {'text': '2️⃣' , 'callback_data': 'page2'},  {'text': '3️⃣' , 'callback_data': 'page3'},  {'text': '4️⃣' , 'callback_data': 'page4'} ]);

        var text = 'Выберите стартовую автобусную остановку из списка ниже\nИЛИ\nУкажите пересечение улиц, нажав на "Указать пересечение улиц"' ;

        bot.sendMessage( query.message.chat.id, text,
        {
        'reply_markup': JSON.stringify({
        inline_keyboard: page
                                       })
        }
        )

}

function through_pages_end (query) {

if (query.data === 'page1_end') { var bet = bet1; }
else if (query.data === 'page2_end') { var bet = bet2; }
else if (query.data === 'page3_end') { var bet = bet3; }
else if (query.data === 'page4_end') { var bet = bet4; }

        var page = [];

        for(var i = 0; i < bet.length; i++){
        page.push([{'text': ( bet[i].busstop ) , 'callback_data': ('busstop_end ' + bet[i].id_point)}]);
        }
        page.push([ {'text': '1️⃣' , 'callback_data': 'page1_end'},   {'text': '2️⃣' , 'callback_data': 'page2_end'},  {'text': '3️⃣' , 'callback_data': 'page3_end'},  {'text': '4️⃣' , 'callback_data': 'page4_end'} ]);

        var text = 'Выберите конечную автобусную остановку' ;

        bot.sendMessage( query.message.chat.id, text,
        {
        'reply_markup': JSON.stringify({
        inline_keyboard: page
                                       })
        }
        )

}


function choose_to_district(query) {

var mysql  = require('mysql');
        var pool = mysql.createPool({
        host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
        database : 'route_passenger'
    })

pool.getConnection(function(err, connection) {

var user_id = query.message.chat.id
var route_passenger = 'route_p'+user_id;
var n_route_p = 'n_route_p'+user_id;
  var str = query.data;
  var res = str.split(" ");



if (res[0] == 'mkdk_pass2'){ var district = 'mkdk';}
else if (res[0] == 'grd_pass2'){ var district = 'grd';}
else if (res[0] == 'saran_pass2'){ var district = 'saran';}
else if (res[0] == 'aktas_pass2'){ var district = 'aktas';}
else if (res[0] == 'dubovka_pass2'){ var district = 'dubovka';}
else if (res[0] == 'fedorovka_pass2'){ var district = 'fedorovka';}
else if (res[0] == 'bazar_pass2'){ var district = 'bazar';}
else if (res[0] == 'yug_pass2'){ var district = 'yug';}
else if (res[0] == 'srt_pass2'){ var district = 'srt';}
else if (res[0] == 'doskey_pass2'){ var district = 'doskey';}
else if (res[0] == 'trud_pass2'){ var district = 'trud';}
else if (res[0] == 'uwtobe_pass2'){ var district = 'uwtobe';}
else if (res[0] == 'prihon_pass2'){ var district = 'prihon';}
else if (res[0] == 'zhbi_pass2'){ var district = 'zhbi';}
else if (res[0] == 'novouzenka_pass2'){ var district = 'novouzenka';}
else if (res[0] == 'malsaran_pass2'){ var district = 'malsaran';}

connection.query(' SELECT start FROM ?? WHERE id = (SELECT MAX(id) FROM ??) ',
[ n_route_p, n_route_p ], function(err, rows, fields) {
if (err) throw err;
var start = JSON.parse(JSON.stringify(rows));

// Если стартовый district равен "grd"
    if (start[0].start === 'grd'){

    connection.query(' UPDATE ?? SET finish = ? WHERE id = (SELECT MAX(id) FROM (SELECT MAX(id) FROM ??) AS route2 )',
    [ n_route_p, district, n_route_p ], function(err, rows, fields) {
    if (err) throw err;

        var page1 = [];

        for(var i = 0; i < bet1.length; i++){
        page1.push([{'text': ( bet1[i].busstop ) , 'callback_data': ('busstop_beg ' + bet1[i].id_point)}]);
        }
        page1.push([ {'text': '1️⃣' , 'callback_data': 'page1'},   {'text': '2️⃣' , 'callback_data': 'page2'},  {'text': '3️⃣' , 'callback_data': 'page3'},  {'text': '4️⃣' , 'callback_data': 'page4'} ]);

        var text = 'Выберите стартовую автобусную остановку из списка ниже\nИЛИ\nУкажите пересечение улиц, нажав на "Указать пересечение улиц"' ;

        bot.sendMessage( query.message.chat.id, text,
        {
        'reply_markup': JSON.stringify({
        inline_keyboard: page1
                                       })
        }
        )
    })
    }

// В остальных случаях делаем стандартно
    else {

    connection.query(' UPDATE ?? SET finish = ? WHERE id = (SELECT MAX(id) FROM (SELECT MAX(id) FROM ??) AS route2 )',
    [ n_route_p, district, n_route_p ], function(err, rows, fields) {
    if (err) throw err;

         connection.query(' SELECT busstop, id_point FROM points WHERE district = (SELECT start FROM ?? WHERE id = ((SELECT MAX(id) FROM ??))) AND point_type = 0 ',
         [ n_route_p, n_route_p ], function(err, rows, fields) {
         if (err) throw err;
         var busstop = JSON.parse(JSON.stringify(rows));
         var keyboard = [];

         for(var i = 0; i < busstop.length; i++){
         keyboard.push([{'text': ( busstop[i].busstop ) , 'callback_data': ('busstop_beg ' + busstop[i].id_point)}]);
         }

         var text = 'Выберите стартовую автобусную остановку из списка ниже\nИЛИ\nУкажите пересечение улиц, нажав на "Указать пересечение улиц"' ;

         bot.sendMessage( query.message.chat.id, text,
         {
         'reply_markup': JSON.stringify({
         inline_keyboard: keyboard
                                       })
         }
         )
    })
    })
    }
})
})

after_choosing_district(query);
}


function choose_end_busstop (msg) {

var mysql  = require('mysql');
        var pool = mysql.createPool({
        host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
        database : 'route_passenger'
    })

pool.getConnection(function(err, connection) {

var user_id = msg.chat.id
var route_passenger = 'route_p'+user_id;
var n_route_p = 'n_route_p'+user_id;

connection.query(' SELECT finish FROM ?? WHERE id = (SELECT MAX(id) FROM ??) ',
[ n_route_p, n_route_p ], function(err, rows, fields) {
if (err) throw err;
var start = JSON.parse(JSON.stringify(rows));

// Если конечный district равен "grd"
    if (start[0].finish === 'grd'){

        var page1 = [];

        for(var i = 0; i < bet1.length; i++){
        page1.push([{'text': ( bet1[i].busstop ) , 'callback_data': ('busstop_end ' + bet1[i].id_point)}]);
        }
        page1.push([ {'text': '1️⃣' , 'callback_data': 'page1_end'},   {'text': '2️⃣' , 'callback_data': 'page2_end'},  {'text': '3️⃣' , 'callback_data': 'page3_end'},  {'text': '4️⃣' , 'callback_data': 'page4_end'} ]);

        var text = 'Выберите конечную автобусную остановку' ;

        bot.sendMessage( user_id, text,
        {
        'reply_markup': JSON.stringify({
        inline_keyboard: page1
                                       })
        }
        )
    }

else {
    connection.query(' SELECT * FROM points WHERE district = (SELECT finish FROM ?? ORDER BY id DESC LIMIT 1) AND point_type = 0  ORDER BY busstop ',[ n_route_p ], function(err, rows, fields) {
    if (err) throw err;
    var busstop = JSON.parse(JSON.stringify(rows));
    var keyboard = [];

    for(var i = 0; i < busstop.length; i++){
    keyboard.push([{'text': ( busstop[i].busstop ) , 'callback_data': ('busstop_end ' + busstop[i].id_point)}]);
    }

    bot.sendMessage( user_id, 'Выберите конечную автобусную остановку ',
    {
    'reply_markup': JSON.stringify({
    inline_keyboard: keyboard
                                   })
    }
    )
    })
}

})

})

}


function insert_busstop_beg(query) {

var mysql  = require('mysql');
        var pool = mysql.createPool({
        host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
        database : 'route_passenger'
    })

pool.getConnection(function(err, connection) {

var user_id = query.message.chat.id
var route_passenger = 'route_p'+user_id;
var n_route_p = 'n_route_p'+user_id;
  var str = query.data;
  var res = str.split(" ");
  console.log('res1 ', res[1]);
  console.log('res0 ', res[0]);

var sql_insert = ' INSERT INTO ?? (begend, n_zapros, id_user, id_route, district, point_type, id_street, street, id_point, busstop, ordinal, nearby_interception)' +
                 ' VALUES (?,?,?,(SELECT id FROM ?? WHERE id_user = ? AND id = (SELECT MAX(id) FROM ??)) , ' +
                 ' (SELECT start FROM ?? WHERE id_user = ? AND id = (SELECT MAX(id) FROM ??)), ?, ' +
                 ' (SELECT id_street FROM points WHERE id_point = ?), (SELECT street FROM points WHERE id_point = ?), ' +
                 ' ?, (SELECT busstop FROM points WHERE id_point = ? AND point_type = 0), ' +
                 ' (SELECT ordinal FROM points WHERE id_point = ?), (SELECT nearby_interception FROM points WHERE id_point = ?) )';

connection.query( sql_insert,
    [ route_passenger, 'beg', 1, user_id, n_route_p, user_id, n_route_p, n_route_p, user_id, n_route_p, 0, res[1], res[1], res[1], res[1], res[1], res[1] ], function(err, rows, fields) {
    if (err) throw err;
    })

connection.query(' SELECT finish FROM ?? WHERE id = (SELECT MAX(id) FROM ??) ',
[ n_route_p, n_route_p ], function(err, rows, fields) {
if (err) throw err;
var start = JSON.parse(JSON.stringify(rows));
    console.log('startd', start)
// Если конечный district равен "grd"
    if (start[0].finish === 'grd'){
    console.log('grd')

        var page1 = [];

        for(var i = 0; i < bet1.length; i++){
        page1.push([{'text': ( bet1[i].busstop ) , 'callback_data': ('busstop_end ' + bet1[i].id_point)}]);
        }
        page1.push([ {'text': '1️⃣' , 'callback_data': 'page1_end'},   {'text': '2️⃣' , 'callback_data': 'page2_end'},  {'text': '3️⃣' , 'callback_data': 'page3_end'},  {'text': '4️⃣' , 'callback_data': 'page4_end'} ]);

        var text = 'Выберите конечную автобусную остановку' ;

        bot.sendMessage( user_id, text,
        {
        'reply_markup': JSON.stringify({
        inline_keyboard: page1
                                       })
        }
        )
    }

else {
    connection.query(' SELECT * FROM points WHERE district = (SELECT finish FROM ?? ORDER BY id DESC LIMIT 1) AND point_type = 0',[ n_route_p ], function(err, rows, fields) {
    if (err) throw err;
    var busstop = JSON.parse(JSON.stringify(rows));
    var keyboard = [];

    for(var i = 0; i < busstop.length; i++){
    keyboard.push([{'text': ( busstop[i].busstop ) , 'callback_data': ('busstop_end ' + busstop[i].id_point)}]);
    }

    bot.sendMessage( user_id, 'Выберите конечную автобусную остановку ',
    {
    'reply_markup': JSON.stringify({
    inline_keyboard: keyboard
                                   })
    }
    )
    })
}
          connection.query(' SELECT busstop FROM points WHERE id_point = ? AND point_type = 0  ORDER BY busstop ' ,
          [ res[1] ], function(err, rows, fields) {
          if (err) throw err;
          var busstop = JSON.parse(JSON.stringify(rows));

          bot.sendMessage(query.message.chat.id, 'Ваша начальная остановка: ' + busstop[0].busstop);
          })
    })
})
}


function insert_busstop_end(query) {

var mysql  = require('mysql');
        var pool = mysql.createPool({
        host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
        database : 'route_passenger'
    })

pool.getConnection(function(err, connection) {

var user_id = query.message.chat.id
var route_passenger = 'route_p'+user_id;
var n_route_p = 'n_route_p'+user_id;
  var str = query.data;
  var res = str.split(" ");


var sql_insert = ' INSERT INTO ?? (begend, n_zapros, id_user, id_route, district, point_type, id_street, street, id_point, busstop, ordinal, nearby_interception)' +
                 ' VALUES (?,?,?,(SELECT id FROM ?? WHERE id_user = ? AND id = (SELECT MAX(id) FROM ??)) , ' +
                 ' (SELECT finish FROM ?? WHERE id_user = ? AND id = (SELECT MAX(id) FROM ??)), ?, ' +
                 ' (SELECT id_street FROM points WHERE id_point = ?), (SELECT street FROM points WHERE id_point = ?), ' +
                 ' ?, (SELECT busstop FROM points WHERE id_point = ? AND point_type = 0), ' +
                 ' (SELECT ordinal FROM points WHERE id_point = ?), (SELECT nearby_interception FROM points WHERE id_point = ?) )';

//'INSERT INTO ?? (begend, n_zapros, id_user, id_route, district, point_type, id_street, street, id_point, busstop, ordinal, nearby_interception) VALUES(?,?,?,(SELECT id FROM ?? WHERE id_user = ? AND id = (SELECT MAX(id) FROM ??)) , (SELECT finish FROM ?? WHERE id_user = ? AND id = (SELECT MAX(id) FROM ??)), ?, (SELECT id_street FROM points WHERE busstop = ?), (SELECT street FROM points WHERE busstop = ?), (SELECT id_point FROM points WHERE busstop = ?), ?, (SELECT ordinal FROM points WHERE busstop = ?), (SELECT nearby_interception FROM points WHERE busstop = ?) ) '
connection.query(sql_insert,
[ route_passenger, 'end', 2, user_id, n_route_p, user_id, n_route_p, n_route_p, user_id, n_route_p, 0, res[1], res[1], res[1], res[1], res[1], res[1] ], function(err, rows, fields) {
if (err) throw err;

    connection.query(' SELECT busstop FROM points WHERE id_point = ? AND point_type = 0  ORDER BY busstop ' ,
    [ res[1] ], function(err, rows, fields) {
    if (err) throw err;
    var busstop = JSON.parse(JSON.stringify(rows));

    bot.sendMessage(query.message.chat.id, 'Ваша конечная остановка: ' + busstop[0].busstop);
    })
})

})
}


function show_interception_topass(msg){

var mysql  = require('mysql');
        var pool = mysql.createPool({
        host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
        database : 'route_passenger'
    })

var zapros = msg.text;
var user_id = msg.chat.id;
var point_type = 1;
var n_route_p = 'n_route_p'+user_id;

pool.getConnection(function(err, connection) {

    connection.query('SELECT start FROM ?? WHERE id = (SELECT MAX(id) FROM ??) ',[ n_route_p, n_route_p ], function(err, rows, fields) {
    if (err) throw err;
    var district = JSON.parse(JSON.stringify(rows));
    console.log(district);

            connection.query('SELECT * FROM kowe WHERE district1 = ?  ORDER BY streetname ',[district[0].start], function(err, rows, fields) {
            if (err) throw err;
            var streetname = JSON.parse(JSON.stringify(rows));
            var keyboard = [];

            for(var i = 0; i < streetname.length; i++){
            keyboard.push([{'text': ( streetname[i].streetname ) , 'callback_data': ('11 ' + streetname[i].id_str)}]);
            }

            bot.sendMessage( user_id, 'Выберите одну из улиц вашего пересечения ',
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


function show_interception_topass_21(msg){

var mysql  = require('mysql');
        var pool = mysql.createPool({
        host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
        database : 'route_passenger'
    })

var zapros = msg.text;
var user_id = msg.chat.id;
var point_type = 1;
var route_passenger = 'n_route_p'+user_id;

pool.getConnection(function(err, connection) {

    connection.query('SELECT finish FROM ?? WHERE id = (SELECT MAX(id) FROM ??) ',[route_passenger, route_passenger], function(err, rows, fields) {
    if (err) throw err;
    var district = JSON.parse(JSON.stringify(rows));
    console.log(district);

    connection.query('SELECT * FROM kowe WHERE district1 = ?  ORDER BY streetname ',[district[0].finish], function(err, rows, fields) {
    if (err) throw err;
    var streetname = JSON.parse(JSON.stringify(rows));
    var keyboard = [];

    for(var i = 0; i < streetname.length; i++){
    keyboard.push([{'text': ( streetname[i].streetname ) , 'callback_data': ('21 ' + streetname[i].id_str)}]);
    }

    bot.sendMessage( user_id, 'Выберите одну из улиц вашего пересечения ',
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


function insert_11_interception(query){

var mysql  = require('mysql');
        var pool = mysql.createPool({
        host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
        database : 'route_passenger'
    })

var zapros = query.data;
var user_id = query.message.chat.id;
var point_type = 1;
var n_route_passenger = 'n_route_p'+user_id;
var route_passenger = 'route_p'+user_id;
  var str = query.data;
  var res = str.split(" ");
  console.log('#insert_11_interception   res is:', res[1]);

pool.getConnection(function(err, connection) {

    connection.query('SELECT * FROM ?? WHERE id = (SELECT MAX(id) FROM ??) ',[n_route_passenger, n_route_passenger], function(err, rows, fields) {
    if (err) throw err;
    var district = JSON.parse(JSON.stringify(rows));
    console.log('Номер маршрута',district);

    connection.query('SELECT * FROM kowe WHERE id_str = ? ',[ res[1] ], function(err, rows, fields) {
    if (err) throw err;
    var street = JSON.parse(JSON.stringify(rows));
    console.log('Из таблицы коше',street);

       connection.query(' INSERT INTO ?? (begend, n_zapros, id_user, id_route, district, point_type, id_street, street) VALUES (?,?,?,?,?,?,?,?)',
       [route_passenger, 'beg', 1, user_id, district[0].id, district[0].start, 1, street[0].id_str, street[0].streetname ], function(err, rows, fields) {
       if (err) throw err;
       console.log('ИНсертед 11');

           connection.query('SELECT * FROM points WHERE id_street = ? AND point_type = 1 AND district = ?  ORDER BY ordinal ',[ res[1], district[0].start ], function(err, rows, fields) {
           if (err) throw err;
           var street = JSON.parse(JSON.stringify(rows));
           var keyboard = [];

           for(var i = 0; i < street.length; i++){
           keyboard.push([{'text': ( street[i].interception ) , 'callback_data': ('12 ' + street[i].id_interception)}]);
           }

           bot.sendMessage( user_id, `Вы выбрали ${street[0].street }\nТеперь выберите вторую улицу вашего пересечения`,
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
}


function insert_12_interception(query){

after_choosing_beg_interception(query);

var mysql  = require('mysql');
        var pool = mysql.createPool({
        host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
        database : 'route_passenger'
    })

var zapros = query.data;
var user_id = query.message.chat.id;
var point_type = 1;
var n_route_passenger = 'n_route_p'+user_id;
var route_passenger = 'route_p'+user_id;
  var str = query.data;
  var res = str.split(" ");
  console.log('res is:', res[1]);

pool.getConnection(function(err, connection) {

    connection.query('SELECT * FROM ?? WHERE id = (SELECT MAX(id) FROM ??) ',[ route_passenger, route_passenger], function(err, rows, fields) {
    if (err) throw err;
    var street = JSON.parse(JSON.stringify(rows));
    console.log('11 street',street);

    connection.query(' SELECT * FROM points WHERE id_street = ? AND id_interception = ? ',[ street[0].id_street, res[1] ], function(err, rows, fields) {
    if (err) throw err;
    var interception = JSON.parse(JSON.stringify(rows));
    console.log('11 interception',interception);

      connection.query(' UPDATE ?? SET id_interception = ?, interception = ?, id_point = ?, busstop = ?, nearby_interception = ?, point_parinter_min5 = ?, point_parinter_plu5 = ? WHERE id = ? ',
      [route_passenger, interception[0].id_interception, interception[0].interception, interception[0].id_point, interception[0].busstop, interception[0].nearby_interception, interception[0].point_parinter_min5, interception[0].point_parinter_plu5, street[0].id], function(err, rows, fields) {
      if (err) throw err;
      console.log('12 updated');

        connection.query('SELECT finish FROM ?? WHERE id = (SELECT MAX(id) FROM ??) ',[n_route_passenger, n_route_passenger], function(err, rows, fields) {
        if (err) throw err;
        var district = JSON.parse(JSON.stringify(rows));
        console.log(district);

            connection.query('SELECT * FROM kowe WHERE district1 = ?  ORDER BY streetname ',[district[0].finish], function(err, rows, fields) {
            if (err) throw err;
               var streetname = JSON.parse(JSON.stringify(rows));
               var keyboard = [];

               for(var i = 0; i < streetname.length; i++){
               keyboard.push([{'text': ( streetname[i].streetname ) , 'callback_data': ('21 ' + streetname[i].id_str)}]);
               }

               bot.sendMessage( user_id, `Ваша пункт отправления ${interception[0].street} - ${interception[0].interception}\nТеперь укажите пункт назначения, указав пересечение или автобусную остановку, нажав на Указать автобусную остановку`,
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
}


function insert_21_interception(query){

var mysql  = require('mysql');
        var pool = mysql.createPool({
        host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
        database : 'route_passenger'
    })

var zapros = query.data;
var user_id = query.message.chat.id;
var point_type = 1;
var n_route_passenger = 'n_route_p'+user_id;
var route_passenger = 'route_p'+user_id;
  var str = query.data;
  var res = str.split(" ");
  console.log('res is:', res[1]);

pool.getConnection(function(err, connection) {

    connection.query('SELECT * FROM ?? WHERE id = (SELECT MAX(id) FROM ??) ',[n_route_passenger, n_route_passenger], function(err, rows, fields) {
    if (err) throw err;
    var district = JSON.parse(JSON.stringify(rows));
    console.log('Номер маршрута',district);
    connection.query('SELECT * FROM kowe WHERE id_str = ? ',[ res[1]], function(err, rows, fields) {
    if (err) throw err;
    var street = JSON.parse(JSON.stringify(rows));
    console.log('Из таблицы коше',street);

       connection.query(' INSERT INTO ?? (begend, n_zapros, id_user, id_route, district, point_type, id_street, street) VALUES (?,?,?,?,?,?,?,?)',
       [route_passenger, 'end', 1, user_id, district[0].id, district[0].finish, 1, street[0].id_str, street[0].streetname ], function(err, rows, fields) {
       if (err) throw err;
       console.log('ИНсертед 21');

           connection.query('SELECT * FROM points WHERE id_street = ? AND point_type = 1 AND district = ? ORDER BY ordinal ',[ res[1], district[0].finish ], function(err, rows, fields) {
           if (err) throw err;
              var street = JSON.parse(JSON.stringify(rows));
               var keyboard = [];

               for(var i = 0; i < street.length; i++){
               keyboard.push([{'text': ( street[i].interception ) , 'callback_data': ('22 ' + street[i].id_interception)}]);
               }

               bot.sendMessage( user_id, `Вы выбрали ${street[0].street}\nТеперь выберите вторую улицу вашего пересечения`,
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
}


function indicate_number_of_passengers(query) {

const chatId = query.message.chat.id
const text = 'Сколько вас человек?'
bot.sendMessage(chatId, text, {
                     reply_markup: {
                       inline_keyboard: [
                         [{
                           text: 'Я один/одна',
                           callback_data: 'n_pass one_pass'
                         }],

                         [{
                           text: 'Нас двое',
                           callback_data: 'n_pass two_pass'
                         }],

                         [{
                           text: 'Нас трое',
                           callback_data: 'n_pass three_pass'
                         }],

                         [{
                           text: 'Нас четверо',
                           callback_data: 'n_pass four_pass'
                         }]

                       ]
                     }
                   })
}



function insert_22_interception(query){

var mysql  = require('mysql');
        var pool = mysql.createPool({
        host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
        database : 'route_passenger'
    })

var zapros = query.data;
var user_id = query.message.chat.id;
var point_type = 1;
var n_route_passenger = 'n_route_p'+user_id;
var route_passenger = 'route_p'+user_id;
  var str = query.data;
  var res = str.split(" ");
  console.log('res is:', res[1]);

pool.getConnection(function(err, connection) {

    connection.query('SELECT * FROM ?? WHERE id = (SELECT MAX(id) FROM ??) ',[ route_passenger, route_passenger], function(err, rows, fields) {
    if (err) throw err;
    var street = JSON.parse(JSON.stringify(rows));
    console.log('11 street',street);

    connection.query(' SELECT * FROM points WHERE id_street = ? AND id_interception = ?',[street[0].id_street, res[1] ], function(err, rows, fields) {
    if (err) throw err;
    var interception = JSON.parse(JSON.stringify(rows));
    console.log('11 interception',interception);

      connection.query(' UPDATE ?? SET id_interception = ?, interception = ?, id_point = ?, busstop = ?, nearby_interception = ?, point_parinter_min5 = ?, point_parinter_plu5 = ?  WHERE id = ? ',
      [route_passenger, interception[0].id_interception, interception[0].interception, interception[0].id_point, interception[0].busstop, interception[0].nearby_interception, interception[0].point_parinter_min5, interception[0].point_parinter_plu5, street[0].id], function(err, rows, fields) {
      if (err) throw err;
      console.log('22 updated');
// Теперь даем два варианта Сейчас или Потом
      indicate_number_of_passengers(query);
      })
    })
    })
// Выдаем новое меню кнопок, где есть кнопка редактировать последний перекресток
      after_choosing_end_interception (query);
})
}


function insert_number_of_passengers(query){

var mysql  = require('mysql');
        var pool = mysql.createPool({
        host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
        database : 'route_passenger'
    })

var zapros = query.data;
var user_id = query.message.chat.id;
var point_type = 1;
var n_route_passenger = 'n_route_p'+user_id;
var route_passenger = 'route_p'+user_id;
var zapros_v_massiv = zapros.split(" ");
var zapros_v_massiv2 = zapros_v_massiv.shift();
var zapros_v_massiv3 = zapros_v_massiv.join(" ");
console.log('Запрос',zapros);
console.log('Запрос улица1',zapros_v_massiv[1]);
console.log('Запрос улица0',zapros_v_massiv[0]);
console.log('Запрос улица z',zapros_v_massiv);
console.log('Запрос улица z2',zapros_v_massiv2);
console.log('Запрос улица z3-0',zapros_v_massiv3[0]);
console.log('Запрос улица z3',zapros_v_massiv3);

if (zapros_v_massiv3 === 'one_pass') { var n_pass = 1 }
else if (zapros_v_massiv3 === 'two_pass') { var n_pass = 2 }
else if (zapros_v_massiv3 === 'three_pass') { var n_pass = 3 }
else { var n_pass = 4 }
console.log('N-pass',n_pass);

pool.getConnection(function(err, connection) {

      connection.query(' UPDATE ?? SET n_pass = ? WHERE id_route = (SELECT MAX(id_route) FROM (SELECT * FROM ??) AS route2) ',
      [ route_passenger, n_pass, route_passenger ], function(err, rows, fields) {
      if (err) throw err;
      console.log('Добавили колво пассажиров');
// Теперь даем два варианта Сейчас или Потом
      passenger_choose_time(query);
      })
})
}


function pass_to_driv (msg) {

const chatId = msg.chat.id
const text = 'Вы точно хотите перейти в режим водителя'
bot.sendMessage(chatId, text, {
                     reply_markup: {
                       inline_keyboard: [
                         [{
                           text: 'Да, точно',
                           callback_data: 'yes_to_driv'
                         }],

                         [{
                           text: 'Нет, нечаянно нажал',
                           callback_data: 'no_to_driv'
                         }]
                       ]
                     }
                })
}


function driv_to_pass (msg) {

const chatId = msg.chat.id
const text = 'Вы точно хотите перейти в режим пассажира'
bot.sendMessage(chatId, text, {
                     reply_markup: {
                       inline_keyboard: [
                         [{
                           text: 'Да, да',
                           callback_data: 'yes_to_pass'
                         }],

                         [{
                           text: 'Нет, нечаянно нажал.',
                           callback_data: 'no_to_pass'
                         }]
                       ]
                     }
                })
}


//bot.on('polling_error', (error) => {
//  console.log(error.code);  // => 'EFATAL'
//})

bot.onText(/\/massiv/, msg => {massiv()})

bot.onText(/\/menumap/, msg => {menumap()})

bot.onText(/\/select/, msg => {vibor()})

bot.onText(/\/sel/, msg => {vibor()})

bot.onText(/\/outline/, msg => {inkey(msg)})

bot.onText(/\/find/, msg => {find(msg)})

bot.onText(/\/nayti_driver_poputi/, msg => {nayti_driver_poputi(msg)})

bot.onText(/\/tabu_driver_poputi/, msg => {tabu_driver_poputi(msg)})

bot.onText(/\/menu/, msg => {menumap(msg)})


bot.on('callback_query', query => {

  var str = query.data;
  var res = str.split(" ");
  console.log('res is:', res[0]);
  var res2 = str.split("#");
  console.log('res is:', res2[0]);


  if (query.data =='driver') {create_user(query);
  bot.sendMessage(query.message.chat.id, 'Марка вашего автомобиля\nНапишите в таком формате:\nБелая Toyota Camry 30'); bot.deleteMessage(query.message.chat.id, query.message.message_id ) }
  else if (query.data =='stop_not') { stop_notify_driv (query) }
  else if (query.data =='stop_not_pass') { stop_notify_pass (query) }
  else if (query.data =='passenger'){create_user(query);  mujorjen (query); bot.deleteMessage(query.message.chat.id, query.message.message_id ) }
  else if (query.data =='man' || query.data =='woman' ){pol(query); bot.sendMessage(query.message.chat.id, 'Напишите ваш номер телефона\nНапишите слитно в таком формате:\n+77013331234'); bot.deleteMessage(query.message.chat.id, query.message.message_id ) }
  else if (query.data =='man msg' || query.data =='woman msg' ){pol(query); pass_again(query); bot.deleteMessage(query.message.chat.id, query.message.message_id )}
  else if (query.data =='mkdk' || query.data =='grd' || query.data =='saran' || query.data =='aktas' || query.data =='dubovka' || query.data =='fedorovka' || query.data =='bazar' || query.data =='yug' || query.data =='srt' || query.data =='doskey' || query.data =='trud' || query.data =='uwtobe' || query.data =='prihon' || query.data =='zhbi' || query.data =='novouzenka' || query.data =='malsaran' )
  { choose_from_district_driver(query); bot.deleteMessage(query.message.chat.id, query.message.message_id) }
  else if (query.data =='mkdk2' || query.data =='grd2' || query.data =='saran2' || query.data =='aktas2' || query.data =='dubovka2' || query.data =='fedorovka2' || query.data =='bazar2' || query.data =='yug2' || query.data =='srt2' || query.data =='doskey2' || query.data =='trud2' || query.data =='uwtobe2' || query.data =='prihon2' || query.data =='zhbi2' || query.data =='novouzenka2' || query.data =='malsaran2' )
  { choose_to_district_driver(query); bot.deleteMessage(query.message.chat.id, query.message.message_id)  }
  else if (query.data =='driver_again') { driv_again(query) }
  else if (query.data =='passenger_again') { pass_again(query) }
  else if (query.data =='ready now') { passenger_update_time(query); bot.deleteMessage(query.message.chat.id, query.message.message_id) }
  else if (query.data =='plan time') { passenger_plan_time(query); bot.deleteMessage(query.message.chat.id, query.message.message_id) }
  else if (res[0] == 'time') { passenger_update_plan_time(query); bot.deleteMessage(query.message.chat.id, query.message.message_id) }
  else if (res[0] == '11') { insert_11_interception(query); bot.deleteMessage(query.message.chat.id, query.message.message_id) }
  else if (res[0] == '12') { insert_12_interception(query); bot.deleteMessage(query.message.chat.id, query.message.message_id) }
  else if (res[0] == '21') { insert_21_interception(query); bot.deleteMessage(query.message.chat.id, query.message.message_id) }
  else if (res[0] == '22') { insert_22_interception(query); bot.deleteMessage(query.message.chat.id, query.message.message_id) }
  else if (res[0] == 'n_pass') { insert_number_of_passengers(query); bot.deleteMessage(query.message.chat.id, query.message.message_id) }
  else if (res[0] == 'n_place') { end_route(query); search_regime_query(query); bot.deleteMessage(query.message.chat.id, query.message.message_id ) }
  else if (res[0] == 'driver') { console.log('driver: ', query.data); accept_driver(query) }
  else if (res[0] == 'offer_to_pass') { console.log('offer to pass ', query.data); offer_to_pass(query) }
  else if (res[0] == 'accept_offer') { console.log('accepted offer ', query.data); pass_confirmed(query) }
  else if (res2[0] == 'beg_inter1') { console.log('beg inter 1 выбран', query.data); choose_beg_inter(query); bot.deleteMessage(query.message.chat.id, query.message.message_id ) }
  else if (res2[0] == 'beg_inter2') { console.log('beg inter 2 выбран', query.data); choose_beg_inter2(query); bot.deleteMessage(query.message.chat.id, query.message.message_id) }
  else if (res2[0] == 'kbd') { console.log('kbd 2 выбран', query.data); kbd(query); bot.deleteMessage(query.message.chat.id, query.message.message_id) }
  else if (res[0] == 'confirm_pass') { console.log('confirm_pass ', query.data); offer_to_pass(query) }
  else if (res[0] == 'route') { activate_route(query) }
  else if (query.data === 'page1' || query.data === 'page2' || query.data === 'page3' || query.data === 'page4' ) { through_pages(query); bot.deleteMessage(query.message.chat.id, query.message.message_id) }
  else if (query.data === 'page1_end' || query.data === 'page2_end' || query.data === 'page3_end' || query.data === 'page4_end' ) { through_pages_end(query); bot.deleteMessage(query.message.chat.id, query.message.message_id) }
  else if (query.data === 'no_to_pass'){ driv_query (query); bot.deleteMessage(query.message.chat.id, query.message.message_id) }
  else if (query.data === 'no_to_driv'){ const chatId = query.message.chat.id; const text_keyboard = 'Вы на главном меню'; bot.sendMessage(chatId, text_keyboard, main_menu_passenger_query); bot.deleteMessage(query.message.chat.id, query.message.message_id) }
  else if (query.data === 'yes_to_driv'){
     bot.deleteMessage(query.message.chat.id, query.message.message_id)
     var mysql  = require('mysql');
             var pool = mysql.createPool({
             host     : 'localhost',
             user     : 'mybd_user',
             password : 'admin123',
             database : 'sitebot'
         })

     pool.getConnection(function(err, connection) {
     var user_id = query.message.chat.id;
     connection.query ('SELECT * FROM users WHERE id_user = ? ',[user_id], function(err, rows, fields) {
          if (err) throw err;
          var str_parse_rows = JSON.parse(JSON.stringify(rows));
          console.log('yes to driv STR PARSE', str_parse_rows );
           if (str_parse_rows.length > 1){
           driv_query(query)
           }
           else {register_pass_asdriv(query)}
      })
      })
      }
  else if (query.data === 'yes_to_pass'){
     bot.deleteMessage(query.message.chat.id, query.message.message_id)
     var user_id = query.message.chat.id;
     var mysql  = require('mysql');
             var pool = mysql.createPool({
             host     : 'localhost',
             user     : 'mybd_user',
             password : 'admin123',
             database : 'sitebot'
         })

     pool.getConnection(function(err, connection) {
     connection.query ('SELECT * FROM users WHERE id_user = ? ',[user_id], function(err, rows, fields) {
     if (err) throw err;
     var str_parse_rows = JSON.parse(JSON.stringify(rows));
           if (str_parse_rows.length > 1){
           pass_query(query)
           }
           else {register_driv_aspass(query)}
      })
      })
      }
  else {

   if ( res[0] == 'busstop_beg' || res[0] == 'busstop_end' ){
      console.log('БАССТОП бег или енд выбран!');  bot.deleteMessage(query.message.chat.id, query.message.message_id);
      if (res[0] == 'busstop_beg') {
      after_choosing_beg_busstop(query);
      console.log('БЕГ БАССТОП выбран!');
      insert_busstop_beg(query);
      }
      else {
      after_choosing_end_busstop(query);
      console.log('ЭНД БАССТОП выбран!');
      insert_busstop_end(query);
      indicate_number_of_passengers(query);
      }
   }
   else if (res[0] == 'mkdk_pass1' || res[0] == 'grd_pass1' || res[0] =='saran_pass1' || res[0] =='aktas_pass1' || res[0] =='dubovka_pass1' || res[0] =='fedorovka_pass1' || res[0] =='bazar_pass1' || res[0] =='yug_pass1' || res[0] =='srt_pass1' || res[0] =='doskey_pass1' || res[0] =='trud_pass1' || res[0] =='uwtobe_pass1' || res[0] =='prihon_pass1' || res[0] =='zhbi_pass1' || res[0] =='novouzenka_pass1' || res[0] =='malsaran_pass1' )
   { console.log('ОТКУДА Район выбран!'); choose_from_district(query);  bot.deleteMessage(query.message.chat.id, query.message.message_id) }
   else if (res[0] == 'mkdk_pass2' || res[0] == 'grd_pass2' || res[0] =='saran_pass2' || res[0] =='aktas_pass2' || res[0] =='dubovka_pass2' || res[0] =='fedorovka_pass2' || res[0] =='bazar_pass2' || res[0] =='yug_pass2' || res[0] =='srt_pass2' || res[0] =='doskey_pass2' || res[0] =='trud_pass2' || res[0] =='uwtobe_pass2' || res[0] =='prihon_pass2' || res[0] =='zhbi_pass2' || res[0] =='novouzenka_pass2' || res[0] =='malsaran_pass2' )
   { console.log('КУДА Район выбран!'); choose_to_district(query);  bot.deleteMessage(query.message.chat.id, query.message.message_id) }

   else {kbd(query)}
   }
})



bot.on('message', msg => {

         var mysql  = require('mysql');
         var pool = mysql.createPool({
         host     : 'localhost',
         user     : 'mybd_user',
         password : 'admin123',
         database : 'sitebot'
         })

var user_id = msg.chat.id;

pool.getConnection(function(err, connection) {

      connection.query('SELECT DISTINCT * FROM users WHERE id_user = ? ',[user_id], function(err, rows, fields) {
      if (err) throw err;
      var user = JSON.parse(JSON.stringify(rows));
      console.log('users chosen', user);

              if (msg.text === '/start') {
                  if (user[0] !== undefined) {
                       if (user[1] !== undefined) { vodorpas_again (msg) }
                       else { if (user[0].vibor === 'driver') {driv(msg)}
                              else {pass(msg)}
                       }
                  }
                  else {
                       const text = `Здравствуйте, ${msg.from.first_name}\nЭтот робот помогает водителям авто находить попутных пассажиров`
                       bot.sendMessage(helper.getChatId(msg), text);
                       vodorpas(msg);
                  }
              }

// Начало нововведения
              else if (user.length == 1 || user.length == 2) {
              console.log('user length is 1 or 2: ', user.length);
              console.log('message text ', msg.text);
                   if (user.length == 1) {
                       if (user[0].marka === null && user[0].vibor === 'driver') { marka(msg) }
                       else if (user[0].marka !== null && user[0].nomer === null && user[0].vibor === 'driver') { nomer(msg); bot.sendMessage(msg.chat.id, 'Напишите ваш номер телефона\nНапишите слитно в таком формате:\n+77013330044') }
                       else if (user[0].nomer !== null && user[0].tel === null) { tel(msg) }
                       else if (user[0].pol !== null && user[0].tel === null) { telpas(msg) }
        // Кнопки водителя
                      else if (msg.text === 'Стать пассажиром'){driv_to_pass(msg)}
                      else if (msg.text === '🙋‍♂️ Найти попутчиков'){choose_direction(msg)}
                      else if (msg.text === '▶️ Создать новый маршрут'){ choose_street_msg(msg) }
                      else if (msg.text === '⏯ Активизировать сохраненные маршруты'){choose_route_toactivate(msg)}
                      else if (msg.text === 'Завершить маршрут'){ indicate_number_of_places(msg);   bot.deleteMessage(msg.chat.id, msg.message_id); }
                      else if (msg.text === '⬅️ Назад на главное меню'){driv(msg)}
                      else if (msg.text === '⚫️ На главное меню'){driv(msg)}
                      else if (msg.text === 'Назад на прежний перекресток'){back_to_prev(msg)}
                      else if (msg.text === '💽 Мои данные') {edit_profile_driver(msg)}
        // Кнопки пассажира
                      else if (msg.text === 'Стать водителем'){pass_to_driv(msg)}
                      else if (msg.text === '🚗 Найти авто'){choose_direction_passenger(msg)}
                      else if (msg.text === 'Назад в меню'){ const chatId = msg.chat.id; const text_keyboard = 'Вы на главном меню'; bot.sendMessage(chatId, text_keyboard, main_menu_passenger) }
                      else if (msg.text === 'Исправить начало пути'){edit_beg_busstop(msg)}
                      else if (msg.text === 'Исправить начало пути.'){ edit_beg_interception(msg) }
                      else if (msg.text === 'Исправить конец пути'){ edit_end_busstop(msg) }
                      else if (msg.text === 'Исправить конец пути.'){ edit_end_interception(msg) }
                      else if (msg.text === 'Указать пересечение улиц'){show_interception_topass(msg); bot.deleteMessage(msg.chat.id, msg.message_id)}
                      else if (msg.text === 'Указать пересечение улиц.'){show_interception_topass_21(msg); after_choosing_beg_interception_msg(msg)}
                      else if (msg.text === 'Указать автобусную остановку'){choose_end_busstop(msg)}
                      else if (msg.text === '🔴 Показать попутчиков по району'){send_rayon_poputi(msg)}
                      else if (msg.text === '🔵 Отменить поиск попутчиков'){are_u_sure(msg)}
                      else if (msg.text === 'Да, я уверен') { driv(msg); to_busy_regime(msg) }
                      else if (msg.text === 'Нет') {search_regime(msg)}
                      else if (msg.text === '💾 Мои данные.') {edit_profile_pass(msg)}
                      else {console.log('Hmm')}
                   }
                   else if (user.length == 2) {
                      if (user[1].marka === null && user[1].vibor === 'driver') { marka(msg) }
                      else if (user[1].marka !== null && user[1].nomer === null && user[1].vibor === 'driver') { nomer(msg); create_route_driver(msg); driv(msg) }
                      else if (user[1].pol !== null && user[1].pol !== undefined && user[1].tel === null) { telpas(msg) }
// Кнопки водителя
                      else if (msg.text === 'Стать пассажиром'){driv_to_pass(msg)}
                      else if (msg.text === '🙋‍♂️ Найти попутчиков'){choose_direction(msg)}
                      else if (msg.text === '▶️ Создать новый маршрут'){ choose_street_msg(msg) }
                      else if (msg.text === '⏯ Активизировать сохраненные маршруты'){choose_route_toactivate(msg)}
                      else if (msg.text === 'Завершить маршрут'){ indicate_number_of_places(msg);   bot.deleteMessage(msg.chat.id, msg.message_id); }
                      else if (msg.text === '⬅️ Назад на главное меню'){driv(msg)}
                      else if (msg.text === '⚫️ На главное меню'){driv(msg)}
                      else if (msg.text === 'Назад на прежний перекресток'){back_to_prev(msg)}
                      else if (msg.text === '💽 Мои данные') {edit_profile_driver(msg)}
// Кнопки пассажира
                      else if (msg.text === 'Стать водителем'){pass_to_driv(msg)}
                      else if (msg.text === '🚗 Найти авто'){choose_direction_passenger(msg)}
                      else if (msg.text === 'Назад в меню'){ const chatId = msg.chat.id; const text_keyboard = 'Вы на главном меню'; bot.sendMessage(chatId, text_keyboard, main_menu_passenger) }
                      else if (msg.text === 'Исправить начало пути'){edit_beg_busstop(msg)}
                      else if (msg.text === 'Исправить начало пути.'){ edit_beg_interception(msg) }
                      else if (msg.text === 'Исправить конец пути'){ edit_end_busstop(msg) }
                      else if (msg.text === 'Исправить конец пути.'){ edit_end_interception(msg) }
                      else if (msg.text === 'Указать пересечение улиц'){show_interception_topass(msg); bot.deleteMessage(msg.chat.id, msg.message_id)}
                      else if (msg.text === 'Указать пересечение улиц.'){show_interception_topass_21(msg); after_choosing_beg_interception_msg(msg)}
                      else if (msg.text === 'Указать автобусную остановку'){choose_end_busstop(msg)}
                      else if (msg.text === '🔴 Показать попутчиков по району'){send_rayon_poputi(msg)}
                      else if (msg.text === '🔵 Отменить поиск попутчиков'){are_u_sure(msg)}
                      else if (msg.text === 'Да, я уверен') { driv(msg); to_busy_regime(msg) }
                      else if (msg.text === 'Нет') {search_regime(msg)}
                      else if (msg.text === '💾 Мои данные.') {edit_profile_pass(msg)}
                      else {console.log('Hmm')}
                   }
               }
//              }

// Конец нововведения

//              else if (user[0].marka === null && user[0].vibor === 'driver' && user.length == 1 ) { marka(msg)}
//              else if (user[1].marka === null && user[1].vibor === 'driver' && user.length == 2) { marka(msg)}
//              else if (user[0].marka !== null && user[0].nomer === null && user.length == 1 && user[0].vibor === 'driver') { nomer(msg); bot.sendMessage(msg.chat.id, 'Ваш номер телефона\nНапишите слитно в таком формате:\n+77013331234') }
//              else if (user[1].marka !== null && user[1].nomer === null && user.length == 2 && user[1].vibor === 'driver') { nomer(msg); create_route_driver(msg); driv(msg)}
//              else if (user[0].nomer !== null && user[0].tel === null) { tel(msg) }
//              else if (user[0].pol !== null && user[0].tel === null) { telpas(msg) }
//              else if (user[1].pol !== null && user[1].pol !== undefined && user[1].tel === null) { telpas(msg) }

//// Кнопки водителя
//              else if (msg.text === 'Стать пассажиром'){driv_to_pass(msg)}
//              else if (msg.text === '🙋‍♂️ Найти попутчиков'){findpas(msg)}
//              else if (msg.text === '▶️ Создать новый маршрут'){choose_direction(msg)}
//              else if (msg.text === '⏯ Активизировать сохраненные маршруты'){choose_route_toactivate(msg)}
//              else if (msg.text === 'Завершить маршрут'){ indicate_number_of_places(msg);   bot.deleteMessage(msg.chat.id, msg.message_id); }
//              else if (msg.text === '⬅️ Назад на главное меню'){driv(msg)}
//              else if (msg.text === '⚫️ На главное меню'){driv(msg)}
//              else if (msg.text === 'Назад на прежний перекресток'){back_to_prev(msg)}
//              else if (msg.text === '💽 Мои данные') {edit_profile_driver(msg)}
//// Кнопки пассажира
//              else if (msg.text === 'Стать водителем'){pass_to_driv(msg)}
//              else if (msg.text === '🚗 Найти авто'){choose_direction_passenger(msg)}
//              else if (msg.text === 'Назад в меню'){ const chatId = msg.chat.id; const text_keyboard = 'Вы на главном меню'; bot.sendMessage(chatId, text_keyboard, main_menu_passenger) }
//              else if (msg.text === 'Исправить начало пути'){edit_beg_busstop(msg)}
//              else if (msg.text === 'Исправить начало пути.'){ edit_beg_interception(msg) }
//              else if (msg.text === 'Исправить конец пути'){ edit_end_busstop(msg) }
//              else if (msg.text === 'Исправить конец пути.'){ edit_end_interception(msg) }
//              else if (msg.text === 'Указать пересечение улиц'){show_interception_topass(msg); bot.deleteMessage(msg.chat.id, msg.message_id)}
//              else if (msg.text === 'Указать пересечение улиц.'){show_interception_topass_21(msg); after_choosing_beg_interception_msg(msg)}
//              else if (msg.text === 'Указать автобусную остановку'){choose_end_busstop(msg)}
//              else if (msg.text === '🔴 Показать попутчиков по району'){send_rayon_poputi(msg)}
//              else if (msg.text === '🔵 Отменить поиск попутчиков'){are_u_sure(msg)}
//              else if (msg.text === 'Да, я уверен') { driv(msg); to_busy_regime(msg) }
//              else if (msg.text === 'Нет') {search_regime(msg)}
//              else if (msg.text === '💾 Мои данные.') {edit_profile_pass(msg)}
//              else if (msg.text === 'йцукен'){create_route_driver(msg)}
//        else {console.log('Hmm')}
//        }
     })

})

})


bot.onText(/\/stop/, msg => {
bot.sendMessage(msg.chat.id, 'stop sending to console');
timer.pause();
})

bot.onText(/\/resume/, msg => {
bot.sendMessage(msg.chat.id, 'resuming');
timer.resume();
})

//bot.onText(/\/remove/, msg => {
//bot.sendMessage(msg.chat.id, 'removing');
//timer.removeTask(task1).pause();
//})


bot.onText(/\/talk/, msg => {
bot.sendMessage(166832568, 'Я включил заново бота можете чуть попользоваться');
})


bot.onText(/\/timer/, msg => {
timer_passenger(msg)
})

function intervalFunc() {
console.log('Cant stop me now!');
}

function intervalFunc2() {
console.log('2 Cant stop me now!');
}

// Timer with 1000ms (1 second) base interval resolution.
var timer = new TaskTimer(1000);

// Add task(s) based on tick intervals.
timer.addTask({
    name: 'job1',       // unique name of the task
    tickInterval: 30,    // run every 5 ticks (5 x interval = 5000 ms)
    totalRuns: 1,      // run 10 times only. (set to 0 for unlimited times)
    callback: function (task) {
        // code to be executed on each run
//        tabu_driver_poputi2();
//        tabu_pass_on_parinter2();
        console.log(task.name + ' task has run ' + task.currentRuns + ' times.');
    }
});

timer.start();




function timer_passenger (msg){

var mysql  = require('mysql');
        var pool = mysql.createPool({
        host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
        database : 'sitebot'
    })

var zapros = msg.chat.text;
var user_id = msg.chat.id;
var point_type = 1;
var n_route_passenger = 'n_route_p'+user_id;
var route_passenger = 'route_p'+user_id;


pool.getConnection(function(err, connection) {

   connection.query(' SELECT * FROM route_p WHERE time_end > NOW() ', function(err, rows, fields) {
   if (err) throw err;
   var passenger = JSON.parse(JSON.stringify(rows));
   console.log('Нашли пассажиров', passenger);
   if (passenger.length === 0) { console.log('Сейчас нет пассажиров не плохо было бы остановить таймер', passenger); timer.pause(); }
   else{
   console.log('есть пассажиры', passenger)

   }
   })
})
}




function send_rayon_poputi_query (query){

var mysql  = require('mysql');
        var pool = mysql.createPool({
        host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
        database : 'sitebot'
    })

var user_id = query.message.chat.id;
var n_route_driver = 'n_route'+user_id;
var route_driver = 'route'+user_id;

pool.getConnection(function(err, connection) {


   connection.query(' SELECT all_districts FROM route WHERE time_end > ADDTIME (NOW(), "03:00:00") AND id_user = ? ', [ user_id ],  function(err, rows, fields) {
   if (err) throw err;
   var active_drivers = JSON.parse(JSON.stringify(rows));
   console.log('Нашли водителей', active_drivers);
   if (active_drivers.length == 0) { console.log('Сейчас нет водителей не плохо было бы остановить таймер', active_drivers) }
   else{
      console.log('есть еще активные водители', active_drivers)

// Затем преобразовываем all_districts в массив с районами
             var splited = active_drivers[0].all_districts.split("00");
             if (splited.length == 2){
             var like = 'LIKE "%' + active_drivers[0].all_districts + '%" ) ';
             }
             else if (splited.length == 3) {
             var like = 'LIKE "%' + splited[0] + '00' + splited[1] + '%" ' + 'OR all_districts LIKE "%' + splited[1] + '00' + splited[2] + '%" ' + 'OR all_districts LIKE "%' + splited[0] + '00' + splited[2] + '%" ) ';
             }
             else if (splited.length == 4) {
             var like = 'LIKE "%' + splited[0] + '00' + splited[1] + '%" ' + 'OR all_districts LIKE "%' + splited[1] + '00' + splited[2] + '%" ' + 'OR all_districts LIKE "%' + splited[0] + '00' + splited[2] + '%" '+ 'OR all_districts LIKE "%' + splited[2] + '00' + splited[3] + '%" '  + 'OR all_districts LIKE "%' + splited[0] + '00' + splited[3] + '%" '  + 'OR all_districts LIKE "%' + splited[1] + '00' + splited[3] + '%" ) ';
             }
             else{}
             console.log('лайки', like)
             var select = ' SELECT * FROM route_p WHERE time_end > ADDTIME (NOW(), "03:00:00") AND status <> "busy" AND (all_districts ' + like;

// active_drivers[i].id_user

             connection.query( select, function(err, rows, fields) {
             if (err) throw err;
             var passenger_poputi_district = JSON.parse(JSON.stringify(rows));
             console.log('passenger_poputi_district', passenger_poputi_district)

             if (passenger_poputi_district.length == 0){
             var text = 'В данный момент в вашем направлений нет пассажиров\nНо как только появятся, бот сразу же уведомит вас';
             console.log(' нет пассажиров', user_id)
             bot.sendMessage(user_id, text)
             }
             else {
             console.log(' есть пассажиры')

                for (var i = 0; i < passenger_poputi_district.length/2; i++) {

//                  if( passenger_poputi_district[2*i].interception === null && passenger_poputi_district[2*i+1].interception === null ) {
//                  var number_pass = i+1;
//                  var keyboard = [];
//                  keyboard.push([{'text': ( number_pass +') ' + passenger_poputi_district[2*i+1].n_pass +' чел.'+ ' ОТ ост. ' + passenger_poputi_district[2*i].busstop ) , 'callback_data': ('offer_to_pass '+ passenger_poputi_district[2*i].id_user + ' ' + user_id )}]);
//                  var variant2 =  number_pass +') ' + passenger_poputi_district[2*i+1].n_pass +' чел.'+ ' ОТ ост. ' + passenger_poputi_district[2*i].busstop + ' ДО ост. ' + passenger_poputi_district[2*i+1].busstop ;
////                  variant.push( number_pass +') ' + passenger_poputi_district[2*i+1].n_pass +' чел.'+ ' ОТ ост. ' + passenger_poputi_district[2*i].busstop + ' ДО ост. ' + passenger_poputi_district[2*i+1].busstop ) ;
//                  }
//
//                  else if ( passenger_poputi_district[2*i].interception === null && passenger_poputi_district[2*i+1].interception !== null ){
//                  var number_pass = i+1;
//                  var keyboard = [];
//                  keyboard.push([{'text': ( number_pass +') ' + passenger_poputi_district[2*i+1].n_pass +' чел.'+ ' ОТ ост. ' + passenger_poputi_district[2*i].busstop ) , 'callback_data': ('offer_to_pass '+ passenger_poputi_district[2*i].id_user + ' ' + user_id )}]);
//                  var variant2 = number_pass +') ' + passenger_poputi_district[2*i+1].n_pass +' чел.'+ ' ОТ ост. ' + passenger_poputi_district[2*i].busstop + ' ДО ' + passenger_poputi_district[2*i+1].street + '-' + passenger_poputi_district[2*i+1].interception ;
////                  variant.push([number_pass +') ' + passenger_poputi_district[2*i+1].n_pass +' чел.'+ ' ОТ ост. ' + passenger_poputi_district[2*i].busstop + ' ДО ' + passenger_poputi_district[2*i+1].street + '-' + passenger_poputi_district[2*i+1].interception]);
//                  }
//
//                  else if ( passenger_poputi_district[2*i].interception !== null && passenger_poputi_district[2*i+1].interception === null ){
//                  var number_pass = i+1;
//                  var keyboard = [];
//                  keyboard.push([{'text': ( number_pass +') ' + passenger_poputi_district[2*i+1].n_pass +' чел.'+ ' ОТ ост. ' + passenger_poputi_district[2*i].street ) , 'callback_data': ('offer_to_pass '+ passenger_poputi_district[2*i].id_user + ' ' + user_id )}]);
//                  var variant2 = number_pass +') ' + passenger_poputi_district[2*i+1].n_pass +' чел.'+ ' ОТ ' + passenger_poputi_district[2*i].street + '-' + passenger_poputi_district[2*i].interception + ' ДО ост. ' + passenger_poputi_district[2*i+1].busstop ;
////                  variant.push([ number_pass +') ' + passenger_poputi_district[2*i+1].n_pass +' чел.'+ ' ОТ ' + passenger_poputi_district[2*i].street + '-' + passenger_poputi_district[2*i].interception + ' ДО ост. ' + passenger_poputi_district[2*i+1].busstop ]);
//                  }
//
//                  else {
//                  var number_pass = i+1;
//                  var keyboard = [];
//                  keyboard.push([{'text': ( number_pass +') ' + passenger_poputi_district[2*i+1].n_pass +' чел.'+ ' c ' + passenger_poputi_district[2*i].interception + '-' + passenger_poputi_district[2*i].street ) , 'callback_data': ('offer_to_pass '+ passenger_poputi_district[2*i].id_user + ' ' + user_id )}]);
//                  var variant2 = number_pass +') ' + passenger_poputi_district[2*i+1].n_pass +' чел.'+ ' ОТ ' + passenger_poputi_district[2*i].interception + '-' + passenger_poputi_district[2*i].street + ' ДО ' + passenger_poputi_district[2*i+1].street + '-' + passenger_poputi_district[2*i+1].interception ;
////                  variant.push( number_pass +') ' + passenger_poputi_district[2*i+1].n_pass +' чел.'+ ' ОТ ' + passenger_poputi_district[2*i].interception + '-' + passenger_poputi_district[2*i].street + ' ДО ' + passenger_poputi_district[2*i+1].street + '-' + passenger_poputi_district[2*i+1].interception );
//                  }


////
                  if( passenger_poputi_district[2*i].interception === null && passenger_poputi_district[2*i+1].interception === null ) {
                  var number_pass = i+1;
                  var keyboard = [];
                  keyboard.push([{'text': ( 'Предложить пассажиру забрать его' ) , 'callback_data': ('offer_to_pass '+ passenger_poputi_district[2*i].id_user + ' ' + user_id )}]);
                  var variant2 = '🔹 Возможно этот/эти пассажиры вам по пути. \n' + number_pass +') ' + passenger_poputi_district[2*i+1].n_pass +' чел.'+ ' ОТ ост. ' + passenger_poputi_district[2*i].busstop + ' ДО ост. ' + passenger_poputi_district[2*i+1].busstop + '\n⬇️  Если хотите забрать его нажмите';
                  }

                  else if ( passenger_poputi_district[2*i].interception === null && passenger_poputi_district[2*i+1].interception !== null ){
                  var number_pass = i+1;
                  var keyboard = [];
                  keyboard.push([{'text': ( 'Предложить пассажиру забрать его' ) , 'callback_data': ('offer_to_pass '+ passenger_poputi_district[2*i].id_user + ' ' + user_id )}]);
                  var variant2 = '🔹 Возможно этот/эти пассажиры вам по пути. \n' + number_pass +') ' + passenger_poputi_district[2*i+1].n_pass +' чел.'+ ' ОТ ост. ' + passenger_poputi_district[2*i].busstop + ' ДО ' + passenger_poputi_district[2*i+1].street + '-' + passenger_poputi_district[2*i+1].interception + '\n⬇️   Если хотите забрать его нажмите';
                  }

                  else if ( passenger_poputi_district[2*i].interception !== null && passenger_poputi_district[2*i+1].interception === null ){
                  var number_pass = i+1;
                  var keyboard = [];
                  keyboard.push([{'text': ( 'Предложить пассажиру забрать его' ) , 'callback_data': ('offer_to_pass '+ passenger_poputi_district[2*i].id_user + ' ' + user_id )}]);
                  var variant2 = '🔹 Возможно этот/эти пассажиры вам по пути. \n' + number_pass +') ' + passenger_poputi_district[2*i+1].n_pass +' чел.'+ ' ОТ ' + passenger_poputi_district[2*i].street + '-' + passenger_poputi_district[2*i].interception + ' ДО ост. ' + passenger_poputi_district[2*i+1].busstop + '\n⬇️  Если хотите забрать его нажмите';
                  }

                  else {
                  var number_pass = i+1;
                  var keyboard = [];
                  keyboard.push([{'text': ( 'Предложить пассажиру забрать его' ) , 'callback_data': ('offer_to_pass '+ passenger_poputi_district[2*i].id_user + ' ' + user_id )}]);
                  var variant2 = '🔹 Возможно этот/эти пассажиры вам по пути. \n' + number_pass +') ' + passenger_poputi_district[2*i+1].n_pass +' чел.'+ ' ОТ ' + passenger_poputi_district[2*i].interception + '-' + passenger_poputi_district[2*i].street + ' ДО ' + passenger_poputi_district[2*i+1].street + '-' + passenger_poputi_district[2*i+1].interception + '\n⬇️  Если хотите забрать его нажмите';
                  }


                bot.sendMessage( user_id, variant2,
                 {
                  'reply_markup': JSON.stringify({
                    inline_keyboard: keyboard
                  })
                 }
                )

                }
                }
             })
      }
//   }
   })
})
}



function send_rayon_poputi_pass_query (query){

var mysql  = require('mysql');
        var pool = mysql.createPool({
        host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
        database : 'sitebot'
    })

var user_id = query.message.chat.id;
var n_route_driver = 'n_route'+user_id;
var route_driver = 'route'+user_id;

var sql = ' SELECT * FROM (SELECT P_interception, P_street, P_busstop, P_n_pass, P_id_user, P_id_route, District, P_begend, D_id_route, D_id_user, D_begend FROM ' +
          ' ( SELECT route_p.interception AS P_interception, route_p.street AS P_street, route_p.busstop AS P_busstop, route_p.n_pass AS P_n_pass, route_p.id_user AS P_id_user, route_p.id_route AS P_id_route, route.district AS District, route_p.begend AS P_begend, route.id_route AS D_id_route, route.id_user AS D_id_user, route.begend AS D_begend FROM route_p JOIN route ' +
          ' WHERE route_p.district = route.district  AND ( route.begend = "beg" OR route.begend IS NULL ) AND route_p.begend = "beg" AND route.time_end > ADDTIME (NOW(), "03:00:00") AND route_p.time_end > ADDTIME (NOW(), "03:00:00") AND route_p.id_user = ? ) AS table1 ' +
          ' WHERE EXISTS  ( SELECT * FROM ' +
          ' ( SELECT route_p.interception AS P_interception, route_p.street AS P_street, route_p.busstop AS P_busstop, route_p.n_pass AS P_n_pass, route_p.id_user AS P_id_user, route_p.id_route AS P_id_route, route.district AS District, route_p.begend AS P_begend, route.id_route AS D_id_route, route.id_user AS D_id_user, route.begend AS D_begend FROM route_p JOIN route ' +
          ' WHERE route_p.district = route.district  AND ( route.begend = "end" OR route.begend IS NULL ) AND route_p.begend = "end" AND route.time_end > ADDTIME (NOW(), "03:00:00") AND route_p.time_end > ADDTIME (NOW(), "03:00:00") AND route_p.id_user = ? ) AS table2 ' +
          ' WHERE table1.P_id_user = table2.P_id_user AND table1.D_id_route = table2.D_id_route )) AS table3 ';

pool.getConnection(function(err, connection) {

connection.query( 'SELECT * FROM route_p WHERE id_user = ? AND id_route = (SELECT id_route FROM route_p WHERE id_user = ? ORDER BY id DESC LIMIT 1)' , [ user_id, user_id ],  function(err, rows, fields) {
if (err) throw err;
var passenger_poputi_district = JSON.parse(JSON.stringify(rows));
console.log('!!send_rayon_poputi_pass_query!! Данные пассажира' , passenger_poputi_district)

   connection.query( sql , [ user_id, user_id ],  function(err, rows, fields) {
   if (err) throw err;
   var driver = JSON.parse(JSON.stringify(rows));

   if (passenger_poputi_district.length == 0) { console.log('Сейчас нет водителей не плохо было бы остановить таймер', passenger_poputi_district) }
   else{
      console.log('!!send_rayon_poputi_pass_query!! есть еще активные водители', passenger_poputi_district)

//  keyboard.push([{'text': ( 'Предложить пассажиру забрать его' ) , 'callback_data': ('offer_to_pass '+ passenger_poputi_district[2*i].id_user + ' ' + user_id )}]);
//  var variant2 = '🔹 Возможно этот/эти пассажиры вам по пути. \n' + number_pass +') ' + passenger_poputi_district[2*i+1].n_pass +' чел.'+ ' ОТ ' + passenger_poputi_district[2*i].interception + '-' + passenger_poputi_district[2*i].street + ' ДО ' + passenger_poputi_district[2*i+1].street + '-' + passenger_poputi_district[2*i+1].interception + '\n⏹  Если хотите забрать его нажмите ⬇️ ';



        if( passenger_poputi_district[0].interception === null && passenger_poputi_district[1].interception === null ) {
          var keyboard = [];
           for (var i = 0; i < driver.length; i++) {

          keyboard.push([{'text': ( 'Предложить пассажиру забрать его' ) , 'callback_data': ('offer_to_pass '+ user_id + ' ' + driver[i].D_id_user )}]);
          var variant2 =  '🔹 Возможно этот/эти пассажиры вам по пути. \n' + passenger_poputi_district[1].n_pass +' чел.'+ ' ОТ ост. ' + passenger_poputi_district[0].busstop + ' по улице ' + passenger_poputi_district[0].street + ' ДО ост. ' + passenger_poputi_district[1].busstop + ' по улице ' + passenger_poputi_district[1].street + '\n⬇️ Если хотите забрать его нажмите ';

                  bot.sendMessage( driver[i].D_id_user , variant2,
                   {
                    'reply_markup': JSON.stringify({
                      inline_keyboard: keyboard
                    })
                   }
                  )

          }
          }

          else if ( passenger_poputi_district[0].interception === null && passenger_poputi_district[1].interception !== null ){
          var keyboard = [];
          for (var i = 0; i < driver.length; i++) {

          keyboard.push([{'text': ( 'Предложить пассажиру забрать его' ) , 'callback_data': ('offer_to_pass '+ user_id + ' ' + driver[i].D_id_user )}]);
          var variant2 = '🔹 Возможно этот/эти пассажиры вам по пути. \n' + passenger_poputi_district[1].n_pass +' чел.'+ ' ОТ ост. ' + passenger_poputi_district[0].busstop + ' по улице ' + passenger_poputi_district[0].street + ' ДО ' + passenger_poputi_district[1].street + '-' + passenger_poputi_district[1].interception  + '\n⬇️ Если хотите забрать его нажмите ';

                  bot.sendMessage( driver[i].D_id_user , variant2,
                   {
                    'reply_markup': JSON.stringify({
                      inline_keyboard: keyboard
                    })
                   }
                  )

          }
          }

          else if ( passenger_poputi_district[0].interception !== null && passenger_poputi_district[1].interception === null ){
          var keyboard = [];
          for (var i = 0; i < driver.length; i++) {

          keyboard.push([{'text': ( 'Предложить пассажиру забрать его' ) , 'callback_data': ('offer_to_pass '+ user_id + ' ' + driver[i].D_id_user )}]);
          var variant2 = '🔹 Возможно этот/эти пассажиры вам по пути. \n' + passenger_poputi_district[1].n_pass +' чел.'+ ' ОТ ' + passenger_poputi_district[0].street + '-' + passenger_poputi_district[0].interception + ' ДО ост. ' + passenger_poputi_district[1].busstop + ' по улице ' + passenger_poputi_district[1].street + '\n⬇️ Если хотите забрать его нажмите ';

                 bot.sendMessage( driver[i].D_id_user , variant2,
                   {
                    'reply_markup': JSON.stringify({
                      inline_keyboard: keyboard
                    })
                   }
                  )

          }
          }

          else {
          var keyboard = [];
          for (var i = 0; i < driver.length; i++) {

          keyboard.push([{'text': ( 'Предложить пассажиру забрать его' ) , 'callback_data': ('offer_to_pass '+ user_id + ' ' + driver[i].D_id_user )}]);
          var variant2 = '🔹 Возможно этот/эти пассажиры вам по пути. \n' + passenger_poputi_district[1].n_pass +' чел.'+ ' ОТ ' + passenger_poputi_district[0].interception + '-' + passenger_poputi_district[0].street + ' ДО ' + passenger_poputi_district[1].street + '-' + passenger_poputi_district[1].interception  + '\n⬇️ Если хотите забрать его нажмите ';

                bot.sendMessage( driver[i].D_id_user , variant2,
                   {
                    'reply_markup': JSON.stringify({
                      inline_keyboard: keyboard
                    })
                   }
                  )

          }
          }

      }
   })
   })
})

}



function send_rayon_poputi (msg){

var mysql  = require('mysql');
        var pool = mysql.createPool({
        host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
        database : 'sitebot'
    })

var zapros = msg.chat.text;
var user_id = msg.chat.id;
var n_route_driver = 'n_route'+user_id;
var route_driver = 'route'+user_id;


pool.getConnection(function(err, connection) {

// Сначала узнаем all_districts водителя
   connection.query(' SELECT all_districts FROM route WHERE time_end > NOW() AND id_user = ? ', [ user_id ],  function(err, rows, fields) {
   if (err) throw err;
   var active_drivers = JSON.parse(JSON.stringify(rows));
   console.log('Нашли водителей', active_drivers);
   if (active_drivers.length == 0) { console.log('Сейчас нет водителей не плохо было бы остановить таймер', active_drivers) }
   else{
      console.log('есть еще активные водители', active_drivers)

// Затем преобразовываем all_districts в массив с районами
             var splited = active_drivers[0].all_districts.split("00");
             if (splited.length == 2){
             var like = 'LIKE "%' + active_drivers[0].all_districts + '%" ) ';
             }
             else if (splited.length == 3) {
             var like = 'LIKE "%' + splited[0] + '00' + splited[1] + '%" ' + 'OR all_districts LIKE "%' + splited[1] + '00' + splited[2] + '%" ' + 'OR all_districts LIKE "%' + splited[0] + '00' + splited[2] + '%" ) ';
             }
             else if (splited.length == 4) {
             var like = 'LIKE "%' + splited[0] + '00' + splited[1] + '%" ' + 'OR all_districts LIKE "%' + splited[1] + '00' + splited[2] + '%" ' + 'OR all_districts LIKE "%' + splited[0] + '00' + splited[2] + '%" '+ 'OR all_districts LIKE "%' + splited[2] + '00' + splited[3] + '%" '  + 'OR all_districts LIKE "%' + splited[0] + '00' + splited[3] + '%" '  + 'OR all_districts LIKE "%' + splited[1] + '00' + splited[3] + '%" ) ';
             }
             else{}
             console.log('лайки', like)
             var select = ' SELECT * FROM route_p WHERE time_end > NOW() AND status <> "busy" AND (all_districts ' + like;
// active_drivers[i].id_user
             connection.query( select, function(err, rows, fields) {
             if (err) throw err;
             var passenger_poputi_district = JSON.parse(JSON.stringify(rows));
             console.log('passenger_poputi_district', passenger_poputi_district)
                if (passenger_poputi_district.length == 0){
                var text = 'В данный момент в вашем направлений нет пассажиров';
                console.log(' нет пассажиров', user_id)
                bot.sendMessage(user_id, text)
                }
                else {
                console.log(' есть пассажиры')

//                var keyboard = [];
                var variant = [];

                for (var i = 0; i < passenger_poputi_district.length/2; i++) {

                  if( passenger_poputi_district[2*i].interception === null && passenger_poputi_district[2*i+1].interception === null ) {
                  var number_pass = i+1;
                  var keyboard = [];
                  keyboard.push([{'text': ( number_pass +') ' + passenger_poputi_district[2*i+1].n_pass +' чел.'+ ' ОТ ост. ' + passenger_poputi_district[2*i].busstop ) , 'callback_data': ('offer_to_pass '+ passenger_poputi_district[2*i].id_user + ' ' + user_id )}]);
                  var variant2 =  number_pass +') ' + passenger_poputi_district[2*i+1].n_pass +' чел.'+ ' ОТ ост. ' + passenger_poputi_district[2*i].busstop + ' ДО ост. ' + passenger_poputi_district[2*i+1].busstop ;
//                  variant.push( number_pass +') ' + passenger_poputi_district[2*i+1].n_pass +' чел.'+ ' ОТ ост. ' + passenger_poputi_district[2*i].busstop + ' ДО ост. ' + passenger_poputi_district[2*i+1].busstop ) ;
                  }

                  else if ( passenger_poputi_district[2*i].interception === null && passenger_poputi_district[2*i+1].interception !== null ){
                  var number_pass = i+1;
                  var keyboard = [];
                  keyboard.push([{'text': ( number_pass +') ' + passenger_poputi_district[2*i+1].n_pass +' чел.'+ ' ОТ ост. ' + passenger_poputi_district[2*i].busstop ) , 'callback_data': ('offer_to_pass '+ passenger_poputi_district[2*i].id_user + ' ' + user_id )}]);
                  var variant2 = number_pass +') ' + passenger_poputi_district[2*i+1].n_pass +' чел.'+ ' ОТ ост. ' + passenger_poputi_district[2*i].busstop + ' ДО ' + passenger_poputi_district[2*i+1].street + '-' + passenger_poputi_district[2*i+1].interception ;
//                  variant.push([number_pass +') ' + passenger_poputi_district[2*i+1].n_pass +' чел.'+ ' ОТ ост. ' + passenger_poputi_district[2*i].busstop + ' ДО ' + passenger_poputi_district[2*i+1].street + '-' + passenger_poputi_district[2*i+1].interception]);
                  }

                  else if ( passenger_poputi_district[2*i].interception !== null && passenger_poputi_district[2*i+1].interception === null ){
                  var number_pass = i+1;
                  var keyboard = [];
                  keyboard.push([{'text': ( number_pass +') ' + passenger_poputi_district[2*i+1].n_pass +' чел.'+ ' ОТ ост. ' + passenger_poputi_district[2*i].street ) , 'callback_data': ('offer_to_pass '+ passenger_poputi_district[2*i].id_user + ' ' + user_id )}]);
                  var variant2 = number_pass +') ' + passenger_poputi_district[2*i+1].n_pass +' чел.'+ ' ОТ ' + passenger_poputi_district[2*i].street + '-' + passenger_poputi_district[2*i].interception + ' ДО ост. ' + passenger_poputi_district[2*i+1].busstop ;
//                  variant.push([ number_pass +') ' + passenger_poputi_district[2*i+1].n_pass +' чел.'+ ' ОТ ' + passenger_poputi_district[2*i].street + '-' + passenger_poputi_district[2*i].interception + ' ДО ост. ' + passenger_poputi_district[2*i+1].busstop ]);
                  }

                  else {
                  var number_pass = i+1;
                  var keyboard = [];
                  keyboard.push([{'text': ( number_pass +') ' + passenger_poputi_district[2*i+1].n_pass +' чел.'+ ' c ' + passenger_poputi_district[2*i].interception + '-' + passenger_poputi_district[2*i].street ) , 'callback_data': ('offer_to_pass '+ passenger_poputi_district[2*i].id_user + ' ' + user_id )}]);
                  var variant2 = number_pass +') ' + passenger_poputi_district[2*i+1].n_pass +' чел.'+ ' ОТ ' + passenger_poputi_district[2*i].interception + '-' + passenger_poputi_district[2*i].street + ' ДО ' + passenger_poputi_district[2*i+1].street + '-' + passenger_poputi_district[2*i+1].interception ;
//                  variant.push( number_pass +') ' + passenger_poputi_district[2*i+1].n_pass +' чел.'+ ' ОТ ' + passenger_poputi_district[2*i].interception + '-' + passenger_poputi_district[2*i].street + ' ДО ' + passenger_poputi_district[2*i+1].street + '-' + passenger_poputi_district[2*i+1].interception );
                  }

                bot.sendMessage( user_id, variant2,
                 {
                  'reply_markup': JSON.stringify({
                    inline_keyboard: keyboard
                  })
                 }
                )
                }
                }
             })
      }
//   }
   })
})
}



function timer_driver (){

var mysql  = require('mysql');
        var pool = mysql.createPool({
        host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
        database : 'sitebot'
    })

//var zapros = msg.chat.text;
//var user_id = query.message.chat.id;
var n_route_driver = 'n_route'+user_id;
var route_driver = 'route'+user_id;


pool.getConnection(function(err, connection) {

// Сначала проверяем на наличие активных водителей.
   connection.query(' SELECT DISTINCT id_user, all_districts FROM route WHERE time_end > NOW() AND status <> ? ', [ 'busy' ],  function(err, rows, fields) {
   if (err) throw err;
   var active_drivers = JSON.parse(JSON.stringify(rows));
   console.log('Нашли водителей', active_drivers);

             var splited = active_drivers[0].all_districts.split("00");

             if (splited.length == 2){
             var like = 'LIKE "%' + active_drivers[i].all_districts + '%" ) ';
             }
             else if (splited.length == 3) {
             var like = 'LIKE "%' + splited[0] + '00' + splited[1] + '%" ' + 'OR all_districts LIKE "%' + splited[1] + '00' + splited[2] + '%" ' + 'OR all_districts LIKE "%' + splited[0] + '00' + splited[2] + '%" ) ';
             }
             else if (splited.length == 4) {
             var like = 'LIKE "%' + splited[0] + '00' + splited[1] + '%" ' + 'OR all_districts LIKE "%' + splited[1] + '00' + splited[2] + '%" ' + 'OR all_districts LIKE "%' + splited[0] + '00' + splited[2] + '%" '+ 'OR all_districts LIKE "%' + splited[2] + '00' + splited[3] + '%" '  + 'OR all_districts LIKE "%' + splited[0] + '00' + splited[3] + '%" '  + 'OR all_districts LIKE "%' + splited[1] + '00' + splited[3] + '%" ) ';
             }
             else{}

             console.log('лайки', like)
             var select = ' SELECT * FROM route_p WHERE time_end > NOW() AND status <> "busy" AND (all_districts ' + like;
             connection.query( select, function(err, rows, fields) {
             if (err) throw err;
             var passenger_poputi_district = JSON.parse(JSON.stringify(rows));
             console.log('passenger_poputi_district', passenger_poputi_district)
                if (passenger_poputi_district.length == 0){
                var text = 'В данный момент в вашем направлений нет пассажиров';
                console.log(' нет пассажиров', user_id)
                bot.sendMessage(user_id, text)
                }
                else {
                console.log(' есть пассажиры', user_id)

                var keyboard = [];
                var variant = [];

                for (var i = 0; i < passenger_poputi_district.length/2; i++) {

                  if( passenger_poputi_district[2*i].interception === null && passenger_poputi_district[2*i+1].interception === null ) {
                  var mm = passenger_poputi_district[2*i].busstop;
                  var ww = mm.split("");
                  var joined = ww.join("");
                  console.log(ww);
                  console.log(joined);
                  var mm2 = passenger_poputi_district[2*i+1].busstop;
                  var ww2 = mm2.split("");
                  var joined2 = ww2.join("");
                  console.log(ww2);
                  console.log(joined2);
                  var number_pass = i+1;
                  keyboard.push([{'text': ( number_pass +') ' + passenger_poputi_district[2*i+1].n_pass +' чел.'+ ' ОТ ост. ' + joined ) , 'callback_data': ('map '+ i + 1 + joined)}]);
                  variant.push[( number_pass +') ' + passenger_poputi_district[2*i+1].n_pass +' чел.'+ ' ОТ ост. ' + joined + ' ДО ост. ' + joined2)] ;

                  }
                  else if ( passenger_poputi_district[2*i].interception === null && passenger_poputi_district[2*i+1].interception !== null ){
                  var mm = passenger_poputi_district[2*i].busstop;
                  var ww = mm.split("");
                  var joined = ww.join("");
                  console.log(ww);
                  console.log(joined);
                  var mm2 = passenger_poputi_district[2*i+1].busstop;
                  var ww2 = mm2.split("");
                  var joined2 = ww2.join("");
                  console.log(ww2);
                  console.log(joined2);
                  var number_pass = i+1;
                  keyboard.push([{'text': ( number_pass +') ' + passenger_poputi_district[2*i+1].n_pass +' чел.'+ ' ОТ ост. ' + joined ) , 'callback_data': ('map '+ i + 1 + joined)}]);
                  variant.push([number_pass +') ' + passenger_poputi_district[2*i+1].n_pass +' чел.'+ ' ОТ ост. ' + joined + ' ДО ' + passenger_poputi_district[2*i+1].street + '-' + passenger_poputi_district[2*i+1].interception]);
                  }
                  else if ( passenger_poputi_district[2*i].interception !== null && passenger_poputi_district[2*i+1].interception === null ){
                  var mm = passenger_poputi_district[2*i].street;
                  var ww = mm.split("");
                  var joined = ww.join("");
                  console.log(ww);
                  console.log(joined);
                  var mm2 = passenger_poputi_district[2*i].interception;
                  var ww2 = mm2.split("");
                  var joined2 = ww2.join("");
                  console.log(ww2);
                  console.log(joined2);
                  var number_pass = i+1;
                  keyboard.push([{'text': ( number_pass +') ' + passenger_poputi_district[2*i+1].n_pass +' чел.'+ ' ОТ ост. ' + joined ) , 'callback_data': ('map '+ i + 1 + joined)}]);
                  variant.push([ number_pass +') ' + passenger_poputi_district[2*i+1].n_pass +' чел.'+ ' ОТ ' + passenger_poputi_district[2*i].street + '-' + passenger_poputi_district[2*i].interception + ' ДО ост. ' + passenger_poputi_district[2*i+1].busstop ]);
                  }
                  else {
                  var mm = passenger_poputi_district[2*i].interception;
                  var ww = mm.split("");
                  var joined = ww.join("");
                  console.log(ww);
                  console.log(joined);
                  var mm2 = passenger_poputi_district[2*i].street;
                  var ww2 = mm2.split("");
                  var joined2 = ww2.join("");
                  console.log(ww2);
                  console.log(joined2);
                  var number_pass = i+1;
                  keyboard.push([{'text': ( number_pass +') ' + passenger_poputi_district[2*i+1].n_pass +' чел.'+ ' c ' + joined + '-' + joined2 ) , 'callback_data': ('map '+ i + 1 + joined)}]);
                  variant.push([number_pass +') ' + passenger_poputi_district[2*i+1].n_pass +' чел.'+ ' ОТ ' + joined + '-' + joined2 + ' ДО ' + passenger_poputi_district[2*i+1].street + '-' + passenger_poputi_district[2*i+1].interception]);
                  }

                }
                variant.join();

                bot.sendMessage( user_id, variant,
                 {
                  'reply_markup': JSON.stringify({
                    inline_keyboard: keyboard
                  })
                 }
                )
                }
             })


   })
})
}



bot.onText(/\/like/, msg => {
like(msg)
})

function like (msg){

var mysql  = require('mysql');
        var pool = mysql.createPool({
        host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
        database : 'sitebot'
    })

var zapros = msg.chat.text;
var user_id = msg.chat.id;
var point_type = 1;
var n_route_passenger = 'n_route_p'+user_id;
var route_passenger = 'route_p'+user_id;
var ww = 'grd00grd';
var pp = 'SELECT * FROM route_p WHERE all_districts = '+'"'+ww+'"' ;
// LIKE %'+ww+'%'
   console.log('pp', pp);

pool.getConnection(function(err, connection) {

   connection.query(pp,  function(err, rows, fields) {
   if (err) throw err;
   var passenger = JSON.parse(JSON.stringify(rows));
   console.log('like', passenger);
   })

})
}

bot.onText(/\/rayon/, msg => {
rayon(msg)
})


function rayon (msg){

var mysql  = require('mysql');
        var pool = mysql.createPool({
        host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
        database : 'route_driver'
    })

var zapros = msg.chat.text;
var user_id = msg.chat.id;
var route_driver = 'route'+user_id;


pool.getConnection(function(err, connection) {

connection.query(' SELECT * FROM ?? WHERE begend = "beg" OR begend = "end" ORDER BY id DESC LIMIT 2',[ route_driver ], function (err, rows, fields) {
if (err) throw err;
var str_vse2 = JSON.parse(JSON.stringify(rows));
console.log(str_vse2);
var pp = '%' + str_vse2[0].district + '%';
var pp1 = '%' + str_vse2[1].district + '%';
//
         connection.query(' SELECT DISTINCT district FROM ?? WHERE id_route = ? AND district NOT LIKE ? AND district NOT LIKE ?  ',[ route_driver, str_vse2[0].id_route, pp, pp1 ], function (err, rows, fields) {
         if (err) throw err;
         var str_vse3 = JSON.parse(JSON.stringify(rows));
         console.log('rayon', str_vse3);
            if (str_vse3 === [] ){
            var all_districts = str_vse2[1].district + '00' + str_vse2[0].district;
            console.log('all distrs if', all_districts);
            }
            else {
            var all_districts0 = [];
            for(var i = 0; i < rows.length; i++){
            all_districts0[all_districts0.length] = rows[i].district;
            }
            all_districts0.unshift(str_vse2[1].district);
            all_districts0.push(str_vse2[0].district);
            var all_districts = all_districts0.join('00')
            console.log('all distrs else', all_districts);
            }

         })
})
})
}



function pass_confirmed(query) {

var user_id = query.message.chat.id;
  var str = query.data;
  var res = str.split(" ");
  console.log( 'pass_confirmed user id is:', res[1] + ' ' + res[2]);

var mysql  = require('mysql');
        var pool = mysql.createPool({
        host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
        database : 'sitebot'
    })

pool.getConnection(function(err, connection) {

connection.query(' SELECT * FROM route_p WHERE id_user = ? AND begend = "beg" ORDER BY id DESC LIMIT 1 ', [user_id], function(err, rows, fields) {
if (err) throw err;
var pass = JSON.parse(JSON.stringify(rows));

connection.query(' SELECT * FROM users WHERE id_user = ? AND vibor = "driver" ', [res[2]], function(err, rows, fields) {
if (err) throw err;
var user_driver = JSON.parse(JSON.stringify(rows));

    connection.query(' SELECT * FROM users WHERE id_user = ? AND vibor = "passenger" ', [user_id], function(err, rows, fields) {
    if (err) throw err;
    var user = JSON.parse(JSON.stringify(rows));

    if (pass[0].interception !== null){
    var driveru_text = '🔴 Пассажир подтвердил ваш запрос!\nЗаберите его/ее с ' + pass[0].street + '-' + pass[0].interception + '\nИмя: ' + user[0].fname + '. Номер тел.: ' + user[0].tel;
       bot.sendMessage(res[2], driveru_text)
       console.log('sent to passenger ');
    }
    else{
    var driveru_text = '🔴 Пассажир подтвердил ваш запрос!\nЗаберите его/ее с ост. "' + pass[0].busstop + '" по улице ' + pass[0].street + '\nИмя: ' + user[0].fname + '. Номер тел.: ' + user[0].tel;
       bot.sendMessage(res[2], driveru_text)
       console.log('sent to passenger ');
    }

    var passu_text = '🔴 Машина марки ' + user_driver[0].marka + ' с гос.номером ' + user_driver[0].nomer + ' едет за вами. Номер тел. ' + user_driver[0].tel + ' Ждите!';

       bot.sendMessage(user_id, passu_text)

       // Теперь отправляем фото
       bot.sendPhoto(user_id, fs.readFileSync(__dirname + '/taxi-stop.jpg'), {
       caption: 'Как увидите машину, поднимите руку, дайте знать водителю'
       })
       console.log('sent to passenger ');

           connection.query(' UPDATE route_p SET status = "busy", id_driver = ? WHERE id_user = ? ',[ res[2] , res[1]], function(err, rows, fields) {
           if (err) throw err;
                 // Уведомляем админа о сделке
                 var text = '✔️Машина марки ' + user_driver[0].marka + ' с гос.номером ' + user_driver[0].nomer + ' Номер тел. ' + user_driver[0].tel + ' забирает ' + user[0].fname + 'с номером' + user[0].tel;
                 bot.sendMessage(336243307, text)
           })
    })
})
})
})
}



function offer_to_pass(query) {

var user_id = query.message.chat.id;
  var str = query.data;
  var res = str.split(" ");
  console.log(' offer_to_pass user id is:', res[1] + ' ' + res[2]);

var mysql  = require('mysql');
        var pool = mysql.createPool({
        host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
        database : 'sitebot'
    })

pool.getConnection(function(err, connection) {

// Сначала находим всех активных пассажиров
connection.query(' SELECT TIME(time_beg) AS time_beg, street, interception, id_user, district FROM route WHERE time_end > NOW() AND id_user = ? ', [user_id], function(err, rows, fields) {
if (err) throw err;
var driver = JSON.parse(JSON.stringify(rows));

if (driver[0].street === null) {
    var first = driver[0].district;

    if (first == 'mkdk'){ var district = 'Майкудук';}
    else if (first == 'grd'){ var district = 'Центр';}
    else if (first == 'saran'){ var district = 'Сарань';}
    else if (first == 'aktas'){ var district = 'Актас';}
    else if (first == 'dubovka'){ var district = 'Дубовка';}
    else if (first == 'fedorovka'){ var district = 'Федоровка';}
    else if (first == 'bazar'){ var district = 'Район базара';}
    else if (first == 'yug'){ var district = 'Юго-восток';}
    else if (first == 'srt'){ var district = 'Сортировка';}
    else if (first == 'doskey'){ var district = 'Доскей';}
    else if (first == 'trud'){ var district = 'пос. Трудовое';}
    else if (first == 'uwtobe'){ var district = 'Уштобе';}
    else if (first == 'prihon'){ var district = 'Пришахтинск';}
    else if (first == 'zhbi'){ var district = 'район ЖБИ';}
    else if (first == 'novouzenka'){ var district = 'Новоузенка';}
    else if (first == 'malsaran'){ var district = 'Малая сарань';}
    var passu_text = '🔵 Водитель предлагает Вас забрать. Он выезжает с района ' + district  + ' в ' + driver[0].time_beg;
}
else {
    var passu_text = '🔵 Водитель предлагает Вас забрать. Он выезжает с пер. ' + driver[0].street + '-' + driver[0].interception + ' в ' + driver[0].time_beg;
}

   bot.sendMessage(res[1], passu_text, {
                    reply_markup: {
                    inline_keyboard: [
                    [{
                    text: 'Согласиться',
                    callback_data: 'accept_offer ' + res[1] + ' ' +res[2]
                    }]
                    ]
                    }
                  })
   console.log('sent to passenger ');
})
})
}



function accept_driver (query){

var user_id = query.message.chat.id;
  var str = query.data;
  var res = str.split(" ");
  console.log('res is:', res[0]);
  console.log('user id is:', res[1]);

var mysql  = require('mysql');
        var pool = mysql.createPool({
        host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
        database : 'sitebot'
    })

pool.getConnection(function(err, connection) {

// Сначала находим всех активных пассажиров
connection.query(' SELECT * FROM route_p WHERE time_end > NOW() AND status <> "busy" and id_user = ? AND begend = "beg"  ', [user_id], function(err, rows, fields) {
if (err) throw err;
var active_passenger = JSON.parse(JSON.stringify(rows));

   connection.query(' SELECT * FROM users WHERE id_user = ? AND vibor = "passenger" ', [user_id], function(err, rows, fields) {
   if (err) throw err;
   var user = JSON.parse(JSON.stringify(rows));

   if(active_passenger[0].interception === null){
   var driveru_text = '🔴' + active_passenger[0].n_pass + ' попутчик/а по имени ' + user[0].fname + ' ждет вас на остановке "' + active_passenger[0].busstop + '" по улице ' + active_passenger[0].street +' Номер тел. ' + user[0].tel;
   }
   else {
   var driveru_text = '🔴' + active_passenger[0].n_pass + ' попутчик/а по имени ' + user[0].fname + ' ждет вас на перекрестке ' + active_passenger[0].street + ' - ' + active_passenger[0].interception +' Номер тел. ' + user[0].tel;
   }

   bot.sendMessage(res[1], driveru_text)
   console.log('sent to driver ');


         connection.query(' SELECT * FROM users WHERE id_user = ? AND vibor = "driver" ', [res[1]], function(err, rows, fields) {
   if (err) throw err;
   var driver = JSON.parse(JSON.stringify(rows));
   var passu_text = '🔴 Машина марки ' + driver[0].marka + ' с гос.номером ' + driver[0].nomer + ' едет за вами. Номер тел. ' + driver[0].tel + ' Ждите!';

   bot.sendMessage(user_id, passu_text)
   // Теперь отправляем фото
   bot.sendPhoto(user_id, fs.readFileSync(__dirname + '/taxi-stop.jpg'), {
   caption: 'Как увидите машину, поднимите руку, дайте знать водителю'
   })
   console.log('sent to passenger ');

          connection.query(' UPDATE route_p SET status = "busy", id_driver = ? WHERE id_user = ? ',[ res[1] ,user_id], function(err, rows, fields) {
          if (err) throw err;
          // Уведомляем админа о сделке
          var text = '✔️Машина марки ' + driver[0].marka + ' с гос.номером ' + driver[0].nomer + ' Номер тел. ' + driver[0].tel + ' забирает ' + user[0].fname + ' с номером ' + user[0].tel;
          bot.sendMessage(336243307, text)
          })
   })

   })

})
})

}



function nayti_driver_poputi (msg){

var mysql  = require('mysql');
        var pool = mysql.createPool({
        host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
        database : 'sitebot'
    })

var zapros = msg.chat.text;
var user_id = msg.chat.id;
var point_type = 1;
var n_route_passenger = 'n_route_p'+user_id;
var route_passenger = 'route_p'+user_id;


pool.getConnection(function(err, connection) {

// Сначала находим всех активных пассажиров
connection.query(' SELECT * FROM route_p WHERE time_end > NOW() AND status <> "busy" ', function(err, rows, fields) {
if (err) throw err;
var active_passenger = JSON.parse(JSON.stringify(rows));
console.log('Активные пассажиры ',active_passenger);

for(var i = 0; i < active_passenger.length/2; i++){

console.log('1  ',active_passenger[2*i].id_point);
console.log('2  ',active_passenger[2*i+1].id_point);
var first_point = active_passenger[2*i].id_point;
var id_user_pas = active_passenger[2*i].id_user;

// Сначала просто находим всех водителей, у которых в маршруте есть определенные точки
connection.query(' SELECT id, id_user, id_point FROM route WHERE id_point IN (?, ?) ', [ active_passenger[2*i].id_point, active_passenger[2*i+1].id_point ], function(err, rows, fields) {
if (err) throw err;
var driver = JSON.parse(JSON.stringify(rows));
console.log('Нашли авто',driver);
if (driver !== []){

// Теперь выбираем именно тех водителей, у которых начальный id_point пассажира стоит в списке маршрута водителя первым
    var test = [];
    for(var a = 0; a < driver.length/2; a++){
    console.log('Внутри форао',first_point);
       if ( driver[2*a].id_point == first_point ) {
       test.push ([ driver[2*a].id, driver[2*a].id_user, driver[2*a].id_point ]);
       test.push ([ driver[2*a+1].id, driver[2*a+1].id_user, driver[2*a+1].id_point ]);
       }
       else {}
    }
    console.log('По парам', test);
    console.log('Айди водителей', test[0][1]);
    console.log('Айди водителей lenght', test.length);
// Теперь выбираем водителей, чтобы не повторялись
    var test2 = [];
        for(var a = 0; a < test.length/2; a++){
          test2.push ([ test[2*a][0], test[2*a][1], test[2*a][2] ]);
        }
    console.log('Только Айди водителей', test2);

    var pasu_text = 'Этот водитель может вас забрать если согласны нажмите "ДА" ' + test2[0][1];

    console.log('PASU  ', pasu_text);
    bot.sendMessage(id_user_pas, pasu_text ,{
                     reply_markup: {
                       inline_keyboard: [
                         [{
                           text: 'ДА',
                           callback_data: 'yes'
                         }]
                       ]
                     }

    })
}
else {}
})
}
})
})
}



function pass_offer_topass (query) {

var mysql  = require('mysql');
        var pool = mysql.createPool({
        host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
        database : 'sitebot'
    })

var user_id = query.message.chat.id;

pool.getConnection(function(err, connection) {

// Так как у пассажира и водителя, у которых совпался маршрут по нескольким столбцам, могут быть выбраны несколько строк, в конце выбираются уникальные столбцы из таблицы table3
var sql = ' SELECT DISTINCT PP_id_user, PP_begend, PP_id_route, PP_street, PP_interception, PP_busstop, ' +
               ' (SELECT street FROM route_p WHERE begend = "end" AND id_route = PP_id_route AND id_user = PP_id_user ) AS PP_street_end, ' +
               ' (SELECT interception FROM route_p WHERE begend = "end" AND id_route = PP_id_route AND id_user = PP_id_user ) AS PP_interception_end, ' +
               ' (SELECT busstop FROM route_p WHERE begend = "end" AND id_route = PP_id_route AND id_user = PP_id_user ) AS PP_busstop_end, ' +
               '  DD_id_user  AS DDD_id_user, DD_id_route  AS DDD_id_route, ' +
// Выбирает начальные данные street и interception водителя по "begend"-у выбирая "beg". Откуда этот водитель выезжает.
               ' ( SELECT street FROM route WHERE begend = "beg" AND id_user = DDD_id_user AND id_route = DDD_id_route ) AS street, ' +
               ' ( SELECT interception FROM route WHERE begend = "beg" AND id_user = DDD_id_user AND id_route = DDD_id_route ) AS interception, DD_time_beg ' +
               ' FROM (SELECT PP_id_user, PP_id_route, PP_id_point, PP_street, PP_interception, PP_busstop, PP_begend, PP_time_beg, PP_time_end, PP_near1, PP_near2, DD_id_user,  DD_id_route, DD_street, DD_interception, DD_id_point, DD_time_beg, DD_time_end ' +
// Вытаскивает время из БД в формате TIME (без даты, только время)
               ' FROM (SELECT  route_p1.P_id_user AS PP_id_user,  route_p1.P_id_route AS PP_id_route,  route_p1.P_id_point AS PP_id_point, route_p1.P_street AS PP_street, route_p1.P_interception AS PP_interception, route_p1.P_busstop AS PP_busstop, route_p1.P_begend AS PP_begend, route_p1.P_time_beg AS PP_time_beg, route_p1.P_time_end AS PP_time_end, route_p1.near1 AS PP_near1, route_p1.near2 AS PP_near2, route.id_user AS DD_id_user,  route.id_route AS DD_id_route,  route.street AS DD_street,  route.interception AS DD_interception,  route.id_point AS DD_id_point,  TIME(route.time_beg) AS  DD_time_beg,  route.time_end AS  DD_time_end  ' +
// Формирует новую таблицу route_p1, где создает два отдельных столбца near1 и near2 из одного столбца nearby_interception таблицы route_p
                     ' FROM (SELECT id_user AS P_id_user, begend AS P_begend, id_route AS P_id_route, id_point AS P_id_point, street AS P_street, interception AS P_interception, busstop AS P_busstop, time_beg AS P_time_beg, time_end AS P_time_end, SUBSTRING (nearby_interception, 1,15) AS near1, SUBSTRING (nearby_interception, 19,15) AS near2, n_pass  AS P_n_pass  FROM route_p  WHERE time_end > NOW() AND status <> "busy" AND id_user = ? AND id_route = (SELECT id_route FROM route_p WHERE id_user = ? ORDER BY id DESC LIMIT 1) ) AS route_p1 ' +
// Выбирает строки у которых совпадают id_point-ы, id_point с nearby_interception, с point_parinter_min5, с point_parinter_plu5 и формирует новую таблицу table1. И затем из строк таблицы table1 выбирает строки у которых столбец begend = "beg"
                         ' JOIN route  WHERE  (route_p1.P_id_point = route.id_point  OR  route_p1.near1 = route.id_point OR  route_p1.near2 = route.id_point)  AND route.time_end > NOW() AND route.limit_place >= route_p1.P_n_pass ORDER BY PP_id_user, PP_id_route) AS table1 WHERE PP_begend = "beg" ' +
// Возвращает TRUE если запрос, указанный ниже подтверждается
                             ' AND  EXISTS  (SELECT * FROM  (SELECT  route_p1.P_id_user AS PP_id_user,  route_p1.P_id_route AS PP_id_route,  route_p1.P_id_point AS PP_id_point, route_p1.P_begend AS PP_begend, route_p1.P_time_end AS PP_time_end, route_p1.near1 AS PP_near1, route_p1.near2 AS PP_near2, route.id_user AS DD_id_user,  route.id_route AS DD_id_route,  route.id_point AS DD_id_point,  route.time_end AS DD_time_end   FROM (SELECT id_user AS P_id_user, id_route AS P_id_route, id_point AS P_id_point, begend AS P_begend, time_end AS P_time_end, SUBSTRING (nearby_interception, 1,15) AS near1, SUBSTRING (nearby_interception, 19,15) AS near2, n_pass  AS P_n_pass FROM route_p WHERE time_end > NOW() AND status <> "busy" AND id_user = ? AND id_route = (SELECT id_route FROM route_p WHERE id_user = ? ORDER BY id DESC LIMIT 1) ) AS route_p1 JOIN route ' +
// Выбирает строки у которых совпадают id_point-ы, id_point с nearby_interception, с point_parinter_min5, с point_parinter_plu5 и формирует новую таблицу table2. И затем из строк таблицы table2 выбирает строки у которых столбец begend = "end" и id_user строки из таблицы table1 равен id_user-у строки таблицы table2  и все это сохраняет как таблицу table3
                                   ' WHERE  (route_p1.P_id_point = route.id_point  OR  route_p1.near1 = route.id_point OR  route_p1.near2 = route.id_point)  AND route.time_end > NOW() AND route.limit_place >= route_p1.P_n_pass ORDER BY PP_id_user, PP_id_route)  AS table2 WHERE PP_begend = "end" AND table1.PP_id_user = table2.PP_id_user AND table1.DD_id_user = table2.DD_id_user) ) AS table3 ';

connection.query( sql , [ user_id, user_id, user_id, user_id ], function(err, rows, fields) {
if (err) throw err;
var driver = JSON.parse(JSON.stringify(rows));
console.log('pass_offer_topass ', driver);

   if (driver.length !== 0){

       if(driver.length <= 30){
       for(var i = 0; i < driver.length; i++){

        var pasu_text = 'Этот водитель выезжает с пересечения ' + driver[i].street + '-' + driver[i].interception + ' в ' + driver[i].DD_time_beg;

        console.log('ПОПУТИ 1-30 ', pasu_text);
        bot.sendMessage(driver[i].PP_id_user, pasu_text ,{
                         reply_markup: {
                           inline_keyboard: [
                             [{
                               text: 'Выбрать попутное авто',
                               callback_data:  'driver '+driver[i].DDD_id_user
                             }]
                           ]
                         }

        })
       }
       }
       else if(driver.length > 30 && driver.length <= 60){
       setTimeout(driver_poputi1,500, 'funky');
            function driver_poputi1 (msg){
                   for(var i = 0; i < 30; i++){
                    var pasu_text = 'Этот водитель выезжает с пересечения ' + driver[i].street + '-' + driver[i].interception + ' в ' + driver[i].DD_time_beg;

                    console.log('PASU  ', pasu_text);
                    bot.sendMessage(driver[i].PP_id_user, pasu_text ,{
                                     reply_markup: {
                                       inline_keyboard: [
                                         [{
                                           text: 'Выбрать попутное авто',
                                           callback_data:  'driver '+driver[i].DDD_id_user
                                         }]
                                       ]
                                     }

                    })
                   }
                   }
       setTimeout(driver_poputi2, 10000, 'funky');
            function driver_poputi2 (msg){
                   for(var i = 30; i < driver.length; i++){
                    var pasu_text = 'Этот водитель выезжает с пересечения ' + driver[i].street + '-' + driver[i].interception + ' в ' + driver[i].DD_time_beg;

                    console.log('PASU  ', pasu_text);
                    bot.sendMessage(driver[i].PP_id_user, pasu_text ,{
                                     reply_markup: {
                                       inline_keyboard: [
                                         [{
                                           text: 'Выбрать попутное авто',
                                           callback_data:  'driver '+driver[i].DDD_id_user
                                         }]
                                       ]
                                     }

                    })
                   }
            }
       }
       else if(driver.length > 60 && driver.length <= 90){
       setTimeout(driver_poputi1,500, 'funky');
            function driver_poputi1 (msg){
                   for(var i = 0; i < 30; i++){
                    var pasu_text = 'Этот водитель выезжает с пересечения ' + driver[i].street + '-' + driver[i].interception + ' в ' + driver[i].DD_time_beg;

                    console.log('PASU  ', pasu_text);
                    bot.sendMessage(driver[i].PP_id_user, pasu_text ,{
                                     reply_markup: {
                                       inline_keyboard: [
                                         [{
                                           text: 'Выбрать попутное авто',
                                           callback_data:  'driver '+driver[i].DDD_id_user
                                         }]
                                       ]
                                     }

                    })
                   }
                   }
       setTimeout(driver_poputi2, 5000, 'funky');
            function driver_poputi2 (msg){
                   for(var i = 30; i < 60; i++){
                    var pasu_text = 'Этот водитель выезжает с пересечения ' + driver[i].street + '-' + driver[i].interception + ' в ' + driver[i].DD_time_beg;

                    console.log('PASU  ', pasu_text);
                    bot.sendMessage(driver[i].PP_id_user, pasu_text ,{
                                     reply_markup: {
                                       inline_keyboard: [
                                         [{
                                           text: 'Выбрать попутное авто',
                                           callback_data:  'driver '+driver[i].DDD_id_user
                                         }]
                                       ]
                                     }

                    })
                   }
            }
       setTimeout(driver_poputi3, 15000, 'funky');
            function driver_poputi3 (msg){
                   for(var i = 60; i < driver.length; i++){
                    var pasu_text = 'Этот водитель выезжает с пересечения ' + driver[i].street + '-' + driver[i].interception + ' в ' + driver[i].DD_time_beg;

                    console.log('PASU  ', pasu_text);
                    bot.sendMessage(driver[i].PP_id_user, pasu_text ,{
                                     reply_markup: {
                                       inline_keyboard: [
                                         [{
                                           text: 'Выбрать попутное авто',
                                           callback_data:  'driver '+driver[i].DDD_id_user
                                         }]
                                       ]
                                     }

                    })
                   }
            }
       }
       else if(driver.length > 90 && driver.length <= 120){
       setTimeout(driver_poputi1,500, 'funky');
            function driver_poputi1 (msg){
                   for(var i = 0; i < 30; i++){
                    var pasu_text = 'Этот водитель выезжает с пересечения ' + driver[i].street + '-' + driver[i].interception + ' в ' + driver[i].DD_time_beg;

                    console.log('PASU  ', pasu_text);
                    bot.sendMessage(driver[i].PP_id_user, pasu_text ,{
                                     reply_markup: {
                                       inline_keyboard: [
                                         [{
                                           text: 'Выбрать попутное авто',
                                           callback_data:  'driver '+driver[i].DDD_id_user
                                         }]
                                       ]
                                     }

                    })
                   }
                   }
       setTimeout(driver_poputi2, 5000, 'funky');
            function driver_poputi2 (msg){
                   for(var i = 30; i < 60; i++){
                    var pasu_text = 'Этот водитель выезжает с пересечения ' + driver[i].street + '-' + driver[i].interception + ' в ' + driver[i].DD_time_beg;

                    console.log('PASU  ', pasu_text);
                    bot.sendMessage(driver[i].PP_id_user, pasu_text ,{
                                     reply_markup: {
                                       inline_keyboard: [
                                         [{
                                           text: 'Выбрать попутное авто',
                                           callback_data:  'driver '+driver[i].DDD_id_user
                                         }]
                                       ]
                                     }

                    })
                   }
            }
       setTimeout(driver_poputi3, 15000, 'funky');
            function driver_poputi3 (msg){
                   for(var i = 60; i < 90; i++){
                    var pasu_text = 'Этот водитель выезжает с пересечения ' + driver[i].street + '-' + driver[i].interception + ' в ' + driver[i].DD_time_beg;

                    console.log('PASU  ', pasu_text);
                    bot.sendMessage(driver[i].PP_id_user, pasu_text ,{
                                     reply_markup: {
                                       inline_keyboard: [
                                         [{
                                           text: 'Выбрать попутное авто',
                                           callback_data:  'driver '+driver[i].DDD_id_user
                                         }]
                                       ]
                                     }

                    })
                   }
            }
       setTimeout(driver_poputi4, 20000, 'funky');
            function driver_poputi4 (msg){
                   for(var i = 90; i < driver.length; i++){
                    var pasu_text = 'Этот водитель выезжает с пересечения ' + driver[i].street + '-' + driver[i].interception + ' в ' + driver[i].DD_time_beg;

                    console.log('PASU  ', pasu_text);
                    bot.sendMessage(driver[i].PP_id_user, pasu_text ,{
                                     reply_markup: {
                                       inline_keyboard: [
                                         [{
                                           text: 'Выбрать попутное авто',
                                           callback_data:  'driver '+driver[i].DDD_id_user
                                         }]
                                       ]
                                     }

                    })
                   }
            }
       }
       else if(driver.length > 120 && driver.length <= 150){
              setTimeout(driver_poputi1,500, 'funky');
                   function driver_poputi1 (msg){
                          for(var i = 0; i < 30; i++){
                           var pasu_text = 'Этот водитель выезжает с пересечения ' + driver[i].street + '-' + driver[i].interception + ' в ' + driver[i].DD_time_beg;

                           console.log('PASU  ', pasu_text);
                           bot.sendMessage(driver[i].PP_id_user, pasu_text ,{
                                            reply_markup: {
                                              inline_keyboard: [
                                                [{
                                                  text: 'Выбрать попутное авто',
                                                  callback_data:  'driver '+driver[i].DDD_id_user
                                                }]
                                              ]
                                            }

                           })
                          }
                          }
              setTimeout(driver_poputi2, 5000, 'funky');
                   function driver_poputi2 (msg){
                          for(var i = 30; i < 60; i++){
                           var pasu_text = 'Этот водитель выезжает с пересечения ' + driver[i].street + '-' + driver[i].interception + ' в ' + driver[i].DD_time_beg;

                           console.log('PASU  ', pasu_text);
                           bot.sendMessage(driver[i].PP_id_user, pasu_text ,{
                                            reply_markup: {
                                              inline_keyboard: [
                                                [{
                                                  text: 'Выбрать попутное авто',
                                                  callback_data:  'driver '+driver[i].DDD_id_user
                                                }]
                                              ]
                                            }

                           })
                          }
                   }
              setTimeout(driver_poputi3, 15000, 'funky');
                   function driver_poputi3 (msg){
                          for(var i = 60; i < 90; i++){
                           var pasu_text = 'Этот водитель выезжает с пересечения ' + driver[i].street + '-' + driver[i].interception + ' в ' + driver[i].DD_time_beg;

                           console.log('PASU  ', pasu_text);
                           bot.sendMessage(driver[i].PP_id_user, pasu_text ,{
                                            reply_markup: {
                                              inline_keyboard: [
                                                [{
                                                  text: 'Выбрать попутное авто',
                                                  callback_data:  'driver '+driver[i].DDD_id_user
                                                }]
                                              ]
                                            }

                           })
                          }
                   }
              setTimeout(driver_poputi4, 20000, 'funky');
                   function driver_poputi4 (msg){
                          for(var i = 90; i < 120; i++){
                           var pasu_text = 'Этот водитель выезжает с пересечения ' + driver[i].street + '-' + driver[i].interception + ' в ' + driver[i].DD_time_beg;

                           console.log('PASU  ', pasu_text);
                           bot.sendMessage(driver[i].PP_id_user, pasu_text ,{
                                            reply_markup: {
                                              inline_keyboard: [
                                                [{
                                                  text: 'Выбрать попутное авто',
                                                  callback_data:  'driver '+driver[i].DDD_id_user
                                                }]
                                              ]
                                            }

                           })
                          }
                   }
              setTimeout(driver_poputi5, 25000, 'funky');
                   function driver_poputi5 (msg){
                          for(var i = 120; i < driver.length; i++){
                           var pasu_text = 'Этот водитель выезжает с пересечения ' + driver[i].street + '-' + driver[i].interception + ' в ' + driver[i].DD_time_beg;

                           console.log('PASU  ', pasu_text);
                           bot.sendMessage(driver[i].PP_id_user, pasu_text ,{
                                            reply_markup: {
                                              inline_keyboard: [
                                                [{
                                                  text: 'Выбрать попутное авто',
                                                  callback_data:  'driver '+driver[i].DDD_id_user
                                                }]
                                              ]
                                            }

                           })
                          }
                   }
              }
       else if(driver.length > 150) {  bot.sendMessage(  336243307, 'Уже больше 150 активных человек' )  }
   }
})
})

}



function pass_offer_todriv (query) {

var mysql  = require('mysql');
        var pool = mysql.createPool({
        host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
        database : 'sitebot'
    })

var user_id = query.message.chat.id;

pool.getConnection(function(err, connection) {

var sql = ' SELECT DISTINCT PP_id_user, PP_begend, PP_id_route, PP_street, PP_interception, PP_busstop, ' +
               ' (SELECT street FROM route_p WHERE begend = "end" AND id_route = PP_id_route AND id_user = PP_id_user ) AS PP_street_end, ' +
               ' (SELECT interception FROM route_p WHERE begend = "end" AND id_route = PP_id_route AND id_user = PP_id_user ) AS PP_interception_end, ' +
               ' (SELECT busstop FROM route_p WHERE begend = "end" AND id_route = PP_id_route AND id_user = PP_id_user ) AS PP_busstop_end, ' +
               '  DD_id_user  AS DDD_id_user, DD_id_route  AS DDD_id_route, ' +
// Выбирает начальные данные street и interception водителя по "begend"-у выбирая "beg". Откуда этот водитель выезжает.
               ' ( SELECT street FROM route WHERE begend = "beg" AND id_user = DDD_id_user AND id_route = DDD_id_route ) AS street, ' +
               ' ( SELECT interception FROM route WHERE begend = "beg" AND id_user = DDD_id_user AND id_route = DDD_id_route ) AS interception, DD_time_beg ' +
               ' FROM (SELECT PP_id_user, PP_id_route, PP_id_point, PP_street, PP_interception, PP_busstop, PP_begend, PP_time_beg, PP_time_end, PP_near1, PP_near2, DD_id_user,  DD_id_route, DD_street, DD_interception, DD_id_point, DD_time_beg, DD_time_end ' +
// Вытаскивает время из БД в формате TIME (без даты, только время)
               ' FROM (SELECT  route_p1.P_id_user AS PP_id_user,  route_p1.P_id_route AS PP_id_route,  route_p1.P_id_point AS PP_id_point, route_p1.P_street AS PP_street, route_p1.P_interception AS PP_interception, route_p1.P_busstop AS PP_busstop, route_p1.P_begend AS PP_begend, route_p1.P_time_beg AS PP_time_beg, route_p1.P_time_end AS PP_time_end, route_p1.near1 AS PP_near1, route_p1.near2 AS PP_near2, route.id_user AS DD_id_user,  route.id_route AS DD_id_route,  route.street AS DD_street,  route.interception AS DD_interception,  route.id_point AS DD_id_point,  TIME(route.time_beg) AS  DD_time_beg,  route.time_end AS  DD_time_end  ' +
// Формирует новую таблицу route_p1, где создает два отдельных столбца near1 и near2 из одного столбца nearby_interception таблицы route_p
                     ' FROM (SELECT id_user AS P_id_user, begend AS P_begend, id_route AS P_id_route, id_point AS P_id_point, street AS P_street, interception AS P_interception, busstop AS P_busstop, time_beg AS P_time_beg, time_end AS P_time_end, SUBSTRING (nearby_interception, 1,15) AS near1, SUBSTRING (nearby_interception, 19,15) AS near2, n_pass  AS P_n_pass FROM route_p  WHERE id_user = ? AND id_route = (SELECT id_route FROM route_p WHERE id_user = ? ORDER BY id_route DESC LIMIT 1) ) AS route_p1 ' +
// Выбирает строки у которых совпадают id_point-ы, id_point с nearby_interception, с point_parinter_min5, с point_parinter_plu5 и формирует новую таблицу table1. И затем из строк таблицы table1 выбирает строки у которых столбец begend = "beg"
                         ' JOIN route  WHERE  (route_p1.P_id_point = route.id_point  OR  route_p1.near1 = route.id_point OR  route_p1.near2 = route.id_point  OR  route_p1.near1 = route.point_parinter_min5  OR  route_p1.near2 = route.point_parinter_plu5 OR  route_p1.near2 = route.point_parinter_min5  OR  route_p1.near1 = route.point_parinter_plu5  OR  route_p1.P_id_point = route.point_parinter_plu5  OR  route_p1.P_id_point = route.point_parinter_min5)  AND route.time_end > NOW()  AND route.limit_place >= route_p1.P_n_pass  ORDER BY PP_id_user, PP_id_route) AS table1 WHERE PP_begend = "beg" ' +
// Возвращает TRUE если запрос, указанный ниже подтверждается
                             ' AND  EXISTS  (SELECT * FROM  (SELECT  route_p1.P_id_user AS PP_id_user,  route_p1.P_id_route AS PP_id_route,  route_p1.P_id_point AS PP_id_point, route_p1.P_begend AS PP_begend, route_p1.P_time_end AS PP_time_end, route_p1.near1 AS PP_near1, route_p1.near2 AS PP_near2, route.id_user AS DD_id_user,  route.id_route AS DD_id_route,  route.id_point AS DD_id_point,  route.time_end AS DD_time_end   FROM (SELECT id_user AS P_id_user, id_route AS P_id_route, id_point AS P_id_point, begend AS P_begend, time_end AS P_time_end, SUBSTRING (nearby_interception, 1,15) AS near1, SUBSTRING (nearby_interception, 19,15) AS near2, n_pass  AS P_n_pass FROM route_p WHERE time_end > NOW() AND status <> "busy" AND id_user = ? AND id_route = (SELECT id_route FROM route_p WHERE id_user = ? ORDER BY id_route DESC LIMIT 1) ) AS route_p1 JOIN route ' +
// Выбирает строки у которых совпадают id_point-ы, id_point с nearby_interception, с point_parinter_min5, с point_parinter_plu5 и формирует новую таблицу table2. И затем из строк таблицы table2 выбирает строки у которых столбец begend = "end" и id_user строки из таблицы table1 равен id_user-у строки таблицы table2  и все это сохраняет как таблицу table3
                                   ' WHERE  (route_p1.P_id_point = route.id_point  OR  route_p1.near1 = route.id_point OR  route_p1.near2 = route.id_point  OR  route_p1.near1 = route.point_parinter_min5  OR  route_p1.near2 = route.point_parinter_plu5 OR  route_p1.near2 = route.point_parinter_min5  OR  route_p1.near1 = route.point_parinter_plu5  OR  route_p1.P_id_point = route.point_parinter_plu5  OR  route_p1.P_id_point = route.point_parinter_min5)  AND route.time_end > NOW() AND route.limit_place >= route_p1.P_n_pass  ORDER BY PP_id_user, PP_id_route)  AS table2 WHERE PP_begend = "end" AND table1.PP_id_user = table2.PP_id_user AND table1.DD_id_user = table2.DD_id_user) ) AS table3 ';

connection.query( sql , [ user_id, user_id, user_id, user_id ], function(err, rows, fields) {
if (err) throw err;
var driver = JSON.parse(JSON.stringify(rows));
console.log('pass_offer_todriv ', driver);

   if (driver.length !== 0){
       if(driver.length <= 30){
           for(var i = 0; i < driver.length; i++){

           if (driver[i].PP_interception === null && driver[i].PP_interception_end === null) {
           var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с ост. "' + driver[i].PP_busstop + '"  по улице ' + driver[i].PP_street + ' и едет до ост. "' + driver[i].PP_busstop_end + '" по улице ' + driver[i].PP_street_end ;
           }
           else if (driver[i].PP_interception === null && driver[i].PP_interception_end !== null) {
           var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с ост. "' + driver[i].PP_busstop + '"  по улице ' + driver[i].PP_street + ' едет до пер. ' + driver[i].PP_interception_end + ' - ' + driver[i].PP_street_end ;
           }
           else if (driver[i].PP_interception !== null && driver[i].PP_interception_end === null) {
           var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с пер. ' + driver[i].PP_interception + ' - ' + driver[i].PP_street + ' едет до ост. "' + driver[i].PP_busstop_end + '" по улице ' + driver[i].PP_street_end ;
           }
           else if (driver[i].PP_interception !== null && driver[i].PP_interception_end !== null) {
           var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с пер. ' + driver[i].PP_interception + ' - ' + driver[i].PP_street + ' и едет до пер. ' + driver[i].PP_interception_end + ' - ' + driver[i].PP_street_end ;
           }

            console.log('PASU  ', pasu_text);
            bot.sendMessage(driver[i].DDD_id_user, pasu_text ,{
                             reply_markup: {
                               inline_keyboard: [
                                 [{
                                  text: 'Отправить предложение пассажиру',
                                  callback_data:  'confirm_pass '+ driver[i].PP_id_user + ' ' + driver[i].DDD_id_user
                                 }]
                               ]
                             }

            })
           }
       }
       else if(driver.length > 30 && driver.length <= 60){
       setTimeout(tabu_pass_onpar1, 500, 'funky');
            function tabu_pass_onpar1 (msg){
                  for(var i = 0; i < 30; i++){

                   if (driver[i].PP_interception === null && driver[i].PP_interception_end === null) {
                   var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с ост. "' + driver[i].PP_busstop + '"  по улице ' + driver[i].PP_street + ' и едет до ост. "' + driver[i].PP_busstop_end + '" по улице ' + driver[i].PP_street_end ;
                   }
                   else if (driver[i].PP_interception === null && driver[i].PP_interception_end !== null) {
                   var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с ост. "' + driver[i].PP_busstop + '"  по улице ' + driver[i].PP_street + ' едет до пер. ' + driver[i].PP_interception_end + ' - ' + driver[i].PP_street_end ;
                   }
                   else if (driver[i].PP_interception !== null && driver[i].PP_interception_end === null) {
                   var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с пер. ' + driver[i].PP_interception + ' - ' + driver[i].PP_street + ' едет до ост. "' + driver[i].PP_busstop_end + '" по улице ' + driver[i].PP_street_end ;
                   }
                   else if (driver[i].PP_interception !== null && driver[i].PP_interception_end !== null) {
                   var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с пер. ' + driver[i].PP_interception + ' - ' + driver[i].PP_street + ' и едет до пер. ' + driver[i].PP_interception_end + ' - ' + driver[i].PP_street_end ;
                   }

                    console.log('PASU  ', pasu_text);
                    bot.sendMessage(driver[i].DDD_id_user, pasu_text ,{
                                     reply_markup: {
                                       inline_keyboard: [
                                         [{
                                          text: 'Отправить предложение пассажиру',
                                          callback_data:  'confirm_pass '+ driver[i].PP_id_user + ' ' + driver[i].DDD_id_user
                                         }]
                                       ]
                                     }

                    })
                   }
            }
       setTimeout(tabu_pass_onpar2, 5000, 'funky');
            function tabu_pass_onpar2 (msg){
                              for(var i = 30; i < driver.length; i++){

                               if (driver[i].PP_interception === null && driver[i].PP_interception_end === null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с ост. "' + driver[i].PP_busstop + '"  по улице ' + driver[i].PP_street + ' и едет до ост. "' + driver[i].PP_busstop_end + '" по улице ' + driver[i].PP_street_end ;
                               }
                               else if (driver[i].PP_interception === null && driver[i].PP_interception_end !== null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с ост. "' + driver[i].PP_busstop + '"  по улице ' + driver[i].PP_street + ' едет до пер. ' + driver[i].PP_interception_end + ' - ' + driver[i].PP_street_end ;
                               }
                               else if (driver[i].PP_interception !== null && driver[i].PP_interception_end === null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с пер. ' + driver[i].PP_interception + ' - ' + driver[i].PP_street + ' едет до ост. "' + driver[i].PP_busstop_end + '" по улице ' + driver[i].PP_street_end ;
                               }
                               else if (driver[i].PP_interception !== null && driver[i].PP_interception_end !== null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с пер. ' + driver[i].PP_interception + ' - ' + driver[i].PP_street + ' и едет до пер. ' + driver[i].PP_interception_end + ' - ' + driver[i].PP_street_end ;
                               }

                                console.log('PASU  ', pasu_text);
                                bot.sendMessage(driver[i].DDD_id_user, pasu_text ,{
                                                 reply_markup: {
                                                   inline_keyboard: [
                                                     [{
                                                      text: 'Отправить предложение пассажиру',
                                                      callback_data:  'confirm_pass '+ driver[i].PP_id_user + ' ' + driver[i].DDD_id_user
                                                     }]
                                                   ]
                                                 }

                                })
                               }
                        }
       }
       else if(driver.length > 60 && driver.length <= 90){
       setTimeout(tabu_pass_onpar1, 500, 'funky');
            function tabu_pass_onpar1 (msg){
                  for(var i = 0; i < 30; i++){

                   if (driver[i].PP_interception === null && driver[i].PP_interception_end === null) {
                   var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с ост. "' + driver[i].PP_busstop + '"  по улице ' + driver[i].PP_street + ' и едет до ост. "' + driver[i].PP_busstop_end + '" по улице ' + driver[i].PP_street_end ;
                   }
                   else if (driver[i].PP_interception === null && driver[i].PP_interception_end !== null) {
                   var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с ост. "' + driver[i].PP_busstop + '"  по улице ' + driver[i].PP_street + ' едет до пер. ' + driver[i].PP_interception_end + ' - ' + driver[i].PP_street_end ;
                   }
                   else if (driver[i].PP_interception !== null && driver[i].PP_interception_end === null) {
                   var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с пер. ' + driver[i].PP_interception + ' - ' + driver[i].PP_street + ' едет до ост. "' + driver[i].PP_busstop_end + '" по улице ' + driver[i].PP_street_end ;
                   }
                   else if (driver[i].PP_interception !== null && driver[i].PP_interception_end !== null) {
                   var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с пер. ' + driver[i].PP_interception + ' - ' + driver[i].PP_street + ' и едет до пер. ' + driver[i].PP_interception_end + ' - ' + driver[i].PP_street_end ;
                   }

                    console.log('PASU  ', pasu_text);
                    bot.sendMessage(driver[i].DDD_id_user, pasu_text ,{
                                     reply_markup: {
                                       inline_keyboard: [
                                         [{
                                          text: 'Отправить предложение пассажиру',
                                          callback_data:  'confirm_pass '+ driver[i].PP_id_user + ' ' + driver[i].DDD_id_user
                                         }]
                                       ]
                                     }

                    })
                   }
            }
       setTimeout(tabu_pass_onpar2, 5000, 'funky');
            function tabu_pass_onpar2 (msg){
                              for(var i = 30; i < 60; i++){

                               if (driver[i].PP_interception === null && driver[i].PP_interception_end === null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с ост. "' + driver[i].PP_busstop + '"  по улице ' + driver[i].PP_street + ' и едет до ост. "' + driver[i].PP_busstop_end + '" по улице ' + driver[i].PP_street_end ;
                               }
                               else if (driver[i].PP_interception === null && driver[i].PP_interception_end !== null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с ост. "' + driver[i].PP_busstop + '"  по улице ' + driver[i].PP_street + ' едет до пер. ' + driver[i].PP_interception_end + ' - ' + driver[i].PP_street_end ;
                               }
                               else if (driver[i].PP_interception !== null && driver[i].PP_interception_end === null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с пер. ' + driver[i].PP_interception + ' - ' + driver[i].PP_street + ' едет до ост. "' + driver[i].PP_busstop_end + '" по улице ' + driver[i].PP_street_end ;
                               }
                               else if (driver[i].PP_interception !== null && driver[i].PP_interception_end !== null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с пер. ' + driver[i].PP_interception + ' - ' + driver[i].PP_street + ' и едет до пер. ' + driver[i].PP_interception_end + ' - ' + driver[i].PP_street_end ;
                               }

                                console.log('PASU  ', pasu_text);
                                bot.sendMessage(driver[i].DDD_id_user, pasu_text ,{
                                                 reply_markup: {
                                                   inline_keyboard: [
                                                     [{
                                                      text: 'Отправить предложение пассажиру',
                                                      callback_data:  'confirm_pass '+ driver[i].PP_id_user + ' ' + driver[i].DDD_id_user
                                                     }]
                                                   ]
                                                 }

                                })
                               }
                        }
       setTimeout(tabu_pass_onpar3, 10000, 'funky');
            function tabu_pass_onpar3 (msg){
                              for(var i = 60; i < driver.length; i++){

                               if (driver[i].PP_interception === null && driver[i].PP_interception_end === null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с ост. "' + driver[i].PP_busstop + '"  по улице ' + driver[i].PP_street + ' и едет до ост. "' + driver[i].PP_busstop_end + '" по улице ' + driver[i].PP_street_end ;
                               }
                               else if (driver[i].PP_interception === null && driver[i].PP_interception_end !== null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с ост. "' + driver[i].PP_busstop + '"  по улице ' + driver[i].PP_street + ' едет до пер. ' + driver[i].PP_interception_end + ' - ' + driver[i].PP_street_end ;
                               }
                               else if (driver[i].PP_interception !== null && driver[i].PP_interception_end === null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с пер. ' + driver[i].PP_interception + ' - ' + driver[i].PP_street + ' едет до ост. "' + driver[i].PP_busstop_end + '" по улице ' + driver[i].PP_street_end ;
                               }
                               else if (driver[i].PP_interception !== null && driver[i].PP_interception_end !== null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с пер. ' + driver[i].PP_interception + ' - ' + driver[i].PP_street + ' и едет до пер. ' + driver[i].PP_interception_end + ' - ' + driver[i].PP_street_end ;
                               }

                                console.log('PASU  ', pasu_text);
                                bot.sendMessage(driver[i].DDD_id_user, pasu_text ,{
                                                 reply_markup: {
                                                   inline_keyboard: [
                                                     [{
                                                      text: 'Отправить предложение пассажиру',
                                                      callback_data:  'confirm_pass '+ driver[i].PP_id_user + ' ' + driver[i].DDD_id_user
                                                     }]
                                                   ]
                                                 }

                                })
                               }
                        }
       }
       else if(driver.length > 90 && driver.length <= 120){
       setTimeout(tabu_pass_onpar1, 500, 'funky');
            function tabu_pass_onpar1 (msg){
                  for(var i = 0; i < 30; i++){

                   if (driver[i].PP_interception === null && driver[i].PP_interception_end === null) {
                   var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с ост. "' + driver[i].PP_busstop + '"  по улице ' + driver[i].PP_street + ' и едет до ост. "' + driver[i].PP_busstop_end + '" по улице ' + driver[i].PP_street_end ;
                   }
                   else if (driver[i].PP_interception === null && driver[i].PP_interception_end !== null) {
                   var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с ост. "' + driver[i].PP_busstop + '"  по улице ' + driver[i].PP_street + ' едет до пер. ' + driver[i].PP_interception_end + ' - ' + driver[i].PP_street_end ;
                   }
                   else if (driver[i].PP_interception !== null && driver[i].PP_interception_end === null) {
                   var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с пер. ' + driver[i].PP_interception + ' - ' + driver[i].PP_street + ' едет до ост. "' + driver[i].PP_busstop_end + '" по улице ' + driver[i].PP_street_end ;
                   }
                   else if (driver[i].PP_interception !== null && driver[i].PP_interception_end !== null) {
                   var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с пер. ' + driver[i].PP_interception + ' - ' + driver[i].PP_street + ' и едет до пер. ' + driver[i].PP_interception_end + ' - ' + driver[i].PP_street_end ;
                   }

                    console.log('PASU  ', pasu_text);
                    bot.sendMessage(driver[i].DDD_id_user, pasu_text ,{
                                     reply_markup: {
                                       inline_keyboard: [
                                         [{
                                          text: 'Отправить предложение пассажиру',
                                          callback_data:  'confirm_pass '+ driver[i].PP_id_user + ' ' + driver[i].DDD_id_user
                                         }]
                                       ]
                                     }

                    })
                   }
            }
       setTimeout(tabu_pass_onpar2, 5000, 'funky');
            function tabu_pass_onpar2 (msg){
                              for(var i = 30; i < 60; i++){

                               if (driver[i].PP_interception === null && driver[i].PP_interception_end === null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с ост. "' + driver[i].PP_busstop + '"  по улице ' + driver[i].PP_street + ' и едет до ост. "' + driver[i].PP_busstop_end + '" по улице ' + driver[i].PP_street_end ;
                               }
                               else if (driver[i].PP_interception === null && driver[i].PP_interception_end !== null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с ост. "' + driver[i].PP_busstop + '"  по улице ' + driver[i].PP_street + ' едет до пер. ' + driver[i].PP_interception_end + ' - ' + driver[i].PP_street_end ;
                               }
                               else if (driver[i].PP_interception !== null && driver[i].PP_interception_end === null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с пер. ' + driver[i].PP_interception + ' - ' + driver[i].PP_street + ' едет до ост. "' + driver[i].PP_busstop_end + '" по улице ' + driver[i].PP_street_end ;
                               }
                               else if (driver[i].PP_interception !== null && driver[i].PP_interception_end !== null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с пер. ' + driver[i].PP_interception + ' - ' + driver[i].PP_street + ' и едет до пер. ' + driver[i].PP_interception_end + ' - ' + driver[i].PP_street_end ;
                               }

                                console.log('PASU  ', pasu_text);
                                bot.sendMessage(driver[i].DDD_id_user, pasu_text ,{
                                                 reply_markup: {
                                                   inline_keyboard: [
                                                     [{
                                                      text: 'Отправить предложение пассажиру',
                                                      callback_data:  'confirm_pass '+ driver[i].PP_id_user + ' ' + driver[i].DDD_id_user
                                                     }]
                                                   ]
                                                 }

                                })
                               }
                        }
       setTimeout(tabu_pass_onpar3, 10000, 'funky');
            function tabu_pass_onpar3 (msg){
                              for(var i = 60; i < 90; i++){

                               if (driver[i].PP_interception === null && driver[i].PP_interception_end === null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с ост. "' + driver[i].PP_busstop + '"  по улице ' + driver[i].PP_street + ' и едет до ост. "' + driver[i].PP_busstop_end + '" по улице ' + driver[i].PP_street_end ;
                               }
                               else if (driver[i].PP_interception === null && driver[i].PP_interception_end !== null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с ост. "' + driver[i].PP_busstop + '"  по улице ' + driver[i].PP_street + ' едет до пер. ' + driver[i].PP_interception_end + ' - ' + driver[i].PP_street_end ;
                               }
                               else if (driver[i].PP_interception !== null && driver[i].PP_interception_end === null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с пер. ' + driver[i].PP_interception + ' - ' + driver[i].PP_street + ' едет до ост. "' + driver[i].PP_busstop_end + '" по улице ' + driver[i].PP_street_end ;
                               }
                               else if (driver[i].PP_interception !== null && driver[i].PP_interception_end !== null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с пер. ' + driver[i].PP_interception + ' - ' + driver[i].PP_street + ' и едет до пер. ' + driver[i].PP_interception_end + ' - ' + driver[i].PP_street_end ;
                               }

                                console.log('PASU  ', pasu_text);
                                bot.sendMessage(driver[i].DDD_id_user, pasu_text ,{
                                                 reply_markup: {
                                                   inline_keyboard: [
                                                     [{
                                                      text: 'Отправить предложение пассажиру',
                                                      callback_data:  'confirm_pass '+ driver[i].PP_id_user + ' ' + driver[i].DDD_id_user
                                                     }]
                                                   ]
                                                 }

                                })
                               }
                        }
       setTimeout(tabu_pass_onpar4, 15000, 'funky');
            function tabu_pass_onpar4 (msg){
                              for(var i = 90; i < driver.length; i++){

                               if (driver[i].PP_interception === null && driver[i].PP_interception_end === null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с ост. "' + driver[i].PP_busstop + '"  по улице ' + driver[i].PP_street + ' и едет до ост. "' + driver[i].PP_busstop_end + '" по улице ' + driver[i].PP_street_end ;
                               }
                               else if (driver[i].PP_interception === null && driver[i].PP_interception_end !== null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с ост. "' + driver[i].PP_busstop + '"  по улице ' + driver[i].PP_street + ' едет до пер. ' + driver[i].PP_interception_end + ' - ' + driver[i].PP_street_end ;
                               }
                               else if (driver[i].PP_interception !== null && driver[i].PP_interception_end === null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с пер. ' + driver[i].PP_interception + ' - ' + driver[i].PP_street + ' едет до ост. "' + driver[i].PP_busstop_end + '" по улице ' + driver[i].PP_street_end ;
                               }
                               else if (driver[i].PP_interception !== null && driver[i].PP_interception_end !== null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с пер. ' + driver[i].PP_interception + ' - ' + driver[i].PP_street + ' и едет до пер. ' + driver[i].PP_interception_end + ' - ' + driver[i].PP_street_end ;
                               }

                                console.log('PASU  ', pasu_text);
                                bot.sendMessage(driver[i].DDD_id_user, pasu_text ,{
                                                 reply_markup: {
                                                   inline_keyboard: [
                                                     [{
                                                      text: 'Отправить предложение пассажиру',
                                                      callback_data:  'confirm_pass '+ driver[i].PP_id_user + ' ' + driver[i].DDD_id_user
                                                     }]
                                                   ]
                                                 }

                                })
                               }
                        }
       }
       else if(driver.length > 120 && driver.length <= 150){
       setTimeout(tabu_pass_onpar1, 500, 'funky');
            function tabu_pass_onpar1 (msg){
                  for(var i = 0; i < 30; i++){

                   if (driver[i].PP_interception === null && driver[i].PP_interception_end === null) {
                   var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с ост. "' + driver[i].PP_busstop + '"  по улице ' + driver[i].PP_street + ' и едет до ост. "' + driver[i].PP_busstop_end + '" по улице ' + driver[i].PP_street_end ;
                   }
                   else if (driver[i].PP_interception === null && driver[i].PP_interception_end !== null) {
                   var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с ост. "' + driver[i].PP_busstop + '"  по улице ' + driver[i].PP_street + ' едет до пер. ' + driver[i].PP_interception_end + ' - ' + driver[i].PP_street_end ;
                   }
                   else if (driver[i].PP_interception !== null && driver[i].PP_interception_end === null) {
                   var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с пер. ' + driver[i].PP_interception + ' - ' + driver[i].PP_street + ' едет до ост. "' + driver[i].PP_busstop_end + '" по улице ' + driver[i].PP_street_end ;
                   }
                   else if (driver[i].PP_interception !== null && driver[i].PP_interception_end !== null) {
                   var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с пер. ' + driver[i].PP_interception + ' - ' + driver[i].PP_street + ' и едет до пер. ' + driver[i].PP_interception_end + ' - ' + driver[i].PP_street_end ;
                   }

                    console.log('PASU  ', pasu_text);
                    bot.sendMessage(driver[i].DDD_id_user, pasu_text ,{
                                     reply_markup: {
                                       inline_keyboard: [
                                         [{
                                          text: 'Отправить предложение пассажиру',
                                          callback_data:  'confirm_pass '+ driver[i].PP_id_user + ' ' + driver[i].DDD_id_user
                                         }]
                                       ]
                                     }

                    })
                   }
            }
       setTimeout(tabu_pass_onpar2, 5000, 'funky');
            function tabu_pass_onpar2 (msg){
                              for(var i = 30; i < 60; i++){

                               if (driver[i].PP_interception === null && driver[i].PP_interception_end === null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с ост. "' + driver[i].PP_busstop + '"  по улице ' + driver[i].PP_street + ' и едет до ост. "' + driver[i].PP_busstop_end + '" по улице ' + driver[i].PP_street_end ;
                               }
                               else if (driver[i].PP_interception === null && driver[i].PP_interception_end !== null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с ост. "' + driver[i].PP_busstop + '"  по улице ' + driver[i].PP_street + ' едет до пер. ' + driver[i].PP_interception_end + ' - ' + driver[i].PP_street_end ;
                               }
                               else if (driver[i].PP_interception !== null && driver[i].PP_interception_end === null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с пер. ' + driver[i].PP_interception + ' - ' + driver[i].PP_street + ' едет до ост. "' + driver[i].PP_busstop_end + '" по улице ' + driver[i].PP_street_end ;
                               }
                               else if (driver[i].PP_interception !== null && driver[i].PP_interception_end !== null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с пер. ' + driver[i].PP_interception + ' - ' + driver[i].PP_street + ' и едет до пер. ' + driver[i].PP_interception_end + ' - ' + driver[i].PP_street_end ;
                               }

                                console.log('PASU  ', pasu_text);
                                bot.sendMessage(driver[i].DDD_id_user, pasu_text ,{
                                                 reply_markup: {
                                                   inline_keyboard: [
                                                     [{
                                                      text: 'Отправить предложение пассажиру',
                                                      callback_data:  'confirm_pass '+ driver[i].PP_id_user + ' ' + driver[i].DDD_id_user
                                                     }]
                                                   ]
                                                 }

                                })
                               }
                        }
       setTimeout(tabu_pass_onpar3, 10000, 'funky');
            function tabu_pass_onpar3 (msg){
                              for(var i = 60; i < 90; i++){

                               if (driver[i].PP_interception === null && driver[i].PP_interception_end === null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с ост. "' + driver[i].PP_busstop + '"  по улице ' + driver[i].PP_street + ' и едет до ост. "' + driver[i].PP_busstop_end + '" по улице ' + driver[i].PP_street_end ;
                               }
                               else if (driver[i].PP_interception === null && driver[i].PP_interception_end !== null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с ост. "' + driver[i].PP_busstop + '"  по улице ' + driver[i].PP_street + ' едет до пер. ' + driver[i].PP_interception_end + ' - ' + driver[i].PP_street_end ;
                               }
                               else if (driver[i].PP_interception !== null && driver[i].PP_interception_end === null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с пер. ' + driver[i].PP_interception + ' - ' + driver[i].PP_street + ' едет до ост. "' + driver[i].PP_busstop_end + '" по улице ' + driver[i].PP_street_end ;
                               }
                               else if (driver[i].PP_interception !== null && driver[i].PP_interception_end !== null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с пер. ' + driver[i].PP_interception + ' - ' + driver[i].PP_street + ' и едет до пер. ' + driver[i].PP_interception_end + ' - ' + driver[i].PP_street_end ;
                               }

                                console.log('PASU  ', pasu_text);
                                bot.sendMessage(driver[i].DDD_id_user, pasu_text ,{
                                                 reply_markup: {
                                                   inline_keyboard: [
                                                     [{
                                                      text: 'Отправить предложение пассажиру',
                                                      callback_data:  'confirm_pass '+ driver[i].PP_id_user + ' ' + driver[i].DDD_id_user
                                                     }]
                                                   ]
                                                 }

                                })
                               }
                        }
       setTimeout(tabu_pass_onpar4, 15000, 'funky');
            function tabu_pass_onpar4 (msg){
                              for(var i = 90; i < 120; i++){

                               if (driver[i].PP_interception === null && driver[i].PP_interception_end === null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с ост. "' + driver[i].PP_busstop + '"  по улице ' + driver[i].PP_street + ' и едет до ост. "' + driver[i].PP_busstop_end + '" по улице ' + driver[i].PP_street_end ;
                               }
                               else if (driver[i].PP_interception === null && driver[i].PP_interception_end !== null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с ост. "' + driver[i].PP_busstop + '"  по улице ' + driver[i].PP_street + ' едет до пер. ' + driver[i].PP_interception_end + ' - ' + driver[i].PP_street_end ;
                               }
                               else if (driver[i].PP_interception !== null && driver[i].PP_interception_end === null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с пер. ' + driver[i].PP_interception + ' - ' + driver[i].PP_street + ' едет до ост. "' + driver[i].PP_busstop_end + '" по улице ' + driver[i].PP_street_end ;
                               }
                               else if (driver[i].PP_interception !== null && driver[i].PP_interception_end !== null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с пер. ' + driver[i].PP_interception + ' - ' + driver[i].PP_street + ' и едет до пер. ' + driver[i].PP_interception_end + ' - ' + driver[i].PP_street_end ;
                               }

                                console.log('PASU  ', pasu_text);
                                bot.sendMessage(driver[i].DDD_id_user, pasu_text ,{
                                                 reply_markup: {
                                                   inline_keyboard: [
                                                     [{
                                                      text: 'Отправить предложение пассажиру',
                                                      callback_data:  'confirm_pass '+ driver[i].PP_id_user + ' ' + driver[i].DDD_id_user
                                                     }]
                                                   ]
                                                 }

                                })
                               }
                        }
       setTimeout(tabu_pass_onpar5, 20000, 'funky');
            function tabu_pass_onpar5 (msg){
                              for(var i = 120; i < 150; i++){

                               if (driver[i].PP_interception === null && driver[i].PP_interception_end === null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с ост. "' + driver[i].PP_busstop + '"  по улице ' + driver[i].PP_street + ' и едет до ост. "' + driver[i].PP_busstop_end + '" по улице ' + driver[i].PP_street_end ;
                               }
                               else if (driver[i].PP_interception === null && driver[i].PP_interception_end !== null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с ост. "' + driver[i].PP_busstop + '"  по улице ' + driver[i].PP_street + ' едет до пер. ' + driver[i].PP_interception_end + ' - ' + driver[i].PP_street_end ;
                               }
                               else if (driver[i].PP_interception !== null && driver[i].PP_interception_end === null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с пер. ' + driver[i].PP_interception + ' - ' + driver[i].PP_street + ' едет до ост. "' + driver[i].PP_busstop_end + '" по улице ' + driver[i].PP_street_end ;
                               }
                               else if (driver[i].PP_interception !== null && driver[i].PP_interception_end !== null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с пер. ' + driver[i].PP_interception + ' - ' + driver[i].PP_street + ' и едет до пер. ' + driver[i].PP_interception_end + ' - ' + driver[i].PP_street_end ;
                               }

                                console.log('PASU  ', pasu_text);
                                bot.sendMessage(driver[i].DDD_id_user, pasu_text ,{
                                                 reply_markup: {
                                                   inline_keyboard: [
                                                     [{
                                                      text: 'Отправить предложение пассажиру',
                                                      callback_data:  'confirm_pass '+ driver[i].PP_id_user + ' ' + driver[i].DDD_id_user
                                                     }]
                                                   ]
                                                 }

                                })
                               }
                        }
       }
       else if(driver.length > 150) {  bot.sendMessage(  336243307, 'Уже больше 150 активных человек функция Tabu_pass_on_parallel' )  }
   }

// Если нет попутных водителей т.е. driver.length == 0, то таймер ставиться на паузу     status <> "busy"  AND
   else { timer.pause(); console.log('Timer paused cause no drivers match passengers');
       var sql_else = ' SELECT DISTINCT id_user FROM route WHERE  time_end > NOW() ';
       connection.query( sql_else , function(err, rows, fields) {
       if (err) throw err;
       var driver_act = JSON.parse(JSON.stringify(rows));
       console.log('Vivel activnih', driver_act)
          if(driver.length <= 30 && driver.length != 0){
                 console.log('Vivel activnih', driver_act[0].id_user)
                         for(var i = 0; i < driver_act.length; i++){
                         bot.sendMessage(driver_act[i].id_user, 'В данный момент нет пассажиров' )
                         }
          }
          else if(driver.length > 30 && driver.length <= 60){
          setTimeout(send_to_active_drivers1, 500, 'funky');
               function send_to_active_drivers1 (msg){
                         for(var i = 0; i < 30; i++){
                         bot.sendMessage(driver_act[i].id_user, 'В данный момент нет пассажиров' )
                         }
               }
          setTimeout(send_to_active_drivers2, 10000, 'funky');
               function send_to_active_drivers2 (msg){
                         for(var i = 30; i < driver_act.length; i++){
                         bot.sendMessage(driver_act[i].id_user, 'В данный момент нет пассажиров' )
                         }
               }
          }
          else if(driver.length > 60 && driver.length <= 90){
          setTimeout(send_to_active_drivers1, 500, 'funky');
               function send_to_active_drivers1 (msg){
                         for(var i = 0; i < 30; i++){
                         bot.sendMessage(driver_act[i].id_user, 'В данный момент нет пассажиров' )
                         }
               }
          setTimeout(send_to_active_drivers2, 5000, 'funky');
               function send_to_active_drivers2 (msg){
                         for(var i = 30; i < 60; i++){
                         bot.sendMessage(driver_act[i].id_user, 'В данный момент нет пассажиров' )
                         }
               }
          setTimeout(send_to_active_drivers3, 10000, 'funky');
               function send_to_active_drivers3 (msg){
                         for(var i = 60; i < driver_act.length; i++){
                         bot.sendMessage(driver_act[i].id_user, 'В данный момент нет пассажиров' )
                         }
               }
          }
          else if(driver.length > 90 && driver.length <= 120){
          setTimeout(send_to_active_drivers1, 500, 'funky');
               function send_to_active_drivers1 (msg){
                         for(var i = 0; i < 30; i++){
                         bot.sendMessage(driver_act[i].id_user, 'В данный момент нет пассажиров' )
                         }
               }
          setTimeout(send_to_active_drivers2, 5000, 'funky');
               function send_to_active_drivers2 (msg){
                         for(var i = 30; i < 60; i++){
                         bot.sendMessage(driver_act[i].id_user, 'В данный момент нет пассажиров' )
                         }
               }
          setTimeout(send_to_active_drivers3, 10000, 'funky');
               function send_to_active_drivers3 (msg){
                                         for(var i = 60; i < driver_act.length; i++){
                                         bot.sendMessage(driver_act[i].id_user, 'В данный момент нет пассажиров' )
                                         }
                               }
          setTimeout(send_to_active_drivers4, 15000, 'funky');
               function send_to_active_drivers4 (msg){
                         for(var i = 90; i < driver_act.length; i++){
                         bot.sendMessage(driver_act[i].id_user, 'В данный момент нет пассажиров' )
                         }
               }
          }
          else if(driver.length > 90 && driver.length <= 120){
                    setTimeout(send_to_active_drivers1, 500, 'funky');
                         function send_to_active_drivers1 (msg){
                                   for(var i = 0; i < 30; i++){
                                   bot.sendMessage(driver_act[i].id_user, 'В данный момент нет пассажиров' )
                                   }
                         }
                    setTimeout(send_to_active_drivers2, 5000, 'funky');
                         function send_to_active_drivers2 (msg){
                                   for(var i = 30; i < 60; i++){
                                   bot.sendMessage(driver_act[i].id_user, 'В данный момент нет пассажиров' )
                                   }
                         }
                    setTimeout(send_to_active_drivers3, 10000, 'funky');
                         function send_to_active_drivers3 (msg){
                                                   for(var i = 60; i < driver_act.length; i++){
                                                   bot.sendMessage(driver_act[i].id_user, 'В данный момент нет пассажиров' )
                                                   }
                                         }
                    setTimeout(send_to_active_drivers4, 15000, 'funky');
                         function send_to_active_drivers4 (msg){
                                   for(var i = 90; i < 120; i++){
                                   bot.sendMessage(driver_act[i].id_user, 'В данный момент нет пассажиров' )
                                   }
                         }
                    setTimeout(send_to_active_drivers5, 20000, 'funky');
                         function send_to_active_drivers5 (msg){
                                   for(var i = 120; i < driver_act.length; i++){
                                   bot.sendMessage(driver_act[i].id_user, 'В данный момент нет пассажиров' )
                                   }
                         }
                    }
       })
   }
})
})

}



function driv_offer_topass (query) {

var mysql  = require('mysql');
        var pool = mysql.createPool({
        host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
        database : 'sitebot'
    })

var user_id = query.message.chat.id;

pool.getConnection(function(err, connection) {

// Так как у пассажира и водителя, у которых совпался маршрут по нескольким столбцам, могут быть выбраны несколько строк, в конце выбираются уникальные столбцы из таблицы table3
var sql = ' SELECT DISTINCT PP_id_user, PP_begend, PP_id_route, PP_street, PP_interception, PP_busstop, ' +
               ' (SELECT street FROM route_p WHERE begend = "end" AND id_route = PP_id_route AND id_user = PP_id_user ) AS PP_street_end, ' +
               ' (SELECT interception FROM route_p WHERE begend = "end" AND id_route = PP_id_route AND id_user = PP_id_user ) AS PP_interception_end, ' +
               ' (SELECT busstop FROM route_p WHERE begend = "end" AND id_route = PP_id_route AND id_user = PP_id_user ) AS PP_busstop_end, ' +
               '  DD_id_user  AS DDD_id_user, DD_id_route  AS DDD_id_route, ' +
// Выбирает начальные данные street и interception водителя по "begend"-у выбирая "beg". Откуда этот водитель выезжает.
               ' ( SELECT street FROM route WHERE begend = "beg" AND id_user = DDD_id_user AND id_route = DDD_id_route ) AS street, ' +
               ' ( SELECT interception FROM route WHERE begend = "beg" AND id_user = DDD_id_user AND id_route = DDD_id_route ) AS interception, DD_time_beg ' +
               ' FROM (SELECT PP_id_user, PP_id_route, PP_id_point, PP_street, PP_interception, PP_busstop, PP_begend, PP_time_beg, PP_time_end, PP_near1, PP_near2, DD_id_user,  DD_id_route, DD_street, DD_interception, DD_id_point, DD_time_beg, DD_time_end ' +
// Вытаскивает время из БД в формате TIME (без даты, только время)
               ' FROM (SELECT  route_p1.P_id_user AS PP_id_user,  route_p1.P_id_route AS PP_id_route,  route_p1.P_id_point AS PP_id_point, route_p1.P_street AS PP_street, route_p1.P_interception AS PP_interception, route_p1.P_busstop AS PP_busstop, route_p1.P_begend AS PP_begend, route_p1.P_time_beg AS PP_time_beg, route_p1.P_time_end AS PP_time_end, route_p1.near1 AS PP_near1, route_p1.near2 AS PP_near2, route.id_user AS DD_id_user,  route.id_route AS DD_id_route,  route.street AS DD_street,  route.interception AS DD_interception,  route.id_point AS DD_id_point,  TIME(route.time_beg) AS  DD_time_beg,  route.time_end AS  DD_time_end  ' +
// Формирует новую таблицу route_p1, где создает два отдельных столбца near1 и near2 из одного столбца nearby_interception таблицы route_p
                     ' FROM (SELECT id_user AS P_id_user, begend AS P_begend, id_route AS P_id_route, id_point AS P_id_point, street AS P_street, interception AS P_interception, busstop AS P_busstop, time_beg AS P_time_beg, time_end AS P_time_end, SUBSTRING (nearby_interception, 1,15) AS near1, SUBSTRING (nearby_interception, 19,15) AS near2, n_pass  AS P_n_pass  FROM route_p  WHERE  time_end > NOW() AND status <> "busy" ) AS route_p1 ' +
// Выбирает строки у которых совпадают id_point-ы, id_point с nearby_interception, с point_parinter_min5, с point_parinter_plu5 и формирует новую таблицу table1. И затем из строк таблицы table1 выбирает строки у которых столбец begend = "beg"
                         ' JOIN route  WHERE  (route_p1.P_id_point = route.id_point  OR  route_p1.near1 = route.id_point OR  route_p1.near2 = route.id_point )  AND route.time_end > NOW() AND route.limit_place >= route_p1.P_n_pass AND route.id_user = ? AND  route.id_route = (SELECT id_route FROM route WHERE id_user = ? ORDER BY id_route DESC LIMIT 1)  ORDER BY PP_id_user, PP_id_route) AS table1 WHERE PP_begend = "beg" ' +
// Возвращает TRUE если запрос, указанный ниже подтверждается
                             ' AND  EXISTS  (SELECT * FROM  (SELECT  route_p1.P_id_user AS PP_id_user,  route_p1.P_id_route AS PP_id_route,  route_p1.P_id_point AS PP_id_point, route_p1.P_begend AS PP_begend, route_p1.P_time_end AS PP_time_end, route_p1.near1 AS PP_near1, route_p1.near2 AS PP_near2, route.id_user AS DD_id_user,  route.id_route AS DD_id_route,  route.id_point AS DD_id_point,  route.time_end AS DD_time_end   FROM (SELECT id_user AS P_id_user, id_route AS P_id_route, id_point AS P_id_point, begend AS P_begend, time_end AS P_time_end, SUBSTRING (nearby_interception, 1,15) AS near1, SUBSTRING (nearby_interception, 19,15) AS near2, n_pass  AS P_n_pass FROM route_p  WHERE time_end > NOW() AND status <> "busy" ) AS route_p1 JOIN route ' +
// Выбирает строки у которых совпадают id_point-ы, id_point с nearby_interception, с point_parinter_min5, с point_parinter_plu5 и формирует новую таблицу table2. И затем из строк таблицы table2 выбирает строки у которых столбец begend = "end" и id_user строки из таблицы table1 равен id_user-у строки таблицы table2  и все это сохраняет как таблицу table3
                                   ' WHERE  (route_p1.P_id_point = route.id_point  OR  route_p1.near1 = route.id_point OR  route_p1.near2 = route.id_point )  AND route.time_end > NOW() AND route.limit_place >= route_p1.P_n_pass AND route.id_user = ? AND  route.id_route = (SELECT id_route FROM route WHERE id_user = ? ORDER BY id_route DESC LIMIT 1) ORDER BY PP_id_user, PP_id_route)  AS table2 WHERE PP_begend = "end" AND table1.PP_id_user = table2.PP_id_user AND table1.DD_id_user = table2.DD_id_user) ) AS table3 ';

connection.query( sql , [ user_id, user_id, user_id, user_id ], function(err, rows, fields) {
if (err) throw err;
var driver = JSON.parse(JSON.stringify(rows));
console.log('driv offer topass ', driver);

   if (driver.length !== 0){

       if(driver.length <= 30){


              for(var i = 0; i < driver.length; i++){

               var text = 'Этот водитель выезжает с пересечения ' + driver[i].street + '-' + driver[i].interception + ' в ' + driver[i].DD_time_beg;

               console.log('ПОПУТИ 1-30 ', text);
               bot.sendMessage(driver[i].PP_id_user, text ,{
                                reply_markup: {
                                  inline_keyboard: [
                                    [{
                                      text: 'Выбрать попутное авто',
                                      callback_data:  'driver '+driver[i].DDD_id_user
                                    }]
                                  ]
                                }

               })
              }


       }
       else if(driver.length > 30 && driver.length <= 60){
       setTimeout(driver_poputi1,500, 'funky');
            function driver_poputi1 (msg){
                   for(var i = 0; i < 30; i++){
                    var pasu_text = 'Этот водитель выезжает с пересечения ' + driver[i].street + '-' + driver[i].interception + ' в ' + driver[i].DD_time_beg;

                    console.log('PASU  ', pasu_text);
                    bot.sendMessage(driver[i].PP_id_user, pasu_text ,{
                                     reply_markup: {
                                       inline_keyboard: [
                                         [{
                                           text: 'Выбрать попутное авто',
                                           callback_data:  'driver '+driver[i].DDD_id_user
                                         }]
                                       ]
                                     }

                    })
                   }
                   }
       setTimeout(driver_poputi2, 10000, 'funky');
            function driver_poputi2 (msg){
                   for(var i = 30; i <= driver.length; i++){
                    var pasu_text = 'Этот водитель выезжает с пересечения ' + driver[i].street + '-' + driver[i].interception + ' в ' + driver[i].DD_time_beg;

                    console.log('PASU  ', pasu_text);
                    bot.sendMessage(driver[i].PP_id_user, pasu_text ,{
                                     reply_markup: {
                                       inline_keyboard: [
                                         [{
                                           text: 'Выбрать попутное авто',
                                           callback_data:  'driver '+driver[i].DDD_id_user
                                         }]
                                       ]
                                     }

                    })
                   }
            }
       }
       else if(driver.length > 60 && driver.length <= 90){
       setTimeout(driver_poputi1,500, 'funky');
            function driver_poputi1 (msg){
                   for(var i = 0; i < 30; i++){
                    var pasu_text = 'Этот водитель выезжает с пересечения ' + driver[i].street + '-' + driver[i].interception + ' в ' + driver[i].DD_time_beg;

                    console.log('PASU  ', pasu_text);
                    bot.sendMessage(driver[i].PP_id_user, pasu_text ,{
                                     reply_markup: {
                                       inline_keyboard: [
                                         [{
                                           text: 'Выбрать попутное авто',
                                           callback_data:  'driver '+driver[i].DDD_id_user
                                         }]
                                       ]
                                     }

                    })
                   }
                   }
       setTimeout(driver_poputi2, 5000, 'funky');
            function driver_poputi2 (msg){
                   for(var i = 30; i < 60; i++){
                    var pasu_text = 'Этот водитель выезжает с пересечения ' + driver[i].street + '-' + driver[i].interception + ' в ' + driver[i].DD_time_beg;

                    console.log('PASU  ', pasu_text);
                    bot.sendMessage(driver[i].PP_id_user, pasu_text ,{
                                     reply_markup: {
                                       inline_keyboard: [
                                         [{
                                           text: 'Выбрать попутное авто',
                                           callback_data:  'driver '+driver[i].DDD_id_user
                                         }]
                                       ]
                                     }

                    })
                   }
            }
       setTimeout(driver_poputi3, 15000, 'funky');
            function driver_poputi3 (msg){
                   for(var i = 60; i < driver.length; i++){
                    var pasu_text = 'Этот водитель выезжает с пересечения ' + driver[i].street + '-' + driver[i].interception + ' в ' + driver[i].DD_time_beg;

                    console.log('PASU  ', pasu_text);
                    bot.sendMessage(driver[i].PP_id_user, pasu_text ,{
                                     reply_markup: {
                                       inline_keyboard: [
                                         [{
                                           text: 'Выбрать попутное авто',
                                           callback_data:  'driver '+driver[i].DDD_id_user
                                         }]
                                       ]
                                     }

                    })
                   }
            }
       }
       else if(driver.length > 90 && driver.length <= 120){
       setTimeout(driver_poputi1,500, 'funky');
            function driver_poputi1 (msg){
                   for(var i = 0; i < 30; i++){
                    var pasu_text = 'Этот водитель выезжает с пересечения ' + driver[i].street + '-' + driver[i].interception + ' в ' + driver[i].DD_time_beg;

                    console.log('PASU  ', pasu_text);
                    bot.sendMessage(driver[i].PP_id_user, pasu_text ,{
                                     reply_markup: {
                                       inline_keyboard: [
                                         [{
                                           text: 'Выбрать попутное авто',
                                           callback_data:  'driver '+driver[i].DDD_id_user
                                         }]
                                       ]
                                     }

                    })
                   }
                   }
       setTimeout(driver_poputi2, 5000, 'funky');
            function driver_poputi2 (msg){
                   for(var i = 30; i < 60; i++){
                    var pasu_text = 'Этот водитель выезжает с пересечения ' + driver[i].street + '-' + driver[i].interception + ' в ' + driver[i].DD_time_beg;

                    console.log('PASU  ', pasu_text);
                    bot.sendMessage(driver[i].PP_id_user, pasu_text ,{
                                     reply_markup: {
                                       inline_keyboard: [
                                         [{
                                           text: 'Выбрать попутное авто',
                                           callback_data:  'driver '+driver[i].DDD_id_user
                                         }]
                                       ]
                                     }

                    })
                   }
            }
       setTimeout(driver_poputi3, 15000, 'funky');
            function driver_poputi3 (msg){
                   for(var i = 60; i < 90; i++){
                    var pasu_text = 'Этот водитель выезжает с пересечения ' + driver[i].street + '-' + driver[i].interception + ' в ' + driver[i].DD_time_beg;

                    console.log('PASU  ', pasu_text);
                    bot.sendMessage(driver[i].PP_id_user, pasu_text ,{
                                     reply_markup: {
                                       inline_keyboard: [
                                         [{
                                           text: 'Выбрать попутное авто',
                                           callback_data:  'driver '+driver[i].DDD_id_user
                                         }]
                                       ]
                                     }

                    })
                   }
            }
       setTimeout(driver_poputi4, 20000, 'funky');
            function driver_poputi4 (msg){
                   for(var i = 90; i < driver.length; i++){
                    var pasu_text = 'Этот водитель выезжает с пересечения ' + driver[i].street + '-' + driver[i].interception + ' в ' + driver[i].DD_time_beg;

                    console.log('PASU  ', pasu_text);
                    bot.sendMessage(driver[i].PP_id_user, pasu_text ,{
                                     reply_markup: {
                                       inline_keyboard: [
                                         [{
                                           text: 'Выбрать попутное авто',
                                           callback_data:  'driver '+driver[i].DDD_id_user
                                         }]
                                       ]
                                     }

                    })
                   }
            }
       }
       else if(driver.length > 120 && driver.length <= 150){
              setTimeout(driver_poputi1,500, 'funky');
                   function driver_poputi1 (msg){
                          for(var i = 0; i < 30; i++){
                           var pasu_text = 'Этот водитель выезжает с пересечения ' + driver[i].street + '-' + driver[i].interception + ' в ' + driver[i].DD_time_beg;

                           console.log('PASU  ', pasu_text);
                           bot.sendMessage(driver[i].PP_id_user, pasu_text ,{
                                            reply_markup: {
                                              inline_keyboard: [
                                                [{
                                                  text: 'Выбрать попутное авто',
                                                  callback_data:  'driver '+driver[i].DDD_id_user
                                                }]
                                              ]
                                            }

                           })
                          }
                          }
              setTimeout(driver_poputi2, 5000, 'funky');
                   function driver_poputi2 (msg){
                          for(var i = 30; i < 60; i++){
                           var pasu_text = 'Этот водитель выезжает с пересечения ' + driver[i].street + '-' + driver[i].interception + ' в ' + driver[i].DD_time_beg;

                           console.log('PASU  ', pasu_text);
                           bot.sendMessage(driver[i].PP_id_user, pasu_text ,{
                                            reply_markup: {
                                              inline_keyboard: [
                                                [{
                                                  text: 'Выбрать попутное авто',
                                                  callback_data:  'driver '+driver[i].DDD_id_user
                                                }]
                                              ]
                                            }

                           })
                          }
                   }
              setTimeout(driver_poputi3, 15000, 'funky');
                   function driver_poputi3 (msg){
                          for(var i = 60; i < 90; i++){
                           var pasu_text = 'Этот водитель выезжает с пересечения ' + driver[i].street + '-' + driver[i].interception + ' в ' + driver[i].DD_time_beg;

                           console.log('PASU  ', pasu_text);
                           bot.sendMessage(driver[i].PP_id_user, pasu_text ,{
                                            reply_markup: {
                                              inline_keyboard: [
                                                [{
                                                  text: 'Выбрать попутное авто',
                                                  callback_data:  'driver '+driver[i].DDD_id_user
                                                }]
                                              ]
                                            }

                           })
                          }
                   }
              setTimeout(driver_poputi4, 20000, 'funky');
                   function driver_poputi4 (msg){
                          for(var i = 90; i < 120; i++){
                           var pasu_text = 'Этот водитель выезжает с пересечения ' + driver[i].street + '-' + driver[i].interception + ' в ' + driver[i].DD_time_beg;

                           console.log('PASU  ', pasu_text);
                           bot.sendMessage(driver[i].PP_id_user, pasu_text ,{
                                            reply_markup: {
                                              inline_keyboard: [
                                                [{
                                                  text: 'Выбрать попутное авто',
                                                  callback_data:  'driver '+driver[i].DDD_id_user
                                                }]
                                              ]
                                            }

                           })
                          }
                   }
              setTimeout(driver_poputi5, 25000, 'funky');
                   function driver_poputi5 (msg){
                          for(var i = 120; i < driver.length; i++){
                           var pasu_text = 'Этот водитель выезжает с пересечения ' + driver[i].street + '-' + driver[i].interception + ' в ' + driver[i].DD_time_beg;

                           console.log('PASU  ', pasu_text);
                           bot.sendMessage(driver[i].PP_id_user, pasu_text ,{
                                            reply_markup: {
                                              inline_keyboard: [
                                                [{
                                                  text: 'Выбрать попутное авто',
                                                  callback_data:  'driver '+driver[i].DDD_id_user
                                                }]
                                              ]
                                            }

                           })
                          }
                   }
              }
       else if(driver.length > 150) {  bot.sendMessage(  336243307, 'Уже больше 150 активных человек' )  }
   }
})
})

}



function driv_offer_todriv (query) {

var mysql  = require('mysql');
        var pool = mysql.createPool({
        host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
        database : 'sitebot'
    })

var user_id = query.message.chat.id;

pool.getConnection(function(err, connection) {

// Так как у пассажира и водителя, у которых совпался маршрут по нескольким столбцам, могут быть выбраны несколько строк, в конце выбираются уникальные столбцы из таблицы table3
var sql = ' SELECT DISTINCT PP_id_user, PP_begend, PP_id_route, PP_street, PP_interception, PP_busstop, ' +
               ' (SELECT street FROM route_p WHERE begend = "end" AND id_route = PP_id_route AND id_user = PP_id_user ) AS PP_street_end, ' +
               ' (SELECT interception FROM route_p WHERE begend = "end" AND id_route = PP_id_route AND id_user = PP_id_user ) AS PP_interception_end, ' +
               ' (SELECT busstop FROM route_p WHERE begend = "end" AND id_route = PP_id_route AND id_user = PP_id_user ) AS PP_busstop_end, ' +
               '  DD_id_user  AS DDD_id_user, DD_id_route  AS DDD_id_route, ' +
// Выбирает начальные данные street и interception водителя по "begend"-у выбирая "beg". Откуда этот водитель выезжает.
               ' ( SELECT street FROM route WHERE begend = "beg" AND id_user = DDD_id_user AND id_route = DDD_id_route ) AS street, ' +
               ' ( SELECT interception FROM route WHERE begend = "beg" AND id_user = DDD_id_user AND id_route = DDD_id_route ) AS interception, DD_time_beg ' +
               ' FROM (SELECT PP_id_user, PP_id_route, PP_id_point, PP_street, PP_interception, PP_busstop, PP_begend, PP_time_beg, PP_time_end, PP_near1, PP_near2, DD_id_user,  DD_id_route, DD_street, DD_interception, DD_id_point, DD_time_beg, DD_time_end ' +
// Вытаскивает время из БД в формате TIME (без даты, только время)
               ' FROM (SELECT  route_p1.P_id_user AS PP_id_user,  route_p1.P_id_route AS PP_id_route,  route_p1.P_id_point AS PP_id_point, route_p1.P_street AS PP_street, route_p1.P_interception AS PP_interception, route_p1.P_busstop AS PP_busstop, route_p1.P_begend AS PP_begend, route_p1.P_time_beg AS PP_time_beg, route_p1.P_time_end AS PP_time_end, route_p1.near1 AS PP_near1, route_p1.near2 AS PP_near2, route.id_user AS DD_id_user,  route.id_route AS DD_id_route,  route.street AS DD_street,  route.interception AS DD_interception,  route.id_point AS DD_id_point,  TIME(route.time_beg) AS  DD_time_beg,  route.time_end AS  DD_time_end  ' +
// Формирует новую таблицу route_p1, где создает два отдельных столбца near1 и near2 из одного столбца nearby_interception таблицы route_p
                     ' FROM (SELECT id_user AS P_id_user, begend AS P_begend, id_route AS P_id_route, id_point AS P_id_point, street AS P_street, interception AS P_interception, busstop AS P_busstop, time_beg AS P_time_beg, time_end AS P_time_end, SUBSTRING (nearby_interception, 1,15) AS near1, SUBSTRING (nearby_interception, 19,15) AS near2, n_pass  AS P_n_pass  FROM route_p  WHERE  time_end > NOW() AND status <> "busy" ) AS route_p1 ' +
// Выбирает строки у которых совпадают id_point-ы, id_point с nearby_interception, с point_parinter_min5, с point_parinter_plu5 и формирует новую таблицу table1. И затем из строк таблицы table1 выбирает строки у которых столбец begend = "beg"
                         ' JOIN route  WHERE  (route_p1.P_id_point = route.id_point  OR  route_p1.near1 = route.id_point OR  route_p1.near2 = route.id_point  OR  route_p1.near1 = route.point_parinter_min5  OR  route_p1.near2 = route.point_parinter_plu5 OR  route_p1.near2 = route.point_parinter_min5  OR  route_p1.near1 = route.point_parinter_plu5  OR  route_p1.P_id_point = route.point_parinter_plu5  OR  route_p1.P_id_point = route.point_parinter_min5)  AND route.time_end > NOW() AND route.limit_place >= route_p1.P_n_pass  AND route.id_user = ? AND  route.id_route = (SELECT id_route FROM route WHERE id_user = ? ORDER BY id_route DESC LIMIT 1)  ORDER BY PP_id_user, PP_id_route) AS table1 WHERE PP_begend = "beg" ' +
// Возвращает TRUE если запрос, указанный ниже подтверждается
                             ' AND  EXISTS  (SELECT * FROM  (SELECT  route_p1.P_id_user AS PP_id_user,  route_p1.P_id_route AS PP_id_route,  route_p1.P_id_point AS PP_id_point, route_p1.P_begend AS PP_begend, route_p1.P_time_end AS PP_time_end, route_p1.near1 AS PP_near1, route_p1.near2 AS PP_near2, route.id_user AS DD_id_user,  route.id_route AS DD_id_route,  route.id_point AS DD_id_point,  route.time_end AS DD_time_end   FROM (SELECT id_user AS P_id_user, id_route AS P_id_route, id_point AS P_id_point, begend AS P_begend, time_end AS P_time_end, SUBSTRING (nearby_interception, 1,15) AS near1, SUBSTRING (nearby_interception, 19,15) AS near2, n_pass  AS P_n_pass FROM route_p  WHERE time_end > NOW() AND status <> "busy" ) AS route_p1 JOIN route ' +
// Выбирает строки у которых совпадают id_point-ы, id_point с nearby_interception, с point_parinter_min5, с point_parinter_plu5 и формирует новую таблицу table2. И затем из строк таблицы table2 выбирает строки у которых столбец begend = "end" и id_user строки из таблицы table1 равен id_user-у строки таблицы table2  и все это сохраняет как таблицу table3
                                   ' WHERE  (route_p1.P_id_point = route.id_point  OR  route_p1.near1 = route.id_point OR  route_p1.near2 = route.id_point  OR  route_p1.near1 = route.point_parinter_min5  OR  route_p1.near2 = route.point_parinter_plu5 OR  route_p1.near2 = route.point_parinter_min5  OR  route_p1.near1 = route.point_parinter_plu5  OR  route_p1.P_id_point = route.point_parinter_plu5  OR  route_p1.P_id_point = route.point_parinter_min5)  AND route.time_end > NOW() AND route.limit_place >= route_p1.P_n_pass  AND route.id_user = ? AND  route.id_route = (SELECT id_route FROM route WHERE id_user = ? ORDER BY id_route DESC LIMIT 1) ORDER BY PP_id_user, PP_id_route)  AS table2 WHERE PP_begend = "end" AND table1.PP_id_user = table2.PP_id_user AND table1.DD_id_user = table2.DD_id_user) ) AS table3 ';

connection.query( sql , [ user_id, user_id, user_id, user_id ], function(err, rows, fields) {
if (err) throw err;
var driver = JSON.parse(JSON.stringify(rows));
console.log('driv_offer_todriv ', driver);

   if (driver.length !== 0){
       if(driver.length <= 30){
           for(var i = 0; i < driver.length; i++){

           if (driver[i].PP_interception === null && driver[i].PP_interception_end === null) {
           var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с ост. "' + driver[i].PP_busstop + '"  по улице ' + driver[i].PP_street + ' и едет до ост. "' + driver[i].PP_busstop_end + '" по улице ' + driver[i].PP_street_end ;
           }
           else if (driver[i].PP_interception === null && driver[i].PP_interception_end !== null) {
           var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с ост. "' + driver[i].PP_busstop + '"  по улице ' + driver[i].PP_street + ' едет до пер. ' + driver[i].PP_interception_end + ' - ' + driver[i].PP_street_end ;
           }
           else if (driver[i].PP_interception !== null && driver[i].PP_interception_end === null) {
           var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с пер. ' + driver[i].PP_interception + ' - ' + driver[i].PP_street + ' едет до ост. "' + driver[i].PP_busstop_end + '" по улице ' + driver[i].PP_street_end ;
           }
           else if (driver[i].PP_interception !== null && driver[i].PP_interception_end !== null) {
           var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с пер. ' + driver[i].PP_interception + ' - ' + driver[i].PP_street + ' и едет до пер. ' + driver[i].PP_interception_end + ' - ' + driver[i].PP_street_end ;
           }

            console.log('PASU  ', pasu_text);
            bot.sendMessage(driver[i].DDD_id_user, pasu_text ,{
                             reply_markup: {
                               inline_keyboard: [
                                 [{
                                  text: 'Отправить предложение пассажиру',
                                  callback_data:  'confirm_pass '+ driver[i].PP_id_user + ' ' + driver[i].DDD_id_user
                                 }]
                               ]
                             }

            })
           }
       }
       else if(driver.length > 30 && driver.length <= 60){
       setTimeout(tabu_pass_onpar1, 500, 'funky');
            function tabu_pass_onpar1 (msg){
                  for(var i = 0; i < 30; i++){

                   if (driver[i].PP_interception === null && driver[i].PP_interception_end === null) {
                   var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с ост. "' + driver[i].PP_busstop + '"  по улице ' + driver[i].PP_street + ' и едет до ост. "' + driver[i].PP_busstop_end + '" по улице ' + driver[i].PP_street_end ;
                   }
                   else if (driver[i].PP_interception === null && driver[i].PP_interception_end !== null) {
                   var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с ост. "' + driver[i].PP_busstop + '"  по улице ' + driver[i].PP_street + ' едет до пер. ' + driver[i].PP_interception_end + ' - ' + driver[i].PP_street_end ;
                   }
                   else if (driver[i].PP_interception !== null && driver[i].PP_interception_end === null) {
                   var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с пер. ' + driver[i].PP_interception + ' - ' + driver[i].PP_street + ' едет до ост. "' + driver[i].PP_busstop_end + '" по улице ' + driver[i].PP_street_end ;
                   }
                   else if (driver[i].PP_interception !== null && driver[i].PP_interception_end !== null) {
                   var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с пер. ' + driver[i].PP_interception + ' - ' + driver[i].PP_street + ' и едет до пер. ' + driver[i].PP_interception_end + ' - ' + driver[i].PP_street_end ;
                   }

                    console.log('PASU  ', pasu_text);
                    bot.sendMessage(driver[i].DDD_id_user, pasu_text ,{
                                     reply_markup: {
                                       inline_keyboard: [
                                         [{
                                          text: 'Отправить предложение пассажиру',
                                          callback_data:  'confirm_pass '+ driver[i].PP_id_user + ' ' + driver[i].DDD_id_user
                                         }]
                                       ]
                                     }

                    })
                   }
            }
       setTimeout(tabu_pass_onpar2, 5000, 'funky');
            function tabu_pass_onpar2 (msg){
                              for(var i = 30; i < driver.length; i++){

                               if (driver[i].PP_interception === null && driver[i].PP_interception_end === null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с ост. "' + driver[i].PP_busstop + '"  по улице ' + driver[i].PP_street + ' и едет до ост. "' + driver[i].PP_busstop_end + '" по улице ' + driver[i].PP_street_end ;
                               }
                               else if (driver[i].PP_interception === null && driver[i].PP_interception_end !== null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с ост. "' + driver[i].PP_busstop + '"  по улице ' + driver[i].PP_street + ' едет до пер. ' + driver[i].PP_interception_end + ' - ' + driver[i].PP_street_end ;
                               }
                               else if (driver[i].PP_interception !== null && driver[i].PP_interception_end === null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с пер. ' + driver[i].PP_interception + ' - ' + driver[i].PP_street + ' едет до ост. "' + driver[i].PP_busstop_end + '" по улице ' + driver[i].PP_street_end ;
                               }
                               else if (driver[i].PP_interception !== null && driver[i].PP_interception_end !== null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с пер. ' + driver[i].PP_interception + ' - ' + driver[i].PP_street + ' и едет до пер. ' + driver[i].PP_interception_end + ' - ' + driver[i].PP_street_end ;
                               }

                                console.log('PASU  ', pasu_text);
                                bot.sendMessage(driver[i].DDD_id_user, pasu_text ,{
                                                 reply_markup: {
                                                   inline_keyboard: [
                                                     [{
                                                      text: 'Отправить предложение пассажиру',
                                                      callback_data:  'confirm_pass '+ driver[i].PP_id_user + ' ' + driver[i].DDD_id_user
                                                     }]
                                                   ]
                                                 }

                                })
                               }
                        }
       }
       else if(driver.length > 60 && driver.length <= 90){
       setTimeout(tabu_pass_onpar1, 500, 'funky');
            function tabu_pass_onpar1 (msg){
                  for(var i = 0; i < 30; i++){

                   if (driver[i].PP_interception === null && driver[i].PP_interception_end === null) {
                   var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с ост. "' + driver[i].PP_busstop + '"  по улице ' + driver[i].PP_street + ' и едет до ост. "' + driver[i].PP_busstop_end + '" по улице ' + driver[i].PP_street_end ;
                   }
                   else if (driver[i].PP_interception === null && driver[i].PP_interception_end !== null) {
                   var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с ост. "' + driver[i].PP_busstop + '"  по улице ' + driver[i].PP_street + ' едет до пер. ' + driver[i].PP_interception_end + ' - ' + driver[i].PP_street_end ;
                   }
                   else if (driver[i].PP_interception !== null && driver[i].PP_interception_end === null) {
                   var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с пер. ' + driver[i].PP_interception + ' - ' + driver[i].PP_street + ' едет до ост. "' + driver[i].PP_busstop_end + '" по улице ' + driver[i].PP_street_end ;
                   }
                   else if (driver[i].PP_interception !== null && driver[i].PP_interception_end !== null) {
                   var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с пер. ' + driver[i].PP_interception + ' - ' + driver[i].PP_street + ' и едет до пер. ' + driver[i].PP_interception_end + ' - ' + driver[i].PP_street_end ;
                   }

                    console.log('PASU  ', pasu_text);
                    bot.sendMessage(driver[i].DDD_id_user, pasu_text ,{
                                     reply_markup: {
                                       inline_keyboard: [
                                         [{
                                          text: 'Отправить предложение пассажиру',
                                          callback_data:  'confirm_pass '+ driver[i].PP_id_user + ' ' + driver[i].DDD_id_user
                                         }]
                                       ]
                                     }

                    })
                   }
            }
       setTimeout(tabu_pass_onpar2, 5000, 'funky');
            function tabu_pass_onpar2 (msg){
                              for(var i = 30; i < 60; i++){

                               if (driver[i].PP_interception === null && driver[i].PP_interception_end === null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с ост. "' + driver[i].PP_busstop + '"  по улице ' + driver[i].PP_street + ' и едет до ост. "' + driver[i].PP_busstop_end + '" по улице ' + driver[i].PP_street_end ;
                               }
                               else if (driver[i].PP_interception === null && driver[i].PP_interception_end !== null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с ост. "' + driver[i].PP_busstop + '"  по улице ' + driver[i].PP_street + ' едет до пер. ' + driver[i].PP_interception_end + ' - ' + driver[i].PP_street_end ;
                               }
                               else if (driver[i].PP_interception !== null && driver[i].PP_interception_end === null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с пер. ' + driver[i].PP_interception + ' - ' + driver[i].PP_street + ' едет до ост. "' + driver[i].PP_busstop_end + '" по улице ' + driver[i].PP_street_end ;
                               }
                               else if (driver[i].PP_interception !== null && driver[i].PP_interception_end !== null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с пер. ' + driver[i].PP_interception + ' - ' + driver[i].PP_street + ' и едет до пер. ' + driver[i].PP_interception_end + ' - ' + driver[i].PP_street_end ;
                               }

                                console.log('PASU  ', pasu_text);
                                bot.sendMessage(driver[i].DDD_id_user, pasu_text ,{
                                                 reply_markup: {
                                                   inline_keyboard: [
                                                     [{
                                                      text: 'Отправить предложение пассажиру',
                                                      callback_data:  'confirm_pass '+ driver[i].PP_id_user + ' ' + driver[i].DDD_id_user
                                                     }]
                                                   ]
                                                 }

                                })
                               }
                        }
       setTimeout(tabu_pass_onpar3, 10000, 'funky');
            function tabu_pass_onpar3 (msg){
                              for(var i = 60; i < driver.length; i++){

                               if (driver[i].PP_interception === null && driver[i].PP_interception_end === null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с ост. "' + driver[i].PP_busstop + '"  по улице ' + driver[i].PP_street + ' и едет до ост. "' + driver[i].PP_busstop_end + '" по улице ' + driver[i].PP_street_end ;
                               }
                               else if (driver[i].PP_interception === null && driver[i].PP_interception_end !== null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с ост. "' + driver[i].PP_busstop + '"  по улице ' + driver[i].PP_street + ' едет до пер. ' + driver[i].PP_interception_end + ' - ' + driver[i].PP_street_end ;
                               }
                               else if (driver[i].PP_interception !== null && driver[i].PP_interception_end === null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с пер. ' + driver[i].PP_interception + ' - ' + driver[i].PP_street + ' едет до ост. "' + driver[i].PP_busstop_end + '" по улице ' + driver[i].PP_street_end ;
                               }
                               else if (driver[i].PP_interception !== null && driver[i].PP_interception_end !== null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с пер. ' + driver[i].PP_interception + ' - ' + driver[i].PP_street + ' и едет до пер. ' + driver[i].PP_interception_end + ' - ' + driver[i].PP_street_end ;
                               }

                                console.log('PASU  ', pasu_text);
                                bot.sendMessage(driver[i].DDD_id_user, pasu_text ,{
                                                 reply_markup: {
                                                   inline_keyboard: [
                                                     [{
                                                      text: 'Отправить предложение пассажиру',
                                                      callback_data:  'confirm_pass '+ driver[i].PP_id_user + ' ' + driver[i].DDD_id_user
                                                     }]
                                                   ]
                                                 }

                                })
                               }
                        }
       }
       else if(driver.length > 90 && driver.length <= 120){
       setTimeout(tabu_pass_onpar1, 500, 'funky');
            function tabu_pass_onpar1 (msg){
                  for(var i = 0; i < 30; i++){

                   if (driver[i].PP_interception === null && driver[i].PP_interception_end === null) {
                   var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с ост. "' + driver[i].PP_busstop + '"  по улице ' + driver[i].PP_street + ' и едет до ост. "' + driver[i].PP_busstop_end + '" по улице ' + driver[i].PP_street_end ;
                   }
                   else if (driver[i].PP_interception === null && driver[i].PP_interception_end !== null) {
                   var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с ост. "' + driver[i].PP_busstop + '"  по улице ' + driver[i].PP_street + ' едет до пер. ' + driver[i].PP_interception_end + ' - ' + driver[i].PP_street_end ;
                   }
                   else if (driver[i].PP_interception !== null && driver[i].PP_interception_end === null) {
                   var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с пер. ' + driver[i].PP_interception + ' - ' + driver[i].PP_street + ' едет до ост. "' + driver[i].PP_busstop_end + '" по улице ' + driver[i].PP_street_end ;
                   }
                   else if (driver[i].PP_interception !== null && driver[i].PP_interception_end !== null) {
                   var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с пер. ' + driver[i].PP_interception + ' - ' + driver[i].PP_street + ' и едет до пер. ' + driver[i].PP_interception_end + ' - ' + driver[i].PP_street_end ;
                   }

                    console.log('PASU  ', pasu_text);
                    bot.sendMessage(driver[i].DDD_id_user, pasu_text ,{
                                     reply_markup: {
                                       inline_keyboard: [
                                         [{
                                          text: 'Отправить предложение пассажиру',
                                          callback_data:  'confirm_pass '+ driver[i].PP_id_user + ' ' + driver[i].DDD_id_user
                                         }]
                                       ]
                                     }

                    })
                   }
            }
       setTimeout(tabu_pass_onpar2, 5000, 'funky');
            function tabu_pass_onpar2 (msg){
                              for(var i = 30; i < 60; i++){

                               if (driver[i].PP_interception === null && driver[i].PP_interception_end === null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с ост. "' + driver[i].PP_busstop + '"  по улице ' + driver[i].PP_street + ' и едет до ост. "' + driver[i].PP_busstop_end + '" по улице ' + driver[i].PP_street_end ;
                               }
                               else if (driver[i].PP_interception === null && driver[i].PP_interception_end !== null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с ост. "' + driver[i].PP_busstop + '"  по улице ' + driver[i].PP_street + ' едет до пер. ' + driver[i].PP_interception_end + ' - ' + driver[i].PP_street_end ;
                               }
                               else if (driver[i].PP_interception !== null && driver[i].PP_interception_end === null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с пер. ' + driver[i].PP_interception + ' - ' + driver[i].PP_street + ' едет до ост. "' + driver[i].PP_busstop_end + '" по улице ' + driver[i].PP_street_end ;
                               }
                               else if (driver[i].PP_interception !== null && driver[i].PP_interception_end !== null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с пер. ' + driver[i].PP_interception + ' - ' + driver[i].PP_street + ' и едет до пер. ' + driver[i].PP_interception_end + ' - ' + driver[i].PP_street_end ;
                               }

                                console.log('PASU  ', pasu_text);
                                bot.sendMessage(driver[i].DDD_id_user, pasu_text ,{
                                                 reply_markup: {
                                                   inline_keyboard: [
                                                     [{
                                                      text: 'Отправить предложение пассажиру',
                                                      callback_data:  'confirm_pass '+ driver[i].PP_id_user + ' ' + driver[i].DDD_id_user
                                                     }]
                                                   ]
                                                 }

                                })
                               }
                        }
       setTimeout(tabu_pass_onpar3, 10000, 'funky');
            function tabu_pass_onpar3 (msg){
                              for(var i = 60; i < 90; i++){

                               if (driver[i].PP_interception === null && driver[i].PP_interception_end === null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с ост. "' + driver[i].PP_busstop + '"  по улице ' + driver[i].PP_street + ' и едет до ост. "' + driver[i].PP_busstop_end + '" по улице ' + driver[i].PP_street_end ;
                               }
                               else if (driver[i].PP_interception === null && driver[i].PP_interception_end !== null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с ост. "' + driver[i].PP_busstop + '"  по улице ' + driver[i].PP_street + ' едет до пер. ' + driver[i].PP_interception_end + ' - ' + driver[i].PP_street_end ;
                               }
                               else if (driver[i].PP_interception !== null && driver[i].PP_interception_end === null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с пер. ' + driver[i].PP_interception + ' - ' + driver[i].PP_street + ' едет до ост. "' + driver[i].PP_busstop_end + '" по улице ' + driver[i].PP_street_end ;
                               }
                               else if (driver[i].PP_interception !== null && driver[i].PP_interception_end !== null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с пер. ' + driver[i].PP_interception + ' - ' + driver[i].PP_street + ' и едет до пер. ' + driver[i].PP_interception_end + ' - ' + driver[i].PP_street_end ;
                               }

                                console.log('PASU  ', pasu_text);
                                bot.sendMessage(driver[i].DDD_id_user, pasu_text ,{
                                                 reply_markup: {
                                                   inline_keyboard: [
                                                     [{
                                                      text: 'Отправить предложение пассажиру',
                                                      callback_data:  'confirm_pass '+ driver[i].PP_id_user + ' ' + driver[i].DDD_id_user
                                                     }]
                                                   ]
                                                 }

                                })
                               }
                        }
       setTimeout(tabu_pass_onpar4, 15000, 'funky');
            function tabu_pass_onpar4 (msg){
                              for(var i = 90; i < driver.length; i++){

                               if (driver[i].PP_interception === null && driver[i].PP_interception_end === null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с ост. "' + driver[i].PP_busstop + '"  по улице ' + driver[i].PP_street + ' и едет до ост. "' + driver[i].PP_busstop_end + '" по улице ' + driver[i].PP_street_end ;
                               }
                               else if (driver[i].PP_interception === null && driver[i].PP_interception_end !== null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с ост. "' + driver[i].PP_busstop + '"  по улице ' + driver[i].PP_street + ' едет до пер. ' + driver[i].PP_interception_end + ' - ' + driver[i].PP_street_end ;
                               }
                               else if (driver[i].PP_interception !== null && driver[i].PP_interception_end === null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с пер. ' + driver[i].PP_interception + ' - ' + driver[i].PP_street + ' едет до ост. "' + driver[i].PP_busstop_end + '" по улице ' + driver[i].PP_street_end ;
                               }
                               else if (driver[i].PP_interception !== null && driver[i].PP_interception_end !== null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с пер. ' + driver[i].PP_interception + ' - ' + driver[i].PP_street + ' и едет до пер. ' + driver[i].PP_interception_end + ' - ' + driver[i].PP_street_end ;
                               }

                                console.log('PASU  ', pasu_text);
                                bot.sendMessage(driver[i].DDD_id_user, pasu_text ,{
                                                 reply_markup: {
                                                   inline_keyboard: [
                                                     [{
                                                      text: 'Отправить предложение пассажиру',
                                                      callback_data:  'confirm_pass '+ driver[i].PP_id_user + ' ' + driver[i].DDD_id_user
                                                     }]
                                                   ]
                                                 }

                                })
                               }
                        }
       }
       else if(driver.length > 120 && driver.length <= 150){
       setTimeout(tabu_pass_onpar1, 500, 'funky');
            function tabu_pass_onpar1 (msg){
                  for(var i = 0; i < 30; i++){

                   if (driver[i].PP_interception === null && driver[i].PP_interception_end === null) {
                   var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с ост. "' + driver[i].PP_busstop + '"  по улице ' + driver[i].PP_street + ' и едет до ост. "' + driver[i].PP_busstop_end + '" по улице ' + driver[i].PP_street_end ;
                   }
                   else if (driver[i].PP_interception === null && driver[i].PP_interception_end !== null) {
                   var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с ост. "' + driver[i].PP_busstop + '"  по улице ' + driver[i].PP_street + ' едет до пер. ' + driver[i].PP_interception_end + ' - ' + driver[i].PP_street_end ;
                   }
                   else if (driver[i].PP_interception !== null && driver[i].PP_interception_end === null) {
                   var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с пер. ' + driver[i].PP_interception + ' - ' + driver[i].PP_street + ' едет до ост. "' + driver[i].PP_busstop_end + '" по улице ' + driver[i].PP_street_end ;
                   }
                   else if (driver[i].PP_interception !== null && driver[i].PP_interception_end !== null) {
                   var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с пер. ' + driver[i].PP_interception + ' - ' + driver[i].PP_street + ' и едет до пер. ' + driver[i].PP_interception_end + ' - ' + driver[i].PP_street_end ;
                   }

                    console.log('PASU  ', pasu_text);
                    bot.sendMessage(driver[i].DDD_id_user, pasu_text ,{
                                     reply_markup: {
                                       inline_keyboard: [
                                         [{
                                          text: 'Отправить предложение пассажиру',
                                          callback_data:  'confirm_pass '+ driver[i].PP_id_user + ' ' + driver[i].DDD_id_user
                                         }]
                                       ]
                                     }

                    })
                   }
            }
       setTimeout(tabu_pass_onpar2, 5000, 'funky');
            function tabu_pass_onpar2 (msg){
                              for(var i = 30; i < 60; i++){

                               if (driver[i].PP_interception === null && driver[i].PP_interception_end === null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с ост. "' + driver[i].PP_busstop + '"  по улице ' + driver[i].PP_street + ' и едет до ост. "' + driver[i].PP_busstop_end + '" по улице ' + driver[i].PP_street_end ;
                               }
                               else if (driver[i].PP_interception === null && driver[i].PP_interception_end !== null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с ост. "' + driver[i].PP_busstop + '"  по улице ' + driver[i].PP_street + ' едет до пер. ' + driver[i].PP_interception_end + ' - ' + driver[i].PP_street_end ;
                               }
                               else if (driver[i].PP_interception !== null && driver[i].PP_interception_end === null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с пер. ' + driver[i].PP_interception + ' - ' + driver[i].PP_street + ' едет до ост. "' + driver[i].PP_busstop_end + '" по улице ' + driver[i].PP_street_end ;
                               }
                               else if (driver[i].PP_interception !== null && driver[i].PP_interception_end !== null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с пер. ' + driver[i].PP_interception + ' - ' + driver[i].PP_street + ' и едет до пер. ' + driver[i].PP_interception_end + ' - ' + driver[i].PP_street_end ;
                               }

                                console.log('PASU  ', pasu_text);
                                bot.sendMessage(driver[i].DDD_id_user, pasu_text ,{
                                                 reply_markup: {
                                                   inline_keyboard: [
                                                     [{
                                                      text: 'Отправить предложение пассажиру',
                                                      callback_data:  'confirm_pass '+ driver[i].PP_id_user + ' ' + driver[i].DDD_id_user
                                                     }]
                                                   ]
                                                 }

                                })
                               }
                        }
       setTimeout(tabu_pass_onpar3, 10000, 'funky');
            function tabu_pass_onpar3 (msg){
                              for(var i = 60; i < 90; i++){

                               if (driver[i].PP_interception === null && driver[i].PP_interception_end === null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с ост. "' + driver[i].PP_busstop + '"  по улице ' + driver[i].PP_street + ' и едет до ост. "' + driver[i].PP_busstop_end + '" по улице ' + driver[i].PP_street_end ;
                               }
                               else if (driver[i].PP_interception === null && driver[i].PP_interception_end !== null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с ост. "' + driver[i].PP_busstop + '"  по улице ' + driver[i].PP_street + ' едет до пер. ' + driver[i].PP_interception_end + ' - ' + driver[i].PP_street_end ;
                               }
                               else if (driver[i].PP_interception !== null && driver[i].PP_interception_end === null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с пер. ' + driver[i].PP_interception + ' - ' + driver[i].PP_street + ' едет до ост. "' + driver[i].PP_busstop_end + '" по улице ' + driver[i].PP_street_end ;
                               }
                               else if (driver[i].PP_interception !== null && driver[i].PP_interception_end !== null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с пер. ' + driver[i].PP_interception + ' - ' + driver[i].PP_street + ' и едет до пер. ' + driver[i].PP_interception_end + ' - ' + driver[i].PP_street_end ;
                               }

                                console.log('PASU  ', pasu_text);
                                bot.sendMessage(driver[i].DDD_id_user, pasu_text ,{
                                                 reply_markup: {
                                                   inline_keyboard: [
                                                     [{
                                                      text: 'Отправить предложение пассажиру',
                                                      callback_data:  'confirm_pass '+ driver[i].PP_id_user + ' ' + driver[i].DDD_id_user
                                                     }]
                                                   ]
                                                 }

                                })
                               }
                        }
       setTimeout(tabu_pass_onpar4, 15000, 'funky');
            function tabu_pass_onpar4 (msg){
                              for(var i = 90; i < 120; i++){

                               if (driver[i].PP_interception === null && driver[i].PP_interception_end === null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с ост. "' + driver[i].PP_busstop + '"  по улице ' + driver[i].PP_street + ' и едет до ост. "' + driver[i].PP_busstop_end + '" по улице ' + driver[i].PP_street_end ;
                               }
                               else if (driver[i].PP_interception === null && driver[i].PP_interception_end !== null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с ост. "' + driver[i].PP_busstop + '"  по улице ' + driver[i].PP_street + ' едет до пер. ' + driver[i].PP_interception_end + ' - ' + driver[i].PP_street_end ;
                               }
                               else if (driver[i].PP_interception !== null && driver[i].PP_interception_end === null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с пер. ' + driver[i].PP_interception + ' - ' + driver[i].PP_street + ' едет до ост. "' + driver[i].PP_busstop_end + '" по улице ' + driver[i].PP_street_end ;
                               }
                               else if (driver[i].PP_interception !== null && driver[i].PP_interception_end !== null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с пер. ' + driver[i].PP_interception + ' - ' + driver[i].PP_street + ' и едет до пер. ' + driver[i].PP_interception_end + ' - ' + driver[i].PP_street_end ;
                               }

                                console.log('PASU  ', pasu_text);
                                bot.sendMessage(driver[i].DDD_id_user, pasu_text ,{
                                                 reply_markup: {
                                                   inline_keyboard: [
                                                     [{
                                                      text: 'Отправить предложение пассажиру',
                                                      callback_data:  'confirm_pass '+ driver[i].PP_id_user + ' ' + driver[i].DDD_id_user
                                                     }]
                                                   ]
                                                 }

                                })
                               }
                        }
       setTimeout(tabu_pass_onpar5, 20000, 'funky');
            function tabu_pass_onpar5 (msg){
                              for(var i = 120; i < driver.length; i++){

                               if (driver[i].PP_interception === null && driver[i].PP_interception_end === null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с ост. "' + driver[i].PP_busstop + '"  по улице ' + driver[i].PP_street + ' и едет до ост. "' + driver[i].PP_busstop_end + '" по улице ' + driver[i].PP_street_end ;
                               }
                               else if (driver[i].PP_interception === null && driver[i].PP_interception_end !== null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с ост. "' + driver[i].PP_busstop + '"  по улице ' + driver[i].PP_street + ' едет до пер. ' + driver[i].PP_interception_end + ' - ' + driver[i].PP_street_end ;
                               }
                               else if (driver[i].PP_interception !== null && driver[i].PP_interception_end === null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с пер. ' + driver[i].PP_interception + ' - ' + driver[i].PP_street + ' едет до ост. "' + driver[i].PP_busstop_end + '" по улице ' + driver[i].PP_street_end ;
                               }
                               else if (driver[i].PP_interception !== null && driver[i].PP_interception_end !== null) {
                               var pasu_text = 'Возможно этот пассажир вам попути. Он/она выезжает с пер. ' + driver[i].PP_interception + ' - ' + driver[i].PP_street + ' и едет до пер. ' + driver[i].PP_interception_end + ' - ' + driver[i].PP_street_end ;
                               }

                                console.log('PASU  ', pasu_text);
                                bot.sendMessage(driver[i].DDD_id_user, pasu_text ,{
                                                 reply_markup: {
                                                   inline_keyboard: [
                                                     [{
                                                      text: 'Отправить предложение пассажиру',
                                                      callback_data:  'confirm_pass '+ driver[i].PP_id_user + ' ' + driver[i].DDD_id_user
                                                     }]
                                                   ]
                                                 }

                                })
                               }
                        }
       }
       else if(driver.length > 150) {  bot.sendMessage(  336243307, 'Уже больше 150 активных человек функция Tabu_pass_on_parallel' )  }
   }

// Если нет попутных водителей т.е. driver.length == 0, то таймер ставиться на паузу     status <> "busy"  AND
   else {
       var sql_else = ' SELECT DISTINCT id_user FROM route WHERE  time_end > NOW() ';
       connection.query( sql_else , function(err, rows, fields) {
       if (err) throw err;
       var driver_act = JSON.parse(JSON.stringify(rows));
       console.log('Vivel activnih', driver_act)
          if(driver.length <= 30 && driver.length != 0){
                 console.log('Vivel activnih', driver_act[0].id_user)
                         for(var i = 0; i < driver_act.length; i++){
                         bot.sendMessage(driver_act[i].id_user, 'В данный момент нет пассажиров' )
                         }
          }
          else if(driver.length > 30 && driver.length <= 60){
          setTimeout(send_to_active_drivers1, 500, 'funky');
               function send_to_active_drivers1 (msg){
                         for(var i = 0; i < 30; i++){
                         bot.sendMessage(driver_act[i].id_user, 'В данный момент нет пассажиров' )
                         }
               }
          setTimeout(send_to_active_drivers2, 10000, 'funky');
               function send_to_active_drivers2 (msg){
                         for(var i = 30; i < driver_act.length; i++){
                         bot.sendMessage(driver_act[i].id_user, 'В данный момент нет пассажиров' )
                         }
               }
          }
          else if(driver.length > 60 && driver.length <= 90){
          setTimeout(send_to_active_drivers1, 500, 'funky');
               function send_to_active_drivers1 (msg){
                         for(var i = 0; i < 30; i++){
                         bot.sendMessage(driver_act[i].id_user, 'В данный момент нет пассажиров' )
                         }
               }
          setTimeout(send_to_active_drivers2, 5000, 'funky');
               function send_to_active_drivers2 (msg){
                         for(var i = 30; i < 60; i++){
                         bot.sendMessage(driver_act[i].id_user, 'В данный момент нет пассажиров' )
                         }
               }
          setTimeout(send_to_active_drivers3, 10000, 'funky');
               function send_to_active_drivers3 (msg){
                         for(var i = 60; i < driver_act.length; i++){
                         bot.sendMessage(driver_act[i].id_user, 'В данный момент нет пассажиров' )
                         }
               }
          }
          else if(driver.length > 90 && driver.length <= 120){
          setTimeout(send_to_active_drivers1, 500, 'funky');
               function send_to_active_drivers1 (msg){
                         for(var i = 0; i < 30; i++){
                         bot.sendMessage(driver_act[i].id_user, 'В данный момент нет пассажиров' )
                         }
               }
          setTimeout(send_to_active_drivers2, 5000, 'funky');
               function send_to_active_drivers2 (msg){
                         for(var i = 30; i < 60; i++){
                         bot.sendMessage(driver_act[i].id_user, 'В данный момент нет пассажиров' )
                         }
               }
          setTimeout(send_to_active_drivers3, 10000, 'funky');
               function send_to_active_drivers3 (msg){
                         for(var i = 60; i < 90; i++){
                         bot.sendMessage(driver_act[i].id_user, 'В данный момент нет пассажиров' )
                         }
                               }
          setTimeout(send_to_active_drivers4, 15000, 'funky');
               function send_to_active_drivers4 (msg){
                         for(var i = 90; i < driver_act.length; i++){
                         bot.sendMessage(driver_act[i].id_user, 'В данный момент нет пассажиров' )
                         }
               }
          }
          else if(driver.length > 90 && driver.length <= 120){
                    setTimeout(send_to_active_drivers1, 500, 'funky');
                         function send_to_active_drivers1 (msg){
                                   for(var i = 0; i < 30; i++){
                                   bot.sendMessage(driver_act[i].id_user, 'В данный момент нет пассажиров' )
                                   }
                         }
                    setTimeout(send_to_active_drivers2, 5000, 'funky');
                         function send_to_active_drivers2 (msg){
                                   for(var i = 30; i < 60; i++){
                                   bot.sendMessage(driver_act[i].id_user, 'В данный момент нет пассажиров' )
                                   }
                         }
                    setTimeout(send_to_active_drivers3, 10000, 'funky');
                         function send_to_active_drivers3 (msg){
                                   for(var i = 60; i < 90; i++){
                                   bot.sendMessage(driver_act[i].id_user, 'В данный момент нет пассажиров' )
                                   }
                                         }
                    setTimeout(send_to_active_drivers4, 15000, 'funky');
                         function send_to_active_drivers4 (msg){
                                   for(var i = 90; i < 120; i++){
                                   bot.sendMessage(driver_act[i].id_user, 'В данный момент нет пассажиров' )
                                   }
                         }
                    setTimeout(send_to_active_drivers5, 20000, 'funky');
                         function send_to_active_drivers5 (msg){
                                   for(var i = 120; i < driver_act.length; i++){
                                   bot.sendMessage(driver_act[i].id_user, 'В данный момент нет пассажиров' )
                                   }
                         }
                    }
       })
   }
})
})

}




// В setInterval после функции нельзя ставить ()
bot.onText(/\/insert_paral_inter_ord/, msg => {setInterval(database.insert_paral_inter_ord, 3000)})

bot.onText(/\/insert_paral_inter_idpoint/, msg => {setInterval(database.insert_paral_inter_idpoint, 3000)})


bot.onText(/\/send/, msg => {send(msg)})


function send(msg) {
var mysql  = require('mysql');
        var pool = mysql.createPool({
        host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
        database : 'sitebot'
    })

var zapros = msg.chat.text;
var user_id = msg.chat.id;
var n_route_driver = 'n_route'+user_id;
var route_driver = 'route'+user_id;


pool.getConnection(function(err, connection) {

   connection.query(' SELECT all_districts FROM route WHERE time_end > NOW() AND id_user = ? ', [ user_id ],  function(err, rows, fields) {
   if (err) throw err;
   var active_drivers = JSON.parse(JSON.stringify(rows));
   console.log('Нашли водителей', active_drivers);

             var splited = active_drivers[0].all_districts.split("00");
             if (splited.length == 2){
             var like = 'LIKE "%' + active_drivers[0].all_districts + '%" ) ';
             }
             else if (splited.length == 3) {
             var like = 'LIKE "%' + splited[0] + '00' + splited[1] + '%" ' + 'OR all_districts LIKE "%' + splited[1] + '00' + splited[2] + '%" ' + 'OR all_districts LIKE "%' + splited[0] + '00' + splited[2] + '%" ) ';
             }
             else if (splited.length == 4) {
             var like = 'LIKE "%' + splited[0] + '00' + splited[1] + '%" ' + 'OR all_districts LIKE "%' + splited[1] + '00' + splited[2] + '%" ' + 'OR all_districts LIKE "%' + splited[0] + '00' + splited[2] + '%" '+ 'OR all_districts LIKE "%' + splited[2] + '00' + splited[3] + '%" '  + 'OR all_districts LIKE "%' + splited[0] + '00' + splited[3] + '%" '  + 'OR all_districts LIKE "%' + splited[1] + '00' + splited[3] + '%" ) ';
             }
             else{}
             console.log('лайки', like)
             var select = ' SELECT * FROM route_p WHERE time_end > NOW() AND status <> "busy" AND (all_districts ' + like;
             console.log('SQL select', select)
             connection.query( select, function(err, rows, fields) {
             if (err) throw err;
             var passenger_poputi_district = JSON.parse(JSON.stringify(rows));
             console.log('passenger_poputi_district ', passenger_poputi_district)
             })
             })
             })
}



bot.onText(/\/skolko_reg/, msg => {skolko_reg(msg)})


function skolko_reg(msg) {

var mysql  = require('mysql');
        var pool = mysql.createPool({
        host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
        database : 'sitebot'
    })

var zapros = msg.chat.text;
var user_id = msg.chat.id;


pool.getConnection(function(err, connection) {

       connection.query(' SELECT COUNT (DISTINCT id_user) AS counted FROM users WHERE vibor = "driver" ',  function(err, rows, fields) {
       if (err) throw err;
       var driver = JSON.parse(JSON.stringify(rows));
       console.log('колво водителей', driver);
       var driv_text = '🚕 Сейчас ' + driver[0].counted + ' водителей!!';

               bot.sendMessage(user_id, driv_text)
       })

       connection.query(' SELECT COUNT (DISTINCT id_user) AS passenger FROM users WHERE vibor = "passenger" ',  function(err, rows, fields) {
       if (err) throw err;
       var pass = JSON.parse(JSON.stringify(rows));
       console.log('колво пассажиров', pass);
       var pass_text = '🙎‍♂️ Сейчас ' + pass[0].passenger + ' пассажиров';
               bot.sendMessage(user_id, pass_text)
       })
})
}



bot.onText(/\/skolko_active_porayonam/, msg => {skolko_active_porayonam(msg)})


function skolko_active_porayonam(msg) {

var mysql  = require('mysql');
        var pool = mysql.createPool({
        host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
        database : 'sitebot'
    })

var zapros = msg.chat.text;
var user_id = msg.chat.id;


pool.getConnection(function(err, connection) {

       connection.query(' SELECT all_districts, COUNT(*) AS count FROM route WHERE time_end > NOW() GROUP BY all_districts ',  function(err, rows, fields) {
       if (err) throw err;
       var driver = JSON.parse(JSON.stringify(rows));
       console.log('колво водителей', driver);

            var test = [];
            for(var i = 0; i < rows.length; i++){
            test.push(driver[i].all_districts + '  ' + driver[i].count);
            }

            var all = test.join('\n');
           console.log('ALL', all);
           var all1 = 'Водители по районам\n' + all;
           bot.sendMessage(user_id, all1)
       })

       connection.query(' SELECT all_districts, COUNT(*) AS count FROM route_p WHERE time_end > NOW() GROUP BY all_districts ',  function(err, rows, fields) {
       if (err) throw err;
       var pass = JSON.parse(JSON.stringify(rows));
       console.log('колво водителей', pass);

            var test = [];
            for(var i = 0; i < rows.length; i++){
            test.push(pass[i].all_districts + '  ' + pass[i].count);
            }

            var all = test.join('\n');

           console.log('ALL', all);
           var all1 = 'Пассажиры по районам\n' + all;

           bot.sendMessage(user_id, all1)
       })
})
}



bot.onText(/\/active_inter (.+)/, (msg, [source, match]) => {

const { id } = msg.chat

var mysql  = require('mysql');
        var pool = mysql.createPool({
        host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
        database : 'sitebot'
    })

var user_id = msg.chat.id;


pool.getConnection(function(err, connection) {

       connection.query(' SELECT COUNT(id_point) AS count, id_point, street, interception, time_end FROM route WHERE all_districts = ? AND time_end > CURDATE()-1 GROUP BY id_point ORDER BY count DESC LIMIT 10 ',
       [match],
       function(err, rows, fields) {
       if (err) throw err;
       var driver = JSON.parse(JSON.stringify(rows));
       console.log('колво водителей', driver);

            var test = [];
            for(var i = 0; i < rows.length; i++){
            test.push(driver[i].count + '  ' + driver[i].street + '  ' + driver[i].interception);
            }

            var all = test.join('\n');
           console.log('ALL', all);
           var all1 = '❌ 10 самых проезжаемых перекрестков\n' + all;
           bot.sendMessage(user_id, all1)
       })
})
})


bot.onText(/\/sms (.+)/, (msg, [source, match]) => {


var mysql  = require('mysql');
        var pool = mysql.createPool({
        host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
        database : 'sitebot'
    })

var user_id = msg.chat.id;

var msg_text = msg.text;

var text = msg_text.replace("/sms", "");

pool.getConnection(function(err, connection) {

       connection.query(' SELECT * FROM users WHERE vibor = "driver"  ',

       function(err, rows, fields) {
       if (err) throw err;
       var driver = JSON.parse(JSON.stringify(rows));
       console.log('колво водителей', driver);



        if (driver.length <= 30){
            setTimeout(sms_30, 500, 'funky');
                function sms_30 (msg){
                      for(var i = 0; i < driver.length; i++){
                      bot.sendMessage(driver[i].id_user, text)
                      }
                }
        }
        else if(driver.length > 30 && driver.length <= 60){
           setTimeout(sms_30, 500, 'funky');
                function sms_30 (msg){
                      for(var i = 0; i < 30; i++){
                      bot.sendMessage(driver[i].id_user, text)
                      }
                }
           setTimeout(sms_30_60, 10000, 'funky');
                function sms_30_60 (msg){
                      for(var i = 30; i < driver.length; i++){
                      bot.sendMessage(driver[i].id_user, text)
                      }
                }
        }
        else if(driver.length > 60 && driver.length <= 90){
           setTimeout(sms_30, 500, 'funky');
                function sms_30 (msg){
                      for(var i = 0; i < 30; i++){
                      bot.sendMessage(driver[i].id_user, text)
                      }
                }
           setTimeout(sms_30_60, 10000, 'funky');
                function sms_30_60 (msg){
                      for(var i = 30; i < 60; i++){
                      bot.sendMessage(driver[i].id_user, text)
                      }
                }
           setTimeout(sms_60_90, 20000, 'funky');
                function sms_60_90 (msg){
                      for(var i = 60; i < driver.length; i++){
                      bot.sendMessage(driver[i].id_user, text)
                      }
                }
        }
        else if(driver.length > 90 && driver.length <= 120){
           setTimeout(sms_30, 500, 'funky');
                function sms_30 (msg){
                      for(var i = 0; i < 30; i++){
                      bot.sendMessage(driver[i].id_user, text)
                      }
                }
           setTimeout(sms_30_60, 10000, 'funky');
                function sms_30_60 (msg){
                      for(var i = 30; i < 60; i++){
                      bot.sendMessage(driver[i].id_user, text)
                      }
                }
           setTimeout(sms_60_90, 20000, 'funky');
                function sms_60_90 (msg){
                      for(var i = 60; i < 90; i++){
                      bot.sendMessage(driver[i].id_user, text)
                      }
                }
           setTimeout(sms_90_120, 30000, 'funky');
                function sms_90_120 (msg){
                      for(var i = 90; i < driver.length; i++){
                      bot.sendMessage(driver[i].id_user, text)
                      }
                }
        }

       })
})
})


bot.onText(/\/sms_pass (.+)/, (msg, [source, match]) => {

var mysql  = require('mysql');
        var pool = mysql.createPool({
        host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
        database : 'sitebot'
    })

var user_id = msg.chat.id;

var msg_text = msg.text;

var text = msg_text.replace("/sms_pass", "");

pool.getConnection(function(err, connection) {

       connection.query(' SELECT * FROM users WHERE vibor = "passenger"  ',

       function(err, rows, fields) {
       if (err) throw err;
       var driver = JSON.parse(JSON.stringify(rows));
       console.log('колво пассажиров', driver);

        if (driver.length <= 30){
            setTimeout(p_sms_30, 500, 'funky');
                function p_sms_30 (msg){
                      for(var i = 0; i < driver.length; i++){
                      bot.sendMessage(driver[i].id_user, text)
                      }
                }
        }
        else if(driver.length > 30 && driver.length <= 60){
           setTimeout(p_sms_30, 500, 'funky');
                function p_sms_30 (msg){
                      for(var i = 0; i < 30; i++){
                      bot.sendMessage(driver[i].id_user, text)
                      }
                }
           setTimeout(p_sms_30_60, 10000, 'funky');
                function p_sms_30_60 (msg){
                      for(var i = 30; i < driver.length; i++){
                      bot.sendMessage(driver[i].id_user, text)
                      }
                }
        }
        else if(driver.length > 60 && driver.length <= 90){
           setTimeout(p_sms_30, 500, 'funky');
                function p_sms_30 (msg){
                      for(var i = 0; i < 30; i++){
                      bot.sendMessage(driver[i].id_user, text)
                      }
                }
           setTimeout(p_sms_30_60, 10000, 'funky');
                function p_sms_30_60 (msg){
                      for(var i = 30; i < 60; i++){
                      bot.sendMessage(driver[i].id_user, text)
                      }
                }
           setTimeout(p_sms_60_90, 20000, 'funky');
                function p_sms_60_90 (msg){
                      for(var i = 60; i < driver.length; i++){
                      bot.sendMessage(driver[i].id_user, text)
                      }
                }
        }
        else if(driver.length > 90 && driver.length <= 120){
           setTimeout(p_sms_30, 500, 'funky');
                function p_sms_30 (msg){
                      for(var i = 0; i < 30; i++){
                      bot.sendMessage(driver[i].id_user, text)
                      }
                }
           setTimeout(p_sms_30_60, 10000, 'funky');
                function p_sms_30_60 (msg){
                      for(var i = 30; i < 60; i++){
                      bot.sendMessage(driver[i].id_user, text)
                      }
                }
           setTimeout(p_sms_60_90, 20000, 'funky');
                function p_sms_60_90 (msg){
                      for(var i = 60; i < 90; i++){
                      bot.sendMessage(driver[i].id_user, text)
                      }
                }
           setTimeout(p_sms_90_120, 30000, 'funky');
                function p_sms_90_120 (msg){
                      for(var i = 90; i < driver.length; i++){
                      bot.sendMessage(driver[i].id_user, text)
                      }
                }
        }

       })
})
})



function notify_admin_driv_start (query) {

    var mysql  = require('mysql');
    var pool  = mysql.createPool({
    host     : 'localhost',
    user     : 'mybd_user',
    password : 'admin123',
    database : 'route_driver'
    })

var user_id = query.message.chat.id;
var route_driver = 'route'+user_id;
var n_route_driver = 'n_route'+user_id;

pool.getConnection(function(err, connection) {

        var route_sql = ' SELECT DISTINCT n_zapros, street FROM ?? WHERE  id_route = (SELECT id_route FROM ??  ORDER BY id_route DESC LIMIT 1) ';
// n_zapros > 1  AND
        connection.query( route_sql , [ route_driver, route_driver ], function(err, rows, fields) {
        if (err) throw err;
        var route = JSON.parse(JSON.stringify(rows));
             if (route.length !== 0 && route.length !== 1) {
                 console.log('route-sql ',route);
                 console.log('route-sql street ',route[0].street);

                 if (route.length%2 == 0){

                 var text = '📌 Вы едите по ' + route[0].street + ' до ' + route[2].street;

                 for(var i = 1; i < route.length/2; i++){
                 text += '\nпо ' + route[2*i].street + ' до ' + route[2*i+1].street
                 }

                 text += '\nпо ' + route[route.length-1].street + ' до ...'
                 console.log('route-sql-текст ',text);
                 }
                 else{

                 var text = '📌 Вы едите по ' + route[0].street + ' до ' + route[2].street;

                 for(var i = 1; i < (route.length-1)/2; i++){
                 text += '\nпо ' + route[2*i+1].street + ' до ' + route[2*i+2].street
                 }

                 text += '\nпо ' + route[route.length-1].street + ' до ...'
                 console.log('route-sql-текст ',text);

                 }
             }
             else if (route.length == 1) {
                 console.log('route-sql ',route);
                 console.log('route-sql street ',route[0].street);

                 var text = '📌 Вы едите по ' + route[0].street + ' до ...';
             }

            bot.sendMessage(336243307, text)


      })
})

}



bot.onText(/\/vv (.+)/, (msg, [source, match]) => {


var mysql  = require('mysql');
        var pool = mysql.createPool({
        host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
        database : 'sitebot'
    })

var user_id = msg.chat.id;

console.log('match', match);

console.log('!!message text', msg.text);

var msg_text = msg.text;

var text = msg_text.replace("/vv", "");

console.log('!!text', text);

bot.sendMessage(336243307, text)

//pool.getConnection(function(err, connection) {
//
//       connection.query(' SELECT * FROM users WHERE vibor = "passenger"  ',
//
//       function(err, rows, fields) {
//       if (err) throw err;
//       var driver = JSON.parse(JSON.stringify(rows));
//       console.log('колво пассажиров', driver);
//       })
//})

})


bot.onText(/\/sms_driv_video/, msg => {sms_driv_video(msg)})


function sms_driv_video (msg) {

var mysql  = require('mysql');
        var pool = mysql.createPool({
        host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
        database : 'sitebot'
    })

var user_id = msg.chat.id;

pool.getConnection(function(err, connection) {

       connection.query(' SELECT * FROM users WHERE vibor = "driver"  ',

       function(err, rows, fields) {
       if (err) throw err;
       var driver = JSON.parse(JSON.stringify(rows));
       console.log('колво водителей', driver);



        if (driver.length <= 30){
            setTimeout(sms_30, 500, 'funky');
                function sms_30 (msg){
                      for(var i = 0; i < driver.length; i++){
                          bot.sendVideo(driver[i].id_user, fs.readFileSync(__dirname + '/video-driver.mp4'), {
                          caption: 'Инструкция для водителей'
                          })
                      }
                }
        }
        else if(driver.length > 30 && driver.length <= 60){
           setTimeout(sms_30, 500, 'funky');
                function sms_30 (msg){
                      for(var i = 0; i < 30; i++){
                          bot.sendVideo(driver[i].id_user, fs.readFileSync(__dirname + '/video-driver.mp4'), {
                          caption: 'Инструкция для водителей'
                          })
                      }
                }
           setTimeout(sms_30_60, 10000, 'funky');
                function sms_30_60 (msg){
                      for(var i = 30; i < driver.length; i++){
                          bot.sendVideo(driver[i].id_user, fs.readFileSync(__dirname + '/video-driver.mp4'), {
                          caption: 'Инструкция для водителей'
                          })
                      }
                }
        }
        else if(driver.length > 60 && driver.length <= 90){
           setTimeout(sms_30, 500, 'funky');
                function sms_30 (msg){
                      for(var i = 0; i < 30; i++){
                          bot.sendVideo(driver[i].id_user, fs.readFileSync(__dirname + '/video-driver.mp4'), {
                          caption: 'Инструкция для водителей'
                          })
                      }
                }
           setTimeout(sms_30_60, 10000, 'funky');
                function sms_30_60 (msg){
                      for(var i = 30; i < 60; i++){
                          bot.sendVideo(driver[i].id_user, fs.readFileSync(__dirname + '/video-driver.mp4'), {
                          caption: 'Инструкция для водителей'
                          })
                      }
                }
           setTimeout(sms_60_90, 20000, 'funky');
                function sms_60_90 (msg){
                      for(var i = 60; i < driver.length; i++){
                          bot.sendVideo(driver[i].id_user, fs.readFileSync(__dirname + '/video-driver.mp4'), {
                          caption: 'Инструкция для водителей'
                          })
                      }
                }
        }
        else if(driver.length > 90 && driver.length <= 120){
           setTimeout(sms_30, 500, 'funky');
                function sms_30 (msg){
                      for(var i = 0; i < 30; i++){
                          bot.sendVideo(driver[i].id_user, fs.readFileSync(__dirname + '/video-driver.mp4'), {
                          caption: 'Инструкция для водителей'
                          })
                      }
                }
           setTimeout(sms_30_60, 10000, 'funky');
                function sms_30_60 (msg){
                      for(var i = 30; i < 60; i++){
                          bot.sendVideo(driver[i].id_user, fs.readFileSync(__dirname + '/video-driver.mp4'), {
                          caption: 'Инструкция для водителей'
                          })
                      }
                }
           setTimeout(sms_60_90, 20000, 'funky');
                function sms_60_90 (msg){
                      for(var i = 60; i < 90; i++){
                          bot.sendVideo(driver[i].id_user, fs.readFileSync(__dirname + '/video-driver.mp4'), {
                          caption: 'Инструкция для водителей'
                          })
                      }
                }
           setTimeout(sms_90_120, 30000, 'funky');
                function sms_90_120 (msg){
                      for(var i = 90; i < driver.length; i++){
                          bot.sendVideo(driver[i].id_user, fs.readFileSync(__dirname + '/video-driver.mp4'), {
                          caption: 'Инструкция для водителей'
                          })
                      }
                }
        }

       })
})
}



bot.onText(/\/sms_pass_video/, msg => {sms_pass_video(msg)})


function sms_pass_video (msg) {

var mysql  = require('mysql');
        var pool = mysql.createPool({
        host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
        database : 'sitebot'
    })

var user_id = msg.chat.id;

pool.getConnection(function(err, connection) {

       connection.query(' SELECT * FROM users WHERE vibor = "passenger"  ',

       function(err, rows, fields) {
       if (err) throw err;
       var driver = JSON.parse(JSON.stringify(rows));
       console.log('колво водителей', driver);



        if (driver.length <= 30){
            setTimeout(sms_30, 500, 'funky');
                function sms_30 (msg){
                      for(var i = 0; i < driver.length; i++){
                          bot.sendVideo(driver[i].id_user, fs.readFileSync(__dirname + '/video-passenger.mp4'), {
                          caption: 'Инструкция для пассажиров'
                          })
                      }
                }
        }
        else if(driver.length > 30 && driver.length <= 60){
           setTimeout(sms_30, 500, 'funky');
                function sms_30 (msg){
                      for(var i = 0; i < 30; i++){
                          bot.sendVideo(driver[i].id_user, fs.readFileSync(__dirname + '/video-passenger.mp4'), {
                          caption: 'Инструкция для пассажиров'
                          })
                      }
                }
           setTimeout(sms_30_60, 10000, 'funky');
                function sms_30_60 (msg){
                      for(var i = 30; i < driver.length; i++){
                          bot.sendVideo(driver[i].id_user, fs.readFileSync(__dirname + '/video-passenger.mp4'), {
                          caption: 'Инструкция для пассажиров'
                          })
                      }
                }
        }
        else if(driver.length > 60 && driver.length <= 90){
           setTimeout(sms_30, 500, 'funky');
                function sms_30 (msg){
                      for(var i = 0; i < 30; i++){
                          bot.sendVideo(driver[i].id_user, fs.readFileSync(__dirname + '/video-passenger.mp4'), {
                          caption: 'Инструкция для пассажиров'
                          })
                      }
                }
           setTimeout(sms_30_60, 10000, 'funky');
                function sms_30_60 (msg){
                      for(var i = 30; i < 60; i++){
                          bot.sendVideo(driver[i].id_user, fs.readFileSync(__dirname + '/video-passenger.mp4'), {
                          caption: 'Инструкция для пассажиров'
                          })
                      }
                }
           setTimeout(sms_60_90, 20000, 'funky');
                function sms_60_90 (msg){
                      for(var i = 60; i < driver.length; i++){
                          caption: 'Инструкция для пассажиров'
                          bot.sendVideo(driver[i].id_user, fs.readFileSync(__dirname + '/video-passenger.mp4'), {
                          })
                      }
                }
        }
        else if(driver.length > 90 && driver.length <= 120){
           setTimeout(sms_30, 500, 'funky');
                function sms_30 (msg){
                      for(var i = 0; i < 30; i++){
                          bot.sendVideo(driver[i].id_user, fs.readFileSync(__dirname + '/video-passenger.mp4'), {
                          caption: 'Инструкция для пассажиров'
                          })
                      }
                }
           setTimeout(sms_30_60, 10000, 'funky');
                function sms_30_60 (msg){
                      for(var i = 30; i < 60; i++){
                          bot.sendVideo(driver[i].id_user, fs.readFileSync(__dirname + '/video-passenger.mp4'), {
                          caption: 'Инструкция для пассажиров'
                          })
                      }
                }
           setTimeout(sms_60_90, 20000, 'funky');
                function sms_60_90 (msg){
                      for(var i = 60; i < 90; i++){
                          bot.sendVideo(driver[i].id_user, fs.readFileSync(__dirname + '/video-passenger.mp4'), {
                          caption: 'Инструкция для пассажиров'
                          })
                      }
                }
           setTimeout(sms_90_120, 30000, 'funky');
                function sms_90_120 (msg){
                      for(var i = 90; i < driver.length; i++){
                          bot.sendVideo(driver[i].id_user, fs.readFileSync(__dirname + '/video-passenger.mp4'), {
                          caption: 'Инструкция для пассажиров'
                          })
                      }
                }
        }

       })
})
}


bot.onText(/\/aaa/, msg => {aaa(msg)})

function aaa (msg){

var mysql  = require('mysql');
        var pool = mysql.createPool({
        host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
        database : 'sitebot'
    })

var zapros = msg.chat.text;
var user_id = msg.chat.id;
var point_type = 1;
var n_route_passenger = 'n_route_p'+user_id;
var route_passenger = 'route_p'+user_id;

//// Так как у пассажира и водителя, у которых совпался маршрут по нескольким столбцам, могут быть выбраны несколько строк, в конце выбираются уникальные столбцы из таблицы table3
//var sql = ' SELECT DISTINCT PP_id_user, PP_begend, PP_id_route, PP_street, PP_interception, PP_busstop, ' +
//               ' (SELECT street FROM route_p WHERE begend = "end" AND id_route = PP_id_route AND id_user = PP_id_user ) AS PP_street_end, ' +
//               ' (SELECT interception FROM route_p WHERE begend = "end" AND id_route = PP_id_route AND id_user = PP_id_user ) AS PP_interception_end, ' +
//               ' (SELECT busstop FROM route_p WHERE begend = "end" AND id_route = PP_id_route AND id_user = PP_id_user ) AS PP_busstop_end, ' +
//               '  DD_id_user  AS DDD_id_user, DD_id_route  AS DDD_id_route, ' +
//// Выбирает начальные данные street и interception водителя по "begend"-у выбирая "beg". Откуда этот водитель выезжает.
//               ' ( SELECT street FROM route WHERE begend = "beg" AND id_user = DDD_id_user AND id_route = DDD_id_route ) AS street, ' +
//               ' ( SELECT interception FROM route WHERE begend = "beg" AND id_user = DDD_id_user AND id_route = DDD_id_route ) AS interception, DD_time_beg ' +
//               ' FROM (SELECT PP_id_user, PP_id_route, PP_id_point, PP_street, PP_interception, PP_busstop, PP_begend, PP_time_beg, PP_time_end, PP_near1, PP_near2, DD_id_user,  DD_id_route, DD_street, DD_interception, DD_id_point, DD_time_beg, DD_time_end ' +
//// Вытаскивает время из БД в формате TIME (без даты, только время)
//               ' FROM (SELECT  route_p1.P_id_user AS PP_id_user,  route_p1.P_id_route AS PP_id_route,  route_p1.P_id_point AS PP_id_point, route_p1.P_street AS PP_street, route_p1.P_interception AS PP_interception, route_p1.P_busstop AS PP_busstop, route_p1.P_begend AS PP_begend, route_p1.P_time_beg AS PP_time_beg, route_p1.P_time_end AS PP_time_end, route_p1.near1 AS PP_near1, route_p1.near2 AS PP_near2, route.id_user AS DD_id_user,  route.id_route AS DD_id_route,  route.street AS DD_street,  route.interception AS DD_interception,  route.id_point AS DD_id_point,  TIME(route.time_beg) AS  DD_time_beg,  route.time_end AS  DD_time_end  ' +
//// Формирует новую таблицу route_p1, где создает два отдельных столбца near1 и near2 из одного столбца nearby_interception таблицы route_p
//                     ' FROM (SELECT id_user AS P_id_user, begend AS P_begend, id_route AS P_id_route, id_point AS P_id_point, street AS P_street, interception AS P_interception, busstop AS P_busstop, time_beg AS P_time_beg, time_end AS P_time_end, SUBSTRING (nearby_interception, 1,15) AS near1, SUBSTRING (nearby_interception, 19,15) AS near2 FROM route_p  WHERE time_end > NOW() AND status <> "busy" AND id_user = ? AND id_route = (SELECT id_route FROM route_p WHERE id_user = ? ORDER BY id DESC LIMIT 1) ) AS route_p1 ' +
//// Выбирает строки у которых совпадают id_point-ы, id_point с nearby_interception, с point_parinter_min5, с point_parinter_plu5 и формирует новую таблицу table1. И затем из строк таблицы table1 выбирает строки у которых столбец begend = "beg"
//                         ' JOIN route  WHERE  (route_p1.P_id_point = route.id_point  OR  route_p1.near1 = route.id_point OR  route_p1.near2 = route.id_point)  AND route.time_end > NOW()  ORDER BY PP_id_user, PP_id_route) AS table1 WHERE PP_begend = "beg" ' +
//// Возвращает TRUE если запрос, указанный ниже подтверждается
//                             ' AND  EXISTS  (SELECT * FROM  (SELECT  route_p1.P_id_user AS PP_id_user,  route_p1.P_id_route AS PP_id_route,  route_p1.P_id_point AS PP_id_point, route_p1.P_begend AS PP_begend, route_p1.P_time_end AS PP_time_end, route_p1.near1 AS PP_near1, route_p1.near2 AS PP_near2, route.id_user AS DD_id_user,  route.id_route AS DD_id_route,  route.id_point AS DD_id_point,  route.time_end AS DD_time_end   FROM (SELECT id_user AS P_id_user, id_route AS P_id_route, id_point AS P_id_point, begend AS P_begend, time_end AS P_time_end, SUBSTRING (nearby_interception, 1,15) AS near1, SUBSTRING (nearby_interception, 19,15) AS near2 FROM route_p WHERE time_end > NOW() AND status <> "busy" AND id_user = ? AND id_route = (SELECT id_route FROM route_p WHERE id_user = ? ORDER BY id DESC LIMIT 1) ) AS route_p1 JOIN route ' +
//// Выбирает строки у которых совпадают id_point-ы, id_point с nearby_interception, с point_parinter_min5, с point_parinter_plu5 и формирует новую таблицу table2. И затем из строк таблицы table2 выбирает строки у которых столбец begend = "end" и id_user строки из таблицы table1 равен id_user-у строки таблицы table2  и все это сохраняет как таблицу table3
//                                   ' WHERE  (route_p1.P_id_point = route.id_point  OR  route_p1.near1 = route.id_point OR  route_p1.near2 = route.id_point)  AND route.time_end > NOW()  ORDER BY PP_id_user, PP_id_route)  AS table2 WHERE PP_begend = "end" AND table1.PP_id_user = table2.PP_id_user AND table1.DD_id_user = table2.DD_id_user) ) AS table3 ';


var sql = ' SELECT * FROM (SELECT P_interception, P_street, P_busstop, P_n_pass, P_id_user, P_id_route, District, P_begend, D_id_route, D_id_user, D_begend FROM ' +
          ' ( SELECT route_p.interception AS P_interception, route_p.street AS P_street, route_p.busstop AS P_busstop, route_p.n_pass AS P_n_pass, route_p.id_user AS P_id_user, route_p.id_route AS P_id_route, route.district AS District, route_p.begend AS P_begend, route.id_route AS D_id_route, route.id_user AS D_id_user, route.begend AS D_begend FROM route_p JOIN route ' +
          ' WHERE route_p.district = route.district  AND ( route.begend = "beg" OR route.begend IS NULL ) AND route_p.begend = "beg" AND route.time_end > NOW() AND route_p.time_end > NOW() ) AS table1 ' +
          ' WHERE EXISTS  ( SELECT * FROM ' +
          ' ( SELECT route_p.interception AS P_interception, route_p.street AS P_street, route_p.busstop AS P_busstop, route_p.n_pass AS P_n_pass, route_p.id_user AS P_id_user, route_p.id_route AS P_id_route, route.district AS District, route_p.begend AS P_begend, route.id_route AS D_id_route, route.id_user AS D_id_user, route.begend AS D_begend FROM route_p JOIN route ' +
          ' WHERE route_p.district = route.district  AND ( route.begend = "end" OR route.begend IS NULL ) AND route_p.begend = "end" AND route.time_end > NOW() AND route_p.time_end > NOW() ) AS table2 ' +
          ' WHERE table1.P_id_user = table2.P_id_user AND table1.D_id_route = table2.D_id_route )) AS table3  ' ;

pool.getConnection(function(err, connection) {

   connection.query(sql,  function(err, rows, fields) {
   if (err) throw err;
   var passenger = JSON.parse(JSON.stringify(rows));
   console.log('like ', passenger);
   })

})
}



function notify_driv_about_pass (query){

var mysql  = require('mysql');
        var pool = mysql.createPool({
        host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
        database : 'sitebot'
    })

var user_id = query.message.chat.id;
var n_route_passenger = 'n_route_p'+user_id;
var route_passenger = 'route_p'+user_id;

pool.getConnection(function(err, connection) {

   connection.query( 'SELECT * FROM stop_notification WHERE vibor = "driver" ' ,  function(err, rows, fields) {
   if (err) throw err;
   var exception = JSON.parse(JSON.stringify(rows));

   var test = [];
   for(var i = 0; i < rows.length; i++){
   test.push(exception[i].id_user);
   }
   console.log('тест ', test);

          connection.query( ' SELECT * FROM route_p WHERE id_user = ? AND id_route = (SELECT id_route FROM route_p WHERE id_user = ? ORDER BY id DESC LIMIT 1)' , [ user_id, user_id ],  function(err, rows, fields) {
          if (err) throw err;
          var pass = JSON.parse(JSON.stringify(rows));
          var all_districts = pass[0].all_districts;
          var splited = all_districts.split("00");
          var first = splited.shift();
          var last = splited.pop();

            console.log(first, ' !! ', last );

            if (first == 'mkdk'){ var district = 'Майкудук';}
            else if (first == 'grd'){ var district = 'Центр';}
            else if (first == 'saran'){ var district = 'Сарань';}
            else if (first == 'aktas'){ var district = 'Актас';}
            else if (first == 'dubovka'){ var district = 'Дубовка';}
            else if (first == 'fedorovka'){ var district = 'Федоровка';}
            else if (first == 'bazar'){ var district = 'Район базара';}
            else if (first == 'yug'){ var district = 'Юго-восток';}
            else if (first == 'srt'){ var district = 'Сортировка';}
            else if (first == 'doskey'){ var district = 'Доскей';}
            else if (first == 'trud'){ var district = 'пос. Трудовое';}
            else if (first == 'uwtobe'){ var district = 'Уштобе';}
            else if (first == 'prihon'){ var district = 'Пришахтинск';}
            else if (first == 'zhbi'){ var district = 'район ЖБИ';}
            else if (first == 'novouzenka'){ var district = 'Новоузенка';}
            else if (first == 'malsaran'){ var district = 'Малая сарань';}

            if (last == 'mkdk'){ var district2 = 'Майкудук';}
            else if (last == 'grd'){ var district2 = 'Центр';}
            else if (last == 'saran'){ var district2 = 'Сарань';}
            else if (last == 'aktas'){ var district2 = 'Актас';}
            else if (last == 'dubovka'){ var district2 = 'Дубовка';}
            else if (last == 'fedorovka'){ var district2 = 'Федоровка';}
            else if (last == 'bazar'){ var district2 = 'Район базара';}
            else if (last == 'yug'){ var district2 = 'Юго-восток';}
            else if (last == 'srt'){ var district2 = 'Сортировка';}
            else if (last == 'doskey'){ var district2 = 'Доскей';}
            else if (last == 'trud'){ var district2 = 'пос. Трудовое';}
            else if (last == 'uwtobe'){ var district2 = 'Уштобе';}
            else if (last == 'prihon'){ var district2 = 'Пришахтинск';}
            else if (last == 'zhbi'){ var district2 = 'район ЖБИ';}
            else if (last == 'novouzenka'){ var district2 = 'Новоузенка';}
            else if (last == 'malsaran'){ var district2 = 'Малая сарань';}

           if (pass[0].interception === null && pass[1].interception === null) {
           var text = 'Возможно этот пассажир вам попути.' +
                      '\n➡️ ' + district + ' >>> ' + district2 +
                      '\nОн/она выезжает с ост. "' + pass[0].busstop + '"  по улице ' + pass[0].street + ' и едет до ост. "' + pass[1].busstop + '" по улице ' + pass[1].street +
                      '\n⏺ Если хотите забрать пассажира, укажите ваше направление, нажав на "Найти попутчиков"' +
                      '\n⬇️ Если хотите остановить уведомления от пассажиров по всему городу, нажмите на "Не отправляйте мне такие уведомления"';
           }
           else if (pass[0].interception === null && pass[1].interception !== null) {
           var text = 'Возможно этот пассажир вам попути.' +
                      '\n➡️ ' + district + ' >>> ' + district2 +
                      '\nОн/она выезжает с ост. "' + pass[0].busstop + '"  по улице ' + pass[0].street + ' едет до пер. ' + pass[1].interception + ' - ' + pass[1].street +
                      '\n⏺ Если хотите забрать пассажира, укажите ваше направление, нажав на "Найти попутчиков"' +
                      '\n⬇️ Если хотите остановить уведомления от пассажиров по всему городу, нажмите на "Не отправляйте мне такие уведомления"';
           }
           else if (pass[0].interception !== null && pass[1].interception === null) {
           var text = 'Возможно этот пассажир вам попути.' +
                      '\n➡️ ' + district + ' >>> ' + district2 +
                      '\n Он/она выезжает с пер. ' + pass[0].interception + ' - ' + pass[0].street + ' едет до ост. "' + pass[1].busstop + '" по улице ' + pass[1].street +
                      '\n⏺ Если хотите забрать пассажира, укажите ваше направление, нажав на "Найти попутчиков"' +
                      '\n⬇️ Если хотите остановить уведомления от пассажиров по всему городу, нажмите на "Не отправляйте мне такие уведомления"';
           }
           else if (pass[0].interception !== null && pass[1].interception !== null) {
           var text = 'Возможно этот пассажир вам попути.' +
                      '\n➡️ ' + district + ' >>> ' + district2 +
                      '\n Он/она выезжает с пер. ' + pass[0].interception + ' - ' + pass[0].street + ' и едет до пер. ' + pass[1].interception + ' - ' + pass[1].street +
                      '\n⏺ Если хотите забрать пассажира, укажите ваше направление, нажав на "Найти попутчиков"' +
                      '\n⬇️ Если хотите остановить уведомления от пассажиров по всему городу, нажмите на "Не отправляйте мне такие уведомления"';
           }
           console.log('text ', text);

//                var sql = ' SELECT DISTINCT id_user FROM users WHERE vibor = "driver" AND id_user NOT IN (?) ';
//                connection.query( sql, [ test ], function(err, rows, fields) {
//                if (err) throw err;
//                var driver = JSON.parse(JSON.stringify(rows));
//                console.log('like ', driver);

                                      bot.sendMessage(336243307, text,{
                                                        reply_markup: {
                                                          inline_keyboard: [
                                                            [{
                                                              text: 'Не отправляйте мне такие уведомления',
                                                              callback_data:  'stop_not'
                                                            }]

                                                          ]
                                                        }

                                       })

//                        if (driver.length <= 30){
//                            setTimeout(sms_30, 500, 'funky');
//                                function sms_30 (msg){
//                                      for(var i = 0; i < driver.length; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                        reply_markup: {
//                                                          inline_keyboard: [
//                                                            [{
//                                                              text: 'Не отправляйте мне такие уведомления',
//                                                              callback_data:  'stop_not'
//                                                            }]
//
//                                                          ]
//                                                        }
//
//                                       })
//                                      }
//                                }
//                        }
//                        else if(driver.length > 30 && driver.length <= 60){
//                           setTimeout(sms_30, 500, 'funky');
//                                function sms_30 (msg){
//                                      for(var i = 0; i < 30; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                                      })
//                                      }
//                                }
//                           setTimeout(sms_30_60, 10000, 'funky');
//                                function sms_30_60 (msg){
//                                      for(var i = 30; i < driver.length; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                     reply_markup: {
//                                                       inline_keyboard: [
//                                                         [{
//                                                           text: 'Не отправляйте мне такие уведомления',
//                                                           callback_data:  'stop_not'
//                                                         }]
//                                                       ]
//                                                     }
//
//                                    })
//                                      }
//                                }
//                        }
//                        else if(driver.length > 60 && driver.length <= 90){
//                           setTimeout(sms_30, 500, 'funky');
//                                function sms_30 (msg){
//                                      for(var i = 0; i < 30; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_30_60, 10000, 'funky');
//                                function sms_30_60 (msg){
//                                      for(var i = 30; i < 60; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_60_90, 20000, 'funky');
//                                function sms_60_90 (msg){
//                                      for(var i = 60; i < driver.length; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                        reply_markup: {
//                                                        inline_keyboard: [
//                                                        [{
//                                                        text: 'Не отправляйте мне такие уведомления',
//                                                        callback_data:  'stop_not'
//                                                        }]
//                                                        ]
//                                                        }
//
//                                                        })
//                                      }
//                                }
//                        }
//                        else if(driver.length > 90 && driver.length <= 120){
//                           setTimeout(sms_30, 500, 'funky');
//                                function sms_30 (msg){
//                                      for(var i = 0; i < 30; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_30_60, 10000, 'funky');
//                                function sms_30_60 (msg){
//                                      for(var i = 30; i < 60; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_60_90, 20000, 'funky');
//                                function sms_60_90 (msg){
//                                      for(var i = 60; i < 90; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_90_120, 30000, 'funky');
//                                function sms_90_120 (msg){
//                                      for(var i = 90; i < driver.length; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                        }
//                        else if(driver.length > 120 && driver.length <= 150){
//                           setTimeout(sms_30, 500, 'funky');
//                                function sms_30 (msg){
//                                      for(var i = 0; i < 30; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_30_60, 10000, 'funky');
//                                function sms_30_60 (msg){
//                                      for(var i = 30; i < 60; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_60_90, 15000, 'funky');
//                                function sms_60_90 (msg){
//                                      for(var i = 60; i < 90; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_90_120, 20000, 'funky');
//                                function sms_90_120 (msg){
//                                      for(var i = 90; i < driver.length; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_120_150, 25000, 'funky');
//                                function sms_90_120 (msg){
//                                      for(var i = 120; i < driver.length; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                        }
//                        else if(driver.length > 150 && driver.length <= 180){
//                           setTimeout(sms_30, 500, 'funky');
//                                function sms_30 (msg){
//                                      for(var i = 0; i < 30; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_30_60, 10000, 'funky');
//                                function sms_30_60 (msg){
//                                      for(var i = 30; i < 60; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_60_90, 15000, 'funky');
//                                function sms_60_90 (msg){
//                                      for(var i = 60; i < 90; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_90_120, 20000, 'funky');
//                                function sms_90_120 (msg){
//                                      for(var i = 90; i < 120; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_120_150, 25000, 'funky');
//                                function sms_120_150 (msg){
//                                      for(var i = 120; i < 150; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_150_180, 30000, 'funky');
//                                function sms_150_180 (msg){
//                                      for(var i = 150; i < driver.length; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                        }
//                        else if(driver.length > 180 && driver.length <= 210){
//                           setTimeout(sms_30, 500, 'funky');
//                                function sms_30 (msg){
//                                      for(var i = 0; i < 30; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_30_60, 10000, 'funky');
//                                function sms_30_60 (msg){
//                                      for(var i = 30; i < 60; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_60_90, 15000, 'funky');
//                                function sms_60_90 (msg){
//                                      for(var i = 60; i < 90; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_90_120, 20000, 'funky');
//                                function sms_90_120 (msg){
//                                      for(var i = 90; i < 120; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_120_150, 25000, 'funky');
//                                function sms_120_150 (msg){
//                                      for(var i = 120; i < 150; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_150_180, 30000, 'funky');
//                                function sms_150_180 (msg){
//                                      for(var i = 150; i < 180; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_180_210, 35000, 'funky');
//                                function sms_180_210 (msg){
//                                      for(var i = 180; i < driver.length; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                        }
//                        else if(driver.length > 210 && driver.length <= 240){
//                           setTimeout(sms_30, 500, 'funky');
//                                function sms_30 (msg){
//                                      for(var i = 0; i < 30; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_30_60, 10000, 'funky');
//                                function sms_30_60 (msg){
//                                      for(var i = 30; i < 60; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_60_90, 15000, 'funky');
//                                function sms_60_90 (msg){
//                                      for(var i = 60; i < 90; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_90_120, 20000, 'funky');
//                                function sms_90_120 (msg){
//                                      for(var i = 90; i < 120; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_120_150, 25000, 'funky');
//                                function sms_120_150 (msg){
//                                      for(var i = 120; i < 150; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_150_180, 30000, 'funky');
//                                function sms_150_180 (msg){
//                                      for(var i = 150; i < 180; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_180_210, 35000, 'funky');
//                                function sms_180_210 (msg){
//                                      for(var i = 180; i < 210; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_210_240, 40000, 'funky');
//                                function sms_210_240 (msg){
//                                      for(var i = 210; i < driver.length; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                        }
//                        else if(driver.length > 240 && driver.length <= 270){
//                           setTimeout(sms_30, 500, 'funky');
//                                function sms_30 (msg){
//                                      for(var i = 0; i < 30; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_30_60, 10000, 'funky');
//                                function sms_30_60 (msg){
//                                      for(var i = 30; i < 60; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_60_90, 15000, 'funky');
//                                function sms_60_90 (msg){
//                                      for(var i = 60; i < 90; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_90_120, 20000, 'funky');
//                                function sms_90_120 (msg){
//                                      for(var i = 90; i < 120; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_120_150, 25000, 'funky');
//                                function sms_120_150 (msg){
//                                      for(var i = 120; i < 150; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_150_180, 30000, 'funky');
//                                function sms_150_180 (msg){
//                                      for(var i = 150; i < 180; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_180_210, 35000, 'funky');
//                                function sms_180_210 (msg){
//                                      for(var i = 180; i < 210; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_210_240, 40000, 'funky');
//                                function sms_210_240 (msg){
//                                      for(var i = 210; i < 240; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_240_270, 45000, 'funky');
//                                function sms_240_270 (msg){
//                                      for(var i = 240; i < driver.length; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                        }
//                        else if(driver.length > 270 && driver.length <= 300){
//                           setTimeout(sms_30, 500, 'funky');
//                                function sms_30 (msg){
//                                      for(var i = 0; i < 30; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_30_60, 10000, 'funky');
//                                function sms_30_60 (msg){
//                                      for(var i = 30; i < 60; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_60_90, 15000, 'funky');
//                                function sms_60_90 (msg){
//                                      for(var i = 60; i < 90; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_90_120, 20000, 'funky');
//                                function sms_90_120 (msg){
//                                      for(var i = 90; i < 120; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_120_150, 25000, 'funky');
//                                function sms_120_150 (msg){
//                                      for(var i = 120; i < 150; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_150_180, 30000, 'funky');
//                                function sms_150_180 (msg){
//                                      for(var i = 150; i < 180; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_180_210, 35000, 'funky');
//                                function sms_180_210 (msg){
//                                      for(var i = 180; i < 210; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_210_240, 40000, 'funky');
//                                function sms_210_240 (msg){
//                                      for(var i = 210; i < 240; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_240_270, 45000, 'funky');
//                                function sms_240_270 (msg){
//                                      for(var i = 240; i < 270; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_270_300, 50000, 'funky');
//                                function sms_270_300 (msg){
//                                      for(var i = 270; i < driver.length; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                        }
//                        else if(driver.length > 300 && driver.length <= 330){
//                           setTimeout(sms_30, 500, 'funky');
//                                function sms_30 (msg){
//                                      for(var i = 0; i < 30; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_30_60, 10000, 'funky');
//                                function sms_30_60 (msg){
//                                      for(var i = 30; i < 60; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_60_90, 15000, 'funky');
//                                function sms_60_90 (msg){
//                                      for(var i = 60; i < 90; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_90_120, 20000, 'funky');
//                                function sms_90_120 (msg){
//                                      for(var i = 90; i < 120; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_120_150, 25000, 'funky');
//                                function sms_120_150 (msg){
//                                      for(var i = 120; i < 150; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_150_180, 30000, 'funky');
//                                function sms_150_180 (msg){
//                                      for(var i = 150; i < 180; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_180_210, 35000, 'funky');
//                                function sms_180_210 (msg){
//                                      for(var i = 180; i < 210; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_210_240, 40000, 'funky');
//                                function sms_210_240 (msg){
//                                      for(var i = 210; i < 240; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_240_270, 45000, 'funky');
//                                function sms_240_270 (msg){
//                                      for(var i = 240; i < 270; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_270_300, 50000, 'funky');
//                                function sms_270_300 (msg){
//                                      for(var i = 270; i < 300; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_300_330, 55000, 'funky');
//                                function sms_300_330 (msg){
//                                      for(var i = 300; i < driver.length; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                        }
//                        else if(driver.length > 330 && driver.length <= 360){
//                           setTimeout(sms_30, 500, 'funky');
//                                function sms_30 (msg){
//                                      for(var i = 0; i < 30; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_30_60, 10000, 'funky');
//                                function sms_30_60 (msg){
//                                      for(var i = 30; i < 60; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_60_90, 15000, 'funky');
//                                function sms_60_90 (msg){
//                                      for(var i = 60; i < 90; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_90_120, 20000, 'funky');
//                                function sms_90_120 (msg){
//                                      for(var i = 90; i < 120; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_120_150, 25000, 'funky');
//                                function sms_120_150 (msg){
//                                      for(var i = 120; i < 150; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_150_180, 30000, 'funky');
//                                function sms_150_180 (msg){
//                                      for(var i = 150; i < 180; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_180_210, 35000, 'funky');
//                                function sms_180_210 (msg){
//                                      for(var i = 180; i < 210; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_210_240, 40000, 'funky');
//                                function sms_210_240 (msg){
//                                      for(var i = 210; i < 240; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_240_270, 45000, 'funky');
//                                function sms_240_270 (msg){
//                                      for(var i = 240; i < 270; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_270_300, 50000, 'funky');
//                                function sms_270_300 (msg){
//                                      for(var i = 270; i < 300; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_300_330, 55000, 'funky');
//                                function sms_300_330 (msg){
//                                      for(var i = 300; i < 330; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_330_360, 60000, 'funky');
//                                function sms_330_360 (msg){
//                                      for(var i = 330; i < driver.length; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                        }
//                        else if(driver.length > 360 && driver.length <= 390){
//                           setTimeout(sms_30, 500, 'funky');
//                                function sms_30 (msg){
//                                      for(var i = 0; i < 30; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_30_60, 10000, 'funky');
//                                function sms_30_60 (msg){
//                                      for(var i = 30; i < 60; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_60_90, 15000, 'funky');
//                                function sms_60_90 (msg){
//                                      for(var i = 60; i < 90; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_90_120, 20000, 'funky');
//                                function sms_90_120 (msg){
//                                      for(var i = 90; i < 120; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_120_150, 25000, 'funky');
//                                function sms_120_150 (msg){
//                                      for(var i = 120; i < 150; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_150_180, 30000, 'funky');
//                                function sms_150_180 (msg){
//                                      for(var i = 150; i < 180; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_180_210, 35000, 'funky');
//                                function sms_180_210 (msg){
//                                      for(var i = 180; i < 210; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_210_240, 40000, 'funky');
//                                function sms_210_240 (msg){
//                                      for(var i = 210; i < 240; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_240_270, 45000, 'funky');
//                                function sms_240_270 (msg){
//                                      for(var i = 240; i < 270; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_270_300, 50000, 'funky');
//                                function sms_270_300 (msg){
//                                      for(var i = 270; i < 300; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_300_330, 55000, 'funky');
//                                function sms_300_330 (msg){
//                                      for(var i = 300; i < 330; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_330_360, 60000, 'funky');
//                                function sms_330_360 (msg){
//                                      for(var i = 330; i < 360; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_360_390, 65000, 'funky');
//                                function sms_360_390 (msg){
//                                      for(var i = 360; i < driver.length; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                        }
//                        else if(driver.length > 390 && driver.length <= 420){
//                           setTimeout(sms_30, 500, 'funky');
//                                function sms_30 (msg){
//                                      for(var i = 0; i < 30; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_30_60, 10000, 'funky');
//                                function sms_30_60 (msg){
//                                      for(var i = 30; i < 60; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_60_90, 15000, 'funky');
//                                function sms_60_90 (msg){
//                                      for(var i = 60; i < 90; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_90_120, 20000, 'funky');
//                                function sms_90_120 (msg){
//                                      for(var i = 90; i < 120; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_120_150, 25000, 'funky');
//                                function sms_120_150 (msg){
//                                      for(var i = 120; i < 150; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_150_180, 30000, 'funky');
//                                function sms_150_180 (msg){
//                                      for(var i = 150; i < 180; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_180_210, 35000, 'funky');
//                                function sms_180_210 (msg){
//                                      for(var i = 180; i < 210; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_210_240, 40000, 'funky');
//                                function sms_210_240 (msg){
//                                      for(var i = 210; i < 240; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_240_270, 45000, 'funky');
//                                function sms_240_270 (msg){
//                                      for(var i = 240; i < 270; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_270_300, 50000, 'funky');
//                                function sms_270_300 (msg){
//                                      for(var i = 270; i < 300; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_300_330, 55000, 'funky');
//                                function sms_300_330 (msg){
//                                      for(var i = 300; i < 330; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_330_360, 60000, 'funky');
//                                function sms_330_360 (msg){
//                                      for(var i = 330; i < 360; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_360_390, 65000, 'funky');
//                                function sms_360_390 (msg){
//                                      for(var i = 360; i < 390; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_390_420, 70000, 'funky');
//                                function sms_390_420 (msg){
//                                      for(var i = 390; i < driver.length; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                        }
//                        else if(driver.length > 420 && driver.length <= 450){
//                           setTimeout(sms_30, 500, 'funky');
//                                function sms_30 (msg){
//                                      for(var i = 0; i < 30; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_30_60, 10000, 'funky');
//                                function sms_30_60 (msg){
//                                      for(var i = 30; i < 60; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_60_90, 15000, 'funky');
//                                function sms_60_90 (msg){
//                                      for(var i = 60; i < 90; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_90_120, 20000, 'funky');
//                                function sms_90_120 (msg){
//                                      for(var i = 90; i < 120; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_120_150, 25000, 'funky');
//                                function sms_120_150 (msg){
//                                      for(var i = 120; i < 150; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_150_180, 30000, 'funky');
//                                function sms_150_180 (msg){
//                                      for(var i = 150; i < 180; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_180_210, 35000, 'funky');
//                                function sms_180_210 (msg){
//                                      for(var i = 180; i < 210; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_210_240, 40000, 'funky');
//                                function sms_210_240 (msg){
//                                      for(var i = 210; i < 240; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_240_270, 45000, 'funky');
//                                function sms_240_270 (msg){
//                                      for(var i = 240; i < 270; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_270_300, 50000, 'funky');
//                                function sms_270_300 (msg){
//                                      for(var i = 270; i < 300; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_300_330, 55000, 'funky');
//                                function sms_300_330 (msg){
//                                      for(var i = 300; i < 330; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_330_360, 60000, 'funky');
//                                function sms_330_360 (msg){
//                                      for(var i = 330; i < 360; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_360_390, 65000, 'funky');
//                                function sms_360_390 (msg){
//                                      for(var i = 360; i < 390; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_390_420, 70000, 'funky');
//                                function sms_390_420 (msg){
//                                      for(var i = 390; i < 420; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_420_450, 75000, 'funky');
//                                function sms_420_450 (msg){
//                                      for(var i = 420; i < driver.length; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                        }
//                        else if(driver.length > 450 && driver.length <= 480){
//                           setTimeout(sms_30, 500, 'funky');
//                                function sms_30 (msg){
//                                      for(var i = 0; i < 30; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_30_60, 10000, 'funky');
//                                function sms_30_60 (msg){
//                                      for(var i = 30; i < 60; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_60_90, 15000, 'funky');
//                                function sms_60_90 (msg){
//                                      for(var i = 60; i < 90; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_90_120, 20000, 'funky');
//                                function sms_90_120 (msg){
//                                      for(var i = 90; i < 120; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_120_150, 25000, 'funky');
//                                function sms_120_150 (msg){
//                                      for(var i = 120; i < 150; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_150_180, 30000, 'funky');
//                                function sms_150_180 (msg){
//                                      for(var i = 150; i < 180; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_180_210, 35000, 'funky');
//                                function sms_180_210 (msg){
//                                      for(var i = 180; i < 210; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_210_240, 40000, 'funky');
//                                function sms_210_240 (msg){
//                                      for(var i = 210; i < 240; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_240_270, 45000, 'funky');
//                                function sms_240_270 (msg){
//                                      for(var i = 240; i < 270; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_270_300, 50000, 'funky');
//                                function sms_270_300 (msg){
//                                      for(var i = 270; i < 300; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_300_330, 55000, 'funky');
//                                function sms_300_330 (msg){
//                                      for(var i = 300; i < 330; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_330_360, 60000, 'funky');
//                                function sms_330_360 (msg){
//                                      for(var i = 330; i < 360; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_360_390, 65000, 'funky');
//                                function sms_360_390 (msg){
//                                      for(var i = 360; i < 390; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_390_420, 70000, 'funky');
//                                function sms_390_420 (msg){
//                                      for(var i = 390; i < 420; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_420_450, 75000, 'funky');
//                                function sms_420_450 (msg){
//                                      for(var i = 420; i < 450; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_450_480, 80000, 'funky');
//                                function sms_450_480 (msg){
//                                      for(var i = 450; i < driver.length; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                        }
//                        else if(driver.length > 480 && driver.length <= 510){
//                           setTimeout(sms_30, 500, 'funky');
//                                function sms_30 (msg){
//                                      for(var i = 0; i < 30; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_30_60, 10000, 'funky');
//                                function sms_30_60 (msg){
//                                      for(var i = 30; i < 60; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_60_90, 15000, 'funky');
//                                function sms_60_90 (msg){
//                                      for(var i = 60; i < 90; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_90_120, 20000, 'funky');
//                                function sms_90_120 (msg){
//                                      for(var i = 90; i < 120; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_120_150, 25000, 'funky');
//                                function sms_120_150 (msg){
//                                      for(var i = 120; i < 150; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_150_180, 30000, 'funky');
//                                function sms_150_180 (msg){
//                                      for(var i = 150; i < 180; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_180_210, 35000, 'funky');
//                                function sms_180_210 (msg){
//                                      for(var i = 180; i < 210; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_210_240, 40000, 'funky');
//                                function sms_210_240 (msg){
//                                      for(var i = 210; i < 240; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_240_270, 45000, 'funky');
//                                function sms_240_270 (msg){
//                                      for(var i = 240; i < 270; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_270_300, 50000, 'funky');
//                                function sms_270_300 (msg){
//                                      for(var i = 270; i < 300; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_300_330, 55000, 'funky');
//                                function sms_300_330 (msg){
//                                      for(var i = 300; i < 330; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_330_360, 60000, 'funky');
//                                function sms_330_360 (msg){
//                                      for(var i = 330; i < 360; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_360_390, 65000, 'funky');
//                                function sms_360_390 (msg){
//                                      for(var i = 360; i < 390; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_390_420, 70000, 'funky');
//                                function sms_390_420 (msg){
//                                      for(var i = 390; i < 420; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_420_450, 75000, 'funky');
//                                function sms_420_450 (msg){
//                                      for(var i = 420; i < 450; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_450_480, 80000, 'funky');
//                                function sms_450_480 (msg){
//                                      for(var i = 450; i < 480; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_480_510, 85000, 'funky');
//                                function sms_480_510 (msg){
//                                      for(var i = 480; i < driver.length; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                        }
//                        else if(driver.length > 510 && driver.length <= 540){
//                           setTimeout(sms_30, 500, 'funky');
//                                function sms_30 (msg){
//                                      for(var i = 0; i < 30; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_30_60, 10000, 'funky');
//                                function sms_30_60 (msg){
//                                      for(var i = 30; i < 60; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_60_90, 15000, 'funky');
//                                function sms_60_90 (msg){
//                                      for(var i = 60; i < 90; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_90_120, 20000, 'funky');
//                                function sms_90_120 (msg){
//                                      for(var i = 90; i < 120; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_120_150, 25000, 'funky');
//                                function sms_120_150 (msg){
//                                      for(var i = 120; i < 150; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_150_180, 30000, 'funky');
//                                function sms_150_180 (msg){
//                                      for(var i = 150; i < 180; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_180_210, 35000, 'funky');
//                                function sms_180_210 (msg){
//                                      for(var i = 180; i < 210; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_210_240, 40000, 'funky');
//                                function sms_210_240 (msg){
//                                      for(var i = 210; i < 240; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_240_270, 45000, 'funky');
//                                function sms_240_270 (msg){
//                                      for(var i = 240; i < 270; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_270_300, 50000, 'funky');
//                                function sms_270_300 (msg){
//                                      for(var i = 270; i < 300; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_300_330, 55000, 'funky');
//                                function sms_300_330 (msg){
//                                      for(var i = 300; i < 330; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_330_360, 60000, 'funky');
//                                function sms_330_360 (msg){
//                                      for(var i = 330; i < 360; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_360_390, 65000, 'funky');
//                                function sms_360_390 (msg){
//                                      for(var i = 360; i < 390; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_390_420, 70000, 'funky');
//                                function sms_390_420 (msg){
//                                      for(var i = 390; i < 420; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_420_450, 75000, 'funky');
//                                function sms_420_450 (msg){
//                                      for(var i = 420; i < 450; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_450_480, 80000, 'funky');
//                                function sms_450_480 (msg){
//                                      for(var i = 450; i < 480; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_480_510, 85000, 'funky');
//                                function sms_480_510 (msg){
//                                      for(var i = 480; i < 510; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_510_540, 90000, 'funky');
//                                function sms_510_540 (msg){
//                                      for(var i = 510; i < driver.length; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                        }
//                        else if(driver.length > 540 && driver.length <= 570){
//                           setTimeout(sms_30, 500, 'funky');
//                                function sms_30 (msg){
//                                      for(var i = 0; i < 30; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_30_60, 10000, 'funky');
//                                function sms_30_60 (msg){
//                                      for(var i = 30; i < 60; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_60_90, 15000, 'funky');
//                                function sms_60_90 (msg){
//                                      for(var i = 60; i < 90; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_90_120, 20000, 'funky');
//                                function sms_90_120 (msg){
//                                      for(var i = 90; i < 120; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_120_150, 25000, 'funky');
//                                function sms_120_150 (msg){
//                                      for(var i = 120; i < 150; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_150_180, 30000, 'funky');
//                                function sms_150_180 (msg){
//                                      for(var i = 150; i < 180; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_180_210, 35000, 'funky');
//                                function sms_180_210 (msg){
//                                      for(var i = 180; i < 210; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_210_240, 40000, 'funky');
//                                function sms_210_240 (msg){
//                                      for(var i = 210; i < 240; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_240_270, 45000, 'funky');
//                                function sms_240_270 (msg){
//                                      for(var i = 240; i < 270; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_270_300, 50000, 'funky');
//                                function sms_270_300 (msg){
//                                      for(var i = 270; i < 300; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_300_330, 55000, 'funky');
//                                function sms_300_330 (msg){
//                                      for(var i = 300; i < 330; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_330_360, 60000, 'funky');
//                                function sms_330_360 (msg){
//                                      for(var i = 330; i < 360; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_360_390, 65000, 'funky');
//                                function sms_360_390 (msg){
//                                      for(var i = 360; i < 390; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_390_420, 70000, 'funky');
//                                function sms_390_420 (msg){
//                                      for(var i = 390; i < 420; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_420_450, 75000, 'funky');
//                                function sms_420_450 (msg){
//                                      for(var i = 420; i < 450; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_450_480, 80000, 'funky');
//                                function sms_450_480 (msg){
//                                      for(var i = 450; i < 480; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_480_510, 85000, 'funky');
//                                function sms_480_510 (msg){
//                                      for(var i = 480; i < 510; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_510_540, 90000, 'funky');
//                                function sms_510_540 (msg){
//                                      for(var i = 510; i < 540; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_540_570, 95000, 'funky');
//                                function sms_540_570 (msg){
//                                      for(var i = 540; i < driver.length; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                        }
//                        else if(driver.length > 570 && driver.length <= 600){
//                           setTimeout(sms_30, 500, 'funky');
//                                function sms_30 (msg){
//                                      for(var i = 0; i < 30; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_30_60, 10000, 'funky');
//                                function sms_30_60 (msg){
//                                      for(var i = 30; i < 60; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_60_90, 15000, 'funky');
//                                function sms_60_90 (msg){
//                                      for(var i = 60; i < 90; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_90_120, 20000, 'funky');
//                                function sms_90_120 (msg){
//                                      for(var i = 90; i < 120; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_120_150, 25000, 'funky');
//                                function sms_120_150 (msg){
//                                      for(var i = 120; i < 150; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_150_180, 30000, 'funky');
//                                function sms_150_180 (msg){
//                                      for(var i = 150; i < 180; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_180_210, 35000, 'funky');
//                                function sms_180_210 (msg){
//                                      for(var i = 180; i < 210; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_210_240, 40000, 'funky');
//                                function sms_210_240 (msg){
//                                      for(var i = 210; i < 240; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_240_270, 45000, 'funky');
//                                function sms_240_270 (msg){
//                                      for(var i = 240; i < 270; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_270_300, 50000, 'funky');
//                                function sms_270_300 (msg){
//                                      for(var i = 270; i < 300; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_300_330, 55000, 'funky');
//                                function sms_300_330 (msg){
//                                      for(var i = 300; i < 330; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_330_360, 60000, 'funky');
//                                function sms_330_360 (msg){
//                                      for(var i = 330; i < 360; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_360_390, 65000, 'funky');
//                                function sms_360_390 (msg){
//                                      for(var i = 360; i < 390; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_390_420, 70000, 'funky');
//                                function sms_390_420 (msg){
//                                      for(var i = 390; i < 420; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_420_450, 75000, 'funky');
//                                function sms_420_450 (msg){
//                                      for(var i = 420; i < 450; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_450_480, 80000, 'funky');
//                                function sms_450_480 (msg){
//                                      for(var i = 450; i < 480; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_480_510, 85000, 'funky');
//                                function sms_480_510 (msg){
//                                      for(var i = 480; i < 510; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_510_540, 90000, 'funky');
//                                function sms_510_540 (msg){
//                                      for(var i = 510; i < 540; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_540_570, 95000, 'funky');
//                                function sms_540_570 (msg){
//                                      for(var i = 540; i < 570; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                           setTimeout(sms_570_600, 100000, 'funky');
//                                function sms_570_600 (msg){
//                                      for(var i = 570; i < driver.length; i++){
//                                      bot.sendMessage(driver[i].id_user, text,{
//                                                         reply_markup: {
//                                                           inline_keyboard: [
//                                                             [{
//                                                               text: 'Не отправляйте мне такие уведомления',
//                                                               callback_data:  'stop_not'
//                                                             }]
//                                                           ]
//                                                         }
//
//                                        })
//                                      }
//                                }
//                        }
//                })
          })

  })
})

}




function stop_notify_driv (query) {

var mysql  = require('mysql');
        var pool = mysql.createPool({
        host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
        database : 'sitebot'
    })

var user_id = query.message.chat.id;

pool.getConnection(function(err, connection) {

   connection.query( ' INSERT INTO stop_notification (id_user, vibor) VALUES (?, "driver") ' , [user_id], function(err, rows, fields) {
   if (err) throw err;
   console.log('inserted stop notifying driver ', rows);
   })
})
}



function stop_notify_pass (query) {

var mysql  = require('mysql');
        var pool = mysql.createPool({
        host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
        database : 'sitebot'
    })

var user_id = query.message.chat.id;

pool.getConnection(function(err, connection) {

   connection.query( ' INSERT INTO stop_notification (id_user, vibor) VALUES (?, "passenger") ' , [user_id], function(err, rows, fields) {
   if (err) throw err;
   console.log('inserted stop notifying passenger ', rows);
   })
})
}



bot.onText(/\/sms_spec (.+)/, (msg, [source, match]) => {


var mysql  = require('mysql');
        var pool = mysql.createPool({
        host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
        database : 'sitebot'
    })

var user_id = msg.chat.id;

console.log('!!message text', msg.text);

var msg_text = msg.text;

var text = msg_text.replace("/sms_spec", "");
var splited = text.split(" ");
//var id_user = splited.shift();
var id_user = splited.splice(1,1);
var text_to = splited.join(" ");

console.log('!!text', text);
console.log('splited ', splited);
console.log('id_user: ', id_user);
console.log('!!text_to', text_to);



bot.sendMessage(id_user[0], text_to)

//pool.getConnection(function(err, connection) {
//
//       connection.query(' SELECT * FROM users WHERE vibor = "passenger"  ',
//
//       function(err, rows, fields) {
//       if (err) throw err;
//       var driver = JSON.parse(JSON.stringify(rows));
//       console.log('колво пассажиров', driver);
//       })
//})

})

