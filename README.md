# JARVIS

> Just A Rather Very Intelligent System — assistente operacional pessoal.

Repositório principal: [github.com/Adriano-vir/jarvis](https://github.com/Adriano-vir/jarvis)

## Estrutura

```
.
├── server.js              # Express + WebSocket + 79 endpoints
├── public/                # Cockpit web (HTML + CSS + JS)
│   ├── index.html
│   ├── script.js
│   └── style.css
├── pet/                   # Pet Zeus (Electron)
│   ├── main.js
│   └── pet.html
├── system/                # Daemons + identidade
│   ├── screen-state-mac.py
│   ├── screenshot.py
│   └── ... (memory/history em runtime, não versionado)
└── package.json
```

## Branches

- `main` — versão estável (atual: 6dfefb8)
- `feat/voice-execution-knowledge` — voz + execução + Obsidian
- `backup/full-state-*` — snapshots completos antes de resets

## Instalação

```bash
git clone https://github.com/Adriano-vir/jarvis.git
cd jarvis
npm install
cp .env.example .env  # adicione OPENAI_API_KEY e ANTHROPIC_API_KEY
node server.js
```

Acesse http://localhost:3000

## Estado dinâmico (não-versionado)

Persistência local em `system/` e `Documents and Projects/`. Ver `.gitignore`.
