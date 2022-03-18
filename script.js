let clientes = document.getElementById('clientes')

function Register(){

//Pegando as informações da área de cadastro
let name = document.getElementById('txtName').value
let date = document.getElementById('date').valeu
let sex = document.querySelector('input[name="radioSex"]:checked').value
let adress = document.getElementById('txtAdress').value
let txtCPF = document.getElementById('txtCPF')
let cpf = Number(txtCPF.valeu)
var status = document.getElementById('status').selectedOptions[0].value;

clientes.innerHTML = `O ${name} que nasceu em ${date} do sexo ${sex} que mora na ${adress} tem o CPF: ${cpf} e está ${status} como cliente`

}