/* ===== SAMPLE DATA (fictional; replaced automatically when API_URL is set) ===== */
let DATA = {
  announcements:[
    {id:"A1",title:"Annual General Body Meeting",category:"Meeting",description:"The AGM will be held at the community hall. All members are requested to attend and bring their membership details.",published_at:"2026-10-20",expires_at:"2026-12-31"},
    {id:"A2",title:"Water tank cleaning schedule",category:"Notice",description:"Overhead tank cleaning will take place this weekend. Please store water in advance.",published_at:"2026-10-18",expires_at:"2026-11-30"},
    {id:"A3",title:"Waste segregation drive",category:"Community",description:"Dry and wet waste must be segregated at source. Collection timings remain unchanged.",published_at:"2026-10-10",expires_at:""}],
  events:[
    {id:"E1",title:"Deepavali Community Celebration",description:"Cultural programmes, rangoli and sweets for all residents.",event_date:"2026-11-08",start_time:"17:30",venue:"Community Park",status:"published"},
    {id:"E2",title:"Health Check-up Camp",description:"Free basic health screening in partnership with a local clinic.",event_date:"2026-11-22",start_time:"09:00",venue:"Community Hall",status:"published"},
    {id:"E3",title:"Independence Day Flag Hoisting",description:"Flag hoisting and children’s programmes.",event_date:"2026-08-15",start_time:"08:00",venue:"Community Park",status:"published"},
    {id:"E4",title:"Tree Plantation Drive",description:"Cancelled due to forecast rain; to be rescheduled.",event_date:"2026-09-05",start_time:"07:30",venue:"Main Road",status:"cancelled"}],
  gallery:[
    {id:"G1",title:"Deepavali 2025",category:"Festivals",alt:"Residents lighting lamps"},
    {id:"G2",title:"Annual Day",category:"Events",alt:"Stage programme"},
    {id:"G3",title:"Park Clean-up",category:"Community",alt:"Volunteers cleaning the park"},
    {id:"G4",title:"Sports Day",category:"Events",alt:"Children running a race"},
    {id:"G5",title:"Tree Plantation",category:"Community",alt:"Saplings being planted"},
    {id:"G6",title:"Ganesha Festival",category:"Festivals",alt:"Festival decorations"}],
  committee:[
    {id:"C1",name:"Sample Name 1",designation:"President",term:"2025–2027"},
    {id:"C2",name:"Sample Name 2",designation:"Secretary",term:"2025–2027"},
    {id:"C3",name:"Sample Name 3",designation:"Treasurer",term:"2025–2027"},
    {id:"C4",name:"Sample Name 4",designation:"Joint Secretary",term:"2025–2027"}],
  houses:[1,2,3,4,5,6,7,8,9,10,11,12].map(n=>({house_id:"WSN-"+String(n).padStart(3,"0"),house_number:String(n),owner_display_name:["R. Sample","S. Example","K. Demo","M. Placeholder","T. Sample","A. Example","P. Demo","V. Placeholder","N. Sample","L. Example","D. Demo","G. Placeholder"][n-1],block:n<=6?"Block A":"Block B",street_or_lane:n<=6?"1st Cross":"2nd Cross",property_type:"Residential",x:0,y:0,status:"active"})),
  isSample:true
};
const PAGES=[["home","Home"],["about","About"],["bylaws","Bylaws"],["announcements","Notices"],["events","Events"],["gallery","Gallery"],["committee","Committee"],["map","House Map"],["contact","Contact"],["faq","FAQ"]];
const $=s=>document.querySelector(s), main=$("#main");
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fmt=d=>{const t=new Date(d);return isNaN(t)?"":t.toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})};
const today=()=>new Date().toISOString().slice(0,10);
const live=a=>(a||[]).filter(x=>!x.expires_at||x.expires_at>=today());
const sampleBanner=()=>DATA.isSample?'<p class="note">Showing sample demonstration data. Connect the Google Apps Script URL in the CONFIG block to display real association records.</p>':"";

const BYLAWS=[
["Preamble","Purpose, legal status, community welfare objectives."],
["Vision","Safe, clean, green, inclusive and transparent community."],
["Mission","Promote infrastructure, security, environment, transparency and resident participation."],
["Objectives","Roads, drainage, water, parks, security, waste management, health, education, culture, sports, liaison with GHMC and other agencies."],
["Membership","Eligibility, admission, fees, rights, responsibilities, resignation, removal."],
["General Body","Supreme authority; AGM annually; special meetings; quorum; voting."],
["Executive Committee","President, 2 Vice Presidents, General Secretary, Joint Secretary, Treasurer, 8–12 Executive Members, women/youth/senior representatives."],
["Roles","President: leadership; VP: support; Secretary: administration; Treasurer: accounts; Executive Members: implementation."],
["Elections","Independent election officer, nominations, scrutiny, secret ballot, 3-year tenure, max two consecutive terms for President (recommended)."],
["Finance","Membership fees, donations, grants, CSR, audits, annual budget, dual-signature bank operations, transparency."],
["Standing Committees","Finance, Infrastructure, Security, Environment, Women, Youth, Culture, Legal & Grievance."],
["Annual Activities","National days, plantation, health camps, sports, cultural events, cleanliness drives."],
["Code of Ethics","Integrity, transparency, non-discrimination, accountability, conflict-of-interest disclosure."],
["Dispute Resolution","Complaint committee, mediation, appeal."],
["Amendment & Dissolution","2/3 majority for amendments; dissolution as per applicable law."]];
const views={
home(){const up=DATA.events.filter(e=>e.event_date>=today()&&e.status!=="cancelled").sort((a,b)=>a.event_date.localeCompare(b.event_date)).slice(0,3);
return`<section class="hero"><h1>Welcome to West Srinivasa Nagar</h1><p>The official home of our residents’ association — stay informed about notices, events and community life.</p><p><a class="btn" href="#announcements">Latest notices</a> <a class="btn alt" style="color:#fff;border-color:#fff8" href="#map">Find a house</a></p><div class="stats"><div class="stat"><b>${DATA.houses.filter(h=>h.status!=="inactive").length}</b>Registered houses</div><div class="stat"><b>${up.length}</b>Upcoming events</div></div></section>
${sampleBanner()}<section class="sec"><h2>Latest announcements</h2>${list(live(DATA.announcements).slice(0,3),annCard)}</section>
<section class="sec"><h2>Upcoming events</h2>${list(up,evCard)}</section>
<section class="sec"><h2>Quick links</h2><div class="grid">${[["map","House map & directory"],["gallery","Photo gallery"],["committee","Committee"],["contact","Contact us"]].map(l=>`<a class="card" href="#${l[0]}"><h3>${l[1]} →</h3></a>`).join("")}</div></section>`},
about(){return`<h1>About the Association</h1><div class="card"><p>The West Srinivasa Nagar Association is a residents’ body working to keep our neighbourhood clean, safe and connected.</p><h3>Our objectives</h3><ul><li>Communicate timely notices and community updates</li><li>Organise festivals, cultural and civic events</li><li>Represent residents before civic authorities</li><li>Maintain shared spaces and promote civic responsibility</li></ul><p class="note">Association history and by-laws can be added here by the committee.</p></div>`},
announcements(){return`<h1>Announcements & Notices</h1>${sampleBanner()}${list(live(DATA.announcements).sort((a,b)=>b.published_at.localeCompare(a.published_at)),annCard)}`},
events(){const t=today(),s=(a,b)=>a.event_date.localeCompare(b.event_date);
return`<h1>Events & Activities</h1>${sampleBanner()}<h2>Upcoming</h2>${list(DATA.events.filter(e=>e.event_date>=t).sort(s),evCard)}<h2 class="sec">Past</h2>${list(DATA.events.filter(e=>e.event_date<t).sort((a,b)=>-s(a,b)),evCard)}`},
gallery(){const cats=["All",...new Set(DATA.gallery.map(g=>g.category))];const f=location.hash.split("-")[1]||"All";
const cols=["#12305a","#0f8b8d","#7a4b0f","#5b3a8c","#2f6b3a","#8a3b3b"];
return`<h1>Photo Gallery</h1>${sampleBanner()}<p>${cats.map(c=>`<a class="tag" style="margin-right:6px" href="#gallery-${encodeURIComponent(c)}">${esc(c)}</a>`).join("")}</p><div class="grid">${DATA.gallery.filter(g=>f==="All"||g.category===decodeURIComponent(f)).map((g,i)=>g.image_url?`<figure style="margin:0"><button class="gal" data-lb="${url(g.image_url)}" aria-label="Open photo: ${esc(g.title)}" style="padding:0;background:none;overflow:hidden"><img src="${url(g.image_url)}" alt="${esc(g.alt||g.title)}" loading="lazy" style="width:100%;height:100%;object-fit:cover"></button><figcaption>${esc(g.title)}</figcaption></figure>`:`<div class="gal" role="img" aria-label="${esc(g.alt||g.title)}" style="background:${cols[i%6]}">${esc(g.title)}<br><small>${esc(g.category)}</small></div>`).join("")}</div>`},
committee(){return`<h1>Committee</h1>${sampleBanner()}<div class="grid">${DATA.committee.map(m=>`<div class="card">${m.photo_url?`<img class="cimg" style="height:200px;object-position:top" src="${url(m.photo_url)}" alt="Photo of ${esc(m.name)}" loading="lazy">`:""}<h3>${esc(m.name)}</h3><span class="tag">${esc(m.designation)}</span><p class="meta">Term: ${esc(m.term||"")}</p>${m.public_contact?`<p>${esc(m.public_contact)}</p>`:""}</div>`).join("")}</div>`},
map(){return`<h1>House Map & Directory</h1><p><b>${DATA.houses.filter(h=>h.status!=="inactive").length}</b> registered houses.</p>
<p class="note">Schematic layout — not a surveyed map. Only association-approved details are shown; contact details are never public.</p>
<form id="hs" style="display:flex;gap:8px;margin:12px 0" role="search"><label for="q" class="skip">Search by house number or owner</label><input id="q" type="search" placeholder="Search house number or owner name" autocomplete="off"><button class="btn" type="submit">Search</button><button class="btn alt" type="button" id="rs">Reset</button></form>
<div id="msg" class="err" role="status" aria-live="polite"></div>
<div class="mapwrap"><svg class="map" viewBox="0 0 600 360" role="group" aria-label="Schematic house map">${mapSvg()}</svg><div class="card" id="panel" aria-live="polite"><h3>House details</h3><p class="meta">Hover, focus or tap a house to see details.</p></div></div>`},
bylaws(){const n=+(location.hash.split("-")[1]||0);
return`<h1>Model Constitution & Bylaws</h1><p><b>West Srinivas Nagar Colony Welfare Association</b></p><p class="note">This draft provides a comprehensive framework for a residents’ welfare association. It is a summary draft and is not final until adopted by the General Body.</p>
<p><button class="btn alt" type="button" onclick="document.querySelectorAll('#bl details').forEach(d=>d.open=true)">Expand all</button> <button class="btn alt" type="button" onclick="document.querySelectorAll('#bl details').forEach(d=>d.open=false)">Collapse all</button> <button class="btn" type="button" onclick="document.querySelectorAll('#bl details').forEach(d=>d.open=true);print()">Print / Save as PDF</button></p>
<div id="bl">${BYLAWS.map((b,i)=>`<details id="b${i+1}"${n===i+1?" open":""}><summary>${i+1}. ${esc(b[0])}</summary><p>${esc(b[1])}</p></details>`).join("")}</div>`},
contact(){return`<h1>Contact Us</h1><div class="grid" style="grid-template-columns:1fr 1fr"><div class="card"><h3>Association office</h3><p>${esc(CONFIG.ADDRESS)}</p><p><a href="mailto:${esc(CONFIG.EMAIL)}">${esc(CONFIG.EMAIL)}</a></p>${CONFIG.PHONE?`<p>${esc(CONFIG.PHONE)}</p>`:""}</div>
<form class="card" id="cf" novalidate><h3>Send an enquiry</h3><label for="n">Name *</label><input id="n" maxlength="80" autocomplete="name"><div class="err" id="en"></div>
<label for="e">Email *</label><input id="e" type="email" maxlength="120" autocomplete="email"><div class="err" id="ee"></div>
<label for="p">Phone (optional)</label><input id="p" type="tel" maxlength="15" autocomplete="tel"><div class="err" id="ep"></div>
<label for="c">Category</label><select id="c"><option>General</option><option>Maintenance</option><option>Event</option><option>Feedback</option></select>
<label for="m">Message *</label><textarea id="m" rows="4" maxlength="1000"></textarea><div class="err" id="em"></div>
<input id="hp" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px" aria-hidden="true">
<button class="btn" id="sb" type="submit">Send enquiry</button><p id="res" role="status" aria-live="polite"></p></form></div>`},
faq(){return`<h1>FAQ & Useful Links</h1>${[["How do I get association notices?","Visit the Notices page; the committee publishes all official announcements there."],["How can I update my house details?","Contact the committee using the contact form. Records are verified before publication."],["Is my phone number public?","No. Phone numbers and private details are never shown publicly."],["How do I book the community hall?","Send an enquiry under the Event category with your preferred date."]].map(f=>`<details><summary>${f[0]}</summary><p>${f[1]}</p></details>`).join("")}`}
};
function list(a,fn){return a.length?`<div class="grid">${a.map(fn).join("")}</div>`:'<div class="empty">Nothing to show right now.</div>'}
const url=u=>/^https:\/\//.test(u||"")?esc(u):"";
const annCard=a=>`<article class="card lift">${a.image_url?`<img class="cimg" src="${url(a.image_url)}" alt="" loading="lazy">`:""}<span class="tag">${esc(a.category)}</span><h3 style="margin-top:8px">${esc(a.title)}</h3><p>${esc(a.description)}</p>${a.attachment_url?`<p><a href="${url(a.attachment_url)}" target="_blank" rel="noopener">View attachment ↗</a></p>`:""}<p class="meta">Published ${fmt(a.published_at)}</p></article>`;
const evCard=e=>{const d=new Date(e.event_date),ok=!isNaN(d);return`<article class="card lift">${e.image_url?`<img class="cimg" src="${url(e.image_url)}" alt="Poster for ${esc(e.title)}" loading="lazy">`:""}${ok?`<div class="date"><b>${d.getDate()}</b><small>${d.toLocaleString("en-IN",{month:"short"})}</small></div>`:""}${e.status==="cancelled"?'<span class="tag x">Cancelled</span>':""}<h3>${esc(e.title)}</h3><p>${esc(e.description)}</p><p class="meta">${esc(e.start_time||"")} · ${esc(e.venue)}</p></article>`};
function pos(h,i){if(h.x&&h.y)return[+h.x,+h.y];const inB=h.block==="Block A"?0:1,k=DATA.houses.filter(z=>z.block===h.block).indexOf(h);return[40+inB*300+(k%3)*85,70+Math.floor(k/3)*120]}
function mapSvg(){let s='<text x="30" y="30" fill="var(--navy)" font-size="14" font-weight="700">Block A</text><text x="330" y="30" fill="var(--navy)" font-size="14" font-weight="700">Block B</text><line x1="295" y1="10" x2="295" y2="350" stroke="var(--line)" stroke-width="2" stroke-dasharray="6"/>';
DATA.houses.forEach((h,i)=>{const[x,y]=pos(h,i);s+=`<g class="house" tabindex="0" role="button" data-i="${i}" aria-label="House ${esc(h.house_number)}, ${esc(h.block)}"><rect x="${x}" y="${y}" width="70" height="60" rx="8"/><text x="${x+35}" y="${y+35}" text-anchor="middle">${esc(h.house_number)}</text></g>`});return s}
function showHouse(i,sticky){const h=DATA.houses[i];document.querySelectorAll(".house").forEach(g=>g.classList.toggle("sel",+g.dataset.i===i));
$("#panel").innerHTML=`<h3>House ${esc(h.house_number)}</h3><p class="meta">${esc(h.house_id)}</p><p><b>Owner:</b> ${esc(h.owner_display_name||"Not published")}</p><p><b>Location:</b> ${esc(h.block)}, ${esc(h.street_or_lane)}</p>${h.property_type?`<p><b>Type:</b> ${esc(h.property_type)}</p>`:""}`}
function bindMap(){const g=document.querySelectorAll(".house");
g.forEach(e=>{const i=+e.dataset.i;e.onmouseenter=e.onfocus=()=>showHouse(i);e.onclick=()=>showHouse(i,1);e.onkeydown=k=>{if(k.key==="Enter"||k.key===" "){k.preventDefault();showHouse(i,1)}}});
$("#hs").onsubmit=ev=>{ev.preventDefault();const q=$("#q").value.trim().toLowerCase();let first=-1;
g.forEach(e=>{const h=DATA.houses[+e.dataset.i],m=!q||h.house_number.toLowerCase()===q||h.house_id.toLowerCase()===q||(h.owner_display_name||"").toLowerCase().includes(q);e.classList.toggle("dim",!m);if(m&&first<0&&q)first=+e.dataset.i});
$("#msg").textContent=q&&first<0?"No matching house found.":"";if(first>=0)showHouse(first,1)};
$("#rs").onclick=()=>{$("#q").value="";g.forEach(e=>e.classList.remove("dim","sel"));$("#msg").textContent="";$("#panel").innerHTML='<h3>House details</h3><p class="meta">Hover, focus or tap a house to see details.</p>'}}
function bindContact(){let busy=false;$("#cf").onsubmit=async ev=>{ev.preventDefault();if(busy)return;
const v={name:$("#n").value.trim(),email:$("#e").value.trim(),phone:$("#p").value.trim(),category:$("#c").value,message:$("#m").value.trim()};
const E={n:v.name.length<2?"Please enter your name.":"",e:/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email)?"":"Enter a valid email address.",p:v.phone&&!/^[0-9+\-\s]{7,15}$/.test(v.phone)?"Enter a valid phone number.":"",m:v.message.length<10?"Please write at least 10 characters.":""};
for(const k in E)$("#e"+k).textContent=E[k];if(Object.values(E).some(Boolean)||$("#hp").value)return;
const r=$("#res");if(!CONFIG.API_URL){r.className="err";r.textContent="The enquiry service isn’t connected yet. Please email us directly.";return}
busy=true;$("#sb").disabled=true;r.className="";r.textContent="Sending…";
try{const x=await fetch(CONFIG.API_URL,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify({action:"contact",...v})});const j=await x.json();if(!j.success)throw 0;r.className="ok";r.textContent="Thank you! Your enquiry has been received.";$("#cf").reset()}catch{r.className="err";r.textContent="Sorry, we couldn’t send your enquiry. Please try again later."}busy=false;$("#sb").disabled=false}}
function route(){const id=(location.hash.slice(1).split("-")[0])||"home",v=views[id]?id:"home";main.innerHTML=views[v]();
document.title=(v==="home"?"":(PAGES.find(p=>p[0]===v)||[0,"Admin"])[1]+" · ")+"West Srinivasa Nagar Association";
document.querySelectorAll("#navlist a").forEach(a=>a.toggleAttribute("aria-current",a.getAttribute("href")==="#"+v)&&a.setAttribute("aria-current","page"));
$("#nav").classList.remove("open");$("#menu").setAttribute("aria-expanded","false");if(v==="map")bindMap();if(v==="contact")bindContact();if(v==="admin")bindAdmin();window.scrollTo(0,0)}
async function init(){$("#navlist").innerHTML=PAGES.map(p=>`<li><a href="#${p[0]}">${p[1]}</a></li>`).join("");$("#yr").textContent=new Date().getFullYear();
$("#fcontact").innerHTML=`<a href="mailto:${esc(CONFIG.EMAIL)}">${esc(CONFIG.EMAIL)}</a>`;
$("#menu").onclick=()=>{const o=$("#nav").classList.toggle("open");$("#menu").setAttribute("aria-expanded",o)};
$("#theme").onclick=()=>{const d=document.documentElement,dark=getComputedStyle(d).colorScheme==="dark";d.dataset.theme=dark?"light":"dark";try{localStorage.setItem("wsn-theme",d.dataset.theme)}catch{}};
try{const t=localStorage.getItem("wsn-theme");if(t)document.documentElement.dataset.theme=t}catch{}
if(CONFIG.API_URL){main.innerHTML='<div class="grid"><div class="sk"></div><div class="sk"></div><div class="sk"></div></div>';try{const r=await fetch(CONFIG.API_URL+"?action=all");const j=await r.json();if(j.success)DATA={...j.data,isSample:false}}catch{main.innerHTML='<p class="empty err">Unable to load data. Please refresh.</p>'}}
addEventListener("hashchange",route);route()}
/* ===== ADMIN (sign-in, add/hide content, uploads) ===== */
const ADM={tok:"",email:"",role:"",tab:"announcements"};
const FIELDS={
announcements:[["title","Title","text",1],["category","Category","select:Notice,Meeting,Community,Urgent"],["description","Description","area",1],["image_url","Image (optional)","up:image"],["attachment_url","PDF attachment (optional)","up:pdf"],["published_at","Publish date","date"],["expires_at","Expiry date (optional)","date"]],
events:[["title","Title","text",1],["description","Description","area"],["event_date","Date","date",1],["start_time","Start time","time"],["venue","Venue","text"],["image_url","Poster (optional)","up:image"]],
gallery:[["title","Title","text",1],["category","Category","select:Festivals,Events,Community,Other"],["alt","Short photo description","text"],["image_url","Photos (you can pick many)","up:image",1]],
committee:[["name","Name","text",1],["designation","Designation","text",1],["term","Term","text"],["public_contact","Public contact (only if approved)","text"],["photo_url","Photo (optional)","up:image"]],
houses:[["house_number","House number","text",1],["owner_display_name","Owner name (only if approved)","text"],["block","Block","text",1],["street_or_lane","Street / lane","text"],["property_type","Type","text"]]};
async function api(b){const r=await fetch(CONFIG.API_URL,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify({action:"admin",token:ADM.tok,...b})});const j=await r.json();if(!j.success)throw new Error(j.message);return j.data}
function toast(m){const t=$("#toast");t.textContent=m;t.style.display="block";clearTimeout(toast.t);toast.t=setTimeout(()=>t.style.display="none",3500)}
function shrink(f){return new Promise((ok,no)=>{if(f.type==="application/pdf"){const r=new FileReader();r.onload=()=>ok({mime:f.type,data:r.result.split(",")[1],name:f.name});r.onerror=no;r.readAsDataURL(f);return}
const i=new Image();i.onload=()=>{const k=Math.min(1,1600/Math.max(i.width,i.height)),c=document.createElement("canvas");c.width=Math.round(i.width*k);c.height=Math.round(i.height*k);c.getContext("2d").drawImage(i,0,0,c.width,c.height);ok({mime:"image/jpeg",data:c.toDataURL("image/jpeg",.82).split(",")[1],name:f.name.replace(/\.\w+$/,"")+".jpg"})};i.onerror=no;i.src=URL.createObjectURL(f)})}
views.admin=()=>'<h1>Committee Admin</h1><div id="adm"></div>';
function bindAdmin(){const a=$("#adm");
if(!CONFIG.API_URL||!CONFIG.GOOGLE_CLIENT_ID){a.innerHTML='<p class="note">Admin is not configured yet. Set API_URL and GOOGLE_CLIENT_ID in the CONFIG block.</p>';return}
if(ADM.tok)return panel();
a.innerHTML='<div class="card"><h3>Committee sign-in</h3><p>Sign in with your authorised Google account.</p><div id="gbtn"></div><p class="err" id="aerr" role="alert"></p></div>';
const go=()=>{if(!window.google){setTimeout(go,300);return}google.accounts.id.initialize({client_id:CONFIG.GOOGLE_CLIENT_ID,callback:async r=>{ADM.tok=r.credential;try{const d=await api({op:"whoami"});ADM.email=d.email;ADM.role=d.role;panel()}catch(e){ADM.tok="";$("#aerr").textContent=e.message==="Forbidden"?"This Google account is not authorised.":"Sign-in failed. Please try again."}}});google.accounts.id.renderButton($("#gbtn"),{theme:"outline",size:"large"})};go()}
async function panel(){const a=$("#adm"),tabs=ADM.role==="admin"?["announcements","events","gallery","committee","houses","enquiries"]:["announcements","events","gallery"];
if(!tabs.includes(ADM.tab))ADM.tab=tabs[0];const t=ADM.tab;
a.innerHTML=`<p class="meta">Signed in as ${esc(ADM.email)} (${esc(ADM.role)}) · <a href="#admin" id="so">Sign out</a></p><div class="tabs">${tabs.map(x=>`<button data-t="${x}" aria-pressed="${x===t}">${x[0].toUpperCase()+x.slice(1)}</button>`).join("")}</div><div id="ab"><div class="sk"></div></div>`;
a.querySelectorAll("[data-t]").forEach(b=>b.onclick=()=>{ADM.tab=b.dataset.t;panel()});
$("#so").onclick=e=>{e.preventDefault();ADM.tok="";bindAdmin()};
let rows=[];try{rows=await api({op:"list",sheet:t})}catch(e){ADM.tok="";bindAdmin();toast("Session expired. Please sign in again.");return}
const ab=$("#ab");
if(t==="enquiries"){ab.innerHTML=rows.map(r=>`<div class="card" style="margin:8px 0"><b>${esc(r.name)}</b> · ${esc(r.email)} ${esc(r.phone)}<br><span class="tag">${esc(r.category)}</span> <span class="meta">${esc(r.submitted_at)}</span><p>${esc(r.message)}</p></div>`).join("")||'<div class="empty">No enquiries yet.</div>';return}
const idk=t==="houses"?"house_id":"id";
const fld=f=>{const[n,l,ty,rq]=f,id="f_"+n,r=rq?" required":"",L=`<label for="${id}">${l}${rq?" *":""}</label>`;
if(ty==="area")return L+`<textarea id="${id}" rows="3" maxlength="1000"${r}></textarea>`;
if(ty.startsWith("select"))return L+`<select id="${id}">${ty.slice(7).split(",").map(o=>`<option>${o}</option>`).join("")}</select>`;
if(ty.startsWith("up"))return L+`<div class="drop"><input type="file" id="${id}" accept="${ty==="up:pdf"?"application/pdf":"image/*"}" ${t==="gallery"?"multiple":""}${r}><img class="pv" id="pv_${n}" alt="Preview" hidden></div>`;
return L+`<input id="${id}" type="${ty}" maxlength="200"${r}>`};
const list=rows.map(r=>{const off=["draft","inactive"].includes(r.status);return`<div class="row"><span>${r.image_url||r.photo_url?`<img src="${url(r.image_url||r.photo_url)}" alt=""> `:""}<b>${esc(r.title||r.name||"House "+r.house_number)}</b> <span class="tag${off?" x":""}">${esc(r.status)}</span></span><button class="btn alt" data-s="${esc(r[idk])}" data-on="${off?1:0}">${off?"Publish":"Hide"}</button></div>`}).join("")||'<div class="empty">No records yet.</div>';
ab.innerHTML=`<form class="card" id="af"><h3>Add new</h3>${FIELDS[t].map(fld).join("")}<label><input type="checkbox" id="f_pub" checked style="width:auto"> Publish immediately</label><button class="btn" id="asb" style="margin-top:12px">Save</button></form><h2 class="sec">Existing</h2>${list}`;
$("#af").addEventListener("change",e=>{const i=e.target;if(i.type==="file"&&i.files[0]&&i.files[0].type.startsWith("image/")){const p=$("#pv_"+i.id.slice(2));p.src=URL.createObjectURL(i.files[0]);p.hidden=false}});
ab.querySelectorAll("[data-s]").forEach(b=>b.onclick=async()=>{const on=b.dataset.on==="1";try{await api({op:"status",sheet:t,id:b.dataset.s,status:t==="houses"?(on?"active":"inactive"):(on?"published":"draft")});toast("Updated");panel()}catch(e){toast("Could not update")}});
$("#af").onsubmit=async e=>{e.preventDefault();const b=$("#asb");b.disabled=true;b.textContent="Saving…";
try{const base={},up={};for(const[n,,ty]of FIELDS[t]){const el=$("#f_"+n);if(ty.startsWith("up")){if(el.files.length){up[n]=[];for(const f of el.files){const s=await shrink(f);b.textContent="Uploading "+(up[n].length+1)+"…";up[n].push((await api({op:"upload",sheet:t,name:s.name,mime:s.mime,data:s.data})).url)}}}else base[n]=el.value.trim()}
const out=t==="gallery"?(up.image_url||[]).map(u=>({...base,image_url:u})):[{...base,...Object.fromEntries(Object.entries(up).map(([k,v])=>[k,v[0]]))}];
for(const r of out)await api({op:"save",sheet:t,row:r,publish:$("#f_pub").checked});toast("Saved. The public site updates within 5 minutes.");panel()}
catch(er){toast("Could not save: "+er.message);b.disabled=false;b.textContent="Save"}}}
document.body.insertAdjacentHTML("beforeend",'<div id="toast" role="status"></div><div id="lb" role="dialog" aria-label="Photo viewer"><button class="btn" id="lbx" aria-label="Close">✕</button><img alt=""></div>');
addEventListener("click",e=>{const b=e.target.closest("[data-lb]");if(b){$("#lb img").src=b.dataset.lb;$("#lb").classList.add("on");return}if(e.target.id==="lb"||e.target.id==="lbx")$("#lb").classList.remove("on")});
addEventListener("keydown",e=>{if(e.key==="Escape")$("#lb").classList.remove("on")});
init();
