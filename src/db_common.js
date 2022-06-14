import * as db_host from './db_host.js';
import * as users_db from './db_query/users/query_db.js';
import * as issues_db from './db_query/issues/query_db.js';
import * as issue_server from './routes/issues/issues_server.js';
import {strict as assert} from 'node:assert';
export function filter(rows,key,value){
   return rows.filter(row => row[key] === value);
}

export function log_pg_err(err){
   if(err.detail){
      console.log("PG ERR: " + err.detail)
      return;
   }
   console.log(err);
}


//test_db();
