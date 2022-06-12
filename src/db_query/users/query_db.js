export function User(name,num){
   return {name: name, num: num};
}
export async function insert_users(pool,user){
   if(!user){
      console.log("null user");
      return null;
   }

   if(!user.name){
      console.log("null user id");
      return null;
   }

   if(!user.num){
      console.log("null user num");
      return null;
   }

   const client = await pool.connect();
   const query = {
      text: "INSERT INTO users(user_id,ph_number) VALUES($1, $2) RETURNING *",
      values: [user.name,user.num]
   };
   let raw_data = await pool.query(query);
   return {client: client, data: raw_data.rows};
}

export async function select_users(pool,key,value){
   const client = await pool.console();
   let raw_data = await pool.query('SELECT * FROM users');
   return {client: client, data: raw_data.rows};
}

