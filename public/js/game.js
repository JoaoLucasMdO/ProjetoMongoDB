const urlBase = 'http://localhost:4000/api'

async function carregaGames(){
    const tabela = document.getElementById('dadosTabela')
    tabela.innerHTML = '' // Liga antes de recarregar
    //Faremos a requisição GET para a nossa API REST
    await fetch(`${urlBase}/games`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        data.forEach(game => {
            tabela.innerHTML += `
            <tbody class="card">
                <tr>
                    <td>Nome: ${game.nome}</td>
                    <td>Plataforma: ${game.plataforma}</td>
                    <td>Condição: ${game.condicao}</td>
                    <td>Data de Lançamento: ${new Date(game.anoLancamento).toJSON().substring(0, 10)}</td>
                    <td>Genero: ${game.genero}</td>
                    <td>Preço: R$${game.preco}</td>
                    <td>Quantidade disponível: ${game.quantidade}</td>
                    <td id="botao">
                    <button id='botaoComprar'>Comprar</button>
                    </td>
                </tr>
            </tbody>
            `  
        })
    })
}

async function carregaGames2(){
    const tabela = document.getElementById('dadosTabela')
    tabela.innerHTML = '' // Liga antes de recarregar
    //Faremos a requisição GET para a nossa API REST
    await fetch(`${urlBase}/games`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        data.forEach(game => {
            tabela.innerHTML += `
            <tbody class="card">
                <tr>
                    <td><label for='nome${game._id}'>Nome:</label><input class="valoresCadastrados" id="nome${game._id}" type="text" value="${game.nome}"></td>
                    <td>Plataforma:<input class="valoresCadastrados" id="plataforma${game._id}" type="text" value="${game.plataforma}"></td>
                    <td>Condição:<input class="valoresCadastrados" id="condicao${game._id}" type="text" value="${game.condicao}"></td>
                    <td>Data de Lançamento:<input class="valoresCadastrados" id="anoLancamento${game._id}"
                    value="${new Date(game.anoLancamento).toJSON().substring(0, 10)}"></td>
                    <td>Genero:<input class="valoresCadastrados" id="genero${game._id}" value="${game.genero}"></td>
                    <td>Preço:<input class="valoresCadastrados" type="number" id="preco${game._id}" value="${game.preco}"></td>
                    <td>Quantidade:<input class="valoresCadastrados" type="number" id="quantidade${game._id}" value="${game.quantidade}"></td>
                    <td id="botao">
                    <div id="botoes">
                    <button id='botaoExcluir' onclick='removeGame("${game._id}")'>Exlcuir</button>
                    <button id='botaoEditar' onclick='atualizaGame("${game._id}")'>Editar</button>
                    </div>
                    </td>
                </tr>
            </tbody>
            ` 
        })
        
    })
}

async function atualizaGame(id){
        game = {
        "_id": id,
        "nome": document.getElementById('nome' + id).value,
        "plataforma": document.getElementById('plataforma' + id).value,
        "condicao": document.getElementById('condicao' + id).value,
        "anoLancamento": document.getElementById('anoLancamento' + id).value,
        "genero":  document.getElementById('genero' + id).value,
        "preco" :  document.getElementById('preco' + id).value,
        "quantidade": parseFloat(document.getElementById('quantidade' + id).value),
    }
    if(confirm('Deseja realmente editar este jogo?')){
        await fetch(`${urlBase}/games`,{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
        body: JSON.stringify(game)
        })
        .then(response => response.json())
        .then(data =>{
        if (data.acknowledged){
            alert('Jogo Editado com sucesso!')
            //atualizamos a listagem
            carregaGames2()
        }else if (data.errors){
            const errorMessages = data.errors.map(error => error.msg)
            .join('\n')
           window.alert(`Erros:\n ${errorMessages}`)
        }
    })
    }
}

async function removeGame(id) {
    if (confirm('Deseja realmente excluir este jogo?')) {
        await fetch(` ${urlBase}/games/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.deletedCount > 0) {
                    carregaGames2() // atualizamos a UI
                }
            })
            .catch(error => {
                window.alert(`Erro ao remover o jogo: ${error.message}`)
            })
    }
}

document.getElementById('formGame').addEventListener('submit',function (event){
    event.preventDefault() // evita o recarregamento
    let game = {} // Objeto Jogo
    game = {
        "nome": document.getElementById('nome').value,
        "plataforma": document.getElementById('plataforma').value,
        "condicao": document.getElementById('condicao').value,
        "anoLancamento": document.getElementById('anoLancamento').value,
        "genero": document.getElementById('genero').value,
        "preco" : document.getElementById('preco').value,
        "quantidade": parseFloat(document.getElementById('qtd').value),
    }/* Fim do objeto */
   // alert(JSON.stringify(prestador)) apenas para testes
   salvarGame(game)
})

async function salvarGame(game){
    await fetch(`${urlBase}/games`, {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(game)
    })
    .then(response => response.json())
    .then(data =>{
        if (data.acknowledged){
            alert('Jogo incluído com sucesso!')
            //limpamos o formulário
            document.getElementById('formGame').reset()
            //atualizamos a listagem
            carregaGames()
        }else if (data.errors){
            const errorMessages = data.errors.map(error => error.msg)
            .join('\n')
           window.alert(`Erros:\n ${errorMessages}`)
        }
    })
}