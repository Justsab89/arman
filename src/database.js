module.exports = {
insert_paral_inter_ord,
insert_paral_inter_idpoint,
base,
kolvo_direction
}


function kolvo_direction(msg){

 var mysql  = require('mysql');
         var pool = mysql.createPool({
         host     : 'localhost',
         user     : 'mybd_user',
         password : 'admin123',
         database : 'sitebot'
     })

pool.getConnection(function(err, connection) {

     connection.query(' SELECT COUNT (direction) AS count FROM users GROUP BY direction ',

         function(err, rows, fields) {
         if (err) throw err;
         var direction = JSON.parse(JSON.stringify(rows));
         console.log('Direction', direction);
         var test = [];
         for(var i = 0; i < rows.length; i++){
         test.push(direction[i].count);
         }
         test.join(',')
         console.log('В ассоц массиве', test);
                 bot.sendMessage( msg.chat.id, test)
     })
})
}


function insert_paral_inter_ord(){

 var mysql  = require('mysql');
         var pool = mysql.createPool({
         host     : 'localhost',
         user     : 'mybd_user',
         password : 'admin123',
         database : 'sitebot'
     })

 pool.getConnection(function(err, connection) {


 connection.query(' SELECT id, id_point, id_street, id_interception FROM points1 WHERE id = (SELECT MIN(id) FROM points1 WHERE point_type = 1 AND ord_parinter_min5 IS NULL AND ord_parinter_plu5 IS NULL) ',

     function(err, rows, fields) {
     if (err) throw err;
     var par = JSON.parse(JSON.stringify(rows));
     console.log('Параллельные пересечения', par);
     var test = [];
     for(var i = 0; i < rows.length; i++){
     test.push([ par[i].id_street, par[i].id_interception ]);
     }
     console.log('В ассоц массиве', test);


     connection.query(' SELECT id, id_point, id_street, id_interception, ordinal FROM points1 WHERE (id_interception, id_street) IN (?) ',
     [test] ,
     function(err, rows, fields) {
     if (err) throw err;
     var par2 = JSON.parse(JSON.stringify(rows));
     console.log('Порядковый обратного пересечения', par2);

                if( par2[0] !== undefined ){
                     connection.query(' UPDATE points1 SET ord_parinter_min5 = ?, ord_parinter_plu5 = ? WHERE id = ? ',
                     [ par2[0].ordinal-5, par2[0].ordinal+5, par[0].id ] ,
                     function(err, rows, fields) {
                     if (err) throw err;
                     })
                console.log('since par2 is NOT undefined', par2);
                }
                else {
                     connection.query(' UPDATE points1 SET ord_parinter_min5 = ?, ord_parinter_plu5 = ? WHERE id = ? ',
                     [ 0, 0, par[0].id ] ,
                     function(err, rows, fields) {
                     if (err) throw err;
                     })
                console.log('since min5 is undefined', par2);
                }
     })
 })
 })
 }


function insert_paral_inter_idpoint(msg){

          var mysql  = require('mysql');
          var pool = mysql.createPool({
                  host     : 'localhost',
          user     : 'mybd_user',
          password : 'admin123',
          database : 'sitebot'
      })

  pool.getConnection(function(err, connection) {

  connection.query(' SELECT id, id_interception, ord_parinter_min5, ord_parinter_plu5 FROM points1 WHERE id = (SELECT MIN(id) FROM points1 WHERE point_type = 1 AND point_parinter_min5 IS NULL AND point_parinter_plu5 IS NULL)',
      function(err, rows, fields) {
      if (err) throw err;
      var par = JSON.parse(JSON.stringify(rows));
      console.log('id_inter and ordinals +-5 ', par);

           connection.query(' SELECT id_point FROM points1 WHERE EXISTS (SELECT id_point FROM points1 WHERE id_street = ? AND ordinal = ?) AND id_street = ? AND ordinal = ? ',
           [ par[0].id_interception, par[0].ord_parinter_min5, par[0].id_interception, par[0].ord_parinter_min5 ] ,
           function(err, rows, fields) {
           if (err) throw err;
           var par2 = JSON.parse(JSON.stringify(rows));
           console.log('idpoint min5', par2);

           if( par2[0] !== undefined ){
                connection.query(' UPDATE points1 SET point_parinter_min5 = ? WHERE id = ? ',
                [ par2[0].id_point, par[0].id ] ,
                function(err, rows, fields) {
                if (err) throw err;
                })
           console.log('since min5 is NOT undefined', par2);
           }
           else {
                connection.query(' UPDATE points1 SET point_parinter_min5 = ? WHERE id = ? ',
                [ 0, par[0].id ] ,
                function(err, rows, fields) {
                if (err) throw err;
                })
           console.log('since min5 is undefined', par2);
           }
           })

           connection.query(' SELECT id_point FROM points1 WHERE EXISTS (SELECT id_point FROM points1 WHERE id_street = ? AND ordinal = ?) AND id_street = ? AND ordinal = ? ',
           [ par[0].id_interception, par[0].ord_parinter_plu5, par[0].id_interception, par[0].ord_parinter_plu5 ] ,
           function(err, rows, fields) {
           if (err) throw err;
           var par3 = JSON.parse(JSON.stringify(rows));
           console.log('idpoint plu5', par3);
           if( par3[0] !== undefined ){
              connection.query(' UPDATE points1 SET point_parinter_plu5 = ? WHERE id = ? ',
              [ par3[0].id_point, par[0].id ] ,
              function(err, rows, fields) {
              if (err) throw err;
              })
           console.log('since plu5 is NOT undefined', par3);
           }
           else{
                connection.query(' UPDATE points1 SET point_parinter_plu5 = ? WHERE id = ? ',
                [ 0, par[0].id ] ,
                function(err, rows, fields) {
                if (err) throw err;
                })
           console.log('since plu5 is undefined', par3);
           }
           })


  })
  })
}


function base(msg) {

var mysql  = require('mysql');
        var pool = mysql.createPool({
        host     : 'localhost',
        user     : 'mybd_user',
        password : 'admin123',
        database : 'route_passenger'
    })

pool.getConnection(function(err, connection) {

connection.query(' SELECT busstop, id_point FROM points WHERE district = "grd" AND point_type = 0 ',
function(err, rows, fields) {
if (err) throw err;
var busstop = JSON.parse(JSON.stringify(rows));
console.log ('grd busstops ', busstop)
    var keyboard = [];

    for(var i = 0; i < busstop.length; i++){
    keyboard.push([busstop[i].busstop , busstop[i].id_point]);
    }

    connection.query(' INSERT INTO grd_busstops (busstop, id_point) VALUES ? ',
    [keyboard],
    function(err, rows, fields) {
    if (err) throw err;
    })
})
})

}

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


//bot.onText(/\/proba/, msg => {proba(msg)} )
//
//// Сначала меняем id_point в 0, поставив в первом запросе условие "id_point <> 0". Затем UPDATE-им на нужные id_point, поставив в первом запросе условие "id_point = 0"
//function proba(msg){
//
//          var mysql  = require('mysql');
//          var pool = mysql.createPool({
//          host     : 'localhost',
//          user     : 'mybd_user',
//          password : 'admin123',
//          database : 'sitebot'
//      })
//
//  pool.getConnection(function(err, connection) {
//// SELECT id_street, ordinal, street, interception, id_point, id FROM  interception WHERE (id_street, ordinal) IN (SELECT id_street, ordinal FROM interception GROUP BY id_street, ordinal HAVING COUNT(id)=3) ORDER BY id_street
//  // SELECT SUBSTRING (id_point, 4,3)
//  connection.query(' SELECT * FROM  interception WHERE (id_street, ordinal) IN (SELECT id_street, ordinal FROM interception GROUP BY id_street, ordinal HAVING COUNT(id)=3 ) ORDER BY id_street ',
//      function(err, rows, fields) {
//      if (err) throw err;
//      var par = JSON.parse(JSON.stringify(rows));
//      console.log('COUNT !! ', par);
//
//               connection.query(' SELECT id_street, ordinal, street, interception, id_interception, id_point, id FROM  interception WHERE (id_street, ordinal) IN (SELECT id_street, ordinal FROM interception GROUP BY id_street, ordinal HAVING COUNT(id)=3) AND street = ? ORDER BY id_street ', [par[0].street],
//               function(err, rows, fields) {
//               if (err) throw err;
//               var dd = JSON.parse(JSON.stringify(rows));
//               console.log('dd ', dd);
//               var ids = [dd[0].id_street];
//               for(var i = 0; i < dd.length; i++){
//               ids.push(dd[i].id_interception)
//               }
//
//               console.log('Array of inter ids ', ids);
//
//               ids.sort(function(a, b) {
//                 return a - b;
//               });
//               console.log('sorted ids ', ids)
//
//               var id1 = ids[0].toString();
//               var id2 = ids[1].toString();
//               var id3 = ids[2].toString();
//               var id4 = ids[3].toString();
//
//               var id_point = id1 + id2 + id3 + '000' + id4;
//
//               console.log('idpoint ', id_point)
//
////                       connection.query(' UPDATE interception SET id_point = ? WHERE id IN (?,?,?)', [ id_point, dd[0].id, dd[1].id, dd[2].id ],
////                       function(err, rows, fields) {
////                       if (err) throw err;
////                       })
//               })
//
//  })
//  })
//}


//bot.onText(/\/proba2/, msg => {setInterval(proba2, 5000)} )
//bot.onText(/\/proba2/, msg => {proba2(msg)} )
//
//// Сначала меняем id_point в 0 и having count = 2, поставив в первом запросе условие "id_point <> 0". Затем UPDATE-им на нужные id_point, поставив в первом запросе условие "id_point = 0"
//function proba2(msg){
//
//          var mysql  = require('mysql');
//          var pool = mysql.createPool({
//          host     : 'localhost',
//          user     : 'mybd_user',
//          password : 'admin123',
//          database : 'sitebot'
//      })
//
//  pool.getConnection(function(err, connection) {
//// SELECT id_street, ordinal, street, interception, id_point, id FROM  interception WHERE (id_street, ordinal) IN (SELECT id_street, ordinal FROM interception GROUP BY id_street, ordinal HAVING COUNT(id)=3) ORDER BY id_street
//  // SELECT SUBSTRING (id_point, 4,3)
//  connection.query(' SELECT DISTINCT street FROM  interception WHERE (id_street, ordinal) IN (SELECT id_street, ordinal FROM interception GROUP BY id_street, ordinal HAVING COUNT(id)=2 ) AND id_street = 288 AND (id_interception = 283 OR  id_interception = 290) ORDER BY id_street, ordinal ',
//      function(err, rows, fields) {
//      if (err) throw err;
//      var par = JSON.parse(JSON.stringify(rows));
//      console.log('COUNT !! ', par);
//
//               connection.query(' SELECT id_street, ordinal, street, interception, id_interception, id_point, id FROM  interception WHERE (id_street, ordinal) IN (SELECT id_street, ordinal FROM interception GROUP BY id_street, ordinal HAVING COUNT(id)=2) AND street = ? ORDER BY id_street, ordinal ',
//                [par[0].street] ,
//               function(err, rows, fields) {
//               if (err) throw err;
//               var dd = JSON.parse(JSON.stringify(rows));
//               console.log('dd ', dd);
//               var ids = [dd[0].id_street];
//               for(var i = 0; i < 2; i++){
//               ids.push(dd[i].id_interception)
//               }
//
//               console.log('Array of inter ids ', ids);
//
//               ids.sort(function(a, b) {
//                 return a - b;
//               });
//               console.log('sorted ids ', ids)
//
//               var id1 = ids[0].toString();
//               var id2 = ids[1].toString();
//               var id3 = ids[2].toString();
//
//               var id_point = id1 + id2 + '000000' + id3;
//
//               console.log('idpoint ', id_point)
//
//                       connection.query(' UPDATE interception SET id_point = ? WHERE id IN (?,?)', [ 283288000000290, 655, 653 ],
//                       function(err, rows, fields) {
//                       if (err) throw err;
//                       })
//               })
//
//  })
//  })
//}

