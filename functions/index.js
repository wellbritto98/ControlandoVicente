const functions = require('firebase-functions');
const puppeteer = require('puppeteer');
const chromium = require('chromium');
const cors = require('cors')({ origin: true });

const idJogador = 1784;
const idTime = 154;
let browser;

async function startBrowser() {
    browser = await puppeteer.launch({ executablePath: chromium.path, headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    return browser;
}

async function login(browser) {
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




// Função para mudar o foco
async function mudarFoco(page, select, value, botao) {
    await page.waitForSelector(`select[name="${select}"]`);
    await page.select(`select[name="${select}"]`, `${value}`);
    await page.waitForSelector(`input[type="submit"][name="${botao}"]`);
    await page.click(`input[type="submit"][name="${botao}"]`);
    await page.waitForNavigation();
}

// Função específica do Firebase Functions para ver o boost
exports.verBoost = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        const browser = await startBrowser();
        try {
            const page = await login(browser);
            await page.goto(`https://www.footmundo.com/outras-opcoes/time/${idTime}`), { waitUntil: 'networkidle2' };
            if (page.url() !== `https://www.footmundo.com/outras-opcoes/time/${idTime}`) {
                console.log('não foi para a página')
                await page.goto(`https://www.footmundo.com/outras-opcoes/time/${idTime}`, { waitUntil: 'networkidle2' });
                console.log(page.url())
            }
            const titleValue = await page.$eval('#popularidade', el => el.getAttribute('title'));; // Substitua pela sua lógica real
            console.log(`O Boost atual do vicente é: ${titleValue}`);
            await page.close();
            await browser.close();
            res.json({ message: `O Boost atual do vicente é: ${titleValue}` });

        } catch (error) {
            console.error("Erro ao acessar o boost", error);
            await browser.close();
            res.status(500).send("Erro ao processar a solicitação");
        }
    }
    )
}

);


// Funções Firebase
exports.mudarLazerDescansar = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        const browser = await startBrowser();

        let page = await login(browser);
        if (page.url() == 'www.footmundo.com') {
            await page.close();
            page = await login(browser);
        }
        console.log(page)
        await page.goto(`https://www.footmundo.com/foco/jogador/${idJogador}`, { waitUntil: 'load' });
        if (page.url() !== `https://www.footmundo.com/foco/jogador/${idJogador}`) {
            console.log('não foi para a página')
            await page.goto(`https://www.footmundo.com/foco/jogador/${idJogador}`, { waitUntil: 'networkidle2' });
            console.log(page.url())
        }
        await mudarFoco(page, 'foco_lazer', '51', 'lazer');
        await page.close();
        await browser.close();
        res.json({ message: 'Opção de lazer alterada para "Descansar".' });

    });
}
);

exports.mudarLazerPassear = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        const browser = await startBrowser();

        let page = await login(browser);
        if (page.url() == 'www.footmundo.com') {
            await page.close();
            page = await login(browser);
        }
        console.log(page)
        await page.goto(`https://www.footmundo.com/foco/jogador/${idJogador}`, { waitUntil: 'load' });
        if (page.url() !== `https://www.footmundo.com/foco/jogador/${idJogador}`) {
            console.log('não foi para a página')
            await page.goto(`https://www.footmundo.com/foco/jogador/${idJogador}`, { waitUntil: 'networkidle2' });
            console.log(page.url())
        }
        await mudarFoco(page, 'foco_lazer', '50', 'lazer');
        await page.close();
        await browser.close();
        res.json({ message: 'Opção de lazer alterada para "Passear".' });
    }
    );
}
);

exports.mudarFocoTreinar = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        const browser = await startBrowser();

        let page = await login(browser);
        if (page.url() == 'www.footmundo.com') {
            await page.close();
            page = await login(browser);
        }
        console.log(page)
        await page.goto(`https://www.footmundo.com/foco/jogador/${idJogador}`, { waitUntil: 'load' });
        if (page.url() !== `https://www.footmundo.com/foco/jogador/${idJogador}`) {
            console.log('não foi para a página')
            await page.goto(`https://www.footmundo.com/foco/jogador/${idJogador}`, { waitUntil: 'networkidle2' });
            console.log(page.url())
        }
        await mudarFoco(page, 'foco_carreira', '2', 'mudar_foco');
        await page.close();
        await browser.close();
        res.json({ message: 'Opção de foco alterada para "Treinar".' });

    }
    );
}
);

exports.mudarFocoImprensa = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        const browser = await startBrowser();

        let page = await login(browser);
        if (page.url() == 'www.footmundo.com') {
            await page.close();
            page = await login(browser);
        }
        console.log(page)
        await page.goto(`https://www.footmundo.com/foco/jogador/${idJogador}`, { waitUntil: 'load' });
        if (page.url() !== `https://www.footmundo.com/foco/jogador/${idJogador}`) {
            console.log('não foi para a página')
            await page.goto(`https://www.footmundo.com/foco/jogador/${idJogador}`, { waitUntil: 'networkidle2' });
            console.log(page.url())
        }
        await mudarFoco(page, 'foco_carreira', '3', 'mudar_foco');
        await page.close();
        await browser.close();
        res.json({ message: 'Opção de foco alterada para "Imprensa".' });
    }
    );
}
);

exports.usarXpHumor = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        const browser = await startBrowser();
        try {
            let page = await login(browser);
            if (page.url() == 'www.footmundo.com') {
                await page.close();
                page = await login(browser);
            }
            await page.goto(`https://www.footmundo.com/usar-xp/jogador/${idJogador}`, { waitUntil: 'networkidle2' });
            if (page.url() !== `https://www.footmundo.com/usar-xp/jogador/${idJogador}`) {
                console.log('não foi para a página')
                await page.goto(`https://www.footmundo.com/usar-xp/jogador/${idJogador}`, { waitUntil: 'networkidle2' });
                console.log(page.url())
            }
            await page.waitForSelector(`#UpHumor`);
            page.on('dialog', async dialog => {
                await dialog.accept();
            });
            await page.click(`#UpHumor input[type="button"]`);
            await page.waitForNavigation({ waitUntil: 'networkidle0' });
            await page.close();
            await browser.close();
            res.json({ message: 'XP de humor utilizada.' });
        } catch (error) {
            console.error("Erro ao usar xp", error);
            await browser.close();
            res.status(500).send("Erro ao processar a solicitação");
        }
    }
    );
}
);

exports.usarXpSaude = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        const browser = await startBrowser();
        try {
            let page = await login(browser);
            if (page.url() == 'www.footmundo.com') {
                await page.close();
                page = await login(browser);
            }
            await page.goto(`https://www.footmundo.com/usar-xp/jogador/${idJogador}`, { waitUntil: 'networkidle2' });
            if (page.url() !== `https://www.footmundo.com/usar-xp/jogador/${idJogador}`) {
                console.log('não foi para a página')
                await page.goto(`https://www.footmundo.com/usar-xp/jogador/${idJogador}`, { waitUntil: 'networkidle2' });
                console.log(page.url())
            }
            await page.waitForSelector(`#UpSaude`);
            page.on('dialog', async dialog => {
                await dialog.accept();
            });
            await page.click(`#UpSaude input[type="button"]`);
            await page.waitForNavigation({ waitUntil: 'networkidle0' });
            await page.close();
            await browser.close();
            res.json({ message: 'XP de saúde utilizada.' });
        } catch (error) {
            console.error("Erro ao usar xp", error);
            await browser.close();
            res.status(500).send("Erro ao processar a solicitação");
        }
    }
    );
}
);


