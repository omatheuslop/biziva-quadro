import {useEffect,useRef} from 'react';
import {CaptureUpdateAction,convertToExcalidrawElements} from '@excalidraw/excalidraw';
import type {ExcalidrawImperativeAPI} from '@excalidraw/excalidraw/types';
import {mountAssistant} from './assistant.mjs';
import {parseScene,inspectScene} from './scene.mjs';

export default function BizivaAssistant({api}:{api:ExcalidrawImperativeAPI|null}){
  const host=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    if(!api||!host.current)return;
    // Keep the React-owned outer node stable across StrictMode cleanup/remount.
    const node=host.current.ownerDocument.createElement('div');
    host.current.append(node);
    return mountAssistant(node,{
      title:'Biziva Quadro',
      description:'Transforme o plano do negócio em cartões editáveis. Desenho, exportação e histórico do Excalidraw preservados.',
      placeholder:'Planeje o lançamento de um serviço de fotografia em cinco etapas…',
      sourceUrl:'https://github.com/omatheuslop/biziva-quadro',
      instruction:'Retorne apenas JSON {"cards":[{"title":"Etapa curta","body":"Ação concreta"}]}. Entre 1 e 24 cartões, título até 70 caracteres, corpo até 240. Planeje ações úteis com base no pedido. Não invente valores ou fatos da empresa.',
      parse:parseScene,
      inspect:()=>inspectScene(api.getSceneElements()),
      apply:(cards:{title:string;body:string}[])=>{
        const existing=api.getSceneElements();
        const right=existing.reduce((max,element)=>Math.max(max,element.x+element.width),-300)+300;
        const additions=convertToExcalidrawElements(cards.map((card,index)=>({
          type:'rectangle' as const,x:right+(index%3)*360,y:Math.floor(index/3)*260,width:310,height:200,
          backgroundColor:'#e9fac8',strokeColor:'#263717',fillStyle:'solid' as const,roughness:0,
          label:{text:card.title+'\n\n'+card.body,fontSize:18},
        })));
        api.updateScene({elements:[...existing,...additions],captureUpdate:CaptureUpdateAction.IMMEDIATELY});
        api.setViewport({target:{x:right,y:0,width:Math.min(3,cards.length)*360,height:Math.ceil(cards.length/3)*260},fit:'contain'});
      },
    });
  },[api]);
  return <div ref={host}/>;
}
