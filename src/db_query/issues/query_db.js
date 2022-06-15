import * as db_host from '../../db_host.js'

export function Issue(title,msg,type,creator_id,asignee_id){
   return {title: title,msg: msg,type: type,creator_id: creator_id,asignee_id: asignee_id};
}

export async function insert_issues(pool,issue){
   const client = await pool.connect();
   const time_now  = new Date();
   const query = {
      text: "INSERT INTO issues(title,msg,log_time,issue_type,creator_id,asignee_id) VALUES($1,$2,$3,$4,$5,$6) RETURNING *",
      values: [
         issue.title,
         issue.msg,
         time_now,
         issue.type,
         issue.creator_id,
         issue.asignee_id
      ]
   };
   let raw_data = await client.query(query);
   return {client: client,data: raw_data.rows}
}

export async function select_issues(pool){
   const client = await pool.connect();
   let raw_data = await client.query('SELECT * FROM issues');
   return {client: client, data: raw_data.rows};
}

export async function count_votes(pool,issue){
   const client = await pool.connect(); 
   const query = {
      text: 'SELECT COUNT(*) AS \"n_votes\" FROM Votes where post_title = $1 AND post_creator_id = $2 AND  post_asignee_id = $3',
      values: [issue.title, issue.creator_id, issue.asignee_id]
   }
   let raw_data = await client.query(query);
   return {client: client, data: parseInt(raw_data.rows[0].n_votes)};
}

export async function add_votes(pool,issue,voter_id){
   const client = await pool.connect();
   const query = {
      text: 'INSERT INTO Votes (post_title,post_creator_id,post_asignee_id,voter_id) Values($1,$2,$3,$4) RETURNING *',
      values: [issue.title,issue.creator_id,issue.asignee_id,voter_id]
   }; 

   let raw_data = await client.query(query);
   return {client: client, data: raw_data.rows};
}

export async function remove_vote(pool,issue,voter_id){
   const client = await pool.connect();
   const query = {
      text: 'DELETE FROM Votes where post_title = $1 AND post_creator_id = $2 AND post_asignee_id = $3 AND voter_id = $4 RETURNING *',
      values: [issue.title, issue.creator_id, issue.asignee_id, voter_id]
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

