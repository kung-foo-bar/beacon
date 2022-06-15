import * as db_host from '../../src/db_host.js';
import * as db_err from '../../src/db_err.js';
import * as issues_query from '../../src/db_query/issues/query_db.js';
import * as users_query from '../../src/db_query/users/query_db.js';
import * as issues_server from '../../src/routes/issues/issues_server.js';
import {strict as assert} from 'node:assert';

const test_issue = {
   title: 'test',
   msg: 'test-msg',
   type: 'TESTDATA',
   creator_id: 'Aira',
   asignee_id: 'LE BOSS'
 };

const test_issue_1 = {
   title: 'test_1',
   msg: 'test-msg-1',
   type: 'MORE-TESTDATA',
   creator_id: 'Aira',
   asignee_id: 'LE BOSS'
};

const test_voter_id = ['Paigen','SupaVilan','MF DOOM'];
const test_key = [test_issue[0],test_issue[4],test_issue[5]];


async function make_test_data(pool){

   let db_res = await issues_query.insert_issues(pool,test_issue);
   //console.log(db_res.data);
   assert.deepEqual(db_res.data.length,1);
   db_res.client.release();

   db_res = await issues_query.insert_issues(pool,test_issue_1);
   //console.log(db_res.data);
   assert.deepEqual(db_res.data.length,1);
   db_res.client.release();
}

async function should_find_data(pool){
   let db_res = await issues_query.select_issues(pool);
   let test_rows = db_res.data.filter(row => row.issue_type === test_issue_1.type || row.issue_type ===test_issue.type);
   assert.deepEqual(test_rows.length,2);
   db_res.client.release();
}

async function should_delete_test_data(pool){
   let db_res = await issues_query.delete_issue(pool,test_issue);
   assert.deepEqual(db_res.data.length,1);
   db_res.client.release();

   db_res = await issues_query.delete_issue(pool,test_issue_1);
   assert.deepEqual(db_res.data.length,1);
   db_res.client.release();
}

async function delete_test_data(pool){
   let db_res = await issues_query.delete_issue(pool,test_issue);
   console.log("deleted");
   console.log(db_res.data);
   db_res.client.release();
   
   db_res = await issues_query.delete_issue(pool,test_issue_1);
   console.log("deleted");
   console.log(db_res.data);
   db_res.client.release();
}

async function should_add_vote(pool){
   let db_res = await issues_query.add_votes(pool,test_issue,test_voter_id[0]);
   assert.deepEqual(db_res.data.length ,1);
   db_res.client.release();

   db_res = await issues_query.add_votes(pool,test_issue,test_voter_id[1]);
   assert.deepEqual(db_res.data.length ,1);
   db_res.client.release();

   db_res = await issues_query.add_votes(pool,test_issue,test_voter_id[2]);
   assert.deepEqual(db_res.data.length ,1);
   db_res.client.release();
}

async function should_have_three_votes(pool){
   let db_res = await issues_query.count_votes(pool,test_issue); 
   assert.deepEqual(db_res.data,3);
   db_res.client.release();
}

async function should_list_voted_issues(pool){
   let db_res = await users_query.voted_issues(pool,test_voter_id[0]);
   console.log("user: " + test_voter_id[0] + " voted for: ");
   console.log(db_res.data);
   assert.deepEqual(db_res.data.length,1);
   db_res.client.release();
}

async function should_filter_issues(pool){
   let db_res = await issues_server.filter_issues(pool,'TESTDATA');
   assert.deepEqual(db_res.data.length,1);
   db_res.client.release();
}

let pool = db_host.open_db();
await delete_test_data(pool);
await make_test_data(pool);
await should_find_data(pool);
await should_add_vote(pool);
await should_have_three_votes(pool);
await should_list_voted_issues(pool);
await should_filter_issues(pool);
await should_delete_test_data(pool);
await db_host.close_db(pool);
console.log("TESTS PASSED");
