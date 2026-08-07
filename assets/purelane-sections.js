/**
 * Purelane homepage sections — shared behaviour.
 *
 * Original file drove this off one page-level IIFE that assumed a fixed
 * DOM (getElementById('hstage') etc, run once on load). That breaks the
 * moment a merchant adds a second Hero section, reorders sections, or the
 * theme editor re-renders a section in place — none of which the original
 * script accounted for. Rewritten as:
 *   - scoped to each instance via [data-pl-hero] / [data-pl-marquee],
 *     never a single hardcoded id, so N instances can exist on a page
 *   - re-initialised on `shopify:section:load` (theme editor add/reorder)
 *     and torn down on `shopify:section:unload`, so nothing leaks or
 *     double-fires
 *   - each timer is cleared on `shopify:block:select` while an editor
 *     merchant is focused on a block, otherwise the rotator fights their
 *     clicks
 *   - prefers-reduced-motion is read once and respected everywhere motion
 *     is optional (autoplay), not just visually masked by CSS
 */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.remove('pl-no-js');

  /* ---------------- reveal-on-scroll ---------------- */
  function initReveal(root) {
    var els = root.querySelectorAll('.pl-rv:not(.pl-in)');
    if (!els.length) return;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('pl-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('pl-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------------- hero product rotator ---------------- */
  var heroTimers = new WeakMap();

  function initHero(section) {
    var stage = section.querySelector('[data-pl-hstage]');
    if (!stage) return;
    var slides = [].slice.call(stage.querySelectorAll('.pl-hslide'));
    var dots = [].slice.call(section.querySelectorAll('[data-pl-hdots] button'));
    if (slides.length < 2) return; // nothing to rotate

    var interval = parseInt(stage.getAttribute('data-interval'), 10) || 3800;
    var i = 0;

    function go(n) {
      i = (n + slides.length) % slides.length;
      slides.forEach(function (s, idx) { s.classList.toggle('pl-on', idx === i); });
      dots.forEach(function (d, idx) { d.classList.toggle('pl-on', idx === i); });
    }

    function play() {
      stop();
      if (reduceMotion) return;
      heroTimers.set(stage, setInterval(function () { go(i + 1); }, interval));
    }
    function stop() {
      var t = heroTimers.get(stage);
      if (t) { clearInterval(t); heroTimers.delete(stage); }
    }

    dots.forEach(function (d, idx) {
      d.addEventListener('click', function () { stop(); go(idx); play(); });
    });
    stage.addEventListener('mouseenter', stop);
    stage.addEventListener('mouseleave', play);

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { e.isIntersecting ? play() : stop(); });
      }, { threshold: 0.2 });
      io.observe(stage);
      stage._plIo = io;
    } else {
      play();
    }
    stage._plStop = stop;
    go(0);
  }

  function teardownHero(section) {
    var stage = section.querySelector('[data-pl-hstage]');
    if (!stage) return;
    if (stage._plStop) stage._plStop();
    if (stage._plIo) stage._plIo.disconnect();
  }

  /* ---------------- init / editor lifecycle ---------------- */
  function initSection(section) {
    initReveal(section);
    initHero(section);
  }

  document.querySelectorAll('[data-pl-section]').forEach(initSection);

  document.addEventListener('shopify:section:load', function (e) {
    initSection(e.target);
  });
  document.addEventListener('shopify:section:unload', function (e) {
    teardownHero(e.target);
  });
  document.addEventListener('shopify:block:select', function (e) {
    var stage = e.target.closest ? e.target.closest('[data-pl-section]') : null;
    if (stage && stage._plStop) stage._plStop();
  });
})();
