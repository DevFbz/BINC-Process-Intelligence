// ═══════════════════════════════════════════════════
//  STORAGE
// ═══════════════════════════════════════════════════
const sv=(k,v)=>{try{localStorage.setItem('binc_'+k,JSON.stringify(v));}catch(e){}};
const ld=(k,d)=>{try{const v=localStorage.getItem('binc_'+k);return v?JSON.parse(v):d;}catch(e){return d;}};

// ═══════════════════════════════════════════════════
//  NAV
// ═══════════════════════════════════════════════════
const PTITLES={
  home:['Início','Bem-vindo ao BINC'],
  mapa:['Mapa de Campos','Visualize e edite campos por etapa e grupo'],
  fluxo:['Fluxo AS-IS','Construa fluxogramas de processo'],
  script:['Script BPM','Gerador de script no padrão LECOM'],
  chat:['Binc IA','Expert em API JavaScript do Lecom BPM 5.50'],
  ideias:['Ideias & Projetos','Catálogo de melhorias e projetos']
};
function goTo(id,el=null){
  document.querySelectorAll('.pnl').forEach(p=>p.classList.remove('on'));
  document.getElementById('p-'+id).classList.add('on');
  document.querySelectorAll('.nv').forEach(n=>n.classList.remove('on'));
  (el||document.querySelector(`.nv[data-p="${id}"]`))?.classList.add('on');
  const [t,s]=PTITLES[id]||[id,''];
  document.getElementById('tbt').textContent=t;
  document.getElementById('tbs').textContent=s;
  const acts={
    mapa:`<button class="btn sm" onclick="openEM()">＋ Etapas</button>
          <button class="btn sm" onclick="addGroup()">＋ Grupo</button>
          <button class="btn sm" onclick="impMap()">⬆ Importar</button>
          <button class="btn sm" onclick="expMap()">⬇ JSON</button>`,
    script:``,chat:``,fluxo:``,ideias:``,home:``
  };
  document.getElementById('tb-acts').innerHTML=acts[id]||'';
  if(id==='mapa')renderMapa();
  if(id==='fluxo')redrawF();
  if(id==='script'){initSc();buildScript();}
  if(id==='ideias')renderIdeias();
  if(id==='chat')initChat();
}
let sbCol=false;
function toggleSB(){
  sbCol=!sbCol;
  document.getElementById('sidebar').classList.toggle('col',sbCol);
  document.querySelector('.sb-tog').textContent=sbCol?'▶':'◀';
}

// ═══════════════════════════════════════════════════
//  MAPA DE CAMPOS
// ═══════════════════════════════════════════════════
const VL={v:'visível',s:'somente leit.',o:'oculto',c:'condicional',p:'parcial'};
const TB={e:'EDITÁVEL',s:'SOMENTE LEITURA',o:'OCULTO',c:'CONDICIONAL',p:'PARCIAL'};
const TC={e:'gbe',s:'gbs',o:'gbo',c:'gbc',p:'gbp'};
const TCC=['e','s','o','c','p'];
function defMap(){
  return{cur:0,etapas:[
    {id:1,nome:'SOLICITAR',codEtapa:2,grupos:[
      {id:1,nome:'INFORMAÇÕES DE ATENDIMENTO',tipo:'e',campos:[
        {id:'REAL_SOLICITANTE',label:'Real Solicitante',vis:'v'},
        {id:'NOME_SOLICITANTE',label:'Nome do Solicitante',vis:'v'},
        {id:'TIPO_CHAMADO',label:'Selecione o motivo',vis:'v'},
        {id:'DET_ATENDIMENTO',label:'Detalhe sua necessidade',vis:'v'},
        {id:'NUMERO_MASCARA',label:'WhatsApp para atualizações',vis:'c'},
        {id:'PRIORIDADE_ATENDIMENTO',label:'Prioridade para atendimento',vis:'v'},
        {id:'COD_PROCES',label:'Código do processo',vis:'v'},
        {id:'DATA_PROCESSO',label:'Data de abertura',vis:'v'},
      ]},
      {id:2,nome:'INFORMAÇÕES DA SOLICITAÇÃO',tipo:'e',campos:[
        {id:'ORIGEM',label:'Em qual local foi localizado?',vis:'v'},
        {id:'ADD_NOTA',label:'Quero anexar informação',vis:'v'},
        {id:'PRODUTOS',label:'Lista de usuários',vis:'v'},
      ]},
      {id:3,nome:'AÇÕES E OBSERVAÇÕES',tipo:'p',campos:[
        {id:'OBSERVACOES',label:'Observações',vis:'v'},
        {id:'MSGS_PADROES',label:'Mensagem rápida',vis:'o'},
        {id:'OBS_INTERNAS',label:'Observações internas',vis:'o'},
      ]}
    ]},
    {id:2,nome:'COMPLEMENTAR',codEtapa:7,grupos:[]},
    {id:3,nome:'VALIDAR',codEtapa:3,grupos:[]},
    {id:4,nome:'AVALIAR',codEtapa:5,grupos:[]},
    {id:5,nome:'FINALIZAR',codEtapa:6,grupos:[]},
  ]};
}
let MAP=ld('map',null)||defMap();
const svMap=()=>sv('map',MAP);
function renderMapa(){renderTabs();renderInfo();renderGroups();}
function renderTabs(){
  document.getElementById('etabs').innerHTML=
    MAP.etapas.map((e,i)=>
      `<button class="etab ${i===MAP.cur?'on':''}" onclick="selEt(${i})">
        <span class="etn">${e.id}</span>${e.nome}
        <span class="etdel" onclick="delEt(event,${i})">✕</span>
      </button>`
    ).join('')+
    `<button class="etadd" onclick="openEM()">＋ Etapa</button>`;
}
function renderInfo(){
  const e=MAP.etapas[MAP.cur];
  document.getElementById('etinfo').innerHTML=e?
    `<span class="etbdg">ETAPA ${e.id}</span>
     <span class="etnm">${e.nome}</span>
     <span class="etcod" onclick="renEt(${MAP.cur})" title="Renomear">codEtapa = ${e.codEtapa||e.id} ✎</span>`:'';
}
function renderGroups(){
  const e=MAP.etapas[MAP.cur];
  const c=document.getElementById('mcanvas');
  if(!e){c.innerHTML='';return;}
  c.innerHTML=e.grupos.map((g,gi)=>`
    <div class="gcol">
      <div class="ghd">
        <input class="gnm" value="${g.nome}" onchange="updGN(${gi},this.value)">
        <span class="gbdg ${TC[g.tipo||'e']}" onclick="cycGT(${gi})" title="Clique para mudar tipo">${TB[g.tipo||'e']}</span>
        <button class="grm" onclick="delGrp(${gi})" title="Excluir">✕</button>
      </div>
      <div class="gflds">${(g.campos||[]).map((f,fi)=>fHTML(f,gi,fi)).join('')}</div>
      <div class="gft"><button class="gadd" onclick="addFld(${gi})">＋ Novo campo</button></div>
    </div>`
  ).join('')+
  `<div class="gghost" onclick="addGroup()"><div style="font-size:1.35rem;">＋</div><div>Novo Grupo</div></div>`;
}
function fHTML(f,gi,fi){
  const v=f.vis||'v';
  const dot=v==='c'?`<div class="fln cc"></div>`:`<div class="fdt c${v}"></div>`;
  return`<div class="frow" onclick="editFld(${gi},${fi})">
    <span class="fid">${f.id}</span>
    <span class="flb">${f.label||''}</span>
    <div class="fvw">${dot}<span class="fvt">${VL[v]||'visível'}</span></div>
  </div>`;
}
function selEt(i){MAP.cur=i;svMap();renderMapa();}
function delEt(ev,i){
  ev.stopPropagation();
  if(!confirm(`Excluir etapa "${MAP.etapas[i].nome}"?\nTodos os grupos e campos serão removidos.`))return;
  MAP.etapas.splice(i,1);
  MAP.etapas.forEach((e,j)=>e.id=j+1);
  if(MAP.cur>=MAP.etapas.length)MAP.cur=Math.max(0,MAP.etapas.length-1);
  svMap();renderMapa();
}
function renEt(i){const n=prompt('Novo nome:',MAP.etapas[i].nome);if(!n)return;MAP.etapas[i].nome=n.toUpperCase().trim();svMap();renderMapa();}
function updGN(gi,v){MAP.etapas[MAP.cur].grupos[gi].nome=v.toUpperCase();svMap();}
function cycGT(gi){const g=MAP.etapas[MAP.cur].grupos[gi];g.tipo=TCC[(TCC.indexOf(g.tipo||'e')+1)%TCC.length];svMap();renderGroups();}
function addGroup(){
  const e=MAP.etapas[MAP.cur];if(!e)return;
  e.grupos.push({id:Date.now(),nome:'NOVO GRUPO',tipo:'e',campos:[]});
  svMap();renderGroups();
  setTimeout(()=>{const c=document.getElementById('mcanvas');c.scrollLeft=c.scrollWidth;},50);
}
function delGrp(gi){if(!confirm('Excluir grupo?'))return;MAP.etapas[MAP.cur].grupos.splice(gi,1);svMap();renderGroups();}
function openEM(){document.getElementById('et1').value='';document.getElementById('etbulk').value='';document.getElementById('etmod').classList.add('open');document.getElementById('et1').focus();}
function closeEM(e){if(e&&e.target!==document.getElementById('etmod'))return;document.getElementById('etmod').classList.remove('open');}
function commitEts(){
  const s=document.getElementById('et1').value.trim().toUpperCase().replace(/\s/g,'_');
  const b=document.getElementById('etbulk').value.trim();
  const names=[];
  if(s)names.push(s);
  if(b)b.split('\n').forEach(l=>{const n=l.trim().toUpperCase().replace(/\s/g,'_');if(n&&!names.includes(n))names.push(n);});
  if(!names.length)return;
  names.forEach(nome=>{
    if(!MAP.etapas.find(e=>e.nome===nome))
      MAP.etapas.push({id:MAP.etapas.length+1,nome,codEtapa:MAP.etapas.length+1,grupos:[]});
  });
  MAP.cur=MAP.etapas.length-1;
  svMap();closeEM();renderMapa();
}
function addFld(gi){
  document.getElementById('feg').value=gi;document.getElementById('fef').value=-1;
  document.getElementById('fid').value='';document.getElementById('fla').value='';
  document.getElementById('fvis').value='v';
  document.getElementById('fmt').textContent='＋ Novo Campo';
  document.getElementById('fdel').style.display='none';
  document.getElementById('fmod').classList.add('open');
  document.getElementById('fid').focus();
}
function editFld(gi,fi){
  const f=MAP.etapas[MAP.cur].grupos[gi].campos[fi];
  document.getElementById('feg').value=gi;document.getElementById('fef').value=fi;
  document.getElementById('fid').value=f.id;document.getElementById('fla').value=f.label||'';
  document.getElementById('fvis').value=f.vis||'v';
  document.getElementById('fmt').textContent='✏️ Editar Campo';
  document.getElementById('fdel').style.display='';
  document.getElementById('fmod').classList.add('open');
}
function saveField(){
  const gi=+document.getElementById('feg').value,fi=+document.getElementById('fef').value;
  const id=document.getElementById('fid').value.trim().toUpperCase().replace(/\s/g,'_');
  if(!id){document.getElementById('fid').focus();return;}
  const label=document.getElementById('fla').value.trim();
  const vis=document.getElementById('fvis').value;
  const e=MAP.etapas[MAP.cur];const field={id,label,vis};
  if(fi===-1)e.grupos[gi].campos.push(field);else e.grupos[gi].campos[fi]=field;
  svMap();closeFM();renderGroups();
}
function delField(){
  if(!confirm('Excluir campo?'))return;
  const gi=+document.getElementById('feg').value,fi=+document.getElementById('fef').value;
  if(fi>=0)MAP.etapas[MAP.cur].grupos[gi].campos.splice(fi,1);
  svMap();closeFM();renderGroups();
}
function closeFM(e){if(e&&e.target!==document.getElementById('fmod'))return;document.getElementById('fmod').classList.remove('open');}
function expMap(){
  const b=new Blob([JSON.stringify(MAP.etapas,null,2)],{type:'application/json'});
  dl(URL.createObjectURL(b),'binc_mapa.json');
}
function impMap(){
  const inp=Object.assign(document.createElement('input'),{type:'file',accept:'.json'});
  inp.onchange=e=>{
    const f=e.target.files[0];if(!f)return;
    const r=new FileReader();
    r.onload=ev=>{try{MAP.etapas=JSON.parse(ev.target.result);MAP.cur=0;svMap();renderMapa();}catch{alert('JSON inválido');}};
    r.readAsText(f);
  };
  inp.click();
}

// ═══════════════════════════════════════════════════
//  SCRIPT BPM
// ═══════════════════════════════════════════════════
function initSc(){
  if(!document.getElementById('sc-data').value)
    document.getElementById('sc-data').value=new Date().toISOString().slice(0,10);
}
function parseEts(raw){
  return raw.split('\n').map((l,i)=>{
    l=l.trim();if(!l)return null;
    const m=l.match(/^([A-Z0-9_]+)\s*[:=]\s*(\d+)$/);
    if(m)return{name:m[1],num:parseInt(m[2])};
    return{name:l.toUpperCase().replace(/\s/g,'_'),num:i+1};
  }).filter(Boolean);
}
function buildScript(){
  const arq=document.getElementById('sc-arq').value.trim()||'h00_p_processo';
  const proc=document.getElementById('sc-proc').value.trim()||'Nome do Processo';
  const num=document.getElementById('sc-num').value.trim()||'00';
  const dv=document.getElementById('sc-data').value;
  const data=dv?new Date(dv+'T12:00:00').toLocaleDateString('pt-BR'):'__/__/____';
  const raw=document.getElementById('sc-ets').value.trim();
  const ets=raw?parseEts(raw):[
    {name:'SOLICITAR',num:1},{name:'COMPLEMENTAR_INFORMACOES',num:7},
    {name:'VALIDAR_SOLICITACAO',num:3},{name:'EXAMINAR_MATERIAL',num:4},
    {name:'AVALIAR_ATENDIMENTO',num:5},{name:'CANCELAR_SOLICITACAO',num:2},{name:'FINALIZAR',num:6}
  ];
  const etObj=ets.map(e=>`  ${e.name}: ${e.num},`).join('\n');
  const swInit=ets.map(e=>`    case Etapa.${e.name}:\n     \n      break;`).join('\n\n');
  const swForm=ets.map(e=>`    case Etapa.${e.name}:\n      break;`).join('\n\n');
  const code=
`// JavaScript source code
/**
 * arquivo: ${arq}.js
 * processo: ${num} - ${proc}
 *
 * Data: ${data}
 *
 *
 */
/* Etapas */
var Etapa = Object.freeze({
${etObj}
  });

  /* Globais Auxiliares */
  const codForm = ProcessData.processId;
  const codVersao = ProcessData.version;
  const codProcesso = ProcessData.processInstanceId;
  const codEtapa = ProcessData.activityInstanceId;
  const codCiclo = ProcessData.cycle;
  const documentStore = Lecom.stores.DocumentStore;

  /* Carregamento do Formulario */
  $(document).ready(function () {
    console.clear();
    initForm();
    setForm();
  });

  function initForm() {

    switch (codEtapa) {
${swInit}
    }

    Form.apply();
  }

  /* formatação das etapas */
  function setForm() {

    switch (codEtapa) {
${swForm}
    }

    Form.apply();
  }`;
  document.getElementById('sc-out').textContent=code;
  document.getElementById('sc-fn').textContent=arq+'.js';
}
function copyScript(){
  navigator.clipboard.writeText(document.getElementById('sc-out').textContent).then(()=>{
    const b=document.querySelector('#p-script .btn.sm');const o=b.textContent;
    b.textContent='✓ Copiado!';setTimeout(()=>b.textContent=o,1800);
  });
}
function dlScript(){
  const arq=document.getElementById('sc-arq').value.trim()||'script';
  dl(URL.createObjectURL(new Blob([document.getElementById('sc-out').textContent],{type:'text/javascript'})),arq+'.js');
}

// ═══════════════════════════════════════════════════
//  FLUXO AS-IS
// ═══════════════════════════════════════════════════
let FN=ld('fn',[]),FC=ld('fc',[]),FNC=FN.length;
let CN={on:false,from:null},DR={node:null,ox:0,oy:0};
function svF(){sv('fn',FN);sv('fc',FC);}
function dstart(e){e.dataTransfer.setData('shape',e.currentTarget.getAttribute('data-shape'));}
function fdrop(e){
  e.preventDefault();
  const shape=e.dataTransfer.getData('shape');
  const r=document.getElementById('fcanv').getBoundingClientRect();
  const lbl=prompt('Label:');if(lbl===null)return;
  FN.push({id:'n'+(++FNC),shape,x:e.clientX-r.left,y:e.clientY-r.top,lbl:lbl||shape});
  svF();redrawF();
}
function nb(n){
  const{x,y,shape,id}=n;const s=CN.from===id?2.2:1.5;const c=CN.from===id?'#00d4b0':'';
  if(shape==='inicio')return`<circle cx="${x}" cy="${y}" r="26" fill="rgba(0,212,176,.06)" stroke="#00d4b0" stroke-width="${s}"/>`;
  if(shape==='processo')return`<rect x="${x-58}" y="${y-23}" width="116" height="46" rx="4" fill="rgba(17,17,17,.95)" stroke="${c||'#333'}" stroke-width="${s}"/>`;
  if(shape==='decisao')return`<polygon points="${x},${y-33} ${x+58},${y} ${x},${y+33} ${x-58},${y}" fill="rgba(245,166,35,.05)" stroke="${c||'#f5a623'}" stroke-width="${s}"/>`;
  if(shape==='documento')return`<path d="M${x-46},${y-23} L${x+46},${y-23} L${x+46},${y+16} Q${x},${y+32} ${x-46},${y+16} Z" fill="rgba(91,156,246,.05)" stroke="${c||'#5b9cf6'}" stroke-width="${s}"/>`;
  if(shape==='manual')return`<path d="M${x-46},${y+23} L${x-34},${y-23} L${x+46},${y-23} L${x+46},${y+23} Z" fill="rgba(155,138,251,.05)" stroke="${c||'#9b8afb'}" stroke-width="${s}"/>`;
  return`<rect x="${x-30}" y="${y-15}" width="60" height="30" fill="rgba(17,17,17,.95)" stroke="#333" stroke-width="1.5"/>`;
}
function redrawF(){
  document.getElementById('fconns').innerHTML=FC.map(c=>{
    const f=FN.find(n=>n.id===c.from),t=FN.find(n=>n.id===c.to);if(!f||!t)return'';
    const mx=(f.x+t.x)/2,my=(f.y+t.y)/2;
    return`<line x1="${f.x}" y1="${f.y}" x2="${t.x}" y2="${t.y}" stroke="#2a2a2a" stroke-width="1.5" marker-end="url(#arr)"/>
    ${c.lbl?`<text x="${mx}" y="${my-7}" font-size="10" fill="#333" font-family="Inter" text-anchor="middle">${c.lbl}</text>`:''}`;
  }).join('');
  document.getElementById('fnodes').innerHTML=FN.map(n=>`
    <g class="fn" data-id="${n.id}" style="cursor:${CN.on?'crosshair':'move'};">
      ${nb(n)}
      <text x="${n.x}" y="${n.y+1}" font-size="11" fill="#aaa" font-family="Inter"
        text-anchor="middle" dominant-baseline="middle" pointer-events="none">${n.lbl}</text>
    </g>`).join('');
  document.querySelectorAll('.fn').forEach(el=>{
    el.addEventListener('mousedown',e=>{
      e.stopPropagation();const id=el.getAttribute('data-id');
      if(CN.on){
        if(!CN.from){CN.from=id;redrawF();}
        else if(CN.from!==id){
          const lbl=prompt('Label da conexão:')||'';
          FC.push({from:CN.from,to:id,lbl});CN.from=null;svF();redrawF();
        }
        return;
      }
      DR={node:id,ox:e.clientX,oy:e.clientY};
    });
    el.addEventListener('dblclick',e=>{
      e.stopPropagation();const id=el.getAttribute('data-id');
      const nd=FN.find(n=>n.id===id);if(!nd)return;
      const nl=prompt('Novo label:',nd.lbl);if(nl!==null){nd.lbl=nl;svF();redrawF();}
    });
  });
}
document.addEventListener('mousemove',e=>{
  if(!DR.node)return;
  const nd=FN.find(n=>n.id===DR.node);if(!nd)return;
  nd.x+=e.clientX-DR.ox;nd.y+=e.clientY-DR.oy;DR.ox=e.clientX;DR.oy=e.clientY;redrawF();
});
document.addEventListener('mouseup',()=>{if(DR.node)svF();DR.node=null;});
function toggleConn(){
  CN.on=!CN.on;CN.from=null;
  const b=document.getElementById('conn-btn');
  b.textContent=CN.on?'⏹ Cancelar':'🔗 Conectar nós';
  b.classList.toggle('act',CN.on);redrawF();
}
function undoLast(){if(FC.length)FC.pop();else if(FN.length)FN.pop();svF();redrawF();}
function clearFluxo(){if(!confirm('Limpar tudo?'))return;FN=[];FC=[];FNC=0;CN={on:false,from:null};svF();redrawF();}
function saveFluxo(){svF();const b=document.querySelector('#p-fluxo .fpb2:last-child');const o=b.textContent;b.textContent='✓ Salvo!';setTimeout(()=>b.textContent=o,1500);}
function exportSVG(){dl(URL.createObjectURL(new Blob([document.getElementById('fsvg').outerHTML],{type:'image/svg+xml'})),'fluxo.svg');}

// ═══════════════════════════════════════════════════
//  IDEIAS
// ═══════════════════════════════════════════════════
const IDEAS=[
  {ico:'🤖',tit:'Automação de Chamados Recorrentes',tag:'tm',tl:'Complexidade Média',desc:'Identificar chamados de mesmo tipo que se repetem e criar fluxos de atendimento automático com base em regras de negócio.',ben:['Redução de até 40% no tempo de atendimento','Padronização das respostas','Liberação da equipe para tarefas estratégicas'],kpi:'Meta: reduzir retrabalho em 30% em 3 meses'},
  {ico:'📊',tit:'Dashboard de Indicadores de Processo',tag:'tl',tl:'Complexidade Baixa',desc:'Criar painel visual com os principais KPIs: SLA, volume de chamados, taxa de reabertura e NPS.',ben:['Visibilidade em tempo real','Tomada de decisão baseada em dados','Identificação rápida de gargalos'],kpi:'Meta: reduzir tempo de identificação de problemas em 50%'},
  {ico:'📋',tit:'Padronização de Templates de Documentação',tag:'tl',tl:'Complexidade Baixa',desc:'Definir padrão único para documentação de processos, com templates por tipo de processo.',ben:['Onboarding mais rápido','Redução de retrabalho','Base de conhecimento centralizada'],kpi:'Meta: documentar 100% dos processos críticos em 6 meses'},
  {ico:'🔄',tit:'Revisão e Otimização de Fluxos AS-IS',tag:'tm',tl:'Complexidade Média',desc:'Mapeamento dos fluxos atuais para identificar gargalos, redundâncias e oportunidades de melhoria.',ben:['Identificação de atividades sem valor','Base para fluxo TO-BE','Redução de desperdícios'],kpi:'Meta: eliminar 20% das atividades redundantes'},
  {ico:'🎯',tit:'Programa de Melhoria Contínua (Kaizen)',tag:'th',tl:'Complexidade Alta',desc:'Implementar ciclos regulares de revisão com PDCA, envolvendo times multidisciplinares.',ben:['Cultura de melhoria contínua','Processos sempre atualizados','Engajamento das equipes'],kpi:'Meta: ciclos mensais de revisão por área'},
  {ico:'📱',tit:'Notificações Automáticas por WhatsApp',tag:'tm',tl:'Complexidade Média',desc:'Integrar BPM com API de WhatsApp para notificar sobre atualizações de status automaticamente.',ben:['Redução de contatos de acompanhamento','Melhor experiência do usuário','Transparência'],kpi:'Meta: reduzir perguntas de status em 60%'},
  {ico:'📚',tit:'Base de Conhecimento Interna',tag:'tl',tl:'Complexidade Baixa',desc:'Repositório centralizado com problemas, soluções e boas práticas de cada área.',ben:['Menor tempo de resolução','Menos dependência de pessoas-chave','Onboarding acelerado'],kpi:'Meta: 80% dos chamados resolvidos via base de conhecimento'},
  {ico:'⚡',tit:'SLA Dinâmico por Prioridade',tag:'tm',tl:'Complexidade Média',desc:'Regras de priorização automática com SLAs diferenciados por tipo, urgência e impacto.',ben:['Atendimento prioritário para itens críticos','Melhor distribuição de carga','Redução de escaladas'],kpi:'Meta: 95% dos chamados críticos no SLA'},
];
function renderIdeias(){
  document.getElementById('ilist').innerHTML=IDEAS.map((d,i)=>`
    <div class="icard" id="ic${i}" onclick="toggleI(${i})">
      <div class="ihd">
        <span class="iico">${d.ico}</span>
        <span class="itit">${d.tit}</span>
        <span class="itag ${d.tag}">${d.tl}</span>
        <span class="iarr">▼</span>
      </div>
      <div class="ibody">
        <p>${d.desc}</p>
        <p style="margin-top:.6rem;"><strong>Benefícios:</strong></p>
        <ul>${d.ben.map(b=>`<li>${b}</li>`).join('')}</ul>
        <p style="margin-top:.6rem;font-family:var(--fm);font-size:.66rem;color:var(--ac);">📈 ${d.kpi}</p>
      </div>
    </div>`).join('');
}
function toggleI(i){document.getElementById('ic'+i).classList.toggle('open');}

// ═══════════════════════════════════════════════════


// ═══════════════════════════════════════════════════
//  CHAT ENGINE
// ═══════════════════════════════════════════════════
let chatHistory = [];
let chatInited = false;

function initChat() {
  if (chatInited) return;
  chatInited = true;
  addBotMsg(`Olá! Sou a **Binc IA**, especialista na API JavaScript do Lecom BPM 5.50.\n\nPosso te ajudar com:\n- Manipulação de campos e grupos\n- Eventos do Form e Grid\n- Grids: inserção, edição, remoção\n- Máscaras, validações e actions\n- Boas práticas e performance\n\nDigite sua dúvida ou escolha uma sugestão abaixo.`);
  renderSuggests(SUGGESTIONS);
}

function renderSuggests(sugs) {
  document.getElementById('chat-suggests').innerHTML = sugs.map(s =>
    `<button class="sug-btn" onclick="sendSuggestion(this, '${s.replace(/'/g,"\\'")}')"> ${s}</button>`
  ).join('');
}

function sendSuggestion(el, text) {
  el.closest('.chat-suggests').innerHTML = '';
  processUserMsg(text);
}

function sendChat() {
  const inp = document.getElementById('chat-input');
  const text = inp.value.trim();
  if (!text) return;
  inp.value = '';
  inp.style.height = '';
  document.getElementById('chat-suggests').innerHTML = '';
  processUserMsg(text);
}

function chatKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat(); }
}

function autoResize(el) {
  el.style.height = '';
  el.style.height = Math.min(el.scrollHeight, 120) + 'px';
}

function processUserMsg(text) {
  addUserMsg(text);
  const typing = addTypingIndicator();
  setTimeout(() => {
    typing.remove();
    const answer = findAnswer(text);
    addBotMsg(answer.a);
    // suggest related
    const related = KB.filter(k => k !== answer).slice(0, 4).map(k => k.q);
    renderSuggests(related);
    scrollChat();
  }, 600 + Math.random() * 400);
}

function findAnswer(query) {
  const q = query.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[?!.,]/g, '');
  const words = q.split(/\s+/).filter(w => w.length > 2);
  
  let best = null, bestScore = 0;
  KB.forEach(item => {
    let score = 0;
    item.tags.forEach(tag => {
      if (q.includes(tag)) score += 3;
      words.forEach(w => { if (tag.includes(w) || w.includes(tag)) score += 1; });
    });
    if (item.q.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').includes(q.slice(0,12))) score += 5;
    if (score > bestScore) { bestScore = score; best = item; }
  });
  
  if (!best || bestScore === 0) {
    return {
      a: `Não encontrei uma resposta específica para **"${query}"** na minha base de conhecimento.\n\nTente perguntar sobre:\n- <code>Form.fields()</code>, <code>Form.groups()</code>, <code>Form.actions()</code>\n- Eventos: <code>SUBMIT</code>, <code>BLUR</code>, <code>CHANGE</code>, <code>GRID_SUBMIT</code>\n- Grid: <code>dataRows</code>, <code>insertDataRow</code>, <code>updateDataRow</code>\n- Máscaras, validações, <code>apply()</code>\n\nOu escolha uma das sugestões abaixo.`
    };
  }
  return best;
}

function addUserMsg(text) {
  const now = new Date().toLocaleTimeString('pt-BR', {hour:'2-digit',minute:'2-digit'});
  const el = document.createElement('div');
  el.className = 'msg user';
  el.innerHTML = `
    <div class="msg-av">EU</div>
    <div class="msg-body">
      <div class="msg-bubble">${escHtml(text)}</div>
      <div class="msg-time">${now}</div>
    </div>`;
  document.getElementById('chat-msgs').appendChild(el);
  scrollChat();
}

function addBotMsg(md) {
  const now = new Date().toLocaleTimeString('pt-BR', {hour:'2-digit',minute:'2-digit'});
  const el = document.createElement('div');
  el.className = 'msg bot';
  el.innerHTML = `
    <div class="msg-av">AI</div>
    <div class="msg-body">
      <div class="msg-bubble">${renderMd(md)}</div>
      <div class="msg-time">${now}</div>
    </div>`;
  document.getElementById('chat-msgs').appendChild(el);
  scrollChat();
}

function addTypingIndicator() {
  const el = document.createElement('div');
  el.className = 'msg bot';
  el.innerHTML = `
    <div class="msg-av">AI</div>
    <div class="msg-body">
      <div class="msg-bubble">
        <div class="msg-typing"><span></span><span></span><span></span></div>
      </div>
    </div>`;
  document.getElementById('chat-msgs').appendChild(el);
  scrollChat();
  return el;
}

function renderMd(text) {
  return text
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    // restore already-escaped code tags (from KB)
    .replace(/&lt;code&gt;(.*?)&lt;\/code&gt;/g,'<code>$1</code>')
    .replace(/&lt;pre&gt;([\s\S]*?)&lt;\/pre&gt;/g,'<pre>$1</pre>')
    .replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>')
    .replace(/`([^`]+)`/g,'<code>$1</code>')
    .replace(/\n/g,'<br>');
}

function escHtml(t) {
  return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function scrollChat() {
  const c = document.getElementById('chat-msgs');
  setTimeout(() => c.scrollTop = c.scrollHeight, 50);
}

function clearChat() {
  if (!confirm('Limpar conversa?')) return;
  document.getElementById('chat-msgs').innerHTML = '';
  document.getElementById('chat-suggests').innerHTML = '';
  chatInited = false;
  initChat();
}

// ═══════════════════════════════════════════════════
//  UTILS
// ═══════════════════════════════════════════════════
function dl(url,name){const a=Object.assign(document.createElement('a'),{href:url,download:name});a.click();URL.revokeObjectURL(url);}

document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){
    document.getElementById('fmod').classList.remove('open');
    document.getElementById('etmod').classList.remove('open');
  }
  if(e.key==='Enter'&&document.getElementById('fmod').classList.contains('open')&&document.activeElement.tagName!=='SELECT')saveField();
});

// ═══════════════════════════════════════════════════
//  BOOT
// ═══════════════════════════════════════════════════
buildScript();
