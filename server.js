const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const port = 3000; // Você pode escolher outra porta se necessário
const idJogador = 1784;



async function login() {
    const browser = await puppeteer.launch({ headless: false }); // 'headless: false' abre o navegador visivelmente
    const page = await browser.newPage();
    await page.goto('http://www.footmundo.com');

    // Aguardar o carregamento dos elementos da página
    await page.waitForSelector('#usernameInput');
    await page.waitForSelector('#passwordInput');

    // Preencher os campos de login e senha
    await page.type('#usernameInput', 'etapa2proplay@gmail.com');
    await page.type('#passwordInput', 'jovemfla1');

    // Clicar no botão de entrar
    await page.click('input[type="submit"][name="logar"]');
    // Aguardar por alguma navegação após o login
    await page.waitForNavigation();

    return { page, browser }; // Retorna a página para ser usada após o login
}

async function mudarFoco(page, browser, select, value, botao){
    var page = page; // Aguarda o login ser concluído

    // Navegar até a página do jogador
    await page.goto(`https://www.footmundo.com/foco/jogador/${idJogador}`);

    // Aguardar o carregamento do select de lazer
    await page.waitForSelector(`select[name="${select}"]`);

    // Alterar a opção de lazer para "Descansar"
    await page.select(`select[name="${select}"]`, `${value}`); // '51' é o value da opção "Descansar"
    await page.waitForSelector(`input[type="submit"][name="${botao}"]`);
    await page.click(`input[type="submit"][name="${botao}"]`);
    await page.waitForNavigation();
    await browser.close(); // Feche o browser aqui
    
}

app.get('/mudar-lazer-descansar', async (req, res) => {
    const { page, browser } = await login(); // Aguarda o login ser concluído
    const select = 'foco_lazer';
    const value = '51';
    const botao = 'lazer';
    await mudarFoco(page, browser, select, value, botao); // Passa browser como argumento
    res.send('Opção de lazer alterada para "Descansar".');
});

app.get('/mudar-lazer-passear', async (req, res) => {
    const { page, browser } = await login(); // Aguarda o login ser concluído
    const select = 'foco_lazer';
    const value = '50';
    const botao = 'lazer';
    await mudarFoco(page, browser, select, value, botao);
    res.send('Opção de lazer alterada para "Passear".');
});

app.get('/mudar-foco-treinar', async (req, res) => {
    const { page, browser } = await login(); // Aguarda o login ser concluído
    const select = 'foco_carreira';
    const value = '2';
    const botao = 'mudar_foco';
    await mudarFoco(page, browser, select, value, botao);
    res.send('Opção de lazer alterada para "Passear".');
});

app.get('/mudar-foco-imprensa', async (req, res) => {
    const { page, browser } = await login(); // Aguarda o login ser concluído
    const select = 'foco_carreira';
    const value = '3';
    const botao = 'mudar_foco';
    await mudarFoco(page, browser, select, value, botao);
    res.send('Opção de lazer alterada para "Passear".');
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
