const express = require('express');
const app = express();

// Middleware para processar os dados JSON enviados pelo frontend
app.use(express.json());

// 1. Rota POST específica para receber a telemetria do frontend
// Declarada ANTES do middleware geral para garantir a interceptação correta
app.post('/api/telemetria', (req, res) => {
    const dados = req.body;
    
    console.log(`\n⏱️--- ATUALIZAÇÃO DE PERMANÊNCIA ---`);
    console.log(`Domínio: foipreso.com.br`);
    console.log(`IP do Usuário: ${dados.ip_cliente || 'Não detectado'}`);
    console.log(`Tempo na página: ${dados.tempo_permanencia_segundos} segundos`);
    if (dados.localizacao_navegador) {
        console.log(`Geolocalização (Navegador): Lat ${dados.localizacao_navegador.latitude}, Lon ${dados.localizacao_navegador.longitude}`);
    }
    console.log(`------------------------------------`);
    
    res.sendStatus(200);
});

// 2. CORREÇÃO COMPATÍVEL COM EXPRESS 5: 
// Usando middleware nativo para responder a qualquer URL sem usar sintaxe Regex/Coringa conflitante
app.use((req, res, next) => {
    // Garante que só responderemos às requisições GET para evitar conflitos com o POST de telemetria
    if (req.method !== 'GET') {
        return next();
    }

    // Captura de IPs (Trata proxies reversos comuns em servidores de nuvem e Docker)
    const ipRaw = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    
    let ipv4 = 'Não detectado';
    let ipv6 = 'Não detectado';

    if (ipRaw) {
        if (ipRaw.includes(':')) {
            ipv6 = ipRaw.split(',')[0].trim();
            if (ipRaw.includes('::ffff:')) {
                ipv4 = ipRaw.split('::ffff:')[1];
            }
        } else {
            ipv4 = ipRaw.split(',')[0].trim();
        }
    }

    // Captura do Navegador (User Agent)
    const navegador = req.headers['user-agent'] || 'Desconhecido';

    // Idioma e Referência
    const idioma = req.headers['accept-language'] ? req.headers['accept-language'].split(',')[0] : 'Desconhecido';
    const vindoDe = req.headers['referer'] || 'Acesso Direto';

    // LOG INICIAL NO TERMINAL DO DOCKER
    console.log(`\n🚨--- NOVO ACESSO DETECTADO ---`);
    console.log(`Data/Hora: ${new Date().toLocaleString('pt-BR')}`);
    console.log(`IPv4: ${ipv4}`);
    console.log(`IPv6: ${ipv6}`);
    console.log(`Navegador/Dispositivo: ${navegador}`);
    console.log(`Idioma: ${idioma}`);
    console.log(`Origem do Tráfego: ${vindoDe}`);
    console.log(`--------------------------------`);

    const valorUSD = 100;
    const taxaConversaoAproximada = 5.10; 
    const valorBRL = (valorUSD * taxaConversaoAproximada).toFixed(2).replace('.', ',');

    res.send(`
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>DOMÍNIO À VENDA - foipreso.com.br</title>
            <style>
                :root { --verde: #009739; --amarelo: #fedd00; --azul: #012169; --branco: #ffffff; --dark: #002b11; }
                body { font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: radial-gradient(circle at center, #004d1e 0%, var(--dark) 100%); color: var(--branco); margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
                .container { background-color: rgba(0, 77, 30, 0.8); backdrop-filter: blur(10px); padding: 40px; border-radius: 20px; max-width: 550px; width: 90%; text-align: center; box-shadow: 0 15px 35px rgba(0,0,0,0.6); border: 2px solid var(--amarelo); position: relative; overflow: hidden; }
                .container::before { content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 6px; background: linear-gradient(90deg, var(--verde), var(--amarelo), var(--azul)); }
                .badge { background-color: var(--amarelo); color: var(--dark); padding: 6px 18px; font-weight: 900; border-radius: 50px; font-size: 0.8rem; text-transform: uppercase; margin-bottom: 20px; display: inline-block; box-shadow: 0 4px 15px rgba(254, 221, 0, 0.3); }
                .domain-name { color: var(--amarelo); font-weight: bold; background: rgba(0, 0, 0, 0.3); padding: 12px 25px; border-radius: 12px; display: inline-block; font-family: 'Courier New', monospace; font-size: 1.8rem; margin-bottom: 25px; border: 1px dashed var(--verde); }
                .price-box { background: rgba(255,255,255,0.05); padding: 25px; border-radius: 15px; margin-bottom: 25px; border: 1px solid rgba(254, 221, 0, 0.2); }
                .price-usd { font-size: 3rem; font-weight: 900; color: var(--amarelo); text-shadow: 2px 2px 4px rgba(0,0,0,0.5); }
                .payment-methods { display: flex; justify-content: center; gap: 15px; margin-top: 15px; }
                .method { background: var(--azul); color: white; padding: 8px 15px; border-radius: 8px; font-size: 0.8rem; font-weight: bold; border: 1px solid rgba(255,255,255,0.2); }
                .method.pix { background: #32bcad; color: var(--dark); border: none; }
                .btn-contact { display: block; width: 100%; background: linear-gradient(135deg, var(--verde) 0%, #007a2e 100%); color: white; text-decoration: none; padding: 18px; border-radius: 12px; font-weight: bold; font-size: 1.2rem; text-align:center; transition: transform 0.2s; box-shadow: 0 5px 15px rgba(0,0,0,0.3); border: 1px solid var(--amarelo); }
                .btn-contact:hover { transform: scale(1.02); brightness: 1.1; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="badge">>>> Oportunidade Única</div>
                <h1>Este domínio está à venda!</h1>
                <div class="domain-name">foipreso.com.br</div>
                
                <p style="color: #ccc; line-height: 1.5;">
                    Adquira este domínio premium com alto potencial de viralização no mercado brasileiro. Ideal para portais de notícias, utilidade pública ou projetos criativos.
                </p>

                <div class="price-box">
                    <div class="price-usd">$ ${valorUSD},00 <span style="font-size: 1.2rem; font-weight: normal; color: var(--branco); opacity: 0.7;">USD</span></div>
                    <div style="color: #aaa; margin-top: 5px;">Aproximadamente R$ ${valorBRL}</div>
                    
                    <div class="payment-methods">
                        <div class="method pix">⚡ PIX</div>
                        <div class="method">💳 Crédito</div>
                        <div class="method">💳 Débito</div>
                    </div>
                </div>

                <a href="mailto:seu-email@exemplo.com?subject=Interesse no dominio foipreso.com.br" class="btn-contact">
                    ENTRAR EM CONTATO PARA COMPRAR
                </a>
            </div>

            <script>
                const tempoInicio = Date.now();
                let dadosColetados = {
                    ip_cliente: "${ipv4 !== 'Não detectado' ? ipv4 : ipv6}",
                    localizacao_navegador: null,
                    tempo_permanencia_segundos: 0
                };

                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition((position) => {
                        dadosColetados.localizacao_navegador = {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        };
                    }, null, { timeout: 5000 });
                }

                function enviarTelemetria() {
                    dadosColetados.tempo_permanencia_segundos = Math.round((Date.now() - tempoInicio) / 1000);
                    const blob = new Blob([JSON.stringify(dadosColetados)], { type: 'application/json' });
                    navigator.sendBeacon('/api/telemetria', blob);
                }

                setInterval(() => {
                    dadosColetados.tempo_permanencia_segundos = Math.round((Date.now() - tempoInicio) / 1000);
                    fetch('/api/telemetria', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(dadosColetados)
                    }).catch(() => {});
                }, 10000);

                window.addEventListener('visibilitychange', () => {
                    if (document.visibilityState === 'hidden') enviarTelemetria();
                });
                window.addEventListener('pagehide', enviarTelemetria);
            </script>
        </body>
        </html>
    `);
});

const PORT = process.env.PORT || 80;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`==================================================`);
    console.log(`Monitoramento e Anúncio Ativos na Porta ${PORT}`);
    console.log(`Domínio: foipreso.com.br`);
    console.log(`==================================================`);
});