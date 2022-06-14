import * as users_query from '../../src/db_query/users/query_db.js';
import * as issues_query from '../../src/db_query/issues/query_db.js';
import * as db_host from '../../src/db_host.js';
import {strict as assert} from 'node:assert';

let test_user = {user_id: 'TEST-USER', num: '00000000'};
let test_user_asignee = {user_id: 'TEST-ASIGNEE', num: '111111111'};

let test_user_issues = {
   title: 'test-user-issue', 
   msg: 'test-user-msg', 
   type: 'TESTDATA',
   creator_id: test_user.user_id,
   asignee_id: test_user_asignee.user_id
};

async function delete_test_data(pool){
   let db_res = await users_query.delete_users(pool,test_user.user_id);
   db_res.client.release();
   db_res = await users_query.delete_users(pool,test_user_asignee.user_id);
   db_res.client.release();
}

async function should_make_test_user(pool){
   console.log(test_user.user_id);
   let db_res = await users_query.insert_users(pool,test_user);
   assert.deepEqual(db_res.data.length,1);
   db_res.client.release();

   db_res = await users_query.insert_users(pool,test_user_asignee);
   assert.deepEqual(db_res.data.length,1);
   db_res.client.release();

   db_res = await issues_query.insert_issues(pool,test_user_issues);
   assert.deepEqual(db_res.data.length,1,"can insert user issue");
   db_res.client.release();

}

async function should_list_users_posts(pool){
   let db_res = await users_query.created_issues(pool,test_user.user_id);
   assert.deepEqual(db_res.data.length,1);
   db_res.client.release();
}

async function should_delete_user(pool){
   let db_res = await users_query.delete_users(pool,test_user.user_id);
   assert.deepEqual(db_res.data.length,1);
   db_res.client.release();

   db_res = await users_query.delete_users(pool,test_user_asignee.user_id);
   assert.deepEqual(db_res.data.length,1);
   db_res.client.release();
}

async function assert_user_posts_are_deleted(pool){
   let db_res = await users_query.created_issues(pool,test_user.user_id);
   assert.deepEqual(db_res.data.length,0);
   db_res.client.release();

   db_res = await users_query.created_issues(pool,test_user_asignee.user_id);
   assert.deepEqual(db_res.data.length,0);
   db_res.client.release();
}

let pool = db_host.open_db(); 
await delete_test_data(pool);
await should_make_test_user(pool);
await should_list_users_posts(pool);
await should_delete_user(pool);
await assert_user_posts_are_deleted(pool);
await db_host.close_db(pool);
console.log("TESTS PASSED");
