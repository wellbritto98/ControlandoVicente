// ==UserScript==
// @name         Adiciona Item Vicente com Link e Modal
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adiciona um novo item "Vicente" com um link sem href à lista no cabeçalho da página de jogador do Footmundo e exibe um modal com SweetAlert2 ao clicar
// @author       Você
// @match        https://www.footmundo.com/jogador/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @resource     https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css
// @require      https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js
// ==/UserScript==

(function () {
    'use strict';
    var server = 'http://localhost:3000';
    var cssInject = `
        .buttons-vicente {
            background-color: #4CAF50; /* Green */
            border: none;
            color: white;
            padding: 5px 10px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 10px;
            margin: 4px 2px;
            transition-duration: 0.4s;
            cursor: pointer;
            border-radius: 8px;
        }
        .buttons-vicente:hover {
            background-color: white;
            color: black;
            border: 1px solid #4CAF50;
        }
        .buttons-vicente:active {
            background-color: #4CAF50;
            color: white;
            border: 1px solid #4CAF50;
        }


    `;
    var style = document.createElement('style');
    if (style.styleSheet) {
        style.styleSheet.cssText = cssInject;
    }
    else {
        style.appendChild(document.createTextNode(cssInject));
    }
    document.getElementsByTagName('head')[0].appendChild(style);

    function createButtonAndAddListener(id, action) {
        const button = document.createElement('button');
        button.id = id;
        button.className = 'buttons-vicente';
        button.style.cursor = 'pointer';
        button.textContent = action;
        button.addEventListener('click', () => mudarFocoOuLazer(id));
        return button;
    }

    function mudarFocoOuLazer(endpoint) {
        console.log("clicado");
        Swal.fire({
            title: 'Processando...',
            html: 'Por favor, aguarde enquanto fazemos Vicentinho fazer a ação',
            allowOutsideClick: false, // Impede que o alerta seja fechado clicando fora
            didOpen: () => {
                Swal.showLoading(); // Mostra o loader
            }
        });
        fetch(server + `/${endpoint}`)
            .then(response => response.json())
            .then(data => {
                Swal.close();
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 5000, // O toast desaparece após 3 segundos
                    timerProgressBar: true,
                    icon: 'success',
                    title: data.message // Use a mensagem da API aqui
                });
                console.log(data);
            })
            .catch(error => {
                console.error('Error:', error);
                // Opcional: Exibir um toast de erro se a requisição falhar
                Swal.close();
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 5000, // O toast desaparece após 3 segundos
                    timerProgressBar: true,
                    icon: 'error',
                    title: 'Falha ao mudar o lazer'
                });
            });
    }


    function showModal() {
        Swal.fire({
            title: 'Escolha uma ação',
            html: `
                <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                    <div style="flex: 1;">
                        <h6 class="h6modal">Mudar Lazer</h6>

                        <button id="mudar-lazer-passear" class="buttons-vicente" style="cursor:pointer;">Passear</button>
                        <button id="mudar-lazer-descansar" class="buttons-vicente" style="cursor:pointer;">Descansar</button>
                    </div>
                    <div style="flex: 1;">
                        <h6>Mudar Foco</h6>
                        <button id="mudar-foco-treinar" class="buttons-vicente" style="cursor:pointer;">Treinar</button>
                        <button id="mudar-foco-imprensa" class="buttons-vicente" style="cursor:pointer;">Imprensa</button>
                    </div>
                    <div style="flex: 1;">
                        <h6>Boost</h6>
                        <button id="ver-boost" class="buttons-vicente" style="cursor:pointer;">Ver % do Boost</button>
                        <button id="usar-boost" class="buttons-vicente" style="cursor:pointer;">Usar Boost</button>
                    </div>
                    <div style="flex: 1;">
                        <h6>Usar XP</h6>
                        <button id="usar-xp-humor" class="buttons-vicente" style="cursor:pointer;">Humor</button>
                        <button id="usar-xp-saude" class="buttons-vicente" style="cursor:pointer;">Saúde</button>
                    </div>
                </div>
            `,
            focusConfirm: false,
            didRender: () => {
                const actions = ['mudar-lazer-passear', 'mudar-lazer-descansar', 'mudar-foco-treinar', 'mudar-foco-imprensa', 'usar-xp-humor', 'usar-xp-saude', 'ver-boost'];
                actions.forEach(action => {
                    const button = createButtonAndAddListener(action, action);
                    document.body.appendChild(button);
                });
            }
        });
    }


    var ul = document.getElementById('ul-header-links');
    if (ul) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.textContent = 'Vicente';
        a.id = 'vicente-link';
        a.style.cursor = 'pointer';
        li.appendChild(a);
        ul.appendChild(li);

        a.addEventListener('click', showModal);
    }


})();
