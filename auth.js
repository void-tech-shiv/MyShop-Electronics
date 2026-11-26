"use strict";
document.addEventListener("DOMContentLoaded",()=>{
const key="myshop-demo-profile-v2",get=id=>document.getElementById(id);let name="";
try{name=sessionStorage.getItem(key)||"";for(const k of ["myshop_auth_v1","myshop_user_v1","myshop_login_time_v1"])sessionStorage.removeItem(k)}catch{}
const welcome=get("welcome-msg"),logout=get("logout-link");if(welcome)welcome.textContent=name?"Hi, "+name:"";if(logout){logout.hidden=!name;logout.addEventListener("click",()=>{try{sessionStorage.removeItem(key)}catch{}location.href="index.html";});}
const form=get("login-form");if(form)form.addEventListener("submit",e=>{e.preventDefault();const value=get("username").value.trim().slice(0,40);if(!value){get("notice").textContent="Enter a display name.";return;}try{sessionStorage.setItem(key,value)}catch{get("notice").textContent="Session storage is unavailable. Browse as a guest.";return;}location.href="index.html";});
const contact=get("contact-form");if(contact)contact.addEventListener("submit",e=>{e.preventDefault();get("notice").textContent="Demo form validated. No message was sent.";contact.reset();});
});
