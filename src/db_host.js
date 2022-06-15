import postgres  from 'pg'; 
import 'dotenv/config';
import express from 'express'

const {Client,Pool} = postgres;

export function open_db(){
   const db_pd = "postgrespw"
   const db_user = "postgres"
   const db_port = "55000"
   const db_host = "localhost";
   const db_database = "database"
   const db_con_str = process.env.DB_CONNECTION_STRING;

   // if(db_con_str){
   //    console.log("here")
   //    const pool = new Pool({ 
   //       db_con_str
   //    });
   //    return pool;
   // }

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

