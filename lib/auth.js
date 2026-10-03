import crypto from 'crypto'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { db } from './db'
const name='petshop_session'
function sign(v){return crypto.createHmac('sha256',process.env.SESSION_SECRET||'change-me').update(v).digest('hex')}
export async function setSession(id){const c=await cookies();const v=String(id);c.set(name,`${v}.${sign(v)}`,{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/',maxAge:60*60*12})}
export async function clearSession(){(await cookies()).delete(name)}
export async function currentUser(){
 const raw=(await cookies()).get(name)?.value;if(!raw)return null
 const [id,sig]=raw.split('.');if(!id||!sig||sig!==sign(id))return null
 const {data}=await db().from('users').select('*').eq('user_id',id).eq('status','Active').maybeSingle();return data||null
}
export async function requireUser(){const u=await currentUser();if(!u)redirect('/login');return u}
export async function requireAdmin(){const u=await requireUser();if(u.role!=='Administrator')redirect('/dashboard');return u}
