const express = require('express');
const { Builder, By, until } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const cors = require('cors');

const app = express();
app.use(cors());
const port = 3000; // Você pode escolher outra porta se necessário
const idJogador = 1784;
const idTime = 154;

async function login() {
    let options = new firefox.Options();
    let driver = await new Builder().forBrowser('firefox').setFirefoxOptions(options).build();
    await driver.get('http://www.footmundo.com');

    await driver.wait(until.elementLocated(By.id('usernameInput')), 10000);
    await driver.wait(until.elementLocated(By.id('passwordInput')), 10000);

    await driver.findElement(By.id('usernameInput')).sendKeys('etapa2proplay@gmail.com');
    await driver.findElement(By.id('passwordInput')).sendKeys('jovemfla1');

    await driver.findElement(By.css('input[type="submit"][name="logar"]')).click();
    await driver.wait(until.urlContains(`https://www.footmundo.com/jogador/${idJogador}`), 10000);

    return driver;
}

async function mudarFoco(driver, select, value, botao) {
    await driver.get(`https://www.footmundo.com/foco/jogador/${idJogador}`);

    // Esperar até que o elemento select esteja visível
    await driver.wait(until.elementLocated(By.css(`select[name="${select}"]`)), 10000);
    const selectElement = await driver.findElement(By.css(`select[name="${select}"]`));

    // Selecionar a opção desejada clicando no elemento <option> correspondente
    const optionElement = await selectElement.findElement(By.css(`option[value="${value}"]`));
    await optionElement.click();

    // Aguardar e clicar no botão de submit
    await driver.wait(until.elementLocated(By.css(`input[type="submit"][name="${botao}"]`)), 10000);
    await driver.findElement(By.css(`input[type="submit"][name="${botao}"]`)).click();


    await driver.wait(until.urlContains(`https://www.footmundo.com/foco/jogador/${idJogador}`), 10000);
    driver.quit();
}

async function verBoost(driver){
    await driver.get(`https://www.footmundo.com/outras-opcoes/time/${idTime}`);

    // Encontra o elemento pelo ID e obtém o valor do atributo 'title'
    let element = await driver.findElement(By.id('popularidade'));
    let titleValue = await element.getAttribute('title');

    driver.quit();

    return titleValue;
}

async function usarBoost(driver){
    await driver.get(`https://www.footmundo.com/outras-opcoes/time/${idTime}`);
}

async function usarXp(driver, tipo) {
    // Navega para a página de usar XP
    await driver.get(`https://www.footmundo.com/usar-xp/jogador/${idJogador}`);

    // Define o ID do formulário baseado no tipo
    let formId;
    if (tipo === 'saude') {
        formId = 'UpSaude';
    } else if (tipo === 'humor') {
        formId = 'UpHumor';
    } else {
        throw new Error('Tipo inválido. Deve ser "saude" ou "humor".');
    }

    // Espera até que o formulário esteja visível
    await driver.wait(until.elementLocated(By.id(formId)), 10000);

    // Remove o elemento obstrutivo se ele estiver presente
    await driver.executeScript("var element = document.querySelector('.footer-info'); if (element) element.remove();");

    // Encontra o botão dentro do formulário e clica nele
    const formElement = await driver.findElement(By.id(formId));
    await driver.wait(until.elementLocated(By.css('input[type="button"]')), 10000);
    const submitButton = await formElement.findElement(By.css('input[type="button"]'));

    // Agora que o elemento obstrutivo foi removido, tenta clicar no botão
    await submitButton.click();


    // Aguarda até que o alerta esteja presente e então aceita-o
    const alert = await driver.wait(until.alertIsPresent(), 10000);
    await alert.accept(); // Clica em "OK" no alerta de confirmação

    // Aguarda pela navegação ou alguma outra mudança na página para confirmar que a ação foi bem-sucedida
    await driver.wait(until.urlContains(`https://www.footmundo.com/usar-xp/jogador/${idJogador}`), 10000);

    // Fecha o navegador após a ação ser concluída
    await driver.quit();
}

function createRoute(path, message, action, ...actionArgs) {
    app.get(path, async (req, res) => {
        let driver = await login();
        await action(driver, ...actionArgs);
        res.json({ message });
    });
}

createRoute('/mudar-lazer-descansar', 'Opção de lazer alterada para "Descansar".', mudarFoco, 'foco_lazer', '51', 'lazer');
createRoute('/mudar-lazer-passear', 'Opção de lazer alterada para "Passear".', mudarFoco, 'foco_lazer', '50', 'lazer');
createRoute('/mudar-foco-treinar', 'Opção de foco alterada para "Treinar".', mudarFoco, 'foco_carreira', '2', 'mudar_foco');
createRoute('/mudar-foco-imprensa', 'Opção de foco alterada para "Imprensa".', mudarFoco, 'foco_carreira', '3', 'mudar_foco');
createRoute('/usar-xp-saude', 'XP usado em Saúde com sucesso.', usarXp, 'saude');
createRoute('/usar-xp-humor', 'XP usado em Humor com sucesso.', usarXp, 'humor');

app.get('/ver-boost', async (req, res) => {
    let driver = await login();
    let titleValue = await verBoost(driver);
    res.json({ message: `O Boost atual do vicente é : ${titleValue}` });
});




app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});