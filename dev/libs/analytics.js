/*jslint browser:true */
window.ga =
  window.ga ||
  function() {
    (ga.q = ga.q || []).push(arguments);
  };
ga.l = +new Date();
ga('create', 'UA-1931813-9', 'auto');
ga('require', 'cleanUrlTracker');
ga('require', 'eventTracker');
ga('require', 'maxScrollTracker');
ga('require', 'outboundLinkTracker');
ga('require', 'socialWidgetTracker');
ga('require', 'urlChangeTracker');
ga('send', 'pageview');

function registerTag(category, action, label) {
  ga('send', 'event', {
    eventCategory: category,
    eventAction: action,
    eventLabel: label,
  });
}
