"use client";
import {useEffect,useState} from "react";

type ITUser={id:string;name:string;email:string;role:string;active:boolean};

export default function AssigneeSelect({value,onChange,disabled}:{value:string;onChange:(value:string)=>void;disabled?:boolean}){
 const [users,setUsers]=useState<ITUser[]>([]),[loading,setLoading]=useState(false),[error,setError]=useState("");
 useEffect(()=>{
  if(disabled)return;
  let alive=true;
  setLoading(true);
  fetch("/api/admin/users",{cache:"no-store"})
   .then(async r=>{const j=await r.json();if(!r.ok)throw new Error(j.error||"Không tải được danh sách IT");return j})
   .then(j=>{if(alive)setUsers((j.users||[]).filter((u:ITUser)=>u.role==="it"&&u.active!==false))})
   .catch(e=>{if(alive)setError(e instanceof Error?e.message:"Không tải được danh sách IT")})
   .finally(()=>{if(alive)setLoading(false)});
  return()=>{alive=false};
 },[disabled]);
 return <>
  <select disabled={disabled||loading} value={value} onChange={e=>onChange(e.target.value)}>
   <option value="">{loading?"Đang tải nhân sự CNTT...":"-- Chọn nhân sự CNTT --"}</option>
   {users.map(u=><option key={u.id} value={u.email}>{u.name} · {u.email}</option>)}
  </select>
  {error&&<small className="field-error">{error}</small>}
 </>;
}
