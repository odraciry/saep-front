const axios = require('axios');
const url = "http://localhost:8080/saep";
const alocacao = {};
async function getAlocacao () {
    await axios.get(`${url}/getAlocacoes`)
        .then(response => alocacao = response.json())
        .catch(err => err);
};
getAlocacao();
console.log(alocacao)


