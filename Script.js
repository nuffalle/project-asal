var KEY="papan-skor-domino-v1",MILESTONES={3:"EZ DEK",7:"BUTUH LAWAN YANG KERAS"};
var LABELS={1:"domi",2:"palang",3:"tangkap",4:"ceki habis"};
var state={s:[0,0],big:[0,0],names:["Tim A","Tim B"],hist:[]};
try{var raw=localStorage.getItem(KEY);if(raw){var p=JSON.parse(raw);if(p&&p.s&&p.names&&p.hist){state=p;if(!state.big)state.big=[0,0];}}}catch(e){}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch(e){}}
function $(id){return document.getElementById(id);}
function render(bumpT){
  for(var i=0;i<2;i++){
    var el=$("s"+i);el.textContent=state.s[i];
    if(i===bumpT){el.classList.remove("bump");void el.offsetWidth;el.classList.add("bump");}
    $("n"+i).value=state.names[i];
    $("b"+i).textContent=state.big[i];
    var pips=$("p"+i).children;
    for(var k=0;k<pips.length;k++)pips[k].classList.toggle("on",k<state.s[i]);
    $("t"+i).classList.toggle("lead",state.s[i]>0&&state.s[i]>state.s[1-i]);
  }
  var log=$("log");log.innerHTML="";
  if(!state.hist.length){log.textContent="Riwayat skor akan muncul di sini.";return;}
  state.hist.slice().reverse().forEach(function(h){
    var d=document.createElement("div");
    d.textContent=h.nr?"Ronde baru":h.big?(state.names[h.t]+" poin besar +1  →  "+h.B[0]+" - "+h.B[1]):(state.names[h.t]+" "+(h.p>0?"+":"")+h.p+(h.p>0&&LABELS[h.p]?" "+LABELS[h.p]:"")+"  →  "+h.a+" - "+h.b);
    log.appendChild(d);
  });
}
function confetti(){
  var colors=["#fbbf24","#38bdf8","#fb7185","#34d399","#f7f1e1"];
  for(var i=0;i<60;i++){
    var c=document.createElement("div");c.className="conf";
    c.style.left=Math.random()*100+"vw";
    c.style.background=colors[i%colors.length];
    c.style.animationDuration=(2+Math.random()*2)+"s";
    c.style.animationDelay=(Math.random()*.6)+"s";
    document.body.appendChild(c);
    setTimeout(function(n){n.remove();}.bind(null,c),5000);
  }
}
function showEz(t,text,big){
  var h=$("ezText");h.textContent=text;h.classList.toggle("long",text.length>10);
  $("ezWho").textContent=state.names[t]+" · "+(big?("Poin besar +1 · Skor besar "+state.big[0]+" - "+state.big[1]):(state.s[t]+" poin"));
  $("ez").classList.add("show");
  confetti();
}
function change(t,p){
  var n=state.s[t]+p;
  if(n<0)return;
  state.s[t]=n;
  state.hist.push({t:t,p:p,a:state.s[0],b:state.s[1]});
  save();render(t);
  if(p>0&&n>=7){
    var prev=[state.s[0],state.s[1]];
    state.big[t]++;state.s=[0,0];
    state.hist.push({big:1,t:t,prev:prev,B:[state.big[0],state.big[1]],a:0,b:0});
    save();render(t);showEz(t,MILESTONES[7],true);
  }else if(p>0&&n-p<3&&n>=3)showEz(t,MILESTONES[3],false);
}
document.querySelectorAll("button[data-t]").forEach(function(b){
  b.addEventListener("click",function(){change(+b.dataset.t,+b.dataset.p);});
});
$("undo").addEventListener("click",function(){
  var h=state.hist.pop();if(!h)return;
  if(h.big){state.big[h.t]--;state.s=h.prev;}else if(h.nr){state.s=h.prev;}else{state.s[h.t]-=h.p;}
  save();render();
});
$("reset").addEventListener("click",function(){state.s=[0,0];state.big=[0,0];state.hist=[];save();render();});
$("newRound").addEventListener("click",function(){if(!state.s[0]&&!state.s[1])return;state.hist.push({nr:1,prev:[state.s[0],state.s[1]],a:0,b:0,t:0});state.s=[0,0];save();render();});
$("ezClose").addEventListener("click",function(){$("ez").classList.remove("show");});
[0,1].forEach(function(i){
  $("n"+i).addEventListener("input",function(e){state.names[i]=e.target.value;save();});
});
render();