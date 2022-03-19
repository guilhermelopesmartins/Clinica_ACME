let res = document.getElementById('patient')

function Register(){

//Pegando as informações da área de cadastro
let name = document.getElementById('txtName').value
let date = document.getElementById('date').value
let sex = document.querySelector('input[name="radioSex"]:checked').value
let adress = document.getElementById('txtAdress').value
let cpf = document.getElementById('txtCPF').value
var status = document.getElementById('status').selectedOptions[0].value;

// Cria paciente como um objeto e salva no localstorage com o nome como key para facilitar pesquisa
let patient = {nome: name, data: date, sexo: sex, endereco: adress, CPF: cpf, stats: status}
localStorage.setItem(localStorage.length, JSON.stringify(patient))


// Preciso procurar atualizar a tabela automaticamente com React
AtualizarTabela()
}

function AtualizarTabela(){
    //let tr = document.getElementById('tr')
    let table = document.getElementById('table')

    for (let index = 0; index < localStorage.length; index++) {
        // Recriar os dados como objeto novamente
        let txtPatient = localStorage.getItem(index);
        let patient = JSON.parse(txtPatient)
        
        // Cria uma nova tr para mostrar os dados de um paciente
        let tr = document.createElement('tr')
        table.appendChild(tr)

        // Adiciona td's com as informações ao tr criado
        let name = document.createElement('td')
        name.innerText = patient.nome
        tr.appendChild(name)
    }
}