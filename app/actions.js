'use server'
import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { setSession,clearSession,requireAdmin,requireUser } from '@/lib/auth'

export async function setupAdmin(fd){
 const D=db();const {count}=await D.from('users').select('*',{count:'exact',head:true});if(count>0)redirect('/login')
 const username=String(fd.get('username')||'').trim(), password=String(fd.get('password')||''), full_name=String(fd.get('full_name')||'').trim()
 if(!username||password.length<6||!full_name)redirect('/setup?error=Fill+all+fields+and+use+6%2B+password')
 const hash=await bcrypt.hash(password,10);const {data,error}=await D.from('users').insert({username,password:hash,full_name,role:'Administrator',status:'Active'}).select().single()
 if(error)redirect('/setup?error='+encodeURIComponent(error.message));await setSession(data.user_id);redirect('/dashboard')
}
export async function login(fd){
 const username=String(fd.get('username')||'').trim(),password=String(fd.get('password')||'')
 const {data:u}=await db().from('users').select('*').eq('username',username).eq('status','Active').maybeSingle()
 if(!u||!(await bcrypt.compare(password,u.password)))redirect('/login?error=Invalid+login')
 await setSession(u.user_id);redirect('/dashboard')
}
export async function logout(){await clearSession();redirect('/login')}
export async function addOwner(fd){await requireUser();await db().from('customers').insert({customer_code:'OWN-'+Date.now(),full_name:fd.get('full_name'),phone:fd.get('phone')||null,email:fd.get('email')||null,address:fd.get('address')||null});revalidatePath('/owners')}
export async function addPet(fd){await requireUser();await db().from('pets').insert({pet_code:'PET-'+Date.now(),customer_id:Number(fd.get('customer_id')),pet_name:fd.get('pet_name'),species:fd.get('species')||null,breed:fd.get('breed')||null,gender:fd.get('gender')||'Unknown',health_status:fd.get('health_status')||'Healthy'});revalidatePath('/pets')}
export async function addConfinement(fd){const u=await requireUser();await db().from('confinements').insert({pet_id:Number(fd.get('pet_id')),customer_id:Number(fd.get('customer_id')),admission_date:new Date().toISOString(),expected_discharge_date:fd.get('expected_discharge_date')||null,kennel_cage:fd.get('kennel_cage')||null,status:'Admitted',reason:fd.get('reason'),veterinary_notes:fd.get('veterinary_notes')||null,created_by:u.user_id});revalidatePath('/confinement')}
export async function discharge(fd){await requireUser();await db().from('confinements').update({status:'Discharged',actual_discharge_date:new Date().toISOString()}).eq('confinement_id',Number(fd.get('id')));revalidatePath('/confinement')}
export async function addCategory(fd){await requireAdmin();await db().from('categories').insert({category_name:fd.get('category_name'),description:fd.get('description')||null});revalidatePath('/categories')}
export async function addSupplier(fd){await requireAdmin();await db().from('suppliers').insert({supplier_code:'SUP-'+Date.now(),supplier_name:fd.get('supplier_name'),contact_person:fd.get('contact_person')||null,phone:fd.get('phone')||null,email:fd.get('email')||null,address:fd.get('address')||null});revalidatePath('/suppliers')}
export async function addProduct(fd){await requireAdmin();const D=db();const {data:p,error}=await D.from('products').insert({sku:fd.get('sku'),product_name:fd.get('product_name'),category_id:Number(fd.get('category_id')),supplier_id:fd.get('supplier_id')?Number(fd.get('supplier_id')):null,unit:fd.get('unit')||'Piece',cost_price:Number(fd.get('cost_price')||0),selling_price:Number(fd.get('selling_price')||0),reorder_level:Number(fd.get('reorder_level')||0),status:'Active'}).select().single();if(!error)await D.from('inventory').insert({product_id:p.product_id,quantity:0});revalidatePath('/products')}
export async function setStock(fd){const u=await requireAdmin();const D=db(),pid=Number(fd.get('product_id')),qty=Math.max(0,Number(fd.get('quantity')));const {data:i}=await D.from('inventory').select('*').eq('product_id',pid).single();await D.from('inventory').update({quantity:qty}).eq('product_id',pid);await D.from('inventory_movements').insert({product_id:pid,movement_type:'SET',quantity:Math.abs(qty-(i?.quantity||0)),previous_quantity:i?.quantity||0,new_quantity:qty,notes:'Inventory adjustment',created_by:u.user_id});revalidatePath('/inventory')}
export async function createSale(fd){const u=await requireUser();const D=db();const pid=fd.get('product_id')?Number(fd.get('product_id')):null,qty=Math.max(1,Number(fd.get('quantity')||1)),discount=Math.max(0,Number(fd.get('discount')||0));let subtotal=Number(fd.get('service_amount')||0),product=null,inv=null
 if(pid){({data:product}=await D.from('products').select('*').eq('product_id',pid).single());({data:inv}=await D.from('inventory').select('*').eq('product_id',pid).single());if(!product||!inv||inv.quantity<qty)redirect('/sales?error=Insufficient+stock');subtotal=Number(product.selling_price)*qty}
 const total=Math.max(0,subtotal-discount),paid=Number(fd.get('amount_paid')||0);if(paid<total)redirect('/sales?error=Amount+paid+is+too+low')
 const invoice='INV-'+Date.now();const {data:s,error}=await D.from('sales').insert({invoice_number:invoice,customer_id:fd.get('customer_id')?Number(fd.get('customer_id')):null,sold_by:u.user_id,service_type:fd.get('service_type')||'Product Sale',service_description:fd.get('service_description')||null,subtotal,discount,total_amount:total,payment_method:fd.get('payment_method')||'Cash',reference_number:fd.get('reference_number')||null,amount_paid:paid,change_amount:paid-total,status:'Completed'}).select().single()
 if(error)redirect('/sales?error='+encodeURIComponent(error.message))
 if(pid){await D.from('sale_items').insert({sale_id:s.sale_id,product_id:pid,quantity:qty,unit_price:product.selling_price,discount:0,line_total:subtotal});await D.from('inventory').update({quantity:inv.quantity-qty}).eq('product_id',pid);await D.from('inventory_movements').insert({product_id:pid,movement_type:'OUT',quantity:qty,previous_quantity:inv.quantity,new_quantity:inv.quantity-qty,notes:'Sale '+invoice,created_by:u.user_id})}
 redirect('/receipt/'+s.sale_id)
}
export async function createAccount(fd){await requireAdmin();const password=String(fd.get('password')||'');if(password.length<6)return;await db().from('users').insert({username:fd.get('username'),password:await bcrypt.hash(password,10),full_name:fd.get('full_name'),role:fd.get('role')||'Staff',status:'Active'});revalidatePath('/settings')}
