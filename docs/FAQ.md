# FAQ — Perguntas Frequentes

## Perguntas gerais

### O script funciona em qualquer landing page do RD Station?

Sim. Ele foi projetado para detectar campos de e-mail e telefone via seletores genéricos (`type="email"`, `type="tel"`, `name` contendo "phone", "telefone", "celular" ou "whats"), o que funciona com praticamente todos os templates e formulários nativos do RD Station.

### Funciona em formulários embed em sites próprios (fora do RD Station)?

Sim, desde que o formulário use HTML padrão com campos reconhecíveis. Basta incluir o CSS e o JS na página.

### Preciso pagar algo para usar?

Não. O projeto é MIT — uso livre, incluindo comercial. Agências podem usar em LPs de clientes sem restrições.

### Isso afeta a entregabilidade dos leads no RD Station CRM?

Não. O script apenas valida os dados **antes** do envio. Uma vez validado, o lead segue o fluxo normal do RD Station (CRM, automação, lista de segmentação, etc.).

## Perguntas técnicas

### Por que não usar `type="email"` nativo do HTML?

O `type="email"` do HTML5 tem validação extremamente permissiva — aceita `a@b`, `teste@x.y`, e outros formatos claramente inválidos. Nossa regex é mais rigorosa e exige ao menos 2 caracteres no TLD.

### Por que usar `cloneNode` em vez de `removeEventListener`?

Removemos o plugin `intl-tel-input` que o RD anexa ao campo de telefone. Ele registra **múltiplos listeners** com referências de função que não temos como capturar (estão no closure do plugin). `cloneNode(true)` cria uma cópia do elemento **sem qualquer listener** — é a garantia de que só os nossos handlers vão rodar.

### O MutationObserver não consome muita performance?

Não. O observer é escopado ao parent imediato do input e observa apenas mudanças em `childList` e no atributo `placeholder`. O overhead é desprezível comparado aos benefícios (robustez contra re-injeção do RD).

### Posso usar este script em TypeScript?

Atualmente o projeto é em JavaScript ES5 puro. Uma versão TypeScript está no roadmap — contribuições são bem-vindas.

### Como funciona a sugestão de correção de e-mail?

Usa o algoritmo de **distância de Levenshtein** (mínimo de edições para transformar uma string em outra). Comparamos o domínio digitado com a lista `COMMON_DOMAINS`. Se a distância for ≤ 2, sugerimos o domínio mais próximo.

Exemplo:
- `gmial.com` → distância 2 de `gmail.com` → sugere
- `gmailll.com` → distância 2 de `gmail.com` → sugere
- `minhaempresa.com` → distância alta de tudo → não sugere

## Problemas conhecidos

### Campo de telefone ainda aparece com bandeira do Brasil

O CSS oculta as classes conhecidas. Se uma versão do RD Station usa uma classe diferente, abra uma issue com print do HTML (F12) para adicionarmos o seletor.

### Em alguns templates, o placeholder some

Alguns templates do RD usam um `<label>` flutuante sobre o input (chamado "floating label"). Nesse caso, o placeholder técnico existe mas fica visualmente tampado pelo label. Soluções:

1. Renomear o rótulo do campo no editor para incluir o exemplo: `Celular (WhatsApp) — (DDD) XXXXX-XXXX`
2. Adicionar CSS custom que esconda o label quando o campo está vazio

### Mensagens em inglês aparecem junto com as minhas

Isso acontece se o RD Station tem validação nativa ativa. O script oculta as mensagens do RD via CSS (`[class*="bricks--component-validation-message"]`). Se seu template usa outra classe, adicione o seletor ao CSS.

## Customização

### Como adicionar domínios corporativos à lista de sugestões?

Edite a constante `COMMON_DOMAINS` no script:

```javascript
var COMMON_DOMAINS = [
  'gmail.com', 'hotmail.com', /* ... */,
  'minhaempresa.com.br',    // ← adicione aqui
  'empresa-cliente.com'
];
```

### Como mudar as cores de validação?

Edite o CSS no topo do arquivo:

```css
.rd-valid   { border-color: #22c55e !important; }  /* verde */
.rd-invalid { border-color: #ef4444 !important; }  /* vermelho */
```

Troque os hex pelas cores da sua identidade visual.

### Como mudar as mensagens de erro?

Procure por estes trechos no script e edite os textos:

```javascript
showError(input, 'E-mail inválido. Use o formato nome@dominio.com')
showError(input, 'Celular inválido. Digite 11 dígitos com DDD...')
showError(input, 'Telefone inválido. Inclua DDD...')
showError(input, 'Campo obrigatório.')
```

### Posso bloquear e-mails descartáveis (mailinator, yopmail)?

Não está na versão 1.0, mas é simples adicionar. Crie uma lista e valide:

```javascript
var DISPOSABLE_DOMAINS = ['mailinator.com', 'yopmail.com', 'tempmail.com'];

// Dentro de isValidEmail():
var domain = v.split('@')[1].toLowerCase();
if (DISPOSABLE_DOMAINS.indexOf(domain) !== -1) return false;
```

Ou abra uma [feature request](../../issues) e implementamos oficialmente.

## Performance

### Quanto o script adiciona no tempo de carregamento?

O script bruto tem ~9 KB. Após gzip, fica em torno de 3 KB. Impacto no LCP: desprezível. O script é executado apenas no DOM do formulário, não bloqueia render.

### Há risco de vazamento de memória?

Não. Os MutationObservers são escopados e seguem o ciclo de vida do elemento. Quando a página é descarregada, tudo é coletado pelo garbage collector.

## Compliance e privacidade

### O script coleta algum dado?

Não. Zero telemetria, zero analytics, zero conexões externas. Todo o processamento acontece localmente no navegador do usuário.

### É LGPD-compliant?

Sim. O script não processa, armazena ou envia dados pessoais. Ele apenas valida o formato de dados antes que o próprio RD Station os receba (e é o RD que precisa ter compliance LGPD no armazenamento).
