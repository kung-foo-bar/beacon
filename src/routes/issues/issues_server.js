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
