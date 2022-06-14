import postgres  from 'pg'; 
const {Client,Pool} = postgres;

export function open_db(){
   const db_pd = process.env.SYN_DB_PSWD;
   const db_user = process.env.SYN_DB_USER;
   const db_port = process.env.SYN_DB_PORT;
   const db_host = process.env.SYN_DB_HOST;
   const db_database = process.env.SYN_DB_DB;
   const db_con_str = process.env.DB_CONNECTION_STRING;

   if(db_con_str){
      const pool = new Pool({
         db_con_str
      });
      return pool;
   }


   const pool = new Pool({
     user: db_user,
     host: db_host,
     database: db_database,
     password: db_pd,
     port: db_port,
   });
   return pool;
}
export function close_db(pool){
   pool.end();
}

export function run_query(pool,query){
   
}

