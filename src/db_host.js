import postgres  from 'pg'; 
const {Client,Pool} = postgres;

export function open_db(){
   const db_pd = process.env.SYN_DB_PSWD;
   const db_user = process.env.SYN_DB_USER;
   const db_port = process.env.SYN_DB_PORT;
   const db_host = process.env.SYN_DB_HOST;
   const db_database = process.env.SYN_DB_DB;

   const pool = new Pool({
      user: db_user,
      host: db_host,
      database: db_database,
      password: db_pd,
      port: db_port
   });
   return pool;
}
export function close_db(pool){
   pool.end();
}

