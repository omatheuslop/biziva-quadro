# Atualização da auditoria — Biziva Quadro

Base pública: `8e2dbc93d1b009d30fe22a1adc7ac1f2364f55c4`. O repositório completo e seus créditos/licenças continuam disponíveis neste projeto.

O arquivo `biziva-audit-update.tar.gz` contém o código editável das integrações, dependências fixadas e integração de hospedagem desta auditoria. Não contém chaves ou dados de clientes. Depois de clonar este repositório, extraia o arquivo em uma pasta temporária e copie o conteúdo de `native-update/` para a raiz do clone. Instale pelo lockfile e execute o comando de build já documentado no projeto. A pasta `hosting-source/` contém o servidor Sites; seus assets nativos são produzidos pelo build do projeto completo. Configure sua própria identidade de hospedagem e sua própria chave API Biziva, nunca uma chave embutida no servidor.

Correções: chamada compatível com Workers, bloqueio de redirecionamentos, identificador estável por chave/origem/conteúdo, bloqueio de clique duplo e ausência de repetição automática após resultado incerto. Documentos aceita respostas limitadas a 12 parágrafos por seção e mantém escape literal. Dados exige modelo Genérico antes da geração paga.

A geração usa a carteira API do usuário. Arquivos do editor permanecem no navegador; o login identifica a sessão e não sincroniza projetos. Use salvar/exportar para backup. A auditoria não certifica cada módulo ou backend opcional do projeto original. Menus nativos ainda podem usar outros idiomas; o assistente comercial funciona em português.
