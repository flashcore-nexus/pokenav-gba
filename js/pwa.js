'use strict';
(()=>{
 const status=document.getElementById('pwa-status'),progress=document.getElementById('pwa-progress');
 const update=document.getElementById('pwa-update'),install=document.getElementById('pwa-install');
 const LAST_CHECK='pokenav-offline-check-v1';
 let registration,installPrompt,checkSequence=0,activationVersion=null,reloaded=false,verificationBusy=false;
 const offline={text:'Preparando recursos offline…',version:null,stored:null,total:null,last:null};
 try{offline.last=JSON.parse(localStorage.getItem(LAST_CHECK)||'null')}catch{}
 function paint(){
  status.textContent=offline.text;
  const root=document.getElementById('offline-settings');if(!root)return;
  root.querySelector('[data-offline-status]').textContent=offline.text;
  root.querySelector('[data-offline-count]').textContent=offline.total===null?'Aguardando verificação':`${offline.stored??0} de ${offline.total} arquivos íntegros`;
  root.querySelector('[data-offline-version]').textContent=offline.version||'Aguardando identificação';
  const last=offline.last;
  root.querySelector('[data-offline-last]').textContent=last?`${new Date(last.at).toLocaleString('pt-BR')} · ${last.ok?'Concluída':'Incompleta'} · ${last.stored}/${last.total} arquivos · ${last.version}`:'Nenhuma verificação concluída neste navegador.';
  root.querySelector('#pwa-retry').disabled=verificationBusy||!registration?.active;
 }
 function show(text){offline.text=text;paint()}
 function mount(root){
  if(!root)return;
  root.innerHTML='<h2 class="heading">ARMAZENAMENTO OFFLINE</h2><p class="note" data-offline-status role="status"></p><dl class="offline-facts"><div><dt>Arquivos armazenados/verificados</dt><dd data-offline-count></dd></div><div><dt>Versão do pacote instalada</dt><dd data-offline-version></dd></div><div><dt>Resultado da última verificação</dt><dd data-offline-last></dd></div></dl><button id="pwa-retry" class="btn secondary">Verificar offline</button><p class="note">A verificação confere os arquivos já armazenados. Somente arquivos ausentes ou danificados precisam ser baixados novamente quando houver conexão.</p>';
  root.querySelector('#pwa-retry').onclick=verify;paint();
 }
 window.PokeNavPWA=Object.freeze({mount});
 function info(worker,inspect=false){
  return new Promise(resolve=>{
   if(!worker)return resolve(null);
   const channel=new MessageChannel();
   const timeout=setTimeout(()=>{channel.port1.close();resolve(null)},5000);
   channel.port1.onmessage=e=>{clearTimeout(timeout);channel.port1.close();resolve(e.data?.type==='INFO'?e.data:null)};
   try{worker.postMessage({type:'GET_INFO',inspect},[channel.port2])}catch{clearTimeout(timeout);channel.port1.close();resolve(null)}
  });
 }
 async function checkUpdate(){
  const sequence=++checkSequence;update.hidden=true;
  if(activationVersion)return null;
  const active=navigator.serviceWorker.controller,waiting=registration?.waiting;
  // Waiting is a lifecycle state, not proof of a different package.
  if(!active||active.state!=='activated'||!waiting||waiting===active||waiting.state!=='installed')return null;
  const [current,next]=await Promise.all([info(active),info(waiting,true)]);
  if(sequence!==checkSequence||navigator.serviceWorker.controller!==active||registration.waiting!==waiting)return null;
  if(current?.version&&next?.version&&current.version!==next.version&&next.ready===true&&waiting.state==='installed'){
   update.textContent='Nova versão disponível — Atualizar';update.hidden=false;
   return {worker:waiting,version:next.version};
  }
  return null;
 }
 function verify(){
  if(verificationBusy)return;
  const worker=navigator.serviceWorker.controller||registration?.active;
  if(!worker){show('A preparação ainda não terminou. Mantenha esta página aberta com conexão.');return}
  verificationBusy=true;progress.hidden=false;progress.value=0;
  show('Conferindo os arquivos do pacote offline…');worker.postMessage({type:'VERIFY'});
 }
 window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;install.hidden=false});
 install.onclick=async()=>{if(installPrompt){await installPrompt.prompt();installPrompt=null;install.hidden=true}};
 window.addEventListener('appinstalled',()=>{install.hidden=true});
 async function finishActivation(){
  if(!activationVersion||reloaded)return;
  const current=await info(navigator.serviceWorker.controller);
  if(current?.version===activationVersion&&!reloaded){reloaded=true;location.reload()}
 }
 update.onclick=async()=>{
  if(activationVersion)return;
  update.disabled=true;
  try{
   const next=await checkUpdate();if(!next)return;
   if(!confirm('Aplicar a nova versão e reabrir o PokéNav agora? Seus times, PC e jornada serão preservados. Finalize os campos que estiver editando antes de continuar.'))return;
   if(registration.waiting!==next.worker||next.worker.state!=='installed'){await checkUpdate();return}
   activationVersion=next.version;update.hidden=true;next.worker.postMessage({type:'ACTIVATE'});
   setTimeout(async()=>{
    await finishActivation();
    if(!reloaded){activationVersion=null;show('Não foi possível concluir a atualização. Seus dados foram preservados. Tente novamente.');await checkUpdate()}
   },12000);
  }finally{update.disabled=false}
 };
 if(!('serviceWorker' in navigator)||!window.isSecureContext){
  show('Para preparar o modo offline, abra por HTTPS ou localhost.');progress.hidden=true;return;
 }
 navigator.serviceWorker.addEventListener('message',e=>{
  const worker=navigator.serviceWorker.controller||registration?.active;
  // A waiting update cannot overwrite the installed package's status.
  if(worker&&e.source!==worker)return;
  const m=e.data||{};
  if(m.type==='PROGRESS'){progress.hidden=false;progress.value=m.done/m.total*100;show(`${m.phase} ${m.done}/${m.total} arquivos…`)}
  if(m.type==='VERIFIED'){
   verificationBusy=false;progress.hidden=true;
   offline.version=m.version;offline.total=m.total;offline.stored=m.stored??(m.ok?m.total:0);
   offline.last={at:new Date().toISOString(),ok:m.ok,stored:offline.stored,total:m.total,version:m.version};
   try{localStorage.setItem(LAST_CHECK,JSON.stringify(offline.last))}catch{}
   const missing=m.missing?.length?` Arquivos ausentes ou danificados: ${m.missing.join(', ')}${m.missingCount>m.missing.length?'…':''}.`:'';
   show(m.ok?`Pacote offline verificado · ${m.total} arquivos · ${m.version}`:`Pacote offline incompleto: ${offline.stored}/${m.total} arquivos íntegros.${missing} Reconecte e use Verificar offline em Ajustes para reparar.`);
   if(m.ok)navigator.storage?.persist?.().catch(()=>{});checkUpdate();
  }
  if(m.type==='FAILED'){verificationBusy=false;progress.hidden=true;show('Falha na preparação offline: '+m.error+'. Reconecte e tente novamente em Ajustes.')}
 });
 navigator.serviceWorker.addEventListener('controllerchange',()=>{
  if(activationVersion)finishActivation();else {checkUpdate();if(registration?.active&&!verificationBusy)verify()}
 });
 navigator.serviceWorker.register('./service-worker.js',{scope:'./',updateViaCache:'none'}).then(async reg=>{
  registration=reg;paint();checkUpdate();
  const watch=worker=>worker?.addEventListener('statechange',()=>{
   checkUpdate();
   if(worker.state==='redundant'&&!navigator.serviceWorker.controller){verificationBusy=false;show('Preparação offline interrompida. Reconecte e tente novamente.')}
  });
  watch(reg.installing);watch(reg.waiting);
  reg.addEventListener('updatefound',()=>{update.hidden=true;watch(reg.installing)});
  await navigator.serviceWorker.ready;
  const current=await info(navigator.serviceWorker.controller||reg.active);
  if(current){offline.version=current.version;offline.total=current.total;paint()}
  if(!verificationBusy)verify();
 }).catch(e=>{verificationBusy=false;progress.hidden=true;show('Não foi possível preparar o modo offline: '+e.message)});
 document.addEventListener('visibilitychange',()=>{
  if(document.visibilityState==='visible'){checkUpdate();registration?.update().catch(()=>{})}
 });
})();
