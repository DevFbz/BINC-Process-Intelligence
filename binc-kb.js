//  IA Binc — BASE DE CONHECIMENTO
// ═══════════════════════════════════════════════════
const KB = [
    {
      tags:['form','api','instanciar','variavel','acessar','iniciar'],
      q:'Como acesso a API do Form?',
      a:`Para acessar a API do Form no Lecom BPM 5.50, basta usar a variável global <code>Form</code> diretamente no seu script:
  
  <pre>// Forma atual (v5.30+)
  Form;
  
  // Forma antiga (depreciada)
  var formAPI = Lecom.api.ProcessAPI.currentProcess().form();</pre>
  
  A variável <code>Form</code> é o ponto de entrada para todos os componentes da API: campos, grupos, ações e eventos.`
    },
    {
      tags:['apply','aplicar','renderizar','performance','chamar','atualizar'],
      q:'Como funciona o apply() e qual a melhor prática?',
      a:`O <code>apply()</code> é o método que aplica todas as mudanças na tela. A **melhor prática** é chamar apenas **uma vez** no final, agrupando todas as alterações:
  
  <pre>// ❌ INCORRETO — renderiza 3 vezes
  Form.fields('NOME').value('Teste').apply();
  Form.fields('CPF').visible(false).apply();
  Form.fields('DATA').readOnly(true).apply();
  
  // ✅ CORRETO — renderiza apenas uma vez
  Form.fields('NOME').value('Teste');
  Form.fields('CPF').visible(false);
  Form.fields('DATA').readOnly(true);
  Form.apply(); // uma única vez no final</pre>
  
  O <code>apply()</code> retorna uma **Promise**, permitindo encadear operações assíncronas com <code>.then()</code>.`
    },
    {
      tags:['value','valor','campo','setar','definir','tipo','texto','inteiro','data','lista'],
      q:'Como definir o valor de um campo?',
      a:`Use <code>Form.fields('ID').value(valor).apply()</code>. Cada tipo aceita um formato diferente:
  
  <pre>// Linha de texto / Caixa de texto
  Form.fields('NOME').value('João Silva').apply();
  
  // Inteiro
  Form.fields('IDADE').value(30).apply();
  
  // Decimal / Monetário
  Form.fields('VALOR').value(1500.50).apply();
  
  // Data (string no formato DD/MM/AAAA)
  Form.fields('DATA_NASC').value('15/03/1990').apply();
  
  // Lista / Radio / Checkbox
  Form.fields('STATUS').value('Aprovado').apply();</pre>
  
  Para **ler** o valor, chame sem parâmetro:
  <pre>var nome = Form.fields('NOME').value();</pre>`
    },
    {
      tags:['visible','visivel','ocultar','esconder','mostrar','invisivel'],
      q:'Como mostrar ou ocultar um campo?',
      a:`Use a propriedade <code>visible</code> com valor booleano:
  
  <pre>// Ocultar campo
  Form.fields('CAMPO').visible(false).apply();
  
  // Mostrar campo
  Form.fields('CAMPO').visible(true).apply();
  
  // Verificar visibilidade atual
  var isVisible = Form.fields('CAMPO').visible();</pre>
  
  Para grupos inteiros (incluindo todos os campos dentro):
  <pre>Form.groups('ID_GRUPO').visible(false).apply();
  Form.groups('ID_GRUPO').visible(true).apply();</pre>`
    },
    {
      tags:['disabled','bloquear','desbloquear','readonly','somente leitura','readOnly'],
      q:'Como bloquear ou tornar um campo somente leitura?',
      a:`Há duas propriedades distintas:
  
  **disabled** — bloqueia completamente o campo (não editável):
  <pre>Form.fields('CAMPO').disabled(true).apply();  // bloqueia
  Form.fields('CAMPO').disabled(false).apply(); // desbloqueia</pre>
  
  **readOnly** — somente leitura:
  <pre>Form.fields('CAMPO').readOnly(true).apply();
  Form.fields('CAMPO').readOnly(false).apply();</pre>
  
  Para bloquear um **grupo** inteiro com todos seus campos:
  <pre>Form.groups('ID_GRUPO').disabled(true).apply();</pre>`
    },
    {
      tags:['errors','erro','validacao','validar','mensagem erro','campo invalido'],
      q:'Como exibir erros de validação em campos?',
      a:`Use a propriedade <code>errors</code> para exibir mensagens em vermelho abaixo do campo:
  
  <pre>// Erro único (string)
  Form.fields('CPF').errors('CPF inválido').apply();
  
  // Múltiplos erros (array)
  Form.fields('CPF').errors(['Valor obrigatório', 'CPF inválido']).apply();
  
  // Erro no Form inteiro
  Form.errors({ NOME: 'Campo inválido', CPF: 'Formato incorreto' }).apply();</pre>
  
  Para **parar o submit** com erros personalizados use no evento SUBMIT:
  <pre>Form.subscribe('SUBMIT', function(formId, actionId, reject) {
    if (!cpfValido) {
      Form.fields('CPF').errors('CPF inválido');
      reject(); // para o submit
    }
    Form.apply();
  });</pre>`
    },
    {
      tags:['submit','evento','subscribe','form event','submeter','enviar','aprovar','rejeitar'],
      q:'Como usar o evento SUBMIT do Form?',
      a:`O evento <code>SUBMIT</code> é disparado quando qualquer ação de submissão é executada (aprovar, rejeitar, finalizar):
  
  <pre>Form.subscribe('SUBMIT', function(formId, actionId, reject) {
    var cpf = Form.fields('CPF').value();
    var invalido = false;
  
    if (!cpf) {
      Form.fields('CPF').errors('CPF obrigatório');
      invalido = true;
    }
  
    if (invalido) {
      reject(); // interrompe o submit
    }
  
    Form.apply();
  });</pre>
  
  Outros eventos do Form:
  - <code>SUBMIT_SUCCESS</code> — submit concluído com sucesso
  - <code>SUBMIT_ERROR</code> — erro no servidor
  - <code>VALIDATION_ERROR</code> — campos inválidos`
    },
    {
      tags:['campo evento','blur','focus','change','keypress','set_field_value','campo change'],
      q:'Quais são os eventos de campo disponíveis?',
      a:`Os principais eventos de campo são:
  
  <pre>// BLUR — quando o campo perde foco
  Form.fields('CAMPO').subscribe('BLUR', function() { });
  
  // FOCUS — quando o campo ganha foco
  Form.fields('CAMPO').subscribe('FOCUS', function() { });
  
  // CHANGE — quando valor é digitado pelo usuário
  Form.fields('CAMPO').subscribe('CHANGE', function() { });
  
  // SET_FIELD_VALUE — quando valor é alterado via API JS
  Form.fields('IDADE').subscribe('SET_FIELD_VALUE', function() {
    Form.fields('RESULTADO').value(calcular()).apply();
  });</pre>
  
  ⚠️ <code>SET_FIELD_VALUE</code> NÃO é disparado quando o usuário digita diretamente. Para esse caso, use <code>CHANGE</code>.`
    },
    {
      tags:['grid','inserir','addrow','insertdatarow','linha','adicionar linha'],
      q:'Como inserir uma linha no Grid?',
      a:`Use <code>insertDataRow</code> passando um objeto com os IDs dos campos do grid:
  
  <pre>var gridAPI = Form.grids('GRID_ITENS');
  
  // Insere uma nova linha
  gridAPI.insertDataRow({
    NOME_ITEM: 'Produto A',
    PRECO_UNITARIO: 29.90,
    QUANTIDADE: 5
  });</pre>
  
  Não é necessário chamar <code>apply()</code> após <code>insertDataRow</code>.`
    },
    {
      tags:['grid','atualizar','updaterow','updatedatarow','editar linha','alterar linha'],
      q:'Como atualizar uma linha do Grid?',
      a:`Use <code>updateDataRow</code>. Primeiro busque a linha com <code>dataRows()</code>, altere os valores e chame o update:
  
  <pre>var gridAPI = Form.grids('GRID_ITENS');
  
  // Filtra a linha pelo nome
  var linhas = gridAPI.dataRows(function(row) {
    return row.NOME_ITEM === 'Produto A';
  });
  
  // Atualiza cada linha encontrada
  linhas.forEach(function(row) {
    row.PRECO_UNITARIO = 49.90;
    gridAPI.updateDataRow(row);
  });</pre>`
    },
    {
      tags:['grid','remover','deletar','excluir linha','removedatarow'],
      q:'Como remover linhas do Grid?',
      a:`Use <code>removeDataRow</code> passando o <code>id</code> da linha. Primeiro filtre com <code>dataRows()</code>:
  
  <pre>var gridAPI = Form.grids('GRID_ITENS');
  
  // Remove linhas com preço maior que 100
  var aRemover = gridAPI.dataRows(function(row) {
    return row.PRECO_UNITARIO > 100;
  });
  
  aRemover.forEach(function(row) {
    gridAPI.removeDataRow(row.id);
  });</pre>`
    },
    {
      tags:['grid','datarows','listar linhas','buscar linhas','filtrar linhas','dados grid'],
      q:'Como acessar os dados (dataRows) de um Grid?',
      a:`Use o método <code>dataRows()</code> do gridAPI:
  
  <pre>var gridAPI = Form.grids('MINHA_GRID');
  
  // Todos os dataRows
  var todos = gridAPI.dataRows();
  
  // Por posição (índice começa em 0)
  var primeira = gridAPI.dataRows(0);
  
  // Por filtro (função)
  var caros = gridAPI.dataRows(function(row) {
    return row.PRECO > 20.0;
  });</pre>
  
  Cada dataRow é um objeto onde as chaves são os IDs dos campos do grid.`
    },
    {
      tags:['grid evento','grid_submit','grid_add','grid_edit','grid_destroy','evento grid'],
      q:'Quais eventos estão disponíveis para o Grid?',
      a:`Os principais eventos de grid são:
  
  <pre>// GRID_SUBMIT — linha adicionada ou atualizada
  Form.grids('GRID').subscribe('GRID_SUBMIT', function(formId, gridId, row, reject) { });
  
  // GRID_ADD_SUBMIT — apenas quando adicionada
  Form.grids('GRID').subscribe('GRID_ADD_SUBMIT', function() { });
  
  // GRID_EDIT_SUBMIT — apenas quando atualizada
  Form.grids('GRID').subscribe('GRID_EDIT_SUBMIT', function() { });
  
  // GRID_DESTROY — linha removida
  Form.grids('GRID').subscribe('GRID_DESTROY', function() { });
  
  // GRID_DATA_ROW_LOADED — dados carregados (evita setTimeout)
  Form.grids('GRID').subscribe('GRID_DATA_ROW_LOADED',
    function(formId, gridId, dataRows) {
      // use dataRows aqui sem setTimeout
    }
  );</pre>`
    },
    {
      tags:['autocomplete','lista','addoptions','removeoptions','clear','opcoes','opções'],
      q:'Como manipular opções de uma Lista (Autocomplete)?',
      a:`Use os métodos do campo Autocomplete:
  
  <pre>var lista = Form.fields('MINHA_LISTA');
  
  // Adicionar opções (string simples)
  lista.addOptions('Opção 1').apply();
  
  // Adicionar várias (array de strings)
  lista.addOptions(['Opção 1', 'Opção 2', 'Opção 3']).apply();
  
  // Adicionar com name/value distintos
  lista.addOptions([
    { name: 'São Paulo', value: 'SP' },
    { name: 'Rio de Janeiro', value: 'RJ' }
  ]).apply();
  
  // Limpar e adicionar ao mesmo tempo (true = limpa antes)
  lista.addOptions(['Nova Opção'], true).apply();
  
  // Remover opção específica
  lista.removeOptions('Opção 1').apply();
  
  // Remover lista inteira
  lista.clear().apply();</pre>`
    },
    {
      tags:['mascara','mask','cpf','cnpj','cep','formato','mascara customizada'],
      q:'Como aplicar máscaras em campos?',
      a:`Use a propriedade <code>mask</code>. Há máscaras pré-definidas e customizadas:
  
  **Máscaras pré-definidas:**
  <pre>Form.fields('CPF').mask('cpf').apply();    // XXX.XXX.XXX-XX
  Form.fields('CNPJ').mask('cnpj').apply();  // XX.XXX.XXX/XXXX-XX</pre>
  
  **Máscaras customizadas** (padrão jQuery Mask Plugin):
  <pre>// Data
  Form.fields('DATA').mask('00/00/0000').apply();
  
  // CEP
  Form.fields('CEP').mask('99.999-999').apply();
  
  // Telefone
  Form.fields('FONE').mask('(00) 00000-0000').apply();</pre>
  
  Para **remover** uma máscara:
  <pre>Form.fields('CAMPO').removeMask().apply();</pre>`
    },
    {
      tags:['label','alterar label','renomear campo','titulo campo'],
      q:'Como alterar o label de um campo?',
      a:`Use a propriedade <code>label</code>:
  
  <pre>// Alterar label
  Form.fields('NOME').label('Nome Completo').apply();
  
  // Encadear com outras propriedades
  Form.fields('NOME')
    .label('Nome Completo')
    .value('João')
    .readOnly(true)
    .apply();</pre>
  
  Para **ler** o label atual:
  <pre>var labelAtual = Form.fields('NOME').label();</pre>`
    },
    {
      tags:['actions','acao','botao','aprovar','rejeitar','executar','execute','hidden','disabled action'],
      q:'Como manipular ações (botões) do Form?',
      a:`As ações são os botões do formulário (aprovar, rejeitar, etc.):
  
  <pre>// Executar uma ação via código
  Form.actions('aprovar').execute();
  
  // Ocultar botão
  Form.actions('rejeitar').hidden(true).apply();
  
  // Desabilitar botão
  Form.actions('aprovar').disabled(true).apply();
  
  // Alterar label do botão
  Form.actions('aprovar').label('Confirmar').apply();
  
  // Adicionar confirmação antes de executar
  Form.actions('rejeitar')
    .confirmsWith('Confirma a rejeição?')
    .apply();
  
  // Mudar ícone (Material Icons)
  Form.actions('aprovar').icon('check_circle').apply();</pre>`
    },
    {
      tags:['grupo','group','expandir','fechar','expanded','grupos'],
      q:'Como manipular grupos do Form?',
      a:`Os grupos são acessados via <code>Form.groups('ID_GRUPO')</code>:
  
  <pre>// Expandir/fechar grupo
  Form.groups('GRUPO_1').expanded(true);   // expande
  Form.groups('GRUPO_1').expanded(false);  // fecha
  
  // Bloquear/desbloquear grupo e seus campos
  Form.groups('GRUPO_1').disabled(true).apply();
  Form.groups('GRUPO_1').disabled(false).apply();
  
  // Ocultar/mostrar grupo e seus campos
  Form.groups('GRUPO_1').visible(false).apply();
  Form.groups('GRUPO_1').visible(true).apply();
  
  // Acessar campos de um grupo específico
  var campos = Form.groups('GRUPO_1').fields();
  var campo = Form.groups('GRUPO_1').fields('NOME');</pre>`
    },
    {
      tags:['setrequired','obrigatorio','required','validação obrigatoriedade'],
      q:'Como tornar um campo obrigatório por ação?',
      a:`Use <code>setRequired</code> associando a uma ação específica:
  
  <pre>// Obrigatório para aprovar
  Form.fields('CAMPO').setRequired('aprovar', true).apply();
  
  // Obrigatório para cancelar
  Form.fields('CAMPO').setRequired('cancel', true).apply();
  
  // Obrigatório para rejeitar
  Form.fields('CAMPO').setRequired('rejeitar', true).apply();
  
  // Obrigatório para finalizar
  Form.fields('CAMPO').setRequired('finish', true).apply();
  
  // Tornar opcional novamente
  Form.fields('CAMPO').setRequired('aprovar', false).apply();
  
  // Múltiplas ações de uma vez
  Form.fields('CAMPO').validations([
    { formActionName: 'aprovar', required: true },
    { formActionName: 'cancel', required: true }
  ]).apply();</pre>`
    },
    {
      tags:['processdata','etapa','ciclo','informacoes','codEtapa','activityInstanceId'],
      q:'Como obter informações da atividade/etapa atual?',
      a:`Use o objeto <code>ProcessData</code> que está disponível globalmente:
  
  <pre>// Título da etapa
  var titulo = ProcessData.activityTitle;
  
  // Número do ciclo
  var ciclo = ProcessData.cycle;
  
  // Código da instância da etapa
  var codEtapa = ProcessData.activityInstanceId;
  
  // ID do processo
  var codProcesso = ProcessData.processInstanceId;
  
  // Versão do processo
  var versao = ProcessData.version;
  
  // ID do formulário
  var codForm = ProcessData.processId;</pre>`
    },
    {
      tags:['listar ids','map','campos disponiveis','listar campos','ids'],
      q:'Como listar todos os IDs de campos e ações?',
      a:`Use a função <code>map()</code> para inspecionar os componentes disponíveis no Form:
  
  <pre>// Listar IDs de todos os campos do Form
  Form.fields().map(function(f){ return f.id; });
  // Ex: ["NOME", "CPF", "DATA", "GRID_ITENS"]
  
  // Listar IDs de todas as ações
  Form.actions().map(function(a){ return a.id; });
  // Ex: ["aprovar", "cancel"]
  
  // Listar IDs de campos de um Grid
  Form.grids('GRID').fields().map(function(f){ return f.id; });
  // Ex: ["ITEM", "PRECO", "QTD"]
  
  // Listar ações de um campo específico
  Form.fields('CEP').actions().map(function(a){ return a.id; });
  // Ex: ["CEP_lookup"]</pre>
  
  💡 Dica: execute esses comandos no console do Chrome DevTools para inspecionar antes de codar.`
    },
    {
      tags:['focus','foco','cursor','ir para campo'],
      q:'Como colocar foco em um campo?',
      a:`Use o método <code>focus()</code> após o campo estar visível:
  
  <pre>var campoAPI = Form.fields('NOME');
  
  // Colocar foco diretamente
  campoAPI.focus();
  
  // Tornar visível e depois focar (usando Promise)
  campoAPI.visible(true).apply().then(function() {
    campoAPI.focus();
  });</pre>
  
  ⚠️ O <code>focus()</code> deve ser chamado **após** o <code>apply()</code> ser resolvido, pois o campo precisa estar renderizado na tela.`
    },
    {
      tags:['get','set','ler propriedades','leitura','propriedades'],
      q:'Como ler e definir propriedades de componentes?',
      a:`Existem dois métodos para leitura e escrita:
  
  **Leitura — método get:**
  <pre>// Todas as propriedades de uma vez
  var props = Form.fields('NOME').get();
  
  // Propriedade específica
  var valor = Form.fields('NOME').get('value');
  var label = Form.fields('NOME').get('label');</pre>
  
  **Escrita — método set (múltiplas propriedades):**
  <pre>Form.fields('NOME').set({
    value: 'João da Silva',
    label: 'Nome Completo',
    readOnly: true
  }).apply();</pre>
  
  **Encadeamento de propriedades (forma recomendada):**
  <pre>Form.fields('NOME')
    .value('João da Silva')
    .label('Nome Completo')
    .readOnly(true)
    .apply();</pre>`
    },
    {
      tags:['boas praticas','performance','dicas','otimizacao','recomendacoes'],
      q:'Quais são as boas práticas da API JS do Lecom?',
      a:`Principais recomendações de boas práticas:
  
  **1. Chamar apply() apenas uma vez**
  <pre>Form.fields('A').value('x');
  Form.fields('B').visible(false);
  Form.apply(); // ← apenas no final</pre>
  
  **2. Encapsular o script corretamente**
  <pre>(function () {
    $(document).ready(function() {
      // seu código aqui
    });
  })();</pre>
  
  **3. Preferir SET_FIELD_VALUE ao SET_FIELD_PROPERTIES** (mais performático)
  
  **4. Validar campos somente no submit**, não em tempo real
  
  **5. Usar apenas a API JS** para manipular estados/estilos — evitar seletores jQuery externos
  
  **6. Reutilizar referências de campo:**
  <pre>var campoAPI = Form.fields('NOME');
  campoAPI.value('x').apply();
  campoAPI.value('y').apply();</pre>
  
  **7. Evitar promises (.then) sempre que possível** — deixar para casos realmente assíncronos`
    },
    {
      tags:['grid coluna','addcolumn','removecolumn','editcolumn','coluna grid'],
      q:'Como adicionar, editar ou remover colunas do Grid?',
      a:`Manipule colunas do Grid dinamicamente:
  
  <pre>var gridAPI = Form.grids('GRID');
  
  // Adicionar coluna ao final
  gridAPI.addColumn({
    name: 'TOTAL',
    label: 'Total'
  }).apply();
  
  // Adicionar na primeira posição
  gridAPI.addColumn({ name: 'TOTAL', label: 'Total' }, true).apply();
  
  // Editar label de uma coluna
  gridAPI.editColumn({
    name: 'PRECO',
    label: 'Preço Unitário'
  }).apply();
  
  // Remover coluna
  gridAPI.removeColumn('COLUNA_OCULTA').apply();</pre>
  
  **Totalizadores:**
  <pre>// Soma de uma coluna numérica
  gridAPI.columns('VALOR').sum();
  
  // Valor mínimo / máximo
  gridAPI.columns('VALOR').min();
  gridAPI.columns('VALOR').max();</pre>`
    },
    {
      tags:['grid before after','grid_add_before','grid_edit_before','grid_delete_before','cancelar grid'],
      q:'Como interceptar e cancelar operações no Grid (BEFORE/AFTER)?',
      a:`Os eventos BEFORE permitem cancelar ou modificar dados antes de serem inseridos/editados/excluídos:
  
  <pre>// Interceptar inserção — cancelar com reject
  Form.grids('GRID').subscribe('GRID_ADD_BEFORE',
    function(formId, gridId, submittedRow, dataRows, resolve, reject) {
      if (!submittedRow.NOME) {
        reject('Nome é obrigatório');
        return;
      }
      // Modificar dado antes de inserir
      submittedRow.STATUS = 'Pendente';
      resolve(submittedRow);
    }
  );
  
  // Após inserção (dataRows já atualizado)
  Form.grids('GRID').subscribe('GRID_ADD_AFTER',
    function(formId, gridId, row, dataRows) {
      // dataRows contém o estado atualizado
    }
  );
  
  // Cancelar exclusão
  Form.grids('GRID').subscribe('GRID_DELETE_BEFORE',
    function(formId, gridId, row, dataRows, resolve, reject) {
      if (row.BLOQUEADO === 'Sim') reject('Linha bloqueada!');
      else resolve();
    }
  );</pre>`
    },
    {
      tags:['helptext','texto ajuda','placeholder ajuda','hint'],
      q:'Como adicionar texto de ajuda (helpText) em um campo?',
      a:`Use a propriedade <code>helpText</code>:
  
  <pre>// Definir texto de ajuda
  Form.fields('CPF').helpText('Digite o CPF sem pontos e traços').apply();
  
  // Remover texto de ajuda
  Form.fields('CPF').helpText('').apply();</pre>
  
  O texto de ajuda é exibido abaixo do campo como uma dica para o usuário.`
    },
    {
      tags:['loader','loading','carregando','showloader','hideloader','modal aviso'],
      q:'Como exibir loading ou modal customizada?',
      a:`**Loading:**
  <pre>// Exibir loading
  Form.showLoader({
    description: 'Aguarde, processando...',
    icon: true
  });
  
  // Fechar loading (obrigatório para fechar)
  Form.hideLoader();</pre>
  
  **Modal customizada:**
  <pre>Form.addCustomModal({
    title: 'Confirmação',
    description: 'Deseja continuar com esta ação?',
    showButtonClose: false,
    buttons: [{
      name: 'Confirmar',
      icon: 'check',
      closeOnClick: true,
      action: function() {
        // ação ao confirmar
      }
    }]
  });</pre>`
    }
  ];
  
  const SUGGESTIONS = [
    'Como acesso a API do Form?',
    'Como usar o apply() corretamente?',
    'Como ocultar/mostrar campos?',
    'Como inserir linhas no Grid?',
    'Como validar no evento SUBMIT?',
    'Como aplicar máscara CPF?',
    'Como tornar campo obrigatório?',
    'Boas práticas da API JS'
  ];
  