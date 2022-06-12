import * as db_host from '../../db_host.js'

export function Issue(title,msg,type,creator_id,asignee_id){
   return {title: title,msg: msg,type: type,creator_id: creator_id,asignee_id: asignee_id};
}
export async function insert_issues(pool,issue){
   const client = await pool.connect();
   const time_now  = new Date();
   const votes = 0;
   const query = {
      text: "INSERT INTO issues(title,msg,log_time,issue_type,creator_id,asignee_id,votes) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *",
      values: [
         issue.title,
         issue.msg,
         time_now,
         issue.type,
         issue.creator_id,
         issue.asignee_id,
         votes
      ]
   };
   let raw_data = await client.query(query);
   return {client: client,data: raw_data.rows}
}

export async function select_issues(pool,key,value){
   const client = await pool.connect();
   let raw_data = await pool.query('SELECT * FROM issues');
   return {client: client, data: raw_data.rows};
}


export async function add_votes(pool,issue,increment){
   const client = await pool.connect();
   const query = {
      text: 'UPDATE issues set votes = votes + $4 WHERE title = $1 AND creator_id = $2 AND asignee_id = $3 RETURNING *',
      values: [issue.title,issue.creator_id,issue.asignee_id,increment]
   }; 

   let raw_data = await client.query(query);
   return {client: client, data: raw_data.rows};
}

export async function delete_issue(pool,issue){
   const client = await pool.connect();
   const query = {
      text: 'DELETE FROM issues WHERE title = $1 AND creator_id = $2 AND asignee_id = $3 RETURNING *',
      values: [issue.title, issue.creator_id, issue.asignee_id]
   };

   let raw_data = await client.query(query);
   return {client: client, data: raw_data.rows};
}

