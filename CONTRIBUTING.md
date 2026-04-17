# Contribuindo

Obrigado pelo interesse em contribuir! Este documento descreve o processo para colaborar com o projeto.

## Código de conduta

Seja respeitoso, colaborativo e construtivo. Não toleramos assédio ou comportamento discriminatório de qualquer tipo.

## Como reportar um bug

1. Verifique se o bug já não foi reportado nas [issues](../../issues)
2. Abra uma nova issue usando o template **"Bug Report"**
3. Inclua:
   - Versão do script
   - Navegador e sistema operacional
   - Passos para reproduzir
   - Print do console do navegador (F12 → Console) se houver erros
   - HTML do formulário afetado (Inspecionar Elemento)

## Como sugerir uma feature

1. Abra uma issue usando o template **"Feature Request"**
2. Descreva o problema que a feature resolve, não apenas a solução
3. Se possível, dê exemplos de uso e contexto de negócio

## Workflow de Pull Request

1. Faça um fork do repositório
2. Crie uma branch a partir de `main`:
   ```bash
   git checkout -b feature/nome-descritivo
   # ou
   git checkout -b fix/descricao-do-bug
   ```
3. Faça suas mudanças seguindo o estilo de código existente
4. Atualize a documentação se necessário (README, CHANGELOG)
5. Regenere o arquivo `dist/rd-form-validator.html` se mudou `src/`
6. Commit com mensagens convencionais:
   ```
   feat: adiciona validação de CPF
   fix: corrige máscara em input sem DDD
   docs: atualiza seção de troubleshooting
   style: reformata código do módulo de email
   refactor: extrai levenshtein para util separado
   test: adiciona testes para validação de celular
   chore: atualiza licença
   ```
7. Push da branch e abra um Pull Request

## Estilo de código

- **JavaScript:** ES5 (vanilla, sem transpilação) — o script precisa rodar em navegadores antigos sem build step
- **Indentação:** 2 espaços
- **Aspas:** simples (`'`)
- **Ponto-e-vírgula:** obrigatório
- **Strict mode:** obrigatório em todas IIFEs
- **Comentários:** em português, explicando o *porquê*, não o *o quê*
- **Nomes:** camelCase para variáveis/funções, UPPER_SNAKE_CASE para constantes

## Processo de build

O repositório tem uma estrutura simples sem bundler:

```
src/rd-form-validator.js    → arquivo fonte (edite aqui)
src/rd-form-validator.css   → estilos fonte (edite aqui)
dist/rd-form-validator.html → versão final combinada (regenerar após mudanças)
```

Após editar qualquer arquivo em `src/`, o `dist/rd-form-validator.html` deve ser regenerado manualmente combinando CSS + JS no mesmo arquivo com as tags `<style>` e `<script>`.

## Testes manuais

Antes de abrir PR, teste em:

- [ ] Chrome desktop (última versão)
- [ ] Safari iOS
- [ ] Chrome Android
- [ ] Firefox desktop

Cenários obrigatórios:

- [ ] Formulário com campo "Celular (WhatsApp)"
- [ ] Formulário com campo "Telefone" genérico
- [ ] Formulário multi-step (botão "Avançar")
- [ ] E-mail com typo (`joao@gmial.com` deve sugerir correção)
- [ ] Campo vazio com `required` deve bloquear envio
- [ ] Número com 10 dígitos em campo celular deve ser rejeitado
- [ ] Plugin `intl-tel-input` deve ser completamente removido

## Dúvidas

Abra uma [Discussion](../../discussions) se tiver dúvidas sobre como contribuir.
