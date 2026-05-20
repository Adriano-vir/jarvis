// ════════════════════════════════════════════════════════════════════
//   JARVIS — Global Hotkey Daemon (Electron headless)
//   Registra Cmd+J system-wide. Dispara pet + saudação ao apertar.
//   Roda via LaunchAgent (KeepAlive) — disponível imediatamente após boot.
// ════════════════════════════════════════════════════════════════════

const { app, globalShortcut } = require('electron');
const http = require('http');

const SERVER = 'http://localhost:3000';
const HOTKEY = 'CommandOrControl+J';

function httpPost(path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : '';
    const req = http.request({
      host: 'localhost', port: 3000, path, method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) },
      timeout: 5000,
    }, (res) => {
      let buf = '';
      res.on('data', c => buf += c);
      res.on('end', () => resolve({ status: res.statusCode, body: buf }));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
    if (data) req.write(data);
    req.end();
  });
}

async function triggerPet() {
  console.log(`[hotkey] ${new Date().toISOString()} Cmd+J disparado`);
  try {
    // 1) Garante pet aberto SEM toggle (não fecha se já estiver aberto)
    await httpPost('/api/pet/ensure-open');
    // 2) Saudação via TTS (proativo). Variações pra não ficar repetitivo.
    const saudacoes = [
      'Em posição, senhor. Pronto para o que precisar.',
      'Bom retorno, senhor. Estou à disposição.',
      'Senhor. Em prontidão total. Por onde começamos?',
      'À sua espera, senhor. Comando.',
      'Operacional, senhor. Diga.',
      'Aqui, senhor. Atento.',
    ];
    const text = saudacoes[Math.floor(Math.random() * saudacoes.length)];
    // Toca TTS via endpoint dedicado (pet vai receber via SSE ou faz direto)
    httpPost('/api/tts-play', { text, voice: 'onyx' }).catch(() => {});
  } catch (e) {
    console.error('[hotkey] trigger error:', e.message);
  }
}

// Evita 2ª instância
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) { app.quit(); }

app.whenReady().then(() => {
  // App invisível — sem dock, sem janela
  if (app.dock) app.dock.hide();
  app.setActivationPolicy?.('accessory');

  const ok = globalShortcut.register(HOTKEY, triggerPet);
  if (ok) console.log(`[hotkey] ${HOTKEY} registrado globalmente`);
  else console.error(`[hotkey] falha ao registrar ${HOTKEY}`);
});

app.on('will-quit', () => globalShortcut.unregisterAll());
app.on('window-all-closed', (e) => { e.preventDefault?.(); }); // não sai quando não há janelas
