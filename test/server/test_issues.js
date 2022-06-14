import * as db_host from '../../src/db_host.js';
import * as db_err from '../../src/db_err.js';
import * as issues_query from '../../src/db_query/issues/query_db.js';
import {strict as assert} from 'node:assert';

const test_issue = {
   title: 'test',
   msg: 'test-msg',
   type: 'TESTDATA',
   creator_id: 'Aira',
   asignee_id: 'LE BOSS'
 }
const test_voter_id = 'Paigen';
const test_key = [test_issue[0],test_issue[4],test_issue[5]];


async function make_test_data(pool){

   let db_res = await issues_query.insert_issues(pool,test_issue);
   console.log(db_res.data);
   assert.deepEqual(db_res.data.length,1);
}


async function should_delete_test_data(pool){
   let db_res = await issues_query.delete_issue(pool,test_issue);
   assert.deepEqual(db_res.data.length,1);
}

async function delete_test_data(pool){
   let db_res = await issues_query.delete_issue(pool,test_issue);
   console.log("deleted");
   console.log(db_res.data);
   db_res.client.release();
}

async function should_add_vote(pool){
   let db_res = await issues_query.add_votes(pool,test_issue,test_voter_id);
   assert (db_res.data.length ,1);
}

let pool = db_host.open_db();
await delete_test_data(pool);
await make_test_data(pool);
await should_add_vote(pool);
await should_delete_test_data(pool);
await db_host.close_db(pool);
console.log("TESTS PASSED");
process.exit();
