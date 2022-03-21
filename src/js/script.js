window.onload = UpdateTable; // Atualiza a tabela ao atualizar página

let editable = null // Essa variavel vai mostrar se os dados irão ser editados ou cadastrados

function Save(){
    // Verificações sobre o preenchimento de dados
    if(document.getElementById('txtName').value == ''){
        window.alert('Digite o nome para continuar!')
        return
    }
    if(document.getElementById('date').value == ''){
        window.alert('Digite a data para continuar!')
        return
    }
    if(document.getElementById('txtCPF').value == ''){
        window.alert('Digite o CPF para continuar!')
        return
    }
    
    if(editable == null){
    // Verifica se o CPF é repetido ao cadastrar
    for (let index = 0; index < localStorage.length; index++) {
        let txtPatient = localStorage.getItem(index)
        let patient = JSON.parse(txtPatient)
            
        if (patient.CPF == document.getElementById('txtCPF').value) {
            window.alert('Esse CPF já foi cadastrado, por favor revise os dados inseridos...')
            return
        }
    }
        Register()
    }else{
        // Verifica se o CPF é repetido ao Editar
        for (let index = 0; index < localStorage.length; index++) {
            let txtPatient = localStorage.getItem(index)
            let patient = JSON.parse(txtPatient)

            if (index != editable && patient.CPF == document.getElementById('txtCPF').value){
                window.alert('Esse CPF já foi cadastrado, por favor revise os dados inseridos...')
                return
            }
        }
        Edit(editable)
   
    }

    // Limpa os campos sempre que um cadastro ou alteração é feita
    CleanAll()
}

// Inativa ou Ativa o paciente ao clicar no seu status
function Inactivate(n){
    let txtPatient = localStorage.getItem(n)
    let patient = JSON.parse(txtPatient)

    var indexSearch = txtPatient.indexOf('Ativo');

    if (indexSearch != -1) {    
        patient.stats = 'Inativo'
    }else{
        patient.stats = 'Ativo'
    }
    localStorage.setItem(n, JSON.stringify(patient))
    UpdateTable()
}


function Register(){

//Pegando as informações da área de cadastro
let name = document.getElementById('txtName').value
let date = document.getElementById('date').value
let sex = document.querySelector('input[name="radioSex"]:checked').value
let adress = document.getElementById('txtAdress').value
let cpf = document.getElementById('txtCPF').value
var status = document.getElementById('status').selectedOptions[0].value

// Cria paciente como um objeto e salva no localstorage como string
let patient = {nome: name, data: date, sexo: sex, endereco: adress, CPF: cpf, stats: status}
localStorage.setItem(localStorage.length, JSON.stringify(patient))


// Preciso procurar atualizar a tabela automaticamente com React
UpdateTable()
}


function UpdateTable(){
    
    let table = document.getElementById('table')

    // Limpa a tabela excluindo todas a linhas inseridas automaticamente
    while (table.hasChildNodes()) {
        table.removeChild(table.lastChild);
    }
 
    for (let index = 0; index < localStorage.length; index++) {
        // Recriar os dados como objeto novamente
        let txtPatient = localStorage.getItem(index)
        let patient = JSON.parse(txtPatient)
        
        // Cria uma nova tr para mostrar os dados de um paciente
        let tr = document.createElement('tr')
        tr.setAttribute('id', index)
        table.appendChild(tr)

        // Adiciona td's com as informações ao tr criado
        let name = document.createElement('td')
        name.innerText = patient.nome
        tr.appendChild(name)
        let date = document.createElement('td')
        date.innerText = patient.data
        tr.appendChild(date)
        let sex = document.createElement('td')
        sex.innerText = patient.sexo
        tr.appendChild(sex)
        let adress = document.createElement('td')
        adress.innerText = patient.endereco
        tr.appendChild(adress)
        let cpf = document.createElement('td')
        cpf.innerText = patient.CPF
        tr.appendChild(cpf)
        let status = document.createElement('td')
        status.innerText = patient.stats
        status.setAttribute('onclick', `Inactivate(${index})`)
        tr.appendChild(status)

        // Criando interação de editar com emojis
        let editImg = document.createElement('text')
        editImg.innerHTML = '\u{270D} EDITAR'
        editImg.setAttribute('onclick', `PreEdit(${index})`)
        tr.appendChild(editImg)
    }
}

function PreEdit(n){
    // Recriar os dados como objeto novamente
    let txtPatient = localStorage.getItem(n)
    let patient = JSON.parse(txtPatient)

    // Muda o texto do botão para Atualizar
    let btn = document.getElementById('btnSave')
    btn.innerText = 'Atualizar'

    editable = n

    // Inseri os valores do paciente nos campos
    document.getElementById('txtName').value = patient.nome
    document.getElementById('date').value = patient.data
    document.getElementById('txtAdress').value = patient.endereco
    document.getElementById('txtCPF').value = patient.CPF
    if (patient.stats == 'Ativo')
        document.getElementById('status').getElementsByTagName('option')[0].selected = 'selected'
    else
        document.getElementById('status').getElementsByTagName('option')[1].selected = 'selected'
    if (patient.sexo == 'Masculino')
        document.getElementById('Masculino').checked = true
    else
        document.getElementById('Feminino').checked = true
}

function Edit(n){

    // Recriar os dados como objeto novamente
    let txtPatient = localStorage.getItem(n)
    let patient = JSON.parse(txtPatient)

    // Passando valores dos campos para variáveis
    let name = document.getElementById('txtName').value
    let date = document.getElementById('date').value
    let sex = document.querySelector('input[name="radioSex"]:checked').value
    let adress = document.getElementById('txtAdress').value
    let cpf = document.getElementById('txtCPF').value
    var status = document.getElementById('status').selectedOptions[0].value

    // Atualiza a memoria com os novos valores e atualiza a tabela
    patient = {nome: name, data: date, sexo: sex, endereco: adress, CPF: cpf, stats: status}
    localStorage.setItem(n, JSON.stringify(patient))

    UpdateTable()

    window.alert('Editado com sucesso!')
}

// Faz um pesquisa pelo nome digitado (completo ou inclompleto)
function SearchByName(){
    let search = document.getElementById('txtSearch').value
    let table = document.getElementById('table')
    
    while (table.hasChildNodes()) {
        table.removeChild(table.lastChild);
    }

    for (let index = 0; index < localStorage.length; index++) {
        let txtPatient = localStorage.getItem(index)
        let patient = JSON.parse(txtPatient)


        if(!patient.nome.search(search)){

            let tr = document.createElement('tr')
            tr.setAttribute('id', index)
            table.appendChild(tr)
    
            // Adiciona td's com as informações ao tr criado
            let name = document.createElement('td')
            name.innerText = patient.nome
            tr.appendChild(name)
            let date = document.createElement('td')
            date.innerText = patient.data
            tr.appendChild(date)
            let sex = document.createElement('td')
            sex.innerText = patient.sexo
            tr.appendChild(sex)
            let adress = document.createElement('td')
            adress.innerText = patient.endereco
            tr.appendChild(adress)
            let cpf = document.createElement('td')
            cpf.innerText = patient.CPF
            tr.appendChild(cpf)
            let status = document.createElement('td')
            status.innerText = patient.stats
            status.setAttribute('onclick', `Inactivate(${index})`)
            tr.appendChild(status)

            // Criando interação de editar com emojis
            let editImg = document.createElement('text')
            editImg.innerHTML = '\u{270D} EDITAR'
            editImg.setAttribute('onclick', `PreEdit(${index})`)
            tr.appendChild(editImg)
        }
    }
}

function CleanAll(){
    document.getElementById('txtName').value = ''
    document.getElementById('date').value = ''
    document.getElementById('txtAdress').value = ''
    document.getElementById('txtCPF').value = ''

    let btn = document.getElementById('btnSave')
    btn.innerText = 'Cadastrar'
    editable = null
}
