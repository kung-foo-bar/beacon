import * as db_host from './db_host.js';
import * as users_db from './db_query/users/query_db.js';
import * as issues_db from './db_query/issues/query_db.js';
import * as issue_server from './routes/issues/issues_server.js';
import {strict as assert} from 'node:assert';
export function filter(rows,key,value){
   return rows.filter(row => row[key] === value);
}


function test_delete(pool,issue){
   return issues_db.delete_issue(pool,issue);
}

function test_count_votes(pool,issue){
   let res_votes =  issues_db.count_votes(pool,issue);
   res_votes.then(rows => {
      console.log(rows.data);
      assert.deepEqual(rows.data[0].n_votes,1);
      rows.client.release();
      test_delete(pool,issue);
   })
   .catch((err) => {log_pg_err(err)});
}

export function log_pg_err(err){
   if(err.detail){
      console.log("PG ERR: " + err.detail)
      return;
   }
   console.log(err);
}


//test_db();
