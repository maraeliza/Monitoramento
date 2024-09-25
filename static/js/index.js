$(document).ready(() => {




  $("#dataInicio").datepicker({
    showOtherMonths: true,
    selectOtherMonths: true,
    showAnim: "slideDown",
    dateFormat: "dd/mm/yy",
  })
  $("#dataFim").datepicker({
    showOtherMonths: true,
    selectOtherMonths: true,
    showAnim: "slideDown",
    dateFormat: "dd/mm/yy",
  })
  $("#modoFiltro").select2({
    placeholder: "Selecione como deseja filtrar por período",
    theme: "classic",
    width: "100%",
    language: {
      noResults: function () {
        return "Nenhum resultado encontrado";
      },
    },
  });
  $("#modo").select2({
    placeholder: "Selecione o modo de busca",
    theme: "classic",
    width: "100%",
    language: {
      noResults: function () {
        return "Nenhum resultado encontrado";
      },
    },
  });
  $("#status").select2({
    placeholder: "Selecione o modo de busca",
    theme: "classic",
    width: "100%",
    language: {
      noResults: function () {
        return "Nenhum resultado encontrado";
      },
    },
  });
  $("#modoFiltro").on("change", function () {
    $("#setModo").hide();
    $("#setPeriodo").hide();
    $("#" + $("#modoFiltro").val()).show()

  })
  $("#btnBaixar").click(() => {
    formulario = processarDados(true, false);
    enviarDados(formulario,true, false)
  });
  $("#btnEnviar").click(() => {
    formulario = processarDados(false, true);
    enviarDados(formulario,false, true)
  });

  $("#btnPesquisar").click(() => {
    formulario = processarDados(false, false);
    enviarDados(formulario,false, false)
    
  })


})

function exibirDados(data) {

  var result = []
  var grafico = []
  var contagemData = {}
  for (var i = 0; i < data.result.length; i++) {

    linha = data.result[i]

    var dataEmissao = new Date(linha[4]).getDate();
    if (contagemData[dataEmissao]) {
      contagemData[dataEmissao]++
    } else {
      contagemData[dataEmissao] = 1
    }


    linha[5] = linha[5].toUpperCase().replace("TB_", "").replace("S", "")

    linha[4] = linha[4].replace("GMT", "")
    linha[4] = substituirDiaSemana(linha[4])

    linha[3] = linha[3].replace("GMT", "")
    linha[3] = substituirDiaSemana(linha[3])

    obj = {
      "ID EMPRESA": linha[0],
      "ID": linha[1],
      "TIPO": linha[5],
      "STATUS": traduzirStatus(linha[2]),
      "DATA EMISSAO": linha[4],
      "DATA ULTIMA ATUALIZAÇÃO": linha[3]
    }
    result.push(obj)
  }
  for (var data in contagemData) {
    grafico.push({ data: data, count: contagemData[data] });
  }
  criarGrafico(grafico, linha[2])
  var tabela = $('#tb_resultados').DataTable();
  tabela.destroy()

  $('#tb_resultados').DataTable({
    data: result,
    columns: [
      { title: "ID EMPRESA", data: "ID EMPRESA" },
      { title: "TIPO", data: "TIPO" },
      { title: "ID", data: "ID" },
      { title: "STATUS", data: "STATUS" },
      { title: "DATA DE EMISSAO", data: "DATA EMISSAO" },
      { title: "DATA DE ÚLTIMA ATUALIZAÇÃO", data: "DATA ULTIMA ATUALIZAÇÃO" },
    ],

    paging: true,
    searching: true,
    ordering: true,
    select: true,
    language: {
      "decimal": ",",
      "thousands": ".",
      "lengthMenu": "Mostrar _MENU_ registros por página",
      "zeroRecords": "Nenhum registro encontrado",
      "info": "Mostrando _START_ até _END_ de _TOTAL_ registros",
      "infoEmpty": "Mostrando 0 até 0 de 0 registros",
      "infoFiltered": "(filtrado de _MAX_ registros no total)",
      "search": "Buscar:",
      "paginate": {
        "first": "Primeiro",
        "last": "Último",
        "next": "Próximo",
        "previous": "Anterior"
      },
      "loadingRecords": "Carregando...",
      "processing": "Processando...",
      "emptyTable": "Nenhum dado disponível na tabela",
      "aria": {
        "sortAscending": ": ativar para ordenar a coluna em ordem crescente",
        "sortDescending": ": ativar para ordenar a coluna em ordem decrescente"
      }
    }

  })
}

function enviarDados(formulario, baixar, enviarEmail) {

  $.ajax({
    url: "/getData",
    method: "POST",
    data: JSON.stringify(formulario),
    contentType: "application/json",
    success: function (data) {

      console.log("Recebido de resposta:", data);
      if(baixar == false && enviarEmail == false){
        exibirDados(data)
      }else if(baixar == true){
        console.log("realizar download do excel")
      }else if(enviarEmail == true){
        console.log("enviar relatório em excel por e-mail")
      }
      
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error("Requisição para a API falhou");
      console.log("textStatus", textStatus);

    }
  })

}
function substituirDiaSemana(dataStr) {
  const diasSemana = {
    "Mon": "Seg",
    "Tue": "Ter",
    "Wed": "Qua",
    "Thu": "Qui",
    "Fri": "Sex",
    "Sat": "Sab",
    "Sun": "Dom"
  };

  return dataStr.replace(/\b(Mon|Tue|Wed|Thu|Fri|Sat|Sun)\b/g, (match) => diasSemana[match]);
}
function traduzirStatus(status) {
  const listaStatus = {
    "ERROR": "ERRO AO EMITIR",
    "CANCELED": "CANCELADA",
    "SCHEDULED": "AGENDADA",
    "AUTHORIZED": "EMITIDA"

  };

  return status.replace(/\b(ERROR|CANCELED|SCHEDULED|AUTHORIZED)\b/g, (match) => listaStatus[match]);
}
function getToday() {


  dia = new Date().getDate();
  mes = "";

  if (new Date().getMonth() < 9) {
    mes = "0"
  }
  mes += new Date().getMonth() + 1;
  ano = new Date().getFullYear();
  data = ano + '-' + mes + '-' + dia;

  return {
    data: data,
    dia: dia,
    mes: mes,
    ano: ano
  }
}
function processarDados(baixar, enviarEmail) {
  var data = getPeriodo();
  var status = $("#status").val();
  var idEmpresa = $("#idEmpresa").val();

  console.log(baixar)
  return {
    dataFim: data.dataFim,
    dataInicio: data.dataInicio,
    status: status,
    idEmpresa: idEmpresa,
    baixar: baixar,
    enviarEmail: enviarEmail
  }
}

function getNumber(data) {
  newData = data.split("/");
  dia = newData[0];
  mes = newData[1];
  ano = newData[2];
  newData = [ano, mes, dia].join("-");
  return {
    dia: dia,
    mes: mes,
    ano: ano,
    data: newData
  }
}


function getPeriodo() {
  var dataFim = ''
  var dataInicio = ''

  if ($("#modoFiltro").val() == "0") {
    dataInicio = "2024-01-01";
    dataFim = getToday().data;
    console.log(dataFim)
  } else if ($("#modoFiltro").val() == "setPeriodo") {

    dataFim = $("#dataFim").val();
    dataInicio = $("#dataInicio").val();
    dataFim = getNumber(dataFim).data;
    dataInicio = getNumber(dataInicio).data;
  }
  else if ($("#modoFiltro").val() == "setModo") {

    dataFim = '';
    var op = $("#modo").val();
    var today = new Date();
    if (op == "dia") {


      // Subtrai 7 dias da data atual
      today.setDate(today.getDate() - 1);
      dataInicio = processData(today).data
      console.log(dataInicio)
    } else if (op == "sem") {
      today.setDate(today.getDate() - 7);
      dataInicio = processData(today).data
      console.log(dataInicio)
    } else {
      dia = processData(today).dia - 1
      today.setDate(today.getDate() - dia);
      dataInicio = processData(today).data
      console.log(dataInicio)
    }


  }
  if (dataInicio == "") {
    dataInicio = "2024-01-01";
  }
  if (dataFim == "") {
    var today = new Date();
    dia = processData(today).dia
    today.setDate(today.getDate() - dia);
    dataFim = processData(today).data
  }
  return {
    dataFim: dataFim,
    dataInicio: dataInicio
  }
}

function processData(data) {
  dia = data.getDate();
  if (data.getMonth() < 9) {
    mes = "0"
  }
  mes += data.getMonth() + 1;
  ano = data.getFullYear();
  data = ano + '-' + mes + '-' + dia;

  return {
    data: data,
    dia: dia,
    mes: mes,
    ano: ano
  }
}// Variável para armazenar a instância do gráfico
let meuGrafico;

// Função para criar ou atualizar o gráfico
function criarGrafico(grafico, status) {
  console.log(status)
  var corStatus = {
    "ERROR": ["#ffb1c3", "darkred"],
    "CANCELED": ["#d8d8d8", "black"],
    "SCHEDULED": ["#b1ceff", "darkblue"],
    "AUTHORIZED": ["#004e3c", "darkgreen"]
  }
  const canvas = document.getElementById('grafico');

  // Verifica se o elemento canvas existe
  if (!canvas) {
    console.error("Elemento canvas não encontrado!");
    return;
  }

  const ctx = canvas.getContext('2d');

  // Destruir o gráfico existente, se houver
  if (meuGrafico) {
    meuGrafico.destroy();
  }

  // Criar um novo gráfico
  meuGrafico = new Chart(ctx, {
    type: 'bar', // ou 'line', 'pie', etc.
    data: {
      labels: grafico.map(row => row.data), // As datas
      datasets: [
        {
          label: 'Notas por dia',
          data: grafico.map(row => row.count), // As contagens
          backgroundColor: corStatus[status][0],
          borderColor: corStatus[status][0],
          borderWidth: 1
        }
      ]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}


