# BINC — Process Intelligence

> Plataforma web para gestão de processos no ecossistema **Lecom BPM**, com mapeamento de campos, construção de fluxogramas, geração de scripts e assistente IA especializado na API JavaScript do Lecom BPM 5.50.

![BINC Preview](https://img.shields.io/badge/version-2.1-00d4b0?style=flat-square&labelColor=111)
![HTML](https://img.shields.io/badge/HTML-pure-e34f26?style=flat-square&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS-vanilla-1572b6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-f7df1e?style=flat-square&logo=javascript&logoColor=black)
![Zero deps](https://img.shields.io/badge/dependências-zero-3dd68c?style=flat-square)

---

## ✨ Funcionalidades

### 🗺️ Mapa de Campos
Visualize e gerencie todos os campos de um processo organizados por **etapa** e **grupo**.
- Crie etapas e grupos arrastáveis
- Defina visibilidade de cada campo: Visível, Somente Leitura, Oculto, Condicional ou Parcial
- Importe/exporte dados em JSON
- Auto-save via `localStorage`

### 🔄 Fluxo AS-IS
Construtor visual de fluxogramas de processo com elementos arrastáveis.
- Formas: Início/Fim, Processo, Decisão, Documento, Manual
- Conexão entre nós com setas direcionais
- Edição inline de rótulos (clique duplo)
- Exportação em SVG
- Desfazer última ação

### 📝 Script BPM
Gerador de scripts JavaScript no **padrão LECOM** — preencha os campos e o código é gerado automaticamente.
- Gera estrutura completa com todas as etapas e eventos (SUBMIT, BLUR, FOCUS, CHANGE, SET_FIELD_VALUE)
- Nomenclatura correta: funções prefixadas, variáveis tipadas
- Copiar para clipboard ou baixar como `.js`

### 🤖 IA Binc BPM
Assistente conversacional especializado na **API JavaScript do Lecom BPM 5.50**.
- Base de conhecimento com 27+ pares de perguntas e respostas
- Cobre: Form API, campos, eventos, Grid, Autocomplete, máscaras, ProcessData, e mais
- Sugestões rápidas com refresh automático
- Renderização de blocos de código nas respostas
- Indicador de digitação animado

### 💡 Ideias & Projetos
Catálogo de melhorias e projetos organizados por prioridade.
- Cards colapsáveis com detalhamento
- Tags de prioridade: Baixa / Média / Alta

---

## 📁 Estrutura do Projeto

```
binc/
├── binc.html       # Estrutura HTML principal
├── binc.css        # Tema dark + todos os estilos
├── binc-kb.js      # Base de conhecimento da IA (KB + SUGGESTIONS)
└── binc.js         # Lógica da aplicação (mapa, fluxo, script, chat)
```

> ⚠️ **Importante:** todos os arquivos devem estar na **mesma pasta**. O `binc.html` referencia os demais com caminhos relativos.

---

## 🚀 Como usar

Não há build, servidor ou instalação necessária.

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/binc.git

# Abra diretamente no navegador
cd binc
open binc.html
```

Ou simplesmente faça download do ZIP e abra o `binc.html` em qualquer navegador moderno.

---

## 🎨 Design

| Elemento | Valor |
|---|---|
| Tema | Dark — preto puro (`#000`) |
| Fonte principal | [Inter](https://fonts.google.com/specimen/Inter) |
| Fonte de código | [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) |
| Cor de destaque | `#00d4b0` (teal) |
| Superfícies | `#0a0a0a` → `#111` → `#181818` → `#202020` |

---

## 🧠 Base de Conhecimento da IA

O arquivo `binc-kb.js` contém o array `KB` com os conhecimentos do assistente. Cada entrada segue o formato:

```js
{
  tags: ['palavra-chave', 'outra', ...],   // usadas para busca por score
  q: 'Pergunta exemplo?',                  // pergunta representativa
  a: `Resposta em HTML com <code> e <pre>` // resposta formatada
}
```

Para **adicionar novos conhecimentos**, basta incluir um novo objeto no array `KB` em `binc-kb.js`. O mecanismo de busca pondera automaticamente as tags contra a mensagem do usuário.

**Tópicos cobertos atualmente:**
- Acesso à variável `Form` e ciclo de vida
- `apply()` — boas práticas e Promise
- Valores de campos por tipo (texto, inteiro, decimal, data, lista)
- `visible()`, `readOnly()`, `errors()`, `helpText()`
- Eventos de formulário: `SUBMIT`, `BLUR`, `FOCUS`, `CHANGE`, `SET_FIELD_VALUE`
- Grid: `insertDataRow`, `updateDataRow`, `removeDataRow`, `dataRows()`
- Eventos de Grid: `GRID_SUBMIT`, `GRID_ADD_BEFORE`, `GRID_EDIT_BEFORE`, `GRID_DELETE_BEFORE`, `GRID_DATA_ROW_LOADED`
- Autocomplete: `addOptions`, `removeOptions`, `clear`
- Máscaras: CPF, CNPJ, custom
- Labels, ações, grupos, `setRequired`, `focus`, `get`/`set`
- `ProcessData` e `loader`/`modal`
- Boas práticas gerais

---

## 💾 Persistência de Dados

Todos os dados do usuário são salvos automaticamente no **`localStorage`** do navegador sob as chaves prefixadas com `binc_`:

| Chave | Conteúdo |
|---|---|
| `binc_map` | Mapa de campos (etapas, grupos, campos e visibilidades) |
| `binc_fluxo` | Nós e conexões do fluxograma |

Nenhum dado é enviado a servidores externos.

---

## 🌐 Compatibilidade

| Navegador | Suporte |
|---|---|
| Chrome / Edge 90+ | ✅ Completo |
| Firefox 88+ | ✅ Completo |
| Safari 14+ | ✅ Completo |
| Opera 76+ | ✅ Completo |

---

## 📄 Licença

Este projeto é de uso interno. Consulte o responsável do repositório para informações sobre redistribuição.

---

<div align="center">
  <sub> · BINC v2.1</sub>
</div>
