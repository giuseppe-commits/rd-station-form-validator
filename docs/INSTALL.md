# Guia de Instalação

Passo a passo completo para implementar o RD Station Form Validator na sua landing page.

## Pré-requisitos

- Conta ativa no **RD Station Marketing**
- Acesso a pelo menos uma **Landing Page** no RD Station
- Navegador desktop para editar a LP

## Passo 1 — Obtenha o código

### Opção A: Download direto

1. Acesse [`dist/rd-form-validator.html`](../dist/rd-form-validator.html) no repositório
2. Clique no botão **"Raw"** no GitHub
3. Selecione todo o conteúdo (Ctrl+A / Cmd+A) e copie (Ctrl+C / Cmd+C)

### Opção B: Clone do repositório

```bash
git clone https://github.com/SEU-USUARIO/rd-station-form-validator.git
cd rd-station-form-validator
cat dist/rd-form-validator.html
```

## Passo 2 — Abra o editor da landing page

1. Acesse [app.rdstation.com.br](https://app.rdstation.com.br)
2. No menu lateral, vá em **Conversão > Landing Pages**
3. Clique na landing page que deseja editar
4. Clique em **"Editar"**

## Passo 3 — Adicione o código

Você tem duas formas de adicionar. Escolha uma:

### Forma 1 — Via widget de código (recomendado)

Esta forma é ideal quando você quer o código **apenas nesta LP específica**.

1. No painel esquerdo do editor, localize o componente **"Código"**
2. Arraste o componente para qualquer área da página (sugestão: rodapé, onde não aparece)
3. Clique no widget recém-adicionado
4. No painel direito, clique em **"Editar código"** (ou similar)
5. Cole o código copiado no Passo 1
6. Clique em **"Salvar"** ou fora da caixa
7. Clique em **"Publicar"** no canto superior direito

### Forma 2 — Via Scripts da LP

Esta forma mantém o código separado do visual. Ideal para quem quer manter organização.

1. No editor da LP, clique no ícone de **engrenagem** (configurações) no canto superior
2. Localize a aba ou seção **"Scripts"** (ou "Código personalizado")
3. Cole o código copiado no campo **"Antes do fechamento da tag </body>"**
4. Clique em **"Salvar"**
5. Publique a LP

## Passo 4 — Configuração do formulário

Algumas configurações no editor do formulário melhoram o funcionamento:

### Campo de telefone

1. Clique no campo de telefone/celular do formulário
2. No painel direito, procure **"Tipo de campo"**
3. **Se aparecer a opção**, troque de **"Telefone internacional"** para **"Telefone"** comum ou **"Texto"**
4. Marque o campo como **"Obrigatório"** se quiser bloqueio total de avanço
5. (Opcional) Ative **"Máscara obrigatória"** — funciona em conjunto com o script

### Campo de e-mail

1. Clique no campo de e-mail
2. Confirme que o **"Tipo"** está como **"E-mail"**
3. Marque **"Obrigatório"**

## Passo 5 — Teste no preview

Antes de publicar, sempre teste no preview:

1. No editor, clique em **"Visualizar"** ou **"Preview"**
2. Abra o link do preview no **celular** (a experiência mobile é a mais crítica)
3. Execute os cenários de teste abaixo

### Checklist de testes

- [ ] Campo de telefone abre **vazio** (sem bandeira ou `+55`)
- [ ] Placeholder `(DDD) XXXXX-XXXX` aparece no campo vazio
- [ ] Ao digitar `85988452805`, é formatado para `(85) 98845-2805` automaticamente
- [ ] Apagar com backspace funciona normalmente
- [ ] Digitar só 10 dígitos em campo celular bloqueia o envio
- [ ] Digitar `joao@gmial.com` mostra sugestão "Você quis dizer joao@gmail.com?"
- [ ] Clicar na sugestão corrige o e-mail automaticamente
- [ ] Botão de envio (ou avanço de etapa) bloqueia quando há erro
- [ ] Scroll e foco vão para o primeiro campo inválido

## Passo 6 — Publicar

Tudo funcionando? Clique em **"Publicar"** no editor do RD Station.

**Importante:** sempre publique a LP após qualquer alteração no widget de código. Mudanças salvas mas não publicadas não aparecem para os visitantes.

## Reverter/remover

Para desativar o validator:

- **Widget de código:** clique no widget e delete
- **Scripts:** abra as configurações da LP e limpe o campo de scripts

Republique a LP após remover.

## Quando não funciona

Se após seguir todos os passos algo não funciona, consulte a seção [Troubleshooting do README](../README.md#-troubleshooting) ou abra uma [issue](../../issues).

Inclua sempre:
- Print da tela do problema
- URL da landing page (se pública)
- Print do HTML do formulário (F12 → Inspecionar)
- Print do console do navegador (F12 → Console)
