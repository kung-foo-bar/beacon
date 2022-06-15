import *  as issue_db from '../../db_query/issues/query_db.js';

export async function get_within_period(pool,date){
   const client = await pool.connect();
   let query = {
      text: "SELECT * FROM issues WHERE log_time >= $1",
      values: [date]
   };

   let raw_data = await client.query(query);
   return {client: client,data: raw_data.rows};
}

export async function filter_issues(pool,type){
   const client = await pool.connect();
   let query = {
      text: 'SELECT * FROM Issues where issue_type = $1',
      values: [type]
   };

   let raw_data = await client.query(query);
   return {client: client, data: raw_data.rows};
}
