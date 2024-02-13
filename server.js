const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const chromium = require('chromium');

const app = express();
app.use(cors());
const port = 3000; // Você pode escolher outra porta se necessário
const idJogador = 1784;
const idTime = 154;
let browser;

async function startBrowser() {
    browser = await puppeteer.launch( {executablePath:chromium.path, headless: false, args: ['--no-sandbox', '--disable-setuid-sandbox']});
}

async function login() {
    const page = await browser.newPage();
    await page.goto('http://www.footmundo.com', { waitUntil: 'networkidle2' });


    // Verifica se já está logado procurando por um elemento que só aparece para usuários logados
    const isAlreadyLoggedIn = await page.$('#info_perfil') !== null;
    if (isAlreadyLoggedIn) {
        console.log('Usuário já está logado.');
        return page; // Usuário já está logado, então retorna a página
    }

    // Se não estiver logado, tenta fazer o login
    await page.waitForSelector('#usernameInput', { timeout: 2000 });
    await page.waitForSelector('#passwordInput', { timeout: 2000 });
    await page.type('#usernameInput', 'etapa2proplay@gmail.com');
    await page.type('#passwordInput', 'jovemfla1');
    await page.click('input[type="submit"][name="logar"]');
    console.log('Usuário logado com sucesso.');

    return page; // Retorna a página para ser usada após o login
}





async function mudarFoco(page, select, value, botao) {

    // Navegar até a página do jogador
    await page.goto(`https://www.footmundo.com/foco/jogador/${idJogador}`);

    // Aguardar o carregamento do select de lazer
    await page.waitForSelector(`select[name="${select}"]`);

    // Alterar a opção de lazer para "Descansar"
    await page.select(`select[name="${select}"]`, `${value}`); // '51' é o value da opção "Descansar"
    await page.waitForSelector(`input[type="submit"][name="${botao}"]`);
    await page.click(`input[type="submit"][name="${botao}"]`);
    await page.waitForNavigation();
    await page.close(); // Feche o browser aqui

}

async function verBoost(page) {
    await page.goto(`https://www.footmundo.com/outras-opcoes/time/${idTime}`);

    const titleValue = await page.$eval('#popularidade', el => el.getAttribute('title'));

    await page.close();
    return titleValue;
}

async function usarXp(page, tipo) {
    await page.goto(`https://www.footmundo.com/usar-xp/jogador/${idJogador}`);

    let formId;
    if (tipo === 'saude') {
        formId = '#UpSaude';
    } else if (tipo === 'humor') {
        formId = '#UpHumor';
    } else {
        throw new Error('Tipo inválido. Deve ser "saude" ou "humor".');
    }

    await page.waitForSelector(formId);

    // Preparar para aceitar o diálogo confirm
    page.on('dialog', async dialog => {
        await dialog.accept();
    });

    await page.click(`${formId} input[type="button"]`);

    // Aguarde a navegação ou uma ação específica aqui, se necessário
    await page.waitForNavigation({ waitUntil: 'networkidle0' });

    await page.close();

}

function createRoute(path, message, action, ...actionArgs) {
    app.get(path, async (req, res) => {
        const page = await login();
        await action(page, ...actionArgs);
        res.json({ message });
    });
}

createRoute('/mudar-lazer-descansar', 'Opção de lazer alterada para "Descansar".', mudarFoco, 'foco_lazer', '51', 'lazer');
createRoute('/mudar-lazer-passear', 'Opção de lazer alterada para "Passear".', mudarFoco, 'foco_lazer', '50', 'lazer');
createRoute('/mudar-foco-treinar', 'Opção de foco alterada para "Treinar".', mudarFoco, 'foco_carreira', '2', 'mudar_foco');
createRoute('/mudar-foco-imprensa', 'Opção de foco alterada para "Imprensa".', mudarFoco, 'foco_carreira', '3', 'mudar_foco');
createRoute('/usar-xp-humor', 'XP de humor utilizada.', usarXp, 'humor');
createRoute('/usar-xp-saude', 'XP de saúde utilizada.', usarXp, 'saude');



app.get('/ver-boost', async (req, res) => {
    const page = await login();
    let titleValue = await verBoost(page);
    res.json({ message: `O Boost atual do vicente é: ${titleValue}` });
});


app.listen(port, async () => {
    await startBrowser();
    console.log(`Servidor rodando em http://localhost:${port}`);
});