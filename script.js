
const user = 'MIOJOLU'
const requests = [
    `https://api.github.com/users/${user}`,
    `https://api.github.com/users/${user}/repos`,
    `https://api.github.com/users/${user}/followers`
]
const divDinamica = document.querySelector('#content');

const userExamplesNames = ['slevithan', 'jrburke', 'paulirish', 'addyosmani',
    'skmetz', 'pedroslopez', 'snipe', 'mojombo'];

const mes = ['Jan', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
let tipo = 'user'
let responseSearchElements = {};

let page = 0;

function response() {
    let dados = JSON.parse(this.responseText);
}
function requestHttp(uri, type) {
    let xhr = new XMLHttpRequest();
    if (type === 'userInfo') {
        xhr.onload = userInfo;
    } else if (type === 'userExample') {
        xhr.onload = userExamples;
    }

    xhr.open('GET', uri)
    xhr.send();
}

function userInfo() {
    let dados = JSON.parse(this.responseText);

    let imgDiv = document.querySelector('#user-img');
    let userData = document.querySelector('#user-info');

    imgDiv.innerHTML = `<img src="${dados.avatar_url}" >`
    userData.innerHTML = `
                <div>
                        <div class="py-2">
                            <h2>${dados.name} </h2>
                            <h4 class="text-muted">${dados.login} </h4>
                        </div>
                        <button class="btn mb-1 d-inline background-primary text-white" onclick="dynamicContent('seguidores')">
                            <i class="fas fa-users me-1"></i>
                            ${dados.followers} seguidores
                        </button>
                        <button class="btn mb-1 d-inline background-primary text-white" onclick="dynamicContent('repositorios')">
                            <i class="fas fa-code-branch me-1"></i>
                            ${dados.public_repos} repositórios
                        </button>
                    </div>
        `
}

function userExamples() {
    let dados = JSON.parse(this.responseText);
    let div = document.querySelector('#users-example');

    const company = (dados.company === null) ? '' : `
                            <p class="mb-1">
                                <i class="fas fa-building me-1 mb-1"></i>
                                ${dados.company}
                            </p>
                        `;
    const twitter = (dados.twitter_username === null) ? '' : `<p class="mb-1">
                                <i class="fab fa-twitter me-1 mb-1"></i>
                                @${dados.twitter_username}
                            </p>`;
    const blog = (dados.blog === "") ? '' : `<p>
                                <i class="fab fa-blogger me-1"></i>
                                ${dados.blog}
                            </p>`;
    const dadosBio = (dados.bio === null) ? '' : `<p class="card-text">${dados.bio}</p>`

    div.innerHTML += `
            <div class="col-12 col-md-6 col-lg-3 pb-3 text-center">
                    <a href="${dados.html_url}" target="_blank">
                    <div class="card text-start" >
                        <img src="${dados.avatar_url}" class="card-img-top">
                        <div class="card-body">
                            <div class="py-2">
                            <h3 class="card-title">${dados.login} </h3>
                            <h6 class="card-subtitle mb-2" >${dados.name} </h6>
                            </div>
                            <p class=" mb-1">
                                <i class="fas fa-users me-1"></i>
                                ${dados.followers} seguidores
                            </p>
                            <p class=" mb-1">
                                <i class="fas fa-code-branch me-1"></i>
                                ${dados.public_repos} repositórios
                            </p>
                            ${twitter}
                            ${company} 
                            ${blog}
                        </div>
                    </div>
                    <div class="card-footer text-white text-start">
                                <p class="text-start">${dadosBio}</p>
                            </div>
                    </a>
                </div>
        `
}

function dynamicContent(conteudo) {
    if (conteudo === 'repositorios') {
        let xhr = new XMLHttpRequest();
        xhr.onload = repositorios;
        xhr.open('GET', requests[1])
        xhr.send();
    } else {
        let xhr = new XMLHttpRequest();
        xhr.onload = seguidores;
        xhr.open('GET', requests[2])
        xhr.send();
    }

}

function repositorios() {
    let dados = JSON.parse(this.responseText)
    let html = '';
    dados.forEach(repo => {
        let language = repo.language === null ? '' : `<span class="badge c">${repo.language}</span>`;
        let data = new Date(repo.created_at)
        let descricao = repo.description === null ? '' : `<p>${repo.description}</p>`
        let dataFormatada = ((data.getDate())) + " de ";

        dataFormatada += mes[(data.getMonth() + 1)];
        dataFormatada += " de " + data.getFullYear();
        // created_at
        html += `
                <div class="card col-12 col-md-4">
                        <a href="${repo.html_url}">
                            <div class="card-body">
                            <h5 class="card-title">${repo.name}</h5>
                            <h6 class="card-subtitle mb-3 text-muted">${dataFormatada}</h6>
                            <div class="py-2">
                                ${language}
                            </div>
                            ${descricao}
                        </div>
                        </a>
                    </div>
                    `

    })

    divDinamica.innerHTML = html;
}

function seguidores() {
    let dados = JSON.parse(this.responseText)
    let html = `
    `;
    dados.forEach(follower => {
        console.log(follower)

        let xhr = new XMLHttpRequest();
        xhr.onload = () => {
            let response = JSON.parse(xhr.responseText);
            console.log(response)
            html += `
                 <div class="col">
                        <img src="${follower.avatar_url}" class="rounded-circle pe-2" style="width:10rem" alt="">
                        <a href="${follower.html_url}"><b>${follower.login}</b></a>
                        <p class=" mb-1">
                            <i class="fas fa-code-branch me-1"></i>
                                ${response.public_repos} repositórios
                        </p>
                    </div>
        `
            console.log(response)
        }
        xhr.open('GET', `${follower.url}`);
        xhr.send()

    })
    divDinamica.innerHTML = html;
}

function paginacaoDinamica(direcao) {
    if (direcao === 'ant') {
        seguidores(0);
    } else {
        page = page + 5;
        seguidores()
    }

}

function search() {
    tipo = document.querySelector("#select").value;
    const query = document.querySelector('#query').value;

    if (query === '' || tipo === '') {
        const divPaginacao = document.querySelector('#erro')
        divPaginacao.innerHTML = `
             <img style="width:20rem" src="./images/undraw_not_found_-60-pq.svg" alt="" srcset="">
             <h1>Oops.. Parece que sua pesquisa foi inválida!</h1>
        `
    } else {
        let xhr = new XMLHttpRequest();

        if (tipo === 'user') {
            xhr.onload = responseSearch;
            xhr.open('GET', `https://api.github.com/search/users?q=${query}`)
            xhr.send();
        } else if (tipo === 'repo') {
            xhr.onload = responseSearch;
            xhr.open('GET', `https://api.github.com/search/repositories?q=${query}`)
            xhr.send();
        }
    }
}

function responseSearch() {
    responseSearchElements = {
        tipo,
        response: JSON.parse(this.responseText)
    }

    pagination();
}

function pagination() {
    const div = document.querySelector('#modal-resp-search');
    const divPaginacao = document.querySelector('#paginacao')
    div.innerHTML = ''

    if (responseSearchElements.tipo === 'user') {
        const bntPaginationAnt = page <= 0 ? 'disabled' : '';
        const btnPaginationProx = page + 5 >= responseSearchElements.response.items.length ? 'disabled' : '';
        divPaginacao.innerHTML = `
        <div class="btn-group" role="group" aria-label="Basic example">
            <button type="button" class="btn background-primary text-white me-1" onclick="paginationAux('ant')" ${bntPaginationAnt}> <i class="fas fa-angle-left pe-1"></i> Anterior</button>
            <button type="button" class="btn background-primary text-white" onclick="paginationAux('prox')" ${btnPaginationProx}> Próxima <i class="fas fa-angle-right ps-1"></i></button>
        </div>
            `


        for (let i = page; i < page + 5; i++) {
            let resp = responseSearchElements.response.items[i];
            let xhr = new XMLHttpRequest();
            xhr.onload = () => {
                let dados = JSON.parse(xhr.responseText);
                const company = (dados.company === null) ? '' : `
                            <p class="mb-1">
                                <i class="fas fa-building me-1 mb-1"></i>
                                ${dados.company}
                            </p>
                        `;
                const twitter = (dados.twitter_username === null) ? '' : `<p class="mb-1">
                                <i class="fab fa-twitter me-1 mb-1"></i>
                                @${dados.twitter_username}
                            </p>`;
                const blog = (dados.blog === "") ? '' : `<p>
                                <i class="fab fa-blogger me-1"></i>
                                ${dados.blog}
                            </p>`;
                const dadosBio = (dados.bio === null) ? '' : `<p class="card-text">${dados.bio}</p>`
                div.innerHTML += `
                 <a href="${dados.html_url}" target="_blank">
                        <div class="card mb-3" >
                                        <div class="row g-0">
                                            <div class="col-md-4">
                                                <img src="${dados.avatar_url}" class="img-fluid rounded-start h-100"  style="width: 100%; height: 400px" alt="...">
                                            </div>
                                            <div class="col-md-8">
                                                
                                                    <div class="card-body">
                                                        <div class="py-2">
                                                            <h4 class="card-title">${dados.login} </h4>
                                                            <h6 class="card-subtitle mb-2">${dados.name} </h6>
                                                        </div>
                                                        <p class=" mb-1">
                                                            <i class="fas fa-users me-1"></i>
                                                            ${dados.followers} seguidores
                                                        </p>
                                                        <p class=" mb-1">
                                                            <i class="fas fa-code-branch me-1"></i>
                                                            ${dados.public_repos} repositórios
                                                        </p>
                                                        ${twitter}
                                        ${company} 
                                         ${blog}
                                                    </div>
    
                                            </div>
                                        </div>
                                    </div>
                                    </a>
                            `
            };
            xhr.open('GET', `https://api.github.com/users/${resp.login}`)
            xhr.send();
        }



    } else if (responseSearchElements.tipo === 'repo') {
        const bntPaginationAnt = page <= 0 ? 'disabled' : '';
        const btnPaginationProx = page + 5 >= responseSearchElements.response.items.length ? 'disabled' : '';
        divPaginacao.innerHTML = `
        <div class="btn-group" role="group" aria-label="Basic example">
            <button type="button" class="btn background-primary text-white me-1" onclick="paginationAux('ant')" ${bntPaginationAnt}> <i class="fas fa-angle-left pe-1"></i> Anterior</button>
            <button type="button" class="btn background-primary text-white" onclick="paginationAux('prox')" ${btnPaginationProx}> Próxima <i class="fas fa-angle-right ps-1"></i></button>
        </div>
            `

        let html = "";
        for (let i = page; i < page + 5; i++) {
            let repo = responseSearchElements.response.items[i];

            let language = repo.language === null ? '' : `<span class="badge c">${repo.language}</span>`;
            let data = new Date(repo.created_at)
            let descricao = repo.description === null ? '' : `<p>${repo.description}</p>`
            let dataFormatada = ((data.getDate())) + " de ";
            let topicos = repo.topics.length > 0 ? `<p class=" mb-1">
                    <b>Tópicos: </b>
                    ${repo.topics.toString()}
                </p>` : '';

            dataFormatada += mes[(data.getMonth() + 1)];
            dataFormatada += " de " + data.getFullYear();
            html += `
        
        <div class="card mb-2">
        
            <div class="card-body">
                <h5 class="card-title">${repo.name}</h5>
                <h6 class="card-subtitle mb-3 text-muted">${dataFormatada}</h6>
                <a href="${repo.html_url}" class="background-primary btn btn-sm text-white" target="_blank">Acessar repositório
                </a>
                <div class="py-2">
                    ${language}
                </div>
                ${descricao}
                <a class=" mb-1 btn p-0 " targt="_blank" href="${repo.html_url}">
                    <i class="fas fa-user me-1"></i>
                    ${repo.owner.login}
                </a>
                <p class=" mb-1">
                    <i class="fas fa-times-circle me-1"></i>
                    ${repo.open_issues_count} problemas em aberto
                </p>
                <p class=" mb-1">
                    <i class="fas fa-code-branch me-1"></i>
                    ${repo.forks} forks
                </p>
                ${topicos}
                

            </div>
        </div>
    
                    `
        }
        div.innerHTML = html;

    }
}

function paginationAux(str) {
    if (str === 'ant') {
        page = page - 5;
        pagination()
    } else {
        page = page + 5;
        pagination()
    }
}

onload = () => {
    requestHttp(requests[0], 'userInfo');
    dynamicContent('repositorios');
    dynamicContent('seguidores');

    //userExamples
    userExamplesNames.forEach((name) => {
        requestHttp(`https://api.github.com/users/${name}`, 'userExample');
    });
}