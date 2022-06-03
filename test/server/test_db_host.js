import * as db_host from '../../src/db_host.js';

function test_connection(){
   let handle = db_host.open_db();
   handle.connect((err,client,done) =>{
      if(err) throw err;
      client.query('SELECT * FROM Users',(err,res) =>{
         done();

         if(!err){
            console.log("====DATA====");
            console.log(res.rows);
         }
      });
   });

   handle.connect((err,client,done) =>{
      if(err) throw err;
      client.query('SELECT * FROM Issues',(err,res) =>{
         done();

         if(!err){
            console.log("====DATA====");
            console.log(res.rows);
         }
      });
   });

   db_host.close_db(handle);
}

test_connection();
