const url = "http://localhost:8080";

const areas = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

const linha = (alocacao, area) => {
    const veiculo = alocacao.filter(item => item.area === area)
    veiculo.length != 0 ?
        document.getElementById('div' + area).style.backgroundColor = '#0000FF' :
        document.getElementById('div' + area).style.backgroundColor = '#FFFFFF';
};
const getAlocacao = async () => {
    const alocacoes = await fetch(`${url}/saep/getAlocacoes`)
        .then(response => response.json());
    console.log(alocacoes);
    areas.forEach(item => linha(alocacoes, item));
};
getAlocacao();

let divs = document.getElementsByClassName('quadrado');

function openModal(idArea) {
    document.getElementById('modal').style.display = 'block';
    document.getElementById('idArea').innerText = idArea;
    listVeiculos(idArea)
}
function fecharModal() {
    document.getElementById('modal').style.display = 'none';
    list.innerHTML = ''
}

function openVenda(idAutomovel, modelo, idArea) {
    document.getElementById('modalVenda').style.display = 'block';
    document.getElementById('modelo').innerText += modelo;
    listClientes();
    listConcessionaria(idArea, idAutomovel)
    document.getElementById('vender').addEventListener('click', ()=>{
        vender(idAutomovel);
        fecharModalVenda();
        fecharModal();
    })
}

function fecharModalVenda() {
    document.getElementById('modalVenda').style.display = 'none';
}

async function listVeiculos(idArea) {
    const alocacoes = await fetch(`${url}/saep/getAlocacoes`)
        .then(response => response.json());
    const veiculo = alocacoes.filter(item => item.area === idArea)
    if (veiculo.length < 1) {
        fecharModal();
        return alert("Essa área nao possui carros alocados");
    } else {
        const veiculos = alocacoes.filter(item => item.area === idArea);
        let arrayVeiculos = [];
        veiculos.map(async item => {
            const automeveis =
                await fetch(`${url}/automoveis/getAutomovel/${item.automovel}`)
                    .then(response => response.json());
            arrayVeiculos.push(automeveis);
            styleAutomovel(arrayVeiculos, idArea);
        })
    }
}

function styleAutomovel(automoveis, idArea) {
    const list = document.getElementById('list');
    automoveis.map(automovel => {
        list.innerHTML += `
        <div class="divKey" key={automovel.id}>
            <h2 class="carro modelo">${automovel.modelo}</h2>  
            <h2 class="carro">${automovel.preco}</h2>
            <button onclick="openVenda(${automovel.id}, '${automovel.modelo}', ${idArea})" class="botao">Vender</button>
        </div>
        `
    })
}

async function listClientes() {
    const lista = await fetch(`${url}/clientes/lista`)
        .then(response => response.json())
    lista.forEach(item => {
        document.getElementById('clientes').innerHTML += `
            <option>${item.nome}</option>
        `
    })

}

async function listConcessionaria(area, idAutomovel) {
    const alocacoes = await fetch(`${url}/saep/getAlocacoes`)
        .then(response => response.json());

    const conce = await alocacoes.filter(item => item.area == area)
    const possui = await conce.filter(item => item.automovel == idAutomovel)

    const lista = await fetch(`${url}/concessionaria/lista`)
        .then(response => response.json());
    lista.forEach(item => {
        if (item.id == possui[0].concessionaria) {
            document.getElementById('concessionaria').innerHTML = `
                <option>${item.concessionaria}</option>
            `
        }

    })

    
}

async function vender(idVeiculo){
    await fetch(`${url}/saep/venda/${idVeiculo}`, {method:'PUT'})
        .then(response => response.json());
}






