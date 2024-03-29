/**
 * @Author: Rafael da Silva Pereira Matricula: 117110921. UFCG: Ciência da Computação.
 * @Author: Áthila Matheus Barros Borges Matricula: 118210206. UFCG: Ciência da Computação.
 *
 * O modulo é responsavel por fazer a conexão com o servidor através de metodos definidos no http.
 */


export {postData, getData, deleteData};

const protocol = "https://";
const domain = "ucdb-aplicattion.herokuapp.com/";
const apiVersion = "api/v1/";

const urlBody = protocol + domain + apiVersion;

function initDefine(data, authorization, method) {
    let init;
    let defautHeader = {'Accept' : '*/*',
        'Content-Type': 'application/json; charset=utf-8', "cache-control": "no-cache",
        "Cache-control": "no-cache","accept-encoding": "gzip, deflate"};

    if(!!data) {
        if(!!authorization) { // init com data e autorização
            defautHeader.Authorization = `${authorization}`;
            init = {
                method: `${method}`, mode: 'cors', cache: 'no-cache',
                headers: defautHeader,
                redirect: 'follow',
                referrer: 'client',
                body: JSON.stringify(data)
            }
        } else { // init com data e sem autorização
            init = {
                method: `${method}`, mode: 'cors', cache: 'no-cache',
                headers: defautHeader,
                redirect: 'follow',
                referrer: 'client',
                body: JSON.stringify(data)
            }
        }
    } else { // init com nenhuma data e autorização
        if(!!authorization) {
            defautHeader.Authorization = `${authorization}`;
            init = {
                method: `${method}`, mode: 'cors', cache: 'no-cache',
                headers: defautHeader,
                redirect: 'follow',
                referrer: 'client'
            }
        }else { // sem data e sem autorização
            init = {
                method: `${method}`, mode: 'cors', cache: 'no-cache',
                headers: defautHeader,
                redirect: 'follow',
                referrer: 'client'
            }
        }

    }
    return init;
}

function deleteData(path, data = {}, authorization) {
    return   fetch(urlBody + encodeURI(path), initDefine(data, authorization, "DELETE"))
        .then(response => {
                if(!!response && response.ok) {
                    try {
                        return  response.json();
                    } catch (e) {
                        alert("Não foi possivel deletar este item!, tente denovo mais tarde")
                    }
                }
            }
        ).catch(err => err);
}

function postData(path, data = {}, authorization) {
    return   fetch(urlBody + encodeURI(path), initDefine(data, authorization, "POST"))
        .then(response => {
                if(!!response && response.ok) {
                    try {
                        return  response.json();
                    } catch (e) {
                    }
                }
            }
        ).catch(err => err);
}

function putData(path, data = {}, authorization) {
    return fetch(urlBody + encodeURI(path), initDefine(data, authorization, "PUT"))
        .then(response => {
                if (!!response && response.ok) {
                    try {
                        return response.json();
                    } catch (e) {
                        alert("Algo de errado aconteceu, por favor tente novamente mais tarde.")
                    }
                }
            }
        ).catch(err => err);
}

function getData(path,  authorization) {
    return fetch(urlBody + encodeURI(path), initDefine(null, authorization,"GET"))
        .then(response => {
                if(!!response && response.ok) {
                    try {
                        return  response.json();
                    } catch (e) {
                        alert("Não foi possivel recuperar esse dado, por favor tente mais tarde")
                    }
                }
            }
        ).catch(err => alert("Algo de errado aconteceu, não conseguimos contatar nosso servidor por favor tente mais tarde"));
}

/* apenas para completar os metodos basicos de HTTP*/
function headData(path, authorization, callback) {
    return fetch(urlBody + encodeURI(path), initDefine(null, authorization, "HEAD"))
        .then(response => callback(response.status !== 404));
}

