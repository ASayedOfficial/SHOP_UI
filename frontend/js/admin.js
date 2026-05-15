const API='http://localhost:5000/api/products';
const form=document.getElementById('form');
const list=document.getElementById('list');
let editId=null;
async function load(){
 const data=await fetch(API).then(r=>r.json());
 list.innerHTML=data.map(p=>`
 <div>
 ${p.name} - $${p.price}
 <button onclick="edit('${p._id}')">Edit</button>
 <button onclick="del('${p._id}')">Delete</button>
 </div>`).join('');
 window.cache=data;
}
form.onsubmit=async(e)=>{
 e.preventDefault();
 const body={name:name.value,price:+price.value,category:category.value,images:[image.value]};
 if(editId){await fetch(API+'/'+editId,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});editId=null;}
 else{await fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});}
 form.reset();load();
};
window.del=async(id)=>{await fetch(API+'/'+id,{method:'DELETE'});load();}
window.edit=(id)=>{const p=cache.find(x=>x._id===id);name.value=p.name;price.value=p.price;category.value=p.category;image.value=p.images?.[0]||'';editId=id;}
load();