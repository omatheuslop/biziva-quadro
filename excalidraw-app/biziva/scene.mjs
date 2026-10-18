import {parseJSON, cleanText} from './assistant.mjs';
export function parseScene(text){
  const data=parseJSON(text);
  if(!Array.isArray(data.cards)||!data.cards.length||data.cards.length>24)throw Error('Use entre 1 e 24 cartões.');
  return data.cards.map(card=>({title:cleanText(card.title,70),body:cleanText(card.body,240)}));
}
export function inspectScene(elements){
  const live=elements.filter(element=>!element.isDeleted);
  const issues=[];
  if(!live.length)issues.push('O quadro está vazio. Descreva uma oferta, plano ou processo para começar.');
  const unlabeled=live.filter(element=>['rectangle','ellipse','diamond'].includes(element.type)&&!element.boundElements?.some(bound=>bound.type==='text'));
  if(unlabeled.length)issues.push(`${unlabeled.length} formas sem rótulo associado; revise a clareza do quadro.`);
  const tiny=live.filter(element=>element.type==='text'&&element.fontSize<14);
  if(tiny.length)issues.push(`${tiny.length} textos com fonte menor que 14; podem ficar difíceis de ler.`);
  return issues;
}
