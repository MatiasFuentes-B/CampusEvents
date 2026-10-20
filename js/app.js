// Campus Events: datos de demostración y estado local del navegador.
const today = new Date();
const dateOffset = (days) => { const d = new Date(today); d.setDate(d.getDate()+days); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; };
const seedEvents = [
 {id:1,title:"Feria de innovación estudiantil",category:"Tecnología",date:dateOffset(2),time:"11:00",place:"Patio central",capacity:45,organizer:"Club de Tecnología",description:"Conoce proyectos, prototipos e ideas creadas por estudiantes.",icon:"💡"},
 {id:2,title:"Torneo relámpago de fútbol",category:"Deportes",date:dateOffset(4),time:"15:30",place:"Cancha universitaria",capacity:32,organizer:"Bienestar Estudiantil",description:"Arma tu equipo y participa en una tarde de deporte y compañerismo.",icon:"⚽"},
 {id:3,title:"Taller de fotografía creativa",category:"Arte y cultura",date:dateOffset(6),time:"13:00",place:"Sala de artes 204",capacity:20,organizer:"Colectivo Visual",description:"Aprende composición y experimenta con la fotografía cotidiana.",icon:"📷"},
 {id:4,title:"Charla: prácticas profesionales",category:"Académico",date:dateOffset(8),time:"10:00",place:"Auditorio norte",capacity:80,organizer:"Escuela de Ingeniería",description:"Consejos para preparar tu primera experiencia en el mundo laboral.",icon:"🎓"},
 {id:5,title:"Jornada de voluntariado",category:"Comunidad",date:dateOffset(10),time:"09:30",place:"Punto de encuentro: biblioteca",capacity:25,organizer:"Red de Voluntariado",description:"Una mañana para colaborar en una iniciativa comunitaria.",icon:"🌱"},
 {id:6,title:"Noche de juegos de mesa",category:"Comunidad",date:dateOffset(12),time:"17:00",place:"Casino universitario",capacity:30,organizer:"Centro de estudiantes",description:"Ven con tus amigos a compartir juegos, desafíos y buena onda.",icon:"🎲"}
];
let events = load("campusEvents", seedEvents);
let registrations = load("campusRegistrations", []);
const grid = document.querySelector("#eventGrid");
const searchInput = document.querySelector("#searchInput");
const categoryFilter = document.querySelector("#categoryFilter");
const dateFilter = document.querySelector("#dateFilter");
const modal = new bootstrap.Modal(document.querySelector("#eventModal"));
const toast = new bootstrap.Toast(document.querySelector("#appToast"),{delay:2600});
function load(key,fallback){try{const saved=localStorage.getItem(key);return saved?JSON.parse(saved):fallback}catch{return fallback}}
function save(){localStorage.setItem("campusEvents",JSON.stringify(events));localStorage.setItem("campusRegistrations",JSON.stringify(registrations))}
function escapeHTML(value){return String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function formatDate(date){return new Date(`${date}T12:00:00`).toLocaleDateString("es-CL",{weekday:"short",day:"numeric",month:"short"})}
function categoryClass(category){return {"Académico":"academic","Deportes":"sports","Arte y cultura":"arts","Comunidad":"community","Tecnología":"tech"}[category]||"community"}
function iconFor(category){return {"Académico":"🎓","Deportes":"⚽","Arte y cultura":"🎨","Comunidad":"🌱","Tecnología":"💡"}[category]||"✦"}
function filteredEvents(){
 const query=searchInput.value.trim().toLowerCase(),category=categoryFilter.value,soon=dateFilter.value==="upcoming";
 return events.filter(e=>{
  const matchesText=`${e.title} ${e.place} ${e.organizer} ${e.description}`.toLowerCase().includes(query);
  const matchesCategory=category==="Todas"||e.category===category;
  const days=(new Date(`${e.date}T23:59:59`)-new Date())/86400000;
  return matchesText&&matchesCategory&&(!soon||(days>=0&&days<=7));
 }).sort((a,b)=>a.date.localeCompare(b.date)||a.time.localeCompare(b.time));
}
function renderEvents(){
 const visible=filteredEvents();
 document.querySelector("#resultsCount").textContent=`${visible.length} ${visible.length===1?"evento encontrado":"eventos encontrados"}`;
 grid.innerHTML=visible.map(e=>{
  const joined=registrations.includes(e.id),full=e.capacity<=0;
  return `<div class="col-12 col-sm-6 col-lg-4"><article class="event-card">
   <div class="event-cover cover-${categoryClass(e.category)}"><span class="category-chip">${escapeHTML(e.category)}</span><span class="cover-icon">${iconFor(e.category)}</span></div>
   <div class="card-content"><div class="event-date">${formatDate(e.date)} · ${escapeHTML(e.time)}</div><h3 class="event-title">${escapeHTML(e.title)}</h3><p class="event-desc">${escapeHTML(e.description)}</p>
   <div class="event-meta"><span>⌖ ${escapeHTML(e.place)}</span><span>♧ ${e.capacity} cupos</span></div>
   <div class="card-bottom"><span class="organizer">Por ${escapeHTML(e.organizer)}</span><button class="btn btn-outline-primary join-btn ${joined?"joined":""}" data-action="${joined?"leave":"join"}" data-id="${e.id}" ${full&&!joined?"disabled":""}>${joined?"Inscrito ✓":full?"Sin cupos":"Inscribirme +"}</button></div></div></article></div>`;
 }).join("");
 document.querySelector("#emptyState").classList.toggle("d-none",visible.length>0);
}
function renderRegistrations(){
 const mine=events.filter(e=>registrations.includes(e.id)).sort((a,b)=>a.date.localeCompare(b.date));
 document.querySelector("#navCount").textContent=mine.length;
 document.querySelector("#registeredTotal").textContent=`${mine.length} ${mine.length===1?"evento":"eventos"}`;
 document.querySelector("#registeredList").innerHTML=mine.length?mine.map(e=>`<article class="registered-item"><div><h3>${escapeHTML(e.title)}</h3><p>${formatDate(e.date)} · ${escapeHTML(e.time)} · ${escapeHTML(e.place)}</p></div><button class="btn btn-sm btn-outline-secondary" data-action="leave" data-id="${e.id}">Cancelar</button></article>`).join(""):`<div class="registered-empty">Todavía no tienes inscripciones. Explora los eventos y únete a uno.</div>`;
}
function render(){renderEvents();renderRegistrations()}
function notify(message){document.querySelector("#toastText").textContent=message;toast.show()}
function handleEventAction(event){
 const button=event.target.closest("button[data-action]");if(!button)return;
 const id=Number(button.dataset.id),item=events.find(e=>e.id===id);if(!item)return;
 if(button.dataset.action==="join"){
  if(registrations.includes(id)||item.capacity<=0)return;
  registrations.push(id);item.capacity--;notify(`¡Te inscribiste en ${item.title}!`);
 }else{
  registrations=registrations.filter(x=>x!==id);item.capacity++;notify("Se canceló tu inscripción.");
 }
 save();render();
}
grid.addEventListener("click",handleEventAction);
document.querySelector("#registeredList").addEventListener("click",handleEventAction);
[searchInput,categoryFilter,dateFilter].forEach(el=>el.addEventListener(el===searchInput?"input":"change",renderEvents));
function resetFilters(){searchInput.value="";categoryFilter.value="Todas";dateFilter.value="all";renderEvents()}
document.querySelector("#clearFilters").addEventListener("click",resetFilters);
document.querySelector("#emptyReset").addEventListener("click",resetFilters);
document.querySelector("#searchButton").addEventListener("click",renderEvents);
const form=document.querySelector("#eventForm");
function openCreate(){form.reset();form.classList.remove("was-validated");document.querySelector("#formMessage").classList.add("d-none");document.querySelector("#eventDate").min=dateOffset(1);modal.show()}
document.querySelector("#openCreate").addEventListener("click",openCreate);
document.querySelector("#openCreateBottom").addEventListener("click",openCreate);
form.addEventListener("submit",event=>{
 event.preventDefault();event.stopPropagation();
 const date=document.querySelector("#eventDate"),capacity=document.querySelector("#eventCapacity");
 const valid=form.checkValidity()&&date.value>dateOffset(0)&&Number(capacity.value)>=1&&Number(capacity.value)<=5000;
 form.classList.add("was-validated");
 if(!valid){notify("Revisa los campos marcados antes de publicar.");return}
 const category=document.querySelector("#eventCategory").value;
 const newEvent={id:Date.now(),title:document.querySelector("#eventName").value.trim(),category,date:date.value,time:document.querySelector("#eventTime").value,place:document.querySelector("#eventPlace").value.trim(),capacity:Number(capacity.value),organizer:document.querySelector("#eventOrganizer").value.trim(),description:document.querySelector("#eventDescription").value.trim(),icon:iconFor(category)};
 if(!newEvent.title||!newEvent.place||!newEvent.organizer||!newEvent.description)return;
 events.push(newEvent);save();render();modal.hide();notify("¡Tu evento fue publicado!");
});
render();
