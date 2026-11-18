/*
 * Meta Pixel: helper central e eventos de clique.
 * O código base do pixel (fbq init + PageView) fica no <head> de cada página;
 * este arquivo só dispara eventos e nunca altera o comportamento dos links.
 *
 * Como instrumentar um elemento novo (link ou botão):
 *   <a href="..." data-fb-event="Lead" data-fb-name="Destino do botão">
 *   <a href="..." data-fb-event="FindLocation" data-fb-name="Nome do mapa">
 * Para um iframe de mapa, coloque os mesmos atributos no elemento que o envolve.
 */
(function () {
  'use strict';

  var CATEGORIAS = { Lead: 'Social / Contato', FindLocation: 'Localizacao' };

  // Envia o evento só se o pixel carregou (bloqueador de anúncios, rede lenta etc. não quebram a página)
  function track(evento, params) {
    if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;
    try { window.fbq('track', evento, params); } catch (e) { /* nunca interrompe o clique */ }
  }

  function trackElemento(el) {
    var evento = el.getAttribute('data-fb-event');
    if (!CATEGORIAS[evento]) return;
    track(evento, {
      content_name: el.getAttribute('data-fb-name') || el.getAttribute('aria-label') || el.textContent.trim(),
      content_category: CATEGORIAS[evento]
    });
  }

  window.metaPixel = { track: track };

  if (typeof document === 'undefined') return;

  // Um único ouvinte para todos os links/botões marcados com data-fb-event.
  // Não chama preventDefault: href, target="_blank" e navegação seguem normais.
  function aoClicar(e) {
    if (e.type === 'auxclick' && e.button !== 1) return; // auxclick: só o clique do meio (abrir em nova aba)
    var el = e.target && e.target.closest && e.target.closest('a[data-fb-event], button[data-fb-event]');
    if (el) trackElemento(el);
  }
  document.addEventListener('click', aoClicar);
  document.addEventListener('auxclick', aoClicar);

  // Cliques dentro de um iframe (Google Maps) não chegam à página. Quando o foco
  // passa para o iframe, a janela perde o foco: é esse o sinal de interação.
  var mapasRegistrados = [];
  window.addEventListener('blur', function () {
    setTimeout(function () {
      var ativo = document.activeElement;
      if (!ativo || ativo.tagName !== 'IFRAME') return;
      var alvo = ativo.closest('[data-fb-event]');
      if (!alvo || mapasRegistrados.indexOf(alvo) !== -1) return;
      mapasRegistrados.push(alvo); // uma vez por visita, para não inflar o evento
      trackElemento(alvo);
    }, 0);
  });
})();
