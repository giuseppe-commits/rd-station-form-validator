/*!
 * RD Station Form Validator
 * Validação avançada para formulários nativos do RD Station Landing Pages
 *
 * @version 1.0.0
 * @license MIT
 * @author  Modernista Digital Branding
 * @see     https://github.com/SEU-USUARIO/rd-station-form-validator
 */
(function () {
  'use strict';

  // =========================================================================
  // CONFIGURAÇÃO
  // =========================================================================

  /** Domínios comuns usados para sugerir correção de typos */
  var COMMON_DOMAINS = [
    'gmail.com', 'hotmail.com', 'outlook.com', 'outlook.com.br',
    'yahoo.com.br', 'yahoo.com', 'icloud.com', 'live.com',
    'bol.com.br', 'uol.com.br', 'terra.com.br', 'me.com',
    'msn.com', 'globo.com', 'r7.com'
  ];

  /** DDDs brasileiros válidos */
  var VALID_DDD = [
    11, 12, 13, 14, 15, 16, 17, 18, 19,
    21, 22, 24, 27, 28,
    31, 32, 33, 34, 35, 37, 38,
    41, 42, 43, 44, 45, 46, 47, 48, 49,
    51, 53, 54, 55,
    61, 62, 63, 64, 65, 66, 67, 68, 69,
    71, 73, 74, 75, 77, 79,
    81, 82, 83, 84, 85, 86, 87, 88, 89,
    91, 92, 93, 94, 95, 96, 97, 98, 99
  ];

  /** Placeholder exibido no campo de telefone */
  var PHONE_PLACEHOLDER = '(DDD) XXXXX-XXXX';

  // =========================================================================
  // UTILITÁRIOS
  // =========================================================================

  /** Distância de Levenshtein (para sugestão de domínio) */
  function levenshtein(a, b) {
    var m = [], i, j;
    for (i = 0; i <= b.length; i++) m[i] = [i];
    for (j = 0; j <= a.length; j++) m[0][j] = j;
    for (i = 1; i <= b.length; i++) {
      for (j = 1; j <= a.length; j++) {
        m[i][j] = b[i - 1] === a[j - 1]
          ? m[i - 1][j - 1]
          : Math.min(m[i - 1][j - 1] + 1, m[i][j - 1] + 1, m[i - 1][j] + 1);
      }
    }
    return m[b.length][a.length];
  }

  /** Sugere correção de domínio para typos comuns */
  function suggestDomain(email) {
    var parts = email.split('@');
    if (parts.length !== 2) return null;
    var domain = parts[1].toLowerCase();
    if (COMMON_DOMAINS.indexOf(domain) !== -1) return null;
    var best = null, bestDist = 3;
    for (var k = 0; k < COMMON_DOMAINS.length; k++) {
      var d = levenshtein(domain, COMMON_DOMAINS[k]);
      if (d < bestDist) { bestDist = d; best = COMMON_DOMAINS[k]; }
    }
    return best ? parts[0] + '@' + best : null;
  }

  /** Validação de e-mail mais rigorosa que o type="email" */
  function isValidEmail(v) {
    if (!v) return false;
    var re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(v) && v.indexOf('..') === -1 && v.length <= 254;
  }

  /** Extrai apenas dígitos e remove prefixo 55 (código do país Brasil) */
  function cleanPhoneDigits(val) {
    var d = (val || '').replace(/\D/g, '');
    if (d.length > 11 && d.indexOf('55') === 0) d = d.slice(2);
    if ((d.length === 12 || d.length === 13) && d.indexOf('55') === 0) d = d.slice(2);
    return d.slice(0, 11);
  }

  /** Detecta se um input é de celular/WhatsApp (exige 11 dígitos) */
  function isCelularField(input) {
    var name = (input.name || '').toLowerCase();
    var id = (input.id || '').toLowerCase();
    var label = '';
    if (input.id) {
      var l = document.querySelector('label[for="' + input.id + '"]');
      if (l) label = l.textContent.toLowerCase();
    }
    var str = name + ' ' + id + ' ' + label;
    return /celular|whats|mobile/.test(str);
  }

  /** Máscara para celular (força formato 11 dígitos) */
  function maskCelular(v) {
    var d = cleanPhoneDigits(v);
    if (!d) return '';
    if (d.length <= 2) return '(' + d;
    if (d.length <= 7) return '(' + d.slice(0, 2) + ') ' + d.slice(2);
    return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
  }

  /** Máscara genérica para fixo (10) ou celular (11) */
  function maskPhone(v) {
    var d = cleanPhoneDigits(v);
    if (!d) return '';
    if (d.length <= 2) return '(' + d;
    if (d.length <= 6) return '(' + d.slice(0, 2) + ') ' + d.slice(2);
    if (d.length <= 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
    return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
  }

  /** Celular válido: 11 dígitos, DDD válido, inicia com 9 */
  function isValidCelular(v) {
    var d = cleanPhoneDigits(v);
    if (d.length !== 11) return false;
    var ddd = parseInt(d.slice(0, 2), 10);
    if (VALID_DDD.indexOf(ddd) === -1) return false;
    if (d[2] !== '9') return false;
    if (/^(\d)\1+$/.test(d.slice(2))) return false;
    return true;
  }

  /** Telefone genérico válido: fixo (10) ou celular (11) */
  function isValidPhoneGeneric(v) {
    var d = cleanPhoneDigits(v);
    if (d.length < 10 || d.length > 11) return false;
    var ddd = parseInt(d.slice(0, 2), 10);
    if (VALID_DDD.indexOf(ddd) === -1) return false;
    if (d.length === 11 && d[2] !== '9') return false;
    if (d.length === 10 && ['2', '3', '4', '5'].indexOf(d[2]) === -1) return false;
    if (/^(\d)\1+$/.test(d.slice(2))) return false;
    return true;
  }

  // =========================================================================
  // UI — MENSAGENS E ESTADOS VISUAIS
  // =========================================================================

  function clearMsg(input) {
    var p = input.parentNode;
    if (!p) return;
    var msg = p.querySelector('.rd-msg-error, .rd-msg-suggest');
    if (msg) msg.remove();
    input.classList.remove('rd-valid', 'rd-invalid');
  }

  function showError(input, text) {
    clearMsg(input);
    input.classList.add('rd-invalid');
    var el = document.createElement('span');
    el.className = 'rd-msg-error';
    el.textContent = text;
    input.parentNode.appendChild(el);
  }

  function showValid(input) {
    clearMsg(input);
    input.classList.add('rd-valid');
  }

  function showSuggestion(input, suggested) {
    clearMsg(input);
    var el = document.createElement('span');
    el.className = 'rd-msg-suggest';
    el.innerHTML = 'Você quis dizer <u>' + suggested + '</u>? Toque para corrigir.';
    el.addEventListener('click', function () {
      input.value = suggested;
      showValid(input);
    });
    input.parentNode.appendChild(el);
  }

  // =========================================================================
  // NEUTRALIZAÇÃO DO PLUGIN intl-tel-input
  // =========================================================================

  function destroyPhonePlugin(input) {
    try {
      if (window.intlTelInputGlobals && typeof window.intlTelInputGlobals.getInstance === 'function') {
        var iti = window.intlTelInputGlobals.getInstance(input);
        if (iti && typeof iti.destroy === 'function') iti.destroy();
      }
    } catch (e) { /* noop */ }

    var wrapper = input.parentNode;
    if (wrapper && (wrapper.classList.contains('iti') || wrapper.classList.contains('intl-tel-input'))) {
      var grandparent = wrapper.parentNode;
      grandparent.insertBefore(input, wrapper);
      wrapper.remove();
    }

    var clone = input.cloneNode(true);
    clone.value = '';
    input.parentNode.replaceChild(clone, input);
    return clone;
  }

  // =========================================================================
  // VALIDAÇÃO CENTRAL
  // =========================================================================

  /** Retorna true se inválido */
  function validatePhone(input) {
    var v = (input.value || '').trim();
    var required = input.hasAttribute('required') || input.getAttribute('aria-required') === 'true';

    if (!v) {
      if (required) {
        showError(input, 'Campo obrigatório.');
        return true;
      }
      return false;
    }

    var cel = input.dataset.rdCelular === '1';
    var valid = cel ? isValidCelular(v) : isValidPhoneGeneric(v);

    if (!valid) {
      showError(input, cel
        ? 'Celular inválido. Digite 11 dígitos com DDD (ex: (85) 98765-4321).'
        : 'Telefone inválido. Inclua DDD (ex: (85) 98765-4321).');
      return true;
    }
    showValid(input);
    return false;
  }

  /** Retorna true se inválido */
  function validateEmail(input) {
    var v = (input.value || '').trim();
    var required = input.hasAttribute('required') || input.getAttribute('aria-required') === 'true';

    if (!v) {
      if (required) {
        showError(input, 'Campo obrigatório.');
        return true;
      }
      return false;
    }
    if (!isValidEmail(v)) {
      showError(input, 'E-mail inválido. Use o formato nome@dominio.com');
      return true;
    }
    var s = suggestDomain(v);
    if (s) { showSuggestion(input, s); return false; }
    showValid(input);
    return false;
  }

  // =========================================================================
  // ANEXAÇÃO DE HANDLERS
  // =========================================================================

  function attachEmail(input) {
    if (input.dataset.rdAttached === '1') return;
    input.dataset.rdAttached = '1';
    input.setAttribute('inputmode', 'email');
    input.setAttribute('autocomplete', 'email');
    input.setAttribute('autocapitalize', 'off');
    input.setAttribute('spellcheck', 'false');

    input.addEventListener('input', function () {
      input.value = input.value.replace(/\s+/g, '').toLowerCase();
      clearMsg(input);
    });
    input.addEventListener('blur', function () {
      validateEmail(input);
    });
  }

  function attachPhone(inputRef) {
    if (inputRef.dataset.rdAttached === '1') return;

    var input = destroyPhonePlugin(inputRef);
    var isCel = isCelularField(input);

    input.dataset.rdAttached = '1';
    input.dataset.rdCelular = isCel ? '1' : '0';
    input.setAttribute('type', 'tel');
    input.setAttribute('inputmode', 'tel');
    input.setAttribute('autocomplete', 'tel-national');
    input.setAttribute('maxlength', '15');
    input.value = '';

    function forcePlaceholder() {
      if (input.placeholder !== PHONE_PLACEHOLDER) {
        input.setAttribute('placeholder', PHONE_PLACEHOLDER);
        input.placeholder = PHONE_PLACEHOLDER;
      }
    }
    forcePlaceholder();
    setTimeout(forcePlaceholder, 500);
    setTimeout(forcePlaceholder, 1500);
    setTimeout(forcePlaceholder, 3000);

    input.addEventListener('input', function () {
      input.value = isCel ? maskCelular(input.value) : maskPhone(input.value);
      clearMsg(input);
    });

    input.addEventListener('focus', function () {
      if (!input.value) forcePlaceholder();
    });

    input.addEventListener('blur', function () {
      if (!input.value) { forcePlaceholder(); return; }
      validatePhone(input);
    });

    // Observa re-injeção de seletor de país pelo RD (SPA reload)
    var parent = input.parentNode;
    if (parent && window.MutationObserver) {
      var obs = new MutationObserver(function (muts) {
        muts.forEach(function (m) {
          m.addedNodes.forEach(function (n) {
            if (n.nodeType === 1 && (
              n.classList.contains('iti__flag-container') ||
              n.classList.contains('iti') ||
              (n.className && typeof n.className === 'string' && n.className.indexOf('flag') !== -1)
            )) {
              n.remove();
            }
          });
        });
        forcePlaceholder();
      });
      obs.observe(parent, { childList: true, subtree: true });
    }

    // Observa sobrescrita do atributo placeholder
    if (window.MutationObserver) {
      var attrObs = new MutationObserver(forcePlaceholder);
      attrObs.observe(input, { attributes: true, attributeFilter: ['placeholder'] });
    }
  }

  // =========================================================================
  // INICIALIZAÇÃO E VALIDAÇÃO GLOBAL
  // =========================================================================

  function init() {
    var emails = document.querySelectorAll('input[type="email"], input[name="email"]');
    for (var i = 0; i < emails.length; i++) attachEmail(emails[i]);

    var phones = document.querySelectorAll(
      'input[type="tel"], input[name*="phone"], input[name*="telefone"], input[name*="celular"], input[name*="whats"]'
    );
    for (var j = 0; j < phones.length; j++) attachPhone(phones[j]);
  }

  function validateAllInForm(form) {
    var hasError = false;

    var emails = form.querySelectorAll('input[type="email"], input[name="email"]');
    for (var i = 0; i < emails.length; i++) {
      if (validateEmail(emails[i])) hasError = true;
    }

    var phones = form.querySelectorAll(
      'input[type="tel"], input[name*="phone"], input[name*="telefone"], input[name*="celular"], input[name*="whats"]'
    );
    for (var j = 0; j < phones.length; j++) {
      if (validatePhone(phones[j])) hasError = true;
    }
    return hasError;
  }

  function blockIfInvalid(e, form) {
    if (validateAllInForm(form)) {
      e.preventDefault();
      e.stopPropagation();
      if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
      var first = form.querySelector('.rd-invalid');
      if (first) {
        first.focus();
        try { first.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (err) { /* noop */ }
      }
      return true;
    }
    return false;
  }

  // Múltiplas tentativas de init (RD renderiza form de forma assíncrona)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  setTimeout(init, 800);
  setTimeout(init, 2000);
  setTimeout(init, 4000);

  // Intercepta submit tradicional
  document.addEventListener('submit', function (e) {
    var form = e.target;
    if (!form || form.tagName !== 'FORM') return;
    blockIfInvalid(e, form);
  }, true);

  // Intercepta cliques (forms multi-step avançam sem disparar submit)
  document.addEventListener('click', function (e) {
    var t = e.target;
    while (t && t !== document.body) {
      var isBtn = t.tagName === 'BUTTON'
        || (t.tagName === 'INPUT' && (t.type === 'submit' || t.type === 'button'))
        || t.getAttribute('role') === 'button'
        || (t.className && typeof t.className === 'string' && /submit|btn|button/i.test(t.className));
      if (isBtn) break;
      t = t.parentNode;
    }
    if (!t || t === document.body) return;

    var form = t.closest ? t.closest('form') : null;
    if (!form) {
      var anyAttached = document.querySelector('input[data-rd-attached="1"]');
      if (anyAttached) form = anyAttached.closest('form');
    }
    if (!form) return;

    blockIfInvalid(e, form);
  }, true);
})();
