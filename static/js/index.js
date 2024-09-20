$(document).ready(() => {

  $("#setModo").hide();
  $("#setPeriodo").hide();



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
  $("#btnPesquisar").click(() => {

    formulario = processarDados();
    
    $.ajax({
      url: "/getData",
      method: "POST",
      data: JSON.stringify(formulario),
      contentType: "application/json",
      success: function (data) {

        console.log("Recebido de resposta:", data);

      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error("Requisição para a API falhou");
        console.log("textStatus", textStatus);
       
      }
    })
  })


})

function getToday(){

    
    dia = new Date().getDate();
    mes = "";

    if(new Date().getMonth() < 9){
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
function processarDados(){
  var data = getPeriodo();
  var status = $("#status").val();
  var idEmpresa = $("#idEmpresa").val();
  

  return {
    dataFim: data.dataFim,
    dataInicio: data.dataInicio,
    status: status,
    idEmpresa: idEmpresa
  }
}

function getNumber(data){
  newData = data.split("/");
  dia = newData[0];
  mes = newData[1];
  ano = newData[2];
  newData = newData.join("-");
  return {
    dia: dia,
    mes: mes,
    ano: ano,
    data: newData
  }
}


function getPeriodo(){
  var dataFim = ''
  var dataInicio = ''
 
  if($("#modoFiltro").val()=="0"){
    dataInicio = "2024-01-01";
    dataFim = getToday().data;
    console.log(dataFim)
  } else if($("#modoFiltro").val()=="setPeriodo"){

    dataFim = $("#dataFim").val();
    dataInicio = $("#dataInicio").val();
    dataFim = getNumber(dataFim).data;
    dataInicio = getNumber(dataInicio).data;
  }
  else if($("#modoFiltro").val()=="setModo"){

    dataFim = '';
    var op = $("#modo").val();
    var today = new Date();
    if(op == "dia"){
     
    
      // Subtrai 7 dias da data atual
      today.setDate(today.getDate() - 1);
      dataInicio = processData(today).data
      console.log(dataInicio)
    }else if(op == "sem"){
      today.setDate(today.getDate() - 7);
      dataInicio = processData(today).data
      console.log(dataInicio)
    }else { 
      dia = processData(today).dia - 1
      today.setDate(today.getDate() - dia);
      dataInicio = processData(today).data
      console.log(dataInicio)
    }
      
  
  }
  return {
    dataFim:dataFim,
    dataInicio:dataInicio
  }
}

function processData(data){
  dia = data.getDate();
  if(data.getMonth() < 9){
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
}