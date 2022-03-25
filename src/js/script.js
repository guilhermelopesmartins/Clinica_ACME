window.onload = UpdateTable; // Atualiza a tabela ao atualizar página

let editable = null // Essa variavel vai mostrar se os dados irão ser editados ou cadastrados

function Save(){

    if (GetValidation() == false)
        return

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

// Formata a data mesmo padrão recebido pelo input date
function FormatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

// Verificações sobre o preenchimento de dados
function GetValidation (){
    if(document.getElementById('txtName').value.trim() == ''){
        window.alert('Digite o nome para continuar!')
        return false
    }   
    if(document.getElementById('date').value == ''){
        window.alert('Digite a data para continuar!')
        return false
    }
    if (document.getElementById('date').value > FormatDate(new Date().toDateString())){
        window.alert('Data inválida')
        return false
    }
    if(document.getElementById('txtCPF').value == '' || document.getElementById('txtCPF').value.length < 11){
        window.alert('Digite o CPF para continuar!')
        return false
    }
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
let patient = {nome: name, data: date, sexo: sex, endereco: adress, CPF: cpf, stats: status.toUpperCase()}
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
        status.innerText = '\u{270D}' + patient.stats
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

    // Mostra o botão que possibilita cancelar a edição
    document.getElementById('btnCancel').style.display = 'inline'

    editable = n

    // Inseri os valores do paciente nos campos
    document.getElementById('txtName').value = patient.nome
    document.getElementById('date').value = patient.data
    document.getElementById('txtAdress').value = patient.endereco
    document.getElementById('txtCPF').value = patient.CPF
    document.getElementById('status').getElementsByTagName('option')[1].disabled = false
    if (patient.stats == 'ATIVO')
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
    patient = {nome: name, data: date, sexo: sex, endereco: adress, CPF: cpf, stats: status.toUpperCase()}
    localStorage.setItem(n, JSON.stringify(patient))

    UpdateTable()

    window.alert('Editado com sucesso!')
}

// Faz um pesquisa pelo nome digitado (completo ou inclompleto)
function SearchByName(){
    let search = document.getElementById('txtSearch').value
    let table = document.getElementById('table')
    
    // Limpa a tabela
    while (table.hasChildNodes()) {
        table.removeChild(table.lastChild);
    }

    for (let index = 0; index < localStorage.length; index++) {
        let txtPatient = localStorage.getItem(index)
        let patient = JSON.parse(txtPatient)

        // Faz a pesquisa pelo nome
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

// Inativa ou Ativa o paciente ao clicar no seu status
function Inactivate(n){
    let txtPatient = localStorage.getItem(n)
    let patient = JSON.parse(txtPatient)

    var indexSearch = txtPatient.indexOf('ATIVO');

    if (indexSearch != -1)    
        patient.stats = 'INATIVO'

    localStorage.setItem(n, JSON.stringify(patient))
    UpdateTable()
}

function CleanAll(){
    // Limpa campos de texto
    document.getElementById('txtName').value = ''
    document.getElementById('date').value = ''
    document.getElementById('txtAdress').value = ''
    document.getElementById('txtCPF').value = ''

    // Seleciona opição ativo e desabilita opção inativo
    document.getElementById('status').getElementsByTagName('option')[0].selected = 'selected'
    document.getElementById('status').getElementsByTagName('option')[1].disabled = true

    // Esconde botão cancelar edição
    document.getElementById('btnCancel').style.display = 'none'

    // Desbilita a funcionalidade de editar
    let btn = document.getElementById('btnSave')
    btn.innerText = 'Cadastrar'
    editable = null
}
