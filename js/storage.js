'use strict';
// A single setItem atomically commits teams, PC, journey and preferences.
// Old keys are read only as fallback; HTML 3.4 JSON backups retain their schema.
window.PokeNavStore=(()=>{
 const KEY='pokenav-personal-v1';
 function snapshot(){
  const raw=localStorage.getItem(KEY);
  if(raw===null)return null;
  const s=JSON.parse(raw);
  if(s?.schema!==1||!s.values||typeof s.values!=='object')throw Error('Armazenamento pessoal inválido. Importe um backup.');
  return s.values;
 }
 return Object.freeze({
  getItem(key){const s=snapshot();return s&&Object.hasOwn(s,key)?s[key]:localStorage.getItem(key)},
  commit(values){localStorage.setItem(KEY,JSON.stringify({schema:1,values}))}
 });
})();
