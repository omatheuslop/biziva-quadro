# Biziva Quadro — atualização auditada de código

Atualizado em 19/10/2026. O repositório preserva o projeto completo, histórico, créditos e licença do upstream. Este pacote contém os arquivos editáveis da integração Biziva e a fonte de hospedagem conciliada com o design atual.

**Aplicar este pacote é necessário para reproduzir as correções de IA, cobrança e usabilidade.** A presença do arquivo compactado não significa que todos esses arquivos já foram substituídos na árvore principal do GitHub.

## Aplicação em um clone local

1. Confira o SHA256: `shasum -a 256 -c biziva-audit-update.sha256`.
2. Guarde suas alterações locais e extraia o pacote em uma pasta temporária vazia.
3. Compare e copie o conteúdo de `native-update/` sobre os mesmos caminhos do clone. Preserve alterações concorrentes. `SOURCE-SHA256.json` lista o hash de cada arquivo fornecido.
4. Instale pelo lockfile e use o comando de build do projeto original. Mapas usa `web/`; Documentos usa o workspace `apps/web`. Slides inclui o plugin de tradução e a configuração Vite. Nenhuma chave API acompanha o pacote.
5. A pasta `hosting-source/` corresponde à revisão Sites `c8dd1af3117e274e71d3d477ebcac658343ec4b5`. Ela exclui identidade do Site, credenciais, dependências instaladas e assets compilados. Prepare os assets a partir do build nativo com o script `prepare-native.mjs`; configure uma identidade de hospedagem própria antes de publicar. Não reutilize IDs ou credenciais de outra instalação.

## Escopo e validação

A integração exige ação explícita para geração paga, consentimento e chave apenas na memória. Pedidos idênticos mantêm o identificador de operação, com bloqueio de duplo clique e sem repetição automática de envio incerto. Respostas passam por validadores antes de alterar o editor. O código da hospedagem rejeita redirecionamentos da API sem encaminhar credenciais.

A auditoria anterior exerceu geração real nos dez editores e conferiu uma liquidação por operação, incluindo replays nos casos testados. A etapa de 19/10 acrescenta melhorias de idioma, acesso por teclado, campos móveis e recuperação de arquivos conforme o produto. Vetores oferece cópia SVG direta; Mapas oferece cópia SMM direta; essas cópias locais não chamam IA. Os mecanismos nativos de salvar e importar continuam disponíveis.

Projetos ficam no navegador ou em arquivos exportados. Login não é sincronização nem fornece saldo. Integrações e backends opcionais do upstream exigem configuração própria. Os testes não representam uma certificação de cada recurso opcional, idioma, navegador ou formato, nem uma comparação universal de qualidade com o upstream.
