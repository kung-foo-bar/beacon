import * as db_host from './db_host.js';
import * as users_db from './db_query/users/query_db.js';
import * as issues_db from './db_query/issues/query_db.js';
import * as issue_server from './routes/issues/issues_server.js';
import {strict as assert} from 'node:assert';
export function filter(rows,key,value){
   return rows.filter(row => row[key] === value);
}

export function test_db(){
   let handle = db_host.open_db();
   let res = issues_db.select_issues(handle);
   res.then(fl_rows => {console.log(fl_rows.data);fl_rows.client.release()})
      .catch((err) => log_pg_err(err));

   let user = users_db.User("patrick bateman","189793273");
   //console.log(user);
   res = users_db.insert_users(handle,user);
   res.then(rows => {console.log(rows.data); rows.client.release()})
      .catch((err) => {log_pg_err(err)});

   let title = "bookhead";
   let msg = "its your poison,if you so choose absorb it, veins to the brain, shoot off into orbit ";
   let type = "VERSE";
   let creator_id = "MF DOOM";
   let asignee_id = "SupaVilan";

   let issue = issues_db.Issue(title,msg,type,creator_id,asignee_id);
   res = issues_db.insert_issues(handle,issue);
   res.then(rows => {console.log(rows.data); rows.client.release()})
      .catch((err) => {log_pg_err(err)});
   /*
   res = issues_db.add_votes(handle,issue,'Paigen');
   res.then(rows => {
      console.log(rows.data); 
      rows.client.release();
      test_count_votes(handle,issue);
   }).catch((err) => {test_count_votes(handle,issue);log_pg_err(err)});
   
   
   let too_far_forward = new Date("1/1/2099");
   res = issue_server.get_within_period(handle,too_far_forward);
   res.then(rows => {
      assert.deepEqual(rows.data.length,0);
      rows.client.release();
   })
   .catch((err) => log_pg_err(err));*/
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


test_db();
