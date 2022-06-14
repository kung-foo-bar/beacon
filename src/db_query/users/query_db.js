export function User(name,num){
   return {user_id: name, num: num};
}

export async function insert_users(pool,user){
   const client = await pool.connect();
   const query = {
      text: "INSERT INTO users(user_id,ph_number) VALUES($1, $2) RETURNING *",
      values: [user.user_id,user.num]
   };
   let raw_data = await pool.query(query);
   return {client: client, data: raw_data.rows};
}

export async function select_users(pool){
   const client = await pool.connect();
   let raw_data = await pool.query('SELECT * FROM users');
   return {client: client, data: raw_data.rows};
}

export async function  delete_users(pool,user_id){
   const client = await pool.connect();
   let query = {
      text: 'DELETE FROM Users WHERE user_id = $1 RETURNING *',
      values: [user_id]
   };

   let raw_data = await client.query(query);
   return {client: client,data: raw_data.rows};
}

export async function created_issues(pool,user_id){
   const client = await pool.connect();
   let query = {
      text: 'SELECT * FROM Issues where creator_id = $1',
      values: [user_id]
   };

   let raw_data = await client.query(query);
   return {client: client, data: raw_data.rows};
}

export async function voted_issues(pool,user_id){
   const client = await pool.connect();
   let query = {
      text: 'SELECT post_title AS \"title\" ,post_creator_id AS \"creator_id\",post_asignee_id AS \"asignee_id\" FROM votes WHERE voter_id = $1',
      values: [user_id]
   };
   let raw_data = await client.query(query);
   return {client: client, data: raw_data.rows};
}

