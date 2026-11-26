"use strict";
function createStore(){
 const products=[
 {id:"phone",name:"iPhone 17 Pro",category:"Phones",price:69999,image:"iphone-img1.jpeg",description:"Smartphone with a triple-camera design."},
 {id:"laptop",name:"HP Victus",category:"Computers",price:149999,image:"hp-laptop.jpeg",description:"Gaming laptop with RTX graphics and 16GB RAM."},
 {id:"headphones",name:"Wireless Headphones",category:"Audio",price:19999,image:"headphone.jpeg",description:"Wireless noise-cancelling headphones."},
 {id:"watch",name:"Smart Watch Series 5",category:"Wearables",price:24999,image:"img4.jpeg",description:"Fitness-focused smartwatch with GPS."},
 {id:"tablet",name:"10-inch Tablet",category:"Computers",price:34999,image:"img5.png",description:"Lightweight tablet with 64GB storage."},
 {id:"speaker",name:"Bluetooth Speaker",category:"Audio",price:12999,image:"img6.jpeg",description:"Portable wireless speaker."},
 {id:"camera",name:"Digital Camera 4K",category:"Cameras",price:59999,image:"img7.jpeg",description:"Digital camera with optical zoom."}];
 const find=id=>products.find(p=>p.id===id);
 function normalize(raw){const out=new Map();if(Array.isArray(raw))for(const row of raw){if(!row||!find(row.id)||!Number.isInteger(row.qty)||row.qty<1)continue;out.set(row.id,Math.min(99,(out.get(row.id)||0)+row.qty));}return Array.from(out,([id,qty])=>({id,qty}));}
 function change(raw,id,delta){const rows=normalize(raw);if(!find(id)||!Number.isInteger(delta))return rows;const old=rows.find(r=>r.id===id)?.qty||0;const qty=Math.min(99,Math.max(0,old+delta));return rows.filter(r=>r.id!==id).concat(qty?[{id,qty}]:[]);}
 function totals(raw){const rows=normalize(raw);const count=rows.reduce((n,r)=>n+r.qty,0);const subtotal=rows.reduce((n,r)=>n+find(r.id).price*r.qty,0);const shipping=count?999:0;const tax=Math.round(subtotal*8/100);return {count,subtotal,shipping,tax,total:subtotal+shipping+tax};}
 function filter(query="",category="All",sort="featured"){const q=String(query).trim().toLowerCase();const result=products.filter(p=>(category==="All"||p.category===category)&&(p.name+" "+p.description).toLowerCase().includes(q));if(sort==="low")result.sort((a,b)=>a.price-b.price);if(sort==="high")result.sort((a,b)=>b.price-a.price);return result;}
 return {products,find,normalize,change,totals,filter};
}
if(typeof module!=="undefined"&&module.exports)module.exports={createStore};

if(typeof document!=="undefined")document.addEventListener("DOMContentLoaded",()=>{
const store=createStore(),key="myshop-cart-v2",get=id=>document.getElementById(id),money=n=>new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(n/100);
let cart=[];try{cart=store.normalize(JSON.parse(localStorage.getItem(key)||"[]"))}catch{}
const node=(tag,text,cls)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;};
const notify=text=>{get("notice").textContent=text;};
function persist(){try{localStorage.setItem(key,JSON.stringify(cart))}catch{notify("Browser storage is unavailable; cart changes are temporary.");}renderCart();}
function button(label,fn,cls){const b=node("button",label,cls);b.type="button";b.addEventListener("click",fn);return b;}
function image(p){const i=node("img");i.src=p.image;i.alt=p.name;i.loading="lazy";return i;}
function renderProducts(){const grid=get("catalogue");if(!grid)return;const list=document.body.dataset.page==="home"?store.products.slice(0,3):store.filter(get("search").value,get("category").value,get("sort").value);
grid.replaceChildren();if(get("result-count"))get("result-count").textContent=list.length+" products";if(!list.length)grid.append(node("p","No products match your filters."));
for(const p of list){const card=node("article",undefined,"product-card"),details=node("div",undefined,"product-info");details.append(node("p",p.category,"kicker"),node("h2",p.name),node("p",p.description,"muted"),node("strong",money(p.price),"price"),button("Add to cart",()=>{cart=store.change(cart,p.id,1);persist();notify(p.name+" added to your cart.");},"button"));card.append(image(p),details);grid.append(card);}}
function renderCart(){const sums=store.totals(cart),link=get("cart-link");if(link)link.textContent="Cart ("+sums.count+")";const list=get("cart-items");if(!list)return;list.replaceChildren();if(!cart.length){const box=node("div",undefined,"panel");box.append(node("h2","Your cart is empty"),node("p","Explore the catalogue to add devices."));const a=node("a","Browse products","button");a.href="products.html";box.append(a);list.append(box);}
for(const row of cart){const p=store.find(row.id),card=node("article",undefined,"cart-item"),detail=node("div");detail.append(node("h2",p.name),node("p",money(p.price)+" each","muted"),node("strong",money(p.price*row.qty)));const controls=node("div",undefined,"quantity");for(const [label,delta] of [["−",-1],["+",1]]){const b=button(label,()=>{cart=store.change(cart,row.id,delta);persist();});b.setAttribute("aria-label",(delta<0?"Decrease ":"Increase ")+p.name+" quantity");controls.append(b);if(delta<0)controls.append(node("span",String(row.qty)));}controls.append(button("Remove",()=>{cart=cart.filter(r=>r.id!==row.id);persist();}));detail.append(controls);card.append(image(p),detail);list.append(card);}
for(const k of ["subtotal","shipping","tax","total"])get(k+"-value").textContent=money(sums[k]);get("checkout").disabled=!sums.count;}
for(const id of ["search","category","sort"]){const input=get(id);if(input)input.addEventListener(id==="search"?"input":"change",renderProducts);}
const checkout=get("checkout");if(checkout)checkout.addEventListener("click",()=>{if(!store.totals(cart).count)return;notify("Demo checkout complete. No order was placed and no payment was collected. Your cart has been retained.");});
renderProducts();renderCart();
});
