# RD Station Form Validator

> Script de validação avançada para formulários nativos do **RD Station Landing Pages**, focado em reduzir erros de preenchimento de telefone e e-mail — com máscara brasileira, sugestão de correção de domínio e bloqueio de avanço em formulários multi-step.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
[![No Dependencies](https://img.shields.io/badge/dependencies-none-brightgreen.svg)](#)
[![RD Station](https://img.shields.io/badge/RD_Station-Landing_Pages-0099ff.svg)](https://www.rdstation.com/)

---

## 📋 Índice

- [Sobre](#-sobre)
- [Features](#-features)
- [Demo](#-demo)
- [Instalação](#-instalação)
- [Como funciona](#-como-funciona)
- [Configuração](#-configuração)
- [Troubleshooting](#-troubleshooting)
- [Compatibilidade](#-compatibilidade)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)

---

## 📖 Sobre

O formulário nativo do RD Station Landing Pages é funcional, mas apresenta limitações em validação que resultam em leads com dados inválidos no CRM: telefones incompletos, e-mails com typos (`gmial.com`, `hotnail.com`), e códigos de país interferindo em máscaras brasileiras.

Este script resolve esses problemas sem precisar reconstruir o formulário — basta colar em um widget de código da landing page e ele aplica validações inteligentes em cima do HTML que o RD renderiza.

**Feito para:** agências, times de marketing e desenvolvedores que usam RD Station Landing Pages e precisam melhorar a qualidade dos leads capturados.

---

## ✨ Features

### Telefone
- ✅ Máscara brasileira em tempo real: `(DDD) XXXXX-XXXX`
- ✅ Detecção automática de campo celular (exige 11 dígitos + dígito 9)
- ✅ Validação de DDDs brasileiros reais (rejeita 00, 10, 20, etc.)
- ✅ Bloqueio de sequências óbvias (99999-9999, 11111-1111)
- ✅ Neutralização do plugin `intl-tel-input` (remove seletor de bandeira)
- ✅ Tratamento do código de país `+55` injetado pelo RD
- ✅ Distinção entre fixo (inicia com 2–5) e celular (inicia com 9)

### E-mail
- ✅ Validação de formato com regex rigoroso (mais estrito que `type="email"`)
- ✅ **Sugestão automática** de correção para typos comuns de domínio
  - `joao@gmial.com` → sugere `joao@gmail.com`
  - `maria@hotnail.com` → sugere `maria@hotmail.com`
- ✅ Normalização automática (lowercase, remove espaços)
- ✅ Lista configurável de domínios comuns brasileiros

### UX e bloqueio
- ✅ Feedback visual em tempo real (bordas verde/vermelha)
- ✅ Mensagens de erro contextuais abaixo de cada campo
- ✅ Bloqueio de envio em formulários tradicionais (evento `submit`)
- ✅ Bloqueio de avanço em **formulários multi-step** (intercepta `click`)
- ✅ Scroll automático e foco no primeiro campo inválido
- ✅ `MutationObserver` protege contra sobrescrita de placeholder pelo RD
- ✅ Otimizado para preenchimento **mobile-first**

### Zero dependências
- Vanilla JavaScript puro — não carrega nenhuma lib externa
- Não requer jQuery, Bootstrap, nem nada além do navegador
- ~9 KB minificado

---

## 🎬 Demo

**Antes** (formulário padrão RD Station):

```
Campo: (55) 85650-525     ← seletor de país confunde, aceita número incompleto
E-mail: joao@gmial.com    ← passa sem alerta
```

**Depois** (com o validator):

```
Campo: (85) 98765-4321    ← máscara BR, exige 11 dígitos
E-mail: joao@gmial.com    → 💡 "Você quis dizer joao@gmail.com?"
```

---

## 🚀 Instalação

### Método 1 — Widget de Código (recomendado)

1. Abra sua landing page no editor do **RD Station**
2. Arraste o componente **"Código"** para qualquer área da página (pode ser o rodapé)
3. Cole o conteúdo do arquivo [`dist/rd-form-validator.html`](./dist/rd-form-validator.html) inteiro no widget
4. Salve e publique

### Método 2 — Scripts da página

1. No editor da landing page, clique no ícone de **engrenagem** (configurações)
2. Vá na aba **Scripts**
3. Cole o conteúdo na seção **"Antes do fechamento da tag `</body>`"**
4. Salve e publique

> **Dica:** o Método 2 é mais limpo porque separa o código da estrutura visual da página.

---

## ⚙️ Como funciona

### Arquitetura em 4 camadas

```
┌─────────────────────────────────────────────────────┐
│  1. DETECÇÃO                                        │
│     Encontra inputs de e-mail e telefone via        │
│     querySelector (type, name patterns)             │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  2. NEUTRALIZAÇÃO                                   │
│     Destrói o plugin intl-tel-input se presente     │
│     (destroy() + cloneNode para limpar listeners)   │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  3. APLICAÇÃO                                       │
│     Máscara BR, placeholder, handlers de input,     │
│     blur, focus — com MutationObserver de backup    │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  4. BLOQUEIO                                        │
│     Intercepta submit (capture phase) E click em    │
│     botões (para forms multi-step do RD)            │
└─────────────────────────────────────────────────────┘
```

### Por que usar `cloneNode` pra destruir o plugin?

O `intl-tel-input` que o RD Station usa anexa múltiplos event listeners ao input. Chamar `destroy()` do plugin é o caminho oficial, mas nem sempre funciona 100% (depende da versão carregada pelo RD). `cloneNode(true)` cria uma cópia do elemento **sem** nenhum listener anexado — é a garantia final de que só os nossos handlers vão rodar.

### Por que intercepta `click` além de `submit`?

Formulários multi-step do RD Station avançam entre etapas via JavaScript interno, **sem disparar o evento `submit` do form** até a etapa final. Um listener apenas em `submit` deixa leads com dados inválidos avançarem para a próxima etapa. O interceptor de `click` resolve isso subindo na árvore DOM a partir do elemento clicado até achar um botão, localizando o form mais próximo e rodando toda a validação antes de permitir o clique.

---

## 🔧 Configuração

Todas as variáveis ajustáveis estão no topo do arquivo `src/rd-form-validator.js`:

### `COMMON_DOMAINS`

Lista de domínios comuns usada para sugerir correção de typos. Adicione os domínios corporativos dos seus clientes se eles aparecerem com frequência:

```javascript
var COMMON_DOMAINS = [
  'gmail.com', 'hotmail.com', 'outlook.com',
  'yahoo.com.br', 'icloud.com',
  // adicione aqui:
  'minhaempresa.com.br',
  'empresa-parceira.com'
];
```

### `VALID_DDD`

Lista de DDDs brasileiros válidos. Já contempla todos os DDDs existentes no Brasil — normalmente não precisa editar.

### `PHONE_PLACEHOLDER`

Texto placeholder do campo de telefone. Padrão: `(DDD) XXXXX-XXXX`.

```javascript
var PHONE_PLACEHOLDER = '(DDD) XXXXX-XXXX';
```

### Seletores CSS personalizados

Se o seu formulário tem classes de erro/sucesso próprias, sobrescreva as classes `.rd-valid`, `.rd-invalid`, `.rd-msg-error` e `.rd-msg-suggest` na folha de estilo do widget.

---

## 🔍 Troubleshooting

### O seletor de bandeira ainda aparece

Verifique o tipo do campo no editor do RD Station:
1. Abra o formulário no editor
2. Clique no campo "Celular" ou "Telefone"
3. Procure a opção **"Tipo de campo"** no painel direito
4. Troque de "Telefone internacional" para **"Telefone"** comum ou **"Texto"**

Isso elimina o plugin na origem e é mais confiável que o CSS de ocultação.

### O placeholder `(DDD) XXXXX-XXXX` não aparece

Alguns temas do RD Station usam um `<label>` flutuante posicionado sobre o input (o nome do campo fica por cima). Soluções:

**A.** No editor, renomeie o rótulo do campo para incluir o exemplo:
```
Celular (WhatsApp) — (DDD) XXXXX-XXXX
```

**B.** Abra o DevTools, inspecione o campo e adicione um CSS específico para esconder o label flutuante.

### O botão ainda avança mesmo com erro

- Verifique se o campo tem o atributo `required` no HTML (inspecione o elemento)
- Confirme que a classe do botão bate com a regex `/submit|btn|button/i`
- Se o form é carregado via iframe, o script precisa estar **dentro do iframe** — não funciona de fora

Abra uma [issue](../../issues) com um print do HTML do botão e do form.

### O campo não detecta como "celular"

A detecção automática busca por `celular`, `whats` ou `mobile` no `name`, `id` ou `<label>` do campo. Se o seu campo usa outro nome (ex: "WhatsApp Comercial"), renomeie-o no editor do RD para incluir uma dessas palavras, ou ajuste a função `isCelularField()` no script.

---

## 🌐 Compatibilidade

| Navegador | Versão mínima | Status |
|-----------|---------------|--------|
| Chrome    | 60+           | ✅ Testado |
| Safari    | 12+           | ✅ Testado |
| Firefox   | 60+           | ✅ Testado |
| Edge      | 79+           | ✅ Testado |
| Chrome Mobile (Android) | 60+ | ✅ Testado |
| Safari iOS | 12+          | ✅ Testado |
| IE 11     | —             | ❌ Não suportado |

Requer suporte a `MutationObserver`, `querySelector`, `addEventListener` e ES5+.

---

## 🤝 Contribuindo

Contribuições são muito bem-vindas! Para contribuir:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/minha-feature`)
3. Commite suas mudanças (`git commit -m 'feat: adiciona validação de CPF'`)
4. Push para a branch (`git push origin feature/minha-feature`)
5. Abra um Pull Request

Veja [CONTRIBUTING.md](./CONTRIBUTING.md) para mais detalhes.

### Roadmap / ideias para contribuir

- [ ] Validação de CPF e CNPJ
- [ ] Bloqueio de e-mails descartáveis (mailinator, yopmail, tempmail)
- [ ] Confirmação de e-mail em dois campos
- [ ] Validação de CEP com autocomplete via ViaCEP
- [ ] Versão em TypeScript
- [ ] Testes automatizados

---

## 📜 Licença

MIT © [Modernista Digital Branding](https://modernista.com.br)

Veja [LICENSE](./LICENSE) para o texto completo.

---

## 🙋 Autor

Desenvolvido por **[Modernista Digital Branding](https://modernista.com.br)** — agência de branding e transformação digital em Fortaleza, Brasil, especializada em PMEs de tecnologia, educação e e-commerce.

Se este projeto te ajudou, considere dar uma ⭐ no repositório!
