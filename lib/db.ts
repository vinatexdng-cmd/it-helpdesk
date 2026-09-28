import {Pool} from "pg";

let pool:Pool|undefined;

function normalizeDatabaseUrl(raw:string){
 try{
  const url=new URL(raw);
  // pg-connection-string warns that sslmode=require semantics will change in v3.
  // Keep the current node-postgres behavior explicit for Neon Production.
  const sslMode=url.searchParams.get("sslmode");
  if(sslMode==="require"||sslMode==="prefer"||sslMode==="verify-ca"){
   url.searchParams.set("sslmode","verify-full");
  }
  return url.toString();
 }catch{
  return raw;
 }
}

export function getPool(){
 if(!process.env.DATABASE_URL)throw new Error("DATABASE_URL is not configured");
 if(!pool){
  pool=new Pool({
   connectionString:normalizeDatabaseUrl(process.env.DATABASE_URL),
   max:5
  });
 }
 return pool;
}
