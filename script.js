const KEY="cg_demo_user_v2";
const LEVELS=[
 {name:"Usuario",short:"NORMAL",reward:50,points:0,next:100},
 {name:"VIP 1",short:"VIP 1",reward:100,points:100,next:300},
 {name:"VIP 2",short:"VIP 2",reward:200,points:300,next:700},
 {name:"VIP 3",short:"VIP 3",reward:400,points:700,next:1500},
 {name:"VIP 4",short:"VIP 4",reward:800,points:1500,next:3100},
 {name:"VIP 5",short:"VIP 5",reward:1600,points:3100,next:6300},
 {name:"VIP 6",short:"VIP 6",reward:3200,points:6300,next:12700},
 {name:"VIP 7",short:"VIP 7",reward:6400,points:12700,next:12700}
];

let user=JSON.parse(localStorage.getItem(KEY)||"null");

const $=id=>document.getElementById(id);
function money(n){return "RD$"+Number(n||0).toFixed(2)}
function level(){
  let p=user.points||0;
  if(p>=12700)return 7;
  if(p>=6300)return 6;
  if(p>=3100)return 5;
  if(p>=1500)return 4;
  if(p>=700)return 3;
  if(p>=300)return 2;
  if(p>=100)return 1;
  return 0;
}
function save(){localStorage.setItem(KEY,JSON.stringify(user))}
function toast(t){$("toast").textContent=t;$("toast").style.display="block";setTimeout(()=>$("toast").style.display="none",2400)}

function show(view){
 document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));
 const target=$(view+"View");
 if(target)target.classList.add("active");
 document.querySelectorAll(".bottom-nav button").forEach(b=>b.style.color=b.dataset.view===view?"#e4ba58":"#aeb8c3");
 window.scrollTo({top:0,behavior:"smooth"});
}

function render(){
 if(!user){show("login");return}
 const li=level(), L=LEVELS[li], today=user.date===new Date().toISOString().slice(0,10)?user.todayAds:0;
 if(user.date!==new Date().toISOString().slice(0,10)){user.date=new Date().toISOString().slice(0,10);user.todayAds=0;user.todayEarn=0;save()}
 $("welcome").textContent="Hola, "+user.name;
 $("balance").textContent=money(user.balance);
 $("withdrawBalance").textContent=money(user.balance);
 $("userPhone").textContent="Número: "+user.phone;
 $("vipName").textContent=L.name;
 $("vipBadge").textContent=L.short;
 $("adReward").textContent="+ "+money(L.reward);
 $("adCounter").textContent=today+"/3 hoy";
 $("todayEarn").textContent=money(user.todayEarn);
 $("totalEarn").textContent=money(user.totalEarn);
 $("totalAds").textContent=user.totalAds;
 $("referrals").textContent=user.referrals;
 $("profileName").value=user.name;
 $("profilePhone").value=user.phone;

 let pct=li===7?100:Math.min(100,Math.max(0,((user.points-L.points)/(L.next-L.points))*100));
 $("vipProgress").style.width=pct+"%";
 $("vipProgressText").textContent=li===7?"VIP 7 máximo":`${user.points} / ${L.next} puntos`;
 $("nextVipText").textContent=li===7?"Máximo":"Siguiente: VIP "+(li+1);
 $("vipDescription").textContent=li===3?"Has alcanzado el nivel VIP 3.":`Te faltan ${Math.max(0,L.next-user.points)} puntos para VIP ${li+1}.`;

 $("vipList").innerHTML=LEVELS.map((x,i)=>`<div class="vip-item ${i===li?"current":""}">
   <h3>${x.name} ${i===li?"— ACTUAL":""}</h3>
   <div class="vip-amount">RD$${x.reward} por anuncio</div>
   <p class="muted">${i===0?"Nivel inicial":`Se alcanza desde ${x.points} puntos`}. Límite: 3 anuncios diarios.</p>
 </div>`).join("");
}
function register(){
 const name=$("regName").value.trim(),phone=$("regPhone").value.trim(),pass=$("regPassword").value;
 if(!name||!phone||!pass){toast("Completa todos los campos.");return}
 user={name,phone,password:pass,balance:0,points:0,todayAds:0,todayEarn:0,totalEarn:0,totalAds:0,referrals:0,date:new Date().toISOString().slice(0,10)};
 save();render();show("home");toast("Cuenta creada correctamente.");
}
$("registerBtn").onclick=register;
$("logoutBtn").onclick=()=>{user=null;localStorage.removeItem(KEY);show("login")};
$("saveProfileBtn").onclick=()=>{user.name=$("profileName").value.trim()||user.name;user.phone=$("profilePhone").value.trim()||user.phone;save();render();toast("Perfil actualizado.")};
$("withdrawBtn").onclick=()=>{if(user.balance<=0){toast("No tienes saldo disponible.");return}if(!$("withdrawReference").value.trim()){toast("Escribe la referencia de pago.");return}toast("Solicitud registrada en el prototipo.");};
document.querySelectorAll("[data-view]").forEach(b=>b.onclick=()=>show(b.dataset.view));

let timer=null;
$("watchAdBtn").onclick=()=>{
 if(!user)return;
 if(user.todayAds>=3){toast("Has alcanzado el límite de 3 anuncios de hoy.");return}
 $("adModal").classList.remove("hidden");$("claimBtn").classList.add("hidden");
 let sec=10;$("adTimer").textContent=`Anuncio en curso: ${sec}s`;
 timer=setInterval(()=>{sec--;if(sec<=0){clearInterval(timer);$("adTimer").textContent="Anuncio completado";$("claimBtn").classList.remove("hidden")}else $("adTimer").textContent=`Anuncio en curso: ${sec}s`},1000);
};
$("claimBtn").onclick=()=>{
 const L=LEVELS[level()];
 user.balance+=L.reward;user.points+=10;user.todayAds++;user.totalAds++;user.todayEarn+=L.reward;user.totalEarn+=L.reward;save();
 $("adModal").classList.add("hidden");$("claimBtn").classList.add("hidden");render();toast("Recompensa añadida: "+money(L.reward));
};
render();
