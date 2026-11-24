'use strict';
(()=>{
 const status=document.getElementById('pwa-status'),progress=document.getElementById('pwa-progress');
 const retry=document.getElementById('pwa-retry'),update=document.getElementById('pwa-update'),install=document.getElementById('pwa-install');
 let registration,installPrompt,reloading=false,offlineReady=false;
 function show(text){status.textContent=text}
 function waiting(){if(registration?.waiting){update.hidden=false;update.textContent='NOVA VERSÃO · ATUALIZAR'}}
 function verify(){
  offlineReady=false;retry.disabled=true;progress.hidden=false;
  show('Conferindo todos os arquivos do pacote offline…');
  const worker=navigator.serviceWorker.controller||registration?.active;
  if(worker)worker.postMessage({type:'VERIFY'});
  else {show('A preparação ainda não terminou. Mantenha esta página aberta.');retry.disabled=false}
 }
 window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;install.hidden=false});
 install.onclick=async()=>{if(installPrompt){await installPrompt.prompt();installPrompt=null;install.hidden=true}};
 window.addEventListener('appinstalled',()=>{install.hidden=true});
 update.onclick=()=>{
  if(!registration?.waiting)return;
  if(!confirm('Aplicar a nova versão e reabrir o PokéNav agora? Seus times, PC e jornada serão preservados. Finalize os campos que estiver editando antes de continuar.'))return;
  reloading=true;registration.waiting.postMessage({type:'ACTIVATE'});
 };
 retry.onclick=async()=>{
  if(!registration){show('Reabra esta página com conexão para tentar preparar o pacote novamente.');return}
  try{await registration.update()}catch{}
  verify();
 };
 if(!('serviceWorker' in navigator)||!window.isSecureContext){
  show('Para preparar o modo offline, abra por HTTPS ou localhost. Consulte o guia de instalação.');progress.hidden=true;return;
 }
 navigator.serviceWorker.addEventListener('message',e=>{
  const m=e.data||{};
  if(m.type==='PROGRESS'){progress.value=m.done/m.total*100;show(`${m.phase} ${m.done}/${m.total} arquivos…`)}
  if(m.type==='VERIFIED'){
   offlineReady=m.ok;retry.disabled=false;retry.hidden=false;progress.hidden=true;
   show(m.ok?`Pacote offline verificado · ${m.total} arquivos · ${m.version}`:'Pacote offline incompleto. Reconecte e use VERIFICAR OFFLINE para reparar.');
   if(m.ok){navigator.storage?.persist?.().catch(()=>{});waiting()}
  }
  if(m.type==='FAILED'){show('Falha na preparação offline: '+m.error+'. Reconecte e tente novamente.');retry.disabled=false;retry.hidden=false;progress.hidden=true}
 });
 navigator.serviceWorker.addEventListener('controllerchange',()=>{if(reloading)location.reload()});
 navigator.serviceWorker.register('./service-worker.js',{scope:'./',updateViaCache:'none'}).then(async reg=>{
  registration=reg;retry.hidden=false;waiting();
  reg.addEventListener('updatefound',()=>{const worker=reg.installing;worker?.addEventListener('statechange',()=>{
   if(worker.state==='installed')waiting();
   if(worker.state==='redundant'&&!offlineReady){show('Preparação offline interrompida. Reconecte e tente novamente.');retry.disabled=false}
  })});
  await navigator.serviceWorker.ready;verify();
 }).catch(e=>{show('Não foi possível preparar o modo offline: '+e.message);progress.hidden=true;retry.hidden=false});
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')registration?.update().catch(()=>{})});
})();
