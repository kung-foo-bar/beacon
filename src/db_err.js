export const PG_ERR_DUP = Symbol('input was a duplicate key');
get_db_err(err){
   if(err.detail.includes("Key") && err.detail.includes("already exists")) return PG_ERR_DUP;
}
