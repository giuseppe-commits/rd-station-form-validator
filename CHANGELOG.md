# Changelog

Todas as mudanças notáveis neste projeto serão documentadas aqui.

O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/)
e o projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [1.0.0] — 2026-04-17

### Adicionado
- Máscara brasileira para telefone `(DDD) XXXXX-XXXX`, aplicada em tempo real
- Validação específica para celular (11 dígitos, dígito 9 obrigatório após DDD)
- Validação específica para telefone fixo (10 dígitos, primeiro dígito 2–5)
- Validação de DDDs brasileiros reais (68 DDDs)
- Bloqueio de sequências óbvias de dígitos (99999-9999, 11111-1111)
- Neutralização completa do plugin `intl-tel-input` via `destroy()` + `cloneNode`
- Sugestão inteligente de correção de domínio de e-mail via distância de Levenshtein
- Validação de e-mail com regex mais rigoroso que `type="email"`
- Detecção automática de campos celular vs. telefone genérico
- Bloqueio de envio em formulários tradicionais (evento `submit`)
- Bloqueio de avanço em formulários multi-step (intercepta `click`)
- Feedback visual verde/vermelho em tempo real
- Scroll automático e foco no primeiro campo inválido
- `MutationObserver` para proteger placeholder contra sobrescrita pelo RD
- Suporte a atributo `required` e `aria-required`
- Otimizações mobile: `inputmode`, `autocomplete`, tamanhos de fonte responsivos

### Notas
- Primeira release pública estável
- Testado em Chrome, Safari, Firefox, Edge (desktop e mobile)
- Zero dependências externas
