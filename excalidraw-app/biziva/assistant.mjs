// Biziva assistant: per-editor state, memory-only keys, explicit paid dispatch.
// All AI output passes the product validator before any native state mutation.
export function mountAssistant(host, options) {
  const doc = host.ownerDocument;
  const win = doc.defaultView;
  if (!win) throw Error('Editor sem janela ativa.');
  // Use scoped light DOM: legacy editor shortcut/clipboard handlers must see
  // the actual input target instead of a retargeted shadow host.
  const root = host;
  root.id='biziva-assistant-'+win.crypto.randomUUID();
  root.innerHTML = `<style>
  :host{position:fixed;right:16px;bottom:24px;z-index:10000;font:14px/1.5 system-ui;color:#edf2fc}*{box-sizing:border-box}button,a,input,textarea{font:inherit}button{background:#c9f65b;color:#17210b;border:0;border-radius:10px;padding:10px 14px;cursor:pointer;font-weight:650}button:disabled{opacity:.45;cursor:not-allowed;visibility:visible}section{width:min(390px,calc(100vw - 32px));max-height:calc(100dvh - 110px);overflow:auto;background:#111b2e;border:1px solid #4a5b79;border-radius:18px;padding:20px;margin-bottom:8px;box-shadow:0 15px 60px #0007}section[hidden]{display:none}header{display:flex;justify-content:space-between;align-items:center}h2{font-size:20px;margin:0}h3{font-size:15px}label{display:block;margin:12px 0}input[type=password],textarea{display:block;width:100%;background:#0b1220;color:#fff;border:1px solid #526584;border-radius:8px;padding:10px}textarea{min-height:90px;resize:vertical}.consent{display:flex;gap:8px}.consent input{margin-top:5px}small,footer{font-size:12px;color:#bcc9e0}a{color:#c9f65b}footer{border-top:1px solid #4a5b79;padding-top:12px;margin-top:12px}ul{padding-left:20px}summary{cursor:pointer;margin:12px 0}:focus-visible{outline:3px solid #c9f65b;outline-offset:2px}.actions{display:flex;gap:8px;flex-wrap:wrap}
  </style><section hidden aria-label="Assistente Biziva"><header><h2></h2><button id="close" aria-label="Fechar assistente">×</button></header><p id="description"></p><label>Descrição<textarea id="prompt" maxlength="5000"></textarea></label><label>Chave API Biziva<input id="key" type="password" autocomplete="off" spellcheck="false"></label><small>Chave apenas na memória desta aba. A geração usa o saldo da sua carteira API.</small><label class="consent"><input id="consent" type="checkbox">Autorizo enviar esta descrição à API Biziva e usar meu saldo.</label><button id="generate" disabled>Gerar rascunho com IA</button><details><summary>Revisar ou importar rascunho sem gastar IA</summary><textarea id="draft" aria-label="Rascunho editável" maxlength="60000"></textarea></details><div class="actions"><button id="apply" disabled>Adicionar ao editor</button><button id="review">Revisar projeto sem IA</button></div><p id="status" role="status" aria-live="polite"></p><ul id="issues"></ul><footer><a href="/conta" target="_top">Minha conta · ChatGPT</a> · <a id="source" target="_blank" rel="noreferrer">Código-fonte e créditos</a></footer></section><button id="toggle" aria-expanded="false"></button>`;
  for(const node of root.querySelectorAll('[id]')){
    node.setAttribute('data-biziva-control',node.id);node.removeAttribute('id');
  }
  const style=root.querySelector('style');
  style.textContent=style.textContent.replace(/(^|})([^{}]+)\{/g,(_match,end,selectors)=>end+selectors.split(',').map(selector=>selector.trim()===':host'?'#'+root.id:'#'+root.id+' '+selector.trim()).join(',')+'{');
  const el = id => root.querySelector('[data-biziva-control="'+id+'"]');
  const section=root.querySelector('section');
  root.querySelector('h2').textContent=options.title;
  el('toggle').textContent='✦ '+options.title;
  el('description').textContent=options.description;
  el('prompt').placeholder=options.placeholder;
  el('source').href=options.sourceUrl;
  const attempts=new Map();
  let busy=false;
  const status = message => { el('status').textContent=message; };
  function sync(){ el('generate').disabled=busy||!el('key').value||!el('prompt').value.trim()||!el('consent').checked;el('apply').disabled=busy||!el('draft').value.trim(); }
  const toggle = open => {section.hidden=!open;el('toggle').setAttribute('aria-expanded',String(open));if(open)el('prompt').focus();};
  el('toggle').onclick=()=>toggle(section.hidden);
  el('close').onclick=()=>{toggle(false);el('toggle').focus();};
  root.addEventListener('keydown',event=>{event.stopPropagation();if(event.key==='Escape')toggle(false);});
  root.addEventListener('input',sync);
  function review(){
    const issues=options.inspect();el('issues').replaceChildren();
    for(const issue of issues){const li=doc.createElement('li');li.textContent=issue;el('issues').append(li);}
    if(!issues.length)status('Sem alertas nas regras locais. Revise o material antes de usar.');
  }
  el('review').onclick=review;
  el('generate').onclick=async()=>{
    if(busy||el('generate').disabled)return;
    busy=true;sync();status('Uma geração em andamento…');
    try {
      const key=el('key').value;
      const prompt=options.instruction+'\nDescrição do usuário:\n'+el('prompt').value;
      const digest=await win.crypto.subtle.digest('SHA-256',new win.TextEncoder().encode(key+'\n'+prompt));
      const fingerprint=Array.from(new Uint8Array(digest),n=>n.toString(16).padStart(2,'0')).join('');
      let id=attempts.get(fingerprint);
      if(!id){id=win.crypto.randomUUID();attempts.set(fingerprint,id);}
      const response=await win.fetch('/api/assist',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+key,'X-Request-Id':id},body:JSON.stringify({prompt})});
      const result=await response.json();
      if(!response.ok)throw Error(result.error||'A API não confirmou o resultado.');
      options.parse(result.text);
      el('draft').value=result.text;root.querySelector('details').open=true;
      status('Rascunho validado. Revise antes de adicionar ao projeto.');
    }catch(error){status(String(error.message||error)+' Não há repetição automática.');}
    finally{busy=false;sync();}
  };
  el('apply').onclick=async()=>{
    if(busy||el('apply').disabled)return;
    busy=true;sync();
    try{await options.apply(options.parse(el('draft').value));el('draft').value='';review();status('Adicionado ao editor. O projeto anterior foi preservado.');}
    catch(error){status(String(error.message||error));}
    finally{busy=false;sync();}
  };
  return ()=>{el('key').value='';attempts.clear();host.remove();};
}

export function parseJSON(text){
  if(typeof text!=='string'||text.length>60000)throw Error('Rascunho excedeu o limite.');
  return JSON.parse(text.trim().replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/,''));
}

export function cleanText(value,max=400){
  if(typeof value!=='string'||!value.trim()||value.length>max)throw Error('Texto ausente ou muito longo.');
  return value.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g,'');
}
