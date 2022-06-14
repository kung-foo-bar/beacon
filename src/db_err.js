export const PG_ERR_DUP = Symbol('input was a duplicate key');
export const PG_ERR_NONE = Symbol('everything is okay');
export const PG_ERR_UNKOWN = Symbol('good luck');
export function get_db_err(err){
   if(err.detail.includes("Key") && err.detail.includes("already exists")) return PG_ERR_DUP;
   return PG_ERR_UNKOWN;
}
